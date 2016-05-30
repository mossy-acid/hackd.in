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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVo7SUFDSSxXQUFXLFFBQVEsYUFBUixDQURmO0lBRUksZUFBZSxRQUFRLGlCQUFSLENBRm5CO0lBR0ksT0FBTyxRQUFRLFFBQVIsQ0FIWDs7O0FBTUEsSUFBSSxrQkFBa0IscUJBQXRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JBLFNBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUI7QUFDbkIsTUFBSSxTQUFTLFFBQVEsTUFBTSxNQUFkLEdBQXVCLENBQXBDO01BQ0ksYUFBYSxZQURqQjs7QUFHQSxVQUFRLENBQUMsTUFBRCxHQUFVLEVBQVYsR0FBZSxTQUFTLEtBQVQsRUFBZ0IsVUFBUyxJQUFULEVBQWU7QUFDcEQsUUFBSSxPQUFPLEtBQUssQ0FBTCxDQUFQLElBQWtCLFVBQXRCLEVBQWtDO0FBQ2hDLFlBQU0sSUFBSSxTQUFKLENBQWMsZUFBZCxDQUFOO0FBQ0Q7QUFDRCxXQUFPLENBQUMsV0FBVyxLQUFLLENBQUwsQ0FBWCxDQUFELEVBQXNCLEtBQUssQ0FBTCxDQUF0QixDQUFQO0FBQ0QsR0FMc0IsQ0FBdkI7O0FBT0EsU0FBTyxLQUFLLFVBQVMsSUFBVCxFQUFlO0FBQ3pCLFFBQUksUUFBUSxDQUFDLENBQWI7QUFDQSxXQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFVBQUksT0FBTyxNQUFNLEtBQU4sQ0FBWDtBQUNBLFVBQUksTUFBTSxLQUFLLENBQUwsQ0FBTixFQUFlLElBQWYsRUFBcUIsSUFBckIsQ0FBSixFQUFnQztBQUM5QixlQUFPLE1BQU0sS0FBSyxDQUFMLENBQU4sRUFBZSxJQUFmLEVBQXFCLElBQXJCLENBQVA7QUFDRDtBQUNGO0FBQ0YsR0FSTSxDQUFQO0FBU0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImNvbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGl0ZXJhdGVzIG92ZXIgYHBhaXJzYCBhbmQgaW52b2tlcyB0aGUgY29ycmVzcG9uZGluZ1xuICogZnVuY3Rpb24gb2YgdGhlIGZpcnN0IHByZWRpY2F0ZSB0byByZXR1cm4gdHJ1dGh5LiBUaGUgcHJlZGljYXRlLWZ1bmN0aW9uXG4gKiBwYWlycyBhcmUgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzIG9mIHRoZSBjcmVhdGVkXG4gKiBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheX0gcGFpcnMgVGhlIHByZWRpY2F0ZS1mdW5jdGlvbiBwYWlycy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbXBvc2l0ZSBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGZ1bmMgPSBfLmNvbmQoW1xuICogICBbXy5tYXRjaGVzKHsgJ2EnOiAxIH0pLCAgICAgICAgICAgXy5jb25zdGFudCgnbWF0Y2hlcyBBJyldLFxuICogICBbXy5jb25mb3Jtcyh7ICdiJzogXy5pc051bWJlciB9KSwgXy5jb25zdGFudCgnbWF0Y2hlcyBCJyldLFxuICogICBbXy5jb25zdGFudCh0cnVlKSwgICAgICAgICAgICAgICAgXy5jb25zdGFudCgnbm8gbWF0Y2gnKV1cbiAqIF0pO1xuICpcbiAqIGZ1bmMoeyAnYSc6IDEsICdiJzogMiB9KTtcbiAqIC8vID0+ICdtYXRjaGVzIEEnXG4gKlxuICogZnVuYyh7ICdhJzogMCwgJ2InOiAxIH0pO1xuICogLy8gPT4gJ21hdGNoZXMgQidcbiAqXG4gKiBmdW5jKHsgJ2EnOiAnMScsICdiJzogJzInIH0pO1xuICogLy8gPT4gJ25vIG1hdGNoJ1xuICovXG5mdW5jdGlvbiBjb25kKHBhaXJzKSB7XG4gIHZhciBsZW5ndGggPSBwYWlycyA/IHBhaXJzLmxlbmd0aCA6IDAsXG4gICAgICB0b0l0ZXJhdGVlID0gYmFzZUl0ZXJhdGVlO1xuXG4gIHBhaXJzID0gIWxlbmd0aCA/IFtdIDogYXJyYXlNYXAocGFpcnMsIGZ1bmN0aW9uKHBhaXIpIHtcbiAgICBpZiAodHlwZW9mIHBhaXJbMV0gIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICByZXR1cm4gW3RvSXRlcmF0ZWUocGFpclswXSksIHBhaXJbMV1dO1xuICB9KTtcblxuICByZXR1cm4gcmVzdChmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBwYWlyID0gcGFpcnNbaW5kZXhdO1xuICAgICAgaWYgKGFwcGx5KHBhaXJbMF0sIHRoaXMsIGFyZ3MpKSB7XG4gICAgICAgIHJldHVybiBhcHBseShwYWlyWzFdLCB0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmQ7XG4iXX0=