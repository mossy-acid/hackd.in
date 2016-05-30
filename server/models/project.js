const db = require('../../db/db-config.js');

const Project = db.Model.extend({
  tableName: 'projects',
  hasTimestamps: false
});

module.exports = Project;
