'use strict';

var baseIteratee = require('./_baseIteratee'),
    basePickBy = require('./_basePickBy');

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  return object == null ? {} : basePickBy(object, baseIteratee(predicate));
}

module.exports = pickBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BpY2tCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkosU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLFNBQXhCLEVBQW1DO0FBQ2pDLFNBQU8sVUFBVSxJQUFWLEdBQWlCLEVBQWpCLEdBQXNCLFdBQVcsTUFBWCxFQUFtQixhQUFhLFNBQWIsQ0FBbkIsQ0FBdEIsQ0FEMEI7Q0FBbkM7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6InBpY2tCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlUGlja0J5ID0gcmVxdWlyZSgnLi9fYmFzZVBpY2tCeScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBgb2JqZWN0YCBwcm9wZXJ0aWVzIGBwcmVkaWNhdGVgIHJldHVybnNcbiAqIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6ICh2YWx1ZSwga2V5KS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIHByb3BlcnR5LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gKlxuICogXy5waWNrQnkob2JqZWN0LCBfLmlzTnVtYmVyKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYyc6IDMgfVxuICovXG5mdW5jdGlvbiBwaWNrQnkob2JqZWN0LCBwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8ge30gOiBiYXNlUGlja0J5KG9iamVjdCwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2tCeTtcbiJdfQ==