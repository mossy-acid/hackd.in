'use strict';

var baseFunctions = require('./_baseFunctions'),
    keys = require('./keys');

/**
 * Creates an array of function property names from own enumerable properties
 * of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functionsIn
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functions(new Foo);
 * // => ['a', 'b']
 */
function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}

module.exports = functions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Z1bmN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7SUFDSSxPQUFPLFFBQVEsUUFBUixDQURYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQjtBQUN6QixTQUFPLFVBQVUsSUFBVixHQUFpQixFQUFqQixHQUFzQixjQUFjLE1BQWQsRUFBc0IsS0FBSyxNQUFMLENBQXRCLENBQTdCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImZ1bmN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlRnVuY3Rpb25zID0gcmVxdWlyZSgnLi9fYmFzZUZ1bmN0aW9ucycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGZ1bmN0aW9uIHByb3BlcnR5IG5hbWVzIGZyb20gb3duIGVudW1lcmFibGUgcHJvcGVydGllc1xuICogb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGZ1bmN0aW9uIG5hbWVzLlxuICogQHNlZSBfLmZ1bmN0aW9uc0luXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gXy5jb25zdGFudCgnYScpO1xuICogICB0aGlzLmIgPSBfLmNvbnN0YW50KCdiJyk7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gXy5jb25zdGFudCgnYycpO1xuICpcbiAqIF8uZnVuY3Rpb25zKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXVxuICovXG5mdW5jdGlvbiBmdW5jdGlvbnMob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IFtdIDogYmFzZUZ1bmN0aW9ucyhvYmplY3QsIGtleXMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb25zO1xuIl19