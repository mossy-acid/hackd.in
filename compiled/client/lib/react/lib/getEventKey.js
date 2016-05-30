/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

'use strict';

var getEventCharCode = require('./getEventCharCode');

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

module.exports = getEventKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldEV2ZW50S2V5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBdkI7Ozs7OztBQU1BLElBQUksZUFBZTtBQUNqQixTQUFPLFFBRFU7QUFFakIsY0FBWSxHQUZLO0FBR2pCLFVBQVEsV0FIUztBQUlqQixRQUFNLFNBSlc7QUFLakIsV0FBUyxZQUxRO0FBTWpCLFVBQVEsV0FOUztBQU9qQixTQUFPLFFBUFU7QUFRakIsU0FBTyxJQVJVO0FBU2pCLFVBQVEsYUFUUztBQVVqQixVQUFRLGFBVlM7QUFXakIsWUFBVSxZQVhPO0FBWWpCLHFCQUFtQjtBQVpGLENBQW5COzs7Ozs7O0FBb0JBLElBQUksaUJBQWlCO0FBQ25CLEtBQUcsV0FEZ0I7QUFFbkIsS0FBRyxLQUZnQjtBQUduQixNQUFJLE9BSGU7QUFJbkIsTUFBSSxPQUplO0FBS25CLE1BQUksT0FMZTtBQU1uQixNQUFJLFNBTmU7QUFPbkIsTUFBSSxLQVBlO0FBUW5CLE1BQUksT0FSZTtBQVNuQixNQUFJLFVBVGU7QUFVbkIsTUFBSSxRQVZlO0FBV25CLE1BQUksR0FYZTtBQVluQixNQUFJLFFBWmU7QUFhbkIsTUFBSSxVQWJlO0FBY25CLE1BQUksS0FkZTtBQWVuQixNQUFJLE1BZmU7QUFnQm5CLE1BQUksV0FoQmU7QUFpQm5CLE1BQUksU0FqQmU7QUFrQm5CLE1BQUksWUFsQmU7QUFtQm5CLE1BQUksV0FuQmU7QUFvQm5CLE1BQUksUUFwQmU7QUFxQm5CLE1BQUksUUFyQmU7QUFzQm5CLE9BQUssSUF0QmMsRUFzQlIsS0FBSyxJQXRCRyxFQXNCRyxLQUFLLElBdEJSLEVBc0JjLEtBQUssSUF0Qm5CLEVBc0J5QixLQUFLLElBdEI5QixFQXNCb0MsS0FBSyxJQXRCekM7QUF1Qm5CLE9BQUssSUF2QmMsRUF1QlIsS0FBSyxJQXZCRyxFQXVCRyxLQUFLLElBdkJSLEVBdUJjLEtBQUssS0F2Qm5CLEVBdUIwQixLQUFLLEtBdkIvQixFQXVCc0MsS0FBSyxLQXZCM0M7QUF3Qm5CLE9BQUssU0F4QmM7QUF5Qm5CLE9BQUssWUF6QmM7QUEwQm5CLE9BQUs7QUExQmMsQ0FBckI7Ozs7OztBQWlDQSxTQUFTLFdBQVQsQ0FBcUIsV0FBckIsRUFBa0M7QUFDaEMsTUFBSSxZQUFZLEdBQWhCLEVBQXFCOzs7Ozs7QUFNbkIsUUFBSSxNQUFNLGFBQWEsWUFBWSxHQUF6QixLQUFpQyxZQUFZLEdBQXZEO0FBQ0EsUUFBSSxRQUFRLGNBQVosRUFBNEI7QUFDMUIsYUFBTyxHQUFQO0FBQ0Q7QUFDRjs7O0FBR0QsTUFBSSxZQUFZLElBQVosS0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsUUFBSSxXQUFXLGlCQUFpQixXQUFqQixDQUFmOzs7O0FBSUEsV0FBTyxhQUFhLEVBQWIsR0FBa0IsT0FBbEIsR0FBNEIsT0FBTyxZQUFQLENBQW9CLFFBQXBCLENBQW5DO0FBQ0Q7QUFDRCxNQUFJLFlBQVksSUFBWixLQUFxQixTQUFyQixJQUFrQyxZQUFZLElBQVosS0FBcUIsT0FBM0QsRUFBb0U7OztBQUdsRSxXQUFPLGVBQWUsWUFBWSxPQUEzQixLQUF1QyxjQUE5QztBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6ImdldEV2ZW50S2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGdldEV2ZW50S2V5XG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGdldEV2ZW50Q2hhckNvZGUgPSByZXF1aXJlKCcuL2dldEV2ZW50Q2hhckNvZGUnKTtcblxuLyoqXG4gKiBOb3JtYWxpemF0aW9uIG9mIGRlcHJlY2F0ZWQgSFRNTDUgYGtleWAgdmFsdWVzXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50I0tleV9uYW1lc1xuICovXG52YXIgbm9ybWFsaXplS2V5ID0ge1xuICAnRXNjJzogJ0VzY2FwZScsXG4gICdTcGFjZWJhcic6ICcgJyxcbiAgJ0xlZnQnOiAnQXJyb3dMZWZ0JyxcbiAgJ1VwJzogJ0Fycm93VXAnLFxuICAnUmlnaHQnOiAnQXJyb3dSaWdodCcsXG4gICdEb3duJzogJ0Fycm93RG93bicsXG4gICdEZWwnOiAnRGVsZXRlJyxcbiAgJ1dpbic6ICdPUycsXG4gICdNZW51JzogJ0NvbnRleHRNZW51JyxcbiAgJ0FwcHMnOiAnQ29udGV4dE1lbnUnLFxuICAnU2Nyb2xsJzogJ1Njcm9sbExvY2snLFxuICAnTW96UHJpbnRhYmxlS2V5JzogJ1VuaWRlbnRpZmllZCdcbn07XG5cbi8qKlxuICogVHJhbnNsYXRpb24gZnJvbSBsZWdhY3kgYGtleUNvZGVgIHRvIEhUTUw1IGBrZXlgXG4gKiBPbmx5IHNwZWNpYWwga2V5cyBzdXBwb3J0ZWQsIGFsbCBvdGhlcnMgZGVwZW5kIG9uIGtleWJvYXJkIGxheW91dCBvciBicm93c2VyXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50I0tleV9uYW1lc1xuICovXG52YXIgdHJhbnNsYXRlVG9LZXkgPSB7XG4gIDg6ICdCYWNrc3BhY2UnLFxuICA5OiAnVGFiJyxcbiAgMTI6ICdDbGVhcicsXG4gIDEzOiAnRW50ZXInLFxuICAxNjogJ1NoaWZ0JyxcbiAgMTc6ICdDb250cm9sJyxcbiAgMTg6ICdBbHQnLFxuICAxOTogJ1BhdXNlJyxcbiAgMjA6ICdDYXBzTG9jaycsXG4gIDI3OiAnRXNjYXBlJyxcbiAgMzI6ICcgJyxcbiAgMzM6ICdQYWdlVXAnLFxuICAzNDogJ1BhZ2VEb3duJyxcbiAgMzU6ICdFbmQnLFxuICAzNjogJ0hvbWUnLFxuICAzNzogJ0Fycm93TGVmdCcsXG4gIDM4OiAnQXJyb3dVcCcsXG4gIDM5OiAnQXJyb3dSaWdodCcsXG4gIDQwOiAnQXJyb3dEb3duJyxcbiAgNDU6ICdJbnNlcnQnLFxuICA0NjogJ0RlbGV0ZScsXG4gIDExMjogJ0YxJywgMTEzOiAnRjInLCAxMTQ6ICdGMycsIDExNTogJ0Y0JywgMTE2OiAnRjUnLCAxMTc6ICdGNicsXG4gIDExODogJ0Y3JywgMTE5OiAnRjgnLCAxMjA6ICdGOScsIDEyMTogJ0YxMCcsIDEyMjogJ0YxMScsIDEyMzogJ0YxMicsXG4gIDE0NDogJ051bUxvY2snLFxuICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgMjI0OiAnTWV0YSdcbn07XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7c3RyaW5nfSBOb3JtYWxpemVkIGBrZXlgIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBnZXRFdmVudEtleShuYXRpdmVFdmVudCkge1xuICBpZiAobmF0aXZlRXZlbnQua2V5KSB7XG4gICAgLy8gTm9ybWFsaXplIGluY29uc2lzdGVudCB2YWx1ZXMgcmVwb3J0ZWQgYnkgYnJvd3NlcnMgZHVlIHRvXG4gICAgLy8gaW1wbGVtZW50YXRpb25zIG9mIGEgd29ya2luZyBkcmFmdCBzcGVjaWZpY2F0aW9uLlxuXG4gICAgLy8gRmlyZUZveCBpbXBsZW1lbnRzIGBrZXlgIGJ1dCByZXR1cm5zIGBNb3pQcmludGFibGVLZXlgIGZvciBhbGxcbiAgICAvLyBwcmludGFibGUgY2hhcmFjdGVycyAobm9ybWFsaXplZCB0byBgVW5pZGVudGlmaWVkYCksIGlnbm9yZSBpdC5cbiAgICB2YXIga2V5ID0gbm9ybWFsaXplS2V5W25hdGl2ZUV2ZW50LmtleV0gfHwgbmF0aXZlRXZlbnQua2V5O1xuICAgIGlmIChrZXkgIT09ICdVbmlkZW50aWZpZWQnKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuXG4gIC8vIEJyb3dzZXIgZG9lcyBub3QgaW1wbGVtZW50IGBrZXlgLCBwb2x5ZmlsbCBhcyBtdWNoIG9mIGl0IGFzIHdlIGNhbi5cbiAgaWYgKG5hdGl2ZUV2ZW50LnR5cGUgPT09ICdrZXlwcmVzcycpIHtcbiAgICB2YXIgY2hhckNvZGUgPSBnZXRFdmVudENoYXJDb2RlKG5hdGl2ZUV2ZW50KTtcblxuICAgIC8vIFRoZSBlbnRlci1rZXkgaXMgdGVjaG5pY2FsbHkgYm90aCBwcmludGFibGUgYW5kIG5vbi1wcmludGFibGUgYW5kIGNhblxuICAgIC8vIHRodXMgYmUgY2FwdHVyZWQgYnkgYGtleXByZXNzYCwgbm8gb3RoZXIgbm9uLXByaW50YWJsZSBrZXkgc2hvdWxkLlxuICAgIHJldHVybiBjaGFyQ29kZSA9PT0gMTMgPyAnRW50ZXInIDogU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyQ29kZSk7XG4gIH1cbiAgaWYgKG5hdGl2ZUV2ZW50LnR5cGUgPT09ICdrZXlkb3duJyB8fCBuYXRpdmVFdmVudC50eXBlID09PSAna2V5dXAnKSB7XG4gICAgLy8gV2hpbGUgdXNlciBrZXlib2FyZCBsYXlvdXQgZGV0ZXJtaW5lcyB0aGUgYWN0dWFsIG1lYW5pbmcgb2YgZWFjaFxuICAgIC8vIGBrZXlDb2RlYCB2YWx1ZSwgYWxtb3N0IGFsbCBmdW5jdGlvbiBrZXlzIGhhdmUgYSB1bml2ZXJzYWwgdmFsdWUuXG4gICAgcmV0dXJuIHRyYW5zbGF0ZVRvS2V5W25hdGl2ZUV2ZW50LmtleUNvZGVdIHx8ICdVbmlkZW50aWZpZWQnO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRFdmVudEtleTsiXX0=