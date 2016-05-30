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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVUb1BhaXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFNBQVMsUUFBUSxXQUFSLENBQVQ7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsYUFBYSxRQUFRLGVBQVIsQ0FBYjs7O0FBR0osSUFBSSxTQUFTLGNBQVQ7SUFDQSxTQUFTLGNBQVQ7Ozs7Ozs7OztBQVNKLFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQztBQUMvQixTQUFPLFVBQVMsTUFBVCxFQUFpQjtBQUN0QixRQUFJLE1BQU0sT0FBTyxNQUFQLENBQU4sQ0FEa0I7QUFFdEIsUUFBSSxPQUFPLE1BQVAsRUFBZTtBQUNqQixhQUFPLFdBQVcsTUFBWCxDQUFQLENBRGlCO0tBQW5CO0FBR0EsUUFBSSxPQUFPLE1BQVAsRUFBZTtBQUNqQixhQUFPLFdBQVcsTUFBWCxDQUFQLENBRGlCO0tBQW5CO0FBR0EsV0FBTyxZQUFZLE1BQVosRUFBb0IsU0FBUyxNQUFULENBQXBCLENBQVAsQ0FSc0I7R0FBakIsQ0FEd0I7Q0FBakM7O0FBYUEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6Il9jcmVhdGVUb1BhaXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VUb1BhaXJzID0gcmVxdWlyZSgnLi9fYmFzZVRvUGFpcnMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvUGFpcnMgPSByZXF1aXJlKCcuL19zZXRUb1BhaXJzJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8udG9QYWlyc2Agb3IgYF8udG9QYWlyc0luYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBhIGdpdmVuIG9iamVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhaXJzIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVUb1BhaXJzKGtleXNGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKG9iamVjdCk7XG4gICAgaWYgKHRhZyA9PSBtYXBUYWcpIHtcbiAgICAgIHJldHVybiBtYXBUb0FycmF5KG9iamVjdCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gc2V0VGFnKSB7XG4gICAgICByZXR1cm4gc2V0VG9QYWlycyhvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZVRvUGFpcnMob2JqZWN0LCBrZXlzRnVuYyhvYmplY3QpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVUb1BhaXJzO1xuIl19