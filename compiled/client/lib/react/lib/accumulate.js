/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulate
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */
function accumulate(current, next) {
  !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'accumulate(...): Accumulated items must be not be null or undefined.') : invariant(false) : undefined;
  if (current == null) {
    return next;
  } else {
    // Both are not empty. Warning: Never call x.concat(y) when you are not
    // certain that x is an Array (x could be a string with concat method).
    var currentIsArray = Array.isArray(current);
    var nextIsArray = Array.isArray(next);
    if (currentIsArray) {
      return current.concat(next);
    } else {
      if (nextIsArray) {
        return [current].concat(next);
      } else {
        return [current, next];
      }
    }
  }
}

module.exports = accumulate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2FjY3VtdWxhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjs7Ozs7Ozs7O0FBU0EsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLElBQUUsUUFBUSxJQUFWLElBQWtCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHNFQUFqQixDQUF4QyxHQUFtSSxVQUFVLEtBQVYsQ0FBckosR0FBd0ssU0FBeEs7QUFDQSxNQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixXQUFPLElBQVA7QUFDRCxHQUZELE1BRU87OztBQUdMLFFBQUksaUJBQWlCLE1BQU0sT0FBTixDQUFjLE9BQWQsQ0FBckI7QUFDQSxRQUFJLGNBQWMsTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFsQjtBQUNBLFFBQUksY0FBSixFQUFvQjtBQUNsQixhQUFPLFFBQVEsTUFBUixDQUFlLElBQWYsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksV0FBSixFQUFpQjtBQUNmLGVBQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFpQixJQUFqQixDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxDQUFDLE9BQUQsRUFBVSxJQUFWLENBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiYWNjdW11bGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBhY2N1bXVsYXRlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbi8qKlxuICogQWNjdW11bGF0ZXMgaXRlbXMgdGhhdCBtdXN0IG5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZC5cbiAqXG4gKiBUaGlzIGlzIHVzZWQgdG8gY29uc2VydmUgbWVtb3J5IGJ5IGF2b2lkaW5nIGFycmF5IGFsbG9jYXRpb25zLlxuICpcbiAqIEByZXR1cm4geyp8YXJyYXk8Kj59IEFuIGFjY3VtdWxhdGlvbiBvZiBpdGVtcy5cbiAqL1xuZnVuY3Rpb24gYWNjdW11bGF0ZShjdXJyZW50LCBuZXh0KSB7XG4gICEobmV4dCAhPSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdhY2N1bXVsYXRlKC4uLik6IEFjY3VtdWxhdGVkIGl0ZW1zIG11c3QgYmUgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgIHJldHVybiBuZXh0O1xuICB9IGVsc2Uge1xuICAgIC8vIEJvdGggYXJlIG5vdCBlbXB0eS4gV2FybmluZzogTmV2ZXIgY2FsbCB4LmNvbmNhdCh5KSB3aGVuIHlvdSBhcmUgbm90XG4gICAgLy8gY2VydGFpbiB0aGF0IHggaXMgYW4gQXJyYXkgKHggY291bGQgYmUgYSBzdHJpbmcgd2l0aCBjb25jYXQgbWV0aG9kKS5cbiAgICB2YXIgY3VycmVudElzQXJyYXkgPSBBcnJheS5pc0FycmF5KGN1cnJlbnQpO1xuICAgIHZhciBuZXh0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkobmV4dCk7XG4gICAgaWYgKGN1cnJlbnRJc0FycmF5KSB7XG4gICAgICByZXR1cm4gY3VycmVudC5jb25jYXQobmV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXh0SXNBcnJheSkge1xuICAgICAgICByZXR1cm4gW2N1cnJlbnRdLmNvbmNhdChuZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbY3VycmVudCwgbmV4dF07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWNjdW11bGF0ZTsiXX0=