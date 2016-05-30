'use strict';

var arrayMap = require('./_arrayMap'),
    baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    basePick = require('./_basePick'),
    getAllKeysIn = require('./_getAllKeysIn'),
    rest = require('./rest'),
    toKey = require('./_toKey');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable string keyed properties of `object` that are
 * not omitted.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = rest(function (object, props) {
  if (object == null) {
    return {};
  }
  props = arrayMap(baseFlatten(props, 1), toKey);
  return basePick(object, baseDifference(getAllKeysIn(object), props));
});

module.exports = omit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL29taXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCSixJQUFJLE9BQU8sS0FBSyxVQUFTLE1BQVQsRUFBaUIsS0FBakIsRUFBd0I7QUFDdEMsTUFBSSxVQUFVLElBQVYsRUFBZ0I7QUFDbEIsV0FBTyxFQUFQLENBRGtCO0dBQXBCO0FBR0EsVUFBUSxTQUFTLFlBQVksS0FBWixFQUFtQixDQUFuQixDQUFULEVBQWdDLEtBQWhDLENBQVIsQ0FKc0M7QUFLdEMsU0FBTyxTQUFTLE1BQVQsRUFBaUIsZUFBZSxhQUFhLE1BQWIsQ0FBZixFQUFxQyxLQUFyQyxDQUFqQixDQUFQLENBTHNDO0NBQXhCLENBQVo7O0FBUUosT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6Im9taXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VEaWZmZXJlbmNlID0gcmVxdWlyZSgnLi9fYmFzZURpZmZlcmVuY2UnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVBpY2sgPSByZXF1aXJlKCcuL19iYXNlUGljaycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIG9wcG9zaXRlIG9mIGBfLnBpY2tgOyB0aGlzIG1ldGhvZCBjcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGVcbiAqIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2YgYG9iamVjdGAgdGhhdCBhcmVcbiAqIG5vdCBvbWl0dGVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0gey4uLihzdHJpbmd8c3RyaW5nW10pfSBbcHJvcHNdIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBvbWl0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gKlxuICogXy5vbWl0KG9iamVjdCwgWydhJywgJ2MnXSk7XG4gKiAvLyA9PiB7ICdiJzogJzInIH1cbiAqL1xudmFyIG9taXQgPSByZXN0KGZ1bmN0aW9uKG9iamVjdCwgcHJvcHMpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIHByb3BzID0gYXJyYXlNYXAoYmFzZUZsYXR0ZW4ocHJvcHMsIDEpLCB0b0tleSk7XG4gIHJldHVybiBiYXNlUGljayhvYmplY3QsIGJhc2VEaWZmZXJlbmNlKGdldEFsbEtleXNJbihvYmplY3QpLCBwcm9wcykpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gb21pdDtcbiJdfQ==