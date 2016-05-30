/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventCharCode
 * @typechecks static-only
 */

'use strict';

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */

function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

module.exports = getEventCharCode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldEV2ZW50Q2hhckNvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7Ozs7QUFZQSxTQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDO0FBQ3JDLE1BQUksUUFBSixDQURxQztBQUVyQyxNQUFJLFVBQVUsWUFBWSxPQUFaLENBRnVCOztBQUlyQyxNQUFJLGNBQWMsV0FBZCxFQUEyQjtBQUM3QixlQUFXLFlBQVksUUFBWjs7O0FBRGtCLFFBSXpCLGFBQWEsQ0FBYixJQUFrQixZQUFZLEVBQVosRUFBZ0I7QUFDcEMsaUJBQVcsRUFBWCxDQURvQztLQUF0QztHQUpGLE1BT087O0FBRUwsZUFBVyxPQUFYLENBRks7R0FQUDs7OztBQUpxQyxNQWtCakMsWUFBWSxFQUFaLElBQWtCLGFBQWEsRUFBYixFQUFpQjtBQUNyQyxXQUFPLFFBQVAsQ0FEcUM7R0FBdkM7O0FBSUEsU0FBTyxDQUFQLENBdEJxQztDQUF2Qzs7QUF5QkEsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQiIsImZpbGUiOiJnZXRFdmVudENoYXJDb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGdldEV2ZW50Q2hhckNvZGVcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIGBjaGFyQ29kZWAgcmVwcmVzZW50cyB0aGUgYWN0dWFsIFwiY2hhcmFjdGVyIGNvZGVcIiBhbmQgaXMgc2FmZSB0byB1c2Ugd2l0aFxuICogYFN0cmluZy5mcm9tQ2hhckNvZGVgLiBBcyBzdWNoLCBvbmx5IGtleXMgdGhhdCBjb3JyZXNwb25kIHRvIHByaW50YWJsZVxuICogY2hhcmFjdGVycyBwcm9kdWNlIGEgdmFsaWQgYGNoYXJDb2RlYCwgdGhlIG9ubHkgZXhjZXB0aW9uIHRvIHRoaXMgaXMgRW50ZXIuXG4gKiBUaGUgVGFiLWtleSBpcyBjb25zaWRlcmVkIG5vbi1wcmludGFibGUgYW5kIGRvZXMgbm90IGhhdmUgYSBgY2hhckNvZGVgLFxuICogcHJlc3VtYWJseSBiZWNhdXNlIGl0IGRvZXMgbm90IHByb2R1Y2UgYSB0YWItY2hhcmFjdGVyIGluIGJyb3dzZXJzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4ge251bWJlcn0gTm9ybWFsaXplZCBgY2hhckNvZGVgIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBnZXRFdmVudENoYXJDb2RlKG5hdGl2ZUV2ZW50KSB7XG4gIHZhciBjaGFyQ29kZTtcbiAgdmFyIGtleUNvZGUgPSBuYXRpdmVFdmVudC5rZXlDb2RlO1xuXG4gIGlmICgnY2hhckNvZGUnIGluIG5hdGl2ZUV2ZW50KSB7XG4gICAgY2hhckNvZGUgPSBuYXRpdmVFdmVudC5jaGFyQ29kZTtcblxuICAgIC8vIEZGIGRvZXMgbm90IHNldCBgY2hhckNvZGVgIGZvciB0aGUgRW50ZXIta2V5LCBjaGVjayBhZ2FpbnN0IGBrZXlDb2RlYC5cbiAgICBpZiAoY2hhckNvZGUgPT09IDAgJiYga2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGNoYXJDb2RlID0gMTM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElFOCBkb2VzIG5vdCBpbXBsZW1lbnQgYGNoYXJDb2RlYCwgYnV0IGBrZXlDb2RlYCBoYXMgdGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgY2hhckNvZGUgPSBrZXlDb2RlO1xuICB9XG5cbiAgLy8gU29tZSBub24tcHJpbnRhYmxlIGtleXMgYXJlIHJlcG9ydGVkIGluIGBjaGFyQ29kZWAvYGtleUNvZGVgLCBkaXNjYXJkIHRoZW0uXG4gIC8vIE11c3Qgbm90IGRpc2NhcmQgdGhlIChub24tKXByaW50YWJsZSBFbnRlci1rZXkuXG4gIGlmIChjaGFyQ29kZSA+PSAzMiB8fCBjaGFyQ29kZSA9PT0gMTMpIHtcbiAgICByZXR1cm4gY2hhckNvZGU7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRFdmVudENoYXJDb2RlOyJdfQ==