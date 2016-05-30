'use strict';

var baseDelay = require('./_baseDelay'),
    rest = require('./rest');

/**
 * Defers invoking the `func` until the current call stack has cleared. Any
 * additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to defer.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) {
 *   console.log(text);
 * }, 'deferred');
 * // => Logs 'deferred' after one or more milliseconds.
 */
var defer = rest(function (func, args) {
  return baseDelay(func, 1, args);
});

module.exports = defer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RlZmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkosSUFBSSxRQUFRLEtBQUssVUFBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtBQUNwQyxTQUFPLFVBQVUsSUFBVixFQUFnQixDQUFoQixFQUFtQixJQUFuQixDQUFQLENBRG9DO0NBQXJCLENBQWI7O0FBSUosT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImRlZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VEZWxheSA9IHJlcXVpcmUoJy4vX2Jhc2VEZWxheScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBEZWZlcnMgaW52b2tpbmcgdGhlIGBmdW5jYCB1bnRpbCB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhcyBjbGVhcmVkLiBBbnlcbiAqIGFkZGl0aW9uYWwgYXJndW1lbnRzIGFyZSBwcm92aWRlZCB0byBgZnVuY2Agd2hlbiBpdCdzIGludm9rZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWZlci5cbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXIgaWQuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24odGV4dCkge1xuICogICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAqIH0sICdkZWZlcnJlZCcpO1xuICogLy8gPT4gTG9ncyAnZGVmZXJyZWQnIGFmdGVyIG9uZSBvciBtb3JlIG1pbGxpc2Vjb25kcy5cbiAqL1xudmFyIGRlZmVyID0gcmVzdChmdW5jdGlvbihmdW5jLCBhcmdzKSB7XG4gIHJldHVybiBiYXNlRGVsYXkoZnVuYywgMSwgYXJncyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZlcjtcbiJdfQ==