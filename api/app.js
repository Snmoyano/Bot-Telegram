const express = require('express')
const app = express()
const PORT = 3000
const quotes = require('./quotes.json')

app.get('/quotes/:type', (req, res) => {
  const type = req.params.type
  if (!Object.keys(quotes).includes(type)) {
    res.json('Not found')
  }
  const selectQuotes = quotes[type]
  const index = Math.ceil(Math.random() * (selectQuotes.length - 1 - 0) + 0)
  res.json({
    quote: selectQuotes[index],
  })
})

app.listen(PORT, () => {
  console.log('Funcionando puerto ' + PORT)
})
