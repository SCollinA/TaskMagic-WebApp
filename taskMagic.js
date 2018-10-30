
// elements from the page
const body = document.querySelector('body')
const parentTaskName = document.getElementById('parentTaskName')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')
// will load parent task from cache later
const parentTask = Task(parentTaskName.textContent)

// event listeners
addTaskButton.addEventListener('click', addNewTask)

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
    redrawChildTasks()
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
    newTask.addEventListener('click', selectTask)
    tasksDiv.appendChild(newTask)
}

function redrawChildTasks() {
    // empty tasks div
    while (tasksDiv.childElementCount > 0) {
        tasksDiv.firstElementChild.remove()
    }
    // add tasks back
    parentTask.children.forEach(childTask => {
        drawTask(childTask)
    })
}

function selectTask(event) {
    const taskDiv = event.target
    const taskName = taskDiv.firstElementChild.value
    parentTask.children.forEach(childTask => {
        if (childTask.name === taskName) {
            parentTask = childTask
            parentTaskName.textContent = childTask.name
        }
    })
    redrawChildTasks()
}

function getSearchTextValue() {
    return taskSearch.value
}


// // clone tasks for example
// for (let i = 0; i < 20; i++) {
//     let newTask = document.getElementsByClassName('task')[0].cloneNode(true)
//     tasksDiv.appendChild(newTask)
// }