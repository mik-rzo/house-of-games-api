const commentsRouter = require('express').Router();
const { deleteCommentByCommentId, getCommentsByCommentId, patchCommentByCommentId } = require('../controllers/comments.controller.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentByCommentId)
    .get(getCommentsByCommentId)
    .patch(patchCommentByCommentId);

module.exports = commentsRouter;