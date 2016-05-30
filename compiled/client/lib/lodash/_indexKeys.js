'use strict';

var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) && (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pbmRleEtleXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxjQUFjLFFBQVEsZUFBUixDQUFkO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7Ozs7Ozs7O0FBVUosU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCO0FBQ3pCLE1BQUksU0FBUyxTQUFTLE9BQU8sTUFBUCxHQUFnQixTQUF6QixDQURZO0FBRXpCLE1BQUksU0FBUyxNQUFULE1BQ0MsUUFBUSxNQUFSLEtBQW1CLFNBQVMsTUFBVCxDQUFuQixJQUF1QyxZQUFZLE1BQVosQ0FBdkMsQ0FERCxFQUM4RDtBQUNoRSxXQUFPLFVBQVUsTUFBVixFQUFrQixNQUFsQixDQUFQLENBRGdFO0dBRGxFO0FBSUEsU0FBTyxJQUFQLENBTnlCO0NBQTNCOztBQVNBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfaW5kZXhLZXlzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGluZGV4IGtleXMgZm9yIGBvYmplY3RgIHZhbHVlcyBvZiBhcnJheXMsXG4gKiBgYXJndW1lbnRzYCBvYmplY3RzLCBhbmQgc3RyaW5ncywgb3RoZXJ3aXNlIGBudWxsYCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fG51bGx9IFJldHVybnMgaW5kZXgga2V5cywgZWxzZSBgbnVsbGAuXG4gKi9cbmZ1bmN0aW9uIGluZGV4S2V5cyhvYmplY3QpIHtcbiAgdmFyIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiB1bmRlZmluZWQ7XG4gIGlmIChpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzU3RyaW5nKG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSkpIHtcbiAgICByZXR1cm4gYmFzZVRpbWVzKGxlbmd0aCwgU3RyaW5nKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmRleEtleXM7XG4iXX0=