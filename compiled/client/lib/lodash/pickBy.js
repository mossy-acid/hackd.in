'use strict';

var baseIteratee = require('./_baseIteratee'),
    basePickBy = require('./_basePickBy');

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
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
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  return object == null ? {} : basePickBy(object, baseIteratee(predicate));
}

module.exports = pickBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BpY2tCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5CO0lBQ0ksYUFBYSxRQUFRLGVBQVIsQ0FEakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsU0FBeEIsRUFBbUM7QUFDakMsU0FBTyxVQUFVLElBQVYsR0FBaUIsRUFBakIsR0FBc0IsV0FBVyxNQUFYLEVBQW1CLGFBQWEsU0FBYixDQUFuQixDQUE3QjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJwaWNrQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVBpY2tCeSA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrQnknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGUgYG9iamVjdGAgcHJvcGVydGllcyBgcHJlZGljYXRlYCByZXR1cm5zXG4gKiB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOiAodmFsdWUsIGtleSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICpcbiAqIF8ucGlja0J5KG9iamVjdCwgXy5pc051bWJlcik7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gcGlja0J5KG9iamVjdCwgcHJlZGljYXRlKSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHt9IDogYmFzZVBpY2tCeShvYmplY3QsIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwaWNrQnk7XG4iXX0=