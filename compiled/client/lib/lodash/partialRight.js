'use strict';

var createWrapper = require('./_createWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');

/** Used to compose bitmasks for wrapper metadata. */
var PARTIAL_RIGHT_FLAG = 64;

/**
 * This method is like `_.partial` except that partially applied arguments
 * are appended to the arguments it receives.
 *
 * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
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
 * var greetFred = _.partialRight(greet, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 *
 * // Partially applied with placeholders.
 * var sayHelloTo = _.partialRight(greet, 'hello', _);
 * sayHelloTo('fred');
 * // => 'hello fred'
 */
var partialRight = rest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partialRight));
  return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
});

// Assign default placeholders.
partialRight.placeholder = {};

module.exports = partialRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhcnRpYWxSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7QUFHSixJQUFJLHFCQUFxQixFQUFyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDSixJQUFJLGVBQWUsS0FBSyxVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQy9DLE1BQUksVUFBVSxlQUFlLFFBQWYsRUFBeUIsVUFBVSxZQUFWLENBQXpCLENBQVYsQ0FEMkM7QUFFL0MsU0FBTyxjQUFjLElBQWQsRUFBb0Isa0JBQXBCLEVBQXdDLFNBQXhDLEVBQW1ELFFBQW5ELEVBQTZELE9BQTdELENBQVAsQ0FGK0M7Q0FBekIsQ0FBcEI7OztBQU1KLGFBQWEsV0FBYixHQUEyQixFQUEzQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoicGFydGlhbFJpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwcGVyJyksXG4gICAgZ2V0SG9sZGVyID0gcmVxdWlyZSgnLi9fZ2V0SG9sZGVyJyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBQQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NDtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnBhcnRpYWxgIGV4Y2VwdCB0aGF0IHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50c1xuICogYXJlIGFwcGVuZGVkIHRvIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gKlxuICogVGhlIGBfLnBhcnRpYWxSaWdodC5wbGFjZWhvbGRlcmAgdmFsdWUsIHdoaWNoIGRlZmF1bHRzIHRvIGBfYCBpbiBtb25vbGl0aGljXG4gKiBidWlsZHMsIG1heSBiZSB1c2VkIGFzIGEgcGxhY2Vob2xkZXIgZm9yIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgZG9lc24ndCBzZXQgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgb2YgcGFydGlhbGx5XG4gKiBhcHBsaWVkIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gKiBAcGFyYW0gey4uLip9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgbmFtZSkge1xuICogICByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyBuYW1lO1xuICogfTtcbiAqXG4gKiB2YXIgZ3JlZXRGcmVkID0gXy5wYXJ0aWFsUmlnaHQoZ3JlZXQsICdmcmVkJyk7XG4gKiBncmVldEZyZWQoJ2hpJyk7XG4gKiAvLyA9PiAnaGkgZnJlZCdcbiAqXG4gKiAvLyBQYXJ0aWFsbHkgYXBwbGllZCB3aXRoIHBsYWNlaG9sZGVycy5cbiAqIHZhciBzYXlIZWxsb1RvID0gXy5wYXJ0aWFsUmlnaHQoZ3JlZXQsICdoZWxsbycsIF8pO1xuICogc2F5SGVsbG9UbygnZnJlZCcpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQnXG4gKi9cbnZhciBwYXJ0aWFsUmlnaHQgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHBhcnRpYWxzKSB7XG4gIHZhciBob2xkZXJzID0gcmVwbGFjZUhvbGRlcnMocGFydGlhbHMsIGdldEhvbGRlcihwYXJ0aWFsUmlnaHQpKTtcbiAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIoZnVuYywgUEFSVElBTF9SSUdIVF9GTEFHLCB1bmRlZmluZWQsIHBhcnRpYWxzLCBob2xkZXJzKTtcbn0pO1xuXG4vLyBBc3NpZ24gZGVmYXVsdCBwbGFjZWhvbGRlcnMuXG5wYXJ0aWFsUmlnaHQucGxhY2Vob2xkZXIgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJ0aWFsUmlnaHQ7XG4iXX0=