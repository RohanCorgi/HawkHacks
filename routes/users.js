const express = require("express");
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
        const new_user = new User({
            email: req.body.email,
            password: req.body.password,
            token: token(),
            items: req.body.items
        })
        new_user.save()
        res.status(200).send(new_user)
    } catch (error) {
        console.error(error)
        res.status(500).send('There was an error creating the account')
    }
    
})

router.get('/users/:token', async (req, res) => {
    try {
        const acc = await User.find({token: req.params.token})
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