'use strict';

var baseDelay = require('./_baseDelay'),
    rest = require('./rest'),
    toNumber = require('./toNumber');

/**
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) {
 *   console.log(text);
 * }, 1000, 'later');
 * // => Logs 'later' after one second.
 */
var delay = rest(function (func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});

module.exports = delay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RlbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLE9BQU8sUUFBUSxRQUFSLENBRFg7SUFFSSxXQUFXLFFBQVEsWUFBUixDQUZmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBSSxRQUFRLEtBQUssVUFBUyxJQUFULEVBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtBQUMxQyxTQUFPLFVBQVUsSUFBVixFQUFnQixTQUFTLElBQVQsS0FBa0IsQ0FBbEMsRUFBcUMsSUFBckMsQ0FBUDtBQUNELENBRlcsQ0FBWjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZURlbGF5ID0gcmVxdWlyZSgnLi9fYmFzZURlbGF5JyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKipcbiAqIEludm9rZXMgYGZ1bmNgIGFmdGVyIGB3YWl0YCBtaWxsaXNlY29uZHMuIEFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcmVcbiAqIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0J3MgaW52b2tlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlbGF5LlxuICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgaW52b2NhdGlvbi5cbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXIgaWQuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVsYXkoZnVuY3Rpb24odGV4dCkge1xuICogICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAqIH0sIDEwMDAsICdsYXRlcicpO1xuICogLy8gPT4gTG9ncyAnbGF0ZXInIGFmdGVyIG9uZSBzZWNvbmQuXG4gKi9cbnZhciBkZWxheSA9IHJlc3QoZnVuY3Rpb24oZnVuYywgd2FpdCwgYXJncykge1xuICByZXR1cm4gYmFzZURlbGF5KGZ1bmMsIHRvTnVtYmVyKHdhaXQpIHx8IDAsIGFyZ3MpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVsYXk7XG4iXX0=