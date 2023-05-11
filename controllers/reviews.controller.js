const { fetchReviewsById, fetchReviews } = require("../models/reviews.model.js");
const { fetchCommentsByReviewId, insertCommentsByReviewId } = require("../models/comments.model.js");

exports.getReviewsById = (request, response, next) => {
    const { review_id } = request.params;
    fetchReviewsById(review_id)
        .then((result) => {
            response.status(200).send({ review: result });
        })
        .catch((error) => {
            next(error);
        });
}

exports.getReviews = (request, response, next) => {
    fetchReviews()
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
        });
}

exports.postCommentsByReviewId = (request, response, next) => {
    const { review_id } = request.params;
    insertCommentsByReviewId(review_id, request.body)
        .then((result) => {
            response.status(201).send({ comment: result });
        })
        .catch((error) => {
            next(error);
        });
}