'use strict';

var baseSetData = require('./_baseSetData'),
    now = require('./now');

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 150,
    HOT_SPAN = 16;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = function () {
  var count = 0,
      lastCalled = 0;

  return function (key, value) {
    var stamp = now(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return key;
      }
    } else {
      count = 0;
    }
    return baseSetData(key, value);
  };
}();

module.exports = setData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zZXREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLE1BQU0sUUFBUSxPQUFSLENBQU47OztBQUdKLElBQUksWUFBWSxHQUFaO0lBQ0EsV0FBVyxFQUFYOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JKLElBQUksVUFBVyxZQUFXO0FBQ3hCLE1BQUksUUFBUSxDQUFSO01BQ0EsYUFBYSxDQUFiLENBRm9COztBQUl4QixTQUFPLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDMUIsUUFBSSxRQUFRLEtBQVI7UUFDQSxZQUFZLFlBQVksUUFBUSxVQUFSLENBQVosQ0FGVTs7QUFJMUIsaUJBQWEsS0FBYixDQUowQjtBQUsxQixRQUFJLFlBQVksQ0FBWixFQUFlO0FBQ2pCLFVBQUksRUFBRSxLQUFGLElBQVcsU0FBWCxFQUFzQjtBQUN4QixlQUFPLEdBQVAsQ0FEd0I7T0FBMUI7S0FERixNQUlPO0FBQ0wsY0FBUSxDQUFSLENBREs7S0FKUDtBQU9BLFdBQU8sWUFBWSxHQUFaLEVBQWlCLEtBQWpCLENBQVAsQ0FaMEI7R0FBckIsQ0FKaUI7Q0FBWCxFQUFYOztBQW9CSixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiX3NldERhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNldERhdGEgPSByZXF1aXJlKCcuL19iYXNlU2V0RGF0YScpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4vbm93Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSAxNTAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyoqXG4gKiBTZXRzIG1ldGFkYXRhIGZvciBgZnVuY2AuXG4gKlxuICogKipOb3RlOioqIElmIHRoaXMgZnVuY3Rpb24gYmVjb21lcyBob3QsIGkuZS4gaXMgaW52b2tlZCBhIGxvdCBpbiBhIHNob3J0XG4gKiBwZXJpb2Qgb2YgdGltZSwgaXQgd2lsbCB0cmlwIGl0cyBicmVha2VyIGFuZCB0cmFuc2l0aW9uIHRvIGFuIGlkZW50aXR5XG4gKiBmdW5jdGlvbiB0byBhdm9pZCBnYXJiYWdlIGNvbGxlY3Rpb24gcGF1c2VzIGluIFY4LiBTZWVcbiAqIFtWOCBpc3N1ZSAyMDcwXShodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMDcwKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXNzb2NpYXRlIG1ldGFkYXRhIHdpdGguXG4gKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1ldGFkYXRhLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhciBzdGFtcCA9IG5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZVNldERhdGEoa2V5LCB2YWx1ZSk7XG4gIH07XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldERhdGE7XG4iXX0=