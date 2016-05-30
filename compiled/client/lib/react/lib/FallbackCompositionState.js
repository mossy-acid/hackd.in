/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FallbackCompositionState
 * @typechecks static-only
 */

'use strict';

var PooledClass = require('./PooledClass');

var assign = require('./Object.assign');
var getTextContentAccessor = require('./getTextContentAccessor');

/**
 * This helper class stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this._root = root;
  this._startText = this.getText();
  this._fallbackText = null;
}

assign(FallbackCompositionState.prototype, {
  destructor: function destructor() {
    this._root = null;
    this._startText = null;
    this._fallbackText = null;
  },

  /**
   * Get current text of input.
   *
   * @return {string}
   */
  getText: function getText() {
    if ('value' in this._root) {
      return this._root.value;
    }
    return this._root[getTextContentAccessor()];
  },

  /**
   * Determine the differing substring between the initially stored
   * text content and the current content.
   *
   * @return {string}
   */
  getData: function getData() {
    if (this._fallbackText) {
      return this._fallbackText;
    }

    var start;
    var startValue = this._startText;
    var startLength = startValue.length;
    var end;
    var endValue = this.getText();
    var endLength = endValue.length;

    for (start = 0; start < startLength; start++) {
      if (startValue[start] !== endValue[start]) {
        break;
      }
    }

    var minEnd = startLength - start;
    for (end = 1; end <= minEnd; end++) {
      if (startValue[startLength - end] !== endValue[endLength - end]) {
        break;
      }
    }

    var sliceTail = end > 1 ? 1 - end : undefined;
    this._fallbackText = endValue.slice(start, sliceTail);
    return this._fallbackText;
  }
});

PooledClass.addPoolingTo(FallbackCompositionState);

module.exports = FallbackCompositionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0ZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFJLHlCQUF5QixRQUFRLDBCQUFSLENBQTdCOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyx3QkFBVCxDQUFrQyxJQUFsQyxFQUF3QztBQUN0QyxPQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsT0FBSyxVQUFMLEdBQWtCLEtBQUssT0FBTCxFQUFsQjtBQUNBLE9BQUssYUFBTCxHQUFxQixJQUFyQjtBQUNEOztBQUVELE9BQU8seUJBQXlCLFNBQWhDLEVBQTJDO0FBQ3pDLGNBQVksc0JBQVk7QUFDdEIsU0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFNBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNELEdBTHdDOzs7Ozs7O0FBWXpDLFdBQVMsbUJBQVk7QUFDbkIsUUFBSSxXQUFXLEtBQUssS0FBcEIsRUFBMkI7QUFDekIsYUFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFsQjtBQUNEO0FBQ0QsV0FBTyxLQUFLLEtBQUwsQ0FBVyx3QkFBWCxDQUFQO0FBQ0QsR0FqQndDOzs7Ozs7OztBQXlCekMsV0FBUyxtQkFBWTtBQUNuQixRQUFJLEtBQUssYUFBVCxFQUF3QjtBQUN0QixhQUFPLEtBQUssYUFBWjtBQUNEOztBQUVELFFBQUksS0FBSjtBQUNBLFFBQUksYUFBYSxLQUFLLFVBQXRCO0FBQ0EsUUFBSSxjQUFjLFdBQVcsTUFBN0I7QUFDQSxRQUFJLEdBQUo7QUFDQSxRQUFJLFdBQVcsS0FBSyxPQUFMLEVBQWY7QUFDQSxRQUFJLFlBQVksU0FBUyxNQUF6Qjs7QUFFQSxTQUFLLFFBQVEsQ0FBYixFQUFnQixRQUFRLFdBQXhCLEVBQXFDLE9BQXJDLEVBQThDO0FBQzVDLFVBQUksV0FBVyxLQUFYLE1BQXNCLFNBQVMsS0FBVCxDQUExQixFQUEyQztBQUN6QztBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxTQUFTLGNBQWMsS0FBM0I7QUFDQSxTQUFLLE1BQU0sQ0FBWCxFQUFjLE9BQU8sTUFBckIsRUFBNkIsS0FBN0IsRUFBb0M7QUFDbEMsVUFBSSxXQUFXLGNBQWMsR0FBekIsTUFBa0MsU0FBUyxZQUFZLEdBQXJCLENBQXRDLEVBQWlFO0FBQy9EO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJLFlBQVksTUFBTSxDQUFOLEdBQVUsSUFBSSxHQUFkLEdBQW9CLFNBQXBDO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsU0FBdEIsQ0FBckI7QUFDQSxXQUFPLEtBQUssYUFBWjtBQUNEO0FBckR3QyxDQUEzQzs7QUF3REEsWUFBWSxZQUFaLENBQXlCLHdCQUF6Qjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsd0JBQWpCIiwiZmlsZSI6IkZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGVcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUG9vbGVkQ2xhc3MgPSByZXF1aXJlKCcuL1Bvb2xlZENsYXNzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBnZXRUZXh0Q29udGVudEFjY2Vzc29yID0gcmVxdWlyZSgnLi9nZXRUZXh0Q29udGVudEFjY2Vzc29yJyk7XG5cbi8qKlxuICogVGhpcyBoZWxwZXIgY2xhc3Mgc3RvcmVzIGluZm9ybWF0aW9uIGFib3V0IHRleHQgY29udGVudCBvZiBhIHRhcmdldCBub2RlLFxuICogYWxsb3dpbmcgY29tcGFyaXNvbiBvZiBjb250ZW50IGJlZm9yZSBhbmQgYWZ0ZXIgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBJZGVudGlmeSB0aGUgbm9kZSB3aGVyZSBzZWxlY3Rpb24gY3VycmVudGx5IGJlZ2lucywgdGhlbiBvYnNlcnZlXG4gKiBib3RoIGl0cyB0ZXh0IGNvbnRlbnQgYW5kIGl0cyBjdXJyZW50IHBvc2l0aW9uIGluIHRoZSBET00uIFNpbmNlIHRoZVxuICogYnJvd3NlciBtYXkgbmF0aXZlbHkgcmVwbGFjZSB0aGUgdGFyZ2V0IG5vZGUgZHVyaW5nIGNvbXBvc2l0aW9uLCB3ZSBjYW5cbiAqIHVzZSBpdHMgcG9zaXRpb24gdG8gZmluZCBpdHMgcmVwbGFjZW1lbnQuXG4gKlxuICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gcm9vdFxuICovXG5mdW5jdGlvbiBGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGUocm9vdCkge1xuICB0aGlzLl9yb290ID0gcm9vdDtcbiAgdGhpcy5fc3RhcnRUZXh0ID0gdGhpcy5nZXRUZXh0KCk7XG4gIHRoaXMuX2ZhbGxiYWNrVGV4dCA9IG51bGw7XG59XG5cbmFzc2lnbihGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGUucHJvdG90eXBlLCB7XG4gIGRlc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9zdGFydFRleHQgPSBudWxsO1xuICAgIHRoaXMuX2ZhbGxiYWNrVGV4dCA9IG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHRleHQgb2YgaW5wdXQuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldFRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJ3ZhbHVlJyBpbiB0aGlzLl9yb290KSB7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RbZ2V0VGV4dENvbnRlbnRBY2Nlc3NvcigpXTtcbiAgfSxcblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBkaWZmZXJpbmcgc3Vic3RyaW5nIGJldHdlZW4gdGhlIGluaXRpYWxseSBzdG9yZWRcbiAgICogdGV4dCBjb250ZW50IGFuZCB0aGUgY3VycmVudCBjb250ZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX2ZhbGxiYWNrVGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGV4dDtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnQ7XG4gICAgdmFyIHN0YXJ0VmFsdWUgPSB0aGlzLl9zdGFydFRleHQ7XG4gICAgdmFyIHN0YXJ0TGVuZ3RoID0gc3RhcnRWYWx1ZS5sZW5ndGg7XG4gICAgdmFyIGVuZDtcbiAgICB2YXIgZW5kVmFsdWUgPSB0aGlzLmdldFRleHQoKTtcbiAgICB2YXIgZW5kTGVuZ3RoID0gZW5kVmFsdWUubGVuZ3RoO1xuXG4gICAgZm9yIChzdGFydCA9IDA7IHN0YXJ0IDwgc3RhcnRMZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChzdGFydFZhbHVlW3N0YXJ0XSAhPT0gZW5kVmFsdWVbc3RhcnRdKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtaW5FbmQgPSBzdGFydExlbmd0aCAtIHN0YXJ0O1xuICAgIGZvciAoZW5kID0gMTsgZW5kIDw9IG1pbkVuZDsgZW5kKyspIHtcbiAgICAgIGlmIChzdGFydFZhbHVlW3N0YXJ0TGVuZ3RoIC0gZW5kXSAhPT0gZW5kVmFsdWVbZW5kTGVuZ3RoIC0gZW5kXSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2xpY2VUYWlsID0gZW5kID4gMSA/IDEgLSBlbmQgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZmFsbGJhY2tUZXh0ID0gZW5kVmFsdWUuc2xpY2Uoc3RhcnQsIHNsaWNlVGFpbCk7XG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGV4dDtcbiAgfVxufSk7XG5cblBvb2xlZENsYXNzLmFkZFBvb2xpbmdUbyhGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZTsiXX0=