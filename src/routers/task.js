const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//add task webpage
router.get('/addTask', auth, (req,res)=>{
    res.render('../views/addTask.ejs')
})

//view task webpage
router.get('/viewTask', auth, (req,res)=>{
    res.render('../views/viewTask.ejs')
})

//add task
router.post('/tasks', auth, async (req, res) => {
    console.log(req.body)
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send({error:e})
    }
    
})
// <%- tasks %>
//         <% for(var i=0; i < tasks.length; i++) { %>
//         <li><%= tasks[i].description %></li>
//         <button>Edit</button>
//         <% } %>

//get tasks?completed=
//get tasks?limit=10&skip=0
//get tasks?sortBy=createdAt_desc
//get tasks?label=Personal
//get tasks?status=New
router.get('/tasks', auth, async (req, res) => {
    const match ={}
    const sort ={}

    if(req.query.completed){
        match.completed = req.query.completed === 'true' 
    }

    if(req.query.sortBy){
        if(!Array.isArray(req.query.sortBy)){
            const parts = req.query.sortBy.split('_')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }else{
            for(i=0;i<req.query.sortBy.length;i++){
                const parts = req.query.sortBy[i].split('_')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            } 
        }
         
    }
    

    if(req.query.label){
        match.label = req.query.label
    }

    if(req.query.status){
        match.status = req.query.status
    }

    try{
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.status(500).send()
    }
    
})

//get task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.render('../views/updateTask.ejs', {task:task})
    } catch(e) {
        res.status(500).send()
    }
    
})

router.patch('/tasks/:id', auth, async (req, res) => {
    //check for valid updates
    console.log(req.body)
    const updates = Object.keys(req.body)
    const allUpdates = ['description', 'completed', 'label', 'taskStatus', 'dueDate']
    const isValidUpdate = updates.every((update) => allUpdates.includes(update))

    if(!isValidUpdate){
        res.status(400).send({error: 'Invalid update'})
    }

    try{        
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //if task not found
        if(!task){
            //send 404
            return res.status(404).send()
        }
        else{
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
        }
    }catch(e){
        console.log(e)
        //send 400
        res.status(400).send({error:e})
    }

})

//delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
    if(!task){
        //task not found
        res.status(404).send()
    }
    res.send(task)
    } catch(e){
        res.status(400).send()
    }
    
})
//export the router
module.exports = router