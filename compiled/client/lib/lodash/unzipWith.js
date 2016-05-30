'use strict';

var apply = require('./_apply'),
    arrayMap = require('./_arrayMap'),
    unzip = require('./unzip');

/**
 * This method is like `_.unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * _.unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 */
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  var result = unzip(array);
  if (iteratee == null) {
    return result;
  }
  return arrayMap(result, function (group) {
    return apply(iteratee, undefined, group);
  });
}

module.exports = unzipWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuemlwV2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBWjtJQUNJLFdBQVcsUUFBUSxhQUFSLENBRGY7SUFFSSxRQUFRLFFBQVEsU0FBUixDQUZaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsUUFBMUIsRUFBb0M7QUFDbEMsTUFBSSxFQUFFLFNBQVMsTUFBTSxNQUFqQixDQUFKLEVBQThCO0FBQzVCLFdBQU8sRUFBUDtBQUNEO0FBQ0QsTUFBSSxTQUFTLE1BQU0sS0FBTixDQUFiO0FBQ0EsTUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFdBQU8sTUFBUDtBQUNEO0FBQ0QsU0FBTyxTQUFTLE1BQVQsRUFBaUIsVUFBUyxLQUFULEVBQWdCO0FBQ3RDLFdBQU8sTUFBTSxRQUFOLEVBQWdCLFNBQWhCLEVBQTJCLEtBQTNCLENBQVA7QUFDRCxHQUZNLENBQVA7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoidW56aXBXaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgdW56aXAgPSByZXF1aXJlKCcuL3VuemlwJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy51bnppcGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHRvIHNwZWNpZnlcbiAqIGhvdyByZWdyb3VwZWQgdmFsdWVzIHNob3VsZCBiZSBjb21iaW5lZC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aGVcbiAqIGVsZW1lbnRzIG9mIGVhY2ggZ3JvdXA6ICguLi5ncm91cCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjguMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgb2YgZ3JvdXBlZCBlbGVtZW50cyB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiB0byBjb21iaW5lXG4gKiAgcmVncm91cGVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIHJlZ3JvdXBlZCBlbGVtZW50cy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHppcHBlZCA9IF8uemlwKFsxLCAyXSwgWzEwLCAyMF0sIFsxMDAsIDIwMF0pO1xuICogLy8gPT4gW1sxLCAxMCwgMTAwXSwgWzIsIDIwLCAyMDBdXVxuICpcbiAqIF8udW56aXBXaXRoKHppcHBlZCwgXy5hZGQpO1xuICogLy8gPT4gWzMsIDMwLCAzMDBdXG4gKi9cbmZ1bmN0aW9uIHVuemlwV2l0aChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgaWYgKCEoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdW56aXAoYXJyYXkpO1xuICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGFycmF5TWFwKHJlc3VsdCwgZnVuY3Rpb24oZ3JvdXApIHtcbiAgICByZXR1cm4gYXBwbHkoaXRlcmF0ZWUsIHVuZGVmaW5lZCwgZ3JvdXApO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bnppcFdpdGg7XG4iXX0=