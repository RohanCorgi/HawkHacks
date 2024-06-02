const express = require('express')
const User = require('../actions/db/userModelConfig')
const token = require('../actions/db/users/generateRandomToken')
const { encryptPassword, comparePassword } = require('../actions/db/users/hashPassword')
const dbConfig = require('../actions/db/dbConfig')
const chat = require('../actions/openai/chat')
const router = express.Router()

router.post('/users/', async (req, res) => {
    try {
            console.log('sign up')
            const user = await User.findOne({ email: req.body.email })
            if (user) {
                res.status(409).send({
                    content: null,
                    message: 'A user with this email already exists'
                })
            } else {
                const hashedPassword = await encryptPassword(req.body.password)
                console.log(hashedPassword)
                if (hashedPassword) {
                    const new_user = new User({
                        'email': req.body.email,
                        'password': hashedPassword,
                        'token': token(),
                        'pantry_items': req.body.pantry_items,
                        'shopping_list': req.body.shopping_list
                    })
                    new_user.save()
                    res.status(200).send({
                        content: new_user,
                        message: 'Successful'
                    })
                } else {
                    res.status(500).send({
                        content: null,
                        message: 'There was an error creating the account'
                    })
                }
            }
        } catch (error) {
        console.error(error)
        res.status(500).send({
            content: null,
            message: 'There was an error creating the account'
        })
    }
    
})

router.get('/users/:token', async (req, res) => {
    try {
        const acc = await User.findOne({token: req.params.token})
        if (acc == null) {
            res.status(404).send({
                content: null,
                message: 'Unable to find user with this token'
            })
        } else {
            res.status(200).send({
                content: {
                    pantry_items: acc.pantry_items,
                    shopping_list: acc.shopping_list,
                    email: acc.email
                },
                message: 'Successful'
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({
            content: null,
            message: 'There was an error getting the account'
        })
    }
})

router.post('/users/getByEmail/:email', async (req, res) => {
    try {
        console.log('login request sent')
        const acc = await User.findOne({email: req.params.email})
        if (acc == null) {
            res.status(404).send({
                content: null,
                message: 'This account does not exist'
            })
        } else {
            const password_match = await comparePassword(req.body.password, acc.password)
            console.log(password_match)
            if (password_match == true) {
                // await User.updateOne({email: req.params.email}, {$set:{token:token()}})
                res.status(200).send({
                    content: acc,
                    message: 'Successful'
                })
            } else {
                res.status(300).send({
                    content: null,
                    message: 'Incorrect password'
                })
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({
            content: null,
            message: 'There was an error getting the account'
        })
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
            res.status(200).send({
                content: null,
                message: 'Successful'
            })
        } catch (error) {
        console.error(error)
        res.status(500).send({
            content: null,
            message: 'There was an error updating the account'
        })
    }
})

router.post('/chat', async (req, res) => {
    try {
      const chatCompletion = await chat(req.body.prompt)
      res.status(200).send({
            content: chatCompletion,
            message: 'Successful'
        })  
    } catch (error) {
      console.log(error)
      res.status(500).send({
            content: null,
            message: 'There was an error with the chatbot'
        })
    }
})


module.exports = router