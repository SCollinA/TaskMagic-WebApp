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
const setUser = taskViewTemplate.setUser


app.get('/', (req, res) => res.send('Try /userName'))

// define endpoints
// listen for get requests
app.get('/:userName([A-Z]+)', (req, res) => {
    User.getByName(req.params.userName)
    // .then(console.log)
    .then(users => {
        users[0].rootTask().then(task => {
            task.getChildren()
            .then(children => {
                const header = headerView(task)
                setUser(users[0])
                res.send(taskView(header, children))
            })
        })
    })
})

app.get('/:userName([A-Z]+)/:taskID([0-9]+)', (req, res) => {
    Task.getById(req.params.taskID)
    .then(task => {
        task.getChildren()
        .then(children => {
            const header = headerView(task)
            res.send(taskView(header, children))
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
