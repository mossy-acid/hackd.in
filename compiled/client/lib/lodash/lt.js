'use strict';

var baseLt = require('./_baseLt'),
    createRelationalOperation = require('./_createRelationalOperation');

/**
 * Checks if `value` is less than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 * @see _.gt
 * @example
 *
 * _.lt(1, 3);
 * // => true
 *
 * _.lt(3, 3);
 * // => false
 *
 * _.lt(3, 1);
 * // => false
 */
var lt = createRelationalOperation(baseLt);

module.exports = lt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2x0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsNEJBQTRCLFFBQVEsOEJBQVIsQ0FBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosSUFBSSxLQUFLLDBCQUEwQixNQUExQixDQUFMOztBQUVKLE9BQU8sT0FBUCxHQUFpQixFQUFqQiIsImZpbGUiOiJsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlTHQgPSByZXF1aXJlKCcuL19iYXNlTHQnKSxcbiAgICBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBgb3RoZXJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy45LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBgb3RoZXJgLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBzZWUgXy5ndFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmx0KDEsIDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8ubHQoMywgMyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8ubHQoMywgMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgbHQgPSBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uKGJhc2VMdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbHQ7XG4iXX0=