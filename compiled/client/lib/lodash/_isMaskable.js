'use strict';

var coreJsData = require('./_coreJsData'),
    isFunction = require('./isFunction'),
    stubFalse = require('./stubFalse');

/**
 * Checks if `func` is capable of being masked.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
 */
var isMaskable = coreJsData ? isFunction : stubFalse;

module.exports = isMaskable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pc01hc2thYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFqQjtJQUNJLGFBQWEsUUFBUSxjQUFSLENBRGpCO0lBRUksWUFBWSxRQUFRLGFBQVIsQ0FGaEI7Ozs7Ozs7OztBQVdBLElBQUksYUFBYSxhQUFhLFVBQWIsR0FBMEIsU0FBM0M7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6Il9pc01hc2thYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBpcyBjYXBhYmxlIG9mIGJlaW5nIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2thYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbnZhciBpc01hc2thYmxlID0gY29yZUpzRGF0YSA/IGlzRnVuY3Rpb24gOiBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrYWJsZTtcbiJdfQ==