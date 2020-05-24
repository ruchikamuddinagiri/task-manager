require('../src/db/mongoose')
const Task = require('../src/models/task')
//USING PROMISE CHAINING
//remove a task
//get tasks with completed:false

// Task.findByIdAndDelete({_id: '5ec542ed6004e409cc5c7bcb'}).then((result) => {
//     //result is the number of docs removed
//     console.log(result)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     //result is count of docs with completed:false
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

//USING ASYNC-AWAIT
//create an async function, it returns a promise
const deleteAndCount = async (id, completed) => {
    const task = await Task.findByIdAndDelete({_id: id}) 
    const count = await Task.countDocuments(completed)
    return count
}

//Call the async function, pass id and completed param
//promise has to be handled
deleteAndCount('5ec54352668a083f3851b7a7', false).then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})