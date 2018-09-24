const MongoClient = require('mongodb').MongoClient
const async = require('async')
const conf = require('./conf')

const options = {
    useNewUrlParser: true
}

function get_id(CB) {
    async.waterfall([
        (cb) => MongoClient.connect(conf.MONGODB_URL, options, cb),
        (client, cb) => {
            client.db('telegram').collection('data').findOne({
                    type: 'main_chat'
                },
                (err, res) => {
                    client.close()
                    cb(err, res)
                }
            )
        }
    ], CB)
}

function set_id(new_id, CB) {
    async.waterfall([
        (cb) => MongoClient.connect(conf.MONGODB_URL, options, cb),
        (client, cb) => {
            client.db('telegram').collection('data').updateOne({
                    type: 'main_chat'
                }, {
                    $set: {
                        chat_id: new_id
                    }
                }, {
                    upsert: true
                },
                (err, res) => {
                    client.close()
                    cb(err, res)
                }
            )
        }
    ], CB)
}


module.exports = {
    get_id: get_id,
    set_id: set_id
}