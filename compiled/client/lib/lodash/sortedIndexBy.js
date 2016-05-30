'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseSortedIndexBy = require('./_baseSortedIndexBy');

/**
 * This method is like `_.sortedIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
 * // => 0
 */
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee));
}

module.exports = sortedIndexBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZEluZGV4QnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0Esb0JBQW9CLFFBQVEsc0JBQVIsQ0FBcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkosU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCLEtBQTlCLEVBQXFDLFFBQXJDLEVBQStDO0FBQzdDLFNBQU8sa0JBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDLGFBQWEsUUFBYixDQUFoQyxDQUFQLENBRDZDO0NBQS9DOztBQUlBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJzb3J0ZWRJbmRleEJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VTb3J0ZWRJbmRleEJ5ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4QnknKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnNvcnRlZEluZGV4YCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBpdGVyYXRlZWBcbiAqIHdoaWNoIGlzIGludm9rZWQgZm9yIGB2YWx1ZWAgYW5kIGVhY2ggZWxlbWVudCBvZiBgYXJyYXlgIHRvIGNvbXB1dGUgdGhlaXJcbiAqIHNvcnQgcmFua2luZy4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgc29ydGVkIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBldmFsdWF0ZS5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2l0ZXJhdGVlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCBgdmFsdWVgIHNob3VsZCBiZSBpbnNlcnRlZFxuICogIGludG8gYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAneCc6IDQgfSwgeyAneCc6IDUgfV07XG4gKlxuICogXy5zb3J0ZWRJbmRleEJ5KG9iamVjdHMsIHsgJ3gnOiA0IH0sIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8ueDsgfSk7XG4gKiAvLyA9PiAwXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLnNvcnRlZEluZGV4Qnkob2JqZWN0cywgeyAneCc6IDQgfSwgJ3gnKTtcbiAqIC8vID0+IDBcbiAqL1xuZnVuY3Rpb24gc29ydGVkSW5kZXhCeShhcnJheSwgdmFsdWUsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlU29ydGVkSW5kZXhCeShhcnJheSwgdmFsdWUsIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRlZEluZGV4Qnk7XG4iXX0=