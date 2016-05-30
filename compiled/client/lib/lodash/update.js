'use strict';

var baseUpdate = require('./_baseUpdate'),
    castFunction = require('./_castFunction');

/**
 * This method is like `_.set` except that accepts `updater` to produce the
 * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
 * is invoked with one argument: (value).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {Function} updater The function to produce the updated value.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.update(object, 'a[0].b.c', function(n) { return n * n; });
 * console.log(object.a[0].b.c);
 * // => 9
 *
 * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
 * console.log(object.x[0].y.z);
 * // => 0
 */
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}

module.exports = update;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VwZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7SUFDSSxlQUFlLFFBQVEsaUJBQVIsQ0FEbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QztBQUNyQyxTQUFPLFVBQVUsSUFBVixHQUFpQixNQUFqQixHQUEwQixXQUFXLE1BQVgsRUFBbUIsSUFBbkIsRUFBeUIsYUFBYSxPQUFiLENBQXpCLENBQWpDO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6InVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlVXBkYXRlID0gcmVxdWlyZSgnLi9fYmFzZVVwZGF0ZScpLFxuICAgIGNhc3RGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2Nhc3RGdW5jdGlvbicpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uc2V0YCBleGNlcHQgdGhhdCBhY2NlcHRzIGB1cGRhdGVyYCB0byBwcm9kdWNlIHRoZVxuICogdmFsdWUgdG8gc2V0LiBVc2UgYF8udXBkYXRlV2l0aGAgdG8gY3VzdG9taXplIGBwYXRoYCBjcmVhdGlvbi4gVGhlIGB1cGRhdGVyYFxuICogaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHNldC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHVwZGF0ZXIgVGhlIGZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIHVwZGF0ZWQgdmFsdWUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8udXBkYXRlKG9iamVjdCwgJ2FbMF0uYi5jJywgZnVuY3Rpb24obikgeyByZXR1cm4gbiAqIG47IH0pO1xuICogY29uc29sZS5sb2cob2JqZWN0LmFbMF0uYi5jKTtcbiAqIC8vID0+IDlcbiAqXG4gKiBfLnVwZGF0ZShvYmplY3QsICd4WzBdLnkueicsIGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4gPyBuICsgMSA6IDA7IH0pO1xuICogY29uc29sZS5sb2cob2JqZWN0LnhbMF0ueS56KTtcbiAqIC8vID0+IDBcbiAqL1xuZnVuY3Rpb24gdXBkYXRlKG9iamVjdCwgcGF0aCwgdXBkYXRlcikge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBvYmplY3QgOiBiYXNlVXBkYXRlKG9iamVjdCwgcGF0aCwgY2FzdEZ1bmN0aW9uKHVwZGF0ZXIpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGU7XG4iXX0=