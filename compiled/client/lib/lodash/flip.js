'use strict';

var createWrapper = require('./_createWrapper');

/** Used to compose bitmasks for wrapper metadata. */
var FLIP_FLAG = 512;

/**
 * Creates a function that invokes `func` with arguments reversed.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to flip arguments for.
 * @returns {Function} Returns the new flipped function.
 * @example
 *
 * var flipped = _.flip(function() {
 *   return _.toArray(arguments);
 * });
 *
 * flipped('a', 'b', 'c', 'd');
 * // => ['d', 'c', 'b', 'a']
 */
function flip(func) {
  return createWrapper(func, FLIP_FLAG);
}

module.exports = flip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZsaXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCOzs7QUFHSixJQUFJLFlBQVksR0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkosU0FBUyxJQUFULENBQWMsSUFBZCxFQUFvQjtBQUNsQixTQUFPLGNBQWMsSUFBZCxFQUFvQixTQUFwQixDQUFQLENBRGtCO0NBQXBCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJmbGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwcGVyJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHdyYXBwZXIgbWV0YWRhdGEuICovXG52YXIgRkxJUF9GTEFHID0gNTEyO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggYXJndW1lbnRzIHJldmVyc2VkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZmxpcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmxpcHBlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGZsaXBwZWQgPSBfLmZsaXAoZnVuY3Rpb24oKSB7XG4gKiAgIHJldHVybiBfLnRvQXJyYXkoYXJndW1lbnRzKTtcbiAqIH0pO1xuICpcbiAqIGZsaXBwZWQoJ2EnLCAnYicsICdjJywgJ2QnKTtcbiAqIC8vID0+IFsnZCcsICdjJywgJ2InLCAnYSddXG4gKi9cbmZ1bmN0aW9uIGZsaXAoZnVuYykge1xuICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCBGTElQX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsaXA7XG4iXX0=