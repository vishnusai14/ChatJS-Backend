const mongoose = require('mongoose')
const userSchema = require('../database/schemas/userSchema')

const connect = (uri) => {
    mongoose.connect(uri, { useNewUrlParser : true, useUnifiedTopology : true })
        .then(() => {
            console.log("Database Connected")
        })
        .catch((err) => {
             console.log(err)
        })
}

const user = mongoose.model('User', userSchema)

module.exports = {
    connect: connect,
    user: user
}