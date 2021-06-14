const express = require('express')
const Router = express.Router()
const messageFunction = require('../../database/functions/messageToSendFunctions')

Router.post('/getAllmessage', (req, res) => {

    console.log('Getting All Messafe')
    messageFunction.getAllMessage(req, res)

})

module.exports = Router