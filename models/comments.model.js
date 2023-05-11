const db = require('../db/connection.js');

const { fetchReviewsById } = require('./reviews.model.js');

exports.fetchCommentsByReviewId = (review_id) => {
    const query = `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `
    return fetchReviewsById(review_id) // check if review matching review id exists
        .then(() => {
            return db.query(query, [review_id])
        })
        .then((result) => {
            return result.rows
        })
}

exports.insertCommentsByReviewId = (review_id, post) => {
    if (!post.username || !post.body) {
        return Promise.reject({ status: 400, message: 'Error 400: Bad request.' })
    }
    const query = `
    INSERT INTO comments
    (body, review_id, author, votes, created_at)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
    `
    return db.query(query, [post.body, review_id, post.username, 0, new Date().toISOString()])
    .then((result) => {
        return result.rows[0]
    })
}