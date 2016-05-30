'use strict';

/** Used to map HTML entities to characters. */
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
};

/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(chr) {
  return htmlUnescapes[chr];
}

module.exports = unescapeHtmlChar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL191bmVzY2FwZUh0bWxDaGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksZ0JBQWdCO0FBQ2xCLFdBQVMsR0FBVDtBQUNBLFVBQVEsR0FBUjtBQUNBLFVBQVEsR0FBUjtBQUNBLFlBQVUsR0FBVjtBQUNBLFdBQVMsR0FBVDtBQUNBLFdBQVMsR0FBVDtDQU5FOzs7Ozs7Ozs7QUFnQkosU0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUM3QixTQUFPLGNBQWMsR0FBZCxDQUFQLENBRDZCO0NBQS9COztBQUlBLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiX3VuZXNjYXBlSHRtbENoYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCB0byBtYXAgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLiAqL1xudmFyIGh0bWxVbmVzY2FwZXMgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCcsXG4gICcmZ3Q7JzogJz4nLFxuICAnJnF1b3Q7JzogJ1wiJyxcbiAgJyYjMzk7JzogXCInXCIsXG4gICcmIzk2Oyc6ICdgJ1xufTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLnVuZXNjYXBlYCB0byBjb252ZXJ0IEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gdW5lc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgY2hhcmFjdGVyLlxuICovXG5mdW5jdGlvbiB1bmVzY2FwZUh0bWxDaGFyKGNocikge1xuICByZXR1cm4gaHRtbFVuZXNjYXBlc1tjaHJdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuZXNjYXBlSHRtbENoYXI7XG4iXX0=