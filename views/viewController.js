const Task = require('../models/Task')
const User = require('../models/User')
// elements from the page
const body = document.querySelector('body')
const currentTaskName = document.getElementById('currentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')

const currentUserName = localStorage.getItem(userName)
const currentUser = User.getByName(currentUserName)

const currentTask = Task.getByName(currentTaskName.textContent)
const previousParents = []
const searchTask = new Task('Searching...')
// event listeners
//prevent newline on return in textarea
taskSearch.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        e.preventDefault()
    }
})
// add new task on return in textarea
taskSearch.addEventListener('keyup', addNewTask)
addTaskButton.addEventListener('click', addNewTask)
backNav.addEventListener('click', goBackToTask)
//functions

function addNewTask(event) {
    // if there is text in taskSearch
    // update search results
    const searchText = getSearchTextValue()
    if (searchText) {
        // detect if return key was pressed
        if (e.keyCode == 13) {
            Task.add(searchText)
            .then(task => currentTask.addChild(task))
            return
        }
        updateSearchResults(searchText)
    } else {
        redrawTasks()
    }
}

function drawTask(task) {
    // use prototype in case first task is not good clone choice
    let newTask = taskCellPrototype.cloneNode(true)
    let newTaskName = newTask.firstElementChild
    // no children to add to new task, so remove all text
    let newTaskChildrensNames = newTask.lastElementChild
    newTaskName.textContent = task.name
    task.getChildren()
    .then(children => {
        newTaskChildrensNames.textContent = children.map(childTask => childTask.name).join(', ')
    })
    newTask.addEventListener('click', event => {
        const taskDiv = event.target
        const taskName = taskDiv.firstElementChild.textContent
        let selectedTask
        currentTask.getChildren()
        .then(children => {
            children.forEach(childTask => {
                if (childTask.name === taskName) {
                    selectedTask = childTask
                }
            })
        })
        selectTask(selectedTask)
    })
    tasksDiv.appendChild(newTask)
}

function redrawTasks() {
    currentParentTaskName.textContent = currentParentTask.name
    
    // remove back button if necessary
    if (!previousParents.length > 0) {
        backNav.style.visibility = 'hidden'
    } else {
        backNav.style.visibility = 'visible'
        backNav.textContent = previousParents[0].name
    }

    // empty tasks div
    emptyTasksDiv()
    // add tasks back
    drawChildren(currentTask)
}

function selectTask(task) {
    previousParents.unshift(currentTask)
    currentTask = task
    redrawTasks()
}

function goBackToTask() {
    currentTask = previousParents.shift()
    redrawTasks()
}

function isSearching() {
    if (getSearchTextValue()) {
        return true
    }
    return false
}

function getSearchTextValue() {
    return taskSearch.value
}

function updateSearchResults(searchText) {
    searchTask.children = getAllTasks().filter(task => {
        if (task.name.includes(searchText)) {
            return true
        }
        return false
    })
    drawSearchResults()
}

function drawSearchResults() {
    emptyTasksDiv()
    // add tasks back
    drawChildren(searchTask)
}

function drawChildren(task) {
    task.getChildren()
    .then(children => {
        children.forEach(childTask => {
        drawTask(childTask)
        })
    })
}

function emptyTasksDiv() {
    // empty tasks div
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
}
redrawTasks()