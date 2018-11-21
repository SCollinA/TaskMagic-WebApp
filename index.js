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

app.use((req, res, next) => {
    const isLoggedIn = req.session.user ? true : false
    console.log(isLoggedIn)
    next()
})

let currentUser
let currentTask
let previousTasks = []

// app.get('/', (req, res) => res.redirect('/login'))

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
            currentTask = rootTask
            previousTasks.length = 0
            res.redirect('/')
        })
    })
})
// define endpoints
// listen for get requests
app.get('/', protectRoute, (req, res) => {
    debugger
    // check if they have a current task assigned
    // otherwise they navigated here while already signed in
    if (!currentTask) {
        res.redirect('/home')
    }
    const header = headerView(currentTask, previousTasks[0])
    currentTask.getChildren(children => {
        taskCells(children)
        .then(taskCells => res.send(taskView(header, taskCells)))
    })
})


// doing the task managing sutff
app.get("/:taskID([0-9]+)", protectRoute, (req, res) => {
    Task.getById(req.params.taskID)
    .then(task => {
        if (previousTasks.map(task => task.id).includes(currentTask.id)) {
            while (previousTasks.pop().id != currentTask.id) {
                continue
            }
        }
        previousTasks.push(currentTask)
        currentTask = task
        res.redirect('/')
    })
})

app.post("/", protectRoute, (req, res) => {
    // console.log(req.body)
    Task.add(req.body.taskSearch)
    .then(task => {
        task.assignToUser(currentUser.id)
        .then(() => {
            currentTask.addChild(task)
            // task.addParent(currentTask)
            .then(() => {
                res.redirect(`/`)
            })
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
