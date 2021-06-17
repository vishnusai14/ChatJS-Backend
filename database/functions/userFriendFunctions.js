require('dotenv').config()
const userFriendModel = require('../db').userFriendModel
const userModel = require('../db').user
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET

const getUser = (req, res) => {
    console.log('Getting User')
    const userId = req.body.userId
    const token = req.body.token

    try {

        const user = jwt.verify(token, SECRET)
        const email = user.email
        userFriendModel.findOne({email : email} , (err, found) => {
            if(err) {
                res.status(500).send({data : 'Internal Server Error'})
                res.end()
            }else if(found) {
                const friendList = found.friends
                const existIndex = friendList.findIndex((e) => e.userId === userId)
                if(existIndex >= 0) {
                    res.status(200).send({data : 'UserExist'})
                    res.end()
                }else {
                    res.status(200).send({data : 'UserNotExist'})
                    res.end()
                }
            }else {
                res.status(400).send({data : 'Unauthorized'})
                res.end()
            }
        })

    }catch(err) {
        res.status(400).send({data : 'Unauthorized'})
        res.end()
    }

}

const saveUser = (req, res) => {
  
    const id = req.body.id
    console.log(id)
    const userName = req.body.userName
    const userEmail = req.body.userEmail
    const token = req.body.token
    console.log(token)
    try {
        const user = jwt.verify(token, SECRET)
        console.log(user)
        if(user) {

            const email = user.email
            const newFriend = {
                userId : id,
                userName : userName,
                userEmail : userEmail,
                lastMsg : new Date()
            }

            const anotherFriend = {
                userId : user.id,
                userName : user.userName,
                userEmail : user.email,
                lastMsg : new Date()
            }

            userFriendModel.findOneAndUpdate({email : email} ,  { "$push": { "friends": newFriend } }, (err, response) => {
                if(err) {
                    res.status(500).send({data : 'Internal Server Error'})
                    res.end()
                }else {
                    userFriendModel.findOneAndUpdate({email : userEmail}, { "$push": { "friends": anotherFriend }}, (err, result) => {
                        if(err) {
                            res.status(500).send({data : 'Internal Server Error'})
                             res.end()
                        }else {
                            res.status(200).send({data : 'User Saved'})
                            res.end()
                        }
                    })
                    
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


const getImage =  async (email) => {
    let image
    await userModel.findOne({email : email}, (err, response) => {
        if(err) {
            console.log(err)
        }else {
            console.log(response)
            image =  response
        }
    })
    console.log("This Will Return", image)
    return image
    
}

const fetchUsers =  (req, res) => {
    
    const token = req.body.token

    try {
        let result = []
        const user = jwt.verify(token, SECRET)
        if(user) {
            
            userFriendModel.findOne({email : user.email},   async (err, found) => {
                if(err) {
                    res.status(500).send({data : 'Internal Error'})
                    res.end()
                }else {
                    
                   found.friends.forEach(async (e) => {
                        let responeFromFun = await getImage(e.userEmail)
                        console.log("This is From Loop", responeFromFun)   
                        let actualImage = responeFromFun.image
                       result.push({
                        userId : e.userId,
                        userEmail : e.userEmail,
                        userName : e.userName,
                        userImage : actualImage
                       })    
                    })
                    setTimeout(() => {
                        console.log(result)
                        res.status(200).send({data : result})
                        res.end() 
                    }, 1000)
                     
                }
            })
        }
        else {
            res.status(400).send({data : 'Unauthorized'})
            res.end()
        }

    }catch(err) {
        res.status(400).send({data : 'Unauthorized'})
        res.end()
    }
}

module.exports = {
    getUser: getUser,
    saveUser: saveUser,
    fetchUsers: fetchUsers
}