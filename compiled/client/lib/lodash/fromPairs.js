"use strict";

/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['fred', 30], ['barney', 40]]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function fromPairs(pairs) {
  var index = -1,
      length = pairs ? pairs.length : 0,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}

module.exports = fromPairs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zyb21QYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixNQUFJLFFBQVEsQ0FBQyxDQUFiO01BQ0ksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQURwQztNQUVJLFNBQVMsRUFGYjs7QUFJQSxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksT0FBTyxNQUFNLEtBQU4sQ0FBWDtBQUNBLFdBQU8sS0FBSyxDQUFMLENBQVAsSUFBa0IsS0FBSyxDQUFMLENBQWxCO0FBQ0Q7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiZnJvbVBhaXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy50b1BhaXJzYDsgdGhpcyBtZXRob2QgcmV0dXJucyBhbiBvYmplY3QgY29tcG9zZWRcbiAqIGZyb20ga2V5LXZhbHVlIGBwYWlyc2AuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBwYWlycyBUaGUga2V5LXZhbHVlIHBhaXJzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mcm9tUGFpcnMoW1snZnJlZCcsIDMwXSwgWydiYXJuZXknLCA0MF1dKTtcbiAqIC8vID0+IHsgJ2ZyZWQnOiAzMCwgJ2Jhcm5leSc6IDQwIH1cbiAqL1xuZnVuY3Rpb24gZnJvbVBhaXJzKHBhaXJzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGFpcnMgPyBwYWlycy5sZW5ndGggOiAwLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgcGFpciA9IHBhaXJzW2luZGV4XTtcbiAgICByZXN1bHRbcGFpclswXV0gPSBwYWlyWzFdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbVBhaXJzO1xuIl19