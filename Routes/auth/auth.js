const express = require('express')
const Router = express.Router()
const userFunction = require('../../database/functions/userFunctions')


//'/api/v1/auth'
Router.get('/', (req, res) => {
    res.status(200).send({data : 'Work With /login and /Signup'})
})

Router.post('/signup', (req, res) => {

    userFunction.save(req, res)
    
})

Router.post('/login', (req, res) => {
    userFunction.login(req, res)
})

module.exports = Router