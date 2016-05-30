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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGVBQVIsQ0FBZDs7Ozs7Ozs7OztBQVVKLFNBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxTQUFsQyxFQUE2QztBQUMzQyxTQUFPLFVBQVMsVUFBVCxFQUFxQixRQUFyQixFQUErQjtBQUNwQyxRQUFJLGNBQWMsSUFBZCxFQUFvQjtBQUN0QixhQUFPLFVBQVAsQ0FEc0I7S0FBeEI7QUFHQSxRQUFJLENBQUMsWUFBWSxVQUFaLENBQUQsRUFBMEI7QUFDNUIsYUFBTyxTQUFTLFVBQVQsRUFBcUIsUUFBckIsQ0FBUCxDQUQ0QjtLQUE5QjtBQUdBLFFBQUksU0FBUyxXQUFXLE1BQVg7UUFDVCxRQUFRLFlBQVksTUFBWixHQUFxQixDQUFDLENBQUQ7UUFDN0IsV0FBVyxPQUFPLFVBQVAsQ0FBWCxDQVRnQzs7QUFXcEMsV0FBUSxZQUFZLE9BQVosR0FBc0IsRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFtQjtBQUMvQyxVQUFJLFNBQVMsU0FBUyxLQUFULENBQVQsRUFBMEIsS0FBMUIsRUFBaUMsUUFBakMsTUFBK0MsS0FBL0MsRUFBc0Q7QUFDeEQsY0FEd0Q7T0FBMUQ7S0FERjtBQUtBLFdBQU8sVUFBUCxDQWhCb0M7R0FBL0IsQ0FEb0M7Q0FBN0M7O0FBcUJBLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJfY3JlYXRlQmFzZUVhY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iXX0=