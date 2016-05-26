const path = require('path');
const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'hackdin'
  },
});

const db = require('bookshelf')(knex);

db.knex.schema.hasTable('projects').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('projects', project => {
      project.increments('id').primary();
      project.string('title').unique();
      project.string('description');
      project.integer('visits');
      project.timestamps();
    }).then(table => {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('engineers').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('engineers', engineer => {
      engineer.increments('id').primary();
      engineer.string('username').unique();
      engineer.string('password');
      engineer.string('firstname');
      engineer.string('lastname');
      engineer.string('bio');
      engineer.integer('project_id');
      engineer.integer('school_id');
      engineer.integer('visits');
      engineer.timestamps();
    }).then(table => {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('schools').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('schools', school => {
      school.increments('id').primary();
      school.string('name').unique();
      school.timestamps();
    }).then(table => {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
