'use strict';

var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGVBQVIsQ0FBbEI7Ozs7Ozs7Ozs7QUFVQSxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsU0FBbEMsRUFBNkM7QUFDM0MsU0FBTyxVQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0I7QUFDcEMsUUFBSSxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCLGFBQU8sVUFBUDtBQUNEO0FBQ0QsUUFBSSxDQUFDLFlBQVksVUFBWixDQUFMLEVBQThCO0FBQzVCLGFBQU8sU0FBUyxVQUFULEVBQXFCLFFBQXJCLENBQVA7QUFDRDtBQUNELFFBQUksU0FBUyxXQUFXLE1BQXhCO1FBQ0ksUUFBUSxZQUFZLE1BQVosR0FBcUIsQ0FBQyxDQURsQztRQUVJLFdBQVcsT0FBTyxVQUFQLENBRmY7O0FBSUEsV0FBUSxZQUFZLE9BQVosR0FBc0IsRUFBRSxLQUFGLEdBQVUsTUFBeEMsRUFBaUQ7QUFDL0MsVUFBSSxTQUFTLFNBQVMsS0FBVCxDQUFULEVBQTBCLEtBQTFCLEVBQWlDLFFBQWpDLE1BQStDLEtBQW5ELEVBQTBEO0FBQ3hEO0FBQ0Q7QUFDRjtBQUNELFdBQU8sVUFBUDtBQUNELEdBakJEO0FBa0JEOztBQUVELE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJfY3JlYXRlQmFzZUVhY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iXX0=