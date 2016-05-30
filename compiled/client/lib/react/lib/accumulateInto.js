/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulateInto
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 *
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : invariant(false) : undefined;
  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  var currentIsArray = Array.isArray(current);
  var nextIsArray = Array.isArray(next);

  if (currentIsArray && nextIsArray) {
    current.push.apply(current, next);
    return current;
  }

  if (currentIsArray) {
    current.push(next);
    return current;
  }

  if (nextIsArray) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2FjY3VtdWxhdGVJbnRvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsU0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLElBQWpDLEVBQXVDO0FBQ3JDLElBQUUsUUFBUSxJQUFWLElBQWtCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHVFQUFqQixDQUF4QyxHQUFvSSxVQUFVLEtBQVYsQ0FBdEosR0FBeUssU0FBeks7QUFDQSxNQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixXQUFPLElBQVA7QUFDRDs7OztBQUlELE1BQUksaUJBQWlCLE1BQU0sT0FBTixDQUFjLE9BQWQsQ0FBckI7QUFDQSxNQUFJLGNBQWMsTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFsQjs7QUFFQSxNQUFJLGtCQUFrQixXQUF0QixFQUFtQztBQUNqQyxZQUFRLElBQVIsQ0FBYSxLQUFiLENBQW1CLE9BQW5CLEVBQTRCLElBQTVCO0FBQ0EsV0FBTyxPQUFQO0FBQ0Q7O0FBRUQsTUFBSSxjQUFKLEVBQW9CO0FBQ2xCLFlBQVEsSUFBUixDQUFhLElBQWI7QUFDQSxXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFJLFdBQUosRUFBaUI7O0FBRWYsV0FBTyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWlCLElBQWpCLENBQVA7QUFDRDs7QUFFRCxTQUFPLENBQUMsT0FBRCxFQUFVLElBQVYsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJhY2N1bXVsYXRlSW50by5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBhY2N1bXVsYXRlSW50b1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqXG4gKiBBY2N1bXVsYXRlcyBpdGVtcyB0aGF0IG11c3Qgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkIGludG8gdGhlIGZpcnN0IG9uZS4gVGhpc1xuICogaXMgdXNlZCB0byBjb25zZXJ2ZSBtZW1vcnkgYnkgYXZvaWRpbmcgYXJyYXkgYWxsb2NhdGlvbnMsIGFuZCB0aHVzIHNhY3JpZmljZXNcbiAqIEFQSSBjbGVhbm5lc3MuIFNpbmNlIGBjdXJyZW50YCBjYW4gYmUgbnVsbCBiZWZvcmUgYmVpbmcgcGFzc2VkIGluIGFuZCBub3RcbiAqIG51bGwgYWZ0ZXIgdGhpcyBmdW5jdGlvbiwgbWFrZSBzdXJlIHRvIGFzc2lnbiBpdCBiYWNrIHRvIGBjdXJyZW50YDpcbiAqXG4gKiBgYSA9IGFjY3VtdWxhdGVJbnRvKGEsIGIpO2BcbiAqXG4gKiBUaGlzIEFQSSBzaG91bGQgYmUgc3BhcmluZ2x5IHVzZWQuIFRyeSBgYWNjdW11bGF0ZWAgZm9yIHNvbWV0aGluZyBjbGVhbmVyLlxuICpcbiAqIEByZXR1cm4geyp8YXJyYXk8Kj59IEFuIGFjY3VtdWxhdGlvbiBvZiBpdGVtcy5cbiAqL1xuXG5mdW5jdGlvbiBhY2N1bXVsYXRlSW50byhjdXJyZW50LCBuZXh0KSB7XG4gICEobmV4dCAhPSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdhY2N1bXVsYXRlSW50byguLi4pOiBBY2N1bXVsYXRlZCBpdGVtcyBtdXN0IG5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIC8vIEJvdGggYXJlIG5vdCBlbXB0eS4gV2FybmluZzogTmV2ZXIgY2FsbCB4LmNvbmNhdCh5KSB3aGVuIHlvdSBhcmUgbm90XG4gIC8vIGNlcnRhaW4gdGhhdCB4IGlzIGFuIEFycmF5ICh4IGNvdWxkIGJlIGEgc3RyaW5nIHdpdGggY29uY2F0IG1ldGhvZCkuXG4gIHZhciBjdXJyZW50SXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY3VycmVudCk7XG4gIHZhciBuZXh0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkobmV4dCk7XG5cbiAgaWYgKGN1cnJlbnRJc0FycmF5ICYmIG5leHRJc0FycmF5KSB7XG4gICAgY3VycmVudC5wdXNoLmFwcGx5KGN1cnJlbnQsIG5leHQpO1xuICAgIHJldHVybiBjdXJyZW50O1xuICB9XG5cbiAgaWYgKGN1cnJlbnRJc0FycmF5KSB7XG4gICAgY3VycmVudC5wdXNoKG5leHQpO1xuICAgIHJldHVybiBjdXJyZW50O1xuICB9XG5cbiAgaWYgKG5leHRJc0FycmF5KSB7XG4gICAgLy8gQSBiaXQgdG9vIGRhbmdlcm91cyB0byBtdXRhdGUgYG5leHRgLlxuICAgIHJldHVybiBbY3VycmVudF0uY29uY2F0KG5leHQpO1xuICB9XG5cbiAgcmV0dXJuIFtjdXJyZW50LCBuZXh0XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhY2N1bXVsYXRlSW50bzsiXX0=