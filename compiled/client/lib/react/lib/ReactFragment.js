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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RnJhZ21lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7OztBQUVBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBaEI7QUFDSixJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFmOztBQUVKLElBQUksZ0JBQWdCLFFBQVEsd0JBQVIsQ0FBaEI7QUFDSixJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaO0FBQ0osSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBVjs7Ozs7Ozs7OztBQVVKLElBQUksdUJBQXVCLE9BQXZCOztBQUVKLElBQUkscUJBQXFCLEtBQXJCOztBQUVKLElBQUksZ0JBQWdCOzs7QUFHbEIsVUFBUSxnQkFBVSxNQUFWLEVBQWtCO0FBQ3hCLFFBQUksUUFBTyx1REFBUCxLQUFrQixRQUFsQixJQUE4QixDQUFDLE1BQUQsSUFBVyxNQUFNLE9BQU4sQ0FBYyxNQUFkLENBQXpDLEVBQWdFO0FBQ2xFLGNBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxLQUFSLEVBQWUsbUVBQWYsRUFBb0YsTUFBcEYsQ0FBeEMsR0FBc0ksU0FBdEksQ0FEa0U7QUFFbEUsYUFBTyxNQUFQLENBRmtFO0tBQXBFO0FBSUEsUUFBSSxhQUFhLGNBQWIsQ0FBNEIsTUFBNUIsQ0FBSixFQUF5QztBQUN2QyxjQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQVEsS0FBUixFQUFlLGdFQUFnRSwyQkFBaEUsQ0FBdkQsR0FBc0osU0FBdEosQ0FEdUM7QUFFdkMsYUFBTyxNQUFQLENBRnVDO0tBQXpDOztBQUtBLE1BQUUsT0FBTyxRQUFQLEtBQW9CLENBQXBCLENBQUYsR0FBMkIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIseUVBQXlFLHNEQUF6RSxDQUF6RCxHQUE0TCxVQUFVLEtBQVYsQ0FBNUwsR0FBK00sU0FBMU8sQ0FWd0I7O0FBWXhCLFFBQUksU0FBUyxFQUFULENBWm9COztBQWN4QixTQUFLLElBQUksR0FBSixJQUFXLE1BQWhCLEVBQXdCO0FBQ3RCLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixFQUF1QztBQUN6QyxZQUFJLENBQUMsa0JBQUQsSUFBdUIscUJBQXFCLElBQXJCLENBQTBCLEdBQTFCLENBQXZCLEVBQXVEO0FBQ3pELGtCQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQVEsS0FBUixFQUFlLGlFQUFpRSw0Q0FBakUsQ0FBdkQsR0FBd0ssU0FBeEssQ0FEeUQ7QUFFekQsK0JBQXFCLElBQXJCLENBRnlEO1NBQTNEO09BREY7QUFNQSxvQkFBYyw0QkFBZCxDQUEyQyxPQUFPLEdBQVAsQ0FBM0MsRUFBd0QsTUFBeEQsRUFBZ0UsR0FBaEUsRUFBcUUsY0FBYyxtQkFBZCxDQUFyRSxDQVBzQjtLQUF4Qjs7QUFVQSxXQUFPLE1BQVAsQ0F4QndCO0dBQWxCO0NBSE47O0FBK0JKLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJSZWFjdEZyYWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEZyYWdtZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RDaGlsZHJlbiA9IHJlcXVpcmUoJy4vUmVhY3RDaGlsZHJlbicpO1xudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogV2UgdXNlZCB0byBhbGxvdyBrZXllZCBvYmplY3RzIHRvIHNlcnZlIGFzIGEgY29sbGVjdGlvbiBvZiBSZWFjdEVsZW1lbnRzLFxuICogb3IgbmVzdGVkIHNldHMuIFRoaXMgYWxsb3dlZCB1cyBhIHdheSB0byBleHBsaWNpdGx5IGtleSBhIHNldCBhIGZyYWdtZW50IG9mXG4gKiBjb21wb25lbnRzLiBUaGlzIGlzIG5vdyBiZWluZyByZXBsYWNlZCB3aXRoIGFuIG9wYXF1ZSBkYXRhIHN0cnVjdHVyZS5cbiAqIFRoZSB1cGdyYWRlIHBhdGggaXMgdG8gY2FsbCBSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQoeyBrZXk6IHZhbHVlIH0pIHRvXG4gKiBjcmVhdGUgYSBrZXllZCBmcmFnbWVudC4gVGhlIHJlc3VsdGluZyBkYXRhIHN0cnVjdHVyZSBpcyBhbiBhcnJheS5cbiAqL1xuXG52YXIgbnVtZXJpY1Byb3BlcnR5UmVnZXggPSAvXlxcZCskLztcblxudmFyIHdhcm5lZEFib3V0TnVtZXJpYyA9IGZhbHNlO1xuXG52YXIgUmVhY3RGcmFnbWVudCA9IHtcbiAgLy8gV3JhcCBhIGtleWVkIG9iamVjdCBpbiBhbiBvcGFxdWUgcHJveHkgdGhhdCB3YXJucyB5b3UgaWYgeW91IGFjY2VzcyBhbnlcbiAgLy8gb2YgaXRzIHByb3BlcnRpZXMuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIGlmICh0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0JyB8fCAhb2JqZWN0IHx8IEFycmF5LmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQgb25seSBhY2NlcHRzIGEgc2luZ2xlIG9iamVjdC4gR290OiAlcycsIG9iamVjdCkgOiB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KG9iamVjdCkpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnUmVhY3QuYWRkb25zLmNyZWF0ZUZyYWdtZW50IGRvZXMgbm90IGFjY2VwdCBhIFJlYWN0RWxlbWVudCAnICsgJ3dpdGhvdXQgYSB3cmFwcGVyIG9iamVjdC4nKSA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgIShvYmplY3Qubm9kZVR5cGUgIT09IDEpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0LmFkZG9ucy5jcmVhdGVGcmFnbWVudCguLi4pOiBFbmNvdW50ZXJlZCBhbiBpbnZhbGlkIGNoaWxkOyBET00gJyArICdlbGVtZW50cyBhcmUgbm90IHZhbGlkIGNoaWxkcmVuIG9mIFJlYWN0IGNvbXBvbmVudHMuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaWYgKCF3YXJuZWRBYm91dE51bWVyaWMgJiYgbnVtZXJpY1Byb3BlcnR5UmVnZXgudGVzdChrZXkpKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdC5hZGRvbnMuY3JlYXRlRnJhZ21lbnQoLi4uKTogQ2hpbGQgb2JqZWN0cyBzaG91bGQgaGF2ZSAnICsgJ25vbi1udW1lcmljIGtleXMgc28gb3JkZXJpbmcgaXMgcHJlc2VydmVkLicpIDogdW5kZWZpbmVkO1xuICAgICAgICAgIHdhcm5lZEFib3V0TnVtZXJpYyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFJlYWN0Q2hpbGRyZW4ubWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChvYmplY3Rba2V5XSwgcmVzdWx0LCBrZXksIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEZyYWdtZW50OyJdfQ==