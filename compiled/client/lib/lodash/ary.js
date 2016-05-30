'use strict';

var createWrapper = require('./_createWrapper');

/** Used to compose bitmasks for wrapper metadata. */
var ARY_FLAG = 128;

/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
}

module.exports = ary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2FyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7OztBQUdBLElBQUksV0FBVyxHQUFmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFNBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUIsQ0FBbkIsRUFBc0IsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSSxRQUFRLFNBQVIsR0FBb0IsQ0FBeEI7QUFDQSxNQUFLLFFBQVEsS0FBSyxJQUFkLEdBQXNCLEtBQUssTUFBM0IsR0FBb0MsQ0FBeEM7QUFDQSxTQUFPLGNBQWMsSUFBZCxFQUFvQixRQUFwQixFQUE4QixTQUE5QixFQUF5QyxTQUF6QyxFQUFvRCxTQUFwRCxFQUErRCxTQUEvRCxFQUEwRSxDQUExRSxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6ImFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlV3JhcHBlcicpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEFSWV9GTEFHID0gMTI4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHVwIHRvIGBuYCBhcmd1bWVudHMsXG4gKiBpZ25vcmluZyBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj1mdW5jLmxlbmd0aF0gVGhlIGFyaXR5IGNhcC5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubWFwKFsnNicsICc4JywgJzEwJ10sIF8uYXJ5KHBhcnNlSW50LCAxKSk7XG4gKiAvLyA9PiBbNiwgOCwgMTBdXG4gKi9cbmZ1bmN0aW9uIGFyeShmdW5jLCBuLCBndWFyZCkge1xuICBuID0gZ3VhcmQgPyB1bmRlZmluZWQgOiBuO1xuICBuID0gKGZ1bmMgJiYgbiA9PSBudWxsKSA/IGZ1bmMubGVuZ3RoIDogbjtcbiAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIoZnVuYywgQVJZX0ZMQUcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJ5O1xuIl19