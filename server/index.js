const express = require('express')
require('./db/mongoose')
const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')
const cookieParser = require('cookie-parser')
const path = require("path");

const port = process.env.PORT

const app = express()

app.use(cookieParser())

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build', 'index.html')))

app.listen(port, () => {
  console.log(`Server is running on ${port} `)
})