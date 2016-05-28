"use strict";

/**
 * Converts `set` to its value-value pairs.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the value-value pairs.
 */
function setToPairs(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = [value, value];
  });
  return result;
}

module.exports = setToPairs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zZXRUb1BhaXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUN2QixNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxNQUFNLElBQUksSUFBSixDQUFmLENBRm1COztBQUl2QixNQUFJLE9BQUosQ0FBWSxVQUFTLEtBQVQsRUFBZ0I7QUFDMUIsV0FBTyxFQUFFLEtBQUYsQ0FBUCxHQUFrQixDQUFDLEtBQUQsRUFBUSxLQUFSLENBQWxCLENBRDBCO0dBQWhCLENBQVosQ0FKdUI7QUFPdkIsU0FBTyxNQUFQLENBUHVCO0NBQXpCOztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfc2V0VG9QYWlycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gaXRzIHZhbHVlLXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWUtdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvUGFpcnMoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW3ZhbHVlLCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvUGFpcnM7XG4iXX0=