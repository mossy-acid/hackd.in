const db = require('../../db/db-config.js');

const School = db.Model.extend({
  tableName: 'schools',
  hasTimestamps: false
});

module.exports = School;
