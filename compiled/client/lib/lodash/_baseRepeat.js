'use strict';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor;

/**
 * The base implementation of `_.repeat` which doesn't coerce arguments.
 *
 * @private
 * @param {string} string The string to repeat.
 * @param {number} n The number of times to repeat the string.
 * @returns {string} Returns the repeated string.
 */
function baseRepeat(string, n) {
  var result = '';
  if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
    return result;
  }
  // Leverage the exponentiation by squaring algorithm for a faster repeat.
  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
  do {
    if (n % 2) {
      result += string;
    }
    n = nativeFloor(n / 2);
    if (n) {
      string += string;
    }
  } while (n);

  return result;
}

module.exports = baseRepeat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUmVwZWF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksbUJBQW1CLGdCQUF2Qjs7O0FBR0EsSUFBSSxjQUFjLEtBQUssS0FBdkI7Ozs7Ozs7Ozs7QUFVQSxTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsQ0FBNUIsRUFBK0I7QUFDN0IsTUFBSSxTQUFTLEVBQWI7QUFDQSxNQUFJLENBQUMsTUFBRCxJQUFXLElBQUksQ0FBZixJQUFvQixJQUFJLGdCQUE1QixFQUE4QztBQUM1QyxXQUFPLE1BQVA7QUFDRDs7O0FBR0QsS0FBRztBQUNELFFBQUksSUFBSSxDQUFSLEVBQVc7QUFDVCxnQkFBVSxNQUFWO0FBQ0Q7QUFDRCxRQUFJLFlBQVksSUFBSSxDQUFoQixDQUFKO0FBQ0EsUUFBSSxDQUFKLEVBQU87QUFDTCxnQkFBVSxNQUFWO0FBQ0Q7QUFDRixHQVJELFFBUVMsQ0FSVDs7QUFVQSxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2Jhc2VSZXBlYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUZsb29yID0gTWF0aC5mbG9vcjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXBlYXRgIHdoaWNoIGRvZXNuJ3QgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHJlcGVhdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0IHRoZSBzdHJpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByZXBlYXRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXBlYXQoc3RyaW5nLCBuKSB7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKCFzdHJpbmcgfHwgbiA8IDEgfHwgbiA+IE1BWF9TQUZFX0lOVEVHRVIpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIExldmVyYWdlIHRoZSBleHBvbmVudGlhdGlvbiBieSBzcXVhcmluZyBhbGdvcml0aG0gZm9yIGEgZmFzdGVyIHJlcGVhdC5cbiAgLy8gU2VlIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0V4cG9uZW50aWF0aW9uX2J5X3NxdWFyaW5nIGZvciBtb3JlIGRldGFpbHMuXG4gIGRvIHtcbiAgICBpZiAobiAlIDIpIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIG4gPSBuYXRpdmVGbG9vcihuIC8gMik7XG4gICAgaWYgKG4pIHtcbiAgICAgIHN0cmluZyArPSBzdHJpbmc7XG4gICAgfVxuICB9IHdoaWxlIChuKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXBlYXQ7XG4iXX0=