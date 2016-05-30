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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL19tYXBwaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLFFBQVEsV0FBUixHQUFzQjs7O0FBR3BCLFVBQVEsU0FBUjtBQUNBLGVBQWEsY0FBYjtBQUNBLGFBQVcsU0FBWDtBQUNBLGVBQWEsV0FBYjtBQUNBLFlBQVUsVUFBVjtBQUNBLGdCQUFjLGNBQWQ7QUFDQSxXQUFTLE1BQVQ7OztBQUdBLFFBQU0sYUFBTjtBQUNBLFNBQU8sT0FBUDtBQUNBLGFBQVcsV0FBWDtBQUNBLFlBQVUsVUFBVjtBQUNBLFNBQU8sTUFBUDtBQUNBLGFBQVcsVUFBWDtBQUNBLFdBQVMsUUFBVDtBQUNBLFdBQVMsS0FBVDtBQUNBLGVBQWEsS0FBYjtBQUNBLGdCQUFjLFFBQWQ7QUFDQSxhQUFXLFdBQVg7QUFDQSxjQUFZLFVBQVo7QUFDQSxZQUFVLE9BQVY7QUFDQSxnQkFBYyxPQUFkO0FBQ0EsWUFBVSxTQUFWO0FBQ0EsZUFBYSxJQUFiO0FBQ0EsVUFBUSxTQUFSO0FBQ0EsZUFBYSxRQUFiO0FBQ0EsVUFBUSxNQUFSO0FBQ0EsYUFBVyxNQUFYO0FBQ0EsVUFBUSxLQUFSO0FBQ0EsVUFBUSxLQUFSO0FBQ0EsWUFBVSxpQkFBVjtBQUNBLFlBQVUsT0FBVjtBQUNBLFdBQVMsSUFBVDtBQUNBLGFBQVcsTUFBWDtBQUNBLFVBQVEsTUFBUjtBQUNBLFdBQVMsS0FBVDtBQUNBLFVBQVEsS0FBUjtBQUNBLFlBQVUsaUJBQVY7QUFDQSxZQUFVLE9BQVY7QUFDQSxXQUFTLElBQVQ7QUFDQSxhQUFXLE1BQVg7QUFDQSxZQUFVLFNBQVY7QUFDQSxhQUFXLFVBQVg7QUFDQSxhQUFXLFFBQVg7QUFDQSxZQUFVLFdBQVY7Q0FoREY7OztBQW9EQSxRQUFRLFNBQVIsR0FBb0I7QUFDbEIsT0FBSyxDQUNILFNBREcsRUFDUSxXQURSLEVBQ3FCLE1BRHJCLEVBQzZCLFFBRDdCLEVBQ3VDLE9BRHZDLEVBQ2dELFlBRGhELEVB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Y0FBWSxJQUFaO0FBQ0EsU0FBTyxJQUFQO0FBQ0EsZUFBYSxJQUFiO0NBMUJGIiwiZmlsZSI6Il9tYXBwaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFVzZWQgdG8gbWFwIGFsaWFzZXMgdG8gdGhlaXIgcmVhbCBuYW1lcy4gKi9cbmV4cG9ydHMuYWxpYXNUb1JlYWwgPSB7XG5cbiAgLy8gTG9kYXNoIGFsaWFzZXMuXG4gICdlYWNoJzogJ2ZvckVhY2gnLFxuICAnZWFjaFJpZ2h0JzogJ2ZvckVhY2hSaWdodCcsXG4gICdlbnRyaWVzJzogJ3RvUGFpcnMnLFxuICAnZW50cmllc0luJzogJ3RvUGFpcnNJbicsXG4gICdleHRlbmQnOiAnYXNzaWduSW4nLFxuICAnZXh0ZW5kV2l0aCc6ICdhc3NpZ25JbldpdGgnLFxuICAnZmlyc3QnOiAnaGVhZCcsXG5cbiAgLy8gUmFtZGEgYWxpYXNlcy5cbiAgJ19fJzogJ3BsYWNlaG9sZGVyJyxcbiAgJ2FsbCc6ICdldmVyeScsXG4gICdhbGxQYXNzJzogJ292ZXJFdmVyeScsXG4gICdhbHdheXMnOiAnY29uc3RhbnQnLFxuICAnYW55JzogJ3NvbWUnLFxuICAnYW55UGFzcyc6ICdvdmVyU29tZScsXG4gICdhcHBseSc6ICdzcHJlYWQnLFxuICAnYXNzb2MnOiAnc2V0JyxcbiAgJ2Fzc29jUGF0aCc6ICdzZXQnLFxuICAnY29tcGxlbWVudCc6ICduZWdhdGUnLFxuICAnY29tcG9zZSc6ICdmbG93UmlnaHQnLFxuICAnY29udGFpbnMnOiAnaW5jbHVkZXMnLFxuICAnZGlzc29jJzogJ3Vuc2V0JyxcbiAgJ2Rpc3NvY1BhdGgnOiAndW5zZXQnLFxuICAnZXF1YWxzJzogJ2lzRXF1YWwnLFxuICAnaWRlbnRpY2FsJzogJ2VxJyxcbiAgJ2luaXQnOiAnaW5pdGlhbCcsXG4gICdpbnZlcnRPYmonOiAnaW52ZXJ0JyxcbiAgJ2p1eHQnOiAnb3ZlcicsXG4gICdvbWl0QWxsJzogJ29taXQnLFxuICAnbkFyeSc6ICdhcnknLFxuICAncGF0aCc6ICdnZXQnLFxuICAncGF0aEVxJzogJ21hdGNoZXNQcm9wZXJ0eScsXG4gICdwYXRoT3InOiAnZ2V0T3InLFxuICAncGF0aHMnOiAnYXQnLFxuICAncGlja0FsbCc6ICdwaWNrJyxcbiAgJ3BpcGUnOiAnZmxvdycsXG4gICdwbHVjayc6ICdtYXAnLFxuICAncHJvcCc6ICdnZXQnLFxuICAncHJvcEVxJzogJ21hdGNoZXNQcm9wZXJ0eScsXG4gICdwcm9wT3InOiAnZ2V0T3InLFxuICAncHJvcHMnOiAnYXQnLFxuICAndW5hcHBseSc6ICdyZXN0JyxcbiAgJ3VubmVzdCc6ICdmbGF0dGVuJyxcbiAgJ3VzZVdpdGgnOiAnb3ZlckFyZ3MnLFxuICAnd2hlcmVFcSc6ICdmaWx0ZXInLFxuICAnemlwT2JqJzogJ3ppcE9iamVjdCdcbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBhcnkgdG8gbWV0aG9kIG5hbWVzLiAqL1xuZXhwb3J0cy5hcnlNZXRob2QgPSB7XG4gICcxJzogW1xuICAgICdhdHRlbXB0JywgJ2Nhc3RBcnJheScsICdjZWlsJywgJ2NyZWF0ZScsICdjdXJyeScsICdjdXJyeVJpZ2h0JywgJ2Zsb29yJyxcbiAgICAnZmxvdycsICdmbG93UmlnaHQnLCAnZnJvbVBhaXJzJywgJ2ludmVydCcsICdpdGVyYXRlZScsICdtZW1vaXplJywgJ21ldGhvZCcsXG4gICAgJ21ldGhvZE9mJywgJ21peGluJywgJ292ZXInLCAnb3ZlckV2ZXJ5JywgJ292ZXJTb21lJywgJ3Jlc3QnLCAncmV2ZXJzZScsXG4gICAgJ3JvdW5kJywgJ3J1bkluQ29udGV4dCcsICdzcHJlYWQnLCAndGVtcGxhdGUnLCAndHJpbScsICd0cmltRW5kJywgJ3RyaW1TdGFydCcsXG4gICAgJ3VuaXF1ZUlkJywgJ3dvcmRzJ1xuICBdLFxuICAnMic6IFtcbiAgICAnYWRkJywgJ2FmdGVyJywgJ2FyeScsICdhc3NpZ24nLCAnYXNzaWduSW4nLCAnYXQnLCAnYmVmb3JlJywgJ2JpbmQnLCAnYmluZEFsbCcsXG4gICAgJ2JpbmRLZXknLCAnY2h1bmsnLCAnY2xvbmVEZWVwV2l0aCcsICdjbG9uZVdpdGgnLCAnY29uY2F0JywgJ2NvdW50QnknLCAnY3VycnlOJyxcbiAgICAnY3VycnlSaWdodE4nLCAnZGVib3VuY2UnLCAnZGVmYXVsdHMnLCAnZGVmYXVsdHNEZWVwJywgJ2RlbGF5JywgJ2RpZmZlcmVuY2UnLFxuICAgICdkaXZpZGUnLCAnZHJvcCcsICdkcm9wUmlnaHQnLCAnZHJvcFJpZ2h0V2hpbGUnLCAnZHJvcFdoaWxlJywgJ2VuZHNXaXRoJyxcbiAgICAnZXEnLCAnZXZlcnknLCAnZmlsdGVyJywgJ2ZpbmQnLCAnZmluZEluZGV4JywgJ2ZpbmRLZXknLCAnZmluZExhc3QnLFxuICAgICdmaW5kTGFzdEluZGV4JywgJ2ZpbmRMYXN0S2V5JywgJ2ZsYXRNYXAnLCAnZmxhdE1hcERlZXAnLCAnZmxhdHRlbkRlcHRoJyxcbiAgICAnZm9yRWFjaCcsICdmb3JFYWNoUmlnaHQnLCAnZm9ySW4nLCAnZm9ySW5SaWdodCcsICdmb3JPd24nLCAnZm9yT3duUmlnaHQnLFxuICAgICdnZXQnLCAnZ3JvdXBCeScsICdndCcsICdndGUnLCAnaGFzJywgJ2hhc0luJywgJ2luY2x1ZGVzJywgJ2luZGV4T2YnLFxuICAgICdpbnRlcnNlY3Rpb24nLCAnaW52ZXJ0QnknLCAnaW52b2tlJywgJ2ludm9rZU1hcCcsICdpc0VxdWFsJywgJ2lzTWF0Y2gnLFxuICAgICdqb2luJywgJ2tleUJ5JywgJ2xhc3RJbmRleE9mJywgJ2x0JywgJ2x0ZScsICdtYXAnLCAnbWFwS2V5cycsICdtYXBWYWx1ZXMnLFxuICAgICdtYXRjaGVzUHJvcGVydHknLCAnbWF4QnknLCAnbWVhbkJ5JywgJ21lcmdlJywgJ21pbkJ5JywgJ211bHRpcGx5JywgJ250aCcsXG4gICAgJ29taXQnLCAnb21pdEJ5JywgJ292ZXJBcmdzJywgJ3BhZCcsICdwYWRFbmQnLCAncGFkU3RhcnQnLCAncGFyc2VJbnQnLFxuICAgICdwYXJ0aWFsJywgJ3BhcnRpYWxSaWdodCcsICdwYXJ0aXRpb24nLCAncGljaycsICdwaWNrQnknLCAncHVsbCcsICdwdWxsQWxsJyxcbiAgICAncHVsbEF0JywgJ3JhbmRvbScsICdyYW5nZScsICdyYW5nZVJpZ2h0JywgJ3JlYXJnJywgJ3JlamVjdCcsICdyZW1vdmUnLFxuICAgICdyZXBlYXQnLCAncmVzdEZyb20nLCAncmVzdWx0JywgJ3NhbXBsZVNpemUnLCAnc29tZScsICdzb3J0QnknLCAnc29ydGVkSW5kZXgnLFxuICAgICdzb3J0ZWRJbmRleE9mJywgJ3NvcnRlZExhc3RJbmRleCcsICdzb3J0ZWRMYXN0SW5kZXhPZicsICdzb3J0ZWRVbmlxQnknLFxuICAgICdzcGxpdCcsICdzcHJlYWRGcm9tJywgJ3N0YXJ0c1dpdGgnLCAnc3VidHJhY3QnLCAnc3VtQnknLCAndGFrZScsICd0YWtlUmlnaHQnLFxuICAgICd0YWtlUmlnaHRXaGlsZScsICd0YWtlV2hpbGUnLCAndGFwJywgJ3Rocm90dGxlJywgJ3RocnUnLCAndGltZXMnLCAndHJpbUNoYXJzJyxcbiAgICAndHJpbUNoYXJzRW5kJywgJ3RyaW1DaGFyc1N0YXJ0JywgJ3RydW5jYXRlJywgJ3VuaW9uJywgJ3VuaXFCeScsICd1bmlxV2l0aCcsXG4gICAgJ3Vuc2V0JywgJ3VuemlwV2l0aCcsICd3aXRob3V0JywgJ3dyYXAnLCAneG9yJywgJ3ppcCcsICd6aXBPYmplY3QnLFxuICAgICd6aXBPYmplY3REZWVwJ1xuICBdLFxuICAnMyc6IFtcbiAgICAnYXNzaWduSW5XaXRoJywgJ2Fzc2lnbldpdGgnLCAnY2xhbXAnLCAnZGlmZmVyZW5jZUJ5JywgJ2RpZmZlcmVuY2VXaXRoJyxcbiAgICAnZmluZEZyb20nLCAnZmluZEluZGV4RnJvbScsICdmaW5kTGFzdEZyb20nLCAnZmluZExhc3RJbmRleEZyb20nLCAnZ2V0T3InLFxuICAgICdpbmNsdWRlc0Zyb20nLCAnaW5kZXhPZkZyb20nLCAnaW5SYW5nZScsICdpbnRlcnNlY3Rpb25CeScsICdpbnRlcnNlY3Rpb25XaXRoJyxcbiAgICAnaW52b2tlQXJncycsICdpbnZva2VBcmdzTWFwJywgJ2lzRXF1YWxXaXRoJywgJ2lzTWF0Y2hXaXRoJywgJ2ZsYXRNYXBEZXB0aCcsXG4gICAgJ2xhc3RJbmRleE9mRnJvbScsICdtZXJnZVdpdGgnLCAnb3JkZXJCeScsICdwYWRDaGFycycsICdwYWRDaGFyc0VuZCcsXG4gICAgJ3BhZENoYXJzU3RhcnQnLCAncHVsbEFsbEJ5JywgJ3B1bGxBbGxXaXRoJywgJ3JlZHVjZScsICdyZWR1Y2VSaWdodCcsICdyZXBsYWNlJyxcbiAgICAnc2V0JywgJ3NsaWNlJywgJ3NvcnRlZEluZGV4QnknLCAnc29ydGVkTGFzdEluZGV4QnknLCAndHJhbnNmb3JtJywgJ3VuaW9uQnknLFxuICAgICd1bmlvbldpdGgnLCAndXBkYXRlJywgJ3hvckJ5JywgJ3hvcldpdGgnLCAnemlwV2l0aCdcbiAgXSxcbiAgJzQnOiBbXG4gICAgJ2ZpbGwnLCAnc2V0V2l0aCcsICd1cGRhdGVXaXRoJ1xuICBdXG59O1xuXG4vKiogVXNlZCB0byBtYXAgYXJ5IHRvIHJlYXJnIGNvbmZpZ3MuICovXG5leHBvcnRzLmFyeVJlYXJnID0ge1xuICAnMic6IFsxLCAwXSxcbiAgJzMnOiBbMiwgMCwgMV0sXG4gICc0JzogWzMsIDIsIDAsIDFdXG59O1xuXG4vKiogVXNlZCB0byBtYXAgbWV0aG9kIG5hbWVzIHRvIHRoZWlyIGl0ZXJhdGVlIGFyeS4gKi9cbmV4cG9ydHMuaXRlcmF0ZWVBcnkgPSB7XG4gICdkcm9wUmlnaHRXaGlsZSc6IDEsXG4gICdkcm9wV2hpbGUnOiAxLFxuICAnZXZlcnknOiAxLFxuICAnZmlsdGVyJzogMSxcbiAgJ2ZpbmQnOiAxLFxuICAnZmluZEZyb20nOiAxLFxuICAnZmluZEluZGV4JzogMSxcbiAgJ2ZpbmRJbmRleEZyb20nOiAxLFxuICAnZmluZEtleSc6IDEsXG4gICdmaW5kTGFzdCc6IDEsXG4gICdmaW5kTGFzdEZyb20nOiAxLFxuICAnZmluZExhc3RJbmRleCc6IDEsXG4gICdmaW5kTGFzdEluZGV4RnJvbSc6IDEsXG4gICdmaW5kTGFzdEtleSc6IDEsXG4gICdmbGF0TWFwJzogMSxcbiAgJ2ZsYXRNYXBEZWVwJzogMSxcbiAgJ2ZsYXRNYXBEZXB0aCc6IDEsXG4gICdmb3JFYWNoJzogMSxcbiAgJ2ZvckVhY2hSaWdodCc6IDEsXG4gICdmb3JJbic6IDEsXG4gICdmb3JJblJpZ2h0JzogMSxcbiAgJ2Zvck93bic6IDEsXG4gICdmb3JPd25SaWdodCc6IDEsXG4gICdtYXAnOiAxLFxuICAnbWFwS2V5cyc6IDEsXG4gICdtYXBWYWx1ZXMnOiAxLFxuICAncGFydGl0aW9uJzogMSxcbiAgJ3JlZHVjZSc6IDIsXG4gICdyZWR1Y2VSaWdodCc6IDIsXG4gICdyZWplY3QnOiAxLFxuICAncmVtb3ZlJzogMSxcbiAgJ3NvbWUnOiAxLFxuICAndGFrZVJpZ2h0V2hpbGUnOiAxLFxuICAndGFrZVdoaWxlJzogMSxcbiAgJ3RpbWVzJzogMSxcbiAgJ3RyYW5zZm9ybSc6IDJcbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gaXRlcmF0ZWUgcmVhcmcgY29uZmlncy4gKi9cbmV4cG9ydHMuaXRlcmF0ZWVSZWFyZyA9IHtcbiAgJ21hcEtleXMnOiBbMV1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gcmVhcmcgY29uZmlncy4gKi9cbmV4cG9ydHMubWV0aG9kUmVhcmcgPSB7XG4gICdhc3NpZ25JbldpdGgnOiBbMSwgMiwgMF0sXG4gICdhc3NpZ25XaXRoJzogWzEsIDIsIDBdLFxuICAnZGlmZmVyZW5jZUJ5JzogWzEsIDIsIDBdLFxuICAnZGlmZmVyZW5jZVdpdGgnOiBbMSwgMiwgMF0sXG4gICdnZXRPcic6IFsyLCAxLCAwXSxcbiAgJ2ludGVyc2VjdGlvbkJ5JzogWzEsIDIsIDBdLFxuICAnaW50ZXJzZWN0aW9uV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2lzRXF1YWxXaXRoJzogWzEsIDIsIDBdLFxuICAnaXNNYXRjaFdpdGgnOiBbMiwgMSwgMF0sXG4gICdtZXJnZVdpdGgnOiBbMSwgMiwgMF0sXG4gICdwYWRDaGFycyc6IFsyLCAxLCAwXSxcbiAgJ3BhZENoYXJzRW5kJzogWzIsIDEsIDBdLFxuICAncGFkQ2hhcnNTdGFydCc6IFsyLCAxLCAwXSxcbiAgJ3B1bGxBbGxCeSc6IFsyLCAxLCAwXSxcbiAgJ3B1bGxBbGxXaXRoJzogWzIsIDEsIDBdLFxuICAnc2V0V2l0aCc6IFszLCAxLCAyLCAwXSxcbiAgJ3NvcnRlZEluZGV4QnknOiBbMiwgMSwgMF0sXG4gICdzb3J0ZWRMYXN0SW5kZXhCeSc6IFsyLCAxLCAwXSxcbiAgJ3VuaW9uQnknOiBbMSwgMiwgMF0sXG4gICd1bmlvbldpdGgnOiBbMSwgMiwgMF0sXG4gICd1cGRhdGVXaXRoJzogWzMsIDEsIDIsIDBdLFxuICAneG9yQnknOiBbMSwgMiwgMF0sXG4gICd4b3JXaXRoJzogWzEsIDIsIDBdLFxuICAnemlwV2l0aCc6IFsxLCAyLCAwXVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBzcHJlYWQgY29uZmlncy4gKi9cbmV4cG9ydHMubWV0aG9kU3ByZWFkID0ge1xuICAnaW52b2tlQXJncyc6IDIsXG4gICdpbnZva2VBcmdzTWFwJzogMixcbiAgJ3BhcnRpYWwnOiAxLFxuICAncGFydGlhbFJpZ2h0JzogMSxcbiAgJ3dpdGhvdXQnOiAxXG59O1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBtZXRob2RzIHdoaWNoIG11dGF0ZSBhcnJheXMgb3Igb2JqZWN0cy4gKi9cbmV4cG9ydHMubXV0YXRlID0ge1xuICAnYXJyYXknOiB7XG4gICAgJ2ZpbGwnOiB0cnVlLFxuICAgICdwdWxsJzogdHJ1ZSxcbiAgICAncHVsbEFsbCc6IHRydWUsXG4gICAgJ3B1bGxBbGxCeSc6IHRydWUsXG4gICAgJ3B1bGxBbGxXaXRoJzogdHJ1ZSxcbiAgICAncHVsbEF0JzogdHJ1ZSxcbiAgICAncmVtb3ZlJzogdHJ1ZSxcbiAgICAncmV2ZXJzZSc6IHRydWVcbiAgfSxcbiAgJ29iamVjdCc6IHtcbiAgICAnYXNzaWduJzogdHJ1ZSxcbiAgICAnYXNzaWduSW4nOiB0cnVlLFxuICAgICdhc3NpZ25JbldpdGgnOiB0cnVlLFxuICAgICdhc3NpZ25XaXRoJzogdHJ1ZSxcbiAgICAnZGVmYXVsdHMnOiB0cnVlLFxuICAgICdkZWZhdWx0c0RlZXAnOiB0cnVlLFxuICAgICdtZXJnZSc6IHRydWUsXG4gICAgJ21lcmdlV2l0aCc6IHRydWVcbiAgfSxcbiAgJ3NldCc6IHtcbiAgICAnc2V0JzogdHJ1ZSxcbiAgICAnc2V0V2l0aCc6IHRydWUsXG4gICAgJ3Vuc2V0JzogdHJ1ZSxcbiAgICAndXBkYXRlJzogdHJ1ZSxcbiAgICAndXBkYXRlV2l0aCc6IHRydWVcbiAgfVxufTtcblxuLyoqIFVzZWQgdG8gdHJhY2sgbWV0aG9kcyB3aXRoIHBsYWNlaG9sZGVyIHN1cHBvcnQgKi9cbmV4cG9ydHMucGxhY2Vob2xkZXIgPSB7XG4gICdiaW5kJzogdHJ1ZSxcbiAgJ2JpbmRLZXknOiB0cnVlLFxuICAnY3VycnknOiB0cnVlLFxuICAnY3VycnlSaWdodCc6IHRydWUsXG4gICdwYXJ0aWFsJzogdHJ1ZSxcbiAgJ3BhcnRpYWxSaWdodCc6IHRydWVcbn07XG5cbi8qKiBVc2VkIHRvIG1hcCByZWFsIG5hbWVzIHRvIHRoZWlyIGFsaWFzZXMuICovXG5leHBvcnRzLnJlYWxUb0FsaWFzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgb2JqZWN0ID0gZXhwb3J0cy5hbGlhc1RvUmVhbCxcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgcmVzdWx0W3ZhbHVlXS5wdXNoKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFt2YWx1ZV0gPSBba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn0oKSk7XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gb3RoZXIgbmFtZXMuICovXG5leHBvcnRzLnJlbWFwID0ge1xuICAnY3VycnlOJzogJ2N1cnJ5JyxcbiAgJ2N1cnJ5UmlnaHROJzogJ2N1cnJ5UmlnaHQnLFxuICAnZmluZEZyb20nOiAnZmluZCcsXG4gICdmaW5kSW5kZXhGcm9tJzogJ2ZpbmRJbmRleCcsXG4gICdmaW5kTGFzdEZyb20nOiAnZmluZExhc3QnLFxuICAnZmluZExhc3RJbmRleEZyb20nOiAnZmluZExhc3RJbmRleCcsXG4gICdnZXRPcic6ICdnZXQnLFxuICAnaW5jbHVkZXNGcm9tJzogJ2luY2x1ZGVzJyxcbiAgJ2luZGV4T2ZGcm9tJzogJ2luZGV4T2YnLFxuICAnaW52b2tlQXJncyc6ICdpbnZva2UnLFxuICAnaW52b2tlQXJnc01hcCc6ICdpbnZva2VNYXAnLFxuICAnbGFzdEluZGV4T2ZGcm9tJzogJ2xhc3RJbmRleE9mJyxcbiAgJ3BhZENoYXJzJzogJ3BhZCcsXG4gICdwYWRDaGFyc0VuZCc6ICdwYWRFbmQnLFxuICAncGFkQ2hhcnNTdGFydCc6ICdwYWRTdGFydCcsXG4gICdyZXN0RnJvbSc6ICdyZXN0JyxcbiAgJ3NwcmVhZEZyb20nOiAnc3ByZWFkJyxcbiAgJ3RyaW1DaGFycyc6ICd0cmltJyxcbiAgJ3RyaW1DaGFyc0VuZCc6ICd0cmltRW5kJyxcbiAgJ3RyaW1DaGFyc1N0YXJ0JzogJ3RyaW1TdGFydCdcbn07XG5cbi8qKiBVc2VkIHRvIHRyYWNrIG1ldGhvZHMgdGhhdCBza2lwIGZpeGluZyB0aGVpciBhcml0eS4gKi9cbmV4cG9ydHMuc2tpcEZpeGVkID0ge1xuICAnY2FzdEFycmF5JzogdHJ1ZSxcbiAgJ2Zsb3cnOiB0cnVlLFxuICAnZmxvd1JpZ2h0JzogdHJ1ZSxcbiAgJ2l0ZXJhdGVlJzogdHJ1ZSxcbiAgJ21peGluJzogdHJ1ZSxcbiAgJ3J1bkluQ29udGV4dCc6IHRydWVcbn07XG5cbi8qKiBVc2VkIHRvIHRyYWNrIG1ldGhvZHMgdGhhdCBza2lwIHJlYXJyYW5naW5nIGFyZ3VtZW50cy4gKi9cbmV4cG9ydHMuc2tpcFJlYXJnID0ge1xuICAnYWRkJzogdHJ1ZSxcbiAgJ2Fzc2lnbic6IHRydWUsXG4gICdhc3NpZ25Jbic6IHRydWUsXG4gICdiaW5kJzogdHJ1ZSxcbiAgJ2JpbmRLZXknOiB0cnVlLFxuICAnY29uY2F0JzogdHJ1ZSxcbiAgJ2RpZmZlcmVuY2UnOiB0cnVlLFxuICAnZGl2aWRlJzogdHJ1ZSxcbiAgJ2VxJzogdHJ1ZSxcbiAgJ2d0JzogdHJ1ZSxcbiAgJ2d0ZSc6IHRydWUsXG4gICdpc0VxdWFsJzogdHJ1ZSxcbiAgJ2x0JzogdHJ1ZSxcbiAgJ2x0ZSc6IHRydWUsXG4gICdtYXRjaGVzUHJvcGVydHknOiB0cnVlLFxuICAnbWVyZ2UnOiB0cnVlLFxuICAnbXVsdGlwbHknOiB0cnVlLFxuICAnb3ZlckFyZ3MnOiB0cnVlLFxuICAncGFydGlhbCc6IHRydWUsXG4gICdwYXJ0aWFsUmlnaHQnOiB0cnVlLFxuICAncmFuZG9tJzogdHJ1ZSxcbiAgJ3JhbmdlJzogdHJ1ZSxcbiAgJ3JhbmdlUmlnaHQnOiB0cnVlLFxuICAnc3VidHJhY3QnOiB0cnVlLFxuICAnemlwJzogdHJ1ZSxcbiAgJ3ppcE9iamVjdCc6IHRydWVcbn07XG4iXX0=