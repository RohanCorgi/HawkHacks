require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const ai_router = require('./routes/ai_router')
const port = 3000;

app.use(express.json())
app.use(cors)
app.use(ai_router)

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
})

async function dbConnect() {
    mongoose.connect(process.env.MONGODB_KEY).then(() => {
        console.log("Database successfully connected")
    }).catch((error) => {
        console.error(error)
    })
    connection = mongoose.connection
    return connection
}

var mongoose_connection = dbConnect()
console.log(mongoose_connection)