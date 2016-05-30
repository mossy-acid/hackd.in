'use strict';

var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    baseIteratee = require('./_baseIteratee'),
    castArrayLikeObject = require('./_castArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.intersection` except that it accepts `iteratee`
 * which is invoked for each element of each `arrays` to generate the criterion
 * by which they're compared. Result values are chosen from the first array.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 *
 * // The `_.property` iteratee shorthand.
 * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 */
var intersectionBy = rest(function (arrays) {
  var iteratee = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }
  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee)) : [];
});

module.exports = intersectionBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludGVyc2VjdGlvbkJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7SUFDQSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLHNCQUFzQixRQUFRLHdCQUFSLENBQXRCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosSUFBSSxpQkFBaUIsS0FBSyxVQUFTLE1BQVQsRUFBaUI7QUFDekMsTUFBSSxXQUFXLEtBQUssTUFBTCxDQUFYO01BQ0EsU0FBUyxTQUFTLE1BQVQsRUFBaUIsbUJBQWpCLENBQVQsQ0FGcUM7O0FBSXpDLE1BQUksYUFBYSxLQUFLLE1BQUwsQ0FBYixFQUEyQjtBQUM3QixlQUFXLFNBQVgsQ0FENkI7R0FBL0IsTUFFTztBQUNMLFdBQU8sR0FBUCxHQURLO0dBRlA7QUFLQSxTQUFPLE1BQUMsQ0FBTyxNQUFQLElBQWlCLE9BQU8sQ0FBUCxNQUFjLE9BQU8sQ0FBUCxDQUFkLEdBQ3JCLGlCQUFpQixNQUFqQixFQUF5QixhQUFhLFFBQWIsQ0FBekIsQ0FERyxHQUVILEVBRkcsQ0FUa0M7Q0FBakIsQ0FBdEI7O0FBY0osT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6ImludGVyc2VjdGlvbkJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSW50ZXJzZWN0aW9uID0gcmVxdWlyZSgnLi9fYmFzZUludGVyc2VjdGlvbicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGNhc3RBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL19jYXN0QXJyYXlMaWtlT2JqZWN0JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmludGVyc2VjdGlvbmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgXG4gKiB3aGljaCBpcyBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgb2YgZWFjaCBgYXJyYXlzYCB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uXG4gKiBieSB3aGljaCB0aGV5J3JlIGNvbXBhcmVkLiBSZXN1bHQgdmFsdWVzIGFyZSBjaG9zZW4gZnJvbSB0aGUgZmlyc3QgYXJyYXkuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2l0ZXJhdGVlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBpbnRlcnNlY3RpbmcgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmludGVyc2VjdGlvbkJ5KFsyLjEsIDEuMl0sIFsyLjMsIDMuNF0sIE1hdGguZmxvb3IpO1xuICogLy8gPT4gWzIuMV1cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uaW50ZXJzZWN0aW9uQnkoW3sgJ3gnOiAxIH1dLCBbeyAneCc6IDIgfSwgeyAneCc6IDEgfV0sICd4Jyk7XG4gKiAvLyA9PiBbeyAneCc6IDEgfV1cbiAqL1xudmFyIGludGVyc2VjdGlvbkJ5ID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGl0ZXJhdGVlID0gbGFzdChhcnJheXMpLFxuICAgICAgbWFwcGVkID0gYXJyYXlNYXAoYXJyYXlzLCBjYXN0QXJyYXlMaWtlT2JqZWN0KTtcblxuICBpZiAoaXRlcmF0ZWUgPT09IGxhc3QobWFwcGVkKSkge1xuICAgIGl0ZXJhdGVlID0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIG1hcHBlZC5wb3AoKTtcbiAgfVxuICByZXR1cm4gKG1hcHBlZC5sZW5ndGggJiYgbWFwcGVkWzBdID09PSBhcnJheXNbMF0pXG4gICAgPyBiYXNlSW50ZXJzZWN0aW9uKG1hcHBlZCwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKSlcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW50ZXJzZWN0aW9uQnk7XG4iXX0=