
// elements from the page
const body = document.querySelector('body')
const taskSearch = document.getElementById('taskSearch')
const tasksDiv = document.querySelector('div.tasks')
const taskCellPrototype = tasksDiv.firstElementChild.cloneNode(true)
const addTaskButton = document.getElementById('addTask')


addTaskButton.addEventListener('click', addTask)

// get a task clone
function addTask() {
    // use prototype in case first task is not good clone choice
    let newTask = taskCellPrototype.cloneNode(true)
    let newTaskName = newTask.firstElementChild
    // no children to add to new task, so remove all text
    let newTaskChildrensNames = newTask.lastElementChild

    // save task to file here

    // update task appearance
    newTaskName.textContent = taskSearch.value
    newTaskChildrensNames.textContent = ''
    tasksDiv.appendChild(newTask)
    taskSearch.value = ''
}


// // clone tasks for example
// for (let i = 0; i < 20; i++) {
//     let newTask = document.getElementsByClassName('task')[0].cloneNode(true)
//     tasksDiv.appendChild(newTask)
// }