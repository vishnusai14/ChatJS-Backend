require('dotenv').config()
const bcrypt = require('bcryptjs')
const userModel = require('../db').user
const generateUniqueId = require('generate-unique-id')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const saveUser = (req, res) => {

    const userName = req.body.userName
    const password = req.body.password
    const email = req.body.email
    const socketId = req.body.socketId

    userModel.findOne({ email: email }, (err, found) => {

        if (err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()
        }

        if (found) {
            res.status(400).send({ data: 'User Exists' })
            res.end()
        } else {
            bcrypt.hash(password, 5, (err, hashedPassword) => {
                if (err) {
                    res.status(500).send({ data: 'Internal Server Error' })
                    res.end()
                } else {
                    const userId = generateUniqueId({
                        length: 10,
                        useLetters: false
                    })
                    const newUserModel = new userModel({
                        userId: userId,
                        userName: userName,
                        email: email,
                        password: hashedPassword,
                        socketId : socketId
                    })
                    newUserModel.save()
                    const token = jwt.sign({email : email, id: userId}, SECRET)
                    res.status(200).send({ data: token })
                    res.end()
                }
            })
        }
            
    })
    
}

const loginUser = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    userModel.findOne({ email: email }, (err, found) => {
        if (err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()

        } else {
            if (found) {

                bcrypt.compare(password, found.password, (err, isEqual) => {
                    if (isEqual) {

                        const token = jwt.sign({ email: email, id: found.userId }, SECRET)
                        res.status(200).send({ data: token })
                        res.end()
                    } else {
                        res.status(400).send({data : 'Unuthorized'})
                    }
                })

            } else {
                res.status(400).send({ data: 'User Not Exist' })
                res.end()
            }
        }
    })
}

const getUser = (req, res) => {

    const token = req.params.token
  
    try {

        const user = jwt.verify(token, SECRET)
        if (user) {

            userModel.findOne({ email: user.email }, (err, found) => {
                if (err) {
                    res.status(500).send({ data: 'Internal Server Error' })
                    res.end()
                } else {
                    if (found) {
                        let userData = {
                            userId: found.userId,
                            userName: found.userName,
                            userEmail: found.email 
                        }
                        res.status(200).send({ data: userData })
                        res.end()

                    } else {
                        res.status(400).send({ data: 'UnAuthorized' })
                        res.end()
                    }
                }
            })

        } else {
            res.status(400).send({ data: 'UnAuthorized' })
            res.end()
        }

    } catch (err) {
        res.status(400).send({ data: 'UnAuthorized' })
        res.end()

    }


}

const getAllUser = (req, res) => {
    userModel.find({} , (err, found) => {
        if(err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()
        }else if(found) {
            res.status(200).send({data : found})
            res.end()
        }
    }) 
}


const checkUser = (req, res) => {
    userModel.findOne({userId : req.body.id} , (err, found) => {
        if(err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()
        }else if(found) {
            res.status(200).send({data : found.email})
            res.end()
        }else {
            res.status(400).send({data : 'User Not Found'})
            res.end()
        }
    })
}

module.exports = {
    save: saveUser,
    login: loginUser,
    getUser : getUser,
    getAllUser : getAllUser,
    checkUser :checkUser
}