require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const Router = express.Router()
const userModel = require('../../database/db').user

Router.post('/logoutuser', (req, res) => {
    const token = req.body.token
    try{

        const user = jwt.verify(token, process.env.SECRET)
        if(user) {

            userModel.findOneAndUpdate({email : user.email}, {expoToken : undefined}, (err, response) => {
                if(err) {
                    res.status(500).send({data: 'Internal Error'})
                    res.end()
                }else {
                    res.status(200).send({data : 'Logout'})
                    res.end()
                }
            })

        }else {
            res.status(400).send({data: 'Unauthorized'})
            res.end()
        }

    }catch(err) {
        res.status(400).send({data: 'Unauthorized'})
        res.end()
    }
})

module.exports = Router