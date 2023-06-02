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

describe('/', () => {
    describe('GET request', () => {
        test('status 200 - respond with message indicating the user is on the home page', () => {
            return request(app)
                .get('/')
                .expect(200)
                .then((response) => {
                    expect(response.body.message).toEqual('Welcome ! You\'re on the home page.');
                });
        });
    });
})

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
    describe('GET request', () => {
        test('status 200 - respond with array of review objects containing the following properties (defaults to sort by date descending): owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count, NOT review_body', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then((response) => {
                    const { reviews } = response.body;
                    expect(reviews.length).toBe(13);
                    reviews.forEach((review) => {
                        expect(review).toMatchObject({
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number),
                            review_id: expect.any(Number)
                        });
                        expect(review.hasOwnProperty('review_body')).toBe(false);
                    });
                    expect(reviews).toBeSortedBy('created_at', { descending: true });
                });
        });
        test('status 200 - accept category query to filter array of reviews', () => {
            return request(app)
                .get('/api/reviews?category=social%20deduction')
                .expect(200)
                .then((response) => {
                    const { reviews } = response.body;
                    expect(reviews.length).toBe(11);
                    reviews.forEach((review) => {
                        expect(review.category).toBe('social deduction');
                    });
                });
        });
        test('status 200 - accept sort by and order query to change order of array', () => {
            return request(app)
                .get('/api/reviews?sort_by=designer&order=asc')
                .expect(200)
                .then((response) => {
                    const { reviews } = response.body;
                    expect(reviews).toBeSortedBy('designer', { descending: false });
                });
        });
        test('status 200 - accept sort by query for comment count', () => {
            return request(app)
                .get('/api/reviews?sort_by=comment_count&order=desc')
                .expect(200)
                .then((response) => {
                    const { reviews } = response.body;
                    expect(reviews).toBeSortedBy('comment_count', { descending: true });
                });
        });
        test('status 200 - accept category, sort by and order query', () => {
            return request(app)
                .get(`/api/reviews?category=social%20deduction&sort_by=votes&order=desc`)
                .expect(200)
                .then((response) => {
                    const { reviews } = response.body;
                    expect(reviews.length).toBe(11);
                    reviews.forEach((review) => {
                        expect(review.category).toBe('social deduction');
                    });
                    expect(reviews).toBeSortedBy('votes', { descending: true });
                });
        });
        test('status 404 - misspelled endpoint', () => {
            return request(app)
                .get('/api/review')
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.')
                })
        });
    });
    describe('/:review_id', () => {
        describe('GET request', () => {
            test('status 200 - respond with review object containing the following properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at', () => {
                return request(app)
                    .get('/api/reviews/2')
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.review_id).toBe(2);
                        expect(review.title).toBe('Jenga');
                        expect(review.review_body).toBe('Fiddly fun for all the family');
                        expect(review.designer).toBe('Leslie Scott');
                        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700');
                        expect(review.votes).toBe(5);
                        expect(review.category).toBe('dexterity');
                        expect(review.owner).toBe('philippaclaire9');
                        expect(review.created_at).toBe('2021-01-18T10:01:41.251Z');
                    });
            });
            test('status 200 - respond with review object containing the property: comment_count', () => {
                return request(app)
                    .get('/api/reviews/2')
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.comment_count).toBe(3);
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
        describe('PATCH request', () => {
            test('status 200 - accept request of object with property: inc_votes (positive); respond with updated review object', () => {
                return request(app)
                    .patch('/api/reviews/12')
                    .send({ inc_votes: 25 })
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.review_id).toBe(12);
                        expect(review.title).toBe('Scythe; you\'re gonna need a bigger table!');
                        expect(review.category).toBe('social deduction');
                        expect(review.designer).toBe('Jamey Stegmaier');
                        expect(review.owner).toBe('mallionaire');
                        expect(review.review_body).toBe('Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.');
                        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700');
                        expect(review.created_at).toBe('2021-01-22T10:37:04.839Z');
                        expect(review.votes).toBe(125);
                    });
            });
            test('status 200 - accept request of object with property: inc_votes (negative); respond with updated review object', () => {
                return request(app)
                    .patch('/api/reviews/12')
                    .send({ inc_votes: -1 })
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.review_id).toBe(12);
                        expect(review.title).toBe('Scythe; you\'re gonna need a bigger table!');
                        expect(review.category).toBe('social deduction');
                        expect(review.designer).toBe('Jamey Stegmaier');
                        expect(review.owner).toBe('mallionaire');
                        expect(review.review_body).toBe('Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.');
                        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700');
                        expect(review.created_at).toBe('2021-01-22T10:37:04.839Z');
                        expect(review.votes).toBe(99);
                    });
            });
            test('status 200 - ignore extra properties given in request body', () => {
                return request(app)
                    .patch('/api/reviews/12')
                    .send({ inc_votes: 25, something_irrelevant: 0 })
                    .expect(200)
                    .then((response) => {
                        const { review } = response.body;
                        expect(review.review_id).toBe(12);
                        expect(review.title).toBe('Scythe; you\'re gonna need a bigger table!');
                        expect(review.category).toBe('social deduction');
                        expect(review.designer).toBe('Jamey Stegmaier');
                        expect(review.owner).toBe('mallionaire');
                        expect(review.review_body).toBe('Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.');
                        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700');
                        expect(review.created_at).toBe('2021-01-22T10:37:04.839Z');
                        expect(review.votes).toBe(125);
                    });
            });
            test('status 404 - review id does not exist in the database', () => {
                return request(app)
                    .patch('/api/reviews/15')
                    .send({ inc_votes: 1 })
                    .expect(404)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 404: Not found.');
                    });
            });
            test('status 400 - review id is not a number', () => {
                return request(app)
                    .patch('/api/reviews/five')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 400: Bad request.');
                    });
            });
            test('status 400 - request body object is missing property inc_votes', () => {
                return request(app)
                    .patch('/api/reviews/12')
                    .send({ dont_inc_votes: 25 })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 400: Bad request.');
                    });
            });
            test('status 400 - request body object fails PSQL schema validation', () => {
                return request(app)
                    .patch('/api/reviews/12')
                    .send({ inc_votes: 'twenty-five' })
                    .expect(400)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 400: Bad request.');
                    });
            });
        });
        describe('/comments', () => {
            describe('GET request', () => {
                test('status 200 - respond with array of comments with the following properties sorted by date in descending order: comment_id, votes, created_at, author, body, review_id', () => {
                    return request(app)
                        .get('/api/reviews/2/comments')
                        .expect(200)
                        .then((response) => {
                            const { comments } = response.body;
                            expect(comments.length).toBe(3);
                            comments.forEach((comment) => {
                                expect(comment).toMatchObject({
                                    comment_id: expect.any(Number),
                                    votes: expect.any(Number),
                                    created_at: expect.any(String),
                                    author: expect.any(String),
                                    body: expect.any(String),
                                    review_id: 2
                                });
                            });
                            expect(comments).toBeSortedBy('created_at', { descending: true });
                        });
                });
                test('status 200 - respond with empty array for existing review with no comments', () => {
                    return request(app)
                        .get('/api/reviews/6/comments')
                        .expect(200)
                        .then((response) => {
                            const { comments } = response.body;
                            expect(comments.length).toBe(0)
                        })
                });
                test('status 404 - review id does not exist in the database', () => {
                    return request(app)
                        .get('/api/reviews/20/comments')
                        .expect(404)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 404: Not found.')
                        });
                });
                test('status 400 - review id is not a number', () => {
                    return request(app)
                        .get('/api/reviews/one')
                        .expect(400)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 400: Bad request.')
                        });
                });
            });
            describe('POST request', () => {
                test('status 201 - accept request of comment object with properties: username, body; respond with posted comment object', () => {
                    const comment = { username: 'dav3rid', body: 'This game ruins friendships!' };
                    return request(app)
                        .post('/api/reviews/11/comments')
                        .send(comment)
                        .expect(201)
                        .then((response) => {
                            const { comment } = response.body;
                            expect(comment).toEqual({
                                comment_id: 7,
                                body: 'This game ruins friendships!',
                                review_id: 11,
                                author: 'dav3rid',
                                votes: 0,
                                created_at: expect.any(String)
                            })
                        });
                });
                test('status 201 - ignore extra properties given in request body', () => {
                    const comment = { username: 'dav3rid', body: 'This game ruins friendships!', votes: 51 };
                    return request(app)
                        .post('/api/reviews/11/comments')
                        .send(comment)
                        .expect(201)
                        .then((response) => {
                            const { comment } = response.body;
                            expect(comment).toEqual({
                                comment_id: 7,
                                body: 'This game ruins friendships!',
                                review_id: 11,
                                author: 'dav3rid',
                                votes: 0,
                                created_at: expect.any(String)
                            })
                        });
                });
                test('status 404 - review id does not exist in the database', () => {
                    const comment = { username: 'dav3rid', body: 'This game ruins friendships!' };
                    return request(app)
                        .post('/api/reviews/15/comments')
                        .send(comment)
                        .expect(404)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 404: Not found.')
                        });
                });
                test('status 400 - review id is not a number', () => {
                    const comment = { username: 'dav3rid', body: 'This game ruins friendships!' };
                    return request(app)
                        .post('/api/reviews/fifteen/comments')
                        .send(comment)
                        .expect(400)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 400: Bad request.')
                        });
                });
                test('status 400 - missing required fields', () => {
                    const comment = { body: 'This game ruins friendships!' };
                    return request(app)
                        .post('/api/reviews/11/comments')
                        .send(comment)
                        .expect(400)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 400: Bad request.')
                        });
                });
                test('status 404 - username in comment object of request body does not exist', () => {
                    const comment = { username: 'watling-gh0st', body: 'This game ruins friendships!' };
                    return request(app)
                        .post('/api/reviews/2/comments')
                        .send(comment)
                        .expect(404)
                        .then((response) => {
                            expect(response.body.message).toBe('Error 404: Not found.')
                        });
                });
            });
        });
    });
});

describe('/api/comments/:comment_id', () => {
    describe('DELETE request', () => {
        test('status 204 - comment matching comment id successfully deleted', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
                .then(() => {
                    return request(app)
                        .get('/api/comments/1')
                        .expect(404)
                })
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.')
                });
        });
        test('status 404 - comment id could not be found', () => {
            return request(app)
                .delete('/api/comments/10')
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.')
                });
        });
        test('status 400 - comment id is not a number', () => {
            return request(app)
                .delete('/api/comments/one')
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe('Error 400: Bad request.')
                });
        });
    });
    describe('PATCH request', () => {
        test('status 200 - accept request of object with property: inc_votes (positive); respond with updated comment object', () => {
            return request(app)
                .patch('/api/comments/5')
                .send({ inc_votes: 1 })
                .expect(200)
                .then((response) => {
                    const { comment } = response.body;
                    expect(comment).toMatchObject({
                        comment_id: 5,
                        body: 'Now this is a story all about how, board games turned my life upside down',
                        review_id: 2,
                        author: 'mallionaire',
                        votes: 14,
                        created_at: '2021-01-18T10:24:05.410Z'
                    });
                });
        });
        test('status 200 - accept request of object with property: inc_votes (negative); respond with updated comment object', () => {
            return request(app)
                .patch('/api/comments/3')
                .send({ inc_votes: -1 })
                .expect(200)
                .then((response) => {
                    const { comment } = response.body;
                    expect(comment).toMatchObject({
                        comment_id: 3,
                        body: 'I didn\'t know dogs could play games',
                        review_id: 3,
                        author: 'philippaclaire9',
                        votes: 9,
                        created_at: '2021-01-18T10:09:48.110Z'
                    });
                });
        });
        test('status 200 - ignore extra properties given in request body', () => {
            return request(app)
                .patch('/api/comments/5')
                .send({ inc_votes: 1, something_irrelevant: 'null' })
                .expect(200)
                .then((response) => {
                    const { comment } = response.body;
                    expect(comment).toMatchObject({
                        comment_id: 5,
                        body: 'Now this is a story all about how, board games turned my life upside down',
                        review_id: 2,
                        author: 'mallionaire',
                        votes: 14,
                        created_at: '2021-01-18T10:24:05.410Z'
                    });
                });
        });
        test('status 404 - comment id does not exist', () => {
            return request(app)
                .patch('/api/comments/7')
                .send({ inc_votes: 1 })
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.');
                });
        });
        test('status 400 - comment id is not a number', () => {
            return request(app)
                .patch('/api/comments/five')
                .send({ inc_votes: 1 })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe('Error 400: Bad request.');
                });
        });
        test('status 400 - request object missing inc_votes property', () => {
            return request(app)
                .patch('/api/comments/5')
                .send({ increment_votes: 1 })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe('Error 400: Bad request.');
                });
        });
        test('status 400 - value of inc_votes is not a number', () => {
            return request(app)
                .patch('/api/comments/5')
                .send({ inc_votes: 'one' })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe('Error 400: Bad request.');
                });
        });
    });
});

describe('/api/users', () => {
    describe('GET request', () => {
        test('status 200 - responds with an array of users containing the following properties: username, name, avatar_url', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then((response) => {
                    const { users } = response.body;
                    expect(users.length).toBe(4);
                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                });
        });
        test('status 404 - misspelled endpoint', () => {
            return request(app)
                .get('/api/user')
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe('Error 404: Not found.')
                })
        })
    });
    describe('/:username', () => {
        describe('GET request', () => {
            test('status 200 - responds with user object containing the properties: username, avatar_url, name', () => {
                return request(app)
                    .get('/api/users/mallionaire')
                    .expect(200)
                    .then((response) => {
                        const { user } = response.body;
                        expect(user).toMatchObject({
                            username: 'mallionaire',
                            name: 'haz',
                            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                        });
                    })
            });
            test('status 404 - username could not be found', () => {
                return request(app)
                    .get('/api/users/mik-rzo')
                    .expect(404)
                    .then((response) => {
                        expect(response.body.message).toBe('Error 404: Not found.');
                    })
            });
        });
    });
});