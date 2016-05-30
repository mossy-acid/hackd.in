'use strict';

var eq = require('./eq');

/**
 * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseSortedUniq(array, iteratee) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (!index || !eq(computed, seen)) {
      var seen = computed;
      result[resIndex++] = value === 0 ? 0 : value;
    }
  }
  return result;
}

module.exports = baseSortedUniq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU29ydGVkVW5pcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxRQUFRLE1BQVIsQ0FBVDs7Ozs7Ozs7Ozs7QUFXQSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFNBQVMsTUFBTSxNQURuQjtNQUVJLFdBQVcsQ0FGZjtNQUdJLFNBQVMsRUFIYjs7QUFLQSxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksUUFBUSxNQUFNLEtBQU4sQ0FBWjtRQUNJLFdBQVcsV0FBVyxTQUFTLEtBQVQsQ0FBWCxHQUE2QixLQUQ1Qzs7QUFHQSxRQUFJLENBQUMsS0FBRCxJQUFVLENBQUMsR0FBRyxRQUFILEVBQWEsSUFBYixDQUFmLEVBQW1DO0FBQ2pDLFVBQUksT0FBTyxRQUFYO0FBQ0EsYUFBTyxVQUFQLElBQXFCLFVBQVUsQ0FBVixHQUFjLENBQWQsR0FBa0IsS0FBdkM7QUFDRDtBQUNGO0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6Il9iYXNlU29ydGVkVW5pcS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zb3J0ZWRVbmlxYCBhbmQgYF8uc29ydGVkVW5pcUJ5YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZVNvcnRlZFVuaXEoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIGlmICghaW5kZXggfHwgIWVxKGNvbXB1dGVkLCBzZWVuKSkge1xuICAgICAgdmFyIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTb3J0ZWRVbmlxO1xuIl19