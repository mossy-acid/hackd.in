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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7R0FTQSxDQUFDLENBQUMsVUFBVywwRUFHWCxJQUFJLFNBQUosNkNBSFcsSUFNUCxRQUFVLFFBQVYsaUVBTk8sSUFTUCxnQkFBa0IscUJBQWxCLHVEQVRPLElBWVAsVUFBWSxDQUFaLENBQ0EsYUFBZSxFQUFmLHdEQWJPLElBZ0JQLHVCQUF5QixDQUF6QixDQUNBLHFCQUF1QixDQUF2QiwyREFqQk8sSUFvQlAsU0FBVyxFQUFJLENBQUosQ0FDWCxpQkFBbUIsZ0JBQW5CLDZDQXJCTyxJQXdCUCxRQUFVLG9CQUFWLENBQ0EsU0FBVyxnQkFBWCxDQUNBLFFBQVUsa0JBQVYsQ0FDQSxRQUFVLGVBQVYsQ0FDQSxTQUFXLGdCQUFYLENBQ0EsUUFBVSxtQkFBVixDQUNBLE9BQVMsNEJBQVQsQ0FDQSxVQUFZLGlCQUFaLENBQ0EsVUFBWSxpQkFBWixDQUNBLFVBQVksaUJBQVosQ0FDQSxVQUFZLGlCQUFaLHlEQWxDTyxJQXFDUCxnQkFBa0IsV0FBbEIsQ0FDQSxtQkFBcUIsT0FBTyxnQkFBZ0IsTUFBaEIsQ0FBNUIsaURBdENPLElBeUNQLFlBQWMsQ0FDaEIsSUFBSyxPQUFMLENBQ0EsSUFBSyxNQUFMLENBQ0EsSUFBSyxNQUFMLENBQ0EsSUFBSyxRQUFMLENBQ0EsSUFBSyxPQUFMLENBQ0EsSUFBSyxPQUFMLENBTkUsd0NBekNPLElBbURQLFlBQWMsUUFBTyxtREFBUCxFQUFrQixRQUFsQixFQUE4QixPQUE5Qix1Q0FuRFAsSUFzRFAsV0FBYSxhQUFlLFFBQU8saURBQVAsRUFBaUIsUUFBakIsRUFBNkIsTUFBNUMsb0RBdEROLElBeURQLFdBQWEsWUFBWSxRQUFPLGlEQUFQLEVBQWlCLFFBQWpCLEVBQTZCLE1BQTdCLENBQXpCLHFDQXpETyxJQTREUCxTQUFXLFlBQVksUUFBTyw2Q0FBUCxFQUFlLFFBQWYsRUFBMkIsSUFBM0IsQ0FBdkIsNENB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QixDQUFqQixDQUFxQixNQUFyQjtBQXZ0SFcsR0EwdEhQLE9BQU8sTUFBUCxFQUFpQixVQUFqQixFQUErQixRQUFPLE9BQU8sR0FBUCxDQUFQLEVBQXFCLFFBQXJCLEVBQWlDLE9BQU8sR0FBUCxDQUFZOztBQUc5RSxPQUFPLFVBQVcsQ0FDaEIsT0FBTyxNQUFQLENBRGdCLENBQVgsQ0FBUCxDQUg4RTtBQUFoRixLQVFLLEdBQUksVUFBSixDQUFnQjtBQUVuQixDQUFDLFdBQVcsT0FBWCxDQUFxQixNQUFyQixDQUFELENBQThCLENBQTlCLENBQWtDLE1BQWxDO0FBRm1CLFdBSW5CLENBQVksQ0FBWixDQUFnQixNQUFoQixDQUptQixDQUFoQixLQU1BO0FBRUgsS0FBSyxDQUFMLENBQVMsTUFBVCxDQUZHLENBTkEsQ0FsdUhMLEVBNHVIQSxJQTV1SEEsV0FBRCIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggY29yZSAtbyAuL2Rpc3QvbG9kYXNoLmNvcmUuanNgXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuOyhmdW5jdGlvbigpIHtcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUtRVM1IGVudmlyb25tZW50cy4gKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCBhcyB0aGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuICovXG4gIHZhciBWRVJTSU9OID0gJzQuMTMuMSc7XG5cbiAgLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbiAgdmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuICAvKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xuICB2YXIgQklORF9GTEFHID0gMSxcbiAgICAgIFBBUlRJQUxfRkxBRyA9IDMyO1xuXG4gIC8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xuICB2YXIgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyA9IDEsXG4gICAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbiAgLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG4gIHZhciBJTkZJTklUWSA9IDEgLyAwLFxuICAgICAgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbiAgLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xuICB2YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuICAvKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMuICovXG4gIHZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ2BdL2csXG4gICAgICByZUhhc1VuZXNjYXBlZEh0bWwgPSBSZWdFeHAocmVVbmVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbiAgLyoqIFVzZWQgdG8gbWFwIGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy4gKi9cbiAgdmFyIGh0bWxFc2NhcGVzID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnYCc6ICcmIzk2OydcbiAgfTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbiAgdmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGNoZWNrR2xvYmFsKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xuICB2YXIgZnJlZVNlbGYgPSBjaGVja0dsb2JhbCh0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmKTtcblxuICAvKiogRGV0ZWN0IGB0aGlzYCBhcyB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHRoaXNHbG9iYWwgPSBjaGVja0dsb2JhbCh0eXBlb2YgdGhpcyA9PSAnb2JqZWN0JyAmJiB0aGlzKTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IHRoaXNHbG9iYWwgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAgICovXG4gIGZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gICAgYXJyYXkucHVzaC5hcHBseShhcnJheSwgdmFsdWVzKTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICAgKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVkdWNlYCBhbmQgYF8ucmVkdWNlUmlnaHRgLCB3aXRob3V0IHN1cHBvcnRcbiAgICogZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMsIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYGNvbGxlY3Rpb25gIHVzaW5nIGBlYWNoRnVuY2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBhY2N1bXVsYXRvciBUaGUgaW5pdGlhbCB2YWx1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0QWNjdW0gU3BlY2lmeSB1c2luZyB0aGUgZmlyc3Qgb3IgbGFzdCBlbGVtZW50IG9mXG4gICAqICBgY29sbGVjdGlvbmAgYXMgdGhlIGluaXRpYWwgdmFsdWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYGNvbGxlY3Rpb25gLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlUmVkdWNlKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBhY2N1bXVsYXRvciwgaW5pdEFjY3VtLCBlYWNoRnVuYykge1xuICAgIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgYWNjdW11bGF0b3IgPSBpbml0QWNjdW1cbiAgICAgICAgPyAoaW5pdEFjY3VtID0gZmFsc2UsIHZhbHVlKVxuICAgICAgICA6IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy52YWx1ZXNgIGFuZCBgXy52YWx1ZXNJbmAgd2hpY2ggY3JlYXRlcyBhblxuICAgKiBhcnJheSBvZiBgb2JqZWN0YCBwcm9wZXJ0eSB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvcGVydHkgbmFtZXNcbiAgICogb2YgYHByb3BzYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gZ2V0IHZhbHVlcyBmb3IuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VWYWx1ZXMob2JqZWN0LCBwcm9wcykge1xuICAgIHJldHVybiBiYXNlTWFwKHByb3BzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGdsb2JhbCBvYmplY3QuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgYHZhbHVlYCBpZiBpdCdzIGEgZ2xvYmFsIG9iamVjdCwgZWxzZSBgbnVsbGAuXG4gICAqL1xuICBmdW5jdGlvbiBjaGVja0dsb2JhbCh2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgJiYgdmFsdWUuT2JqZWN0ID09PSBPYmplY3QpID8gdmFsdWUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYF8uZXNjYXBlYCB0byBjb252ZXJ0IGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICovXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWxDaGFyKGNocikge1xuICAgIHJldHVybiBodG1sRXNjYXBlc1tjaHJdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNIb3N0T2JqZWN0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMuICovXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gICAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICAgKiBvZiB2YWx1ZXMuXG4gICAqL1xuICB2YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKiogVXNlZCB0byByZXN0b3JlIHRoZSBvcmlnaW5hbCBgX2AgcmVmZXJlbmNlIGluIGBfLm5vQ29uZmxpY3RgLiAqL1xuICB2YXIgb2xkRGFzaCA9IHJvb3QuXztcblxuICAvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGUsXG4gICAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4gIC8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbiAgdmFyIG5hdGl2ZUlzRmluaXRlID0gcm9vdC5pc0Zpbml0ZSxcbiAgICAgIG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cyxcbiAgICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBsb2Rhc2hgIG9iamVjdCB3aGljaCB3cmFwcyBgdmFsdWVgIHRvIGVuYWJsZSBpbXBsaWNpdCBtZXRob2RcbiAgICogY2hhaW4gc2VxdWVuY2VzLiBNZXRob2RzIHRoYXQgb3BlcmF0ZSBvbiBhbmQgcmV0dXJuIGFycmF5cywgY29sbGVjdGlvbnMsXG4gICAqIGFuZCBmdW5jdGlvbnMgY2FuIGJlIGNoYWluZWQgdG9nZXRoZXIuIE1ldGhvZHMgdGhhdCByZXRyaWV2ZSBhIHNpbmdsZSB2YWx1ZVxuICAgKiBvciBtYXkgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlIHdpbGwgYXV0b21hdGljYWxseSBlbmQgdGhlIGNoYWluIHNlcXVlbmNlXG4gICAqIGFuZCByZXR1cm4gdGhlIHVud3JhcHBlZCB2YWx1ZS4gT3RoZXJ3aXNlLCB0aGUgdmFsdWUgbXVzdCBiZSB1bndyYXBwZWRcbiAgICogd2l0aCBgXyN2YWx1ZWAuXG4gICAqXG4gICAqIEV4cGxpY2l0IGNoYWluIHNlcXVlbmNlcywgd2hpY2ggbXVzdCBiZSB1bndyYXBwZWQgd2l0aCBgXyN2YWx1ZWAsIG1heSBiZVxuICAgKiBlbmFibGVkIHVzaW5nIGBfLmNoYWluYC5cbiAgICpcbiAgICogVGhlIGV4ZWN1dGlvbiBvZiBjaGFpbmVkIG1ldGhvZHMgaXMgbGF6eSwgdGhhdCBpcywgaXQncyBkZWZlcnJlZCB1bnRpbFxuICAgKiBgXyN2YWx1ZWAgaXMgaW1wbGljaXRseSBvciBleHBsaWNpdGx5IGNhbGxlZC5cbiAgICpcbiAgICogTGF6eSBldmFsdWF0aW9uIGFsbG93cyBzZXZlcmFsIG1ldGhvZHMgdG8gc3VwcG9ydCBzaG9ydGN1dCBmdXNpb24uXG4gICAqIFNob3J0Y3V0IGZ1c2lvbiBpcyBhbiBvcHRpbWl6YXRpb24gdG8gbWVyZ2UgaXRlcmF0ZWUgY2FsbHM7IHRoaXMgYXZvaWRzXG4gICAqIHRoZSBjcmVhdGlvbiBvZiBpbnRlcm1lZGlhdGUgYXJyYXlzIGFuZCBjYW4gZ3JlYXRseSByZWR1Y2UgdGhlIG51bWJlciBvZlxuICAgKiBpdGVyYXRlZSBleGVjdXRpb25zLiBTZWN0aW9ucyBvZiBhIGNoYWluIHNlcXVlbmNlIHF1YWxpZnkgZm9yIHNob3J0Y3V0XG4gICAqIGZ1c2lvbiBpZiB0aGUgc2VjdGlvbiBpcyBhcHBsaWVkIHRvIGFuIGFycmF5IG9mIGF0IGxlYXN0IGAyMDBgIGVsZW1lbnRzXG4gICAqIGFuZCBhbnkgaXRlcmF0ZWVzIGFjY2VwdCBvbmx5IG9uZSBhcmd1bWVudC4gVGhlIGhldXJpc3RpYyBmb3Igd2hldGhlciBhXG4gICAqIHNlY3Rpb24gcXVhbGlmaWVzIGZvciBzaG9ydGN1dCBmdXNpb24gaXMgc3ViamVjdCB0byBjaGFuZ2UuXG4gICAqXG4gICAqIENoYWluaW5nIGlzIHN1cHBvcnRlZCBpbiBjdXN0b20gYnVpbGRzIGFzIGxvbmcgYXMgdGhlIGBfI3ZhbHVlYCBtZXRob2QgaXNcbiAgICogZGlyZWN0bHkgb3IgaW5kaXJlY3RseSBpbmNsdWRlZCBpbiB0aGUgYnVpbGQuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uIHRvIGxvZGFzaCBtZXRob2RzLCB3cmFwcGVycyBoYXZlIGBBcnJheWAgYW5kIGBTdHJpbmdgIG1ldGhvZHMuXG4gICAqXG4gICAqIFRoZSB3cmFwcGVyIGBBcnJheWAgbWV0aG9kcyBhcmU6XG4gICAqIGBjb25jYXRgLCBgam9pbmAsIGBwb3BgLCBgcHVzaGAsIGBzaGlmdGAsIGBzb3J0YCwgYHNwbGljZWAsIGFuZCBgdW5zaGlmdGBcbiAgICpcbiAgICogVGhlIHdyYXBwZXIgYFN0cmluZ2AgbWV0aG9kcyBhcmU6XG4gICAqIGByZXBsYWNlYCBhbmQgYHNwbGl0YFxuICAgKlxuICAgKiBUaGUgd3JhcHBlciBtZXRob2RzIHRoYXQgc3VwcG9ydCBzaG9ydGN1dCBmdXNpb24gYXJlOlxuICAgKiBgYXRgLCBgY29tcGFjdGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsIGBkcm9wV2hpbGVgLCBgZmlsdGVyYCwgYGZpbmRgLFxuICAgKiBgZmluZExhc3RgLCBgaGVhZGAsIGBpbml0aWFsYCwgYGxhc3RgLCBgbWFwYCwgYHJlamVjdGAsIGByZXZlcnNlYCwgYHNsaWNlYCxcbiAgICogYHRhaWxgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLCBgdGFrZVJpZ2h0V2hpbGVgLCBgdGFrZVdoaWxlYCwgYW5kIGB0b0FycmF5YFxuICAgKlxuICAgKiBUaGUgY2hhaW5hYmxlIHdyYXBwZXIgbWV0aG9kcyBhcmU6XG4gICAqIGBhZnRlcmAsIGBhcnlgLCBgYXNzaWduYCwgYGFzc2lnbkluYCwgYGFzc2lnbkluV2l0aGAsIGBhc3NpZ25XaXRoYCwgYGF0YCxcbiAgICogYGJlZm9yZWAsIGBiaW5kYCwgYGJpbmRBbGxgLCBgYmluZEtleWAsIGBjYXN0QXJyYXlgLCBgY2hhaW5gLCBgY2h1bmtgLFxuICAgKiBgY29tbWl0YCwgYGNvbXBhY3RgLCBgY29uY2F0YCwgYGNvbmZvcm1zYCwgYGNvbnN0YW50YCwgYGNvdW50QnlgLCBgY3JlYXRlYCxcbiAgICogYGN1cnJ5YCwgYGRlYm91bmNlYCwgYGRlZmF1bHRzYCwgYGRlZmF1bHRzRGVlcGAsIGBkZWZlcmAsIGBkZWxheWAsXG4gICAqIGBkaWZmZXJlbmNlYCwgYGRpZmZlcmVuY2VCeWAsIGBkaWZmZXJlbmNlV2l0aGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsXG4gICAqIGBkcm9wUmlnaHRXaGlsZWAsIGBkcm9wV2hpbGVgLCBgZXh0ZW5kYCwgYGV4dGVuZFdpdGhgLCBgZmlsbGAsIGBmaWx0ZXJgLFxuICAgKiBgZmxhdE1hcGAsIGBmbGF0TWFwRGVlcGAsIGBmbGF0TWFwRGVwdGhgLCBgZmxhdHRlbmAsIGBmbGF0dGVuRGVlcGAsXG4gICAqIGBmbGF0dGVuRGVwdGhgLCBgZmxpcGAsIGBmbG93YCwgYGZsb3dSaWdodGAsIGBmcm9tUGFpcnNgLCBgZnVuY3Rpb25zYCxcbiAgICogYGZ1bmN0aW9uc0luYCwgYGdyb3VwQnlgLCBgaW5pdGlhbGAsIGBpbnRlcnNlY3Rpb25gLCBgaW50ZXJzZWN0aW9uQnlgLFxuICAgKiBgaW50ZXJzZWN0aW9uV2l0aGAsIGBpbnZlcnRgLCBgaW52ZXJ0QnlgLCBgaW52b2tlTWFwYCwgYGl0ZXJhdGVlYCwgYGtleUJ5YCxcbiAgICogYGtleXNgLCBga2V5c0luYCwgYG1hcGAsIGBtYXBLZXlzYCwgYG1hcFZhbHVlc2AsIGBtYXRjaGVzYCwgYG1hdGNoZXNQcm9wZXJ0eWAsXG4gICAqIGBtZW1vaXplYCwgYG1lcmdlYCwgYG1lcmdlV2l0aGAsIGBtZXRob2RgLCBgbWV0aG9kT2ZgLCBgbWl4aW5gLCBgbmVnYXRlYCxcbiAgICogYG50aEFyZ2AsIGBvbWl0YCwgYG9taXRCeWAsIGBvbmNlYCwgYG9yZGVyQnlgLCBgb3ZlcmAsIGBvdmVyQXJnc2AsXG4gICAqIGBvdmVyRXZlcnlgLCBgb3ZlclNvbWVgLCBgcGFydGlhbGAsIGBwYXJ0aWFsUmlnaHRgLCBgcGFydGl0aW9uYCwgYHBpY2tgLFxuICAgKiBgcGlja0J5YCwgYHBsYW50YCwgYHByb3BlcnR5YCwgYHByb3BlcnR5T2ZgLCBgcHVsbGAsIGBwdWxsQWxsYCwgYHB1bGxBbGxCeWAsXG4gICAqIGBwdWxsQWxsV2l0aGAsIGBwdWxsQXRgLCBgcHVzaGAsIGByYW5nZWAsIGByYW5nZVJpZ2h0YCwgYHJlYXJnYCwgYHJlamVjdGAsXG4gICAqIGByZW1vdmVgLCBgcmVzdGAsIGByZXZlcnNlYCwgYHNhbXBsZVNpemVgLCBgc2V0YCwgYHNldFdpdGhgLCBgc2h1ZmZsZWAsXG4gICAqIGBzbGljZWAsIGBzb3J0YCwgYHNvcnRCeWAsIGBzcGxpY2VgLCBgc3ByZWFkYCwgYHRhaWxgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICAgKiBgdGFrZVJpZ2h0V2hpbGVgLCBgdGFrZVdoaWxlYCwgYHRhcGAsIGB0aHJvdHRsZWAsIGB0aHJ1YCwgYHRvQXJyYXlgLFxuICAgKiBgdG9QYWlyc2AsIGB0b1BhaXJzSW5gLCBgdG9QYXRoYCwgYHRvUGxhaW5PYmplY3RgLCBgdHJhbnNmb3JtYCwgYHVuYXJ5YCxcbiAgICogYHVuaW9uYCwgYHVuaW9uQnlgLCBgdW5pb25XaXRoYCwgYHVuaXFgLCBgdW5pcUJ5YCwgYHVuaXFXaXRoYCwgYHVuc2V0YCxcbiAgICogYHVuc2hpZnRgLCBgdW56aXBgLCBgdW56aXBXaXRoYCwgYHVwZGF0ZWAsIGB1cGRhdGVXaXRoYCwgYHZhbHVlc2AsXG4gICAqIGB2YWx1ZXNJbmAsIGB3aXRob3V0YCwgYHdyYXBgLCBgeG9yYCwgYHhvckJ5YCwgYHhvcldpdGhgLCBgemlwYCxcbiAgICogYHppcE9iamVjdGAsIGB6aXBPYmplY3REZWVwYCwgYW5kIGB6aXBXaXRoYFxuICAgKlxuICAgKiBUaGUgd3JhcHBlciBtZXRob2RzIHRoYXQgYXJlICoqbm90KiogY2hhaW5hYmxlIGJ5IGRlZmF1bHQgYXJlOlxuICAgKiBgYWRkYCwgYGF0dGVtcHRgLCBgY2FtZWxDYXNlYCwgYGNhcGl0YWxpemVgLCBgY2VpbGAsIGBjbGFtcGAsIGBjbG9uZWAsXG4gICAqIGBjbG9uZURlZXBgLCBgY2xvbmVEZWVwV2l0aGAsIGBjbG9uZVdpdGhgLCBgZGVidXJyYCwgYGRpdmlkZWAsIGBlYWNoYCxcbiAgICogYGVhY2hSaWdodGAsIGBlbmRzV2l0aGAsIGBlcWAsIGBlc2NhcGVgLCBgZXNjYXBlUmVnRXhwYCwgYGV2ZXJ5YCwgYGZpbmRgLFxuICAgKiBgZmluZEluZGV4YCwgYGZpbmRLZXlgLCBgZmluZExhc3RgLCBgZmluZExhc3RJbmRleGAsIGBmaW5kTGFzdEtleWAsIGBmaXJzdGAsXG4gICAqIGBmbG9vcmAsIGBmb3JFYWNoYCwgYGZvckVhY2hSaWdodGAsIGBmb3JJbmAsIGBmb3JJblJpZ2h0YCwgYGZvck93bmAsXG4gICAqIGBmb3JPd25SaWdodGAsIGBnZXRgLCBgZ3RgLCBgZ3RlYCwgYGhhc2AsIGBoYXNJbmAsIGBoZWFkYCwgYGlkZW50aXR5YCxcbiAgICogYGluY2x1ZGVzYCwgYGluZGV4T2ZgLCBgaW5SYW5nZWAsIGBpbnZva2VgLCBgaXNBcmd1bWVudHNgLCBgaXNBcnJheWAsXG4gICAqIGBpc0FycmF5QnVmZmVyYCwgYGlzQXJyYXlMaWtlYCwgYGlzQXJyYXlMaWtlT2JqZWN0YCwgYGlzQm9vbGVhbmAsXG4gICAqIGBpc0J1ZmZlcmAsIGBpc0RhdGVgLCBgaXNFbGVtZW50YCwgYGlzRW1wdHlgLCBgaXNFcXVhbGAsIGBpc0VxdWFsV2l0aGAsXG4gICAqIGBpc0Vycm9yYCwgYGlzRmluaXRlYCwgYGlzRnVuY3Rpb25gLCBgaXNJbnRlZ2VyYCwgYGlzTGVuZ3RoYCwgYGlzTWFwYCxcbiAgICogYGlzTWF0Y2hgLCBgaXNNYXRjaFdpdGhgLCBgaXNOYU5gLCBgaXNOYXRpdmVgLCBgaXNOaWxgLCBgaXNOdWxsYCxcbiAgICogYGlzTnVtYmVyYCwgYGlzT2JqZWN0YCwgYGlzT2JqZWN0TGlrZWAsIGBpc1BsYWluT2JqZWN0YCwgYGlzUmVnRXhwYCxcbiAgICogYGlzU2FmZUludGVnZXJgLCBgaXNTZXRgLCBgaXNTdHJpbmdgLCBgaXNVbmRlZmluZWRgLCBgaXNUeXBlZEFycmF5YCxcbiAgICogYGlzV2Vha01hcGAsIGBpc1dlYWtTZXRgLCBgam9pbmAsIGBrZWJhYkNhc2VgLCBgbGFzdGAsIGBsYXN0SW5kZXhPZmAsXG4gICAqIGBsb3dlckNhc2VgLCBgbG93ZXJGaXJzdGAsIGBsdGAsIGBsdGVgLCBgbWF4YCwgYG1heEJ5YCwgYG1lYW5gLCBgbWVhbkJ5YCxcbiAgICogYG1pbmAsIGBtaW5CeWAsIGBtdWx0aXBseWAsIGBub0NvbmZsaWN0YCwgYG5vb3BgLCBgbm93YCwgYG50aGAsIGBwYWRgLFxuICAgKiBgcGFkRW5kYCwgYHBhZFN0YXJ0YCwgYHBhcnNlSW50YCwgYHBvcGAsIGByYW5kb21gLCBgcmVkdWNlYCwgYHJlZHVjZVJpZ2h0YCxcbiAgICogYHJlcGVhdGAsIGByZXN1bHRgLCBgcm91bmRgLCBgcnVuSW5Db250ZXh0YCwgYHNhbXBsZWAsIGBzaGlmdGAsIGBzaXplYCxcbiAgICogYHNuYWtlQ2FzZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHNvcnRlZEluZGV4QnlgLCBgc29ydGVkTGFzdEluZGV4YCxcbiAgICogYHNvcnRlZExhc3RJbmRleEJ5YCwgYHN0YXJ0Q2FzZWAsIGBzdGFydHNXaXRoYCwgYHN0dWJBcnJheWAsIGBzdHViRmFsc2VgLFxuICAgKiBgc3R1Yk9iamVjdGAsIGBzdHViU3RyaW5nYCwgYHN0dWJUcnVlYCwgYHN1YnRyYWN0YCwgYHN1bWAsIGBzdW1CeWAsXG4gICAqIGB0ZW1wbGF0ZWAsIGB0aW1lc2AsIGB0b0Zpbml0ZWAsIGB0b0ludGVnZXJgLCBgdG9KU09OYCwgYHRvTGVuZ3RoYCxcbiAgICogYHRvTG93ZXJgLCBgdG9OdW1iZXJgLCBgdG9TYWZlSW50ZWdlcmAsIGB0b1N0cmluZ2AsIGB0b1VwcGVyYCwgYHRyaW1gLFxuICAgKiBgdHJpbUVuZGAsIGB0cmltU3RhcnRgLCBgdHJ1bmNhdGVgLCBgdW5lc2NhcGVgLCBgdW5pcXVlSWRgLCBgdXBwZXJDYXNlYCxcbiAgICogYHVwcGVyRmlyc3RgLCBgdmFsdWVgLCBhbmQgYHdvcmRzYFxuICAgKlxuICAgKiBAbmFtZSBfXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAY2F0ZWdvcnkgU2VxXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAgaW4gYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gICAqICAgcmV0dXJuIG4gKiBuO1xuICAgKiB9XG4gICAqXG4gICAqIHZhciB3cmFwcGVkID0gXyhbMSwgMiwgM10pO1xuICAgKlxuICAgKiAvLyBSZXR1cm5zIGFuIHVud3JhcHBlZCB2YWx1ZS5cbiAgICogd3JhcHBlZC5yZWR1Y2UoXy5hZGQpO1xuICAgKiAvLyA9PiA2XG4gICAqXG4gICAqIC8vIFJldHVybnMgYSB3cmFwcGVkIHZhbHVlLlxuICAgKiB2YXIgc3F1YXJlcyA9IHdyYXBwZWQubWFwKHNxdWFyZSk7XG4gICAqXG4gICAqIF8uaXNBcnJheShzcXVhcmVzKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KHNxdWFyZXMudmFsdWUoKSk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGxvZGFzaCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIExvZGFzaFdyYXBwZXJcbiAgICAgID8gdmFsdWVcbiAgICAgIDogbmV3IExvZGFzaFdyYXBwZXIodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGNvbnN0cnVjdG9yIGZvciBjcmVhdGluZyBgbG9kYXNoYCB3cmFwcGVyIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NoYWluQWxsXSBFbmFibGUgZXhwbGljaXQgbWV0aG9kIGNoYWluIHNlcXVlbmNlcy5cbiAgICovXG4gIGZ1bmN0aW9uIExvZGFzaFdyYXBwZXIodmFsdWUsIGNoYWluQWxsKSB7XG4gICAgdGhpcy5fX3dyYXBwZWRfXyA9IHZhbHVlO1xuICAgIHRoaXMuX19hY3Rpb25zX18gPSBbXTtcbiAgICB0aGlzLl9fY2hhaW5fXyA9ICEhY2hhaW5BbGw7XG4gIH1cblxuICBMb2Rhc2hXcmFwcGVyLnByb3RvdHlwZSA9IGJhc2VDcmVhdGUobG9kYXNoLnByb3RvdHlwZSk7XG4gIExvZGFzaFdyYXBwZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTG9kYXNoV3JhcHBlcjtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduSW5gIHVzZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmpWYWx1ZSBUaGUgZGVzdGluYXRpb24gdmFsdWUuXG4gICAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHNvdXJjZSB2YWx1ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHBhcmVudCBvYmplY3Qgb2YgYG9ialZhbHVlYC5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAgICovXG4gIGZ1bmN0aW9uIGFzc2lnbkluRGVmYXVsdHMob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIChlcShvYmpWYWx1ZSwgb2JqZWN0UHJvdG9ba2V5XSkgJiYgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkge1xuICAgICAgcmV0dXJuIHNyY1ZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICAgKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICAgKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gICAqL1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICAgKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvdHlwZSBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VDcmVhdGUocHJvdG8pIHtcbiAgICByZXR1cm4gaXNPYmplY3QocHJvdG8pID8gb2JqZWN0Q3JlYXRlKHByb3RvKSA6IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmRlbGF5YCBhbmQgYF8uZGVmZXJgIHdoaWNoIGFjY2VwdHMgYW4gYXJyYXlcbiAgICogb2YgYGZ1bmNgIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVsYXkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IGludm9jYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVyIGlkLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZURlbGF5KGZ1bmMsIHdhaXQsIGFyZ3MpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gICAqL1xuICB2YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZXZlcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBwYXNzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gICAqICBlbHNlIGBmYWxzZWBcbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VFdmVyeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJlc3VsdCA9ICEhcHJlZGljYXRlKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgbWV0aG9kcyBsaWtlIGBfLm1heGAgYW5kIGBfLm1pbmAgd2hpY2ggYWNjZXB0cyBhXG4gICAqIGBjb21wYXJhdG9yYCB0byBkZXRlcm1pbmUgdGhlIGV4dHJlbXVtIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIHVzZWQgdG8gY29tcGFyZSB2YWx1ZXMuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBleHRyZW11bSB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VFeHRyZW11bShhcnJheSwgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgICBjdXJyZW50ID0gaXRlcmF0ZWUodmFsdWUpO1xuXG4gICAgICBpZiAoY3VycmVudCAhPSBudWxsICYmIChjb21wdXRlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IChjdXJyZW50ID09PSBjdXJyZW50ICYmICFmYWxzZSlcbiAgICAgICAgICAgIDogY29tcGFyYXRvcihjdXJyZW50LCBjb21wdXRlZClcbiAgICAgICAgICApKSB7XG4gICAgICAgIHZhciBjb21wdXRlZCA9IGN1cnJlbnQsXG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maWx0ZXJgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlRmlsdGVyKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRoIHN1cHBvcnQgZm9yIHJlc3RyaWN0aW5nIGZsYXR0ZW5pbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVwdGggVGhlIG1heGltdW0gcmVjdXJzaW9uIGRlcHRoLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtib29sZWFufSBbaXNTdHJpY3RdIFJlc3RyaWN0IHRvIHZhbHVlcyB0aGF0IHBhc3MgYHByZWRpY2F0ZWAgY2hlY2tzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0PVtdXSBUaGUgaW5pdGlhbCByZXN1bHQgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VGbGF0dGVuKGFycmF5LCBkZXB0aCwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gaXNGbGF0dGVuYWJsZSk7XG4gICAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgICAvLyBSZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyYXlQdXNoKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICAgKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAgICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKi9cbiAgdmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gICAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZ1bmN0aW9uc2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZlxuICAgKiBgb2JqZWN0YCBmdW5jdGlvbiBwcm9wZXJ0eSBuYW1lcyBmaWx0ZXJlZCBmcm9tIGBwcm9wc2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gZmlsdGVyLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGZ1bmN0aW9uIG5hbWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUZ1bmN0aW9ucyhvYmplY3QsIHByb3BzKSB7XG4gICAgcmV0dXJuIGJhc2VGaWx0ZXIocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ob2JqZWN0W2tleV0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmd0YCB3aGljaCBkb2Vzbid0IGNvZXJjZSBhcmd1bWVudHMgdG8gbnVtYmVycy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZ3JlYXRlciB0aGFuIGBvdGhlcmAsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlR3QodmFsdWUsIG90aGVyKSB7XG4gICAgcmV0dXJuIHZhbHVlID4gb3RoZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICAgKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAgICogQHBhcmFtIHtib29sZWFufSBbYml0bWFza10gVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy5cbiAgICogIFRoZSBiaXRtYXNrIG1heSBiZSBjb21wb3NlZCBvZiB0aGUgZm9sbG93aW5nIGZsYWdzOlxuICAgKiAgICAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gICAqICAgICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICAgIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3QodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gICAgfVxuICAgIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiYXNlSXNFcXVhbCwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAgICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICAgKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtiaXRtYXNrXSBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICAgKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gICAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgICBvYmpUYWcgPSBhcnJheVRhZyxcbiAgICAgICAgb3RoVGFnID0gYXJyYXlUYWc7XG5cbiAgICBpZiAoIW9iaklzQXJyKSB7XG4gICAgICBvYmpUYWcgPSBvYmplY3RUb1N0cmluZy5jYWxsKG9iamVjdCk7XG4gICAgICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgICB9XG4gICAgaWYgKCFvdGhJc0Fycikge1xuICAgICAgb3RoVGFnID0gb2JqZWN0VG9TdHJpbmcuY2FsbChvdGhlcik7XG4gICAgICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcbiAgICB9XG4gICAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyAmJiAhaXNIb3N0T2JqZWN0KG9iamVjdCksXG4gICAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyAmJiAhaXNIb3N0T2JqZWN0KG90aGVyKSxcbiAgICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICAgIHN0YWNrIHx8IChzdGFjayA9IFtdKTtcbiAgICB2YXIgc3RhY2tlZCA9IGZpbmQoc3RhY2ssIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICByZXR1cm4gZW50cnlbMF0gPT09IG9iamVjdDtcbiAgICB9KTtcbiAgICBpZiAoc3RhY2tlZCAmJiBzdGFja2VkWzFdKSB7XG4gICAgICByZXR1cm4gc3RhY2tlZFsxXSA9PSBvdGhlcjtcbiAgICB9XG4gICAgc3RhY2sucHVzaChbb2JqZWN0LCBvdGhlcl0pO1xuICAgIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gKG9iaklzQXJyKVxuICAgICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spXG4gICAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICAgICAgc3RhY2sucG9wKCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBpZiAoIShiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcpKSB7XG4gICAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlSXRlcmF0ZWUoZnVuYykge1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZnVuYztcbiAgICB9XG4gICAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGlkZW50aXR5O1xuICAgIH1cbiAgICByZXR1cm4gKHR5cGVvZiBmdW5jID09ICdvYmplY3QnID8gYmFzZU1hdGNoZXMgOiBiYXNlUHJvcGVydHkpKGZ1bmMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3Qgc2tpcCB0aGUgY29uc3RydWN0b3JcbiAgICogcHJvcGVydHkgb2YgcHJvdG90eXBlcyBvciB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhPYmplY3Qob2JqZWN0KSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHNraXAgdGhlIGNvbnN0cnVjdG9yXG4gICAqIHByb3BlcnR5IG9mIHByb3RvdHlwZXMgb3IgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgICBvYmplY3QgPSBvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IE9iamVjdChvYmplY3QpO1xuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubHRgIHdoaWNoIGRvZXNuJ3QgY29lcmNlIGFyZ3VtZW50cyB0byBudW1iZXJzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBsZXNzIHRoYW4gYG90aGVyYCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VMdCh2YWx1ZSwgb3RoZXIpIHtcbiAgICByZXR1cm4gdmFsdWUgPCBvdGhlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXBgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlTWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIHJlc3VsdCA9IGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID8gQXJyYXkoY29sbGVjdGlvbi5sZW5ndGgpIDogW107XG5cbiAgICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXN1bHRbKytpbmRleF0gPSBpdGVyYXRlZSh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNvdXJjZWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlTWF0Y2hlcyhzb3VyY2UpIHtcbiAgICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gIWxlbmd0aDtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIHZhciBrZXkgPSBwcm9wc1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShrZXkgaW4gb2JqZWN0ICYmXG4gICAgICAgICAgICAgIGJhc2VJc0VxdWFsKHNvdXJjZVtrZXldLCBvYmplY3Rba2V5XSwgdW5kZWZpbmVkLCBVTk9SREVSRURfQ09NUEFSRV9GTEFHIHwgUEFSVElBTF9DT01QQVJFX0ZMQUcpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnBpY2tgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbFxuICAgKiBwcm9wZXJ0eSBpZGVudGlmaWVycy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIHBpY2suXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlUGljayhvYmplY3QsIHByb3BzKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgcmV0dXJuIHJlZHVjZShwcm9wcywgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICAgIH1cbiAgICBlbmQgPSBlbmQgPiBsZW5ndGggPyBsZW5ndGggOiBlbmQ7XG4gICAgaWYgKGVuZCA8IDApIHtcbiAgICAgIGVuZCArPSBsZW5ndGg7XG4gICAgfVxuICAgIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgICBzdGFydCA+Pj49IDA7XG5cbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICAgKi9cbiAgZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSkge1xuICAgIHJldHVybiBiYXNlU2xpY2Uoc291cmNlLCAwLCBzb3VyY2UubGVuZ3RoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zb21lYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VTb21lKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICAgIHZhciByZXN1bHQ7XG5cbiAgICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJlc3VsdCA9IHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgcmV0dXJuICFyZXN1bHQ7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGB3cmFwcGVyVmFsdWVgIHdoaWNoIHJldHVybnMgdGhlIHJlc3VsdCBvZlxuICAgKiBwZXJmb3JtaW5nIGEgc2VxdWVuY2Ugb2YgYWN0aW9ucyBvbiB0aGUgdW53cmFwcGVkIGB2YWx1ZWAsIHdoZXJlIGVhY2hcbiAgICogc3VjY2Vzc2l2ZSBhY3Rpb24gaXMgc3VwcGxpZWQgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcHJldmlvdXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHVud3JhcHBlZCB2YWx1ZS5cbiAgICogQHBhcmFtIHtBcnJheX0gYWN0aW9ucyBBY3Rpb25zIHRvIHBlcmZvcm0gdG8gcmVzb2x2ZSB0aGUgdW53cmFwcGVkIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlV3JhcHBlclZhbHVlKHZhbHVlLCBhY3Rpb25zKSB7XG4gICAgdmFyIHJlc3VsdCA9IHZhbHVlO1xuICAgIHJldHVybiByZWR1Y2UoYWN0aW9ucywgZnVuY3Rpb24ocmVzdWx0LCBhY3Rpb24pIHtcbiAgICAgIHJldHVybiBhY3Rpb24uZnVuYy5hcHBseShhY3Rpb24udGhpc0FyZywgYXJyYXlQdXNoKFtyZXN1bHRdLCBhY3Rpb24uYXJncykpO1xuICAgIH0sIHJlc3VsdCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdmFsdWVzIHRvIHNvcnQgdGhlbSBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHNvcnQgb3JkZXIgaW5kaWNhdG9yIGZvciBgdmFsdWVgLlxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGFyZUFzY2VuZGluZyh2YWx1ZSwgb3RoZXIpIHtcbiAgICBpZiAodmFsdWUgIT09IG90aGVyKSB7XG4gICAgICB2YXIgdmFsSXNEZWZpbmVkID0gdmFsdWUgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgICB2YWxJc051bGwgPSB2YWx1ZSA9PT0gbnVsbCxcbiAgICAgICAgICB2YWxJc1JlZmxleGl2ZSA9IHZhbHVlID09PSB2YWx1ZSxcbiAgICAgICAgICB2YWxJc1N5bWJvbCA9IGZhbHNlO1xuXG4gICAgICB2YXIgb3RoSXNEZWZpbmVkID0gb3RoZXIgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgICBvdGhJc051bGwgPSBvdGhlciA9PT0gbnVsbCxcbiAgICAgICAgICBvdGhJc1JlZmxleGl2ZSA9IG90aGVyID09PSBvdGhlcixcbiAgICAgICAgICBvdGhJc1N5bWJvbCA9IGZhbHNlO1xuXG4gICAgICBpZiAoKCFvdGhJc051bGwgJiYgIW90aElzU3ltYm9sICYmICF2YWxJc1N5bWJvbCAmJiB2YWx1ZSA+IG90aGVyKSB8fFxuICAgICAgICAgICh2YWxJc1N5bWJvbCAmJiBvdGhJc0RlZmluZWQgJiYgb3RoSXNSZWZsZXhpdmUgJiYgIW90aElzTnVsbCAmJiAhb3RoSXNTeW1ib2wpIHx8XG4gICAgICAgICAgKHZhbElzTnVsbCAmJiBvdGhJc0RlZmluZWQgJiYgb3RoSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICAgKCF2YWxJc0RlZmluZWQgJiYgb3RoSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICAgIXZhbElzUmVmbGV4aXZlKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgaWYgKCghdmFsSXNOdWxsICYmICF2YWxJc1N5bWJvbCAmJiAhb3RoSXNTeW1ib2wgJiYgdmFsdWUgPCBvdGhlcikgfHxcbiAgICAgICAgICAob3RoSXNTeW1ib2wgJiYgdmFsSXNEZWZpbmVkICYmIHZhbElzUmVmbGV4aXZlICYmICF2YWxJc051bGwgJiYgIXZhbElzU3ltYm9sKSB8fFxuICAgICAgICAgIChvdGhJc051bGwgJiYgdmFsSXNEZWZpbmVkICYmIHZhbElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAgICghb3RoSXNEZWZpbmVkICYmIHZhbElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAgICFvdGhJc1JlZmxleGl2ZSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gICAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqL1xuICBmdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICAgIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICAgIDogc291cmNlW2tleV07XG5cbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgICByZXR1cm4gcmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICAgIH1cbiAgICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGluc3RhbmNlIG9mIGBDdG9yYCByZWdhcmRsZXNzIG9mXG4gICAqIHdoZXRoZXIgaXQgd2FzIGludm9rZWQgYXMgcGFydCBvZiBhIGBuZXdgIGV4cHJlc3Npb24gb3IgYnkgYGNhbGxgIG9yIGBhcHBseWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IEN0b3IgVGhlIGNvbnN0cnVjdG9yIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVDdG9yV3JhcHBlcihDdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIGEgYHN3aXRjaGAgc3RhdGVtZW50IHRvIHdvcmsgd2l0aCBjbGFzcyBjb25zdHJ1Y3RvcnMuIFNlZVxuICAgICAgLy8gaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtZWNtYXNjcmlwdC1mdW5jdGlvbi1vYmplY3RzLWNhbGwtdGhpc2FyZ3VtZW50LWFyZ3VtZW50c2xpc3RcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciB0aGlzQmluZGluZyA9IGJhc2VDcmVhdGUoQ3Rvci5wcm90b3R5cGUpLFxuICAgICAgICAgIHJlc3VsdCA9IEN0b3IuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuXG4gICAgICAvLyBNaW1pYyB0aGUgY29uc3RydWN0b3IncyBgcmV0dXJuYCBiZWhhdmlvci5cbiAgICAgIC8vIFNlZSBodHRwczovL2VzNS5naXRodWIuaW8vI3gxMy4yLjIgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogdGhpc0JpbmRpbmc7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYF8uZmluZGAgb3IgYF8uZmluZExhc3RgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaW5kSW5kZXhGdW5jIFRoZSBmdW5jdGlvbiB0byBmaW5kIHRoZSBjb2xsZWN0aW9uIGluZGV4LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmaW5kIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlRmluZChmaW5kSW5kZXhGdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgICB2YXIgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG4gICAgICBwcmVkaWNhdGUgPSBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKTtcbiAgICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgICAgdmFyIHByb3BzID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleEZ1bmMocHJvcHMgfHwgY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgICBrZXkgPSB2YWx1ZTtcbiAgICAgICAgICB2YWx1ZSA9IGl0ZXJhYmxlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBpdGVyYWJsZSk7XG4gICAgICB9LCBmcm9tSW5kZXgpO1xuICAgICAgcmV0dXJuIGluZGV4ID4gLTEgPyBjb2xsZWN0aW9uW3Byb3BzID8gcHJvcHNbaW5kZXhdIDogaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGludm9rZSBpdCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZ1xuICAgKiBvZiBgdGhpc0FyZ2AgYW5kIGBwYXJ0aWFsc2AgcHJlcGVuZGVkIHRvIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIHdyYXBwZXIgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcHBlcmBcbiAgICogIGZvciBtb3JlIGRldGFpbHMuXG4gICAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG9cbiAgICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVQYXJ0aWFsV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscykge1xuICAgIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICAgIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgQklORF9GTEFHLFxuICAgICAgICBDdG9yID0gY3JlYXRlQ3RvcldyYXBwZXIoZnVuYyk7XG5cbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3NJbmRleCA9IC0xLFxuICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgICAgIGxlZnRMZW5ndGggPSBwYXJ0aWFscy5sZW5ndGgsXG4gICAgICAgICAgYXJncyA9IEFycmF5KGxlZnRMZW5ndGggKyBhcmdzTGVuZ3RoKSxcbiAgICAgICAgICBmbiA9ICh0aGlzICYmIHRoaXMgIT09IHJvb3QgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG5cbiAgICAgIHdoaWxlICgrK2xlZnRJbmRleCA8IGxlZnRMZW5ndGgpIHtcbiAgICAgICAgYXJnc1tsZWZ0SW5kZXhdID0gcGFydGlhbHNbbGVmdEluZGV4XTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChhcmdzTGVuZ3RoLS0pIHtcbiAgICAgICAgYXJnc1tsZWZ0SW5kZXgrK10gPSBhcmd1bWVudHNbKythcmdzSW5kZXhdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZuLmFwcGx5KGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH1cblxuICAvKipcbiAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICAgKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gICAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHLFxuICAgICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICAgIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICAgIHNlZW4gPSAoYml0bWFzayAmIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcpID8gW10gOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gICAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgICAgdmFyIGNvbXBhcmVkO1xuICAgICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIGlmIChzZWVuKSB7XG4gICAgICAgIGlmICghYmFzZVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgICBpZiAoIWluZGV4T2Yoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKVxuICAgICAgICAgICkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAgICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICAgKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gICAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gICAgc3dpdGNoICh0YWcpIHtcblxuICAgICAgY2FzZSBib29sVGFnOlxuICAgICAgY2FzZSBkYXRlVGFnOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWJlcnMsIGRhdGVzIHRvIG1pbGxpc2Vjb25kcyBhbmRcbiAgICAgICAgLy8gYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCB0cmVhdGluZyBpbnZhbGlkIGRhdGVzIGNvZXJjZWQgdG8gYE5hTmAgYXNcbiAgICAgICAgLy8gbm90IGVxdWFsLlxuICAgICAgICByZXR1cm4gK29iamVjdCA9PSArb3RoZXI7XG5cbiAgICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgICAvLyBUcmVhdCBgTmFOYCB2cy4gYE5hTmAgYXMgZXF1YWwuXG4gICAgICAgIHJldHVybiAob2JqZWN0ICE9ICtvYmplY3QpID8gb3RoZXIgIT0gK290aGVyIDogb2JqZWN0ID09ICtvdGhlcjtcblxuICAgICAgY2FzZSByZWdleHBUYWc6XG4gICAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAgICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gICAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRyxcbiAgICAgICAgb2JqUHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gICAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuXG4gICAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICAgIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICAgIHZhciBjb21wYXJlZDtcbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSlcbiAgICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGFcbiAgICogW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpIHRoYXQgYWZmZWN0c1xuICAgKiBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gICAqL1xuICB2YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmbGF0dGVuYWJsZSBgYXJndW1lbnRzYCBvYmplY3Qgb3IgYXJyYXkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmbGF0dGVuYWJsZSwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNGbGF0dGVuYWJsZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICAgKi9cbiAgdmFyIHRvS2V5ID0gU3RyaW5nO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSB3aXRoIGFsbCBmYWxzZXkgdmFsdWVzIHJlbW92ZWQuIFRoZSB2YWx1ZXMgYGZhbHNlYCwgYG51bGxgLFxuICAgKiBgMGAsIGBcIlwiYCwgYHVuZGVmaW5lZGAsIGFuZCBgTmFOYCBhcmUgZmFsc2V5LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhY3QuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5jb21wYWN0KFswLCAxLCBmYWxzZSwgMiwgJycsIDNdKTtcbiAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAqL1xuICBmdW5jdGlvbiBjb21wYWN0KGFycmF5KSB7XG4gICAgcmV0dXJuIGJhc2VGaWx0ZXIoYXJyYXksIEJvb2xlYW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgY29uY2F0ZW5hdGluZyBgYXJyYXlgIHdpdGggYW55IGFkZGl0aW9uYWwgYXJyYXlzXG4gICAqIGFuZC9vciB2YWx1ZXMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29uY2F0ZW5hdGUuXG4gICAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjb25jYXRlbmF0ZS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgY29uY2F0ZW5hdGVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgYXJyYXkgPSBbMV07XG4gICAqIHZhciBvdGhlciA9IF8uY29uY2F0KGFycmF5LCAyLCBbM10sIFtbNF1dKTtcbiAgICpcbiAgICogY29uc29sZS5sb2cob3RoZXIpO1xuICAgKiAvLyA9PiBbMSwgMiwgMywgWzRdXVxuICAgKlxuICAgKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gICAqIC8vID0+IFsxXVxuICAgKi9cbiAgZnVuY3Rpb24gY29uY2F0KCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVuZ3RoID8gbGVuZ3RoIC0gMSA6IDApLFxuICAgICAgICBhcnJheSA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgaW5kZXggPSBsZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgYXJnc1tpbmRleCAtIDFdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aFxuICAgICAgPyBhcnJheVB1c2goaXNBcnJheShhcnJheSkgPyBjb3B5QXJyYXkoYXJyYXkpIDogW2FycmF5XSwgYmFzZUZsYXR0ZW4oYXJncywgMSkpXG4gICAgICA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0XG4gICAqIGVsZW1lbnQgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yIGluc3RlYWQgb2YgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gICAqICBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmb3VuZCBlbGVtZW50LCBlbHNlIGAtMWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWN0aXZlJzogZmFsc2UgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWN0aXZlJzogZmFsc2UgfSxcbiAgICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWN0aXZlJzogdHJ1ZSB9XG4gICAqIF07XG4gICAqXG4gICAqIF8uZmluZEluZGV4KHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLnVzZXIgPT0gJ2Jhcm5leSc7IH0pO1xuICAgKiAvLyA9PiAwXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmluZEluZGV4KHVzZXJzLCB7ICd1c2VyJzogJ2ZyZWQnLCAnYWN0aXZlJzogZmFsc2UgfSk7XG4gICAqIC8vID0+IDFcbiAgICpcbiAgICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbmRJbmRleCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICAgKiAvLyA9PiAwXG4gICAqXG4gICAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbmRJbmRleCh1c2VycywgJ2FjdGl2ZScpO1xuICAgKiAvLyA9PiAyXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmcm9tSW5kZXggPT0gbnVsbCA/IDAgOiB0b0ludGVnZXIoZnJvbUluZGV4KTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICBpbmRleCA9IG5hdGl2ZU1heChsZW5ndGggKyBpbmRleCwgMCk7XG4gICAgfVxuICAgIHJldHVybiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZmxhdHRlbihbMSwgWzIsIFszLCBbNF1dLCA1XV0pO1xuICAgKiAvLyA9PiBbMSwgMiwgWzMsIFs0XV0sIDVdXG4gICAqL1xuICBmdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICByZXR1cm4gbGVuZ3RoID8gYmFzZUZsYXR0ZW4oYXJyYXksIDEpIDogW107XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgZmxhdHRlbnMgYGFycmF5YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMy4wLjBcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZmxhdHRlbkRlZXAoWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAgICogLy8gPT4gWzEsIDIsIDMsIDQsIDVdXG4gICAqL1xuICBmdW5jdGlvbiBmbGF0dGVuRGVlcChhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgcmV0dXJuIGxlbmd0aCA/IGJhc2VGbGF0dGVuKGFycmF5LCBJTkZJTklUWSkgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmaXJzdCBlbGVtZW50IG9mIGBhcnJheWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBhbGlhcyBmaXJzdFxuICAgKiBAY2F0ZWdvcnkgQXJyYXlcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmhlYWQoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gMVxuICAgKlxuICAgKiBfLmhlYWQoW10pO1xuICAgKiAvLyA9PiB1bmRlZmluZWRcbiAgICovXG4gIGZ1bmN0aW9uIGhlYWQoYXJyYXkpIHtcbiAgICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCkgPyBhcnJheVswXSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBgdmFsdWVgIGlzIGZvdW5kIGluIGBhcnJheWBcbiAgICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAgICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLiBJZiBgZnJvbUluZGV4YCBpcyBuZWdhdGl2ZSwgaXQncyB1c2VkIGFzIHRoZVxuICAgKiBvZmZzZXQgZnJvbSB0aGUgZW5kIG9mIGBhcnJheWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaW5kZXhPZihbMSwgMiwgMSwgMl0sIDIpO1xuICAgKiAvLyA9PiAxXG4gICAqXG4gICAqIC8vIFNlYXJjaCBmcm9tIHRoZSBgZnJvbUluZGV4YC5cbiAgICogXy5pbmRleE9mKFsxLCAyLCAxLCAyXSwgMiwgMik7XG4gICAqIC8vID0+IDNcbiAgICovXG4gIGZ1bmN0aW9uIGluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ID09ICdudW1iZXInKSB7XG4gICAgICBmcm9tSW5kZXggPSBmcm9tSW5kZXggPCAwID8gbmF0aXZlTWF4KGxlbmd0aCArIGZyb21JbmRleCwgMCkgOiBmcm9tSW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb21JbmRleCA9IDA7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IChmcm9tSW5kZXggfHwgMCkgLSAxLFxuICAgICAgICBpc1JlZmxleGl2ZSA9IHZhbHVlID09PSB2YWx1ZTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgb3RoZXIgPSBhcnJheVtpbmRleF07XG4gICAgICBpZiAoKGlzUmVmbGV4aXZlID8gb3RoZXIgPT09IHZhbHVlIDogb3RoZXIgIT09IG90aGVyKSkge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsYXN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IEFycmF5XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gM1xuICAgKi9cbiAgZnVuY3Rpb24gbGFzdChhcnJheSkge1xuICAgIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgcmV0dXJuIGxlbmd0aCA/IGFycmF5W2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBzbGljZSBvZiBgYXJyYXlgIGZyb20gYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgdXNlZCBpbnN0ZWFkIG9mXG4gICAqIFtgQXJyYXkjc2xpY2VgXShodHRwczovL21kbi5pby9BcnJheS9zbGljZSkgdG8gZW5zdXJlIGRlbnNlIGFycmF5cyBhcmVcbiAgICogcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBBcnJheVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAgICovXG4gIGZ1bmN0aW9uIHNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICBzdGFydCA9IHN0YXJ0ID09IG51bGwgPyAwIDogK3N0YXJ0O1xuICAgIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogK2VuZDtcbiAgICByZXR1cm4gbGVuZ3RoID8gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSA6IFtdO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZSB0aGF0IHdyYXBzIGB2YWx1ZWAgd2l0aCBleHBsaWNpdCBtZXRob2RcbiAgICogY2hhaW4gc2VxdWVuY2VzIGVuYWJsZWQuIFRoZSByZXN1bHQgb2Ygc3VjaCBzZXF1ZW5jZXMgbXVzdCBiZSB1bndyYXBwZWRcbiAgICogd2l0aCBgXyN2YWx1ZWAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDEuMy4wXG4gICAqIEBjYXRlZ29yeSBTZXFcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcC5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWdlJzogMzYgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAgfSxcbiAgICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAqIF07XG4gICAqXG4gICAqIHZhciB5b3VuZ2VzdCA9IF9cbiAgICogICAuY2hhaW4odXNlcnMpXG4gICAqICAgLnNvcnRCeSgnYWdlJylcbiAgICogICAubWFwKGZ1bmN0aW9uKG8pIHtcbiAgICogICAgIHJldHVybiBvLnVzZXIgKyAnIGlzICcgKyBvLmFnZTtcbiAgICogICB9KVxuICAgKiAgIC5oZWFkKClcbiAgICogICAudmFsdWUoKTtcbiAgICogLy8gPT4gJ3BlYmJsZXMgaXMgMSdcbiAgICovXG4gIGZ1bmN0aW9uIGNoYWluKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGxvZGFzaCh2YWx1ZSk7XG4gICAgcmVzdWx0Ll9fY2hhaW5fXyA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIGBpbnRlcmNlcHRvcmAgYW5kIHJldHVybnMgYHZhbHVlYC4gVGhlIGludGVyY2VwdG9yXG4gICAqIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ7ICh2YWx1ZSkuIFRoZSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvXG4gICAqIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiBzZXF1ZW5jZSBpbiBvcmRlciB0byBtb2RpZnkgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBTZXFcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvdmlkZSB0byBgaW50ZXJjZXB0b3JgLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfKFsxLCAyLCAzXSlcbiAgICogIC50YXAoZnVuY3Rpb24oYXJyYXkpIHtcbiAgICogICAgLy8gTXV0YXRlIGlucHV0IGFycmF5LlxuICAgKiAgICBhcnJheS5wb3AoKTtcbiAgICogIH0pXG4gICAqICAucmV2ZXJzZSgpXG4gICAqICAudmFsdWUoKTtcbiAgICogLy8gPT4gWzIsIDFdXG4gICAqL1xuICBmdW5jdGlvbiB0YXAodmFsdWUsIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3IodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnRhcGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIGBpbnRlcmNlcHRvcmAuXG4gICAqIFRoZSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwicGFzcyB0aHJ1XCIgdmFsdWVzIHJlcGxhY2luZyBpbnRlcm1lZGlhdGVcbiAgICogcmVzdWx0cyBpbiBhIG1ldGhvZCBjaGFpbiBzZXF1ZW5jZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMy4wLjBcbiAgICogQGNhdGVnb3J5IFNlcVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm92aWRlIHRvIGBpbnRlcmNlcHRvcmAuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGludGVyY2VwdG9yIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGludGVyY2VwdG9yYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXygnICBhYmMgICcpXG4gICAqICAuY2hhaW4oKVxuICAgKiAgLnRyaW0oKVxuICAgKiAgLnRocnUoZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgcmV0dXJuIFt2YWx1ZV07XG4gICAqICB9KVxuICAgKiAgLnZhbHVlKCk7XG4gICAqIC8vID0+IFsnYWJjJ11cbiAgICovXG4gIGZ1bmN0aW9uIHRocnUodmFsdWUsIGludGVyY2VwdG9yKSB7XG4gICAgcmV0dXJuIGludGVyY2VwdG9yKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZSB3aXRoIGV4cGxpY2l0IG1ldGhvZCBjaGFpbiBzZXF1ZW5jZXMgZW5hYmxlZC5cbiAgICpcbiAgICogQG5hbWUgY2hhaW5cbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBTZXFcbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICogXTtcbiAgICpcbiAgICogLy8gQSBzZXF1ZW5jZSB3aXRob3V0IGV4cGxpY2l0IGNoYWluaW5nLlxuICAgKiBfKHVzZXJzKS5oZWFkKCk7XG4gICAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAgICpcbiAgICogLy8gQSBzZXF1ZW5jZSB3aXRoIGV4cGxpY2l0IGNoYWluaW5nLlxuICAgKiBfKHVzZXJzKVxuICAgKiAgIC5jaGFpbigpXG4gICAqICAgLmhlYWQoKVxuICAgKiAgIC5waWNrKCd1c2VyJylcbiAgICogICAudmFsdWUoKTtcbiAgICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknIH1cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXBwZXJDaGFpbigpIHtcbiAgICByZXR1cm4gY2hhaW4odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIGNoYWluIHNlcXVlbmNlIHRvIHJlc29sdmUgdGhlIHVud3JhcHBlZCB2YWx1ZS5cbiAgICpcbiAgICogQG5hbWUgdmFsdWVcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBhbGlhcyB0b0pTT04sIHZhbHVlT2ZcbiAgICogQGNhdGVnb3J5IFNlcVxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdW53cmFwcGVkIHZhbHVlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfKFsxLCAyLCAzXSkudmFsdWUoKTtcbiAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwcGVyVmFsdWUoKSB7XG4gICAgcmV0dXJuIGJhc2VXcmFwcGVyVmFsdWUodGhpcy5fX3dyYXBwZWRfXywgdGhpcy5fX2FjdGlvbnNfXyk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IgKiphbGwqKiBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAuXG4gICAqIEl0ZXJhdGlvbiBpcyBzdG9wcGVkIG9uY2UgYHByZWRpY2F0ZWAgcmV0dXJucyBmYWxzZXkuIFRoZSBwcmVkaWNhdGUgaXNcbiAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBwYXNzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZXZlcnkoW3RydWUsIDEsIG51bGwsICd5ZXMnXSwgQm9vbGVhbik7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIHZhciB1c2VycyA9IFtcbiAgICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZXZlcnkodXNlcnMsIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FjdGl2ZSc6IGZhbHNlIH0pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZXZlcnkodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5ldmVyeSh1c2VycywgJ2FjdGl2ZScpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gZXZlcnkoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBndWFyZCkge1xuICAgIHByZWRpY2F0ZSA9IGd1YXJkID8gdW5kZWZpbmVkIDogcHJlZGljYXRlO1xuICAgIHJldHVybiBiYXNlRXZlcnkoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzXG4gICAqIGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhyZWVcbiAgICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gICAqICBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAgICogQHNlZSBfLnJlamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gICAqIF07XG4gICAqXG4gICAqIF8uZmlsdGVyKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiAhby5hY3RpdmU7IH0pO1xuICAgKiAvLyA9PiBvYmplY3RzIGZvciBbJ2ZyZWQnXVxuICAgKlxuICAgKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbHRlcih1c2VycywgeyAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0pO1xuICAgKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maWx0ZXIodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAgICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAgICpcbiAgICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmlsdGVyKHVzZXJzLCAnYWN0aXZlJyk7XG4gICAqIC8vID0+IG9iamVjdHMgZm9yIFsnYmFybmV5J11cbiAgICovXG4gIGZ1bmN0aW9uIGZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gYmFzZUZpbHRlcihjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlKSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAsIHJldHVybmluZyB0aGUgZmlyc3QgZWxlbWVudFxuICAgKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gICAqIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBzZWFyY2guXG4gICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF0Y2hlZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gICAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gICAqIF07XG4gICAqXG4gICAqIF8uZmluZCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby5hZ2UgPCA0MDsgfSk7XG4gICAqIC8vID0+IG9iamVjdCBmb3IgJ2Jhcm5leSdcbiAgICpcbiAgICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maW5kKHVzZXJzLCB7ICdhZ2UnOiAxLCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAgICogLy8gPT4gb2JqZWN0IGZvciAncGViYmxlcydcbiAgICpcbiAgICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLmZpbmQodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAgICogLy8gPT4gb2JqZWN0IGZvciAnZnJlZCdcbiAgICpcbiAgICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmluZCh1c2VycywgJ2FjdGl2ZScpO1xuICAgKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gICAqL1xuICB2YXIgZmluZCA9IGNyZWF0ZUZpbmQoZmluZEluZGV4KTtcblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICAgKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAqXG4gICAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gICAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gICAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBhbGlhcyBlYWNoXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8oWzEsIDJdKS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICAgKiB9KTtcbiAgICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gICAqXG4gICAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICogICBjb25zb2xlLmxvZyhrZXkpO1xuICAgKiB9KTtcbiAgICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gICAqL1xuICBmdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgcmV0dXJuIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYCB0aHJ1XG4gICAqIGBpdGVyYXRlZWAuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIE1hbnkgbG9kYXNoIG1ldGhvZHMgYXJlIGd1YXJkZWQgdG8gd29yayBhcyBpdGVyYXRlZXMgZm9yIG1ldGhvZHMgbGlrZVxuICAgKiBgXy5ldmVyeWAsIGBfLmZpbHRlcmAsIGBfLm1hcGAsIGBfLm1hcFZhbHVlc2AsIGBfLnJlamVjdGAsIGFuZCBgXy5zb21lYC5cbiAgICpcbiAgICogVGhlIGd1YXJkZWQgbWV0aG9kcyBhcmU6XG4gICAqIGBhcnlgLCBgY2h1bmtgLCBgY3VycnlgLCBgY3VycnlSaWdodGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsIGBldmVyeWAsXG4gICAqIGBmaWxsYCwgYGludmVydGAsIGBwYXJzZUludGAsIGByYW5kb21gLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZXBlYXRgLFxuICAgKiBgc2FtcGxlU2l6ZWAsIGBzbGljZWAsIGBzb21lYCwgYHNvcnRCeWAsIGBzcGxpdGAsIGB0YWtlYCwgYHRha2VSaWdodGAsXG4gICAqIGB0ZW1wbGF0ZWAsIGB0cmltYCwgYHRyaW1FbmRgLCBgdHJpbVN0YXJ0YCwgYW5kIGB3b3Jkc2BcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICAgKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICAgKiAgIHJldHVybiBuICogbjtcbiAgICogfVxuICAgKlxuICAgKiBfLm1hcChbNCwgOF0sIHNxdWFyZSk7XG4gICAqIC8vID0+IFsxNiwgNjRdXG4gICAqXG4gICAqIF8ubWFwKHsgJ2EnOiA0LCAnYic6IDggfSwgc3F1YXJlKTtcbiAgICogLy8gPT4gWzE2LCA2NF0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JyB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcgfVxuICAgKiBdO1xuICAgKlxuICAgKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5tYXAodXNlcnMsICd1c2VyJyk7XG4gICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgKi9cbiAgZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgcmV0dXJuIGJhc2VNYXAoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlcyBgY29sbGVjdGlvbmAgdG8gYSB2YWx1ZSB3aGljaCBpcyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0IG9mIHJ1bm5pbmdcbiAgICogZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYCB0aHJ1IGBpdGVyYXRlZWAsIHdoZXJlIGVhY2ggc3VjY2Vzc2l2ZVxuICAgKiBpbnZvY2F0aW9uIGlzIHN1cHBsaWVkIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHByZXZpb3VzLiBJZiBgYWNjdW11bGF0b3JgXG4gICAqIGlzIG5vdCBnaXZlbiwgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGNvbGxlY3Rpb25gIGlzIHVzZWQgYXMgdGhlIGluaXRpYWxcbiAgICogdmFsdWUuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM6XG4gICAqIChhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIE1hbnkgbG9kYXNoIG1ldGhvZHMgYXJlIGd1YXJkZWQgdG8gd29yayBhcyBpdGVyYXRlZXMgZm9yIG1ldGhvZHMgbGlrZVxuICAgKiBgXy5yZWR1Y2VgLCBgXy5yZWR1Y2VSaWdodGAsIGFuZCBgXy50cmFuc2Zvcm1gLlxuICAgKlxuICAgKiBUaGUgZ3VhcmRlZCBtZXRob2RzIGFyZTpcbiAgICogYGFzc2lnbmAsIGBkZWZhdWx0c2AsIGBkZWZhdWx0c0RlZXBgLCBgaW5jbHVkZXNgLCBgbWVyZ2VgLCBgb3JkZXJCeWAsXG4gICAqIGFuZCBgc29ydEJ5YFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICogQHNlZSBfLnJlZHVjZVJpZ2h0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8ucmVkdWNlKFsxLCAyXSwgZnVuY3Rpb24oc3VtLCBuKSB7XG4gICAqICAgcmV0dXJuIHN1bSArIG47XG4gICAqIH0sIDApO1xuICAgKiAvLyA9PiAzXG4gICAqXG4gICAqIF8ucmVkdWNlKHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMSB9LCBmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICogICAocmVzdWx0W3ZhbHVlXSB8fCAocmVzdWx0W3ZhbHVlXSA9IFtdKSkucHVzaChrZXkpO1xuICAgKiAgIHJldHVybiByZXN1bHQ7XG4gICAqIH0sIHt9KTtcbiAgICogLy8gPT4geyAnMSc6IFsnYScsICdjJ10sICcyJzogWydiJ10gfSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCBhY2N1bXVsYXRvcikge1xuICAgIHJldHVybiBiYXNlUmVkdWNlKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSksIGFjY3VtdWxhdG9yLCBhcmd1bWVudHMubGVuZ3RoIDwgMywgYmFzZUVhY2gpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNpemUgb2YgYGNvbGxlY3Rpb25gIGJ5IHJldHVybmluZyBpdHMgbGVuZ3RoIGZvciBhcnJheS1saWtlXG4gICAqIHZhbHVlcyBvciB0aGUgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIGZvciBvYmplY3RzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb2xsZWN0aW9uIHNpemUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uc2l6ZShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAzXG4gICAqXG4gICAqIF8uc2l6ZSh7ICdhJzogMSwgJ2InOiAyIH0pO1xuICAgKiAvLyA9PiAyXG4gICAqXG4gICAqIF8uc2l6ZSgncGViYmxlcycpO1xuICAgKiAvLyA9PiA3XG4gICAqL1xuICBmdW5jdGlvbiBzaXplKGNvbGxlY3Rpb24pIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgY29sbGVjdGlvbiA9IGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID8gY29sbGVjdGlvbiA6IGtleXMoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IgKiphbnkqKiBlbGVtZW50IG9mIGBjb2xsZWN0aW9uYC5cbiAgICogSXRlcmF0aW9uIGlzIHN0b3BwZWQgb25jZSBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeS4gVGhlIHByZWRpY2F0ZSBpc1xuICAgKiBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gICAqICBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uc29tZShbbnVsbCwgMCwgJ3llcycsIGZhbHNlXSwgQm9vbGVhbik7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FjdGl2ZSc6IHRydWUgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhY3RpdmUnOiBmYWxzZSB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uc29tZSh1c2VycywgeyAndXNlcic6ICdiYXJuZXknLCAnYWN0aXZlJzogZmFsc2UgfSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5zb21lKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uc29tZSh1c2VycywgJ2FjdGl2ZScpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBzb21lKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZ3VhcmQpIHtcbiAgICBwcmVkaWNhdGUgPSBndWFyZCA/IHVuZGVmaW5lZCA6IHByZWRpY2F0ZTtcbiAgICByZXR1cm4gYmFzZVNvbWUoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZWxlbWVudHMsIHNvcnRlZCBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdGhlIHJlc3VsdHMgb2ZcbiAgICogcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uIHRocnUgZWFjaCBpdGVyYXRlZS4gVGhpcyBtZXRob2RcbiAgICogcGVyZm9ybXMgYSBzdGFibGUgc29ydCwgdGhhdCBpcywgaXQgcHJlc2VydmVzIHRoZSBvcmlnaW5hbCBzb3J0IG9yZGVyIG9mXG4gICAqIGVxdWFsIGVsZW1lbnRzLiBUaGUgaXRlcmF0ZWVzIGFyZSBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7Li4uKEFycmF5fEFycmF5W118RnVuY3Rpb258RnVuY3Rpb25bXXxPYmplY3R8T2JqZWN0W118c3RyaW5nfHN0cmluZ1tdKX1cbiAgICogIFtpdGVyYXRlZXM9W18uaWRlbnRpdHldXSBUaGUgaXRlcmF0ZWVzIHRvIHNvcnQgYnkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IHNvcnRlZCBhcnJheS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQ4IH0sXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9LFxuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM0IH1cbiAgICogXTtcbiAgICpcbiAgICogXy5zb3J0QnkodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8udXNlcjsgfSk7XG4gICAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM2XSwgWydiYXJuZXknLCAzNF0sIFsnZnJlZCcsIDQ4XSwgWydmcmVkJywgNDBdXVxuICAgKlxuICAgKiBfLnNvcnRCeSh1c2VycywgWyd1c2VyJywgJ2FnZSddKTtcbiAgICogLy8gPT4gb2JqZWN0cyBmb3IgW1snYmFybmV5JywgMzRdLCBbJ2Jhcm5leScsIDM2XSwgWydmcmVkJywgNDBdLCBbJ2ZyZWQnLCA0OF1dXG4gICAqXG4gICAqIF8uc29ydEJ5KHVzZXJzLCAndXNlcicsIGZ1bmN0aW9uKG8pIHtcbiAgICogICByZXR1cm4gTWF0aC5mbG9vcihvLmFnZSAvIDEwKTtcbiAgICogfSk7XG4gICAqIC8vID0+IG9iamVjdHMgZm9yIFtbJ2Jhcm5leScsIDM2XSwgWydiYXJuZXknLCAzNF0sIFsnZnJlZCcsIDQ4XSwgWydmcmVkJywgNDBdXVxuICAgKi9cbiAgZnVuY3Rpb24gc29ydEJ5KGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShpdGVyYXRlZSk7XG5cbiAgICByZXR1cm4gYmFzZU1hcChiYXNlTWFwKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiB7ICd2YWx1ZSc6IHZhbHVlLCAnaW5kZXgnOiBpbmRleCsrLCAnY3JpdGVyaWEnOiBpdGVyYXRlZSh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24ob2JqZWN0LCBvdGhlcikge1xuICAgICAgcmV0dXJuIGNvbXBhcmVBc2NlbmRpbmcob2JqZWN0LmNyaXRlcmlhLCBvdGhlci5jcml0ZXJpYSkgfHwgKG9iamVjdC5pbmRleCAtIG90aGVyLmluZGV4KTtcbiAgICB9KSwgYmFzZVByb3BlcnR5KCd2YWx1ZScpKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2AsIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHNcbiAgICogb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24sIHdoaWxlIGl0J3MgY2FsbGVkIGxlc3MgdGhhbiBgbmAgdGltZXMuIFN1YnNlcXVlbnRcbiAgICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGNhbGxzIGF0IHdoaWNoIGBmdW5jYCBpcyBubyBsb25nZXIgaW52b2tlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmJlZm9yZSg1LCBhZGRDb250YWN0VG9MaXN0KSk7XG4gICAqIC8vID0+IGFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdFxuICAgKi9cbiAgZnVuY3Rpb24gYmVmb3JlKG4sIGZ1bmMpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICAgIG4gPSB0b0ludGVnZXIobik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tbiA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKG4gPD0gMSkge1xuICAgICAgICBmdW5jID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYFxuICAgKiBhbmQgYHBhcnRpYWxzYCBwcmVwZW5kZWQgdG8gdGhlIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAgICpcbiAgICogVGhlIGBfLmJpbmQucGxhY2Vob2xkZXJgIHZhbHVlLCB3aGljaCBkZWZhdWx0cyB0byBgX2AgaW4gbW9ub2xpdGhpYyBidWlsZHMsXG4gICAqIG1heSBiZSB1c2VkIGFzIGEgcGxhY2Vob2xkZXIgZm9yIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cy5cbiAgICpcbiAgICogKipOb3RlOioqIFVubGlrZSBuYXRpdmUgYEZ1bmN0aW9uI2JpbmRgLCB0aGlzIG1ldGhvZCBkb2Vzbid0IHNldCB0aGUgXCJsZW5ndGhcIlxuICAgKiBwcm9wZXJ0eSBvZiBib3VuZCBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICAgKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAgICogQHBhcmFtIHsuLi4qfSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgcHVuY3R1YXRpb24pIHtcbiAgICogICByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyB0aGlzLnVzZXIgKyBwdW5jdHVhdGlvbjtcbiAgICogfTtcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAgICpcbiAgICogdmFyIGJvdW5kID0gXy5iaW5kKGdyZWV0LCBvYmplY3QsICdoaScpO1xuICAgKiBib3VuZCgnIScpO1xuICAgKiAvLyA9PiAnaGkgZnJlZCEnXG4gICAqXG4gICAqIC8vIEJvdW5kIHdpdGggcGxhY2Vob2xkZXJzLlxuICAgKiB2YXIgYm91bmQgPSBfLmJpbmQoZ3JlZXQsIG9iamVjdCwgXywgJyEnKTtcbiAgICogYm91bmQoJ2hpJyk7XG4gICAqIC8vID0+ICdoaSBmcmVkISdcbiAgICovXG4gIHZhciBiaW5kID0gcmVzdChmdW5jdGlvbihmdW5jLCB0aGlzQXJnLCBwYXJ0aWFscykge1xuICAgIHJldHVybiBjcmVhdGVQYXJ0aWFsV3JhcHBlcihmdW5jLCBCSU5EX0ZMQUcgfCBQQVJUSUFMX0ZMQUcsIHRoaXNBcmcsIHBhcnRpYWxzKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIERlZmVycyBpbnZva2luZyB0aGUgYGZ1bmNgIHVudGlsIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzIGNsZWFyZWQuIEFueVxuICAgKiBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgdG8gYGZ1bmNgIHdoZW4gaXQncyBpbnZva2VkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVmZXIuXG4gICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lciBpZC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5kZWZlcihmdW5jdGlvbih0ZXh0KSB7XG4gICAqICAgY29uc29sZS5sb2codGV4dCk7XG4gICAqIH0sICdkZWZlcnJlZCcpO1xuICAgKiAvLyA9PiBMb2dzICdkZWZlcnJlZCcgYWZ0ZXIgb25lIG9yIG1vcmUgbWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgdmFyIGRlZmVyID0gcmVzdChmdW5jdGlvbihmdW5jLCBhcmdzKSB7XG4gICAgcmV0dXJuIGJhc2VEZWxheShmdW5jLCAxLCBhcmdzKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEludm9rZXMgYGZ1bmNgIGFmdGVyIGB3YWl0YCBtaWxsaXNlY29uZHMuIEFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcmVcbiAgICogcHJvdmlkZWQgdG8gYGZ1bmNgIHdoZW4gaXQncyBpbnZva2VkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVsYXkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IGludm9jYXRpb24uXG4gICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lciBpZC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5kZWxheShmdW5jdGlvbih0ZXh0KSB7XG4gICAqICAgY29uc29sZS5sb2codGV4dCk7XG4gICAqIH0sIDEwMDAsICdsYXRlcicpO1xuICAgKiAvLyA9PiBMb2dzICdsYXRlcicgYWZ0ZXIgb25lIHNlY29uZC5cbiAgICovXG4gIHZhciBkZWxheSA9IHJlc3QoZnVuY3Rpb24oZnVuYywgd2FpdCwgYXJncykge1xuICAgIHJldHVybiBiYXNlRGVsYXkoZnVuYywgdG9OdW1iZXIod2FpdCkgfHwgMCwgYXJncyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBuZWdhdGVzIHRoZSByZXN1bHQgb2YgdGhlIHByZWRpY2F0ZSBgZnVuY2AuIFRoZVxuICAgKiBgZnVuY2AgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgYW5kIGFyZ3VtZW50cyBvZiB0aGVcbiAgICogY3JlYXRlZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMy4wLjBcbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgcHJlZGljYXRlIHRvIG5lZ2F0ZS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbmVnYXRlZCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gaXNFdmVuKG4pIHtcbiAgICogICByZXR1cm4gbiAlIDIgPT0gMDtcbiAgICogfVxuICAgKlxuICAgKiBfLmZpbHRlcihbMSwgMiwgMywgNCwgNSwgNl0sIF8ubmVnYXRlKGlzRXZlbikpO1xuICAgKiAvLyA9PiBbMSwgMywgNV1cbiAgICovXG4gIGZ1bmN0aW9uIG5lZ2F0ZShwcmVkaWNhdGUpIHtcbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAgICogdG8gdGhlIGZ1bmN0aW9uIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGludm9jYXRpb24uIFRoZSBgZnVuY2AgaXNcbiAgICogaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBpbml0aWFsaXplID0gXy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKTtcbiAgICogaW5pdGlhbGl6ZSgpO1xuICAgKiBpbml0aWFsaXplKCk7XG4gICAqIC8vIGBpbml0aWFsaXplYCBpbnZva2VzIGBjcmVhdGVBcHBsaWNhdGlvbmAgb25jZVxuICAgKi9cbiAgZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gICAgcmV0dXJuIGJlZm9yZSgyLCBmdW5jKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAgICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzXG4gICAqIGFuIGFycmF5LlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlXG4gICAqIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9tZG4uaW8vcmVzdF9wYXJhbWV0ZXJzKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBzYXkgPSBfLnJlc3QoZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAgICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gICAqICAgICAoXy5zaXplKG5hbWVzKSA+IDEgPyAnLCAmICcgOiAnJykgKyBfLmxhc3QobmFtZXMpO1xuICAgKiB9KTtcbiAgICpcbiAgICogc2F5KCdoZWxsbycsICdmcmVkJywgJ2Jhcm5leScsICdwZWJibGVzJyk7XG4gICAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAgICovXG4gIGZ1bmN0aW9uIHJlc3QoZnVuYywgc3RhcnQpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICAgIH1cbiAgICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiB0b0ludGVnZXIoc3RhcnQpLCAwKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgICB9XG4gICAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICAgIGluZGV4ID0gLTE7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICAgIH1cbiAgICAgIG90aGVyQXJnc1tzdGFydF0gPSBhcnJheTtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYHZhbHVlYC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24gdGhlXG4gICAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cHM6Ly9tZG4uaW8vU3RydWN0dXJlZF9jbG9uZV9hbGdvcml0aG0pXG4gICAqIGFuZCBzdXBwb3J0cyBjbG9uaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsIGRhdGUgb2JqZWN0cywgbWFwcyxcbiAgICogbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcywgc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkXG4gICAqIGFycmF5cy4gVGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhcmUgY2xvbmVkXG4gICAqIGFzIHBsYWluIG9iamVjdHMuIEFuIGVtcHR5IG9iamVjdCBpcyByZXR1cm5lZCBmb3IgdW5jbG9uZWFibGUgdmFsdWVzIHN1Y2hcbiAgICogYXMgZXJyb3Igb2JqZWN0cywgZnVuY3Rpb25zLCBET00gbm9kZXMsIGFuZCBXZWFrTWFwcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gICAqIEBzZWUgXy5jbG9uZURlZXBcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gICAqXG4gICAqIHZhciBzaGFsbG93ID0gXy5jbG9uZShvYmplY3RzKTtcbiAgICogY29uc29sZS5sb2coc2hhbGxvd1swXSA9PT0gb2JqZWN0c1swXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lKHZhbHVlKSB7XG4gICAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXJyYXkodmFsdWUpID8gY29weUFycmF5KHZhbHVlKSA6IGNvcHlPYmplY3QodmFsdWUsIGtleXModmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhXG4gICAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gICAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICAgKiB2YXIgb3RoZXIgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gICAqXG4gICAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uZXEoJ2EnLCAnYScpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uZXEoTmFOLCBOYU4pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICAvLyBTYWZhcmkgOC4xIGluY29ycmVjdGx5IG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICAgIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgICAoIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKSB8fCBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICAgKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gICAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAgICogaXMgYW4gb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYm9vbGVhbiBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNCb29sZWFuKGZhbHNlKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQm9vbGVhbihudWxsKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzQm9vbGVhbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2UgfHxcbiAgICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGJvb2xUYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNEYXRlKG5ldyBEYXRlKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRGF0ZSgnTW9uIEFwcmlsIDIzIDIwMTInKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGRhdGVUYWc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAgICpcbiAgICogT2JqZWN0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgbm8gb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkXG4gICAqIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEFycmF5LWxpa2UgdmFsdWVzIHN1Y2ggYXMgYGFyZ3VtZW50c2Agb2JqZWN0cywgYXJyYXlzLCBidWZmZXJzLCBzdHJpbmdzLCBvclxuICAgKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gICAqIFNpbWlsYXJseSwgbWFwcyBhbmQgc2V0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgc2l6ZWAgb2YgYDBgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0VtcHR5KG51bGwpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNFbXB0eSh0cnVlKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRW1wdHkoMSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNFbXB0eSh7ICdhJzogMSB9KTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmXG4gICAgICAgIChpc0FycmF5KHZhbHVlKSB8fCBpc1N0cmluZyh2YWx1ZSkgfHxcbiAgICAgICAgICBpc0Z1bmN0aW9uKHZhbHVlLnNwbGljZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgcmV0dXJuICF2YWx1ZS5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiAha2V5cyh2YWx1ZSkubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAgICogZXF1aXZhbGVudC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICAgKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gICAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gICAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICAgKiBub2RlcyBhcmUgKipub3QqKiBzdXBwb3J0ZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICAgKiB2YXIgb3RoZXIgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gICAqXG4gICAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBvYmplY3QgPT09IG90aGVyO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgICByZXR1cm4gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZpbml0ZSBwcmltaXRpdmUgbnVtYmVyLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAgICogW2BOdW1iZXIuaXNGaW5pdGVgXShodHRwczovL21kbi5pby9OdW1iZXIvaXNGaW5pdGUpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmaW5pdGUgbnVtYmVyLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzRmluaXRlKDMpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNGaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0Zpbml0ZShJbmZpbml0eSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNGaW5pdGUoJzMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiBuYXRpdmVJc0Zpbml0ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gICAqICBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNGdW5jdGlvbihfKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAgIC8vIGluIFNhZmFyaSA4IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGFuZCB3ZWFrIG1hcCBjb25zdHJ1Y3RvcnMsXG4gICAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBsb29zZWx5IGJhc2VkIG9uXG4gICAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0xlbmd0aCgzKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0xlbmd0aCgnMycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gICAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAgICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNPYmplY3Qoe30pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdChudWxsKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAgICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2Uoe30pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYE5hTmAuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICAgKiBbYE51bWJlci5pc05hTmBdKGh0dHBzOi8vbWRuLmlvL051bWJlci9pc05hTikgYW5kIGlzIG5vdCB0aGUgc2FtZSBhc1xuICAgKiBnbG9iYWwgW2Bpc05hTmBdKGh0dHBzOi8vbWRuLmlvL2lzTmFOKSB3aGljaCByZXR1cm5zIGB0cnVlYCBmb3JcbiAgICogYHVuZGVmaW5lZGAgYW5kIG90aGVyIG5vbi1udW1iZXIgdmFsdWVzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc05hTihOYU4pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOYU4obmV3IE51bWJlcihOYU4pKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBpc05hTih1bmRlZmluZWQpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOYU4odW5kZWZpbmVkKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XG4gICAgLy8gQW4gYE5hTmAgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZi5cbiAgICAvLyBQZXJmb3JtIHRoZSBgdG9TdHJpbmdUYWdgIGNoZWNrIGZpcnN0IHRvIGF2b2lkIGVycm9ycyB3aXRoIHNvbWVcbiAgICAvLyBBY3RpdmVYIG9iamVjdHMgaW4gSUUuXG4gICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAhPSArdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYG51bGxgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYG51bGxgLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNOdWxsKG51bGwpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOdWxsKHZvaWQgMCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc051bGwodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBOdW1iZXJgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gICAqXG4gICAqICoqTm90ZToqKiBUbyBleGNsdWRlIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBhbmQgYE5hTmAsIHdoaWNoIGFyZVxuICAgKiBjbGFzc2lmaWVkIGFzIG51bWJlcnMsIHVzZSB0aGUgYF8uaXNGaW5pdGVgIG1ldGhvZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICAgKiAgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzTnVtYmVyKDMpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNOdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc051bWJlcihJbmZpbml0eSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc051bWJlcignMycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBudW1iZXJUYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgUmVnRXhwYCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1JlZ0V4cCgvYWJjLyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc1JlZ0V4cCgnL2FiYy8nKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzUmVnRXhwKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSByZWdleHBUYWc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAgICogIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1N0cmluZygnYWJjJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc1N0cmluZygxKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICAgKCFpc0FycmF5KHZhbHVlKSAmJiBpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzVW5kZWZpbmVkKHZvaWQgMCk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc1VuZGVmaW5lZChudWxsKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBhcnJheS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8udG9BcnJheSh7ICdhJzogMSwgJ2InOiAyIH0pO1xuICAgKiAvLyA9PiBbMSwgMl1cbiAgICpcbiAgICogXy50b0FycmF5KCdhYmMnKTtcbiAgICogLy8gPT4gWydhJywgJ2InLCAnYyddXG4gICAqXG4gICAqIF8udG9BcnJheSgxKTtcbiAgICogLy8gPT4gW11cbiAgICpcbiAgICogXy50b0FycmF5KG51bGwpO1xuICAgKiAvLyA9PiBbXVxuICAgKi9cbiAgZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICAgIGlmICghaXNBcnJheUxpa2UodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA/IGNvcHlBcnJheSh2YWx1ZSkgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gICAqXG4gICAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gICAqIFtgVG9JbnRlZ2VyYF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50ZWdlcikuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvSW50ZWdlcigzLjIpO1xuICAgKiAvLyA9PiAzXG4gICAqXG4gICAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICAgKiAvLyA9PiAwXG4gICAqXG4gICAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAgICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAgICpcbiAgICogXy50b0ludGVnZXIoJzMuMicpO1xuICAgKiAvLyA9PiAzXG4gICAqL1xuICB2YXIgdG9JbnRlZ2VyID0gTnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8udG9OdW1iZXIoMy4yKTtcbiAgICogLy8gPT4gMy4yXG4gICAqXG4gICAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAqIC8vID0+IDVlLTMyNFxuICAgKlxuICAgKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAgICogLy8gPT4gSW5maW5pdHlcbiAgICpcbiAgICogXy50b051bWJlcignMy4yJyk7XG4gICAqIC8vID0+IDMuMlxuICAgKi9cbiAgdmFyIHRvTnVtYmVyID0gTnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICAgKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvU3RyaW5nKG51bGwpO1xuICAgKiAvLyA9PiAnJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKC0wKTtcbiAgICogLy8gPT4gJy0wJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+ICcxLDIsMydcbiAgICovXG4gIGZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3RzIHRvIHRoZVxuICAgKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAgICogU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgbG9vc2VseSBiYXNlZCBvblxuICAgKiBbYE9iamVjdC5hc3NpZ25gXShodHRwczovL21kbi5pby9PYmplY3QvYXNzaWduKS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xMC4wXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICogQHNlZSBfLmFzc2lnbkluXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIEZvbygpIHtcbiAgICogICB0aGlzLmMgPSAzO1xuICAgKiB9XG4gICAqXG4gICAqIGZ1bmN0aW9uIEJhcigpIHtcbiAgICogICB0aGlzLmUgPSA1O1xuICAgKiB9XG4gICAqXG4gICAqIEZvby5wcm90b3R5cGUuZCA9IDQ7XG4gICAqIEJhci5wcm90b3R5cGUuZiA9IDY7XG4gICAqXG4gICAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICAgKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzLCAnZSc6IDUgfVxuICAgKi9cbiAgdmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlKSB7XG4gICAgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uYXNzaWduYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIG93biBhbmRcbiAgICogaW5oZXJpdGVkIHNvdXJjZSBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGFsaWFzIGV4dGVuZFxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBzZWUgXy5hc3NpZ25cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gRm9vKCkge1xuICAgKiAgIHRoaXMuYiA9IDI7XG4gICAqIH1cbiAgICpcbiAgICogZnVuY3Rpb24gQmFyKCkge1xuICAgKiAgIHRoaXMuZCA9IDQ7XG4gICAqIH1cbiAgICpcbiAgICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAgICogQmFyLnByb3RvdHlwZS5lID0gNTtcbiAgICpcbiAgICogXy5hc3NpZ25Jbih7ICdhJzogMSB9LCBuZXcgRm9vLCBuZXcgQmFyKTtcbiAgICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzLCAnZCc6IDQsICdlJzogNSB9XG4gICAqL1xuICB2YXIgYXNzaWduSW4gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSkge1xuICAgIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uYXNzaWduSW5gIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgXG4gICAqIHdoaWNoIGlzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgYXNzaWduZWQgdmFsdWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJuc1xuICAgKiBgdW5kZWZpbmVkYCwgYXNzaWdubWVudCBpcyBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYFxuICAgKiBpcyBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6IChvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGFsaWFzIGV4dGVuZFdpdGhcbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBzb3VyY2VzIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgKiBAc2VlIF8uYXNzaWduV2l0aFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICAgKiAgIHJldHVybiBfLmlzVW5kZWZpbmVkKG9ialZhbHVlKSA/IHNyY1ZhbHVlIDogb2JqVmFsdWU7XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ25JbldpdGgsIGN1c3RvbWl6ZXIpO1xuICAgKlxuICAgKiBkZWZhdWx0cyh7ICdhJzogMSB9LCB7ICdiJzogMiB9LCB7ICdhJzogMyB9KTtcbiAgICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gICAqL1xuICB2YXIgYXNzaWduSW5XaXRoID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyKSB7XG4gICAgY29weU9iamVjdChzb3VyY2UsIGtleXNJbihzb3VyY2UpLCBvYmplY3QsIGN1c3RvbWl6ZXIpO1xuICB9KTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBgcHJvdG90eXBlYCBvYmplY3QuIElmIGFcbiAgICogYHByb3BlcnRpZXNgIG9iamVjdCBpcyBnaXZlbiwgaXRzIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzXG4gICAqIGFyZSBhc3NpZ25lZCB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDIuMy4wXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvdHlwZSBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwcm9wZXJ0aWVzXSBUaGUgcHJvcGVydGllcyB0byBhc3NpZ24gdG8gdGhlIG9iamVjdC5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gU2hhcGUoKSB7XG4gICAqICAgdGhpcy54ID0gMDtcbiAgICogICB0aGlzLnkgPSAwO1xuICAgKiB9XG4gICAqXG4gICAqIGZ1bmN0aW9uIENpcmNsZSgpIHtcbiAgICogICBTaGFwZS5jYWxsKHRoaXMpO1xuICAgKiB9XG4gICAqXG4gICAqIENpcmNsZS5wcm90b3R5cGUgPSBfLmNyZWF0ZShTaGFwZS5wcm90b3R5cGUsIHtcbiAgICogICAnY29uc3RydWN0b3InOiBDaXJjbGVcbiAgICogfSk7XG4gICAqXG4gICAqIHZhciBjaXJjbGUgPSBuZXcgQ2lyY2xlO1xuICAgKiBjaXJjbGUgaW5zdGFuY2VvZiBDaXJjbGU7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogY2lyY2xlIGluc3RhbmNlb2YgU2hhcGU7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIHJldHVybiBwcm9wZXJ0aWVzID8gYXNzaWduKHJlc3VsdCwgcHJvcGVydGllcykgOiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQXNzaWducyBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICAgKiBvYmplY3RzIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXRcbiAgICogcmVzb2x2ZSB0byBgdW5kZWZpbmVkYC4gU291cmNlIG9iamVjdHMgYXJlIGFwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgKiBPbmNlIGEgcHJvcGVydHkgaXMgc2V0LCBhZGRpdGlvbmFsIHZhbHVlcyBvZiB0aGUgc2FtZSBwcm9wZXJ0eSBhcmUgaWdub3JlZC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICogQHNlZSBfLmRlZmF1bHRzRGVlcFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmRlZmF1bHRzKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICAgKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gICAqL1xuICB2YXIgZGVmYXVsdHMgPSByZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICBhcmdzLnB1c2godW5kZWZpbmVkLCBhc3NpZ25JbkRlZmF1bHRzKTtcbiAgICByZXR1cm4gYXNzaWduSW5XaXRoLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7ICdhJzogeyAnYic6IDIgfSB9O1xuICAgKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gICAqXG4gICAqIF8uaGFzKG9iamVjdCwgJ2EnKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmhhcyhvYmplY3QsICdhLmInKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmhhcyhvYmplY3QsIFsnYScsICdiJ10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaGFzKG90aGVyLCAnYScpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzKG9iamVjdCwgcGF0aCkge1xuICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gICAqXG4gICAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gICAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3Qua2V5cylcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIEZvbygpIHtcbiAgICogICB0aGlzLmEgPSAxO1xuICAgKiAgIHRoaXMuYiA9IDI7XG4gICAqIH1cbiAgICpcbiAgICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAgICpcbiAgICogXy5rZXlzKG5ldyBGb28pO1xuICAgKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gICAqXG4gICAqIF8ua2V5cygnaGknKTtcbiAgICogLy8gPT4gWycwJywgJzEnXVxuICAgKi9cbiAgdmFyIGtleXMgPSBiYXNlS2V5cztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAgICpcbiAgICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDMuMC4wXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBGb28oKSB7XG4gICAqICAgdGhpcy5hID0gMTtcbiAgICogICB0aGlzLmIgPSAyO1xuICAgKiB9XG4gICAqXG4gICAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gICAqXG4gICAqIF8ua2V5c0luKG5ldyBGb28pO1xuICAgKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAgICovXG4gIHZhciBrZXlzSW4gPSBiYXNlS2V5c0luO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGUgcGlja2VkIGBvYmplY3RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAgICogQHBhcmFtIHsuLi4oc3RyaW5nfHN0cmluZ1tdKX0gW3Byb3BzXSBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gcGljay5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gICAqXG4gICAqIF8ucGljayhvYmplY3QsIFsnYScsICdjJ10pO1xuICAgKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAgICovXG4gIHZhciBwaWNrID0gcmVzdChmdW5jdGlvbihvYmplY3QsIHByb3BzKSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8ge30gOiBiYXNlUGljayhvYmplY3QsIGJhc2VNYXAoYmFzZUZsYXR0ZW4ocHJvcHMsIDEpLCB0b0tleSkpO1xuICB9KTtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5nZXRgIGV4Y2VwdCB0aGF0IGlmIHRoZSByZXNvbHZlZCB2YWx1ZSBpcyBhXG4gICAqIGZ1bmN0aW9uIGl0J3MgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBpdHMgcGFyZW50IG9iamVjdCBhbmRcbiAgICogaXRzIHJlc3VsdCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byByZXNvbHZlLlxuICAgKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBmb3IgYHVuZGVmaW5lZGAgcmVzb2x2ZWQgdmFsdWVzLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjMSc6IDMsICdjMic6IF8uY29uc3RhbnQoNCkgfSB9XSB9O1xuICAgKlxuICAgKiBfLnJlc3VsdChvYmplY3QsICdhWzBdLmIuYzEnKTtcbiAgICogLy8gPT4gM1xuICAgKlxuICAgKiBfLnJlc3VsdChvYmplY3QsICdhWzBdLmIuYzInKTtcbiAgICogLy8gPT4gNFxuICAgKlxuICAgKiBfLnJlc3VsdChvYmplY3QsICdhWzBdLmIuYzMnLCAnZGVmYXVsdCcpO1xuICAgKiAvLyA9PiAnZGVmYXVsdCdcbiAgICpcbiAgICogXy5yZXN1bHQob2JqZWN0LCAnYVswXS5iLmMzJywgXy5jb25zdGFudCgnZGVmYXVsdCcpKTtcbiAgICogLy8gPT4gJ2RlZmF1bHQnXG4gICAqL1xuICBmdW5jdGlvbiByZXN1bHQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtwYXRoXTtcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBpc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0eSB2YWx1ZXMgb2YgYG9iamVjdGAuXG4gICAqXG4gICAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIEZvbygpIHtcbiAgICogICB0aGlzLmEgPSAxO1xuICAgKiAgIHRoaXMuYiA9IDI7XG4gICAqIH1cbiAgICpcbiAgICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAgICpcbiAgICogXy52YWx1ZXMobmV3IEZvbyk7XG4gICAqIC8vID0+IFsxLCAyXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICAgKlxuICAgKiBfLnZhbHVlcygnaGknKTtcbiAgICogLy8gPT4gWydoJywgJ2knXVxuICAgKi9cbiAgZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPyBiYXNlVmFsdWVzKG9iamVjdCwga2V5cyhvYmplY3QpKSA6IFtdO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY2hhcmFjdGVycyBcIiZcIiwgXCI8XCIsIFwiPlwiLCAnXCInLCBcIidcIiwgYW5kIFwiXFxgXCIgaW4gYHN0cmluZ2AgdG9cbiAgICogdGhlaXIgY29ycmVzcG9uZGluZyBIVE1MIGVudGl0aWVzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogTm8gb3RoZXIgY2hhcmFjdGVycyBhcmUgZXNjYXBlZC4gVG8gZXNjYXBlIGFkZGl0aW9uYWxcbiAgICogY2hhcmFjdGVycyB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gICAqXG4gICAqIFRob3VnaCB0aGUgXCI+XCIgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2VcbiAgICogXCI+XCIgYW5kIFwiL1wiIGRvbid0IG5lZWQgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmdcbiAgICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICAgKiBbTWF0aGlhcyBCeW5lbnMncyBhcnRpY2xlXShodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMpXG4gICAqICh1bmRlciBcInNlbWktcmVsYXRlZCBmdW4gZmFjdFwiKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKlxuICAgKiBCYWNrdGlja3MgYXJlIGVzY2FwZWQgYmVjYXVzZSBpbiBJRSA8IDksIHRoZXkgY2FuIGJyZWFrIG91dCBvZlxuICAgKiBhdHRyaWJ1dGUgdmFsdWVzIG9yIEhUTUwgY29tbWVudHMuIFNlZSBbIzU5XShodHRwczovL2h0bWw1c2VjLm9yZy8jNTkpLFxuICAgKiBbIzEwMl0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwMiksIFsjMTA4XShodHRwczovL2h0bWw1c2VjLm9yZy8jMTA4KSwgYW5kXG4gICAqIFsjMTMzXShodHRwczovL2h0bWw1c2VjLm9yZy8jMTMzKSBvZiB0aGVcbiAgICogW0hUTUw1IFNlY3VyaXR5IENoZWF0c2hlZXRdKGh0dHBzOi8vaHRtbDVzZWMub3JnLykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogV2hlbiB3b3JraW5nIHdpdGggSFRNTCB5b3Ugc2hvdWxkIGFsd2F5c1xuICAgKiBbcXVvdGUgYXR0cmlidXRlIHZhbHVlc10oaHR0cDovL3dvbmtvLmNvbS9wb3N0L2h0bWwtZXNjYXBpbmcpIHRvIHJlZHVjZVxuICAgKiBYU1MgdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnKTtcbiAgICogLy8gPT4gJ2ZyZWQsIGJhcm5leSwgJmFtcDsgcGViYmxlcydcbiAgICovXG4gIGZ1bmN0aW9uIGVzY2FwZShzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICAgIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgICA/IHN0cmluZy5yZXBsYWNlKHJlVW5lc2NhcGVkSHRtbCwgZXNjYXBlSHRtbENoYXIpXG4gICAgICA6IHN0cmluZztcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgZ2l2ZW4gdG8gaXQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZFxuICAgKiBmdW5jdGlvbi4gSWYgYGZ1bmNgIGlzIGEgcHJvcGVydHkgbmFtZSwgdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJucyB0aGVcbiAgICogcHJvcGVydHkgdmFsdWUgZm9yIGEgZ2l2ZW4gZWxlbWVudC4gSWYgYGZ1bmNgIGlzIGFuIGFycmF5IG9yIG9iamVjdCwgdGhlXG4gICAqIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgZXF1aXZhbGVudFxuICAgKiBzb3VyY2UgcHJvcGVydGllcywgb3RoZXJ3aXNlIGl0IHJldHVybnMgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQHBhcmFtIHsqfSBbZnVuYz1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgdXNlcnMgPSBbXG4gICAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gICAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gICAqIF07XG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gICAqIF8uZmlsdGVyKHVzZXJzLCBfLml0ZXJhdGVlKHsgJ3VzZXInOiAnYmFybmV5JywgJ2FjdGl2ZSc6IHRydWUgfSkpO1xuICAgKiAvLyA9PiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH1dXG4gICAqXG4gICAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAgICogXy5maWx0ZXIodXNlcnMsIF8uaXRlcmF0ZWUoWyd1c2VyJywgJ2ZyZWQnXSkpO1xuICAgKiAvLyA9PiBbeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dXG4gICAqXG4gICAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICAgKiBfLm1hcCh1c2VycywgXy5pdGVyYXRlZSgndXNlcicpKTtcbiAgICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gICAqXG4gICAqIC8vIENyZWF0ZSBjdXN0b20gaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAgICogXy5pdGVyYXRlZSA9IF8ud3JhcChfLml0ZXJhdGVlLCBmdW5jdGlvbihpdGVyYXRlZSwgZnVuYykge1xuICAgKiAgIHJldHVybiAhXy5pc1JlZ0V4cChmdW5jKSA/IGl0ZXJhdGVlKGZ1bmMpIDogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAqICAgICByZXR1cm4gZnVuYy50ZXN0KHN0cmluZyk7XG4gICAqICAgfTtcbiAgICogfSk7XG4gICAqXG4gICAqIF8uZmlsdGVyKFsnYWJjJywgJ2RlZiddLCAvZWYvKTtcbiAgICogLy8gPT4gWydkZWYnXVxuICAgKi9cbiAgdmFyIGl0ZXJhdGVlID0gYmFzZUl0ZXJhdGVlO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhIHBhcnRpYWwgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gYSBnaXZlblxuICAgKiBvYmplY3QgYW5kIGBzb3VyY2VgLCByZXR1cm5pbmcgYHRydWVgIGlmIHRoZSBnaXZlbiBvYmplY3QgaGFzIGVxdWl2YWxlbnRcbiAgICogcHJvcGVydHkgdmFsdWVzLCBlbHNlIGBmYWxzZWAuIFRoZSBjcmVhdGVkIGZ1bmN0aW9uIGlzIGVxdWl2YWxlbnQgdG9cbiAgICogYF8uaXNNYXRjaGAgd2l0aCBhIGBzb3VyY2VgIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyBgXy5pc0VxdWFsYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMy4wLjBcbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHVzZXJzID0gW1xuICAgKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICAgKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICAgKiBdO1xuICAgKlxuICAgKiBfLmZpbHRlcih1c2VycywgXy5tYXRjaGVzKHsgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSkpO1xuICAgKiAvLyA9PiBbeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfV1cbiAgICovXG4gIGZ1bmN0aW9uIG1hdGNoZXMoc291cmNlKSB7XG4gICAgcmV0dXJuIGJhc2VNYXRjaGVzKGFzc2lnbih7fSwgc291cmNlKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbGwgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIGZ1bmN0aW9uIHByb3BlcnRpZXMgb2YgYSBzb3VyY2VcbiAgICogb2JqZWN0IHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuIElmIGBvYmplY3RgIGlzIGEgZnVuY3Rpb24sIHRoZW4gbWV0aG9kc1xuICAgKiBhcmUgYWRkZWQgdG8gaXRzIHByb3RvdHlwZSBhcyB3ZWxsLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVXNlIGBfLnJ1bkluQ29udGV4dGAgdG8gY3JlYXRlIGEgcHJpc3RpbmUgYGxvZGFzaGAgZnVuY3Rpb24gdG9cbiAgICogYXZvaWQgY29uZmxpY3RzIGNhdXNlZCBieSBtb2RpZnlpbmcgdGhlIG9yaWdpbmFsLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29iamVjdD1sb2Rhc2hdIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBmdW5jdGlvbnMgdG8gYWRkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jaGFpbj10cnVlXSBTcGVjaWZ5IHdoZXRoZXIgbWl4aW5zIGFyZSBjaGFpbmFibGUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIHZvd2VscyhzdHJpbmcpIHtcbiAgICogICByZXR1cm4gXy5maWx0ZXIoc3RyaW5nLCBmdW5jdGlvbih2KSB7XG4gICAqICAgICByZXR1cm4gL1thZWlvdV0vaS50ZXN0KHYpO1xuICAgKiAgIH0pO1xuICAgKiB9XG4gICAqXG4gICAqIF8ubWl4aW4oeyAndm93ZWxzJzogdm93ZWxzIH0pO1xuICAgKiBfLnZvd2VscygnZnJlZCcpO1xuICAgKiAvLyA9PiBbJ2UnXVxuICAgKlxuICAgKiBfKCdmcmVkJykudm93ZWxzKCkudmFsdWUoKTtcbiAgICogLy8gPT4gWydlJ11cbiAgICpcbiAgICogXy5taXhpbih7ICd2b3dlbHMnOiB2b3dlbHMgfSwgeyAnY2hhaW4nOiBmYWxzZSB9KTtcbiAgICogXygnZnJlZCcpLnZvd2VscygpO1xuICAgKiAvLyA9PiBbJ2UnXVxuICAgKi9cbiAgZnVuY3Rpb24gbWl4aW4ob2JqZWN0LCBzb3VyY2UsIG9wdGlvbnMpIHtcbiAgICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICAgIG1ldGhvZE5hbWVzID0gYmFzZUZ1bmN0aW9ucyhzb3VyY2UsIHByb3BzKTtcblxuICAgIGlmIChvcHRpb25zID09IG51bGwgJiZcbiAgICAgICAgIShpc09iamVjdChzb3VyY2UpICYmIChtZXRob2ROYW1lcy5sZW5ndGggfHwgIXByb3BzLmxlbmd0aCkpKSB7XG4gICAgICBvcHRpb25zID0gc291cmNlO1xuICAgICAgc291cmNlID0gb2JqZWN0O1xuICAgICAgb2JqZWN0ID0gdGhpcztcbiAgICAgIG1ldGhvZE5hbWVzID0gYmFzZUZ1bmN0aW9ucyhzb3VyY2UsIGtleXMoc291cmNlKSk7XG4gICAgfVxuICAgIHZhciBjaGFpbiA9ICEoaXNPYmplY3Qob3B0aW9ucykgJiYgJ2NoYWluJyBpbiBvcHRpb25zKSB8fCAhIW9wdGlvbnMuY2hhaW4sXG4gICAgICAgIGlzRnVuYyA9IGlzRnVuY3Rpb24ob2JqZWN0KTtcblxuICAgIGJhc2VFYWNoKG1ldGhvZE5hbWVzLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IHNvdXJjZVttZXRob2ROYW1lXTtcbiAgICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGZ1bmM7XG4gICAgICBpZiAoaXNGdW5jKSB7XG4gICAgICAgIG9iamVjdC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXztcbiAgICAgICAgICBpZiAoY2hhaW4gfHwgY2hhaW5BbGwpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBvYmplY3QodGhpcy5fX3dyYXBwZWRfXyksXG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IHJlc3VsdC5fX2FjdGlvbnNfXyA9IGNvcHlBcnJheSh0aGlzLl9fYWN0aW9uc19fKTtcblxuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHsgJ2Z1bmMnOiBmdW5jLCAnYXJncyc6IGFyZ3VtZW50cywgJ3RoaXNBcmcnOiBvYmplY3QgfSk7XG4gICAgICAgICAgICByZXN1bHQuX19jaGFpbl9fID0gY2hhaW5BbGw7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShvYmplY3QsIGFycmF5UHVzaChbdGhpcy52YWx1ZSgpXSwgYXJndW1lbnRzKSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVydHMgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG9cbiAgICogdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbFxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgbG9kYXNoID0gXy5ub0NvbmZsaWN0KCk7XG4gICAqL1xuICBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgIGlmIChyb290Ll8gPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuXyA9IG9sZERhc2g7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHRoYXQgcmV0dXJucyBgdW5kZWZpbmVkYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMi4zLjBcbiAgICogQGNhdGVnb3J5IFV0aWxcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy50aW1lcygyLCBfLm5vb3ApO1xuICAgKiAvLyA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdXG4gICAqL1xuICBmdW5jdGlvbiBub29wKCkge1xuICAgIC8vIE5vIG9wZXJhdGlvbiBwZXJmb3JtZWQuXG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgdW5pcXVlIElELiBJZiBgcHJlZml4YCBpcyBnaXZlbiwgdGhlIElEIGlzIGFwcGVuZGVkIHRvIGl0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgVXRpbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3ByZWZpeD0nJ10gVGhlIHZhbHVlIHRvIHByZWZpeCB0aGUgSUQgd2l0aC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5pcXVlIElELlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnVuaXF1ZUlkKCdjb250YWN0XycpO1xuICAgKiAvLyA9PiAnY29udGFjdF8xMDQnXG4gICAqXG4gICAqIF8udW5pcXVlSWQoKTtcbiAgICogLy8gPT4gJzEwNSdcbiAgICovXG4gIGZ1bmN0aW9uIHVuaXF1ZUlkKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyO1xuICAgIHJldHVybiB0b1N0cmluZyhwcmVmaXgpICsgaWQ7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIGBhcnJheWAuIElmIGBhcnJheWAgaXMgZW1wdHkgb3IgZmFsc2V5LFxuICAgKiBgdW5kZWZpbmVkYCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE1hdGhcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1heGltdW0gdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8ubWF4KFs0LCAyLCA4LCA2XSk7XG4gICAqIC8vID0+IDhcbiAgICpcbiAgICogXy5tYXgoW10pO1xuICAgKiAvLyA9PiB1bmRlZmluZWRcbiAgICovXG4gIGZ1bmN0aW9uIG1heChhcnJheSkge1xuICAgIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgICAgPyBiYXNlRXh0cmVtdW0oYXJyYXksIGlkZW50aXR5LCBiYXNlR3QpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgbWluaW11bSB2YWx1ZSBvZiBgYXJyYXlgLiBJZiBgYXJyYXlgIGlzIGVtcHR5IG9yIGZhbHNleSxcbiAgICogYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBNYXRoXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtaW5pbXVtIHZhbHVlLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLm1pbihbNCwgMiwgOCwgNl0pO1xuICAgKiAvLyA9PiAyXG4gICAqXG4gICAqIF8ubWluKFtdKTtcbiAgICogLy8gPT4gdW5kZWZpbmVkXG4gICAqL1xuICBmdW5jdGlvbiBtaW4oYXJyYXkpIHtcbiAgICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICAgID8gYmFzZUV4dHJlbXVtKGFycmF5LCBpZGVudGl0eSwgYmFzZUx0KVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gQWRkIG1ldGhvZHMgdGhhdCByZXR1cm4gd3JhcHBlZCB2YWx1ZXMgaW4gY2hhaW4gc2VxdWVuY2VzLlxuICBsb2Rhc2guYXNzaWduSW4gPSBhc3NpZ25JbjtcbiAgbG9kYXNoLmJlZm9yZSA9IGJlZm9yZTtcbiAgbG9kYXNoLmJpbmQgPSBiaW5kO1xuICBsb2Rhc2guY2hhaW4gPSBjaGFpbjtcbiAgbG9kYXNoLmNvbXBhY3QgPSBjb21wYWN0O1xuICBsb2Rhc2guY29uY2F0ID0gY29uY2F0O1xuICBsb2Rhc2guY3JlYXRlID0gY3JlYXRlO1xuICBsb2Rhc2guZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgbG9kYXNoLmRlZmVyID0gZGVmZXI7XG4gIGxvZGFzaC5kZWxheSA9IGRlbGF5O1xuICBsb2Rhc2guZmlsdGVyID0gZmlsdGVyO1xuICBsb2Rhc2guZmxhdHRlbiA9IGZsYXR0ZW47XG4gIGxvZGFzaC5mbGF0dGVuRGVlcCA9IGZsYXR0ZW5EZWVwO1xuICBsb2Rhc2guaXRlcmF0ZWUgPSBpdGVyYXRlZTtcbiAgbG9kYXNoLmtleXMgPSBrZXlzO1xuICBsb2Rhc2gubWFwID0gbWFwO1xuICBsb2Rhc2gubWF0Y2hlcyA9IG1hdGNoZXM7XG4gIGxvZGFzaC5taXhpbiA9IG1peGluO1xuICBsb2Rhc2gubmVnYXRlID0gbmVnYXRlO1xuICBsb2Rhc2gub25jZSA9IG9uY2U7XG4gIGxvZGFzaC5waWNrID0gcGljaztcbiAgbG9kYXNoLnNsaWNlID0gc2xpY2U7XG4gIGxvZGFzaC5zb3J0QnkgPSBzb3J0Qnk7XG4gIGxvZGFzaC50YXAgPSB0YXA7XG4gIGxvZGFzaC50aHJ1ID0gdGhydTtcbiAgbG9kYXNoLnRvQXJyYXkgPSB0b0FycmF5O1xuICBsb2Rhc2gudmFsdWVzID0gdmFsdWVzO1xuXG4gIC8vIEFkZCBhbGlhc2VzLlxuICBsb2Rhc2guZXh0ZW5kID0gYXNzaWduSW47XG5cbiAgLy8gQWRkIG1ldGhvZHMgdG8gYGxvZGFzaC5wcm90b3R5cGVgLlxuICBtaXhpbihsb2Rhc2gsIGxvZGFzaCk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIEFkZCBtZXRob2RzIHRoYXQgcmV0dXJuIHVud3JhcHBlZCB2YWx1ZXMgaW4gY2hhaW4gc2VxdWVuY2VzLlxuICBsb2Rhc2guY2xvbmUgPSBjbG9uZTtcbiAgbG9kYXNoLmVzY2FwZSA9IGVzY2FwZTtcbiAgbG9kYXNoLmV2ZXJ5ID0gZXZlcnk7XG4gIGxvZGFzaC5maW5kID0gZmluZDtcbiAgbG9kYXNoLmZvckVhY2ggPSBmb3JFYWNoO1xuICBsb2Rhc2guaGFzID0gaGFzO1xuICBsb2Rhc2guaGVhZCA9IGhlYWQ7XG4gIGxvZGFzaC5pZGVudGl0eSA9IGlkZW50aXR5O1xuICBsb2Rhc2guaW5kZXhPZiA9IGluZGV4T2Y7XG4gIGxvZGFzaC5pc0FyZ3VtZW50cyA9IGlzQXJndW1lbnRzO1xuICBsb2Rhc2guaXNBcnJheSA9IGlzQXJyYXk7XG4gIGxvZGFzaC5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG4gIGxvZGFzaC5pc0RhdGUgPSBpc0RhdGU7XG4gIGxvZGFzaC5pc0VtcHR5ID0gaXNFbXB0eTtcbiAgbG9kYXNoLmlzRXF1YWwgPSBpc0VxdWFsO1xuICBsb2Rhc2guaXNGaW5pdGUgPSBpc0Zpbml0ZTtcbiAgbG9kYXNoLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuICBsb2Rhc2guaXNOYU4gPSBpc05hTjtcbiAgbG9kYXNoLmlzTnVsbCA9IGlzTnVsbDtcbiAgbG9kYXNoLmlzTnVtYmVyID0gaXNOdW1iZXI7XG4gIGxvZGFzaC5pc09iamVjdCA9IGlzT2JqZWN0O1xuICBsb2Rhc2guaXNSZWdFeHAgPSBpc1JlZ0V4cDtcbiAgbG9kYXNoLmlzU3RyaW5nID0gaXNTdHJpbmc7XG4gIGxvZGFzaC5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuICBsb2Rhc2gubGFzdCA9IGxhc3Q7XG4gIGxvZGFzaC5tYXggPSBtYXg7XG4gIGxvZGFzaC5taW4gPSBtaW47XG4gIGxvZGFzaC5ub0NvbmZsaWN0ID0gbm9Db25mbGljdDtcbiAgbG9kYXNoLm5vb3AgPSBub29wO1xuICBsb2Rhc2gucmVkdWNlID0gcmVkdWNlO1xuICBsb2Rhc2gucmVzdWx0ID0gcmVzdWx0O1xuICBsb2Rhc2guc2l6ZSA9IHNpemU7XG4gIGxvZGFzaC5zb21lID0gc29tZTtcbiAgbG9kYXNoLnVuaXF1ZUlkID0gdW5pcXVlSWQ7XG5cbiAgLy8gQWRkIGFsaWFzZXMuXG4gIGxvZGFzaC5lYWNoID0gZm9yRWFjaDtcbiAgbG9kYXNoLmZpcnN0ID0gaGVhZDtcblxuICBtaXhpbihsb2Rhc2gsIChmdW5jdGlvbigpIHtcbiAgICB2YXIgc291cmNlID0ge307XG4gICAgYmFzZUZvck93bihsb2Rhc2gsIGZ1bmN0aW9uKGZ1bmMsIG1ldGhvZE5hbWUpIHtcbiAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChsb2Rhc2gucHJvdG90eXBlLCBtZXRob2ROYW1lKSkge1xuICAgICAgICBzb3VyY2VbbWV0aG9kTmFtZV0gPSBmdW5jO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzb3VyY2U7XG4gIH0oKSksIHsgJ2NoYWluJzogZmFsc2UgfSk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIGxvZGFzaC5WRVJTSU9OID0gVkVSU0lPTjtcblxuICAvLyBBZGQgYEFycmF5YCBtZXRob2RzIHRvIGBsb2Rhc2gucHJvdG90eXBlYC5cbiAgYmFzZUVhY2goWydwb3AnLCAnam9pbicsICdyZXBsYWNlJywgJ3JldmVyc2UnLCAnc3BsaXQnLCAncHVzaCcsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgZnVuYyA9ICgvXig/OnJlcGxhY2V8c3BsaXQpJC8udGVzdChtZXRob2ROYW1lKSA/IFN0cmluZy5wcm90b3R5cGUgOiBhcnJheVByb3RvKVttZXRob2ROYW1lXSxcbiAgICAgICAgY2hhaW5OYW1lID0gL14oPzpwdXNofHNvcnR8dW5zaGlmdCkkLy50ZXN0KG1ldGhvZE5hbWUpID8gJ3RhcCcgOiAndGhydScsXG4gICAgICAgIHJldFVud3JhcHBlZCA9IC9eKD86cG9wfGpvaW58cmVwbGFjZXxzaGlmdCkkLy50ZXN0KG1ldGhvZE5hbWUpO1xuXG4gICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmV0VW53cmFwcGVkICYmICF0aGlzLl9fY2hhaW5fXykge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbXSwgYXJncyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1tjaGFpbk5hbWVdKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbXSwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgY2hhaW4gc2VxdWVuY2UgbWV0aG9kcyB0byB0aGUgYGxvZGFzaGAgd3JhcHBlci5cbiAgbG9kYXNoLnByb3RvdHlwZS50b0pTT04gPSBsb2Rhc2gucHJvdG90eXBlLnZhbHVlT2YgPSBsb2Rhc2gucHJvdG90eXBlLnZhbHVlID0gd3JhcHBlclZhbHVlO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIEV4cG9zZSBMb2Rhc2ggb24gdGhlIGZyZWUgdmFyaWFibGUgYHdpbmRvd2Agb3IgYHNlbGZgIHdoZW4gYXZhaWxhYmxlIHNvIGl0J3NcbiAgLy8gZ2xvYmFsbHkgYWNjZXNzaWJsZSwgZXZlbiB3aGVuIGJ1bmRsZWQgd2l0aCBCcm93c2VyaWZ5LCBXZWJwYWNrLCBldGMuIFRoaXNcbiAgLy8gYWxzbyBwcmV2ZW50cyBlcnJvcnMgaW4gY2FzZXMgd2hlcmUgTG9kYXNoIGlzIGxvYWRlZCBieSBhIHNjcmlwdCB0YWcgaW4gdGhlXG4gIC8vIHByZXNlbmNlIG9mIGFuIEFNRCBsb2FkZXIuIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2Vycm9ycy5odG1sI21pc21hdGNoXG4gIC8vIGZvciBtb3JlIGRldGFpbHMuIFVzZSBgXy5ub0NvbmZsaWN0YCB0byByZW1vdmUgTG9kYXNoIGZyb20gdGhlIGdsb2JhbCBvYmplY3QuXG4gIChmcmVlU2VsZiB8fCB7fSkuXyA9IGxvZGFzaDtcblxuICAvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzIGxpa2Ugci5qcyBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmVcbiAgICAvLyByZWZlcmVuY2VkIGFzIHRoZSBcInVuZGVyc2NvcmVcIiBtb2R1bGUuXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGxvZGFzaDtcbiAgICB9KTtcbiAgfVxuICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxuICBlbHNlIGlmIChmcmVlTW9kdWxlKSB7XG4gICAgLy8gRXhwb3J0IGZvciBOb2RlLmpzLlxuICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSBsb2Rhc2gpLl8gPSBsb2Rhc2g7XG4gICAgLy8gRXhwb3J0IGZvciBDb21tb25KUyBzdXBwb3J0LlxuICAgIGZyZWVFeHBvcnRzLl8gPSBsb2Rhc2g7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gRXhwb3J0IHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAgIHJvb3QuXyA9IGxvZGFzaDtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiJdfQ==