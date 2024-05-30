const express = require('express')
const path = require('path')
const router = express.Router()
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'))
})

router.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'))
})

router.get("/login-signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, '../app/login-signup.html'))
})

router.get("/chatbot.html", (req, res) => {
    res.sendFile(path.join(__dirname, '../app/chatbot.html'))
})

router.get('/shopping_list.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/shopping_list.html'))
})

router.get('/assets/:type/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, `../app/assets/${req.params.type}/${req.params.filename}`))
})

module.exports = router