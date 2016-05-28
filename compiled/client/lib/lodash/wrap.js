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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxVQUFVLFFBQVEsV0FBUixDQUFWOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkosU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQixPQUFyQixFQUE4QjtBQUM1QixZQUFVLFdBQVcsSUFBWCxHQUFrQixRQUFsQixHQUE2QixPQUE3QixDQURrQjtBQUU1QixTQUFPLFFBQVEsT0FBUixFQUFpQixLQUFqQixDQUFQLENBRjRCO0NBQTlCOztBQUtBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJ3cmFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIHBhcnRpYWwgPSByZXF1aXJlKCcuL3BhcnRpYWwnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwcm92aWRlcyBgdmFsdWVgIHRvIHRoZSB3cmFwcGVyIGZ1bmN0aW9uIGFzIGl0c1xuICogZmlyc3QgYXJndW1lbnQuIEFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZnVuY3Rpb24gYXJlXG4gKiBhcHBlbmRlZCB0byB0aG9zZSBwcm92aWRlZCB0byB0aGUgd3JhcHBlciBmdW5jdGlvbi4gVGhlIHdyYXBwZXIgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3dyYXBwZXI9aWRlbnRpdHldIFRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBwID0gXy53cmFwKF8uZXNjYXBlLCBmdW5jdGlvbihmdW5jLCB0ZXh0KSB7XG4gKiAgIHJldHVybiAnPHA+JyArIGZ1bmModGV4dCkgKyAnPC9wPic7XG4gKiB9KTtcbiAqXG4gKiBwKCdmcmVkLCBiYXJuZXksICYgcGViYmxlcycpO1xuICogLy8gPT4gJzxwPmZyZWQsIGJhcm5leSwgJmFtcDsgcGViYmxlczwvcD4nXG4gKi9cbmZ1bmN0aW9uIHdyYXAodmFsdWUsIHdyYXBwZXIpIHtcbiAgd3JhcHBlciA9IHdyYXBwZXIgPT0gbnVsbCA/IGlkZW50aXR5IDogd3JhcHBlcjtcbiAgcmV0dXJuIHBhcnRpYWwod3JhcHBlciwgdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXA7XG4iXX0=