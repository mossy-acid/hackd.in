'use strict';

var baseGt = require('./_baseGt'),
    createRelationalOperation = require('./_createRelationalOperation');

/**
 * Checks if `value` is greater than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 * @see _.lt
 * @example
 *
 * _.gt(3, 1);
 * // => true
 *
 * _.gt(3, 3);
 * // => false
 *
 * _.gt(1, 3);
 * // => false
 */
var gt = createRelationalOperation(baseGt);

module.exports = gt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2d0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsNEJBQTRCLFFBQVEsOEJBQVIsQ0FBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosSUFBSSxLQUFLLDBCQUEwQixNQUExQixDQUFMOztBQUVKLE9BQU8sT0FBUCxHQUFpQixFQUFqQiIsImZpbGUiOiJndC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlR3QgPSByZXF1aXJlKCcuL19iYXNlR3QnKSxcbiAgICBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBgb3RoZXJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy45LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBgb3RoZXJgLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBzZWUgXy5sdFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmd0KDMsIDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZ3QoMywgMyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZ3QoMSwgMyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgZ3QgPSBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uKGJhc2VHdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ3Q7XG4iXX0=