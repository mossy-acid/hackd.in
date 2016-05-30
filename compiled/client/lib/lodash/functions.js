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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Z1bmN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJKLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQjtBQUN6QixTQUFPLFVBQVUsSUFBVixHQUFpQixFQUFqQixHQUFzQixjQUFjLE1BQWQsRUFBc0IsS0FBSyxNQUFMLENBQXRCLENBQXRCLENBRGtCO0NBQTNCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJmdW5jdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vX2Jhc2VGdW5jdGlvbnMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBmdW5jdGlvbiBwcm9wZXJ0eSBuYW1lcyBmcm9tIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXNcbiAqIG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBuYW1lcy5cbiAqIEBzZWUgXy5mdW5jdGlvbnNJblxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IF8uY29uc3RhbnQoJ2EnKTtcbiAqICAgdGhpcy5iID0gXy5jb25zdGFudCgnYicpO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IF8uY29uc3RhbnQoJ2MnKTtcbiAqXG4gKiBfLmZ1bmN0aW9ucyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqL1xuZnVuY3Rpb24gZnVuY3Rpb25zKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBbXSA6IGJhc2VGdW5jdGlvbnMob2JqZWN0LCBrZXlzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9ucztcbiJdfQ==