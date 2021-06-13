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
        console.log(socket.id)
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
            socketFunction.sendOrStoreMessage(msgData, io)
            
        })

        socket.on('oldMessage', (userData) => {

            let messages = messageFunction.retriveMessage(userData)
            socket.emit('sendOldMessage', messages)

        })

        // socket.on('disconnecting', (userData) => {
        //     socketFunction.userDisconnects(userData)
        // })
    })
    
}

module.exports = {
    connect: socketConnection
}