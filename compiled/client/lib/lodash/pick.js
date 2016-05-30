'use strict';

var arrayMap = require('./_arrayMap'),
    baseFlatten = require('./_baseFlatten'),
    basePick = require('./_basePick'),
    rest = require('./rest'),
    toKey = require('./_toKey');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = rest(function (object, props) {
  return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
});

module.exports = pick;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BpY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxjQUFjLFFBQVEsZ0JBQVIsQ0FEbEI7SUFFSSxXQUFXLFFBQVEsYUFBUixDQUZmO0lBR0ksT0FBTyxRQUFRLFFBQVIsQ0FIWDtJQUlJLFFBQVEsUUFBUSxVQUFSLENBSlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBSSxPQUFPLEtBQUssVUFBUyxNQUFULEVBQWlCLEtBQWpCLEVBQXdCO0FBQ3RDLFNBQU8sVUFBVSxJQUFWLEdBQWlCLEVBQWpCLEdBQXNCLFNBQVMsTUFBVCxFQUFpQixTQUFTLFlBQVksS0FBWixFQUFtQixDQUFuQixDQUFULEVBQWdDLEtBQWhDLENBQWpCLENBQTdCO0FBQ0QsQ0FGVSxDQUFYOztBQUlBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJwaWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVBpY2sgPSByZXF1aXJlKCcuL19iYXNlUGljaycpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBgb2JqZWN0YCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0gey4uLihzdHJpbmd8c3RyaW5nW10pfSBbcHJvcHNdIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gKlxuICogXy5waWNrKG9iamVjdCwgWydhJywgJ2MnXSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xudmFyIHBpY2sgPSByZXN0KGZ1bmN0aW9uKG9iamVjdCwgcHJvcHMpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8ge30gOiBiYXNlUGljayhvYmplY3QsIGFycmF5TWFwKGJhc2VGbGF0dGVuKHByb3BzLCAxKSwgdG9LZXkpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2s7XG4iXX0=