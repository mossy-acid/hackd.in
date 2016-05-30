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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3ppcFdpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkosSUFBSSxVQUFVLEtBQUssVUFBUyxNQUFULEVBQWlCO0FBQ2xDLFFBQUksU0FBUyxPQUFPLE1BQVA7UUFDVCxXQUFXLFNBQVMsQ0FBVCxHQUFhLE9BQU8sU0FBUyxDQUFULENBQXBCLEdBQWtDLFNBQWxDLENBRm1COztBQUlsQyxlQUFXLE9BQU8sUUFBUCxJQUFtQixVQUFuQixJQUFpQyxPQUFPLEdBQVAsSUFBYyxRQUFkLENBQWpDLEdBQTJELFNBQTNELENBSnVCO0FBS2xDLFdBQU8sVUFBVSxNQUFWLEVBQWtCLFFBQWxCLENBQVAsQ0FMa0M7Q0FBakIsQ0FBZjs7QUFRSixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiemlwV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXN0ID0gcmVxdWlyZSgnLi9yZXN0JyksXG4gICAgdW56aXBXaXRoID0gcmVxdWlyZSgnLi91bnppcFdpdGgnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnppcGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHRvIHNwZWNpZnlcbiAqIGhvdyBncm91cGVkIHZhbHVlcyBzaG91bGQgYmUgY29tYmluZWQuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhlXG4gKiBlbGVtZW50cyBvZiBlYWNoIGdyb3VwOiAoLi4uZ3JvdXApLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy44LjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiB0byBjb21iaW5lIGdyb3VwZWQgdmFsdWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgZ3JvdXBlZCBlbGVtZW50cy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy56aXBXaXRoKFsxLCAyXSwgWzEwLCAyMF0sIFsxMDAsIDIwMF0sIGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAqICAgcmV0dXJuIGEgKyBiICsgYztcbiAqIH0pO1xuICogLy8gPT4gWzExMSwgMjIyXVxuICovXG52YXIgemlwV2l0aCA9IHJlc3QoZnVuY3Rpb24oYXJyYXlzKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheXMubGVuZ3RoLFxuICAgICAgaXRlcmF0ZWUgPSBsZW5ndGggPiAxID8gYXJyYXlzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gIGl0ZXJhdGVlID0gdHlwZW9mIGl0ZXJhdGVlID09ICdmdW5jdGlvbicgPyAoYXJyYXlzLnBvcCgpLCBpdGVyYXRlZSkgOiB1bmRlZmluZWQ7XG4gIHJldHVybiB1bnppcFdpdGgoYXJyYXlzLCBpdGVyYXRlZSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB6aXBXaXRoO1xuIl19