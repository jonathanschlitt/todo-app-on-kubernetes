const express = require('express');

const dataController = require('../controllers/dataController');
const passport = require('passport');

const router = express.Router();

router.get(
  '/todos',
  passport.authenticate('jwt', { session: false }),
  dataController.todoItems_get
);

router.post(
  '/todos',
  passport.authenticate('jwt', { session: false }),
  dataController.addTodoItem_post
);

router.put(
  '/todos/:id',
  passport.authenticate('jwt', { session: false }),
  dataController.updateTodoItem_put
);

router.delete(
  '/todos/:id',
  passport.authenticate('jwt', { session: false }),
  dataController.deleteTodoItem_delete
);

module.exports = router;
