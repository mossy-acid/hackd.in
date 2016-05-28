'use strict';

var baseUpdate = require('./_baseUpdate'),
    castFunction = require('./_castFunction');

/**
 * This method is like `_.update` except that it accepts `customizer` which is
 * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
 * path creation is handled by the method instead. The `customizer` is invoked
 * with three arguments: (nsValue, key, nsObject).
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
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {};
 *
 * _.updateWith(object, '[0][1]', _.constant('a'), Object);
 * // => { '0': { '1': 'a' } }
 */
function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}

module.exports = updateWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VwZGF0ZVdpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsUUFBUSxlQUFSLENBQWI7SUFDQSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkosU0FBUyxVQUFULENBQW9CLE1BQXBCLEVBQTRCLElBQTVCLEVBQWtDLE9BQWxDLEVBQTJDLFVBQTNDLEVBQXVEO0FBQ3JELGVBQWEsT0FBTyxVQUFQLElBQXFCLFVBQXJCLEdBQWtDLFVBQWxDLEdBQStDLFNBQS9DLENBRHdDO0FBRXJELFNBQU8sVUFBVSxJQUFWLEdBQWlCLE1BQWpCLEdBQTBCLFdBQVcsTUFBWCxFQUFtQixJQUFuQixFQUF5QixhQUFhLE9BQWIsQ0FBekIsRUFBZ0QsVUFBaEQsQ0FBMUIsQ0FGOEM7Q0FBdkQ7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6InVwZGF0ZVdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVVwZGF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VVcGRhdGUnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnVwZGF0ZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2ggaXNcbiAqIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgb2JqZWN0cyBvZiBgcGF0aGAuICBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYFxuICogcGF0aCBjcmVhdGlvbiBpcyBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRocmVlIGFyZ3VtZW50czogKG5zVmFsdWUsIGtleSwgbnNPYmplY3QpLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC42LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdXBkYXRlciBUaGUgZnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgdXBkYXRlZCB2YWx1ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7fTtcbiAqXG4gKiBfLnVwZGF0ZVdpdGgob2JqZWN0LCAnWzBdWzFdJywgXy5jb25zdGFudCgnYScpLCBPYmplY3QpO1xuICogLy8gPT4geyAnMCc6IHsgJzEnOiAnYScgfSB9XG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVdpdGgob2JqZWN0LCBwYXRoLCB1cGRhdGVyLCBjdXN0b21pemVyKSB7XG4gIGN1c3RvbWl6ZXIgPSB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nID8gY3VzdG9taXplciA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gb2JqZWN0IDogYmFzZVVwZGF0ZShvYmplY3QsIHBhdGgsIGNhc3RGdW5jdGlvbih1cGRhdGVyKSwgY3VzdG9taXplcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlV2l0aDtcbiJdfQ==