const taskbar = require('./taskbar')

const taskView = function(taskNav, taskCells) {
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
    ${taskNav}
    ${taskCells}
    ${taskbar()}
    <script src="/scripts/viewController.js"></script>
  </body>
</html>
`}

module.exports = taskView