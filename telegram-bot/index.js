const express = require('express')
const bodyParser = require('body-parser')
const async = require('async')
const assert = require('assert')

const telegram = require('./telegram')
const conf = require('./conf')

const app = express()

app.use(bodyParser.json())
app.use(telegram.middleware)

app.get('/send', (req, res) => {
    if (!req.query.msg)
        return res.sendStatus(400)

    telegram.send(req.query.msg)
    return res.sendStatus(200)
})

app.post('/send', (req, res) => {
    if (!req.body.msg)
        return res.sendStatus(400)

    telegram.send(req.body.msg)
    return res.sendStatus(200)
})

app.use((_, res) => {
    res.status(400).send('Sorry, bad request')
})

async.waterfall([
    (cb) => telegram.init(cb),
    (cb) => app.listen(conf.PORT, cb)
], (err) => {
    assert.equal(null, err, err)
    console.log('Express server is listening on', conf.PORT)
})