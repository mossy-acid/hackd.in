'use strict';

var arrayEvery = require('./_arrayEvery'),
    createOver = require('./_createOver');

/**
 * Creates a function that checks if **all** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [predicates=[_.identity]] The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overEvery([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => false
 *
 * func(NaN);
 * // => false
 */
var overEvery = createOver(arrayEvery);

module.exports = overEvery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXJFdmVyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJKLElBQUksWUFBWSxXQUFXLFVBQVgsQ0FBWjs7QUFFSixPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoib3ZlckV2ZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5RXZlcnkgPSByZXF1aXJlKCcuL19hcnJheUV2ZXJ5JyksXG4gICAgY3JlYXRlT3ZlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZU92ZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgKiphbGwqKiBvZiB0aGUgYHByZWRpY2F0ZXNgIHJldHVyblxuICogdHJ1dGh5IHdoZW4gaW52b2tlZCB3aXRoIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Li4uKEFycmF5fEFycmF5W118RnVuY3Rpb258RnVuY3Rpb25bXXxPYmplY3R8T2JqZWN0W118c3RyaW5nfHN0cmluZ1tdKX1cbiAqICBbcHJlZGljYXRlcz1bXy5pZGVudGl0eV1dIFRoZSBwcmVkaWNhdGVzIHRvIGNoZWNrLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBmdW5jID0gXy5vdmVyRXZlcnkoW0Jvb2xlYW4sIGlzRmluaXRlXSk7XG4gKlxuICogZnVuYygnMScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGZ1bmMobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIGZ1bmMoTmFOKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBvdmVyRXZlcnkgPSBjcmVhdGVPdmVyKGFycmF5RXZlcnkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJFdmVyeTtcbiJdfQ==