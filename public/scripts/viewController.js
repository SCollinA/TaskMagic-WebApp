// const Task = require('../../models/Task')
// const User = require('../../models/User')
// elements from the page
const body = document.querySelector('body')
const currentTaskName = document.getElementById('currentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const tasks = document.querySelectorAll('a.task')
const addTaskButton = document.getElementById('addTask')

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
backNav.setAttribute('href', `/task/`)
tasks.forEach(task => {
    const taskName = task.firstElementChild.textContent
    task.setAttribute('href', `/task/${taskName}`)
})
//functions

function addNewTask(e) {
    // if there is text in taskSearch
    // update search results
    const searchText = getSearchTextValue()
    if (searchText) {
        // detect if return key was pressed
        if (e.keyCode == 13) {
            // needs to send post request to server

            Task.add(searchText)
            .then(task => currentTask.addChild(task))
            return
        }
        updateSearchResults(searchText)
    } else {
        redrawTasks()
    }
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
    currentUser.getAllTasks()
    .then(tasks => {
        tasks.filter(task => {
            if (task.name.includes(searchText)) {
                return true
            }
            return false
        }).forEach(task => searchTask.addChild(task))
        .then(() => drawSearchResults())
    })
}

function drawSearchResults() {
    emptyTasksDiv()
    // add tasks back
    drawChildren(searchTask)
}

// function drawChildren(task) {
//     task.getChildren()
//     .then(children => {
//         children.forEach(childTask => {
//         drawTask(childTask)
//         })
//     })
// }

function emptyTasksDiv() {
    // empty tasks div
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
}
redrawTasks()