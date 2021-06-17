require('dotenv').config()
const nodemailer = require("nodemailer")
const express = require('express')
const Router = express.Router()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

Router.post('/sendotp', (req, res) => {
    const otp = Math.ceil(Math.random() * 10000)
    const otp_string = otp.toString()
    let mailOptions = {
            from: process.env.GMAIL,
            to: req.body.email,
            subject: 'OTP',
            html: `<h3>Your OTP is : </h3><br />${otp}`
        }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.status(500).send({data : 'Internal Error'})
                res.end()
            } else {
                res.status(200).send({data : otp_string})
                res.end()
                console.log('Email sent: ' + info.response)
            }
        })
                   
})

module.exports = Router