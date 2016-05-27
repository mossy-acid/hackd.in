const db = require('../../db/db-config.js');
const Project = require('../models/project.js');

const Projects = new db.Collection();

Projects.model = Project;

module.exports = Projects;
