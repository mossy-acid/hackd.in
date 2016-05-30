'use strict';

var arrayMap = require('./_arrayMap'),
    baseIndexOf = require('./_baseIndexOf'),
    baseIndexOfWith = require('./_baseIndexOfWith'),
    baseUnary = require('./_baseUnary'),
    copyArray = require('./_copyArray');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}

module.exports = basePullAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUHVsbEFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0Esa0JBQWtCLFFBQVEsb0JBQVIsQ0FBbEI7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjs7O0FBR0osSUFBSSxhQUFhLE1BQU0sU0FBTjs7O0FBR2pCLElBQUksU0FBUyxXQUFXLE1BQVg7Ozs7Ozs7Ozs7Ozs7QUFhYixTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsUUFBcEMsRUFBOEMsVUFBOUMsRUFBMEQ7QUFDeEQsTUFBSSxVQUFVLGFBQWEsZUFBYixHQUErQixXQUEvQjtNQUNWLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxPQUFPLE1BQVA7TUFDVCxPQUFPLEtBQVAsQ0FKb0Q7O0FBTXhELE1BQUksVUFBVSxNQUFWLEVBQWtCO0FBQ3BCLGFBQVMsVUFBVSxNQUFWLENBQVQsQ0FEb0I7R0FBdEI7QUFHQSxNQUFJLFFBQUosRUFBYztBQUNaLFdBQU8sU0FBUyxLQUFULEVBQWdCLFVBQVUsUUFBVixDQUFoQixDQUFQLENBRFk7R0FBZDtBQUdBLFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFrQjtBQUN2QixRQUFJLFlBQVksQ0FBWjtRQUNBLFFBQVEsT0FBTyxLQUFQLENBQVI7UUFDQSxXQUFXLFdBQVcsU0FBUyxLQUFULENBQVgsR0FBNkIsS0FBN0IsQ0FIUTs7QUFLdkIsV0FBTyxDQUFDLFlBQVksUUFBUSxJQUFSLEVBQWMsUUFBZCxFQUF3QixTQUF4QixFQUFtQyxVQUFuQyxDQUFaLENBQUQsR0FBK0QsQ0FBQyxDQUFELEVBQUk7QUFDeEUsVUFBSSxTQUFTLEtBQVQsRUFBZ0I7QUFDbEIsZUFBTyxJQUFQLENBQVksSUFBWixFQUFrQixTQUFsQixFQUE2QixDQUE3QixFQURrQjtPQUFwQjtBQUdBLGFBQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsU0FBbkIsRUFBOEIsQ0FBOUIsRUFKd0U7S0FBMUU7R0FMRjtBQVlBLFNBQU8sS0FBUCxDQXhCd0Q7Q0FBMUQ7O0FBMkJBLE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJfYmFzZVB1bGxBbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKSxcbiAgICBiYXNlSW5kZXhPZldpdGggPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZldpdGgnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBbGxCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXhPZiA9IGNvbXBhcmF0b3IgPyBiYXNlSW5kZXhPZldpdGggOiBiYXNlSW5kZXhPZixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgc2VlbiA9IGFycmF5O1xuXG4gIGlmIChhcnJheSA9PT0gdmFsdWVzKSB7XG4gICAgdmFsdWVzID0gY29weUFycmF5KHZhbHVlcyk7XG4gIH1cbiAgaWYgKGl0ZXJhdGVlKSB7XG4gICAgc2VlbiA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBmcm9tSW5kZXggPSAwLFxuICAgICAgICB2YWx1ZSA9IHZhbHVlc1tpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHdoaWxlICgoZnJvbUluZGV4ID0gaW5kZXhPZihzZWVuLCBjb21wdXRlZCwgZnJvbUluZGV4LCBjb21wYXJhdG9yKSkgPiAtMSkge1xuICAgICAgaWYgKHNlZW4gIT09IGFycmF5KSB7XG4gICAgICAgIHNwbGljZS5jYWxsKHNlZW4sIGZyb21JbmRleCwgMSk7XG4gICAgICB9XG4gICAgICBzcGxpY2UuY2FsbChhcnJheSwgZnJvbUluZGV4LCAxKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQdWxsQWxsO1xuIl19