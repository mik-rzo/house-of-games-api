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