const { deleteRowCommentsByCommentId, fetchCommentsByCommentId } = require("../models/comments.model")

exports.deleteCommentsByCommentId = (request, response, next) => {
    const { comment_id } = request.params
    deleteRowCommentsByCommentId(comment_id)
        .then(() => {
            response.status(204).send();
        })
        .catch((error) => {
            next(error);
        });
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