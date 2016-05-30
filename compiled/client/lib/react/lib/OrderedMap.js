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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL09yZGVyZWRNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFiO0FBQ0EsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7O0FBRUEsSUFBSSxTQUFTLE1BQWI7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTLHNCQUFULENBQWdDLEdBQWhDLEVBQXFDLFlBQXJDLEVBQW1EO0FBQ2pELE1BQUksZ0JBQWdCLEVBQXBCO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBeEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsUUFBSSxPQUFPLElBQUksQ0FBSixDQUFYO0FBQ0EsUUFBSSxNQUFNLGFBQWEsSUFBYixDQUFWO0FBQ0EseUJBQXFCLEdBQXJCO0FBQ0EsUUFBSSxnQkFBZ0IsU0FBUyxHQUE3QjtBQUNBLEtBQUMsRUFBRSxpQkFBaUIsYUFBbkIsQ0FBRCxHQUFxQyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQix5RUFBakIsQ0FBeEMsR0FBc0ksVUFBVSxLQUFWLENBQTNLLEdBQThMLFNBQTlMO0FBQ0Esa0JBQWMsYUFBZCxJQUErQixJQUEvQjtBQUNEO0FBQ0QsU0FBTyxhQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCRCxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsY0FBdkMsRUFBdUQ7QUFDckQsT0FBSyxjQUFMLEdBQXNCLGFBQXRCO0FBQ0EsT0FBSyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLE9BQUssTUFBTCxHQUFjLGNBQWQ7QUFDRDs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLG9CQUFULENBQThCLEdBQTlCLEVBQW1DO0FBQ2pDLElBQUUsUUFBUSxFQUFSLEtBQWUsT0FBTyxHQUFQLEtBQWUsUUFBZixJQUEy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bEI7QUFDQTtBQUNEO0FBQ0Y7QUFDRjtBQW5TcUIsQ0FBeEI7O0FBc1NBLE9BQU8sZUFBZSxTQUF0QixFQUFpQyxpQkFBakM7O0FBRUEsSUFBSSxhQUFhO0FBQ2YsUUFBTSxjQUFVLFVBQVYsRUFBc0I7QUFDMUIsTUFBRSxzQkFBc0IsY0FBeEIsSUFBMEMsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsd0RBQWpCLENBQXhDLEdBQXFILFVBQVUsS0FBVixDQUEvSixHQUFrTCxTQUFsTDtBQUNBLFdBQU8sdUJBQXVCLFdBQVcsY0FBbEMsRUFBa0QsSUFBbEQsQ0FBUDtBQUNELEdBSmM7O0FBTWYsYUFBVyxtQkFBVSxHQUFWLEVBQWUsWUFBZixFQUE2QjtBQUN0QyxLQUFDLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBRCxHQUFzQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiw2REFBakIsQ0FBeEMsR0FBMEgsVUFBVSxLQUFWLENBQWhKLEdBQW1LLFNBQW5LO0FBQ0EsTUFBRSxPQUFPLFlBQVAsS0FBd0IsVUFBMUIsSUFBd0MsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsd0VBQXdFLDZDQUF6RixDQUF4QyxHQUFrTCxVQUFVLEtBQVYsQ0FBMU4sR0FBNk8sU0FBN087QUFDQSxXQUFPLElBQUksY0FBSixDQUFtQix1QkFBdUIsR0FBdkIsRUFBNEIsWUFBNUIsQ0FBbkIsRUFBOEQsSUFBSSxNQUFsRSxDQUFQO0FBQ0Q7QUFWYyxDQUFqQjs7QUFhQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiT3JkZXJlZE1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBPcmRlcmVkTWFwXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbnZhciBQUkVGSVggPSAna2V5Oic7XG5cbi8qKlxuICogVXRpbGl0eSB0byBleHRyYWN0IGEgYmFja2luZyBvYmplY3QgZnJvbSBhbiBpbml0aWFsaXphdGlvbiBgQXJyYXlgLCBhbGxvd2luZ1xuICogdGhlIGNhbGxlciB0byBhc3Npc3QgaW4gcmVzb2x2aW5nIHRoZSB1bmlxdWUgSUQgZm9yIGVhY2ggZW50cnkgdmlhIHRoZVxuICogYGtleUV4dHJhY3RvcmAgY2FsbGJhY2suIFRoZSBga2V5RXh0cmFjdG9yYCBtdXN0IGV4dHJhY3Qgbm9uLWVtcHR5IHN0cmluZ3Mgb3JcbiAqIG51bWJlcnMuXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdCE+fSBhcnIgQXJyYXkgb2YgaXRlbXMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBrZXlFeHRyYWN0b3IgRXh0cmFjdHMgYSB1bmlxdWUga2V5IGZyb20gZWFjaCBpdGVtLlxuICogQHJldHVybiB7T2JqZWN0fSBNYXAgZnJvbSB1bmlxdWUga2V5IHRvIG9yaWdpbmF0aW5nIHZhbHVlIHRoYXQgdGhlIGtleSB3YXNcbiAqIGV4dHJhY3RlZCBmcm9tLlxuICogQHRocm93cyBFeGNlcHRpb24gaWYgdGhlIGluaXRpYWxpemF0aW9uIGFycmF5IGhhcyBkdXBsaWNhdGUgZXh0cmFjdGVkIGtleXMuXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RPYmplY3RGcm9tQXJyYXkoYXJyLCBrZXlFeHRyYWN0b3IpIHtcbiAgdmFyIG5vcm1hbGl6ZWRPYmogPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGFycltpXTtcbiAgICB2YXIga2V5ID0ga2V5RXh0cmFjdG9yKGl0ZW0pO1xuICAgIGFzc2VydFZhbGlkUHVibGljS2V5KGtleSk7XG4gICAgdmFyIG5vcm1hbGl6ZWRLZXkgPSBQUkVGSVggKyBrZXk7XG4gICAgISEobm9ybWFsaXplZEtleSBpbiBub3JtYWxpemVkT2JqKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwOiBJRHMgcmV0dXJuZWQgYnkgdGhlIGtleSBleHRyYWN0aW9uIGZ1bmN0aW9uIG11c3QgYmUgdW5pcXVlLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICBub3JtYWxpemVkT2JqW25vcm1hbGl6ZWRLZXldID0gaXRlbTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZE9iajtcbn1cblxuLyoqXG4gKiBVdGlsaXR5IGNsYXNzIGZvciBtYXBwaW5ncyB3aXRoIG9yZGVyaW5nLiBUaGlzIGNsYXNzIGlzIHRvIGJlIHVzZWQgaW4gYW5cbiAqIGltbXV0YWJsZSBtYW5uZXIuIEEgYE9yZGVyZWRNYXBgIGlzIHZlcnkgbXVjaCBsaWtlIHRoZSBuYXRpdmUgSmF2YVNjcmlwdFxuICogb2JqZWN0LCB3aGVyZSBrZXlzIG1hcCB0byB2YWx1ZXMgdmlhIHRoZSBgZ2V0KClgIGZ1bmN0aW9uLiBBbHNvLCBsaWtlIHRoZVxuICogbmF0aXZlIEphdmFTY3JpcHQgb2JqZWN0LCB0aGVyZSBpcyBhbiBvcmRlcmluZyBhc3NvY2lhdGVkIHdpdGggdGhlIG1hcHBpbmcuXG4gKiBUaGlzIGNsYXNzIGlzIGhlbHBmdWwgYmVjYXVzZSBpdCBlbGltaW5hdGVzIG1hbnkgb2YgdGhlIHBpdGZhbGxzIHRoYXQgY29tZVxuICogd2l0aCB0aGUgbmF0aXZlIEphdmFTY3JpcHQgb3JkZXJlZCBtYXBwaW5ncy4gU3BlY2lmaWNhbGx5LCB0aGVyZSBhcmVcbiAqIGluY29uc2lzdGVuY2llcyB3aXRoIG51bWVyaWMga2V5cyBpbiBzb21lIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb25zXG4gKiAoZW51bWVyYXRpb24gb3JkZXJpbmcpLiBUaGlzIGNsYXNzIHByb3RlY3RzIGFnYWluc3QgdGhvc2UgcGl0ZmFsbHMgYW5kXG4gKiBwcm92aWRlcyBmdW5jdGlvbmFsIHV0aWxpdGllcyBmb3IgZGVhbGluZyB3aXRoIHRoZXNlIGBPcmRlcmVkTWFwYHMuXG4gKlxuICogLSBUT0RPOlxuICogLSBvcmRlcmVkTWVyZ2VFeGNsdXNpdmU6IE1lcmdlcyBtdXR1YWxseSBleGNsdXNpdmUgYE9yZGVyZWRNYXBgcy5cbiAqIC0gbWFwUmV2ZXJzZSgpLlxuICpcbiAqIEBjbGFzcyB7T3JkZXJlZE1hcH1cbiAqIEBjb25zdHJ1Y3RvciB7T3JkZXJlZE1hcH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBub3JtYWxpemVkT2JqIE9iamVjdCB0aGF0IGlzIGtub3duIHRvIGJlIGEgZGVmZW5zaXZlIGNvcHkgb2ZcbiAqIGNhbGxlciBzdXBwbGllZCBkYXRhLiBXZSByZXF1aXJlIGEgZGVmZW5zaXZlIGNvcHkgdG8gZ3VhcmQgYWdhaW5zdCBjYWxsZXJzXG4gKiBtdXRhdGluZy4gIEl0IGlzIGFsc28gYXNzdW1lZCB0aGF0IHRoZSBrZXlzIG9mIGBub3JtYWxpemVkT2JqYCBoYXZlIGJlZW5cbiAqIG5vcm1hbGl6ZWQgYW5kIGRvIG5vdCBjb250YWluIGFueSBudW1lcmljLWFwcGVhcmluZyBzdHJpbmdzLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvbXB1dGVkTGVuZ3RoIFRoZSBwcmVjb21wdXRlZCBsZW5ndGggb2YgYF9ub3JtYWxpemVkT2JqYFxuICoga2V5cy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIE9yZGVyZWRNYXBJbXBsKG5vcm1hbGl6ZWRPYmosIGNvbXB1dGVkTGVuZ3RoKSB7XG4gIHRoaXMuX25vcm1hbGl6ZWRPYmogPSBub3JtYWxpemVkT2JqO1xuICB0aGlzLl9jb21wdXRlZFBvc2l0aW9ucyA9IG51bGw7XG4gIHRoaXMubGVuZ3RoID0gY29tcHV0ZWRMZW5ndGg7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgXCJwdWJsaWNcIiBrZXkgLSB0aGF0IGlzLCBvbmUgdGhhdCB0aGUgcHVibGljIGZhY2luZyBBUEkgc3VwcGxpZXMuXG4gKiBUaGUga2V5IGlzIHRoZW4gbm9ybWFsaXplZCBmb3IgaW50ZXJuYWwgc3RvcmFnZS4gSW4gb3JkZXIgdG8gYmUgY29uc2lkZXJlZFxuICogdmFsaWQsIGFsbCBrZXlzIG11c3QgYmUgbm9uLWVtcHR5LCBkZWZpbmVkLCBub24tbnVsbCBzdHJpbmdzIG9yIG51bWJlcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc/fSBrZXkgVmFsaWRhdGVzIHRoYXQgdGhlIGtleSBpcyBzdWl0YWJsZSBmb3IgdXNlIGluIGFcbiAqIGBPcmRlcmVkTWFwYC5cbiAqIEB0aHJvd3MgRXJyb3IgaWYga2V5IGlzIG5vdCBhcHByb3ByaWF0ZSBmb3IgdXNlIGluIGBPcmRlcmVkTWFwYC5cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0VmFsaWRQdWJsaWNLZXkoa2V5KSB7XG4gICEoa2V5ICE9PSAnJyAmJiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGtleSA9PT0gJ251bWJlcicpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwOiBLZXkgbXVzdCBiZSBub24tZW1wdHksIG5vbi1udWxsIHN0cmluZyBvciBudW1iZXIuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IGFyZ3VtZW50cyB0byByYW5nZSBvcGVyYXRpb25zIGFyZSB3aXRoaW4gdGhlIGNvcnJlY3QgbGltaXRzLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTdGFydCBvZiByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggTGVuZ3RoIG9mIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGFjdHVhbExlbiBBY3R1YWwgbGVuZ3RoIG9mIHJhbmdlIHRoYXQgc2hvdWxkIG5vdCBiZVxuICogZXhjZWVkZWQuXG4gKiBAdGhyb3dzIEVycm9yIGlmIHJhbmdlIGFyZ3VtZW50cyBhcmUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gYXNzZXJ0VmFsaWRSYW5nZUluZGljZXMoc3RhcnQsIGxlbmd0aCwgYWN0dWFsTGVuKSB7XG4gICEodHlwZW9mIHN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgbGVuZ3RoID09PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBzdGFydCA+PSAwICYmIHN0YXJ0ICsgbGVuZ3RoIDw9IGFjdHVhbExlbikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcDogYG1hcFJhbmdlYCBhbmQgYGZvckVhY2hSYW5nZWAgZXhwZWN0IG5vbi1uZWdhdGl2ZSBzdGFydCBhbmQgJyArICdsZW5ndGggYXJndW1lbnRzIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoZSBpbnN0YW5jZS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogTWVyZ2VzIHR3byBcIm5vcm1hbGl6ZWRcIiBvYmplY3RzIChvYmplY3RzIHdobydzIGtleSBoYXZlIGJlZW4gbm9ybWFsaXplZCkgaW50b1xuICogYSBgT3JkZXJlZE1hcGAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgT2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBiIE9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnMuXG4gKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBuZXcgYE9yZGVyZWRNYXBgIHRoYXQgcmVzdWx0cyBpbiBtZXJnaW5nIGBhYCBhbmQgYGJgLlxuICovXG5mdW5jdGlvbiBfZnJvbU5vcm1hbGl6ZWRPYmplY3RzKGEsIGIpIHtcbiAgLy8gU2Vjb25kIG9wdGlvbmFsLCBib3RoIG11c3QgYmUgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3RzLlxuICAhKGEgJiYgYS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICYmICghYiB8fCBiLmNvbnN0cnVjdG9yID09PSBPYmplY3QpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwOiBDb3JydXB0ZWQgaW5zdGFuY2Ugb2YgT3JkZXJlZE1hcCBkZXRlY3RlZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIG5ld1NldCA9IHt9O1xuICB2YXIgbGVuZ3RoID0gMDtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gYSkge1xuICAgIGlmIChhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG5ld1NldFtrZXldID0gYVtrZXldO1xuICAgICAgbGVuZ3RoKys7XG4gICAgfVxuICB9XG5cbiAgZm9yIChrZXkgaW4gYikge1xuICAgIGlmIChiLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIC8vIEluY3JlbWVudCBsZW5ndGggaWYgbm90IGFscmVhZHkgYWRkZWQgdmlhIGZpcnN0IG9iamVjdCAoYSlcbiAgICAgIGlmICghKGtleSBpbiBuZXdTZXQpKSB7XG4gICAgICAgIGxlbmd0aCsrO1xuICAgICAgfVxuICAgICAgbmV3U2V0W2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgT3JkZXJlZE1hcEltcGwobmV3U2V0LCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIE1ldGhvZHMgZm9yIGBPcmRlcmVkTWFwYCBpbnN0YW5jZXMuXG4gKlxuICogQGxlbmRzIE9yZGVyZWRNYXAucHJvdG90eXBlXG4gKiBUT0RPOiBNYWtlIHRoaXMgZGF0YSBzdHJ1Y3R1cmUgbGF6eSwgdW5pZnkgd2l0aCBMYXp5QXJyYXkuXG4gKiBUT0RPOiBVbmlmeSB0aGlzIHdpdGggSW1tdXRhYmxlT2JqZWN0IC0gaXQgaXMgdG8gYmUgdXNlZCBpbW11dGFibHkuXG4gKiBUT0RPOiBJZiBzbywgY29uc2lkZXIgcHJvdmlkaW5nIGBmcm9tT2JqZWN0YCBBUEkuXG4gKiBUT0RPOiBDcmVhdGUgZmFzdGVyIGltcGxlbWVudGF0aW9uIG9mIG1lcmdpbmcvbWFwcGluZyBmcm9tIG9yaWdpbmFsIEFycmF5LFxuICogd2l0aG91dCBoYXZpbmcgdG8gZmlyc3QgY3JlYXRlIGFuIG9iamVjdCAtIHNpbXBseSBmb3IgdGhlIHNha2Ugb2YgbWVyZ2luZy5cbiAqL1xudmFyIE9yZGVyZWRNYXBNZXRob2RzID0ge1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4ga2V5IGlzIHByZXNlbnQgaW4gdGhlIG1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBWYWxpZCBzdHJpbmcga2V5IHRvIGxvb2t1cCBtZW1iZXJzaGlwIGZvci5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgYGtleWAgaXMgYSBtZW1iZXIgb2YgdGhlIG1hcC5cbiAgICogQHRocm93cyBFcnJvciBpZiBwcm92aWRlZCBrbm93biBpbnZhbGlkIGtleS5cbiAgICovXG4gIGhhczogZnVuY3Rpb24gKGtleSkge1xuICAgIGFzc2VydFZhbGlkUHVibGljS2V5KGtleSk7XG4gICAgdmFyIG5vcm1hbGl6ZWRLZXkgPSBQUkVGSVggKyBrZXk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRLZXkgaW4gdGhpcy5fbm9ybWFsaXplZE9iajtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb2JqZWN0IGZvciBhIGdpdmVuIGtleSwgb3IgYHVuZGVmaW5lZGAgaWYgbm90IHByZXNlbnQuIFRvXG4gICAqIGRpc3Rpbmd1aXNoIGFuIHVuZGVmaW5lZCBlbnRyeSB2cyBub3QgYmVpbmcgaW4gdGhlIHNldCwgdXNlIGBoYXMoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgU3RyaW5nIGtleSB0byBsb29rdXAgdGhlIHZhbHVlIGZvci5cbiAgICogQHJldHVybiB7T2JqZWN0P30gT2JqZWN0IGF0IGtleSBga2V5YCwgb3IgdW5kZWZpbmVkIGlmIG5vdCBpbiBtYXAuXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgcHJvdmlkZWQga25vd24gaW52YWxpZCBrZXkuXG4gICAqL1xuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBhc3NlcnRWYWxpZFB1YmxpY0tleShrZXkpO1xuICAgIHZhciBub3JtYWxpemVkS2V5ID0gUFJFRklYICsga2V5O1xuICAgIHJldHVybiB0aGlzLmhhcyhrZXkpID8gdGhpcy5fbm9ybWFsaXplZE9ialtub3JtYWxpemVkS2V5XSA6IHVuZGVmaW5lZDtcbiAgfSxcblxuICAvKipcbiAgICogTWVyZ2VzLCBhcHBlbmRpbmcgbmV3IGtleXMgdG8gdGhlIGVuZCBvZiB0aGUgb3JkZXJpbmcuIEtleXMgaW4gYG9yZGVyZWRNYXBgXG4gICAqIHRoYXQgYXJlIHJlZHVuZGFudCB3aXRoIGB0aGlzYCwgbWFpbnRhaW4gdGhlIHNhbWUgb3JkZXJpbmcgaW5kZXggdGhhdCB0aGV5XG4gICAqIGhhZCBpbiBgdGhpc2AuICBUaGlzIGlzIGhvdyBzdGFuZGFyZCBKYXZhU2NyaXB0IG9iamVjdCBtZXJnaW5nIHdvdWxkIHdvcmsuXG4gICAqIElmIHlvdSB3aXNoIHRvIHByZXBlbmQgYSBgT3JkZXJlZE1hcGAgdG8gdGhlIGJlZ2lubmluZyBvZiBhbm90aGVyXG4gICAqIGBPcmRlcmVkTWFwYCB0aGVuIHNpbXBseSByZXZlcnNlIHRoZSBvcmRlciBvZiBvcGVyYXRpb24uIFRoaXMgaXMgdGhlIGFuYWxvZ1xuICAgKiB0byBgbWVyZ2UoeCwgeSlgLlxuICAgKlxuICAgKiBAcGFyYW0ge09yZGVyZWRNYXB9IG9yZGVyZWRNYXAgT3JkZXJlZE1hcCB0byBtZXJnZSBvbnRvIHRoZSBlbmQuXG4gICAqIEByZXR1cm4ge09yZGVyZWRNYXB9IE5ldyBPcmRlcmVkTWFwIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIHRoZVxuICAgKiBtZXJnZS5cbiAgICovXG4gIG1lcmdlOiBmdW5jdGlvbiAob3JkZXJlZE1hcCkge1xuICAgICEob3JkZXJlZE1hcCBpbnN0YW5jZW9mIE9yZGVyZWRNYXBJbXBsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwLm1lcmdlKC4uLik6IEV4cGVjdGVkIGFuIE9yZGVyZWRNYXAgaW5zdGFuY2UuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBfZnJvbU5vcm1hbGl6ZWRPYmplY3RzKHRoaXMuX25vcm1hbGl6ZWRPYmosIG9yZGVyZWRNYXAuX25vcm1hbGl6ZWRPYmopO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbmFsIG1hcCBBUEkuIFJldHVybnMgYSBuZXcgYE9yZGVyZWRNYXBgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbS5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gY29udGV4dCBDb250ZXh0IHRvIGludm9rZSBjYWxsYmFjayBmcm9tLlxuICAgKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBPcmRlcmVkTWFwIHRoYXQgcmVzdWx0cyBmcm9tIG1hcHBpbmcuXG4gICAqL1xuICBtYXA6IGZ1bmN0aW9uIChjYiwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLm1hcFJhbmdlKGNiLCAwLCB0aGlzLmxlbmd0aCwgY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayBgY2JgIGlzIGludm9rZWQgd2l0aCB0aGUgYXJndW1lbnRzIChpdGVtLCBrZXksXG4gICAqIGluZGV4SW5PcmlnaW5hbCkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIERldGVybWluZXMgcmVzdWx0IGZvciBlYWNoIGl0ZW0uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTdGFydCBpbmRleCBvZiBtYXAgcmFuZ2UuXG4gICAqIEBwYXJhbSB7ZW5kfSBsZW5ndGggRW5kIGluZGV4IG9mIG1hcCByYW5nZS5cbiAgICogQHBhcmFtIHsqIT99IGNvbnRleHQgQ29udGV4dCBvZiBjYWxsYmFjayBpbnZvY2F0aW9uLlxuICAgKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBPcmRlcmVkTWFwIHJlc3VsdGluZyBmcm9tIG1hcHBpbmcgdGhlIHJhbmdlLlxuICAgKi9cbiAgbWFwUmFuZ2U6IGZ1bmN0aW9uIChjYiwgc3RhcnQsIGxlbmd0aCwgY29udGV4dCkge1xuICAgIHZhciB0aGlzU2V0ID0gdGhpcy5fbm9ybWFsaXplZE9iajtcbiAgICB2YXIgbmV3U2V0ID0ge307XG4gICAgdmFyIGkgPSAwO1xuICAgIGFzc2VydFZhbGlkUmFuZ2VJbmRpY2VzKHN0YXJ0LCBsZW5ndGgsIHRoaXMubGVuZ3RoKTtcbiAgICB2YXIgZW5kID0gc3RhcnQgKyBsZW5ndGggLSAxO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzU2V0KSB7XG4gICAgICBpZiAodGhpc1NldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChpID49IHN0YXJ0KSB7XG4gICAgICAgICAgaWYgKGkgPiBlbmQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXRlbSA9IHRoaXNTZXRba2V5XTtcbiAgICAgICAgICBuZXdTZXRba2V5XSA9IGNiLmNhbGwoY29udGV4dCwgaXRlbSwga2V5LnN1YnN0cihQUkVGSVgubGVuZ3RoKSwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IE9yZGVyZWRNYXBJbXBsKG5ld1NldCwgbGVuZ3RoKTtcbiAgfSxcblxuICAvKipcbiAgICogRnVuY3Rpb24gZmlsdGVyIEFQSS4gUmV0dXJucyBuZXcgYE9yZGVyZWRNYXBgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbS5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gY29udGV4dCBDb250ZXh0IHRvIGludm9rZSBjYWxsYmFjayBmcm9tLlxuICAgKiBAcmV0dXJuIHtPcmRlcmVkTWFwfSBPcmRlcmVkTWFwIHRoYXQgcmVzdWx0cyBmcm9tIGZpbHRlcmluZy5cbiAgICovXG4gIGZpbHRlcjogZnVuY3Rpb24gKGNiLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyUmFuZ2UoY2IsIDAsIHRoaXMubGVuZ3RoLCBjb250ZXh0KTtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIGBjYmAgaXMgaW52b2tlZCB3aXRoIHRoZSBhcmd1bWVudHMgKGl0ZW0sIGtleSxcbiAgICogaW5kZXhJbk9yaWdpbmFsKS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgUmV0dXJucyB0cnVlIGlmIGl0ZW0gc2hvdWxkIGJlIGluIHJlc3VsdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFN0YXJ0IGluZGV4IG9mIGZpbHRlciByYW5nZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBFbmQgaW5kZXggb2YgbWFwIHJhbmdlLlxuICAgKiBAcGFyYW0geyohP30gY29udGV4dCBDb250ZXh0IG9mIGNhbGxiYWNrIGludm9jYXRpb24uXG4gICAqIEByZXR1cm4ge09yZGVyZWRNYXB9IE9yZGVyZWRNYXAgcmVzdWx0aW5nIGZyb20gZmlsdGVyaW5nIHRoZSByYW5nZS5cbiAgICovXG4gIGZpbHRlclJhbmdlOiBmdW5jdGlvbiAoY2IsIHN0YXJ0LCBsZW5ndGgsIGNvbnRleHQpIHtcbiAgICB2YXIgbmV3U2V0ID0ge307XG4gICAgdmFyIG5ld1NldExlbmd0aCA9IDA7XG4gICAgdGhpcy5mb3JFYWNoUmFuZ2UoZnVuY3Rpb24gKGl0ZW0sIGtleSwgb3JpZ2luYWxJbmRleCkge1xuICAgICAgaWYgKGNiLmNhbGwoY29udGV4dCwgaXRlbSwga2V5LCBvcmlnaW5hbEluZGV4KSkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZEtleSA9IFBSRUZJWCArIGtleTtcbiAgICAgICAgbmV3U2V0W25vcm1hbGl6ZWRLZXldID0gaXRlbTtcbiAgICAgICAgbmV3U2V0TGVuZ3RoKys7XG4gICAgICB9XG4gICAgfSwgc3RhcnQsIGxlbmd0aCk7XG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkTWFwSW1wbChuZXdTZXQsIG5ld1NldExlbmd0aCk7XG4gIH0sXG5cbiAgZm9yRWFjaDogZnVuY3Rpb24gKGNiLCBjb250ZXh0KSB7XG4gICAgdGhpcy5mb3JFYWNoUmFuZ2UoY2IsIDAsIHRoaXMubGVuZ3RoLCBjb250ZXh0KTtcbiAgfSxcblxuICBmb3JFYWNoUmFuZ2U6IGZ1bmN0aW9uIChjYiwgc3RhcnQsIGxlbmd0aCwgY29udGV4dCkge1xuICAgIGFzc2VydFZhbGlkUmFuZ2VJbmRpY2VzKHN0YXJ0LCBsZW5ndGgsIHRoaXMubGVuZ3RoKTtcbiAgICB2YXIgdGhpc1NldCA9IHRoaXMuX25vcm1hbGl6ZWRPYmo7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbmQgPSBzdGFydCArIGxlbmd0aCAtIDE7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXNTZXQpIHtcbiAgICAgIGlmICh0aGlzU2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgaWYgKGkgPj0gc3RhcnQpIHtcbiAgICAgICAgICBpZiAoaSA+IGVuZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBpdGVtID0gdGhpc1NldFtrZXldO1xuICAgICAgICAgIGNiLmNhbGwoY29udGV4dCwgaXRlbSwga2V5LnN1YnN0cihQUkVGSVgubGVuZ3RoKSwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRXZlbiB0aG91Z2ggYG1hcFJhbmdlYC9gZm9yRWFjaEtleVJhbmdlYCBhbGxvdyB6ZXJvIGxlbmd0aCBtYXBwaW5ncywgd2UnbGxcbiAgICogaW1wb3NlIGFuIGFkZGl0aW9uYWwgcmVzdHJpY3Rpb24gaGVyZSB0aGF0IHRoZSBsZW5ndGggb2YgbWFwcGluZyBiZSBncmVhdGVyXG4gICAqIHRoYW4gemVybyAtIHRoZSBvbmx5IHJlYXNvbiBpcyB0aGF0IHRoZXJlIGFyZSBtYW55IHdheXMgdG8gZXhwcmVzcyBsZW5ndGhcbiAgICogemVybyBpbiB0ZXJtcyBvZiB0d28ga2V5cyBhbmQgdGhhdCBpcyBjb25mdXNpbmcuXG4gICAqL1xuICBtYXBLZXlSYW5nZTogZnVuY3Rpb24gKGNiLCBzdGFydEtleSwgZW5kS2V5LCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXJ0SW5kZXggPSB0aGlzLmluZGV4T2ZLZXkoc3RhcnRLZXkpO1xuICAgIHZhciBlbmRJbmRleCA9IHRoaXMuaW5kZXhPZktleShlbmRLZXkpO1xuICAgICEoc3RhcnRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGVuZEluZGV4ICE9PSB1bmRlZmluZWQpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ21hcEtleVJhbmdlIG11c3QgYmUgZ2l2ZW4ga2V5cyB0aGF0IGFyZSBwcmVzZW50LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAhKGVuZEluZGV4ID49IHN0YXJ0SW5kZXgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXAubWFwS2V5UmFuZ2UoLi4uKTogYGVuZEtleWAgbXVzdCBub3QgY29tZSBiZWZvcmUgYHN0YXJ0SW5kZXhgLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5tYXBSYW5nZShjYiwgc3RhcnRJbmRleCwgZW5kSW5kZXggLSBzdGFydEluZGV4ICsgMSwgY29udGV4dCk7XG4gIH0sXG5cbiAgZm9yRWFjaEtleVJhbmdlOiBmdW5jdGlvbiAoY2IsIHN0YXJ0S2V5LCBlbmRLZXksIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhcnRJbmRleCA9IHRoaXMuaW5kZXhPZktleShzdGFydEtleSk7XG4gICAgdmFyIGVuZEluZGV4ID0gdGhpcy5pbmRleE9mS2V5KGVuZEtleSk7XG4gICAgIShzdGFydEluZGV4ICE9PSB1bmRlZmluZWQgJiYgZW5kSW5kZXggIT09IHVuZGVmaW5lZCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZm9yRWFjaEtleVJhbmdlIG11c3QgYmUgZ2l2ZW4ga2V5cyB0aGF0IGFyZSBwcmVzZW50LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAhKGVuZEluZGV4ID49IHN0YXJ0SW5kZXgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXAuZm9yRWFjaEtleVJhbmdlKC4uLik6IGBlbmRLZXlgIG11c3Qgbm90IGNvbWUgYmVmb3JlICcgKyAnYHN0YXJ0SW5kZXhgLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZvckVhY2hSYW5nZShjYiwgc3RhcnRJbmRleCwgZW5kSW5kZXggLSBzdGFydEluZGV4ICsgMSwgY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3MgSW5kZXggdG8gc2VhcmNoIGZvciBrZXkgYXQuXG4gICAqIEByZXR1cm4ge3N0cmluZ3x1bmRlZmluZWR9IEVpdGhlciB0aGUga2V5IGF0IGluZGV4IGBwb3NgIG9yIHVuZGVmaW5lZCBpZlxuICAgKiBub3QgaW4gbWFwLlxuICAgKi9cbiAga2V5QXRJbmRleDogZnVuY3Rpb24gKHBvcykge1xuICAgIHZhciBjb21wdXRlZFBvc2l0aW9ucyA9IHRoaXMuX2dldE9yQ29tcHV0ZVBvc2l0aW9ucygpO1xuICAgIHZhciBrZXlBdFBvcyA9IGNvbXB1dGVkUG9zaXRpb25zLmtleUJ5SW5kZXhbcG9zXTtcbiAgICByZXR1cm4ga2V5QXRQb3MgPyBrZXlBdFBvcy5zdWJzdHIoUFJFRklYLmxlbmd0aCkgOiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgU3RyaW5nIGtleSBmcm9tIHdoaWNoIHRvIGZpbmQgdGhlIG5leHQga2V5LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBFaXRoZXIgdGhlIG5leHQga2V5LCBvciB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm9cbiAgICogbmV4dCBrZXkuXG4gICAqIEB0aHJvd3MgRXJyb3IgaWYgYGtleWAgaXMgbm90IGluIHRoaXMgYE9yZGVyZWRNYXBgLlxuICAgKi9cbiAga2V5QWZ0ZXI6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5udGhLZXlBZnRlcihrZXksIDEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZnJvbSB3aGljaCB0byBmaW5kIHRoZSBwcmVjZWRpbmcga2V5LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBFaXRoZXIgdGhlIHByZWNlZGluZyBrZXksIG9yIHVuZGVmaW5lZCBpZiB0aGVyZVxuICAgKiBpcyBubyBwcmVjZWRpbmcua2V5LlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGBrZXlgIGlzIG5vdCBpbiB0aGlzIGBPcmRlcmVkTWFwYC5cbiAgICovXG4gIGtleUJlZm9yZTogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLm50aEtleUJlZm9yZShrZXksIDEpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZnJvbSB3aGljaCB0byBmaW5kIGEgZm9sbG93aW5nIGtleS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gRGlzdGFuY2UgdG8gc2NhbiBmb3J3YXJkIGFmdGVyIGBrZXlgLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBFaXRoZXIgdGhlIG50aCBrZXkgYWZ0ZXIgYGtleWAsIG9yIHVuZGVmaW5lZCBpZlxuICAgKiB0aGVyZSBpcyBubyBuZXh0IGtleS5cbiAgICogQHRocm93cyBFcnJvciBpZiBga2V5YCBpcyBub3QgaW4gdGhpcyBgT3JkZXJlZE1hcGAuXG4gICAqL1xuICBudGhLZXlBZnRlcjogZnVuY3Rpb24gKGtleSwgbikge1xuICAgIHZhciBjdXJJbmRleCA9IHRoaXMuaW5kZXhPZktleShrZXkpO1xuICAgICEoY3VySW5kZXggIT09IHVuZGVmaW5lZCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcC5udGhLZXlBZnRlcjogVGhlIGtleSBgJXNgIGRvZXMgbm90IGV4aXN0IGluIHRoaXMgaW5zdGFuY2UuJywga2V5KSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMua2V5QXRJbmRleChjdXJJbmRleCArIG4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZnJvbSB3aGljaCB0byBmaW5kIGEgcHJlY2VkaW5nIGtleS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gRGlzdGFuY2UgdG8gc2NhbiBiYWNrd2FyZHMgYmVmb3JlIGBrZXlgLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8dW5kZWZpbmVkfSBFaXRoZXIgdGhlIG50aCBrZXkgYmVmb3JlIGBrZXlgLCBvciB1bmRlZmluZWQgaWZcbiAgICogdGhlcmUgaXMgbm8gcHJldmlvdXMga2V5LlxuICAgKiBAdGhyb3dzIEVycm9yIGlmIGBrZXlgIGlzIG5vdCBpbiB0aGlzIGBPcmRlcmVkTWFwYC5cbiAgICovXG4gIG50aEtleUJlZm9yZTogZnVuY3Rpb24gKGtleSwgbikge1xuICAgIHJldHVybiB0aGlzLm50aEtleUFmdGVyKGtleSwgLW4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEtleSB0byBmaW5kIHRoZSBpbmRleCBvZi5cbiAgICogQHJldHVybiB7bnVtYmVyfHVuZGVmaW5lZH0gSW5kZXggb2YgdGhlIHByb3ZpZGVkIGtleSwgb3IgYHVuZGVmaW5lZGAgaWYgdGhlXG4gICAqIGtleSBpcyBub3QgZm91bmQuXG4gICAqL1xuICBpbmRleE9mS2V5OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgYXNzZXJ0VmFsaWRQdWJsaWNLZXkoa2V5KTtcbiAgICB2YXIgbm9ybWFsaXplZEtleSA9IFBSRUZJWCArIGtleTtcbiAgICB2YXIgY29tcHV0ZWRQb3NpdGlvbnMgPSB0aGlzLl9nZXRPckNvbXB1dGVQb3NpdGlvbnMoKTtcbiAgICB2YXIgY29tcHV0ZWRQb3NpdGlvbiA9IGNvbXB1dGVkUG9zaXRpb25zLmluZGV4QnlLZXlbbm9ybWFsaXplZEtleV07XG4gICAgLy8gSnVzdCB3cml0aW5nIGl0IHRoaXMgd2F5IHRvIG1ha2UgaXQgY2xlYXIgdGhpcyBpcyBpbnRlbnRpb25hbC5cbiAgICByZXR1cm4gY29tcHV0ZWRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29tcHV0ZWRQb3NpdGlvbjtcbiAgfSxcblxuICAvKipcbiAgICogQHJldHVybiB7QXJyYXl9IEFuIG9yZGVyZWQgYXJyYXkgb2YgdGhpcyBvYmplY3QncyB2YWx1ZXMuXG4gICAqL1xuICB0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciB0aGlzU2V0ID0gdGhpcy5fbm9ybWFsaXplZE9iajtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpc1NldCkge1xuICAgICAgaWYgKHRoaXNTZXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzU2V0W2tleV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUga2V5IGF0IGEgZ2l2ZW4gcG9zaXRpb24sIG9yIGluZGljYXRlcyB2aWEgYHVuZGVmaW5lZGAgdGhhdCB0aGF0XG4gICAqIHBvc2l0aW9uIGRvZXMgbm90IGV4aXN0IGluIHRoZSBgT3JkZXJlZE1hcGAuIEl0IGlzIGFwcHJvcHJpYXRlIHRvIHJldHVyblxuICAgKiB1bmRlZmluZWQsIGluZGljYXRpbmcgdGhhdCB0aGUga2V5IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGBPcmRlcmVkTWFwYFxuICAgKiBiZWNhdXNlIGB1bmRlZmluZWRgIGlzIG5vdCBldmVyIGEgdmFsaWQgYE9yZGVyZWRNYXBgIGtleS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybiB7c3RyaW5nP30gTmFtZSBvZiB0aGUgaXRlbSBhdCBwb3NpdGlvbiBgcG9zYCwgb3IgYHVuZGVmaW5lZGAgaWZcbiAgICogdGhlcmUgaXMgbm8gaXRlbSBhdCB0aGF0IHBvc2l0aW9uLlxuICAgKi9cbiAgX2dldE9yQ29tcHV0ZVBvc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IEVudGVydGFpbiBjb21wdXRpbmcgdGhpcyBhdCBjb25zdHJ1Y3Rpb24gdGltZSBpbiBzb21lIGxlc3NcbiAgICAvLyBwZXJmb3JtYW5jZSBjcml0aWNhbCBwYXRocy5cbiAgICB2YXIgY29tcHV0ZWRQb3NpdGlvbnMgPSB0aGlzLl9jb21wdXRlZFBvc2l0aW9ucztcbiAgICBpZiAoIWNvbXB1dGVkUG9zaXRpb25zKSB7XG4gICAgICB0aGlzLl9jb21wdXRlUG9zaXRpb25zKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb21wdXRlZFBvc2l0aW9ucztcbiAgfSxcblxuICAvKipcbiAgICogUHJlY29tcHV0ZXMgdGhlIGluZGV4L2tleSBtYXBwaW5nIGZvciBmdXR1cmUgbG9va3VwLiBTaW5jZSBgT3JkZXJlZE1hcGBzXG4gICAqIGFyZSBpbW11dGFibGUsIHRoZXJlIGlzIG9ubHkgZXZlciBhIG5lZWQgdG8gcGVyZm9ybSB0aGlzIG9uY2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcHV0ZVBvc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2NvbXB1dGVkUG9zaXRpb25zID0ge1xuICAgICAga2V5QnlJbmRleDoge30sXG4gICAgICBpbmRleEJ5S2V5OiB7fVxuICAgIH07XG4gICAgdmFyIGtleUJ5SW5kZXggPSB0aGlzLl9jb21wdXRlZFBvc2l0aW9ucy5rZXlCeUluZGV4O1xuICAgIHZhciBpbmRleEJ5S2V5ID0gdGhpcy5fY29tcHV0ZWRQb3NpdGlvbnMuaW5kZXhCeUtleTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciB0aGlzU2V0ID0gdGhpcy5fbm9ybWFsaXplZE9iajtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpc1NldCkge1xuICAgICAgaWYgKHRoaXNTZXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBrZXlCeUluZGV4W2luZGV4XSA9IGtleTtcbiAgICAgICAgaW5kZXhCeUtleVtrZXldID0gaW5kZXg7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5hc3NpZ24oT3JkZXJlZE1hcEltcGwucHJvdG90eXBlLCBPcmRlcmVkTWFwTWV0aG9kcyk7XG5cbnZhciBPcmRlcmVkTWFwID0ge1xuICBmcm9tOiBmdW5jdGlvbiAob3JkZXJlZE1hcCkge1xuICAgICEob3JkZXJlZE1hcCBpbnN0YW5jZW9mIE9yZGVyZWRNYXBJbXBsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdPcmRlcmVkTWFwLmZyb20oLi4uKTogRXhwZWN0ZWQgYW4gT3JkZXJlZE1hcCBpbnN0YW5jZS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIF9mcm9tTm9ybWFsaXplZE9iamVjdHMob3JkZXJlZE1hcC5fbm9ybWFsaXplZE9iaiwgbnVsbCk7XG4gIH0sXG5cbiAgZnJvbUFycmF5OiBmdW5jdGlvbiAoYXJyLCBrZXlFeHRyYWN0b3IpIHtcbiAgICAhQXJyYXkuaXNBcnJheShhcnIpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ09yZGVyZWRNYXAuZnJvbUFycmF5KC4uLik6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXkuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICEodHlwZW9mIGtleUV4dHJhY3RvciA9PT0gJ2Z1bmN0aW9uJykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT3JkZXJlZE1hcC5mcm9tQXJyYXkoLi4uKTogU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbiB1c2VkICcgKyAndG8gZGV0ZXJtaW5lIHRoZSB1bmlxdWUga2V5IGZvciBlYWNoIGVudHJ5LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbmV3IE9yZGVyZWRNYXBJbXBsKGV4dHJhY3RPYmplY3RGcm9tQXJyYXkoYXJyLCBrZXlFeHRyYWN0b3IpLCBhcnIubGVuZ3RoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcmRlcmVkTWFwOyJdfQ==