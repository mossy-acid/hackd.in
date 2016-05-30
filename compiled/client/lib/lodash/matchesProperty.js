'use strict';

var baseClone = require('./_baseClone'),
    baseMatchesProperty = require('./_baseMatchesProperty');

/**
 * Creates a function that performs a partial deep comparison between the
 * value at `path` of a given object to `srcValue`, returning `true` if the
 * object value is equivalent, else `false`.
 *
 * **Note:** This method supports comparing the same values as `_.isEqual`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * _.find(users, _.matchesProperty('user', 'fred'));
 * // => { 'user': 'fred' }
 */
function matchesProperty(path, srcValue) {
  return baseMatchesProperty(path, baseClone(srcValue, true));
}

module.exports = matchesProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21hdGNoZXNQcm9wZXJ0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLHNCQUFzQixRQUFRLHdCQUFSLENBQXRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCSixTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0IsUUFBL0IsRUFBeUM7QUFDdkMsU0FBTyxvQkFBb0IsSUFBcEIsRUFBMEIsVUFBVSxRQUFWLEVBQW9CLElBQXBCLENBQTFCLENBQVAsQ0FEdUM7Q0FBekM7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6Im1hdGNoZXNQcm9wZXJ0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKSxcbiAgICBiYXNlTWF0Y2hlc1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXNQcm9wZXJ0eScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGEgcGFydGlhbCBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0aGVcbiAqIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdCB0byBgc3JjVmFsdWVgLCByZXR1cm5pbmcgYHRydWVgIGlmIHRoZVxuICogb2JqZWN0IHZhbHVlIGlzIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyBgXy5pc0VxdWFsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMi4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIF8uZmluZCh1c2VycywgXy5tYXRjaGVzUHJvcGVydHkoJ3VzZXInLCAnZnJlZCcpKTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcgfVxuICovXG5mdW5jdGlvbiBtYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgYmFzZUNsb25lKHNyY1ZhbHVlLCB0cnVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlc1Byb3BlcnR5O1xuIl19