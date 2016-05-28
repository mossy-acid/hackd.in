/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMOption
 */

'use strict';

var ReactChildren = require('./ReactChildren');
var ReactDOMSelect = require('./ReactDOMSelect');

var assign = require('./Object.assign');
var warning = require('fbjs/lib/warning');

var valueContextKey = ReactDOMSelect.valueContextKey;

/**
 * Implements an <option> native component that warns when `selected` is set.
 */
var ReactDOMOption = {
  mountWrapper: function mountWrapper(inst, props, context) {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(props.selected == null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.') : undefined;
    }

    // Look up whether this option is 'selected' via context
    var selectValue = context[valueContextKey];

    // If context key is null (e.g., no specified value or after initial mount)
    // or missing (e.g., for <datalist>), we don't change props.selected
    var selected = null;
    if (selectValue != null) {
      selected = false;
      if (Array.isArray(selectValue)) {
        // multiple
        for (var i = 0; i < selectValue.length; i++) {
          if ('' + selectValue[i] === '' + props.value) {
            selected = true;
            break;
          }
        }
      } else {
        selected = '' + selectValue === '' + props.value;
      }
    }

    inst._wrapperState = { selected: selected };
  },

  getNativeProps: function getNativeProps(inst, props, context) {
    var nativeProps = assign({ selected: undefined, children: undefined }, props);

    // Read state only from initial mount because <select> updates value
    // manually; we need the initial state only for server rendering
    if (inst._wrapperState.selected != null) {
      nativeProps.selected = inst._wrapperState.selected;
    }

    var content = '';

    // Flatten children and warn if they aren't strings or numbers;
    // invalid types are ignored.
    ReactChildren.forEach(props.children, function (child) {
      if (child == null) {
        return;
      }
      if (typeof child === 'string' || typeof child === 'number') {
        content += child;
      } else {
        process.env.NODE_ENV !== 'production' ? warning(false, 'Only strings and numbers are supported as <option> children.') : undefined;
      }
    });

    if (content) {
      nativeProps.children = content;
    }

    return nativeProps;
  }

};

module.exports = ReactDOMOption;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NT3B0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFoQjtBQUNKLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7O0FBRUosSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDtBQUNKLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQVY7O0FBRUosSUFBSSxrQkFBa0IsZUFBZSxlQUFmOzs7OztBQUt0QixJQUFJLGlCQUFpQjtBQUNuQixnQkFBYyxzQkFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDOztBQUU1QyxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7QUFDekMsY0FBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLE1BQU0sUUFBTixJQUFrQixJQUFsQixFQUF3QixvRUFBb0UsaUNBQXBFLENBQXhFLEdBQWlMLFNBQWpMLENBRHlDO0tBQTNDOzs7QUFGNEMsUUFPeEMsY0FBYyxRQUFRLGVBQVIsQ0FBZDs7OztBQVB3QyxRQVd4QyxXQUFXLElBQVgsQ0FYd0M7QUFZNUMsUUFBSSxlQUFlLElBQWYsRUFBcUI7QUFDdkIsaUJBQVcsS0FBWCxDQUR1QjtBQUV2QixVQUFJLE1BQU0sT0FBTixDQUFjLFdBQWQsQ0FBSixFQUFnQzs7QUFFOUIsYUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksWUFBWSxNQUFaLEVBQW9CLEdBQXhDLEVBQTZDO0FBQzNDLGNBQUksS0FBSyxZQUFZLENBQVosQ0FBTCxLQUF3QixLQUFLLE1BQU0sS0FBTixFQUFhO0FBQzVDLHVCQUFXLElBQVgsQ0FENEM7QUFFNUMsa0JBRjRDO1dBQTlDO1NBREY7T0FGRixNQVFPO0FBQ0wsbUJBQVcsS0FBSyxXQUFMLEtBQXFCLEtBQUssTUFBTSxLQUFOLENBRGhDO09BUlA7S0FGRjs7QUFlQSxTQUFLLGFBQUwsR0FBcUIsRUFBRSxVQUFVLFFBQVYsRUFBdkIsQ0EzQjRDO0dBQWhDOztBQThCZCxrQkFBZ0Isd0JBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixPQUF2QixFQUFnQztBQUM5QyxRQUFJLGNBQWMsT0FBTyxFQUFFLFVBQVUsU0FBVixFQUFxQixVQUFVLFNBQVYsRUFBOUIsRUFBcUQsS0FBckQsQ0FBZDs7OztBQUQwQyxRQUsxQyxLQUFLLGFBQUwsQ0FBbUIsUUFBbkIsSUFBK0IsSUFBL0IsRUFBcUM7QUFDdkMsa0JBQVksUUFBWixHQUF1QixLQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FEZ0I7S0FBekM7O0FBSUEsUUFBSSxVQUFVLEVBQVY7Ozs7QUFUMEMsaUJBYTlDLENBQWMsT0FBZCxDQUFzQixNQUFNLFFBQU4sRUFBZ0IsVUFBVSxLQUFWLEVBQWlCO0FBQ3JELFVBQUksU0FBUyxJQUFULEVBQWU7QUFDakIsZUFEaUI7T0FBbkI7QUFHQSxVQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixPQUFPLEtBQVAsS0FBaUIsUUFBakIsRUFBMkI7QUFDMUQsbUJBQVcsS0FBWCxDQUQwRDtPQUE1RCxNQUVPO0FBQ0wsZ0JBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxLQUFSLEVBQWUsOERBQWYsQ0FBeEMsR0FBeUgsU0FBekgsQ0FESztPQUZQO0tBSm9DLENBQXRDLENBYjhDOztBQXdCOUMsUUFBSSxPQUFKLEVBQWE7QUFDWCxrQkFBWSxRQUFaLEdBQXVCLE9BQXZCLENBRFc7S0FBYjs7QUFJQSxXQUFPLFdBQVAsQ0E1QjhDO0dBQWhDOztDQS9CZDs7QUFnRUosT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6IlJlYWN0RE9NT3B0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RE9NT3B0aW9uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RDaGlsZHJlbiA9IHJlcXVpcmUoJy4vUmVhY3RDaGlsZHJlbicpO1xudmFyIFJlYWN0RE9NU2VsZWN0ID0gcmVxdWlyZSgnLi9SZWFjdERPTVNlbGVjdCcpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIHZhbHVlQ29udGV4dEtleSA9IFJlYWN0RE9NU2VsZWN0LnZhbHVlQ29udGV4dEtleTtcblxuLyoqXG4gKiBJbXBsZW1lbnRzIGFuIDxvcHRpb24+IG5hdGl2ZSBjb21wb25lbnQgdGhhdCB3YXJucyB3aGVuIGBzZWxlY3RlZGAgaXMgc2V0LlxuICovXG52YXIgUmVhY3RET01PcHRpb24gPSB7XG4gIG1vdW50V3JhcHBlcjogZnVuY3Rpb24gKGluc3QsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgLy8gVE9ETyAoeXVuZ3N0ZXJzKTogUmVtb3ZlIHN1cHBvcnQgZm9yIGBzZWxlY3RlZGAgaW4gPG9wdGlvbj4uXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHByb3BzLnNlbGVjdGVkID09IG51bGwsICdVc2UgdGhlIGBkZWZhdWx0VmFsdWVgIG9yIGB2YWx1ZWAgcHJvcHMgb24gPHNlbGVjdD4gaW5zdGVhZCBvZiAnICsgJ3NldHRpbmcgYHNlbGVjdGVkYCBvbiA8b3B0aW9uPi4nKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBMb29rIHVwIHdoZXRoZXIgdGhpcyBvcHRpb24gaXMgJ3NlbGVjdGVkJyB2aWEgY29udGV4dFxuICAgIHZhciBzZWxlY3RWYWx1ZSA9IGNvbnRleHRbdmFsdWVDb250ZXh0S2V5XTtcblxuICAgIC8vIElmIGNvbnRleHQga2V5IGlzIG51bGwgKGUuZy4sIG5vIHNwZWNpZmllZCB2YWx1ZSBvciBhZnRlciBpbml0aWFsIG1vdW50KVxuICAgIC8vIG9yIG1pc3NpbmcgKGUuZy4sIGZvciA8ZGF0YWxpc3Q+KSwgd2UgZG9uJ3QgY2hhbmdlIHByb3BzLnNlbGVjdGVkXG4gICAgdmFyIHNlbGVjdGVkID0gbnVsbDtcbiAgICBpZiAoc2VsZWN0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdFZhbHVlKSkge1xuICAgICAgICAvLyBtdWx0aXBsZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCcnICsgc2VsZWN0VmFsdWVbaV0gPT09ICcnICsgcHJvcHMudmFsdWUpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZWN0ZWQgPSAnJyArIHNlbGVjdFZhbHVlID09PSAnJyArIHByb3BzLnZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluc3QuX3dyYXBwZXJTdGF0ZSA9IHsgc2VsZWN0ZWQ6IHNlbGVjdGVkIH07XG4gIH0sXG5cbiAgZ2V0TmF0aXZlUHJvcHM6IGZ1bmN0aW9uIChpbnN0LCBwcm9wcywgY29udGV4dCkge1xuICAgIHZhciBuYXRpdmVQcm9wcyA9IGFzc2lnbih7IHNlbGVjdGVkOiB1bmRlZmluZWQsIGNoaWxkcmVuOiB1bmRlZmluZWQgfSwgcHJvcHMpO1xuXG4gICAgLy8gUmVhZCBzdGF0ZSBvbmx5IGZyb20gaW5pdGlhbCBtb3VudCBiZWNhdXNlIDxzZWxlY3Q+IHVwZGF0ZXMgdmFsdWVcbiAgICAvLyBtYW51YWxseTsgd2UgbmVlZCB0aGUgaW5pdGlhbCBzdGF0ZSBvbmx5IGZvciBzZXJ2ZXIgcmVuZGVyaW5nXG4gICAgaWYgKGluc3QuX3dyYXBwZXJTdGF0ZS5zZWxlY3RlZCAhPSBudWxsKSB7XG4gICAgICBuYXRpdmVQcm9wcy5zZWxlY3RlZCA9IGluc3QuX3dyYXBwZXJTdGF0ZS5zZWxlY3RlZDtcbiAgICB9XG5cbiAgICB2YXIgY29udGVudCA9ICcnO1xuXG4gICAgLy8gRmxhdHRlbiBjaGlsZHJlbiBhbmQgd2FybiBpZiB0aGV5IGFyZW4ndCBzdHJpbmdzIG9yIG51bWJlcnM7XG4gICAgLy8gaW52YWxpZCB0eXBlcyBhcmUgaWdub3JlZC5cbiAgICBSZWFjdENoaWxkcmVuLmZvckVhY2gocHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGNoaWxkID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb250ZW50ICs9IGNoaWxkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdPbmx5IHN0cmluZ3MgYW5kIG51bWJlcnMgYXJlIHN1cHBvcnRlZCBhcyA8b3B0aW9uPiBjaGlsZHJlbi4nKSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb250ZW50KSB7XG4gICAgICBuYXRpdmVQcm9wcy5jaGlsZHJlbiA9IGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5hdGl2ZVByb3BzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RET01PcHRpb247Il19