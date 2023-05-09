# House of Games API

## Getting started

Install the required dependencies using the following command:

```
npm install
```

**You must have PSQL installed.** 

There are two databases for this API: one with development data and one with simpler test data. You will need to create these databases locally on your computer by running the following script:

```
npm run setup-dbs
```

Then, in order to connect to the database, you will need to create your environment variables. 
* Create a `.env.development` file with the contents `PGDATABASE=house_of_games`.
* Create a `.env.test` file with the contents `PGDATABASE=house_of_games_test`.