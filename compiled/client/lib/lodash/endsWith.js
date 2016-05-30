'use strict';

var baseClamp = require('./_baseClamp'),
    baseToString = require('./_baseToString'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to search.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);

  var length = string.length;
  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);

  position -= target.length;
  return position >= 0 && string.indexOf(target, position) == position;
}

module.exports = endsWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2VuZHNXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjtJQUVJLFlBQVksUUFBUSxhQUFSLENBRmhCO0lBR0ksV0FBVyxRQUFRLFlBQVIsQ0FIZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsTUFBMUIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDMUMsV0FBUyxTQUFTLE1BQVQsQ0FBVDtBQUNBLFdBQVMsYUFBYSxNQUFiLENBQVQ7O0FBRUEsTUFBSSxTQUFTLE9BQU8sTUFBcEI7QUFDQSxhQUFXLGFBQWEsU0FBYixHQUNQLE1BRE8sR0FFUCxVQUFVLFVBQVUsUUFBVixDQUFWLEVBQStCLENBQS9CLEVBQWtDLE1BQWxDLENBRko7O0FBSUEsY0FBWSxPQUFPLE1BQW5CO0FBQ0EsU0FBTyxZQUFZLENBQVosSUFBaUIsT0FBTyxPQUFQLENBQWUsTUFBZixFQUF1QixRQUF2QixLQUFvQyxRQUE1RDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJlbmRzV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQ2xhbXAgPSByZXF1aXJlKCcuL19iYXNlQ2xhbXAnKSxcbiAgICBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgc3RyaW5nYCBlbmRzIHdpdGggdGhlIGdpdmVuIHRhcmdldCBzdHJpbmcuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtzdHJpbmd9IFt0YXJnZXRdIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbcG9zaXRpb249c3RyaW5nLmxlbmd0aF0gVGhlIHBvc2l0aW9uIHRvIHNlYXJjaCB1cCB0by5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgc3RyaW5nYCBlbmRzIHdpdGggYHRhcmdldGAsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmVuZHNXaXRoKCdhYmMnLCAnYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZW5kc1dpdGgoJ2FiYycsICdiJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZW5kc1dpdGgoJ2FiYycsICdiJywgMik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVuZHNXaXRoKHN0cmluZywgdGFyZ2V0LCBwb3NpdGlvbikge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICB0YXJnZXQgPSBiYXNlVG9TdHJpbmcodGFyZ2V0KTtcblxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgcG9zaXRpb24gPSBwb3NpdGlvbiA9PT0gdW5kZWZpbmVkXG4gICAgPyBsZW5ndGhcbiAgICA6IGJhc2VDbGFtcCh0b0ludGVnZXIocG9zaXRpb24pLCAwLCBsZW5ndGgpO1xuXG4gIHBvc2l0aW9uIC09IHRhcmdldC5sZW5ndGg7XG4gIHJldHVybiBwb3NpdGlvbiA+PSAwICYmIHN0cmluZy5pbmRleE9mKHRhcmdldCwgcG9zaXRpb24pID09IHBvc2l0aW9uO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVuZHNXaXRoO1xuIl19