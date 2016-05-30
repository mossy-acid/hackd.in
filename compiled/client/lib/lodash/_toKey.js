'use strict';

var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

module.exports = toKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL190b0tleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLFlBQVIsQ0FBWDs7O0FBR0osSUFBSSxXQUFXLElBQUksQ0FBSjs7Ozs7Ozs7O0FBU2YsU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQjtBQUNwQixNQUFJLE9BQU8sS0FBUCxJQUFnQixRQUFoQixJQUE0QixTQUFTLEtBQVQsQ0FBNUIsRUFBNkM7QUFDL0MsV0FBTyxLQUFQLENBRCtDO0dBQWpEO0FBR0EsTUFBSSxTQUFVLFFBQVEsRUFBUixDQUpNO0FBS3BCLFNBQU8sTUFBQyxJQUFVLEdBQVYsSUFBaUIsQ0FBQyxHQUFJLEtBQUosSUFBYyxDQUFDLFFBQUQsR0FBYSxJQUE5QyxHQUFxRCxNQUFyRCxDQUxhO0NBQXRCOztBQVFBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJfdG9LZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIl19