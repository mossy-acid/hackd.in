'use strict';

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeJoin = arrayProto.join;

/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
function join(array, separator) {
  return array ? nativeJoin.call(array, separator) : '';
}

module.exports = join;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2pvaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsSUFBSSxhQUFhLE1BQU0sU0FBTjs7O0FBR2pCLElBQUksYUFBYSxXQUFXLElBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJqQixTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLFNBQXJCLEVBQWdDO0FBQzlCLFNBQU8sUUFBUSxXQUFXLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsU0FBdkIsQ0FBUixHQUE0QyxFQUE1QyxDQUR1QjtDQUFoQzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoiam9pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSm9pbiA9IGFycmF5UHJvdG8uam9pbjtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbGwgZWxlbWVudHMgaW4gYGFycmF5YCBpbnRvIGEgc3RyaW5nIHNlcGFyYXRlZCBieSBgc2VwYXJhdG9yYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtzdHJpbmd9IFtzZXBhcmF0b3I9JywnXSBUaGUgZWxlbWVudCBzZXBhcmF0b3IuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBqb2luZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmpvaW4oWydhJywgJ2InLCAnYyddLCAnficpO1xuICogLy8gPT4gJ2F+Yn5jJ1xuICovXG5mdW5jdGlvbiBqb2luKGFycmF5LCBzZXBhcmF0b3IpIHtcbiAgcmV0dXJuIGFycmF5ID8gbmF0aXZlSm9pbi5jYWxsKGFycmF5LCBzZXBhcmF0b3IpIDogJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gam9pbjtcbiJdfQ==