const { fetchReviewsById, fetchReviews } = require("../models/reviews.model");

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
    fetchReviews()
        .then((result) => {
            result.forEach((review) => {
                review.comment_count = Number(review.comment_count);
            })
            response.status(200).send({ reviews: result });
        })
        .catch((error) => {
            next(error)
        })
}