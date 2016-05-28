'use strict';

var baseRandom = require('./_baseRandom'),
    isIterateeCall = require('./_isIterateeCall'),
    toNumber = require('./toNumber');

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min,
    nativeRandom = Math.random;

/**
 * Produces a random number between the inclusive `lower` and `upper` bounds.
 * If only one argument is provided a number between `0` and the given number
 * is returned. If `floating` is `true`, or either `lower` or `upper` are
 * floats, a floating-point number is returned instead of an integer.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Number
 * @param {number} [lower=0] The lower bound.
 * @param {number} [upper=1] The upper bound.
 * @param {boolean} [floating] Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(lower, upper, floating) {
  if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
    upper = floating = undefined;
  }
  if (floating === undefined) {
    if (typeof upper == 'boolean') {
      floating = upper;
      upper = undefined;
    } else if (typeof lower == 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }
  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  } else {
    lower = toNumber(lower) || 0;
    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toNumber(upper) || 0;
    }
  }
  if (lower > upper) {
    var temp = lower;
    lower = upper;
    upper = temp;
  }
  if (floating || lower % 1 || upper % 1) {
    var rand = nativeRandom();
    return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
  }
  return baseRandom(lower, upper);
}

module.exports = random;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JhbmRvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7O0FBR0osSUFBSSxpQkFBaUIsVUFBakI7OztBQUdKLElBQUksWUFBWSxLQUFLLEdBQUw7SUFDWixlQUFlLEtBQUssTUFBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNuQixTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdEMsTUFBSSxZQUFZLE9BQU8sUUFBUCxJQUFtQixTQUFuQixJQUFnQyxlQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsUUFBN0IsQ0FBNUMsRUFBb0Y7QUFDdEYsWUFBUSxXQUFXLFNBQVgsQ0FEOEU7R0FBeEY7QUFHQSxNQUFJLGFBQWEsU0FBYixFQUF3QjtBQUMxQixRQUFJLE9BQU8sS0FBUCxJQUFnQixTQUFoQixFQUEyQjtBQUM3QixpQkFBVyxLQUFYLENBRDZCO0FBRTdCLGNBQVEsU0FBUixDQUY2QjtLQUEvQixNQUlLLElBQUksT0FBTyxLQUFQLElBQWdCLFNBQWhCLEVBQTJCO0FBQ2xDLGlCQUFXLEtBQVgsQ0FEa0M7QUFFbEMsY0FBUSxTQUFSLENBRmtDO0tBQS9CO0dBTFA7QUFVQSxNQUFJLFVBQVUsU0FBVixJQUF1QixVQUFVLFNBQVYsRUFBcUI7QUFDOUMsWUFBUSxDQUFSLENBRDhDO0FBRTlDLFlBQVEsQ0FBUixDQUY4QztHQUFoRCxNQUlLO0FBQ0gsWUFBUSxTQUFTLEtBQVQsS0FBbUIsQ0FBbkIsQ0FETDtBQUVILFFBQUksVUFBVSxTQUFWLEVBQXFCO0FBQ3ZCLGNBQVEsS0FBUixDQUR1QjtBQUV2QixjQUFRLENBQVIsQ0FGdUI7S0FBekIsTUFHTztBQUNMLGNBQVEsU0FBUyxLQUFULEtBQW1CLENBQW5CLENBREg7S0FIUDtHQU5GO0FBYUEsTUFBSSxRQUFRLEtBQVIsRUFBZTtBQUNqQixRQUFJLE9BQU8sS0FBUCxDQURhO0FBRWpCLFlBQVEsS0FBUixDQUZpQjtBQUdqQixZQUFRLElBQVIsQ0FIaUI7R0FBbkI7QUFLQSxNQUFJLFlBQVksUUFBUSxDQUFSLElBQWEsUUFBUSxDQUFSLEVBQVc7QUFDdEMsUUFBSSxPQUFPLGNBQVAsQ0FEa0M7QUFFdEMsV0FBTyxVQUFVLFFBQVMsUUFBUSxRQUFRLEtBQVIsR0FBZ0IsZUFBZSxTQUFTLENBQUMsT0FBTyxFQUFQLENBQUQsQ0FBWSxNQUFaLEdBQXFCLENBQXJCLENBQVQsQ0FBL0IsQ0FBUixFQUE0RSxLQUEvRixDQUFQLENBRnNDO0dBQXhDO0FBSUEsU0FBTyxXQUFXLEtBQVgsRUFBa0IsS0FBbEIsQ0FBUCxDQXBDc0M7Q0FBeEM7O0FBdUNBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJyYW5kb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVJhbmRvbSA9IHJlcXVpcmUoJy4vX2Jhc2VSYW5kb20nKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlRmxvYXQgPSBwYXJzZUZsb2F0O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW4sXG4gICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbi8qKlxuICogUHJvZHVjZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdGhlIGluY2x1c2l2ZSBgbG93ZXJgIGFuZCBgdXBwZXJgIGJvdW5kcy5cbiAqIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkIGEgbnVtYmVyIGJldHdlZW4gYDBgIGFuZCB0aGUgZ2l2ZW4gbnVtYmVyXG4gKiBpcyByZXR1cm5lZC4gSWYgYGZsb2F0aW5nYCBpcyBgdHJ1ZWAsIG9yIGVpdGhlciBgbG93ZXJgIG9yIGB1cHBlcmAgYXJlXG4gKiBmbG9hdHMsIGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGlzIHJldHVybmVkIGluc3RlYWQgb2YgYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogSmF2YVNjcmlwdCBmb2xsb3dzIHRoZSBJRUVFLTc1NCBzdGFuZGFyZCBmb3IgcmVzb2x2aW5nXG4gKiBmbG9hdGluZy1wb2ludCB2YWx1ZXMgd2hpY2ggY2FuIHByb2R1Y2UgdW5leHBlY3RlZCByZXN1bHRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC43LjBcbiAqIEBjYXRlZ29yeSBOdW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbG93ZXI9MF0gVGhlIGxvd2VyIGJvdW5kLlxuICogQHBhcmFtIHtudW1iZXJ9IFt1cHBlcj0xXSBUaGUgdXBwZXIgYm91bmQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmbG9hdGluZ10gU3BlY2lmeSByZXR1cm5pbmcgYSBmbG9hdGluZy1wb2ludCBudW1iZXIuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByYW5kb20gbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJhbmRvbSgwLCA1KTtcbiAqIC8vID0+IGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gKlxuICogXy5yYW5kb20oNSk7XG4gKiAvLyA9PiBhbHNvIGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gKlxuICogXy5yYW5kb20oNSwgdHJ1ZSk7XG4gKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDAgYW5kIDVcbiAqXG4gKiBfLnJhbmRvbSgxLjIsIDUuMik7XG4gKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDEuMiBhbmQgNS4yXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbShsb3dlciwgdXBwZXIsIGZsb2F0aW5nKSB7XG4gIGlmIChmbG9hdGluZyAmJiB0eXBlb2YgZmxvYXRpbmcgIT0gJ2Jvb2xlYW4nICYmIGlzSXRlcmF0ZWVDYWxsKGxvd2VyLCB1cHBlciwgZmxvYXRpbmcpKSB7XG4gICAgdXBwZXIgPSBmbG9hdGluZyA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZmxvYXRpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgdXBwZXIgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBmbG9hdGluZyA9IHVwcGVyO1xuICAgICAgdXBwZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsb3dlciA9PSAnYm9vbGVhbicpIHtcbiAgICAgIGZsb2F0aW5nID0gbG93ZXI7XG4gICAgICBsb3dlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgaWYgKGxvd2VyID09PSB1bmRlZmluZWQgJiYgdXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIGxvd2VyID0gMDtcbiAgICB1cHBlciA9IDE7XG4gIH1cbiAgZWxzZSB7XG4gICAgbG93ZXIgPSB0b051bWJlcihsb3dlcikgfHwgMDtcbiAgICBpZiAodXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBwZXIgPSB0b051bWJlcih1cHBlcikgfHwgMDtcbiAgICB9XG4gIH1cbiAgaWYgKGxvd2VyID4gdXBwZXIpIHtcbiAgICB2YXIgdGVtcCA9IGxvd2VyO1xuICAgIGxvd2VyID0gdXBwZXI7XG4gICAgdXBwZXIgPSB0ZW1wO1xuICB9XG4gIGlmIChmbG9hdGluZyB8fCBsb3dlciAlIDEgfHwgdXBwZXIgJSAxKSB7XG4gICAgdmFyIHJhbmQgPSBuYXRpdmVSYW5kb20oKTtcbiAgICByZXR1cm4gbmF0aXZlTWluKGxvd2VyICsgKHJhbmQgKiAodXBwZXIgLSBsb3dlciArIGZyZWVQYXJzZUZsb2F0KCcxZS0nICsgKChyYW5kICsgJycpLmxlbmd0aCAtIDEpKSkpLCB1cHBlcik7XG4gIH1cbiAgcmV0dXJuIGJhc2VSYW5kb20obG93ZXIsIHVwcGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYW5kb207XG4iXX0=