'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseWhile = require('./_baseWhile');

/**
 * Creates a slice of `array` with elements taken from the end. Elements are
 * taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.takeRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeRightWhile(users, ['active', false]);
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeRightWhile(users, 'active');
 * // => []
 */
function takeRightWhile(array, predicate) {
    return array && array.length ? baseWhile(array, baseIteratee(predicate, 3), false, true) : [];
}

module.exports = takeRightWhile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Rha2VSaWdodFdoaWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NKLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQixTQUEvQixFQUEwQztBQUN4QyxXQUFPLEtBQUMsSUFBUyxNQUFNLE1BQU4sR0FDYixVQUFVLEtBQVYsRUFBaUIsYUFBYSxTQUFiLEVBQXdCLENBQXhCLENBQWpCLEVBQTZDLEtBQTdDLEVBQW9ELElBQXBELENBREcsR0FFSCxFQUZHLENBRGlDO0NBQTFDOztBQU1BLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJ0YWtlUmlnaHRXaGlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlV2hpbGUgPSByZXF1aXJlKCcuL19iYXNlV2hpbGUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGVsZW1lbnRzIHRha2VuIGZyb20gdGhlIGVuZC4gRWxlbWVudHMgYXJlXG4gKiB0YWtlbiB1bnRpbCBgcHJlZGljYXRlYCByZXR1cm5zIGZhbHNleS4gVGhlIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGhcbiAqIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IGZhbHNlIH1cbiAqIF07XG4gKlxuICogXy50YWtlUmlnaHRXaGlsZSh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gIW8uYWN0aXZlOyB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnZnJlZCcsICdwZWJibGVzJ11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy50YWtlUmlnaHRXaGlsZSh1c2VycywgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IGZhbHNlIH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydwZWJibGVzJ11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLnRha2VSaWdodFdoaWxlKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2ZyZWQnLCAncGViYmxlcyddXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLnRha2VSaWdodFdoaWxlKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0YWtlUmlnaHRXaGlsZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVdoaWxlKGFycmF5LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgZmFsc2UsIHRydWUpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0YWtlUmlnaHRXaGlsZTtcbiJdfQ==