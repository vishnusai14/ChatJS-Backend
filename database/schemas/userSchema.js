const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    socketId: {
        type : String
    },
    userId: {
        type : String
    },
    userName: {
        type : String
    },
    email: {
        type : String
    },
    password: {
        type : String
    }

})

module.exports = userSchema