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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludm9rZU1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsY0FBYyxRQUFRLGVBQVIsQ0FBZDtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJKLElBQUksWUFBWSxLQUFLLFVBQVMsVUFBVCxFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQztBQUNwRCxRQUFJLFFBQVEsQ0FBQyxDQUFEO1FBQ1IsU0FBUyxPQUFPLElBQVAsSUFBZSxVQUFmO1FBQ1QsU0FBUyxNQUFNLElBQU4sQ0FBVDtRQUNBLFNBQVMsWUFBWSxVQUFaLElBQTBCLE1BQU0sV0FBVyxNQUFYLENBQWhDLEdBQXFELEVBQXJELENBSnVDOztBQU1wRCxhQUFTLFVBQVQsRUFBcUIsVUFBUyxLQUFULEVBQWdCO0FBQ25DLFlBQUksT0FBTyxTQUFTLElBQVQsR0FBaUIsTUFBQyxJQUFVLFNBQVMsSUFBVCxHQUFpQixNQUFNLElBQU4sQ0FBNUIsR0FBMEMsU0FBMUMsQ0FETztBQUVuQyxlQUFPLEVBQUUsS0FBRixDQUFQLEdBQWtCLE9BQU8sTUFBTSxJQUFOLEVBQVksS0FBWixFQUFtQixJQUFuQixDQUFQLEdBQWtDLFdBQVcsS0FBWCxFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFsQyxDQUZpQjtLQUFoQixDQUFyQixDQU5vRDtBQVVwRCxXQUFPLE1BQVAsQ0FWb0Q7Q0FBakMsQ0FBakI7O0FBYUosT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Imludm9rZU1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5JyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGJhc2VJbnZva2UgPSByZXF1aXJlKCcuL19iYXNlSW52b2tlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBJbnZva2VzIHRoZSBtZXRob2QgYXQgYHBhdGhgIG9mIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAsIHJldHVybmluZ1xuICogYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBpbnZva2VkIG1ldGhvZC4gQW55IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKiBhcmUgcHJvdmlkZWQgdG8gZWFjaCBpbnZva2VkIG1ldGhvZC4gSWYgYG1ldGhvZE5hbWVgIGlzIGEgZnVuY3Rpb24sIGl0J3NcbiAqIGludm9rZWQgZm9yIGFuZCBgdGhpc2AgYm91bmQgdG8sIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBtZXRob2QgdG8gaW52b2tlIG9yXG4gKiAgdGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGVhY2ggbWV0aG9kIHdpdGguXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW52b2tlTWFwKFtbNSwgMSwgN10sIFszLCAyLCAxXV0sICdzb3J0Jyk7XG4gKiAvLyA9PiBbWzEsIDUsIDddLCBbMSwgMiwgM11dXG4gKlxuICogXy5pbnZva2VNYXAoWzEyMywgNDU2XSwgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCwgJycpO1xuICogLy8gPT4gW1snMScsICcyJywgJzMnXSwgWyc0JywgJzUnLCAnNiddXVxuICovXG52YXIgaW52b2tlTWFwID0gcmVzdChmdW5jdGlvbihjb2xsZWN0aW9uLCBwYXRoLCBhcmdzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaXNGdW5jID0gdHlwZW9mIHBhdGggPT0gJ2Z1bmN0aW9uJyxcbiAgICAgIGlzUHJvcCA9IGlzS2V5KHBhdGgpLFxuICAgICAgcmVzdWx0ID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBBcnJheShjb2xsZWN0aW9uLmxlbmd0aCkgOiBbXTtcblxuICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBmdW5jID0gaXNGdW5jID8gcGF0aCA6ICgoaXNQcm9wICYmIHZhbHVlICE9IG51bGwpID8gdmFsdWVbcGF0aF0gOiB1bmRlZmluZWQpO1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IGZ1bmMgPyBhcHBseShmdW5jLCB2YWx1ZSwgYXJncykgOiBiYXNlSW52b2tlKHZhbHVlLCBwYXRoLCBhcmdzKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZva2VNYXA7XG4iXX0=