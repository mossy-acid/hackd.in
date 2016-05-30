'use strict';

var apply = require('./_apply'),
    baseEach = require('./_baseEach'),
    baseInvoke = require('./_baseInvoke'),
    isArrayLike = require('./isArrayLike'),
    isKey = require('./_isKey'),
    rest = require('./rest');

/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `methodName` is a function, it's
 * invoked for and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke each method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invokeMap([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invokeMap = rest(function (collection, path, args) {
    var index = -1,
        isFunc = typeof path == 'function',
        isProp = isKey(path),
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function (value) {
        var func = isFunc ? path : isProp && value != null ? value[path] : undefined;
        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
    });
    return result;
});

module.exports = invokeMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludm9rZU1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBWjtJQUNJLFdBQVcsUUFBUSxhQUFSLENBRGY7SUFFSSxhQUFhLFFBQVEsZUFBUixDQUZqQjtJQUdJLGNBQWMsUUFBUSxlQUFSLENBSGxCO0lBSUksUUFBUSxRQUFRLFVBQVIsQ0FKWjtJQUtJLE9BQU8sUUFBUSxRQUFSLENBTFg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsSUFBSSxZQUFZLEtBQUssVUFBUyxVQUFULEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDO0FBQ3BELFFBQUksUUFBUSxDQUFDLENBQWI7UUFDSSxTQUFTLE9BQU8sSUFBUCxJQUFlLFVBRDVCO1FBRUksU0FBUyxNQUFNLElBQU4sQ0FGYjtRQUdJLFNBQVMsWUFBWSxVQUFaLElBQTBCLE1BQU0sV0FBVyxNQUFqQixDQUExQixHQUFxRCxFQUhsRTs7QUFLQSxhQUFTLFVBQVQsRUFBcUIsVUFBUyxLQUFULEVBQWdCO0FBQ25DLFlBQUksT0FBTyxTQUFTLElBQVQsR0FBa0IsVUFBVSxTQUFTLElBQXBCLEdBQTRCLE1BQU0sSUFBTixDQUE1QixHQUEwQyxTQUF0RTtBQUNBLGVBQU8sRUFBRSxLQUFULElBQWtCLE9BQU8sTUFBTSxJQUFOLEVBQVksS0FBWixFQUFtQixJQUFuQixDQUFQLEdBQWtDLFdBQVcsS0FBWCxFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFwRDtBQUNELEtBSEQ7QUFJQSxXQUFPLE1BQVA7QUFDRCxDQVhlLENBQWhCOztBQWFBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJpbnZva2VNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBiYXNlSW52b2tlID0gcmVxdWlyZSgnLi9fYmFzZUludm9rZScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogSW52b2tlcyB0aGUgbWV0aG9kIGF0IGBwYXRoYCBvZiBlYWNoIGVsZW1lbnQgaW4gYGNvbGxlY3Rpb25gLCByZXR1cm5pbmdcbiAqIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggaW52b2tlZCBtZXRob2QuIEFueSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICogYXJlIHByb3ZpZGVkIHRvIGVhY2ggaW52b2tlZCBtZXRob2QuIElmIGBtZXRob2ROYW1lYCBpcyBhIGZ1bmN0aW9uLCBpdCdzXG4gKiBpbnZva2VkIGZvciBhbmQgYHRoaXNgIGJvdW5kIHRvLCBlYWNoIGVsZW1lbnQgaW4gYGNvbGxlY3Rpb25gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgbWV0aG9kIHRvIGludm9rZSBvclxuICogIHRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0gey4uLip9IFthcmdzXSBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBlYWNoIG1ldGhvZCB3aXRoLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmludm9rZU1hcChbWzUsIDEsIDddLCBbMywgMiwgMV1dLCAnc29ydCcpO1xuICogLy8gPT4gW1sxLCA1LCA3XSwgWzEsIDIsIDNdXVxuICpcbiAqIF8uaW52b2tlTWFwKFsxMjMsIDQ1Nl0sIFN0cmluZy5wcm90b3R5cGUuc3BsaXQsICcnKTtcbiAqIC8vID0+IFtbJzEnLCAnMicsICczJ10sIFsnNCcsICc1JywgJzYnXV1cbiAqL1xudmFyIGludm9rZU1hcCA9IHJlc3QoZnVuY3Rpb24oY29sbGVjdGlvbiwgcGF0aCwgYXJncykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGlzRnVuYyA9IHR5cGVvZiBwYXRoID09ICdmdW5jdGlvbicsXG4gICAgICBpc1Byb3AgPSBpc0tleShwYXRoKSxcbiAgICAgIHJlc3VsdCA9IGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID8gQXJyYXkoY29sbGVjdGlvbi5sZW5ndGgpIDogW107XG5cbiAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IHBhdGggOiAoKGlzUHJvcCAmJiB2YWx1ZSAhPSBudWxsKSA/IHZhbHVlW3BhdGhdIDogdW5kZWZpbmVkKTtcbiAgICByZXN1bHRbKytpbmRleF0gPSBmdW5jID8gYXBwbHkoZnVuYywgdmFsdWUsIGFyZ3MpIDogYmFzZUludm9rZSh2YWx1ZSwgcGF0aCwgYXJncyk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW52b2tlTWFwO1xuIl19