'use strict';

var baseSet = require('./_baseSet'),
    baseZipObject = require('./_baseZipObject');

/**
 * This method is like `_.zipObject` except that it supports property paths.
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
 * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
 */
function zipObjectDeep(props, values) {
  return baseZipObject(props || [], values || [], baseSet);
}

module.exports = zipObjectDeep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3ppcE9iamVjdERlZXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkosU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCLE1BQTlCLEVBQXNDO0FBQ3BDLFNBQU8sY0FBYyxTQUFTLEVBQVQsRUFBYSxVQUFVLEVBQVYsRUFBYyxPQUF6QyxDQUFQLENBRG9DO0NBQXRDOztBQUlBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJ6aXBPYmplY3REZWVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTZXQgPSByZXF1aXJlKCcuL19iYXNlU2V0JyksXG4gICAgYmFzZVppcE9iamVjdCA9IHJlcXVpcmUoJy4vX2Jhc2VaaXBPYmplY3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnppcE9iamVjdGAgZXhjZXB0IHRoYXQgaXQgc3VwcG9ydHMgcHJvcGVydHkgcGF0aHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHM9W11dIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycy5cbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXM9W11dIFRoZSBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnppcE9iamVjdERlZXAoWydhLmJbMF0uYycsICdhLmJbMV0uZCddLCBbMSwgMl0pO1xuICogLy8gPT4geyAnYSc6IHsgJ2InOiBbeyAnYyc6IDEgfSwgeyAnZCc6IDIgfV0gfSB9XG4gKi9cbmZ1bmN0aW9uIHppcE9iamVjdERlZXAocHJvcHMsIHZhbHVlcykge1xuICByZXR1cm4gYmFzZVppcE9iamVjdChwcm9wcyB8fCBbXSwgdmFsdWVzIHx8IFtdLCBiYXNlU2V0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB6aXBPYmplY3REZWVwO1xuIl19