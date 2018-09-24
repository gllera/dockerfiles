const TelegramBot = require('node-telegram-bot-api')
const db = require('./mongodb')
const async = require('async')
const conf = require('./conf')

const webhook_path = '/telegram/' + conf.TELEGRAM_TOKEN
let chat_id, bot

function middleware(req, res, next) {
    if (req.originalUrl == webhook_path) {
        bot.processUpdate(req.body)
        res.sendStatus(200)
    } else {
        next()
    }
}

function OnStart(msg) {
    if (!chat_id || chat_id != msg.chat.id)
        bot.sendMessage(msg.chat.id, "Please, confirn you ID on /id <password>")
    else
        bot.sendMessage(msg.chat.id, "Nice to see you again...")
}

function OnId(msg, match) {
    if (match[1] != conf.CHAT_PASSWORD) {
        bot.sendMessage(msg.chat.id, "You shall not pass!!")
    } else {
        db.set_id(msg.chat.id, (err) => {
            if (err)
                return bot.sendMessage(msg.chat.id, "Error on server: \n" + err)

            chat_id = msg.chat.id
            bot.sendMessage(msg.chat.id, "Identified successfully")
        })
    }
}

function OnEcho(msg, match) {
    bot.sendMessage(msg.chat.id, match[1])
}

function init(CB) {
    async.waterfall([
        cb => db.get_id(cb)
    ], (err, res) => {
        if (res)
            chat_id = res.chat_id

        if (!err) {
            bot = new TelegramBot(conf.TELEGRAM_TOKEN)
            bot.setWebHook(conf.WEBHOOK_ROOT + webhook_path)
            bot.onText(/\/start/, OnStart)
            bot.onText(/\/id (.+)/, OnId)
            bot.onText(/\/echo (.+)/, OnEcho)
        }

        CB(err)
    })
}

function send(msg) {
    if (chat_id)
        bot.sendMessage(chat_id, msg)
}

module.exports = {
    init: init,
    send: send,
    middleware: middleware
}