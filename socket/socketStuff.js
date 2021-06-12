const socket = require('socket.io')
const socketFunction = require('../database/functions/socketFunctions')
const messageFunction = require('../database/functions/messageToSendFunctions')

const socketConnection = (server) => {
    const io = socket(server)
    io.on('connect', socket => {
        socket.on('newUser' , (newUserData) => {
            socketFunction.createOrModifySocketId(newUserData)       
        })
        socket.on('msg', (msgData) => {
            socketFunction.sendOrStoreMessage(msgData, io)
            
        })

        socket.on('oldMessage', (userData) => {

            let messages = messageFunction.retriveMessage(userData)
            socket.emit('sendOldMessage', messages)

        })

        socket.on('disconnecting', (userData) => {
            socketFunction.userDisconnects(userData)
        })
    })
    
}

module.exports = {
    connect: socketConnection
}