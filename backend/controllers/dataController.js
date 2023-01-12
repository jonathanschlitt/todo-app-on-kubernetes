const jwt = require('jsonwebtoken');
const todoRepository = require("../repository/todoRepository");
const env = require('dotenv').config();

addTodoItem_post = async (req, res) => {
    let {name, description, active, showDetails, deadline} = req.body;

    if (showDetails === undefined) {
        showDetails = true
    }

    let user = await req.user

    if (user !== undefined && user != null) {
        todoRepository.insertToDo(user.id, name, description, active, deadline)
            .then(
                todoId => {
                    return res.status(200).json(
                        {
                            _id: todoId.toString(),
                            name: name,
                            description: description,
                            deadline: deadline,
                            active: active,
                            showDetails: showDetails
                        }
                    )
                }
            )
            .catch(
                err => {
                    console.log(err)
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server error!'
                    })
                }
            )
    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }


    //
    // if (newsItemCreated) {
    //   res.status(200).json(todoItem);
    // } else {
    //   res.status(500);
    //   throw new Error('Error creating todoItem!');
    // }
};

todoItems_get = async (req, res) => {

    let user = await req.user

    if (user === undefined || user == null) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized!'
        })
    }

    let todos = (await todoRepository.getToDos(user.id)).map(toDoToJson)
    res.status(200).json(
        todos
    )
};

updateTodoItem_put = async (req, res) => {

    let user = await req.user

    if (user === undefined || user == null) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized!'
        })
    }

    const id = req.params.id;

    const {name, description, active, showDetails, deadline} = req.body;

    const updatedTodo = todoRepository.updateToDo(
        id.toString(),
        active,
        deadline,
        deadline,
        name,
        showDetails
    )


    const todoItem = {
        _id: id.toString(),
        user_id: user.id.toString(),
        name: name,
        description: description,
        active: active,
        deadline: deadline,
        showDetails: showDetails,
    };

    if (updatedTodo) {
        res.status(201).json(todoItem);
    } else {
        res.status(500);
        throw new Error('Updating data failed!');
    }
};

deleteTodoItem_delete = async (req, res) => {
    let user = await req.user

    if (user === undefined || user == null) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized!'
        })
    }

    const id = req.params.id;

    const todoItemDeleted = todoRepository.deleteToDo(id);

    if (todoItemDeleted) {
        res.status(200).json(id);
    } else {
        res.status(400);
        throw new Error('todoItem not found in the database');
    }
};

function toDoToJson(todo) {
    return {
        _id: todo.id.toString(),
        user_id: todo.user_id.toString(),
        name: todo.name,
        description: todo.description,
        active: todo.active,
        deadline: todo.deadline,
        showDetails: todo.showdetails,
    }
}

module.exports = {
    addTodoItem_post,
    todoItems_get,
    updateTodoItem_put,
    deleteTodoItem_delete,
};
