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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zZXREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxNQUFNLFFBQVEsT0FBUixDQURWOzs7QUFJQSxJQUFJLFlBQVksR0FBaEI7SUFDSSxXQUFXLEVBRGY7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBSSxVQUFXLFlBQVc7QUFDeEIsTUFBSSxRQUFRLENBQVo7TUFDSSxhQUFhLENBRGpCOztBQUdBLFNBQU8sVUFBUyxHQUFULEVBQWMsS0FBZCxFQUFxQjtBQUMxQixRQUFJLFFBQVEsS0FBWjtRQUNJLFlBQVksWUFBWSxRQUFRLFVBQXBCLENBRGhCOztBQUdBLGlCQUFhLEtBQWI7QUFDQSxRQUFJLFlBQVksQ0FBaEIsRUFBbUI7QUFDakIsVUFBSSxFQUFFLEtBQUYsSUFBVyxTQUFmLEVBQTBCO0FBQ3hCLGVBQU8sR0FBUDtBQUNEO0FBQ0YsS0FKRCxNQUlPO0FBQ0wsY0FBUSxDQUFSO0FBQ0Q7QUFDRCxXQUFPLFlBQVksR0FBWixFQUFpQixLQUFqQixDQUFQO0FBQ0QsR0FiRDtBQWNELENBbEJjLEVBQWY7O0FBb0JBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJfc2V0RGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU2V0RGF0YSA9IHJlcXVpcmUoJy4vX2Jhc2VTZXREYXRhJyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDE1MCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKipcbiAqIFNldHMgbWV0YWRhdGEgZm9yIGBmdW5jYC5cbiAqXG4gKiAqKk5vdGU6KiogSWYgdGhpcyBmdW5jdGlvbiBiZWNvbWVzIGhvdCwgaS5lLiBpcyBpbnZva2VkIGEgbG90IGluIGEgc2hvcnRcbiAqIHBlcmlvZCBvZiB0aW1lLCBpdCB3aWxsIHRyaXAgaXRzIGJyZWFrZXIgYW5kIHRyYW5zaXRpb24gdG8gYW4gaWRlbnRpdHlcbiAqIGZ1bmN0aW9uIHRvIGF2b2lkIGdhcmJhZ2UgY29sbGVjdGlvbiBwYXVzZXMgaW4gVjguIFNlZVxuICogW1Y4IGlzc3VlIDIwNzBdKGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIwNzApXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhc3NvY2lhdGUgbWV0YWRhdGEgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWV0YWRhdGEuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIHN0YW1wID0gbm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBiYXNlU2V0RGF0YShrZXksIHZhbHVlKTtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0RGF0YTtcbiJdfQ==