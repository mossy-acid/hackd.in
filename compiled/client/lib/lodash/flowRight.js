'use strict';

var createFlow = require('./_createFlow');

/**
 * This method is like `_.flow` except that it creates a function that
 * invokes the given functions from right to left.
 *
 * @static
 * @since 3.0.0
 * @memberOf _
 * @category Util
 * @param {...(Function|Function[])} [funcs] Functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flow
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flowRight([square, _.add]);
 * addSquare(1, 2);
 * // => 9
 */
var flowRight = createFlow(true);

module.exports = flowRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zsb3dSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkosSUFBSSxZQUFZLFdBQVcsSUFBWCxDQUFaOztBQUVKLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJmbG93UmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlRmxvdyA9IHJlcXVpcmUoJy4vX2NyZWF0ZUZsb3cnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZsb3dgIGV4Y2VwdCB0aGF0IGl0IGNyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0XG4gKiBpbnZva2VzIHRoZSBnaXZlbiBmdW5jdGlvbnMgZnJvbSByaWdodCB0byBsZWZ0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAzLjAuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0gey4uLihGdW5jdGlvbnxGdW5jdGlvbltdKX0gW2Z1bmNzXSBGdW5jdGlvbnMgdG8gaW52b2tlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICogQHNlZSBfLmZsb3dcbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAqICAgcmV0dXJuIG4gKiBuO1xuICogfVxuICpcbiAqIHZhciBhZGRTcXVhcmUgPSBfLmZsb3dSaWdodChbc3F1YXJlLCBfLmFkZF0pO1xuICogYWRkU3F1YXJlKDEsIDIpO1xuICogLy8gPT4gOVxuICovXG52YXIgZmxvd1JpZ2h0ID0gY3JlYXRlRmxvdyh0cnVlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmbG93UmlnaHQ7XG4iXX0=