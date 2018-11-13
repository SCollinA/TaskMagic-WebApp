const taskView = function(header, tasks) {
    // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/stylesheets/taskMagic.css" type="text/css">
    <title>Document</title>
  </head>
  <body>
    ${header}
    ${tasks}
    ${toolbar()}
    <script src="/scripts/viewController.js"></script>
  </body>
</html>
`}

const header = function(currentTask, prevTask) {
    if (!prevTask) {
        prevTask = {name: 'undefined'}
    }
    return `
    <div class="header">
        <div class="navHeader">
            <a id="backNav" href="/task/${prevTask.id}">
                <h4>${prevTask.name}</h4>
            </a>
            <div class="currentTask">
                <h2 id="currentTaskName">${currentTask.name}</h2>
            </div>
            <div>
                <form action="/logout" method="post">
                    <input type="submit" value="logout">
                </form>
            </div>
        </div>
        <form name="taskSearchForm" class="searchbar" method="post">
            <textarea name="taskSearch" id="taskSearch" cols="10" rows="0" wrap="off" maxlength="200"></textarea>
        </form>
    </div>
    `
}

const toolbar = function() {
    return `
    <div class="toolbar">
        <div id="addTask">
            <h4>+task</h4> 
        </div>
    </div>
    `
}

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
        <a class="task" href="/task/${childTask.id}">
            <h6 class="taskName">${childTask.name}</h6>
            <p class="childTaskName">${childNames}</p>
        </a>
        `
    })
}

module.exports = {
    taskView,
    header,
    taskCells,
}