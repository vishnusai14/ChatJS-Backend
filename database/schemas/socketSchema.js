const mongoose = require('mongoose')

const socketSchema = new mongoose.Schema({

    clientEmail: {
        type : String
    },
    socketId: {
        type : String
    }

})

module.exports = socketSchema