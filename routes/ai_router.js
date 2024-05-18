const express = require('express')
const { OpenAI } = require("openai")
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function generateRecommendations(prompt) {
    console.log(prompt)
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt}],
      model: 'gpt-3.5-turbo',
      max_tokens: 2048
    })
    // console.log(chatCompletion.choices[0].message.content)
    return chatCompletion.choices[0].message.content
}

const router = express.Router()
router.post('/api/chat', async function (req, res) {
    try {
      const recommendations = await generateRecommendations(req.body.prompt)
      res.status(200).send(recommendations)  
    } catch (error) {
      console.log(error)
      res.status(500).send('Sorry, there was an error while generating the response')
    }
})

module.exports = router