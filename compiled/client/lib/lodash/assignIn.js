'use strict';

var assignValue = require('./_assignValue'),
    copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    isArrayLike = require('./isArrayLike'),
    isPrototype = require('./_isPrototype'),
    keysIn = require('./keysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * function Bar() {
 *   this.d = 4;
 * }
 *
 * Foo.prototype.c = 3;
 * Bar.prototype.e = 5;
 *
 * _.assignIn({ 'a': 1 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
 */
var assignIn = createAssigner(function (object, source) {
  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keysIn(source), object);
    return;
  }
  for (var key in source) {
    assignValue(object, key, source[key]);
  }
});

module.exports = assignIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Fzc2lnbkluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxhQUFhLFFBQVEsZUFBUixDQURqQjtJQUVJLGlCQUFpQixRQUFRLG1CQUFSLENBRnJCO0lBR0ksY0FBYyxRQUFRLGVBQVIsQ0FIbEI7SUFJSSxjQUFjLFFBQVEsZ0JBQVIsQ0FKbEI7SUFLSSxTQUFTLFFBQVEsVUFBUixDQUxiOzs7QUFRQSxJQUFJLGNBQWMsT0FBTyxTQUF6Qjs7O0FBR0EsSUFBSSx1QkFBdUIsWUFBWSxvQkFBdkM7OztBQUdBLElBQUksaUJBQWlCLENBQUMscUJBQXFCLElBQXJCLENBQTBCLEVBQUUsV0FBVyxDQUFiLEVBQTFCLEVBQTRDLFNBQTVDLENBQXRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0EsSUFBSSxXQUFXLGVBQWUsVUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3JELE1BQUksa0JBQWtCLFlBQVksTUFBWixDQUFsQixJQUF5QyxZQUFZLE1BQVosQ0FBN0MsRUFBa0U7QUFDaEUsZUFBVyxNQUFYLEVBQW1CLE9BQU8sTUFBUCxDQUFuQixFQUFtQyxNQUFuQztBQUNBO0FBQ0Q7QUFDRCxPQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUN0QixnQkFBWSxNQUFaLEVBQW9CLEdBQXBCLEVBQXlCLE9BQU8sR0FBUCxDQUF6QjtBQUNEO0FBQ0YsQ0FSYyxDQUFmOztBQVVBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJhc3NpZ25Jbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFzc2lnbmVyJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKiBEZXRlY3QgaWYgcHJvcGVydGllcyBzaGFkb3dpbmcgdGhvc2Ugb24gYE9iamVjdC5wcm90b3R5cGVgIGFyZSBub24tZW51bWVyYWJsZS4gKi9cbnZhciBub25FbnVtU2hhZG93cyA9ICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgJ3ZhbHVlT2YnOiAxIH0sICd2YWx1ZU9mJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5hc3NpZ25gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgb3duIGFuZFxuICogaW5oZXJpdGVkIHNvdXJjZSBwcm9wZXJ0aWVzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBhbGlhcyBleHRlbmRcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5hc3NpZ25cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIEJhcigpIHtcbiAqICAgdGhpcy5kID0gNDtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICogQmFyLnByb3RvdHlwZS5lID0gNTtcbiAqXG4gKiBfLmFzc2lnbkluKHsgJ2EnOiAxIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzLCAnZCc6IDQsICdlJzogNSB9XG4gKi9cbnZhciBhc3NpZ25JbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlKSB7XG4gIGlmIChub25FbnVtU2hhZG93cyB8fCBpc1Byb3RvdHlwZShzb3VyY2UpIHx8IGlzQXJyYXlMaWtlKHNvdXJjZSkpIHtcbiAgICBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgc291cmNlW2tleV0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25JbjtcbiJdfQ==