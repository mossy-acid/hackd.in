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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NT3B0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFwQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7O0FBRUEsSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7O0FBRUEsSUFBSSxrQkFBa0IsZUFBZSxlQUFyQzs7Ozs7QUFLQSxJQUFJLGlCQUFpQjtBQUNuQixnQkFBYyxzQkFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDOztBQUU1QyxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsY0FBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLE1BQU0sUUFBTixJQUFrQixJQUExQixFQUFnQyxvRUFBb0UsaUNBQXBHLENBQXhDLEdBQWlMLFNBQWpMO0FBQ0Q7OztBQUdELFFBQUksY0FBYyxRQUFRLGVBQVIsQ0FBbEI7Ozs7QUFJQSxRQUFJLFdBQVcsSUFBZjtBQUNBLFFBQUksZUFBZSxJQUFuQixFQUF5QjtBQUN2QixpQkFBVyxLQUFYO0FBQ0EsVUFBSSxNQUFNLE9BQU4sQ0FBYyxXQUFkLENBQUosRUFBZ0M7O0FBRTlCLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxZQUFZLE1BQWhDLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzNDLGNBQUksS0FBSyxZQUFZLENBQVosQ0FBTCxLQUF3QixLQUFLLE1BQU0sS0FBdkMsRUFBOEM7QUFDNUMsdUJBQVcsSUFBWDtBQUNBO0FBQ0Q7QUFDRjtBQUNGLE9BUkQsTUFRTztBQUNMLG1CQUFXLEtBQUssV0FBTCxLQUFxQixLQUFLLE1BQU0sS0FBM0M7QUFDRDtBQUNGOztBQUVELFNBQUssYUFBTCxHQUFxQixFQUFFLFVBQVUsUUFBWixFQUFyQjtBQUNELEdBN0JrQjs7QUErQm5CLGtCQUFnQix3QkFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzlDLFFBQUksY0FBYyxPQUFPLEVBQUUsVUFBVSxTQUFaLEVBQXVCLFVBQVUsU0FBakMsRUFBUCxFQUFxRCxLQUFyRCxDQUFsQjs7OztBQUlBLFFBQUksS0FBSyxhQUFMLENBQW1CLFFBQW5CLElBQStCLElBQW5DLEVBQXlDO0FBQ3ZDLGtCQUFZLFFBQVosR0FBdUIsS0FBSyxhQUFMLENBQW1CLFFBQTFDO0FBQ0Q7O0FBRUQsUUFBSSxVQUFVLEVBQWQ7Ozs7QUFJQSxrQkFBYyxPQUFkLENBQXNCLE1BQU0sUUFBNUIsRUFBc0MsVUFBVSxLQUFWLEVBQWlCO0FBQ3JELFVBQUksU0FBUyxJQUFiLEVBQW1CO0FBQ2pCO0FBQ0Q7QUFDRCxVQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixPQUFPLEtBQVAsS0FBaUIsUUFBbEQsRUFBNEQ7QUFDMUQsbUJBQVcsS0FBWDtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQVEsS0FBUixFQUFlLDhEQUFmLENBQXhDLEdBQXlILFNBQXpIO0FBQ0Q7QUFDRixLQVREOztBQVdBLFFBQUksT0FBSixFQUFhO0FBQ1gsa0JBQVksUUFBWixHQUF1QixPQUF2QjtBQUNEOztBQUVELFdBQU8sV0FBUDtBQUNEOztBQTVEa0IsQ0FBckI7O0FBZ0VBLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJSZWFjdERPTU9wdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERPTU9wdGlvblxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0Q2hpbGRyZW4gPSByZXF1aXJlKCcuL1JlYWN0Q2hpbGRyZW4nKTtcbnZhciBSZWFjdERPTVNlbGVjdCA9IHJlcXVpcmUoJy4vUmVhY3RET01TZWxlY3QnKTtcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciB2YWx1ZUNvbnRleHRLZXkgPSBSZWFjdERPTVNlbGVjdC52YWx1ZUNvbnRleHRLZXk7XG5cbi8qKlxuICogSW1wbGVtZW50cyBhbiA8b3B0aW9uPiBuYXRpdmUgY29tcG9uZW50IHRoYXQgd2FybnMgd2hlbiBgc2VsZWN0ZWRgIGlzIHNldC5cbiAqL1xudmFyIFJlYWN0RE9NT3B0aW9uID0ge1xuICBtb3VudFdyYXBwZXI6IGZ1bmN0aW9uIChpbnN0LCBwcm9wcywgY29udGV4dCkge1xuICAgIC8vIFRPRE8gKHl1bmdzdGVycyk6IFJlbW92ZSBzdXBwb3J0IGZvciBgc2VsZWN0ZWRgIGluIDxvcHRpb24+LlxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhwcm9wcy5zZWxlY3RlZCA9PSBudWxsLCAnVXNlIHRoZSBgZGVmYXVsdFZhbHVlYCBvciBgdmFsdWVgIHByb3BzIG9uIDxzZWxlY3Q+IGluc3RlYWQgb2YgJyArICdzZXR0aW5nIGBzZWxlY3RlZGAgb24gPG9wdGlvbj4uJykgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gTG9vayB1cCB3aGV0aGVyIHRoaXMgb3B0aW9uIGlzICdzZWxlY3RlZCcgdmlhIGNvbnRleHRcbiAgICB2YXIgc2VsZWN0VmFsdWUgPSBjb250ZXh0W3ZhbHVlQ29udGV4dEtleV07XG5cbiAgICAvLyBJZiBjb250ZXh0IGtleSBpcyBudWxsIChlLmcuLCBubyBzcGVjaWZpZWQgdmFsdWUgb3IgYWZ0ZXIgaW5pdGlhbCBtb3VudClcbiAgICAvLyBvciBtaXNzaW5nIChlLmcuLCBmb3IgPGRhdGFsaXN0PiksIHdlIGRvbid0IGNoYW5nZSBwcm9wcy5zZWxlY3RlZFxuICAgIHZhciBzZWxlY3RlZCA9IG51bGw7XG4gICAgaWYgKHNlbGVjdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHNlbGVjdGVkID0gZmFsc2U7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3RWYWx1ZSkpIHtcbiAgICAgICAgLy8gbXVsdGlwbGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICgnJyArIHNlbGVjdFZhbHVlW2ldID09PSAnJyArIHByb3BzLnZhbHVlKSB7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGVjdGVkID0gJycgKyBzZWxlY3RWYWx1ZSA9PT0gJycgKyBwcm9wcy52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbnN0Ll93cmFwcGVyU3RhdGUgPSB7IHNlbGVjdGVkOiBzZWxlY3RlZCB9O1xuICB9LFxuXG4gIGdldE5hdGl2ZVByb3BzOiBmdW5jdGlvbiAoaW5zdCwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICB2YXIgbmF0aXZlUHJvcHMgPSBhc3NpZ24oeyBzZWxlY3RlZDogdW5kZWZpbmVkLCBjaGlsZHJlbjogdW5kZWZpbmVkIH0sIHByb3BzKTtcblxuICAgIC8vIFJlYWQgc3RhdGUgb25seSBmcm9tIGluaXRpYWwgbW91bnQgYmVjYXVzZSA8c2VsZWN0PiB1cGRhdGVzIHZhbHVlXG4gICAgLy8gbWFudWFsbHk7IHdlIG5lZWQgdGhlIGluaXRpYWwgc3RhdGUgb25seSBmb3Igc2VydmVyIHJlbmRlcmluZ1xuICAgIGlmIChpbnN0Ll93cmFwcGVyU3RhdGUuc2VsZWN0ZWQgIT0gbnVsbCkge1xuICAgICAgbmF0aXZlUHJvcHMuc2VsZWN0ZWQgPSBpbnN0Ll93cmFwcGVyU3RhdGUuc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRlbnQgPSAnJztcblxuICAgIC8vIEZsYXR0ZW4gY2hpbGRyZW4gYW5kIHdhcm4gaWYgdGhleSBhcmVuJ3Qgc3RyaW5ncyBvciBudW1iZXJzO1xuICAgIC8vIGludmFsaWQgdHlwZXMgYXJlIGlnbm9yZWQuXG4gICAgUmVhY3RDaGlsZHJlbi5mb3JFYWNoKHByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY29udGVudCArPSBjaGlsZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnT25seSBzdHJpbmdzIGFuZCBudW1iZXJzIGFyZSBzdXBwb3J0ZWQgYXMgPG9wdGlvbj4gY2hpbGRyZW4uJykgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29udGVudCkge1xuICAgICAgbmF0aXZlUHJvcHMuY2hpbGRyZW4gPSBjb250ZW50O1xuICAgIH1cblxuICAgIHJldHVybiBuYXRpdmVQcm9wcztcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RE9NT3B0aW9uOyJdfQ==