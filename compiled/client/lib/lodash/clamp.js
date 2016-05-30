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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NsYW1wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJKLFNBQVMsS0FBVCxDQUFlLE1BQWYsRUFBdUIsS0FBdkIsRUFBOEIsS0FBOUIsRUFBcUM7QUFDbkMsTUFBSSxVQUFVLFNBQVYsRUFBcUI7QUFDdkIsWUFBUSxLQUFSLENBRHVCO0FBRXZCLFlBQVEsU0FBUixDQUZ1QjtHQUF6QjtBQUlBLE1BQUksVUFBVSxTQUFWLEVBQXFCO0FBQ3ZCLFlBQVEsU0FBUyxLQUFULENBQVIsQ0FEdUI7QUFFdkIsWUFBUSxVQUFVLEtBQVYsR0FBa0IsS0FBbEIsR0FBMEIsQ0FBMUIsQ0FGZTtHQUF6QjtBQUlBLE1BQUksVUFBVSxTQUFWLEVBQXFCO0FBQ3ZCLFlBQVEsU0FBUyxLQUFULENBQVIsQ0FEdUI7QUFFdkIsWUFBUSxVQUFVLEtBQVYsR0FBa0IsS0FBbEIsR0FBMEIsQ0FBMUIsQ0FGZTtHQUF6QjtBQUlBLFNBQU8sVUFBVSxTQUFTLE1BQVQsQ0FBVixFQUE0QixLQUE1QixFQUFtQyxLQUFuQyxDQUFQLENBYm1DO0NBQXJDOztBQWdCQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiY2xhbXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsYW1wID0gcmVxdWlyZSgnLi9fYmFzZUNsYW1wJyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKlxuICogQ2xhbXBzIGBudW1iZXJgIHdpdGhpbiB0aGUgaW5jbHVzaXZlIGBsb3dlcmAgYW5kIGB1cHBlcmAgYm91bmRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBOdW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byBjbGFtcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbG93ZXJdIFRoZSBsb3dlciBib3VuZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB1cHBlciBUaGUgdXBwZXIgYm91bmQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjbGFtcGVkIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5jbGFtcCgtMTAsIC01LCA1KTtcbiAqIC8vID0+IC01XG4gKlxuICogXy5jbGFtcCgxMCwgLTUsIDUpO1xuICogLy8gPT4gNVxuICovXG5mdW5jdGlvbiBjbGFtcChudW1iZXIsIGxvd2VyLCB1cHBlcikge1xuICBpZiAodXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHVwcGVyID0gbG93ZXI7XG4gICAgbG93ZXIgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHVwcGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB1cHBlciA9IHRvTnVtYmVyKHVwcGVyKTtcbiAgICB1cHBlciA9IHVwcGVyID09PSB1cHBlciA/IHVwcGVyIDogMDtcbiAgfVxuICBpZiAobG93ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGxvd2VyID0gdG9OdW1iZXIobG93ZXIpO1xuICAgIGxvd2VyID0gbG93ZXIgPT09IGxvd2VyID8gbG93ZXIgOiAwO1xuICB9XG4gIHJldHVybiBiYXNlQ2xhbXAodG9OdW1iZXIobnVtYmVyKSwgbG93ZXIsIHVwcGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFtcDtcbiJdfQ==