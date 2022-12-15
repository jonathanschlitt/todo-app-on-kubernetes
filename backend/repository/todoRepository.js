const {cassandraClient} = require("../config/db");
const crypto = require('crypto');

const INSERT_TODO_QUERY = 'INSERT INTO todo (id, user_id, name, description, active, deadline, showDetails) VALUES (?, ?, ?, ?, true, ?, true)'
// const UPDATE_TODO_QUERY = 'UPDATE user SET surname=?, lastname=?, email=?, password=? WHERE id=?'
const GET_TODOS_QUERY = 'SELECT * FROM todo WHERE user_id=?'
// const DELETE_TODO_QUERY = 'SELECT email FROM user WHERE email=? ALLOW FILTERING'


module.exports.insertToDo = async function insertToDo(user_id, name, description, active, deadline, showDetails) {
    let uuid = crypto.randomUUID();
    return await cassandraClient.execute(INSERT_TODO_QUERY, [uuid, user_id, name, description/*, active*/, deadline/*, showDetails*/])
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
    return await cassandraClient.execute(GET_TODOS_QUERY, [user_id])
        .then(
            result => {
                console.log(result)
            }
        )
        .catch(
            err => {
                console.log(err)
                return []
            }
        )
}
