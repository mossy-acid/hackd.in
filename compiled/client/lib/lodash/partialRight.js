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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhcnRpYWxSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7SUFDSSxZQUFZLFFBQVEsY0FBUixDQURoQjtJQUVJLGlCQUFpQixRQUFRLG1CQUFSLENBRnJCO0lBR0ksT0FBTyxRQUFRLFFBQVIsQ0FIWDs7O0FBTUEsSUFBSSxxQkFBcUIsRUFBekI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0EsSUFBSSxlQUFlLEtBQUssVUFBUyxJQUFULEVBQWUsUUFBZixFQUF5QjtBQUMvQyxNQUFJLFVBQVUsZUFBZSxRQUFmLEVBQXlCLFVBQVUsWUFBVixDQUF6QixDQUFkO0FBQ0EsU0FBTyxjQUFjLElBQWQsRUFBb0Isa0JBQXBCLEVBQXdDLFNBQXhDLEVBQW1ELFFBQW5ELEVBQTZELE9BQTdELENBQVA7QUFDRCxDQUhrQixDQUFuQjs7O0FBTUEsYUFBYSxXQUFiLEdBQTJCLEVBQTNCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJwYXJ0aWFsUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZVdyYXBwZXInKSxcbiAgICBnZXRIb2xkZXIgPSByZXF1aXJlKCcuL19nZXRIb2xkZXInKSxcbiAgICByZXBsYWNlSG9sZGVycyA9IHJlcXVpcmUoJy4vX3JlcGxhY2VIb2xkZXJzJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIFBBUlRJQUxfUklHSFRfRkxBRyA9IDY0O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucGFydGlhbGAgZXhjZXB0IHRoYXQgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzXG4gKiBhcmUgYXBwZW5kZWQgdG8gdGhlIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBUaGUgYF8ucGFydGlhbFJpZ2h0LnBsYWNlaG9sZGVyYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gYF9gIGluIG1vbm9saXRoaWNcbiAqIGJ1aWxkcywgbWF5IGJlIHVzZWQgYXMgYSBwbGFjZWhvbGRlciBmb3IgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBkb2Vzbid0IHNldCB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSBvZiBwYXJ0aWFsbHlcbiAqIGFwcGxpZWQgZnVuY3Rpb25zLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcGFydGlhbGx5IGFwcGx5IGFyZ3VtZW50cyB0by5cbiAqIEBwYXJhbSB7Li4uKn0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFydGlhbGx5IGFwcGxpZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nLCBuYW1lKSB7XG4gKiAgIHJldHVybiBncmVldGluZyArICcgJyArIG5hbWU7XG4gKiB9O1xuICpcbiAqIHZhciBncmVldEZyZWQgPSBfLnBhcnRpYWxSaWdodChncmVldCwgJ2ZyZWQnKTtcbiAqIGdyZWV0RnJlZCgnaGknKTtcbiAqIC8vID0+ICdoaSBmcmVkJ1xuICpcbiAqIC8vIFBhcnRpYWxseSBhcHBsaWVkIHdpdGggcGxhY2Vob2xkZXJzLlxuICogdmFyIHNheUhlbGxvVG8gPSBfLnBhcnRpYWxSaWdodChncmVldCwgJ2hlbGxvJywgXyk7XG4gKiBzYXlIZWxsb1RvKCdmcmVkJyk7XG4gKiAvLyA9PiAnaGVsbG8gZnJlZCdcbiAqL1xudmFyIHBhcnRpYWxSaWdodCA9IHJlc3QoZnVuY3Rpb24oZnVuYywgcGFydGlhbHMpIHtcbiAgdmFyIGhvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhwYXJ0aWFscywgZ2V0SG9sZGVyKHBhcnRpYWxSaWdodCkpO1xuICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCBQQVJUSUFMX1JJR0hUX0ZMQUcsIHVuZGVmaW5lZCwgcGFydGlhbHMsIGhvbGRlcnMpO1xufSk7XG5cbi8vIEFzc2lnbiBkZWZhdWx0IHBsYWNlaG9sZGVycy5cbnBhcnRpYWxSaWdodC5wbGFjZWhvbGRlciA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnRpYWxSaWdodDtcbiJdfQ==