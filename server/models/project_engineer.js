const db = require('../../db/db-config.js');

const Project_Engineer = db.Model.extend({
  tableName: 'projects_engineers',
  hasTimestamps: false
});

module.exports = Project_Engineer;