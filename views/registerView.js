function registerView() {
  return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link rel="stylesheet" href="stylesheets/login.css">
          <title>Document</title>
      </head>
      <body>
          ${registerForm()}
      </body>
  </html>
  `
}

function registerForm() {
  return `
  <form action="/register" method="POST">
      <label>
          Username:
          <input type="text" name="username">
      </label>
      <br>
      <label>
          Password:
          <input type="password" name="password">
      </label>
      <br>
      <input type="submit" value="register">
  </form>    
  `
}

module.exports = registerView