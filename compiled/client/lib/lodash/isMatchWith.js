'use strict';

var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData');

/**
 * This method is like `_.isMatch` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with five
 * arguments: (objValue, srcValue, index|key, object, source).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, srcValue) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * var object = { 'greeting': 'hello' };
 * var source = { 'greeting': 'hi' };
 *
 * _.isMatchWith(object, source, customizer);
 * // => true
 */
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}

module.exports = isMatchWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTWF0Y2hXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NKLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxVQUFyQyxFQUFpRDtBQUMvQyxlQUFhLE9BQU8sVUFBUCxJQUFxQixVQUFyQixHQUFrQyxVQUFsQyxHQUErQyxTQUEvQyxDQURrQztBQUUvQyxTQUFPLFlBQVksTUFBWixFQUFvQixNQUFwQixFQUE0QixhQUFhLE1BQWIsQ0FBNUIsRUFBa0QsVUFBbEQsQ0FBUCxDQUYrQztDQUFqRDs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiaXNNYXRjaFdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNNYXRjaGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gY29tcGFyZSB2YWx1ZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBjb21wYXJpc29uc1xuICogYXJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGludm9rZWQgd2l0aCBmaXZlXG4gKiBhcmd1bWVudHM6IChvYmpWYWx1ZSwgc3JjVmFsdWUsIGluZGV4fGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGlzR3JlZXRpbmcodmFsdWUpIHtcbiAqICAgcmV0dXJuIC9eaCg/Oml8ZWxsbykkLy50ZXN0KHZhbHVlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICogICBpZiAoaXNHcmVldGluZyhvYmpWYWx1ZSkgJiYgaXNHcmVldGluZyhzcmNWYWx1ZSkpIHtcbiAqICAgICByZXR1cm4gdHJ1ZTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdncmVldGluZyc6ICdoZWxsbycgfTtcbiAqIHZhciBzb3VyY2UgPSB7ICdncmVldGluZyc6ICdoaScgfTtcbiAqXG4gKiBfLmlzTWF0Y2hXaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNNYXRjaFdpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgY3VzdG9taXplciA9IHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicgPyBjdXN0b21pemVyIDogdW5kZWZpbmVkO1xuICByZXR1cm4gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIGdldE1hdGNoRGF0YShzb3VyY2UpLCBjdXN0b21pemVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hdGNoV2l0aDtcbiJdfQ==