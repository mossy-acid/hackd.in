'use strict';

var ary = require('./ary');

/**
 * Creates a function that accepts up to one argument, ignoring any
 * additional arguments.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.unary(parseInt));
 * // => [6, 8, 10]
 */
function unary(func) {
  return ary(func, 1);
}

module.exports = unary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxNQUFNLFFBQVEsT0FBUixDQUFWOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ25CLFNBQU8sSUFBSSxJQUFKLEVBQVUsQ0FBVixDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6InVuYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFyeSA9IHJlcXVpcmUoJy4vYXJ5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB1cCB0byBvbmUgYXJndW1lbnQsIGlnbm9yaW5nIGFueVxuICogYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5tYXAoWyc2JywgJzgnLCAnMTAnXSwgXy51bmFyeShwYXJzZUludCkpO1xuICogLy8gPT4gWzYsIDgsIDEwXVxuICovXG5mdW5jdGlvbiB1bmFyeShmdW5jKSB7XG4gIHJldHVybiBhcnkoZnVuYywgMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5hcnk7XG4iXX0=