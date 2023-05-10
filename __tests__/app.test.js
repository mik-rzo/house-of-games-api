const request = require('supertest');
const app = require('../app.js');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const db = require('../db/connection.js');

const endpoints = require('../endpoints.json');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('/api', () => {
    describe('GET request', () => {
        test('status 200 - respond with JSON object describing all available endpoints on the API', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(endpoints);
                });
        });
    });
});

describe('/api/categories', () => {
    describe('GET request', () => {
        test('status 200 - respond with array of category objects with the following properties: slug, description', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then((response) => {
                    const { categories } = response.body;
                    expect(categories.length).toBe(4);
                    categories.forEach((category) => {
                        expect(category).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        });
                    })
                });
        });
        test('status 404 - misspelled endpoint', () => {
            return request(app)
                .get('/api/catagories')
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.')
                });
        });
    });
});

describe('/api/reviews', () => {
    describe('/:review_id', () => {
        describe('GET request', () => {
            test('status 200 - respond with review object containing the following properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at', () => {
                return request(app)
                    .get('/api/reviews/6')
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.review_id).toBe(6);
                        expect(review.title).toBe('Occaecat consequat officia in quis commodo.');
                        expect(review.review_body).toBe('Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.');
                        expect(review.designer).toBe('Ollie Tabooger');
                        expect(review.review_img_url).toBe('https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?w=700&h=700');
                        expect(review.votes).toBe(8);
                        expect(review.category).toBe('social deduction');
                        expect(review.owner).toBe('mallionaire');
                        expect(review.created_at).toBe('2020-09-13T14:19:28.077Z');
                    });
            });
            test('status 404 - review id does not exist in the database', () => {
                return request(app)
                    .get('/api/reviews/50')
                    .expect(404)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 404: Not found.')
                    });
            });
            test('status 400 - review id is not a number', () => {
                return request(app)
                    .get('/api/reviews/fifty')
                    .expect(400)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 400: Bad request.')
                    });
            });
        });
    });
});

