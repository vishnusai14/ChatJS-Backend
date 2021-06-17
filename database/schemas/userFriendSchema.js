const mongoose = require('mongoose')

const userFriendSchema = new mongoose.Schema({
    email : {
        type : String
    },
    friends : {
        type : Array
    }
})

module.exports = userFriendSchema