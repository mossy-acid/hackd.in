'use strict';

var baseDelay = require('./_baseDelay'),
    rest = require('./rest'),
    toNumber = require('./toNumber');

/**
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) {
 *   console.log(text);
 * }, 1000, 'later');
 * // => Logs 'later' after one second.
 */
var delay = rest(function (func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});

module.exports = delay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RlbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCSixJQUFJLFFBQVEsS0FBSyxVQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCO0FBQzFDLFNBQU8sVUFBVSxJQUFWLEVBQWdCLFNBQVMsSUFBVCxLQUFrQixDQUFsQixFQUFxQixJQUFyQyxDQUFQLENBRDBDO0NBQTNCLENBQWI7O0FBSUosT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImRlbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VEZWxheSA9IHJlcXVpcmUoJy4vX2Jhc2VEZWxheScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqXG4gKiBJbnZva2VzIGBmdW5jYCBhZnRlciBgd2FpdGAgbWlsbGlzZWNvbmRzLiBBbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgYXJlXG4gKiBwcm92aWRlZCB0byBgZnVuY2Agd2hlbiBpdCdzIGludm9rZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWxheS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IGludm9jYXRpb24uXG4gKiBAcGFyYW0gey4uLip9IFthcmdzXSBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVyIGlkLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlbGF5KGZ1bmN0aW9uKHRleHQpIHtcbiAqICAgY29uc29sZS5sb2codGV4dCk7XG4gKiB9LCAxMDAwLCAnbGF0ZXInKTtcbiAqIC8vID0+IExvZ3MgJ2xhdGVyJyBhZnRlciBvbmUgc2Vjb25kLlxuICovXG52YXIgZGVsYXkgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgcmV0dXJuIGJhc2VEZWxheShmdW5jLCB0b051bWJlcih3YWl0KSB8fCAwLCBhcmdzKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGF5O1xuIl19