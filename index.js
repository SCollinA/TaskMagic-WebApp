const User = require('./models/User')
const Task = require('./models/Task')

const taskViewTemplate = require('./views/taskView.js')
const taskView = taskViewTemplate.taskView
const headerView = taskViewTemplate.header
const taskCells = taskViewTemplate.taskCells
const loginView = require('./views/loginView')
const registerView = require('./views/registerView')


const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3000

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./models/db');
app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: 'random123',
    saveUninitialized: false
}));

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

function protectRoute(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

function checkTask(req, res, next) {
    // if they do not have task there is nothing to show them
    if (req.session.task) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/login', (req, res) => {
    res.send(loginView())
})
app.post('/login', (req, res) => {
    // get values from form
    const userName = req.body.username.toLowerCase()
    const password = req.body.password
    // find user
    User.getByName(userName)
    .then(user => {
        if (user.matchPassword(password)) {
            req.session.user = user
            res.redirect(`/home`)
        } else {
            res.redirect('/login');
        }
    })
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

app.get('/register', (req, res) => {
    res.send(registerView())
})
app.post('/register', (req, res) => {
    // get values
    const userName = req.body.username.toLowerCase()
    const password = req.body.password
    // create user
    User.add(userName, password)
    .catch(() => res.redirect('/login'))
    .then(user => {
        req.session.user = user
        Task.add(`${userName}'s life`)
        .then(task => {
            task.assignToUser(user.id)
            .then(() => res.redirect(`/home`))
        })
    })
})

app.get('/home', protectRoute, (req, res) => {
    const user = req.session.user
    User.getById(user.id)
    .then(user => {
        user.rootTask()
        .then(rootTask => {
            req.session.task = rootTask
            req.session.previousTasks = []
            console.log(req.session.previousTasks)
            res.redirect('/')
        })
    })
})
// define endpoints
// listen for get requests
// main page
app.get('/', protectRoute, checkTask, (req, res) => { 
    const header = headerView(req.session.task, req.session.previousTasks[req.session.previousTasks.length - 1])
    Task.getById(req.session.task.id)
    .then(task => {
        task.getChildren()
        .then(children => {
            taskCells(children)
            .then(taskCells => {
                res.send(taskView(header, taskCells))
            })
        })
    })
})

app.get('/back', protectRoute, (req, res) => {
    req.session.task = req.session.previousTasks.pop()
    console.log(req.session.previousTasks)
    res.redirect('/')
})
// doing the task magic
// getting the task
app.get("/:taskID([0-9]+)", protectRoute, (req, res) => {
    Task.getById(req.params.taskID)
    .then(task => {
        req.session.previousTasks.push(req.session.task)
        console.log(req.session.previousTasks)
        req.session.task = task
        res.redirect('/')
    })
})

// adds a new task to user's list
app.post("/", protectRoute, (req, res) => {
    // console.log(req.body)
    Task.add(req.body.taskSearch)
    .then(task => {
        task.assignToUser(req.session.user.id)
        .then(() => {
            Task.getById(req.session.task.id)
            .then(parentTask => {
                parentTask.addChild(task)
                .then(() => {
                    res.redirect(`/`)
                })
            })
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
