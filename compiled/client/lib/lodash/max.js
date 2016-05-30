'use strict';

var baseExtremum = require('./_baseExtremum'),
    baseGt = require('./_baseGt'),
    identity = require('./identity');

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
    return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}

module.exports = max;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkosU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNsQixXQUFPLEtBQUMsSUFBUyxNQUFNLE1BQU4sR0FDYixhQUFhLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEIsTUFBOUIsQ0FERyxHQUVILFNBRkcsQ0FEVztDQUFwQjs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoibWF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VFeHRyZW11bSA9IHJlcXVpcmUoJy4vX2Jhc2VFeHRyZW11bScpLFxuICAgIGJhc2VHdCA9IHJlcXVpcmUoJy4vX2Jhc2VHdCcpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIGBhcnJheWAuIElmIGBhcnJheWAgaXMgZW1wdHkgb3IgZmFsc2V5LFxuICogYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF4aW11bSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5tYXgoWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDhcbiAqXG4gKiBfLm1heChbXSk7XG4gKiAvLyA9PiB1bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gbWF4KGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZUV4dHJlbXVtKGFycmF5LCBpZGVudGl0eSwgYmFzZUd0KVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1heDtcbiJdfQ==