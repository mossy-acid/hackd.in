'use strict';

/** Used to map aliases to their real names. */
exports.aliasToReal = {

  // Lodash aliases.
  'each': 'forEach',
  'eachRight': 'forEachRight',
  'entries': 'toPairs',
  'entriesIn': 'toPairsIn',
  'extend': 'assignIn',
  'extendWith': 'assignInWith',
  'first': 'head',

  // Ramda aliases.
  '__': 'placeholder',
  'all': 'every',
  'allPass': 'overEvery',
  'always': 'constant',
  'any': 'some',
  'anyPass': 'overSome',
  'apply': 'spread',
  'assoc': 'set',
  'assocPath': 'set',
  'complement': 'negate',
  'compose': 'flowRight',
  'contains': 'includes',
  'dissoc': 'unset',
  'dissocPath': 'unset',
  'equals': 'isEqual',
  'identical': 'eq',
  'init': 'initial',
  'invertObj': 'invert',
  'juxt': 'over',
  'omitAll': 'omit',
  'nAry': 'ary',
  'path': 'get',
  'pathEq': 'matchesProperty',
  'pathOr': 'getOr',
  'paths': 'at',
  'pickAll': 'pick',
  'pipe': 'flow',
  'pluck': 'map',
  'prop': 'get',
  'propEq': 'matchesProperty',
  'propOr': 'getOr',
  'props': 'at',
  'unapply': 'rest',
  'unnest': 'flatten',
  'useWith': 'overArgs',
  'whereEq': 'filter',
  'zipObj': 'zipObject'
};

/** Used to map ary to method names. */
exports.aryMethod = {
  '1': ['attempt', 'castArray', 'ceil', 'create', 'curry', 'curryRight', 'floor', 'flow', 'flowRight', 'fromPairs', 'invert', 'iteratee', 'memoize', 'method', 'methodOf', 'mixin', 'over', 'overEvery', 'overSome', 'rest', 'reverse', 'round', 'runInContext', 'spread', 'template', 'trim', 'trimEnd', 'trimStart', 'uniqueId', 'words'],
  '2': ['add', 'after', 'ary', 'assign', 'assignIn', 'at', 'before', 'bind', 'bindAll', 'bindKey', 'chunk', 'cloneDeepWith', 'cloneWith', 'concat', 'countBy', 'curryN', 'curryRightN', 'debounce', 'defaults', 'defaultsDeep', 'delay', 'difference', 'divide', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'endsWith', 'eq', 'every', 'filter', 'find', 'findIndex', 'findKey', 'findLast', 'findLastIndex', 'findLastKey', 'flatMap', 'flatMapDeep', 'flattenDepth', 'forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'get', 'groupBy', 'gt', 'gte', 'has', 'hasIn', 'includes', 'indexOf', 'intersection', 'invertBy', 'invoke', 'invokeMap', 'isEqual', 'isMatch', 'join', 'keyBy', 'lastIndexOf', 'lt', 'lte', 'map', 'mapKeys', 'mapValues', 'matchesProperty', 'maxBy', 'meanBy', 'merge', 'minBy', 'multiply', 'nth', 'omit', 'omitBy', 'overArgs', 'pad', 'padEnd', 'padStart', 'parseInt', 'partial', 'partialRight', 'partition', 'pick', 'pickBy', 'pull', 'pullAll', 'pullAt', 'random', 'range', 'rangeRight', 'rearg', 'reject', 'remove', 'repeat', 'restFrom', 'result', 'sampleSize', 'some', 'sortBy', 'sortedIndex', 'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexOf', 'sortedUniqBy', 'split', 'spreadFrom', 'startsWith', 'subtract', 'sumBy', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'tap', 'throttle', 'thru', 'times', 'trimChars', 'trimCharsEnd', 'trimCharsStart', 'truncate', 'union', 'uniqBy', 'uniqWith', 'unset', 'unzipWith', 'without', 'wrap', 'xor', 'zip', 'zipObject', 'zipObjectDeep'],
  '3': ['assignInWith', 'assignWith', 'clamp', 'differenceBy', 'differenceWith', 'findFrom', 'findIndexFrom', 'findLastFrom', 'findLastIndexFrom', 'getOr', 'includesFrom', 'indexOfFrom', 'inRange', 'intersectionBy', 'intersectionWith', 'invokeArgs', 'invokeArgsMap', 'isEqualWith', 'isMatchWith', 'flatMapDepth', 'lastIndexOfFrom', 'mergeWith', 'orderBy', 'padChars', 'padCharsEnd', 'padCharsStart', 'pullAllBy', 'pullAllWith', 'reduce', 'reduceRight', 'replace', 'set', 'slice', 'sortedIndexBy', 'sortedLastIndexBy', 'transform', 'unionBy', 'unionWith', 'update', 'xorBy', 'xorWith', 'zipWith'],
  '4': ['fill', 'setWith', 'updateWith']
};

/** Used to map ary to rearg configs. */
exports.aryRearg = {
  '2': [1, 0],
  '3': [2, 0, 1],
  '4': [3, 2, 0, 1]
};

/** Used to map method names to their iteratee ary. */
exports.iterateeAry = {
  'dropRightWhile': 1,
  'dropWhile': 1,
  'every': 1,
  'filter': 1,
  'find': 1,
  'findFrom': 1,
  'findIndex': 1,
  'findIndexFrom': 1,
  'findKey': 1,
  'findLast': 1,
  'findLastFrom': 1,
  'findLastIndex': 1,
  'findLastIndexFrom': 1,
  'findLastKey': 1,
  'flatMap': 1,
  'flatMapDeep': 1,
  'flatMapDepth': 1,
  'forEach': 1,
  'forEachRight': 1,
  'forIn': 1,
  'forInRight': 1,
  'forOwn': 1,
  'forOwnRight': 1,
  'map': 1,
  'mapKeys': 1,
  'mapValues': 1,
  'partition': 1,
  'reduce': 2,
  'reduceRight': 2,
  'reject': 1,
  'remove': 1,
  'some': 1,
  'takeRightWhile': 1,
  'takeWhile': 1,
  'times': 1,
  'transform': 2
};

/** Used to map method names to iteratee rearg configs. */
exports.iterateeRearg = {
  'mapKeys': [1]
};

/** Used to map method names to rearg configs. */
exports.methodRearg = {
  'assignInWith': [1, 2, 0],
  'assignWith': [1, 2, 0],
  'differenceBy': [1, 2, 0],
  'differenceWith': [1, 2, 0],
  'getOr': [2, 1, 0],
  'intersectionBy': [1, 2, 0],
  'intersectionWith': [1, 2, 0],
  'isEqualWith': [1, 2, 0],
  'isMatchWith': [2, 1, 0],
  'mergeWith': [1, 2, 0],
  'padChars': [2, 1, 0],
  'padCharsEnd': [2, 1, 0],
  'padCharsStart': [2, 1, 0],
  'pullAllBy': [2, 1, 0],
  'pullAllWith': [2, 1, 0],
  'setWith': [3, 1, 2, 0],
  'sortedIndexBy': [2, 1, 0],
  'sortedLastIndexBy': [2, 1, 0],
  'unionBy': [1, 2, 0],
  'unionWith': [1, 2, 0],
  'updateWith': [3, 1, 2, 0],
  'xorBy': [1, 2, 0],
  'xorWith': [1, 2, 0],
  'zipWith': [1, 2, 0]
};

/** Used to map method names to spread configs. */
exports.methodSpread = {
  'invokeArgs': 2,
  'invokeArgsMap': 2,
  'partial': 1,
  'partialRight': 1,
  'without': 1
};

/** Used to identify methods which mutate arrays or objects. */
exports.mutate = {
  'array': {
    'fill': true,
    'pull': true,
    'pullAll': true,
    'pullAllBy': true,
    'pullAllWith': true,
    'pullAt': true,
    'remove': true,
    'reverse': true
  },
  'object': {
    'assign': true,
    'assignIn': true,
    'assignInWith': true,
    'assignWith': true,
    'defaults': true,
    'defaultsDeep': true,
    'merge': true,
    'mergeWith': true
  },
  'set': {
    'set': true,
    'setWith': true,
    'unset': true,
    'update': true,
    'updateWith': true
  }
};

/** Used to track methods with placeholder support */
exports.placeholder = {
  'bind': true,
  'bindKey': true,
  'curry': true,
  'curryRight': true,
  'partial': true,
  'partialRight': true
};

/** Used to map real names to their aliases. */
exports.realToAlias = function () {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      object = exports.aliasToReal,
      result = {};

  for (var key in object) {
    var value = object[key];
    if (hasOwnProperty.call(result, value)) {
      result[value].push(key);
    } else {
      result[value] = [key];
    }
  }
  return result;
}();

/** Used to map method names to other names. */
exports.remap = {
  'curryN': 'curry',
  'curryRightN': 'curryRight',
  'findFrom': 'find',
  'findIndexFrom': 'findIndex',
  'findLastFrom': 'findLast',
  'findLastIndexFrom': 'findLastIndex',
  'getOr': 'get',
  'includesFrom': 'includes',
  'indexOfFrom': 'indexOf',
  'invokeArgs': 'invoke',
  'invokeArgsMap': 'invokeMap',
  'lastIndexOfFrom': 'lastIndexOf',
  'padChars': 'pad',
  'padCharsEnd': 'padEnd',
  'padCharsStart': 'padStart',
  'restFrom': 'rest',
  'spreadFrom': 'spread',
  'trimChars': 'trim',
  'trimCharsEnd': 'trimEnd',
  'trimCharsStart': 'trimStart'
};

/** Used to track methods that skip fixing their arity. */
exports.skipFixed = {
  'castArray': true,
  'flow': true,
  'flowRight': true,
  'iteratee': true,
  'mixin': true,
  'runInContext': true
};

/** Used to track methods that skip rearranging arguments. */
exports.skipRearg = {
  'add': true,
  'assign': true,
  'assignIn': true,
  'bind': true,
  'bindKey': true,
  'concat': true,
  'difference': true,
  'divide': true,
  'eq': true,
  'gt': true,
  'gte': true,
  'isEqual': true,
  'lt': true,
  'lte': true,
  'matchesProperty': true,
  'merge': true,
  'multiply': true,
  'overArgs': true,
  'partial': true,
  'partialRight': true,
  'random': true,
  'range': true,
  'rangeRight': true,
  'subtract': true,
  'zip': true,
  'zipObject': true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL19tYXBwaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLFFBQVEsV0FBUixHQUFzQjs7O0FBR3BCLFVBQVEsU0FIWTtBQUlwQixlQUFhLGNBSk87QUFLcEIsYUFBVyxTQUxTO0FBTXBCLGVBQWEsV0FOTztBQU9wQixZQUFVLFVBUFU7QUFRcEIsZ0JBQWMsY0FSTTtBQVNwQixXQUFTLE1BVFc7OztBQVlwQixRQUFNLGFBWmM7QUFhcEIsU0FBTyxPQWJhO0FBY3BCLGFBQVcsV0FkUztBQWVwQixZQUFVLFVBZlU7QUFnQnBCLFNBQU8sTUFoQmE7QUFpQnBCLGFBQVcsVUFqQlM7QUFrQnBCLFdBQVMsUUFsQlc7QUFtQnBCLFdBQVMsS0FuQlc7QUFvQnBCLGVBQWEsS0FwQk87QUFxQnBCLGdCQUFjLFFBckJNO0FBc0JwQixhQUFXLFdBdEJTO0FBdUJwQixjQUFZLFVBdkJRO0FBd0JwQixZQUFVLE9BeEJVO0FBeUJwQixnQkFBYyxPQXpCTTtBQTBCcEIsWUFBVSxTQTFCVTtBQTJCcEIsZUFBYSxJQTNCTztBQTRCcEIsVUFBUSxTQTVCWTtBQTZCcEIsZUFBYSxRQTdCTztBQThCcEIsVUFBUSxNQTlCWTtBQStCcEIsYUFBVyxNQS9CUztBQWdDcEIsVUFBUSxLQWhDWTtBQWlDcEIsVUFBUSxLQWpDWTtBQWtDcEIsWUFBVSxpQkFsQ1U7QUFtQ3BCLFlBQVUsT0FuQ1U7QUFvQ3BCLFdBQVMsSUFwQ1c7QUFxQ3BCLGFBQVcsTUFyQ1M7QUFzQ3BCLFVBQVEsTUF0Q1k7QUF1Q3BCLFdBQVMsS0F2Q1c7QUF3Q3BCLFVBQVEsS0F4Q1k7QUF5Q3BCLFlBQVUsaUJBekNVO0FBMENwQixZQUFVLE9BMUNVO0FBMkNwQixXQUFTLElBM0NXO0FBNENwQixhQUFXLE1BNUNTO0FBNkNwQixZQUFVLFNBN0NVO0FBOENwQixhQUFXLFVBOUNTO0FBK0NwQixhQUFXLFFBL0NTO0FBZ0RwQixZQUFVO0FBaERV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QVRZO0FBVWxCLFFBQU0sSUFWWTtBQVdsQixTQUFPLElBWFc7QUFZbEIsYUFBVyxJQVpPO0FBYWxCLFFBQU0sSUFiWTtBQWNsQixTQUFPLElBZFc7QUFlbEIscUJBQW1CLElBZkQ7QUFnQmxCLFdBQVMsSUFoQlM7QUFpQmxCLGNBQVksSUFqQk07QUFrQmxCLGNBQVksSUFsQk07QUFtQmxCLGFBQVcsSUFuQk87QUFvQmxCLGtCQUFnQixJQXBCRTtBQXFCbEIsWUFBVSxJQXJCUTtBQXNCbEIsV0FBUyxJQXRCUztBQXVCbEIsZ0JBQWMsSUF2Qkk7QUF3QmxCLGNBQVksSUF4Qk07QUF5QmxCLFNBQU8sSUF6Qlc7QUEwQmxCLGVBQWE7QUExQkssQ0FBcEIiLCJmaWxlIjoiX21hcHBpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCB0byBtYXAgYWxpYXNlcyB0byB0aGVpciByZWFsIG5hbWVzLiAqL1xuZXhwb3J0cy5hbGlhc1RvUmVhbCA9IHtcblxuICAvLyBMb2Rhc2ggYWxpYXNlcy5cbiAgJ2VhY2gnOiAnZm9yRWFjaCcsXG4gICdlYWNoUmlnaHQnOiAnZm9yRWFjaFJpZ2h0JyxcbiAgJ2VudHJpZXMnOiAndG9QYWlycycsXG4gICdlbnRyaWVzSW4nOiAndG9QYWlyc0luJyxcbiAgJ2V4dGVuZCc6ICdhc3NpZ25JbicsXG4gICdleHRlbmRXaXRoJzogJ2Fzc2lnbkluV2l0aCcsXG4gICdmaXJzdCc6ICdoZWFkJyxcblxuICAvLyBSYW1kYSBhbGlhc2VzLlxuICAnX18nOiAncGxhY2Vob2xkZXInLFxuICAnYWxsJzogJ2V2ZXJ5JyxcbiAgJ2FsbFBhc3MnOiAnb3ZlckV2ZXJ5JyxcbiAgJ2Fsd2F5cyc6ICdjb25zdGFudCcsXG4gICdhbnknOiAnc29tZScsXG4gICdhbnlQYXNzJzogJ292ZXJTb21lJyxcbiAgJ2FwcGx5JzogJ3NwcmVhZCcsXG4gICdhc3NvYyc6ICdzZXQnLFxuICAnYXNzb2NQYXRoJzogJ3NldCcsXG4gICdjb21wbGVtZW50JzogJ25lZ2F0ZScsXG4gICdjb21wb3NlJzogJ2Zsb3dSaWdodCcsXG4gICdjb250YWlucyc6ICdpbmNsdWRlcycsXG4gICdkaXNzb2MnOiAndW5zZXQnLFxuICAnZGlzc29jUGF0aCc6ICd1bnNldCcsXG4gICdlcXVhbHMnOiAnaXNFcXVhbCcsXG4gICdpZGVudGljYWwnOiAnZXEnLFxuICAnaW5pdCc6ICdpbml0aWFsJyxcbiAgJ2ludmVydE9iaic6ICdpbnZlcnQnLFxuICAnanV4dCc6ICdvdmVyJyxcbiAgJ29taXRBbGwnOiAnb21pdCcsXG4gICduQXJ5JzogJ2FyeScsXG4gICdwYXRoJzogJ2dldCcsXG4gICdwYXRoRXEnOiAnbWF0Y2hlc1Byb3BlcnR5JyxcbiAgJ3BhdGhPcic6ICdnZXRPcicsXG4gICdwYXRocyc6ICdhdCcsXG4gICdwaWNrQWxsJzogJ3BpY2snLFxuICAncGlwZSc6ICdmbG93JyxcbiAgJ3BsdWNrJzogJ21hcCcsXG4gICdwcm9wJzogJ2dldCcsXG4gICdwcm9wRXEnOiAnbWF0Y2hlc1Byb3BlcnR5JyxcbiAgJ3Byb3BPcic6ICdnZXRPcicsXG4gICdwcm9wcyc6ICdhdCcsXG4gICd1bmFwcGx5JzogJ3Jlc3QnLFxuICAndW5uZXN0JzogJ2ZsYXR0ZW4nLFxuICAndXNlV2l0aCc6ICdvdmVyQXJncycsXG4gICd3aGVyZUVxJzogJ2ZpbHRlcicsXG4gICd6aXBPYmonOiAnemlwT2JqZWN0J1xufTtcblxuLyoqIFVzZWQgdG8gbWFwIGFyeSB0byBtZXRob2QgbmFtZXMuICovXG5leHBvcnRzLmFyeU1ldGhvZCA9IHtcbiAgJzEnOiBbXG4gICAgJ2F0dGVtcHQnLCAnY2FzdEFycmF5JywgJ2NlaWwnLCAnY3JlYXRlJywgJ2N1cnJ5JywgJ2N1cnJ5UmlnaHQnLCAnZmxvb3InLFxuICAgICdmbG93JywgJ2Zsb3dSaWdodCcsICdmcm9tUGFpcnMnLCAnaW52ZXJ0JywgJ2l0ZXJhdGVlJywgJ21lbW9pemUnLCAnbWV0aG9kJyxcbiAgICAnbWV0aG9kT2YnLCAnbWl4aW4nLCAnb3ZlcicsICdvdmVyRXZlcnknLCAnb3ZlclNvbWUnLCAncmVzdCcsICdyZXZlcnNlJyxcbiAgICAncm91bmQnLCAncnVuSW5Db250ZXh0JywgJ3NwcmVhZCcsICd0ZW1wbGF0ZScsICd0cmltJywgJ3RyaW1FbmQnLCAndHJpbVN0YXJ0JyxcbiAgICAndW5pcXVlSWQnLCAnd29yZHMnXG4gIF0sXG4gICcyJzogW1xuICAgICdhZGQnLCAnYWZ0ZXInLCAnYXJ5JywgJ2Fzc2lnbicsICdhc3NpZ25JbicsICdhdCcsICdiZWZvcmUnLCAnYmluZCcsICdiaW5kQWxsJyxcbiAgICAnYmluZEtleScsICdjaHVuaycsICdjbG9uZURlZXBXaXRoJywgJ2Nsb25lV2l0aCcsICdjb25jYXQnLCAnY291bnRCeScsICdjdXJyeU4nLFxuICAgICdjdXJyeVJpZ2h0TicsICdkZWJvdW5jZScsICdkZWZhdWx0cycsICdkZWZhdWx0c0RlZXAnLCAnZGVsYXknLCAnZGlmZmVyZW5jZScsXG4gICAgJ2RpdmlkZScsICdkcm9wJywgJ2Ryb3BSaWdodCcsICdkcm9wUmlnaHRXaGlsZScsICdkcm9wV2hpbGUnLCAnZW5kc1dpdGgnLFxuICAgICdlcScsICdldmVyeScsICdmaWx0ZXInLCAnZmluZCcsICdmaW5kSW5kZXgnLCAnZmluZEtleScsICdmaW5kTGFzdCcsXG4gICAgJ2ZpbmRMYXN0SW5kZXgnLCAnZmluZExhc3RLZXknLCAnZmxhdE1hcCcsICdmbGF0TWFwRGVlcCcsICdmbGF0dGVuRGVwdGgnLFxuICAgICdmb3JFYWNoJywgJ2ZvckVhY2hSaWdodCcsICdmb3JJbicsICdmb3JJblJpZ2h0JywgJ2Zvck93bicsICdmb3JPd25SaWdodCcsXG4gICAgJ2dldCcsICdncm91cEJ5JywgJ2d0JywgJ2d0ZScsICdoYXMnLCAnaGFzSW4nLCAnaW5jbHVkZXMnLCAnaW5kZXhPZicsXG4gICAgJ2ludGVyc2VjdGlvbicsICdpbnZlcnRCeScsICdpbnZva2UnLCAnaW52b2tlTWFwJywgJ2lzRXF1YWwnLCAnaXNNYXRjaCcsXG4gICAgJ2pvaW4nLCAna2V5QnknLCAnbGFzdEluZGV4T2YnLCAnbHQnLCAnbHRlJywgJ21hcCcsICdtYXBLZXlzJywgJ21hcFZhbHVlcycsXG4gICAgJ21hdGNoZXNQcm9wZXJ0eScsICdtYXhCeScsICdtZWFuQnknLCAnbWVyZ2UnLCAnbWluQnknLCAnbXVsdGlwbHknLCAnbnRoJyxcbiAgICAnb21pdCcsICdvbWl0QnknLCAnb3ZlckFyZ3MnLCAncGFkJywgJ3BhZEVuZCcsICdwYWRTdGFydCcsICdwYXJzZUludCcsXG4gICAgJ3BhcnRpYWwnLCAncGFydGlhbFJpZ2h0JywgJ3BhcnRpdGlvbicsICdwaWNrJywgJ3BpY2tCeScsICdwdWxsJywgJ3B1bGxBbGwnLFxuICAgICdwdWxsQXQnLCAncmFuZG9tJywgJ3JhbmdlJywgJ3JhbmdlUmlnaHQnLCAncmVhcmcnLCAncmVqZWN0JywgJ3JlbW92ZScsXG4gICAgJ3JlcGVhdCcsICdyZXN0RnJvbScsICdyZXN1bHQnLCAnc2FtcGxlU2l6ZScsICdzb21lJywgJ3NvcnRCeScsICdzb3J0ZWRJbmRleCcsXG4gICAgJ3NvcnRlZEluZGV4T2YnLCAnc29ydGVkTGFzdEluZGV4JywgJ3NvcnRlZExhc3RJbmRleE9mJywgJ3NvcnRlZFVuaXFCeScsXG4gICAgJ3NwbGl0JywgJ3NwcmVhZEZyb20nLCAnc3RhcnRzV2l0aCcsICdzdWJ0cmFjdCcsICdzdW1CeScsICd0YWtlJywgJ3Rha2VSaWdodCcsXG4gICAgJ3Rha2VSaWdodFdoaWxlJywgJ3Rha2VXaGlsZScsICd0YXAnLCAndGhyb3R0bGUnLCAndGhydScsICd0aW1lcycsICd0cmltQ2hhcnMnLFxuICAgICd0cmltQ2hhcnNFbmQnLCAndHJpbUNoYXJzU3RhcnQnLCAndHJ1bmNhdGUnLCAndW5pb24nLCAndW5pcUJ5JywgJ3VuaXFXaXRoJyxcbiAgICAndW5zZXQnLCAndW56aXBXaXRoJywgJ3dpdGhvdXQnLCAnd3JhcCcsICd4b3InLCAnemlwJywgJ3ppcE9iamVjdCcsXG4gICAgJ3ppcE9iamVjdERlZXAnXG4gIF0sXG4gICczJzogW1xuICAgICdhc3NpZ25JbldpdGgnLCAnYXNzaWduV2l0aCcsICdjbGFtcCcsICdkaWZmZXJlbmNlQnknLCAnZGlmZmVyZW5jZVdpdGgnLFxuICAgICdmaW5kRnJvbScsICdmaW5kSW5kZXhGcm9tJywgJ2ZpbmRMYXN0RnJvbScsICdmaW5kTGFzdEluZGV4RnJvbScsICdnZXRPcicsXG4gICAgJ2luY2x1ZGVzRnJvbScsICdpbmRleE9mRnJvbScsICdpblJhbmdlJywgJ2ludGVyc2VjdGlvbkJ5JywgJ2ludGVyc2VjdGlvbldpdGgnLFxuICAgICdpbnZva2VBcmdzJywgJ2ludm9rZUFyZ3NNYXAnLCAnaXNFcXVhbFdpdGgnLCAnaXNNYXRjaFdpdGgnLCAnZmxhdE1hcERlcHRoJyxcbiAgICAnbGFzdEluZGV4T2ZGcm9tJywgJ21lcmdlV2l0aCcsICdvcmRlckJ5JywgJ3BhZENoYXJzJywgJ3BhZENoYXJzRW5kJyxcbiAgICAncGFkQ2hhcnNTdGFydCcsICdwdWxsQWxsQnknLCAncHVsbEFsbFdpdGgnLCAncmVkdWNlJywgJ3JlZHVjZVJpZ2h0JywgJ3JlcGxhY2UnLFxuICAgICdzZXQnLCAnc2xpY2UnLCAnc29ydGVkSW5kZXhCeScsICdzb3J0ZWRMYXN0SW5kZXhCeScsICd0cmFuc2Zvcm0nLCAndW5pb25CeScsXG4gICAgJ3VuaW9uV2l0aCcsICd1cGRhdGUnLCAneG9yQnknLCAneG9yV2l0aCcsICd6aXBXaXRoJ1xuICBdLFxuICAnNCc6IFtcbiAgICAnZmlsbCcsICdzZXRXaXRoJywgJ3VwZGF0ZVdpdGgnXG4gIF1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBhcnkgdG8gcmVhcmcgY29uZmlncy4gKi9cbmV4cG9ydHMuYXJ5UmVhcmcgPSB7XG4gICcyJzogWzEsIDBdLFxuICAnMyc6IFsyLCAwLCAxXSxcbiAgJzQnOiBbMywgMiwgMCwgMV1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gdGhlaXIgaXRlcmF0ZWUgYXJ5LiAqL1xuZXhwb3J0cy5pdGVyYXRlZUFyeSA9IHtcbiAgJ2Ryb3BSaWdodFdoaWxlJzogMSxcbiAgJ2Ryb3BXaGlsZSc6IDEsXG4gICdldmVyeSc6IDEsXG4gICdmaWx0ZXInOiAxLFxuICAnZmluZCc6IDEsXG4gICdmaW5kRnJvbSc6IDEsXG4gICdmaW5kSW5kZXgnOiAxLFxuICAnZmluZEluZGV4RnJvbSc6IDEsXG4gICdmaW5kS2V5JzogMSxcbiAgJ2ZpbmRMYXN0JzogMSxcbiAgJ2ZpbmRMYXN0RnJvbSc6IDEsXG4gICdmaW5kTGFzdEluZGV4JzogMSxcbiAgJ2ZpbmRMYXN0SW5kZXhGcm9tJzogMSxcbiAgJ2ZpbmRMYXN0S2V5JzogMSxcbiAgJ2ZsYXRNYXAnOiAxLFxuICAnZmxhdE1hcERlZXAnOiAxLFxuICAnZmxhdE1hcERlcHRoJzogMSxcbiAgJ2ZvckVhY2gnOiAxLFxuICAnZm9yRWFjaFJpZ2h0JzogMSxcbiAgJ2ZvckluJzogMSxcbiAgJ2ZvckluUmlnaHQnOiAxLFxuICAnZm9yT3duJzogMSxcbiAgJ2Zvck93blJpZ2h0JzogMSxcbiAgJ21hcCc6IDEsXG4gICdtYXBLZXlzJzogMSxcbiAgJ21hcFZhbHVlcyc6IDEsXG4gICdwYXJ0aXRpb24nOiAxLFxuICAncmVkdWNlJzogMixcbiAgJ3JlZHVjZVJpZ2h0JzogMixcbiAgJ3JlamVjdCc6IDEsXG4gICdyZW1vdmUnOiAxLFxuICAnc29tZSc6IDEsXG4gICd0YWtlUmlnaHRXaGlsZSc6IDEsXG4gICd0YWtlV2hpbGUnOiAxLFxuICAndGltZXMnOiAxLFxuICAndHJhbnNmb3JtJzogMlxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBpdGVyYXRlZSByZWFyZyBjb25maWdzLiAqL1xuZXhwb3J0cy5pdGVyYXRlZVJlYXJnID0ge1xuICAnbWFwS2V5cyc6IFsxXVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byByZWFyZyBjb25maWdzLiAqL1xuZXhwb3J0cy5tZXRob2RSZWFyZyA9IHtcbiAgJ2Fzc2lnbkluV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2Fzc2lnbldpdGgnOiBbMSwgMiwgMF0sXG4gICdkaWZmZXJlbmNlQnknOiBbMSwgMiwgMF0sXG4gICdkaWZmZXJlbmNlV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2dldE9yJzogWzIsIDEsIDBdLFxuICAnaW50ZXJzZWN0aW9uQnknOiBbMSwgMiwgMF0sXG4gICdpbnRlcnNlY3Rpb25XaXRoJzogWzEsIDIsIDBdLFxuICAnaXNFcXVhbFdpdGgnOiBbMSwgMiwgMF0sXG4gICdpc01hdGNoV2l0aCc6IFsyLCAxLCAwXSxcbiAgJ21lcmdlV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ3BhZENoYXJzJzogWzIsIDEsIDBdLFxuICAncGFkQ2hhcnNFbmQnOiBbMiwgMSwgMF0sXG4gICdwYWRDaGFyc1N0YXJ0JzogWzIsIDEsIDBdLFxuICAncHVsbEFsbEJ5JzogWzIsIDEsIDBdLFxuICAncHVsbEFsbFdpdGgnOiBbMiwgMSwgMF0sXG4gICdzZXRXaXRoJzogWzMsIDEsIDIsIDBdLFxuICAnc29ydGVkSW5kZXhCeSc6IFsyLCAxLCAwXSxcbiAgJ3NvcnRlZExhc3RJbmRleEJ5JzogWzIsIDEsIDBdLFxuICAndW5pb25CeSc6IFsxLCAyLCAwXSxcbiAgJ3VuaW9uV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ3VwZGF0ZVdpdGgnOiBbMywgMSwgMiwgMF0sXG4gICd4b3JCeSc6IFsxLCAyLCAwXSxcbiAgJ3hvcldpdGgnOiBbMSwgMiwgMF0sXG4gICd6aXBXaXRoJzogWzEsIDIsIDBdXG59O1xuXG4vKiogVXNlZCB0byBtYXAgbWV0aG9kIG5hbWVzIHRvIHNwcmVhZCBjb25maWdzLiAqL1xuZXhwb3J0cy5tZXRob2RTcHJlYWQgPSB7XG4gICdpbnZva2VBcmdzJzogMixcbiAgJ2ludm9rZUFyZ3NNYXAnOiAyLFxuICAncGFydGlhbCc6IDEsXG4gICdwYXJ0aWFsUmlnaHQnOiAxLFxuICAnd2l0aG91dCc6IDFcbn07XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IG1ldGhvZHMgd2hpY2ggbXV0YXRlIGFycmF5cyBvciBvYmplY3RzLiAqL1xuZXhwb3J0cy5tdXRhdGUgPSB7XG4gICdhcnJheSc6IHtcbiAgICAnZmlsbCc6IHRydWUsXG4gICAgJ3B1bGwnOiB0cnVlLFxuICAgICdwdWxsQWxsJzogdHJ1ZSxcbiAgICAncHVsbEFsbEJ5JzogdHJ1ZSxcbiAgICAncHVsbEFsbFdpdGgnOiB0cnVlLFxuICAgICdwdWxsQXQnOiB0cnVlLFxuICAgICdyZW1vdmUnOiB0cnVlLFxuICAgICdyZXZlcnNlJzogdHJ1ZVxuICB9LFxuICAnb2JqZWN0Jzoge1xuICAgICdhc3NpZ24nOiB0cnVlLFxuICAgICdhc3NpZ25Jbic6IHRydWUsXG4gICAgJ2Fzc2lnbkluV2l0aCc6IHRydWUsXG4gICAgJ2Fzc2lnbldpdGgnOiB0cnVlLFxuICAgICdkZWZhdWx0cyc6IHRydWUsXG4gICAgJ2RlZmF1bHRzRGVlcCc6IHRydWUsXG4gICAgJ21lcmdlJzogdHJ1ZSxcbiAgICAnbWVyZ2VXaXRoJzogdHJ1ZVxuICB9LFxuICAnc2V0Jzoge1xuICAgICdzZXQnOiB0cnVlLFxuICAgICdzZXRXaXRoJzogdHJ1ZSxcbiAgICAndW5zZXQnOiB0cnVlLFxuICAgICd1cGRhdGUnOiB0cnVlLFxuICAgICd1cGRhdGVXaXRoJzogdHJ1ZVxuICB9XG59O1xuXG4vKiogVXNlZCB0byB0cmFjayBtZXRob2RzIHdpdGggcGxhY2Vob2xkZXIgc3VwcG9ydCAqL1xuZXhwb3J0cy5wbGFjZWhvbGRlciA9IHtcbiAgJ2JpbmQnOiB0cnVlLFxuICAnYmluZEtleSc6IHRydWUsXG4gICdjdXJyeSc6IHRydWUsXG4gICdjdXJyeVJpZ2h0JzogdHJ1ZSxcbiAgJ3BhcnRpYWwnOiB0cnVlLFxuICAncGFydGlhbFJpZ2h0JzogdHJ1ZVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIHJlYWwgbmFtZXMgdG8gdGhlaXIgYWxpYXNlcy4gKi9cbmV4cG9ydHMucmVhbFRvQWxpYXMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICBvYmplY3QgPSBleHBvcnRzLmFsaWFzVG9SZWFsLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICByZXN1bHRbdmFsdWVdLnB1c2goa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W3ZhbHVlXSA9IFtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufSgpKTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBvdGhlciBuYW1lcy4gKi9cbmV4cG9ydHMucmVtYXAgPSB7XG4gICdjdXJyeU4nOiAnY3VycnknLFxuICAnY3VycnlSaWdodE4nOiAnY3VycnlSaWdodCcsXG4gICdmaW5kRnJvbSc6ICdmaW5kJyxcbiAgJ2ZpbmRJbmRleEZyb20nOiAnZmluZEluZGV4JyxcbiAgJ2ZpbmRMYXN0RnJvbSc6ICdmaW5kTGFzdCcsXG4gICdmaW5kTGFzdEluZGV4RnJvbSc6ICdmaW5kTGFzdEluZGV4JyxcbiAgJ2dldE9yJzogJ2dldCcsXG4gICdpbmNsdWRlc0Zyb20nOiAnaW5jbHVkZXMnLFxuICAnaW5kZXhPZkZyb20nOiAnaW5kZXhPZicsXG4gICdpbnZva2VBcmdzJzogJ2ludm9rZScsXG4gICdpbnZva2VBcmdzTWFwJzogJ2ludm9rZU1hcCcsXG4gICdsYXN0SW5kZXhPZkZyb20nOiAnbGFzdEluZGV4T2YnLFxuICAncGFkQ2hhcnMnOiAncGFkJyxcbiAgJ3BhZENoYXJzRW5kJzogJ3BhZEVuZCcsXG4gICdwYWRDaGFyc1N0YXJ0JzogJ3BhZFN0YXJ0JyxcbiAgJ3Jlc3RGcm9tJzogJ3Jlc3QnLFxuICAnc3ByZWFkRnJvbSc6ICdzcHJlYWQnLFxuICAndHJpbUNoYXJzJzogJ3RyaW0nLFxuICAndHJpbUNoYXJzRW5kJzogJ3RyaW1FbmQnLFxuICAndHJpbUNoYXJzU3RhcnQnOiAndHJpbVN0YXJ0J1xufTtcblxuLyoqIFVzZWQgdG8gdHJhY2sgbWV0aG9kcyB0aGF0IHNraXAgZml4aW5nIHRoZWlyIGFyaXR5LiAqL1xuZXhwb3J0cy5za2lwRml4ZWQgPSB7XG4gICdjYXN0QXJyYXknOiB0cnVlLFxuICAnZmxvdyc6IHRydWUsXG4gICdmbG93UmlnaHQnOiB0cnVlLFxuICAnaXRlcmF0ZWUnOiB0cnVlLFxuICAnbWl4aW4nOiB0cnVlLFxuICAncnVuSW5Db250ZXh0JzogdHJ1ZVxufTtcblxuLyoqIFVzZWQgdG8gdHJhY2sgbWV0aG9kcyB0aGF0IHNraXAgcmVhcnJhbmdpbmcgYXJndW1lbnRzLiAqL1xuZXhwb3J0cy5za2lwUmVhcmcgPSB7XG4gICdhZGQnOiB0cnVlLFxuICAnYXNzaWduJzogdHJ1ZSxcbiAgJ2Fzc2lnbkluJzogdHJ1ZSxcbiAgJ2JpbmQnOiB0cnVlLFxuICAnYmluZEtleSc6IHRydWUsXG4gICdjb25jYXQnOiB0cnVlLFxuICAnZGlmZmVyZW5jZSc6IHRydWUsXG4gICdkaXZpZGUnOiB0cnVlLFxuICAnZXEnOiB0cnVlLFxuICAnZ3QnOiB0cnVlLFxuICAnZ3RlJzogdHJ1ZSxcbiAgJ2lzRXF1YWwnOiB0cnVlLFxuICAnbHQnOiB0cnVlLFxuICAnbHRlJzogdHJ1ZSxcbiAgJ21hdGNoZXNQcm9wZXJ0eSc6IHRydWUsXG4gICdtZXJnZSc6IHRydWUsXG4gICdtdWx0aXBseSc6IHRydWUsXG4gICdvdmVyQXJncyc6IHRydWUsXG4gICdwYXJ0aWFsJzogdHJ1ZSxcbiAgJ3BhcnRpYWxSaWdodCc6IHRydWUsXG4gICdyYW5kb20nOiB0cnVlLFxuICAncmFuZ2UnOiB0cnVlLFxuICAncmFuZ2VSaWdodCc6IHRydWUsXG4gICdzdWJ0cmFjdCc6IHRydWUsXG4gICd6aXAnOiB0cnVlLFxuICAnemlwT2JqZWN0JzogdHJ1ZVxufTtcbiJdfQ==