const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');

const app = express();

app.use(cors({ origin: 'https://house-of-games-mp.netlify.app' }));

app.use(express.json());

app.use('/', routes);

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
    } else if (error.code === '23503') {
        response.status(404).send({ message: 'Error 404: Not found.' });
    } else {
        next(error);
    }
});

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ message: 'Error 500: Internal Server Error.' })
})

module.exports = app;