const db = require('../../db/db-config.js');
const Engineer = require('../models/engineer.js');

const Engineers = new db.Collection();

Engineers.model = Engineer;

module.exports = Engineers;
