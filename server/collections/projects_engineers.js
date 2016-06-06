const db = require('../../db/db-config.js');
const Project_Engineer = require('../models/project_engineer.js');

const Project_Engineers = new db.Collection();

Project_Engineers.model = Project_Engineer;

module.exports = Project_Engineers;
