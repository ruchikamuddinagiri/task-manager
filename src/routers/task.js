const express = require('express')
const Task = require('../models/task')

const router = new express.Router()
//add task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send()
    }
    
})

//get all tasks
router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send()
    }
    
})

//get task by ID
router.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    try{
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
    
})

//update task

router.patch('/tasks/:id', async (req, res) => {
    //check for valid updates
    const allUpdates = ['description', 'completed']
    const updateS = Object.keys(req.body)
    const isValidUpdate = updateS.every((update) => allUpdates.includes(update))

    if(!isValidUpdate){
        res.status(400).send({error: 'Invalid update'})
    }

    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        
        const task = await Task.findById(req.params.id)
        allUpdates.forEach((update) => task[update] = req.body[update])
        await task.save()

        //if task not found
        if(!task){
            //send 404
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        //send 400
        res.status(400).send()
    }

})

//delete task
router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
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