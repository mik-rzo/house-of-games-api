const request = require('supertest');
const app = require('../app.js');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const db = require('../db/connection.js');

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
                    const getAPI = response.body["GET /api"];
                    expect(getAPI).toMatchObject({
                        description: expect.any(String)
                    });
                });
        });
    });
});