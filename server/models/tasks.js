const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema({
  text: {
    type: String, 
    required: true,
    trim: true,
  },
  priority: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: false
  },
  time: {
    type: String,
    required: true
  }
  ,
  owner: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

const tasks = mongoose.model('tasks', tasksSchema)

module.exports = tasks