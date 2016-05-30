'use strict';

var baseNth = require('./_baseNth'),
    rest = require('./rest'),
    toInteger = require('./toInteger');

/**
 * Creates a function that gets the argument at index `n`. If `n` is negative,
 * the nth argument from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [n=0] The index of the argument to return.
 * @returns {Function} Returns the new pass-thru function.
 * @example
 *
 * var func = _.nthArg(1);
 * func('a', 'b', 'c', 'd');
 * // => 'b'
 *
 * var func = _.nthArg(-2);
 * func('a', 'b', 'c', 'd');
 * // => 'c'
 */
function nthArg(n) {
  n = toInteger(n);
  return rest(function (args) {
    return baseNth(args, n);
  });
}

module.exports = nthArg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL250aEFyZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtJQUNJLE9BQU8sUUFBUSxRQUFSLENBRFg7SUFFSSxZQUFZLFFBQVEsYUFBUixDQUZoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUI7QUFDakIsTUFBSSxVQUFVLENBQVYsQ0FBSjtBQUNBLFNBQU8sS0FBSyxVQUFTLElBQVQsRUFBZTtBQUN6QixXQUFPLFFBQVEsSUFBUixFQUFjLENBQWQsQ0FBUDtBQUNELEdBRk0sQ0FBUDtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJudGhBcmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZU50aCA9IHJlcXVpcmUoJy4vX2Jhc2VOdGgnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0JyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBnZXRzIHRoZSBhcmd1bWVudCBhdCBpbmRleCBgbmAuIElmIGBuYCBpcyBuZWdhdGl2ZSxcbiAqIHRoZSBudGggYXJndW1lbnQgZnJvbSB0aGUgZW5kIGlzIHJldHVybmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge251bWJlcn0gW249MF0gVGhlIGluZGV4IG9mIHRoZSBhcmd1bWVudCB0byByZXR1cm4uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBwYXNzLXRocnUgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBmdW5jID0gXy5udGhBcmcoMSk7XG4gKiBmdW5jKCdhJywgJ2InLCAnYycsICdkJyk7XG4gKiAvLyA9PiAnYidcbiAqXG4gKiB2YXIgZnVuYyA9IF8ubnRoQXJnKC0yKTtcbiAqIGZ1bmMoJ2EnLCAnYicsICdjJywgJ2QnKTtcbiAqIC8vID0+ICdjJ1xuICovXG5mdW5jdGlvbiBudGhBcmcobikge1xuICBuID0gdG9JbnRlZ2VyKG4pO1xuICByZXR1cm4gcmVzdChmdW5jdGlvbihhcmdzKSB7XG4gICAgcmV0dXJuIGJhc2VOdGgoYXJncywgbik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG50aEFyZztcbiJdfQ==