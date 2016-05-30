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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSx3QkFBd0IsUUFBUSwwQkFBUixDQUF4QjtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NKLElBQUksU0FBUyxLQUFLLFVBQVMsVUFBVCxFQUFxQixTQUFyQixFQUFnQztBQUNoRCxNQUFJLGNBQWMsSUFBZCxFQUFvQjtBQUN0QixXQUFPLEVBQVAsQ0FEc0I7R0FBeEI7QUFHQSxNQUFJLFNBQVMsVUFBVSxNQUFWLENBSm1DO0FBS2hELE1BQUksU0FBUyxDQUFULElBQWMsZUFBZSxVQUFmLEVBQTJCLFVBQVUsQ0FBVixDQUEzQixFQUF5QyxVQUFVLENBQVYsQ0FBekMsQ0FBZCxFQUFzRTtBQUN4RSxnQkFBWSxFQUFaLENBRHdFO0dBQTFFLE1BRU8sSUFBSSxTQUFTLENBQVQsSUFBYyxlQUFlLFVBQVUsQ0FBVixDQUFmLEVBQTZCLFVBQVUsQ0FBVixDQUE3QixFQUEyQyxVQUFVLENBQVYsQ0FBM0MsQ0FBZCxFQUF3RTtBQUNqRixnQkFBWSxDQUFDLFVBQVUsQ0FBVixDQUFELENBQVosQ0FEaUY7R0FBNUU7QUFHUCxjQUFZLFNBQUMsQ0FBVSxNQUFWLElBQW9CLENBQXBCLElBQXlCLFFBQVEsVUFBVSxDQUFWLENBQVIsQ0FBekIsR0FDVCxVQUFVLENBQVYsQ0FEUSxHQUVSLFlBQVksU0FBWixFQUF1QixDQUF2QixFQUEwQixxQkFBMUIsQ0FGUSxDQVZvQzs7QUFjaEQsU0FBTyxZQUFZLFVBQVosRUFBd0IsU0FBeEIsRUFBbUMsRUFBbkMsQ0FBUCxDQWRnRDtDQUFoQyxDQUFkOztBQWlCSixPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoic29ydEJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBiYXNlT3JkZXJCeSA9IHJlcXVpcmUoJy4vX2Jhc2VPcmRlckJ5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzRmxhdHRlbmFibGVJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2lzRmxhdHRlbmFibGVJdGVyYXRlZScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cywgc29ydGVkIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgcmVzdWx0cyBvZlxuICogcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uIHRocnUgZWFjaCBpdGVyYXRlZS4gVGhpcyBtZXRob2RcbiAqIHBlcmZvcm1zIGEgc3RhYmxlIHNvcnQsIHRoYXQgaXMsIGl0IHByZXNlcnZlcyB0aGUgb3JpZ2luYWwgc29ydCBvcmRlciBvZlxuICogZXF1YWwgZWxlbWVudHMuIFRoZSBpdGVyYXRlZXMgYXJlIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7Li4uKEFycmF5fEFycmF5W118RnVuY3Rpb258RnVuY3Rpb25bXXxPYmplY3R8T2JqZWN0W118c3RyaW5nfHN0cmluZ1tdKX1cbiAqICBbaXRlcmF0ZWVzPVtfLmlkZW50aXR5XV0gVGhlIGl0ZXJhdGVlcyB0byBzb3J0IGJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgc29ydGVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQ4IH0sXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH0sXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM0IH1cbiAqIF07XG4gKlxuICogXy5zb3J0QnkodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8udXNlcjsgfSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbWydiYXJuZXknLCAzNl0sIFsnYmFybmV5JywgMzRdLCBbJ2ZyZWQnLCA0OF0sIFsnZnJlZCcsIDQwXV1cbiAqXG4gKiBfLnNvcnRCeSh1c2VycywgWyd1c2VyJywgJ2FnZSddKTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM0XSwgWydiYXJuZXknLCAzNl0sIFsnZnJlZCcsIDQwXSwgWydmcmVkJywgNDhdXVxuICpcbiAqIF8uc29ydEJ5KHVzZXJzLCAndXNlcicsIGZ1bmN0aW9uKG8pIHtcbiAqICAgcmV0dXJuIE1hdGguZmxvb3Ioby5hZ2UgLyAxMCk7XG4gKiB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM2XSwgWydiYXJuZXknLCAzNF0sIFsnZnJlZCcsIDQ4XSwgWydmcmVkJywgNDBdXVxuICovXG52YXIgc29ydEJ5ID0gcmVzdChmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZXMpIHtcbiAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gaXRlcmF0ZWVzLmxlbmd0aDtcbiAgaWYgKGxlbmd0aCA+IDEgJiYgaXNJdGVyYXRlZUNhbGwoY29sbGVjdGlvbiwgaXRlcmF0ZWVzWzBdLCBpdGVyYXRlZXNbMV0pKSB7XG4gICAgaXRlcmF0ZWVzID0gW107XG4gIH0gZWxzZSBpZiAobGVuZ3RoID4gMiAmJiBpc0l0ZXJhdGVlQ2FsbChpdGVyYXRlZXNbMF0sIGl0ZXJhdGVlc1sxXSwgaXRlcmF0ZWVzWzJdKSkge1xuICAgIGl0ZXJhdGVlcyA9IFtpdGVyYXRlZXNbMF1dO1xuICB9XG4gIGl0ZXJhdGVlcyA9IChpdGVyYXRlZXMubGVuZ3RoID09IDEgJiYgaXNBcnJheShpdGVyYXRlZXNbMF0pKVxuICAgID8gaXRlcmF0ZWVzWzBdXG4gICAgOiBiYXNlRmxhdHRlbihpdGVyYXRlZXMsIDEsIGlzRmxhdHRlbmFibGVJdGVyYXRlZSk7XG5cbiAgcmV0dXJuIGJhc2VPcmRlckJ5KGNvbGxlY3Rpb24sIGl0ZXJhdGVlcywgW10pO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydEJ5O1xuIl19