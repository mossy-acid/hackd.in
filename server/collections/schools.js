const db = require('../../db/db-config.js');
const School = require('../models/school.js');

const Schools = new db.Collection();

Schools.model = School;

module.exports = Schools;
