require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('help', (ctx) => {
  const helpMessage = `
  *Snmoyano Frases Bot*
  /start - Iniciar Bot
  `
  bot.telegram.sendMessage(ctx.from.id, helpMessage, {
    parse_mode: 'Markdown',
  })
})
bot.command('start', (ctx) => {
  sendStartMessage(ctx)
})
function sendStartMessage(ctx) {
  const startMessage = 'Bienvenid@,este bot te da distintas Frases'
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Quiero Una Frase',
            callback_data: 'quote',
          },
        ],
        [
          {
            text: 'Nuestro Web Site',
            url: 'https://portfolio-snmoyano.netlify.app',
          },
        ],
        [{ text: 'Creditos', callback_data: 'credits' }],
      ],
    },
  })
}
//Actions
bot.action('credits', (ctx) => {
  ctx.answerCbQuery() //saca spinner al boton
  ctx.reply('Bot Creado Por Sergio Nicolas Moyano')
})
bot.action('quote', (ctx) => {
  ctx.answerCbQuery() //saca spinner al boton
  const menuMessage = '¿Que tipo de frase Quieres?'
  bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
    reply_markup: {
      keyboard: [
        [
          { text: 'Frases de Amistad' },
          { text: 'Chistes Cortos' },
          { text: 'Frases de Informaticos' },
        ],
        [{ text: 'Salir' }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  })
})

//Consumo de APi
async function fetchQuote(type) {
  const res = await axios.get(`http://localhost:3000/quotes/${type}`)
  return res.data.quote
}
bot.hears('Frases de Amistad', async (ctx) => {
  const quote = await fetchQuote('amistad')
  ctx.reply(quote)
})
bot.hears('Chistes Cortos', async (ctx) => {
  const quote = await fetchQuote('graciosas')
  ctx.reply(quote)
})
bot.hears('Frases de Informaticos', async (ctx) => {
  const quote = await fetchQuote('informaticos')
  ctx.reply(quote)
})
bot.hears('Salir', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, 'Hasta Luego!!', {
    reply_markup: {
      remove_keyboard: true,
    },
  })
})
bot.launch()
