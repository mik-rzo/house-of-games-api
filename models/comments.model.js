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
    (body, review_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `
    return db.query(query, [post.body, review_id, post.username])
        .then((result) => {
            return result.rows[0]
        })
}

exports.deleteRowCommentsByCommentId = (comment_id) => {
    const query = `
    DELETE FROM comments
    WHERE comment_id = $1;
    `
    const { fetchCommentsByCommentId } = module.exports; // return this.fetchCommentsByCommentId (alternative syntax)
    return fetchCommentsByCommentId(comment_id)          //
        .then(() => {
            return db.query(query, [comment_id])
        })
        .then(() => {
            return
        })
}

exports.fetchCommentsByCommentId = (comment_id) => {
    const query = `
    SELECT * FROM comments
    WHERE comment_id = $1;
    `
    return db.query(query, [comment_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Error 404: Not found.' })
            }
            return result.rows[0]
        })
}