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

// app.use(function(req, res, next) {
//     if (req.url.slice(0, 4) == '/api') {
//         req.url = req.url.slice(4)
//     }
//     next();
// });

// app.use((req, res, next) => {
//     res.location(`/api`)
//     next()
// })


// middleware
function protectRoute(req, res, next) {
    console.log('protecting route')
    if (req.session.user) {
        console.log('user authenticated')
        next()
    } else {
        console.log('user not authenticated')
        res.send({children: [], currentTask: null, searchTerm: '', user: null, userTasks: []})
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
            // map to ids of users
            // if current user's id is in tasks users ids
            if (users.map(user => user.id).includes(req.session.user.id)) {
                next()
            } else {
                // else redirect to logged in user's rootTask
                res.redirect('home')
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
        res.redirect('logout')
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
            res.redirect(`home`)
        } else {
            console.log('bad password')
            res.send({currentTask: {name: 'Bad password...'}})
        }
    })
    .catch(err => {
        console.log(err)
        console.log(process.env)
        console.log(`${userName} not found`)
        res.send({currentTask: {name: `${userName} not found...`}})
    })
})

app.get('/logout', (req, res) => {
    console.log('logging out')
    // res.redirect('/login')
    req.session.destroy()
    console.log(req.session)
    res.send({children: [], parents: [], currentTask: null, searchTerm: '', user: null, userTasks: [], previousTasks: []})
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
    Task.add(`${userName}'s life`)
    .then(task => {
        User.add(userName, password, task.id)
        .then(user => {
            req.session.user = user
            task.assignToUser(user.id)
            .then(() => res.redirect(`home`))
        })
    })
    .catch(() => {
        console.log('username exists')
        res.send({currentTask: {name: 'Username exists...'}})
    })
})

app.get('/home', (req, res) => {
    console.log('user sent to /home')
    console.log(req.session.user)
    Task.getById(req.session.user.root_task_id)
    .then(rootTask => {
        req.session.task = rootTask
        console.log('sending user to /test-react')
        res.redirect('test-react')
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
    return Task.add(req.body.taskName)
    .then(task => {
        User.getById(req.session.user.id)
        .then(user => {
            user.chooseTask(task.id)
            .then(() => task.addParent(req.session.task))
        })
    })
    // // update all users tasks who own this task
    // .then(() => {
    //     Task.getById
    // })
    .then(() => res.redirect('test-react'))
})

// retrieve
app.get('/test-react', protectRoute, checkTask, checkUser, (req, res) => {
    console.log('getting user page')
    return Task.getById(req.session.task.id)
    .then(task => {
        // get the task's children
        return task.getChildren()
        // give the children a children property
        .then(children => Promise.all(children.map(child => {
            return child.getChildren()
            .then(grandChildren => {return {...child, children: grandChildren}})
        })))
        .then(children => {
            task.getParentsForUserId(req.session.user.id)
            .then(parents => {
                User.getById(req.session.user.id)
                // update all users tasks
                .then(user => {
                    user.getAllTasks()
                    .then(userTasks => {
                        Task.getById(req.session.task.id)
                        .then(currentTask => {
                            console.log('everything is good')
                            res.json({
                                parents, 
                                currentTask, 
                                children, 
                                user,
                                userTasks,
                                searchTerm: '',
                                taskToEdit: null
                            })
                        })
                    })
                })
            })
        })
    })
})

app.get('/test-react-all-tasks', (req, res) => {
    console.log('getting all tasks for user')
    User.getById(req.session.user.id)
    .then(user => user.getAllTasks())
    .then(tasks => res.json(tasks))
})

app.post('/test-react-task', (req, res) => {
    console.log('selecting new task')
    console.log(req.body.taskToSelect)
    req.session.task = req.body.taskToSelect
    res.redirect('test-react')
})
//update
app.post('/test-react-share-task', (req, res) => {
    console.log(`sharing ${req.body.taskID} with ${req.body.username}`)
    const userToShare = req.body.username
    const taskToShare = req.body.taskID
    User.getByName(userToShare)
    .then(user => {
        user.chooseTask(taskToShare)
        .then(() => {
            user.rootTask()
            .then(rootTask => rootTask.addChild({id: taskToShare}))
        })
    })
    .then(() => res.redirect('test-react'))
})

app.post('/test-react-sub-task', (req, res) => {
    const currentTaskID = req.session.task.id
    const subTaskID = req.body.taskID
    Task.getById(subTaskID)
    // prevent subtask task to itself
    .then(task => currentTaskID !== subTaskID && task.addParent({id: currentTaskID}))
    .then(() => res.redirect('test-react'))
})

app.post('/test-react-complete', (req, res) => {
    // insert logic to auto deactivate all children and parents with no children active
    const rootTaskID = req.session.user.root_task_id
    // get task
    Task.getById(req.body.id)
    .then(task => {
        // if its not the root task
        if (rootTaskID != task.id) {
            // set it to active
            return task.setActive(!task.active)
            .then(() => {
                // if it was set to inactive
                if (!task.active) {
                    // get all parents
                    return task.getParents()
                    .then(parents => {
                        // set all parents with no active children to inactive
                        return Promise.all(parents.map(parent => {
                            // get all their children
                            return parent.getChildren()
                            .then(children => {
                                // if no children are active
                                if (children.filter(child => child.active).length == 0 && parent.id != rootTaskID) {
                                    // mark parent as inactive
                                    console.log(`marking ${parent.name} ${task.active}`)
                                    return parent.setActive(task.active)
                                }
                            })
                        }))
                    })
                } else {
                    // task was marked active, so mark all of it's parents active
                    // if they are not already
                    return task.getParents()
                    // should be same as task, active
                    .then(parents => Promise.all(parents.map(parent => parent.active || parent.setActive(task.active))))
                }
            })
            .then(() => {
                console.log(`setting children ${task.active}`)
                // set children of task to whatever task was changed to
                return task.setChildrenActive(task.active)
            })
        }
    }) 
    .then(() => res.redirect('test-react'))
})

app.post('/test-react-name', (req, res) => {
    console.log('updating name')
    Task.getById(req.body.taskToUpdate.id)
    .then(task => task.updateName(req.body.name))
    .then(() => {
        if (req.body.taskToUpdate.id == req.session.task.id) {
            req.session.task = {...req.session.task, name: req.body.name}
        }
        res.redirect('test-react')
    })
})
// delete
app.post('/test-react-delete', (req, res) => {
    if (req.session.user.root_task_id != req.body.iDToDelete) {
        Task.getById(req.body.iDToDelete)
        .then(task => {
            console.log(`deleting task ${task.name}`)
            task.removeParent(req.session.task)
            .then(() => {
                // task.getAncestorsUsers()
                // .then(users => {
                //     console.log('checking task ancestors')
                //     users.filter(user => user.id === req.session.user.id).length > 0 &&
                //     User.getById(req.session.user.id)
                //     .then(user => user.removeTask(task.id))
                // })
            })
        })
        .then(() => res.redirect('test-react'))
    } else {
        console.log('prevented root task delete')
        res.redirect('test-react')
    }
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
