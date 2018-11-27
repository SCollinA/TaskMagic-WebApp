function parentCells(parents) {
    return Promise.all(parents.map(parentCell))
    .then(parentElements => {
       let parentElementsString = parentElements.join('')
       return `
       <div class="parents">
            ${parentElementsString}
       </div>
       `
    })
}

function parentCell(parentTask) {
    return parentTask.getParents()
    .then(parents => parents.map(parent => parent.name).join(', '))
    .then(parentNames => {
        return `
        <div class='taskCell'>
            <a class="task" href="/${parentTask.id}">
                <h6 class="taskName">${parentTask.name}</h6>
                <p class="parentTaskName">${parentNames}</p>
            </a>
        </div>
        `
    })
}

module.exports = parentCells