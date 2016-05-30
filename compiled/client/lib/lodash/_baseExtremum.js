'use strict';

var isSymbol = require('./isSymbol');

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

module.exports = baseExtremum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlRXh0cmVtdW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7Ozs7Ozs7Ozs7OztBQVlBLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixRQUE3QixFQUF1QyxVQUF2QyxFQUFtRDtBQUNqRCxNQUFJLFFBQVEsQ0FBQyxDQUFiO01BQ0ksU0FBUyxNQUFNLE1BRG5COztBQUdBLFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBakIsRUFBeUI7QUFDdkIsUUFBSSxRQUFRLE1BQU0sS0FBTixDQUFaO1FBQ0ksVUFBVSxTQUFTLEtBQVQsQ0FEZDs7QUFHQSxRQUFJLFdBQVcsSUFBWCxLQUFvQixhQUFhLFNBQWIsR0FDZixZQUFZLE9BQVosSUFBdUIsQ0FBQyxTQUFTLE9BQVQsQ0FEVCxHQUVoQixXQUFXLE9BQVgsRUFBb0IsUUFBcEIsQ0FGSixDQUFKLEVBR087QUFDTCxVQUFJLFdBQVcsT0FBZjtVQUNJLFNBQVMsS0FEYjtBQUVEO0FBQ0Y7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiX2Jhc2VFeHRyZW11bS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGxpa2UgYF8ubWF4YCBhbmQgYF8ubWluYCB3aGljaCBhY2NlcHRzIGFcbiAqIGBjb21wYXJhdG9yYCB0byBkZXRlcm1pbmUgdGhlIGV4dHJlbXVtIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgdXNlZCB0byBjb21wYXJlIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBleHRyZW11bSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUV4dHJlbXVtKGFycmF5LCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY3VycmVudCA9IGl0ZXJhdGVlKHZhbHVlKTtcblxuICAgIGlmIChjdXJyZW50ICE9IG51bGwgJiYgKGNvbXB1dGVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChjdXJyZW50ID09PSBjdXJyZW50ICYmICFpc1N5bWJvbChjdXJyZW50KSlcbiAgICAgICAgICA6IGNvbXBhcmF0b3IoY3VycmVudCwgY29tcHV0ZWQpXG4gICAgICAgICkpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGN1cnJlbnQsXG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUV4dHJlbXVtO1xuIl19