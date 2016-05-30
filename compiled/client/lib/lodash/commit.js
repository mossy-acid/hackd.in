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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbW1pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsU0FBUyxhQUFULEdBQXlCO0FBQ3ZCLFNBQU8sSUFBSSxhQUFKLENBQWtCLEtBQUssS0FBTCxFQUFsQixFQUFnQyxLQUFLLFNBQXJDLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiY29tbWl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIExvZGFzaFdyYXBwZXIgPSByZXF1aXJlKCcuL19Mb2Rhc2hXcmFwcGVyJyk7XG5cbi8qKlxuICogRXhlY3V0ZXMgdGhlIGNoYWluIHNlcXVlbmNlIGFuZCByZXR1cm5zIHRoZSB3cmFwcGVkIHJlc3VsdC5cbiAqXG4gKiBAbmFtZSBjb21taXRcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4yLjBcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgMl07XG4gKiB2YXIgd3JhcHBlZCA9IF8oYXJyYXkpLnB1c2goMyk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogd3JhcHBlZCA9IHdyYXBwZWQuY29tbWl0KCk7XG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiB3cmFwcGVkLmxhc3QoKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqL1xuZnVuY3Rpb24gd3JhcHBlckNvbW1pdCgpIHtcbiAgcmV0dXJuIG5ldyBMb2Rhc2hXcmFwcGVyKHRoaXMudmFsdWUoKSwgdGhpcy5fX2NoYWluX18pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJDb21taXQ7XG4iXX0=