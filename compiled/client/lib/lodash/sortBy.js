'use strict';

var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    isArray = require('./isArray'),
    isFlattenableIteratee = require('./_isFlattenableIteratee'),
    isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = rest(function (collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  iteratees = iteratees.length == 1 && isArray(iteratees[0]) ? iteratees[0] : baseFlatten(iteratees, 1, isFlattenableIteratee);

  return baseOrderBy(collection, iteratees, []);
});

module.exports = sortBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0lBQ0ksY0FBYyxRQUFRLGdCQUFSLENBRGxCO0lBRUksVUFBVSxRQUFRLFdBQVIsQ0FGZDtJQUdJLHdCQUF3QixRQUFRLDBCQUFSLENBSDVCO0lBSUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FKckI7SUFLSSxPQUFPLFFBQVEsUUFBUixDQUxYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EsSUFBSSxTQUFTLEtBQUssVUFBUyxVQUFULEVBQXFCLFNBQXJCLEVBQWdDO0FBQ2hELE1BQUksY0FBYyxJQUFsQixFQUF3QjtBQUN0QixXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksU0FBUyxVQUFVLE1BQXZCO0FBQ0EsTUFBSSxTQUFTLENBQVQsSUFBYyxlQUFlLFVBQWYsRUFBMkIsVUFBVSxDQUFWLENBQTNCLEVBQXlDLFVBQVUsQ0FBVixDQUF6QyxDQUFsQixFQUEwRTtBQUN4RSxnQkFBWSxFQUFaO0FBQ0QsR0FGRCxNQUVPLElBQUksU0FBUyxDQUFULElBQWMsZUFBZSxVQUFVLENBQVYsQ0FBZixFQUE2QixVQUFVLENBQVYsQ0FBN0IsRUFBMkMsVUFBVSxDQUFWLENBQTNDLENBQWxCLEVBQTRFO0FBQ2pGLGdCQUFZLENBQUMsVUFBVSxDQUFWLENBQUQsQ0FBWjtBQUNEO0FBQ0QsY0FBYSxVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsUUFBUSxVQUFVLENBQVYsQ0FBUixDQUExQixHQUNSLFVBQVUsQ0FBVixDQURRLEdBRVIsWUFBWSxTQUFaLEVBQXVCLENBQXZCLEVBQTBCLHFCQUExQixDQUZKOztBQUlBLFNBQU8sWUFBWSxVQUFaLEVBQXdCLFNBQXhCLEVBQW1DLEVBQW5DLENBQVA7QUFDRCxDQWZZLENBQWI7O0FBaUJBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJzb3J0QnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIGJhc2VPcmRlckJ5ID0gcmVxdWlyZSgnLi9fYmFzZU9yZGVyQnknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNGbGF0dGVuYWJsZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9faXNGbGF0dGVuYWJsZUl0ZXJhdGVlJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzLCBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSByZXN1bHRzIG9mXG4gKiBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24gdGhydSBlYWNoIGl0ZXJhdGVlLiBUaGlzIG1ldGhvZFxuICogcGVyZm9ybXMgYSBzdGFibGUgc29ydCwgdGhhdCBpcywgaXQgcHJlc2VydmVzIHRoZSBvcmlnaW5hbCBzb3J0IG9yZGVyIG9mXG4gKiBlcXVhbCBlbGVtZW50cy4gVGhlIGl0ZXJhdGVlcyBhcmUgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHsuLi4oQXJyYXl8QXJyYXlbXXxGdW5jdGlvbnxGdW5jdGlvbltdfE9iamVjdHxPYmplY3RbXXxzdHJpbmd8c3RyaW5nW10pfVxuICogIFtpdGVyYXRlZXM9W18uaWRlbnRpdHldXSBUaGUgaXRlcmF0ZWVzIHRvIHNvcnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBzb3J0ZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDggfSxcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAgfSxcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzQgfVxuICogXTtcbiAqXG4gKiBfLnNvcnRCeSh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby51c2VyOyB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM2XSwgWydiYXJuZXknLCAzNF0sIFsnZnJlZCcsIDQ4XSwgWydmcmVkJywgNDBdXVxuICpcbiAqIF8uc29ydEJ5KHVzZXJzLCBbJ3VzZXInLCAnYWdlJ10pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgW1snYmFybmV5JywgMzRdLCBbJ2Jhcm5leScsIDM2XSwgWydmcmVkJywgNDBdLCBbJ2ZyZWQnLCA0OF1dXG4gKlxuICogXy5zb3J0QnkodXNlcnMsICd1c2VyJywgZnVuY3Rpb24obykge1xuICogICByZXR1cm4gTWF0aC5mbG9vcihvLmFnZSAvIDEwKTtcbiAqIH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgW1snYmFybmV5JywgMzZdLCBbJ2Jhcm5leScsIDM0XSwgWydmcmVkJywgNDhdLCBbJ2ZyZWQnLCA0MF1dXG4gKi9cbnZhciBzb3J0QnkgPSByZXN0KGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlcykge1xuICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHZhciBsZW5ndGggPSBpdGVyYXRlZXMubGVuZ3RoO1xuICBpZiAobGVuZ3RoID4gMSAmJiBpc0l0ZXJhdGVlQ2FsbChjb2xsZWN0aW9uLCBpdGVyYXRlZXNbMF0sIGl0ZXJhdGVlc1sxXSkpIHtcbiAgICBpdGVyYXRlZXMgPSBbXTtcbiAgfSBlbHNlIGlmIChsZW5ndGggPiAyICYmIGlzSXRlcmF0ZWVDYWxsKGl0ZXJhdGVlc1swXSwgaXRlcmF0ZWVzWzFdLCBpdGVyYXRlZXNbMl0pKSB7XG4gICAgaXRlcmF0ZWVzID0gW2l0ZXJhdGVlc1swXV07XG4gIH1cbiAgaXRlcmF0ZWVzID0gKGl0ZXJhdGVlcy5sZW5ndGggPT0gMSAmJiBpc0FycmF5KGl0ZXJhdGVlc1swXSkpXG4gICAgPyBpdGVyYXRlZXNbMF1cbiAgICA6IGJhc2VGbGF0dGVuKGl0ZXJhdGVlcywgMSwgaXNGbGF0dGVuYWJsZUl0ZXJhdGVlKTtcblxuICByZXR1cm4gYmFzZU9yZGVyQnkoY29sbGVjdGlvbiwgaXRlcmF0ZWVzLCBbXSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0Qnk7XG4iXX0=