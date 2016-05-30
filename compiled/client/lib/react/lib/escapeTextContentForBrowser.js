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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2VzY2FwZVRleHRDb250ZW50Rm9yQnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksZ0JBQWdCO0FBQ2xCLE9BQUssT0FEYTtBQUVsQixPQUFLLE1BRmE7QUFHbEIsT0FBSyxNQUhhO0FBSWxCLE9BQUssUUFKYTtBQUtsQixRQUFNO0FBTFksQ0FBcEI7O0FBUUEsSUFBSSxlQUFlLFVBQW5COztBQUVBLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLGNBQWMsS0FBZCxDQUFQO0FBQ0Q7Ozs7Ozs7O0FBUUQsU0FBUywyQkFBVCxDQUFxQyxJQUFyQyxFQUEyQztBQUN6QyxTQUFPLENBQUMsS0FBSyxJQUFOLEVBQVksT0FBWixDQUFvQixZQUFwQixFQUFrQyxPQUFsQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLDJCQUFqQiIsImZpbGUiOiJlc2NhcGVUZXh0Q29udGVudEZvckJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgZXNjYXBlVGV4dENvbnRlbnRGb3JCcm93c2VyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVNDQVBFX0xPT0tVUCA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJzwnOiAnJmx0OycsXG4gICdcIic6ICcmcXVvdDsnLFxuICAnXFwnJzogJyYjeDI3Oydcbn07XG5cbnZhciBFU0NBUEVfUkVHRVggPSAvWyY+PFwiJ10vZztcblxuZnVuY3Rpb24gZXNjYXBlcihtYXRjaCkge1xuICByZXR1cm4gRVNDQVBFX0xPT0tVUFttYXRjaF07XG59XG5cbi8qKlxuICogRXNjYXBlcyB0ZXh0IHRvIHByZXZlbnQgc2NyaXB0aW5nIGF0dGFja3MuXG4gKlxuICogQHBhcmFtIHsqfSB0ZXh0IFRleHQgdmFsdWUgdG8gZXNjYXBlLlxuICogQHJldHVybiB7c3RyaW5nfSBBbiBlc2NhcGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlVGV4dENvbnRlbnRGb3JCcm93c2VyKHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UoRVNDQVBFX1JFR0VYLCBlc2NhcGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlc2NhcGVUZXh0Q29udGVudEZvckJyb3dzZXI7Il19