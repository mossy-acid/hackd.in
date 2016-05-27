const express    = require('express');
// const session    = require('express-session');
// const bcrypt     = require('bcrypt-nodejs');
// const cloudinary = require('cloudinary');

const server = express();
const db = require('../db/db-config.js');
const bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

// server.set('view engine', 'ejs');
// server.set('views', './views');
// server.set('view engine', 'jsx');

require('./routes.js')(server, express);

let port = process.env.PORT || 3000;

server.use(express.static('./client'));
server.use(express.static('./compiled'));

// server.use(session({
//   secret: 'this is not a secret',
//   cookie: { maxAge: 60000 }
// }));

server.listen(port);
module.exports = server;
