const express = require('express')
const tasks = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')


// to add a new task
router.post('/addtask', auth,  async (req, res) => {
  const newTask = new tasks({
    ...req.body,
    owner: req.user.username
  })

  try {
    await newTask.save()
    res.status(201).send(newTask)
  } catch(e) {
    res.status(400).send(e)
  }
})

// to get the tasks from the db
router.get('/gettasks', auth, async (req, res) => {
  try {
    const tasksList = await tasks.find({ owner: req.user.username })
    res.send(tasksList)
  } catch(e) {
    res.status(404).send(e)
  }
})

// to change a task to "completed"
router.get('/completedtask/:id', auth, async (req, res) => {
  const task = await tasks.findOne({_id: req.params.id})
  try {
    if(task){
      task.completed = !task.completed
      await task.save()
      res.send(task)
    } 
  } catch (e) {
    res.status(404).send(e)
  }
})

// to delete 1 task
router.get('/deletetask/:id', auth, async (req, res) => {
  const task = await tasks.findOneAndDelete({owner: req.user.username, _id: req.params.id})

  try {
    if(task){
      return res.send(task)
    }
    return res.status(404).send(e)
  } catch (e) {
    res.status(400).send(e)
  }
})

// to save changes to a task
router.post('/edittask', auth, async (req, res) => {
  const task = await tasks.findOneAndUpdate(
    { owner: req.user.username, _id: req.body.id},
    {
      text: req.body.text,
      date: req.body.date,
      time: req.body.time,
      priority: req.body.priority
    }
  )

  try {
    if(task){
      return res.send()
    }
    return res.status(404).send()
  } catch (e) {
    res.status(400).send(e)
  }
})

// to delete all "completed" tasks
router.get('/deletealltasks', auth, async (req, res) => {
  const deletedTasks = await tasks.deleteMany({owner: req.user.username, completed: true})
  try {
    if(deletedTasks){
      return res.send(deletedTasks)
    }
    return res.status(404).send()
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router