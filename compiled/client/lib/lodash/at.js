'use strict';

var baseAt = require('./_baseAt'),
    baseFlatten = require('./_baseFlatten'),
    rest = require('./rest');

/**
 * Creates an array of values corresponding to `paths` of `object`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {...(string|string[])} [paths] The property paths of elements to pick.
 * @returns {Array} Returns the picked values.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _.at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 */
var at = rest(function (object, paths) {
  return baseAt(object, baseFlatten(paths, 1));
});

module.exports = at;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2F0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJKLElBQUksS0FBSyxLQUFLLFVBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QjtBQUNwQyxTQUFPLE9BQU8sTUFBUCxFQUFlLFlBQVksS0FBWixFQUFtQixDQUFuQixDQUFmLENBQVAsQ0FEb0M7Q0FBeEIsQ0FBVjs7QUFJSixPQUFPLE9BQVAsR0FBaUIsRUFBakIiLCJmaWxlIjoiYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUF0ID0gcmVxdWlyZSgnLi9fYmFzZUF0JyksXG4gICAgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIGBwYXRoc2Agb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwYXRoc10gVGhlIHByb3BlcnR5IHBhdGhzIG9mIGVsZW1lbnRzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHBpY2tlZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH0sIDRdIH07XG4gKlxuICogXy5hdChvYmplY3QsIFsnYVswXS5iLmMnLCAnYVsxXSddKTtcbiAqIC8vID0+IFszLCA0XVxuICovXG52YXIgYXQgPSByZXN0KGZ1bmN0aW9uKG9iamVjdCwgcGF0aHMpIHtcbiAgcmV0dXJuIGJhc2VBdChvYmplY3QsIGJhc2VGbGF0dGVuKHBhdGhzLCAxKSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhdDtcbiJdfQ==