'use strict';

var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTmFOLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQjs7OztBQUlwQixTQUFPLFNBQVMsS0FBVCxLQUFtQixTQUFTLENBQUMsS0FBcEM7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiaXNOYU4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNOdW1iZXIgPSByZXF1aXJlKCcuL2lzTnVtYmVyJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gKiBbYE51bWJlci5pc05hTmBdKGh0dHBzOi8vbWRuLmlvL051bWJlci9pc05hTikgYW5kIGlzIG5vdCB0aGUgc2FtZSBhc1xuICogZ2xvYmFsIFtgaXNOYU5gXShodHRwczovL21kbi5pby9pc05hTikgd2hpY2ggcmV0dXJucyBgdHJ1ZWAgZm9yXG4gKiBgdW5kZWZpbmVkYCBhbmQgb3RoZXIgbm9uLW51bWJlciB2YWx1ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hTihOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYU4obmV3IE51bWJlcihOYU4pKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBpc05hTih1bmRlZmluZWQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYU4odW5kZWZpbmVkKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XG4gIC8vIEFuIGBOYU5gIHByaW1pdGl2ZSBpcyB0aGUgb25seSB2YWx1ZSB0aGF0IGlzIG5vdCBlcXVhbCB0byBpdHNlbGYuXG4gIC8vIFBlcmZvcm0gdGhlIGB0b1N0cmluZ1RhZ2AgY2hlY2sgZmlyc3QgdG8gYXZvaWQgZXJyb3JzIHdpdGggc29tZVxuICAvLyBBY3RpdmVYIG9iamVjdHMgaW4gSUUuXG4gIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgIT0gK3ZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmFOO1xuIl19