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

module.exports = mongoose.model('users', UserSchema)
