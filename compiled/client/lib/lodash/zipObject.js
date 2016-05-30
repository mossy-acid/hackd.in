'use strict';

var assignValue = require('./_assignValue'),
    baseZipObject = require('./_baseZipObject');

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

module.exports = zipObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3ppcE9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JKLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixNQUExQixFQUFrQztBQUNoQyxTQUFPLGNBQWMsU0FBUyxFQUFULEVBQWEsVUFBVSxFQUFWLEVBQWMsV0FBekMsQ0FBUCxDQURnQztDQUFsQzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiemlwT2JqZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlWmlwT2JqZWN0ID0gcmVxdWlyZSgnLi9fYmFzZVppcE9iamVjdCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZnJvbVBhaXJzYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIHR3byBhcnJheXMsXG4gKiBvbmUgb2YgcHJvcGVydHkgaWRlbnRpZmllcnMgYW5kIG9uZSBvZiBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wcz1bXV0gVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzLlxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlcz1bXV0gVGhlIHByb3BlcnR5IHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uemlwT2JqZWN0KFsnYScsICdiJ10sIFsxLCAyXSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqL1xuZnVuY3Rpb24gemlwT2JqZWN0KHByb3BzLCB2YWx1ZXMpIHtcbiAgcmV0dXJuIGJhc2VaaXBPYmplY3QocHJvcHMgfHwgW10sIHZhbHVlcyB8fCBbXSwgYXNzaWduVmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHppcE9iamVjdDtcbiJdfQ==