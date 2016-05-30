'use strict';

var arrayFilter = require('./_arrayFilter'),
    arrayMap = require('./_arrayMap'),
    baseProperty = require('./_baseProperty'),
    baseTimes = require('./_baseTimes'),
    isArrayLikeObject = require('./isArrayLikeObject');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 *
 * _.unzip(zipped);
 * // => [['fred', 'barney'], [30, 40], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function (group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function (index) {
    return arrayMap(array, baseProperty(index));
  });
}

module.exports = unzip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuemlwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxXQUFXLFFBQVEsYUFBUixDQURmO0lBRUksZUFBZSxRQUFRLGlCQUFSLENBRm5CO0lBR0ksWUFBWSxRQUFRLGNBQVIsQ0FIaEI7SUFJSSxvQkFBb0IsUUFBUSxxQkFBUixDQUp4Qjs7O0FBT0EsSUFBSSxZQUFZLEtBQUssR0FBckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0FBQ3BCLE1BQUksRUFBRSxTQUFTLE1BQU0sTUFBakIsQ0FBSixFQUE4QjtBQUM1QixXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksU0FBUyxDQUFiO0FBQ0EsVUFBUSxZQUFZLEtBQVosRUFBbUIsVUFBUyxLQUFULEVBQWdCO0FBQ3pDLFFBQUksa0JBQWtCLEtBQWxCLENBQUosRUFBOEI7QUFDNUIsZUFBUyxVQUFVLE1BQU0sTUFBaEIsRUFBd0IsTUFBeEIsQ0FBVDtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FMTyxDQUFSO0FBTUEsU0FBTyxVQUFVLE1BQVYsRUFBa0IsVUFBUyxLQUFULEVBQWdCO0FBQ3ZDLFdBQU8sU0FBUyxLQUFULEVBQWdCLGFBQWEsS0FBYixDQUFoQixDQUFQO0FBQ0QsR0FGTSxDQUFQO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6InVuemlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5JyksXG4gICAgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnppcGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiBncm91cGVkXG4gKiBlbGVtZW50cyBhbmQgY3JlYXRlcyBhbiBhcnJheSByZWdyb3VwaW5nIHRoZSBlbGVtZW50cyB0byB0aGVpciBwcmUtemlwXG4gKiBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4yLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IG9mIGdyb3VwZWQgZWxlbWVudHMgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIHJlZ3JvdXBlZCBlbGVtZW50cy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHppcHBlZCA9IF8uemlwKFsnZnJlZCcsICdiYXJuZXknXSwgWzMwLCA0MF0sIFt0cnVlLCBmYWxzZV0pO1xuICogLy8gPT4gW1snZnJlZCcsIDMwLCB0cnVlXSwgWydiYXJuZXknLCA0MCwgZmFsc2VdXVxuICpcbiAqIF8udW56aXAoemlwcGVkKTtcbiAqIC8vID0+IFtbJ2ZyZWQnLCAnYmFybmV5J10sIFszMCwgNDBdLCBbdHJ1ZSwgZmFsc2VdXVxuICovXG5mdW5jdGlvbiB1bnppcChhcnJheSkge1xuICBpZiAoIShhcnJheSAmJiBhcnJheS5sZW5ndGgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciBsZW5ndGggPSAwO1xuICBhcnJheSA9IGFycmF5RmlsdGVyKGFycmF5LCBmdW5jdGlvbihncm91cCkge1xuICAgIGlmIChpc0FycmF5TGlrZU9iamVjdChncm91cCkpIHtcbiAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChncm91cC5sZW5ndGgsIGxlbmd0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYmFzZVRpbWVzKGxlbmd0aCwgZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gYXJyYXlNYXAoYXJyYXksIGJhc2VQcm9wZXJ0eShpbmRleCkpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bnppcDtcbiJdfQ==