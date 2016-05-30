/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

'use strict';

/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function shouldUpdateReactComponent(prevElement, nextElement) {
  var prevEmpty = prevElement === null || prevElement === false;
  var nextEmpty = nextElement === null || nextElement === false;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  var prevType = typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement);
  var nextType = typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement);
  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
  }
  return false;
}

module.exports = shouldUpdateReactComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3Nob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUywwQkFBVCxDQUFvQyxXQUFwQyxFQUFpRCxXQUFqRCxFQUE4RDtBQUM1RCxNQUFJLFlBQVksZ0JBQWdCLElBQWhCLElBQXdCLGdCQUFnQixLQUF4RDtBQUNBLE1BQUksWUFBWSxnQkFBZ0IsSUFBaEIsSUFBd0IsZ0JBQWdCLEtBQXhEO0FBQ0EsTUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFdBQU8sY0FBYyxTQUFyQjtBQUNEOztBQUVELE1BQUksa0JBQWtCLFdBQWxCLHlDQUFrQixXQUFsQixDQUFKO0FBQ0EsTUFBSSxrQkFBa0IsV0FBbEIseUNBQWtCLFdBQWxCLENBQUo7QUFDQSxNQUFJLGFBQWEsUUFBYixJQUF5QixhQUFhLFFBQTFDLEVBQW9EO0FBQ2xELFdBQU8sYUFBYSxRQUFiLElBQXlCLGFBQWEsUUFBN0M7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPLGFBQWEsUUFBYixJQUF5QixZQUFZLElBQVosS0FBcUIsWUFBWSxJQUExRCxJQUFrRSxZQUFZLEdBQVosS0FBb0IsWUFBWSxHQUF6RztBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLDBCQUFqQiIsImZpbGUiOiJzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudFxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogR2l2ZW4gYSBgcHJldkVsZW1lbnRgIGFuZCBgbmV4dEVsZW1lbnRgLCBkZXRlcm1pbmVzIGlmIHRoZSBleGlzdGluZ1xuICogaW5zdGFuY2Ugc2hvdWxkIGJlIHVwZGF0ZWQgYXMgb3Bwb3NlZCB0byBiZWluZyBkZXN0cm95ZWQgb3IgcmVwbGFjZWQgYnkgYSBuZXdcbiAqIGluc3RhbmNlLiBCb3RoIGFyZ3VtZW50cyBhcmUgZWxlbWVudHMuIFRoaXMgZW5zdXJlcyB0aGF0IHRoaXMgbG9naWMgY2FuXG4gKiBvcGVyYXRlIG9uIHN0YXRlbGVzcyB0cmVlcyB3aXRob3V0IGFueSBiYWNraW5nIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gcHJldkVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gbmV4dEVsZW1lbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGV4aXN0aW5nIGluc3RhbmNlIHNob3VsZCBiZSB1cGRhdGVkLlxuICogQHByb3RlY3RlZFxuICovXG5mdW5jdGlvbiBzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudChwcmV2RWxlbWVudCwgbmV4dEVsZW1lbnQpIHtcbiAgdmFyIHByZXZFbXB0eSA9IHByZXZFbGVtZW50ID09PSBudWxsIHx8IHByZXZFbGVtZW50ID09PSBmYWxzZTtcbiAgdmFyIG5leHRFbXB0eSA9IG5leHRFbGVtZW50ID09PSBudWxsIHx8IG5leHRFbGVtZW50ID09PSBmYWxzZTtcbiAgaWYgKHByZXZFbXB0eSB8fCBuZXh0RW1wdHkpIHtcbiAgICByZXR1cm4gcHJldkVtcHR5ID09PSBuZXh0RW1wdHk7XG4gIH1cblxuICB2YXIgcHJldlR5cGUgPSB0eXBlb2YgcHJldkVsZW1lbnQ7XG4gIHZhciBuZXh0VHlwZSA9IHR5cGVvZiBuZXh0RWxlbWVudDtcbiAgaWYgKHByZXZUeXBlID09PSAnc3RyaW5nJyB8fCBwcmV2VHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbmV4dFR5cGUgPT09ICdzdHJpbmcnIHx8IG5leHRUeXBlID09PSAnbnVtYmVyJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV4dFR5cGUgPT09ICdvYmplY3QnICYmIHByZXZFbGVtZW50LnR5cGUgPT09IG5leHRFbGVtZW50LnR5cGUgJiYgcHJldkVsZW1lbnQua2V5ID09PSBuZXh0RWxlbWVudC5rZXk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50OyJdfQ==