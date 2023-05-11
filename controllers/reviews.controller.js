const { fetchReviewsById, fetchReviews, fetchCommentsByReviewId, updateReviewsById } = require("../models/reviews.model.js");

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