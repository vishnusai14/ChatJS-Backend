require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const db = require('./database/db')
const socketConnect = require('./socket/socketStuff')
app.use(express.json({limit : '50mb'}))
app.use(cors())
const socket = require('socket.io')

// const monogDbUri = `mongodb+srv://Vishnu_Sai:${process.env.DBPASS}@cluster0.hkghe.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const monogDbUri = 'mongodb://localhost:27017/ChatJsTens'
db.connect(monogDbUri)


const PORT = process.env.PORT || 1331

//For Checking
app.get('/', (req, res) => {

   res.status(200).send("API WORKS")
   res.end()

})

//auth Route
app.use('/api/v1/auth', require('./Routes/auth/auth'))

//user Route
app.use('/api/v1/user', require('./Routes/user/user'))

//message route
app.use('/api/v1/message', require('./Routes/message/message'))

//friend route
app.use('/api/v1/friend', require('./Routes/friend/friend'))

//otp Route
app.use('/api/v1/otp', require('./Routes/otp/otp'))

//logout Route
app.use('/api/v1/logout', require('./Routes/logout/logout'))

const server = app.listen(PORT, () => {
    console.log(`The Server is started in Port ${PORT}`)

})

socketConnect.connect(server)

module.exports = {
    server : app
}
