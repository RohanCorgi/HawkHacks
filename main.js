require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const ai_router = require('./routes/ai_router')
const port = 3000;

app.use(express.json())
app.use(cors)
app.use(ai_router)

app.listen(`http://localhost:${port}/pantryapp`, () => {
    console.log(`App listening on port ${port}!`);
})