'use strict';

var baseExtremum = require('./_baseExtremum'),
    baseLt = require('./_baseLt'),
    identity = require('./identity');

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
    return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}

module.exports = min;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkosU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNsQixXQUFPLEtBQUMsSUFBUyxNQUFNLE1BQU4sR0FDYixhQUFhLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEIsTUFBOUIsQ0FERyxHQUVILFNBRkcsQ0FEVztDQUFwQjs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoibWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VFeHRyZW11bSA9IHJlcXVpcmUoJy4vX2Jhc2VFeHRyZW11bScpLFxuICAgIGJhc2VMdCA9IHJlcXVpcmUoJy4vX2Jhc2VMdCcpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIGBhcnJheWAuIElmIGBhcnJheWAgaXMgZW1wdHkgb3IgZmFsc2V5LFxuICogYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDJcbiAqXG4gKiBfLm1pbihbXSk7XG4gKiAvLyA9PiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gbWluKGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZUV4dHJlbXVtKGFycmF5LCBpZGVudGl0eSwgYmFzZUx0KVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1pbjtcbiJdfQ==