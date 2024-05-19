require('dotenv').config()
const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const ai_router = require('./routes/ai_router')
const user_router = require('./routes/users')
const neurelo = require('neurelo-sdk')
const port = 3000;

app.use(express.json())
app.use(cors())
app.use(ai_router)
app.use(user_router)

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
})

async function dbConnect() {
    mongoose.connect(process.env.MONGODB_KEY).then(() => {
        console.log("Database successfully connected")
    }).catch((error) => {
        console.error(error)
    })
}

dbConnect()