const express = require('express')
const User = require('../actions/db/userModelConfig')
const token = require('../actions/db/users/generateRandomToken')
const dbConfig = require('../actions/db/dbConfig')
const chat = require('../actions/openai/chat')
const router = express.Router()

router.post('/users/', async (req, res) => {
    try {
            console.log('sign up')
            const new_user = new User({
                'email': req.body.email,
                'password': req.body.password,
                'token': token(),
                'pantry_items': req.body.pantry_items,
                'shopping_list': req.body.shopping_list
            })
            new_user.save()
            res.status(200).send(new_user.token)
        } catch (error) {
        console.error(error)
        res.status(500).send('There was an error creating the account')
    }
    
})

router.get('/users/:token', async (req, res) => {
    try {
        const acc = await User.findOne({token: req.params.token})
        if (acc == null) {
            res.status(404).send('This account does not exist')
        } else {
            res.status(200).send(acc)
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('There was an error getting the account')
    }
})

router.post('/users/getByEmail/:email', async (req, res) => {
    try {
        const acc = await User.findOne({email: req.params.email})
        if (acc == null) {
            res.status(404).send('This account does not exist')
        } else {
            if (acc.password == req.body.password) {
                res.status(200).send(acc)
            } else {
                res.status(300).send('Incorrect password')
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('There was an error getting the account')
    }
})

router.put('/users/:token', async (req, res) =>  {
    try {
            await User.updateOne({ token: req.params.token }, 
                {
                    $set: {
                        pantry_items: req.body.pantry_items,
                        shopping_list: req.body.shopping_list
                    }
                }   
            )
            res.status(200).send('Successfully updated account')
        } catch (error) {
        console.error(error)
        res.status(500).send('There was an error connecting to the account')
    }
})

router.post('/chat', async (req, res) => {
    try {
      const recommendations = await chat(req.body.prompt)
      res.status(200).send(recommendations.choices[0].message.content)  
    } catch (error) {
      console.log(error)
      res.status(500).send('Sorry, there was an error while generating the response')
    }
})


module.exports = router