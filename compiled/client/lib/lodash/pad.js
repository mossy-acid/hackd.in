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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksYUFBYSxLQUFLLElBQUw7SUFDYixjQUFjLEtBQUssS0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCbEIsU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixNQUFyQixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxXQUFTLFNBQVMsTUFBVCxDQUFULENBRGtDO0FBRWxDLFdBQVMsVUFBVSxNQUFWLENBQVQsQ0FGa0M7O0FBSWxDLE1BQUksWUFBWSxTQUFTLFdBQVcsTUFBWCxDQUFULEdBQThCLENBQTlCLENBSmtCO0FBS2xDLE1BQUksQ0FBQyxNQUFELElBQVcsYUFBYSxNQUFiLEVBQXFCO0FBQ2xDLFdBQU8sTUFBUCxDQURrQztHQUFwQztBQUdBLE1BQUksTUFBTSxDQUFDLFNBQVMsU0FBVCxDQUFELEdBQXVCLENBQXZCLENBUndCO0FBU2xDLFNBQ0UsY0FBYyxZQUFZLEdBQVosQ0FBZCxFQUFnQyxLQUFoQyxJQUNBLE1BREEsR0FFQSxjQUFjLFdBQVcsR0FBWCxDQUFkLEVBQStCLEtBQS9CLENBRkEsQ0FWZ0M7Q0FBcEM7O0FBZ0JBLE9BQU8sT0FBUCxHQUFpQixHQUFqQiIsImZpbGUiOiJwYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUGFkZGluZyA9IHJlcXVpcmUoJy4vX2NyZWF0ZVBhZGRpbmcnKSxcbiAgICBzdHJpbmdTaXplID0gcmVxdWlyZSgnLi9fc3RyaW5nU2l6ZScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVDZWlsID0gTWF0aC5jZWlsLFxuICAgIG5hdGl2ZUZsb29yID0gTWF0aC5mbG9vcjtcblxuLyoqXG4gKiBQYWRzIGBzdHJpbmdgIG9uIHRoZSBsZWZ0IGFuZCByaWdodCBzaWRlcyBpZiBpdCdzIHNob3J0ZXIgdGhhbiBgbGVuZ3RoYC5cbiAqIFBhZGRpbmcgY2hhcmFjdGVycyBhcmUgdHJ1bmNhdGVkIGlmIHRoZXkgY2FuJ3QgYmUgZXZlbmx5IGRpdmlkZWQgYnkgYGxlbmd0aGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gcGFkLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9MF0gVGhlIHBhZGRpbmcgbGVuZ3RoLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFycz0nICddIFRoZSBzdHJpbmcgdXNlZCBhcyBwYWRkaW5nLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcGFkZGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5wYWQoJ2FiYycsIDgpO1xuICogLy8gPT4gJyAgYWJjICAgJ1xuICpcbiAqIF8ucGFkKCdhYmMnLCA4LCAnXy0nKTtcbiAqIC8vID0+ICdfLWFiY18tXydcbiAqXG4gKiBfLnBhZCgnYWJjJywgMyk7XG4gKiAvLyA9PiAnYWJjJ1xuICovXG5mdW5jdGlvbiBwYWQoc3RyaW5nLCBsZW5ndGgsIGNoYXJzKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIGxlbmd0aCA9IHRvSW50ZWdlcihsZW5ndGgpO1xuXG4gIHZhciBzdHJMZW5ndGggPSBsZW5ndGggPyBzdHJpbmdTaXplKHN0cmluZykgOiAwO1xuICBpZiAoIWxlbmd0aCB8fCBzdHJMZW5ndGggPj0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfVxuICB2YXIgbWlkID0gKGxlbmd0aCAtIHN0ckxlbmd0aCkgLyAyO1xuICByZXR1cm4gKFxuICAgIGNyZWF0ZVBhZGRpbmcobmF0aXZlRmxvb3IobWlkKSwgY2hhcnMpICtcbiAgICBzdHJpbmcgK1xuICAgIGNyZWF0ZVBhZGRpbmcobmF0aXZlQ2VpbChtaWQpLCBjaGFycylcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYWQ7XG4iXX0=