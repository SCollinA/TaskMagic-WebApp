window.location = '/taskMagic.html';

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


app.get('/', (req, res) => res.send('Try /userName'))

// define endpoints
// listen for get requests
app.get('/:userName([A-Z]+)', (req, res) => {
    User.getByName(req.params.userName)
    .then(user => {
        localStorage.setItem(userName, JSON.stringify(user.name))
        user.rootTask().then(task => {
            res.send(taskView(task))
        })
    })
})

app.listen(port, () => console.log(`My Task App listening on port ${port}!`))
