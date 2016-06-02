const server     = require('./server.js');
const Projects   = require('./collections/projects');
const Project    = require('./models/project');
const Engineers  = require('./collections/engineers');
const Engineer   = require('./models/engineer');
const path       = require('path');
const cloudinary = require('./api/cloudinary.js');
const passport   = require('./api/github.js');

server.use(passport.initialize());
server.use(passport.session());

// cloudinary.uploader.destroy('public_id_of_image', {invalidate: true}, (err, result) => console.log(result));

module.exports = (server, express) => {

  passport.serializeUser((user, done) => {
    console.log('Inside serializeUser:  ', user.username);
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    console.log('Inside deserializeUser:', username);
    // maybe we get the user from psql by id?
    // Engineer.fetch(username, (err, user) => {
      done(null, username);
    // });
  });

  server.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('req.session:  ', req.session);
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }
    res.sendFile(path.resolve('client/index.html'));
  });

  server.get('/signin', passport.authenticate('github'));
  server.get('/signup', passport.authenticate('github'));

  // GitHub will call this URL
  server.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/',
      failureFlash: true
    }), (req, res) => {

      const name = req.user.displayName;
      const gitHandle = req.user.username;
      const email = req.user.emails[0].value;
      const image = req.user.photos[0].value;

      // console.log('github req:', req.user);

      new Engineer({ gitHandle: gitHandle }).fetch().then(found => {
        if (found) {
          //res.status(200).send(found.attributes);
          res.redirect('/profile');
        } else {
          Engineers.create({
            name: name,
            gitHandle: gitHandle,
            email: email,
            image: image
          })
          .then(newEngineer => {
            res.status(201).redirect('/projects');
          });
        }
      });
  });

  // server.get('/projects', (req, res) => {
  //   if (req.isAuthenticated()) {
  //     console.log('User is authenticated');
  //     // display 'my profile' and sign out instead of sign in/up
  //   } else {
  //     console.log('User is not authenticated');
  //     // hide 'my profile' and sign out and display sign in/up
  //   }
  //   res.sendFile(path.resolve('client/projects.html'));
  // });

  server.get('/newProject', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }
    res.sendFile(path.resolve('client/newProject.html'));
  });

  // server.get('/engineers', (req, res) => {
  //   if (req.isAuthenticated()) {
  //     console.log('User is authenticated');
  //     // display 'my profile' and sign out instead of sign in/up
  //   } else {
  //     console.log('User is not authenticated');
  //     // hide 'my profile' and sign out and display sign in/up
  //   }
  //   res.sendFile(path.resolve('client/engineers.html'));
  // });

  server.get('/newEngineer', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }
    res.sendFile(path.resolve('client/newEngineer.html'));
  });

  server.get('/signout', (req, res) => {
    console.log('Logging out:', req.user);
    req.logout();
    res.redirect('/');
  });

  // server.get('/signup',
  //   (req, res) => res.render('signup') );

  // server.get('/login',
  //   (req, res) => res.render('index') );

  // server.get('/[* project name *]', 'go to specific project page');

  // server.get('/[* engineer name *]', 'go to individual engineer page');


  // server.post('/signup', 'submit new user signup');


  server.get('/projects/data', (req, res) => {
    // knex.from('projects')
    //   .innerJoin('engineers', 'projects.id', 'engineers.project_id')
    //   .then( engineers => {
    //     console.log(engineers);
    //     res.send(JSON.stringify(engineers));
    //   })

    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }

    Project.fetchAll({columns: ['title', 'description', 'image']})
    .then(projects => {
      res.send(JSON.stringify(projects));
    });
  });

  server.get('/profile', (req,res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
      res.sendFile(path.resolve('client/profile.html'));
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
      res.sendFile(path.resolve('client/projects.html'));
    }
  });

  server.get('/engineer', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }

    let gitHandle = req.query.gitHandle;
    new Engineer({ gitHandle: gitHandle }).fetch().then(found => {
      if (found) {
        res.status(200).send(found.attributes);
      } else {
        res.sendStatus(404);
      }
    });
  });

  server.get('/engineers/data', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }

    Engineer.fetchAll({columns: ['name', 'image', 'email', 'gitHandle']})
    .then(engineers => {
      res.send(JSON.stringify(engineers));
    });
  });

  server.post('/projects/data', (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated: ', req.user);
      // display 'my profile' and sign out instead of sign in/up
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
    }

    let title = req.body.title;
    let description = req.body.description;
    let engineers = req.body.engineers;
    // let technologies = req.body.technologies;
    let imageUrl = req.body.image;

    cloudinary.uploader.upload(imageUrl,
      result => {
        // cloudinary.image( result.public_id, { width: 100, height: 150, crop: "fill" }) )
        new Project({ title: title }).fetch().then(found => {
          if (found) {
            res.status(200).send(found.attributes);
          } else {
            let url = result.secure_url.split('/');
            url[6] = 'c_fill,h_250,w_250';
            url = url.join('/');
            Projects.create({
              title: title,
              description: description,
              image: url,
              // technologies: technologies
              // engineers: engineers
            })
            .then(newProject => {
              res.status(201).send(newProject);
            });
          }
        });
      }
    );
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
