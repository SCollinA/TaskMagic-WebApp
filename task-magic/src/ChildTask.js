import React, {Component} from 'react'

export default class ChildTask extends Component {
    constructor(props) {
        super(props)
        this.task = props.task
        this.state = {
            active: false
        }
    }

    _toggleComplete() {
        this.setState({active: !this.state.active})
    }

    render() {
        return (
            <div className="taskCell">
                <h4>{this.task.name}</h4>
                <h6>{this.task.children}</h6>
                <button onClick={() => this._toggleComplete()}/>
            </div>
        )
    }
}