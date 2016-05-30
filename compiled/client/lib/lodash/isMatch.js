'use strict';

var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData');

/**
 * Performs a partial deep comparison between `object` and `source` to
 * determine if `object` contains equivalent property values. This method is
 * equivalent to a `_.matches` function when `source` is partially applied.
 *
 * **Note:** This method supports comparing the same values as `_.isEqual`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.isMatch(object, { 'age': 40 });
 * // => true
 *
 * _.isMatch(object, { 'age': 36 });
 * // => false
 */
function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

module.exports = isMatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTWF0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLEVBQWlDO0FBQy9CLFNBQU8sV0FBVyxNQUFYLElBQXFCLFlBQVksTUFBWixFQUFvQixNQUFwQixFQUE0QixhQUFhLE1BQWIsQ0FBNUIsQ0FBNUI7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiaXNNYXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXNNYXRjaCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hdGNoJyksXG4gICAgZ2V0TWF0Y2hEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWF0Y2hEYXRhJyk7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIGBvYmplY3RgIGFuZCBgc291cmNlYCB0b1xuICogZGV0ZXJtaW5lIGlmIGBvYmplY3RgIGNvbnRhaW5zIGVxdWl2YWxlbnQgcHJvcGVydHkgdmFsdWVzLiBUaGlzIG1ldGhvZCBpc1xuICogZXF1aXZhbGVudCB0byBhIGBfLm1hdGNoZXNgIGZ1bmN0aW9uIHdoZW4gYHNvdXJjZWAgaXMgcGFydGlhbGx5IGFwcGxpZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgYF8uaXNFcXVhbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfTtcbiAqXG4gKiBfLmlzTWF0Y2gob2JqZWN0LCB7ICdhZ2UnOiA0MCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWF0Y2gob2JqZWN0LCB7ICdhZ2UnOiAzNiB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTWF0Y2gob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCA9PT0gc291cmNlIHx8IGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBnZXRNYXRjaERhdGEoc291cmNlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXRjaDtcbiJdfQ==