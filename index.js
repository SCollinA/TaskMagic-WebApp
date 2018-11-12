const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const User = require('./models/User')
const Task = require('./models/Task')

const taskViewTemplate = require('./views/taskView.js')
const taskView = taskViewTemplate.taskView
const headerView = taskViewTemplate.header

let currentUser
let currentTask
let previousTasks = []

app.get('/', (req, res) => res.send('Try /userName'))

// define endpoints
// listen for get requests
app.get('/user/:userName([A-Z]+)', (req, res) => {
    User.getByName(req.params.userName)
    // .then(console.log)
    .then(users => {
        currentUser = users[0]
        users[0].rootTask().then(task => {
            task.getChildren()
            .then(children => {
                currentTask = task
                const header = headerView(task, previousTasks[0])
                res.send(taskView(header, children))
            })
        })
    })
})

app.get("/task/:taskName([A-Z | %20 | ']+)", (req, res) => {
    Task.getByName(req.params.taskName)
    .then(tasks => {
        tasks[0].getChildren()
        .then(children => {
            if (previousTasks.includes(currentTask)) {
                currentTask = previousTasks.shift()
            } else {
                previousTasks.unshift(currentTask)
                currentTask = tasks[0]
            }
            const header = headerView(tasks[0], previousTasks[0])
            res.send(taskView(header, children))
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
