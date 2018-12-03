import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import CurrentTaskName from './CurrentTaskName'
import TaskSearch from './TaskSearch'
import ChildTasks from './ChildTasks'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTaskName: 'Collin\'s Life',
      tasks: [
        {
          id: 1,
          name: "Go Shopping",
          children: [4, 5]
        },
        {
          id: 2,
          name: "Mow Lawn",
          children: [6, 7]
        },
        {
          id: 3,
          name: "Walk Dog",
          children: [8, 9]
        },
      ],
      searchTasks: [],
      isSearching: false
    }
  }

  _updateTasks = (e) => {
    const searchTask = e.target.value.toLowerCase()
    console.log(searchTask)
    const searchTasks = this.state.tasks.filter(task => task.name.toLowerCase().includes(searchTask))
    this.setState({
      ...this.state,
      searchTasks: searchTasks,
      isSearching: searchTasks.length > 0 && searchTask.length > 0 ? true : false
    })
  }

  render() {
    return (
      <div className="App">
        <CurrentTaskName name={this.state.currentTaskName}/>
        <TaskSearch updateTasks={this._updateTasks}/>
        <ChildTasks tasks={this.state.isSearching ? this.state.searchTasks : this.state.tasks}/>
      </div>
    );
  }
}

export default App;
