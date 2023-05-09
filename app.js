const express = require('express');
const { getCategories } = require('./controllers/categories.controller.js');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

module.exports = app;