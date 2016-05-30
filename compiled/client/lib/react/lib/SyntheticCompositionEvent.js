/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticEvent = require('./SyntheticEvent');

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);

module.exports = SyntheticCompositionEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1N5bnRoZXRpY0NvbXBvc2l0aW9uRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjs7Ozs7O0FBTUEsSUFBSSw0QkFBNEI7QUFDOUIsUUFBTTtBQUR3QixDQUFoQzs7Ozs7Ozs7QUFVQSxTQUFTLHlCQUFULENBQW1DLGNBQW5DLEVBQW1ELGNBQW5ELEVBQW1FLFdBQW5FLEVBQWdGLGlCQUFoRixFQUFtRztBQUNqRyxpQkFBZSxJQUFmLENBQW9CLElBQXBCLEVBQTBCLGNBQTFCLEVBQTBDLGNBQTFDLEVBQTBELFdBQTFELEVBQXVFLGlCQUF2RTtBQUNEOztBQUVELGVBQWUsWUFBZixDQUE0Qix5QkFBNUIsRUFBdUQseUJBQXZEOztBQUVBLE9BQU8sT0FBUCxHQUFpQix5QkFBakIiLCJmaWxlIjoiU3ludGhldGljQ29tcG9zaXRpb25FdmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBTeW50aGV0aWNDb21wb3NpdGlvbkV2ZW50XG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFN5bnRoZXRpY0V2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNFdmVudCcpO1xuXG4vKipcbiAqIEBpbnRlcmZhY2UgRXZlbnRcbiAqIEBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudHMtY29tcG9zaXRpb25ldmVudHNcbiAqL1xudmFyIENvbXBvc2l0aW9uRXZlbnRJbnRlcmZhY2UgPSB7XG4gIGRhdGE6IG51bGxcbn07XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGRpc3BhdGNoQ29uZmlnIENvbmZpZ3VyYXRpb24gdXNlZCB0byBkaXNwYXRjaCB0aGlzIGV2ZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGRpc3BhdGNoTWFya2VyIE1hcmtlciBpZGVudGlmeWluZyB0aGUgZXZlbnQgdGFyZ2V0LlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQGV4dGVuZHMge1N5bnRoZXRpY1VJRXZlbnR9XG4gKi9cbmZ1bmN0aW9uIFN5bnRoZXRpY0NvbXBvc2l0aW9uRXZlbnQoZGlzcGF0Y2hDb25maWcsIGRpc3BhdGNoTWFya2VyLCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgU3ludGhldGljRXZlbnQuY2FsbCh0aGlzLCBkaXNwYXRjaENvbmZpZywgZGlzcGF0Y2hNYXJrZXIsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG59XG5cblN5bnRoZXRpY0V2ZW50LmF1Z21lbnRDbGFzcyhTeW50aGV0aWNDb21wb3NpdGlvbkV2ZW50LCBDb21wb3NpdGlvbkV2ZW50SW50ZXJmYWNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW50aGV0aWNDb21wb3NpdGlvbkV2ZW50OyJdfQ==