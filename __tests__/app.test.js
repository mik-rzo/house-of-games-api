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

describe('', () => {
    test('', () => {

    });
});