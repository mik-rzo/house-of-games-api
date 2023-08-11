# House of Games API

## Background

This is an API built for the purpose of accessing application data programatically and provides information to the front-end architecture of this full-stack application.

The data is comprised of: users, board game categories, board game reviews from users, and comments left on reviews by other users. The data is stored in a PostgreSQL database and is accessed programmatically using [node-postgres](https://node-postgres.com/).

## Links

View the list of all currently available endpoints here: [https://house-of-games-api-production.up.railway.app/api](https://house-of-games-api-production.up.railway.app/api).

Take a look at the front-end repo for this application here: [https://github.com/mik-rzo/house-of-games](https://github.com/mik-rzo/house-of-games).

## Project Setup

Fork the repo to get your own copy and clone it to your local system.

In the root of the project directory, install the required dependencies using the following command:

```
npm install
```

**You must have Node.js and PostgreSQL installed.**

**Minimum version requirements:**

- Node.js: v20.0.0
- PostgreSQL: v14.7

There are two databases for this API: one with development data and one with a smaller set of test data. You will need to create these databases locally on your computer by running the following script:

```
npm run setup-dbs
```

Then, in order to connect to the database, you will need to create your environment variables in `.env` files.

- Create a `.env.development` file with the contents `PGDATABASE=house_of_games`.
- Create a `.env.test` file with the contents `PGDATABASE=house_of_games_test`.

You can then use this script to populate (or re-seed) the **development** database:

```
npm run seed
```

Jest is used as our testing framework. When running the test files with jest, `NODE_ENV` is set to `test` and the application runs using the environment variables in `.env.test`. Before each test runs (and also after all tests), the **test** database is re-seeded. You can run jest using the script:

```
npm test
```
