'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    baseAt = require('./_baseAt'),
    baseFlatten = require('./_baseFlatten'),
    isIndex = require('./_isIndex'),
    rest = require('./rest'),
    thru = require('./thru');

/**
 * This method is the wrapper version of `_.at`.
 *
 * @name at
 * @memberOf _
 * @since 1.0.0
 * @category Seq
 * @param {...(string|string[])} [paths] The property paths of elements to pick.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _(object).at(['a[0].b.c', 'a[1]']).value();
 * // => [3, 4]
 */
var wrapperAt = rest(function (paths) {
  paths = baseFlatten(paths, 1);
  var length = paths.length,
      start = length ? paths[0] : 0,
      value = this.__wrapped__,
      interceptor = function interceptor(object) {
    return baseAt(object, paths);
  };

  if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
    return this.thru(interceptor);
  }
  value = value.slice(start, +start + (length ? 1 : 0));
  value.__actions__.push({
    'func': thru,
    'args': [interceptor],
    'thisArg': undefined
  });
  return new LodashWrapper(value, this.__chain__).thru(function (array) {
    if (length && !array.length) {
      array.push(undefined);
    }
    return array;
  });
});

module.exports = wrapperAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJBdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLFNBQVMsUUFBUSxXQUFSLENBQVQ7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JKLElBQUksWUFBWSxLQUFLLFVBQVMsS0FBVCxFQUFnQjtBQUNuQyxVQUFRLFlBQVksS0FBWixFQUFtQixDQUFuQixDQUFSLENBRG1DO0FBRW5DLE1BQUksU0FBUyxNQUFNLE1BQU47TUFDVCxRQUFRLFNBQVMsTUFBTSxDQUFOLENBQVQsR0FBb0IsQ0FBcEI7TUFDUixRQUFRLEtBQUssV0FBTDtNQUNSLGNBQWMsU0FBZCxXQUFjLENBQVMsTUFBVCxFQUFpQjtBQUFFLFdBQU8sT0FBTyxNQUFQLEVBQWUsS0FBZixDQUFQLENBQUY7R0FBakIsQ0FMaUI7O0FBT25DLE1BQUksU0FBUyxDQUFULElBQWMsS0FBSyxXQUFMLENBQWlCLE1BQWpCLElBQ2QsRUFBRSxpQkFBaUIsV0FBakIsQ0FBRixJQUFtQyxDQUFDLFFBQVEsS0FBUixDQUFELEVBQWlCO0FBQ3RELFdBQU8sS0FBSyxJQUFMLENBQVUsV0FBVixDQUFQLENBRHNEO0dBRHhEO0FBSUEsVUFBUSxNQUFNLEtBQU4sQ0FBWSxLQUFaLEVBQW1CLENBQUMsS0FBRCxJQUFVLFNBQVMsQ0FBVCxHQUFhLENBQWIsQ0FBVixDQUEzQixDQVhtQztBQVluQyxRQUFNLFdBQU4sQ0FBa0IsSUFBbEIsQ0FBdUI7QUFDckIsWUFBUSxJQUFSO0FBQ0EsWUFBUSxDQUFDLFdBQUQsQ0FBUjtBQUNBLGVBQVcsU0FBWDtHQUhGLEVBWm1DO0FBaUJuQyxTQUFPLElBQUksYUFBSixDQUFrQixLQUFsQixFQUF5QixLQUFLLFNBQUwsQ0FBekIsQ0FBeUMsSUFBekMsQ0FBOEMsVUFBUyxLQUFULEVBQWdCO0FBQ25FLFFBQUksVUFBVSxDQUFDLE1BQU0sTUFBTixFQUFjO0FBQzNCLFlBQU0sSUFBTixDQUFXLFNBQVgsRUFEMkI7S0FBN0I7QUFHQSxXQUFPLEtBQVAsQ0FKbUU7R0FBaEIsQ0FBckQsQ0FqQm1DO0NBQWhCLENBQWpCOztBQXlCSixPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoid3JhcHBlckF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIExhenlXcmFwcGVyID0gcmVxdWlyZSgnLi9fTGF6eVdyYXBwZXInKSxcbiAgICBMb2Rhc2hXcmFwcGVyID0gcmVxdWlyZSgnLi9fTG9kYXNoV3JhcHBlcicpLFxuICAgIGJhc2VBdCA9IHJlcXVpcmUoJy4vX2Jhc2VBdCcpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB0aHJ1ID0gcmVxdWlyZSgnLi90aHJ1Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgdGhlIHdyYXBwZXIgdmVyc2lvbiBvZiBgXy5hdGAuXG4gKlxuICogQG5hbWUgYXRcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwYXRoc10gVGhlIHByb3BlcnR5IHBhdGhzIG9mIGVsZW1lbnRzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfSwgNF0gfTtcbiAqXG4gKiBfKG9iamVjdCkuYXQoWydhWzBdLmIuYycsICdhWzFdJ10pLnZhbHVlKCk7XG4gKiAvLyA9PiBbMywgNF1cbiAqL1xudmFyIHdyYXBwZXJBdCA9IHJlc3QoZnVuY3Rpb24ocGF0aHMpIHtcbiAgcGF0aHMgPSBiYXNlRmxhdHRlbihwYXRocywgMSk7XG4gIHZhciBsZW5ndGggPSBwYXRocy5sZW5ndGgsXG4gICAgICBzdGFydCA9IGxlbmd0aCA/IHBhdGhzWzBdIDogMCxcbiAgICAgIHZhbHVlID0gdGhpcy5fX3dyYXBwZWRfXyxcbiAgICAgIGludGVyY2VwdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7IHJldHVybiBiYXNlQXQob2JqZWN0LCBwYXRocyk7IH07XG5cbiAgaWYgKGxlbmd0aCA+IDEgfHwgdGhpcy5fX2FjdGlvbnNfXy5sZW5ndGggfHxcbiAgICAgICEodmFsdWUgaW5zdGFuY2VvZiBMYXp5V3JhcHBlcikgfHwgIWlzSW5kZXgoc3RhcnQpKSB7XG4gICAgcmV0dXJuIHRoaXMudGhydShpbnRlcmNlcHRvcik7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5zbGljZShzdGFydCwgK3N0YXJ0ICsgKGxlbmd0aCA/IDEgOiAwKSk7XG4gIHZhbHVlLl9fYWN0aW9uc19fLnB1c2goe1xuICAgICdmdW5jJzogdGhydSxcbiAgICAnYXJncyc6IFtpbnRlcmNlcHRvcl0sXG4gICAgJ3RoaXNBcmcnOiB1bmRlZmluZWRcbiAgfSk7XG4gIHJldHVybiBuZXcgTG9kYXNoV3JhcHBlcih2YWx1ZSwgdGhpcy5fX2NoYWluX18pLnRocnUoZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBpZiAobGVuZ3RoICYmICFhcnJheS5sZW5ndGgpIHtcbiAgICAgIGFycmF5LnB1c2godW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJBdDtcbiJdfQ==