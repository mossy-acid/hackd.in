'use strict';

var baseClamp = require('./_baseClamp'),
    baseRandom = require('./_baseRandom'),
    isIterateeCall = require('./_isIterateeCall'),
    toArray = require('./toArray'),
    toInteger = require('./toInteger');

/**
 * Gets `n` random elements at unique keys from `collection` up to the
 * size of `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @param {number} [n=1] The number of elements to sample.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the random elements.
 * @example
 *
 * _.sampleSize([1, 2, 3], 2);
 * // => [3, 1]
 *
 * _.sampleSize([1, 2, 3], 4);
 * // => [2, 3, 1]
 */
function sampleSize(collection, n, guard) {
  var index = -1,
      result = toArray(collection),
      length = result.length,
      lastIndex = length - 1;

  if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = baseClamp(toInteger(n), 0, length);
  }
  while (++index < n) {
    var rand = baseRandom(index, lastIndex),
        value = result[rand];

    result[rand] = result[index];
    result[index] = value;
  }
  result.length = n;
  return result;
}

module.exports = sampleSize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NhbXBsZVNpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksYUFBYSxRQUFRLGVBQVIsQ0FEakI7SUFFSSxpQkFBaUIsUUFBUSxtQkFBUixDQUZyQjtJQUdJLFVBQVUsUUFBUSxXQUFSLENBSGQ7SUFJSSxZQUFZLFFBQVEsYUFBUixDQUpoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxTQUFTLFVBQVQsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBaEMsRUFBbUMsS0FBbkMsRUFBMEM7QUFDeEMsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFNBQVMsUUFBUSxVQUFSLENBRGI7TUFFSSxTQUFTLE9BQU8sTUFGcEI7TUFHSSxZQUFZLFNBQVMsQ0FIekI7O0FBS0EsTUFBSyxRQUFRLGVBQWUsVUFBZixFQUEyQixDQUEzQixFQUE4QixLQUE5QixDQUFSLEdBQStDLE1BQU0sU0FBMUQsRUFBc0U7QUFDcEUsUUFBSSxDQUFKO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsUUFBSSxVQUFVLFVBQVUsQ0FBVixDQUFWLEVBQXdCLENBQXhCLEVBQTJCLE1BQTNCLENBQUo7QUFDRDtBQUNELFNBQU8sRUFBRSxLQUFGLEdBQVUsQ0FBakIsRUFBb0I7QUFDbEIsUUFBSSxPQUFPLFdBQVcsS0FBWCxFQUFrQixTQUFsQixDQUFYO1FBQ0ksUUFBUSxPQUFPLElBQVAsQ0FEWjs7QUFHQSxXQUFPLElBQVAsSUFBZSxPQUFPLEtBQVAsQ0FBZjtBQUNBLFdBQU8sS0FBUCxJQUFnQixLQUFoQjtBQUNEO0FBQ0QsU0FBTyxNQUFQLEdBQWdCLENBQWhCO0FBQ0EsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6InNhbXBsZVNpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsYW1wID0gcmVxdWlyZSgnLi9fYmFzZUNsYW1wJyksXG4gICAgYmFzZVJhbmRvbSA9IHJlcXVpcmUoJy4vX2Jhc2VSYW5kb20nKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9BcnJheSA9IHJlcXVpcmUoJy4vdG9BcnJheScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKlxuICogR2V0cyBgbmAgcmFuZG9tIGVsZW1lbnRzIGF0IHVuaXF1ZSBrZXlzIGZyb20gYGNvbGxlY3Rpb25gIHVwIHRvIHRoZVxuICogc2l6ZSBvZiBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNhbXBsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNhbXBsZS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHJhbmRvbSBlbGVtZW50cy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zYW1wbGVTaXplKFsxLCAyLCAzXSwgMik7XG4gKiAvLyA9PiBbMywgMV1cbiAqXG4gKiBfLnNhbXBsZVNpemUoWzEsIDIsIDNdLCA0KTtcbiAqIC8vID0+IFsyLCAzLCAxXVxuICovXG5mdW5jdGlvbiBzYW1wbGVTaXplKGNvbGxlY3Rpb24sIG4sIGd1YXJkKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdG9BcnJheShjb2xsZWN0aW9uKSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxO1xuXG4gIGlmICgoZ3VhcmQgPyBpc0l0ZXJhdGVlQ2FsbChjb2xsZWN0aW9uLCBuLCBndWFyZCkgOiBuID09PSB1bmRlZmluZWQpKSB7XG4gICAgbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgbiA9IGJhc2VDbGFtcCh0b0ludGVnZXIobiksIDAsIGxlbmd0aCk7XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgdmFyIHJhbmQgPSBiYXNlUmFuZG9tKGluZGV4LCBsYXN0SW5kZXgpLFxuICAgICAgICB2YWx1ZSA9IHJlc3VsdFtyYW5kXTtcblxuICAgIHJlc3VsdFtyYW5kXSA9IHJlc3VsdFtpbmRleF07XG4gICAgcmVzdWx0W2luZGV4XSA9IHZhbHVlO1xuICB9XG4gIHJlc3VsdC5sZW5ndGggPSBuO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNhbXBsZVNpemU7XG4iXX0=