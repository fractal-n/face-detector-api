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

## Environment variables

- DATABASE_URL
- CLARIFAI_API_KEY = "2eb922025c064b108a239789a222134d"

## Deployment

Heroku
