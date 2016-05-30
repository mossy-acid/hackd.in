'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    baseLodash = require('./_baseLodash'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike'),
    wrapperClone = require('./_wrapperClone');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array of at least `200` elements
 * and any iteratees accept only one argument. The heuristic for whether a
 * section qualifies for shortcut fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `divide`, `each`,
 * `eachRight`, `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`,
 * `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `first`,
 * `floor`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`,
 * `forOwnRight`, `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`,
 * `includes`, `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`,
 * `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`,
 * `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`,
 * `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMap`,
 * `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJMb2Rhc2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLGVBQWUsUUFBUSxnQkFBUixDQUFmO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7OztBQUdKLElBQUksY0FBYyxPQUFPLFNBQVA7OztBQUdsQixJQUFJLGlCQUFpQixZQUFZLGNBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUhyQixTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDckIsTUFBSSxhQUFhLEtBQWIsS0FBdUIsQ0FBQyxRQUFRLEtBQVIsQ0FBRCxJQUFtQixFQUFFLGlCQUFpQixXQUFqQixDQUFGLEVBQWlDO0FBQzdFLFFBQUksaUJBQWlCLGFBQWpCLEVBQWdDO0FBQ2xDLGFBQU8sS0FBUCxDQURrQztLQUFwQztBQUdBLFFBQUksZUFBZSxJQUFmLENBQW9CLEtBQXBCLEVBQTJCLGFBQTNCLENBQUosRUFBK0M7QUFDN0MsYUFBTyxhQUFhLEtBQWIsQ0FBUCxDQUQ2QztLQUEvQztHQUpGO0FBUUEsU0FBTyxJQUFJLGFBQUosQ0FBa0IsS0FBbEIsQ0FBUCxDQVRxQjtDQUF2Qjs7O0FBYUEsT0FBTyxTQUFQLEdBQW1CLFdBQVcsU0FBWDtBQUNuQixPQUFPLFNBQVAsQ0FBaUIsV0FBakIsR0FBK0IsTUFBL0I7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6IndyYXBwZXJMb2Rhc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGF6eVdyYXBwZXIgPSByZXF1aXJlKCcuL19MYXp5V3JhcHBlcicpLFxuICAgIExvZGFzaFdyYXBwZXIgPSByZXF1aXJlKCcuL19Mb2Rhc2hXcmFwcGVyJyksXG4gICAgYmFzZUxvZGFzaCA9IHJlcXVpcmUoJy4vX2Jhc2VMb2Rhc2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICB3cmFwcGVyQ2xvbmUgPSByZXF1aXJlKCcuL193cmFwcGVyQ2xvbmUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGxvZGFzaGAgb2JqZWN0IHdoaWNoIHdyYXBzIGB2YWx1ZWAgdG8gZW5hYmxlIGltcGxpY2l0IG1ldGhvZFxuICogY2hhaW4gc2VxdWVuY2VzLiBNZXRob2RzIHRoYXQgb3BlcmF0ZSBvbiBhbmQgcmV0dXJuIGFycmF5cywgY29sbGVjdGlvbnMsXG4gKiBhbmQgZnVuY3Rpb25zIGNhbiBiZSBjaGFpbmVkIHRvZ2V0aGVyLiBNZXRob2RzIHRoYXQgcmV0cmlldmUgYSBzaW5nbGUgdmFsdWVcbiAqIG9yIG1heSByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUgd2lsbCBhdXRvbWF0aWNhbGx5IGVuZCB0aGUgY2hhaW4gc2VxdWVuY2VcbiAqIGFuZCByZXR1cm4gdGhlIHVud3JhcHBlZCB2YWx1ZS4gT3RoZXJ3aXNlLCB0aGUgdmFsdWUgbXVzdCBiZSB1bndyYXBwZWRcbiAqIHdpdGggYF8jdmFsdWVgLlxuICpcbiAqIEV4cGxpY2l0IGNoYWluIHNlcXVlbmNlcywgd2hpY2ggbXVzdCBiZSB1bndyYXBwZWQgd2l0aCBgXyN2YWx1ZWAsIG1heSBiZVxuICogZW5hYmxlZCB1c2luZyBgXy5jaGFpbmAuXG4gKlxuICogVGhlIGV4ZWN1dGlvbiBvZiBjaGFpbmVkIG1ldGhvZHMgaXMgbGF6eSwgdGhhdCBpcywgaXQncyBkZWZlcnJlZCB1bnRpbFxuICogYF8jdmFsdWVgIGlzIGltcGxpY2l0bHkgb3IgZXhwbGljaXRseSBjYWxsZWQuXG4gKlxuICogTGF6eSBldmFsdWF0aW9uIGFsbG93cyBzZXZlcmFsIG1ldGhvZHMgdG8gc3VwcG9ydCBzaG9ydGN1dCBmdXNpb24uXG4gKiBTaG9ydGN1dCBmdXNpb24gaXMgYW4gb3B0aW1pemF0aW9uIHRvIG1lcmdlIGl0ZXJhdGVlIGNhbGxzOyB0aGlzIGF2b2lkc1xuICogdGhlIGNyZWF0aW9uIG9mIGludGVybWVkaWF0ZSBhcnJheXMgYW5kIGNhbiBncmVhdGx5IHJlZHVjZSB0aGUgbnVtYmVyIG9mXG4gKiBpdGVyYXRlZSBleGVjdXRpb25zLiBTZWN0aW9ucyBvZiBhIGNoYWluIHNlcXVlbmNlIHF1YWxpZnkgZm9yIHNob3J0Y3V0XG4gKiBmdXNpb24gaWYgdGhlIHNlY3Rpb24gaXMgYXBwbGllZCB0byBhbiBhcnJheSBvZiBhdCBsZWFzdCBgMjAwYCBlbGVtZW50c1xuICogYW5kIGFueSBpdGVyYXRlZXMgYWNjZXB0IG9ubHkgb25lIGFyZ3VtZW50LiBUaGUgaGV1cmlzdGljIGZvciB3aGV0aGVyIGFcbiAqIHNlY3Rpb24gcXVhbGlmaWVzIGZvciBzaG9ydGN1dCBmdXNpb24gaXMgc3ViamVjdCB0byBjaGFuZ2UuXG4gKlxuICogQ2hhaW5pbmcgaXMgc3VwcG9ydGVkIGluIGN1c3RvbSBidWlsZHMgYXMgbG9uZyBhcyB0aGUgYF8jdmFsdWVgIG1ldGhvZCBpc1xuICogZGlyZWN0bHkgb3IgaW5kaXJlY3RseSBpbmNsdWRlZCBpbiB0aGUgYnVpbGQuXG4gKlxuICogSW4gYWRkaXRpb24gdG8gbG9kYXNoIG1ldGhvZHMsIHdyYXBwZXJzIGhhdmUgYEFycmF5YCBhbmQgYFN0cmluZ2AgbWV0aG9kcy5cbiAqXG4gKiBUaGUgd3JhcHBlciBgQXJyYXlgIG1ldGhvZHMgYXJlOlxuICogYGNvbmNhdGAsIGBqb2luYCwgYHBvcGAsIGBwdXNoYCwgYHNoaWZ0YCwgYHNvcnRgLCBgc3BsaWNlYCwgYW5kIGB1bnNoaWZ0YFxuICpcbiAqIFRoZSB3cmFwcGVyIGBTdHJpbmdgIG1ldGhvZHMgYXJlOlxuICogYHJlcGxhY2VgIGFuZCBgc3BsaXRgXG4gKlxuICogVGhlIHdyYXBwZXIgbWV0aG9kcyB0aGF0IHN1cHBvcnQgc2hvcnRjdXQgZnVzaW9uIGFyZTpcbiAqIGBhdGAsIGBjb21wYWN0YCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCwgYGRyb3BXaGlsZWAsIGBmaWx0ZXJgLCBgZmluZGAsXG4gKiBgZmluZExhc3RgLCBgaGVhZGAsIGBpbml0aWFsYCwgYGxhc3RgLCBgbWFwYCwgYHJlamVjdGAsIGByZXZlcnNlYCwgYHNsaWNlYCxcbiAqIGB0YWlsYCwgYHRha2VgLCBgdGFrZVJpZ2h0YCwgYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGFuZCBgdG9BcnJheWBcbiAqXG4gKiBUaGUgY2hhaW5hYmxlIHdyYXBwZXIgbWV0aG9kcyBhcmU6XG4gKiBgYWZ0ZXJgLCBgYXJ5YCwgYGFzc2lnbmAsIGBhc3NpZ25JbmAsIGBhc3NpZ25JbldpdGhgLCBgYXNzaWduV2l0aGAsIGBhdGAsXG4gKiBgYmVmb3JlYCwgYGJpbmRgLCBgYmluZEFsbGAsIGBiaW5kS2V5YCwgYGNhc3RBcnJheWAsIGBjaGFpbmAsIGBjaHVua2AsXG4gKiBgY29tbWl0YCwgYGNvbXBhY3RgLCBgY29uY2F0YCwgYGNvbmZvcm1zYCwgYGNvbnN0YW50YCwgYGNvdW50QnlgLCBgY3JlYXRlYCxcbiAqIGBjdXJyeWAsIGBkZWJvdW5jZWAsIGBkZWZhdWx0c2AsIGBkZWZhdWx0c0RlZXBgLCBgZGVmZXJgLCBgZGVsYXlgLFxuICogYGRpZmZlcmVuY2VgLCBgZGlmZmVyZW5jZUJ5YCwgYGRpZmZlcmVuY2VXaXRoYCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCxcbiAqIGBkcm9wUmlnaHRXaGlsZWAsIGBkcm9wV2hpbGVgLCBgZXh0ZW5kYCwgYGV4dGVuZFdpdGhgLCBgZmlsbGAsIGBmaWx0ZXJgLFxuICogYGZsYXRNYXBgLCBgZmxhdE1hcERlZXBgLCBgZmxhdE1hcERlcHRoYCwgYGZsYXR0ZW5gLCBgZmxhdHRlbkRlZXBgLFxuICogYGZsYXR0ZW5EZXB0aGAsIGBmbGlwYCwgYGZsb3dgLCBgZmxvd1JpZ2h0YCwgYGZyb21QYWlyc2AsIGBmdW5jdGlvbnNgLFxuICogYGZ1bmN0aW9uc0luYCwgYGdyb3VwQnlgLCBgaW5pdGlhbGAsIGBpbnRlcnNlY3Rpb25gLCBgaW50ZXJzZWN0aW9uQnlgLFxuICogYGludGVyc2VjdGlvbldpdGhgLCBgaW52ZXJ0YCwgYGludmVydEJ5YCwgYGludm9rZU1hcGAsIGBpdGVyYXRlZWAsIGBrZXlCeWAsXG4gKiBga2V5c2AsIGBrZXlzSW5gLCBgbWFwYCwgYG1hcEtleXNgLCBgbWFwVmFsdWVzYCwgYG1hdGNoZXNgLCBgbWF0Y2hlc1Byb3BlcnR5YCxcbiAqIGBtZW1vaXplYCwgYG1lcmdlYCwgYG1lcmdlV2l0aGAsIGBtZXRob2RgLCBgbWV0aG9kT2ZgLCBgbWl4aW5gLCBgbmVnYXRlYCxcbiAqIGBudGhBcmdgLCBgb21pdGAsIGBvbWl0QnlgLCBgb25jZWAsIGBvcmRlckJ5YCwgYG92ZXJgLCBgb3ZlckFyZ3NgLFxuICogYG92ZXJFdmVyeWAsIGBvdmVyU29tZWAsIGBwYXJ0aWFsYCwgYHBhcnRpYWxSaWdodGAsIGBwYXJ0aXRpb25gLCBgcGlja2AsXG4gKiBgcGlja0J5YCwgYHBsYW50YCwgYHByb3BlcnR5YCwgYHByb3BlcnR5T2ZgLCBgcHVsbGAsIGBwdWxsQWxsYCwgYHB1bGxBbGxCeWAsXG4gKiBgcHVsbEFsbFdpdGhgLCBgcHVsbEF0YCwgYHB1c2hgLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZWFyZ2AsIGByZWplY3RgLFxuICogYHJlbW92ZWAsIGByZXN0YCwgYHJldmVyc2VgLCBgc2FtcGxlU2l6ZWAsIGBzZXRgLCBgc2V0V2l0aGAsIGBzaHVmZmxlYCxcbiAqIGBzbGljZWAsIGBzb3J0YCwgYHNvcnRCeWAsIGBzcGxpY2VgLCBgc3ByZWFkYCwgYHRhaWxgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICogYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGB0YXBgLCBgdGhyb3R0bGVgLCBgdGhydWAsIGB0b0FycmF5YCxcbiAqIGB0b1BhaXJzYCwgYHRvUGFpcnNJbmAsIGB0b1BhdGhgLCBgdG9QbGFpbk9iamVjdGAsIGB0cmFuc2Zvcm1gLCBgdW5hcnlgLFxuICogYHVuaW9uYCwgYHVuaW9uQnlgLCBgdW5pb25XaXRoYCwgYHVuaXFgLCBgdW5pcUJ5YCwgYHVuaXFXaXRoYCwgYHVuc2V0YCxcbiAqIGB1bnNoaWZ0YCwgYHVuemlwYCwgYHVuemlwV2l0aGAsIGB1cGRhdGVgLCBgdXBkYXRlV2l0aGAsIGB2YWx1ZXNgLFxuICogYHZhbHVlc0luYCwgYHdpdGhvdXRgLCBgd3JhcGAsIGB4b3JgLCBgeG9yQnlgLCBgeG9yV2l0aGAsIGB6aXBgLFxuICogYHppcE9iamVjdGAsIGB6aXBPYmplY3REZWVwYCwgYW5kIGB6aXBXaXRoYFxuICpcbiAqIFRoZSB3cmFwcGVyIG1ldGhvZHMgdGhhdCBhcmUgKipub3QqKiBjaGFpbmFibGUgYnkgZGVmYXVsdCBhcmU6XG4gKiBgYWRkYCwgYGF0dGVtcHRgLCBgY2FtZWxDYXNlYCwgYGNhcGl0YWxpemVgLCBgY2VpbGAsIGBjbGFtcGAsIGBjbG9uZWAsXG4gKiBgY2xvbmVEZWVwYCwgYGNsb25lRGVlcFdpdGhgLCBgY2xvbmVXaXRoYCwgYGRlYnVycmAsIGBkaXZpZGVgLCBgZWFjaGAsXG4gKiBgZWFjaFJpZ2h0YCwgYGVuZHNXaXRoYCwgYGVxYCwgYGVzY2FwZWAsIGBlc2NhcGVSZWdFeHBgLCBgZXZlcnlgLCBgZmluZGAsXG4gKiBgZmluZEluZGV4YCwgYGZpbmRLZXlgLCBgZmluZExhc3RgLCBgZmluZExhc3RJbmRleGAsIGBmaW5kTGFzdEtleWAsIGBmaXJzdGAsXG4gKiBgZmxvb3JgLCBgZm9yRWFjaGAsIGBmb3JFYWNoUmlnaHRgLCBgZm9ySW5gLCBgZm9ySW5SaWdodGAsIGBmb3JPd25gLFxuICogYGZvck93blJpZ2h0YCwgYGdldGAsIGBndGAsIGBndGVgLCBgaGFzYCwgYGhhc0luYCwgYGhlYWRgLCBgaWRlbnRpdHlgLFxuICogYGluY2x1ZGVzYCwgYGluZGV4T2ZgLCBgaW5SYW5nZWAsIGBpbnZva2VgLCBgaXNBcmd1bWVudHNgLCBgaXNBcnJheWAsXG4gKiBgaXNBcnJheUJ1ZmZlcmAsIGBpc0FycmF5TGlrZWAsIGBpc0FycmF5TGlrZU9iamVjdGAsIGBpc0Jvb2xlYW5gLFxuICogYGlzQnVmZmVyYCwgYGlzRGF0ZWAsIGBpc0VsZW1lbnRgLCBgaXNFbXB0eWAsIGBpc0VxdWFsYCwgYGlzRXF1YWxXaXRoYCxcbiAqIGBpc0Vycm9yYCwgYGlzRmluaXRlYCwgYGlzRnVuY3Rpb25gLCBgaXNJbnRlZ2VyYCwgYGlzTGVuZ3RoYCwgYGlzTWFwYCxcbiAqIGBpc01hdGNoYCwgYGlzTWF0Y2hXaXRoYCwgYGlzTmFOYCwgYGlzTmF0aXZlYCwgYGlzTmlsYCwgYGlzTnVsbGAsXG4gKiBgaXNOdW1iZXJgLCBgaXNPYmplY3RgLCBgaXNPYmplY3RMaWtlYCwgYGlzUGxhaW5PYmplY3RgLCBgaXNSZWdFeHBgLFxuICogYGlzU2FmZUludGVnZXJgLCBgaXNTZXRgLCBgaXNTdHJpbmdgLCBgaXNVbmRlZmluZWRgLCBgaXNUeXBlZEFycmF5YCxcbiAqIGBpc1dlYWtNYXBgLCBgaXNXZWFrU2V0YCwgYGpvaW5gLCBga2ViYWJDYXNlYCwgYGxhc3RgLCBgbGFzdEluZGV4T2ZgLFxuICogYGxvd2VyQ2FzZWAsIGBsb3dlckZpcnN0YCwgYGx0YCwgYGx0ZWAsIGBtYXhgLCBgbWF4QnlgLCBgbWVhbmAsIGBtZWFuQnlgLFxuICogYG1pbmAsIGBtaW5CeWAsIGBtdWx0aXBseWAsIGBub0NvbmZsaWN0YCwgYG5vb3BgLCBgbm93YCwgYG50aGAsIGBwYWRgLFxuICogYHBhZEVuZGAsIGBwYWRTdGFydGAsIGBwYXJzZUludGAsIGBwb3BgLCBgcmFuZG9tYCwgYHJlZHVjZWAsIGByZWR1Y2VSaWdodGAsXG4gKiBgcmVwZWF0YCwgYHJlc3VsdGAsIGByb3VuZGAsIGBydW5JbkNvbnRleHRgLCBgc2FtcGxlYCwgYHNoaWZ0YCwgYHNpemVgLFxuICogYHNuYWtlQ2FzZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHNvcnRlZEluZGV4QnlgLCBgc29ydGVkTGFzdEluZGV4YCxcbiAqIGBzb3J0ZWRMYXN0SW5kZXhCeWAsIGBzdGFydENhc2VgLCBgc3RhcnRzV2l0aGAsIGBzdHViQXJyYXlgLCBgc3R1YkZhbHNlYCxcbiAqIGBzdHViT2JqZWN0YCwgYHN0dWJTdHJpbmdgLCBgc3R1YlRydWVgLCBgc3VidHJhY3RgLCBgc3VtYCwgYHN1bUJ5YCxcbiAqIGB0ZW1wbGF0ZWAsIGB0aW1lc2AsIGB0b0Zpbml0ZWAsIGB0b0ludGVnZXJgLCBgdG9KU09OYCwgYHRvTGVuZ3RoYCxcbiAqIGB0b0xvd2VyYCwgYHRvTnVtYmVyYCwgYHRvU2FmZUludGVnZXJgLCBgdG9TdHJpbmdgLCBgdG9VcHBlcmAsIGB0cmltYCxcbiAqIGB0cmltRW5kYCwgYHRyaW1TdGFydGAsIGB0cnVuY2F0ZWAsIGB1bmVzY2FwZWAsIGB1bmlxdWVJZGAsIGB1cHBlckNhc2VgLFxuICogYHVwcGVyRmlyc3RgLCBgdmFsdWVgLCBhbmQgYHdvcmRzYFxuICpcbiAqIEBuYW1lIF9cbiAqIEBjb25zdHJ1Y3RvclxuICogQGNhdGVnb3J5IFNlcVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiB2YXIgd3JhcHBlZCA9IF8oWzEsIDIsIDNdKTtcbiAqXG4gKiAvLyBSZXR1cm5zIGFuIHVud3JhcHBlZCB2YWx1ZS5cbiAqIHdyYXBwZWQucmVkdWNlKF8uYWRkKTtcbiAqIC8vID0+IDZcbiAqXG4gKiAvLyBSZXR1cm5zIGEgd3JhcHBlZCB2YWx1ZS5cbiAqIHZhciBzcXVhcmVzID0gd3JhcHBlZC5tYXAoc3F1YXJlKTtcbiAqXG4gKiBfLmlzQXJyYXkoc3F1YXJlcyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShzcXVhcmVzLnZhbHVlKCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgaWYgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzQXJyYXkodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiBMYXp5V3JhcHBlcikpIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBMb2Rhc2hXcmFwcGVyKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnX193cmFwcGVkX18nKSkge1xuICAgICAgcmV0dXJuIHdyYXBwZXJDbG9uZSh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgTG9kYXNoV3JhcHBlcih2YWx1ZSk7XG59XG5cbi8vIEVuc3VyZSB3cmFwcGVycyBhcmUgaW5zdGFuY2VzIG9mIGBiYXNlTG9kYXNoYC5cbmxvZGFzaC5wcm90b3R5cGUgPSBiYXNlTG9kYXNoLnByb3RvdHlwZTtcbmxvZGFzaC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBsb2Rhc2g7XG5cbm1vZHVsZS5leHBvcnRzID0gbG9kYXNoO1xuIl19