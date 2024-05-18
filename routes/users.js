const mongodb = require("mongoose");

userAccount = new mongodb.Schema({
    email: String,
    password: String,
    items: [{
        name: String,
        expiry: Date,
        quantity: Number
    }]
})