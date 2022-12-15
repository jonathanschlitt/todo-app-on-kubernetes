const jwt = require('jsonwebtoken');
const todoRepository = require("../repository/todoRepository");
const env = require('dotenv').config();

addTodoItem_post = async (req, res) => {
  let {name, description, active, showDetails, deadline } = req.body;

  let user = await req.user

  if (user !== undefined && user != null) {
    console.log(active)
    console.log(showDetails)
    todoRepository.insertToDo(user.id, name, description, active, showDetails, deadline)
        .then(
          todoId => {
            console.log(todoId)
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

  let todos = await todoRepository.getToDos(user.id)

  console.log(todos)

  res.status(200).json([
    {
      _id: 1,
      user_id: 1,
      name: 'Task 1',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
    {
      _id: 2,
      user_id: 1,
      name: 'Task 2',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
    {
      _id: 3,
      user_id: 1,
      name: 'Task 3',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
    {
      _id: 4,
      user_id: 1,
      name: 'Task 4',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
    {
      _id: 5,
      user_id: 1,
      name: 'Task 5',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
    {
      _id: 6,
      user_id: 1,
      name: 'Task 6',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora itaque inventore numquam quibusdam consequatur, delectus laborum odio totam repellendus, nemo reiciendis quae perferendis sunt magni.',
      active: true,
      deadline: '24.12.2022',
      showDetails: false,
    },
  ]);
};

updateTodoItem_put = async (req, res) => {
  const id = req.params.id;

  const { name, description, active, showDetails, deadline } = req.body;

  const todoItem = {
    name,
    description,
    active,
    showDetails,
    deadline,
  };

  const todoItemUpdated = true;

  if (todoItemUpdated) {
    res.status(201).json(todoItem);
  } else {
    res.status(500);
    throw new Error('Updating data failed!');
  }
};

deleteTodoItem_delete = async (req, res) => {
  const id = req.params.id;

  const todoItemDeleted = true;

  if (todoItemDeleted) {
    res.status(200).json(id);
  } else {
    res.status(400);
    throw new Error('todoItem not found in the database');
  }
};

module.exports = {
  addTodoItem_post,
  todoItems_get,
  updateTodoItem_put,
  deleteTodoItem_delete,
};
