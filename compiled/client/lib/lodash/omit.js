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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL29taXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxpQkFBaUIsUUFBUSxtQkFBUixDQURyQjtJQUVJLGNBQWMsUUFBUSxnQkFBUixDQUZsQjtJQUdJLFdBQVcsUUFBUSxhQUFSLENBSGY7SUFJSSxlQUFlLFFBQVEsaUJBQVIsQ0FKbkI7SUFLSSxPQUFPLFFBQVEsUUFBUixDQUxYO0lBTUksUUFBUSxRQUFRLFVBQVIsQ0FOWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLElBQUksT0FBTyxLQUFLLFVBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QjtBQUN0QyxNQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixXQUFPLEVBQVA7QUFDRDtBQUNELFVBQVEsU0FBUyxZQUFZLEtBQVosRUFBbUIsQ0FBbkIsQ0FBVCxFQUFnQyxLQUFoQyxDQUFSO0FBQ0EsU0FBTyxTQUFTLE1BQVQsRUFBaUIsZUFBZSxhQUFhLE1BQWIsQ0FBZixFQUFxQyxLQUFyQyxDQUFqQixDQUFQO0FBQ0QsQ0FOVSxDQUFYOztBQVFBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJvbWl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlRGlmZmVyZW5jZSA9IHJlcXVpcmUoJy4vX2Jhc2VEaWZmZXJlbmNlJyksXG4gICAgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIGJhc2VQaWNrID0gcmVxdWlyZSgnLi9fYmFzZVBpY2snKSxcbiAgICBnZXRBbGxLZXlzSW4gPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzSW4nKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5waWNrYDsgdGhpcyBtZXRob2QgY3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlXG4gKiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIGBvYmplY3RgIHRoYXQgYXJlXG4gKiBub3Qgb21pdHRlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHsuLi4oc3RyaW5nfHN0cmluZ1tdKX0gW3Byb3BzXSBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gb21pdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICpcbiAqIF8ub21pdChvYmplY3QsIFsnYScsICdjJ10pO1xuICogLy8gPT4geyAnYic6ICcyJyB9XG4gKi9cbnZhciBvbWl0ID0gcmVzdChmdW5jdGlvbihvYmplY3QsIHByb3BzKSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBwcm9wcyA9IGFycmF5TWFwKGJhc2VGbGF0dGVuKHByb3BzLCAxKSwgdG9LZXkpO1xuICByZXR1cm4gYmFzZVBpY2sob2JqZWN0LCBiYXNlRGlmZmVyZW5jZShnZXRBbGxLZXlzSW4ob2JqZWN0KSwgcHJvcHMpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9taXQ7XG4iXX0=