require('dotenv').config()
const path = require('path')
const express = require('express')
const express_app = express()
const port = 8080
const app_router = require('./routes/app')
const api_router = require('./routes/api')
express_app.use(express.json())
express_app.use('/app', app_router)
express_app.use('/api', api_router)

express_app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})