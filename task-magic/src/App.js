import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import CurrentTaskName from './CurrentTaskName'
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
      ]
    }
  }

  render() {
    return (
      <div className="App">
        <CurrentTaskName name={this.state.currentTaskName}/>
        <ChildTasks tasks={this.state.tasks}/>
      </div>
    );
  }
}

export default App;
