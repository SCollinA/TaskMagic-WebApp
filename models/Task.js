const db = require('./db')

class Task {
    constructor(id, name, active, time_created, time_changed) {
        this.id = id
        this.name = name
        this.active = active
        this.time_created = time_created
        this.time_changed = time_changed
    }

    // create
    static add(name) {
        return db.one('insert into Tasks (name, active, time_created, time_changed) values ($1, $2, $3, $4) returning id', [name, true, new Date(), new Date()])
        .then(result => Task.getById(result.id))
        // .then(result => new Task(result.id, name, true))
    }
    
    // retrieve
    static getById(id) {
        return db.one(`select * from Tasks where id=$1`, [id])
        .then(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed))
    }

    static getByName(name) {
        return db.any('select * from Tasks where name ilike \'%$1:value%\'', [name])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    static getByActive(active) {
        return db.any('select * from Tasks where active=$1', [active])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }
    
    static getAll() {
        return db.any('select * from Tasks')
        // .then(resultsArray => Promise.all(resultsArray.map(result => Task.getById(result.id))))
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getUsers() {
        const User = require('./User')
        return db.any('select users.id, users.name, users.pwhash from users join users_Tasks ut on users.id=ut.user_id join Tasks on ut.Task_id=Tasks.id where Tasks.id=$1', [this.id])
        .then(resultsArray => {
            console.log(resultsArray, this)
            return resultsArray.map(result => new User(result.id, result.name, result.pwhash))
        })

        // return db.any('select * from links where Task_id=$1', [this.id])
        // .then(resultsArray => Promise.all(resultsArray.map(result => User.getById(result.id))))
    }

    getChildren() {
        return db.any('select t.id, t.name, t.active, t.time_created, t.time_changed from tasks t join parents_children pc on t.id=pc.child_task_id join tasks on tasks.id=pc.parent_task_id where tasks.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getParents() {
        return db.any('select t.id, t.name, t.active, t.time_created, t.time_changed from tasks t join parents_children pc on t.id=pc.parent_task_id join tasks on tasks.id=pc.child_task_id where tasks.id=$1', [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
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
        return db.result('update Tasks set active=$1, set time_changed=$2 where id=$3', [this.active, new Date(), this.id])
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