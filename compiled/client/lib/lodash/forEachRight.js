'use strict';

var arrayEachRight = require('./_arrayEachRight'),
    baseEachRight = require('./_baseEachRight'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEachRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZvckVhY2hSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBckI7SUFDSSxnQkFBZ0IsUUFBUSxrQkFBUixDQURwQjtJQUVJLGVBQWUsUUFBUSxpQkFBUixDQUZuQjtJQUdJLFVBQVUsUUFBUSxXQUFSLENBSGQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsU0FBUyxZQUFULENBQXNCLFVBQXRCLEVBQWtDLFFBQWxDLEVBQTRDO0FBQzFDLE1BQUksT0FBTyxRQUFRLFVBQVIsSUFBc0IsY0FBdEIsR0FBdUMsYUFBbEQ7QUFDQSxTQUFPLEtBQUssVUFBTCxFQUFpQixhQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBakIsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJmb3JFYWNoUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlFYWNoUmlnaHQgPSByZXF1aXJlKCcuL19hcnJheUVhY2hSaWdodCcpLFxuICAgIGJhc2VFYWNoUmlnaHQgPSByZXF1aXJlKCcuL19iYXNlRWFjaFJpZ2h0JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZm9yRWFjaGAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZlxuICogYGNvbGxlY3Rpb25gIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAYWxpYXMgZWFjaFJpZ2h0XG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaFJpZ2h0KFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAyYCB0aGVuIGAxYC5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaFJpZ2h0KGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaFJpZ2h0IDogYmFzZUVhY2hSaWdodDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaFJpZ2h0O1xuIl19