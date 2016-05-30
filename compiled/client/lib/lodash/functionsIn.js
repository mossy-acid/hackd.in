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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Z1bmN0aW9uc0luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFwQjtJQUNJLFNBQVMsUUFBUSxVQUFSLENBRGI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCO0FBQzNCLFNBQU8sVUFBVSxJQUFWLEdBQWlCLEVBQWpCLEdBQXNCLGNBQWMsTUFBZCxFQUFzQixPQUFPLE1BQVAsQ0FBdEIsQ0FBN0I7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiZnVuY3Rpb25zSW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vX2Jhc2VGdW5jdGlvbnMnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb24gcHJvcGVydHkgbmFtZXMgZnJvbSBvd24gYW5kIGluaGVyaXRlZFxuICogZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBuYW1lcy5cbiAqIEBzZWUgXy5mdW5jdGlvbnNcbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSBfLmNvbnN0YW50KCdhJyk7XG4gKiAgIHRoaXMuYiA9IF8uY29uc3RhbnQoJ2InKTtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSBfLmNvbnN0YW50KCdjJyk7XG4gKlxuICogXy5mdW5jdGlvbnNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXVxuICovXG5mdW5jdGlvbiBmdW5jdGlvbnNJbihvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gW10gOiBiYXNlRnVuY3Rpb25zKG9iamVjdCwga2V5c0luKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uc0luO1xuIl19