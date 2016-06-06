const server     = require('./server.js');
const Projects   = require('./collections/projects');
const Project    = require('./models/project');
const Engineers  = require('./collections/engineers');
const Engineer   = require('./models/engineer');
const path       = require('path');
const cloudinary = require('./api/cloudinary.js');
const passport   = require('./api/github.js');

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'hackdin'
  }
});

server.use(passport.initialize());
server.use(passport.session());

// cloudinary.uploader.destroy('public_id_of_image', {invalidate: true}, (err, result) => console.log(result));

module.exports = (server, express) => {

  passport.serializeUser((user, done) => {
    console.log('Serialize User:  ', user.username);
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    console.log('Deserialize User:', username);
    // maybe we get the user from psql by id?
    // Engineer.fetch(username, (err, user) => {
      done(null, username);
    // });
  });

  server.get('/', (req, res) => {
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

      new Engineer({ gitHandle: gitHandle }).fetch().then(found => {
        if (found) {
          res.redirect('/');
        } else {
          Engineers.create({
            name: name,
            gitHandle: gitHandle,
            email: email,
            image: image
          })
          .then(newEngineer => {
            res.status(201).redirect('/');
          });
        }
      });
  });

  server.get('/auth', (req, res) => {
    res.send(req.isAuthenticated());
  });

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


  server.get('/signout', (req, res) => {
    console.log('Logging out:', req.user);
    req.logout();
    res.redirect('/');
  });


  server.get('/projects', (req, res) => {
    let projectId = req.query.id;
    knex.from('projects')
      .then( projects => {
        let results = [];
        projects.forEach( project => {
          let contributors = [];
          let technologies = [];
          knex.from('projects')
            .innerJoin('projects_engineers', 'projects.id', 'projects_engineers.project_id')
            .innerJoin('engineers', 'engineers.id', 'projects_engineers.engineer_id')
            .where('projects.id', '=', project.id)
            .innerJoin('schools', 'schools.id', 'projects.school_id')
            .innerJoin('projects_technologies', 'projects.id', 'projects_technologies.project_id')
            .innerJoin('technologies', 'technologies.id', 'projects_technologies.technology_id')
            .then( engineers => {
              let schoolName;

              engineers.forEach( engineer => {
                schoolName = engineer.schoolName;
                if (contributors.indexOf(engineer.name) === -1) contributors.push(engineer.name);
                if (technologies.indexOf(engineer.techName) === -1) technologies.push(engineer.techName);
              });

              if (projectId === project.id.toString() || projectId === 'all') {
                results.push({
                  title: project.title,
                  description: project.description,
                  engineers: contributors.join(', '),
                  school: schoolName,
                  image: project.image,
                  technologies: technologies.join(', ')
                });
              }

              if (results.length === projects.length || projectId === project.id.toString()) {
                res.send(JSON.stringify(results));
              }
          });
        });
      });

  });

  server.get('/profile', (req,res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated');
      knex.from('engineers')
        .then( engineers => {
          let results = [];
          engineers.forEach( engineer => {
            knex.from('engineers')
              .innerJoin('projects_engineers', 'engineers.id', 'projects_engineers.engineer_id')
              .innerJoin('projects', 'projects.id', 'projects_engineers.project_id')
              .innerJoin('schools', 'schools.id', 'engineers.school_id')
              .then( data => {
                if (data.length && engineer.gitHandle === req.user) {
                  let projects = [];
                  data.forEach( dataPoint => {
                    if (dataPoint.name === engineer.name) {
                      projects.push({
                        title: dataPoint.title,
                        project_id: dataPoint.project_id,
                        description: dataPoint.description,
                        image: dataPoint.image,
                        projectUrl: dataPoint.projectUrl
                      });
                    }
                  });

                  results.push({
                    name: engineer.name,
                    email: engineer.email,
                    image: engineer.image,
                    gitHandle: engineer.gitHandle,
                    githubUrl: engineer.githubUrl,
                    linkedinUrl: engineer.linkedinUrl,
                    bio: engineer.bio,
                    school: data[0].schoolName,
                    project : projects
                  });
                  res.send(JSON.stringify(results[0]));
                }
            });
          });
        });
    } else {
      console.log('User is not authenticated');
      // hide 'my profile' and sign out and display sign in/up
      res.sendFile(path.resolve('/'));
    }
  });

  server.get('/engineers', (req, res) => {
    let engineerName = req.query.name;
    knex.from('engineers')
      .then( engineers => {
        let results = [];
        engineers.forEach( engineer => {
          knex.from('engineers')
            .innerJoin('projects_engineers', 'engineers.id', 'projects_engineers.engineer_id')
            .innerJoin('projects', 'projects.id', 'projects_engineers.project_id')
            .innerJoin('schools', 'schools.id', 'engineers.school_id')
            .then( data => {
              let projects = [];
              data.forEach(dataPoint => {
                if (dataPoint.name === engineer.name) {
                  projects.push(dataPoint.title);
                }
              });

              results.push({
                name: engineer.name,
                email: engineer.email,
                image: engineer.image,
                gitHandle: engineer.gitHandle,
                bio: engineer.bio,
                project: projects.join(', '),
                school: data[0].schoolName
              });

            if (results.length  === engineers.length) {
              res.send(JSON.stringify(results));
            }
          });
        });
      });
  });

  server.post('/projects', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let engineers = req.body.engineers;
    let technologies = req.body.technologies;
    let imageUrl = req.body.image;

    console.log(req.body)

    cloudinary.uploader.upload(imageUrl,
      result => {
        new Project({ title: title }).fetch().then(found => {
          if (found) {
            res.status(200).send(found.attributes);
          } else {
            let url = result.secure_url.split('/');
            url[6] = 'c_fill,h_250,r_5,w_250';
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

  server.post('/profile', (req,res) => {
    if (req.isAuthenticated()) {
      console.log('User is authenticated');
      // knex('engineers')
      //   .where('gitHandle', '=', req.user)
      //   .update(req.body.field, req.body.newValue);
      new Engineer({ gitHandle: req.user }).fetch().then( found => {
        if (found) {
          console.log(req.body.field);
          console.log(req.body.newValue);
          found.save(req.body.field, req.body.newValue)
          res.status(201).send(found.attributes);
        } else {
          res.sendStatus(404);
        }
      });
    }
  })
};

  // server.get('/newEngineer', (req, res) => {
  //   if (req.isAuthenticated()) {
  //     console.log('User is authenticated: ', req.user);
  //     // display 'my profile' and sign out instead of sign in/up
  //   } else {
  //     console.log('User is not authenticated');
  //     // hide 'my profile' and sign out and display sign in/up
  //   }
  //   res.sendFile(path.resolve('client/newEngineer.html'));
  // });
  // 
  // server.get('/engineer', (req, res) => {
  //   let gitHandle = req.query.gitHandle;
  //   new Engineer({ gitHandle: gitHandle }).fetch().then(found => {
  //     if (found) {
  //       res.status(200).send(found.attributes);
  //     } else {
  //       res.sendStatus(404);
  //     }
  //   });
  // });

  // server.get('/projects', (req, res) => {
  //   let id = req.query.id;
  //   new Project({ id: id }).fetch().then(found => {
  //     if (found) {
  //       res.status(200).send(found.attributes);
  //     } else {
  //       res.sendStatus(404);
  //     }
  //   });
  // });

