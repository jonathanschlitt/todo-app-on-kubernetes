const {cassandraClient} = require("../config/db");

const INSERT_USER_QUERY = 'INSERT INTO user (id, surname, lastname, email, password) VALUES (uuid(), ?, ?, ?, ?)'
const UPDATE_USER_QUERY = 'UPDATE user SET surname=?, lastname=?, email=?, password=? WHERE id=?'
const GET_USER_BY_ID_QUERY = 'SELECT * FROM user WHERE id=? ALLOW FILTERING'
const GET_USER_QUERY = 'SELECT * FROM user WHERE email=?  ALLOW FILTERING'
const IS_EMAIL_USED_QUERY = 'SELECT email FROM user WHERE email=? ALLOW FILTERING'

module.exports.insertUser = async function insertUser(surname, lastname, email, password) {
    return await cassandraClient.execute(INSERT_USER_QUERY, [surname, lastname, email, password])
}

module.exports.updateUser = async function updateUser(uuid, surname, lastname, email, password) {
    return await cassandraClient.execute(UPDATE_USER_QUERY, [surname, lastname, email, password, uuid])
}

module.exports.getUserById = async function getUserByUuid(uuid) {
    console.log("getUserById called with uuid = " + uuid)
    return await cassandraClient.execute(GET_USER_BY_ID_QUERY, [uuid])
        .then(
            result => {
                return result.rows[0]
            }
        )
        .catch(
            error => {
                console.log("userRepository: getUserById failed = " + error)
                return null
            }
        )
}

module.exports.getUser = async function getUser(email) {
    console.log("getUser called with email = " + email )
    return await cassandraClient.execute(GET_USER_QUERY, [email])
        .then(
            result => {
                console.log(result.rows)
                return result.rows[0]
            }
        )
        .catch(
            error => {
                console.log("userRepository: getUser failed = " + error)
                return null
            }
        )
}

module.exports.userExists = async function isEmailUsed(email) {
    console.log("userExists called with email = " + email)
    return await cassandraClient.execute(IS_EMAIL_USED_QUERY, [email], {allowFiltering: true})
        .then(
            result => {
                return result.rowLength !== 0
            }
        )
        .catch(
            (err) => {
                console.log("userRepository: userExists failed = " + err)
                return false
            }
        )

    //
    // console.log(asd)
        // .then(
        //     count => {
        //         console.log(count)
        //         return true
        //     }
        // ).catch(
        //     error => {
        //         // console.log(error)
        //         return false
        //     }
        // )

    // console.log(result)


    //     .then(
    //     count => {
    //         console.log(count)
    //         return true
    //     },
    //     error => {
    //         console.log(error)
    //         return false
    //     }
    // )
}
