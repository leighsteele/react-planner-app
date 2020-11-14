import React from 'react'

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.task.text,
            isEditing: false
        }
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onSaveEdit = this.onSaveEdit.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    onClickEdit() {
        this.setState({ isEditing: !this.state.isEditing });
    }

    onSaveEdit() {
        this.setState({
            text: this.state.text,
            isEditing: false
        });

        this.props.handleEdit(this.state.text, this.props.id)
    }

    onTextChanged(event) {
        const input = event.target.value;

        this.setState({
            text: input
        });
    }

    handleOnKeyDown(event) {
        if (event.keyCode === 27) {
            this.setState({
                text: this.props.task.text,
                isEditing: false
            });
        }

        else if (event.keyCode === 13) {
            this.onSaveEdit()
        }
    }

    render() {
        return (
            <React.Fragment>
                <li className="list-group-item d-flex d-inline-flex" key={this.props.id}>
                        <span>
                        <button className="btn border-0 m-0 p-0 pr-3" onClick={() => this.props.handleDoneClick(this.props.id)}>
                            {this.props.task.completed ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}
                        </button>
                        </span>

                        {this.state.isEditing ?
                            <span style={{ width: "100%" }}>
                                <input className="form-control task-edit-input"
                                type="text"
                                value={this.state.text}
                                onChange={this.onTextChanged}
                                onKeyDown={this.handleOnKeyDown}
                                />
                            </span> : ''}
                        {this.state.isEditing ? '' : 
                            <span style={{ width: "100%" }}>
                                <input className="form-control bg-white border-0 task-edit-input"
                                type="text"
                                value={this.state.text}
                                disabled
                                />
                            </span>}

                        {this.state.isEditing ? <button onClick={this.onSaveEdit}><i className="fas fa-check"></i></button> : ''}
                        {this.state.isEditing ? '' : <button onClick={this.onClickEdit}><i className="far fa-edit"></i></button>}

                        <button onClick={() => this.props.handleFavoriteClick(this.props.id)}>
                            {this.props.task.favorite ? <i className="fas fa-star"></i> : <i className="far fa-star"></i>}
                        </button>
                        <button onClick={() => this.props.deleteTask(this.props.id)}>
                            <i className="far fa-trash-alt"></i>
                        </button>
                </li>
            </React.Fragment>
        )
    }
}

export default Task