const express = require("express");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String,
    pantry_items: [{
        name: String,
        expiry: Date,
        quantity: Number
    }],
    shopping_list: [{
        name: String,
        quantity: Number
    }]
})

const User = mongoose.model('users', UserSchema)

function rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

function token() {
    return rand() + "-" + rand(); // to make it longer
};

const router = express.Router()

router.post('/api/users/', async (req, res) => {
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

router.get('/api/users/:token', async (req, res) => {
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

router.post('/api/users/getByEmail/:email', async (req, res) => {
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

router.put('/api/users/:token', async (req, res) =>  {
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

module.exports = router