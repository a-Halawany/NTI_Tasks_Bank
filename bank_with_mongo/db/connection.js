const { MongoClient } = require('mongodb')

// cb(err,client,db)

let dbConnection = (cb = (err, client, db) => '') => {
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) return cb(err, false, false)
        let db = client.db('Bank')
        cb(false, client, db)
    })
}


module.exports = dbConnection