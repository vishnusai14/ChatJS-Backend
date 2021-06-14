require('dotenv').config()
const socketModel = require('../db').socketModel
const userModel = require("../db").user
const messageFunction = require('../functions/messageToSendFunctions')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const createOrModifySocketId = (newUserData) => {
    socketModel.findOne({ clientEmail: newUserData.email }, (err, found) => {
        if (err) {
            console.log(err)
        } else {
            if (found) {
                console.log(found)
                socketModel.findOneAndUpdate({ clientEmail: newUserData.email }, { socketId: newUserData.id }, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                    }
                })

            } else {
                const newSocketModel = new socketModel({
                    clientEmail: newUserData.email,
                    socketId: newUserData.id
                })
                newSocketModel.save()
            }
        }
    })
}


const sendOrStoreMessage = (msgData, io) => {

    const token = msgData.token
    console.log("This is From Send Or Store Message" , token)
    try {

        const user = jwt.verify(token, SECRET)
        if(user) {
            console.log(user, msgData)
            socketModel.findOne({ clientEmail: msgData.email }, (err, found) => {
                if (err) {
                    console.log(err)
                } else if (found) {
                    const id = found.socketId
                    userModel.findOne({email : user.email} , (err, result) => {
                        if(err) {
                            console.log(err)
                        }else if(found) {
                            if (id === undefined) {
                       
                                const msgDataToSend = {
                                    senderEmail : user.email,
                                    receiverEmail : msgData.email,
                                    message : msgData.msg,
                                    userId : result.userId,
                                    userName : result.userName
                                    
                                }
                                messageFunction.saveNewMessage(msgDataToSend)
                            } else {
                                const msgDataToSend = {
                                    senderEmail : user.email,
                                    receiverEmail : msgData.email,
                                    message : msgData.msg,
                                    userId : result.userId,
                                    userName : result.userName
                                }
                                messageFunction.saveNewMessage(msgDataToSend)
                                console.log(id)
                                io.to(id).emit('msgReceive', {data : msgDataToSend })
                            }
                        }
                    })    
                    }
                    
                   
            })
            
        }else {
            console.log("Err")
        }


    }catch(err) {
        console.log(err)
    }

    
}

const userDisconnects = (id) => {

    socketModel.findOneAndUpdate({ socketId: id }, { socketId: undefined }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log("This is From User Disconnect Response")
        }

    })


}

module.exports = {

    createOrModifySocketId: createOrModifySocketId,
    sendOrStoreMessage: sendOrStoreMessage,
    userDisconnects: userDisconnects

}