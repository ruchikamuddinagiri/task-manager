require('../src/db/mongoose.js')
const User = require('../src/models/user.js')

//USING PROMISE CHAINING
//find user by id
//and count all users with the same age

// User.findByIdAndUpdate('5ec06a978e916c39d0221f58', {
//     age: 22
// }).then((user) => {
//     console.log(user)
//     return User.countDocuments({age:22})
// }).then((count) => {
//     console.log(count)
// }).catch((error) => {
//     console.log(error)
// })

//USING ASYNC-AWAIT

//create an async-await fn

const updateAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

//call the fn
//handle the promise
updateAndCount('5ec06a978e916c39d0221f58', 22).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})
