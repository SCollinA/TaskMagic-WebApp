const db = require('./db')
const User = require('./User')

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
        const currentTime = new Date()
        currentTime.setHours(currentTime.getHours() - (currentTime.getTimezoneOffset() / 60)) 
        return db.one('insert into Tasks (name, active, time_created, time_changed) values ($1, $2, $3, $4) returning id', [name, true, currentTime, currentTime])
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
            return resultsArray.map(result => new User(result.id, result.name, result.pwhash))
        })
        // return db.any('select * from links where Task_id=$1', [this.id])
        // .then(resultsArray => Promise.all(resultsArray.map(result => User.getById(result.id))))
    }

    getChildren() {
        return db.any(`
        select t.id, t.name, t.active, t.time_created, t.time_changed 
        from tasks t 
            join 
            parents_children pc 
            on t.id=pc.child_task_id 
                join 
                tasks 
                on tasks.id=pc.parent_task_id 
                where tasks.id=$1 
        order by active desc, time_changed asc`, [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getParents() {
        return db.any(`
        select t.id, t.name, t.active, t.time_created, t.time_changed 
        from tasks t 
            join 
            parents_children pc 
            on t.id=pc.parent_task_id 
                join tasks 
                on tasks.id=pc.child_task_id 
        where tasks.id=$1
        order by active desc, time_changed asc`, [this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getParentsForUserId(userID) {
        return db.any(`
        select parent.*
        from tasks child
        join parents_children pc
        on child.id=pc.child_task_id
        join tasks parent
        on parent.id=pc.parent_task_id
        join users_tasks ut
        on ut.task_id=parent.id
        where ut.user_id=$1 and child.id=$2
        `, [userID, this.id])
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getAncestors() {
        return db.any(`
            select t.* from tasks
            join parents_children
            on child_task_id=tasks.id
            join tasks t
            on parent_task_id=t.id
            where tasks.id=12
        `)
        .then(resultsArray => resultsArray.map(result => new Task(result.id, result.name, result.active, result.time_created, result.time_changed)))
    }

    getAncestorsUsers() {
        const User = require('./User')
        return db.any(`
            select distinct users.* from tasks child
            join parents_children pc
            on pc.child_task_id=child.id
            join tasks parent
            on pc.parent_task_id=parent.id
            join users_tasks ut
            on ut.task_id=parent.id
            join users
            on users.id=ut.user_id
            where child.id=$1
        `, this.id)
        .then(userArray => userArray.map(user => new User(user.id, user.name, user.pwhash)))
    }

    // getActiveSiblingsAndCommonParentObject() {
    //     // get all parents for task, then get all children of those parents
    //     // make objects with parents and appropriate active children
    //     return db.any(`select * from tasks join parents_children pc on tasks.id=pc.`)
    // }
    
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

    setActive(active) {
        this.active = active
        const currentTime = new Date()
        currentTime.setHours(currentTime.getHours() - (currentTime.getTimezoneOffset() / 60)) 
        return db.result('update Tasks set active=$1, time_changed=$2 where id=$3', [this.active, currentTime, this.id])
    }

    // recursive method to set all descendants to matching active state
    setChildrenActive(active) {
        console.log(`setting ${this.name} ${active}`)
        return this.getChildren()
        .then(children => {
            return Promise.all(children.map(child => {
                return child.setActive(active)
                .then(() => child.setChildrenActive(active))
            }))
        })
    }

    addParent(parentTask) {
        return db.result('insert into parents_children (parent_task_id, child_task_id) values ($1, $2)', [parentTask.id, this.id])
        .then(() => {
            Task.getById(parentTask.id)
            .then(task => {
                console.log(`adding parent ${task.name}`)
                task.getAncestorsUsers()
                .then(users => {
                    users.forEach(user => {
                        console.log(`adding ${this.name} to ${user.name} ${users.length}`)
                        user.chooseTask(this.id)
                    })
                })
            })
        })
        // .then(() => {
        //     Task.getById(parentTask.id)
        //     .then(task => task.addChild(this))
        // })
    }

    removeParent(parentTask) {
        console.log(`removing parent ${parentTask.name}`)
        return db.result('delete from parents_children where parent_task_id=$1 and child_task_id=$2', [parentTask.id, this.id])
        // .then(() => {
        //     Task.getById(parentTask.id)
        //     .then(task => task.removeChild(this))
        // })
    }

    addChild(childTask) {
        return db.result('insert into parents_children (parent_task_id, child_task_id) values ($1, $2)', [this.id, childTask.id])
        // .then(() => {
        //     Task.getById(childTask.id)
        //     .then(task => task.removeParent(this))
        // })
    }

    removeChild(childTask) {
        return db.result('delete from parents_children where parent_task_id=$1 and child_task_id=$2', [this.id, childTask.id])
        // .then(() => {
        //     Task.getById(childTask.id)
        //     .then(task => task.removeParent(this))
        // })
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