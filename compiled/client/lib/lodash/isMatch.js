'use strict';

var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData');

/**
 * Performs a partial deep comparison between `object` and `source` to
 * determine if `object` contains equivalent property values. This method is
 * equivalent to a `_.matches` function when `source` is partially applied.
 *
 * **Note:** This method supports comparing the same values as `_.isEqual`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.isMatch(object, { 'age': 40 });
 * // => true
 *
 * _.isMatch(object, { 'age': 36 });
 * // => false
 */
function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

module.exports = isMatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTWF0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJKLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQztBQUMvQixTQUFPLFdBQVcsTUFBWCxJQUFxQixZQUFZLE1BQVosRUFBb0IsTUFBcEIsRUFBNEIsYUFBYSxNQUFiLENBQTVCLENBQXJCLENBRHdCO0NBQWpDOztBQUlBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJpc01hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VJc01hdGNoID0gcmVxdWlyZSgnLi9fYmFzZUlzTWF0Y2gnKSxcbiAgICBnZXRNYXRjaERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXRjaERhdGEnKTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIHBhcnRpYWwgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gYG9iamVjdGAgYW5kIGBzb3VyY2VgIHRvXG4gKiBkZXRlcm1pbmUgaWYgYG9iamVjdGAgY29udGFpbnMgZXF1aXZhbGVudCBwcm9wZXJ0eSB2YWx1ZXMuIFRoaXMgbWV0aG9kIGlzXG4gKiBlcXVpdmFsZW50IHRvIGEgYF8ubWF0Y2hlc2AgZnVuY3Rpb24gd2hlbiBgc291cmNlYCBpcyBwYXJ0aWFsbHkgYXBwbGllZC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyBgXy5pc0VxdWFsYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9O1xuICpcbiAqIF8uaXNNYXRjaChvYmplY3QsIHsgJ2FnZSc6IDQwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNNYXRjaChvYmplY3QsIHsgJ2FnZSc6IDM2IH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNNYXRjaChvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIGdldE1hdGNoRGF0YShzb3VyY2UpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hdGNoO1xuIl19