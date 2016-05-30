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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zyb21QYWlycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQWVBLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxRQUFRLE1BQU0sTUFBTixHQUFlLENBQXZCO01BQ1QsU0FBUyxFQUFULENBSG9COztBQUt4QixTQUFPLEVBQUUsS0FBRixHQUFVLE1BQVYsRUFBa0I7QUFDdkIsUUFBSSxPQUFPLE1BQU0sS0FBTixDQUFQLENBRG1CO0FBRXZCLFdBQU8sS0FBSyxDQUFMLENBQVAsSUFBa0IsS0FBSyxDQUFMLENBQWxCLENBRnVCO0dBQXpCO0FBSUEsU0FBTyxNQUFQLENBVHdCO0NBQTFCOztBQVlBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJmcm9tUGFpcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBpbnZlcnNlIG9mIGBfLnRvUGFpcnNgOyB0aGlzIG1ldGhvZCByZXR1cm5zIGFuIG9iamVjdCBjb21wb3NlZFxuICogZnJvbSBrZXktdmFsdWUgYHBhaXJzYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXJzIFRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZyb21QYWlycyhbWydmcmVkJywgMzBdLCBbJ2Jhcm5leScsIDQwXV0pO1xuICogLy8gPT4geyAnZnJlZCc6IDMwLCAnYmFybmV5JzogNDAgfVxuICovXG5mdW5jdGlvbiBmcm9tUGFpcnMocGFpcnMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYWlycyA/IHBhaXJzLmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSB7fTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBwYWlyID0gcGFpcnNbaW5kZXhdO1xuICAgIHJlc3VsdFtwYWlyWzBdXSA9IHBhaXJbMV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmcm9tUGFpcnM7XG4iXX0=