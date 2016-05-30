'use strict';

var createPadding = require('./_createPadding'),
    stringSize = require('./_stringSize'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeFloor = Math.floor;

/**
 * Pads `string` on the left and right sides if it's shorter than `length`.
 * Padding characters are truncated if they can't be evenly divided by `length`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.pad('abc', 8);
 * // => '  abc   '
 *
 * _.pad('abc', 8, '_-');
 * // => '_-abc_-_'
 *
 * _.pad('abc', 3);
 * // => 'abc'
 */
function pad(string, length, chars) {
  string = toString(string);
  length = toInteger(length);

  var strLength = length ? stringSize(string) : 0;
  if (!length || strLength >= length) {
    return string;
  }
  var mid = (length - strLength) / 2;
  return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
}

module.exports = pad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7SUFDSSxhQUFhLFFBQVEsZUFBUixDQURqQjtJQUVJLFlBQVksUUFBUSxhQUFSLENBRmhCO0lBR0ksV0FBVyxRQUFRLFlBQVIsQ0FIZjs7O0FBTUEsSUFBSSxhQUFhLEtBQUssSUFBdEI7SUFDSSxjQUFjLEtBQUssS0FEdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixNQUFyQixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxXQUFTLFNBQVMsTUFBVCxDQUFUO0FBQ0EsV0FBUyxVQUFVLE1BQVYsQ0FBVDs7QUFFQSxNQUFJLFlBQVksU0FBUyxXQUFXLE1BQVgsQ0FBVCxHQUE4QixDQUE5QztBQUNBLE1BQUksQ0FBQyxNQUFELElBQVcsYUFBYSxNQUE1QixFQUFvQztBQUNsQyxXQUFPLE1BQVA7QUFDRDtBQUNELE1BQUksTUFBTSxDQUFDLFNBQVMsU0FBVixJQUF1QixDQUFqQztBQUNBLFNBQ0UsY0FBYyxZQUFZLEdBQVosQ0FBZCxFQUFnQyxLQUFoQyxJQUNBLE1BREEsR0FFQSxjQUFjLFdBQVcsR0FBWCxDQUFkLEVBQStCLEtBQS9CLENBSEY7QUFLRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoicGFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVBhZGRpbmcgPSByZXF1aXJlKCcuL19jcmVhdGVQYWRkaW5nJyksXG4gICAgc3RyaW5nU2l6ZSA9IHJlcXVpcmUoJy4vX3N0cmluZ1NpemUnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ2VpbCA9IE1hdGguY2VpbCxcbiAgICBuYXRpdmVGbG9vciA9IE1hdGguZmxvb3I7XG5cbi8qKlxuICogUGFkcyBgc3RyaW5nYCBvbiB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZXMgaWYgaXQncyBzaG9ydGVyIHRoYW4gYGxlbmd0aGAuXG4gKiBQYWRkaW5nIGNoYXJhY3RlcnMgYXJlIHRydW5jYXRlZCBpZiB0aGV5IGNhbid0IGJlIGV2ZW5seSBkaXZpZGVkIGJ5IGBsZW5ndGhgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHBhZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPTBdIFRoZSBwYWRkaW5nIGxlbmd0aC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcnM9JyAnXSBUaGUgc3RyaW5nIHVzZWQgYXMgcGFkZGluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHBhZGRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucGFkKCdhYmMnLCA4KTtcbiAqIC8vID0+ICcgIGFiYyAgICdcbiAqXG4gKiBfLnBhZCgnYWJjJywgOCwgJ18tJyk7XG4gKiAvLyA9PiAnXy1hYmNfLV8nXG4gKlxuICogXy5wYWQoJ2FiYycsIDMpO1xuICogLy8gPT4gJ2FiYydcbiAqL1xuZnVuY3Rpb24gcGFkKHN0cmluZywgbGVuZ3RoLCBjaGFycykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICBsZW5ndGggPSB0b0ludGVnZXIobGVuZ3RoKTtcblxuICB2YXIgc3RyTGVuZ3RoID0gbGVuZ3RoID8gc3RyaW5nU2l6ZShzdHJpbmcpIDogMDtcbiAgaWYgKCFsZW5ndGggfHwgc3RyTGVuZ3RoID49IGxlbmd0aCkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbiAgdmFyIG1pZCA9IChsZW5ndGggLSBzdHJMZW5ndGgpIC8gMjtcbiAgcmV0dXJuIChcbiAgICBjcmVhdGVQYWRkaW5nKG5hdGl2ZUZsb29yKG1pZCksIGNoYXJzKSArXG4gICAgc3RyaW5nICtcbiAgICBjcmVhdGVQYWRkaW5nKG5hdGl2ZUNlaWwobWlkKSwgY2hhcnMpXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFkO1xuIl19