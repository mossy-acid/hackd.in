'use strict';

var apply = require('./_apply'),
    arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    rest = require('./rest');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that iterates over `pairs` and invokes the corresponding
 * function of the first predicate to return truthy. The predicate-function
 * pairs are invoked with the `this` binding and arguments of the created
 * function.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Array} pairs The predicate-function pairs.
 * @returns {Function} Returns the new composite function.
 * @example
 *
 * var func = _.cond([
 *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
 *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
 *   [_.constant(true),                _.constant('no match')]
 * ]);
 *
 * func({ 'a': 1, 'b': 2 });
 * // => 'matches A'
 *
 * func({ 'a': 0, 'b': 1 });
 * // => 'matches B'
 *
 * func({ 'a': '1', 'b': '2' });
 * // => 'no match'
 */
function cond(pairs) {
  var length = pairs ? pairs.length : 0,
      toIteratee = baseIteratee;

  pairs = !length ? [] : arrayMap(pairs, function (pair) {
    if (typeof pair[1] != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return [toIteratee(pair[0]), pair[1]];
  });

  return rest(function (args) {
    var index = -1;
    while (++index < length) {
      var pair = pairs[index];
      if (apply(pair[0], this, args)) {
        return apply(pair[1], this, args);
      }
    }
  });
}

module.exports = cond;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7QUFHSixJQUFJLGtCQUFrQixxQkFBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkosU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQjtBQUNuQixNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QjtNQUNULGFBQWEsWUFBYixDQUZlOztBQUluQixVQUFRLENBQUMsTUFBRCxHQUFVLEVBQVYsR0FBZSxTQUFTLEtBQVQsRUFBZ0IsVUFBUyxJQUFULEVBQWU7QUFDcEQsUUFBSSxPQUFPLEtBQUssQ0FBTCxDQUFQLElBQWtCLFVBQWxCLEVBQThCO0FBQ2hDLFlBQU0sSUFBSSxTQUFKLENBQWMsZUFBZCxDQUFOLENBRGdDO0tBQWxDO0FBR0EsV0FBTyxDQUFDLFdBQVcsS0FBSyxDQUFMLENBQVgsQ0FBRCxFQUFzQixLQUFLLENBQUwsQ0FBdEIsQ0FBUCxDQUpvRDtHQUFmLENBQS9CLENBSlc7O0FBV25CLFNBQU8sS0FBSyxVQUFTLElBQVQsRUFBZTtBQUN6QixRQUFJLFFBQVEsQ0FBQyxDQUFELENBRGE7QUFFekIsV0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFVBQUksT0FBTyxNQUFNLEtBQU4sQ0FBUCxDQURtQjtBQUV2QixVQUFJLE1BQU0sS0FBSyxDQUFMLENBQU4sRUFBZSxJQUFmLEVBQXFCLElBQXJCLENBQUosRUFBZ0M7QUFDOUIsZUFBTyxNQUFNLEtBQUssQ0FBTCxDQUFOLEVBQWUsSUFBZixFQUFxQixJQUFyQixDQUFQLENBRDhCO09BQWhDO0tBRkY7R0FGVSxDQUFaLENBWG1CO0NBQXJCOztBQXNCQSxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoiY29uZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5JyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXRlcmF0ZXMgb3ZlciBgcGFpcnNgIGFuZCBpbnZva2VzIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBmdW5jdGlvbiBvZiB0aGUgZmlyc3QgcHJlZGljYXRlIHRvIHJldHVybiB0cnV0aHkuIFRoZSBwcmVkaWNhdGUtZnVuY3Rpb25cbiAqIHBhaXJzIGFyZSBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWRcbiAqIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlycyBUaGUgcHJlZGljYXRlLWZ1bmN0aW9uIHBhaXJzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgZnVuYyA9IF8uY29uZChbXG4gKiAgIFtfLm1hdGNoZXMoeyAnYSc6IDEgfSksICAgICAgICAgICBfLmNvbnN0YW50KCdtYXRjaGVzIEEnKV0sXG4gKiAgIFtfLmNvbmZvcm1zKHsgJ2InOiBfLmlzTnVtYmVyIH0pLCBfLmNvbnN0YW50KCdtYXRjaGVzIEInKV0sXG4gKiAgIFtfLmNvbnN0YW50KHRydWUpLCAgICAgICAgICAgICAgICBfLmNvbnN0YW50KCdubyBtYXRjaCcpXVxuICogXSk7XG4gKlxuICogZnVuYyh7ICdhJzogMSwgJ2InOiAyIH0pO1xuICogLy8gPT4gJ21hdGNoZXMgQSdcbiAqXG4gKiBmdW5jKHsgJ2EnOiAwLCAnYic6IDEgfSk7XG4gKiAvLyA9PiAnbWF0Y2hlcyBCJ1xuICpcbiAqIGZ1bmMoeyAnYSc6ICcxJywgJ2InOiAnMicgfSk7XG4gKiAvLyA9PiAnbm8gbWF0Y2gnXG4gKi9cbmZ1bmN0aW9uIGNvbmQocGFpcnMpIHtcbiAgdmFyIGxlbmd0aCA9IHBhaXJzID8gcGFpcnMubGVuZ3RoIDogMCxcbiAgICAgIHRvSXRlcmF0ZWUgPSBiYXNlSXRlcmF0ZWU7XG5cbiAgcGFpcnMgPSAhbGVuZ3RoID8gW10gOiBhcnJheU1hcChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgIGlmICh0eXBlb2YgcGFpclsxXSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICAgIHJldHVybiBbdG9JdGVyYXRlZShwYWlyWzBdKSwgcGFpclsxXV07XG4gIH0pO1xuXG4gIHJldHVybiByZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHBhaXIgPSBwYWlyc1tpbmRleF07XG4gICAgICBpZiAoYXBwbHkocGFpclswXSwgdGhpcywgYXJncykpIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5KHBhaXJbMV0sIHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZDtcbiJdfQ==