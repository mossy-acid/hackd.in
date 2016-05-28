/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule OrderedMap
 */

'use strict';

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');

var PREFIX = 'key:';

/**
 * Utility to extract a backing object from an initialization `Array`, allowing
 * the caller to assist in resolving the unique ID for each entry via the
 * `keyExtractor` callback. The `keyExtractor` must extract non-empty strings or
 * numbers.
 * @param {Array<Object!>} arr Array of items.
 * @param {function} keyExtractor Extracts a unique key from each item.
 * @return {Object} Map from unique key to originating value that the key was
 * extracted from.
 * @throws Exception if the initialization array has duplicate extracted keys.
 */
function extractObjectFromArray(arr, keyExtractor) {
  var normalizedObj = {};
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    var key = keyExtractor(item);
    assertValidPublicKey(key);
    var normalizedKey = PREFIX + key;
    !!(normalizedKey in normalizedObj) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap: IDs returned by the key extraction function must be unique.') : invariant(false) : undefined;
    normalizedObj[normalizedKey] = item;
  }
  return normalizedObj;
}

/**
 * Utility class for mappings with ordering. This class is to be used in an
 * immutable manner. A `OrderedMap` is very much like the native JavaScript
 * object, where keys map to values via the `get()` function. Also, like the
 * native JavaScript object, there is an ordering associated with the mapping.
 * This class is helpful because it eliminates many of the pitfalls that come
 * with the native JavaScript ordered mappings. Specifically, there are
 * inconsistencies with numeric keys in some JavaScript implementations
 * (enumeration ordering). This class protects against those pitfalls and
 * provides functional utilities for dealing with these `OrderedMap`s.
 *
 * - TODO:
 * - orderedMergeExclusive: Merges mutually exclusive `OrderedMap`s.
 * - mapReverse().
 *
 * @class {OrderedMap}
 * @constructor {OrderedMap}
 * @param {Object} normalizedObj Object that is known to be a defensive copy of
 * caller supplied data. We require a defensive copy to guard against callers
 * mutating.  It is also assumed that the keys of `normalizedObj` have been
 * normalized and do not contain any numeric-appearing strings.
 * @param {number} computedLength The precomputed length of `_normalizedObj`
 * keys.
 * @private
 */
function OrderedMapImpl(normalizedObj, computedLength) {
  this._normalizedObj = normalizedObj;
  this._computedPositions = null;
  this.length = computedLength;
}

/**
 * Validates a "public" key - that is, one that the public facing API supplies.
 * The key is then normalized for internal storage. In order to be considered
 * valid, all keys must be non-empty, defined, non-null strings or numbers.
 *
 * @param {string?} key Validates that the key is suitable for use in a
 * `OrderedMap`.
 * @throws Error if key is not appropriate for use in `OrderedMap`.
 */
function assertValidPublicKey(key) {
  !(key !== '' && (typeof key === 'string' || typeof key === 'number')) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap: Key must be non-empty, non-null string or number.') : invariant(false) : undefined;
}

/**
 * Validates that arguments to range operations are within the correct limits.
 *
 * @param {number} start Start of range.
 * @param {number} length Length of range.
 * @param {number} actualLen Actual length of range that should not be
 * exceeded.
 * @throws Error if range arguments are out of bounds.
 */
function assertValidRangeIndices(start, length, actualLen) {
  !(typeof start === 'number' && typeof length === 'number' && length >= 0 && start >= 0 && start + length <= actualLen) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap: `mapRange` and `forEachRange` expect non-negative start and ' + 'length arguments within the bounds of the instance.') : invariant(false) : undefined;
}

/**
 * Merges two "normalized" objects (objects who's key have been normalized) into
 * a `OrderedMap`.
 *
 * @param {Object} a Object of key value pairs.
 * @param {Object} b Object of key value pairs.
 * @return {OrderedMap} new `OrderedMap` that results in merging `a` and `b`.
 */
function _fromNormalizedObjects(a, b) {
  // Second optional, both must be plain JavaScript objects.
  !(a && a.constructor === Object && (!b || b.constructor === Object)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap: Corrupted instance of OrderedMap detected.') : invariant(false) : undefined;

  var newSet = {};
  var length = 0;
  var key;
  for (key in a) {
    if (a.hasOwnProperty(key)) {
      newSet[key] = a[key];
      length++;
    }
  }

  for (key in b) {
    if (b.hasOwnProperty(key)) {
      // Increment length if not already added via first object (a)
      if (!(key in newSet)) {
        length++;
      }
      newSet[key] = b[key];
    }
  }
  return new OrderedMapImpl(newSet, length);
}

/**
 * Methods for `OrderedMap` instances.
 *
 * @lends OrderedMap.prototype
 * TODO: Make this data structure lazy, unify with LazyArray.
 * TODO: Unify this with ImmutableObject - it is to be used immutably.
 * TODO: If so, consider providing `fromObject` API.
 * TODO: Create faster implementation of merging/mapping from original Array,
 * without having to first create an object - simply for the sake of merging.
 */
var OrderedMapMethods = {

  /**
   * Returns whether or not a given key is present in the map.
   *
   * @param {string} key Valid string key to lookup membership for.
   * @return {boolean} Whether or not `key` is a member of the map.
   * @throws Error if provided known invalid key.
   */
  has: function has(key) {
    assertValidPublicKey(key);
    var normalizedKey = PREFIX + key;
    return normalizedKey in this._normalizedObj;
  },

  /**
   * Returns the object for a given key, or `undefined` if not present. To
   * distinguish an undefined entry vs not being in the set, use `has()`.
   *
   * @param {string} key String key to lookup the value for.
   * @return {Object?} Object at key `key`, or undefined if not in map.
   * @throws Error if provided known invalid key.
   */
  get: function get(key) {
    assertValidPublicKey(key);
    var normalizedKey = PREFIX + key;
    return this.has(key) ? this._normalizedObj[normalizedKey] : undefined;
  },

  /**
   * Merges, appending new keys to the end of the ordering. Keys in `orderedMap`
   * that are redundant with `this`, maintain the same ordering index that they
   * had in `this`.  This is how standard JavaScript object merging would work.
   * If you wish to prepend a `OrderedMap` to the beginning of another
   * `OrderedMap` then simply reverse the order of operation. This is the analog
   * to `merge(x, y)`.
   *
   * @param {OrderedMap} orderedMap OrderedMap to merge onto the end.
   * @return {OrderedMap} New OrderedMap that represents the result of the
   * merge.
   */
  merge: function merge(orderedMap) {
    !(orderedMap instanceof OrderedMapImpl) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.merge(...): Expected an OrderedMap instance.') : invariant(false) : undefined;
    return _fromNormalizedObjects(this._normalizedObj, orderedMap._normalizedObj);
  },

  /**
   * Functional map API. Returns a new `OrderedMap`.
   *
   * @param {Function} cb Callback to invoke for each item.
   * @param {Object?=} context Context to invoke callback from.
   * @return {OrderedMap} OrderedMap that results from mapping.
   */
  map: function map(cb, context) {
    return this.mapRange(cb, 0, this.length, context);
  },

  /**
   * The callback `cb` is invoked with the arguments (item, key,
   * indexInOriginal).
   *
   * @param {Function} cb Determines result for each item.
   * @param {number} start Start index of map range.
   * @param {end} length End index of map range.
   * @param {*!?} context Context of callback invocation.
   * @return {OrderedMap} OrderedMap resulting from mapping the range.
   */
  mapRange: function mapRange(cb, start, length, context) {
    var thisSet = this._normalizedObj;
    var newSet = {};
    var i = 0;
    assertValidRangeIndices(start, length, this.length);
    var end = start + length - 1;
    for (var key in thisSet) {
      if (thisSet.hasOwnProperty(key)) {
        if (i >= start) {
          if (i > end) {
            break;
          }
          var item = thisSet[key];
          newSet[key] = cb.call(context, item, key.substr(PREFIX.length), i);
        }
        i++;
      }
    }
    return new OrderedMapImpl(newSet, length);
  },

  /**
   * Function filter API. Returns new `OrderedMap`.
   *
   * @param {Function} cb Callback to invoke for each item.
   * @param {Object?=} context Context to invoke callback from.
   * @return {OrderedMap} OrderedMap that results from filtering.
   */
  filter: function filter(cb, context) {
    return this.filterRange(cb, 0, this.length, context);
  },

  /**
   * The callback `cb` is invoked with the arguments (item, key,
   * indexInOriginal).
   *
   * @param {Function} cb Returns true if item should be in result.
   * @param {number} start Start index of filter range.
   * @param {number} length End index of map range.
   * @param {*!?} context Context of callback invocation.
   * @return {OrderedMap} OrderedMap resulting from filtering the range.
   */
  filterRange: function filterRange(cb, start, length, context) {
    var newSet = {};
    var newSetLength = 0;
    this.forEachRange(function (item, key, originalIndex) {
      if (cb.call(context, item, key, originalIndex)) {
        var normalizedKey = PREFIX + key;
        newSet[normalizedKey] = item;
        newSetLength++;
      }
    }, start, length);
    return new OrderedMapImpl(newSet, newSetLength);
  },

  forEach: function forEach(cb, context) {
    this.forEachRange(cb, 0, this.length, context);
  },

  forEachRange: function forEachRange(cb, start, length, context) {
    assertValidRangeIndices(start, length, this.length);
    var thisSet = this._normalizedObj;
    var i = 0;
    var end = start + length - 1;
    for (var key in thisSet) {
      if (thisSet.hasOwnProperty(key)) {
        if (i >= start) {
          if (i > end) {
            break;
          }
          var item = thisSet[key];
          cb.call(context, item, key.substr(PREFIX.length), i);
        }
        i++;
      }
    }
  },

  /**
   * Even though `mapRange`/`forEachKeyRange` allow zero length mappings, we'll
   * impose an additional restriction here that the length of mapping be greater
   * than zero - the only reason is that there are many ways to express length
   * zero in terms of two keys and that is confusing.
   */
  mapKeyRange: function mapKeyRange(cb, startKey, endKey, context) {
    var startIndex = this.indexOfKey(startKey);
    var endIndex = this.indexOfKey(endKey);
    !(startIndex !== undefined && endIndex !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mapKeyRange must be given keys that are present.') : invariant(false) : undefined;
    !(endIndex >= startIndex) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.mapKeyRange(...): `endKey` must not come before `startIndex`.') : invariant(false) : undefined;
    return this.mapRange(cb, startIndex, endIndex - startIndex + 1, context);
  },

  forEachKeyRange: function forEachKeyRange(cb, startKey, endKey, context) {
    var startIndex = this.indexOfKey(startKey);
    var endIndex = this.indexOfKey(endKey);
    !(startIndex !== undefined && endIndex !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'forEachKeyRange must be given keys that are present.') : invariant(false) : undefined;
    !(endIndex >= startIndex) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.forEachKeyRange(...): `endKey` must not come before ' + '`startIndex`.') : invariant(false) : undefined;
    this.forEachRange(cb, startIndex, endIndex - startIndex + 1, context);
  },

  /**
   * @param {number} pos Index to search for key at.
   * @return {string|undefined} Either the key at index `pos` or undefined if
   * not in map.
   */
  keyAtIndex: function keyAtIndex(pos) {
    var computedPositions = this._getOrComputePositions();
    var keyAtPos = computedPositions.keyByIndex[pos];
    return keyAtPos ? keyAtPos.substr(PREFIX.length) : undefined;
  },

  /**
   * @param {string} key String key from which to find the next key.
   * @return {string|undefined} Either the next key, or undefined if there is no
   * next key.
   * @throws Error if `key` is not in this `OrderedMap`.
   */
  keyAfter: function keyAfter(key) {
    return this.nthKeyAfter(key, 1);
  },

  /**
   * @param {string} key String key from which to find the preceding key.
   * @return {string|undefined} Either the preceding key, or undefined if there
   * is no preceding.key.
   * @throws Error if `key` is not in this `OrderedMap`.
   */
  keyBefore: function keyBefore(key) {
    return this.nthKeyBefore(key, 1);
  },

  /**
   * @param {string} key String key from which to find a following key.
   * @param {number} n Distance to scan forward after `key`.
   * @return {string|undefined} Either the nth key after `key`, or undefined if
   * there is no next key.
   * @throws Error if `key` is not in this `OrderedMap`.
   */
  nthKeyAfter: function nthKeyAfter(key, n) {
    var curIndex = this.indexOfKey(key);
    !(curIndex !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.nthKeyAfter: The key `%s` does not exist in this instance.', key) : invariant(false) : undefined;
    return this.keyAtIndex(curIndex + n);
  },

  /**
   * @param {string} key String key from which to find a preceding key.
   * @param {number} n Distance to scan backwards before `key`.
   * @return {string|undefined} Either the nth key before `key`, or undefined if
   * there is no previous key.
   * @throws Error if `key` is not in this `OrderedMap`.
   */
  nthKeyBefore: function nthKeyBefore(key, n) {
    return this.nthKeyAfter(key, -n);
  },

  /**
   * @param {string} key Key to find the index of.
   * @return {number|undefined} Index of the provided key, or `undefined` if the
   * key is not found.
   */
  indexOfKey: function indexOfKey(key) {
    assertValidPublicKey(key);
    var normalizedKey = PREFIX + key;
    var computedPositions = this._getOrComputePositions();
    var computedPosition = computedPositions.indexByKey[normalizedKey];
    // Just writing it this way to make it clear this is intentional.
    return computedPosition === undefined ? undefined : computedPosition;
  },

  /**
   * @return {Array} An ordered array of this object's values.
   */
  toArray: function toArray() {
    var result = [];
    var thisSet = this._normalizedObj;
    for (var key in thisSet) {
      if (thisSet.hasOwnProperty(key)) {
        result.push(thisSet[key]);
      }
    }
    return result;
  },

  /**
   * Finds the key at a given position, or indicates via `undefined` that that
   * position does not exist in the `OrderedMap`. It is appropriate to return
   * undefined, indicating that the key doesn't exist in the `OrderedMap`
   * because `undefined` is not ever a valid `OrderedMap` key.
   *
   * @private
   * @return {string?} Name of the item at position `pos`, or `undefined` if
   * there is no item at that position.
   */
  _getOrComputePositions: function _getOrComputePositions() {
    // TODO: Entertain computing this at construction time in some less
    // performance critical paths.
    var computedPositions = this._computedPositions;
    if (!computedPositions) {
      this._computePositions();
    }
    return this._computedPositions;
  },

  /**
   * Precomputes the index/key mapping for future lookup. Since `OrderedMap`s
   * are immutable, there is only ever a need to perform this once.
   * @private
   */
  _computePositions: function _computePositions() {
    this._computedPositions = {
      keyByIndex: {},
      indexByKey: {}
    };
    var keyByIndex = this._computedPositions.keyByIndex;
    var indexByKey = this._computedPositions.indexByKey;
    var index = 0;
    var thisSet = this._normalizedObj;
    for (var key in thisSet) {
      if (thisSet.hasOwnProperty(key)) {
        keyByIndex[index] = key;
        indexByKey[key] = index;
        index++;
      }
    }
  }
};

assign(OrderedMapImpl.prototype, OrderedMapMethods);

var OrderedMap = {
  from: function from(orderedMap) {
    !(orderedMap instanceof OrderedMapImpl) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.from(...): Expected an OrderedMap instance.') : invariant(false) : undefined;
    return _fromNormalizedObjects(orderedMap._normalizedObj, null);
  },

  fromArray: function fromArray(arr, keyExtractor) {
    !Array.isArray(arr) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.fromArray(...): First argument must be an array.') : invariant(false) : undefined;
    !(typeof keyExtractor === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'OrderedMap.fromArray(...): Second argument must be a function used ' + 'to determine the unique key for each entry.') : invariant(false) : undefined;
    return new OrderedMapImpl(extractObjectFromArray(arr, keyExtractor), arr.length);
  }
};

module.exports = OrderedMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL09yZGVyZWRNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBWjs7QUFFSixJQUFJLFNBQVMsTUFBVDs7Ozs7Ozs7Ozs7OztBQWFKLFNBQVMsc0JBQVQsQ0FBZ0MsR0FBaEMsRUFBcUMsWUFBckMsRUFBbUQ7QUFDakQsTUFBSSxnQkFBZ0IsRUFBaEIsQ0FENkM7QUFFakQsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksSUFBSSxNQUFKLEVBQVksR0FBaEMsRUFBcUM7QUFDbkMsUUFBSSxPQUFPLElBQUksQ0FBSixDQUFQLENBRCtCO0FBRW5DLFFBQUksTUFBTSxhQUFhLElBQWIsQ0FBTixDQUYrQjtBQUduQyx5QkFBcUIsR0FBckIsRUFIbUM7QUFJbkMsUUFBSSxnQkFBZ0IsU0FBUyxHQUFULENBSmU7QUFLbkMsS0FBQyxFQUFFLGlCQUFpQixhQUFqQixDQUFGLEdBQW9DLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHlFQUFqQixDQUF4QyxHQUFzSSxVQUFVLEtBQVYsQ0FBdEksR0FBeUosU0FBOUwsQ0FMbUM7QUFNbkMsa0JBQWMsYUFBZCxJQUErQixJQUEvQixDQU5tQztHQUFyQztBQVFBLFNBQU8sYUFBUCxDQVZpRDtDQUFuRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBLFNBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxjQUF2QyxFQUF1RDtBQUNyRCxPQUFLLGNBQUwsR0FBc0IsYUFBdEIsQ0FEcUQ7QUFFckQsT0FBSyxrQkFBTCxHQUEwQixJQUExQixDQUZxRDtBQUdyRCxPQUFLLE1BQUwsR0FBYyxjQUFkLENBSHFEO0NBQXZEOzs7Ozs7Ozs7OztBQWVBLFNBQVMsb0JBQVQs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LFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLDZEQUFqQixDQUF4QyxHQUEwSCxVQUFVLEtBQVYsQ0FBMUgsR0FBNkksU0FBbkssQ0FEc0M7QUFFdEMsTUFBRSxPQUFPLFlBQVAsS0FBd0IsVUFBeEIsQ0FBRixHQUF3QyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQix3RUFBd0UsNkNBQXhFLENBQXpELEdBQWtMLFVBQVUsS0FBVixDQUFsTCxHQUFxTSxTQUE3TyxDQUZzQztBQUd0QyxXQUFPLElBQUksY0FBSixDQUFtQix1QkFBdUIsR0FBdkIsRUFBNEIsWUFBNUIsQ0FBbkIsRUFBOEQsSUFBSSxNQUFKLENBQXJFLENBSHNDO0dBQTdCO0NBTlQ7O0FBYUosT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6Ik9yZGVyZWRNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgT3JkZXJlZE1hcFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG52YXIgUFJFRklYID0gJ2tleTonO1xuXG4vKipcbiAqIFV0aWxpdHkgdG8gZXh0cmFjdCBhIGJhY2tpbmcgb2JqZWN0IGZyb20gYW4gaW5pdGlhbGl6YXRpb24gYEFycmF5YCwgYWxsb3dpbmdcbiAqIHRoZSBjYWxsZXIgdG8gYXNzaXN0IGluIHJlc29sdmluZyB0aGUgdW5pcXVlIElEIGZvciBlYWNoIGVudHJ5IHZpYSB0aGVcbiAqIGBrZXlFeHRyYWN0b3JgIGNhbGxiYWNrLiBUaGUgYGtleUV4dHJhY3RvcmAgbXVzdCBleHRyYWN0IG5vbi1lbXB0eSBzdHJpbmdzIG9yXG4gKiBudW1iZXJzLlxuICogQHBhcmFtIHtBcnJheTxPYmplY3QhPn0gYXJyIEFycmF5IG9mIGl0ZW1zLlxuICogQHBhcmFtIHtmdW5jdGlvbn0ga2V5RXh0cmFjdG9yIEV4dHJhY3RzIGEgdW5pcXVlIGtleSBmcm9tIGVhY2ggaXRlbS5cbiAqIEByZXR1cm4ge09iamVjdH0gTWFwIGZyb20gdW5pcXVlIGtleSB0byBvcmlnaW5hdGluZyB2YWx1ZSB0aGF0IHRoZSBrZXkgd2FzXG4gKiBleHRyYWN0ZWQgZnJvbS5cbiAqIEB0aHJvd3MgRXhjZXB0aW9uIGlmIHRoZSBpbml0aWFsaXphdGlvbiBhcnJheSBoYXMgZHVwbGljYXRlIGV4dHJhY3RlZCBrZXlzLlxuICovXG5mdW5jdGlvbiBleHRyYWN0T2JqZWN0RnJvbUFycmF5KGFyciwga2V5RXh0cmFjdG9yKSB7XG4gIHZhciBub3JtYWxpemVkT2JqID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaV07XG4gICAgdmFyIGtleSA9IGtleUV4dHJhY3RvcihpdGVtKTtcbiAgICBhc3NlcnRWYWxpZFB1YmxpY0tleShrZXkpO1xuICAgIHZhciBub3JtYWxpemVkS2V5ID0gUFJFRklYICsga2V5O1xuICAgICEhKG5vcm1hbGl6ZWRLZXkgaW4gbm9ybWFsaXplZE9iaikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcDogSURzIHJldHVybmVkIGJ5IHRoZSBrZXkgZXh0cmFjdGlvbiBmdW5jdGlvbiBtdXN0IGJlIHVuaXF1ZS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgbm9ybWFsaXplZE9ialtub3JtYWxpemVkS2V5XSA9IGl0ZW07XG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWRPYmo7XG59XG5cbi8qKlxuICogVXRpbGl0eSBjbGFzcyBmb3IgbWFwcGluZ3Mgd2l0aCBvcmRlcmluZy4gVGhpcyBjbGFzcyBpcyB0byBiZSB1c2VkIGluIGFuXG4gKiBpbW11dGFibGUgbWFubmVyLiBBIGBPcmRlcmVkTWFwYCBpcyB2ZXJ5IG11Y2ggbGlrZSB0aGUgbmF0aXZlIEphdmFTY3JpcHRcbiAqIG9iamVjdCwgd2hlcmUga2V5cyBtYXAgdG8gdmFsdWVzIHZpYSB0aGUgYGdldCgpYCBmdW5jdGlvbi4gQWxzbywgbGlrZSB0aGVcbiAqIG5hdGl2ZSBKYXZhU2NyaXB0IG9iamVjdCwgdGhlcmUgaXMgYW4gb3JkZXJpbmcgYXNzb2NpYXRlZCB3aXRoIHRoZSBtYXBwaW5nLlxuICogVGhpcyBjbGFzcyBpcyBoZWxwZnVsIGJlY2F1c2UgaXQgZWxpbWluYXRlcyBtYW55IG9mIHRoZSBwaXRmYWxscyB0aGF0IGNvbWVcbiAqIHdpdGggdGhlIG5hdGl2ZSBKYXZhU2NyaXB0IG9yZGVyZWQgbWFwcGluZ3MuIFNwZWNpZmljYWxseSwgdGhlcmUgYXJlXG4gKiBpbmNvbnNpc3RlbmNpZXMgd2l0aCBudW1lcmljIGtleXMgaW4gc29tZSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uc1xuICogKGVudW1lcmF0aW9uIG9yZGVyaW5nKS4gVGhpcyBjbGFzcyBwcm90ZWN0cyBhZ2FpbnN0IHRob3NlIHBpdGZhbGxzIGFuZFxuICogcHJvdmlkZXMgZnVuY3Rpb25hbCB1dGlsaXRpZXMgZm9yIGRlYWxpbmcgd2l0aCB0aGVzZSBgT3JkZXJlZE1hcGBzLlxuICpcbiAqIC0gVE9ETzpcbiAqIC0gb3JkZXJlZE1lcmdlRXhjbHVzaXZlOiBNZXJnZXMgbXV0dWFsbHkgZXhjbHVzaXZlIGBPcmRlcmVkTWFwYHMuXG4gKiAtIG1hcFJldmVyc2UoKS5cbiAqXG4gKiBAY2xhc3Mge09yZGVyZWRNYXB9XG4gKiBAY29uc3RydWN0b3Ige09yZGVyZWRNYXB9XG4gKiBAcGFyYW0ge09iamVjdH0gbm9ybWFsaXplZE9iaiBPYmplY3QgdGhhdCBpcyBrbm93biB0byBiZSBhIGRlZmVuc2l2ZSBjb3B5IG9mXG4gKiBjYWxsZXIgc3VwcGxpZWQgZGF0YS4gV2UgcmVxdWlyZSBhIGRlZmVuc2l2ZSBjb3B5IHRvIGd1YXJkIGFnYWluc3QgY2FsbGVyc1xuICogbXV0YXRpbmcuICBJdCBpcyBhbHNvIGFzc3VtZWQgdGhhdCB0aGUga2V5cyBvZiBgbm9ybWFsaXplZE9iamAgaGF2ZSBiZWVuXG4gKiBub3JtYWxpemVkIGFuZCBkbyBub3QgY29udGFpbiBhbnkgbnVtZXJpYy1hcHBlYXJpbmcgc3RyaW5ncy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb21wdXRlZExlbmd0aCBUaGUgcHJlY29tcHV0ZWQgbGVuZ3RoIG9mIGBfbm9ybWFsaXplZE9iamBcbiAqIGtleXMuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBPcmRlcmVkTWFwSW1wbChub3JtYWxpemVkT2JqLCBjb21wdXRlZExlbmd0aCkge1xuICB0aGlzLl9ub3JtYWxpemVkT2JqID0gbm9ybWFsaXplZE9iajtcbiAgdGhpcy5fY29tcHV0ZWRQb3NpdGlvbnMgPSBudWxsO1xuICB0aGlzLmxlbmd0aCA9IGNvbXB1dGVkTGVuZ3RoO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhIFwicHVibGljXCIga2V5IC0gdGhhdCBpcywgb25lIHRoYXQgdGhlIHB1YmxpYyBmYWNpbmcgQVBJIHN1cHBsaWVzLlxuICogVGhlIGtleSBpcyB0aGVuIG5vcm1hbGl6ZWQgZm9yIGludGVybmFsIHN0b3JhZ2UuIEluIG9yZGVyIHRvIGJlIGNvbnNpZGVyZWRcbiAqIHZhbGlkLCBhbGwga2V5cyBtdXN0IGJlIG5vbi1lbXB0eSwgZGVmaW5lZCwgbm9uLW51bGwgc3RyaW5ncyBvciBudW1iZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nP30ga2V5IFZhbGlkYXRlcyB0aGF0IHRoZSBrZXkgaXMgc3VpdGFibGUgZm9yIHVzZSBpbiBhXG4gKiBgT3JkZXJlZE1hcGAuXG4gKiBAdGhyb3dzIEVycm9yIGlmIGtleSBpcyBub3QgYXBwcm9wcmlhdGUgZm9yIHVzZSBpbiBgT3JkZXJlZE1hcGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2VydFZhbGlkUHVibGljS2V5KGtleSkge1xuICAhKGtleSAhPT0gJycgJiYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBrZXkgPT09ICdudW1iZXInKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcDogS2V5IG11c3QgYmUgbm9uLWVtcHR5LCBub24tbnVsbCBzdHJpbmcgb3IgbnVtYmVyLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgdGhhdCBhcmd1bWVudHMgdG8gcmFuZ2Ugb3BlcmF0aW9ucyBhcmUgd2l0aGluIHRoZSBjb3JyZWN0IGxpbWl0cy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU3RhcnQgb2YgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIExlbmd0aCBvZiByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWxMZW4gQWN0dWFsIGxlbmd0aCBvZiByYW5nZSB0aGF0IHNob3VsZCBub3QgYmVcbiAqIGV4Y2VlZGVkLlxuICogQHRocm93cyBFcnJvciBpZiByYW5nZSBhcmd1bWVudHMgYXJlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGFzc2VydFZhbGlkUmFuZ2VJbmRpY2VzKHN0YXJ0LCBsZW5ndGgsIGFjdHVhbExlbikge1xuICAhKHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgc3RhcnQgPj0gMCAmJiBzdGFydCArIGxlbmd0aCA8PSBhY3R1YWxMZW4pID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXA6IGBtYXBSYW5nZWAgYW5kIGBmb3JFYWNoUmFuZ2VgIGV4cGVjdCBub24tbmVnYXRpdmUgc3RhcnQgYW5kICcgKyAnbGVuZ3RoIGFyZ3VtZW50cyB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGUgaW5zdGFuY2UuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIE1lcmdlcyB0d28gXCJub3JtYWxpemVkXCIgb2JqZWN0cyAob2JqZWN0cyB3aG8ncyBrZXkgaGF2ZSBiZWVuIG5vcm1hbGl6ZWQpIGludG9cbiAqIGEgYE9yZGVyZWRNYXBgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIE9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gYiBPYmplY3Qgb2Yga2V5IHZhbHVlIHBhaXJzLlxuICogQHJldHVybiB7T3JkZXJlZE1hcH0gbmV3IGBPcmRlcmVkTWFwYCB0aGF0IHJlc3VsdHMgaW4gbWVyZ2luZyBgYWAgYW5kIGBiYC5cbiAqL1xuZnVuY3Rpb24gX2Zyb21Ob3JtYWxpemVkT2JqZWN0cyhhLCBiKSB7XG4gIC8vIFNlY29uZCBvcHRpb25hbCwgYm90aCBtdXN0IGJlIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAgIShhICYmIGEuY29uc3RydWN0b3IgPT09IE9iamVjdCAmJiAoIWIgfHwgYi5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcDogQ29ycnVwdGVkIGluc3RhbmNlIG9mIE9yZGVyZWRNYXAgZGV0ZWN0ZWQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gIHZhciBuZXdTZXQgPSB7fTtcbiAgdmFyIGxlbmd0aCA9IDA7XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIGEpIHtcbiAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBuZXdTZXRba2V5XSA9IGFba2V5XTtcbiAgICAgIGxlbmd0aCsrO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoa2V5IGluIGIpIHtcbiAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAvLyBJbmNyZW1lbnQgbGVuZ3RoIGlmIG5vdCBhbHJlYWR5IGFkZGVkIHZpYSBmaXJzdCBvYmplY3QgKGEpXG4gICAgICBpZiAoIShrZXkgaW4gbmV3U2V0KSkge1xuICAgICAgICBsZW5ndGgrKztcbiAgICAgIH1cbiAgICAgIG5ld1NldFtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IE9yZGVyZWRNYXBJbXBsKG5ld1NldCwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBNZXRob2RzIGZvciBgT3JkZXJlZE1hcGAgaW5zdGFuY2VzLlxuICpcbiAqIEBsZW5kcyBPcmRlcmVkTWFwLnByb3RvdHlwZVxuICogVE9ETzogTWFrZSB0aGlzIGRhdGEgc3RydWN0dXJlIGxhenksIHVuaWZ5IHdpdGggTGF6eUFycmF5LlxuICogVE9ETzogVW5pZnkgdGhpcyB3aXRoIEltbXV0YWJsZU9iamVjdCAtIGl0IGlzIHRvIGJlIHVzZWQgaW1tdXRhYmx5LlxuICogVE9ETzogSWYgc28sIGNvbnNpZGVyIHByb3ZpZGluZyBgZnJvbU9iamVjdGAgQVBJLlxuICogVE9ETzogQ3JlYXRlIGZhc3RlciBpbXBsZW1lbnRhdGlvbiBvZiBtZXJnaW5nL21hcHBpbmcgZnJvbSBvcmlnaW5hbCBBcnJheSxcbiAqIHdpdGhvdXQgaGF2aW5nIHRvIGZpcnN0IGNyZWF0ZSBhbiBvYmplY3QgLSBzaW1wbHkgZm9yIHRoZSBzYWtlIG9mIG1lcmdpbmcuXG4gKi9cbnZhciBPcmRlcmVkTWFwTWV0aG9kcyA9IHtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGtleSBpcyBwcmVzZW50IGluIHRoZSBtYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVmFsaWQgc3RyaW5nIGtleSB0byBsb29rdXAgbWVtYmVyc2hpcCBmb3IuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IGBrZXlgIGlzIGEgbWVtYmVyIG9mIHRoZSBtYXAuXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgcHJvdmlkZWQga25vd24gaW52YWxpZCBrZXkuXG4gICAqL1xuICBoYXM6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBhc3NlcnRWYWxpZFB1YmxpY0tleShrZXkpO1xuICAgIHZhciBub3JtYWxpemVkS2V5ID0gUFJFRklYICsga2V5O1xuICAgIHJldHVybiBub3JtYWxpemVkS2V5IGluIHRoaXMuX25vcm1hbGl6ZWRPYmo7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9iamVjdCBmb3IgYSBnaXZlbiBrZXksIG9yIGB1bmRlZmluZWRgIGlmIG5vdCBwcmVzZW50LiBUb1xuICAgKiBkaXN0aW5ndWlzaCBhbiB1bmRlZmluZWQgZW50cnkgdnMgbm90IGJlaW5nIGluIHRoZSBzZXQsIHVzZSBgaGFzKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgdG8gbG9va3VwIHRoZSB2YWx1ZSBmb3IuXG4gICAqIEByZXR1cm4ge09iamVjdD99IE9iamVjdCBhdCBrZXkgYGtleWAsIG9yIHVuZGVmaW5lZCBpZiBub3QgaW4gbWFwLlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIHByb3ZpZGVkIGtub3duIGludmFsaWQga2V5LlxuICAgKi9cbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgYXNzZXJ0VmFsaWRQdWJsaWNLZXkoa2V5KTtcbiAgICB2YXIgbm9ybWFsaXplZEtleSA9IFBSRUZJWCArIGtleTtcbiAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuX25vcm1hbGl6ZWRPYmpbbm9ybWFsaXplZEtleV0gOiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1lcmdlcywgYXBwZW5kaW5nIG5ldyBrZXlzIHRvIHRoZSBlbmQgb2YgdGhlIG9yZGVyaW5nLiBLZXlzIGluIGBvcmRlcmVkTWFwYFxuICAgKiB0aGF0IGFyZSByZWR1bmRhbnQgd2l0aCBgdGhpc2AsIG1haW50YWluIHRoZSBzYW1lIG9yZGVyaW5nIGluZGV4IHRoYXQgdGhleVxuICAgKiBoYWQgaW4gYHRoaXNgLiAgVGhpcyBpcyBob3cgc3RhbmRhcmQgSmF2YVNjcmlwdCBvYmplY3QgbWVyZ2luZyB3b3VsZCB3b3JrLlxuICAgKiBJZiB5b3Ugd2lzaCB0byBwcmVwZW5kIGEgYE9yZGVyZWRNYXBgIHRvIHRoZSBiZWdpbm5pbmcgb2YgYW5vdGhlclxuICAgKiBgT3JkZXJlZE1hcGAgdGhlbiBzaW1wbHkgcmV2ZXJzZSB0aGUgb3JkZXIgb2Ygb3BlcmF0aW9uLiBUaGlzIGlzIHRoZSBhbmFsb2dcbiAgICogdG8gYG1lcmdlKHgsIHkpYC5cbiAgICpcbiAgICogQHBhcmFtIHtPcmRlcmVkTWFwfSBvcmRlcmVkTWFwIE9yZGVyZWRNYXAgdG8gbWVyZ2Ugb250byB0aGUgZW5kLlxuICAgKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBOZXcgT3JkZXJlZE1hcCB0aGF0IHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiB0aGVcbiAgICogbWVyZ2UuXG4gICAqL1xuICBtZXJnZTogZnVuY3Rpb24gKG9yZGVyZWRNYXApIHtcbiAgICAhKG9yZGVyZWRNYXAgaW5zdGFuY2VvZiBPcmRlcmVkTWFwSW1wbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcC5tZXJnZSguLi4pOiBFeHBlY3RlZCBhbiBPcmRlcmVkTWFwIGluc3RhbmNlLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gX2Zyb21Ob3JtYWxpemVkT2JqZWN0cyh0aGlzLl9ub3JtYWxpemVkT2JqLCBvcmRlcmVkTWFwLl9ub3JtYWxpemVkT2JqKTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb25hbCBtYXAgQVBJLiBSZXR1cm5zIGEgbmV3IGBPcmRlcmVkTWFwYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW0uXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGNvbnRleHQgQ29udGV4dCB0byBpbnZva2UgY2FsbGJhY2sgZnJvbS5cbiAgICogQHJldHVybiB7T3JkZXJlZE1hcH0gT3JkZXJlZE1hcCB0aGF0IHJlc3VsdHMgZnJvbSBtYXBwaW5nLlxuICAgKi9cbiAgbWFwOiBmdW5jdGlvbiAoY2IsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBSYW5nZShjYiwgMCwgdGhpcy5sZW5ndGgsIGNvbnRleHQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgYGNiYCBpcyBpbnZva2VkIHdpdGggdGhlIGFyZ3VtZW50cyAoaXRlbSwga2V5LFxuICAgKiBpbmRleEluT3JpZ2luYWwpLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBEZXRlcm1pbmVzIHJlc3VsdCBmb3IgZWFjaCBpdGVtLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU3RhcnQgaW5kZXggb2YgbWFwIHJhbmdlLlxuICAgKiBAcGFyYW0ge2VuZH0gbGVuZ3RoIEVuZCBpbmRleCBvZiBtYXAgcmFuZ2UuXG4gICAqIEBwYXJhbSB7KiE/fSBjb250ZXh0IENvbnRleHQgb2YgY2FsbGJhY2sgaW52b2NhdGlvbi5cbiAgICogQHJldHVybiB7T3JkZXJlZE1hcH0gT3JkZXJlZE1hcCByZXN1bHRpbmcgZnJvbSBtYXBwaW5nIHRoZSByYW5nZS5cbiAgICovXG4gIG1hcFJhbmdlOiBmdW5jdGlvbiAoY2IsIHN0YXJ0LCBsZW5ndGgsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpc1NldCA9IHRoaXMuX25vcm1hbGl6ZWRPYmo7XG4gICAgdmFyIG5ld1NldCA9IHt9O1xuICAgIHZhciBpID0gMDtcbiAgICBhc3NlcnRWYWxpZFJhbmdlSW5kaWNlcyhzdGFydCwgbGVuZ3RoLCB0aGlzLmxlbmd0aCk7XG4gICAgdmFyIGVuZCA9IHN0YXJ0ICsgbGVuZ3RoIC0gMTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpc1NldCkge1xuICAgICAgaWYgKHRoaXNTZXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAoaSA+PSBzdGFydCkge1xuICAgICAgICAgIGlmIChpID4gZW5kKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzU2V0W2tleV07XG4gICAgICAgICAgbmV3U2V0W2tleV0gPSBjYi5jYWxsKGNvbnRleHQsIGl0ZW0sIGtleS5zdWJzdHIoUFJFRklYLmxlbmd0aCksIGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkTWFwSW1wbChuZXdTZXQsIGxlbmd0aCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGZpbHRlciBBUEkuIFJldHVybnMgbmV3IGBPcmRlcmVkTWFwYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW0uXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGNvbnRleHQgQ29udGV4dCB0byBpbnZva2UgY2FsbGJhY2sgZnJvbS5cbiAgICogQHJldHVybiB7T3JkZXJlZE1hcH0gT3JkZXJlZE1hcCB0aGF0IHJlc3VsdHMgZnJvbSBmaWx0ZXJpbmcuXG4gICAqL1xuICBmaWx0ZXI6IGZ1bmN0aW9uIChjYiwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlclJhbmdlKGNiLCAwLCB0aGlzLmxlbmd0aCwgY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBgY2JgIGlzIGludm9rZWQgd2l0aCB0aGUgYXJndW1lbnRzIChpdGVtLCBrZXksXG4gICAqIGluZGV4SW5PcmlnaW5hbCkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIFJldHVybnMgdHJ1ZSBpZiBpdGVtIHNob3VsZCBiZSBpbiByZXN1bHQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTdGFydCBpbmRleCBvZiBmaWx0ZXIgcmFuZ2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggRW5kIGluZGV4IG9mIG1hcCByYW5nZS5cbiAgICogQHBhcmFtIHsqIT99IGNvbnRleHQgQ29udGV4dCBvZiBjYWxsYmFjayBpbnZvY2F0aW9uLlxuICAgKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBPcmRlcmVkTWFwIHJlc3VsdGluZyBmcm9tIGZpbHRlcmluZyB0aGUgcmFuZ2UuXG4gICAqL1xuICBmaWx0ZXJSYW5nZTogZnVuY3Rpb24gKGNiLCBzdGFydCwgbGVuZ3RoLCBjb250ZXh0KSB7XG4gICAgdmFyIG5ld1NldCA9IHt9O1xuICAgIHZhciBuZXdTZXRMZW5ndGggPSAwO1xuICAgIHRoaXMuZm9yRWFjaFJhbmdlKGZ1bmN0aW9uIChpdGVtLCBrZXksIG9yaWdpbmFsSW5kZXgpIHtcbiAgICAgIGlmIChjYi5jYWxsKGNvbnRleHQsIGl0ZW0sIGtleSwgb3JpZ2luYWxJbmRleCkpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRLZXkgPSBQUkVGSVggKyBrZXk7XG4gICAgICAgIG5ld1NldFtub3JtYWxpemVkS2V5XSA9IGl0ZW07XG4gICAgICAgIG5ld1NldExlbmd0aCsrO1xuICAgICAgfVxuICAgIH0sIHN0YXJ0LCBsZW5ndGgpO1xuICAgIHJldHVybiBuZXcgT3JkZXJlZE1hcEltcGwobmV3U2V0LCBuZXdTZXRMZW5ndGgpO1xuICB9LFxuXG4gIGZvckVhY2g6IGZ1bmN0aW9uIChjYiwgY29udGV4dCkge1xuICAgIHRoaXMuZm9yRWFjaFJhbmdlKGNiLCAwLCB0aGlzLmxlbmd0aCwgY29udGV4dCk7XG4gIH0sXG5cbiAgZm9yRWFjaFJhbmdlOiBmdW5jdGlvbiAoY2IsIHN0YXJ0LCBsZW5ndGgsIGNvbnRleHQpIHtcbiAgICBhc3NlcnRWYWxpZFJhbmdlSW5kaWNlcyhzdGFydCwgbGVuZ3RoLCB0aGlzLmxlbmd0aCk7XG4gICAgdmFyIHRoaXNTZXQgPSB0aGlzLl9ub3JtYWxpemVkT2JqO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgZW5kID0gc3RhcnQgKyBsZW5ndGggLSAxO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzU2V0KSB7XG4gICAgICBpZiAodGhpc1NldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChpID49IHN0YXJ0KSB7XG4gICAgICAgICAgaWYgKGkgPiBlbmQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXRlbSA9IHRoaXNTZXRba2V5XTtcbiAgICAgICAgICBjYi5jYWxsKGNvbnRleHQsIGl0ZW0sIGtleS5zdWJzdHIoUFJFRklYLmxlbmd0aCksIGkpO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV2ZW4gdGhvdWdoIGBtYXBSYW5nZWAvYGZvckVhY2hLZXlSYW5nZWAgYWxsb3cgemVybyBsZW5ndGggbWFwcGluZ3MsIHdlJ2xsXG4gICAqIGltcG9zZSBhbiBhZGRpdGlvbmFsIHJlc3RyaWN0aW9uIGhlcmUgdGhhdCB0aGUgbGVuZ3RoIG9mIG1hcHBpbmcgYmUgZ3JlYXRlclxuICAgKiB0aGFuIHplcm8gLSB0aGUgb25seSByZWFzb24gaXMgdGhhdCB0aGVyZSBhcmUgbWFueSB3YXlzIHRvIGV4cHJlc3MgbGVuZ3RoXG4gICAqIHplcm8gaW4gdGVybXMgb2YgdHdvIGtleXMgYW5kIHRoYXQgaXMgY29uZnVzaW5nLlxuICAgKi9cbiAgbWFwS2V5UmFuZ2U6IGZ1bmN0aW9uIChjYiwgc3RhcnRLZXksIGVuZEtleSwgY29udGV4dCkge1xuICAgIHZhciBzdGFydEluZGV4ID0gdGhpcy5pbmRleE9mS2V5KHN0YXJ0S2V5KTtcbiAgICB2YXIgZW5kSW5kZXggPSB0aGlzLmluZGV4T2ZLZXkoZW5kS2V5KTtcbiAgICAhKHN0YXJ0SW5kZXggIT09IHVuZGVmaW5lZCAmJiBlbmRJbmRleCAhPT0gdW5kZWZpbmVkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdtYXBLZXlSYW5nZSBtdXN0IGJlIGdpdmVuIGtleXMgdGhhdCBhcmUgcHJlc2VudC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgIShlbmRJbmRleCA+PSBzdGFydEluZGV4KSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwLm1hcEtleVJhbmdlKC4uLik6IGBlbmRLZXlgIG11c3Qgbm90IGNvbWUgYmVmb3JlIGBzdGFydEluZGV4YC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMubWFwUmFuZ2UoY2IsIHN0YXJ0SW5kZXgsIGVuZEluZGV4IC0gc3RhcnRJbmRleCArIDEsIGNvbnRleHQpO1xuICB9LFxuXG4gIGZvckVhY2hLZXlSYW5nZTogZnVuY3Rpb24gKGNiLCBzdGFydEtleSwgZW5kS2V5LCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXJ0SW5kZXggPSB0aGlzLmluZGV4T2ZLZXkoc3RhcnRLZXkpO1xuICAgIHZhciBlbmRJbmRleCA9IHRoaXMuaW5kZXhPZktleShlbmRLZXkpO1xuICAgICEoc3RhcnRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGVuZEluZGV4ICE9PSB1bmRlZmluZWQpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2ZvckVhY2hLZXlSYW5nZSBtdXN0IGJlIGdpdmVuIGtleXMgdGhhdCBhcmUgcHJlc2VudC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgIShlbmRJbmRleCA+PSBzdGFydEluZGV4KSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwLmZvckVhY2hLZXlSYW5nZSguLi4pOiBgZW5kS2V5YCBtdXN0IG5vdCBjb21lIGJlZm9yZSAnICsgJ2BzdGFydEluZGV4YC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5mb3JFYWNoUmFuZ2UoY2IsIHN0YXJ0SW5kZXgsIGVuZEluZGV4IC0gc3RhcnRJbmRleCArIDEsIGNvbnRleHQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zIEluZGV4IHRvIHNlYXJjaCBmb3Iga2V5IGF0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBFaXRoZXIgdGhlIGtleSBhdCBpbmRleCBgcG9zYCBvciB1bmRlZmluZWQgaWZcbiAgICogbm90IGluIG1hcC5cbiAgICovXG4gIGtleUF0SW5kZXg6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICB2YXIgY29tcHV0ZWRQb3NpdGlvbnMgPSB0aGlzLl9nZXRPckNvbXB1dGVQb3NpdGlvbnMoKTtcbiAgICB2YXIga2V5QXRQb3MgPSBjb21wdXRlZFBvc2l0aW9ucy5rZXlCeUluZGV4W3Bvc107XG4gICAgcmV0dXJuIGtleUF0UG9zID8ga2V5QXRQb3Muc3Vic3RyKFBSRUZJWC5sZW5ndGgpIDogdW5kZWZpbmVkO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZnJvbSB3aGljaCB0byBmaW5kIHRoZSBuZXh0IGtleS5cbiAgICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH0gRWl0aGVyIHRoZSBuZXh0IGtleSwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vXG4gICAqIG5leHQga2V5LlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGBrZXlgIGlzIG5vdCBpbiB0aGlzIGBPcmRlcmVkTWFwYC5cbiAgICovXG4gIGtleUFmdGVyOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMubnRoS2V5QWZ0ZXIoa2V5LCAxKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBTdHJpbmcga2V5IGZyb20gd2hpY2ggdG8gZmluZCB0aGUgcHJlY2VkaW5nIGtleS5cbiAgICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH0gRWl0aGVyIHRoZSBwcmVjZWRpbmcga2V5LCBvciB1bmRlZmluZWQgaWYgdGhlcmVcbiAgICogaXMgbm8gcHJlY2VkaW5nLmtleS5cbiAgICogQHRocm93cyBFcnJvciBpZiBga2V5YCBpcyBub3QgaW4gdGhpcyBgT3JkZXJlZE1hcGAuXG4gICAqL1xuICBrZXlCZWZvcmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5udGhLZXlCZWZvcmUoa2V5LCAxKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBTdHJpbmcga2V5IGZyb20gd2hpY2ggdG8gZmluZCBhIGZvbGxvd2luZyBrZXkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIERpc3RhbmNlIHRvIHNjYW4gZm9yd2FyZCBhZnRlciBga2V5YC5cbiAgICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH0gRWl0aGVyIHRoZSBudGgga2V5IGFmdGVyIGBrZXlgLCBvciB1bmRlZmluZWQgaWZcbiAgICogdGhlcmUgaXMgbm8gbmV4dCBrZXkuXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgYGtleWAgaXMgbm90IGluIHRoaXMgYE9yZGVyZWRNYXBgLlxuICAgKi9cbiAgbnRoS2V5QWZ0ZXI6IGZ1bmN0aW9uIChrZXksIG4pIHtcbiAgICB2YXIgY3VySW5kZXggPSB0aGlzLmluZGV4T2ZLZXkoa2V5KTtcbiAgICAhKGN1ckluZGV4ICE9PSB1bmRlZmluZWQpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXAubnRoS2V5QWZ0ZXI6IFRoZSBrZXkgYCVzYCBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIGluc3RhbmNlLicsIGtleSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiB0aGlzLmtleUF0SW5kZXgoY3VySW5kZXggKyBuKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBTdHJpbmcga2V5IGZyb20gd2hpY2ggdG8gZmluZCBhIHByZWNlZGluZyBrZXkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIERpc3RhbmNlIHRvIHNjYW4gYmFja3dhcmRzIGJlZm9yZSBga2V5YC5cbiAgICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH0gRWl0aGVyIHRoZSBudGgga2V5IGJlZm9yZSBga2V5YCwgb3IgdW5kZWZpbmVkIGlmXG4gICAqIHRoZXJlIGlzIG5vIHByZXZpb3VzIGtleS5cbiAgICogQHRocm93cyBFcnJvciBpZiBga2V5YCBpcyBub3QgaW4gdGhpcyBgT3JkZXJlZE1hcGAuXG4gICAqL1xuICBudGhLZXlCZWZvcmU6IGZ1bmN0aW9uIChrZXksIG4pIHtcbiAgICByZXR1cm4gdGhpcy5udGhLZXlBZnRlcihrZXksIC1uKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXkgdG8gZmluZCB0aGUgaW5kZXggb2YuXG4gICAqIEByZXR1cm4ge251bWJlcnx1bmRlZmluZWR9IEluZGV4IG9mIHRoZSBwcm92aWRlZCBrZXksIG9yIGB1bmRlZmluZWRgIGlmIHRoZVxuICAgKiBrZXkgaXMgbm90IGZvdW5kLlxuICAgKi9cbiAgaW5kZXhPZktleTogZnVuY3Rpb24gKGtleSkge1xuICAgIGFzc2VydFZhbGlkUHVibGljS2V5KGtleSk7XG4gICAgdmFyIG5vcm1hbGl6ZWRLZXkgPSBQUkVGSVggKyBrZXk7XG4gICAgdmFyIGNvbXB1dGVkUG9zaXRpb25zID0gdGhpcy5fZ2V0T3JDb21wdXRlUG9zaXRpb25zKCk7XG4gICAgdmFyIGNvbXB1dGVkUG9zaXRpb24gPSBjb21wdXRlZFBvc2l0aW9ucy5pbmRleEJ5S2V5W25vcm1hbGl6ZWRLZXldO1xuICAgIC8vIEp1c3Qgd3JpdGluZyBpdCB0aGlzIHdheSB0byBtYWtlIGl0IGNsZWFyIHRoaXMgaXMgaW50ZW50aW9uYWwuXG4gICAgcmV0dXJuIGNvbXB1dGVkUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbXB1dGVkUG9zaXRpb247XG4gIH0sXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0FycmF5fSBBbiBvcmRlcmVkIGFycmF5IG9mIHRoaXMgb2JqZWN0J3MgdmFsdWVzLlxuICAgKi9cbiAgdG9BcnJheTogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgdGhpc1NldCA9IHRoaXMuX25vcm1hbGl6ZWRPYmo7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXNTZXQpIHtcbiAgICAgIGlmICh0aGlzU2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpc1NldFtrZXldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogRmluZHMgdGhlIGtleSBhdCBhIGdpdmVuIHBvc2l0aW9uLCBvciBpbmRpY2F0ZXMgdmlhIGB1bmRlZmluZWRgIHRoYXQgdGhhdFxuICAgKiBwb3NpdGlvbiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgYE9yZGVyZWRNYXBgLiBJdCBpcyBhcHByb3ByaWF0ZSB0byByZXR1cm5cbiAgICogdW5kZWZpbmVkLCBpbmRpY2F0aW5nIHRoYXQgdGhlIGtleSBkb2Vzbid0IGV4aXN0IGluIHRoZSBgT3JkZXJlZE1hcGBcbiAgICogYmVjYXVzZSBgdW5kZWZpbmVkYCBpcyBub3QgZXZlciBhIHZhbGlkIGBPcmRlcmVkTWFwYCBrZXkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge3N0cmluZz99IE5hbWUgb2YgdGhlIGl0ZW0gYXQgcG9zaXRpb24gYHBvc2AsIG9yIGB1bmRlZmluZWRgIGlmXG4gICAqIHRoZXJlIGlzIG5vIGl0ZW0gYXQgdGhhdCBwb3NpdGlvbi5cbiAgICovXG4gIF9nZXRPckNvbXB1dGVQb3NpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBFbnRlcnRhaW4gY29tcHV0aW5nIHRoaXMgYXQgY29uc3RydWN0aW9uIHRpbWUgaW4gc29tZSBsZXNzXG4gICAgLy8gcGVyZm9ybWFuY2UgY3JpdGljYWwgcGF0aHMuXG4gICAgdmFyIGNvbXB1dGVkUG9zaXRpb25zID0gdGhpcy5fY29tcHV0ZWRQb3NpdGlvbnM7XG4gICAgaWYgKCFjb21wdXRlZFBvc2l0aW9ucykge1xuICAgICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9ucygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29tcHV0ZWRQb3NpdGlvbnM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFByZWNvbXB1dGVzIHRoZSBpbmRleC9rZXkgbWFwcGluZyBmb3IgZnV0dXJlIGxvb2t1cC4gU2luY2UgYE9yZGVyZWRNYXBgc1xuICAgKiBhcmUgaW1tdXRhYmxlLCB0aGVyZSBpcyBvbmx5IGV2ZXIgYSBuZWVkIHRvIHBlcmZvcm0gdGhpcyBvbmNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbXB1dGVQb3NpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBvc2l0aW9ucyA9IHtcbiAgICAgIGtleUJ5SW5kZXg6IHt9LFxuICAgICAgaW5kZXhCeUtleToge31cbiAgICB9O1xuICAgIHZhciBrZXlCeUluZGV4ID0gdGhpcy5fY29tcHV0ZWRQb3NpdGlvbnMua2V5QnlJbmRleDtcbiAgICB2YXIgaW5kZXhCeUtleSA9IHRoaXMuX2NvbXB1dGVkUG9zaXRpb25zLmluZGV4QnlLZXk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgdGhpc1NldCA9IHRoaXMuX25vcm1hbGl6ZWRPYmo7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXNTZXQpIHtcbiAgICAgIGlmICh0aGlzU2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5QnlJbmRleFtpbmRleF0gPSBrZXk7XG4gICAgICAgIGluZGV4QnlLZXlba2V5XSA9IGluZGV4O1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuYXNzaWduKE9yZGVyZWRNYXBJbXBsLnByb3RvdHlwZSwgT3JkZXJlZE1hcE1ldGhvZHMpO1xuXG52YXIgT3JkZXJlZE1hcCA9IHtcbiAgZnJvbTogZnVuY3Rpb24gKG9yZGVyZWRNYXApIHtcbiAgICAhKG9yZGVyZWRNYXAgaW5zdGFuY2VvZiBPcmRlcmVkTWFwSW1wbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcC5mcm9tKC4uLik6IEV4cGVjdGVkIGFuIE9yZGVyZWRNYXAgaW5zdGFuY2UuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBfZnJvbU5vcm1hbGl6ZWRPYmplY3RzKG9yZGVyZWRNYXAuX25vcm1hbGl6ZWRPYmosIG51bGwpO1xuICB9LFxuXG4gIGZyb21BcnJheTogZnVuY3Rpb24gKGFyciwga2V5RXh0cmFjdG9yKSB7XG4gICAgIUFycmF5LmlzQXJyYXkoYXJyKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwLmZyb21BcnJheSguLi4pOiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGFuIGFycmF5LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAhKHR5cGVvZiBrZXlFeHRyYWN0b3IgPT09ICdmdW5jdGlvbicpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXAuZnJvbUFycmF5KC4uLik6IFNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24gdXNlZCAnICsgJ3RvIGRldGVybWluZSB0aGUgdW5pcXVlIGtleSBmb3IgZWFjaCBlbnRyeS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkTWFwSW1wbChleHRyYWN0T2JqZWN0RnJvbUFycmF5KGFyciwga2V5RXh0cmFjdG9yKSwgYXJyLmxlbmd0aCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT3JkZXJlZE1hcDsiXX0=