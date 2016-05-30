'use strict';

var baseClamp = require('./_baseClamp'),
    toNumber = require('./toNumber');

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}

module.exports = clamp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NsYW1wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLFdBQVcsUUFBUSxZQUFSLENBRGY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxTQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCLEtBQXZCLEVBQThCLEtBQTlCLEVBQXFDO0FBQ25DLE1BQUksVUFBVSxTQUFkLEVBQXlCO0FBQ3ZCLFlBQVEsS0FBUjtBQUNBLFlBQVEsU0FBUjtBQUNEO0FBQ0QsTUFBSSxVQUFVLFNBQWQsRUFBeUI7QUFDdkIsWUFBUSxTQUFTLEtBQVQsQ0FBUjtBQUNBLFlBQVEsVUFBVSxLQUFWLEdBQWtCLEtBQWxCLEdBQTBCLENBQWxDO0FBQ0Q7QUFDRCxNQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUN2QixZQUFRLFNBQVMsS0FBVCxDQUFSO0FBQ0EsWUFBUSxVQUFVLEtBQVYsR0FBa0IsS0FBbEIsR0FBMEIsQ0FBbEM7QUFDRDtBQUNELFNBQU8sVUFBVSxTQUFTLE1BQVQsQ0FBVixFQUE0QixLQUE1QixFQUFtQyxLQUFuQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImNsYW1wLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbGFtcCA9IHJlcXVpcmUoJy4vX2Jhc2VDbGFtcCcpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKipcbiAqIENsYW1wcyBgbnVtYmVyYCB3aXRoaW4gdGhlIGluY2x1c2l2ZSBgbG93ZXJgIGFuZCBgdXBwZXJgIGJvdW5kcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gY2xhbXAuXG4gKiBAcGFyYW0ge251bWJlcn0gW2xvd2VyXSBUaGUgbG93ZXIgYm91bmQuXG4gKiBAcGFyYW0ge251bWJlcn0gdXBwZXIgVGhlIHVwcGVyIGJvdW5kLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY2xhbXBlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2xhbXAoLTEwLCAtNSwgNSk7XG4gKiAvLyA9PiAtNVxuICpcbiAqIF8uY2xhbXAoMTAsIC01LCA1KTtcbiAqIC8vID0+IDVcbiAqL1xuZnVuY3Rpb24gY2xhbXAobnVtYmVyLCBsb3dlciwgdXBwZXIpIHtcbiAgaWYgKHVwcGVyID09PSB1bmRlZmluZWQpIHtcbiAgICB1cHBlciA9IGxvd2VyO1xuICAgIGxvd2VyID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1cHBlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdXBwZXIgPSB0b051bWJlcih1cHBlcik7XG4gICAgdXBwZXIgPSB1cHBlciA9PT0gdXBwZXIgPyB1cHBlciA6IDA7XG4gIH1cbiAgaWYgKGxvd2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICBsb3dlciA9IHRvTnVtYmVyKGxvd2VyKTtcbiAgICBsb3dlciA9IGxvd2VyID09PSBsb3dlciA/IGxvd2VyIDogMDtcbiAgfVxuICByZXR1cm4gYmFzZUNsYW1wKHRvTnVtYmVyKG51bWJlciksIGxvd2VyLCB1cHBlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhbXA7XG4iXX0=