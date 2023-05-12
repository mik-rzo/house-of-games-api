const db = require('../db/connection.js');

exports.fetchReviewsById = (review_id) => {
    const query = `
    SELECT reviews.*, COUNT(comments.*) AS comment_count
    FROM reviews LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id;
    `
    return db.query(query, [review_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Error 404: Not found.' })
            }
            result.rows[0].comment_count = Number(result.rows[0].comment_count);
            return result.rows[0]
        })
}

exports.fetchReviews = () => {
    const query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.*) AS comment_count
    FROM reviews LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
    `
    return db.query(query)
        .then((result) => {
            result.rows.forEach((review) => {
                review.comment_count = Number(review.comment_count);
            });
            return result.rows
        })
}

exports.fetchCommentsByReviewId = (review_id) => {
    const query = `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `
    const { fetchReviewsById } = module.exports;
    return fetchReviewsById(review_id) // check if review matching review id exists
        .then(() => {
            return db.query(query, [review_id])
        })
        .then((result) => {
            return result.rows
        })
}

exports.updateReviewsById = (review_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({ status: 400, message: 'Error 400: Bad request.' });
    }
    const query = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `
    const { fetchReviewsById } = module.exports;
    return fetchReviewsById(review_id)
        .then(() => {
            return db.query(query, [inc_votes, review_id])
        })
        .then((result) => {
            return result.rows[0]
        })
}


