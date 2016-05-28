'use strict';

var arrayReduceRight = require('./_arrayReduceRight'),
    baseEachRight = require('./_baseEachRight'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

/**
 * This method is like `_.reduce` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduce
 * @example
 *
 * var array = [[0, 1], [2, 3], [4, 5]];
 *
 * _.reduceRight(array, function(flattened, other) {
 *   return flattened.concat(other);
 * }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */
function reduceRight(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduceRight : baseReduce,
        initAccum = arguments.length < 3;

    return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
}

module.exports = reduceRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JlZHVjZVJpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxtQkFBbUIsUUFBUSxxQkFBUixDQUFuQjtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JKLFNBQVMsV0FBVCxDQUFxQixVQUFyQixFQUFpQyxRQUFqQyxFQUEyQyxXQUEzQyxFQUF3RDtBQUN0RCxRQUFJLE9BQU8sUUFBUSxVQUFSLElBQXNCLGdCQUF0QixHQUF5QyxVQUF6QztRQUNQLFlBQVksVUFBVSxNQUFWLEdBQW1CLENBQW5CLENBRnNDOztBQUl0RCxXQUFPLEtBQUssVUFBTCxFQUFpQixhQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBakIsRUFBNEMsV0FBNUMsRUFBeUQsU0FBekQsRUFBb0UsYUFBcEUsQ0FBUCxDQUpzRDtDQUF4RDs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoicmVkdWNlUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlSZWR1Y2VSaWdodCA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlUmlnaHQnKSxcbiAgICBiYXNlRWFjaFJpZ2h0ID0gcmVxdWlyZSgnLi9fYmFzZUVhY2hSaWdodCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VSZWR1Y2UgPSByZXF1aXJlKCcuL19iYXNlUmVkdWNlJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucmVkdWNlYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mXG4gKiBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgaW5pdGlhbCB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgXy5yZWR1Y2VcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gW1swLCAxXSwgWzIsIDNdLCBbNCwgNV1dO1xuICpcbiAqIF8ucmVkdWNlUmlnaHQoYXJyYXksIGZ1bmN0aW9uKGZsYXR0ZW5lZCwgb3RoZXIpIHtcbiAqICAgcmV0dXJuIGZsYXR0ZW5lZC5jb25jYXQob3RoZXIpO1xuICogfSwgW10pO1xuICogLy8gPT4gWzQsIDUsIDIsIDMsIDAsIDFdXG4gKi9cbmZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBhY2N1bXVsYXRvcikge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheVJlZHVjZVJpZ2h0IDogYmFzZVJlZHVjZSxcbiAgICAgIGluaXRBY2N1bSA9IGFyZ3VtZW50cy5sZW5ndGggPCAzO1xuXG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSwgNCksIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0sIGJhc2VFYWNoUmlnaHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZHVjZVJpZ2h0O1xuIl19