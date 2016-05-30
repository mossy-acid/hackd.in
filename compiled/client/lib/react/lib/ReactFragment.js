/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactFragment
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactChildren = require('./ReactChildren');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * We used to allow keyed objects to serve as a collection of ReactElements,
 * or nested sets. This allowed us a way to explicitly key a set a fragment of
 * components. This is now being replaced with an opaque data structure.
 * The upgrade path is to call React.addons.createFragment({ key: value }) to
 * create a keyed fragment. The resulting data structure is an array.
 */

var numericPropertyRegex = /^\d+$/;

var warnedAboutNumeric = false;

var ReactFragment = {
  // Wrap a keyed object in an opaque proxy that warns you if you access any
  // of its properties.
  create: function create(object) {
    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || !object || Array.isArray(object)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'React.addons.createFragment only accepts a single object. Got: %s', object) : undefined;
      return object;
    }
    if (ReactElement.isValidElement(object)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'React.addons.createFragment does not accept a ReactElement ' + 'without a wrapper object.') : undefined;
      return object;
    }

    !(object.nodeType !== 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.addons.createFragment(...): Encountered an invalid child; DOM ' + 'elements are not valid children of React components.') : invariant(false) : undefined;

    var result = [];

    for (var key in object) {
      if (process.env.NODE_ENV !== 'production') {
        if (!warnedAboutNumeric && numericPropertyRegex.test(key)) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'React.addons.createFragment(...): Child objects should have ' + 'non-numeric keys so ordering is preserved.') : undefined;
          warnedAboutNumeric = true;
        }
      }
      ReactChildren.mapIntoWithKeyPrefixInternal(object[key], result, key, emptyFunction.thatReturnsArgument);
    }

    return result;
  }
};

module.exports = ReactFragment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RnJhZ21lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7OztBQUVBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7QUFDQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjs7QUFFQSxJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQXBCO0FBQ0EsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7QUFDQSxJQUFJLFVBQVUsUUFBUSxrQkFBUixDQUFkOzs7Ozs7Ozs7O0FBVUEsSUFBSSx1QkFBdUIsT0FBM0I7O0FBRUEsSUFBSSxxQkFBcUIsS0FBekI7O0FBRUEsSUFBSSxnQkFBZ0I7OztBQUdsQixVQUFRLGdCQUFVLE1BQVYsRUFBa0I7QUFDeEIsUUFBSSxRQUFPLE1BQVAseUNBQU8sTUFBUCxPQUFrQixRQUFsQixJQUE4QixDQUFDLE1BQS9CLElBQXlDLE1BQU0sT0FBTixDQUFjLE1BQWQsQ0FBN0MsRUFBb0U7QUFDbEUsY0FBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLEtBQVIsRUFBZSxtRUFBZixFQUFvRixNQUFwRixDQUF4QyxHQUFzSSxTQUF0STtBQUNBLGFBQU8sTUFBUDtBQUNEO0FBQ0QsUUFBSSxhQUFhLGNBQWIsQ0FBNEIsTUFBNUIsQ0FBSixFQUF5QztBQUN2QyxjQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQVEsS0FBUixFQUFlLGdFQUFnRSwyQkFBL0UsQ0FBeEMsR0FBc0osU0FBdEo7QUFDQSxhQUFPLE1BQVA7QUFDRDs7QUFFRCxNQUFFLE9BQU8sUUFBUCxLQUFvQixDQUF0QixJQUEyQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQix5RUFBeUUsc0RBQTFGLENBQXhDLEdBQTRMLFVBQVUsS0FBVixDQUF2TixHQUEwTyxTQUExTzs7QUFFQSxRQUFJLFNBQVMsRUFBYjs7QUFFQSxTQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUN0QixVQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsWUFBSSxDQUFDLGtCQUFELElBQXVCLHFCQUFxQixJQUFyQixDQUEwQixHQUExQixDQUEzQixFQUEyRDtBQUN6RCxrQkFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLEtBQVIsRUFBZSxpRUFBaUUsNENBQWhGLENBQXhDLEdBQXdLLFNBQXhLO0FBQ0EsK0JBQXFCLElBQXJCO0FBQ0Q7QUFDRjtBQUNELG9CQUFjLDRCQUFkLENBQTJDLE9BQU8sR0FBUCxDQUEzQyxFQUF3RCxNQUF4RCxFQUFnRSxHQUFoRSxFQUFxRSxjQUFjLG1CQUFuRjtBQUNEOztBQUVELFdBQU8sTUFBUDtBQUNEO0FBNUJpQixDQUFwQjs7QUErQkEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6IlJlYWN0RnJhZ21lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RnJhZ21lbnRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdENoaWxkcmVuID0gcmVxdWlyZSgnLi9SZWFjdENoaWxkcmVuJyk7XG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxuLyoqXG4gKiBXZSB1c2VkIHRvIGFsbG93IGtleWVkIG9iamVjdHMgdG8gc2VydmUgYXMgYSBjb2xsZWN0aW9uIG9mIFJlYWN0RWxlbWVudHMsXG4gKiBvciBuZXN0ZWQgc2V0cy4gVGhpcyBhbGxvd2VkIHVzIGEgd2F5IHRvIGV4cGxpY2l0bHkga2V5IGEgc2V0IGEgZnJhZ21lbnQgb2ZcbiAqIGNvbXBvbmVudHMuIFRoaXMgaXMgbm93IGJlaW5nIHJlcGxhY2VkIHdpdGggYW4gb3BhcXVlIGRhdGEgc3RydWN0dXJlLlxuICogVGhlIHVwZ3JhZGUgcGF0aCBpcyB0byBjYWxsIFJlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCh7IGtleTogdmFsdWUgfSkgdG9cbiAqIGNyZWF0ZSBhIGtleWVkIGZyYWdtZW50LiBUaGUgcmVzdWx0aW5nIGRhdGEgc3RydWN0dXJlIGlzIGFuIGFycmF5LlxuICovXG5cbnZhciBudW1lcmljUHJvcGVydHlSZWdleCA9IC9eXFxkKyQvO1xuXG52YXIgd2FybmVkQWJvdXROdW1lcmljID0gZmFsc2U7XG5cbnZhciBSZWFjdEZyYWdtZW50ID0ge1xuICAvLyBXcmFwIGEga2V5ZWQgb2JqZWN0IGluIGFuIG9wYXF1ZSBwcm94eSB0aGF0IHdhcm5zIHlvdSBpZiB5b3UgYWNjZXNzIGFueVxuICAvLyBvZiBpdHMgcHJvcGVydGllcy5cbiAgY3JlYXRlOiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnIHx8ICFvYmplY3QgfHwgQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCBvbmx5IGFjY2VwdHMgYSBzaW5nbGUgb2JqZWN0LiBHb3Q6ICVzJywgb2JqZWN0KSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGlmIChSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQob2JqZWN0KSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQgZG9lcyBub3QgYWNjZXB0IGEgUmVhY3RFbGVtZW50ICcgKyAnd2l0aG91dCBhIHdyYXBwZXIgb2JqZWN0LicpIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAhKG9iamVjdC5ub2RlVHlwZSAhPT0gMSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50KC4uLik6IEVuY291bnRlcmVkIGFuIGludmFsaWQgY2hpbGQ7IERPTSAnICsgJ2VsZW1lbnRzIGFyZSBub3QgdmFsaWQgY2hpbGRyZW4gb2YgUmVhY3QgY29tcG9uZW50cy4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAoIXdhcm5lZEFib3V0TnVtZXJpYyAmJiBudW1lcmljUHJvcGVydHlSZWdleC50ZXN0KGtleSkpIHtcbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCguLi4pOiBDaGlsZCBvYmplY3RzIHNob3VsZCBoYXZlICcgKyAnbm9uLW51bWVyaWMga2V5cyBzbyBvcmRlcmluZyBpcyBwcmVzZXJ2ZWQuJykgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgd2FybmVkQWJvdXROdW1lcmljID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgUmVhY3RDaGlsZHJlbi5tYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG9iamVjdFtrZXldLCByZXN1bHQsIGtleSwgZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RnJhZ21lbnQ7Il19