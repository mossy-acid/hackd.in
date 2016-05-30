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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zsb3dSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLElBQUksWUFBWSxXQUFXLElBQVgsQ0FBaEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImZsb3dSaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVGbG93ID0gcmVxdWlyZSgnLi9fY3JlYXRlRmxvdycpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmxvd2AgZXhjZXB0IHRoYXQgaXQgY3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXRcbiAqIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDMuMC4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Li4uKEZ1bmN0aW9ufEZ1bmN0aW9uW10pfSBbZnVuY3NdIEZ1bmN0aW9ucyB0byBpbnZva2UuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb21wb3NpdGUgZnVuY3Rpb24uXG4gKiBAc2VlIF8uZmxvd1xuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogdmFyIGFkZFNxdWFyZSA9IF8uZmxvd1JpZ2h0KFtzcXVhcmUsIF8uYWRkXSk7XG4gKiBhZGRTcXVhcmUoMSwgMik7XG4gKiAvLyA9PiA5XG4gKi9cbnZhciBmbG93UmlnaHQgPSBjcmVhdGVGbG93KHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZsb3dSaWdodDtcbiJdfQ==