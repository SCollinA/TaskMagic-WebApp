const taskCells = function(children) {
    return Promise.all(children.map(taskCell))
    .then(taskElements => {
       let taskElementsString = taskElements.join('')
       return `
       <div class="tasks">
            ${taskElementsString}
       </div>
       `
    })
}

const taskCell = function(childTask) {
    return childTask.getChildren()
    .then(children => children.map(child => child.name).join(', '))
    .then(childNames => {
        return `
        <div class='taskCell'>
            <a class="task" href="/${childTask.id}">
                <h6 class="taskName">${childTask.name}</h6>
                <p class="childTaskName">${childNames}</p>
            </a>
            <a class="taskComplete" href="/complete/${childTask.id}">
            </a>
        </div>
        `
    })
}

module.exports = taskCells