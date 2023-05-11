const express = require('express');
const { getCategories } = require('./controllers/categories.controller.js');
const { getEndpoints } = require('./controllers/endpoints.controller.js');
const { getReviewsById, getReviews, getCommentsByReviewId, patchReviewsByReviewId } = require('./controllers/reviews.controller.js');

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewsById);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

app.patch('/api/reviews/:review_id', patchReviewsByReviewId);

app.use((request, response, next) => {
    const error = { status: 404, message: 'Error 404: Not found.' };
    next(error);
});

app.use((error, request, response, next) => {
    if (error.status && error.message) {
        response.status(error.status).send({ message: error.message });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ message: 'Error 400: Bad request.' })
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ message: 'Error 500: Internal Server Error.' })
})

module.exports = app;