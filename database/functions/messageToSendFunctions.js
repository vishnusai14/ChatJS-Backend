const messageModel = require('../db').messageModel

const saveNewMessage = (newMsgData) => {

    const newMessageModel = new messageModel({
        senderEmail: newMsgData.senderEmail,
        receiverEmail: newMsgData.receiverEmail,
        message: newMsgData.message
    })

    newMessageModel.save()
}

const retriveMessage = (userData) => {
    const senderEmail = userData.senderEmail
    let messages = []
    messageModel.find({ senderEmail: senderEmail }, (err, found) => {
        if (err) {
            console.log(err)
        } else if (found) {
            messages = found.map((e) => {
                return e
            })
        }
    })

    messageModel.find({ receiverEmail: senderEmail }, (err, found) => {
        if (err) {
            console.log(err)
        } else if (found) {
            found.forEach((e) => {
                messages.push(e)
            })
        }
    })

    return messages
}

module.exports = {

    saveNewMessage: saveNewMessage,
    retriveMessage: retriveMessage

}