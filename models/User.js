const db = require('./db')
const Task = require('./Task')

class User {
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    // Create
    static add(name) {
        return db.one('insert into users (name) values ($1) returning id', [name])
        .then(result => new User(result.id, result.name))
    }
    
    // Retrieve
    static getById(id) {
        return db.one('select * from users where id=$1:raw', [id])
        .then(result => new User(result.id, result.name))
    }

    static getByName(name) {
        return db.one('select * from users where name=\'$1:raw\'', [name])
        .then(result => new User(result.id, result.name))
    }
    
    static getAll() {
        return db.any('select * from users')
        .then(resultsArray => resultsArray.map(result => new User(result.id, result.name)))
    }

    getAllTasks() {
        return db.any('select Tasks.id, Tasks.name, Tasks.completed from Tasks join users_Tasks ut on Tasks.id=ut.Task_id join users on ut.user_id=users.id where users.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }

    rootTask() {
        return db.one(`select userTasks.id, userTasks.name, userTasks.active
        from (select t.id, t.name, t.active from tasks t
                        join
                      users_tasks ut
                          on ut.task_id=t.id
                          where ut.user_id=$1) as userTasks
        join
        (select ta.id, ta.name, ta.active, allChildren.id as acID 
                from tasks ta
                    left join
                (select tsks.id, tsks.name, tsks.active 
                     from tasks tsks
                        join
                          parents_children pc
                          on tsks.id=pc.child_task_id) as allChildren
                on allChildren.id=ta.id
                where allChildren.id is NULL) as rootTask
        on userTasks.id=rootTask.id`, [this.id])
        .then(result => new Task(result.id, result.name, result.active))
    }
    
    // Update
    updateName(newName) {
        this.name = newName
        return db.result('update users set name=$1 where id=$2', [newName, this.id])
    }

    chooseTask(todo_id) {
        return db.result('insert into users_tasks (user_id, todo_id) values ($1, $2)', [this.id, task_id])
    }

    removeTask(todo_id) {
        return db.result('delete from users_tasks where user_id=$1 and task_id=$2', [this.id, task_id])
    }
    
    // Delete
    delete() {
        // need to make a join to remove references to this user on users_todos
        return db.result('delete from users_tasks where user_id=$1', [this.id])
        .then(() => db.result('delete from users where id=$1', [this.id]))
    }
    
    static deleteById(id) {
        return db.result('delete from users_tasks where user_id=$1', [id])
        .then(() => db.result('delete from users where id=$1', [id]))
    }
}

module.exports = User