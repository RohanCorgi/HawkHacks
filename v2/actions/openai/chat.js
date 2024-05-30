const openai = require('./configuration')
module.exports = async function chat(prompt) {
    console.log(prompt)
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt}],
      model: 'gpt-3.5-turbo',
      max_tokens: 2048
    })
    // console.log(chatCompletion.choices[0].message.content)
    return chatCompletion
}