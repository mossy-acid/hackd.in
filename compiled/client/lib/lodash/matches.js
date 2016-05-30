'use strict';

var baseClone = require('./_baseClone'),
    baseMatches = require('./_baseMatches');

/**
 * Creates a function that performs a partial deep comparison between a given
 * object and `source`, returning `true` if the given object has equivalent
 * property values, else `false`. The created function is equivalent to
 * `_.isMatch` with a `source` partially applied.
 *
 * **Note:** This method supports comparing the same values as `_.isEqual`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, _.matches({ 'age': 40, 'active': false }));
 * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
 */
function matches(source) {
  return baseMatches(baseClone(source, true));
}

module.exports = matches;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21hdGNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksY0FBYyxRQUFRLGdCQUFSLENBRGxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUI7QUFDdkIsU0FBTyxZQUFZLFVBQVUsTUFBVixFQUFrQixJQUFsQixDQUFaLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoibWF0Y2hlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKSxcbiAgICBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYSBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIGEgZ2l2ZW5cbiAqIG9iamVjdCBhbmQgYHNvdXJjZWAsIHJldHVybmluZyBgdHJ1ZWAgaWYgdGhlIGdpdmVuIG9iamVjdCBoYXMgZXF1aXZhbGVudFxuICogcHJvcGVydHkgdmFsdWVzLCBlbHNlIGBmYWxzZWAuIFRoZSBjcmVhdGVkIGZ1bmN0aW9uIGlzIGVxdWl2YWxlbnQgdG9cbiAqIGBfLmlzTWF0Y2hgIHdpdGggYSBgc291cmNlYCBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyBgXy5pc0VxdWFsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICogXTtcbiAqXG4gKiBfLmZpbHRlcih1c2VycywgXy5tYXRjaGVzKHsgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSkpO1xuICogLy8gPT4gW3sgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH1dXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXMoc291cmNlKSB7XG4gIHJldHVybiBiYXNlTWF0Y2hlcyhiYXNlQ2xvbmUoc291cmNlLCB0cnVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlcztcbiJdfQ==