"use strict";

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zZXRUb0FycmF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUN2QixNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxNQUFNLElBQUksSUFBSixDQUFmLENBRm1COztBQUl2QixNQUFJLE9BQUosQ0FBWSxVQUFTLEtBQVQsRUFBZ0I7QUFDMUIsV0FBTyxFQUFFLEtBQUYsQ0FBUCxHQUFrQixLQUFsQixDQUQwQjtHQUFoQixDQUFaLENBSnVCO0FBT3ZCLFNBQU8sTUFBUCxDQVB1QjtDQUF6Qjs7QUFVQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX3NldFRvQXJyYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iXX0=