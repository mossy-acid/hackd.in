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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0ZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWQ7O0FBRUosSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDtBQUNKLElBQUkseUJBQXlCLFFBQVEsMEJBQVIsQ0FBekI7Ozs7Ozs7Ozs7Ozs7QUFhSixTQUFTLHdCQUFULENBQWtDLElBQWxDLEVBQXdDO0FBQ3RDLE9BQUssS0FBTCxHQUFhLElBQWIsQ0FEc0M7QUFFdEMsT0FBSyxVQUFMLEdBQWtCLEtBQUssT0FBTCxFQUFsQixDQUZzQztBQUd0QyxPQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FIc0M7Q0FBeEM7O0FBTUEsT0FBTyx5QkFBeUIsU0FBekIsRUFBb0M7QUFDekMsY0FBWSxzQkFBWTtBQUN0QixTQUFLLEtBQUwsR0FBYSxJQUFiLENBRHNCO0FBRXRCLFNBQUssVUFBTCxHQUFrQixJQUFsQixDQUZzQjtBQUd0QixTQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FIc0I7R0FBWjs7Ozs7OztBQVdaLFdBQVMsbUJBQVk7QUFDbkIsUUFBSSxXQUFXLEtBQUssS0FBTCxFQUFZO0FBQ3pCLGFBQU8sS0FBSyxLQUFMLENBQVcsS0FBWCxDQURrQjtLQUEzQjtBQUdBLFdBQU8sS0FBSyxLQUFMLENBQVcsd0JBQVgsQ0FBUCxDQUptQjtHQUFaOzs7Ozs7OztBQWFULFdBQVMsbUJBQVk7QUFDbkIsUUFBSSxLQUFLLGFBQUwsRUFBb0I7QUFDdEIsYUFBTyxLQUFLLGFBQUwsQ0FEZTtLQUF4Qjs7QUFJQSxRQUFJLEtBQUosQ0FMbUI7QUFNbkIsUUFBSSxhQUFhLEtBQUssVUFBTCxDQU5FO0FBT25CLFFBQUksY0FBYyxXQUFXLE1BQVgsQ0FQQztBQVFuQixRQUFJLEdBQUosQ0FSbUI7QUFTbkIsUUFBSSxXQUFXLEtBQUssT0FBTCxFQUFYLENBVGU7QUFVbkIsUUFBSSxZQUFZLFNBQVMsTUFBVCxDQVZHOztBQVluQixTQUFLLFFBQVEsQ0FBUixFQUFXLFFBQVEsV0FBUixFQUFxQixPQUFyQyxFQUE4QztBQUM1QyxVQUFJLFdBQVcsS0FBWCxNQUFzQixTQUFTLEtBQVQsQ0FBdEIsRUFBdUM7QUFDekMsY0FEeUM7T0FBM0M7S0FERjs7QUFNQSxRQUFJLFNBQVMsY0FBYyxLQUFkLENBbEJNO0FBbUJuQixTQUFLLE1BQU0sQ0FBTixFQUFTLE9BQU8sTUFBUCxFQUFlLEtBQTdCLEVBQW9DO0FBQ2xDLFVBQUksV0FBVyxjQUFjLEdBQWQsQ0FBWCxLQUFrQyxTQUFTLFlBQVksR0FBWixDQUEzQyxFQUE2RDtBQUMvRCxjQUQrRDtPQUFqRTtLQURGOztBQU1BLFFBQUksWUFBWSxNQUFNLENBQU4sR0FBVSxJQUFJLEdBQUosR0FBVSxTQUFwQixDQXpCRztBQTBCbkIsU0FBSyxhQUFMLEdBQXFCLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsU0FBdEIsQ0FBckIsQ0ExQm1CO0FBMkJuQixXQUFPLEtBQUssYUFBTCxDQTNCWTtHQUFaO0NBekJYOztBQXdEQSxZQUFZLFlBQVosQ0FBeUIsd0JBQXpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQix3QkFBakIiLCJmaWxlIjoiRmFsbGJhY2tDb21wb3NpdGlvblN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZVxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBQb29sZWRDbGFzcyA9IHJlcXVpcmUoJy4vUG9vbGVkQ2xhc3MnKTtcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIGdldFRleHRDb250ZW50QWNjZXNzb3IgPSByZXF1aXJlKCcuL2dldFRleHRDb250ZW50QWNjZXNzb3InKTtcblxuLyoqXG4gKiBUaGlzIGhlbHBlciBjbGFzcyBzdG9yZXMgaW5mb3JtYXRpb24gYWJvdXQgdGV4dCBjb250ZW50IG9mIGEgdGFyZ2V0IG5vZGUsXG4gKiBhbGxvd2luZyBjb21wYXJpc29uIG9mIGNvbnRlbnQgYmVmb3JlIGFuZCBhZnRlciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIElkZW50aWZ5IHRoZSBub2RlIHdoZXJlIHNlbGVjdGlvbiBjdXJyZW50bHkgYmVnaW5zLCB0aGVuIG9ic2VydmVcbiAqIGJvdGggaXRzIHRleHQgY29udGVudCBhbmQgaXRzIGN1cnJlbnQgcG9zaXRpb24gaW4gdGhlIERPTS4gU2luY2UgdGhlXG4gKiBicm93c2VyIG1heSBuYXRpdmVseSByZXBsYWNlIHRoZSB0YXJnZXQgbm9kZSBkdXJpbmcgY29tcG9zaXRpb24sIHdlIGNhblxuICogdXNlIGl0cyBwb3NpdGlvbiB0byBmaW5kIGl0cyByZXBsYWNlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSByb290XG4gKi9cbmZ1bmN0aW9uIEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZShyb290KSB7XG4gIHRoaXMuX3Jvb3QgPSByb290O1xuICB0aGlzLl9zdGFydFRleHQgPSB0aGlzLmdldFRleHQoKTtcbiAgdGhpcy5fZmFsbGJhY2tUZXh0ID0gbnVsbDtcbn1cblxuYXNzaWduKEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZS5wcm90b3R5cGUsIHtcbiAgZGVzdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0VGV4dCA9IG51bGw7XG4gICAgdGhpcy5fZmFsbGJhY2tUZXh0ID0gbnVsbDtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgdGV4dCBvZiBpbnB1dC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0VGV4dDogZnVuY3Rpb24gKCkge1xuICAgIGlmICgndmFsdWUnIGluIHRoaXMuX3Jvb3QpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yb290LnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcm9vdFtnZXRUZXh0Q29udGVudEFjY2Vzc29yKCldO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIGRpZmZlcmluZyBzdWJzdHJpbmcgYmV0d2VlbiB0aGUgaW5pdGlhbGx5IHN0b3JlZFxuICAgKiB0ZXh0IGNvbnRlbnQgYW5kIHRoZSBjdXJyZW50IGNvbnRlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fZmFsbGJhY2tUZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUZXh0O1xuICAgIH1cblxuICAgIHZhciBzdGFydDtcbiAgICB2YXIgc3RhcnRWYWx1ZSA9IHRoaXMuX3N0YXJ0VGV4dDtcbiAgICB2YXIgc3RhcnRMZW5ndGggPSBzdGFydFZhbHVlLmxlbmd0aDtcbiAgICB2YXIgZW5kO1xuICAgIHZhciBlbmRWYWx1ZSA9IHRoaXMuZ2V0VGV4dCgpO1xuICAgIHZhciBlbmRMZW5ndGggPSBlbmRWYWx1ZS5sZW5ndGg7XG5cbiAgICBmb3IgKHN0YXJ0ID0gMDsgc3RhcnQgPCBzdGFydExlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKHN0YXJ0VmFsdWVbc3RhcnRdICE9PSBlbmRWYWx1ZVtzdGFydF0pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG1pbkVuZCA9IHN0YXJ0TGVuZ3RoIC0gc3RhcnQ7XG4gICAgZm9yIChlbmQgPSAxOyBlbmQgPD0gbWluRW5kOyBlbmQrKykge1xuICAgICAgaWYgKHN0YXJ0VmFsdWVbc3RhcnRMZW5ndGggLSBlbmRdICE9PSBlbmRWYWx1ZVtlbmRMZW5ndGggLSBlbmRdKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzbGljZVRhaWwgPSBlbmQgPiAxID8gMSAtIGVuZCA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9mYWxsYmFja1RleHQgPSBlbmRWYWx1ZS5zbGljZShzdGFydCwgc2xpY2VUYWlsKTtcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUZXh0O1xuICB9XG59KTtcblxuUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmFsbGJhY2tDb21wb3NpdGlvblN0YXRlOyJdfQ==