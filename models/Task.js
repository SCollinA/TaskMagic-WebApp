const db = require('./db')

class Task {
    constructor(id, name, active) {
        this.id = id
        this.name = name
        this.active = active
    }

    // create
    static add(name) {
        return db.one('insert into Tasks (name, active) values ($1, $2) returning id', [name, true])
        .then(result => Task.getById(result.id))
        // .then(result => new Task(result.id, name, true))
    }
    
    // retrieve
    static getById(id) {
        return db.one(`select * from Tasks where id=$1`, [id])
        .then(result => new Task(result.id, result.name, result.active))
    }

    static getByName(name) {
        return db.any('select * from Tasks where name ilike \'%$1:value%\'', [name])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }

    static getByActive(active) {
        return db.any('select * from Tasks where active=$1', [active])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }
    
    static getAll() {
        return db.any('select * from Tasks')
        // .then(resultsArray => Promise.all(resultsArray.map(result => Task.getById(result.id))))
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }

    getUsers() {
        const User = require('./User')

        return db.any('select users.id, users.name, users.pwhash from users join users_Tasks ut on users.id=ut.user_id join Tasks on ut.Task_id=Tasks.id where Tasks.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new User(result.id, result.name, result.pwhash)))

        // return db.any('select * from links where Task_id=$1', [this.id])
        // .then(resultsArray => Promise.all(resultsArray.map(result => User.getById(result.id))))
    }

    getChildren() {
        return db.any('select t.id, t.name, t.active from tasks t join parents_children pc on t.id=pc.child_task_id join tasks on tasks.id=pc.parent_task_id where tasks.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }

    getParents() {
        return db.any('select t.id, t.name from tasks t join parents_children pc on t.id=pc.parent_task_id join tasks on tasks.id=pc.child_task_id where tasks.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active)))
    }
    
    // update  
    updateName(newName) {
        this.name = newName
        return db.result('update Tasks set name=$1 where id=$2', [newName, this.id])
    }
    
    assignToUser(user_id) {
        // this.user_id = user_id
        return db.result('insert into users_Tasks (user_id, Task_id) values ($1, $2)', [user_id, this.id])
    }

    removeFromUser(user_id) {
        return db.result('delete from users_Tasks where user_id=$1 and Task_id=$2', [user_id, this.id])
    }

    toggleActive() {
        this.active = !this.active
        return db.result('update Tasks set active=$1 where id=$2', [this.active, this.id])
    }

    // addParent(parentTask) {
    //     return db.result('insert into parents_children (parent_task_id, child_task_id) values ($1, $2)', [parentTask.id, this.id])
    // }

    // removeParent(parentTask) {
    //     return db.result('delete from parents_children where parent_task_id=$1 and child_task_id=$2', [parentTask.id, this.id])
    // }

    addChild(task) {
        return db.result('insert into parents_children (parent_task_id, child_task_id) values ($1, $2)', [this.id, task.id])
    }

    removeChild(task) {
        return db.result('delete from parents_children where parent_task_id=$1 and child_task_id=$2', [this.id, task.id])
    }

    // delete
    delete() {
        return db.result(`delete from Tasks where id=$1`, [this.id])
    }

    static deleteById(id) {
        return db.result(`delete from Tasks where id=$1`, [id])
    }
}

module.exports = Task