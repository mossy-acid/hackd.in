'use strict';

var baseRepeat = require('./_baseRepeat'),
    isIterateeCall = require('./_isIterateeCall'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=1] The number of times to repeat the string.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */
function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }
  return baseRepeat(toString(string), n);
}

module.exports = repeat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JlcGVhdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7SUFDSSxpQkFBaUIsUUFBUSxtQkFBUixDQURyQjtJQUVJLFlBQVksUUFBUSxhQUFSLENBRmhCO0lBR0ksV0FBVyxRQUFRLFlBQVIsQ0FIZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixDQUF4QixFQUEyQixLQUEzQixFQUFrQztBQUNoQyxNQUFLLFFBQVEsZUFBZSxNQUFmLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCLENBQVIsR0FBMkMsTUFBTSxTQUF0RCxFQUFrRTtBQUNoRSxRQUFJLENBQUo7QUFDRCxHQUZELE1BRU87QUFDTCxRQUFJLFVBQVUsQ0FBVixDQUFKO0FBQ0Q7QUFDRCxTQUFPLFdBQVcsU0FBUyxNQUFULENBQVgsRUFBNkIsQ0FBN0IsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJyZXBlYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVJlcGVhdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXBlYXQnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBSZXBlYXRzIHRoZSBnaXZlbiBzdHJpbmcgYG5gIHRpbWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHJlcGVhdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdCB0aGUgc3RyaW5nLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJlcGVhdGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5yZXBlYXQoJyonLCAzKTtcbiAqIC8vID0+ICcqKionXG4gKlxuICogXy5yZXBlYXQoJ2FiYycsIDIpO1xuICogLy8gPT4gJ2FiY2FiYydcbiAqXG4gKiBfLnJlcGVhdCgnYWJjJywgMCk7XG4gKiAvLyA9PiAnJ1xuICovXG5mdW5jdGlvbiByZXBlYXQoc3RyaW5nLCBuLCBndWFyZCkge1xuICBpZiAoKGd1YXJkID8gaXNJdGVyYXRlZUNhbGwoc3RyaW5nLCBuLCBndWFyZCkgOiBuID09PSB1bmRlZmluZWQpKSB7XG4gICAgbiA9IDE7XG4gIH0gZWxzZSB7XG4gICAgbiA9IHRvSW50ZWdlcihuKTtcbiAgfVxuICByZXR1cm4gYmFzZVJlcGVhdCh0b1N0cmluZyhzdHJpbmcpLCBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXBlYXQ7XG4iXX0=