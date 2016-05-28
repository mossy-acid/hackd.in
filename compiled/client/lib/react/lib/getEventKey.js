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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldEV2ZW50S2V5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBbkI7Ozs7OztBQU1KLElBQUksZUFBZTtBQUNqQixTQUFPLFFBQVA7QUFDQSxjQUFZLEdBQVo7QUFDQSxVQUFRLFdBQVI7QUFDQSxRQUFNLFNBQU47QUFDQSxXQUFTLFlBQVQ7QUFDQSxVQUFRLFdBQVI7QUFDQSxTQUFPLFFBQVA7QUFDQSxTQUFPLElBQVA7QUFDQSxVQUFRLGFBQVI7QUFDQSxVQUFRLGFBQVI7QUFDQSxZQUFVLFlBQVY7QUFDQSxxQkFBbUIsY0FBbkI7Q0FaRTs7Ozs7OztBQW9CSixJQUFJLGlCQUFpQjtBQUNuQixLQUFHLFdBQUg7QUFDQSxLQUFHLEtBQUg7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLEtBQUo7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLFVBQUo7QUFDQSxNQUFJLFFBQUo7QUFDQSxNQUFJLEdBQUo7QUFDQSxNQUFJLFFBQUo7QUFDQSxNQUFJLFVBQUo7QUFDQSxNQUFJLEtBQUo7QUFDQSxNQUFJLE1BQUo7QUFDQSxNQUFJLFdBQUo7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLFlBQUo7QUFDQSxNQUFJLFdBQUo7QUFDQSxNQUFJLFFBQUo7QUFDQSxNQUFJLFFBQUo7QUFDQSxPQUFLLElBQUwsRUFBVyxLQUFLLElBQUwsRUFBVyxLQUFLLElBQUwsRUFBVyxLQUFLLElBQUwsRUFBVyxLQUFLLElBQUwsRUFBVyxLQUFLLElBQUw7QUFDdkQsT0FBSyxJQUFMLEVBQVcsS0FBSyxJQUFMLEVBQVcsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxLQUFMLEVBQVksS0FBSyxLQUFMO0FBQ3pELE9BQUssU0FBTDtBQUNBLE9BQUssWUFBTDtBQUNBLE9BQUssTUFBTDtDQTFCRTs7Ozs7O0FBaUNKLFNBQVMsV0FBVCxDQUFxQixXQUFyQixFQUFrQztBQUNoQyxNQUFJLFlBQVksR0FBWixFQUFpQjs7Ozs7O0FBTW5CLFFBQUksTUFBTSxhQUFhLFlBQVksR0FBWixDQUFiLElBQWlDLFlBQVksR0FBWixDQU54QjtBQU9uQixRQUFJLFFBQVEsY0FBUixFQUF3QjtBQUMxQixhQUFPLEdBQVAsQ0FEMEI7S0FBNUI7R0FQRjs7O0FBRGdDLE1BYzVCLFlBQVksSUFBWixLQUFxQixVQUFyQixFQUFpQztBQUNuQyxRQUFJLFdBQVcsaUJBQWlCLFdBQWpCLENBQVg7Ozs7QUFEK0IsV0FLNUIsYUFBYSxFQUFiLEdBQWtCLE9BQWxCLEdBQTRCLE9BQU8sWUFBUCxDQUFvQixRQUFwQixDQUE1QixDQUw0QjtHQUFyQztBQU9BLE1BQUksWUFBWSxJQUFaLEtBQXFCLFNBQXJCLElBQWtDLFlBQVksSUFBWixLQUFxQixPQUFyQixFQUE4Qjs7O0FBR2xFLFdBQU8sZUFBZSxZQUFZLE9BQVosQ0FBZixJQUF1QyxjQUF2QyxDQUgyRDtHQUFwRTtBQUtBLFNBQU8sRUFBUCxDQTFCZ0M7Q0FBbEM7O0FBNkJBLE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJnZXRFdmVudEtleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBnZXRFdmVudEtleVxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBnZXRFdmVudENoYXJDb2RlID0gcmVxdWlyZSgnLi9nZXRFdmVudENoYXJDb2RlJyk7XG5cbi8qKlxuICogTm9ybWFsaXphdGlvbiBvZiBkZXByZWNhdGVkIEhUTUw1IGBrZXlgIHZhbHVlc1xuICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudCNLZXlfbmFtZXNcbiAqL1xudmFyIG5vcm1hbGl6ZUtleSA9IHtcbiAgJ0VzYyc6ICdFc2NhcGUnLFxuICAnU3BhY2ViYXInOiAnICcsXG4gICdMZWZ0JzogJ0Fycm93TGVmdCcsXG4gICdVcCc6ICdBcnJvd1VwJyxcbiAgJ1JpZ2h0JzogJ0Fycm93UmlnaHQnLFxuICAnRG93bic6ICdBcnJvd0Rvd24nLFxuICAnRGVsJzogJ0RlbGV0ZScsXG4gICdXaW4nOiAnT1MnLFxuICAnTWVudSc6ICdDb250ZXh0TWVudScsXG4gICdBcHBzJzogJ0NvbnRleHRNZW51JyxcbiAgJ1Njcm9sbCc6ICdTY3JvbGxMb2NrJyxcbiAgJ01velByaW50YWJsZUtleSc6ICdVbmlkZW50aWZpZWQnXG59O1xuXG4vKipcbiAqIFRyYW5zbGF0aW9uIGZyb20gbGVnYWN5IGBrZXlDb2RlYCB0byBIVE1MNSBga2V5YFxuICogT25seSBzcGVjaWFsIGtleXMgc3VwcG9ydGVkLCBhbGwgb3RoZXJzIGRlcGVuZCBvbiBrZXlib2FyZCBsYXlvdXQgb3IgYnJvd3NlclxuICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudCNLZXlfbmFtZXNcbiAqL1xudmFyIHRyYW5zbGF0ZVRvS2V5ID0ge1xuICA4OiAnQmFja3NwYWNlJyxcbiAgOTogJ1RhYicsXG4gIDEyOiAnQ2xlYXInLFxuICAxMzogJ0VudGVyJyxcbiAgMTY6ICdTaGlmdCcsXG4gIDE3OiAnQ29udHJvbCcsXG4gIDE4OiAnQWx0JyxcbiAgMTk6ICdQYXVzZScsXG4gIDIwOiAnQ2Fwc0xvY2snLFxuICAyNzogJ0VzY2FwZScsXG4gIDMyOiAnICcsXG4gIDMzOiAnUGFnZVVwJyxcbiAgMzQ6ICdQYWdlRG93bicsXG4gIDM1OiAnRW5kJyxcbiAgMzY6ICdIb21lJyxcbiAgMzc6ICdBcnJvd0xlZnQnLFxuICAzODogJ0Fycm93VXAnLFxuICAzOTogJ0Fycm93UmlnaHQnLFxuICA0MDogJ0Fycm93RG93bicsXG4gIDQ1OiAnSW5zZXJ0JyxcbiAgNDY6ICdEZWxldGUnLFxuICAxMTI6ICdGMScsIDExMzogJ0YyJywgMTE0OiAnRjMnLCAxMTU6ICdGNCcsIDExNjogJ0Y1JywgMTE3OiAnRjYnLFxuICAxMTg6ICdGNycsIDExOTogJ0Y4JywgMTIwOiAnRjknLCAxMjE6ICdGMTAnLCAxMjI6ICdGMTEnLCAxMjM6ICdGMTInLFxuICAxNDQ6ICdOdW1Mb2NrJyxcbiAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gIDIyNDogJ01ldGEnXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4ge3N0cmluZ30gTm9ybWFsaXplZCBga2V5YCBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gZ2V0RXZlbnRLZXkobmF0aXZlRXZlbnQpIHtcbiAgaWYgKG5hdGl2ZUV2ZW50LmtleSkge1xuICAgIC8vIE5vcm1hbGl6ZSBpbmNvbnNpc3RlbnQgdmFsdWVzIHJlcG9ydGVkIGJ5IGJyb3dzZXJzIGR1ZSB0b1xuICAgIC8vIGltcGxlbWVudGF0aW9ucyBvZiBhIHdvcmtpbmcgZHJhZnQgc3BlY2lmaWNhdGlvbi5cblxuICAgIC8vIEZpcmVGb3ggaW1wbGVtZW50cyBga2V5YCBidXQgcmV0dXJucyBgTW96UHJpbnRhYmxlS2V5YCBmb3IgYWxsXG4gICAgLy8gcHJpbnRhYmxlIGNoYXJhY3RlcnMgKG5vcm1hbGl6ZWQgdG8gYFVuaWRlbnRpZmllZGApLCBpZ25vcmUgaXQuXG4gICAgdmFyIGtleSA9IG5vcm1hbGl6ZUtleVtuYXRpdmVFdmVudC5rZXldIHx8IG5hdGl2ZUV2ZW50LmtleTtcbiAgICBpZiAoa2V5ICE9PSAnVW5pZGVudGlmaWVkJykge1xuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gIH1cblxuICAvLyBCcm93c2VyIGRvZXMgbm90IGltcGxlbWVudCBga2V5YCwgcG9seWZpbGwgYXMgbXVjaCBvZiBpdCBhcyB3ZSBjYW4uXG4gIGlmIChuYXRpdmVFdmVudC50eXBlID09PSAna2V5cHJlc3MnKSB7XG4gICAgdmFyIGNoYXJDb2RlID0gZ2V0RXZlbnRDaGFyQ29kZShuYXRpdmVFdmVudCk7XG5cbiAgICAvLyBUaGUgZW50ZXIta2V5IGlzIHRlY2huaWNhbGx5IGJvdGggcHJpbnRhYmxlIGFuZCBub24tcHJpbnRhYmxlIGFuZCBjYW5cbiAgICAvLyB0aHVzIGJlIGNhcHR1cmVkIGJ5IGBrZXlwcmVzc2AsIG5vIG90aGVyIG5vbi1wcmludGFibGUga2V5IHNob3VsZC5cbiAgICByZXR1cm4gY2hhckNvZGUgPT09IDEzID8gJ0VudGVyJyA6IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhckNvZGUpO1xuICB9XG4gIGlmIChuYXRpdmVFdmVudC50eXBlID09PSAna2V5ZG93bicgfHwgbmF0aXZlRXZlbnQudHlwZSA9PT0gJ2tleXVwJykge1xuICAgIC8vIFdoaWxlIHVzZXIga2V5Ym9hcmQgbGF5b3V0IGRldGVybWluZXMgdGhlIGFjdHVhbCBtZWFuaW5nIG9mIGVhY2hcbiAgICAvLyBga2V5Q29kZWAgdmFsdWUsIGFsbW9zdCBhbGwgZnVuY3Rpb24ga2V5cyBoYXZlIGEgdW5pdmVyc2FsIHZhbHVlLlxuICAgIHJldHVybiB0cmFuc2xhdGVUb0tleVtuYXRpdmVFdmVudC5rZXlDb2RlXSB8fCAnVW5pZGVudGlmaWVkJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RXZlbnRLZXk7Il19