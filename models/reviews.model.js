const db = require('../db/connection.js');

const format = require('pg-format');

exports.fetchReviewById = (review_id) => {
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
    if (sort_by !== 'comment_count') {
        queryStr += `ORDER BY reviews.%I %s;`
    } else if (sort_by === 'comment_count') {
        queryStr += `ORDER BY %s %s;`
    }
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
    return this.fetchReviewById(review_id) // check if review matching review id exists
        .then(() => {
            return db.query(query, [review_id])
        })
        .then((result) => {
            return result.rows
        })
}

exports.updateReviewById = (review_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({ status: 400, message: 'Error 400: Bad request.' });
    }
    const query = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `
    return this.fetchReviewById(review_id)
        .then(() => {
            return db.query(query, [inc_votes, review_id])
        })
        .then((result) => {
            return result.rows[0]
        })
}

exports.insertReview = (post) => {
    if (!post.owner || !post.title || !post.review_body || !post.designer || !post.category) {
        return Promise.reject({ status: 400, message: 'Error 400: Bad request.' })
    }

    let query = `
    INSERT INTO reviews
    `
    if (post.review_img_url) {
        query += `(owner, title, review_body, designer, category, review_img_url)
    `
    } else {
        query += `(owner, title, review_body, designer, category)
    `
    }
    query += `VALUES
    `
    if (post.review_img_url) {
        query += `($1, $2, $3, $4, $5, $6)
    `
    } else {
        query += `($1, $2, $3, $4, $5)
    `
    }
    query += `RETURNING review_id;
    `
    let dbQuery;
    if (post.review_img_url) {
        dbQuery = db.query(query, [post.owner, post.title, post.review_body, post.designer, post.category, post.review_img_url])
    } else {
        dbQuery = db.query(query, [post.owner, post.title, post.review_body, post.designer, post.category])
    }
    return dbQuery
        .then((result) => {
            return result.rows[0].review_id
        })
}
