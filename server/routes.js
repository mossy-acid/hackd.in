// var utils = require('./utilties.js');
const server   = require('./server.js');
const Projects = require('./collections/projects');
const Project  = require('./models/project');


module.exports = (server, express) => {

  server.get('/',
    (req, res) => res.render('projects') );

  server.get('/projects',
    (req, res) => res.render('projects') );

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

  // server.post('/signup', 'submit new user signup');




  server.post('/newproject',
  function(req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let technologies = req.body.technologies;

    new Project({ title: title }).fetch().then(found => {
      if (found) {
        // the found.attributes proptery is an object containing the existing project's properties
        // need to return a message to the user that a project by this name already exists
        res.status(200).send(found.attributes);
      } else {
        Projects.create({
          title: title,
          description: description,
          technologies: technologies
          // engineers: engineers
        })
        .then(newProject => {
          res.status(200).send(newProject);
        });
      }
    });
  });

  // server.post('/login',
  // function(req, res) {
  //   var username = req.body.username;
  //   var password = req.body.password;

  //   new Engineer({ username: username }).fetch().then(engineer => {
  //     if (engineer) {
  //       bcrypt.compare(password, engineer.get('password'), (err, match) => {
  //         if (match) {
  //           console.log('Logging in...');
  //           req.session.username = username;
  //           res.status(200);
  //           res.redirect('/');
  //         } else {
  //           console.log('Invalid password');
  //           res.redirect('/login');
  //         }
  //       });
  //     } else {
  //       res.status(200);
  //       res.redirect('/login');
  //     }
  //   });
  // });


  // server.post('/signup',
  // function(req, res) {
  //   var username = req.body.username;
  //   var password = req.body.password;

  //   new Engineer({ username: username }).fetch().then(found => {
  //     if (found) {
  //       res.status(200);
  //       res.redirect('/signup');
  //     } else {
  //       bcrypt.hash(req.body.password, null, null, (err, hash) => {
  //         if (err) {
  //           console.log('BCRYPT HASH ERROR:', err);
  //           res.status(200);
  //           res.redirect('/signup');
  //         } else {
  //           Engineers.create({
  //             username: username,
  //             password: hash
  //           })
  //           .then(engineer => {
  //             req.session.username = username;
  //             res.status(200);
  //             res.redirect('/');
  //           });
  //         }
  //       });
  //     }
  //   });
  // });

  // server.get('/*', (req, res) => {
  //   new Link({ code: req.params[0] }).fetch().then(function(link) {
  //     if (!link) {
  //       res.redirect('/');
  //     } else {
  //       var click = new Click({
  //         linkId: link.get('id')
  //       });

  //       click.save().then(function() {
  //         link.set('visits', link.get('visits') + 1);
  //         link.save().then(function() {
  //           return res.redirect(link.get('url'));
  //         });
  //       });
  //     }
  //   });
  // });




};



