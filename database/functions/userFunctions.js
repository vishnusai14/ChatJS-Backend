require('dotenv').config()
const bcrypt = require('bcryptjs')
const userModel = require('../db').user
const userFriendModel = require('../db').userFriendModel
const generateUniqueId = require('generate-unique-id')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET



//Image Kit

const ImageKit = require("imagekit")

const imagekit = new ImageKit({
    publicKey : process.env.PUBLICKEY,
    privateKey : process.env.PRIVATEKEY,
    urlEndpoint : process.env.URL
})

const saveUser = (req, res) => {

    const userName = req.body.userName
    const password = req.body.password
    const email = req.body.email
    const socketId = req.body.socketId
    const expoToken = req.body.expoToken

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
                        socketId : socketId,
                        expoToken : expoToken
                    })
                    const newUserFriendModel = new userFriendModel({
                        email : email,
                        friends : []
                    })
                    newUserModel.save()
                    newUserFriendModel.save()
                    const token = jwt.sign({email : email, id: userId, userName : userName}, SECRET)
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
    console.log("This is From Login " ,email,  password)
    userModel.findOne({ email: email }, (err, found) => {
        if (err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()

        } else {
            if (found) {

                bcrypt.compare(password, found.password, (err, isEqual) => {
                    if (isEqual) {
                        userModel.findOneAndUpdate({email : email} , {expoToken : req.body.expoToken} , (err , response) => {
                            if(err) {
                                console.log(err)
                            }else {
                                const token = jwt.sign({ email: email, id: found.userId }, SECRET)
                                res.status(200).send({ data: token })
                                res.end()
                            }
                        })
                        
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
                            userEmail: found.email,
                            userImage : found.image
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
    console.log('Checking User')
    userModel.findOne({userId : req.body.id} , (err, found) => {
        if(err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()
        }else if(found) {
            let userData = {
                email : found.email,
                userName : found.userName
            }
            res.status(200).send({data : userData})
            res.end()
        }else {
            res.status(400).send({data : 'User Not Found'})
            res.end()
        }
    })
}

const uploadImage = (req, res) => {
    const baseUrl = req.body.url
    const token = req.body.token

    try{
        const user = jwt.verify(token, SECRET)
        const userEmail = user.email
        const userId = user.id
        const fileName = userEmail+"_"+userId


        userModel.findOne({email : userEmail} , (err, found) => {
            if(err) {
                res.status(500).send({data : 'Internal Server Error'})
                res.end()
            }else if(found) {

                if(found.imageId) {

                    imagekit.deleteFile(found.imageId, (error, result) =>  {
                        if(error) {
                            res.status(500).send({data : 'Internal Server Error'})
                            res.end()
                        }
                        else {
                            imagekit.upload({
                                file : baseUrl, //required
                                fileName : fileName,   //required
                                tags: [userEmail, "UserPhoto"]
                            }, (error, result) => {
                                if(error)  {
                                    res.status(500).send({data : 'Internal Server Error'})
                                    res.end()
                                }
                                else {
                                    userModel.findOneAndUpdate({email : userEmail} , {image : result.url, imageId : result.fileId} , (err, response) => {
                                        if(err) {
                                            res.status(500).send({data : 'Internal Server Error'})
                                            res.end()
                                        }else {
                                            res.status(200).send({data : result.url})
                                            res.end()
                                        }
                                    })
                                }
                            }) 
                        }
                    })

                }else {

                    imagekit.upload({
                        file : baseUrl, //required
                        fileName : fileName,   //required
                        tags: [userEmail, "UserPhoto"]
                    }, (error, result) => {
                        if(error)  {
                            res.status(500).send({data : 'Internal Server Error'})
                            res.end()
                        }
                        else {
                            userModel.findOneAndUpdate({email : userEmail} , {image : result.url, imageId : result.fileId} , (err, response) => {
                                if(err) {
                                    res.status(500).send({data : 'Internal Server Error'})
                                    res.end()
                                }else {
                                    res.status(200).send({data : result.url})
                                    res.end()
                                }
                            })
                        }
                    })
                }

            }else {
                res.status(400).send({data : 'UnAuthorized'})
                res.end()
            }
        })

    }catch(err) {
        res.status(500).send({data : 'Internal Server Error'})
        res.end()
    }


    
}

const getImage = (req, res) => {
    const email = req.params.email
    userModel.findOne({email : email}, (err, found) => {
        if(err) {
            res.status(500).send({data : 'Internal Server Error'})
            res.end()
        }else if(found) {
            console.log('Founded ')
            res.status(200).send({imageUrl : found.image})
            res.end()
        }
    })
}

module.exports = {
    save: saveUser,
    login: loginUser,
    getUser : getUser,
    getAllUser : getAllUser,
    checkUser :checkUser,
    uploadImage : uploadImage,
    getImage : getImage
}