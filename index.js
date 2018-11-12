const bodyParser = require('body-parser')

const bcrypt = require('bcrypt')

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
const createTaskCells = taskViewTemplate.taskCells
const loginView = require('./views/loginView')
const registerView = require('./views/registerView')

let currentUser
let currentTask
let previousTasks = []

app.get('/', (req, res) => res.send('Whaaaaa?'))

app.get('/register', (req, res) => {
    res.send(registerView())
})
app.post('/register', (req, res) => {
    
})

app.get('/login', (req, res) => {
    res.send(loginView())
})
app.post('/login', (req, res) => {
    // get values from form
    // find user
    // check password
})

// define endpoints
// listen for get requests
app.get('/user/:userID([0-9]+)', (req, res) => {
    User.getById(req.params.userID)
    // .then(console.log)
    .then(user => {
        currentUser = user
        user.rootTask().then(task => {
            currentTask = task
            res.redirect(`/task/${task.id}`)
            // const header = headerView(task, previousTasks[0])
            // res.send(taskView(header, children))
        })
    })
})


// doing the task managing sutff
app.get("/task/:taskID([0-9]+)", (req, res) => {
    Task.getById(req.params.taskID)
    .then(task => {
        task.getChildren()
        .then(children => {
            if (!currentTask) {
                currentTask = task
            }
            // if we are not at a previous task already
            if (currentTask.id != task.id && !previousTasks.map(prevTask => prevTask.id).includes(task.id)) {
                previousTasks.unshift(currentTask)
                console.log(previousTasks)
            } else if (previousTasks.length > 0 && task.id == previousTasks[0].id) {
                previousTasks.shift()
                console.log(previousTasks)
            }
            currentTask = task
            console.log(currentTask)
            const header = headerView(task, previousTasks[0])
            createTaskCells(children)
            .then(taskCells => res.send(taskView(header, taskCells)))
        })
    })
})

app.post("/task/:parentTaskID([0-9]+)", (req, res) => {
    // console.log(req.body)
    if (currentUser) { // if a user is logged in
        Task.add(req.body.taskSearch)
        .then(task => {
            task.assignToUser(currentUser.id)
            .then(() => {
                currentTask.addChild(task)
                // task.addParent(currentTask)
                .then(() => {
                    res.redirect(`/task/${currentTask.id}`)
                })
            })
        })
    } else {
        res.send('Not logged in...')
    }
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
