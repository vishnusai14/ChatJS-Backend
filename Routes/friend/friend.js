const express = require('express')
const Router = express.Router()
const userFriendFunction = require('../../database/functions/userFriendFunctions')


Router.post('/getUser', (req, res) => {
    userFriendFunction.getUser(req, res)
})

Router.post('/saveUser', (req, res) => {
    userFriendFunction.saveUser(req, res)
})

Router.post('/fetchUser', (req, res) => {
    userFriendFunction.fetchUsers(req, res)
})

module.exports = Router