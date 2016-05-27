
const express = require('express');
// const session = require('express-session');
// const bcrypt = require('bcrypt-nodejs');

const server = express();
const db = require('../db/db-config.js');
const bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

require('./routes.js')(server, express);

let port = process.env.PORT || 3000;

// server.set('views', './views');
// server.set('view engine', 'jsx');
// server.engine('html', require('ejs'.renderFile));

server.use(express.static('./client'));
server.use(express.static('./compiled'));


// server.use(session({
//   secret: 'this is not a secret',
//   cookie: { maxAge: 60000 }
// }));

server.listen(port);
module.exports = server;
