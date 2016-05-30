'use strict';

var arraySome = require('./_arraySome'),
    createOver = require('./_createOver');

/**
 * Creates a function that checks if **any** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [predicates=[_.identity]] The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overSome([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => true
 *
 * func(NaN);
 * // => false
 */
var overSome = createOver(arraySome);

module.exports = overSome;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXJTb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLGFBQWEsUUFBUSxlQUFSLENBRGpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFJLFdBQVcsV0FBVyxTQUFYLENBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Im92ZXJTb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpLFxuICAgIGNyZWF0ZU92ZXIgPSByZXF1aXJlKCcuL19jcmVhdGVPdmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmICoqYW55Kiogb2YgdGhlIGBwcmVkaWNhdGVzYCByZXR1cm5cbiAqIHRydXRoeSB3aGVuIGludm9rZWQgd2l0aCB0aGUgYXJndW1lbnRzIGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0gey4uLihBcnJheXxBcnJheVtdfEZ1bmN0aW9ufEZ1bmN0aW9uW118T2JqZWN0fE9iamVjdFtdfHN0cmluZ3xzdHJpbmdbXSl9XG4gKiAgW3ByZWRpY2F0ZXM9W18uaWRlbnRpdHldXSBUaGUgcHJlZGljYXRlcyB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgZnVuYyA9IF8ub3ZlclNvbWUoW0Jvb2xlYW4sIGlzRmluaXRlXSk7XG4gKlxuICogZnVuYygnMScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGZ1bmMobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogZnVuYyhOYU4pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIG92ZXJTb21lID0gY3JlYXRlT3ZlcihhcnJheVNvbWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJTb21lO1xuIl19