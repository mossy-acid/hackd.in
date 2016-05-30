/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMTextarea
 */

'use strict';

var LinkedValueUtils = require('./LinkedValueUtils');
var ReactDOMIDOperations = require('./ReactDOMIDOperations');
var ReactUpdates = require('./ReactUpdates');

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function forceUpdateIfMounted() {
  if (this._rootNodeID) {
    // DOM component is still mounted; update
    ReactDOMTextarea.updateWrapper(this);
  }
}

/**
 * Implements a <textarea> native component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = {
  getNativeProps: function getNativeProps(inst, props, context) {
    !(props.dangerouslySetInnerHTML == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : invariant(false) : undefined;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.
    var nativeProps = assign({}, props, {
      defaultValue: undefined,
      value: undefined,
      children: inst._wrapperState.initialValue,
      onChange: inst._wrapperState.onChange
    });

    return nativeProps;
  },

  mountWrapper: function mountWrapper(inst, props) {
    if (process.env.NODE_ENV !== 'production') {
      LinkedValueUtils.checkPropTypes('textarea', props, inst._currentElement._owner);
    }

    var defaultValue = props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = props.children;
    if (children != null) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.') : undefined;
      }
      !(defaultValue == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : invariant(false) : undefined;
      if (Array.isArray(children)) {
        !(children.length <= 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, '<textarea> can only have at most one child.') : invariant(false) : undefined;
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    var value = LinkedValueUtils.getValue(props);

    inst._wrapperState = {
      // We save the initial value so that `ReactDOMComponent` doesn't update
      // `textContent` (unnecessary since we update value).
      // The initial value can be a boolean or object so that's why it's
      // forced to be a string.
      initialValue: '' + (value != null ? value : defaultValue),
      onChange: _handleChange.bind(inst)
    };
  },

  updateWrapper: function updateWrapper(inst) {
    var props = inst._currentElement.props;
    var value = LinkedValueUtils.getValue(props);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      ReactDOMIDOperations.updatePropertyByID(inst._rootNodeID, 'value', '' + value);
    }
  }
};

function _handleChange(event) {
  var props = this._currentElement.props;
  var returnValue = LinkedValueUtils.executeOnChange(props, event);
  ReactUpdates.asap(forceUpdateIfMounted, this);
  return returnValue;
}

module.exports = ReactDOMTextarea;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NVGV4dGFyZWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSx3QkFBUixDQUEzQjtBQUNBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5COztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjtBQUNBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7O0FBRUEsU0FBUyxvQkFBVCxHQUFnQztBQUM5QixNQUFJLEtBQUssV0FBVCxFQUFzQjs7QUFFcEIscUJBQWlCLGFBQWpCLENBQStCLElBQS9CO0FBQ0Q7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkQsSUFBSSxtQkFBbUI7QUFDckIsa0JBQWdCLHdCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0M7QUFDOUMsTUFBRSxNQUFNLHVCQUFOLElBQWlDLElBQW5DLElBQTJDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLDhEQUFqQixDQUF4QyxHQUEySCxVQUFVLEtBQVYsQ0FBdEssR0FBeUwsU0FBekw7Ozs7QUFJQSxRQUFJLGNBQWMsT0FBTyxFQUFQLEVBQVcsS0FBWCxFQUFrQjtBQUNsQyxvQkFBYyxTQURvQjtBQUVsQyxhQUFPLFNBRjJCO0FBR2xDLGdCQUFVLEtBQUssYUFBTCxDQUFtQixZQUhLO0FBSWxDLGdCQUFVLEtBQUssYUFBTCxDQUFtQjtBQUpLLEtBQWxCLENBQWxCOztBQU9BLFdBQU8sV0FBUDtBQUNELEdBZG9COztBQWdCckIsZ0JBQWMsc0JBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QjtBQUNuQyxRQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsdUJBQWlCLGNBQWpCLENBQWdDLFVBQWhDLEVBQTRDLEtBQTVDLEVBQW1ELEtBQUssZUFBTCxDQUFxQixNQUF4RTtBQUNEOztBQUVELFFBQUksZUFBZSxNQUFNLFlBQXpCOztBQUVBLFFBQUksV0FBVyxNQUFNLFFBQXJCO0FBQ0EsUUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxnQkFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLEtBQVIsRUFBZSxnRUFBZ0UseUJBQS9FLENBQXhDLEdBQW9KLFNBQXBKO0FBQ0Q7QUFDRCxRQUFFLGdCQUFnQixJQUFsQixJQUEwQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQixxRUFBakIsQ0FBeEMsR0FBa0ksVUFBVSxLQUFWLENBQTVKLEdBQStLLFNBQS9LO0FBQ0EsVUFBSSxNQUFNLE9BQU4sQ0FBYyxRQUFkLENBQUosRUFBNkI7QUFDM0IsVUFBRSxTQUFTLE1BQVQsSUFBbUIsQ0FBckIsSUFBMEIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsNkNBQWpCLENBQXhDLEdBQTBHLFVBQVUsS0FBVixDQUFwSSxHQUF1SixTQUF2SjtBQUNBLG1CQUFXLFNBQVMsQ0FBVCxDQUFYO0FBQ0Q7O0FBRUQscUJBQWUsS0FBSyxRQUFwQjtBQUNEO0FBQ0QsUUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDeEIscUJBQWUsRUFBZjtBQUNEO0FBQ0QsUUFBSSxRQUFRLGlCQUFpQixRQUFqQixDQUEwQixLQUExQixDQUFaOztBQUVBLFNBQUssYUFBTCxHQUFxQjs7Ozs7QUFLbkIsb0JBQWMsTUFBTSxTQUFTLElBQVQsR0FBZ0IsS0FBaEIsR0FBd0IsWUFBOUIsQ0FMSztBQU1uQixnQkFBVSxjQUFjLElBQWQsQ0FBbUIsSUFBbkI7QUFOUyxLQUFyQjtBQVFELEdBakRvQjs7QUFtRHJCLGlCQUFlLHVCQUFVLElBQVYsRUFBZ0I7QUFDN0IsUUFBSSxRQUFRLEtBQUssZUFBTCxDQUFxQixLQUFqQztBQUNBLFFBQUksUUFBUSxpQkFBaUIsUUFBakIsQ0FBMEIsS0FBMUIsQ0FBWjtBQUNBLFFBQUksU0FBUyxJQUFiLEVBQW1COzs7QUFHakIsMkJBQXFCLGtCQUFyQixDQUF3QyxLQUFLLFdBQTdDLEVBQTBELE9BQTFELEVBQW1FLEtBQUssS0FBeEU7QUFDRDtBQUNGO0FBM0RvQixDQUF2Qjs7QUE4REEsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzVCLE1BQUksUUFBUSxLQUFLLGVBQUwsQ0FBcUIsS0FBakM7QUFDQSxNQUFJLGNBQWMsaUJBQWlCLGVBQWpCLENBQWlDLEtBQWpDLEVBQXdDLEtBQXhDLENBQWxCO0FBQ0EsZUFBYSxJQUFiLENBQWtCLG9CQUFsQixFQUF3QyxJQUF4QztBQUNBLFNBQU8sV0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiUmVhY3RET01UZXh0YXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERPTVRleHRhcmVhXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGlua2VkVmFsdWVVdGlscyA9IHJlcXVpcmUoJy4vTGlua2VkVmFsdWVVdGlscycpO1xudmFyIFJlYWN0RE9NSURPcGVyYXRpb25zID0gcmVxdWlyZSgnLi9SZWFjdERPTUlET3BlcmF0aW9ucycpO1xudmFyIFJlYWN0VXBkYXRlcyA9IHJlcXVpcmUoJy4vUmVhY3RVcGRhdGVzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG5mdW5jdGlvbiBmb3JjZVVwZGF0ZUlmTW91bnRlZCgpIHtcbiAgaWYgKHRoaXMuX3Jvb3ROb2RlSUQpIHtcbiAgICAvLyBET00gY29tcG9uZW50IGlzIHN0aWxsIG1vdW50ZWQ7IHVwZGF0ZVxuICAgIFJlYWN0RE9NVGV4dGFyZWEudXBkYXRlV3JhcHBlcih0aGlzKTtcbiAgfVxufVxuXG4vKipcbiAqIEltcGxlbWVudHMgYSA8dGV4dGFyZWE+IG5hdGl2ZSBjb21wb25lbnQgdGhhdCBhbGxvd3Mgc2V0dGluZyBgdmFsdWVgLCBhbmRcbiAqIGBkZWZhdWx0VmFsdWVgLiBUaGlzIGRpZmZlcnMgZnJvbSB0aGUgdHJhZGl0aW9uYWwgRE9NIEFQSSBiZWNhdXNlIHZhbHVlIGlzXG4gKiB1c3VhbGx5IHNldCBhcyBQQ0RBVEEgY2hpbGRyZW4uXG4gKlxuICogSWYgYHZhbHVlYCBpcyBub3Qgc3VwcGxpZWQgKG9yIG51bGwvdW5kZWZpbmVkKSwgdXNlciBhY3Rpb25zIHRoYXQgYWZmZWN0IHRoZVxuICogdmFsdWUgd2lsbCB0cmlnZ2VyIHVwZGF0ZXMgdG8gdGhlIGVsZW1lbnQuXG4gKlxuICogSWYgYHZhbHVlYCBpcyBzdXBwbGllZCAoYW5kIG5vdCBudWxsL3VuZGVmaW5lZCksIHRoZSByZW5kZXJlZCBlbGVtZW50IHdpbGxcbiAqIG5vdCB0cmlnZ2VyIHVwZGF0ZXMgdG8gdGhlIGVsZW1lbnQuIEluc3RlYWQsIHRoZSBgdmFsdWVgIHByb3AgbXVzdCBjaGFuZ2UgaW5cbiAqIG9yZGVyIGZvciB0aGUgcmVuZGVyZWQgZWxlbWVudCB0byBiZSB1cGRhdGVkLlxuICpcbiAqIFRoZSByZW5kZXJlZCBlbGVtZW50IHdpbGwgYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbiBlbXB0eSB2YWx1ZSwgdGhlIHByb3BcbiAqIGBkZWZhdWx0VmFsdWVgIGlmIHNwZWNpZmllZCwgb3IgdGhlIGNoaWxkcmVuIGNvbnRlbnQgKGRlcHJlY2F0ZWQpLlxuICovXG52YXIgUmVhY3RET01UZXh0YXJlYSA9IHtcbiAgZ2V0TmF0aXZlUHJvcHM6IGZ1bmN0aW9uIChpbnN0LCBwcm9wcywgY29udGV4dCkge1xuICAgICEocHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgPT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnYGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MYCBkb2VzIG5vdCBtYWtlIHNlbnNlIG9uIDx0ZXh0YXJlYT4uJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgLy8gQWx3YXlzIHNldCBjaGlsZHJlbiB0byB0aGUgc2FtZSB0aGluZy4gSW4gSUU5LCB0aGUgc2VsZWN0aW9uIHJhbmdlIHdpbGxcbiAgICAvLyBnZXQgcmVzZXQgaWYgYHRleHRDb250ZW50YCBpcyBtdXRhdGVkLlxuICAgIHZhciBuYXRpdmVQcm9wcyA9IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgIGRlZmF1bHRWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGNoaWxkcmVuOiBpbnN0Ll93cmFwcGVyU3RhdGUuaW5pdGlhbFZhbHVlLFxuICAgICAgb25DaGFuZ2U6IGluc3QuX3dyYXBwZXJTdGF0ZS5vbkNoYW5nZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5hdGl2ZVByb3BzO1xuICB9LFxuXG4gIG1vdW50V3JhcHBlcjogZnVuY3Rpb24gKGluc3QsIHByb3BzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIExpbmtlZFZhbHVlVXRpbHMuY2hlY2tQcm9wVHlwZXMoJ3RleHRhcmVhJywgcHJvcHMsIGluc3QuX2N1cnJlbnRFbGVtZW50Ll9vd25lcik7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9IHByb3BzLmRlZmF1bHRWYWx1ZTtcbiAgICAvLyBUT0RPICh5dW5nc3RlcnMpOiBSZW1vdmUgc3VwcG9ydCBmb3IgY2hpbGRyZW4gY29udGVudCBpbiA8dGV4dGFyZWE+LlxuICAgIHZhciBjaGlsZHJlbiA9IHByb3BzLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1VzZSB0aGUgYGRlZmF1bHRWYWx1ZWAgb3IgYHZhbHVlYCBwcm9wcyBpbnN0ZWFkIG9mIHNldHRpbmcgJyArICdjaGlsZHJlbiBvbiA8dGV4dGFyZWE+LicpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgIShkZWZhdWx0VmFsdWUgPT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnSWYgeW91IHN1cHBseSBgZGVmYXVsdFZhbHVlYCBvbiBhIDx0ZXh0YXJlYT4sIGRvIG5vdCBwYXNzIGNoaWxkcmVuLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICAhKGNoaWxkcmVuLmxlbmd0aCA8PSAxKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICc8dGV4dGFyZWE+IGNhbiBvbmx5IGhhdmUgYXQgbW9zdCBvbmUgY2hpbGQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuWzBdO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0VmFsdWUgPSAnJyArIGNoaWxkcmVuO1xuICAgIH1cbiAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9ICcnO1xuICAgIH1cbiAgICB2YXIgdmFsdWUgPSBMaW5rZWRWYWx1ZVV0aWxzLmdldFZhbHVlKHByb3BzKTtcblxuICAgIGluc3QuX3dyYXBwZXJTdGF0ZSA9IHtcbiAgICAgIC8vIFdlIHNhdmUgdGhlIGluaXRpYWwgdmFsdWUgc28gdGhhdCBgUmVhY3RET01Db21wb25lbnRgIGRvZXNuJ3QgdXBkYXRlXG4gICAgICAvLyBgdGV4dENvbnRlbnRgICh1bm5lY2Vzc2FyeSBzaW5jZSB3ZSB1cGRhdGUgdmFsdWUpLlxuICAgICAgLy8gVGhlIGluaXRpYWwgdmFsdWUgY2FuIGJlIGEgYm9vbGVhbiBvciBvYmplY3Qgc28gdGhhdCdzIHdoeSBpdCdzXG4gICAgICAvLyBmb3JjZWQgdG8gYmUgYSBzdHJpbmcuXG4gICAgICBpbml0aWFsVmFsdWU6ICcnICsgKHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZSksXG4gICAgICBvbkNoYW5nZTogX2hhbmRsZUNoYW5nZS5iaW5kKGluc3QpXG4gICAgfTtcbiAgfSxcblxuICB1cGRhdGVXcmFwcGVyOiBmdW5jdGlvbiAoaW5zdCkge1xuICAgIHZhciBwcm9wcyA9IGluc3QuX2N1cnJlbnRFbGVtZW50LnByb3BzO1xuICAgIHZhciB2YWx1ZSA9IExpbmtlZFZhbHVlVXRpbHMuZ2V0VmFsdWUocHJvcHMpO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAvLyBDYXN0IGB2YWx1ZWAgdG8gYSBzdHJpbmcgdG8gZW5zdXJlIHRoZSB2YWx1ZSBpcyBzZXQgY29ycmVjdGx5LiBXaGlsZVxuICAgICAgLy8gYnJvd3NlcnMgdHlwaWNhbGx5IGRvIHRoaXMgYXMgbmVjZXNzYXJ5LCBqc2RvbSBkb2Vzbid0LlxuICAgICAgUmVhY3RET01JRE9wZXJhdGlvbnMudXBkYXRlUHJvcGVydHlCeUlEKGluc3QuX3Jvb3ROb2RlSUQsICd2YWx1ZScsICcnICsgdmFsdWUpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gX2hhbmRsZUNoYW5nZShldmVudCkge1xuICB2YXIgcHJvcHMgPSB0aGlzLl9jdXJyZW50RWxlbWVudC5wcm9wcztcbiAgdmFyIHJldHVyblZhbHVlID0gTGlua2VkVmFsdWVVdGlscy5leGVjdXRlT25DaGFuZ2UocHJvcHMsIGV2ZW50KTtcbiAgUmVhY3RVcGRhdGVzLmFzYXAoZm9yY2VVcGRhdGVJZk1vdW50ZWQsIHRoaXMpO1xuICByZXR1cm4gcmV0dXJuVmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RET01UZXh0YXJlYTsiXX0=