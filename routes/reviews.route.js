const reviewsRouter = require('express').Router();
const { getReviews, getReviewById, patchReviewByReviewId, getCommentsByReviewId, postCommentByReviewId, postReview } = require('../controllers/reviews.controller.js');

reviewsRouter
    .get('/', getReviews)
    .post('/', postReview);

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewByReviewId);

reviewsRouter
    .route('/:review_id/comments')
    .get(getCommentsByReviewId)
    .post(postCommentByReviewId);

module.exports = reviewsRouter;