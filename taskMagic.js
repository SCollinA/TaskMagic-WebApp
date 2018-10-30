
// elements from the page
const body = document.querySelector('body')
const parentTaskName = document.getElementById('parentTaskName')
const backNav = document.getElementById('backNav')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')
// will load parent task from cache later
let parentTask = Task(parentTaskName.textContent)
let previousParent = parentTask

// event listeners
addTaskButton.addEventListener('click', addNewTask)
backNav.addEventListener('click', goBackToTask)
// objects
function Task(taskName='') {
    return {
        name: taskName,
        parents: [],
        children: [],
        addTask(task) {
            this.children.push(task)
            task.parents.push(this)
        },
    }
}

//functions

// get a task clone
function addNewTask() {
    // don't add an unnamed task
    if (getSearchTextValue() == '') {
        return
    }
    // save task to file here
    parentTask.addTask(Task(getSearchTextValue()))

    // update page
    redrawTasks()
    taskSearch.value = ''
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
    backNav.textContent = previousParent.name

    // remove back button if necessary
    if (!parentTask.parents.length > 0) {
        backNav.style.visibility = 'hidden'
    } else {
        backNav.style.visibility = 'visible'
    }

    // empty tasks div
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
    // add tasks back
    parentTask.children.forEach(childTask => {
        drawTask(childTask)
    })
}

function selectTask(task) {
    previousParent = parentTask
    parentTask = task
    redrawTasks()
}

function goBackToTask() {
    parentTask = previousParent
    redrawTasks()
}

function getSearchTextValue() {
    return taskSearch.value
}


// // clone tasks for example
// for (let i = 0; i < 20; i++) {
//     let newTask = document.getElementsByClassName('task')[0].cloneNode(true)
//     tasksDiv.appendChild(newTask)
// }