"use strict";

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19tYXBUb0FycmF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUN2QixNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxNQUFNLElBQUksSUFBSixDQUFmLENBRm1COztBQUl2QixNQUFJLE9BQUosQ0FBWSxVQUFTLEtBQVQsRUFBZ0IsR0FBaEIsRUFBcUI7QUFDL0IsV0FBTyxFQUFFLEtBQUYsQ0FBUCxHQUFrQixDQUFDLEdBQUQsRUFBTSxLQUFOLENBQWxCLENBRCtCO0dBQXJCLENBQVosQ0FKdUI7QUFPdkIsU0FBTyxNQUFQLENBUHVCO0NBQXpCOztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfbWFwVG9BcnJheS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwVG9BcnJheTtcbiJdfQ==