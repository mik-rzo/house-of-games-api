const reviewsRouter = require('express').Router();
const { getReviews, getReviewsById, patchReviewsByReviewId, getCommentsByReviewId, postCommentByReviewId, postReview } = require('../controllers/reviews.controller.js');

reviewsRouter
    .get('/', getReviews)
    .post('/', postReview);

reviewsRouter
    .route('/:review_id')
    .get(getReviewsById)
    .patch(patchReviewsByReviewId);

reviewsRouter
    .route('/:review_id/comments')
    .get(getCommentsByReviewId)
    .post(postCommentByReviewId);

module.exports = reviewsRouter;