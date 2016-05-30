'use strict';

var identity = require('./identity'),
    partial = require('./partial');

/**
 * Creates a function that provides `value` to the wrapper function as its
 * first argument. Any additional arguments provided to the function are
 * appended to those provided to the wrapper function. The wrapper is invoked
 * with the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {*} value The value to wrap.
 * @param {Function} [wrapper=identity] The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 */
function wrap(value, wrapper) {
  wrapper = wrapper == null ? identity : wrapper;
  return partial(wrapper, value);
}

module.exports = wrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7SUFDSSxVQUFVLFFBQVEsV0FBUixDQURkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQixPQUFyQixFQUE4QjtBQUM1QixZQUFVLFdBQVcsSUFBWCxHQUFrQixRQUFsQixHQUE2QixPQUF2QztBQUNBLFNBQU8sUUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoid3JhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBwYXJ0aWFsID0gcmVxdWlyZSgnLi9wYXJ0aWFsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcHJvdmlkZXMgYHZhbHVlYCB0byB0aGUgd3JhcHBlciBmdW5jdGlvbiBhcyBpdHNcbiAqIGZpcnN0IGFyZ3VtZW50LiBBbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGZ1bmN0aW9uIGFyZVxuICogYXBwZW5kZWQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt3cmFwcGVyPWlkZW50aXR5XSBUaGUgd3JhcHBlciBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgcCA9IF8ud3JhcChfLmVzY2FwZSwgZnVuY3Rpb24oZnVuYywgdGV4dCkge1xuICogICByZXR1cm4gJzxwPicgKyBmdW5jKHRleHQpICsgJzwvcD4nO1xuICogfSk7XG4gKlxuICogcCgnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnKTtcbiAqIC8vID0+ICc8cD5mcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXM8L3A+J1xuICovXG5mdW5jdGlvbiB3cmFwKHZhbHVlLCB3cmFwcGVyKSB7XG4gIHdyYXBwZXIgPSB3cmFwcGVyID09IG51bGwgPyBpZGVudGl0eSA6IHdyYXBwZXI7XG4gIHJldHVybiBwYXJ0aWFsKHdyYXBwZXIsIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwO1xuIl19