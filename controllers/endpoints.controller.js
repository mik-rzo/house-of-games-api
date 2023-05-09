exports.getEndpoints = (request, response) => {
    response.status(200).send({
        "GET /api": {
            "description": "serves up a json representation of all the available endpoints of the api"
        },
        "GET /api/categories": {
            "description": "serves an array of all categories",
            "queries": [],
            "exampleResponse": {
                "categories": [
                    {
                        "slug": "Social deduction",
                        "description": "Players attempt to uncover each other's hidden role"
                    }
                ]
            }
        }
    });
}