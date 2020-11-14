import React from 'react';
import './App.css';
import TaskForm from './components/TaskForm.jsx'

function App() {
    return(
      <div className = "App" >
        <div className="App-body">
          <TaskForm/>
        </div>
      </div>
    );
}

export default App;
