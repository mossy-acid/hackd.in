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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3Nob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUywwQkFBVCxDQUFvQyxXQUFwQyxFQUFpRCxXQUFqRCxFQUE4RDtBQUM1RCxNQUFJLFlBQVksZ0JBQWdCLElBQWhCLElBQXdCLGdCQUFnQixLQUFoQixDQURvQjtBQUU1RCxNQUFJLFlBQVksZ0JBQWdCLElBQWhCLElBQXdCLGdCQUFnQixLQUFoQixDQUZvQjtBQUc1RCxNQUFJLGFBQWEsU0FBYixFQUF3QjtBQUMxQixXQUFPLGNBQWMsU0FBZCxDQURtQjtHQUE1Qjs7QUFJQSxNQUFJLGtCQUFrQixnRUFBbEIsQ0FQd0Q7QUFRNUQsTUFBSSxrQkFBa0IsZ0VBQWxCLENBUndEO0FBUzVELE1BQUksYUFBYSxRQUFiLElBQXlCLGFBQWEsUUFBYixFQUF1QjtBQUNsRCxXQUFPLGFBQWEsUUFBYixJQUF5QixhQUFhLFFBQWIsQ0FEa0I7R0FBcEQsTUFFTztBQUNMLFdBQU8sYUFBYSxRQUFiLElBQXlCLFlBQVksSUFBWixLQUFxQixZQUFZLElBQVosSUFBb0IsWUFBWSxHQUFaLEtBQW9CLFlBQVksR0FBWixDQUR4RjtHQUZQO0FBS0EsU0FBTyxLQUFQLENBZDREO0NBQTlEOztBQWlCQSxPQUFPLE9BQVAsR0FBaUIsMEJBQWpCIiwiZmlsZSI6InNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50XG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBHaXZlbiBhIGBwcmV2RWxlbWVudGAgYW5kIGBuZXh0RWxlbWVudGAsIGRldGVybWluZXMgaWYgdGhlIGV4aXN0aW5nXG4gKiBpbnN0YW5jZSBzaG91bGQgYmUgdXBkYXRlZCBhcyBvcHBvc2VkIHRvIGJlaW5nIGRlc3Ryb3llZCBvciByZXBsYWNlZCBieSBhIG5ld1xuICogaW5zdGFuY2UuIEJvdGggYXJndW1lbnRzIGFyZSBlbGVtZW50cy4gVGhpcyBlbnN1cmVzIHRoYXQgdGhpcyBsb2dpYyBjYW5cbiAqIG9wZXJhdGUgb24gc3RhdGVsZXNzIHRyZWVzIHdpdGhvdXQgYW55IGJhY2tpbmcgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBwcmV2RWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBuZXh0RWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgZXhpc3RpbmcgaW5zdGFuY2Ugc2hvdWxkIGJlIHVwZGF0ZWQuXG4gKiBAcHJvdGVjdGVkXG4gKi9cbmZ1bmN0aW9uIHNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50KHByZXZFbGVtZW50LCBuZXh0RWxlbWVudCkge1xuICB2YXIgcHJldkVtcHR5ID0gcHJldkVsZW1lbnQgPT09IG51bGwgfHwgcHJldkVsZW1lbnQgPT09IGZhbHNlO1xuICB2YXIgbmV4dEVtcHR5ID0gbmV4dEVsZW1lbnQgPT09IG51bGwgfHwgbmV4dEVsZW1lbnQgPT09IGZhbHNlO1xuICBpZiAocHJldkVtcHR5IHx8IG5leHRFbXB0eSkge1xuICAgIHJldHVybiBwcmV2RW1wdHkgPT09IG5leHRFbXB0eTtcbiAgfVxuXG4gIHZhciBwcmV2VHlwZSA9IHR5cGVvZiBwcmV2RWxlbWVudDtcbiAgdmFyIG5leHRUeXBlID0gdHlwZW9mIG5leHRFbGVtZW50O1xuICBpZiAocHJldlR5cGUgPT09ICdzdHJpbmcnIHx8IHByZXZUeXBlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBuZXh0VHlwZSA9PT0gJ3N0cmluZycgfHwgbmV4dFR5cGUgPT09ICdudW1iZXInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXh0VHlwZSA9PT0gJ29iamVjdCcgJiYgcHJldkVsZW1lbnQudHlwZSA9PT0gbmV4dEVsZW1lbnQudHlwZSAmJiBwcmV2RWxlbWVudC5rZXkgPT09IG5leHRFbGVtZW50LmtleTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXBkYXRlUmVhY3RDb21wb25lbnQ7Il19