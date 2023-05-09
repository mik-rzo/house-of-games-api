exports.getEndpoints = (request, response) => {
    response.status(200).send({
        "GET /api": {
            "description": "serves up a json representation of all the available endpoints of the api"
        }
    })
}