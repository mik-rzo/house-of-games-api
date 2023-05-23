const { fetchUsers, fetchUserByUsername } = require("../models/users.model")

exports.getUsers = (request, response, next) => {
    fetchUsers()
        .then((result) => {
            response.status(200).send({ users: result });
        })
        .catch((error) => {
            next(error);
        })
}

exports.getUserByUsername = (request, response, next) => {
    const { username } = request.params;
    fetchUserByUsername(username)
        .then((result) => {
            response.status(200).send({ user: result });
        })
        .catch((error) => {
            next(error);
        })
}