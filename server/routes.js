// var utils = require('./utilties.js');

module.exports = server => {

  server.get('/',
    (res, res) => res.render('index') );

  server.get('/create', utils.validateUser,
    (req, res) => res.render('create') );

  server.get('/projects',
    (req, res) => res.render('index') );

  // server.get('/logout', (req, res) => {
  //   req.session.destroy();
  //   res.render('index');
  // });

  // server.get('/signup',
  //   (req, res) => res.render('signup') );

  // server.get('/login',
  //   (req, res) => res.render('index') );

  // server.get('/[* project name *]', 'go to specific project page');

  // server.get('/[* engineer name *]', 'go to individual engineer page');

  // server.get('/engineers', 'list all engineers');

  server.post('/signup', 'submit new user signup');
  server.post('/create', 'submit new project');


};



