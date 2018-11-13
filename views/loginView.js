function loginView() {
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
            ${loginForm()}
        </body>
    </html>
    `
}

function loginForm() {
    return `
    <form action="/login" method="POST">
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
        <input type="submit" value="Login">
    </form>
    <a href="/register">Register</a>    
    `;
}

module.exports = loginView;