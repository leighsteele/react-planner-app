import React from "react";
import TasksList from './TasksList';

import firebase from 'firebase';
import { config } from "../services/config";

class TaskForm extends React.Component {
    constructor(props) {
        super(props);

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        this.state = {
            currentTask: "",
            tasksList: []
        };
        this.addItemOnSubmit = this.addItemOnSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    //get data from firebase
    componentDidMount() {
        firebase.database().ref('/todos').once('value', (snapshot) => {
            const returnArray = [];

            snapshot.forEach(function (snap) {
                const item = snap.val();
                item.key = snap.key;

                returnArray.push(item);
            });

            this.setState({ tasksList: returnArray })
            return returnArray;
        });
    }

    writeListData(tasksArray) {
        const db = firebase.database();
        const ref = db.ref("todos/");

        tasksArray.forEach((task) => {
            ref.child(task.id).set({
                text: task.text,
                id: task.id,
                completed: task.completed,
                favorite: task.favorite
            })
        })
    }

    deleteData(taskId) {
        const db = firebase.database();
        const ref = taskId ? db.ref("todos/" + taskId) : db.ref("todos/");
        ref.remove();
    }

    addItemOnSubmit(event) {
        event.preventDefault();

        if (this.state.currentTask !== "") {
            const newTask = {
                text: this.state.currentTask,
                id: Date.now(),
                completed: false,
                favorite: false,
            };

            this.setState((prevState) => {
                return {
                    currentTask: "",
                    tasksList: [...prevState.tasksList, newTask],
                };
            });
        }
    }

    handleInputChange(event) {
        const input = event.target.value;

        this.setState({
            currentTask: input
        });
    }

    handleDoneClick(id) {
        const updatedTasks = this.state.tasksList.map(task => {
            if (id === task.id) {
                return { ...task, completed: !task.completed }
            }
            return task
        })

        this.setState(
            { tasksList: updatedTasks }
        )
    }

    handleFavoriteClick(id) {
        const updatedTasks = this.state.tasksList.map(task => {
            if (id === task.id) {
                return { ...task, favorite: !task.favorite }
            }
            return task
        })

        //sort by favorite at top of list and by date created
        const sortedTasks = updatedTasks.sort((a, b) => b.favorite - a.favorite || a.id - b.id)

        this.setState(
            { tasksList: sortedTasks }
        )
    }

    handleEdit(editedTaskText, id) {
        const updatedTasks = this.state.tasksList.map(task => {
            if (id === task.id) {
                return { ...task, text: editedTaskText }
            }
            return task
        })

        this.setState(
            { tasksList: updatedTasks }
        )
    }

    handleDelete(id) {
        this.deleteData(id);
        const newTasksList = [...this.state.tasksList.filter(task => id !== task.id)];
        this.setState(
            { tasksList: newTasksList }
        )
    }

    handleReset() {
        this.deleteData();
        this.setState(
            { tasksList: [] }
        )
    }

    render() {
        this.writeListData(this.state.tasksList)
        this.state.tasksList.sort((a, b) => b.favorite - a.favorite || a.id - b.id)

        let todoList = [];
        let doneList = [];
        this.state.tasksList.forEach(task => {
            if (!task.completed) {
                todoList.push(task)
            } else {
                doneList.push(task)
            }
        })

        let resetButton;
        if (todoList.length !== 0 || doneList.length !== 0) {
            resetButton = <button className="btn btn-outline-light mx-3 rounded-circle reset-btn" onClick={this.handleReset.bind(this)}><i className="fas fa-redo"></i></button>
        }

        return (
            <div className="main-div">
                <div className="form-div px-5 pt-3 mx-5 mt-5">
                    <form onSubmit={this.addItemOnSubmit}>
                        <div className="input-group mb-3">
                            <input
                                className="form-control form-control-lg"
                                type="text" value={this.state.currentTask}
                                placeholder="Enter new task"
                                onChange={this.handleInputChange}>
                            </input>
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary btn-lg m-0 rounded-right" type="submit">Add task</button>
                            </div>
                            {resetButton}
                        </div>
                    </form>
                </div>

                <div className="m-5" >
                    <h5 className="bg-primary text-white p-3 m-0 font-weight-light">To Do</h5>
                    <TasksList tasksList={todoList} handleDoneClick={this.handleDoneClick.bind(this)} handleFavoriteClick={this.handleFavoriteClick.bind(this)} handleDelete={this.handleDelete.bind(this)} handleEdit={this.handleEdit.bind(this)} />
                </div>

                <div className="m-5" >
                    <h5 className="bg-primary text-white p-3 m-0 font-weight-light">Done</h5>
                    <TasksList tasksList={doneList} handleDoneClick={this.handleDoneClick.bind(this)} handleFavoriteClick={this.handleFavoriteClick.bind(this)} handleDelete={this.handleDelete.bind(this)} handleEdit={this.handleEdit.bind(this)} />
                </div>
            </div>
        );
    }
}

export default TaskForm;