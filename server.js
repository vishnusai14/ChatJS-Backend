const express = require('express')
const cors = require('cors')
const app = express()

const db = require('../ChatJS-Backend/database/db')
const socketConnect = require('../ChatJS-Backend/socket/socketStuff')
app.use(express.json())
app.use(cors())
const socket = require('socket.io')

db.connect('mongodb://localhost:27017/ChatJsvTwo')


const PORT = process.env.PORT || 1331

//For Checking
app.get('/', (req, res) => {

    res.sendFile('E:/chat-app/ChatJS-Backend/ChatJS-Backend/index.html')

})

//auth Route
app.use('/api/v1/auth', require('../ChatJS-Backend/Routes/auth/auth'))

//user Route
app.use('/api/v1/user', require('../ChatJS-Backend/Routes/user/user'))

//message route
app.use('/api/v1/message', require('../ChatJS-Backend/Routes/message/message'))

const server = app.listen(PORT, () => {
    console.log(`The Server is started in Port ${PORT}`)

})

socketConnect.connect(server)

module.exports = {
    server : app
}
