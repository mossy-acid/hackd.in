'use strict';

var baseSlice = require('./_baseSlice'),
    isIterateeCall = require('./_isIterateeCall'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array ? array.length : 0;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, index += size);
  }
  return result;
}

module.exports = chunk;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NodW5rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7QUFHSixJQUFJLGFBQWEsS0FBSyxJQUFMO0lBQ2IsWUFBWSxLQUFLLEdBQUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJoQixTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCLEVBQW1DO0FBQ2pDLE1BQUssUUFBUSxlQUFlLEtBQWYsRUFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsQ0FBUixHQUE2QyxTQUFTLFNBQVQsRUFBcUI7QUFDckUsV0FBTyxDQUFQLENBRHFFO0dBQXZFLE1BRU87QUFDTCxXQUFPLFVBQVUsVUFBVSxJQUFWLENBQVYsRUFBMkIsQ0FBM0IsQ0FBUCxDQURLO0dBRlA7QUFLQSxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QixDQU5vQjtBQU9qQyxNQUFJLENBQUMsTUFBRCxJQUFXLE9BQU8sQ0FBUCxFQUFVO0FBQ3ZCLFdBQU8sRUFBUCxDQUR1QjtHQUF6QjtBQUdBLE1BQUksUUFBUSxDQUFSO01BQ0EsV0FBVyxDQUFYO01BQ0EsU0FBUyxNQUFNLFdBQVcsU0FBUyxJQUFULENBQWpCLENBQVQsQ0FaNkI7O0FBY2pDLFNBQU8sUUFBUSxNQUFSLEVBQWdCO0FBQ3JCLFdBQU8sVUFBUCxJQUFxQixVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBeUIsU0FBUyxJQUFULENBQTlDLENBRHFCO0dBQXZCO0FBR0EsU0FBTyxNQUFQLENBakJpQztDQUFuQzs7QUFvQkEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTbGljZSA9IHJlcXVpcmUoJy4vX2Jhc2VTbGljZScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ2VpbCA9IE1hdGguY2VpbCxcbiAgICBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzIHNwbGl0IGludG8gZ3JvdXBzIHRoZSBsZW5ndGggb2YgYHNpemVgLlxuICogSWYgYGFycmF5YCBjYW4ndCBiZSBzcGxpdCBldmVubHksIHRoZSBmaW5hbCBjaHVuayB3aWxsIGJlIHRoZSByZW1haW5pbmdcbiAqIGVsZW1lbnRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge251bWJlcn0gW3NpemU9MV0gVGhlIGxlbmd0aCBvZiBlYWNoIGNodW5rXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgY2h1bmtzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmNodW5rKFsnYScsICdiJywgJ2MnLCAnZCddLCAyKTtcbiAqIC8vID0+IFtbJ2EnLCAnYiddLCBbJ2MnLCAnZCddXVxuICpcbiAqIF8uY2h1bmsoWydhJywgJ2InLCAnYycsICdkJ10sIDMpO1xuICogLy8gPT4gW1snYScsICdiJywgJ2MnXSwgWydkJ11dXG4gKi9cbmZ1bmN0aW9uIGNodW5rKGFycmF5LCBzaXplLCBndWFyZCkge1xuICBpZiAoKGd1YXJkID8gaXNJdGVyYXRlZUNhbGwoYXJyYXksIHNpemUsIGd1YXJkKSA6IHNpemUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICBzaXplID0gMTtcbiAgfSBlbHNlIHtcbiAgICBzaXplID0gbmF0aXZlTWF4KHRvSW50ZWdlcihzaXplKSwgMCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGggfHwgc2l6ZSA8IDEpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG5hdGl2ZUNlaWwobGVuZ3RoIC8gc2l6ZSkpO1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IGJhc2VTbGljZShhcnJheSwgaW5kZXgsIChpbmRleCArPSBzaXplKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaHVuaztcbiJdfQ==