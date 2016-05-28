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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2FyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7OztBQUdKLElBQUksV0FBVyxHQUFYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJKLFNBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUIsQ0FBbkIsRUFBc0IsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSSxRQUFRLFNBQVIsR0FBb0IsQ0FBcEIsQ0FEdUI7QUFFM0IsTUFBSSxJQUFDLElBQVEsS0FBSyxJQUFMLEdBQWEsS0FBSyxNQUFMLEdBQWMsQ0FBcEMsQ0FGdUI7QUFHM0IsU0FBTyxjQUFjLElBQWQsRUFBb0IsUUFBcEIsRUFBOEIsU0FBOUIsRUFBeUMsU0FBekMsRUFBb0QsU0FBcEQsRUFBK0QsU0FBL0QsRUFBMEUsQ0FBMUUsQ0FBUCxDQUgyQjtDQUE3Qjs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoiYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwcGVyJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHdyYXBwZXIgbWV0YWRhdGEuICovXG52YXIgQVJZX0ZMQUcgPSAxMjg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2AsIHdpdGggdXAgdG8gYG5gIGFyZ3VtZW50cyxcbiAqIGlnbm9yaW5nIGFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPWZ1bmMubGVuZ3RoXSBUaGUgYXJpdHkgY2FwLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5tYXAoWyc2JywgJzgnLCAnMTAnXSwgXy5hcnkocGFyc2VJbnQsIDEpKTtcbiAqIC8vID0+IFs2LCA4LCAxMF1cbiAqL1xuZnVuY3Rpb24gYXJ5KGZ1bmMsIG4sIGd1YXJkKSB7XG4gIG4gPSBndWFyZCA/IHVuZGVmaW5lZCA6IG47XG4gIG4gPSAoZnVuYyAmJiBuID09IG51bGwpID8gZnVuYy5sZW5ndGggOiBuO1xuICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCBBUllfRkxBRywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnk7XG4iXX0=