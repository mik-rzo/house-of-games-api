const reviewsRouter = require('express').Router();
const { getReviews, getReviewsById, patchReviewsByReviewId, getCommentsByReviewId, postCommentsByReviewId } = require('../controllers/reviews.controller.js');

reviewsRouter.get('/', getReviews);

reviewsRouter
    .route('/:review_id')
    .get(getReviewsById)
    .patch(patchReviewsByReviewId);

reviewsRouter
    .route('/:review_id/comments')
    .get(getCommentsByReviewId)
    .post(postCommentsByReviewId);

module.exports = reviewsRouter;