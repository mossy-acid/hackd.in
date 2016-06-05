const db = require('../../db/db-config.js');

const Technology = db.Model.extend({
  tableName: 'technologies',
  hasTimestamps: false
});

module.exports = Technology;
