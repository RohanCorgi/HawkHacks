require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_KEY).then(() => {
    console.log("Database successfully connected")
}).catch((error) => {
    console.error(error)
})
const connection = mongoose.connection
module.exports = connection