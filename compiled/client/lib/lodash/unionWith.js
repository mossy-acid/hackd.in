'use strict';

var baseFlatten = require('./_baseFlatten'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var unionWith = rest(function (arrays) {
  var comparator = last(arrays);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});

module.exports = unionWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuaW9uV2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0lBQ0ksV0FBVyxRQUFRLGFBQVIsQ0FEZjtJQUVJLG9CQUFvQixRQUFRLHFCQUFSLENBRnhCO0lBR0ksT0FBTyxRQUFRLFFBQVIsQ0FIWDtJQUlJLE9BQU8sUUFBUSxRQUFSLENBSlg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSSxZQUFZLEtBQUssVUFBUyxNQUFULEVBQWlCO0FBQ3BDLE1BQUksYUFBYSxLQUFLLE1BQUwsQ0FBakI7QUFDQSxNQUFJLGtCQUFrQixVQUFsQixDQUFKLEVBQW1DO0FBQ2pDLGlCQUFhLFNBQWI7QUFDRDtBQUNELFNBQU8sU0FBUyxZQUFZLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsaUJBQXZCLEVBQTBDLElBQTFDLENBQVQsRUFBMEQsU0FBMUQsRUFBcUUsVUFBckUsQ0FBUDtBQUNELENBTmUsQ0FBaEI7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6InVuaW9uV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVVuaXEgPSByZXF1aXJlKCcuL19iYXNlVW5pcScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy51bmlvbmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY29tcGFyYXRvcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gY29tcGFyZSBlbGVtZW50cyBvZiBgYXJyYXlzYC4gVGhlIGNvbXBhcmF0b3IgaXMgaW52b2tlZFxuICogd2l0aCB0d28gYXJndW1lbnRzOiAoYXJyVmFsLCBvdGhWYWwpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBjb21iaW5lZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ3gnOiAxLCAneSc6IDIgfSwgeyAneCc6IDIsICd5JzogMSB9XTtcbiAqIHZhciBvdGhlcnMgPSBbeyAneCc6IDEsICd5JzogMSB9LCB7ICd4JzogMSwgJ3knOiAyIH1dO1xuICpcbiAqIF8udW5pb25XaXRoKG9iamVjdHMsIG90aGVycywgXy5pc0VxdWFsKTtcbiAqIC8vID0+IFt7ICd4JzogMSwgJ3knOiAyIH0sIHsgJ3gnOiAyLCAneSc6IDEgfSwgeyAneCc6IDEsICd5JzogMSB9XVxuICovXG52YXIgdW5pb25XaXRoID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBsYXN0KGFycmF5cyk7XG4gIGlmIChpc0FycmF5TGlrZU9iamVjdChjb21wYXJhdG9yKSkge1xuICAgIGNvbXBhcmF0b3IgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGJhc2VVbmlxKGJhc2VGbGF0dGVuKGFycmF5cywgMSwgaXNBcnJheUxpa2VPYmplY3QsIHRydWUpLCB1bmRlZmluZWQsIGNvbXBhcmF0b3IpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pb25XaXRoO1xuIl19