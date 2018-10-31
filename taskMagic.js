
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
let previousParents = []

// event listeners
addTaskButton.addEventListener('click', addNewTask)
backNav.addEventListener('click', goBackToTask)
// objects
function Task(taskName='') {
    this.name = taskName
    this.children = []
}

//functions

// get a task clone
function addNewTask() {
    // don't add an unnamed task
    if (getSearchTextValue() == '') {
        return
    }
    // save task to file here
    parentTask.children.push(new Task(getSearchTextValue()))

    // update page
    redrawTasks()
    taskSearch.value = ''
}

function saveTasks() {
    localStorage.setItem('rootTask', JSON.stringify(rootTask()))
}

function rootTask() {
    if (previousParents.length > 0) {
        return previousParents[previousParents.length - 1]
    } else {
        return parentTask
    }
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
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
    // add tasks back
    parentTask.children.forEach(childTask => {
        drawTask(childTask)
    })
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

redrawTasks()