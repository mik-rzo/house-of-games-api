# House of Games API

## Introduction

This is an API for accessing data on board game reviews. The data is comprised of: users, board game categories, board game reviews from users, and comments left on reviews by other users.

You can access the site where the API lives on [here](https://house-of-games-7nlp.onrender.com/).

## Getting started

First, clone the repo from GitHub. You can use this command in your terminal to do so:

```
$ git clone https://github.com/mik-rzo/house-of-games.git
```

Install the required dependencies using the following command:

```
$ npm install
```

## Setting up for development and testing

**You must have Node.js and PostgreSQL installed.**

**Node.js minimum version: v20.0.0 | PostgreSQL minimum version: v14.7** 

There are two databases for this API: one with development data and one with a smaller set of test data. You will need to create these databases locally on your computer by running the following script:

```
$ npm run setup-dbs
```

Then, in order to connect to the database, you will need to create your environment variables in `.env` files.
* Create a `.env.development` file with the contents `PGDATABASE=house_of_games`.
* Create a `.env.test` file with the contents `PGDATABASE=house_of_games_test`.

You can then use this script to populate (or re-seed) the **development** database:

```
$ npm run seed
```

Jest is used as our testing framework. When running the test files with jest, `NODE_ENV` is set to `test` and the application runs using the environment variables in `.env.test`. Before each test runs, the **test** database is re-seeded. You can run jest using the script:

```
$ npm test
```