
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
addTaskButton.addEventListener('click', addTask)

// objects
function Task(taskName) {
    return {
        name: taskName,
        parent: [],
        children: [],
        addTask(task) {
            this.children.push(task)
            task.parents.push(this)
        },
    }
}

//functions

// get a task clone
function addTask() {
    // don't add an unnamed task
    if (getSearchTextValue() == '') {
        return
    }
    // use prototype in case first task is not good clone choice
    let newTask = taskCellPrototype.cloneNode(true)
    let newTaskName = newTask.firstElementChild
    // no children to add to new task, so remove all text
    let newTaskChildrensNames = newTask.lastElementChild

    // save task to file here

    // update task appearance
    newTaskName.textContent = getSearchTextValue()
    newTaskChildrensNames.textContent = ''
    tasksDiv.appendChild(newTask)
    taskSearch.value = ''
}

function getSearchTextValue() {
    return taskSearch.value
}


// // clone tasks for example
// for (let i = 0; i < 20; i++) {
//     let newTask = document.getElementsByClassName('task')[0].cloneNode(true)
//     tasksDiv.appendChild(newTask)
// }