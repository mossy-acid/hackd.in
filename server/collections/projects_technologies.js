const db = require('../../db/db-config.js');
const Project_Technology = require('../models/project_Technology.js');

const Projects_Technologies = new db.Collection();

Projects_Technologies.model = Project_Technology;

module.exports = Projects_Technologies;
