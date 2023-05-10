const db = require('../db/connection.js');

exports.fetchReviewsById = (review_id) => {
    const query = `
    SELECT * FROM reviews
    WHERE review_id = $1;
    `
    return db.query(query, [review_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Error 404: Not found.' })
            }
            return result.rows[0]
        })
}