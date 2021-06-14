require('dotenv').config()
const messageModel = require('../db').messageModel
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const saveNewMessage = (newMsgData) => {

    console.log("This is From Save Message")
    const newMessageModel = new messageModel({
        senderEmail: newMsgData.senderEmail,
        receiverEmail: newMsgData.receiverEmail,
        message: newMsgData.message,
        userId : newMsgData.userId,
        userName : newMsgData.userName
    })

    newMessageModel.save()
}



const getAllMessage = (req, res) => {

    const token = req.body.token
    const email = req.body.email

    try {

        const user = jwt.verify(token, SECRET)
        if(user) {
            console.log(user)
            const senderEmail = user.email
            let messages = []
            messageModel.find({}, (err, found) => {
                if(err) {
                    res.status(500).send({data : 'Internal Server Error'})
                    res.end()
                }else {
                    if(found) {
                        messages = found.filter((e) => {
                            return((e.senderEmail === email || e.senderEmail === senderEmail) && (e.receiverEmail === email || e.receiverEmail === senderEmail))  
                        })
                       
                        console.log("This is Final Msg" , messages)
                        let dataToBeSend = {
                            msgs : messages,
                            email : senderEmail
                        }
                        res.status(200).send({data : dataToBeSend})
                        res.end()
                    }else {
                        res.status(500).send({data : 'Internal Server Error'})
                        res.end()
                    }
                } 
            })

        }else {

            res.status(400).send({data : 'UnAuthorized'})
            res.end()
        }

    }catch(err) {
        res.status(400).send({data : 'UnAuthorized'})
        res.end()
    }

}

module.exports = {

    saveNewMessage: saveNewMessage,
    getAllMessage : getAllMessage

}