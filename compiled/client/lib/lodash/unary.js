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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuYXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxNQUFNLFFBQVEsT0FBUixDQUFOOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCSixTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ25CLFNBQU8sSUFBSSxJQUFKLEVBQVUsQ0FBVixDQUFQLENBRG1CO0NBQXJCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJ1bmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnkgPSByZXF1aXJlKCcuL2FyeScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgdXAgdG8gb25lIGFyZ3VtZW50LCBpZ25vcmluZyBhbnlcbiAqIGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubWFwKFsnNicsICc4JywgJzEwJ10sIF8udW5hcnkocGFyc2VJbnQpKTtcbiAqIC8vID0+IFs2LCA4LCAxMF1cbiAqL1xuZnVuY3Rpb24gdW5hcnkoZnVuYykge1xuICByZXR1cm4gYXJ5KGZ1bmMsIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuYXJ5O1xuIl19