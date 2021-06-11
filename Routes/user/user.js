const jwt = require('jsonwebtoken')
const userFunction = require('../../database/functions/functions')

const Router = require('express').Router()

//"/api/v1/user/userdetail

Router.get('/userdetail/:token', (req, res) => {
    userFunction.getUser(req, res)
})





module.exports = Router