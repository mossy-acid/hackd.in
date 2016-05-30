"use strict";

/**
 * Enables the wrapper to be iterable.
 *
 * @name Symbol.iterator
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped[Symbol.iterator]() === wrapped;
 * // => true
 *
 * Array.from(wrapped);
 * // => [1, 2]
 */
function wrapperToIterator() {
  return this;
}

module.exports = wrapperToIterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvSXRlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsU0FBUyxpQkFBVCxHQUE2QjtBQUMzQixTQUFPLElBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6InRvSXRlcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEVuYWJsZXMgdGhlIHdyYXBwZXIgdG8gYmUgaXRlcmFibGUuXG4gKlxuICogQG5hbWUgU3ltYm9sLml0ZXJhdG9yXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyXSk7XG4gKlxuICogd3JhcHBlZFtTeW1ib2wuaXRlcmF0b3JdKCkgPT09IHdyYXBwZWQ7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogQXJyYXkuZnJvbSh3cmFwcGVkKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiB3cmFwcGVyVG9JdGVyYXRvcigpIHtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlclRvSXRlcmF0b3I7XG4iXX0=