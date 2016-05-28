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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2VuZHNXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCSixTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsTUFBMUIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDMUMsV0FBUyxTQUFTLE1BQVQsQ0FBVCxDQUQwQztBQUUxQyxXQUFTLGFBQWEsTUFBYixDQUFULENBRjBDOztBQUkxQyxNQUFJLFNBQVMsT0FBTyxNQUFQLENBSjZCO0FBSzFDLGFBQVcsYUFBYSxTQUFiLEdBQ1AsTUFETyxHQUVQLFVBQVUsVUFBVSxRQUFWLENBQVYsRUFBK0IsQ0FBL0IsRUFBa0MsTUFBbEMsQ0FGTyxDQUwrQjs7QUFTMUMsY0FBWSxPQUFPLE1BQVAsQ0FUOEI7QUFVMUMsU0FBTyxZQUFZLENBQVosSUFBaUIsT0FBTyxPQUFQLENBQWUsTUFBZixFQUF1QixRQUF2QixLQUFvQyxRQUFwQyxDQVZrQjtDQUE1Qzs7QUFhQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiZW5kc1dpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsYW1wID0gcmVxdWlyZSgnLi9fYmFzZUNsYW1wJyksXG4gICAgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHN0cmluZ2AgZW5kcyB3aXRoIHRoZSBnaXZlbiB0YXJnZXQgc3RyaW5nLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbdGFyZ2V0XSBUaGUgc3RyaW5nIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gW3Bvc2l0aW9uPXN0cmluZy5sZW5ndGhdIFRoZSBwb3NpdGlvbiB0byBzZWFyY2ggdXAgdG8uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHN0cmluZ2AgZW5kcyB3aXRoIGB0YXJnZXRgLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lbmRzV2l0aCgnYWJjJywgJ2MnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVuZHNXaXRoKCdhYmMnLCAnYicpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVuZHNXaXRoKCdhYmMnLCAnYicsIDIpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlbmRzV2l0aChzdHJpbmcsIHRhcmdldCwgcG9zaXRpb24pIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgdGFyZ2V0ID0gYmFzZVRvU3RyaW5nKHRhcmdldCk7XG5cbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gIHBvc2l0aW9uID0gcG9zaXRpb24gPT09IHVuZGVmaW5lZFxuICAgID8gbGVuZ3RoXG4gICAgOiBiYXNlQ2xhbXAodG9JbnRlZ2VyKHBvc2l0aW9uKSwgMCwgbGVuZ3RoKTtcblxuICBwb3NpdGlvbiAtPSB0YXJnZXQubGVuZ3RoO1xuICByZXR1cm4gcG9zaXRpb24gPj0gMCAmJiBzdHJpbmcuaW5kZXhPZih0YXJnZXQsIHBvc2l0aW9uKSA9PSBwb3NpdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbmRzV2l0aDtcbiJdfQ==