'use strict';

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19yZXBsYWNlSG9sZGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFJLGNBQWMsd0JBQWQ7Ozs7Ozs7Ozs7O0FBV0osU0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCLFdBQS9CLEVBQTRDO0FBQzFDLE1BQUksUUFBUSxDQUFDLENBQUQ7TUFDUixTQUFTLE1BQU0sTUFBTjtNQUNULFdBQVcsQ0FBWDtNQUNBLFNBQVMsRUFBVCxDQUpzQzs7QUFNMUMsU0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFFBQUksUUFBUSxNQUFNLEtBQU4sQ0FBUixDQURtQjtBQUV2QixRQUFJLFVBQVUsV0FBVixJQUF5QixVQUFVLFdBQVYsRUFBdUI7QUFDbEQsWUFBTSxLQUFOLElBQWUsV0FBZixDQURrRDtBQUVsRCxhQUFPLFVBQVAsSUFBcUIsS0FBckIsQ0FGa0Q7S0FBcEQ7R0FGRjtBQU9BLFNBQU8sTUFBUCxDQWIwQztDQUE1Qzs7QUFnQkEsT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6Il9yZXBsYWNlSG9sZGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2VkIGFzIHRoZSBpbnRlcm5hbCBhcmd1bWVudCBwbGFjZWhvbGRlci4gKi9cbnZhciBQTEFDRUhPTERFUiA9ICdfX2xvZGFzaF9wbGFjZWhvbGRlcl9fJztcblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgYHBsYWNlaG9sZGVyYCBlbGVtZW50cyBpbiBgYXJyYXlgIHdpdGggYW4gaW50ZXJuYWwgcGxhY2Vob2xkZXJcbiAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHRoZWlyIGluZGV4ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB0byByZXBsYWNlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUhvbGRlcnMoYXJyYXksIHBsYWNlaG9sZGVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHZhbHVlID09PSBwbGFjZWhvbGRlciB8fCB2YWx1ZSA9PT0gUExBQ0VIT0xERVIpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IFBMQUNFSE9MREVSO1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwbGFjZUhvbGRlcnM7XG4iXX0=