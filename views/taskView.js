const taskView = function(header, children) {
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
    ${tasks(children)}
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
        <div class="userName">
            <h4>
        </div>
        <div class="navHeader">
            <a id="backNav" href="/task/${prevTask.name}">
                <h4>${prevTask.name}</h4>
            </a>
            <div class="currentTask">
                <h2 id="currentTaskName">${currentTask.name}</h2>
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

const tasks = function(children) {
   let taskNames = children.map(task).join('')

   return `
    <div class="tasks">
        ${taskNames}
    </div>
   `
}

const task = function(childTask) {
  return `
    <a class="task" href="">
        <h6 class="taskName">${childTask.name}</h6>
        <p class="childTaskName">${childTask.name}</p>
    </a>
  `
}

module.exports = {
    taskView,
    header,
}