const db = require('../../db/db-config.js');

const Project_Technology = db.Model.extend({
  tableName: 'projects_technologies',
  hasTimestamps: false
});

module.exports = Project_Technology;