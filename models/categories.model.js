const db = require('../db/connection.js');

exports.fetchCategories = () => {
    const query = `SELECT * FROM categories;`;
    return db.query(query)
        .then((result) => {
            return result.rows
        })
}