/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TapEventPlugin
 * @typechecks static-only
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventPluginUtils = require('./EventPluginUtils');
var EventPropagators = require('./EventPropagators');
var SyntheticUIEvent = require('./SyntheticUIEvent');
var TouchEventUtils = require('fbjs/lib/TouchEventUtils');
var ViewportMetrics = require('./ViewportMetrics');

var keyOf = require('fbjs/lib/keyOf');
var topLevelTypes = EventConstants.topLevelTypes;

var isStartish = EventPluginUtils.isStartish;
var isEndish = EventPluginUtils.isEndish;

/**
 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
 * in order to still be considered a 'tap' event.
 */
var tapMoveThreshold = 10;
var startCoords = { x: null, y: null };

var Axis = {
  x: { page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft' },
  y: { page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop' }
};

function getAxisCoordOfEvent(axis, nativeEvent) {
  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
  if (singleTouch) {
    return singleTouch[axis.page];
  }
  return axis.page in nativeEvent ? nativeEvent[axis.page] : nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
}

function getDistance(coords, nativeEvent) {
  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
  return Math.pow(Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2), 0.5);
}

var touchEvents = [topLevelTypes.topTouchStart, topLevelTypes.topTouchCancel, topLevelTypes.topTouchEnd, topLevelTypes.topTouchMove];

var dependencies = [topLevelTypes.topMouseDown, topLevelTypes.topMouseMove, topLevelTypes.topMouseUp].concat(touchEvents);

var eventTypes = {
  touchTap: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTouchTap: null }),
      captured: keyOf({ onTouchTapCapture: null })
    },
    dependencies: dependencies
  }
};

var usedTouch = false;
var usedTouchTime = 0;
var TOUCH_DELAY = 1000;

var TapEventPlugin = {

  tapMoveThreshold: tapMoveThreshold,

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
    if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
      return null;
    }
    // on ios, there is a delay after touch event and synthetic
    // mouse events, so that user can perform double tap
    // solution: ignore mouse events following touchevent within small timeframe
    if (touchEvents.indexOf(topLevelType) !== -1) {
      usedTouch = true;
      usedTouchTime = Date.now();
    } else {
      if (usedTouch && Date.now() - usedTouchTime < TOUCH_DELAY) {
        return null;
      }
    }
    var event = null;
    var distance = getDistance(startCoords, nativeEvent);
    if (isEndish(topLevelType) && distance < tapMoveThreshold) {
      event = SyntheticUIEvent.getPooled(eventTypes.touchTap, topLevelTargetID, nativeEvent, nativeEventTarget);
    }
    if (isStartish(topLevelType)) {
      startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
      startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
    } else if (isEndish(topLevelType)) {
      startCoords.x = 0;
      startCoords.y = 0;
    }
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = TapEventPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1RhcEV2ZW50UGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQSxJQUFJLGtCQUFrQixRQUFRLDBCQUFSLENBQXRCO0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0Qjs7QUFFQSxJQUFJLFFBQVEsUUFBUSxnQkFBUixDQUFaO0FBQ0EsSUFBSSxnQkFBZ0IsZUFBZSxhQUFuQzs7QUFFQSxJQUFJLGFBQWEsaUJBQWlCLFVBQWxDO0FBQ0EsSUFBSSxXQUFXLGlCQUFpQixRQUFoQzs7Ozs7O0FBTUEsSUFBSSxtQkFBbUIsRUFBdkI7QUFDQSxJQUFJLGNBQWMsRUFBRSxHQUFHLElBQUwsRUFBVyxHQUFHLElBQWQsRUFBbEI7O0FBRUEsSUFBSSxPQUFPO0FBQ1QsS0FBRyxFQUFFLE1BQU0sT0FBUixFQUFpQixRQUFRLFNBQXpCLEVBQW9DLFdBQVcsdUJBQS9DLEVBRE07QUFFVCxLQUFHLEVBQUUsTUFBTSxPQUFSLEVBQWlCLFFBQVEsU0FBekIsRUFBb0MsV0FBVyxzQkFBL0M7QUFGTSxDQUFYOztBQUtBLFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDOUMsTUFBSSxjQUFjLGdCQUFnQixrQkFBaEIsQ0FBbUMsV0FBbkMsQ0FBbEI7QUFDQSxNQUFJLFdBQUosRUFBaUI7QUFDZixXQUFPLFlBQVksS0FBSyxJQUFqQixDQUFQO0FBQ0Q7QUFDRCxTQUFPLEtBQUssSUFBTCxJQUFhLFdBQWIsR0FBMkIsWUFBWSxLQUFLLElBQWpCLENBQTNCLEdBQW9ELFlBQVksS0FBSyxNQUFqQixJQUEyQixnQkFBZ0IsS0FBSyxTQUFyQixDQUF0RjtBQUNEOztBQUVELFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixXQUE3QixFQUEwQztBQUN4QyxNQUFJLFFBQVEsb0JBQW9CLEtBQUssQ0FBekIsRUFBNEIsV0FBNUIsQ0FBWjtBQUNBLE1BQUksUUFBUSxvQkFBb0IsS0FBSyxDQUF6QixFQUE0QixXQUE1QixDQUFaO0FBQ0EsU0FBTyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxRQUFRLE9BQU8sQ0FBeEIsRUFBMkIsQ0FBM0IsSUFBZ0MsS0FBSyxHQUFMLENBQVMsUUFBUSxPQUFPLENBQXhCLEVBQTJCLENBQTNCLENBQXpDLEVBQXdFLEdBQXhFLENBQVA7QUFDRDs7QUFFRCxJQUFJLGNBQWMsQ0FBQyxjQUFjLGFBQWYsRUFBOEIsY0FBYyxjQUE1QyxFQUE0RCxjQUFjLFdBQTFFLEVBQXVGLGNBQWMsWUFBckcsQ0FBbEI7O0FBRUEsSUFBSSxlQUFlLENBQUMsY0FBYyxZQUFmLEVBQTZCLGNBQWMsWUFBM0MsRUFBeUQsY0FBYyxVQUF2RSxFQUFtRixNQUFuRixDQUEwRixXQUExRixDQUFuQjs7QUFFQSxJQUFJLGFBQWE7QUFDZixZQUFVO0FBQ1IsNkJBQXlCO0FBQ3ZCLGVBQVMsTUFBTSxFQUFFLFlBQVksSUFBZCxFQUFOLENBRGM7QUFFdkIsZ0JBQVUsTUFBTSxFQUFFLG1CQUFtQixJQUFyQixFQUFOO0FBRmEsS0FEakI7QUFLUixrQkFBYztBQUxOO0FBREssQ0FBakI7O0FBVUEsSUFBSSxZQUFZLEtBQWhCO0FBQ0EsSUFBSSxnQkFBZ0IsQ0FBcEI7QUFDQSxJQUFJLGNBQWMsSUFBbEI7O0FBRUEsSUFBSSxpQkFBaUI7O0FBRW5CLG9CQUFrQixnQkFGQzs7QUFJbkIsY0FBWSxVQUpPOzs7Ozs7Ozs7O0FBY25CLGlCQUFlLHVCQUFVLFlBQVYsRUFBd0IsY0FBeEIsRUFBd0MsZ0JBQXhDLEVBQTBELFdBQTFELEVBQXVFLGlCQUF2RSxFQUEwRjtBQUN2RyxRQUFJLENBQUMsV0FBVyxZQUFYLENBQUQsSUFBNkIsQ0FBQyxTQUFTLFlBQVQsQ0FBbEMsRUFBMEQ7QUFDeEQsYUFBTyxJQUFQO0FBQ0Q7Ozs7QUFJRCxRQUFJLFlBQVksT0FBWixDQUFvQixZQUFwQixNQUFzQyxDQUFDLENBQTNDLEVBQThDO0FBQzVDLGtCQUFZLElBQVo7QUFDQSxzQkFBZ0IsS0FBSyxHQUFMLEVBQWhCO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsVUFBSSxhQUFhLEtBQUssR0FBTCxLQUFhLGFBQWIsR0FBNkIsV0FBOUMsRUFBMkQ7QUFDekQsZUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELFFBQUksUUFBUSxJQUFaO0FBQ0EsUUFBSSxXQUFXLFlBQVksV0FBWixFQUF5QixXQUF6QixDQUFmO0FBQ0EsUUFBSSxTQUFTLFlBQVQsS0FBMEIsV0FBVyxnQkFBekMsRUFBMkQ7QUFDekQsY0FBUSxpQkFBaUIsU0FBakIsQ0FBMkIsV0FBVyxRQUF0QyxFQUFnRCxnQkFBaEQsRUFBa0UsV0FBbEUsRUFBK0UsaUJBQS9FLENBQVI7QUFDRDtBQUNELFFBQUksV0FBVyxZQUFYLENBQUosRUFBOEI7QUFDNUIsa0JBQVksQ0FBWixHQUFnQixvQkFBb0IsS0FBSyxDQUF6QixFQUE0QixXQUE1QixDQUFoQjtBQUNBLGtCQUFZLENBQVosR0FBZ0Isb0JBQW9CLEtBQUssQ0FBekIsRUFBNEIsV0FBNUIsQ0FBaEI7QUFDRCxLQUhELE1BR08sSUFBSSxTQUFTLFlBQVQsQ0FBSixFQUE0QjtBQUNqQyxrQkFBWSxDQUFaLEdBQWdCLENBQWhCO0FBQ0Esa0JBQVksQ0FBWixHQUFnQixDQUFoQjtBQUNEO0FBQ0QscUJBQWlCLDRCQUFqQixDQUE4QyxLQUE5QztBQUNBLFdBQU8sS0FBUDtBQUNEOztBQTNDa0IsQ0FBckI7O0FBK0NBLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJUYXBFdmVudFBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBUYXBFdmVudFBsdWdpblxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRXZlbnRDb25zdGFudHMnKTtcbnZhciBFdmVudFBsdWdpblV0aWxzID0gcmVxdWlyZSgnLi9FdmVudFBsdWdpblV0aWxzJyk7XG52YXIgRXZlbnRQcm9wYWdhdG9ycyA9IHJlcXVpcmUoJy4vRXZlbnRQcm9wYWdhdG9ycycpO1xudmFyIFN5bnRoZXRpY1VJRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY1VJRXZlbnQnKTtcbnZhciBUb3VjaEV2ZW50VXRpbHMgPSByZXF1aXJlKCdmYmpzL2xpYi9Ub3VjaEV2ZW50VXRpbHMnKTtcbnZhciBWaWV3cG9ydE1ldHJpY3MgPSByZXF1aXJlKCcuL1ZpZXdwb3J0TWV0cmljcycpO1xuXG52YXIga2V5T2YgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlPZicpO1xudmFyIHRvcExldmVsVHlwZXMgPSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzO1xuXG52YXIgaXNTdGFydGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNTdGFydGlzaDtcbnZhciBpc0VuZGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNFbmRpc2g7XG5cbi8qKlxuICogTnVtYmVyIG9mIHBpeGVscyB0aGF0IGFyZSB0b2xlcmF0ZWQgaW4gYmV0d2VlbiBhIGB0b3VjaFN0YXJ0YCBhbmQgYHRvdWNoRW5kYFxuICogaW4gb3JkZXIgdG8gc3RpbGwgYmUgY29uc2lkZXJlZCBhICd0YXAnIGV2ZW50LlxuICovXG52YXIgdGFwTW92ZVRocmVzaG9sZCA9IDEwO1xudmFyIHN0YXJ0Q29vcmRzID0geyB4OiBudWxsLCB5OiBudWxsIH07XG5cbnZhciBBeGlzID0ge1xuICB4OiB7IHBhZ2U6ICdwYWdlWCcsIGNsaWVudDogJ2NsaWVudFgnLCBlbnZTY3JvbGw6ICdjdXJyZW50UGFnZVNjcm9sbExlZnQnIH0sXG4gIHk6IHsgcGFnZTogJ3BhZ2VZJywgY2xpZW50OiAnY2xpZW50WScsIGVudlNjcm9sbDogJ2N1cnJlbnRQYWdlU2Nyb2xsVG9wJyB9XG59O1xuXG5mdW5jdGlvbiBnZXRBeGlzQ29vcmRPZkV2ZW50KGF4aXMsIG5hdGl2ZUV2ZW50KSB7XG4gIHZhciBzaW5nbGVUb3VjaCA9IFRvdWNoRXZlbnRVdGlscy5leHRyYWN0U2luZ2xlVG91Y2gobmF0aXZlRXZlbnQpO1xuICBpZiAoc2luZ2xlVG91Y2gpIHtcbiAgICByZXR1cm4gc2luZ2xlVG91Y2hbYXhpcy5wYWdlXTtcbiAgfVxuICByZXR1cm4gYXhpcy5wYWdlIGluIG5hdGl2ZUV2ZW50ID8gbmF0aXZlRXZlbnRbYXhpcy5wYWdlXSA6IG5hdGl2ZUV2ZW50W2F4aXMuY2xpZW50XSArIFZpZXdwb3J0TWV0cmljc1theGlzLmVudlNjcm9sbF07XG59XG5cbmZ1bmN0aW9uIGdldERpc3RhbmNlKGNvb3JkcywgbmF0aXZlRXZlbnQpIHtcbiAgdmFyIHBhZ2VYID0gZ2V0QXhpc0Nvb3JkT2ZFdmVudChBeGlzLngsIG5hdGl2ZUV2ZW50KTtcbiAgdmFyIHBhZ2VZID0gZ2V0QXhpc0Nvb3JkT2ZFdmVudChBeGlzLnksIG5hdGl2ZUV2ZW50KTtcbiAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KHBhZ2VYIC0gY29vcmRzLngsIDIpICsgTWF0aC5wb3cocGFnZVkgLSBjb29yZHMueSwgMiksIDAuNSk7XG59XG5cbnZhciB0b3VjaEV2ZW50cyA9IFt0b3BMZXZlbFR5cGVzLnRvcFRvdWNoU3RhcnQsIHRvcExldmVsVHlwZXMudG9wVG91Y2hDYW5jZWwsIHRvcExldmVsVHlwZXMudG9wVG91Y2hFbmQsIHRvcExldmVsVHlwZXMudG9wVG91Y2hNb3ZlXTtcblxudmFyIGRlcGVuZGVuY2llcyA9IFt0b3BMZXZlbFR5cGVzLnRvcE1vdXNlRG93biwgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU1vdmUsIHRvcExldmVsVHlwZXMudG9wTW91c2VVcF0uY29uY2F0KHRvdWNoRXZlbnRzKTtcblxudmFyIGV2ZW50VHlwZXMgPSB7XG4gIHRvdWNoVGFwOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Ub3VjaFRhcDogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uVG91Y2hUYXBDYXB0dXJlOiBudWxsIH0pXG4gICAgfSxcbiAgICBkZXBlbmRlbmNpZXM6IGRlcGVuZGVuY2llc1xuICB9XG59O1xuXG52YXIgdXNlZFRvdWNoID0gZmFsc2U7XG52YXIgdXNlZFRvdWNoVGltZSA9IDA7XG52YXIgVE9VQ0hfREVMQVkgPSAxMDAwO1xuXG52YXIgVGFwRXZlbnRQbHVnaW4gPSB7XG5cbiAgdGFwTW92ZVRocmVzaG9sZDogdGFwTW92ZVRocmVzaG9sZCxcblxuICBldmVudFR5cGVzOiBldmVudFR5cGVzLFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gICAqIEBwYXJhbSB7RE9NRXZlbnRUYXJnZXR9IHRvcExldmVsVGFyZ2V0IFRoZSBsaXN0ZW5pbmcgY29tcG9uZW50IHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICAgKiBAcmV0dXJuIHsqfSBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAgICogQHNlZSB7RXZlbnRQbHVnaW5IdWIuZXh0cmFjdEV2ZW50c31cbiAgICovXG4gIGV4dHJhY3RFdmVudHM6IGZ1bmN0aW9uICh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgICBpZiAoIWlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSAmJiAhaXNFbmRpc2godG9wTGV2ZWxUeXBlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIG9uIGlvcywgdGhlcmUgaXMgYSBkZWxheSBhZnRlciB0b3VjaCBldmVudCBhbmQgc3ludGhldGljXG4gICAgLy8gbW91c2UgZXZlbnRzLCBzbyB0aGF0IHVzZXIgY2FuIHBlcmZvcm0gZG91YmxlIHRhcFxuICAgIC8vIHNvbHV0aW9uOiBpZ25vcmUgbW91c2UgZXZlbnRzIGZvbGxvd2luZyB0b3VjaGV2ZW50IHdpdGhpbiBzbWFsbCB0aW1lZnJhbWVcbiAgICBpZiAodG91Y2hFdmVudHMuaW5kZXhPZih0b3BMZXZlbFR5cGUpICE9PSAtMSkge1xuICAgICAgdXNlZFRvdWNoID0gdHJ1ZTtcbiAgICAgIHVzZWRUb3VjaFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodXNlZFRvdWNoICYmIERhdGUubm93KCkgLSB1c2VkVG91Y2hUaW1lIDwgVE9VQ0hfREVMQVkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBldmVudCA9IG51bGw7XG4gICAgdmFyIGRpc3RhbmNlID0gZ2V0RGlzdGFuY2Uoc3RhcnRDb29yZHMsIG5hdGl2ZUV2ZW50KTtcbiAgICBpZiAoaXNFbmRpc2godG9wTGV2ZWxUeXBlKSAmJiBkaXN0YW5jZSA8IHRhcE1vdmVUaHJlc2hvbGQpIHtcbiAgICAgIGV2ZW50ID0gU3ludGhldGljVUlFdmVudC5nZXRQb29sZWQoZXZlbnRUeXBlcy50b3VjaFRhcCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICB9XG4gICAgaWYgKGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSkge1xuICAgICAgc3RhcnRDb29yZHMueCA9IGdldEF4aXNDb29yZE9mRXZlbnQoQXhpcy54LCBuYXRpdmVFdmVudCk7XG4gICAgICBzdGFydENvb3Jkcy55ID0gZ2V0QXhpc0Nvb3JkT2ZFdmVudChBeGlzLnksIG5hdGl2ZUV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGlzRW5kaXNoKHRvcExldmVsVHlwZSkpIHtcbiAgICAgIHN0YXJ0Q29vcmRzLnggPSAwO1xuICAgICAgc3RhcnRDb29yZHMueSA9IDA7XG4gICAgfVxuICAgIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZVR3b1BoYXNlRGlzcGF0Y2hlcyhldmVudCk7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFwRXZlbnRQbHVnaW47Il19