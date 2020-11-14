import React from 'react';
import Task from './Task';


const TasksList = (props) => {

    return (
        <ul className="list-group list-group-flush">
            {props.tasksList.map(task =>
                <Task
                    task={task}
                    text={task.text}
                    id={task.id}
                    key={task.id}
                    completed={task.completed}
                    favorite={task.favorite}
                    handleDoneClick={props.handleDoneClick}
                    handleFavoriteClick={props.handleFavoriteClick}
                    deleteTask={props.deleteTask}
                    handleEdit={props.handleEdit}
                />
            )}
        </ul>
    )
}

export default TasksList