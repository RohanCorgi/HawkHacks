const express = require("express");
const { UsersApiService } = require('neurelo-sdk')
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String,
    items: [{
        name: String,
        expiry: Date,
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

router.post('/users', async (req, res) => {
    try {
        UsersApiService.createOneUsers({
            email: req.body.email,
            password: req.body.password,
            token: token(),
            items: req.body.items
        })
        res.status(200).send('Successfully created user')
    } catch (error) {
        console.error(error)
        res.status(500).send('There was an error creating the account')
    }
    
})

router.get('/users/:token', async (req, res) => {
    try {
        const acc = await UsersApiService.findUsers({
            'token': req.params.token
        })
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

// router.put('/users/:token', async (req, res) => {
//     try {
//         const acc = await UsersApiService.updateUsers({'token': req.params.token}, {})
//     } catch (error) {
//         console.error(error)
//         res.status(500).send('There was an error updating your account')
//     }
// })

module.exports = router