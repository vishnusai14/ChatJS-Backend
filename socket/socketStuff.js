require('dotenv').config()
const socket = require('socket.io')
const socketFunction = require('../database/functions/socketFunctions')
const messageFunction = require('../database/functions/messageToSendFunctions')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET


const socketConnection = (server) => {
    const io = socket(server , {
        cors : {
            origin : 'http://localhost:1331',
            credentials: true
        }
    })
    io.on('connect', socket => {
        console.log("Socket Has Been Connected" , socket.id)
        socket.on('newUser' , (data) => {
            console.log('New User ')
            try {
                const user = jwt.verify(data.token, SECRET)
                if(user) {
                    let userData = {
                        email : user.email,
                        id : socket.id
                    }
                    socketFunction.createOrModifySocketId(userData)
                }
            }catch(err) {
                console.log(err)
            }    
        })
        socket.on('msg', (msgData) => {
            console.log("Message Event Fired Up")
            socketFunction.sendOrStoreMessage(msgData, io)
            
        })

        socket.on('oldMessage', (userData) => {

            let messages = messageFunction.retriveMessage(userData)
            socket.emit('sendOldMessage', messages)

        })

        socket.on('disconnecting', (userData) => {
            socketFunction.userDisconnects(socket.id)
        })
    })
    
}

module.exports = {
    connect: socketConnection
}