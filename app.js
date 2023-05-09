const express = require('express');
const { getCategories } = require('./controllers/categories.controller.js');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.use((request, response, next) => {
    const error = { status: 404, message: 'Error 404: Not found.'};
    next(error);
});

app.use((error, request, response, next) => {
    if (error) {
        response.status(error.status).send({message: error.message});
    }
});

module.exports = app;