'use strict';

var baseGet = require('./_baseGet');

/**
 * The opposite of `_.property`; this method creates a function that returns
 * the value at a given path of `object`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var array = [0, 1, 2],
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
 * // => [2, 0]
 */
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}

module.exports = propertyOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Byb3BlcnR5T2YuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQVY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUMxQixTQUFPLFVBQVMsSUFBVCxFQUFlO0FBQ3BCLFdBQU8sVUFBVSxJQUFWLEdBQWlCLFNBQWpCLEdBQTZCLFFBQVEsTUFBUixFQUFnQixJQUFoQixDQUE3QixDQURhO0dBQWYsQ0FEbUI7Q0FBNUI7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6InByb3BlcnR5T2YuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBUaGUgb3Bwb3NpdGUgb2YgYF8ucHJvcGVydHlgOyB0aGlzIG1ldGhvZCBjcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gKiB0aGUgdmFsdWUgYXQgYSBnaXZlbiBwYXRoIG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWzAsIDEsIDJdLFxuICogICAgIG9iamVjdCA9IHsgJ2EnOiBhcnJheSwgJ2InOiBhcnJheSwgJ2MnOiBhcnJheSB9O1xuICpcbiAqIF8ubWFwKFsnYVsyXScsICdjWzBdJ10sIF8ucHJvcGVydHlPZihvYmplY3QpKTtcbiAqIC8vID0+IFsyLCAwXVxuICpcbiAqIF8ubWFwKFtbJ2EnLCAnMiddLCBbJ2MnLCAnMCddXSwgXy5wcm9wZXJ0eU9mKG9iamVjdCkpO1xuICogLy8gPT4gWzIsIDBdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5T2Yob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5T2Y7XG4iXX0=