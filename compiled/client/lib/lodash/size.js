'use strict';

var getTag = require('./_getTag'),
    isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys'),
    stringSize = require('./_stringSize');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    var result = collection.length;
    return result && isString(collection) ? stringSize(collection) : result;
  }
  if (isObjectLike(collection)) {
    var tag = getTag(collection);
    if (tag == mapTag || tag == setTag) {
      return collection.size;
    }
  }
  return keys(collection).length;
}

module.exports = size;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFNBQVMsUUFBUSxXQUFSLENBQVQ7SUFDQSxjQUFjLFFBQVEsZUFBUixDQUFkO0lBQ0EsZUFBZSxRQUFRLGdCQUFSLENBQWY7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7OztBQUdKLElBQUksU0FBUyxjQUFUO0lBQ0EsU0FBUyxjQUFUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCSixTQUFTLElBQVQsQ0FBYyxVQUFkLEVBQTBCO0FBQ3hCLE1BQUksY0FBYyxJQUFkLEVBQW9CO0FBQ3RCLFdBQU8sQ0FBUCxDQURzQjtHQUF4QjtBQUdBLE1BQUksWUFBWSxVQUFaLENBQUosRUFBNkI7QUFDM0IsUUFBSSxTQUFTLFdBQVcsTUFBWCxDQURjO0FBRTNCLFdBQU8sTUFBQyxJQUFVLFNBQVMsVUFBVCxDQUFWLEdBQWtDLFdBQVcsVUFBWCxDQUFuQyxHQUE0RCxNQUE1RCxDQUZvQjtHQUE3QjtBQUlBLE1BQUksYUFBYSxVQUFiLENBQUosRUFBOEI7QUFDNUIsUUFBSSxNQUFNLE9BQU8sVUFBUCxDQUFOLENBRHdCO0FBRTVCLFFBQUksT0FBTyxNQUFQLElBQWlCLE9BQU8sTUFBUCxFQUFlO0FBQ2xDLGFBQU8sV0FBVyxJQUFYLENBRDJCO0tBQXBDO0dBRkY7QUFNQSxTQUFPLEtBQUssVUFBTCxFQUFpQixNQUFqQixDQWRpQjtDQUExQjs7QUFpQkEsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6InNpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyksXG4gICAgc3RyaW5nU2l6ZSA9IHJlcXVpcmUoJy4vX3N0cmluZ1NpemUnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIEdldHMgdGhlIHNpemUgb2YgYGNvbGxlY3Rpb25gIGJ5IHJldHVybmluZyBpdHMgbGVuZ3RoIGZvciBhcnJheS1saWtlXG4gKiB2YWx1ZXMgb3IgdGhlIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBmb3Igb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbGxlY3Rpb24gc2l6ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zaXplKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5zaXplKHsgJ2EnOiAxLCAnYic6IDIgfSk7XG4gKiAvLyA9PiAyXG4gKlxuICogXy5zaXplKCdwZWJibGVzJyk7XG4gKiAvLyA9PiA3XG4gKi9cbmZ1bmN0aW9uIHNpemUoY29sbGVjdGlvbikge1xuICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgdmFyIHJlc3VsdCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIHJldHVybiAocmVzdWx0ICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pKSA/IHN0cmluZ1NpemUoY29sbGVjdGlvbikgOiByZXN1bHQ7XG4gIH1cbiAgaWYgKGlzT2JqZWN0TGlrZShjb2xsZWN0aW9uKSkge1xuICAgIHZhciB0YWcgPSBnZXRUYWcoY29sbGVjdGlvbik7XG4gICAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uc2l6ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGtleXMoY29sbGVjdGlvbikubGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpemU7XG4iXX0=