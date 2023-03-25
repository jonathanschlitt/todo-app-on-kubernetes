const {cassandraClient} = require("../config/db");
const crypto = require('crypto');
const cassandra = require("cassandra-driver");

const INSERT_TODO_QUERY = 'INSERT INTO todo (id, user_id, name, description, active, deadline, showdetails) VALUES (?, ?, ?, ?, ?, ?, false)'
const UPDATE_TODO_QUERY = 'UPDATE todo SET active=?, deadline=?, description=?, name=?, showdetails=? WHERE id=?'
const GET_TODOS_QUERY = 'SELECT * FROM todo WHERE user_id=? ALLOW FILTERING'
const DELETE_TODO_QUERY = 'DELETE FROM todo WHERE id=?'


module.exports.insertToDo = async function insertToDo(user_id, name, description, active, deadline) {
    let uuid = crypto.randomUUID();
    return await cassandraClient.execute(INSERT_TODO_QUERY, [uuid, user_id, name, description, active, deadline], {consistency: cassandra.types.consistencies.quorum})
        .then(
            result => {
                return uuid
            }
        )
        .catch(
            err => {
                console.log(err)
                return null
            }
        )
}

module.exports.getToDos = async function getToDos(user_id) {
    return await cassandraClient.execute(GET_TODOS_QUERY, [user_id], {consistency: cassandra.types.consistencies.quorum})
        .then(
            result => {
                return result.rows
            }
        )
        .catch(
            err => {
                console.log(err)
                return []
            }
        )
}

module.exports.deleteToDo = async function deleteToDo(todo_id) {
    return await cassandraClient.execute(DELETE_TODO_QUERY, [todo_id], {consistency: cassandra.types.consistencies.quorum})
        .then(
            result => {
                return true
            }
        )
        .catch(
            err => {
                console.log(err)
                return false
            }
        )
}

module.exports.updateToDo = async function deleteToDo(todo_id, active, deadline, description, name, showdetails) {
    return await cassandraClient.execute(UPDATE_TODO_QUERY, [active, deadline, description, name, showdetails, todo_id], {consistency: cassandra.types.consistencies.quorum})
        .then(
            result => {
                return true
            }
        )
        .catch(
            err => {
                console.log(err)
                return false
            }
        )
}
