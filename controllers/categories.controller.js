const { fetchCategories } = require('../models/categories.model.js');

exports.getCategories = (request, response, next) => {
    fetchCategories().then((result) => {
        response.status(200).send({ categories: result });
    })
}