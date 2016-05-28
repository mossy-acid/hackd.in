'use strict';

var baseUpdate = require('./_baseUpdate'),
    castFunction = require('./_castFunction');

/**
 * This method is like `_.set` except that accepts `updater` to produce the
 * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
 * is invoked with one argument: (value).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {Function} updater The function to produce the updated value.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.update(object, 'a[0].b.c', function(n) { return n * n; });
 * console.log(object.a[0].b.c);
 * // => 9
 *
 * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
 * console.log(object.x[0].y.z);
 * // => 0
 */
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}

module.exports = update;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VwZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCSixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEIsRUFBOEIsT0FBOUIsRUFBdUM7QUFDckMsU0FBTyxVQUFVLElBQVYsR0FBaUIsTUFBakIsR0FBMEIsV0FBVyxNQUFYLEVBQW1CLElBQW5CLEVBQXlCLGFBQWEsT0FBYixDQUF6QixDQUExQixDQUQ4QjtDQUF2Qzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VVcGRhdGUgPSByZXF1aXJlKCcuL19iYXNlVXBkYXRlJyksXG4gICAgY2FzdEZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fY2FzdEZ1bmN0aW9uJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5zZXRgIGV4Y2VwdCB0aGF0IGFjY2VwdHMgYHVwZGF0ZXJgIHRvIHByb2R1Y2UgdGhlXG4gKiB2YWx1ZSB0byBzZXQuIFVzZSBgXy51cGRhdGVXaXRoYCB0byBjdXN0b21pemUgYHBhdGhgIGNyZWF0aW9uLiBUaGUgYHVwZGF0ZXJgXG4gKiBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC42LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdXBkYXRlciBUaGUgZnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgdXBkYXRlZCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy51cGRhdGUob2JqZWN0LCAnYVswXS5iLmMnLCBmdW5jdGlvbihuKSB7IHJldHVybiBuICogbjsgfSk7XG4gKiBjb25zb2xlLmxvZyhvYmplY3QuYVswXS5iLmMpO1xuICogLy8gPT4gOVxuICpcbiAqIF8udXBkYXRlKG9iamVjdCwgJ3hbMF0ueS56JywgZnVuY3Rpb24obikgeyByZXR1cm4gbiA/IG4gKyAxIDogMDsgfSk7XG4gKiBjb25zb2xlLmxvZyhvYmplY3QueFswXS55LnopO1xuICogLy8gPT4gMFxuICovXG5mdW5jdGlvbiB1cGRhdGUob2JqZWN0LCBwYXRoLCB1cGRhdGVyKSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IGJhc2VVcGRhdGUob2JqZWN0LCBwYXRoLCBjYXN0RnVuY3Rpb24odXBkYXRlcikpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZTtcbiJdfQ==