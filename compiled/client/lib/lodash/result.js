'use strict';

var castPath = require('./_castPath'),
    isFunction = require('./isFunction'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * This method is like `_.get` except that if the resolved value is a
 * function it's invoked with the `this` binding of its parent object and
 * its result is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a[0].b.c3', 'default');
 * // => 'default'
 *
 * _.result(object, 'a[0].b.c3', _.constant('default'));
 * // => 'default'
 */
function result(object, path, defaultValue) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length;

  // Ensure the loop is entered when path is empty.
  if (!length) {
    object = undefined;
    length = 1;
  }
  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];
    if (value === undefined) {
      index = length;
      value = defaultValue;
    }
    object = isFunction(value) ? value.call(object) : value;
  }
  return object;
}

module.exports = result;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Jlc3VsdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGFBQWEsUUFBUSxjQUFSLENBQWI7SUFDQSxRQUFRLFFBQVEsVUFBUixDQUFSO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCSixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEIsRUFBOEIsWUFBOUIsRUFBNEM7QUFDMUMsU0FBTyxNQUFNLElBQU4sRUFBWSxNQUFaLElBQXNCLENBQUMsSUFBRCxDQUF0QixHQUErQixTQUFTLElBQVQsQ0FBL0IsQ0FEbUM7O0FBRzFDLE1BQUksUUFBUSxDQUFDLENBQUQ7TUFDUixTQUFTLEtBQUssTUFBTDs7O0FBSjZCLE1BT3RDLENBQUMsTUFBRCxFQUFTO0FBQ1gsYUFBUyxTQUFULENBRFc7QUFFWCxhQUFTLENBQVQsQ0FGVztHQUFiO0FBSUEsU0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFFBQUksUUFBUSxVQUFVLElBQVYsR0FBaUIsU0FBakIsR0FBNkIsT0FBTyxNQUFNLEtBQUssS0FBTCxDQUFOLENBQVAsQ0FBN0IsQ0FEVztBQUV2QixRQUFJLFVBQVUsU0FBVixFQUFxQjtBQUN2QixjQUFRLE1BQVIsQ0FEdUI7QUFFdkIsY0FBUSxZQUFSLENBRnVCO0tBQXpCO0FBSUEsYUFBUyxXQUFXLEtBQVgsSUFBb0IsTUFBTSxJQUFOLENBQVcsTUFBWCxDQUFwQixHQUF5QyxLQUF6QyxDQU5jO0dBQXpCO0FBUUEsU0FBTyxNQUFQLENBbkIwQztDQUE1Qzs7QUFzQkEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6InJlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5nZXRgIGV4Y2VwdCB0aGF0IGlmIHRoZSByZXNvbHZlZCB2YWx1ZSBpcyBhXG4gKiBmdW5jdGlvbiBpdCdzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgaXRzIHBhcmVudCBvYmplY3QgYW5kXG4gKiBpdHMgcmVzdWx0IGlzIHJldHVybmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byByZXNvbHZlLlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MxJzogMywgJ2MyJzogXy5jb25zdGFudCg0KSB9IH1dIH07XG4gKlxuICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMxJyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMyJyk7XG4gKiAvLyA9PiA0XG4gKlxuICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMzJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICpcbiAqIF8ucmVzdWx0KG9iamVjdCwgJ2FbMF0uYi5jMycsIF8uY29uc3RhbnQoJ2RlZmF1bHQnKSk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gcmVzdWx0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICAvLyBFbnN1cmUgdGhlIGxvb3AgaXMgZW50ZXJlZCB3aGVuIHBhdGggaXMgZW1wdHkuXG4gIGlmICghbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gdW5kZWZpbmVkO1xuICAgIGxlbmd0aCA9IDE7XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFt0b0tleShwYXRoW2luZGV4XSldO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpbmRleCA9IGxlbmd0aDtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBvYmplY3QgPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdWx0O1xuIl19