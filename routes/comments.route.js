const commentsRouter = require('express').Router();
const { deleteCommentsByCommentId, getCommentsByCommentId } = require('../controllers/comments.controller.js');

commentsRouter
.route('/:comment_id')
.delete(deleteCommentsByCommentId)
.get(getCommentsByCommentId);

module.exports = commentsRouter;