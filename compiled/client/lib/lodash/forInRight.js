'use strict';

var baseForRight = require('./_baseForRight'),
    baseIteratee = require('./_baseIteratee'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.forIn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forInRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
 */
function forInRight(object, iteratee) {
    return object == null ? object : baseForRight(object, baseIteratee(iteratee, 3), keysIn);
}

module.exports = forInRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZvckluUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxTQUFTLFFBQVEsVUFBUixDQUFUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJKLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixRQUE1QixFQUFzQztBQUNwQyxXQUFPLFVBQVUsSUFBVixHQUNILE1BREcsR0FFSCxhQUFhLE1BQWIsRUFBcUIsYUFBYSxRQUFiLEVBQXVCLENBQXZCLENBQXJCLEVBQWdELE1BQWhELENBRkcsQ0FENkI7Q0FBdEM7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6ImZvckluUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZvclJpZ2h0ID0gcmVxdWlyZSgnLi9fYmFzZUZvclJpZ2h0JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZvckluYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIHByb3BlcnRpZXMgb2ZcbiAqIGBvYmplY3RgIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQHNlZSBfLmZvckluXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uZm9ySW5SaWdodChuZXcgRm9vLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2MnLCAnYicsIHRoZW4gJ2EnIGFzc3VtaW5nIGBfLmZvckluYCBsb2dzICdhJywgJ2InLCB0aGVuICdjJy5cbiAqL1xuZnVuY3Rpb24gZm9ySW5SaWdodChvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlRm9yUmlnaHQob2JqZWN0LCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDMpLCBrZXlzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckluUmlnaHQ7XG4iXX0=