'use strict';

var LodashWrapper = require('./_LodashWrapper');

/**
 * Executes the chain sequence and returns the wrapped result.
 *
 * @name commit
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2];
 * var wrapped = _(array).push(3);
 *
 * console.log(array);
 * // => [1, 2]
 *
 * wrapped = wrapped.commit();
 * console.log(array);
 * // => [1, 2, 3]
 *
 * wrapped.last();
 * // => 3
 *
 * console.log(array);
 * // => [1, 2, 3]
 */
function wrapperCommit() {
  return new LodashWrapper(this.value(), this.__chain__);
}

module.exports = wrapperCommit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbW1pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkosU0FBUyxhQUFULEdBQXlCO0FBQ3ZCLFNBQU8sSUFBSSxhQUFKLENBQWtCLEtBQUssS0FBTCxFQUFsQixFQUFnQyxLQUFLLFNBQUwsQ0FBdkMsQ0FEdUI7Q0FBekI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6ImNvbW1pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBMb2Rhc2hXcmFwcGVyID0gcmVxdWlyZSgnLi9fTG9kYXNoV3JhcHBlcicpO1xuXG4vKipcbiAqIEV4ZWN1dGVzIHRoZSBjaGFpbiBzZXF1ZW5jZSBhbmQgcmV0dXJucyB0aGUgd3JhcHBlZCByZXN1bHQuXG4gKlxuICogQG5hbWUgY29tbWl0XG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMi4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWzEsIDJdO1xuICogdmFyIHdyYXBwZWQgPSBfKGFycmF5KS5wdXNoKDMpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHdyYXBwZWQgPSB3cmFwcGVkLmNvbW1pdCgpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogd3JhcHBlZC5sYXN0KCk7XG4gKiAvLyA9PiAzXG4gKlxuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJDb21taXQoKSB7XG4gIHJldHVybiBuZXcgTG9kYXNoV3JhcHBlcih0aGlzLnZhbHVlKCksIHRoaXMuX19jaGFpbl9fKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyQ29tbWl0O1xuIl19