'use strict';

var apply = require('./_apply'),
    arrayMap = require('./_arrayMap'),
    unzip = require('./unzip');

/**
 * This method is like `_.unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * _.unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 */
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  var result = unzip(array);
  if (iteratee == null) {
    return result;
  }
  return arrayMap(result, function (group) {
    return apply(iteratee, undefined, group);
  });
}

module.exports = unzipWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuemlwV2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxRQUFRLFFBQVEsU0FBUixDQUFSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCSixTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsUUFBMUIsRUFBb0M7QUFDbEMsTUFBSSxFQUFFLFNBQVMsTUFBTSxNQUFOLENBQVgsRUFBMEI7QUFDNUIsV0FBTyxFQUFQLENBRDRCO0dBQTlCO0FBR0EsTUFBSSxTQUFTLE1BQU0sS0FBTixDQUFULENBSjhCO0FBS2xDLE1BQUksWUFBWSxJQUFaLEVBQWtCO0FBQ3BCLFdBQU8sTUFBUCxDQURvQjtHQUF0QjtBQUdBLFNBQU8sU0FBUyxNQUFULEVBQWlCLFVBQVMsS0FBVCxFQUFnQjtBQUN0QyxXQUFPLE1BQU0sUUFBTixFQUFnQixTQUFoQixFQUEyQixLQUEzQixDQUFQLENBRHNDO0dBQWhCLENBQXhCLENBUmtDO0NBQXBDOztBQWFBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJ1bnppcFdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICB1bnppcCA9IHJlcXVpcmUoJy4vdW56aXAnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnVuemlwYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBpdGVyYXRlZWAgdG8gc3BlY2lmeVxuICogaG93IHJlZ3JvdXBlZCB2YWx1ZXMgc2hvdWxkIGJlIGNvbWJpbmVkLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRoZVxuICogZWxlbWVudHMgb2YgZWFjaCBncm91cDogKC4uLmdyb3VwKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuOC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSBvZiBncm91cGVkIGVsZW1lbnRzIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIHRvIGNvbWJpbmVcbiAqICByZWdyb3VwZWQgdmFsdWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgcmVncm91cGVkIGVsZW1lbnRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgemlwcGVkID0gXy56aXAoWzEsIDJdLCBbMTAsIDIwXSwgWzEwMCwgMjAwXSk7XG4gKiAvLyA9PiBbWzEsIDEwLCAxMDBdLCBbMiwgMjAsIDIwMF1dXG4gKlxuICogXy51bnppcFdpdGgoemlwcGVkLCBfLmFkZCk7XG4gKiAvLyA9PiBbMywgMzAsIDMwMF1cbiAqL1xuZnVuY3Rpb24gdW56aXBXaXRoKGFycmF5LCBpdGVyYXRlZSkge1xuICBpZiAoIShhcnJheSAmJiBhcnJheS5sZW5ndGgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciByZXN1bHQgPSB1bnppcChhcnJheSk7XG4gIGlmIChpdGVyYXRlZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZXR1cm4gYXJyYXlNYXAocmVzdWx0LCBmdW5jdGlvbihncm91cCkge1xuICAgIHJldHVybiBhcHBseShpdGVyYXRlZSwgdW5kZWZpbmVkLCBncm91cCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuemlwV2l0aDtcbiJdfQ==