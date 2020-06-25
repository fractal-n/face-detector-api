# face-detector-api

## About

This is the backend server for face-detector app.

## Tech stack

- NodeJS
- Express
- Knex
- PostgreSQL. See schema below.

```sql
CREATE TABLE login (
	id serial PRIMARY KEY,
	hash VARCHAR(100) NOT NULL,
	email text UNIQUE NOT NULL
);

CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);
```

### Useful PostgreSQL commands for Heroku

```bash
# open psql
heroku pg:psql

# quit psql
\q
```

## Environment variables

- DATABASE_URL
- CLARIFAI_API_KEY = "2eb922025c064b108a239789a222134d"

Note that **NODE_TLS_REJECT_UNAUTHORIZED** is currently disabled. This could be due to free version of Heroku allow only self signed certificates, which is not allowed by the Node engine.

## Deployment

This app is hosted on Heroku. Useful commands to work with Heroku.

```bash
# deploy to Heroku
git push heroku master

# show logs
heroku logs --tail
```
