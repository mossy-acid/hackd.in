const db = require('../../db/db-config.js');
const Project_Engineer = require('../models/project_engineer.js');

const Projects_Engineers = new db.Collection();

Projects_Engineers.model = Project_Engineer;

module.exports = Projects_Engineers;
