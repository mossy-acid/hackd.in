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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldEV2ZW50Q2hhckNvZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7Ozs7Ozs7Ozs7QUFZQSxTQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDO0FBQ3JDLE1BQUksUUFBSjtBQUNBLE1BQUksVUFBVSxZQUFZLE9BQTFCOztBQUVBLE1BQUksY0FBYyxXQUFsQixFQUErQjtBQUM3QixlQUFXLFlBQVksUUFBdkI7OztBQUdBLFFBQUksYUFBYSxDQUFiLElBQWtCLFlBQVksRUFBbEMsRUFBc0M7QUFDcEMsaUJBQVcsRUFBWDtBQUNEO0FBQ0YsR0FQRCxNQU9POztBQUVMLGVBQVcsT0FBWDtBQUNEOzs7O0FBSUQsTUFBSSxZQUFZLEVBQVosSUFBa0IsYUFBYSxFQUFuQyxFQUF1QztBQUNyQyxXQUFPLFFBQVA7QUFDRDs7QUFFRCxTQUFPLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsZ0JBQWpCIiwiZmlsZSI6ImdldEV2ZW50Q2hhckNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgZ2V0RXZlbnRDaGFyQ29kZVxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogYGNoYXJDb2RlYCByZXByZXNlbnRzIHRoZSBhY3R1YWwgXCJjaGFyYWN0ZXIgY29kZVwiIGFuZCBpcyBzYWZlIHRvIHVzZSB3aXRoXG4gKiBgU3RyaW5nLmZyb21DaGFyQ29kZWAuIEFzIHN1Y2gsIG9ubHkga2V5cyB0aGF0IGNvcnJlc3BvbmQgdG8gcHJpbnRhYmxlXG4gKiBjaGFyYWN0ZXJzIHByb2R1Y2UgYSB2YWxpZCBgY2hhckNvZGVgLCB0aGUgb25seSBleGNlcHRpb24gdG8gdGhpcyBpcyBFbnRlci5cbiAqIFRoZSBUYWIta2V5IGlzIGNvbnNpZGVyZWQgbm9uLXByaW50YWJsZSBhbmQgZG9lcyBub3QgaGF2ZSBhIGBjaGFyQ29kZWAsXG4gKiBwcmVzdW1hYmx5IGJlY2F1c2UgaXQgZG9lcyBub3QgcHJvZHVjZSBhIHRhYi1jaGFyYWN0ZXIgaW4gYnJvd3NlcnMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7bnVtYmVyfSBOb3JtYWxpemVkIGBjaGFyQ29kZWAgcHJvcGVydHkuXG4gKi9cbmZ1bmN0aW9uIGdldEV2ZW50Q2hhckNvZGUobmF0aXZlRXZlbnQpIHtcbiAgdmFyIGNoYXJDb2RlO1xuICB2YXIga2V5Q29kZSA9IG5hdGl2ZUV2ZW50LmtleUNvZGU7XG5cbiAgaWYgKCdjaGFyQ29kZScgaW4gbmF0aXZlRXZlbnQpIHtcbiAgICBjaGFyQ29kZSA9IG5hdGl2ZUV2ZW50LmNoYXJDb2RlO1xuXG4gICAgLy8gRkYgZG9lcyBub3Qgc2V0IGBjaGFyQ29kZWAgZm9yIHRoZSBFbnRlci1rZXksIGNoZWNrIGFnYWluc3QgYGtleUNvZGVgLlxuICAgIGlmIChjaGFyQ29kZSA9PT0gMCAmJiBrZXlDb2RlID09PSAxMykge1xuICAgICAgY2hhckNvZGUgPSAxMztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSUU4IGRvZXMgbm90IGltcGxlbWVudCBgY2hhckNvZGVgLCBidXQgYGtleUNvZGVgIGhhcyB0aGUgY29ycmVjdCB2YWx1ZS5cbiAgICBjaGFyQ29kZSA9IGtleUNvZGU7XG4gIH1cblxuICAvLyBTb21lIG5vbi1wcmludGFibGUga2V5cyBhcmUgcmVwb3J0ZWQgaW4gYGNoYXJDb2RlYC9ga2V5Q29kZWAsIGRpc2NhcmQgdGhlbS5cbiAgLy8gTXVzdCBub3QgZGlzY2FyZCB0aGUgKG5vbi0pcHJpbnRhYmxlIEVudGVyLWtleS5cbiAgaWYgKGNoYXJDb2RlID49IDMyIHx8IGNoYXJDb2RlID09PSAxMykge1xuICAgIHJldHVybiBjaGFyQ29kZTtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEV2ZW50Q2hhckNvZGU7Il19