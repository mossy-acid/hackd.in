'use strict';

var createWrapper = require('./_createWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var greet = function(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * };
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = rest(function (func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= PARTIAL_FLAG;
  }
  return createWrapper(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2JpbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGdCQUFnQixRQUFRLGtCQUFSLENBQXBCO0lBQ0ksWUFBWSxRQUFRLGNBQVIsQ0FEaEI7SUFFSSxpQkFBaUIsUUFBUSxtQkFBUixDQUZyQjtJQUdJLE9BQU8sUUFBUSxRQUFSLENBSFg7OztBQU1BLElBQUksWUFBWSxDQUFoQjtJQUNJLGVBQWUsRUFEbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0EsSUFBSSxPQUFPLEtBQUssVUFBUyxJQUFULEVBQWUsT0FBZixFQUF3QixRQUF4QixFQUFrQztBQUNoRCxNQUFJLFVBQVUsU0FBZDtBQUNBLE1BQUksU0FBUyxNQUFiLEVBQXFCO0FBQ25CLFFBQUksVUFBVSxlQUFlLFFBQWYsRUFBeUIsVUFBVSxJQUFWLENBQXpCLENBQWQ7QUFDQSxlQUFXLFlBQVg7QUFDRDtBQUNELFNBQU8sY0FBYyxJQUFkLEVBQW9CLE9BQXBCLEVBQTZCLE9BQTdCLEVBQXNDLFFBQXRDLEVBQWdELE9BQWhELENBQVA7QUFDRCxDQVBVLENBQVg7OztBQVVBLEtBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoiYmluZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlV3JhcHBlcicpLFxuICAgIGdldEhvbGRlciA9IHJlcXVpcmUoJy4vX2dldEhvbGRlcicpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnLi9fcmVwbGFjZUhvbGRlcnMnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHdyYXBwZXIgbWV0YWRhdGEuICovXG52YXIgQklORF9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0ZMQUcgPSAzMjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2BcbiAqIGFuZCBgcGFydGlhbHNgIHByZXBlbmRlZCB0byB0aGUgYXJndW1lbnRzIGl0IHJlY2VpdmVzLlxuICpcbiAqIFRoZSBgXy5iaW5kLnBsYWNlaG9sZGVyYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gYF9gIGluIG1vbm9saXRoaWMgYnVpbGRzLFxuICogbWF5IGJlIHVzZWQgYXMgYSBwbGFjZWhvbGRlciBmb3IgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgbmF0aXZlIGBGdW5jdGlvbiNiaW5kYCwgdGhpcyBtZXRob2QgZG9lc24ndCBzZXQgdGhlIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IG9mIGJvdW5kIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7Li4uKn0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nLCBwdW5jdHVhdGlvbikge1xuICogICByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyB0aGlzLnVzZXIgKyBwdW5jdHVhdGlvbjtcbiAqIH07XG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiB2YXIgYm91bmQgPSBfLmJpbmQoZ3JlZXQsIG9iamVjdCwgJ2hpJyk7XG4gKiBib3VuZCgnIScpO1xuICogLy8gPT4gJ2hpIGZyZWQhJ1xuICpcbiAqIC8vIEJvdW5kIHdpdGggcGxhY2Vob2xkZXJzLlxuICogdmFyIGJvdW5kID0gXy5iaW5kKGdyZWV0LCBvYmplY3QsIF8sICchJyk7XG4gKiBib3VuZCgnaGknKTtcbiAqIC8vID0+ICdoaSBmcmVkISdcbiAqL1xudmFyIGJpbmQgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHRoaXNBcmcsIHBhcnRpYWxzKSB7XG4gIHZhciBiaXRtYXNrID0gQklORF9GTEFHO1xuICBpZiAocGFydGlhbHMubGVuZ3RoKSB7XG4gICAgdmFyIGhvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhwYXJ0aWFscywgZ2V0SG9sZGVyKGJpbmQpKTtcbiAgICBiaXRtYXNrIHw9IFBBUlRJQUxfRkxBRztcbiAgfVxuICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycyk7XG59KTtcblxuLy8gQXNzaWduIGRlZmF1bHQgcGxhY2Vob2xkZXJzLlxuYmluZC5wbGFjZWhvbGRlciA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmQ7XG4iXX0=