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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUHVsbEFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBZjtJQUNJLGNBQWMsUUFBUSxnQkFBUixDQURsQjtJQUVJLGtCQUFrQixRQUFRLG9CQUFSLENBRnRCO0lBR0ksWUFBWSxRQUFRLGNBQVIsQ0FIaEI7SUFJSSxZQUFZLFFBQVEsY0FBUixDQUpoQjs7O0FBT0EsSUFBSSxhQUFhLE1BQU0sU0FBdkI7OztBQUdBLElBQUksU0FBUyxXQUFXLE1BQXhCOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DLFFBQXBDLEVBQThDLFVBQTlDLEVBQTBEO0FBQ3hELE1BQUksVUFBVSxhQUFhLGVBQWIsR0FBK0IsV0FBN0M7TUFDSSxRQUFRLENBQUMsQ0FEYjtNQUVJLFNBQVMsT0FBTyxNQUZwQjtNQUdJLE9BQU8sS0FIWDs7QUFLQSxNQUFJLFVBQVUsTUFBZCxFQUFzQjtBQUNwQixhQUFTLFVBQVUsTUFBVixDQUFUO0FBQ0Q7QUFDRCxNQUFJLFFBQUosRUFBYztBQUNaLFdBQU8sU0FBUyxLQUFULEVBQWdCLFVBQVUsUUFBVixDQUFoQixDQUFQO0FBQ0Q7QUFDRCxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksWUFBWSxDQUFoQjtRQUNJLFFBQVEsT0FBTyxLQUFQLENBRFo7UUFFSSxXQUFXLFdBQVcsU0FBUyxLQUFULENBQVgsR0FBNkIsS0FGNUM7O0FBSUEsV0FBTyxDQUFDLFlBQVksUUFBUSxJQUFSLEVBQWMsUUFBZCxFQUF3QixTQUF4QixFQUFtQyxVQUFuQyxDQUFiLElBQStELENBQUMsQ0FBdkUsRUFBMEU7QUFDeEUsVUFBSSxTQUFTLEtBQWIsRUFBb0I7QUFDbEIsZUFBTyxJQUFQLENBQVksSUFBWixFQUFrQixTQUFsQixFQUE2QixDQUE3QjtBQUNEO0FBQ0QsYUFBTyxJQUFQLENBQVksS0FBWixFQUFtQixTQUFuQixFQUE4QixDQUE5QjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2Jhc2VQdWxsQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyksXG4gICAgYmFzZUluZGV4T2ZXaXRoID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2ZXaXRoJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQWxsQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4T2YgPSBjb21wYXJhdG9yID8gYmFzZUluZGV4T2ZXaXRoIDogYmFzZUluZGV4T2YsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHNlZW4gPSBhcnJheTtcblxuICBpZiAoYXJyYXkgPT09IHZhbHVlcykge1xuICAgIHZhbHVlcyA9IGNvcHlBcnJheSh2YWx1ZXMpO1xuICB9XG4gIGlmIChpdGVyYXRlZSkge1xuICAgIHNlZW4gPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZnJvbUluZGV4ID0gMCxcbiAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB3aGlsZSAoKGZyb21JbmRleCA9IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQsIGZyb21JbmRleCwgY29tcGFyYXRvcikpID4gLTEpIHtcbiAgICAgIGlmIChzZWVuICE9PSBhcnJheSkge1xuICAgICAgICBzcGxpY2UuY2FsbChzZWVuLCBmcm9tSW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGZyb21JbmRleCwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEFsbDtcbiJdfQ==