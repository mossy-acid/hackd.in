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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JhbmRvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7SUFDSSxpQkFBaUIsUUFBUSxtQkFBUixDQURyQjtJQUVJLFdBQVcsUUFBUSxZQUFSLENBRmY7OztBQUtBLElBQUksaUJBQWlCLFVBQXJCOzs7QUFHQSxJQUFJLFlBQVksS0FBSyxHQUFyQjtJQUNJLGVBQWUsS0FBSyxNQUR4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixRQUE5QixFQUF3QztBQUN0QyxNQUFJLFlBQVksT0FBTyxRQUFQLElBQW1CLFNBQS9CLElBQTRDLGVBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixRQUE3QixDQUFoRCxFQUF3RjtBQUN0RixZQUFRLFdBQVcsU0FBbkI7QUFDRDtBQUNELE1BQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixRQUFJLE9BQU8sS0FBUCxJQUFnQixTQUFwQixFQUErQjtBQUM3QixpQkFBVyxLQUFYO0FBQ0EsY0FBUSxTQUFSO0FBQ0QsS0FIRCxNQUlLLElBQUksT0FBTyxLQUFQLElBQWdCLFNBQXBCLEVBQStCO0FBQ2xDLGlCQUFXLEtBQVg7QUFDQSxjQUFRLFNBQVI7QUFDRDtBQUNGO0FBQ0QsTUFBSSxVQUFVLFNBQVYsSUFBdUIsVUFBVSxTQUFyQyxFQUFnRDtBQUM5QyxZQUFRLENBQVI7QUFDQSxZQUFRLENBQVI7QUFDRCxHQUhELE1BSUs7QUFDSCxZQUFRLFNBQVMsS0FBVCxLQUFtQixDQUEzQjtBQUNBLFFBQUksVUFBVSxTQUFkLEVBQXlCO0FBQ3ZCLGNBQVEsS0FBUjtBQUNBLGNBQVEsQ0FBUjtBQUNELEtBSEQsTUFHTztBQUNMLGNBQVEsU0FBUyxLQUFULEtBQW1CLENBQTNCO0FBQ0Q7QUFDRjtBQUNELE1BQUksUUFBUSxLQUFaLEVBQW1CO0FBQ2pCLFFBQUksT0FBTyxLQUFYO0FBQ0EsWUFBUSxLQUFSO0FBQ0EsWUFBUSxJQUFSO0FBQ0Q7QUFDRCxNQUFJLFlBQVksUUFBUSxDQUFwQixJQUF5QixRQUFRLENBQXJDLEVBQXdDO0FBQ3RDLFFBQUksT0FBTyxjQUFYO0FBQ0EsV0FBTyxVQUFVLFFBQVMsUUFBUSxRQUFRLEtBQVIsR0FBZ0IsZUFBZSxTQUFTLENBQUMsT0FBTyxFQUFSLEVBQVksTUFBWixHQUFxQixDQUE5QixDQUFmLENBQXhCLENBQW5CLEVBQStGLEtBQS9GLENBQVA7QUFDRDtBQUNELFNBQU8sV0FBVyxLQUFYLEVBQWtCLEtBQWxCLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoicmFuZG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCcuL19iYXNlUmFuZG9tJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUZsb2F0ID0gcGFyc2VGbG9hdDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluLFxuICAgIG5hdGl2ZVJhbmRvbSA9IE1hdGgucmFuZG9tO1xuXG4vKipcbiAqIFByb2R1Y2VzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIHRoZSBpbmNsdXNpdmUgYGxvd2VyYCBhbmQgYHVwcGVyYCBib3VuZHMuXG4gKiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwcm92aWRlZCBhIG51bWJlciBiZXR3ZWVuIGAwYCBhbmQgdGhlIGdpdmVuIG51bWJlclxuICogaXMgcmV0dXJuZWQuIElmIGBmbG9hdGluZ2AgaXMgYHRydWVgLCBvciBlaXRoZXIgYGxvd2VyYCBvciBgdXBwZXJgIGFyZVxuICogZmxvYXRzLCBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBpcyByZXR1cm5lZCBpbnN0ZWFkIG9mIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIEphdmFTY3JpcHQgZm9sbG93cyB0aGUgSUVFRS03NTQgc3RhbmRhcmQgZm9yIHJlc29sdmluZ1xuICogZmxvYXRpbmctcG9pbnQgdmFsdWVzIHdoaWNoIGNhbiBwcm9kdWNlIHVuZXhwZWN0ZWQgcmVzdWx0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNy4wXG4gKiBAY2F0ZWdvcnkgTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gW2xvd2VyPTBdIFRoZSBsb3dlciBib3VuZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbdXBwZXI9MV0gVGhlIHVwcGVyIGJvdW5kLlxuICogQHBhcmFtIHtib29sZWFufSBbZmxvYXRpbmddIFNwZWNpZnkgcmV0dXJuaW5nIGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcmFuZG9tIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5yYW5kb20oMCwgNSk7XG4gKiAvLyA9PiBhbiBpbnRlZ2VyIGJldHdlZW4gMCBhbmQgNVxuICpcbiAqIF8ucmFuZG9tKDUpO1xuICogLy8gPT4gYWxzbyBhbiBpbnRlZ2VyIGJldHdlZW4gMCBhbmQgNVxuICpcbiAqIF8ucmFuZG9tKDUsIHRydWUpO1xuICogLy8gPT4gYSBmbG9hdGluZy1wb2ludCBudW1iZXIgYmV0d2VlbiAwIGFuZCA1XG4gKlxuICogXy5yYW5kb20oMS4yLCA1LjIpO1xuICogLy8gPT4gYSBmbG9hdGluZy1wb2ludCBudW1iZXIgYmV0d2VlbiAxLjIgYW5kIDUuMlxuICovXG5mdW5jdGlvbiByYW5kb20obG93ZXIsIHVwcGVyLCBmbG9hdGluZykge1xuICBpZiAoZmxvYXRpbmcgJiYgdHlwZW9mIGZsb2F0aW5nICE9ICdib29sZWFuJyAmJiBpc0l0ZXJhdGVlQ2FsbChsb3dlciwgdXBwZXIsIGZsb2F0aW5nKSkge1xuICAgIHVwcGVyID0gZmxvYXRpbmcgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGZsb2F0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIHVwcGVyID09ICdib29sZWFuJykge1xuICAgICAgZmxvYXRpbmcgPSB1cHBlcjtcbiAgICAgIHVwcGVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbG93ZXIgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBmbG9hdGluZyA9IGxvd2VyO1xuICAgICAgbG93ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIGlmIChsb3dlciA9PT0gdW5kZWZpbmVkICYmIHVwcGVyID09PSB1bmRlZmluZWQpIHtcbiAgICBsb3dlciA9IDA7XG4gICAgdXBwZXIgPSAxO1xuICB9XG4gIGVsc2Uge1xuICAgIGxvd2VyID0gdG9OdW1iZXIobG93ZXIpIHx8IDA7XG4gICAgaWYgKHVwcGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgICBsb3dlciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwcGVyID0gdG9OdW1iZXIodXBwZXIpIHx8IDA7XG4gICAgfVxuICB9XG4gIGlmIChsb3dlciA+IHVwcGVyKSB7XG4gICAgdmFyIHRlbXAgPSBsb3dlcjtcbiAgICBsb3dlciA9IHVwcGVyO1xuICAgIHVwcGVyID0gdGVtcDtcbiAgfVxuICBpZiAoZmxvYXRpbmcgfHwgbG93ZXIgJSAxIHx8IHVwcGVyICUgMSkge1xuICAgIHZhciByYW5kID0gbmF0aXZlUmFuZG9tKCk7XG4gICAgcmV0dXJuIG5hdGl2ZU1pbihsb3dlciArIChyYW5kICogKHVwcGVyIC0gbG93ZXIgKyBmcmVlUGFyc2VGbG9hdCgnMWUtJyArICgocmFuZCArICcnKS5sZW5ndGggLSAxKSkpKSwgdXBwZXIpO1xuICB9XG4gIHJldHVybiBiYXNlUmFuZG9tKGxvd2VyLCB1cHBlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZG9tO1xuIl19