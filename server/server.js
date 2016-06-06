const express    = require('express');
const session    = require('express-session');
const db         = require('../db/db-config.js');
const bodyParser = require('body-parser');
const helmet     = require('helmet');
const Knex       = require('knex');
const terminal   = require('node-cmd');

const KnexSessionStore = require('connect-session-knex')(session);

const server = express();

server.use(helmet());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

// terminal.run('psql -U postgres hackdin < hackdindb.pgsql');
// Seed schools and tech tables into postgres db
terminal.run('psql -U postgres hackdin < hackdinseed.pgsql');

const knex = Knex({
  client: 'pg',
  connection: {
    // host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'hackdin'
  }
});

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions'
});

server.use(session({
  store: store,
  secret: 'worst kept secret',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
    // maxAge: 60000 // 1 minute for testing
 }
}));

let port = process.env.PORT || 3000;

server.use(express.static('./client'));
server.use(express.static('./compiled'));

server.listen(port);
module.exports = server;
require('./routes.js')(server, express);
