'use strict';

var rest = require('./rest'),
    unzipWith = require('./unzipWith');

/**
 * This method is like `_.zip` except that it accepts `iteratee` to specify
 * how grouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @param {Function} [iteratee=_.identity] The function to combine grouped values.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
 *   return a + b + c;
 * });
 * // => [111, 222]
 */
var zipWith = rest(function (arrays) {
    var length = arrays.length,
        iteratee = length > 1 ? arrays[length - 1] : undefined;

    iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
    return unzipWith(arrays, iteratee);
});

module.exports = zipWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3ppcFdpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVg7SUFDSSxZQUFZLFFBQVEsYUFBUixDQURoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLElBQUksVUFBVSxLQUFLLFVBQVMsTUFBVCxFQUFpQjtBQUNsQyxRQUFJLFNBQVMsT0FBTyxNQUFwQjtRQUNJLFdBQVcsU0FBUyxDQUFULEdBQWEsT0FBTyxTQUFTLENBQWhCLENBQWIsR0FBa0MsU0FEakQ7O0FBR0EsZUFBVyxPQUFPLFFBQVAsSUFBbUIsVUFBbkIsSUFBaUMsT0FBTyxHQUFQLElBQWMsUUFBL0MsSUFBMkQsU0FBdEU7QUFDQSxXQUFPLFVBQVUsTUFBVixFQUFrQixRQUFsQixDQUFQO0FBQ0QsQ0FOYSxDQUFkOztBQVFBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJ6aXBXaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB1bnppcFdpdGggPSByZXF1aXJlKCcuL3VuemlwV2l0aCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uemlwYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBpdGVyYXRlZWAgdG8gc3BlY2lmeVxuICogaG93IGdyb3VwZWQgdmFsdWVzIHNob3VsZCBiZSBjb21iaW5lZC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aGVcbiAqIGVsZW1lbnRzIG9mIGVhY2ggZ3JvdXA6ICguLi5ncm91cCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjguMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXlzXSBUaGUgYXJyYXlzIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIHRvIGNvbWJpbmUgZ3JvdXBlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBncm91cGVkIGVsZW1lbnRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnppcFdpdGgoWzEsIDJdLCBbMTAsIDIwXSwgWzEwMCwgMjAwXSwgZnVuY3Rpb24oYSwgYiwgYykge1xuICogICByZXR1cm4gYSArIGIgKyBjO1xuICogfSk7XG4gKiAvLyA9PiBbMTExLCAyMjJdXG4gKi9cbnZhciB6aXBXaXRoID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5cy5sZW5ndGgsXG4gICAgICBpdGVyYXRlZSA9IGxlbmd0aCA+IDEgPyBhcnJheXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgaXRlcmF0ZWUgPSB0eXBlb2YgaXRlcmF0ZWUgPT0gJ2Z1bmN0aW9uJyA/IChhcnJheXMucG9wKCksIGl0ZXJhdGVlKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIHVuemlwV2l0aChhcnJheXMsIGl0ZXJhdGVlKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHppcFdpdGg7XG4iXX0=