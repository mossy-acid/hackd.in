// var utils = require('./utilties.js');
const server   = require('./server.js');
const Projects = require('./collections/projects');
const Project  = require('./models/project');
const path     = require('path');
const cloudinary = require('./api/cloudinary.js');

// upload image to CDN which replies with public ID of uploaded image
// cloudinary.uploader.upload('/Users/Richard/Documents/Development/Hack Reactor/Greenfield/hackd.in/server/richard.png', result => {
//   console.log(result);
// });

// retrieve image using public ID
// cloudinary.api.resource('pgwxtwxxyegpfw1jy4mu', result => {
//   console.log('cloudinary result:', result);
// });

// retrieve html img tag of img by querying for public id of stored img
// cloudinary.image('pgwxtwxxyegpfw1jy4mu', { alt: "Sample Image" });
// <img src='http://res.cloudinary.com/hackdin/image/upload/pgwxtwxxyegpfw1jy4mu' alt='Sample Image'/>

// cloudinary.uploader.upload('https://static1.squarespace.com/static/ta/522a22cbe4b04681b0bff826/2465/assets/img/students-projects/fit-rpg.jpg',
//   result => console.log(cloudinary.image( result.public_id, { width: 100, height: 150, crop: "fill" } ))
// );

// cloudinary.uploader.destroy('public_id_of_image', {invalidate: true}, (err, result) => console.log(result));

// const knex = require('knex')({
//   client: 'postgresql',
//   connection: {
//     database: 'hackdin'
//   },
// });

module.exports = (server, express) => {

  server.get('/', (req, res) => {
    res.sendFile(path.resolve('client/projects.html'));
  });

  server.get('/projects', (req, res) => {
    res.sendFile(path.resolve('client/projects.html'));
  });

  server.get('/newProject',
    (req, res) => res.sendFile(path.resolve('client/newProject.html')) );

  server.get('/engineers',
    (req, res) => res.sendFile(path.resolve('client/engineers.html')) );

  server.get('/newEngineer',
    (req, res) => res.sendFile(path.resolve('client/newEngineer.html')) );

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


  // server.post('/signup', 'submit new user signup');


  server.get('/projects/data', (req, res) => {
    // knex.from('projects')
    //   .innerJoin('engineers', 'projects.id', 'engineers.project_id')
    //   .then( engineers => {
    //     console.log(engineers);
    //     res.send(JSON.stringify(engineers));
    //   })

    Project.fetchAll({columns: ['title', 'description', 'image']})
    .then(projects => {
      res.send(JSON.stringify(projects));
    });
  });

  server.get('/profile', (req,res) => {
    res.sendFile(path.resolve('client/profile.html'));
  })

  server.get('/engineers/data', (req, res) => {
    Engineer.fetchAll({columns: ['name']})
    .then(engineers => {
      res.send(JSON.stringify(engineers));
    });
  });

  server.post('/projects/data',
  function(req, res) {
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
            console.log(url);
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

  // this needs fixin'
  server.post('/engineers/data',
  function(req, res) {
    let title = req.body.name;
    let imageUrl = req.body.image;

    cloudinary.uploader.upload(imageUrl,
      result => {
        new Engineer({ name: name }).fetch().then(found => {
          if (found) {
            res.status(200).send(found.attributes);
          } else {
            Engineers.create({
              name: name,
              image: result.secure_url
            })
            .then(newEngineer => {
              res.status(201).send(newEngineer);
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



