'use strict';

var metaMap = require('./_metaMap'),
    noop = require('./noop');

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function (func) {
  return metaMap.get(func);
};

module.exports = getData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxVQUFVLFFBQVEsWUFBUixDQUFWO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7O0FBU0osSUFBSSxVQUFVLENBQUMsT0FBRCxHQUFXLElBQVgsR0FBa0IsVUFBUyxJQUFULEVBQWU7QUFDN0MsU0FBTyxRQUFRLEdBQVIsQ0FBWSxJQUFaLENBQVAsQ0FENkM7Q0FBZjs7QUFJaEMsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Il9nZXREYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1ldGFNYXAgPSByZXF1aXJlKCcuL19tZXRhTWFwJyksXG4gICAgbm9vcCA9IHJlcXVpcmUoJy4vbm9vcCcpO1xuXG4vKipcbiAqIEdldHMgbWV0YWRhdGEgZm9yIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWV0YWRhdGEgZm9yIGBmdW5jYC5cbiAqL1xudmFyIGdldERhdGEgPSAhbWV0YU1hcCA/IG5vb3AgOiBmdW5jdGlvbihmdW5jKSB7XG4gIHJldHVybiBtZXRhTWFwLmdldChmdW5jKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGF0YTtcbiJdfQ==