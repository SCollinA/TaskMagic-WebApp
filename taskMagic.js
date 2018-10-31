
// elements from the page
const body = document.querySelector('body')
const parentTaskName = document.getElementById('parentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')
// will load parent task from cache later
let loadedTask = JSON.parse(localStorage.getItem('rootTask'))
let parentTask = (loadedTask) ? loadedTask : new Task(parentTaskName.textContent)
let searchTask = new Task('Searching...')
let previousParents = [parentTask]

// event listeners
taskSearch.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        e.preventDefault()
    }
})
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
    }
})
addTaskButton.addEventListener('click', addNewTask)
backNav.addEventListener('click', goBackToTask)
// objects
function Task(taskName='') {
    this.name = taskName
    this.children = []
    // can not save functions
    // this.addTask = function(task) {
    //     this.children.push(task)
    // }
}

//functions

// get a task clone
function addNewTask(searchText) {
    // save task to file here
    parentTask.children.push(new Task(searchText))

    // update page
    redrawTasks()
    taskSearch.value = ''
}

function saveTasks() {
    localStorage.setItem('rootTask', JSON.stringify(rootTask()))
}

function rootTask() {
    return previousParents[previousParents.length - 1]
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
        parentTask.children.forEach(childTask => {
            if (childTask.name === taskName) {
                selectedTask = childTask
            }
        })
        selectTask(selectedTask)
    })
    tasksDiv.appendChild(newTask)
}

function redrawTasks() {
    parentTaskName.textContent = parentTask.name
    
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
    drawChildren(parentTask)
    saveTasks()
}

function selectTask(task) {
    previousParents.unshift(parentTask)
    parentTask = task
    redrawTasks()
}

function goBackToTask() {
    parentTask = previousParents.shift()
    redrawTasks()
}

function getSearchTextValue() {
    return taskSearch.value
}

function updateSearchResults(searchText) {

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