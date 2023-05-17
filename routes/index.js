const router = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints.controller.js');

const categoriesRouter = require('./categories.route.js');
const commentsRouter = require('./comments.route.js');
const reviewsRouter = require('./reviews.route.js');
const usersRouter = require('./users.route.js');

router.get('/', (request, response) => { response.status(200).send({ message: 'Welcome ! You\'re on the home page.' }) })

router.get('/api', getEndpoints);

router.use('/api/categories', categoriesRouter);

router.use('/api/reviews', reviewsRouter);

router.use('/api/comments', commentsRouter);

router.use('/api/users', usersRouter);

module.exports = router;