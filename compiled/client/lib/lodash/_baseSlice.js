"use strict";

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU2xpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsS0FBMUIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsTUFBSSxRQUFRLENBQUMsQ0FBRDtNQUNSLFNBQVMsTUFBTSxNQUFOLENBRnVCOztBQUlwQyxNQUFJLFFBQVEsQ0FBUixFQUFXO0FBQ2IsWUFBUSxDQUFDLEtBQUQsR0FBUyxNQUFULEdBQWtCLENBQWxCLEdBQXVCLFNBQVMsS0FBVCxDQURsQjtHQUFmO0FBR0EsUUFBTSxNQUFNLE1BQU4sR0FBZSxNQUFmLEdBQXdCLEdBQXhCLENBUDhCO0FBUXBDLE1BQUksTUFBTSxDQUFOLEVBQVM7QUFDWCxXQUFPLE1BQVAsQ0FEVztHQUFiO0FBR0EsV0FBUyxRQUFRLEdBQVIsR0FBYyxDQUFkLEdBQW1CLEdBQUMsR0FBTSxLQUFOLEtBQWlCLENBQWxCLENBWFE7QUFZcEMsYUFBVyxDQUFYLENBWm9DOztBQWNwQyxNQUFJLFNBQVMsTUFBTSxNQUFOLENBQVQsQ0FkZ0M7QUFlcEMsU0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFdBQU8sS0FBUCxJQUFnQixNQUFNLFFBQVEsS0FBUixDQUF0QixDQUR1QjtHQUF6QjtBQUdBLFNBQU8sTUFBUCxDQWxCb0M7Q0FBdEM7O0FBcUJBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfYmFzZVNsaWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IGVuZCA+IGxlbmd0aCA/IGxlbmd0aCA6IGVuZDtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiJdfQ==