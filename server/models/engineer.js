const db = require('../../db/db-config.js');

const Engineer = db.Model.extend({
  tableName: 'engineers',
  hasTimestamps: false
});

module.exports = Engineer;
