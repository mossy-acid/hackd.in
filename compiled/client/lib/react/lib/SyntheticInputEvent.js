/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticInputEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticInputEvent, InputEventInterface);

module.exports = SyntheticInputEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1N5bnRoZXRpY0lucHV0RXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjs7Ozs7OztBQU9BLElBQUksc0JBQXNCO0FBQ3hCLFFBQU07QUFEa0IsQ0FBMUI7Ozs7Ozs7O0FBVUEsU0FBUyxtQkFBVCxDQUE2QixjQUE3QixFQUE2QyxjQUE3QyxFQUE2RCxXQUE3RCxFQUEwRSxpQkFBMUUsRUFBNkY7QUFDM0YsaUJBQWUsSUFBZixDQUFvQixJQUFwQixFQUEwQixjQUExQixFQUEwQyxjQUExQyxFQUEwRCxXQUExRCxFQUF1RSxpQkFBdkU7QUFDRDs7QUFFRCxlQUFlLFlBQWYsQ0FBNEIsbUJBQTVCLEVBQWlELG1CQUFqRDs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6IlN5bnRoZXRpY0lucHV0RXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgU3ludGhldGljSW5wdXRFdmVudFxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBTeW50aGV0aWNFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljRXZlbnQnKTtcblxuLyoqXG4gKiBAaW50ZXJmYWNlIEV2ZW50XG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTMvV0QtRE9NLUxldmVsLTMtRXZlbnRzLTIwMTMxMTA1XG4gKiAgICAgIC8jZXZlbnRzLWlucHV0ZXZlbnRzXG4gKi9cbnZhciBJbnB1dEV2ZW50SW50ZXJmYWNlID0ge1xuICBkYXRhOiBudWxsXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBkaXNwYXRjaENvbmZpZyBDb25maWd1cmF0aW9uIHVzZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwYXRjaE1hcmtlciBNYXJrZXIgaWRlbnRpZnlpbmcgdGhlIGV2ZW50IHRhcmdldC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEBleHRlbmRzIHtTeW50aGV0aWNVSUV2ZW50fVxuICovXG5mdW5jdGlvbiBTeW50aGV0aWNJbnB1dEV2ZW50KGRpc3BhdGNoQ29uZmlnLCBkaXNwYXRjaE1hcmtlciwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gIFN5bnRoZXRpY0V2ZW50LmNhbGwodGhpcywgZGlzcGF0Y2hDb25maWcsIGRpc3BhdGNoTWFya2VyLCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xufVxuXG5TeW50aGV0aWNFdmVudC5hdWdtZW50Q2xhc3MoU3ludGhldGljSW5wdXRFdmVudCwgSW5wdXRFdmVudEludGVyZmFjZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ludGhldGljSW5wdXRFdmVudDsiXX0=