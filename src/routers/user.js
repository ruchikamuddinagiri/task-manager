const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

//login page
router.get('/', (req,res) => {
    res.render('../views/index.ejs')
})



//add user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        //create a token for the new user
        const token = await user.generateAuthToken()
        
        res.status(201).send({user, token})
    } catch(e){
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
        res.send({user, token})
        

    } catch(e) {
        res.status(400).send(e)
    }
})

//get user profile
router.get('/users/me', auth, async(req, res) => {
    
    res.send( req.user )
    next()

})


//get one user based on id
router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try{
        const user = await User.findById(id)
        if(!user){
           return res.status(404).send()
        }
        res.render('../views/home.ejs',{user})
    }catch(e){
        res.status(500).send()
    }

})

//update user by id
router.patch('/users/:id', async(req, res) => {
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
        const user = await User.findById(req.params.id)
        //then assign all the parameters coming from req.body
        //this is dynamic so use []
        updates.forEach((update) => user[update] = req.body[update])
        //then save the user
        await user.save()

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
        
    }catch(e){
        res.status(400).send()
    }
})
//delete user

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
    if(!user){
        //user not found
        res.status(404).send()
    }
    res.send(user)
    } catch(e){
        res.status(400).send()
    }
    
})

module.exports = router
