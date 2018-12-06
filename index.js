const User = require('./models/User')
const Task = require('./models/Task')

const taskView = require('./views/taskView')
const taskNavView = require('./views/taskNav')
const parentCell = require('./views/parentCell')
const taskCells = require('./views/taskCells')
const loginView = require('./views/loginView')
const registerView = require('./views/registerView')

const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3001

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


// middleware
function protectRoute(req, res, next) {
    console.log('protecting route')
    if (req.session.user) {
        console.log('user authenticated')
        next()
    } else {
        console.log('user not authenticated')
        res.send({children: [], currentTask: null, searchTerm: '', selectedTask: null, user: null})
    }
}

// make sure current user is owner of current task
function checkUser(req, res, next) {
    console.log('checking user')
    // check if current task is assigned to current user
    Task.getById(req.session.task.id)
    .then(task => {
        // get users for task
        task.getUsers()
        .then(users => {
            console.log(users, task)
            // map to ids of users
            // if current user's id is in tasks users ids
            if (users.map(user => user.id).includes(req.session.user.id)) {
                next()
            } else {
                // else redirect to logged in user's rootTask
                res.redirect('/home')
            }
        })
    })
    // .catch(err => res.redirect('/login'))
}

// to prevent users from navigating to task directly
function checkTask(req, res, next) {
    console.log('checking task')
    // if they do not have task there is nothing to show them
    if (req.session.task) {
        next()
    } else {
        console.log('no task selected')
        res.redirect('/logout')
    }
    // else {
    //     res.redirect('/login')
    // }
}

// app.get('/login', (req, res) => {
//     req.session.destroy()
//     // res.send(loginView())

// })

app.post('/login', (req, res) => {
    console.log('received post for /login')
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
            console.log('bad password')
            res.redirect('/logout')
        }
    })
})

app.get('/logout', (req, res) => {
    // res.redirect('/login')
    req.session.destroy()
    res.send({children: [], currentTask: null, searchTerm: '', selectedTask: null, user: null})
})

// app.get('/register', (req, res) => {
//     // res.send(registerView())
// })
app.post('/register', (req, res) => {
    console.log('received post for /register')
    // get values
    const userName = req.body.username.toLowerCase()
    const password = req.body.password
    // create user
    User.add(userName, password)
    .then(user => {
        req.session.user = user
        Task.add(`${userName}'s life`)
        .then(task => {
            task.assignToUser(user.id)
            .then(() => res.redirect(`/home`))
        })
    })
})

app.get('/home', (req, res) => {
    console.log('user sent to /home')
    User.getById(req.session.user.id)
    .then(user => {
        user.rootTask()
        .then(rootTask => {
            req.session.task = rootTask
            console.log('sending user to /test-react')
            res.redirect('/test-react')
        })
    })
})
// define endpoints
// listen for get requests
// main page
// app.get('/', protectRoute, checkTask, checkUser, (req, res) => { 
//     console.log('what the fuck')
//     // const taskNav = taskNavView(req.session.task, req.session.previousTasks[req.session.previousTasks.length - 1])
//     // Task.getById(req.session.task.id)
//     // .then(task => {
//     //     // need to get active children separately from complete tasks
//     //     task.getChildren()
//     //     .then(children => {
//     //         task.getParents()
//     //         .then(parents => {
//     //             taskCells(children)
//     //             .then(taskCells => {
//     //                 console.log(`Sending task view ${req.session.task.name}`)
//     //                 res.send(taskView(taskNav, taskCells, parentCell(parents)))
//     //             })
//     //         })
//     //     })
//     // })
//     res.redirect('/test-react')
// })

// app.get('/back', protectRoute, (req, res) => {
//     req.session.task = req.session.previousTasks.pop()
//     console.log(req.session.previousTasks)
//     console.log(`Going back to ${req.session.task.name}`)
//     res.redirect('/')
// })
// doing the task magic
// getting the task
// app.get("/:taskID([0-9]+)", protectRoute, (req, res) => {
//     Task.getById(req.params.taskID)
//     .then(task => {
//         req.session.previousTasks.push(req.session.task)
//         console.log(req.session.previousTasks)
//         req.session.task = task
//         console.log(`Task selected: ${task.name}`)
//         res.redirect('/')
//     })
// })

// adds a new task to user's list
// app.post("/", protectRoute, (req, res) => {
//     // console.log(req.body)
//     Task.add(req.body.taskSearch)
//     .then(task => {
//         task.assignToUser(req.session.user.id)
//         .then(() => {
//             Task.getById(req.session.task.id)
//             .then(parentTask => {
//                 parentTask.addChild(task)
//                 .then(() => {
//                     res.redirect(`/`)
//                 })
//             })
//         })
//     })
// })

// app.get('/complete/:taskID([0-9]+)', protectRoute, (req, res) => {
//     Task.getById(req.params.taskID)
//     .then(task => {
//         task.toggleActive()
//         .then(() => res.redirect('/'))
//     })
// })

// app.get('/delete/:taskID([0-9]+)', protectRoute, (req, res) => {
//     // delete task here
//     Task.deleteById(req.params.taskID)
//     .then(() => res.redirect('/'))
// })


// REACT methods below >>
// create
app.post('/test-react', protectRoute, (req, res) => {
    console.log(req.body.taskName)
    return Task.add(req.body.taskName)
    .then(task => {
        User.getById(req.session.user.id)
        .then(user => {
            user.chooseTask(task.id)
            .then(() => task.addParent(req.session.task))
        })
    })
    .then(() => res.redirect('/test-react'))
})
// retrieve
app.get('/test-react', protectRoute, checkTask, checkUser, (req, res) => {
    console.log('hello')
    return ((req.session.task && req.session.user) && Task.getById(req.session.task.id)
    .then(task => {
        return task.getChildren()
        .then(children => Promise.all(children.map(child => {
            return child.getChildren()
            .then(grandChildren => {return {...child, children: grandChildren}})
        })))
    })
    .then(children => res.json({user: req.session.user, children, currentTask: req.session.task}))) || res.json()
})
//update
app.post('/test-react-complete', (req, res) => {
    Task.getById(req.body.id)
    .then(task => task.toggleActive())
    .then(() => res.redirect('/test-react'))
})

app.post('/test-react-name', (req, res) => {
    Task.getById(req.body.taskToUpdate.id)
    .then(task => task.updateName(req.body.name))
    .then(() => res.redirect('/test-react'))
})
// delete
app.delete('/test-react-delete', (req, res) => {
    Task.getById(req.body.taskID)
    .then(task => {
        User.getById(req.session.user)
        .then(user => user.removeTask(task.id))
    })
    .then(() => res.redirect('/test-react'))
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
