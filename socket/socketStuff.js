const socket = require('socket.io')

const socketConnection = (server) => {
    const io = socket(server)

    io.on('connect', socket => {
        socket.on('msg', (msgData) => {
            io.to(msgData.socketId).emit('msg', { data : msgData })
        })
    })
    
}

module.exports = {
    connect: socketConnection
}