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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJDaGFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkosU0FBUyxZQUFULEdBQXdCO0FBQ3RCLFNBQU8sTUFBTSxJQUFOLENBQVAsQ0FEc0I7Q0FBeEI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6IndyYXBwZXJDaGFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjaGFpbiA9IHJlcXVpcmUoJy4vY2hhaW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZSB3aXRoIGV4cGxpY2l0IG1ldGhvZCBjaGFpbiBzZXF1ZW5jZXMgZW5hYmxlZC5cbiAqXG4gKiBAbmFtZSBjaGFpblxuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IFNlcVxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICogXTtcbiAqXG4gKiAvLyBBIHNlcXVlbmNlIHdpdGhvdXQgZXhwbGljaXQgY2hhaW5pbmcuXG4gKiBfKHVzZXJzKS5oZWFkKCk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKlxuICogLy8gQSBzZXF1ZW5jZSB3aXRoIGV4cGxpY2l0IGNoYWluaW5nLlxuICogXyh1c2VycylcbiAqICAgLmNoYWluKClcbiAqICAgLmhlYWQoKVxuICogICAucGljaygndXNlcicpXG4gKiAgIC52YWx1ZSgpO1xuICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknIH1cbiAqL1xuZnVuY3Rpb24gd3JhcHBlckNoYWluKCkge1xuICByZXR1cm4gY2hhaW4odGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlckNoYWluO1xuIl19