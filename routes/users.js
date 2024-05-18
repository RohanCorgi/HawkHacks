const express = require("express");
const mongodb = require("mongoose");

const userAccount = new mongodb.Schema({
    email: String,
    password: String,
    items: [{
        name: String,
        expiry: Date,
        quantity: Number
    }]
})

