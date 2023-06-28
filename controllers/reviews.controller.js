const { fetchReviewsById, fetchReviews, updateReviewsById, insertReview } = require("../models/reviews.model.js");
const { fetchCommentsByReviewId, insertCommentByReviewId } = require("../models/comments.model.js");

exports.getReviewsById = (request, response, next) => {
    const { review_id } = request.params;
    fetchReviewsById(review_id)
        .then((result) => {
            response.status(200).send({ review: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.getReviews = (request, response, next) => {
    if (Object.entries(request.query).length === 0) {
        request.query = undefined;
    }
    fetchReviews(request.query)
        .then((result) => {
            response.status(200).send({ reviews: result });
        })
        .catch((error) => {
            next(error)
        })
}

exports.getCommentsByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    fetchCommentsByReviewId(review_id)
        .then((result) => {
            response.status(200).send({ comments: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.postCommentByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    insertCommentByReviewId(review_id, request.body)
        .then((result) => {
            response.status(201).send({ comment: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.patchReviewsByReviewId = (request, response, next) => {
    const { inc_votes } = request.body;
    const { review_id } = request.params;
    updateReviewsById(review_id, inc_votes)
        .then((result) => {
            response.status(200).send({ review: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.postReview = (request, response, next) => {
    insertReview(request.body)
        .then((result) => {
            return fetchReviewsById(result)
        })
        .then((result) => {
            response.status(201).send({ review: result });
        })
        .catch((error) => {
            next(error);
        })
}