// importing the axios instance with baseURL set to the backend server
import axios from '../../utils/axios';

// import axios from 'axios';

const API_URL = '/api/data/';

const getTodos = async (token) => {
  const response = await axios.get(API_URL + '/todos', {
    headers: {
      Authorization: `${token}`,
    },
  });
  // console.log(response);
  return response.data;
};

const addTodo = async (todo, token) => {
  const response = await axios.post(API_URL + 'todos', todo, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

const updateTodo = async (todo, token) => {
  const response = await axios.put(API_URL + `todos/${todo._id}`, todo, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

const deleteTodo = async (id, token) => {
  const response = await axios.delete(API_URL + `todos/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

const todoService = {
  getTodos,
  deleteTodo,
  addTodo,
  updateTodo,
};

export default todoService;
