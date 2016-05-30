'use strict';

var baseFunctions = require('./_baseFunctions'),
    keysIn = require('./keysIn');

/**
 * Creates an array of function property names from own and inherited
 * enumerable properties of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functions
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functionsIn(new Foo);
 * // => ['a', 'b', 'c']
 */
function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn(object));
}

module.exports = functionsIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Z1bmN0aW9uc0luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLFNBQVMsUUFBUSxVQUFSLENBQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCO0FBQzNCLFNBQU8sVUFBVSxJQUFWLEdBQWlCLEVBQWpCLEdBQXNCLGNBQWMsTUFBZCxFQUFzQixPQUFPLE1BQVAsQ0FBdEIsQ0FBdEIsQ0FEb0I7Q0FBN0I7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6ImZ1bmN0aW9uc0luLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGdW5jdGlvbnMgPSByZXF1aXJlKCcuL19iYXNlRnVuY3Rpb25zJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGZ1bmN0aW9uIHByb3BlcnR5IG5hbWVzIGZyb20gb3duIGFuZCBpbmhlcml0ZWRcbiAqIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgZnVuY3Rpb24gbmFtZXMuXG4gKiBAc2VlIF8uZnVuY3Rpb25zXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gXy5jb25zdGFudCgnYScpO1xuICogICB0aGlzLmIgPSBfLmNvbnN0YW50KCdiJyk7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gXy5jb25zdGFudCgnYycpO1xuICpcbiAqIF8uZnVuY3Rpb25zSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ11cbiAqL1xuZnVuY3Rpb24gZnVuY3Rpb25zSW4ob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IFtdIDogYmFzZUZ1bmN0aW9ucyhvYmplY3QsIGtleXNJbihvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbnNJbjtcbiJdfQ==