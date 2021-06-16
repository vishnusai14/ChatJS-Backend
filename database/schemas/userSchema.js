const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

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
    },
    image : {
        type : String
    },
    imageId : {
        type : String
    },
    expoToken : {
        type : String
    }

})

module.exports = userSchema