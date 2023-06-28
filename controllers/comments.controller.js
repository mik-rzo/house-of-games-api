const { deleteRowCommentByCommentId, fetchCommentsByCommentId, updateCommentById } = require("../models/comments.model.js")

exports.deleteCommentByCommentId = (request, response, next) => {
    const { comment_id } = request.params
    deleteRowCommentByCommentId(comment_id)
        .then(() => {
            response.status(204).send();
        })
        .catch((error) => {
            next(error);
        })
}

exports.getCommentsByCommentId = (request, response, next) => {
    const { comment_id } = request.params
    fetchCommentsByCommentId(comment_id)
        .then((result) => {
            response.status(200).send({ comment: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.patchCommentByCommentId = (request, response, next) => {
    const { inc_votes } = request.body;
    const { comment_id } = request.params;
    updateCommentById(comment_id, inc_votes)
        .then((result) => {
            response.status(200).send({ comment: result });
        })
        .catch((error) => {
            next(error);
        })
}