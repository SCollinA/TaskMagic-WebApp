function parentCell(parents) {
    const parentNames = parents.map(parentHeaders).join('')
    return `
    <div class='taskCell'>
        ${parentNames}
    </div>
    `
}

function parentHeaders(parent) {
    return `
    <a class="task" href="/${parent.id}">
        <h6 class="taskName">${parent.name}</h6>
    </a>
    `
}

module.exports = parentCell