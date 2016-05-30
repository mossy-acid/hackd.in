'use strict';

var baseSortedUniq = require('./_baseSortedUniq');

/**
 * This method is like `_.uniq` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniq([1, 1, 2]);
 * // => [1, 2]
 */
function sortedUniq(array) {
  return array && array.length ? baseSortedUniq(array) : [];
}

module.exports = sortedUniq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZFVuaXEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGlCQUFpQixRQUFRLG1CQUFSLENBQXJCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsU0FBUSxTQUFTLE1BQU0sTUFBaEIsR0FDSCxlQUFlLEtBQWYsQ0FERyxHQUVILEVBRko7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoic29ydGVkVW5pcS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU29ydGVkVW5pcSA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRVbmlxJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy51bmlxYCBleGNlcHQgdGhhdCBpdCdzIGRlc2lnbmVkIGFuZCBvcHRpbWl6ZWRcbiAqIGZvciBzb3J0ZWQgYXJyYXlzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zb3J0ZWRVbmlxKFsxLCAxLCAyXSk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gc29ydGVkVW5pcShhcnJheSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VTb3J0ZWRVbmlxKGFycmF5KVxuICAgIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkVW5pcTtcbiJdfQ==