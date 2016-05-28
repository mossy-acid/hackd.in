'use strict';

var lodash = require('./wrapperLodash');

/**
 * Creates a `lodash` wrapper instance that wraps `value` with explicit method
 * chain sequences enabled. The result of such sequences must be unwrapped
 * with `_#value`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Seq
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36 },
 *   { 'user': 'fred',    'age': 40 },
 *   { 'user': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _
 *   .chain(users)
 *   .sortBy('age')
 *   .map(function(o) {
 *     return o.user + ' is ' + o.age;
 *   })
 *   .head()
 *   .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}

module.exports = chain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NoYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCSixTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0FBQ3BCLE1BQUksU0FBUyxPQUFPLEtBQVAsQ0FBVCxDQURnQjtBQUVwQixTQUFPLFNBQVAsR0FBbUIsSUFBbkIsQ0FGb0I7QUFHcEIsU0FBTyxNQUFQLENBSG9CO0NBQXRCOztBQU1BLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJjaGFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBsb2Rhc2ggPSByZXF1aXJlKCcuL3dyYXBwZXJMb2Rhc2gnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZSB0aGF0IHdyYXBzIGB2YWx1ZWAgd2l0aCBleHBsaWNpdCBtZXRob2RcbiAqIGNoYWluIHNlcXVlbmNlcyBlbmFibGVkLiBUaGUgcmVzdWx0IG9mIHN1Y2ggc2VxdWVuY2VzIG11c3QgYmUgdW53cmFwcGVkXG4gKiB3aXRoIGBfI3ZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMy4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2IH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgICdhZ2UnOiA0MCB9LFxuICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gKiBdO1xuICpcbiAqIHZhciB5b3VuZ2VzdCA9IF9cbiAqICAgLmNoYWluKHVzZXJzKVxuICogICAuc29ydEJ5KCdhZ2UnKVxuICogICAubWFwKGZ1bmN0aW9uKG8pIHtcbiAqICAgICByZXR1cm4gby51c2VyICsgJyBpcyAnICsgby5hZ2U7XG4gKiAgIH0pXG4gKiAgIC5oZWFkKClcbiAqICAgLnZhbHVlKCk7XG4gKiAvLyA9PiAncGViYmxlcyBpcyAxJ1xuICovXG5mdW5jdGlvbiBjaGFpbih2YWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gbG9kYXNoKHZhbHVlKTtcbiAgcmVzdWx0Ll9fY2hhaW5fXyA9IHRydWU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhaW47XG4iXX0=