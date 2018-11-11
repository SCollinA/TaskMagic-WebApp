const bodyParser = require('body-parser')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const User = require('./models/User')

const taskViewTemplate = require('./views/taskView.js')
const taskView = taskViewTemplate.taskView
const headerView = taskViewTemplate.header


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
                res.send(taskView(header, children))
            })
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
