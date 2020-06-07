const express = require('express')
const path = require('path')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cookieParser = require('cookie-parser')
 
require('./db/mongoose')


const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000
//middleware for maintenance

// app.use((req, res, next) => {
//     res.status(503).send("Under maintenance. Check back soon!")
// })
//automatically parse incoming json to an object
app.use(express.json())

//fetch routes from routers
app.use(userRouter)
app.use(taskRouter)

//set view engine
app.set('view engine', 'ejs')
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//set up server
app.listen(port, () => {
    console.log("server is up on port 3000")
})

