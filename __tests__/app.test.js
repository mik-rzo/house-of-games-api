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
        test('status 200 - respond with JSON describing all available endpoints on the API', () => {
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
        test('status 200 - responds with array of category objects with the following properties: slug, description', () => {
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
                })
        });
    });
});

