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

app.get('/', (req, res) => res.send('Whaaaaa?'))

// define endpoints
// listen for get requests
app.get('/user/:userName([A-Z | %20]+)', (req, res) => {
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
            if (!previousTasks.map(task => task.id).includes(tasks[0].id)) {
                previousTasks.unshift(currentTask)
                console.log(previousTasks)
            } else {
                previousTasks.shift()
                console.log(previousTasks)
            }
            currentTask = tasks[0]
            console.log(currentTask)
            const header = headerView(tasks[0], previousTasks[0])
            res.send(taskView(header, children))
        })
    })
})

app.post('/task/:taskName([A-Z | %20]+)', (req, res) => {
    Task.add(req.params.taskName)
    .then(task => {
        task.assignToUser(currentUser.id)
        .then(() => {
            currentTask.addChild(task)
            // task.addParent(currentTask)
            .then(() => {
                debugger
                res.redirect(`/task/${currentTask.name}`)
            })
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
