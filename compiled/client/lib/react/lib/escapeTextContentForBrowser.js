/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule escapeTextContentForBrowser
 */

'use strict';

var ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;'
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextContentForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextContentForBrowser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2VzY2FwZVRleHRDb250ZW50Rm9yQnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksZ0JBQWdCO0FBQ2xCLE9BQUssT0FBTDtBQUNBLE9BQUssTUFBTDtBQUNBLE9BQUssTUFBTDtBQUNBLE9BQUssUUFBTDtBQUNBLFFBQU0sUUFBTjtDQUxFOztBQVFKLElBQUksZUFBZSxVQUFmOztBQUVKLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLGNBQWMsS0FBZCxDQUFQLENBRHNCO0NBQXhCOzs7Ozs7OztBQVVBLFNBQVMsMkJBQVQsQ0FBcUMsSUFBckMsRUFBMkM7QUFDekMsU0FBTyxDQUFDLEtBQUssSUFBTCxDQUFELENBQVksT0FBWixDQUFvQixZQUFwQixFQUFrQyxPQUFsQyxDQUFQLENBRHlDO0NBQTNDOztBQUlBLE9BQU8sT0FBUCxHQUFpQiwyQkFBakIiLCJmaWxlIjoiZXNjYXBlVGV4dENvbnRlbnRGb3JCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGVzY2FwZVRleHRDb250ZW50Rm9yQnJvd3NlclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEVTQ0FQRV9MT09LVVAgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJz4nOiAnJmd0OycsXG4gICc8JzogJyZsdDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgJ1xcJyc6ICcmI3gyNzsnXG59O1xuXG52YXIgRVNDQVBFX1JFR0VYID0gL1smPjxcIiddL2c7XG5cbmZ1bmN0aW9uIGVzY2FwZXIobWF0Y2gpIHtcbiAgcmV0dXJuIEVTQ0FQRV9MT09LVVBbbWF0Y2hdO1xufVxuXG4vKipcbiAqIEVzY2FwZXMgdGV4dCB0byBwcmV2ZW50IHNjcmlwdGluZyBhdHRhY2tzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdGV4dCBUZXh0IHZhbHVlIHRvIGVzY2FwZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gQW4gZXNjYXBlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVRleHRDb250ZW50Rm9yQnJvd3Nlcih0ZXh0KSB7XG4gIHJldHVybiAoJycgKyB0ZXh0KS5yZXBsYWNlKEVTQ0FQRV9SRUdFWCwgZXNjYXBlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXNjYXBlVGV4dENvbnRlbnRGb3JCcm93c2VyOyJdfQ==