const db = require('../db/connection.js');

exports.fetchUsers = () => {
    const query = `
    SELECT * FROM users;
    `
    return db.query(query)
        .then((result) => {
            return result.rows
        })
}

exports.fetchUserByUsername = (username) => {
    const query = `
    SELECT * FROM users
    WHERE username = $1;
    `
    return db.query(query, [username])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Error 404: Not found.' })
            }
            return result.rows[0]
        })
}