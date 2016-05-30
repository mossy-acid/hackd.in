'use strict';

var baseForOwnRight = require('./_baseForOwnRight'),
    baseIteratee = require('./_baseIteratee');

/**
 * This method is like `_.forOwn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwnRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
 */
function forOwnRight(object, iteratee) {
  return object && baseForOwnRight(object, baseIteratee(iteratee, 3));
}

module.exports = forOwnRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zvck93blJpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsUUFBUSxvQkFBUixDQUF0QjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDckMsU0FBTyxVQUFVLGdCQUFnQixNQUFoQixFQUF3QixhQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBeEIsQ0FBakI7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiZm9yT3duUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZvck93blJpZ2h0ID0gcmVxdWlyZSgnLi9fYmFzZUZvck93blJpZ2h0JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JPd25gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgcHJvcGVydGllcyBvZlxuICogYG9iamVjdGAgaW4gdGhlIG9wcG9zaXRlIG9yZGVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAc2VlIF8uZm9yT3duXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uZm9yT3duUmlnaHQobmV3IEZvbywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdiJyB0aGVuICdhJyBhc3N1bWluZyBgXy5mb3JPd25gIGxvZ3MgJ2EnIHRoZW4gJ2InLlxuICovXG5mdW5jdGlvbiBmb3JPd25SaWdodChvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvck93blJpZ2h0KG9iamVjdCwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yT3duUmlnaHQ7XG4iXX0=