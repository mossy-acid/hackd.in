'use strict';

var arrayEach = require('./_arrayEach'),
    baseFlatten = require('./_baseFlatten'),
    bind = require('./bind'),
    rest = require('./rest'),
    toKey = require('./_toKey');

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method.
 *
 * **Note:** This method doesn't set the "length" property of bound functions.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...(string|string[])} methodNames The object method names to bind.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'onClick': function() {
 *     console.log('clicked ' + this.label);
 *   }
 * };
 *
 * _.bindAll(view, ['onClick']);
 * jQuery(element).on('click', view.onClick);
 * // => Logs 'clicked docs' when clicked.
 */
var bindAll = rest(function (object, methodNames) {
  arrayEach(baseFlatten(methodNames, 1), function (key) {
    key = toKey(key);
    object[key] = bind(object[key], object);
  });
  return object;
});

module.exports = bindAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2JpbmRBbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCSixJQUFJLFVBQVUsS0FBSyxVQUFTLE1BQVQsRUFBaUIsV0FBakIsRUFBOEI7QUFDL0MsWUFBVSxZQUFZLFdBQVosRUFBeUIsQ0FBekIsQ0FBVixFQUF1QyxVQUFTLEdBQVQsRUFBYztBQUNuRCxVQUFNLE1BQU0sR0FBTixDQUFOLENBRG1EO0FBRW5ELFdBQU8sR0FBUCxJQUFjLEtBQUssT0FBTyxHQUFQLENBQUwsRUFBa0IsTUFBbEIsQ0FBZCxDQUZtRDtHQUFkLENBQXZDLENBRCtDO0FBSy9DLFNBQU8sTUFBUCxDQUwrQztDQUE5QixDQUFmOztBQVFKLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJiaW5kQWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBiaW5kID0gcmVxdWlyZSgnLi9iaW5kJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBCaW5kcyBtZXRob2RzIG9mIGFuIG9iamVjdCB0byB0aGUgb2JqZWN0IGl0c2VsZiwgb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nXG4gKiBtZXRob2QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGRvZXNuJ3Qgc2V0IHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IG9mIGJvdW5kIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGJpbmQgYW5kIGFzc2lnbiB0aGUgYm91bmQgbWV0aG9kcyB0by5cbiAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IG1ldGhvZE5hbWVzIFRoZSBvYmplY3QgbWV0aG9kIG5hbWVzIHRvIGJpbmQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdmlldyA9IHtcbiAqICAgJ2xhYmVsJzogJ2RvY3MnLFxuICogICAnb25DbGljayc6IGZ1bmN0aW9uKCkge1xuICogICAgIGNvbnNvbGUubG9nKCdjbGlja2VkICcgKyB0aGlzLmxhYmVsKTtcbiAqICAgfVxuICogfTtcbiAqXG4gKiBfLmJpbmRBbGwodmlldywgWydvbkNsaWNrJ10pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHZpZXcub25DbGljayk7XG4gKiAvLyA9PiBMb2dzICdjbGlja2VkIGRvY3MnIHdoZW4gY2xpY2tlZC5cbiAqL1xudmFyIGJpbmRBbGwgPSByZXN0KGZ1bmN0aW9uKG9iamVjdCwgbWV0aG9kTmFtZXMpIHtcbiAgYXJyYXlFYWNoKGJhc2VGbGF0dGVuKG1ldGhvZE5hbWVzLCAxKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAga2V5ID0gdG9LZXkoa2V5KTtcbiAgICBvYmplY3Rba2V5XSA9IGJpbmQob2JqZWN0W2tleV0sIG9iamVjdCk7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZEFsbDtcbiJdfQ==