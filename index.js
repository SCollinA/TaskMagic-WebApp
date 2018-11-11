window.location = '/taskMagic.html';

const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const Task = require('./models/Task')
const User = require('./models/User')

const pageTemplate = require('./views/view.js')
const page = pageTemplate.page
const list = pageTemplate.list

// app.get('/', (req, res) => {
//     res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <meta http-equiv="X-UA-Compatible" content="ie=edge">
//             <title>Document</title>
//         </head>
//         <body>
//             <h1>Hello again.</h1>
//         </body>
//     </html>
//     `)
// })


app.get('/', (req, res) => res.send('Try /users or /tasks'))

// define endpoints
// listen for get requests
app.get('/users', (req, res) => {
    User.getAll()
    .then(users => {
        const content = list(users)
        res.send(page(content))
    })
})

// listen for post requests
app.post('/users', (req, res) => {
    const newUserName = req.body.name
    User.add(newUserName)
    .then(user => {
        res.send(user)
    })
})

app.get('/tasks', (req, res) => {
    Task.getAll()
    .then(tasks => {
        res.send(page(tasks))
    })
})

// define routing parameters
app.get('/users/byId/:id([0-9]+)', (req, res) => {
    User.getById(req.params.id)
    .then(user => {
        res.send(user)
    })
})

app.post('/users/byId/:id([0-9]+)', (req, res) => {
    const newName = req.body.name
    User.getById(req.params.id)
    .then(user => {
        user.updateName(newName).then(() => {
            res.send(user)
        })
    })
})


app.get('/users/byName/:name([A-Z|a-z]+)', (req, res) => {
    User.getByName(req.params.name)
    .then(users => {
        res.send(users)
    })
})

app.get('/tasks/byId/:id([0-9]+)', (req, res) => {
    Task.getById(req.params.id)
    .then(task => {
        res.send(task)
    })
})

app.get('/tasks/byName/:name([A-Z | a-z]+)', (req, res) => {
    Task.getByName(req.params.name)
    .then(tasks => {
        res.send(tasks)
    })
})

app.get('/tasks/byCompleted', (req, res) => {
    Task.getByCompleted(true)
    .then(tasks => {
        res.send(tasks)
    })
})

app.get('/tasks/byPending', (req, res) => {
    Task.getByCompleted(false)
    .then(tasks => {
        res.send(tasks)
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
