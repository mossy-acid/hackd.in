const db = require('../../db/db-config.js');
const Technology = require('../models/technology.js');

const Technologies = new db.Collection();

Technologies.model = Technology;

module.exports = Technologies;
