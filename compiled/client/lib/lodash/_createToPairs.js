'use strict';

var baseToPairs = require('./_baseToPairs'),
    getTag = require('./_getTag'),
    mapToArray = require('./_mapToArray'),
    setToPairs = require('./_setToPairs');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Creates a `_.toPairs` or `_.toPairsIn` function.
 *
 * @private
 * @param {Function} keysFunc The function to get the keys of a given object.
 * @returns {Function} Returns the new pairs function.
 */
function createToPairs(keysFunc) {
  return function (object) {
    var tag = getTag(object);
    if (tag == mapTag) {
      return mapToArray(object);
    }
    if (tag == setTag) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

module.exports = createToPairs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVUb1BhaXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxTQUFTLFFBQVEsV0FBUixDQURiO0lBRUksYUFBYSxRQUFRLGVBQVIsQ0FGakI7SUFHSSxhQUFhLFFBQVEsZUFBUixDQUhqQjs7O0FBTUEsSUFBSSxTQUFTLGNBQWI7SUFDSSxTQUFTLGNBRGI7Ozs7Ozs7OztBQVVBLFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQztBQUMvQixTQUFPLFVBQVMsTUFBVCxFQUFpQjtBQUN0QixRQUFJLE1BQU0sT0FBTyxNQUFQLENBQVY7QUFDQSxRQUFJLE9BQU8sTUFBWCxFQUFtQjtBQUNqQixhQUFPLFdBQVcsTUFBWCxDQUFQO0FBQ0Q7QUFDRCxRQUFJLE9BQU8sTUFBWCxFQUFtQjtBQUNqQixhQUFPLFdBQVcsTUFBWCxDQUFQO0FBQ0Q7QUFDRCxXQUFPLFlBQVksTUFBWixFQUFvQixTQUFTLE1BQVQsQ0FBcEIsQ0FBUDtBQUNELEdBVEQ7QUFVRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiX2NyZWF0ZVRvUGFpcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVRvUGFpcnMgPSByZXF1aXJlKCcuL19iYXNlVG9QYWlycycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIG1hcFRvQXJyYXkgPSByZXF1aXJlKCcuL19tYXBUb0FycmF5JyksXG4gICAgc2V0VG9QYWlycyA9IHJlcXVpcmUoJy4vX3NldFRvUGFpcnMnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy50b1BhaXJzYCBvciBgXy50b1BhaXJzSW5gIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFpcnMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRvUGFpcnMoa2V5c0Z1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciB0YWcgPSBnZXRUYWcob2JqZWN0KTtcbiAgICBpZiAodGFnID09IG1hcFRhZykge1xuICAgICAgcmV0dXJuIG1hcFRvQXJyYXkob2JqZWN0KTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBzZXRUYWcpIHtcbiAgICAgIHJldHVybiBzZXRUb1BhaXJzKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBiYXNlVG9QYWlycyhvYmplY3QsIGtleXNGdW5jKG9iamVjdCkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVRvUGFpcnM7XG4iXX0=