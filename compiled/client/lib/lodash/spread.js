'use strict';

var apply = require('./_apply'),
    arrayPush = require('./_arrayPush'),
    castSlice = require('./_castSlice'),
    rest = require('./rest'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * create function and an array of arguments much like
 * [`Function#apply`](http://www.ecma-international.org/ecma-262/6.0/#sec-function.prototype.apply).
 *
 * **Note:** This method is based on the
 * [spread operator](https://mdn.io/spread_operator).
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Function
 * @param {Function} func The function to spread arguments over.
 * @param {number} [start=0] The start position of the spread.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.spread(function(who, what) {
 *   return who + ' says ' + what;
 * });
 *
 * say(['fred', 'hello']);
 * // => 'fred says hello'
 *
 * var numbers = Promise.all([
 *   Promise.resolve(40),
 *   Promise.resolve(36)
 * ]);
 *
 * numbers.then(_.spread(function(x, y) {
 *   return x + y;
 * }));
 * // => a Promise of 76
 */
function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
  return rest(function (args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }
    return apply(func, this, otherArgs);
  });
}

module.exports = spread;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NwcmVhZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLFlBQVksUUFBUSxhQUFSLENBQVo7OztBQUdKLElBQUksa0JBQWtCLHFCQUFsQjs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NoQixTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSSxPQUFPLElBQVAsSUFBZSxVQUFmLEVBQTJCO0FBQzdCLFVBQU0sSUFBSSxTQUFKLENBQWMsZUFBZCxDQUFOLENBRDZCO0dBQS9CO0FBR0EsVUFBUSxVQUFVLFNBQVYsR0FBc0IsQ0FBdEIsR0FBMEIsVUFBVSxVQUFVLEtBQVYsQ0FBVixFQUE0QixDQUE1QixDQUExQixDQUptQjtBQUszQixTQUFPLEtBQUssVUFBUyxJQUFULEVBQWU7QUFDekIsUUFBSSxRQUFRLEtBQUssS0FBTCxDQUFSO1FBQ0EsWUFBWSxVQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsS0FBbkIsQ0FBWixDQUZxQjs7QUFJekIsUUFBSSxLQUFKLEVBQVc7QUFDVCxnQkFBVSxTQUFWLEVBQXFCLEtBQXJCLEVBRFM7S0FBWDtBQUdBLFdBQU8sTUFBTSxJQUFOLEVBQVksSUFBWixFQUFrQixTQUFsQixDQUFQLENBUHlCO0dBQWYsQ0FBWixDQUwyQjtDQUE3Qjs7QUFnQkEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6InNwcmVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5JyksXG4gICAgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgY2FzdFNsaWNlID0gcmVxdWlyZSgnLi9fY2FzdFNsaWNlJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gKiBjcmVhdGUgZnVuY3Rpb24gYW5kIGFuIGFycmF5IG9mIGFyZ3VtZW50cyBtdWNoIGxpa2VcbiAqIFtgRnVuY3Rpb24jYXBwbHlgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtZnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5KS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlXG4gKiBbc3ByZWFkIG9wZXJhdG9yXShodHRwczovL21kbi5pby9zcHJlYWRfb3BlcmF0b3IpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4yLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gc3ByZWFkIGFyZ3VtZW50cyBvdmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHNwcmVhZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5zcHJlYWQoZnVuY3Rpb24od2hvLCB3aGF0KSB7XG4gKiAgIHJldHVybiB3aG8gKyAnIHNheXMgJyArIHdoYXQ7XG4gKiB9KTtcbiAqXG4gKiBzYXkoWydmcmVkJywgJ2hlbGxvJ10pO1xuICogLy8gPT4gJ2ZyZWQgc2F5cyBoZWxsbydcbiAqXG4gKiB2YXIgbnVtYmVycyA9IFByb21pc2UuYWxsKFtcbiAqICAgUHJvbWlzZS5yZXNvbHZlKDQwKSxcbiAqICAgUHJvbWlzZS5yZXNvbHZlKDM2KVxuICogXSk7XG4gKlxuICogbnVtYmVycy50aGVuKF8uc3ByZWFkKGZ1bmN0aW9uKHgsIHkpIHtcbiAqICAgcmV0dXJuIHggKyB5O1xuICogfSkpO1xuICogLy8gPT4gYSBQcm9taXNlIG9mIDc2XG4gKi9cbmZ1bmN0aW9uIHNwcmVhZChmdW5jLCBzdGFydCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBzdGFydCA9IHN0YXJ0ID09PSB1bmRlZmluZWQgPyAwIDogbmF0aXZlTWF4KHRvSW50ZWdlcihzdGFydCksIDApO1xuICByZXR1cm4gcmVzdChmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIGFycmF5ID0gYXJnc1tzdGFydF0sXG4gICAgICAgIG90aGVyQXJncyA9IGNhc3RTbGljZShhcmdzLCAwLCBzdGFydCk7XG5cbiAgICBpZiAoYXJyYXkpIHtcbiAgICAgIGFycmF5UHVzaChvdGhlckFyZ3MsIGFycmF5KTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNwcmVhZDtcbiJdfQ==