const commentsRouter = require('express').Router();
const { deleteCommentsByCommentId, getCommentsByCommentId, patchCommentsByCommentId } = require('../controllers/comments.controller.js');

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentsByCommentId)
    .get(getCommentsByCommentId)
    .patch(patchCommentsByCommentId);

module.exports = commentsRouter;