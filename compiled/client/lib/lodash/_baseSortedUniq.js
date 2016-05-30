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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU29ydGVkVW5pcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxRQUFRLE1BQVIsQ0FBTDs7Ozs7Ozs7Ozs7QUFXSixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSSxRQUFRLENBQUMsQ0FBRDtNQUNSLFNBQVMsTUFBTSxNQUFOO01BQ1QsV0FBVyxDQUFYO01BQ0EsU0FBUyxFQUFULENBSm1DOztBQU12QyxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQVYsRUFBa0I7QUFDdkIsUUFBSSxRQUFRLE1BQU0sS0FBTixDQUFSO1FBQ0EsV0FBVyxXQUFXLFNBQVMsS0FBVCxDQUFYLEdBQTZCLEtBQTdCLENBRlE7O0FBSXZCLFFBQUksQ0FBQyxLQUFELElBQVUsQ0FBQyxHQUFHLFFBQUgsRUFBYSxJQUFiLENBQUQsRUFBcUI7QUFDakMsVUFBSSxPQUFPLFFBQVAsQ0FENkI7QUFFakMsYUFBTyxVQUFQLElBQXFCLFVBQVUsQ0FBVixHQUFjLENBQWQsR0FBa0IsS0FBbEIsQ0FGWTtLQUFuQztHQUpGO0FBU0EsU0FBTyxNQUFQLENBZnVDO0NBQXpDOztBQWtCQSxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiX2Jhc2VTb3J0ZWRVbmlxLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNvcnRlZFVuaXFgIGFuZCBgXy5zb3J0ZWRVbmlxQnlgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlU29ydGVkVW5pcShhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgaWYgKCFpbmRleCB8fCAhZXEoY29tcHV0ZWQsIHNlZW4pKSB7XG4gICAgICB2YXIgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNvcnRlZFVuaXE7XG4iXX0=