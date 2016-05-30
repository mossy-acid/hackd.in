'use strict';

var baseIteratee = require('./_baseIteratee'),
    basePickBy = require('./_basePickBy');

/**
 * The opposite of `_.pickBy`; this method creates an object composed of
 * the own and inherited enumerable string keyed properties of `object` that
 * `predicate` doesn't return truthy for. The predicate is invoked with two
 * arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omitBy(object, _.isNumber);
 * // => { 'b': '2' }
 */
function omitBy(object, predicate) {
  predicate = baseIteratee(predicate);
  return basePickBy(object, function (value, key) {
    return !predicate(value, key);
  });
}

module.exports = omitBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL29taXRCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCSixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsU0FBeEIsRUFBbUM7QUFDakMsY0FBWSxhQUFhLFNBQWIsQ0FBWixDQURpQztBQUVqQyxTQUFPLFdBQVcsTUFBWCxFQUFtQixVQUFTLEtBQVQsRUFBZ0IsR0FBaEIsRUFBcUI7QUFDN0MsV0FBTyxDQUFDLFVBQVUsS0FBVixFQUFpQixHQUFqQixDQUFELENBRHNDO0dBQXJCLENBQTFCLENBRmlDO0NBQW5DOztBQU9BLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJvbWl0QnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVBpY2tCeSA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrQnknKTtcblxuLyoqXG4gKiBUaGUgb3Bwb3NpdGUgb2YgYF8ucGlja0J5YDsgdGhpcyBtZXRob2QgY3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2ZcbiAqIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIGBvYmplY3RgIHRoYXRcbiAqIGBwcmVkaWNhdGVgIGRvZXNuJ3QgcmV0dXJuIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHR3b1xuICogYXJndW1lbnRzOiAodmFsdWUsIGtleSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICpcbiAqIF8ub21pdEJ5KG9iamVjdCwgXy5pc051bWJlcik7XG4gKiAvLyA9PiB7ICdiJzogJzInIH1cbiAqL1xuZnVuY3Rpb24gb21pdEJ5KG9iamVjdCwgcHJlZGljYXRlKSB7XG4gIHByZWRpY2F0ZSA9IGJhc2VJdGVyYXRlZShwcmVkaWNhdGUpO1xuICByZXR1cm4gYmFzZVBpY2tCeShvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXR1cm4gIXByZWRpY2F0ZSh2YWx1ZSwga2V5KTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb21pdEJ5O1xuIl19