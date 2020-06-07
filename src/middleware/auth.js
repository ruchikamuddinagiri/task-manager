const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    console.log("in auth fn")
    //const token = req.header('cookie').replace('auth_token=', '')
    //console.log(token)
    try{
        
        //get the token from the request header
        const token = req.header('cookie').replace('auth_token=', '')

        //const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)

        //decode the token against the string provided for creating the sign in models/user.js
        const decoded = jwt.verify(token, 'thisismynodecourse')

        //while creating the sign, we had used the user's id. 
        //so, decoded will have the user's id as the _id property

        //then, we find the user using findOne on the User model
        //two search criteria: user id and token
        //user output will be the user document with the given token
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        //check whether user exists, else throw error
        if(!user){
            throw new Error()
        }
        //this will run if the user exists
        //since we have already retrieved the user, 
        //do not make the route handler(routers/user.js) fetch the user again
        //set a new property on req called user and assign the constant 'user' to it
        console.log("authenticated")
        req.token = token
        req.user = user
        //call next for the route handler to run
        next()


    } catch (e){
        res.status(401).redirect('/')
        //res.status(401).send('Please authenticate!')
    }
    
}

module.exports = auth