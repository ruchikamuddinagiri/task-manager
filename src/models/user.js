const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
        trim: true,
    },
    email:{
        type: String,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email address is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Invalid password')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age has to be a positive number!")
            }
        }
    
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//getpublic info

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


//auth token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//userSchema.statics fns can be accessed directly by model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to log in')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw new Error('Unable to log in')
    }
    return user

}
//middleware
//hash the password before saving
//this fn will execute before(pre) the event 'save', i.e, before the user data is saved.
userSchema.pre('save', async function(next) {
    const user = this
    //if password has been modified in update
    if(user.isModified('password')){
        user.password  = await bcrypt.hash(user.password, 8)
    }   
    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
    
})

const User = mongoose.model('User', userSchema)
module.exports = User