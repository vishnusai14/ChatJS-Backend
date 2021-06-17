const mongoose = require('mongoose')
const userSchema = require('../database/schemas/userSchema')
const socketSchema = require('../database/schemas/socketSchema')
const messageToSendSchema = require('../database/schemas/messageToSendSchema')
const userFriendSchema = require('../database/schemas/userFriendSchema')

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
const socketModel = mongoose.model('Socket' , socketSchema)
const messageModel = mongoose.model('Message', messageToSendSchema)
const userFriendModel = mongoose.model('Friend', userFriendSchema)
module.exports = {
    connect: connect,
    user: user,
    socketModel: socketModel,
    messageModel : messageModel,
    userFriendModel : userFriendModel
}