'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseSortedUniq = require('./_baseSortedUniq');

/**
 * This method is like `_.uniqBy` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
 * // => [1.1, 2.3]
 */
function sortedUniqBy(array, iteratee) {
    return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee)) : [];
}

module.exports = sortedUniqBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZFVuaXFCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5CO0lBQ0ksaUJBQWlCLFFBQVEsbUJBQVIsQ0FEckI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxTQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDckMsV0FBUSxTQUFTLE1BQU0sTUFBaEIsR0FDSCxlQUFlLEtBQWYsRUFBc0IsYUFBYSxRQUFiLENBQXRCLENBREcsR0FFSCxFQUZKO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6InNvcnRlZFVuaXFCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlU29ydGVkVW5pcSA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRVbmlxJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy51bmlxQnlgIGV4Y2VwdCB0aGF0IGl0J3MgZGVzaWduZWQgYW5kIG9wdGltaXplZFxuICogZm9yIHNvcnRlZCBhcnJheXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zb3J0ZWRVbmlxQnkoWzEuMSwgMS4yLCAyLjMsIDIuNF0sIE1hdGguZmxvb3IpO1xuICogLy8gPT4gWzEuMSwgMi4zXVxuICovXG5mdW5jdGlvbiBzb3J0ZWRVbmlxQnkoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVNvcnRlZFVuaXEoYXJyYXksIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0ZWRVbmlxQnk7XG4iXX0=