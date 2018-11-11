const Task = require('../models/Task')

// elements from the page
const body = document.querySelector('body')
const currentParentTaskName = document.getElementById('currentParentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')


let searchTask = new Task('Searching...')
let previousParents = []
let currentParentTask = function() {
    return previousParents[previousParents.length - 1]
}

// event listeners
//prevent newline on return in textarea
taskSearch.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        e.preventDefault()
    }
})
// add new task on return in textarea
taskSearch.addEventListener('keyup', e => {
    // if there is text in taskSearch
    // update search results
    const searchText = getSearchTextValue()
    if (searchText) {
        // detect if return key was pressed
        if (e.keyCode == 13) {
            addNewTask(searchText)
            return
        }
        updateSearchResults(searchText)
    } else {
        redrawTasks()
    }
})
addTaskButton.addEventListener('click', addNewTask)
backNav.addEventListener('click', goBackToTask)
//functions

function addNewTask(searchText) {
    // create the new task
    currentParentTask.addChild(searchText, true, [])

    // update page
    redrawTasks()
    taskSearch.value = ''
}

function rootTask() {
    if (previousParents.length > 0) {
        return previousParents[previousParents.length - 1]
    } else {
        return currentParentTask
    }
}

function getAllTasks() {
    let allTasks = []
    rootTask().children.forEach(childTask => {
        allTasks.push(childTask)
        getAllChildren(childTask).forEach(grandchild => {
            allTasks.push(grandchild)
        })
    })
    allTasks.sort((task1, task2) => task1.name > task2.name)
    return allTasks
}

function getAllChildren(task) {
    let allChildren = []
    task.children.forEach(childTask => {
        allChildren.push(childTask)
        getAllChildren(childTask).forEach(grandchild => {
            allChildren.push(grandchild)
        })
    })
    return allChildren
}

function drawTask(task) {
    // use prototype in case first task is not good clone choice
    let newTask = taskCellPrototype.cloneNode(true)
    let newTaskName = newTask.firstElementChild
    // no children to add to new task, so remove all text
    let newTaskChildrensNames = newTask.lastElementChild
    newTaskName.textContent = task.name
    newTaskChildrensNames.textContent = task.children.map(childTask => childTask.name).join(', ')
    newTask.addEventListener('click', event => {
        const taskDiv = event.target
        const taskName = taskDiv.firstElementChild.textContent
        let selectedTask
        currentParentTask.children.forEach(childTask => {
            if (childTask.name === taskName) {
                selectedTask = childTask
            }
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
    drawChildren(currentParentTask)
    saveTasks()
}

function selectTask(task) {
    previousParents.unshift(currentParentTask)
    currentParentTask = task
    redrawTasks()
}

function goBackToTask() {
    currentParentTask = previousParents.shift()
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
    task.children.forEach(childTask => {
        drawTask(childTask)
    })
}

function emptyTasksDiv() {
    // empty tasks div
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
}
redrawTasks()