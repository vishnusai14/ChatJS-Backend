const jwt = require('jsonwebtoken')
const userFunction = require('../../database/functions/userFunctions')

const Router = require('express').Router()

//"/api/v1/user/userdetail

Router.get('/userdetail/:token', (req, res) => {
    userFunction.getUser(req, res)
})

Router.get('/getall' , (req, res) => {
    userFunction.getAllUser(req, res)
})

Router.post('/checkUser' , (req, res) => {
    userFunction.checkUser(req, res)
})

Router.post("/uploadimage", (req, res) => {
    userFunction.uploadImage(req, res)
})

Router.get('/getImage/:email', (req, res) => {
    userFunction.getImage(req, res)
})


module.exports = Router