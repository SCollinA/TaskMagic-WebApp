import React, {Component} from 'react'
import ChildTask from './ChildTask'

export default class ChildTasks extends Component {
    constructor(props) {
        super(props)
        this.tasks = props.tasks
    }

    render() {
        return (
            <div className="childTasksContainer">
                {this.tasks.map(task => {
                    return <ChildTask task={task} key={task.id}/>
                })}
            </div>
        )
    }
}