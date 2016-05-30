'use strict';

var chain = require('./chain');

/**
 * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
 *
 * @name chain
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 }
 * ];
 *
 * // A sequence without explicit chaining.
 * _(users).head();
 * // => { 'user': 'barney', 'age': 36 }
 *
 * // A sequence with explicit chaining.
 * _(users)
 *   .chain()
 *   .head()
 *   .pick('user')
 *   .value();
 * // => { 'user': 'barney' }
 */
function wrapperChain() {
  return chain(this);
}

module.exports = wrapperChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJDaGFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsU0FBUyxZQUFULEdBQXdCO0FBQ3RCLFNBQU8sTUFBTSxJQUFOLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoid3JhcHBlckNoYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNoYWluID0gcmVxdWlyZSgnLi9jaGFpbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlIHdpdGggZXhwbGljaXQgbWV0aG9kIGNoYWluIHNlcXVlbmNlcyBlbmFibGVkLlxuICpcbiAqIEBuYW1lIGNoYWluXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gKiBdO1xuICpcbiAqIC8vIEEgc2VxdWVuY2Ugd2l0aG91dCBleHBsaWNpdCBjaGFpbmluZy5cbiAqIF8odXNlcnMpLmhlYWQoKTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqXG4gKiAvLyBBIHNlcXVlbmNlIHdpdGggZXhwbGljaXQgY2hhaW5pbmcuXG4gKiBfKHVzZXJzKVxuICogICAuY2hhaW4oKVxuICogICAuaGVhZCgpXG4gKiAgIC5waWNrKCd1c2VyJylcbiAqICAgLnZhbHVlKCk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScgfVxuICovXG5mdW5jdGlvbiB3cmFwcGVyQ2hhaW4oKSB7XG4gIHJldHVybiBjaGFpbih0aGlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyQ2hhaW47XG4iXX0=