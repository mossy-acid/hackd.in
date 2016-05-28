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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0VudGVyTGVhdmVFdmVudFBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjtBQUNKLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBdEI7O0FBRUosSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFiO0FBQ0osSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBUjs7QUFFSixJQUFJLGdCQUFnQixlQUFlLGFBQWY7QUFDcEIsSUFBSSxtQkFBbUIsV0FBVyxnQkFBWDs7QUFFdkIsSUFBSSxhQUFhO0FBQ2YsY0FBWTtBQUNWLHNCQUFrQixNQUFNLEVBQUUsY0FBYyxJQUFkLEVBQVIsQ0FBbEI7QUFDQSxrQkFBYyxDQUFDLGNBQWMsV0FBZCxFQUEyQixjQUFjLFlBQWQsQ0FBMUM7R0FGRjtBQUlBLGNBQVk7QUFDVixzQkFBa0IsTUFBTSxFQUFFLGNBQWMsSUFBZCxFQUFSLENBQWxCO0FBQ0Esa0JBQWMsQ0FBQyxjQUFjLFdBQWQsRUFBMkIsY0FBYyxZQUFkLENBQTFDO0dBRkY7Q0FMRTs7QUFXSixJQUFJLGtCQUFrQixDQUFDLElBQUQsRUFBTyxJQUFQLENBQWxCOztBQUVKLElBQUksd0JBQXdCOztBQUUxQixjQUFZLFVBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsaUJBQWUsdUJBQVUsWUFBVixFQUF3QixjQUF4QixFQUF3QyxnQkFBeEMsRUFBMEQsV0FBMUQsRUFBdUUsaUJBQXZFLEVBQTBGO0FBQ3ZHLFFBQUksaUJBQWlCLGNBQWMsWUFBZCxLQUErQixZQUFZLGFBQVosSUFBNkIsWUFBWSxXQUFaLENBQTdFLEVBQXVHO0FBQ3pHLGFBQU8sSUFBUCxDQUR5RztLQUEzRztBQUdBLFFBQUksaUJBQWlCLGNBQWMsV0FBZCxJQUE2QixpQkFBaUIsY0FBYyxZQUFkLEVBQTRCOztBQUU3RixhQUFPLElBQVAsQ0FGNkY7S0FBL0Y7O0FBS0EsUUFBSSxHQUFKLENBVHVHO0FBVXZHLFFBQUksZUFBZSxNQUFmLEtBQTBCLGNBQTFCLEVBQTBDOztBQUU1QyxZQUFNLGNBQU4sQ0FGNEM7S0FBOUMsTUFHTzs7QUFFTCxVQUFJLE1BQU0sZUFBZSxhQUFmLENBRkw7QUFHTCxVQUFJLEdBQUosRUFBUztBQUNQLGNBQU0sSUFBSSxXQUFKLElBQW1CLElBQUksWUFBSixDQURsQjtPQUFULE1BRU87QUFDTCxjQUFNLE1BQU4sQ0FESztPQUZQO0tBTkY7O0FBYUEsUUFBSSxJQUFKLENBdkJ1RztBQXdCdkcsUUFBSSxFQUFKLENBeEJ1RztBQXlCdkcsUUFBSSxTQUFTLEVBQVQsQ0F6Qm1HO0FBMEJ2RyxRQUFJLE9BQU8sRUFBUCxDQTFCbUc7QUEyQnZHLFFBQUksaUJBQWlCLGNBQWMsV0FBZCxFQUEyQjtBQUM5QyxhQUFPLGNBQVAsQ0FEOEM7QUFFOUMsZUFBUyxnQkFBVCxDQUY4QztBQUc5QyxXQUFLLGlCQUFpQixZQUFZLGFBQVosSUFBNkIsWUFBWSxTQUFaLENBQW5ELENBSDhDO0FBSTlDLFVBQUksRUFBSixFQUFRO0FBQ04sZUFBTyxXQUFXLEtBQVgsQ0FBaUIsRUFBakIsQ0FBUCxDQURNO09BQVIsTUFFTztBQUNMLGFBQUssR0FBTCxDQURLO09BRlA7QUFLQSxXQUFLLE1BQU0sR0FBTixDQVR5QztLQUFoRCxNQVVPO0FBQ0wsYUFBTyxHQUFQLENBREs7QUFFTCxXQUFLLGNBQUwsQ0FGSztBQUdMLGFBQU8sZ0JBQVAsQ0FISztLQVZQOztBQWdCQSxRQUFJLFNBQVMsRUFBVCxFQUFhOztBQUVmLGFBQU8sSUFBUCxDQUZlO0tBQWpCOztBQUtBLFFBQUksUUFBUSxvQkFBb0IsU0FBcEIsQ0FBOEIsV0FBVyxVQUFYLEVBQXVCLE1BQXJELEVBQTZELFdBQTdELEVBQTBFLGlCQUExRSxDQUFSLENBaERtRztBQWlEdkcsVUFBTSxJQUFOLEdBQWEsWUFBYixDQWpEdUc7QUFrRHZHLFVBQU0sTUFBTixHQUFlLElBQWYsQ0FsRHVHO0FBbUR2RyxVQUFNLGFBQU4sR0FBc0IsRUFBdEIsQ0FuRHVHOztBQXFEdkcsUUFBSSxRQUFRLG9CQUFvQixTQUFwQixDQUE4QixXQUFXLFVBQVgsRUFBdUIsSUFBckQsRUFBMkQsV0FBM0QsRUFBd0UsaUJBQXhFLENBQVIsQ0FyRG1HO0FBc0R2RyxVQUFNLElBQU4sR0FBYSxZQUFiLENBdER1RztBQXVEdkcsVUFBTSxNQUFOLEdBQWUsRUFBZixDQXZEdUc7QUF3RHZHLFVBQU0sYUFBTixHQUFzQixJQUF0QixDQXhEdUc7O0FBMER2RyxxQkFBaUIsOEJBQWpCLENBQWdELEtBQWhELEVBQXVELEtBQXZELEVBQThELE1BQTlELEVBQXNFLElBQXRFLEVBMUR1Rzs7QUE0RHZHLG9CQUFnQixDQUFoQixJQUFxQixLQUFyQixDQTVEdUc7QUE2RHZHLG9CQUFnQixDQUFoQixJQUFxQixLQUFyQixDQTdEdUc7O0FBK0R2RyxXQUFPLGVBQVAsQ0EvRHVHO0dBQTFGOztDQWxCYjs7QUFzRkosT0FBTyxPQUFQLEdBQWlCLHFCQUFqQiIsImZpbGUiOiJFbnRlckxlYXZlRXZlbnRQbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRW50ZXJMZWF2ZUV2ZW50UGx1Z2luXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9FdmVudENvbnN0YW50cycpO1xudmFyIEV2ZW50UHJvcGFnYXRvcnMgPSByZXF1aXJlKCcuL0V2ZW50UHJvcGFnYXRvcnMnKTtcbnZhciBTeW50aGV0aWNNb3VzZUV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNNb3VzZUV2ZW50Jyk7XG5cbnZhciBSZWFjdE1vdW50ID0gcmVxdWlyZSgnLi9SZWFjdE1vdW50Jyk7XG52YXIga2V5T2YgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlPZicpO1xuXG52YXIgdG9wTGV2ZWxUeXBlcyA9IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXM7XG52YXIgZ2V0Rmlyc3RSZWFjdERPTSA9IFJlYWN0TW91bnQuZ2V0Rmlyc3RSZWFjdERPTTtcblxudmFyIGV2ZW50VHlwZXMgPSB7XG4gIG1vdXNlRW50ZXI6IHtcbiAgICByZWdpc3RyYXRpb25OYW1lOiBrZXlPZih7IG9uTW91c2VFbnRlcjogbnVsbCB9KSxcbiAgICBkZXBlbmRlbmNpZXM6IFt0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3V0LCB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3Zlcl1cbiAgfSxcbiAgbW91c2VMZWF2ZToge1xuICAgIHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25Nb3VzZUxlYXZlOiBudWxsIH0pLFxuICAgIGRlcGVuZGVuY2llczogW3RvcExldmVsVHlwZXMudG9wTW91c2VPdXQsIHRvcExldmVsVHlwZXMudG9wTW91c2VPdmVyXVxuICB9XG59O1xuXG52YXIgZXh0cmFjdGVkRXZlbnRzID0gW251bGwsIG51bGxdO1xuXG52YXIgRW50ZXJMZWF2ZUV2ZW50UGx1Z2luID0ge1xuXG4gIGV2ZW50VHlwZXM6IGV2ZW50VHlwZXMsXG5cbiAgLyoqXG4gICAqIEZvciBhbG1vc3QgZXZlcnkgaW50ZXJhY3Rpb24gd2UgY2FyZSBhYm91dCwgdGhlcmUgd2lsbCBiZSBib3RoIGEgdG9wLWxldmVsXG4gICAqIGBtb3VzZW92ZXJgIGFuZCBgbW91c2VvdXRgIGV2ZW50IHRoYXQgb2NjdXJzLiBPbmx5IHVzZSBgbW91c2VvdXRgIHNvIHRoYXRcbiAgICogd2UgZG8gbm90IGV4dHJhY3QgZHVwbGljYXRlIGV2ZW50cy4gSG93ZXZlciwgbW92aW5nIHRoZSBtb3VzZSBpbnRvIHRoZVxuICAgKiBicm93c2VyIGZyb20gb3V0c2lkZSB3aWxsIG5vdCBmaXJlIGEgYG1vdXNlb3V0YCBldmVudC4gSW4gdGhpcyBjYXNlLCB3ZSB1c2VcbiAgICogdGhlIGBtb3VzZW92ZXJgIHRvcC1sZXZlbCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICAgKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFRhcmdldElEIElEIG9mIGB0b3BMZXZlbFRhcmdldGAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAgICogQHJldHVybiB7Kn0gQW4gYWNjdW11bGF0aW9uIG9mIHN5bnRoZXRpYyBldmVudHMuXG4gICAqIEBzZWUge0V2ZW50UGx1Z2luSHViLmV4dHJhY3RFdmVudHN9XG4gICAqL1xuICBleHRyYWN0RXZlbnRzOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gICAgaWYgKHRvcExldmVsVHlwZSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU92ZXIgJiYgKG5hdGl2ZUV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgbmF0aXZlRXZlbnQuZnJvbUVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRvcExldmVsVHlwZSAhPT0gdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU91dCAmJiB0b3BMZXZlbFR5cGUgIT09IHRvcExldmVsVHlwZXMudG9wTW91c2VPdmVyKSB7XG4gICAgICAvLyBNdXN0IG5vdCBiZSBhIG1vdXNlIGluIG9yIG1vdXNlIG91dCAtIGlnbm9yaW5nLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHdpbjtcbiAgICBpZiAodG9wTGV2ZWxUYXJnZXQud2luZG93ID09PSB0b3BMZXZlbFRhcmdldCkge1xuICAgICAgLy8gYHRvcExldmVsVGFyZ2V0YCBpcyBwcm9iYWJseSBhIHdpbmRvdyBvYmplY3QuXG4gICAgICB3aW4gPSB0b3BMZXZlbFRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogRmlndXJlIG91dCB3aHkgYG93bmVyRG9jdW1lbnRgIGlzIHNvbWV0aW1lcyB1bmRlZmluZWQgaW4gSUU4LlxuICAgICAgdmFyIGRvYyA9IHRvcExldmVsVGFyZ2V0Lm93bmVyRG9jdW1lbnQ7XG4gICAgICBpZiAoZG9jKSB7XG4gICAgICAgIHdpbiA9IGRvYy5kZWZhdWx0VmlldyB8fCBkb2MucGFyZW50V2luZG93O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luID0gd2luZG93O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBmcm9tO1xuICAgIHZhciB0bztcbiAgICB2YXIgZnJvbUlEID0gJyc7XG4gICAgdmFyIHRvSUQgPSAnJztcbiAgICBpZiAodG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3V0KSB7XG4gICAgICBmcm9tID0gdG9wTGV2ZWxUYXJnZXQ7XG4gICAgICBmcm9tSUQgPSB0b3BMZXZlbFRhcmdldElEO1xuICAgICAgdG8gPSBnZXRGaXJzdFJlYWN0RE9NKG5hdGl2ZUV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgbmF0aXZlRXZlbnQudG9FbGVtZW50KTtcbiAgICAgIGlmICh0bykge1xuICAgICAgICB0b0lEID0gUmVhY3RNb3VudC5nZXRJRCh0byk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0byA9IHdpbjtcbiAgICAgIH1cbiAgICAgIHRvID0gdG8gfHwgd2luO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm9tID0gd2luO1xuICAgICAgdG8gPSB0b3BMZXZlbFRhcmdldDtcbiAgICAgIHRvSUQgPSB0b3BMZXZlbFRhcmdldElEO1xuICAgIH1cblxuICAgIGlmIChmcm9tID09PSB0bykge1xuICAgICAgLy8gTm90aGluZyBwZXJ0YWlucyB0byBvdXIgbWFuYWdlZCBjb21wb25lbnRzLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxlYXZlID0gU3ludGhldGljTW91c2VFdmVudC5nZXRQb29sZWQoZXZlbnRUeXBlcy5tb3VzZUxlYXZlLCBmcm9tSUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG4gICAgbGVhdmUudHlwZSA9ICdtb3VzZWxlYXZlJztcbiAgICBsZWF2ZS50YXJnZXQgPSBmcm9tO1xuICAgIGxlYXZlLnJlbGF0ZWRUYXJnZXQgPSB0bztcblxuICAgIHZhciBlbnRlciA9IFN5bnRoZXRpY01vdXNlRXZlbnQuZ2V0UG9vbGVkKGV2ZW50VHlwZXMubW91c2VFbnRlciwgdG9JRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICBlbnRlci50eXBlID0gJ21vdXNlZW50ZXInO1xuICAgIGVudGVyLnRhcmdldCA9IHRvO1xuICAgIGVudGVyLnJlbGF0ZWRUYXJnZXQgPSBmcm9tO1xuXG4gICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlRW50ZXJMZWF2ZURpc3BhdGNoZXMobGVhdmUsIGVudGVyLCBmcm9tSUQsIHRvSUQpO1xuXG4gICAgZXh0cmFjdGVkRXZlbnRzWzBdID0gbGVhdmU7XG4gICAgZXh0cmFjdGVkRXZlbnRzWzFdID0gZW50ZXI7XG5cbiAgICByZXR1cm4gZXh0cmFjdGVkRXZlbnRzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW50ZXJMZWF2ZUV2ZW50UGx1Z2luOyJdfQ==