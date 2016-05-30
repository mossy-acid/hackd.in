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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2F0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsV0FBUixDQUFiO0lBQ0ksY0FBYyxRQUFRLGdCQUFSLENBRGxCO0lBRUksT0FBTyxRQUFRLFFBQVIsQ0FGWDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxJQUFJLEtBQUssS0FBSyxVQUFTLE1BQVQsRUFBaUIsS0FBakIsRUFBd0I7QUFDcEMsU0FBTyxPQUFPLE1BQVAsRUFBZSxZQUFZLEtBQVosRUFBbUIsQ0FBbkIsQ0FBZixDQUFQO0FBQ0QsQ0FGUSxDQUFUOztBQUlBLE9BQU8sT0FBUCxHQUFpQixFQUFqQiIsImZpbGUiOiJhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQXQgPSByZXF1aXJlKCcuL19iYXNlQXQnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gYHBhdGhzYCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHsuLi4oc3RyaW5nfHN0cmluZ1tdKX0gW3BhdGhzXSBUaGUgcHJvcGVydHkgcGF0aHMgb2YgZWxlbWVudHMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcGlja2VkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfSwgNF0gfTtcbiAqXG4gKiBfLmF0KG9iamVjdCwgWydhWzBdLmIuYycsICdhWzFdJ10pO1xuICogLy8gPT4gWzMsIDRdXG4gKi9cbnZhciBhdCA9IHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBwYXRocykge1xuICByZXR1cm4gYmFzZUF0KG9iamVjdCwgYmFzZUZsYXR0ZW4ocGF0aHMsIDEpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF0O1xuIl19