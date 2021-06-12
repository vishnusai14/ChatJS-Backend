//We Will Not Store All The Message In the DataBase Only The Message Which is Not Sent

const mongoose = require('mongoose')

const messageToSendSchema = new mongoose.Schema({

    senderEmail: {
        type : String
    },
    receiverEmail: {
        type : String
    },
    message: {
        type : String
    },
    
})

module.exports = messageToSendSchema