'use strict';

var createWrapper = require('./_createWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');

/** Used to compose bitmasks for wrapper metadata. */
var PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with `partials` prepended to the
 * arguments it receives. This method is like `_.bind` except it does **not**
 * alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 0.2.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var greet = function(greeting, name) {
 *   return greeting + ' ' + name;
 * };
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // Partially applied with placeholders.
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */
var partial = rest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
});

// Assign default placeholders.
partial.placeholder = {};

module.exports = partial;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhcnRpYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGdCQUFnQixRQUFRLGtCQUFSLENBQXBCO0lBQ0ksWUFBWSxRQUFRLGNBQVIsQ0FEaEI7SUFFSSxpQkFBaUIsUUFBUSxtQkFBUixDQUZyQjtJQUdJLE9BQU8sUUFBUSxRQUFSLENBSFg7OztBQU1BLElBQUksZUFBZSxFQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0EsSUFBSSxVQUFVLEtBQUssVUFBUyxJQUFULEVBQWUsUUFBZixFQUF5QjtBQUMxQyxNQUFJLFVBQVUsZUFBZSxRQUFmLEVBQXlCLFVBQVUsT0FBVixDQUF6QixDQUFkO0FBQ0EsU0FBTyxjQUFjLElBQWQsRUFBb0IsWUFBcEIsRUFBa0MsU0FBbEMsRUFBNkMsUUFBN0MsRUFBdUQsT0FBdkQsQ0FBUDtBQUNELENBSGEsQ0FBZDs7O0FBTUEsUUFBUSxXQUFSLEdBQXNCLEVBQXRCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJwYXJ0aWFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwcGVyJyksXG4gICAgZ2V0SG9sZGVyID0gcmVxdWlyZSgnLi9fZ2V0SG9sZGVyJyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBQQVJUSUFMX0ZMQUcgPSAzMjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGBwYXJ0aWFsc2AgcHJlcGVuZGVkIHRvIHRoZVxuICogYXJndW1lbnRzIGl0IHJlY2VpdmVzLiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmJpbmRgIGV4Y2VwdCBpdCBkb2VzICoqbm90KipcbiAqIGFsdGVyIHRoZSBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBUaGUgYF8ucGFydGlhbC5wbGFjZWhvbGRlcmAgdmFsdWUsIHdoaWNoIGRlZmF1bHRzIHRvIGBfYCBpbiBtb25vbGl0aGljXG4gKiBidWlsZHMsIG1heSBiZSB1c2VkIGFzIGEgcGxhY2Vob2xkZXIgZm9yIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgZG9lc24ndCBzZXQgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgb2YgcGFydGlhbGx5XG4gKiBhcHBsaWVkIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMi4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gKiBAcGFyYW0gey4uLip9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgbmFtZSkge1xuICogICByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyBuYW1lO1xuICogfTtcbiAqXG4gKiB2YXIgc2F5SGVsbG9UbyA9IF8ucGFydGlhbChncmVldCwgJ2hlbGxvJyk7XG4gKiBzYXlIZWxsb1RvKCdmcmVkJyk7XG4gKiAvLyA9PiAnaGVsbG8gZnJlZCdcbiAqXG4gKiAvLyBQYXJ0aWFsbHkgYXBwbGllZCB3aXRoIHBsYWNlaG9sZGVycy5cbiAqIHZhciBncmVldEZyZWQgPSBfLnBhcnRpYWwoZ3JlZXQsIF8sICdmcmVkJyk7XG4gKiBncmVldEZyZWQoJ2hpJyk7XG4gKiAvLyA9PiAnaGkgZnJlZCdcbiAqL1xudmFyIHBhcnRpYWwgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHBhcnRpYWxzKSB7XG4gIHZhciBob2xkZXJzID0gcmVwbGFjZUhvbGRlcnMocGFydGlhbHMsIGdldEhvbGRlcihwYXJ0aWFsKSk7XG4gIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIFBBUlRJQUxfRkxBRywgdW5kZWZpbmVkLCBwYXJ0aWFscywgaG9sZGVycyk7XG59KTtcblxuLy8gQXNzaWduIGRlZmF1bHQgcGxhY2Vob2xkZXJzLlxucGFydGlhbC5wbGFjZWhvbGRlciA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnRpYWw7XG4iXX0=