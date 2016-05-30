'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;}; /**
 * @license
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash core -o ./dist/lodash.core.js`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */;(function(){ /** Used as a safe reference for `undefined` in pre-ES5 environments. */var undefined; /** Used as the semantic version number. */var VERSION='4.13.1'; /** Used as the `TypeError` message for "Functions" methods. */var FUNC_ERROR_TEXT='Expected a function'; /** Used to compose bitmasks for wrapper metadata. */var BIND_FLAG=1,PARTIAL_FLAG=32; /** Used to compose bitmasks for comparison styles. */var UNORDERED_COMPARE_FLAG=1,PARTIAL_COMPARE_FLAG=2; /** Used as references for various `Number` constants. */var INFINITY=1/0,MAX_SAFE_INTEGER=9007199254740991; /** `Object#toString` result references. */var argsTag='[object Arguments]',arrayTag='[object Array]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',genTag='[object GeneratorFunction]',numberTag='[object Number]',objectTag='[object Object]',regexpTag='[object RegExp]',stringTag='[object String]'; /** Used to match HTML entities and HTML characters. */var reUnescapedHtml=/[&<>"'`]/g,reHasUnescapedHtml=RegExp(reUnescapedHtml.source); /** Used to map characters to HTML entities. */var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}; /** Detect free variable `exports`. */var freeExports=(typeof exports==='undefined'?'undefined':_typeof(exports))=='object'&&exports; /** Detect free variable `module`. */var freeModule=freeExports&&(typeof module==='undefined'?'undefined':_typeof(module))=='object'&&module; /** Detect free variable `global` from Node.js. */var freeGlobal=checkGlobal((typeof global==='undefined'?'undefined':_typeof(global))=='object'&&global); /** Detect free variable `self`. */var freeSelf=checkGlobal((typeof self==='undefined'?'undefined':_typeof(self))=='object'&&self); /** Detect `this` as the global object. */var thisGlobal=checkGlobal(_typeof(this)=='object'&&this); /** Used as a reference to the global object. */var root=freeGlobal||freeSelf||thisGlobal||Function('return this')(); /*--------------------------------------------------------------------------*/ /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */function arrayPush(array,values){array.push.apply(array,values);return array;} /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */function baseFindIndex(array,predicate,fromIndex,fromRight){var length=array.length,index=fromIndex+(fromRight?1:-1);while(fromRight?index--:++index<length){if(predicate(array[index],index,array)){return index;}}return -1;} /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */function baseReduce(collection,iteratee,accumulator,initAccum,eachFunc){eachFunc(collection,function(value,index,collection){accumulator=initAccum?(initAccum=false,value):iteratee(accumulator,value,index,collection);});return accumulator;} /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */function baseValues(object,props){return baseMap(props,function(key){return object[key];});} /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */function checkGlobal(value){return value&&value.Object===Object?value:null;} /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */function escapeHtmlChar(chr){return htmlEscapes[chr];} /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */function isHostObject(){return false;} /*--------------------------------------------------------------------------*/ /** Used for built-in method references. */var arrayProto=Array.prototype,objectProto=Object.prototype; /** Used to check objects for own properties. */var hasOwnProperty=objectProto.hasOwnProperty; /** Used to generate unique IDs. */var idCounter=0; /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */var objectToString=objectProto.toString; /** Used to restore the original `_` reference in `_.noConflict`. */var oldDash=root._; /** Built-in value references. */var objectCreate=Object.create,propertyIsEnumerable=objectProto.propertyIsEnumerable; /* Built-in method references for those with the same name as other `lodash` methods. */var nativeIsFinite=root.isFinite,nativeKeys=Object.keys,nativeMax=Math.max; /*------------------------------------------------------------------------*/ /**
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
   */function lodash(value){return value instanceof LodashWrapper?value:new LodashWrapper(value);} /**
   * The base constructor for creating `lodash` wrapper objects.
   *
   * @private
   * @param {*} value The value to wrap.
   * @param {boolean} [chainAll] Enable explicit method chain sequences.
   */function LodashWrapper(value,chainAll){this.__wrapped__=value;this.__actions__=[];this.__chain__=!!chainAll;}LodashWrapper.prototype=baseCreate(lodash.prototype);LodashWrapper.prototype.constructor=LodashWrapper; /*------------------------------------------------------------------------*/ /**
   * Used by `_.defaults` to customize its `_.assignIn` use.
   *
   * @private
   * @param {*} objValue The destination value.
   * @param {*} srcValue The source value.
   * @param {string} key The key of the property to assign.
   * @param {Object} object The parent object of `objValue`.
   * @returns {*} Returns the value to assign.
   */function assignInDefaults(objValue,srcValue,key,object){if(objValue===undefined||eq(objValue,objectProto[key])&&!hasOwnProperty.call(object,key)){return srcValue;}return objValue;} /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */function assignValue(object,key,value){var objValue=object[key];if(!(hasOwnProperty.call(object,key)&&eq(objValue,value))||value===undefined&&!(key in object)){object[key]=value;}} /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */function baseCreate(proto){return isObject(proto)?objectCreate(proto):{};} /**
   * The base implementation of `_.delay` and `_.defer` which accepts an array
   * of `func` arguments.
   *
   * @private
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {Object} args The arguments to provide to `func`.
   * @returns {number} Returns the timer id.
   */function baseDelay(func,wait,args){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return setTimeout(function(){func.apply(undefined,args);},wait);} /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */var baseEach=createBaseEach(baseForOwn); /**
   * The base implementation of `_.every` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`
   */function baseEvery(collection,predicate){var result=true;baseEach(collection,function(value,index,collection){result=!!predicate(value,index,collection);return result;});return result;} /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */function baseExtremum(array,iteratee,comparator){var index=-1,length=array.length;while(++index<length){var value=array[index],current=iteratee(value);if(current!=null&&(computed===undefined?current===current&&!false:comparator(current,computed))){var computed=current,result=value;}}return result;} /**
   * The base implementation of `_.filter` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */function baseFilter(collection,predicate){var result=[];baseEach(collection,function(value,index,collection){if(predicate(value,index,collection)){result.push(value);}});return result;} /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */function baseFlatten(array,depth,predicate,isStrict,result){var index=-1,length=array.length;predicate||(predicate=isFlattenable);result||(result=[]);while(++index<length){var value=array[index];if(depth>0&&predicate(value)){if(depth>1){ // Recursively flatten arrays (susceptible to call stack limits).
baseFlatten(value,depth-1,predicate,isStrict,result);}else {arrayPush(result,value);}}else if(!isStrict){result[result.length]=value;}}return result;} /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */var baseFor=createBaseFor(); /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */function baseForOwn(object,iteratee){return object&&baseFor(object,iteratee,keys);} /**
   * The base implementation of `_.functions` which creates an array of
   * `object` function property names filtered from `props`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The property names to filter.
   * @returns {Array} Returns the function names.
   */function baseFunctions(object,props){return baseFilter(props,function(key){return isFunction(object[key]);});} /**
   * The base implementation of `_.gt` which doesn't coerce arguments to numbers.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is greater than `other`,
   *  else `false`.
   */function baseGt(value,other){return value>other;} /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {boolean} [bitmask] The bitmask of comparison flags.
   *  The bitmask may be composed of the following flags:
   *     1 - Unordered comparison
   *     2 - Partial comparison
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */function baseIsEqual(value,other,customizer,bitmask,stack){if(value===other){return true;}if(value==null||other==null||!isObject(value)&&!isObjectLike(other)){return value!==value&&other!==other;}return baseIsEqualDeep(value,other,baseIsEqual,customizer,bitmask,stack);} /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */function baseIsEqualDeep(object,other,equalFunc,customizer,bitmask,stack){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=arrayTag,othTag=arrayTag;if(!objIsArr){objTag=objectToString.call(object);objTag=objTag==argsTag?objectTag:objTag;}if(!othIsArr){othTag=objectToString.call(other);othTag=othTag==argsTag?objectTag:othTag;}var objIsObj=objTag==objectTag&&!isHostObject(object),othIsObj=othTag==objectTag&&!isHostObject(other),isSameTag=objTag==othTag;stack||(stack=[]);var stacked=find(stack,function(entry){return entry[0]===object;});if(stacked&&stacked[1]){return stacked[1]==other;}stack.push([object,other]);if(isSameTag&&!objIsObj){var result=objIsArr?equalArrays(object,other,equalFunc,customizer,bitmask,stack):equalByTag(object,other,objTag,equalFunc,customizer,bitmask,stack);stack.pop();return result;}if(!(bitmask&PARTIAL_COMPARE_FLAG)){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,'__wrapped__'),othIsWrapped=othIsObj&&hasOwnProperty.call(other,'__wrapped__');if(objIsWrapped||othIsWrapped){var objUnwrapped=objIsWrapped?object.value():object,othUnwrapped=othIsWrapped?other.value():other;var result=equalFunc(objUnwrapped,othUnwrapped,customizer,bitmask,stack);stack.pop();return result;}}if(!isSameTag){return false;}var result=equalObjects(object,other,equalFunc,customizer,bitmask,stack);stack.pop();return result;} /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */function baseIteratee(func){if(typeof func=='function'){return func;}if(func==null){return identity;}return ((typeof func==='undefined'?'undefined':_typeof(func))=='object'?baseMatches:baseProperty)(func);} /**
   * The base implementation of `_.keys` which doesn't skip the constructor
   * property of prototypes or treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */function baseKeys(object){return nativeKeys(Object(object));} /**
   * The base implementation of `_.keysIn` which doesn't skip the constructor
   * property of prototypes or treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */function baseKeysIn(object){object=object==null?object:Object(object);var result=[];for(var key in object){result.push(key);}return result;} /**
   * The base implementation of `_.lt` which doesn't coerce arguments to numbers.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   */function baseLt(value,other){return value<other;} /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */function baseMap(collection,iteratee){var index=-1,result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value,key,collection){result[++index]=iteratee(value,key,collection);});return result;} /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */function baseMatches(source){var props=keys(source);return function(object){var length=props.length;if(object==null){return !length;}object=Object(object);while(length--){var key=props[length];if(!(key in object&&baseIsEqual(source[key],object[key],undefined,UNORDERED_COMPARE_FLAG|PARTIAL_COMPARE_FLAG))){return false;}}return true;};} /**
   * The base implementation of `_.pick` without support for individual
   * property identifiers.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} props The property identifiers to pick.
   * @returns {Object} Returns the new object.
   */function basePick(object,props){object=Object(object);return reduce(props,function(result,key){if(key in object){result[key]=object[key];}return result;},{});} /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */function baseProperty(key){return function(object){return object==null?undefined:object[key];};} /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */function baseSlice(array,start,end){var index=-1,length=array.length;if(start<0){start=-start>length?0:length+start;}end=end>length?length:end;if(end<0){end+=length;}length=start>end?0:end-start>>>0;start>>>=0;var result=Array(length);while(++index<length){result[index]=array[index+start];}return result;} /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */function copyArray(source){return baseSlice(source,0,source.length);} /**
   * The base implementation of `_.some` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */function baseSome(collection,predicate){var result;baseEach(collection,function(value,index,collection){result=predicate(value,index,collection);return !result;});return !!result;} /**
   * The base implementation of `wrapperValue` which returns the result of
   * performing a sequence of actions on the unwrapped `value`, where each
   * successive action is supplied the return value of the previous.
   *
   * @private
   * @param {*} value The unwrapped value.
   * @param {Array} actions Actions to perform to resolve the unwrapped value.
   * @returns {*} Returns the resolved value.
   */function baseWrapperValue(value,actions){var result=value;return reduce(actions,function(result,action){return action.func.apply(action.thisArg,arrayPush([result],action.args));},result);} /**
   * Compares values to sort them in ascending order.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */function compareAscending(value,other){if(value!==other){var valIsDefined=value!==undefined,valIsNull=value===null,valIsReflexive=value===value,valIsSymbol=false;var othIsDefined=other!==undefined,othIsNull=other===null,othIsReflexive=other===other,othIsSymbol=false;if(!othIsNull&&!othIsSymbol&&!valIsSymbol&&value>other||valIsSymbol&&othIsDefined&&othIsReflexive&&!othIsNull&&!othIsSymbol||valIsNull&&othIsDefined&&othIsReflexive||!valIsDefined&&othIsReflexive||!valIsReflexive){return 1;}if(!valIsNull&&!valIsSymbol&&!othIsSymbol&&value<other||othIsSymbol&&valIsDefined&&valIsReflexive&&!valIsNull&&!valIsSymbol||othIsNull&&valIsDefined&&valIsReflexive||!othIsDefined&&valIsReflexive||!othIsReflexive){return -1;}}return 0;} /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */function copyObject(source,props,object,customizer){object||(object={});var index=-1,length=props.length;while(++index<length){var key=props[index];var newValue=customizer?customizer(object[key],source[key],key,object,source):source[key];assignValue(object,key,newValue);}return object;} /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */function createAssigner(assigner){return rest(function(object,sources){var index=-1,length=sources.length,customizer=length>1?sources[length-1]:undefined;customizer=assigner.length>3&&typeof customizer=='function'?(length--,customizer):undefined;object=Object(object);while(++index<length){var source=sources[index];if(source){assigner(object,source,index,customizer);}}return object;});} /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */function createBaseEach(eachFunc,fromRight){return function(collection,iteratee){if(collection==null){return collection;}if(!isArrayLike(collection)){return eachFunc(collection,iteratee);}var length=collection.length,index=fromRight?length:-1,iterable=Object(collection);while(fromRight?index--:++index<length){if(iteratee(iterable[index],index,iterable)===false){break;}}return collection;};} /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */function createBaseFor(fromRight){return function(object,iteratee,keysFunc){var index=-1,iterable=Object(object),props=keysFunc(object),length=props.length;while(length--){var key=props[fromRight?length:++index];if(iteratee(iterable[key],key,iterable)===false){break;}}return object;};} /**
   * Creates a function that produces an instance of `Ctor` regardless of
   * whether it was invoked as part of a `new` expression or by `call` or `apply`.
   *
   * @private
   * @param {Function} Ctor The constructor to wrap.
   * @returns {Function} Returns the new wrapped function.
   */function createCtorWrapper(Ctor){return function(){ // Use a `switch` statement to work with class constructors. See
// http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
// for more details.
var args=arguments;var thisBinding=baseCreate(Ctor.prototype),result=Ctor.apply(thisBinding,args); // Mimic the constructor's `return` behavior.
// See https://es5.github.io/#x13.2.2 for more details.
return isObject(result)?result:thisBinding;};} /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */function createFind(findIndexFunc){return function(collection,predicate,fromIndex){var iterable=Object(collection);predicate=baseIteratee(predicate,3);if(!isArrayLike(collection)){var props=keys(collection);}var index=findIndexFunc(props||collection,function(value,key){if(props){key=value;value=iterable[key];}return predicate(value,key,iterable);},fromIndex);return index>-1?collection[props?props[index]:index]:undefined;};} /**
   * Creates a function that wraps `func` to invoke it with the `this` binding
   * of `thisArg` and `partials` prepended to the arguments it receives.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
   *  for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to
   *  the new function.
   * @returns {Function} Returns the new wrapped function.
   */function createPartialWrapper(func,bitmask,thisArg,partials){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}var isBind=bitmask&BIND_FLAG,Ctor=createCtorWrapper(func);function wrapper(){var argsIndex=-1,argsLength=arguments.length,leftIndex=-1,leftLength=partials.length,args=Array(leftLength+argsLength),fn=this&&this!==root&&this instanceof wrapper?Ctor:func;while(++leftIndex<leftLength){args[leftIndex]=partials[leftIndex];}while(argsLength--){args[leftIndex++]=arguments[++argsIndex];}return fn.apply(isBind?thisArg:this,args);}return wrapper;} /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */function equalArrays(array,other,equalFunc,customizer,bitmask,stack){var isPartial=bitmask&PARTIAL_COMPARE_FLAG,arrLength=array.length,othLength=other.length;if(arrLength!=othLength&&!(isPartial&&othLength>arrLength)){return false;}var index=-1,result=true,seen=bitmask&UNORDERED_COMPARE_FLAG?[]:undefined; // Ignore non-index properties.
while(++index<arrLength){var arrValue=array[index],othValue=other[index];var compared;if(compared!==undefined){if(compared){continue;}result=false;break;} // Recursively compare arrays (susceptible to call stack limits).
if(seen){if(!baseSome(other,function(othValue,othIndex){if(!indexOf(seen,othIndex)&&(arrValue===othValue||equalFunc(arrValue,othValue,customizer,bitmask,stack))){return seen.push(othIndex);}})){result=false;break;}}else if(!(arrValue===othValue||equalFunc(arrValue,othValue,customizer,bitmask,stack))){result=false;break;}}return result;} /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */function equalByTag(object,other,tag,equalFunc,customizer,bitmask,stack){switch(tag){case boolTag:case dateTag: // Coerce dates and booleans to numbers, dates to milliseconds and
// booleans to `1` or `0` treating invalid dates coerced to `NaN` as
// not equal.
return +object==+other;case errorTag:return object.name==other.name&&object.message==other.message;case numberTag: // Treat `NaN` vs. `NaN` as equal.
return object!=+object?other!=+other:object==+other;case regexpTag:case stringTag: // Coerce regexes to strings and treat strings, primitives and objects,
// as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
// for more details.
return object==other+'';}return false;} /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */function equalObjects(object,other,equalFunc,customizer,bitmask,stack){var isPartial=bitmask&PARTIAL_COMPARE_FLAG,objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!=othLength&&!isPartial){return false;}var index=objLength;while(index--){var key=objProps[index];if(!(isPartial?key in other:hasOwnProperty.call(other,key))){return false;}}var result=true;var skipCtor=isPartial;while(++index<objLength){key=objProps[index];var objValue=object[key],othValue=other[key];var compared; // Recursively compare objects (susceptible to call stack limits).
if(!(compared===undefined?objValue===othValue||equalFunc(objValue,othValue,customizer,bitmask,stack):compared)){result=false;break;}skipCtor||(skipCtor=key=='constructor');}if(result&&!skipCtor){var objCtor=object.constructor,othCtor=other.constructor; // Non `Object` object instances with different constructors are not equal.
if(objCtor!=othCtor&&'constructor' in object&&'constructor' in other&&!(typeof objCtor=='function'&&objCtor instanceof objCtor&&typeof othCtor=='function'&&othCtor instanceof othCtor)){result=false;}}return result;} /**
   * Gets the "length" property value of `object`.
   *
   * **Note:** This function is used to avoid a
   * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
   * Safari on at least iOS 8.1-8.3 ARM64.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {*} Returns the "length" value.
   */var getLength=baseProperty('length'); /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */function isFlattenable(value){return isArray(value)||isArguments(value);} /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */var toKey=String; /*------------------------------------------------------------------------*/ /**
   * Creates an array with all falsey values removed. The values `false`, `null`,
   * `0`, `""`, `undefined`, and `NaN` are falsey.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to compact.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */function compact(array){return baseFilter(array,Boolean);} /**
   * Creates a new array concatenating `array` with any additional arrays
   * and/or values.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to concatenate.
   * @param {...*} [values] The values to concatenate.
   * @returns {Array} Returns the new concatenated array.
   * @example
   *
   * var array = [1];
   * var other = _.concat(array, 2, [3], [[4]]);
   *
   * console.log(other);
   * // => [1, 2, 3, [4]]
   *
   * console.log(array);
   * // => [1]
   */function concat(){var length=arguments.length,args=Array(length?length-1:0),array=arguments[0],index=length;while(index--){args[index-1]=arguments[index];}return length?arrayPush(isArray(array)?copyArray(array):[array],baseFlatten(args,1)):[];} /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to search.
   * @param {Array|Function|Object|string} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */function findIndex(array,predicate,fromIndex){var length=array?array.length:0;if(!length){return -1;}var index=fromIndex==null?0:toInteger(fromIndex);if(index<0){index=nativeMax(length+index,0);}return baseFindIndex(array,baseIteratee(predicate,3),index);} /**
   * Flattens `array` a single level deep.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, [3, [4]], 5]]);
   * // => [1, 2, [3, [4]], 5]
   */function flatten(array){var length=array?array.length:0;return length?baseFlatten(array,1):[];} /**
   * Recursively flattens `array`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, [3, [4]], 5]]);
   * // => [1, 2, 3, 4, 5]
   */function flattenDeep(array){var length=array?array.length:0;return length?baseFlatten(array,INFINITY):[];} /**
   * Gets the first element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias first
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the first element of `array`.
   * @example
   *
   * _.head([1, 2, 3]);
   * // => 1
   *
   * _.head([]);
   * // => undefined
   */function head(array){return array&&array.length?array[0]:undefined;} /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the
   * offset from the end of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // Search from the `fromIndex`.
   * _.indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   */function indexOf(array,value,fromIndex){var length=array?array.length:0;if(typeof fromIndex=='number'){fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex;}else {fromIndex=0;}var index=(fromIndex||0)-1,isReflexive=value===value;while(++index<length){var other=array[index];if(isReflexive?other===value:other!==other){return index;}}return -1;} /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */function last(array){var length=array?array.length:0;return length?array[length-1]:undefined;} /**
   * Creates a slice of `array` from `start` up to, but not including, `end`.
   *
   * **Note:** This method is used instead of
   * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
   * returned.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */function slice(array,start,end){var length=array?array.length:0;start=start==null?0:+start;end=end===undefined?length:+end;return length?baseSlice(array,start,end):[];} /*------------------------------------------------------------------------*/ /**
   * Creates a `lodash` wrapper instance that wraps `value` with explicit method
   * chain sequences enabled. The result of such sequences must be unwrapped
   * with `_#value`.
   *
   * @static
   * @memberOf _
   * @since 1.3.0
   * @category Seq
   * @param {*} value The value to wrap.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36 },
   *   { 'user': 'fred',    'age': 40 },
   *   { 'user': 'pebbles', 'age': 1 }
   * ];
   *
   * var youngest = _
   *   .chain(users)
   *   .sortBy('age')
   *   .map(function(o) {
   *     return o.user + ' is ' + o.age;
   *   })
   *   .head()
   *   .value();
   * // => 'pebbles is 1'
   */function chain(value){var result=lodash(value);result.__chain__=true;return result;} /**
   * This method invokes `interceptor` and returns `value`. The interceptor
   * is invoked with one argument; (value). The purpose of this method is to
   * "tap into" a method chain sequence in order to modify intermediate results.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Seq
   * @param {*} value The value to provide to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {*} Returns `value`.
   * @example
   *
   * _([1, 2, 3])
   *  .tap(function(array) {
   *    // Mutate input array.
   *    array.pop();
   *  })
   *  .reverse()
   *  .value();
   * // => [2, 1]
   */function tap(value,interceptor){interceptor(value);return value;} /**
   * This method is like `_.tap` except that it returns the result of `interceptor`.
   * The purpose of this method is to "pass thru" values replacing intermediate
   * results in a method chain sequence.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Seq
   * @param {*} value The value to provide to `interceptor`.
   * @param {Function} interceptor The function to invoke.
   * @returns {*} Returns the result of `interceptor`.
   * @example
   *
   * _('  abc  ')
   *  .chain()
   *  .trim()
   *  .thru(function(value) {
   *    return [value];
   *  })
   *  .value();
   * // => ['abc']
   */function thru(value,interceptor){return interceptor(value);} /**
   * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
   *
   * @name chain
   * @memberOf _
   * @since 0.1.0
   * @category Seq
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // A sequence without explicit chaining.
   * _(users).head();
   * // => { 'user': 'barney', 'age': 36 }
   *
   * // A sequence with explicit chaining.
   * _(users)
   *   .chain()
   *   .head()
   *   .pick('user')
   *   .value();
   * // => { 'user': 'barney' }
   */function wrapperChain(){return chain(this);} /**
   * Executes the chain sequence to resolve the unwrapped value.
   *
   * @name value
   * @memberOf _
   * @since 0.1.0
   * @alias toJSON, valueOf
   * @category Seq
   * @returns {*} Returns the resolved unwrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */function wrapperValue(){return baseWrapperValue(this.__wrapped__,this.__actions__);} /*------------------------------------------------------------------------*/ /**
   * Checks if `predicate` returns truthy for **all** elements of `collection`.
   * Iteration is stopped once `predicate` returns falsey. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Array|Function|Object|string} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.every(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.every(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.every(users, 'active');
   * // => false
   */function every(collection,predicate,guard){predicate=guard?undefined:predicate;return baseEvery(collection,baseIteratee(predicate));} /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Array|Function|Object|string} [predicate=_.identity]
   *  The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   * @see _.reject
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, function(o) { return !o.active; });
   * // => objects for ['fred']
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, { 'age': 36, 'active': true });
   * // => objects for ['barney']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, ['active', false]);
   * // => objects for ['fred']
   *
   * // The `_.property` iteratee shorthand.
   * _.filter(users, 'active');
   * // => objects for ['barney']
   */function filter(collection,predicate){return baseFilter(collection,baseIteratee(predicate));} /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to search.
   * @param {Array|Function|Object|string} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */var find=createFind(findIndex); /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _([1, 2]).forEach(function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */function forEach(collection,iteratee){return baseEach(collection,baseIteratee(iteratee));} /**
   * Creates an array of values by running each element in `collection` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Array|Function|Object|string} [iteratee=_.identity]
   *  The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * _.map([4, 8], square);
   * // => [16, 64]
   *
   * _.map({ 'a': 4, 'b': 8 }, square);
   * // => [16, 64] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */function map(collection,iteratee){return baseMap(collection,baseIteratee(iteratee));} /**
   * Reduces `collection` to a value which is the accumulated result of running
   * each element in `collection` thru `iteratee`, where each successive
   * invocation is supplied the return value of the previous. If `accumulator`
   * is not given, the first element of `collection` is used as the initial
   * value. The iteratee is invoked with four arguments:
   * (accumulator, value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.reduce`, `_.reduceRight`, and `_.transform`.
   *
   * The guarded methods are:
   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
   * and `sortBy`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @returns {*} Returns the accumulated value.
   * @see _.reduceRight
   * @example
   *
   * _.reduce([1, 2], function(sum, n) {
   *   return sum + n;
   * }, 0);
   * // => 3
   *
   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   *   return result;
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
   */function reduce(collection,iteratee,accumulator){return baseReduce(collection,baseIteratee(iteratee),accumulator,arguments.length<3,baseEach);} /**
   * Gets the size of `collection` by returning its length for array-like
   * values or the number of own enumerable string keyed properties for objects.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @returns {number} Returns the collection size.
   * @example
   *
   * _.size([1, 2, 3]);
   * // => 3
   *
   * _.size({ 'a': 1, 'b': 2 });
   * // => 2
   *
   * _.size('pebbles');
   * // => 7
   */function size(collection){if(collection==null){return 0;}collection=isArrayLike(collection)?collection:keys(collection);return collection.length;} /**
   * Checks if `predicate` returns truthy for **any** element of `collection`.
   * Iteration is stopped once `predicate` returns truthy. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Array|Function|Object|string} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var users = [
   *   { 'user': 'barney', 'active': true },
   *   { 'user': 'fred',   'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.some(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.some(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.some(users, 'active');
   * // => true
   */function some(collection,predicate,guard){predicate=guard?undefined:predicate;return baseSome(collection,baseIteratee(predicate));} /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in a collection thru each iteratee. This method
   * performs a stable sort, that is, it preserves the original sort order of
   * equal elements. The iteratees are invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
   *  [iteratees=[_.identity]] The iteratees to sort by.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * var users = [
   *   { 'user': 'fred',   'age': 48 },
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 },
   *   { 'user': 'barney', 'age': 34 }
   * ];
   *
   * _.sortBy(users, function(o) { return o.user; });
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
   *
   * _.sortBy(users, ['user', 'age']);
   * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
   *
   * _.sortBy(users, 'user', function(o) {
   *   return Math.floor(o.age / 10);
   * });
   * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
   */function sortBy(collection,iteratee){var index=0;iteratee=baseIteratee(iteratee);return baseMap(baseMap(collection,function(value,key,collection){return {'value':value,'index':index++,'criteria':iteratee(value,key,collection)};}).sort(function(object,other){return compareAscending(object.criteria,other.criteria)||object.index-other.index;}),baseProperty('value'));} /*------------------------------------------------------------------------*/ /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery(element).on('click', _.before(5, addContactToList));
   * // => allows adding up to 4 contacts to the list
   */function before(n,func){var result;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}n=toInteger(n);return function(){if(--n>0){result=func.apply(this,arguments);}if(n<=1){func=undefined;}return result;};} /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and `partials` prepended to the arguments it receives.
   *
   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
   * may be used as a placeholder for partially applied arguments.
   *
   * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
   * property of bound functions.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var greet = function(greeting, punctuation) {
   *   return greeting + ' ' + this.user + punctuation;
   * };
   *
   * var object = { 'user': 'fred' };
   *
   * var bound = _.bind(greet, object, 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * // Bound with placeholders.
   * var bound = _.bind(greet, object, _, '!');
   * bound('hi');
   * // => 'hi fred!'
   */var bind=rest(function(func,thisArg,partials){return createPartialWrapper(func,BIND_FLAG|PARTIAL_FLAG,thisArg,partials);}); /**
   * Defers invoking the `func` until the current call stack has cleared. Any
   * additional arguments are provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to defer.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.defer(function(text) {
   *   console.log(text);
   * }, 'deferred');
   * // => Logs 'deferred' after one or more milliseconds.
   */var defer=rest(function(func,args){return baseDelay(func,1,args);}); /**
   * Invokes `func` after `wait` milliseconds. Any additional arguments are
   * provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.delay(function(text) {
   *   console.log(text);
   * }, 1000, 'later');
   * // => Logs 'later' after one second.
   */var delay=rest(function(func,wait,args){return baseDelay(func,toNumber(wait)||0,args);}); /**
   * Creates a function that negates the result of the predicate `func`. The
   * `func` predicate is invoked with the `this` binding and arguments of the
   * created function.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {Function} predicate The predicate to negate.
   * @returns {Function} Returns the new negated function.
   * @example
   *
   * function isEven(n) {
   *   return n % 2 == 0;
   * }
   *
   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
   * // => [1, 3, 5]
   */function negate(predicate){if(typeof predicate!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return function(){return !predicate.apply(this,arguments);};} /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first invocation. The `func` is
   * invoked with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // `initialize` invokes `createApplication` once
   */function once(func){return before(2,func);} /**
   * Creates a function that invokes `func` with the `this` binding of the
   * created function and arguments from `start` and beyond provided as
   * an array.
   *
   * **Note:** This method is based on the
   * [rest parameter](https://mdn.io/rest_parameters).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Function
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.rest(function(what, names) {
   *   return what + ' ' + _.initial(names).join(', ') +
   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
   * });
   *
   * say('hello', 'fred', 'barney', 'pebbles');
   * // => 'hello fred, barney, & pebbles'
   */function rest(func,start){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}start=nativeMax(start===undefined?func.length-1:toInteger(start),0);return function(){var args=arguments,index=-1,length=nativeMax(args.length-start,0),array=Array(length);while(++index<length){array[index]=args[start+index];}var otherArgs=Array(start+1);index=-1;while(++index<start){otherArgs[index]=args[index];}otherArgs[start]=array;return func.apply(this,otherArgs);};} /*------------------------------------------------------------------------*/ /**
   * Creates a shallow clone of `value`.
   *
   * **Note:** This method is loosely based on the
   * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
   * and supports cloning arrays, array buffers, booleans, date objects, maps,
   * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
   * arrays. The own enumerable properties of `arguments` objects are cloned
   * as plain objects. An empty object is returned for uncloneable values such
   * as error objects, functions, DOM nodes, and WeakMaps.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to clone.
   * @returns {*} Returns the cloned value.
   * @see _.cloneDeep
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var shallow = _.clone(objects);
   * console.log(shallow[0] === objects[0]);
   * // => true
   */function clone(value){if(!isObject(value)){return value;}return isArray(value)?copyArray(value):copyObject(value,keys(value));} /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */function eq(value,other){return value===other||value!==value&&other!==other;} /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */function isArguments(value){ // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
return isArrayLikeObject(value)&&hasOwnProperty.call(value,'callee')&&(!propertyIsEnumerable.call(value,'callee')||objectToString.call(value)==argsTag);} /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @type {Function}
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */var isArray=Array.isArray; /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */function isArrayLike(value){return value!=null&&isLength(getLength(value))&&!isFunction(value);} /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */function isArrayLikeObject(value){return isObjectLike(value)&&isArrayLike(value);} /**
   * Checks if `value` is classified as a boolean primitive or object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isBoolean(false);
   * // => true
   *
   * _.isBoolean(null);
   * // => false
   */function isBoolean(value){return value===true||value===false||isObjectLike(value)&&objectToString.call(value)==boolTag;} /**
   * Checks if `value` is classified as a `Date` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   *
   * _.isDate('Mon April 23 2012');
   * // => false
   */function isDate(value){return isObjectLike(value)&&objectToString.call(value)==dateTag;} /**
   * Checks if `value` is an empty object, collection, map, or set.
   *
   * Objects are considered empty if they have no own enumerable string keyed
   * properties.
   *
   * Array-like values such as `arguments` objects, arrays, buffers, strings, or
   * jQuery-like collections are considered empty if they have a `length` of `0`.
   * Similarly, maps and sets are considered empty if they have a `size` of `0`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */function isEmpty(value){if(isArrayLike(value)&&(isArray(value)||isString(value)||isFunction(value.splice)||isArguments(value))){return !value.length;}return !keys(value).length;} /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are **not** supported.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent,
   *  else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */function isEqual(value,other){return baseIsEqual(value,other);} /**
   * Checks if `value` is a finite primitive number.
   *
   * **Note:** This method is based on
   * [`Number.isFinite`](https://mdn.io/Number/isFinite).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a finite number,
   *  else `false`.
   * @example
   *
   * _.isFinite(3);
   * // => true
   *
   * _.isFinite(Number.MIN_VALUE);
   * // => true
   *
   * _.isFinite(Infinity);
   * // => false
   *
   * _.isFinite('3');
   * // => false
   */function isFinite(value){return typeof value=='number'&&nativeIsFinite(value);} /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */function isFunction(value){ // The use of `Object#toString` avoids issues with the `typeof` operator
// in Safari 8 which returns 'object' for typed array and weak map constructors,
// and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
var tag=isObject(value)?objectToString.call(value):'';return tag==funcTag||tag==genTag;} /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length,
   *  else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;} /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */function isObject(value){var type=typeof value==='undefined'?'undefined':_typeof(value);return !!value&&(type=='object'||type=='function');} /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */function isObjectLike(value){return !!value&&(typeof value==='undefined'?'undefined':_typeof(value))=='object';} /**
   * Checks if `value` is `NaN`.
   *
   * **Note:** This method is based on
   * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
   * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
   * `undefined` and other non-number values.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */function isNaN(value){ // An `NaN` primitive is the only value that is not equal to itself.
// Perform the `toStringTag` check first to avoid errors with some
// ActiveX objects in IE.
return isNumber(value)&&value!=+value;} /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(void 0);
   * // => false
   */function isNull(value){return value===null;} /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
   * classified as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isNumber(3);
   * // => true
   *
   * _.isNumber(Number.MIN_VALUE);
   * // => true
   *
   * _.isNumber(Infinity);
   * // => true
   *
   * _.isNumber('3');
   * // => false
   */function isNumber(value){return typeof value=='number'||isObjectLike(value)&&objectToString.call(value)==numberTag;} /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */function isRegExp(value){return isObject(value)&&objectToString.call(value)==regexpTag;} /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */function isString(value){return typeof value=='string'||!isArray(value)&&isObjectLike(value)&&objectToString.call(value)==stringTag;} /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */function isUndefined(value){return value===undefined;} /**
   * Converts `value` to an array.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * _.toArray({ 'a': 1, 'b': 2 });
   * // => [1, 2]
   *
   * _.toArray('abc');
   * // => ['a', 'b', 'c']
   *
   * _.toArray(1);
   * // => []
   *
   * _.toArray(null);
   * // => []
   */function toArray(value){if(!isArrayLike(value)){return values(value);}return value.length?copyArray(value):[];} /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */var toInteger=Number; /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */var toNumber=Number; /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */function toString(value){if(typeof value=='string'){return value;}return value==null?'':value+'';} /*------------------------------------------------------------------------*/ /**
   * Assigns own enumerable string keyed properties of source objects to the
   * destination object. Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assignIn
   * @example
   *
   * function Foo() {
   *   this.c = 3;
   * }
   *
   * function Bar() {
   *   this.e = 5;
   * }
   *
   * Foo.prototype.d = 4;
   * Bar.prototype.f = 6;
   *
   * _.assign({ 'a': 1 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3, 'e': 5 }
   */var assign=createAssigner(function(object,source){copyObject(source,keys(source),object);}); /**
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
   */var assignIn=createAssigner(function(object,source){copyObject(source,keysIn(source),object);}); /**
   * This method is like `_.assignIn` except that it accepts `customizer`
   * which is invoked to produce the assigned values. If `customizer` returns
   * `undefined`, assignment is handled by the method instead. The `customizer`
   * is invoked with five arguments: (objValue, srcValue, key, object, source).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @alias extendWith
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} [customizer] The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @see _.assignWith
   * @example
   *
   * function customizer(objValue, srcValue) {
   *   return _.isUndefined(objValue) ? srcValue : objValue;
   * }
   *
   * var defaults = _.partialRight(_.assignInWith, customizer);
   *
   * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
   * // => { 'a': 1, 'b': 2 }
   */var assignInWith=createAssigner(function(object,source,srcIndex,customizer){copyObject(source,keysIn(source),object,customizer);}); /**
   * Creates an object that inherits from the `prototype` object. If a
   * `properties` object is given, its own enumerable string keyed properties
   * are assigned to the created object.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Object
   * @param {Object} prototype The object to inherit from.
   * @param {Object} [properties] The properties to assign to the object.
   * @returns {Object} Returns the new object.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * function Circle() {
   *   Shape.call(this);
   * }
   *
   * Circle.prototype = _.create(Shape.prototype, {
   *   'constructor': Circle
   * });
   *
   * var circle = new Circle;
   * circle instanceof Circle;
   * // => true
   *
   * circle instanceof Shape;
   * // => true
   */function create(prototype,properties){var result=baseCreate(prototype);return properties?assign(result,properties):result;} /**
   * Assigns own and inherited enumerable string keyed properties of source
   * objects to the destination object for all destination properties that
   * resolve to `undefined`. Source objects are applied from left to right.
   * Once a property is set, additional values of the same property are ignored.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.defaultsDeep
   * @example
   *
   * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
   * // => { 'user': 'barney', 'age': 36 }
   */var defaults=rest(function(args){args.push(undefined,assignInDefaults);return assignInWith.apply(undefined,args);}); /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': 2 } };
   * var other = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b');
   * // => true
   *
   * _.has(object, ['a', 'b']);
   * // => true
   *
   * _.has(other, 'a');
   * // => false
   */function has(object,path){return object!=null&&hasOwnProperty.call(object,path);} /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */var keys=baseKeys; /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */var keysIn=baseKeysIn; /**
   * Creates an object composed of the picked `object` properties.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [props] The property identifiers to pick.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pick(object, ['a', 'c']);
   * // => { 'a': 1, 'c': 3 }
   */var pick=rest(function(object,props){return object==null?{}:basePick(object,baseMap(baseFlatten(props,1),toKey));}); /**
   * This method is like `_.get` except that if the resolved value is a
   * function it's invoked with the `this` binding of its parent object and
   * its result is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to resolve.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
   *
   * _.result(object, 'a[0].b.c1');
   * // => 3
   *
   * _.result(object, 'a[0].b.c2');
   * // => 4
   *
   * _.result(object, 'a[0].b.c3', 'default');
   * // => 'default'
   *
   * _.result(object, 'a[0].b.c3', _.constant('default'));
   * // => 'default'
   */function result(object,path,defaultValue){var value=object==null?undefined:object[path];if(value===undefined){value=defaultValue;}return isFunction(value)?value.call(object):value;} /**
   * Creates an array of the own enumerable string keyed property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */function values(object){return object?baseValues(object,keys(object)):[];} /*------------------------------------------------------------------------*/ /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the
   * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */function escape(string){string=toString(string);return string&&reHasUnescapedHtml.test(string)?string.replace(reUnescapedHtml,escapeHtmlChar):string;} /*------------------------------------------------------------------------*/ /**
   * This method returns the first argument given to it.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */function identity(value){return value;} /**
   * Creates a function that invokes `func` with the arguments of the created
   * function. If `func` is a property name, the created function returns the
   * property value for a given element. If `func` is an array or object, the
   * created function returns `true` for elements that contain the equivalent
   * source properties, otherwise it returns `false`.
   *
   * @static
   * @since 4.0.0
   * @memberOf _
   * @category Util
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
   * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, _.iteratee(['user', 'fred']));
   * // => [{ 'user': 'fred', 'age': 40 }]
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, _.iteratee('user'));
   * // => ['barney', 'fred']
   *
   * // Create custom iteratee shorthands.
   * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
   *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
   *     return func.test(string);
   *   };
   * });
   *
   * _.filter(['abc', 'def'], /ef/);
   * // => ['def']
   */var iteratee=baseIteratee; /**
   * Creates a function that performs a partial deep comparison between a given
   * object and `source`, returning `true` if the given object has equivalent
   * property values, else `false`. The created function is equivalent to
   * `_.isMatch` with a `source` partially applied.
   *
   * **Note:** This method supports comparing the same values as `_.isEqual`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Util
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
   */function matches(source){return baseMatches(assign({},source));} /**
   * Adds all own enumerable string keyed function properties of a source
   * object to the destination object. If `object` is a function, then methods
   * are added to its prototype as well.
   *
   * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
   * avoid conflicts caused by modifying the original.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {Function|Object} [object=lodash] The destination object.
   * @param {Object} source The object of functions to add.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
   * @returns {Function|Object} Returns `object`.
   * @example
   *
   * function vowels(string) {
   *   return _.filter(string, function(v) {
   *     return /[aeiou]/i.test(v);
   *   });
   * }
   *
   * _.mixin({ 'vowels': vowels });
   * _.vowels('fred');
   * // => ['e']
   *
   * _('fred').vowels().value();
   * // => ['e']
   *
   * _.mixin({ 'vowels': vowels }, { 'chain': false });
   * _('fred').vowels();
   * // => ['e']
   */function mixin(object,source,options){var props=keys(source),methodNames=baseFunctions(source,props);if(options==null&&!(isObject(source)&&(methodNames.length||!props.length))){options=source;source=object;object=this;methodNames=baseFunctions(source,keys(source));}var chain=!(isObject(options)&&'chain' in options)||!!options.chain,isFunc=isFunction(object);baseEach(methodNames,function(methodName){var func=source[methodName];object[methodName]=func;if(isFunc){object.prototype[methodName]=function(){var chainAll=this.__chain__;if(chain||chainAll){var result=object(this.__wrapped__),actions=result.__actions__=copyArray(this.__actions__);actions.push({'func':func,'args':arguments,'thisArg':object});result.__chain__=chainAll;return result;}return func.apply(object,arrayPush([this.value()],arguments));};}});return object;} /**
   * Reverts the `_` variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */function noConflict(){if(root._===this){root._=oldDash;}return this;} /**
   * A method that returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */function noop(){} // No operation performed.
/**
   * Generates a unique ID. If `prefix` is given, the ID is appended to it.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {string} [prefix=''] The value to prefix the ID with.
   * @returns {string} Returns the unique ID.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   *
   * _.uniqueId();
   * // => '105'
   */function uniqueId(prefix){var id=++idCounter;return toString(prefix)+id;} /*------------------------------------------------------------------------*/ /**
   * Computes the maximum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * _.max([]);
   * // => undefined
   */function max(array){return array&&array.length?baseExtremum(array,identity,baseGt):undefined;} /**
   * Computes the minimum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => undefined
   */function min(array){return array&&array.length?baseExtremum(array,identity,baseLt):undefined;} /*------------------------------------------------------------------------*/ // Add methods that return wrapped values in chain sequences.
lodash.assignIn=assignIn;lodash.before=before;lodash.bind=bind;lodash.chain=chain;lodash.compact=compact;lodash.concat=concat;lodash.create=create;lodash.defaults=defaults;lodash.defer=defer;lodash.delay=delay;lodash.filter=filter;lodash.flatten=flatten;lodash.flattenDeep=flattenDeep;lodash.iteratee=iteratee;lodash.keys=keys;lodash.map=map;lodash.matches=matches;lodash.mixin=mixin;lodash.negate=negate;lodash.once=once;lodash.pick=pick;lodash.slice=slice;lodash.sortBy=sortBy;lodash.tap=tap;lodash.thru=thru;lodash.toArray=toArray;lodash.values=values; // Add aliases.
lodash.extend=assignIn; // Add methods to `lodash.prototype`.
mixin(lodash,lodash); /*------------------------------------------------------------------------*/ // Add methods that return unwrapped values in chain sequences.
lodash.clone=clone;lodash.escape=escape;lodash.every=every;lodash.find=find;lodash.forEach=forEach;lodash.has=has;lodash.head=head;lodash.identity=identity;lodash.indexOf=indexOf;lodash.isArguments=isArguments;lodash.isArray=isArray;lodash.isBoolean=isBoolean;lodash.isDate=isDate;lodash.isEmpty=isEmpty;lodash.isEqual=isEqual;lodash.isFinite=isFinite;lodash.isFunction=isFunction;lodash.isNaN=isNaN;lodash.isNull=isNull;lodash.isNumber=isNumber;lodash.isObject=isObject;lodash.isRegExp=isRegExp;lodash.isString=isString;lodash.isUndefined=isUndefined;lodash.last=last;lodash.max=max;lodash.min=min;lodash.noConflict=noConflict;lodash.noop=noop;lodash.reduce=reduce;lodash.result=result;lodash.size=size;lodash.some=some;lodash.uniqueId=uniqueId; // Add aliases.
lodash.each=forEach;lodash.first=head;mixin(lodash,function(){var source={};baseForOwn(lodash,function(func,methodName){if(!hasOwnProperty.call(lodash.prototype,methodName)){source[methodName]=func;}});return source;}(),{'chain':false}); /*------------------------------------------------------------------------*/ /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type {string}
   */lodash.VERSION=VERSION; // Add `Array` methods to `lodash.prototype`.
baseEach(['pop','join','replace','reverse','split','push','shift','sort','splice','unshift'],function(methodName){var func=(/^(?:replace|split)$/.test(methodName)?String.prototype:arrayProto)[methodName],chainName=/^(?:push|sort|unshift)$/.test(methodName)?'tap':'thru',retUnwrapped=/^(?:pop|join|replace|shift)$/.test(methodName);lodash.prototype[methodName]=function(){var args=arguments;if(retUnwrapped&&!this.__chain__){var value=this.value();return func.apply(isArray(value)?value:[],args);}return this[chainName](function(value){return func.apply(isArray(value)?value:[],args);});};}); // Add chain sequence methods to the `lodash` wrapper.
lodash.prototype.toJSON=lodash.prototype.valueOf=lodash.prototype.value=wrapperValue; /*--------------------------------------------------------------------------*/ // Expose Lodash on the free variable `window` or `self` when available so it's
// globally accessible, even when bundled with Browserify, Webpack, etc. This
// also prevents errors in cases where Lodash is loaded by a script tag in the
// presence of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch
// for more details. Use `_.noConflict` to remove Lodash from the global object.
(freeSelf||{})._=lodash; // Some AMD build optimizers like r.js check for condition patterns like the following:
if(typeof define=='function'&&_typeof(define.amd)=='object'&&define.amd){ // Define as an anonymous module so, through path mapping, it can be
// referenced as the "underscore" module.
define(function(){return lodash;});} // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
else if(freeModule){ // Export for Node.js.
(freeModule.exports=lodash)._=lodash; // Export for CommonJS support.
freeExports._=lodash;}else { // Export to the global object.
root._=lodash;}}).call(undefined);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7R0FTQSxDQUFFLFdBQVcsQyx5RUFHWCxJQUFJLFNBQUosQyw0Q0FHQSxJQUFJLFFBQVUsUUFBZCxDLGdFQUdBLElBQUksZ0JBQWtCLHFCQUF0QixDLHNEQUdBLElBQUksVUFBWSxDQUFoQixDQUNJLGFBQWUsRUFEbkIsQyx1REFJQSxJQUFJLHVCQUF5QixDQUE3QixDQUNJLHFCQUF1QixDQUQzQixDLDBEQUlBLElBQUksU0FBVyxFQUFJLENBQW5CLENBQ0ksaUJBQW1CLGdCQUR2QixDLDRDQUlBLElBQUksUUFBVSxvQkFBZCxDQUNJLFNBQVcsZ0JBRGYsQ0FFSSxRQUFVLGtCQUZkLENBR0ksUUFBVSxlQUhkLENBSUksU0FBVyxnQkFKZixDQUtJLFFBQVUsbUJBTGQsQ0FNSSxPQUFTLDRCQU5iLENBT0ksVUFBWSxpQkFQaEIsQ0FRSSxVQUFZLGlCQVJoQixDQVNJLFVBQVksaUJBVGhCLENBVUksVUFBWSxpQkFWaEIsQyx3REFhQSxJQUFJLGdCQUFrQixXQUF0QixDQUNJLG1CQUFxQixPQUFPLGdCQUFnQixNQUF2QixDQUR6QixDLGdEQUlBLElBQUksWUFBYyxDQUNoQixJQUFLLE9BRFcsQ0FFaEIsSUFBSyxNQUZXLENBR2hCLElBQUssTUFIVyxDQUloQixJQUFLLFFBSlcsQ0FLaEIsSUFBSyxPQUxXLENBTWhCLElBQUssT0FOVyxDQUFsQixDLHVDQVVBLElBQUksWUFBYyxRQUFPLE9BQVAsbUNBQU8sT0FBUCxJQUFrQixRQUFsQixFQUE4QixPQUFoRCxDLHNDQUdBLElBQUksV0FBYSxhQUFlLFFBQU8sTUFBUCxtQ0FBTyxNQUFQLElBQWlCLFFBQWhDLEVBQTRDLE1BQTdELEMsbURBR0EsSUFBSSxXQUFhLFlBQVksUUFBTyxNQUFQLG1DQUFPLE1BQVAsSUFBaUIsUUFBakIsRUFBNkIsTUFBekMsQ0FBakIsQyxvQ0FHQSxJQUFJLFNB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LENBQXFCLE1BQXRCLEVBQThCLENBQTlCLENBQWtDLE1BQWxDLEM7QUFFQSxZQUFZLENBQVosQ0FBZ0IsTUFBaEIsQ0FDRCxDQUxJLEtBTUEsQztBQUVILEtBQUssQ0FBTCxDQUFTLE1BQVQsQ0FDRCxDQUNGLENBNXVIQyxFQTR1SEEsSUE1dUhBLFdBQUQiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIGNvcmUgLW8gLi9kaXN0L2xvZGFzaC5jb3JlLmpzYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlLUVTNSBlbnZpcm9ubWVudHMuICovXG4gIHZhciB1bmRlZmluZWQ7XG5cbiAgLyoqIFVzZWQgYXMgdGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLiAqL1xuICB2YXIgVkVSU0lPTiA9ICc0LjEzLjEnO1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG4gIHZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbiAgLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbiAgdmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgICBQQVJUSUFMX0ZMQUcgPSAzMjtcblxuICAvKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbiAgdmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgICAgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4gIC8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xuICB2YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICAgIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4gIC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xuICB2YXIgcmVVbmVzY2FwZWRIdG1sID0gL1smPD5cIidgXS9nLFxuICAgICAgcmVIYXNVbmVzY2FwZWRIdG1sID0gUmVnRXhwKHJlVW5lc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4gIC8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG4gIHZhciBodG1sRXNjYXBlcyA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJ2AnOiAnJiM5NjsnXG4gIH07XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG4gIHZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBjaGVja0dsb2JhbCh0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCk7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbiAgdmFyIGZyZWVTZWxmID0gY2hlY2tHbG9iYWwodHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZik7XG5cbiAgLyoqIERldGVjdCBgdGhpc2AgYXMgdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciB0aGlzR2xvYmFsID0gY2hlY2tHbG9iYWwodHlwZW9mIHRoaXMgPT0gJ29iamVjdCcgJiYgdGhpcyk7XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCB0aGlzR2xvYmFsIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gICAqL1xuICBmdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICAgIGFycmF5LnB1c2guYXBwbHkoYXJyYXksIHZhbHVlcyk7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAgICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlZHVjZWAgYW5kIGBfLnJlZHVjZVJpZ2h0YCwgd2l0aG91dCBzdXBwb3J0XG4gICAqIGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLCB3aGljaCBpdGVyYXRlcyBvdmVyIGBjb2xsZWN0aW9uYCB1c2luZyBgZWFjaEZ1bmNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7Kn0gYWNjdW11bGF0b3IgVGhlIGluaXRpYWwgdmFsdWUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdEFjY3VtIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IG9yIGxhc3QgZWxlbWVudCBvZlxuICAgKiAgYGNvbGxlY3Rpb25gIGFzIHRoZSBpbml0aWFsIHZhbHVlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGBjb2xsZWN0aW9uYC5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVJlZHVjZShjb2xsZWN0aW9uLCBpdGVyYXRlZSwgYWNjdW11bGF0b3IsIGluaXRBY2N1bSwgZWFjaEZ1bmMpIHtcbiAgICBlYWNoRnVuYyhjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gaW5pdEFjY3VtXG4gICAgICAgID8gKGluaXRBY2N1bSA9IGZhbHNlLCB2YWx1ZSlcbiAgICAgICAgOiBpdGVyYXRlZShhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udmFsdWVzYCBhbmQgYF8udmFsdWVzSW5gIHdoaWNoIGNyZWF0ZXMgYW5cbiAgICogYXJyYXkgb2YgYG9iamVjdGAgcHJvcGVydHkgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3BlcnR5IG5hbWVzXG4gICAqIG9mIGBwcm9wc2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGdldCB2YWx1ZXMgZm9yLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlVmFsdWVzKG9iamVjdCwgcHJvcHMpIHtcbiAgICByZXR1cm4gYmFzZU1hcChwcm9wcywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBnbG9iYWwgb2JqZWN0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIGB2YWx1ZWAgaWYgaXQncyBhIGdsb2JhbCBvYmplY3QsIGVsc2UgYG51bGxgLlxuICAgKi9cbiAgZnVuY3Rpb24gY2hlY2tHbG9iYWwodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlICYmIHZhbHVlLk9iamVjdCA9PT0gT2JqZWN0KSA/IHZhbHVlIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLmVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGVIdG1sQ2hhcihjaHIpIHtcbiAgICByZXR1cm4gaHRtbEVzY2FwZXNbY2hyXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGhvc3Qgb2JqZWN0IGluIElFIDwgOS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdE9iamVjdCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG4gIHZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSURzLiAqL1xuICB2YXIgaWRDb3VudGVyID0gMDtcblxuICAvKipcbiAgICogVXNlZCB0byByZXNvbHZlIHRoZVxuICAgKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAgICogb2YgdmFsdWVzLlxuICAgKi9cbiAgdmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyoqIFVzZWQgdG8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgYF9gIHJlZmVyZW5jZSBpbiBgXy5ub0NvbmZsaWN0YC4gKi9cbiAgdmFyIG9sZERhc2ggPSByb290Ll87XG5cbiAgLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG4gIHZhciBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlLFxuICAgICAgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuICAvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG4gIHZhciBuYXRpdmVJc0Zpbml0ZSA9IHJvb3QuaXNGaW5pdGUsXG4gICAgICBuYXRpdmVLZXlzID0gT2JqZWN0LmtleXMsXG4gICAgICBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgbG9kYXNoYCBvYmplY3Qgd2hpY2ggd3JhcHMgYHZhbHVlYCB0byBlbmFibGUgaW1wbGljaXQgbWV0aG9kXG4gICAqIGNoYWluIHNlcXVlbmNlcy4gTWV0aG9kcyB0aGF0IG9wZXJhdGUgb24gYW5kIHJldHVybiBhcnJheXMsIGNvbGxlY3Rpb25zLFxuICAgKiBhbmQgZnVuY3Rpb25zIGNhbiBiZSBjaGFpbmVkIHRvZ2V0aGVyLiBNZXRob2RzIHRoYXQgcmV0cmlldmUgYSBzaW5nbGUgdmFsdWVcbiAgICogb3IgbWF5IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZSB3aWxsIGF1dG9tYXRpY2FsbHkgZW5kIHRoZSBjaGFpbiBzZXF1ZW5jZVxuICAgKiBhbmQgcmV0dXJuIHRoZSB1bndyYXBwZWQgdmFsdWUuIE90aGVyd2lzZSwgdGhlIHZhbHVlIG11c3QgYmUgdW53cmFwcGVkXG4gICAqIHdpdGggYF8jdmFsdWVgLlxuICAgKlxuICAgKiBFeHBsaWNpdCBjaGFpbiBzZXF1ZW5jZXMsIHdoaWNoIG11c3QgYmUgdW53cmFwcGVkIHdpdGggYF8jdmFsdWVgLCBtYXkgYmVcbiAgICogZW5hYmxlZCB1c2luZyBgXy5jaGFpbmAuXG4gICAqXG4gICAqIFRoZSBleGVjdXRpb24gb2YgY2hhaW5lZCBtZXRob2RzIGlzIGxhenksIHRoYXQgaXMsIGl0J3MgZGVmZXJyZWQgdW50aWxcbiAgICogYF8jdmFsdWVgIGlzIGltcGxpY2l0bHkgb3IgZXhwbGljaXRseSBjYWxsZWQuXG4gICAqXG4gICAqIExhenkgZXZhbHVhdGlvbiBhbGxvd3Mgc2V2ZXJhbCBtZXRob2RzIHRvIHN1cHBvcnQgc2hvcnRjdXQgZnVzaW9uLlxuICAgKiBTaG9ydGN1dCBmdXNpb24gaXMgYW4gb3B0aW1pemF0aW9uIHRvIG1lcmdlIGl0ZXJhdGVlIGNhbGxzOyB0aGlzIGF2b2lkc1xuICAgKiB0aGUgY3JlYXRpb24gb2YgaW50ZXJtZWRpYXRlIGFycmF5cyBhbmQgY2FuIGdyZWF0bHkgcmVkdWNlIHRoZSBudW1iZXIgb2ZcbiAgICogaXRlcmF0ZWUgZXhlY3V0aW9ucy4gU2VjdGlvbnMgb2YgYSBjaGFpbiBzZXF1ZW5jZSBxdWFsaWZ5IGZvciBzaG9ydGN1dFxuICAgKiBmdXNpb24gaWYgdGhlIHNlY3Rpb24gaXMgYXBwbGllZCB0byBhbiBhcnJheSBvZiBhdCBsZWFzdCBgMjAwYCBlbGVtZW50c1xuICAgKiBhbmQgYW55IGl0ZXJhdGVlcyBhY2NlcHQgb25seSBvbmUgYXJndW1lbnQuIFRoZSBoZXVyaXN0aWMgZm9yIHdoZXRoZXIgYVxuICAgKiBzZWN0aW9uIHF1YWxpZmllcyBmb3Igc2hvcnRjdXQgZnVzaW9uIGlzIHN1YmplY3QgdG8gY2hhbmdlLlxuICAgKlxuICAgKiBDaGFpbmluZyBpcyBzdXBwb3J0ZWQgaW4gY3VzdG9tIGJ1aWxkcyBhcyBsb25nIGFzIHRoZSBgXyN2YWx1ZWAgbWV0aG9kIGlzXG4gICAqIGRpcmVjdGx5IG9yIGluZGlyZWN0bHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkLlxuICAgKlxuICAgKiBJbiBhZGRpdGlvbiB0byBsb2Rhc2ggbWV0aG9kcywgd3JhcHBlcnMgaGF2ZSBgQXJyYXlgIGFuZCBgU3RyaW5nYCBtZXRob2RzLlxuICAgKlxuICAgKiBUaGUgd3JhcHBlciBgQXJyYXlgIG1ldGhvZHMgYXJlOlxuICAgKiBgY29uY2F0YCwgYGpvaW5gLCBgcG9wYCwgYHB1c2hgLCBgc2hpZnRgLCBgc29ydGAsIGBzcGxpY2VgLCBhbmQgYHVuc2hpZnRgXG4gICAqXG4gICAqIFRoZSB3cmFwcGVyIGBTdHJpbmdgIG1ldGhvZHMgYXJlOlxuICAgKiBgcmVwbGFjZWAgYW5kIGBzcGxpdGBcbiAgICpcbiAgICogVGhlIHdyYXBwZXIgbWV0aG9kcyB0aGF0IHN1cHBvcnQgc2hvcnRjdXQgZnVzaW9uIGFyZTpcbiAgICogYGF0YCwgYGNvbXBhY3RgLCBgZHJvcGAsIGBkcm9wUmlnaHRgLCBgZHJvcFdoaWxlYCwgYGZpbHRlcmAsIGBmaW5kYCxcbiAgICogYGZpbmRMYXN0YCwgYGhlYWRgLCBgaW5pdGlhbGAsIGBsYXN0YCwgYG1hcGAsIGByZWplY3RgLCBgcmV2ZXJzZWAsIGBzbGljZWAsXG4gICAqIGB0YWlsYCwgYHRha2VgLCBgdGFrZVJpZ2h0YCwgYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGFuZCBgdG9BcnJheWBcbiAgICpcbiAgICogVGhlIGNoYWluYWJsZSB3cmFwcGVyIG1ldGhvZHMgYXJlOlxuICAgKiBgYWZ0ZXJgLCBgYXJ5YCwgYGFzc2lnbmAsIGBhc3NpZ25JbmAsIGBhc3NpZ25JbldpdGhgLCBgYXNzaWduV2l0aGAsIGBhdGAsXG4gICAqIGBiZWZvcmVgLCBgYmluZGAsIGBiaW5kQWxsYCwgYGJpbmRLZXlgLCBgY2FzdEFycmF5YCwgYGNoYWluYCwgYGNodW5rYCxcbiAgICogYGNvbW1pdGAsIGBjb21wYWN0YCwgYGNvbmNhdGAsIGBjb25mb3Jtc2AsIGBjb25zdGFudGAsIGBjb3VudEJ5YCwgYGNyZWF0ZWAsXG4gICAqIGBjdXJyeWAsIGBkZWJvdW5jZWAsIGBkZWZhdWx0c2AsIGBkZWZhdWx0c0RlZXBgLCBgZGVmZXJgLCBgZGVsYXlgLFxuICAgKiBgZGlmZmVyZW5jZWAsIGBkaWZmZXJlbmNlQnlgLCBgZGlmZmVyZW5jZVdpdGhgLCBgZHJvcGAsIGBkcm9wUmlnaHRgLFxuICAgKiBgZHJvcFJpZ2h0V2hpbGVgLCBgZHJvcFdoaWxlYCwgYGV4dGVuZGAsIGBleHRlbmRXaXRoYCwgYGZpbGxgLCBgZmlsdGVyYCxcbiAgICogYGZsYXRNYXBgLCBgZmxhdE1hcERlZXBgLCBgZmxhdE1hcERlcHRoYCwgYGZsYXR0ZW5gLCBgZmxhdHRlbkRlZXBgLFxuICAgKiBgZmxhdHRlbkRlcHRoYCwgYGZsaXBgLCBgZmxvd2AsIGBmbG93UmlnaHRgLCBgZnJvbVBhaXJzYCwgYGZ1bmN0aW9uc2AsXG4gICAqIGBmdW5jdGlvbnNJbmAsIGBncm91cEJ5YCwgYGluaXRpYWxgLCBgaW50ZXJzZWN0aW9uYCwgYGludGVyc2VjdGlvbkJ5YCxcbiAgICogYGludGVyc2VjdGlvbldpdGhgLCBgaW52ZXJ0YCwgYGludmVydEJ5YCwgYGludm9rZU1hcGAsIGBpdGVyYXRlZWAsIGBrZXlCeWAsXG4gICAqIGBrZXlzYCwgYGtleXNJbmAsIGBtYXBgLCBgbWFwS2V5c2AsIGBtYXBWYWx1ZXNgLCBgbWF0Y2hlc2AsIGBtYXRjaGVzUHJvcGVydHlgLFxuICAgKiBgbWVtb2l6ZWAsIGBtZXJnZWAsIGBtZXJnZVdpdGhgLCBgbWV0aG9kYCwgYG1ldGhvZE9mYCwgYG1peGluYCwgYG5lZ2F0ZWAsXG4gICAqIGBudGhBcmdgLCBgb21pdGAsIGBvbWl0QnlgLCBgb25jZWAsIGBvcmRlckJ5YCwgYG92ZXJgLCBgb3ZlckFyZ3NgLFxuICAgKiBgb3ZlckV2ZXJ5YCwgYG92ZXJTb21lYCwgYHBhcnRpYWxgLCBgcGFydGlhbFJpZ2h0YCwgYHBhcnRpdGlvbmAsIGBwaWNrYCxcbiAgICogYHBpY2tCeWAsIGBwbGFudGAsIGBwcm9wZXJ0eWAsIGBwcm9wZXJ0eU9mYCwgYHB1bGxgLCBgcHVsbEFsbGAsIGBwdWxsQWxsQnlgLFxuICAgKiBgcHVsbEFsbFdpdGhgLCBgcHVsbEF0YCwgYHB1c2hgLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZWFyZ2AsIGByZWplY3RgLFxuICAgKiBgcmVtb3ZlYCwgYHJlc3RgLCBgcmV2ZXJzZWAsIGBzYW1wbGVTaXplYCwgYHNldGAsIGBzZXRXaXRoYCwgYHNodWZmbGVgLFxuICAgKiBgc2xpY2VgLCBgc29ydGAsIGBzb3J0QnlgLCBgc3BsaWNlYCwgYHNwcmVhZGAsIGB0YWlsYCwgYHRha2VgLCBgdGFrZVJpZ2h0YCxcbiAgICogYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGB0YXBgLCBgdGhyb3R0bGVgLCBgdGhydWAsIGB0b0FycmF5YCxcbiAgICogYHRvUGFpcnNgLCBgdG9QYWlyc0luYCwgYHRvUGF0aGAsIGB0b1BsYWluT2JqZWN0YCwgYHRyYW5zZm9ybWAsIGB1bmFyeWAsXG4gICAqIGB1bmlvbmAsIGB1bmlvbkJ5YCwgYHVuaW9uV2l0aGAsIGB1bmlxYCwgYHVuaXFCeWAsIGB1bmlxV2l0aGAsIGB1bnNldGAsXG4gICAqIGB1bnNoaWZ0YCwgYHVuemlwYCwgYHVuemlwV2l0aGAsIGB1cGRhdGVgLCBgdXBkYXRlV2l0aGAsIGB2YWx1ZXNgLFxuICAgKiBgdmFsdWVzSW5gLCBgd2l0aG91dGAsIGB3cmFwYCwgYHhvcmAsIGB4b3JCeWAsIGB4b3JXaXRoYCwgYHppcGAsXG4gICAqIGB6aXBPYmplY3RgLCBgemlwT2JqZWN0RGVlcGAsIGFuZCBgemlwV2l0aGBcbiAgICpcbiAgICogVGhlIHdyYXBwZXIgbWV0aG9kcyB0aGF0IGFyZSAqKm5vdCoqIGNoYWluYWJsZSBieSBkZWZhdWx0IGFyZTpcbiAgICogYGFkZGAsIGBhdHRlbXB0YCwgYGNhbWVsQ2FzZWAsIGBjYXBpdGFsaXplYCwgYGNlaWxgLCBgY2xhbXBgLCBgY2xvbmVgLFxuICAgKiBgY2xvbmVEZWVwYCwgYGNsb25lRGVlcFdpdGhgLCBgY2xvbmVXaXRoYCwgYGRlYnVycmAsIGBkaXZpZGVgLCBgZWFjaGAsXG4gICAqIGBlYWNoUmlnaHRgLCBgZW5kc1dpdGhgLCBgZXFgLCBgZXNjYXBlYCwgYGVzY2FwZVJlZ0V4cGAsIGBldmVyeWAsIGBmaW5kYCxcbiAgICogYGZpbmRJbmRleGAsIGBmaW5kS2V5YCwgYGZpbmRMYXN0YCwgYGZpbmRMYXN0SW5kZXhgLCBgZmluZExhc3RLZXlgLCBgZmlyc3RgLFxuICAgKiBgZmxvb3JgLCBgZm9yRWFjaGAsIGBmb3JFYWNoUmlnaHRgLCBgZm9ySW5gLCBgZm9ySW5SaWdodGAsIGBmb3JPd25gLFxuICAgKiBgZm9yT3duUmlnaHRgLCBgZ2V0YCwgYGd0YCwgYGd0ZWAsIGBoYXNgLCBgaGFzSW5gLCBgaGVhZGAsIGBpZGVudGl0eWAsXG4gICAqIGBpbmNsdWRlc2AsIGBpbmRleE9mYCwgYGluUmFuZ2VgLCBgaW52b2tlYCwgYGlzQXJndW1lbnRzYCwgYGlzQXJyYXlgLFxuICAgKiBgaXNBcnJheUJ1ZmZlcmAsIGBpc0FycmF5TGlrZWAsIGBpc0FycmF5TGlrZU9iamVjdGAsIGBpc0Jvb2xlYW5gLFxuICAgKiBgaXNCdWZmZXJgLCBgaXNEYXRlYCwgYGlzRWxlbWVudGAsIGBpc0VtcHR5YCwgYGlzRXF1YWxgLCBgaXNFcXVhbFdpdGhgLFxuICAgKiBgaXNFcnJvcmAsIGBpc0Zpbml0ZWAsIGBpc0Z1bmN0aW9uYCwgYGlzSW50ZWdlcmAsIGBpc0xlbmd0aGAsIGBpc01hcGAsXG4gICAqIGBpc01hdGNoYCwgYGlzTWF0Y2hXaXRoYCwgYGlzTmFOYCwgYGlzTmF0aXZlYCwgYGlzTmlsYCwgYGlzTnVsbGAsXG4gICAqIGBpc051bWJlcmAsIGBpc09iamVjdGAsIGBpc09iamVjdExpa2VgLCBgaXNQbGFpbk9iamVjdGAsIGBpc1JlZ0V4cGAsXG4gICAqIGBpc1NhZmVJbnRlZ2VyYCwgYGlzU2V0YCwgYGlzU3RyaW5nYCwgYGlzVW5kZWZpbmVkYCwgYGlzVHlwZWRBcnJheWAsXG4gICAqIGBpc1dlYWtNYXBgLCBgaXNXZWFrU2V0YCwgYGpvaW5gLCBga2ViYWJDYXNlYCwgYGxhc3RgLCBgbGFzdEluZGV4T2ZgLFxuICAgKiBgbG93ZXJDYXNlYCwgYGxvd2VyRmlyc3RgLCBgbHRgLCBgbHRlYCwgYG1heGAsIGBtYXhCeWAsIGBtZWFuYCwgYG1lYW5CeWAsXG4gICAqIGBtaW5gLCBgbWluQnlgLCBgbXVsdGlwbHlgLCBgbm9Db25mbGljdGAsIGBub29wYCwgYG5vd2AsIGBudGhgLCBgcGFkYCxcbiAgICogYHBhZEVuZGAsIGBwYWRTdGFydGAsIGBwYXJzZUludGAsIGBwb3BgLCBgcmFuZG9tYCwgYHJlZHVjZWAsIGByZWR1Y2VSaWdodGAsXG4gICAqIGByZXBlYXRgLCBgcmVzdWx0YCwgYHJvdW5kYCwgYHJ1bkluQ29udGV4dGAsIGBzYW1wbGVgLCBgc2hpZnRgLCBgc2l6ZWAsXG4gICAqIGBzbmFrZUNhc2VgLCBgc29tZWAsIGBzb3J0ZWRJbmRleGAsIGBzb3J0ZWRJbmRleEJ5YCwgYHNvcnRlZExhc3RJbmRleGAsXG4gICAqIGBzb3J0ZWRMYXN0SW5kZXhCeWAsIGBzdGFydENhc2VgLCBgc3RhcnRzV2l0aGAsIGBzdHViQXJyYXlgLCBgc3R1YkZhbHNlYCxcbiAgICogYHN0dWJPYmplY3RgLCBgc3R1YlN0cmluZ2AsIGBzdHViVHJ1ZWAsIGBzdWJ0cmFjdGAsIGBzdW1gLCBgc3VtQnlgLFxuICAgKiBgdGVtcGxhdGVgLCBgdGltZXNgLCBgdG9GaW5pdGVgLCBgdG9JbnRlZ2VyYCwgYHRvSlNPTmAsIGB0b0xlbmd0aGAsXG4gICAqIGB0b0xvd2VyYCwgYHRvTnVtYmVyYCwgYHRvU2FmZUludGVnZXJgLCBgdG9TdHJpbmdgLCBgdG9VcHBlcmAsIGB0cmltYCxcbiAgICogYHRyaW1FbmRgLCBgdHJpbVN0YXJ0YCwgYHRydW5jYXRlYCwgYHVuZXNjYXBlYCwgYHVuaXF1ZUlkYCwgYHVwcGVyQ2FzZWAsXG4gICAqIGB1cHBlckZpcnN0YCwgYHZhbHVlYCwgYW5kIGB3b3Jkc2BcbiAgICpcbiAgICogQG5hbWUgX1xuICAgKiBAY29uc3RydWN0b3JcbiAgICogQGNhdGVnb3J5IFNlcVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICAgKiAgIHJldHVybiBuICogbjtcbiAgICogfVxuICAgKlxuICAgKiB2YXIgd3JhcHBlZCA9IF8oWzEsIDIsIDNdKTtcbiAgICpcbiAgICogLy8gUmV0dXJucyBhbiB1bndyYXBwZWQgdmFsdWUuXG4gICAqIHdyYXBwZWQucmVkdWNlKF8uYWRkKTtcbiAgICogLy8gPT4gNlxuICAgKlxuICAgKiAvLyBSZXR1cm5zIGEgd3JhcHBlZCB2YWx1ZS5cbiAgICogdmFyIHNxdWFyZXMgPSB3cmFwcGVkLm1hcChzcXVhcmUpO1xuICAgKlxuICAgKiBfLmlzQXJyYXkoc3F1YXJlcyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNBcnJheShzcXVhcmVzLnZhbHVlKCkpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBMb2Rhc2hXcmFwcGVyXG4gICAgICA/IHZhbHVlXG4gICAgICA6IG5ldyBMb2Rhc2hXcmFwcGVyKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBjb25zdHJ1Y3RvciBmb3IgY3JlYXRpbmcgYGxvZGFzaGAgd3JhcHBlciBvYmplY3RzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGFpbkFsbF0gRW5hYmxlIGV4cGxpY2l0IG1ldGhvZCBjaGFpbiBzZXF1ZW5jZXMuXG4gICAqL1xuICBmdW5jdGlvbiBMb2Rhc2hXcmFwcGVyKHZhbHVlLCBjaGFpbkFsbCkge1xuICAgIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgICB0aGlzLl9fYWN0aW9uc19fID0gW107XG4gICAgdGhpcy5fX2NoYWluX18gPSAhIWNoYWluQWxsO1xuICB9XG5cbiAgTG9kYXNoV3JhcHBlci5wcm90b3R5cGUgPSBiYXNlQ3JlYXRlKGxvZGFzaC5wcm90b3R5cGUpO1xuICBMb2Rhc2hXcmFwcGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExvZGFzaFdyYXBwZXI7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLmRlZmF1bHRzYCB0byBjdXN0b21pemUgaXRzIGBfLmFzc2lnbkluYCB1c2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gb2JqVmFsdWUgVGhlIGRlc3RpbmF0aW9uIHZhbHVlLlxuICAgKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSBzb3VyY2UgdmFsdWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBvYmpWYWx1ZWAuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gICAqL1xuICBmdW5jdGlvbiBhc3NpZ25JbkRlZmF1bHRzKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICBpZiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAoZXEob2JqVmFsdWUsIG9iamVjdFByb3RvW2tleV0pICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIHJldHVybiBzcmNWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9ialZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAgICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAgICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICAgKi9cbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAgICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlQ3JlYXRlKHByb3RvKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHByb3RvKSA/IG9iamVjdENyZWF0ZShwcm90bykgOiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5kZWxheWAgYW5kIGBfLmRlZmVyYCB3aGljaCBhY2NlcHRzIGFuIGFycmF5XG4gICAqIG9mIGBmdW5jYCBhcmd1bWVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlbGF5LlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBpbnZvY2F0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJncyBUaGUgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lciBpZC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VEZWxheShmdW5jLCB3YWl0LCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgICB9XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgKi9cbiAgdmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmV2ZXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbGwgZWxlbWVudHMgcGFzcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICAgKiAgZWxzZSBgZmFsc2VgXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlRXZlcnkoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXN1bHQgPSAhIXByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5tYXhgIGFuZCBgXy5taW5gIHdoaWNoIGFjY2VwdHMgYVxuICAgKiBgY29tcGFyYXRvcmAgdG8gZGV0ZXJtaW5lIHRoZSBleHRyZW11bSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciB1c2VkIHRvIGNvbXBhcmUgdmFsdWVzLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZXh0cmVtdW0gdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlRXh0cmVtdW0oYXJyYXksIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgICAgY3VycmVudCA9IGl0ZXJhdGVlKHZhbHVlKTtcblxuICAgICAgaWYgKGN1cnJlbnQgIT0gbnVsbCAmJiAoY29tcHV0ZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyAoY3VycmVudCA9PT0gY3VycmVudCAmJiAhZmFsc2UpXG4gICAgICAgICAgICA6IGNvbXBhcmF0b3IoY3VycmVudCwgY29tcHV0ZWQpXG4gICAgICAgICAgKSkge1xuICAgICAgICB2YXIgY29tcHV0ZWQgPSBjdXJyZW50LFxuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmlsdGVyYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcHJlZGljYXRlPWlzRmxhdHRlbmFibGVdIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdD1bXV0gVGhlIGluaXRpYWwgcmVzdWx0IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgZGVwdGgsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IGlzRmxhdHRlbmFibGUpO1xuICAgIHJlc3VsdCB8fCAocmVzdWx0ID0gW10pO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgIGlmIChkZXB0aCA+IDAgJiYgcHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgICAgLy8gUmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgICAgICBiYXNlRmxhdHRlbih2YWx1ZSwgZGVwdGggLSAxLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFycmF5UHVzaChyZXN1bHQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAgICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gICAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICovXG4gIHZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICAgIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mdW5jdGlvbnNgIHdoaWNoIGNyZWF0ZXMgYW4gYXJyYXkgb2ZcbiAgICogYG9iamVjdGAgZnVuY3Rpb24gcHJvcGVydHkgbmFtZXMgZmlsdGVyZWQgZnJvbSBgcHJvcHNgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGZpbHRlci5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBuYW1lcy5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VGdW5jdGlvbnMob2JqZWN0LCBwcm9wcykge1xuICAgIHJldHVybiBiYXNlRmlsdGVyKHByb3BzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKG9iamVjdFtrZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5ndGAgd2hpY2ggZG9lc24ndCBjb2VyY2UgYXJndW1lbnRzIHRvIG51bWJlcnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBgb3RoZXJgLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUd0KHZhbHVlLCBvdGhlcikge1xuICAgIHJldHVybiB2YWx1ZSA+IG90aGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAgICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2JpdG1hc2tdIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuXG4gICAqICBUaGUgYml0bWFzayBtYXkgYmUgY29tcG9zZWQgb2YgdGhlIGZvbGxvd2luZyBmbGFnczpcbiAgICogICAgIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICAgKiAgICAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0KHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYmFzZUlzRXF1YWwsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gICAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAgICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbYml0bWFza10gVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAgICogIGZvciBtb3JlIGRldGFpbHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICAgIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgICAgb2JqVGFnID0gYXJyYXlUYWcsXG4gICAgICAgIG90aFRhZyA9IGFycmF5VGFnO1xuXG4gICAgaWYgKCFvYmpJc0Fycikge1xuICAgICAgb2JqVGFnID0gb2JqZWN0VG9TdHJpbmcuY2FsbChvYmplY3QpO1xuICAgICAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gICAgfVxuICAgIGlmICghb3RoSXNBcnIpIHtcbiAgICAgIG90aFRhZyA9IG9iamVjdFRvU3RyaW5nLmNhbGwob3RoZXIpO1xuICAgICAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG4gICAgfVxuICAgIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcgJiYgIWlzSG9zdE9iamVjdChvYmplY3QpLFxuICAgICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcgJiYgIWlzSG9zdE9iamVjdChvdGhlciksXG4gICAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgICBzdGFjayB8fCAoc3RhY2sgPSBbXSk7XG4gICAgdmFyIHN0YWNrZWQgPSBmaW5kKHN0YWNrLCBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgcmV0dXJuIGVudHJ5WzBdID09PSBvYmplY3Q7XG4gICAgfSk7XG4gICAgaWYgKHN0YWNrZWQgJiYgc3RhY2tlZFsxXSkge1xuICAgICAgcmV0dXJuIHN0YWNrZWRbMV0gPT0gb3RoZXI7XG4gICAgfVxuICAgIHN0YWNrLnB1c2goW29iamVjdCwgb3RoZXJdKTtcbiAgICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgICAgdmFyIHJlc3VsdCA9IChvYmpJc0FycilcbiAgICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKVxuICAgICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgaWYgKCEoYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHKSkge1xuICAgICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghaXNTYW1lVGFnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pdGVyYXRlZWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gW3ZhbHVlPV8uaWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGFuIGl0ZXJhdGVlLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUl0ZXJhdGVlKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICAgIGlmIChmdW5jID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpZGVudGl0eTtcbiAgICB9XG4gICAgcmV0dXJuICh0eXBlb2YgZnVuYyA9PSAnb2JqZWN0JyA/IGJhc2VNYXRjaGVzIDogYmFzZVByb3BlcnR5KShmdW5jKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHNraXAgdGhlIGNvbnN0cnVjdG9yXG4gICAqIHByb3BlcnR5IG9mIHByb3RvdHlwZXMgb3IgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMoT2JqZWN0KG9iamVjdCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCBza2lwIHRoZSBjb25zdHJ1Y3RvclxuICAgKiBwcm9wZXJ0eSBvZiBwcm90b3R5cGVzIG9yIHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0ID09IG51bGwgPyBvYmplY3QgOiBPYmplY3Qob2JqZWN0KTtcblxuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmx0YCB3aGljaCBkb2Vzbid0IGNvZXJjZSBhcmd1bWVudHMgdG8gbnVtYmVycy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgbGVzcyB0aGFuIGBvdGhlcmAsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlTHQodmFsdWUsIG90aGVyKSB7XG4gICAgcmV0dXJuIHZhbHVlIDwgb3RoZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWFwYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZU1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICByZXN1bHQgPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IEFycmF5KGNvbGxlY3Rpb24ubGVuZ3RoKSA6IFtdO1xuXG4gICAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAgcmVzdWx0WysraW5kZXhdID0gaXRlcmF0ZWUodmFsdWUsIGtleSwgY29sbGVjdGlvbik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gICAgdmFyIHByb3BzID0ga2V5cyhzb3VyY2UpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICFsZW5ndGg7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoa2V5IGluIG9iamVjdCAmJlxuICAgICAgICAgICAgICBiYXNlSXNFcXVhbChzb3VyY2Vba2V5XSwgb2JqZWN0W2tleV0sIHVuZGVmaW5lZCwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5waWNrYCB3aXRob3V0IHN1cHBvcnQgZm9yIGluZGl2aWR1YWxcbiAgICogcHJvcGVydHkgaWRlbnRpZmllcnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBwaWNrLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVBpY2sob2JqZWN0LCBwcm9wcykge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHJldHVybiByZWR1Y2UocHJvcHMsIGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCB7fSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc2xpY2VgIHdpdGhvdXQgYW4gaXRlcmF0ZWUgY2FsbCBndWFyZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgICB9XG4gICAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICAgIGlmIChlbmQgPCAwKSB7XG4gICAgICBlbmQgKz0gbGVuZ3RoO1xuICAgIH1cbiAgICBsZW5ndGggPSBzdGFydCA+IGVuZCA/IDAgOiAoKGVuZCAtIHN0YXJ0KSA+Pj4gMCk7XG4gICAgc3RhcnQgPj4+PSAwO1xuXG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UpIHtcbiAgICByZXR1cm4gYmFzZVNsaWNlKHNvdXJjZSwgMCwgc291cmNlLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc29tZWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlU29tZShjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgICB2YXIgcmVzdWx0O1xuXG4gICAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXN1bHQgPSBwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIHJldHVybiAhcmVzdWx0O1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgd3JhcHBlclZhbHVlYCB3aGljaCByZXR1cm5zIHRoZSByZXN1bHQgb2ZcbiAgICogcGVyZm9ybWluZyBhIHNlcXVlbmNlIG9mIGFjdGlvbnMgb24gdGhlIHVud3JhcHBlZCBgdmFsdWVgLCB3aGVyZSBlYWNoXG4gICAqIHN1Y2Nlc3NpdmUgYWN0aW9uIGlzIHN1cHBsaWVkIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHByZXZpb3VzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB1bndyYXBwZWQgdmFsdWUuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFjdGlvbnMgQWN0aW9ucyB0byBwZXJmb3JtIHRvIHJlc29sdmUgdGhlIHVud3JhcHBlZCB2YWx1ZS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVdyYXBwZXJWYWx1ZSh2YWx1ZSwgYWN0aW9ucykge1xuICAgIHZhciByZXN1bHQgPSB2YWx1ZTtcbiAgICByZXR1cm4gcmVkdWNlKGFjdGlvbnMsIGZ1bmN0aW9uKHJlc3VsdCwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gYWN0aW9uLmZ1bmMuYXBwbHkoYWN0aW9uLnRoaXNBcmcsIGFycmF5UHVzaChbcmVzdWx0XSwgYWN0aW9uLmFyZ3MpKTtcbiAgICB9LCByZXN1bHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBhcmVzIHZhbHVlcyB0byBzb3J0IHRoZW0gaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzb3J0IG9yZGVyIGluZGljYXRvciBmb3IgYHZhbHVlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcodmFsdWUsIG90aGVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSBvdGhlcikge1xuICAgICAgdmFyIHZhbElzRGVmaW5lZCA9IHZhbHVlICE9PSB1bmRlZmluZWQsXG4gICAgICAgICAgdmFsSXNOdWxsID0gdmFsdWUgPT09IG51bGwsXG4gICAgICAgICAgdmFsSXNSZWZsZXhpdmUgPSB2YWx1ZSA9PT0gdmFsdWUsXG4gICAgICAgICAgdmFsSXNTeW1ib2wgPSBmYWxzZTtcblxuICAgICAgdmFyIG90aElzRGVmaW5lZCA9IG90aGVyICE9PSB1bmRlZmluZWQsXG4gICAgICAgICAgb3RoSXNOdWxsID0gb3RoZXIgPT09IG51bGwsXG4gICAgICAgICAgb3RoSXNSZWZsZXhpdmUgPSBvdGhlciA9PT0gb3RoZXIsXG4gICAgICAgICAgb3RoSXNTeW1ib2wgPSBmYWxzZTtcblxuICAgICAgaWYgKCghb3RoSXNOdWxsICYmICFvdGhJc1N5bWJvbCAmJiAhdmFsSXNTeW1ib2wgJiYgdmFsdWUgPiBvdGhlcikgfHxcbiAgICAgICAgICAodmFsSXNTeW1ib2wgJiYgb3RoSXNEZWZpbmVkICYmIG90aElzUmVmbGV4aXZlICYmICFvdGhJc051bGwgJiYgIW90aElzU3ltYm9sKSB8fFxuICAgICAgICAgICh2YWxJc051bGwgJiYgb3RoSXNEZWZpbmVkICYmIG90aElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAgICghdmFsSXNEZWZpbmVkICYmIG90aElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAgICF2YWxJc1JlZmxleGl2ZSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIGlmICgoIXZhbElzTnVsbCAmJiAhdmFsSXNTeW1ib2wgJiYgIW90aElzU3ltYm9sICYmIHZhbHVlIDwgb3RoZXIpIHx8XG4gICAgICAgICAgKG90aElzU3ltYm9sICYmIHZhbElzRGVmaW5lZCAmJiB2YWxJc1JlZmxleGl2ZSAmJiAhdmFsSXNOdWxsICYmICF2YWxJc1N5bWJvbCkgfHxcbiAgICAgICAgICAob3RoSXNOdWxsICYmIHZhbElzRGVmaW5lZCAmJiB2YWxJc1JlZmxleGl2ZSkgfHxcbiAgICAgICAgICAoIW90aElzRGVmaW5lZCAmJiB2YWxJc1JlZmxleGl2ZSkgfHxcbiAgICAgICAgICAhb3RoSXNSZWZsZXhpdmUpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKi9cbiAgZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZVtrZXldO1xuXG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gICAgcmV0dXJuIHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgICB9XG4gICAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBpbnN0YW5jZSBvZiBgQ3RvcmAgcmVnYXJkbGVzcyBvZlxuICAgKiB3aGV0aGVyIGl0IHdhcyBpbnZva2VkIGFzIHBhcnQgb2YgYSBgbmV3YCBleHByZXNzaW9uIG9yIGJ5IGBjYWxsYCBvciBgYXBwbHlgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDdG9yIFRoZSBjb25zdHJ1Y3RvciB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ3RvcldyYXBwZXIoQ3Rvcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBhIGBzd2l0Y2hgIHN0YXRlbWVudCB0byB3b3JrIHdpdGggY2xhc3MgY29uc3RydWN0b3JzLiBTZWVcbiAgICAgIC8vIGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWVjbWFzY3JpcHQtZnVuY3Rpb24tb2JqZWN0cy1jYWxsLXRoaXNhcmd1bWVudC1hcmd1bWVudHNsaXN0XG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgdGhpc0JpbmRpbmcgPSBiYXNlQ3JlYXRlKEN0b3IucHJvdG90eXBlKSxcbiAgICAgICAgICByZXN1bHQgPSBDdG9yLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcblxuICAgICAgLy8gTWltaWMgdGhlIGNvbnN0cnVjdG9yJ3MgYHJldHVybmAgYmVoYXZpb3IuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4MTMuMi4yIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBfLmZpbmRgIG9yIGBfLmZpbmRMYXN0YCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZmluZEluZGV4RnVuYyBUaGUgZnVuY3Rpb24gdG8gZmluZCB0aGUgY29sbGVjdGlvbiBpbmRleC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmluZCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUZpbmQoZmluZEluZGV4RnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuICAgICAgcHJlZGljYXRlID0gYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyk7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGtleXMoY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXhGdW5jKHByb3BzIHx8IGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgICAga2V5ID0gdmFsdWU7XG4gICAgICAgICAgdmFsdWUgPSBpdGVyYWJsZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmVkaWNhdGUodmFsdWUsIGtleSwgaXRlcmFibGUpO1xuICAgICAgfSwgZnJvbUluZGV4KTtcbiAgICAgIHJldHVybiBpbmRleCA+IC0xID8gY29sbGVjdGlvbltwcm9wcyA/IHByb3BzW2luZGV4XSA6IGluZGV4XSA6IHVuZGVmaW5lZDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmdcbiAgICogb2YgYHRoaXNBcmdgIGFuZCBgcGFydGlhbHNgIHByZXBlbmRlZCB0byB0aGUgYXJndW1lbnRzIGl0IHJlY2VpdmVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiB3cmFwcGVyIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBwZXJgXG4gICAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAgICogQHBhcmFtIHtBcnJheX0gcGFydGlhbHMgVGhlIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRob3NlIHByb3ZpZGVkIHRvXG4gICAqICB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlUGFydGlhbFdyYXBwZXIoZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICB2YXIgaXNCaW5kID0gYml0bWFzayAmIEJJTkRfRkxBRyxcbiAgICAgICAgQ3RvciA9IGNyZWF0ZUN0b3JXcmFwcGVyKGZ1bmMpO1xuXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICBsZWZ0SW5kZXggPSAtMSxcbiAgICAgICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgICAgIGFyZ3MgPSBBcnJheShsZWZ0TGVuZ3RoICsgYXJnc0xlbmd0aCksXG4gICAgICAgICAgZm4gPSAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuXG4gICAgICB3aGlsZSAoKytsZWZ0SW5kZXggPCBsZWZ0TGVuZ3RoKSB7XG4gICAgICAgIGFyZ3NbbGVmdEluZGV4XSA9IHBhcnRpYWxzW2xlZnRJbmRleF07XG4gICAgICB9XG4gICAgICB3aGlsZSAoYXJnc0xlbmd0aC0tKSB7XG4gICAgICAgIGFyZ3NbbGVmdEluZGV4KytdID0gYXJndW1lbnRzWysrYXJnc0luZGV4XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmbi5hcHBseShpc0JpbmQgPyB0aGlzQXJnIDogdGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAgICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICAgKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRyxcbiAgICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgICBzZWVuID0gKGJpdG1hc2sgJiBVTk9SREVSRURfQ09NUEFSRV9GTEFHKSA/IFtdIDogdW5kZWZpbmVkO1xuXG4gICAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICAgIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICAgIHZhciBjb21wYXJlZDtcbiAgICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBpZiAoc2Vlbikge1xuICAgICAgICBpZiAoIWJhc2VTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgICAgaWYgKCFpbmRleE9mKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaylcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gICAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAgICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICAgKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICAgIHN3aXRjaCAodGFnKSB7XG5cbiAgICAgIGNhc2UgYm9vbFRhZzpcbiAgICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1iZXJzLCBkYXRlcyB0byBtaWxsaXNlY29uZHMgYW5kXG4gICAgICAgIC8vIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgdHJlYXRpbmcgaW52YWxpZCBkYXRlcyBjb2VyY2VkIHRvIGBOYU5gIGFzXG4gICAgICAgIC8vIG5vdCBlcXVhbC5cbiAgICAgICAgcmV0dXJuICtvYmplY3QgPT0gK290aGVyO1xuXG4gICAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgICAgLy8gVHJlYXQgYE5hTmAgdnMuIGBOYU5gIGFzIGVxdWFsLlxuICAgICAgICByZXR1cm4gKG9iamVjdCAhPSArb2JqZWN0KSA/IG90aGVyICE9ICtvdGhlciA6IG9iamVjdCA9PSArb3RoZXI7XG5cbiAgICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gICAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICAgKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICAgKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcsXG4gICAgICAgIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICAgIG90aFByb3BzID0ga2V5cyhvdGhlciksXG4gICAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICAgIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgICB2YXIgY29tcGFyZWQ7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpXG4gICAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICAgKSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhXG4gICAqIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKSB0aGF0IGFmZmVjdHNcbiAgICogU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICAgKi9cbiAgdmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZmxhdHRlbmFibGUgYGFyZ3VtZW50c2Agb2JqZWN0IG9yIGFycmF5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZmxhdHRlbmFibGUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzRmxhdHRlbmFibGUodmFsdWUpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAgICovXG4gIHZhciB0b0tleSA9IFN0cmluZztcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgd2l0aCBhbGwgZmFsc2V5IHZhbHVlcyByZW1vdmVkLiBUaGUgdmFsdWVzIGBmYWxzZWAsIGBudWxsYCxcbiAgICogYDBgLCBgXCJcImAsIGB1bmRlZmluZWRgLCBhbmQgYE5hTmAgYXJlIGZhbHNleS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYWN0LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uY29tcGFjdChbMCwgMSwgZmFsc2UsIDIsICcnLCAzXSk7XG4gICAqIC8vID0+IFsxLCAyLCAzXVxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGFjdChhcnJheSkge1xuICAgIHJldHVybiBiYXNlRmlsdGVyKGFycmF5LCBCb29sZWFuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGFycmF5IGNvbmNhdGVuYXRpbmcgYGFycmF5YCB3aXRoIGFueSBhZGRpdGlvbmFsIGFycmF5c1xuICAgKiBhbmQvb3IgdmFsdWVzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbmNhdGVuYXRlLlxuICAgKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY29uY2F0ZW5hdGUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGNvbmNhdGVuYXRlZCBhcnJheS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGFycmF5ID0gWzFdO1xuICAgKiB2YXIgb3RoZXIgPSBfLmNvbmNhdChhcnJheSwgMiwgWzNdLCBbWzRdXSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKG90aGVyKTtcbiAgICogLy8gPT4gWzEsIDIsIDMsIFs0XV1cbiAgICpcbiAgICogY29uc29sZS5sb2coYXJyYXkpO1xuICAgKiAvLyA9PiBbMV1cbiAgICovXG4gIGZ1bmN0aW9uIGNvbmNhdCgpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCA/IGxlbmd0aCAtIDEgOiAwKSxcbiAgICAgICAgYXJyYXkgPSBhcmd1bWVudHNbMF0sXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIGFyZ3NbaW5kZXggLSAxXSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGhcbiAgICAgID8gYXJyYXlQdXNoKGlzQXJyYXkoYXJyYXkpID8gY29weUFycmF5KGFycmF5KSA6IFthcnJheV0sIGJhc2VGbGF0dGVuKGFyZ3MsIDEpKVxuICAgICAgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdFxuICAgKiBlbGVtZW50IGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvciBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMS4xLjBcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gICAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IHRydWUgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLmZpbmRJbmRleCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby51c2VyID09ICdiYXJuZXknOyB9KTtcbiAgICogLy8gPT4gMFxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbmRJbmRleCh1c2VycywgeyAndXNlcic6ICdmcmVkJywgJ2FjdGl2ZSc6IGZhbHNlIH0pO1xuICAgKiAvLyA9PiAxXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maW5kSW5kZXgodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAgICogLy8gPT4gMFxuICAgKlxuICAgKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maW5kSW5kZXgodXNlcnMsICdhY3RpdmUnKTtcbiAgICogLy8gPT4gMlxuICAgKi9cbiAgZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZnJvbUluZGV4ID09IG51bGwgPyAwIDogdG9JbnRlZ2VyKGZyb21JbmRleCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgaW5kZXggPSBuYXRpdmVNYXgobGVuZ3RoICsgaW5kZXgsIDApO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyksIGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVucyBgYXJyYXlgIGEgc2luZ2xlIGxldmVsIGRlZXAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAgICogLy8gPT4gWzEsIDIsIFszLCBbNF1dLCA1XVxuICAgKi9cbiAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgcmV0dXJuIGxlbmd0aCA/IGJhc2VGbGF0dGVuKGFycmF5LCAxKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IGZsYXR0ZW5zIGBhcnJheWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmZsYXR0ZW5EZWVwKFsxLCBbMiwgWzMsIFs0XV0sIDVdXSk7XG4gICAqIC8vID0+IFsxLCAyLCAzLCA0LCA1XVxuICAgKi9cbiAgZnVuY3Rpb24gZmxhdHRlbkRlZXAoYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgSU5GSU5JVFkpIDogW107XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAYWxpYXMgZmlyc3RcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5oZWFkKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IDFcbiAgICpcbiAgICogXy5oZWFkKFtdKTtcbiAgICogLy8gPT4gdW5kZWZpbmVkXG4gICAqL1xuICBmdW5jdGlvbiBoZWFkKGFycmF5KSB7XG4gICAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpID8gYXJyYXlbMF0gOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCBpbiBgYXJyYXlgXG4gICAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gICAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy4gSWYgYGZyb21JbmRleGAgaXMgbmVnYXRpdmUsIGl0J3MgdXNlZCBhcyB0aGVcbiAgICogb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiBgYXJyYXlgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmluZGV4T2YoWzEsIDIsIDEsIDJdLCAyKTtcbiAgICogLy8gPT4gMVxuICAgKlxuICAgKiAvLyBTZWFyY2ggZnJvbSB0aGUgYGZyb21JbmRleGAuXG4gICAqIF8uaW5kZXhPZihbMSwgMiwgMSwgMl0sIDIsIDIpO1xuICAgKiAvLyA9PiAzXG4gICAqL1xuICBmdW5jdGlvbiBpbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICBpZiAodHlwZW9mIGZyb21JbmRleCA9PSAnbnVtYmVyJykge1xuICAgICAgZnJvbUluZGV4ID0gZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heChsZW5ndGggKyBmcm9tSW5kZXgsIDApIDogZnJvbUluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tSW5kZXggPSAwO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSAoZnJvbUluZGV4IHx8IDApIC0gMSxcbiAgICAgICAgaXNSZWZsZXhpdmUgPSB2YWx1ZSA9PT0gdmFsdWU7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIG90aGVyID0gYXJyYXlbaW5kZXhdO1xuICAgICAgaWYgKChpc1JlZmxleGl2ZSA/IG90aGVyID09PSB2YWx1ZSA6IG90aGVyICE9PSBvdGhlcikpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGFzdCBlbGVtZW50IG9mIGBhcnJheWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5sYXN0KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IDNcbiAgICovXG4gIGZ1bmN0aW9uIGxhc3QoYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIHJldHVybiBsZW5ndGggPyBhcnJheVtsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCBmcm9tIGBzdGFydGAgdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIHVzZWQgaW5zdGVhZCBvZlxuICAgKiBbYEFycmF5I3NsaWNlYF0oaHR0cHM6Ly9tZG4uaW8vQXJyYXkvc2xpY2UpIHRvIGVuc3VyZSBkZW5zZSBhcnJheXMgYXJlXG4gICAqIHJldHVybmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gICAqL1xuICBmdW5jdGlvbiBzbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgc3RhcnQgPSBzdGFydCA9PSBudWxsID8gMCA6ICtzdGFydDtcbiAgICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6ICtlbmQ7XG4gICAgcmV0dXJuIGxlbmd0aCA/IGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCkgOiBbXTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UgdGhhdCB3cmFwcyBgdmFsdWVgIHdpdGggZXhwbGljaXQgbWV0aG9kXG4gICAqIGNoYWluIHNlcXVlbmNlcyBlbmFibGVkLiBUaGUgcmVzdWx0IG9mIHN1Y2ggc2VxdWVuY2VzIG11c3QgYmUgdW53cmFwcGVkXG4gICAqIHdpdGggYF8jdmFsdWVgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAxLjMuMFxuICAgKiBAY2F0ZWdvcnkgU2VxXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2IH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwIH0sXG4gICAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgKiBdO1xuICAgKlxuICAgKiB2YXIgeW91bmdlc3QgPSBfXG4gICAqICAgLmNoYWluKHVzZXJzKVxuICAgKiAgIC5zb3J0QnkoJ2FnZScpXG4gICAqICAgLm1hcChmdW5jdGlvbihvKSB7XG4gICAqICAgICByZXR1cm4gby51c2VyICsgJyBpcyAnICsgby5hZ2U7XG4gICAqICAgfSlcbiAgICogICAuaGVhZCgpXG4gICAqICAgLnZhbHVlKCk7XG4gICAqIC8vID0+ICdwZWJibGVzIGlzIDEnXG4gICAqL1xuICBmdW5jdGlvbiBjaGFpbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBsb2Rhc2godmFsdWUpO1xuICAgIHJlc3VsdC5fX2NoYWluX18gPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaW52b2tlcyBgaW50ZXJjZXB0b3JgIGFuZCByZXR1cm5zIGB2YWx1ZWAuIFRoZSBpbnRlcmNlcHRvclxuICAgKiBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0b1xuICAgKiBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4gc2VxdWVuY2UgaW4gb3JkZXIgdG8gbW9kaWZ5IGludGVybWVkaWF0ZSByZXN1bHRzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgU2VxXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb3ZpZGUgdG8gYGludGVyY2VwdG9yYC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaW50ZXJjZXB0b3IgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXyhbMSwgMiwgM10pXG4gICAqICAudGFwKGZ1bmN0aW9uKGFycmF5KSB7XG4gICAqICAgIC8vIE11dGF0ZSBpbnB1dCBhcnJheS5cbiAgICogICAgYXJyYXkucG9wKCk7XG4gICAqICB9KVxuICAgKiAgLnJldmVyc2UoKVxuICAgKiAgLnZhbHVlKCk7XG4gICAqIC8vID0+IFsyLCAxXVxuICAgKi9cbiAgZnVuY3Rpb24gdGFwKHZhbHVlLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy50YXBgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIHJlc3VsdCBvZiBgaW50ZXJjZXB0b3JgLlxuICAgKiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInBhc3MgdGhydVwiIHZhbHVlcyByZXBsYWNpbmcgaW50ZXJtZWRpYXRlXG4gICAqIHJlc3VsdHMgaW4gYSBtZXRob2QgY2hhaW4gc2VxdWVuY2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBTZXFcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvdmlkZSB0byBgaW50ZXJjZXB0b3JgLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBpbnRlcmNlcHRvcmAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8oJyAgYWJjICAnKVxuICAgKiAgLmNoYWluKClcbiAgICogIC50cmltKClcbiAgICogIC50aHJ1KGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAqICAgIHJldHVybiBbdmFsdWVdO1xuICAgKiAgfSlcbiAgICogIC52YWx1ZSgpO1xuICAgKiAvLyA9PiBbJ2FiYyddXG4gICAqL1xuICBmdW5jdGlvbiB0aHJ1KHZhbHVlLCBpbnRlcmNlcHRvcikge1xuICAgIHJldHVybiBpbnRlcmNlcHRvcih2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2Ugd2l0aCBleHBsaWNpdCBtZXRob2QgY2hhaW4gc2VxdWVuY2VzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBuYW1lIGNoYWluXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgU2VxXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIEEgc2VxdWVuY2Ugd2l0aG91dCBleHBsaWNpdCBjaGFpbmluZy5cbiAgICogXyh1c2VycykuaGVhZCgpO1xuICAgKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gICAqXG4gICAqIC8vIEEgc2VxdWVuY2Ugd2l0aCBleHBsaWNpdCBjaGFpbmluZy5cbiAgICogXyh1c2VycylcbiAgICogICAuY2hhaW4oKVxuICAgKiAgIC5oZWFkKClcbiAgICogICAucGljaygndXNlcicpXG4gICAqICAgLnZhbHVlKCk7XG4gICAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JyB9XG4gICAqL1xuICBmdW5jdGlvbiB3cmFwcGVyQ2hhaW4oKSB7XG4gICAgcmV0dXJuIGNoYWluKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBjaGFpbiBzZXF1ZW5jZSB0byByZXNvbHZlIHRoZSB1bndyYXBwZWQgdmFsdWUuXG4gICAqXG4gICAqIEBuYW1lIHZhbHVlXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAYWxpYXMgdG9KU09OLCB2YWx1ZU9mXG4gICAqIEBjYXRlZ29yeSBTZXFcbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHVud3JhcHBlZCB2YWx1ZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXyhbMSwgMiwgM10pLnZhbHVlKCk7XG4gICAqIC8vID0+IFsxLCAyLCAzXVxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcHBlclZhbHVlKCkge1xuICAgIHJldHVybiBiYXNlV3JhcHBlclZhbHVlKHRoaXMuX193cmFwcGVkX18sIHRoaXMuX19hY3Rpb25zX18pO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yICoqYWxsKiogZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLlxuICAgKiBJdGVyYXRpb24gaXMgc3RvcHBlZCBvbmNlIGBwcmVkaWNhdGVgIHJldHVybnMgZmFsc2V5LiBUaGUgcHJlZGljYXRlIGlzXG4gICAqIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV1cbiAgICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbGwgZWxlbWVudHMgcGFzcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmV2ZXJ5KFt0cnVlLCAxLCBudWxsLCAneWVzJ10sIEJvb2xlYW4pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiBmYWxzZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmV2ZXJ5KHVzZXJzLCB7ICd1c2VyJzogJ2Jhcm5leScsICdhY3RpdmUnOiBmYWxzZSB9KTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmV2ZXJ5KHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZXZlcnkodXNlcnMsICdhY3RpdmUnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGV2ZXJ5KGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZ3VhcmQpIHtcbiAgICBwcmVkaWNhdGUgPSBndWFyZCA/IHVuZGVmaW5lZCA6IHByZWRpY2F0ZTtcbiAgICByZXR1cm4gYmFzZUV2ZXJ5KGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICAgKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gICAqIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gICAqIEBzZWUgXy5yZWplY3RcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLmZpbHRlcih1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gIW8uYWN0aXZlOyB9KTtcbiAgICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAgICpcbiAgICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maWx0ZXIodXNlcnMsIHsgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAgICogLy8gPT4gb2JqZWN0cyBmb3IgWydiYXJuZXknXVxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmlsdGVyKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gICAqIC8vID0+IG9iamVjdHMgZm9yIFsnZnJlZCddXG4gICAqXG4gICAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbHRlcih1c2VycywgJ2FjdGl2ZScpO1xuICAgKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gICAqL1xuICBmdW5jdGlvbiBmaWx0ZXIoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGJhc2VGaWx0ZXIoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICAgKiBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV1cbiAgICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hdGNoZWQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAncGViYmxlcycsICdhZ2UnOiAxLCAgJ2FjdGl2ZSc6IHRydWUgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLmZpbmQodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8uYWdlIDwgNDA7IH0pO1xuICAgKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmluZCh1c2VycywgeyAnYWdlJzogMSwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gICAqIC8vID0+IG9iamVjdCBmb3IgJ3BlYmJsZXMnXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maW5kKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gICAqIC8vID0+IG9iamVjdCBmb3IgJ2ZyZWQnXG4gICAqXG4gICAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbmQodXNlcnMsICdhY3RpdmUnKTtcbiAgICogLy8gPT4gb2JqZWN0IGZvciAnYmFybmV5J1xuICAgKi9cbiAgdmFyIGZpbmQgPSBjcmVhdGVGaW5kKGZpbmRJbmRleCk7XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAgICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICAgKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICAgKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAYWxpYXMgZWFjaFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAgICogQHNlZSBfLmZvckVhY2hSaWdodFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfKFsxLCAyXSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICogfSk7XG4gICAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICAgKlxuICAgKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICogfSk7XG4gICAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHJldHVybiBiYXNlRWFjaChjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHZhbHVlcyBieSBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAgdGhydVxuICAgKiBgaXRlcmF0ZWVgLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBNYW55IGxvZGFzaCBtZXRob2RzIGFyZSBndWFyZGVkIHRvIHdvcmsgYXMgaXRlcmF0ZWVzIGZvciBtZXRob2RzIGxpa2VcbiAgICogYF8uZXZlcnlgLCBgXy5maWx0ZXJgLCBgXy5tYXBgLCBgXy5tYXBWYWx1ZXNgLCBgXy5yZWplY3RgLCBhbmQgYF8uc29tZWAuXG4gICAqXG4gICAqIFRoZSBndWFyZGVkIG1ldGhvZHMgYXJlOlxuICAgKiBgYXJ5YCwgYGNodW5rYCwgYGN1cnJ5YCwgYGN1cnJ5UmlnaHRgLCBgZHJvcGAsIGBkcm9wUmlnaHRgLCBgZXZlcnlgLFxuICAgKiBgZmlsbGAsIGBpbnZlcnRgLCBgcGFyc2VJbnRgLCBgcmFuZG9tYCwgYHJhbmdlYCwgYHJhbmdlUmlnaHRgLCBgcmVwZWF0YCxcbiAgICogYHNhbXBsZVNpemVgLCBgc2xpY2VgLCBgc29tZWAsIGBzb3J0QnlgLCBgc3BsaXRgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICAgKiBgdGVtcGxhdGVgLCBgdHJpbWAsIGB0cmltRW5kYCwgYHRyaW1TdGFydGAsIGFuZCBgd29yZHNgXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAgICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAgICogICByZXR1cm4gbiAqIG47XG4gICAqIH1cbiAgICpcbiAgICogXy5tYXAoWzQsIDhdLCBzcXVhcmUpO1xuICAgKiAvLyA9PiBbMTYsIDY0XVxuICAgKlxuICAgKiBfLm1hcCh7ICdhJzogNCwgJ2InOiA4IH0sIHNxdWFyZSk7XG4gICAqIC8vID0+IFsxNiwgNjRdIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnIH1cbiAgICogXTtcbiAgICpcbiAgICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8ubWFwKHVzZXJzLCAndXNlcicpO1xuICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICovXG4gIGZ1bmN0aW9uIG1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHJldHVybiBiYXNlTWFwKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXMgYGNvbGxlY3Rpb25gIHRvIGEgdmFsdWUgd2hpY2ggaXMgdGhlIGFjY3VtdWxhdGVkIHJlc3VsdCBvZiBydW5uaW5nXG4gICAqIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAgdGhydSBgaXRlcmF0ZWVgLCB3aGVyZSBlYWNoIHN1Y2Nlc3NpdmVcbiAgICogaW52b2NhdGlvbiBpcyBzdXBwbGllZCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBwcmV2aW91cy4gSWYgYGFjY3VtdWxhdG9yYFxuICAgKiBpcyBub3QgZ2l2ZW4sIHRoZSBmaXJzdCBlbGVtZW50IG9mIGBjb2xsZWN0aW9uYCBpcyB1c2VkIGFzIHRoZSBpbml0aWFsXG4gICAqIHZhbHVlLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOlxuICAgKiAoYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBNYW55IGxvZGFzaCBtZXRob2RzIGFyZSBndWFyZGVkIHRvIHdvcmsgYXMgaXRlcmF0ZWVzIGZvciBtZXRob2RzIGxpa2VcbiAgICogYF8ucmVkdWNlYCwgYF8ucmVkdWNlUmlnaHRgLCBhbmQgYF8udHJhbnNmb3JtYC5cbiAgICpcbiAgICogVGhlIGd1YXJkZWQgbWV0aG9kcyBhcmU6XG4gICAqIGBhc3NpZ25gLCBgZGVmYXVsdHNgLCBgZGVmYXVsdHNEZWVwYCwgYGluY2x1ZGVzYCwgYG1lcmdlYCwgYG9yZGVyQnlgLFxuICAgKiBhbmQgYHNvcnRCeWBcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBbYWNjdW11bGF0b3JdIFRoZSBpbml0aWFsIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAqIEBzZWUgXy5yZWR1Y2VSaWdodFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnJlZHVjZShbMSwgMl0sIGZ1bmN0aW9uKHN1bSwgbikge1xuICAgKiAgIHJldHVybiBzdW0gKyBuO1xuICAgKiB9LCAwKTtcbiAgICogLy8gPT4gM1xuICAgKlxuICAgKiBfLnJlZHVjZSh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDEgfSwgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAqICAgKHJlc3VsdFt2YWx1ZV0gfHwgKHJlc3VsdFt2YWx1ZV0gPSBbXSkpLnB1c2goa2V5KTtcbiAgICogICByZXR1cm4gcmVzdWx0O1xuICAgKiB9LCB7fSk7XG4gICAqIC8vID0+IHsgJzEnOiBbJ2EnLCAnYyddLCAnMic6IFsnYiddIH0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICovXG4gIGZ1bmN0aW9uIHJlZHVjZShjb2xsZWN0aW9uLCBpdGVyYXRlZSwgYWNjdW11bGF0b3IpIHtcbiAgICByZXR1cm4gYmFzZVJlZHVjZShjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpLCBhY2N1bXVsYXRvciwgYXJndW1lbnRzLmxlbmd0aCA8IDMsIGJhc2VFYWNoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzaXplIG9mIGBjb2xsZWN0aW9uYCBieSByZXR1cm5pbmcgaXRzIGxlbmd0aCBmb3IgYXJyYXktbGlrZVxuICAgKiB2YWx1ZXMgb3IgdGhlIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBmb3Igb2JqZWN0cy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29sbGVjdGlvbiBzaXplLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnNpemUoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gM1xuICAgKlxuICAgKiBfLnNpemUoeyAnYSc6IDEsICdiJzogMiB9KTtcbiAgICogLy8gPT4gMlxuICAgKlxuICAgKiBfLnNpemUoJ3BlYmJsZXMnKTtcbiAgICogLy8gPT4gN1xuICAgKi9cbiAgZnVuY3Rpb24gc2l6ZShjb2xsZWN0aW9uKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbGxlY3Rpb24gPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBrZXlzKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yICoqYW55KiogZWxlbWVudCBvZiBgY29sbGVjdGlvbmAuXG4gICAqIEl0ZXJhdGlvbiBpcyBzdG9wcGVkIG9uY2UgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkuIFRoZSBwcmVkaWNhdGUgaXNcbiAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnNvbWUoW251bGwsIDAsICd5ZXMnLCBmYWxzZV0sIEJvb2xlYW4pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhY3RpdmUnOiB0cnVlIH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWN0aXZlJzogZmFsc2UgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLnNvbWUodXNlcnMsIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FjdGl2ZSc6IGZhbHNlIH0pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uc29tZSh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLnNvbWUodXNlcnMsICdhY3RpdmUnKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gc29tZShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGd1YXJkKSB7XG4gICAgcHJlZGljYXRlID0gZ3VhcmQgPyB1bmRlZmluZWQgOiBwcmVkaWNhdGU7XG4gICAgcmV0dXJuIGJhc2VTb21lKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzLCBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSByZXN1bHRzIG9mXG4gICAqIHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiB0aHJ1IGVhY2ggaXRlcmF0ZWUuIFRoaXMgbWV0aG9kXG4gICAqIHBlcmZvcm1zIGEgc3RhYmxlIHNvcnQsIHRoYXQgaXMsIGl0IHByZXNlcnZlcyB0aGUgb3JpZ2luYWwgc29ydCBvcmRlciBvZlxuICAgKiBlcXVhbCBlbGVtZW50cy4gVGhlIGl0ZXJhdGVlcyBhcmUgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0gey4uLihBcnJheXxBcnJheVtdfEZ1bmN0aW9ufEZ1bmN0aW9uW118T2JqZWN0fE9iamVjdFtdfHN0cmluZ3xzdHJpbmdbXSl9XG4gICAqICBbaXRlcmF0ZWVzPVtfLmlkZW50aXR5XV0gVGhlIGl0ZXJhdGVlcyB0byBzb3J0IGJ5LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBzb3J0ZWQgYXJyYXkuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0OCB9LFxuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAgfSxcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNCB9XG4gICAqIF07XG4gICAqXG4gICAqIF8uc29ydEJ5KHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLnVzZXI7IH0pO1xuICAgKiAvLyA9PiBvYmplY3RzIGZvciBbWydiYXJuZXknLCAzNl0sIFsnYmFybmV5JywgMzRdLCBbJ2ZyZWQnLCA0OF0sIFsnZnJlZCcsIDQwXV1cbiAgICpcbiAgICogXy5zb3J0QnkodXNlcnMsIFsndXNlcicsICdhZ2UnXSk7XG4gICAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM0XSwgWydiYXJuZXknLCAzNl0sIFsnZnJlZCcsIDQwXSwgWydmcmVkJywgNDhdXVxuICAgKlxuICAgKiBfLnNvcnRCeSh1c2VycywgJ3VzZXInLCBmdW5jdGlvbihvKSB7XG4gICAqICAgcmV0dXJuIE1hdGguZmxvb3Ioby5hZ2UgLyAxMCk7XG4gICAqIH0pO1xuICAgKiAvLyA9PiBvYmplY3RzIGZvciBbWydiYXJuZXknLCAzNl0sIFsnYmFybmV5JywgMzRdLCBbJ2ZyZWQnLCA0OF0sIFsnZnJlZCcsIDQwXV1cbiAgICovXG4gIGZ1bmN0aW9uIHNvcnRCeShjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgaXRlcmF0ZWUgPSBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpO1xuXG4gICAgcmV0dXJuIGJhc2VNYXAoYmFzZU1hcChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4geyAndmFsdWUnOiB2YWx1ZSwgJ2luZGV4JzogaW5kZXgrKywgJ2NyaXRlcmlhJzogaXRlcmF0ZWUodmFsdWUsIGtleSwgY29sbGVjdGlvbikgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKG9iamVjdCwgb3RoZXIpIHtcbiAgICAgIHJldHVybiBjb21wYXJlQXNjZW5kaW5nKG9iamVjdC5jcml0ZXJpYSwgb3RoZXIuY3JpdGVyaWEpIHx8IChvYmplY3QuaW5kZXggLSBvdGhlci5pbmRleCk7XG4gICAgfSksIGJhc2VQcm9wZXJ0eSgndmFsdWUnKSk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gICAqIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLCB3aGlsZSBpdCdzIGNhbGxlZCBsZXNzIHRoYW4gYG5gIHRpbWVzLiBTdWJzZXF1ZW50XG4gICAqIGNhbGxzIHRvIHRoZSBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBjYWxscyBhdCB3aGljaCBgZnVuY2AgaXMgbm8gbG9uZ2VyIGludm9rZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5iZWZvcmUoNSwgYWRkQ29udGFjdFRvTGlzdCkpO1xuICAgKiAvLyA9PiBhbGxvd3MgYWRkaW5nIHVwIHRvIDQgY29udGFjdHMgdG8gdGhlIGxpc3RcbiAgICovXG4gIGZ1bmN0aW9uIGJlZm9yZShuLCBmdW5jKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICBuID0gdG9JbnRlZ2VyKG4pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLW4gPiAwKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmIChuIDw9IDEpIHtcbiAgICAgICAgZnVuYyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2BcbiAgICogYW5kIGBwYXJ0aWFsc2AgcHJlcGVuZGVkIHRvIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gICAqXG4gICAqIFRoZSBgXy5iaW5kLnBsYWNlaG9sZGVyYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gYF9gIGluIG1vbm9saXRoaWMgYnVpbGRzLFxuICAgKiBtYXkgYmUgdXNlZCBhcyBhIHBsYWNlaG9sZGVyIGZvciBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gICAqXG4gICAqICoqTm90ZToqKiBVbmxpa2UgbmF0aXZlIGBGdW5jdGlvbiNiaW5kYCwgdGhpcyBtZXRob2QgZG9lc24ndCBzZXQgdGhlIFwibGVuZ3RoXCJcbiAgICogcHJvcGVydHkgb2YgYm91bmQgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAgICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gICAqIEBwYXJhbSB7Li4uKn0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGdyZWV0ID0gZnVuY3Rpb24oZ3JlZXRpbmcsIHB1bmN0dWF0aW9uKSB7XG4gICAqICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy51c2VyICsgcHVuY3R1YXRpb247XG4gICAqIH07XG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gICAqXG4gICAqIHZhciBib3VuZCA9IF8uYmluZChncmVldCwgb2JqZWN0LCAnaGknKTtcbiAgICogYm91bmQoJyEnKTtcbiAgICogLy8gPT4gJ2hpIGZyZWQhJ1xuICAgKlxuICAgKiAvLyBCb3VuZCB3aXRoIHBsYWNlaG9sZGVycy5cbiAgICogdmFyIGJvdW5kID0gXy5iaW5kKGdyZWV0LCBvYmplY3QsIF8sICchJyk7XG4gICAqIGJvdW5kKCdoaScpO1xuICAgKiAvLyA9PiAnaGkgZnJlZCEnXG4gICAqL1xuICB2YXIgYmluZCA9IHJlc3QoZnVuY3Rpb24oZnVuYywgdGhpc0FyZywgcGFydGlhbHMpIHtcbiAgICByZXR1cm4gY3JlYXRlUGFydGlhbFdyYXBwZXIoZnVuYywgQklORF9GTEFHIHwgUEFSVElBTF9GTEFHLCB0aGlzQXJnLCBwYXJ0aWFscyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBEZWZlcnMgaW52b2tpbmcgdGhlIGBmdW5jYCB1bnRpbCB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhcyBjbGVhcmVkLiBBbnlcbiAgICogYWRkaXRpb25hbCBhcmd1bWVudHMgYXJlIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0J3MgaW52b2tlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlZmVyLlxuICAgKiBAcGFyYW0gey4uLip9IFthcmdzXSBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXIgaWQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZGVmZXIoZnVuY3Rpb24odGV4dCkge1xuICAgKiAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgKiB9LCAnZGVmZXJyZWQnKTtcbiAgICogLy8gPT4gTG9ncyAnZGVmZXJyZWQnIGFmdGVyIG9uZSBvciBtb3JlIG1pbGxpc2Vjb25kcy5cbiAgICovXG4gIHZhciBkZWZlciA9IHJlc3QoZnVuY3Rpb24oZnVuYywgYXJncykge1xuICAgIHJldHVybiBiYXNlRGVsYXkoZnVuYywgMSwgYXJncyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBJbnZva2VzIGBmdW5jYCBhZnRlciBgd2FpdGAgbWlsbGlzZWNvbmRzLiBBbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgYXJlXG4gICAqIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0J3MgaW52b2tlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlbGF5LlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBpbnZvY2F0aW9uLlxuICAgKiBAcGFyYW0gey4uLip9IFthcmdzXSBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXIgaWQuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZGVsYXkoZnVuY3Rpb24odGV4dCkge1xuICAgKiAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgKiB9LCAxMDAwLCAnbGF0ZXInKTtcbiAgICogLy8gPT4gTG9ncyAnbGF0ZXInIGFmdGVyIG9uZSBzZWNvbmQuXG4gICAqL1xuICB2YXIgZGVsYXkgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgICByZXR1cm4gYmFzZURlbGF5KGZ1bmMsIHRvTnVtYmVyKHdhaXQpIHx8IDAsIGFyZ3MpO1xuICB9KTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbmVnYXRlcyB0aGUgcmVzdWx0IG9mIHRoZSBwcmVkaWNhdGUgYGZ1bmNgLiBUaGVcbiAgICogYGZ1bmNgIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlXG4gICAqIGNyZWF0ZWQgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIHByZWRpY2F0ZSB0byBuZWdhdGUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG5lZ2F0ZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIGlzRXZlbihuKSB7XG4gICAqICAgcmV0dXJuIG4gJSAyID09IDA7XG4gICAqIH1cbiAgICpcbiAgICogXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBfLm5lZ2F0ZShpc0V2ZW4pKTtcbiAgICogLy8gPT4gWzEsIDMsIDVdXG4gICAqL1xuICBmdW5jdGlvbiBuZWdhdGUocHJlZGljYXRlKSB7XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgcmVzdHJpY3RlZCB0byBpbnZva2luZyBgZnVuY2Agb25jZS4gUmVwZWF0IGNhbGxzXG4gICAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnZvY2F0aW9uLiBUaGUgYGZ1bmNgIGlzXG4gICAqIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgYW5kIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gICAqIGluaXRpYWxpemUoKTtcbiAgICogaW5pdGlhbGl6ZSgpO1xuICAgKiAvLyBgaW5pdGlhbGl6ZWAgaW52b2tlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAgICovXG4gIGZ1bmN0aW9uIG9uY2UoZnVuYykge1xuICAgIHJldHVybiBiZWZvcmUoMiwgZnVuYyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gICAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhc1xuICAgKiBhbiBhcnJheS5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZVxuICAgKiBbcmVzdCBwYXJhbWV0ZXJdKGh0dHBzOi8vbWRuLmlvL3Jlc3RfcGFyYW1ldGVycykuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgc2F5ID0gXy5yZXN0KGZ1bmN0aW9uKHdoYXQsIG5hbWVzKSB7XG4gICAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICAgKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAgICogfSk7XG4gICAqXG4gICAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICAgKiAvLyA9PiAnaGVsbG8gZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gICAqL1xuICBmdW5jdGlvbiByZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgICB9XG4gICAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogdG9JbnRlZ2VyKHN0YXJ0KSwgMCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgICAgfVxuICAgICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgICBpbmRleCA9IC0xO1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgICB9XG4gICAgICBvdGhlckFyZ3Nbc3RhcnRdID0gYXJyYXk7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICAgIH07XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGB2YWx1ZWAuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZVxuICAgKiBbc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG1dKGh0dHBzOi8vbWRuLmlvL1N0cnVjdHVyZWRfY2xvbmVfYWxnb3JpdGhtKVxuICAgKiBhbmQgc3VwcG9ydHMgY2xvbmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLCBkYXRlIG9iamVjdHMsIG1hcHMsXG4gICAqIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZFxuICAgKiBhcnJheXMuIFRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYXJlIGNsb25lZFxuICAgKiBhcyBwbGFpbiBvYmplY3RzLiBBbiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoXG4gICAqIGFzIGVycm9yIG9iamVjdHMsIGZ1bmN0aW9ucywgRE9NIG5vZGVzLCBhbmQgV2Vha01hcHMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICAgKiBAc2VlIF8uY2xvbmVEZWVwXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICAgKlxuICAgKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUob2JqZWN0cyk7XG4gICAqIGNvbnNvbGUubG9nKHNoYWxsb3dbMF0gPT09IG9iamVjdHNbMF0pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBjbG9uZSh2YWx1ZSkge1xuICAgIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKSA/IGNvcHlBcnJheSh2YWx1ZSkgOiBjb3B5T2JqZWN0KHZhbHVlLCBrZXlzKHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYVxuICAgKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICAgKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAgICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICAgKlxuICAgKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmVxKCdhJywgJ2EnKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmVxKE5hTiwgTmFOKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gICAgLy8gU2FmYXJpIDguMSBpbmNvcnJlY3RseSBtYWtlcyBgYXJndW1lbnRzLmNhbGxlZWAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICAgKCFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgfHwgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAgICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICAgKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gICAqIGlzIGFuIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGJvb2xlYW4gcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzQm9vbGVhbihmYWxzZSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0Jvb2xlYW4obnVsbCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBib29sVGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYERhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzRGF0ZShuZXcgRGF0ZSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0RhdGUoJ01vbiBBcHJpbCAyMyAyMDEyJyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBkYXRlVGFnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGVtcHR5IG9iamVjdCwgY29sbGVjdGlvbiwgbWFwLCBvciBzZXQuXG4gICAqXG4gICAqIE9iamVjdHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIG5vIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZFxuICAgKiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBBcnJheS1saWtlIHZhbHVlcyBzdWNoIGFzIGBhcmd1bWVudHNgIG9iamVjdHMsIGFycmF5cywgYnVmZmVycywgc3RyaW5ncywgb3JcbiAgICogalF1ZXJ5LWxpa2UgY29sbGVjdGlvbnMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYGxlbmd0aGAgb2YgYDBgLlxuICAgKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNFbXB0eShudWxsKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRW1wdHkodHJ1ZSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0VtcHR5KDEpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgICAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8XG4gICAgICAgICAgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gIWtleXModmFsdWUpLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gICAqIGVxdWl2YWxlbnQuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAgICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICAgKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICAgKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAgICogbm9kZXMgYXJlICoqbm90Kiogc3VwcG9ydGVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAgICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICAgKlxuICAgKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogb2JqZWN0ID09PSBvdGhlcjtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gICAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmaW5pdGUgcHJpbWl0aXZlIG51bWJlci5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gICAqIFtgTnVtYmVyLmlzRmluaXRlYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzRmluaXRlKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZmluaXRlIG51bWJlcixcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0Zpbml0ZSgzKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNGaW5pdGUoSW5maW5pdHkpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzRmluaXRlKCczJyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgbmF0aXZlSXNGaW5pdGUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzRnVuY3Rpb24oXyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAgIC8vIGFuZCBQaGFudG9tSlMgMS45IHdoaWNoIHJldHVybnMgJ2Z1bmN0aW9uJyBmb3IgYE5vZGVMaXN0YCBpbnN0YW5jZXMuXG4gICAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gICAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICAgKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNMZW5ndGgoMyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNMZW5ndGgoJzMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICAgKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gICAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0KHt9KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdChfLm5vb3ApO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3QobnVsbCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICAgIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gICAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBOYU5gLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAgICogW2BOdW1iZXIuaXNOYU5gXShodHRwczovL21kbi5pby9OdW1iZXIvaXNOYU4pIGFuZCBpcyBub3QgdGhlIHNhbWUgYXNcbiAgICogZ2xvYmFsIFtgaXNOYU5gXShodHRwczovL21kbi5pby9pc05hTikgd2hpY2ggcmV0dXJucyBgdHJ1ZWAgZm9yXG4gICAqIGB1bmRlZmluZWRgIGFuZCBvdGhlciBub24tbnVtYmVyIHZhbHVlcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNOYU4oTmFOKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTmFOKG5ldyBOdW1iZXIoTmFOKSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogaXNOYU4odW5kZWZpbmVkKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTmFOKHVuZGVmaW5lZCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgIC8vIEFuIGBOYU5gIHByaW1pdGl2ZSBpcyB0aGUgb25seSB2YWx1ZSB0aGF0IGlzIG5vdCBlcXVhbCB0byBpdHNlbGYuXG4gICAgLy8gUGVyZm9ybSB0aGUgYHRvU3RyaW5nVGFnYCBjaGVjayBmaXJzdCB0byBhdm9pZCBlcnJvcnMgd2l0aCBzb21lXG4gICAgLy8gQWN0aXZlWCBvYmplY3RzIGluIElFLlxuICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgIT0gK3ZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBudWxsYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBudWxsYCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzTnVsbChudWxsKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTnVsbCh2b2lkIDApO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTnVtYmVyYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICAgKlxuICAgKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmVcbiAgICogY2xhc3NpZmllZCBhcyBudW1iZXJzLCB1c2UgdGhlIGBfLmlzRmluaXRlYCBtZXRob2QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc051bWJlcigzKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOdW1iZXIoSW5maW5pdHkpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOdW1iZXIoJzMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyVGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFJlZ0V4cGAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNSZWdFeHAoL2FiYy8pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNSZWdFeHAoJy9hYmMvJyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1JlZ0V4cCh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gcmVnZXhwVGFnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNTdHJpbmcoMSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNVbmRlZmluZWQobnVsbCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gYXJyYXkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvQXJyYXkoeyAnYSc6IDEsICdiJzogMiB9KTtcbiAgICogLy8gPT4gWzEsIDJdXG4gICAqXG4gICAqIF8udG9BcnJheSgnYWJjJyk7XG4gICAqIC8vID0+IFsnYScsICdiJywgJ2MnXVxuICAgKlxuICAgKiBfLnRvQXJyYXkoMSk7XG4gICAqIC8vID0+IFtdXG4gICAqXG4gICAqIF8udG9BcnJheShudWxsKTtcbiAgICogLy8gPT4gW11cbiAgICovXG4gIGZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlcyh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPyBjb3B5QXJyYXkodmFsdWUpIDogW107XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICAgKiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2ludGVnZXIpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgaW50ZWdlci5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy50b0ludGVnZXIoMy4yKTtcbiAgICogLy8gPT4gM1xuICAgKlxuICAgKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAgICogLy8gPT4gMFxuICAgKlxuICAgKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gICAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gICAqXG4gICAqIF8udG9JbnRlZ2VyKCczLjInKTtcbiAgICogLy8gPT4gM1xuICAgKi9cbiAgdmFyIHRvSW50ZWdlciA9IE51bWJlcjtcblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvTnVtYmVyKDMuMik7XG4gICAqIC8vID0+IDMuMlxuICAgKlxuICAgKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICAgKiAvLyA9PiA1ZS0zMjRcbiAgICpcbiAgICogXy50b051bWJlcihJbmZpbml0eSk7XG4gICAqIC8vID0+IEluZmluaXR5XG4gICAqXG4gICAqIF8udG9OdW1iZXIoJzMuMicpO1xuICAgKiAvLyA9PiAzLjJcbiAgICovXG4gIHZhciB0b051bWJlciA9IE51bWJlcjtcblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAgICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy50b1N0cmluZyhudWxsKTtcbiAgICogLy8gPT4gJydcbiAgICpcbiAgICogXy50b1N0cmluZygtMCk7XG4gICAqIC8vID0+ICctMCdcbiAgICpcbiAgICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAnMSwyLDMnXG4gICAqL1xuICBmdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6ICh2YWx1ZSArICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQXNzaWducyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0cyB0byB0aGVcbiAgICogZGVzdGluYXRpb24gb2JqZWN0LiBTb3VyY2Ugb2JqZWN0cyBhcmUgYXBwbGllZCBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAqIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAgICogW2BPYmplY3QuYXNzaWduYF0oaHR0cHM6Ly9tZG4uaW8vT2JqZWN0L2Fzc2lnbikuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMTAuMFxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBzZWUgXy5hc3NpZ25JblxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBGb28oKSB7XG4gICAqICAgdGhpcy5jID0gMztcbiAgICogfVxuICAgKlxuICAgKiBmdW5jdGlvbiBCYXIoKSB7XG4gICAqICAgdGhpcy5lID0gNTtcbiAgICogfVxuICAgKlxuICAgKiBGb28ucHJvdG90eXBlLmQgPSA0O1xuICAgKiBCYXIucHJvdG90eXBlLmYgPSA2O1xuICAgKlxuICAgKiBfLmFzc2lnbih7ICdhJzogMSB9LCBuZXcgRm9vLCBuZXcgQmFyKTtcbiAgICogLy8gPT4geyAnYSc6IDEsICdjJzogMywgJ2UnOiA1IH1cbiAgICovXG4gIHZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSkge1xuICAgIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmFzc2lnbmAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBvd24gYW5kXG4gICAqIGluaGVyaXRlZCBzb3VyY2UgcHJvcGVydGllcy5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBhbGlhcyBleHRlbmRcbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKiBAc2VlIF8uYXNzaWduXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIEZvbygpIHtcbiAgICogICB0aGlzLmIgPSAyO1xuICAgKiB9XG4gICAqXG4gICAqIGZ1bmN0aW9uIEJhcigpIHtcbiAgICogICB0aGlzLmQgPSA0O1xuICAgKiB9XG4gICAqXG4gICAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gICAqIEJhci5wcm90b3R5cGUuZSA9IDU7XG4gICAqXG4gICAqIF8uYXNzaWduSW4oeyAnYSc6IDEgfSwgbmV3IEZvbywgbmV3IEJhcik7XG4gICAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMywgJ2QnOiA0LCAnZSc6IDUgfVxuICAgKi9cbiAgdmFyIGFzc2lnbkluID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgICBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmFzc2lnbkluYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjdXN0b21pemVyYFxuICAgKiB3aGljaCBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnNcbiAgICogYHVuZGVmaW5lZGAsIGFzc2lnbm1lbnQgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmBcbiAgICogaXMgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzOiAob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBhbGlhcyBleHRlbmRXaXRoXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gc291cmNlcyBUaGUgc291cmNlIG9iamVjdHMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICogQHNlZSBfLmFzc2lnbldpdGhcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUpIHtcbiAgICogICByZXR1cm4gXy5pc1VuZGVmaW5lZChvYmpWYWx1ZSkgPyBzcmNWYWx1ZSA6IG9ialZhbHVlO1xuICAgKiB9XG4gICAqXG4gICAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduSW5XaXRoLCBjdXN0b21pemVyKTtcbiAgICpcbiAgICogZGVmYXVsdHMoeyAnYSc6IDEgfSwgeyAnYic6IDIgfSwgeyAnYSc6IDMgfSk7XG4gICAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICAgKi9cbiAgdmFyIGFzc2lnbkluV2l0aCA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcikge1xuICAgIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0LCBjdXN0b21pemVyKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgYHByb3RvdHlwZWAgb2JqZWN0LiBJZiBhXG4gICAqIGBwcm9wZXJ0aWVzYCBvYmplY3QgaXMgZ2l2ZW4sIGl0cyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllc1xuICAgKiBhcmUgYXNzaWduZWQgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAyLjMuMFxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc10gVGhlIHByb3BlcnRpZXMgdG8gYXNzaWduIHRvIHRoZSBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgKiAgIHRoaXMueCA9IDA7XG4gICAqICAgdGhpcy55ID0gMDtcbiAgICogfVxuICAgKlxuICAgKiBmdW5jdGlvbiBDaXJjbGUoKSB7XG4gICAqICAgU2hhcGUuY2FsbCh0aGlzKTtcbiAgICogfVxuICAgKlxuICAgKiBDaXJjbGUucHJvdG90eXBlID0gXy5jcmVhdGUoU2hhcGUucHJvdG90eXBlLCB7XG4gICAqICAgJ2NvbnN0cnVjdG9yJzogQ2lyY2xlXG4gICAqIH0pO1xuICAgKlxuICAgKiB2YXIgY2lyY2xlID0gbmV3IENpcmNsZTtcbiAgICogY2lyY2xlIGluc3RhbmNlb2YgQ2lyY2xlO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIGNpcmNsZSBpbnN0YW5jZW9mIFNoYXBlO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICByZXR1cm4gcHJvcGVydGllcyA/IGFzc2lnbihyZXN1bHQsIHByb3BlcnRpZXMpIDogcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbnMgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBzb3VyY2VcbiAgICogb2JqZWN0cyB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0XG4gICAqIHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAgICogT25jZSBhIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBzZWUgXy5kZWZhdWx0c0RlZXBcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAgICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICAgKi9cbiAgdmFyIGRlZmF1bHRzID0gcmVzdChmdW5jdGlvbihhcmdzKSB7XG4gICAgYXJncy5wdXNoKHVuZGVmaW5lZCwgYXNzaWduSW5EZWZhdWx0cyk7XG4gICAgcmV0dXJuIGFzc2lnbkluV2l0aC5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9KTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgb2JqZWN0ID0geyAnYSc6IHsgJ2InOiAyIH0gfTtcbiAgICogdmFyIG90aGVyID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICAgKlxuICAgKiBfLmhhcyhvYmplY3QsICdhJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5oYXMob2JqZWN0LCAnYS5iJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5oYXMob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmhhcyhvdGhlciwgJ2EnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGhhcyhvYmplY3QsIHBhdGgpIHtcbiAgICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICAgKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gICAqIGZvciBtb3JlIGRldGFpbHMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBGb28oKSB7XG4gICAqICAgdGhpcy5hID0gMTtcbiAgICogICB0aGlzLmIgPSAyO1xuICAgKiB9XG4gICAqXG4gICAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gICAqXG4gICAqIF8ua2V5cyhuZXcgRm9vKTtcbiAgICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKlxuICAgKiBfLmtleXMoJ2hpJyk7XG4gICAqIC8vID0+IFsnMCcsICcxJ11cbiAgICovXG4gIHZhciBrZXlzID0gYmFzZUtleXM7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gICAqXG4gICAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gRm9vKCkge1xuICAgKiAgIHRoaXMuYSA9IDE7XG4gICAqICAgdGhpcy5iID0gMjtcbiAgICogfVxuICAgKlxuICAgKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICAgKlxuICAgKiBfLmtleXNJbihuZXcgRm9vKTtcbiAgICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gICAqL1xuICB2YXIga2V5c0luID0gYmFzZUtleXNJbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBgb2JqZWN0YCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwcm9wc10gVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIHBpY2suXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICAgKlxuICAgKiBfLnBpY2sob2JqZWN0LCBbJ2EnLCAnYyddKTtcbiAgICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gICAqL1xuICB2YXIgcGljayA9IHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBwcm9wcykge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHt9IDogYmFzZVBpY2sob2JqZWN0LCBiYXNlTWFwKGJhc2VGbGF0dGVuKHByb3BzLCAxKSwgdG9LZXkpKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZ2V0YCBleGNlcHQgdGhhdCBpZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXMgYVxuICAgKiBmdW5jdGlvbiBpdCdzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgaXRzIHBhcmVudCBvYmplY3QgYW5kXG4gICAqIGl0cyByZXN1bHQgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gcmVzb2x2ZS5cbiAgICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYzEnOiAzLCAnYzInOiBfLmNvbnN0YW50KDQpIH0gfV0gfTtcbiAgICpcbiAgICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMxJyk7XG4gICAqIC8vID0+IDNcbiAgICpcbiAgICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMyJyk7XG4gICAqIC8vID0+IDRcbiAgICpcbiAgICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMzJywgJ2RlZmF1bHQnKTtcbiAgICogLy8gPT4gJ2RlZmF1bHQnXG4gICAqXG4gICAqIF8ucmVzdWx0KG9iamVjdCwgJ2FbMF0uYi5jMycsIF8uY29uc3RhbnQoJ2RlZmF1bHQnKSk7XG4gICAqIC8vID0+ICdkZWZhdWx0J1xuICAgKi9cbiAgZnVuY3Rpb24gcmVzdWx0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3RbcGF0aF07XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBGb28oKSB7XG4gICAqICAgdGhpcy5hID0gMTtcbiAgICogICB0aGlzLmIgPSAyO1xuICAgKiB9XG4gICAqXG4gICAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gICAqXG4gICAqIF8udmFsdWVzKG5ldyBGb28pO1xuICAgKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICpcbiAgICogXy52YWx1ZXMoJ2hpJyk7XG4gICAqIC8vID0+IFsnaCcsICdpJ11cbiAgICovXG4gIGZ1bmN0aW9uIHZhbHVlcyhvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID8gYmFzZVZhbHVlcyhvYmplY3QsIGtleXMob2JqZWN0KSkgOiBbXTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgXCImXCIsIFwiPFwiLCBcIj5cIiwgJ1wiJywgXCInXCIsIGFuZCBcIlxcYFwiIGluIGBzdHJpbmdgIHRvXG4gICAqIHRoZWlyIGNvcnJlc3BvbmRpbmcgSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogKipOb3RlOioqIE5vIG90aGVyIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQuIFRvIGVzY2FwZSBhZGRpdGlvbmFsXG4gICAqIGNoYXJhY3RlcnMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICAgKlxuICAgKiBUaG91Z2ggdGhlIFwiPlwiIGNoYXJhY3RlciBpcyBlc2NhcGVkIGZvciBzeW1tZXRyeSwgY2hhcmFjdGVycyBsaWtlXG4gICAqIFwiPlwiIGFuZCBcIi9cIiBkb24ndCBuZWVkIGVzY2FwaW5nIGluIEhUTUwgYW5kIGhhdmUgbm8gc3BlY2lhbCBtZWFuaW5nXG4gICAqIHVubGVzcyB0aGV5J3JlIHBhcnQgb2YgYSB0YWcgb3IgdW5xdW90ZWQgYXR0cmlidXRlIHZhbHVlLiBTZWVcbiAgICogW01hdGhpYXMgQnluZW5zJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzKVxuICAgKiAodW5kZXIgXCJzZW1pLXJlbGF0ZWQgZnVuIGZhY3RcIikgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogQmFja3RpY2tzIGFyZSBlc2NhcGVkIGJlY2F1c2UgaW4gSUUgPCA5LCB0aGV5IGNhbiBicmVhayBvdXQgb2ZcbiAgICogYXR0cmlidXRlIHZhbHVlcyBvciBIVE1MIGNvbW1lbnRzLiBTZWUgWyM1OV0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzU5KSxcbiAgICogWyMxMDJdKGh0dHBzOi8vaHRtbDVzZWMub3JnLyMxMDIpLCBbIzEwOF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwOCksIGFuZFxuICAgKiBbIzEzM10oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEzMykgb2YgdGhlXG4gICAqIFtIVE1MNSBTZWN1cml0eSBDaGVhdHNoZWV0XShodHRwczovL2h0bWw1c2VjLm9yZy8pIGZvciBtb3JlIGRldGFpbHMuXG4gICAqXG4gICAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAgICogW3F1b3RlIGF0dHJpYnV0ZSB2YWx1ZXNdKGh0dHA6Ly93b25rby5jb20vcG9zdC9odG1sLWVzY2FwaW5nKSB0byByZWR1Y2VcbiAgICogWFNTIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gICAqIC8vID0+ICdmcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXMnXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1VuZXNjYXBlZEh0bWwudGVzdChzdHJpbmcpKVxuICAgICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgICAgOiBzdHJpbmc7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGdpdmVuIHRvIGl0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbFxuICAgKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAgICpcbiAgICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWRcbiAgICogZnVuY3Rpb24uIElmIGBmdW5jYCBpcyBhIHByb3BlcnR5IG5hbWUsIHRoZSBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybnMgdGhlXG4gICAqIHByb3BlcnR5IHZhbHVlIGZvciBhIGdpdmVuIGVsZW1lbnQuIElmIGBmdW5jYCBpcyBhbiBhcnJheSBvciBvYmplY3QsIHRoZVxuICAgKiBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybnMgYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGNvbnRhaW4gdGhlIGVxdWl2YWxlbnRcbiAgICogc291cmNlIHByb3BlcnRpZXMsIG90aGVyd2lzZSBpdCByZXR1cm5zIGBmYWxzZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsXG4gICAqIEBwYXJhbSB7Kn0gW2Z1bmM9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbHRlcih1c2VycywgXy5pdGVyYXRlZSh7ICd1c2VyJzogJ2Jhcm5leScsICdhY3RpdmUnOiB0cnVlIH0pKTtcbiAgICogLy8gPT4gW3sgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9XVxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmlsdGVyKHVzZXJzLCBfLml0ZXJhdGVlKFsndXNlcicsICdmcmVkJ10pKTtcbiAgICogLy8gPT4gW3sgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XVxuICAgKlxuICAgKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5tYXAodXNlcnMsIF8uaXRlcmF0ZWUoJ3VzZXInKSk7XG4gICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgKlxuICAgKiAvLyBDcmVhdGUgY3VzdG9tIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqIF8uaXRlcmF0ZWUgPSBfLndyYXAoXy5pdGVyYXRlZSwgZnVuY3Rpb24oaXRlcmF0ZWUsIGZ1bmMpIHtcbiAgICogICByZXR1cm4gIV8uaXNSZWdFeHAoZnVuYykgPyBpdGVyYXRlZShmdW5jKSA6IGZ1bmN0aW9uKHN0cmluZykge1xuICAgKiAgICAgcmV0dXJuIGZ1bmMudGVzdChzdHJpbmcpO1xuICAgKiAgIH07XG4gICAqIH0pO1xuICAgKlxuICAgKiBfLmZpbHRlcihbJ2FiYycsICdkZWYnXSwgL2VmLyk7XG4gICAqIC8vID0+IFsnZGVmJ11cbiAgICovXG4gIHZhciBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYSBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIGEgZ2l2ZW5cbiAgICogb2JqZWN0IGFuZCBgc291cmNlYCwgcmV0dXJuaW5nIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGhhcyBlcXVpdmFsZW50XG4gICAqIHByb3BlcnR5IHZhbHVlcywgZWxzZSBgZmFsc2VgLiBUaGUgY3JlYXRlZCBmdW5jdGlvbiBpcyBlcXVpdmFsZW50IHRvXG4gICAqIGBfLmlzTWF0Y2hgIHdpdGggYSBgc291cmNlYCBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgYF8uaXNFcXVhbGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBVdGlsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH1cbiAgICogXTtcbiAgICpcbiAgICogXy5maWx0ZXIodXNlcnMsIF8ubWF0Y2hlcyh7ICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH0pKTtcbiAgICogLy8gPT4gW3sgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH1dXG4gICAqL1xuICBmdW5jdGlvbiBtYXRjaGVzKHNvdXJjZSkge1xuICAgIHJldHVybiBiYXNlTWF0Y2hlcyhhc3NpZ24oe30sIHNvdXJjZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYWxsIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBmdW5jdGlvbiBwcm9wZXJ0aWVzIG9mIGEgc291cmNlXG4gICAqIG9iamVjdCB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBJZiBgb2JqZWN0YCBpcyBhIGZ1bmN0aW9uLCB0aGVuIG1ldGhvZHNcbiAgICogYXJlIGFkZGVkIHRvIGl0cyBwcm90b3R5cGUgYXMgd2VsbC5cbiAgICpcbiAgICogKipOb3RlOioqIFVzZSBgXy5ydW5JbkNvbnRleHRgIHRvIGNyZWF0ZSBhIHByaXN0aW5lIGBsb2Rhc2hgIGZ1bmN0aW9uIHRvXG4gICAqIGF2b2lkIGNvbmZsaWN0cyBjYXVzZWQgYnkgbW9kaWZ5aW5nIHRoZSBvcmlnaW5hbC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IFtvYmplY3Q9bG9kYXNoXSBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgZnVuY3Rpb25zIHRvIGFkZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2hhaW49dHJ1ZV0gU3BlY2lmeSB3aGV0aGVyIG1peGlucyBhcmUgY2hhaW5hYmxlLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiB2b3dlbHMoc3RyaW5nKSB7XG4gICAqICAgcmV0dXJuIF8uZmlsdGVyKHN0cmluZywgZnVuY3Rpb24odikge1xuICAgKiAgICAgcmV0dXJuIC9bYWVpb3VdL2kudGVzdCh2KTtcbiAgICogICB9KTtcbiAgICogfVxuICAgKlxuICAgKiBfLm1peGluKHsgJ3Zvd2Vscyc6IHZvd2VscyB9KTtcbiAgICogXy52b3dlbHMoJ2ZyZWQnKTtcbiAgICogLy8gPT4gWydlJ11cbiAgICpcbiAgICogXygnZnJlZCcpLnZvd2VscygpLnZhbHVlKCk7XG4gICAqIC8vID0+IFsnZSddXG4gICAqXG4gICAqIF8ubWl4aW4oeyAndm93ZWxzJzogdm93ZWxzIH0sIHsgJ2NoYWluJzogZmFsc2UgfSk7XG4gICAqIF8oJ2ZyZWQnKS52b3dlbHMoKTtcbiAgICogLy8gPT4gWydlJ11cbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKG9iamVjdCwgc291cmNlLCBvcHRpb25zKSB7XG4gICAgdmFyIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgICBtZXRob2ROYW1lcyA9IGJhc2VGdW5jdGlvbnMoc291cmNlLCBwcm9wcyk7XG5cbiAgICBpZiAob3B0aW9ucyA9PSBudWxsICYmXG4gICAgICAgICEoaXNPYmplY3Qoc291cmNlKSAmJiAobWV0aG9kTmFtZXMubGVuZ3RoIHx8ICFwcm9wcy5sZW5ndGgpKSkge1xuICAgICAgb3B0aW9ucyA9IHNvdXJjZTtcbiAgICAgIHNvdXJjZSA9IG9iamVjdDtcbiAgICAgIG9iamVjdCA9IHRoaXM7XG4gICAgICBtZXRob2ROYW1lcyA9IGJhc2VGdW5jdGlvbnMoc291cmNlLCBrZXlzKHNvdXJjZSkpO1xuICAgIH1cbiAgICB2YXIgY2hhaW4gPSAhKGlzT2JqZWN0KG9wdGlvbnMpICYmICdjaGFpbicgaW4gb3B0aW9ucykgfHwgISFvcHRpb25zLmNoYWluLFxuICAgICAgICBpc0Z1bmMgPSBpc0Z1bmN0aW9uKG9iamVjdCk7XG5cbiAgICBiYXNlRWFjaChtZXRob2ROYW1lcywgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBzb3VyY2VbbWV0aG9kTmFtZV07XG4gICAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jO1xuICAgICAgaWYgKGlzRnVuYykge1xuICAgICAgICBvYmplY3QucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGNoYWluQWxsID0gdGhpcy5fX2NoYWluX187XG4gICAgICAgICAgaWYgKGNoYWluIHx8IGNoYWluQWxsKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2JqZWN0KHRoaXMuX193cmFwcGVkX18pLFxuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSByZXN1bHQuX19hY3Rpb25zX18gPSBjb3B5QXJyYXkodGhpcy5fX2FjdGlvbnNfXyk7XG5cbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCh7ICdmdW5jJzogZnVuYywgJ2FyZ3MnOiBhcmd1bWVudHMsICd0aGlzQXJnJzogb2JqZWN0IH0pO1xuICAgICAgICAgICAgcmVzdWx0Ll9fY2hhaW5fXyA9IGNoYWluQWxsO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkob2JqZWN0LCBhcnJheVB1c2goW3RoaXMudmFsdWUoKV0sIGFyZ3VtZW50cykpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnRzIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvXG4gICAqIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGxvZGFzaCA9IF8ubm9Db25mbGljdCgpO1xuICAgKi9cbiAgZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICBpZiAocm9vdC5fID09PSB0aGlzKSB7XG4gICAgICByb290Ll8gPSBvbGREYXNoO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB0aGF0IHJldHVybnMgYHVuZGVmaW5lZGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDIuMy4wXG4gICAqIEBjYXRlZ29yeSBVdGlsXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAgICogLy8gPT4gW3VuZGVmaW5lZCwgdW5kZWZpbmVkXVxuICAgKi9cbiAgZnVuY3Rpb24gbm9vcCgpIHtcbiAgICAvLyBObyBvcGVyYXRpb24gcGVyZm9ybWVkLlxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBJRC4gSWYgYHByZWZpeGAgaXMgZ2l2ZW4sIHRoZSBJRCBpcyBhcHBlbmRlZCB0byBpdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwcmVmaXg9JyddIFRoZSB2YWx1ZSB0byBwcmVmaXggdGhlIElEIHdpdGguXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAgICogLy8gPT4gJ2NvbnRhY3RfMTA0J1xuICAgKlxuICAgKiBfLnVuaXF1ZUlkKCk7XG4gICAqIC8vID0+ICcxMDUnXG4gICAqL1xuICBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlcjtcbiAgICByZXR1cm4gdG9TdHJpbmcocHJlZml4KSArIGlkO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgbWF4aW11bSB2YWx1ZSBvZiBgYXJyYXlgLiBJZiBgYXJyYXlgIGlzIGVtcHR5IG9yIGZhbHNleSxcbiAgICogYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBNYXRoXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLm1heChbNCwgMiwgOCwgNl0pO1xuICAgKiAvLyA9PiA4XG4gICAqXG4gICAqIF8ubWF4KFtdKTtcbiAgICogLy8gPT4gdW5kZWZpbmVkXG4gICAqL1xuICBmdW5jdGlvbiBtYXgoYXJyYXkpIHtcbiAgICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICAgID8gYmFzZUV4dHJlbXVtKGFycmF5LCBpZGVudGl0eSwgYmFzZUd0KVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIG1pbmltdW0gdmFsdWUgb2YgYGFycmF5YC4gSWYgYGFycmF5YCBpcyBlbXB0eSBvciBmYWxzZXksXG4gICAqIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAgICogLy8gPT4gMlxuICAgKlxuICAgKiBfLm1pbihbXSk7XG4gICAqIC8vID0+IHVuZGVmaW5lZFxuICAgKi9cbiAgZnVuY3Rpb24gbWluKGFycmF5KSB7XG4gICAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpXG4gICAgICA/IGJhc2VFeHRyZW11bShhcnJheSwgaWRlbnRpdHksIGJhc2VMdClcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIEFkZCBtZXRob2RzIHRoYXQgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIGluIGNoYWluIHNlcXVlbmNlcy5cbiAgbG9kYXNoLmFzc2lnbkluID0gYXNzaWduSW47XG4gIGxvZGFzaC5iZWZvcmUgPSBiZWZvcmU7XG4gIGxvZGFzaC5iaW5kID0gYmluZDtcbiAgbG9kYXNoLmNoYWluID0gY2hhaW47XG4gIGxvZGFzaC5jb21wYWN0ID0gY29tcGFjdDtcbiAgbG9kYXNoLmNvbmNhdCA9IGNvbmNhdDtcbiAgbG9kYXNoLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgbG9kYXNoLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gIGxvZGFzaC5kZWZlciA9IGRlZmVyO1xuICBsb2Rhc2guZGVsYXkgPSBkZWxheTtcbiAgbG9kYXNoLmZpbHRlciA9IGZpbHRlcjtcbiAgbG9kYXNoLmZsYXR0ZW4gPSBmbGF0dGVuO1xuICBsb2Rhc2guZmxhdHRlbkRlZXAgPSBmbGF0dGVuRGVlcDtcbiAgbG9kYXNoLml0ZXJhdGVlID0gaXRlcmF0ZWU7XG4gIGxvZGFzaC5rZXlzID0ga2V5cztcbiAgbG9kYXNoLm1hcCA9IG1hcDtcbiAgbG9kYXNoLm1hdGNoZXMgPSBtYXRjaGVzO1xuICBsb2Rhc2gubWl4aW4gPSBtaXhpbjtcbiAgbG9kYXNoLm5lZ2F0ZSA9IG5lZ2F0ZTtcbiAgbG9kYXNoLm9uY2UgPSBvbmNlO1xuICBsb2Rhc2gucGljayA9IHBpY2s7XG4gIGxvZGFzaC5zbGljZSA9IHNsaWNlO1xuICBsb2Rhc2guc29ydEJ5ID0gc29ydEJ5O1xuICBsb2Rhc2gudGFwID0gdGFwO1xuICBsb2Rhc2gudGhydSA9IHRocnU7XG4gIGxvZGFzaC50b0FycmF5ID0gdG9BcnJheTtcbiAgbG9kYXNoLnZhbHVlcyA9IHZhbHVlcztcblxuICAvLyBBZGQgYWxpYXNlcy5cbiAgbG9kYXNoLmV4dGVuZCA9IGFzc2lnbkluO1xuXG4gIC8vIEFkZCBtZXRob2RzIHRvIGBsb2Rhc2gucHJvdG90eXBlYC5cbiAgbWl4aW4obG9kYXNoLCBsb2Rhc2gpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBBZGQgbWV0aG9kcyB0aGF0IHJldHVybiB1bndyYXBwZWQgdmFsdWVzIGluIGNoYWluIHNlcXVlbmNlcy5cbiAgbG9kYXNoLmNsb25lID0gY2xvbmU7XG4gIGxvZGFzaC5lc2NhcGUgPSBlc2NhcGU7XG4gIGxvZGFzaC5ldmVyeSA9IGV2ZXJ5O1xuICBsb2Rhc2guZmluZCA9IGZpbmQ7XG4gIGxvZGFzaC5mb3JFYWNoID0gZm9yRWFjaDtcbiAgbG9kYXNoLmhhcyA9IGhhcztcbiAgbG9kYXNoLmhlYWQgPSBoZWFkO1xuICBsb2Rhc2guaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgbG9kYXNoLmluZGV4T2YgPSBpbmRleE9mO1xuICBsb2Rhc2guaXNBcmd1bWVudHMgPSBpc0FyZ3VtZW50cztcbiAgbG9kYXNoLmlzQXJyYXkgPSBpc0FycmF5O1xuICBsb2Rhc2guaXNCb29sZWFuID0gaXNCb29sZWFuO1xuICBsb2Rhc2guaXNEYXRlID0gaXNEYXRlO1xuICBsb2Rhc2guaXNFbXB0eSA9IGlzRW1wdHk7XG4gIGxvZGFzaC5pc0VxdWFsID0gaXNFcXVhbDtcbiAgbG9kYXNoLmlzRmluaXRlID0gaXNGaW5pdGU7XG4gIGxvZGFzaC5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbiAgbG9kYXNoLmlzTmFOID0gaXNOYU47XG4gIGxvZGFzaC5pc051bGwgPSBpc051bGw7XG4gIGxvZGFzaC5pc051bWJlciA9IGlzTnVtYmVyO1xuICBsb2Rhc2guaXNPYmplY3QgPSBpc09iamVjdDtcbiAgbG9kYXNoLmlzUmVnRXhwID0gaXNSZWdFeHA7XG4gIGxvZGFzaC5pc1N0cmluZyA9IGlzU3RyaW5nO1xuICBsb2Rhc2guaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcbiAgbG9kYXNoLmxhc3QgPSBsYXN0O1xuICBsb2Rhc2gubWF4ID0gbWF4O1xuICBsb2Rhc2gubWluID0gbWluO1xuICBsb2Rhc2gubm9Db25mbGljdCA9IG5vQ29uZmxpY3Q7XG4gIGxvZGFzaC5ub29wID0gbm9vcDtcbiAgbG9kYXNoLnJlZHVjZSA9IHJlZHVjZTtcbiAgbG9kYXNoLnJlc3VsdCA9IHJlc3VsdDtcbiAgbG9kYXNoLnNpemUgPSBzaXplO1xuICBsb2Rhc2guc29tZSA9IHNvbWU7XG4gIGxvZGFzaC51bmlxdWVJZCA9IHVuaXF1ZUlkO1xuXG4gIC8vIEFkZCBhbGlhc2VzLlxuICBsb2Rhc2guZWFjaCA9IGZvckVhY2g7XG4gIGxvZGFzaC5maXJzdCA9IGhlYWQ7XG5cbiAgbWl4aW4obG9kYXNoLCAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNvdXJjZSA9IHt9O1xuICAgIGJhc2VGb3JPd24obG9kYXNoLCBmdW5jdGlvbihmdW5jLCBtZXRob2ROYW1lKSB7XG4gICAgICBpZiAoIWhhc093blByb3BlcnR5LmNhbGwobG9kYXNoLnByb3RvdHlwZSwgbWV0aG9kTmFtZSkpIHtcbiAgICAgICAgc291cmNlW21ldGhvZE5hbWVdID0gZnVuYztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9KCkpLCB7ICdjaGFpbic6IGZhbHNlIH0pO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogVGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBsb2Rhc2guVkVSU0lPTiA9IFZFUlNJT047XG5cbiAgLy8gQWRkIGBBcnJheWAgbWV0aG9kcyB0byBgbG9kYXNoLnByb3RvdHlwZWAuXG4gIGJhc2VFYWNoKFsncG9wJywgJ2pvaW4nLCAncmVwbGFjZScsICdyZXZlcnNlJywgJ3NwbGl0JywgJ3B1c2gnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgdmFyIGZ1bmMgPSAoL14oPzpyZXBsYWNlfHNwbGl0KSQvLnRlc3QobWV0aG9kTmFtZSkgPyBTdHJpbmcucHJvdG90eXBlIDogYXJyYXlQcm90bylbbWV0aG9kTmFtZV0sXG4gICAgICAgIGNoYWluTmFtZSA9IC9eKD86cHVzaHxzb3J0fHVuc2hpZnQpJC8udGVzdChtZXRob2ROYW1lKSA/ICd0YXAnIDogJ3RocnUnLFxuICAgICAgICByZXRVbndyYXBwZWQgPSAvXig/OnBvcHxqb2lufHJlcGxhY2V8c2hpZnQpJC8udGVzdChtZXRob2ROYW1lKTtcblxuICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJldFVud3JhcHBlZCAmJiAhdGhpcy5fX2NoYWluX18pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZSgpO1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW10sIGFyZ3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNbY2hhaW5OYW1lXShmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW10sIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGNoYWluIHNlcXVlbmNlIG1ldGhvZHMgdG8gdGhlIGBsb2Rhc2hgIHdyYXBwZXIuXG4gIGxvZGFzaC5wcm90b3R5cGUudG9KU09OID0gbG9kYXNoLnByb3RvdHlwZS52YWx1ZU9mID0gbG9kYXNoLnByb3RvdHlwZS52YWx1ZSA9IHdyYXBwZXJWYWx1ZTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBFeHBvc2UgTG9kYXNoIG9uIHRoZSBmcmVlIHZhcmlhYmxlIGB3aW5kb3dgIG9yIGBzZWxmYCB3aGVuIGF2YWlsYWJsZSBzbyBpdCdzXG4gIC8vIGdsb2JhbGx5IGFjY2Vzc2libGUsIGV2ZW4gd2hlbiBidW5kbGVkIHdpdGggQnJvd3NlcmlmeSwgV2VicGFjaywgZXRjLiBUaGlzXG4gIC8vIGFsc28gcHJldmVudHMgZXJyb3JzIGluIGNhc2VzIHdoZXJlIExvZGFzaCBpcyBsb2FkZWQgYnkgYSBzY3JpcHQgdGFnIGluIHRoZVxuICAvLyBwcmVzZW5jZSBvZiBhbiBBTUQgbG9hZGVyLiBTZWUgaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9lcnJvcnMuaHRtbCNtaXNtYXRjaFxuICAvLyBmb3IgbW9yZSBkZXRhaWxzLiBVc2UgYF8ubm9Db25mbGljdGAgdG8gcmVtb3ZlIExvZGFzaCBmcm9tIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAoZnJlZVNlbGYgfHwge30pLl8gPSBsb2Rhc2g7XG5cbiAgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycyBsaWtlIHIuanMgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIERlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlXG4gICAgLy8gcmVmZXJlbmNlZCBhcyB0aGUgXCJ1bmRlcnNjb3JlXCIgbW9kdWxlLlxuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2Rhc2g7XG4gICAgfSk7XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdC5cbiAgZWxzZSBpZiAoZnJlZU1vZHVsZSkge1xuICAgIC8vIEV4cG9ydCBmb3IgTm9kZS5qcy5cbiAgICAoZnJlZU1vZHVsZS5leHBvcnRzID0gbG9kYXNoKS5fID0gbG9kYXNoO1xuICAgIC8vIEV4cG9ydCBmb3IgQ29tbW9uSlMgc3VwcG9ydC5cbiAgICBmcmVlRXhwb3J0cy5fID0gbG9kYXNoO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIEV4cG9ydCB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAgICByb290Ll8gPSBsb2Rhc2g7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iXX0=