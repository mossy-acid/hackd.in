'use strict';

var baseFlatten = require('./_baseFlatten'),
    baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.union` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which uniqueness is computed. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
var unionBy = rest(function (arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee));
});

module.exports = unionBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuaW9uQnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjtJQUVJLFdBQVcsUUFBUSxhQUFSLENBRmY7SUFHSSxvQkFBb0IsUUFBUSxxQkFBUixDQUh4QjtJQUlJLE9BQU8sUUFBUSxRQUFSLENBSlg7SUFLSSxPQUFPLFFBQVEsUUFBUixDQUxYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLElBQUksVUFBVSxLQUFLLFVBQVMsTUFBVCxFQUFpQjtBQUNsQyxNQUFJLFdBQVcsS0FBSyxNQUFMLENBQWY7QUFDQSxNQUFJLGtCQUFrQixRQUFsQixDQUFKLEVBQWlDO0FBQy9CLGVBQVcsU0FBWDtBQUNEO0FBQ0QsU0FBTyxTQUFTLFlBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixpQkFBdkIsRUFBMEMsSUFBMUMsQ0FBVCxFQUEwRCxhQUFhLFFBQWIsQ0FBMUQsQ0FBUDtBQUNELENBTmEsQ0FBZDs7QUFRQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoidW5pb25CeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVVuaXEgPSByZXF1aXJlKCcuL19iYXNlVW5pcScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy51bmlvbmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHdoaWNoIGlzXG4gKiBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgb2YgZWFjaCBgYXJyYXlzYCB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uIGJ5XG4gKiB3aGljaCB1bmlxdWVuZXNzIGlzIGNvbXB1dGVkLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDpcbiAqICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXlzXSBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICogIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgY29tYmluZWQgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnVuaW9uQnkoWzIuMV0sIFsxLjIsIDIuM10sIE1hdGguZmxvb3IpO1xuICogLy8gPT4gWzIuMSwgMS4yXVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy51bmlvbkJ5KFt7ICd4JzogMSB9XSwgW3sgJ3gnOiAyIH0sIHsgJ3gnOiAxIH1dLCAneCcpO1xuICogLy8gPT4gW3sgJ3gnOiAxIH0sIHsgJ3gnOiAyIH1dXG4gKi9cbnZhciB1bmlvbkJ5ID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGl0ZXJhdGVlID0gbGFzdChhcnJheXMpO1xuICBpZiAoaXNBcnJheUxpa2VPYmplY3QoaXRlcmF0ZWUpKSB7XG4gICAgaXRlcmF0ZWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGJhc2VVbmlxKGJhc2VGbGF0dGVuKGFycmF5cywgMSwgaXNBcnJheUxpa2VPYmplY3QsIHRydWUpLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuaW9uQnk7XG4iXX0=