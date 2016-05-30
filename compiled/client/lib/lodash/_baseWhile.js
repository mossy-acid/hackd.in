'use strict';

var baseSlice = require('./_baseSlice');

/**
 * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
 * without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the slice of `array`.
 */
function baseWhile(array, predicate, isDrop, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}

  return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
}

module.exports = baseWhile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlV2hpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLE1BQXJDLEVBQTZDLFNBQTdDLEVBQXdEO0FBQ3RELE1BQUksU0FBUyxNQUFNLE1BQW5CO01BQ0ksUUFBUSxZQUFZLE1BQVosR0FBcUIsQ0FBQyxDQURsQzs7QUFHQSxTQUFPLENBQUMsWUFBWSxPQUFaLEdBQXNCLEVBQUUsS0FBRixHQUFVLE1BQWpDLEtBQ0wsVUFBVSxNQUFNLEtBQU4sQ0FBVixFQUF3QixLQUF4QixFQUErQixLQUEvQixDQURGLEVBQ3lDLENBQUU7O0FBRTNDLFNBQU8sU0FDSCxVQUFVLEtBQVYsRUFBa0IsWUFBWSxDQUFaLEdBQWdCLEtBQWxDLEVBQTJDLFlBQVksUUFBUSxDQUFwQixHQUF3QixNQUFuRSxDQURHLEdBRUgsVUFBVSxLQUFWLEVBQWtCLFlBQVksUUFBUSxDQUFwQixHQUF3QixDQUExQyxFQUErQyxZQUFZLE1BQVosR0FBcUIsS0FBcEUsQ0FGSjtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfYmFzZVdoaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTbGljZSA9IHJlcXVpcmUoJy4vX2Jhc2VTbGljZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5kcm9wV2hpbGVgIGFuZCBgXy50YWtlV2hpbGVgXG4gKiB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEcm9wXSBTcGVjaWZ5IGRyb3BwaW5nIGVsZW1lbnRzIGluc3RlYWQgb2YgdGFraW5nIHRoZW0uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVdoaWxlKGFycmF5LCBwcmVkaWNhdGUsIGlzRHJvcCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpICYmXG4gICAgcHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge31cblxuICByZXR1cm4gaXNEcm9wXG4gICAgPyBiYXNlU2xpY2UoYXJyYXksIChmcm9tUmlnaHQgPyAwIDogaW5kZXgpLCAoZnJvbVJpZ2h0ID8gaW5kZXggKyAxIDogbGVuZ3RoKSlcbiAgICA6IGJhc2VTbGljZShhcnJheSwgKGZyb21SaWdodCA/IGluZGV4ICsgMSA6IDApLCAoZnJvbVJpZ2h0ID8gbGVuZ3RoIDogaW5kZXgpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlV2hpbGU7XG4iXX0=