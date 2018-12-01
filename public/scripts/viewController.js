// const Task = require('../../models/Task')
// const User = require('../../models/User')
// elements from the page
const body = document.querySelector('body')
const currentTaskName = document.getElementById('currentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const taskSearchForm = document.getElementById('taskSearchForm')
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

//functions
function addNewTask(e) {
    // if there is text in taskSearch
    // update search results
    const searchText = getSearchTextValue()
    if (searchText) {
        // detect if return key was pressed
        if (e.keyCode == 13 || e.target.parentElement.id == 'addTask') {
            // needs to send post request to server
            document.taskSearchForm.submit()
            return
        }
    } else {
        redrawTasks()
    }
}

function redrawTasks() { 
    // remove back button if necessary
    if (backNav.firstElementChild.textContent == 'undefined') {
        backNav.style.visibility = 'hidden'
    } else {
        backNav.style.visibility = 'visible'
    }
}

// function isSearching() {
//     if (getSearchTextValue()) {
//         return true
//     }
//     return false
// }

function getSearchTextValue() {
    return taskSearch.value
}

// function drawSearchResults() {
//     emptyTasksDiv()
//     // add tasks back
//     drawChildren(searchTask)
// }

// function emptyTasksDiv() {
//     // empty tasks div
//     while (tasksDiv.childElementCount > 0) {
//         tasksDiv.firstElementChild.remove()
//     }
// }
redrawTasks()