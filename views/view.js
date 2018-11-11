const page = function(tasks) {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
    <link rel="stylesheet" href="/stylesheets/taskMagic.css">
    <title>Document</title>
  </head>
  <body>
    ${header(Task.previousTasks[Task.previousTasks.length - 1])}
    ${tasks(tasks)}
    ${toolbar()}
    <script src="views/viewController.js"></script>
  </body>
</html>
`}

const header = function(parentTask) {
    return `
    <div class="header">
        <div class="navHeader">
            <div id="backNav">
                <h4>< Grandparent Task</h4>
            </div>
            <div class="parentTask">
                <h2 id="parentTaskName">Parent Task</h2>
            </div>
        </div>
        <div class="searchbar">
            <textarea name="taskSearch" id="taskSearch" cols="10" rows="0" wrap="off" maxlength="200"></textarea>
        </div>
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

const tasks = function(tasks) {
   taskNames = tasks.map(task).join('')
   return `
    <div class="tasks">
        ${taskNames}
    </div>
   `
}

const task = function(task) {
  return `
    <div class="task">
        <h6 class="taskName">${task.name}</h6>
        <p class="childTaskName">${task.name}</p>
    </div>
  `
}

module.exports = page