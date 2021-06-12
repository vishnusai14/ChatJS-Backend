const socketModel = require('../db').socketModel
const messageFunction = require('../functions/messageToSendFunctions')

const createOrModifySocketId = (newUserData) => {
    socketModel.findOne({ clientEmail: newUserData.email }, (err, found) => {
        if (err) {
            console.log(err)
        } else {
            if (found) {

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

    socketModel.findOne({ clientEmail: msgData.email }, (err, found) => {
        if (err) {
            console.log(err)
        } else if (found) {
            const id = found.socketId
            if (id === undefined) {
                messageFunction.saveNewMessage(msgData)
            } else {
                io.to(id).emit('msgReceive', {data : msgData})
            }
        }
    })
    
}

const userDisconnects = (userData) => {

    socketModel.findOneAndUpdate({ clientEmail: userData.email }, { socketId: undefined }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }

    })


}

module.exports = {

    createOrModifySocketId: createOrModifySocketId,
    sendOrStoreMessage: sendOrStoreMessage,
    userDisconnects: userDisconnects

}