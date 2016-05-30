'use strict';

var baseUnset = require('./_baseUnset');

/**
 * Removes the property at `path` of `object`.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 7 } }] };
 * _.unset(object, 'a[0].b.c');
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 *
 * _.unset(object, ['a', '0', 'b', 'c']);
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 */
function unset(object, path) {
  return object == null ? true : baseUnset(object, path);
}

module.exports = unset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Vuc2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCSixTQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCO0FBQzNCLFNBQU8sVUFBVSxJQUFWLEdBQWlCLElBQWpCLEdBQXdCLFVBQVUsTUFBVixFQUFrQixJQUFsQixDQUF4QixDQURvQjtDQUE3Qjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoidW5zZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVVuc2V0ID0gcmVxdWlyZSgnLi9fYmFzZVVuc2V0Jyk7XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgcHJvcGVydHkgYXQgYHBhdGhgIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gdW5zZXQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IGlzIGRlbGV0ZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiA3IH0gfV0gfTtcbiAqIF8udW5zZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3QpO1xuICogLy8gPT4geyAnYSc6IFt7ICdiJzoge30gfV0gfTtcbiAqXG4gKiBfLnVuc2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdCk7XG4gKiAvLyA9PiB7ICdhJzogW3sgJ2InOiB7fSB9XSB9O1xuICovXG5mdW5jdGlvbiB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdHJ1ZSA6IGJhc2VVbnNldChvYmplY3QsIHBhdGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuc2V0O1xuIl19