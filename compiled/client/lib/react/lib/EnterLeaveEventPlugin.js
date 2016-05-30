/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventPropagators = require('./EventPropagators');
var SyntheticMouseEvent = require('./SyntheticMouseEvent');

var ReactMount = require('./ReactMount');
var keyOf = require('fbjs/lib/keyOf');

var topLevelTypes = EventConstants.topLevelTypes;
var getFirstReactDOM = ReactMount.getFirstReactDOM;

var eventTypes = {
  mouseEnter: {
    registrationName: keyOf({ onMouseEnter: null }),
    dependencies: [topLevelTypes.topMouseOut, topLevelTypes.topMouseOver]
  },
  mouseLeave: {
    registrationName: keyOf({ onMouseLeave: null }),
    dependencies: [topLevelTypes.topMouseOut, topLevelTypes.topMouseOver]
  }
};

var extractedEvents = [null, null];

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
    if (topLevelType === topLevelTypes.topMouseOver && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== topLevelTypes.topMouseOut && topLevelType !== topLevelTypes.topMouseOver) {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (topLevelTarget.window === topLevelTarget) {
      // `topLevelTarget` is probably a window object.
      win = topLevelTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = topLevelTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from;
    var to;
    var fromID = '';
    var toID = '';
    if (topLevelType === topLevelTypes.topMouseOut) {
      from = topLevelTarget;
      fromID = topLevelTargetID;
      to = getFirstReactDOM(nativeEvent.relatedTarget || nativeEvent.toElement);
      if (to) {
        toID = ReactMount.getID(to);
      } else {
        to = win;
      }
      to = to || win;
    } else {
      from = win;
      to = topLevelTarget;
      toID = topLevelTargetID;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var leave = SyntheticMouseEvent.getPooled(eventTypes.mouseLeave, fromID, nativeEvent, nativeEventTarget);
    leave.type = 'mouseleave';
    leave.target = from;
    leave.relatedTarget = to;

    var enter = SyntheticMouseEvent.getPooled(eventTypes.mouseEnter, toID, nativeEvent, nativeEventTarget);
    enter.type = 'mouseenter';
    enter.target = to;
    enter.relatedTarget = from;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, fromID, toID);

    extractedEvents[0] = leave;
    extractedEvents[1] = enter;

    return extractedEvents;
  }

};

module.exports = EnterLeaveEventPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0VudGVyTGVhdmVFdmVudFBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQXJCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBMUI7O0FBRUEsSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFqQjtBQUNBLElBQUksUUFBUSxRQUFRLGdCQUFSLENBQVo7O0FBRUEsSUFBSSxnQkFBZ0IsZUFBZSxhQUFuQztBQUNBLElBQUksbUJBQW1CLFdBQVcsZ0JBQWxDOztBQUVBLElBQUksYUFBYTtBQUNmLGNBQVk7QUFDVixzQkFBa0IsTUFBTSxFQUFFLGNBQWMsSUFBaEIsRUFBTixDQURSO0FBRVYsa0JBQWMsQ0FBQyxjQUFjLFdBQWYsRUFBNEIsY0FBYyxZQUExQztBQUZKLEdBREc7QUFLZixjQUFZO0FBQ1Ysc0JBQWtCLE1BQU0sRUFBRSxjQUFjLElBQWhCLEVBQU4sQ0FEUjtBQUVWLGtCQUFjLENBQUMsY0FBYyxXQUFmLEVBQTRCLGNBQWMsWUFBMUM7QUFGSjtBQUxHLENBQWpCOztBQVdBLElBQUksa0JBQWtCLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBdEI7O0FBRUEsSUFBSSx3QkFBd0I7O0FBRTFCLGNBQVksVUFGYzs7Ozs7Ozs7Ozs7Ozs7OztBQWtCMUIsaUJBQWUsdUJBQVUsWUFBVixFQUF3QixjQUF4QixFQUF3QyxnQkFBeEMsRUFBMEQsV0FBMUQsRUFBdUUsaUJBQXZFLEVBQTBGO0FBQ3ZHLFFBQUksaUJBQWlCLGNBQWMsWUFBL0IsS0FBZ0QsWUFBWSxhQUFaLElBQTZCLFlBQVksV0FBekYsQ0FBSixFQUEyRztBQUN6RyxhQUFPLElBQVA7QUFDRDtBQUNELFFBQUksaUJBQWlCLGNBQWMsV0FBL0IsSUFBOEMsaUJBQWlCLGNBQWMsWUFBakYsRUFBK0Y7O0FBRTdGLGFBQU8sSUFBUDtBQUNEOztBQUVELFFBQUksR0FBSjtBQUNBLFFBQUksZUFBZSxNQUFmLEtBQTBCLGNBQTlCLEVBQThDOztBQUU1QyxZQUFNLGNBQU47QUFDRCxLQUhELE1BR087O0FBRUwsVUFBSSxNQUFNLGVBQWUsYUFBekI7QUFDQSxVQUFJLEdBQUosRUFBUztBQUNQLGNBQU0sSUFBSSxXQUFKLElBQW1CLElBQUksWUFBN0I7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNLE1BQU47QUFDRDtBQUNGOztBQUVELFFBQUksSUFBSjtBQUNBLFFBQUksRUFBSjtBQUNBLFFBQUksU0FBUyxFQUFiO0FBQ0EsUUFBSSxPQUFPLEVBQVg7QUFDQSxRQUFJLGlCQUFpQixjQUFjLFdBQW5DLEVBQWdEO0FBQzlDLGFBQU8sY0FBUDtBQUNBLGVBQVMsZ0JBQVQ7QUFDQSxXQUFLLGlCQUFpQixZQUFZLGFBQVosSUFBNkIsWUFBWSxTQUExRCxDQUFMO0FBQ0EsVUFBSSxFQUFKLEVBQVE7QUFDTixlQUFPLFdBQVcsS0FBWCxDQUFpQixFQUFqQixDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxHQUFMO0FBQ0Q7QUFDRCxXQUFLLE1BQU0sR0FBWDtBQUNELEtBVkQsTUFVTztBQUNMLGFBQU8sR0FBUDtBQUNBLFdBQUssY0FBTDtBQUNBLGFBQU8sZ0JBQVA7QUFDRDs7QUFFRCxRQUFJLFNBQVMsRUFBYixFQUFpQjs7QUFFZixhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLFFBQVEsb0JBQW9CLFNBQXBCLENBQThCLFdBQVcsVUFBekMsRUFBcUQsTUFBckQsRUFBNkQsV0FBN0QsRUFBMEUsaUJBQTFFLENBQVo7QUFDQSxVQUFNLElBQU4sR0FBYSxZQUFiO0FBQ0EsVUFBTSxNQUFOLEdBQWUsSUFBZjtBQUNBLFVBQU0sYUFBTixHQUFzQixFQUF0Qjs7QUFFQSxRQUFJLFFBQVEsb0JBQW9CLFNBQXBCLENBQThCLFdBQVcsVUFBekMsRUFBcUQsSUFBckQsRUFBMkQsV0FBM0QsRUFBd0UsaUJBQXhFLENBQVo7QUFDQSxVQUFNLElBQU4sR0FBYSxZQUFiO0FBQ0EsVUFBTSxNQUFOLEdBQWUsRUFBZjtBQUNBLFVBQU0sYUFBTixHQUFzQixJQUF0Qjs7QUFFQSxxQkFBaUIsOEJBQWpCLENBQWdELEtBQWhELEVBQXVELEtBQXZELEVBQThELE1BQTlELEVBQXNFLElBQXRFOztBQUVBLG9CQUFnQixDQUFoQixJQUFxQixLQUFyQjtBQUNBLG9CQUFnQixDQUFoQixJQUFxQixLQUFyQjs7QUFFQSxXQUFPLGVBQVA7QUFDRDs7QUFsRnlCLENBQTVCOztBQXNGQSxPQUFPLE9BQVAsR0FBaUIscUJBQWpCIiwiZmlsZSI6IkVudGVyTGVhdmVFdmVudFBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBFbnRlckxlYXZlRXZlbnRQbHVnaW5cbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgRXZlbnRQcm9wYWdhdG9ycyA9IHJlcXVpcmUoJy4vRXZlbnRQcm9wYWdhdG9ycycpO1xudmFyIFN5bnRoZXRpY01vdXNlRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY01vdXNlRXZlbnQnKTtcblxudmFyIFJlYWN0TW91bnQgPSByZXF1aXJlKCcuL1JlYWN0TW91bnQnKTtcbnZhciBrZXlPZiA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU9mJyk7XG5cbnZhciB0b3BMZXZlbFR5cGVzID0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcztcbnZhciBnZXRGaXJzdFJlYWN0RE9NID0gUmVhY3RNb3VudC5nZXRGaXJzdFJlYWN0RE9NO1xuXG52YXIgZXZlbnRUeXBlcyA9IHtcbiAgbW91c2VFbnRlcjoge1xuICAgIHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25Nb3VzZUVudGVyOiBudWxsIH0pLFxuICAgIGRlcGVuZGVuY2llczogW3RvcExldmVsVHlwZXMudG9wTW91c2VPdXQsIHRvcExldmVsVHlwZXMudG9wTW91c2VPdmVyXVxuICB9LFxuICBtb3VzZUxlYXZlOiB7XG4gICAgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvbk1vdXNlTGVhdmU6IG51bGwgfSksXG4gICAgZGVwZW5kZW5jaWVzOiBbdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU91dCwgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU92ZXJdXG4gIH1cbn07XG5cbnZhciBleHRyYWN0ZWRFdmVudHMgPSBbbnVsbCwgbnVsbF07XG5cbnZhciBFbnRlckxlYXZlRXZlbnRQbHVnaW4gPSB7XG5cbiAgZXZlbnRUeXBlczogZXZlbnRUeXBlcyxcblxuICAvKipcbiAgICogRm9yIGFsbW9zdCBldmVyeSBpbnRlcmFjdGlvbiB3ZSBjYXJlIGFib3V0LCB0aGVyZSB3aWxsIGJlIGJvdGggYSB0b3AtbGV2ZWxcbiAgICogYG1vdXNlb3ZlcmAgYW5kIGBtb3VzZW91dGAgZXZlbnQgdGhhdCBvY2N1cnMuIE9ubHkgdXNlIGBtb3VzZW91dGAgc28gdGhhdFxuICAgKiB3ZSBkbyBub3QgZXh0cmFjdCBkdXBsaWNhdGUgZXZlbnRzLiBIb3dldmVyLCBtb3ZpbmcgdGhlIG1vdXNlIGludG8gdGhlXG4gICAqIGJyb3dzZXIgZnJvbSBvdXRzaWRlIHdpbGwgbm90IGZpcmUgYSBgbW91c2VvdXRgIGV2ZW50LiBJbiB0aGlzIGNhc2UsIHdlIHVzZVxuICAgKiB0aGUgYG1vdXNlb3ZlcmAgdG9wLWxldmVsIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gICAqIEBwYXJhbSB7RE9NRXZlbnRUYXJnZXR9IHRvcExldmVsVGFyZ2V0IFRoZSBsaXN0ZW5pbmcgY29tcG9uZW50IHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICAgKiBAcmV0dXJuIHsqfSBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAgICogQHNlZSB7RXZlbnRQbHVnaW5IdWIuZXh0cmFjdEV2ZW50c31cbiAgICovXG4gIGV4dHJhY3RFdmVudHM6IGZ1bmN0aW9uICh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgICBpZiAodG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3ZlciAmJiAobmF0aXZlRXZlbnQucmVsYXRlZFRhcmdldCB8fCBuYXRpdmVFdmVudC5mcm9tRWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAodG9wTGV2ZWxUeXBlICE9PSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3V0ICYmIHRvcExldmVsVHlwZSAhPT0gdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU92ZXIpIHtcbiAgICAgIC8vIE11c3Qgbm90IGJlIGEgbW91c2UgaW4gb3IgbW91c2Ugb3V0IC0gaWdub3JpbmcuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgd2luO1xuICAgIGlmICh0b3BMZXZlbFRhcmdldC53aW5kb3cgPT09IHRvcExldmVsVGFyZ2V0KSB7XG4gICAgICAvLyBgdG9wTGV2ZWxUYXJnZXRgIGlzIHByb2JhYmx5IGEgd2luZG93IG9iamVjdC5cbiAgICAgIHdpbiA9IHRvcExldmVsVGFyZ2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBGaWd1cmUgb3V0IHdoeSBgb3duZXJEb2N1bWVudGAgaXMgc29tZXRpbWVzIHVuZGVmaW5lZCBpbiBJRTguXG4gICAgICB2YXIgZG9jID0gdG9wTGV2ZWxUYXJnZXQub3duZXJEb2N1bWVudDtcbiAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgd2luID0gZG9jLmRlZmF1bHRWaWV3IHx8IGRvYy5wYXJlbnRXaW5kb3c7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW4gPSB3aW5kb3c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGZyb207XG4gICAgdmFyIHRvO1xuICAgIHZhciBmcm9tSUQgPSAnJztcbiAgICB2YXIgdG9JRCA9ICcnO1xuICAgIGlmICh0b3BMZXZlbFR5cGUgPT09IHRvcExldmVsVHlwZXMudG9wTW91c2VPdXQpIHtcbiAgICAgIGZyb20gPSB0b3BMZXZlbFRhcmdldDtcbiAgICAgIGZyb21JRCA9IHRvcExldmVsVGFyZ2V0SUQ7XG4gICAgICB0byA9IGdldEZpcnN0UmVhY3RET00obmF0aXZlRXZlbnQucmVsYXRlZFRhcmdldCB8fCBuYXRpdmVFdmVudC50b0VsZW1lbnQpO1xuICAgICAgaWYgKHRvKSB7XG4gICAgICAgIHRvSUQgPSBSZWFjdE1vdW50LmdldElEKHRvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvID0gd2luO1xuICAgICAgfVxuICAgICAgdG8gPSB0byB8fCB3aW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb20gPSB3aW47XG4gICAgICB0byA9IHRvcExldmVsVGFyZ2V0O1xuICAgICAgdG9JRCA9IHRvcExldmVsVGFyZ2V0SUQ7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPT09IHRvKSB7XG4gICAgICAvLyBOb3RoaW5nIHBlcnRhaW5zIHRvIG91ciBtYW5hZ2VkIGNvbXBvbmVudHMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGVhdmUgPSBTeW50aGV0aWNNb3VzZUV2ZW50LmdldFBvb2xlZChldmVudFR5cGVzLm1vdXNlTGVhdmUsIGZyb21JRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICBsZWF2ZS50eXBlID0gJ21vdXNlbGVhdmUnO1xuICAgIGxlYXZlLnRhcmdldCA9IGZyb207XG4gICAgbGVhdmUucmVsYXRlZFRhcmdldCA9IHRvO1xuXG4gICAgdmFyIGVudGVyID0gU3ludGhldGljTW91c2VFdmVudC5nZXRQb29sZWQoZXZlbnRUeXBlcy5tb3VzZUVudGVyLCB0b0lELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICAgIGVudGVyLnR5cGUgPSAnbW91c2VlbnRlcic7XG4gICAgZW50ZXIudGFyZ2V0ID0gdG87XG4gICAgZW50ZXIucmVsYXRlZFRhcmdldCA9IGZyb207XG5cbiAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVFbnRlckxlYXZlRGlzcGF0Y2hlcyhsZWF2ZSwgZW50ZXIsIGZyb21JRCwgdG9JRCk7XG5cbiAgICBleHRyYWN0ZWRFdmVudHNbMF0gPSBsZWF2ZTtcbiAgICBleHRyYWN0ZWRFdmVudHNbMV0gPSBlbnRlcjtcblxuICAgIHJldHVybiBleHRyYWN0ZWRFdmVudHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbnRlckxlYXZlRXZlbnRQbHVnaW47Il19