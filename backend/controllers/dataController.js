addTodoItem_post = async (req, res) => {
  let { name, description, active, showDetails, deadline } = req.body;

  const todoItem = {
    name,
    description,
    deadline,
    active,
    showDetails,
    _id: '99999999999',
  };

  const newsItemCreated = true;

  if (newsItemCreated) {
    res.status(200).json(todoItem);
  } else {
    res.status(500);
    throw new Error('Error creating todoItem!');
  }
};

todoItems_get = async (req, res) => {
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
