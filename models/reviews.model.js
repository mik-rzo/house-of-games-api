const db = require('../db/connection.js');

const format = require('pg-format');

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

exports.fetchReviews = (userQuery = { sort_by: 'created_at', order: 'desc' }) => {
    let { category, sort_by, order } = userQuery;
    let queryStr = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.*) AS comment_count
    FROM reviews LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    `
    if (category) {
        queryStr += `WHERE category = %L
        `
    }
    queryStr += `GROUP BY reviews.review_id
    `
    if (!userQuery.sort_by) {
        sort_by = 'created_at';
    }
    if (!userQuery.order) {
        order = 'desc';
    }
    order = order.toUpperCase();
    queryStr += `ORDER BY reviews.%I %s;`
    if (category) {
        queryStr = format(queryStr, category, sort_by, order);
    } else {
        queryStr = format(queryStr, sort_by, order);
    }
    return db.query(queryStr)
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


