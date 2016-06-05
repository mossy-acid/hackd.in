# hackd.in

> A presentation platform for bootcamp graduates.

## Team

  - __Product Owner__: Kamal Mango
  - __Scrum Master__: Justin Lai
  - __Development Team Members__: Victoria Tran, Richard May

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    2. [Tasks](#tasks)
4. [Team](#team)
5. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- body-parser ^1.15.1
- bookshelf ^0.9.5
- cloudinary ^1.3.1
- connect-session-knex ^1.0.23
- express ^4.13.4
- express-session ^1.13.0
- helmet ^2.1.0
- knex ^0.11.5
- lodash ^4.6.1
- Node 6.2.0
- nodemon ^1.9.2
- passport ^0.3.2
- passport-github ^1.1.0
- pg ^4.5.5
- Postgresql 9.5.3
- react-redux ^4.4.5
- redux ^3.5.2
- request ^2.72.0

## Development

- babel-cli ^6.6.5
- babel-preset-es2015 ^6.6.0
- babel-preset-react ^6.5.0
- [Postgres.app](http://postgresapp.com/)

### Installing Dependencies

From within the root directory:

```sh
git pull --rebase upstream master
npm install -g n
n stable
npm install babel-cli
npm install
install and run postgres.app
createdb hackdin
psql -U postgres hackdin < hackdindb.pgsql
nodemon server/server.js
babel . --out-dir compiled --presets=es2015,react --ignore=node_modules,compiled,db,server --source-maps inline --watch
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
