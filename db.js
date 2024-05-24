const { MongoClient } = require('mongodb')
let uri = 'mongodb+srv://sahib1:quransahib@cluster0.hwjjpkt.mongodb.net/tier3?retryWrites=true&w=majority&appName=Cluster0'
let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}