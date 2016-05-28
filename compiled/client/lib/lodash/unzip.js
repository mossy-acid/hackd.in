'use strict';

var arrayFilter = require('./_arrayFilter'),
    arrayMap = require('./_arrayMap'),
    baseProperty = require('./_baseProperty'),
    baseTimes = require('./_baseTimes'),
    isArrayLikeObject = require('./isArrayLikeObject');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 *
 * _.unzip(zipped);
 * // => [['fred', 'barney'], [30, 40], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function (group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function (index) {
    return arrayMap(array, baseProperty(index));
  });
}

module.exports = unzip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuemlwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxvQkFBb0IsUUFBUSxxQkFBUixDQUFwQjs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJoQixTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0FBQ3BCLE1BQUksRUFBRSxTQUFTLE1BQU0sTUFBTixDQUFYLEVBQTBCO0FBQzVCLFdBQU8sRUFBUCxDQUQ0QjtHQUE5QjtBQUdBLE1BQUksU0FBUyxDQUFULENBSmdCO0FBS3BCLFVBQVEsWUFBWSxLQUFaLEVBQW1CLFVBQVMsS0FBVCxFQUFnQjtBQUN6QyxRQUFJLGtCQUFrQixLQUFsQixDQUFKLEVBQThCO0FBQzVCLGVBQVMsVUFBVSxNQUFNLE1BQU4sRUFBYyxNQUF4QixDQUFULENBRDRCO0FBRTVCLGFBQU8sSUFBUCxDQUY0QjtLQUE5QjtHQUR5QixDQUEzQixDQUxvQjtBQVdwQixTQUFPLFVBQVUsTUFBVixFQUFrQixVQUFTLEtBQVQsRUFBZ0I7QUFDdkMsV0FBTyxTQUFTLEtBQVQsRUFBZ0IsYUFBYSxLQUFiLENBQWhCLENBQVAsQ0FEdUM7R0FBaEIsQ0FBekIsQ0FYb0I7Q0FBdEI7O0FBZ0JBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJ1bnppcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eScpLFxuICAgIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy56aXBgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYW4gYXJyYXkgb2YgZ3JvdXBlZFxuICogZWxlbWVudHMgYW5kIGNyZWF0ZXMgYW4gYXJyYXkgcmVncm91cGluZyB0aGUgZWxlbWVudHMgdG8gdGhlaXIgcHJlLXppcFxuICogY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMi4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSBvZiBncm91cGVkIGVsZW1lbnRzIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiByZWdyb3VwZWQgZWxlbWVudHMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB6aXBwZWQgPSBfLnppcChbJ2ZyZWQnLCAnYmFybmV5J10sIFszMCwgNDBdLCBbdHJ1ZSwgZmFsc2VdKTtcbiAqIC8vID0+IFtbJ2ZyZWQnLCAzMCwgdHJ1ZV0sIFsnYmFybmV5JywgNDAsIGZhbHNlXV1cbiAqXG4gKiBfLnVuemlwKHppcHBlZCk7XG4gKiAvLyA9PiBbWydmcmVkJywgJ2Jhcm5leSddLCBbMzAsIDQwXSwgW3RydWUsIGZhbHNlXV1cbiAqL1xuZnVuY3Rpb24gdW56aXAoYXJyYXkpIHtcbiAgaWYgKCEoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gMDtcbiAgYXJyYXkgPSBhcnJheUZpbHRlcihhcnJheSwgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICBpZiAoaXNBcnJheUxpa2VPYmplY3QoZ3JvdXApKSB7XG4gICAgICBsZW5ndGggPSBuYXRpdmVNYXgoZ3JvdXAubGVuZ3RoLCBsZW5ndGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGJhc2VUaW1lcyhsZW5ndGgsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIGFycmF5TWFwKGFycmF5LCBiYXNlUHJvcGVydHkoaW5kZXgpKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW56aXA7XG4iXX0=