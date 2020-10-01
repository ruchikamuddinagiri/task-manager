const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const path = require('path')

const router = new express.Router()

//login page
router.get('/', (req,res) => {
    res.render('../views/index.ejs')

})
//home page
router.get('/home', auth, (req,res)=>{
    res.render('../views/home.ejs')
    
})

//register page
router.get('/register', (req,res)=>{
    res.render('../views/register.ejs')
})

//add user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try{
        await user.save()
        //create a token for the new user
        const token = await user.generateAuthToken()
        res.setHeader('Cache-Control', 'private');
        res.cookie('auth_token', token)
        
        
        res.status(201).send({user, token})
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})


//log in
router.post('/users/login', async (req, res) => {
    try{
        //find user by email id and password in req.body

        const user = await User.findByCredentials(req.body.email, req.body.password)
        //create token for the user
        const token = await user.generateAuthToken()
        
        res.cookie('auth_token', token)
        
        res.send({user, token})

    } catch(e) {
        res.status(400).send()
    }
})

//logout
router.post('/users/logout', auth, async(req,res)=>{
    try{
        res.clearCookie('auth_token')
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

//logout all
router.post('/users/logoutAll', auth, async(req, res) =>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
    
})

// //get user profile
// router.get('/users/me', auth, async(req, res) => {
//     //console.log(req.header('cookie'))
//     //res.send({user:req.user})
//     res.render('../views/me.ejs', { user: req.user})
// })



//update user by id
router.patch('/users/me', auth, async(req, res) => {
    //set up logic for allowed update paramaetres of a user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate){
        res.status(400).send({error: 'Invalid update'})
    }

    try{
        //this line will not let middleware execute. it directly works with the db
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})

        //for middleware to run
        //first, find the user by id
        
        //then assign all the parameters coming from req.body
        //this is dynamic so use []
        updates.forEach((update) => req.user[update] = req.body[update])
        //then save the user
        await req.user.save()

        res.send(req.user)
        
    }catch(e){
        res.status(400).send()
    }
})
//delete user

router.delete('/users/me', auth, async (req, res) => {
    try{
    //     const user = await User.findByIdAndDelete(req.user._id)
    // if(!user){
    //     //user not found
    //     res.status(404).send()
    //}
    await req.user.remove()
    res.send(req.user)
    } catch(e){
        res.status(400).send()
    }
    
})

module.exports = router
