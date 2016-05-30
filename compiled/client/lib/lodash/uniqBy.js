'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq');

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
    return array && array.length ? baseUniq(array, baseIteratee(iteratee)) : [];
}

module.exports = uniqBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuaXFCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5CO0lBQ0ksV0FBVyxRQUFRLGFBQVIsQ0FEZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QixRQUF2QixFQUFpQztBQUMvQixXQUFRLFNBQVMsTUFBTSxNQUFoQixHQUNILFNBQVMsS0FBVCxFQUFnQixhQUFhLFFBQWIsQ0FBaEIsQ0FERyxHQUVILEVBRko7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoidW5pcUJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VVbmlxID0gcmVxdWlyZSgnLi9fYmFzZVVuaXEnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnVuaXFgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGl0ZXJhdGVlYCB3aGljaCBpc1xuICogaW52b2tlZCBmb3IgZWFjaCBlbGVtZW50IGluIGBhcnJheWAgdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieSB3aGljaFxuICogdW5pcXVlbmVzcyBpcyBjb21wdXRlZC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2l0ZXJhdGVlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmlxQnkoWzIuMSwgMS4yLCAyLjNdLCBNYXRoLmZsb29yKTtcbiAqIC8vID0+IFsyLjEsIDEuMl1cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8udW5pcUJ5KFt7ICd4JzogMSB9LCB7ICd4JzogMiB9LCB7ICd4JzogMSB9XSwgJ3gnKTtcbiAqIC8vID0+IFt7ICd4JzogMSB9LCB7ICd4JzogMiB9XVxuICovXG5mdW5jdGlvbiB1bmlxQnkoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVVuaXEoYXJyYXksIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1bmlxQnk7XG4iXX0=