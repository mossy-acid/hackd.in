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


/*   */

  app.post('/create', utils.validateUser,
  function(req, res) {
    var uri = req.body.url;

    if (!util.isValidUrl(uri)) {
      console.log('Not a valid url: ', uri);
      return res.sendStatus(404);
    }

    new Link({ url: uri }).fetch().then(function(found) {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }

          Links.create({
            url: uri,
            title: title,
            baseUrl: req.headers.origin
          })
          .then(function(newLink) {
            res.status(200).send(newLink);
          });
        });
      }
    });
  });

  app.post('/login',
  function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    new User({ username: username }).fetch().then(function(user) {
      if (user) {
        bcrypt.compare(password, user.get('password'), function(err, match) {
          if (match) {
            console.log('Logging in...');
            req.session.username = username;
            res.status(200);
            res.redirect('/');
          } else {
            console.log('Invalid password');
            res.redirect('/login');
          }
        });
      } else {
        res.status(200);
        res.redirect('/login');
      }
    });
  });


  app.post('/signup',
  function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    new User({ username: username }).fetch().then(function(found) {
      if (found) {
        res.status(200);
        res.redirect('/signup');
      } else {
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
          if (err) {
            console.log('BCRYPT HASH ERROR:', err);
            res.status(200);
            res.redirect('/signup');
          } else {
            Users.create({
              username: username,
              password: hash
            })
            .then(function(user) {
              req.session.username = username;
              res.status(200);
              res.redirect('/');
            });
          }
        });
      }
    });
  });

  app.get('/*', function(req, res) {
    new Link({ code: req.params[0] }).fetch().then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        var click = new Click({
          linkId: link.get('id')
        });

        click.save().then(function() {
          link.set('visits', link.get('visits') + 1);
          link.save().then(function() {
            return res.redirect(link.get('url'));
          });
        });
      }
    });
  });




};



