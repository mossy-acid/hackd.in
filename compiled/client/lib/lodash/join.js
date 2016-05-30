'use strict';

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeJoin = arrayProto.join;

/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
function join(array, separator) {
  return array ? nativeJoin.call(array, separator) : '';
}

module.exports = join;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2pvaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsSUFBSSxhQUFhLE1BQU0sU0FBdkI7OztBQUdBLElBQUksYUFBYSxXQUFXLElBQTVCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLFNBQXJCLEVBQWdDO0FBQzlCLFNBQU8sUUFBUSxXQUFXLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsU0FBdkIsQ0FBUixHQUE0QyxFQUFuRDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJqb2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVKb2luID0gYXJyYXlQcm90by5qb2luO1xuXG4vKipcbiAqIENvbnZlcnRzIGFsbCBlbGVtZW50cyBpbiBgYXJyYXlgIGludG8gYSBzdHJpbmcgc2VwYXJhdGVkIGJ5IGBzZXBhcmF0b3JgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NlcGFyYXRvcj0nLCddIFRoZSBlbGVtZW50IHNlcGFyYXRvci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGpvaW5lZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uam9pbihbJ2EnLCAnYicsICdjJ10sICd+Jyk7XG4gKiAvLyA9PiAnYX5ifmMnXG4gKi9cbmZ1bmN0aW9uIGpvaW4oYXJyYXksIHNlcGFyYXRvcikge1xuICByZXR1cm4gYXJyYXkgPyBuYXRpdmVKb2luLmNhbGwoYXJyYXksIHNlcGFyYXRvcikgOiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqb2luO1xuIl19