/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserEventEmitter
 * @typechecks static-only
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventPluginHub = require('./EventPluginHub');
var EventPluginRegistry = require('./EventPluginRegistry');
var ReactEventEmitterMixin = require('./ReactEventEmitterMixin');
var ReactPerf = require('./ReactPerf');
var ViewportMetrics = require('./ViewportMetrics');

var assign = require('./Object.assign');
var isEventSupported = require('./isEventSupported');

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topAbort: 'abort',
  topBlur: 'blur',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topScroll: 'scroll',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topSelectionChange: 'selectionchange',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTextInput: 'textInput',
  topTimeUpdate: 'timeupdate',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   ReactBrowserEventEmitter.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactBrowserEventEmitter = assign({}, ReactEventEmitterMixin, {

  /**
   * Injectable event backend
   */
  ReactEventListener: null,

  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function injectReactEventListener(ReactEventListener) {
      ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter.handleTopLevel);
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function setEnabled(enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function isEnabled() {
    return !!(ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.isEnabled());
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function listenTo(registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.registrationNameDependencies[registrationName];

    var topLevelTypes = EventConstants.topLevelTypes;
    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        if (dependency === topLevelTypes.topWheel) {
          if (isEventSupported('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'wheel', mountAt);
          } else if (isEventSupported('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'mousewheel', mountAt);
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'DOMMouseScroll', mountAt);
          }
        } else if (dependency === topLevelTypes.topScroll) {

          if (isEventSupported('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topScroll, 'scroll', mountAt);
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topScroll, 'scroll', ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE);
          }
        } else if (dependency === topLevelTypes.topFocus || dependency === topLevelTypes.topBlur) {

          if (isEventSupported('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topFocus, 'focus', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topBlur, 'blur', mountAt);
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topFocus, 'focusin', mountAt);
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topBlur, 'focusout', mountAt);
          }

          // to make sure blur and focus event listeners are only attached once
          isListening[topLevelTypes.topBlur] = true;
          isListening[topLevelTypes.topFocus] = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
        }

        isListening[dependency] = true;
      }
    }
  },

  trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
  },

  trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function ensureScrollValueMonitoring() {
    if (!isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  },

  eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,

  registrationNameModules: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners

});

ReactPerf.measureMethods(ReactBrowserEventEmitter, 'ReactBrowserEventEmitter', {
  putListener: 'putListener',
  deleteListener: 'deleteListener'
});

module.exports = ReactBrowserEventEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFqQjtBQUNKLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBdEI7QUFDSixJQUFJLHlCQUF5QixRQUFRLDBCQUFSLENBQXpCO0FBQ0osSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFaO0FBQ0osSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUFsQjs7QUFFSixJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeURKLElBQUkscUJBQXFCLEVBQXJCO0FBQ0osSUFBSSwwQkFBMEIsS0FBMUI7QUFDSixJQUFJLDJCQUEyQixDQUEzQjs7Ozs7QUFLSixJQUFJLGtCQUFrQjtBQUNwQixZQUFVLE9BQVY7QUFDQSxXQUFTLE1BQVQ7QUFDQSxjQUFZLFNBQVo7QUFDQSxxQkFBbUIsZ0JBQW5CO0FBQ0EsYUFBVyxRQUFYO0FBQ0EsWUFBVSxPQUFWO0FBQ0EscUJBQW1CLGdCQUFuQjtBQUNBLHVCQUFxQixrQkFBckI7QUFDQSx3QkFBc0IsbUJBQXRCO0FBQ0Esa0JBQWdCLGFBQWhCO0FBQ0EsV0FBUyxNQUFUO0FBQ0EsVUFBUSxLQUFSO0FBQ0Esa0JBQWdCLFVBQWhCO0FBQ0EsV0FBUyxNQUFUO0FBQ0EsY0FBWSxTQUFaO0FBQ0EsZ0JBQWMsV0FBZDtBQUNBLGVBQWEsVUFBYjtBQUNBLGdCQUFjLFdBQWQ7QUFDQSxlQUFhLFVBQWI7QUFDQSxnQkFBYyxXQUFkO0FBQ0EsV0FBUyxNQUFUO0FBQ0EscUJBQW1CLGdCQUFu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QixrQkFBekIsQ0FBNEMsa0JBQTVDLENBQStELE9BQS9ELEVBRjRCO0FBRzVCLGdDQUEwQixJQUExQixDQUg0QjtLQUE5QjtHQUQyQjs7QUFRN0IsNEJBQTBCLGVBQWUsd0JBQWY7O0FBRTFCLDJCQUF5QixlQUFlLHVCQUFmOztBQUV6QixlQUFhLGVBQWUsV0FBZjs7QUFFYixlQUFhLGVBQWUsV0FBZjs7QUFFYixrQkFBZ0IsZUFBZSxjQUFmOztBQUVoQixzQkFBb0IsZUFBZSxrQkFBZjs7Q0E1SVMsQ0FBM0I7O0FBZ0pKLFVBQVUsY0FBVixDQUF5Qix3QkFBekIsRUFBbUQsMEJBQW5ELEVBQStFO0FBQzdFLGVBQWEsYUFBYjtBQUNBLGtCQUFnQixnQkFBaEI7Q0FGRjs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsd0JBQWpCIiwiZmlsZSI6IlJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXJcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgRXZlbnRQbHVnaW5IdWIgPSByZXF1aXJlKCcuL0V2ZW50UGx1Z2luSHViJyk7XG52YXIgRXZlbnRQbHVnaW5SZWdpc3RyeSA9IHJlcXVpcmUoJy4vRXZlbnRQbHVnaW5SZWdpc3RyeScpO1xudmFyIFJlYWN0RXZlbnRFbWl0dGVyTWl4aW4gPSByZXF1aXJlKCcuL1JlYWN0RXZlbnRFbWl0dGVyTWl4aW4nKTtcbnZhciBSZWFjdFBlcmYgPSByZXF1aXJlKCcuL1JlYWN0UGVyZicpO1xudmFyIFZpZXdwb3J0TWV0cmljcyA9IHJlcXVpcmUoJy4vVmlld3BvcnRNZXRyaWNzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBpc0V2ZW50U3VwcG9ydGVkID0gcmVxdWlyZSgnLi9pc0V2ZW50U3VwcG9ydGVkJyk7XG5cbi8qKlxuICogU3VtbWFyeSBvZiBgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyYCBldmVudCBoYW5kbGluZzpcbiAqXG4gKiAgLSBUb3AtbGV2ZWwgZGVsZWdhdGlvbiBpcyB1c2VkIHRvIHRyYXAgbW9zdCBuYXRpdmUgYnJvd3NlciBldmVudHMuIFRoaXNcbiAqICAgIG1heSBvbmx5IG9jY3VyIGluIHRoZSBtYWluIHRocmVhZCBhbmQgaXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mXG4gKiAgICBSZWFjdEV2ZW50TGlzdGVuZXIsIHdoaWNoIGlzIGluamVjdGVkIGFuZCBjYW4gdGhlcmVmb3JlIHN1cHBvcnQgcGx1Z2dhYmxlXG4gKiAgICBldmVudCBzb3VyY2VzLiBUaGlzIGlzIHRoZSBvbmx5IHdvcmsgdGhhdCBvY2N1cnMgaW4gdGhlIG1haW4gdGhyZWFkLlxuICpcbiAqICAtIFdlIG5vcm1hbGl6ZSBhbmQgZGUtZHVwbGljYXRlIGV2ZW50cyB0byBhY2NvdW50IGZvciBicm93c2VyIHF1aXJrcy4gVGhpc1xuICogICAgbWF5IGJlIGRvbmUgaW4gdGhlIHdvcmtlciB0aHJlYWQuXG4gKlxuICogIC0gRm9yd2FyZCB0aGVzZSBuYXRpdmUgZXZlbnRzICh3aXRoIHRoZSBhc3NvY2lhdGVkIHRvcC1sZXZlbCB0eXBlIHVzZWQgdG9cbiAqICAgIHRyYXAgaXQpIHRvIGBFdmVudFBsdWdpbkh1YmAsIHdoaWNoIGluIHR1cm4gd2lsbCBhc2sgcGx1Z2lucyBpZiB0aGV5IHdhbnRcbiAqICAgIHRvIGV4dHJhY3QgYW55IHN5bnRoZXRpYyBldmVudHMuXG4gKlxuICogIC0gVGhlIGBFdmVudFBsdWdpbkh1YmAgd2lsbCB0aGVuIHByb2Nlc3MgZWFjaCBldmVudCBieSBhbm5vdGF0aW5nIHRoZW0gd2l0aFxuICogICAgXCJkaXNwYXRjaGVzXCIsIGEgc2VxdWVuY2Ugb2YgbGlzdGVuZXJzIGFuZCBJRHMgdGhhdCBjYXJlIGFib3V0IHRoYXQgZXZlbnQuXG4gKlxuICogIC0gVGhlIGBFdmVudFBsdWdpbkh1YmAgdGhlbiBkaXNwYXRjaGVzIHRoZSBldmVudHMuXG4gKlxuICogT3ZlcnZpZXcgb2YgUmVhY3QgYW5kIHRoZSBldmVudCBzeXN0ZW06XG4gKlxuICogKy0tLS0tLS0tLS0tLSsgICAgLlxuICogfCAgICBET00gICAgIHwgICAgLlxuICogKy0tLS0tLS0tLS0tLSsgICAgLlxuICogICAgICAgfCAgICAgICAgICAgLlxuICogICAgICAgdiAgICAgICAgICAgLlxuICogKy0tLS0tLS0tLS0tLSsgICAgLlxuICogfCBSZWFjdEV2ZW50IHwgICAgLlxuICogfCAgTGlzdGVuZXIgIHwgICAgLlxuICogKy0tLS0tLS0tLS0tLSsgICAgLiAgICAgICAgICAgICAgICAgICAgICAgICArLS0tLS0tLS0tLS0rXG4gKiAgICAgICB8ICAgICAgICAgICAuICAgICAgICAgICAgICAgKy0tLS0tLS0tK3xTaW1wbGVFdmVudHxcbiAqICAgICAgIHwgICAgICAgICAgIC4gICAgICAgICAgICAgICB8ICAgICAgICAgfFBsdWdpbiAgICAgfFxuICogKy0tLS0tfC0tLS0tLSsgICAgLiAgICAgICAgICAgICAgIHYgICAgICAgICArLS0tLS0tLS0tLS0rXG4gKiB8ICAgICB8ICAgICAgfCAgICAuICAgICstLS0tLS0tLS0tLS0tLSsgICAgICAgICAgICAgICAgICAgICstLS0tLS0tLS0tLS0rXG4gKiB8ICAgICArLS0tLS0tLS0tLS0uLS0tPnxFdmVudFBsdWdpbkh1YnwgICAgICAgICAgICAgICAgICAgIHwgICAgRXZlbnQgICB8XG4gKiB8ICAgICAgICAgICAgfCAgICAuICAgIHwgICAgICAgICAgICAgIHwgICAgICstLS0tLS0tLS0tLSsgIHwgUHJvcGFnYXRvcnN8XG4gKiB8IFJlYWN0RXZlbnQgfCAgICAuICAgIHwgICAgICAgICAgICAgIHwgICAgIHxUYXBFdmVudCAgIHwgIHwtLS0tLS0tLS0tLS18XG4gKiB8ICBFbWl0dGVyICAgfCAgICAuICAgIHwgICAgICAgICAgICAgIHw8LS0tK3xQbHVnaW4gICAgIHwgIHxvdGhlciBwbHVnaW58XG4gKiB8ICAgICAgICAgICAgfCAgICAuICAgIHwgICAgICAgICAgICAgIHwgICAgICstLS0tLS0tLS0tLSsgIHwgIHV0aWxpdGllcyB8XG4gKiB8ICAgICArLS0tLS0tLS0tLS0uLS0tPnwgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICstLS0tLS0tLS0tLS0rXG4gKiB8ICAgICB8ICAgICAgfCAgICAuICAgICstLS0tLS0tLS0tLS0tLStcbiAqICstLS0tLXwtLS0tLS0rICAgIC4gICAgICAgICAgICAgICAgXiAgICAgICAgKy0tLS0tLS0tLS0tK1xuICogICAgICAgfCAgICAgICAgICAgLiAgICAgICAgICAgICAgICB8ICAgICAgICB8RW50ZXIvTGVhdmV8XG4gKiAgICAgICArICAgICAgICAgICAuICAgICAgICAgICAgICAgICstLS0tLS0tK3xQbHVnaW4gICAgIHxcbiAqICstLS0tLS0tLS0tLS0tKyAgIC4gICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0tLS0tK1xuICogfCBhcHBsaWNhdGlvbiB8ICAgLlxuICogfC0tLS0tLS0tLS0tLS18ICAgLlxuICogfCAgICAgICAgICAgICB8ICAgLlxuICogfCAgICAgICAgICAgICB8ICAgLlxuICogKy0tLS0tLS0tLS0tLS0rICAgLlxuICogICAgICAgICAgICAgICAgICAgLlxuICogICAgUmVhY3QgQ29yZSAgICAgLiAgR2VuZXJhbCBQdXJwb3NlIEV2ZW50IFBsdWdpbiBTeXN0ZW1cbiAqL1xuXG52YXIgYWxyZWFkeUxpc3RlbmluZ1RvID0ge307XG52YXIgaXNNb25pdG9yaW5nU2Nyb2xsVmFsdWUgPSBmYWxzZTtcbnZhciByZWFjdFRvcExpc3RlbmVyc0NvdW50ZXIgPSAwO1xuXG4vLyBGb3IgZXZlbnRzIGxpa2UgJ3N1Ym1pdCcgd2hpY2ggZG9uJ3QgY29uc2lzdGVudGx5IGJ1YmJsZSAod2hpY2ggd2UgdHJhcCBhdCBhXG4vLyBsb3dlciBub2RlIHRoYW4gYGRvY3VtZW50YCksIGJpbmRpbmcgYXQgYGRvY3VtZW50YCB3b3VsZCBjYXVzZSBkdXBsaWNhdGVcbi8vIGV2ZW50cyBzbyB3ZSBkb24ndCBpbmNsdWRlIHRoZW0gaGVyZVxudmFyIHRvcEV2ZW50TWFwcGluZyA9IHtcbiAgdG9wQWJvcnQ6ICdhYm9ydCcsXG4gIHRvcEJsdXI6ICdibHVyJyxcbiAgdG9wQ2FuUGxheTogJ2NhbnBsYXknLFxuICB0b3BDYW5QbGF5VGhyb3VnaDogJ2NhbnBsYXl0aHJvdWdoJyxcbiAgdG9wQ2hhbmdlOiAnY2hhbmdlJyxcbiAgdG9wQ2xpY2s6ICdjbGljaycsXG4gIHRvcENvbXBvc2l0aW9uRW5kOiAnY29tcG9zaXRpb25lbmQnLFxuICB0b3BDb21wb3NpdGlvblN0YXJ0OiAnY29tcG9zaXRpb25zdGFydCcsXG4gIHRvcENvbXBvc2l0aW9uVXBkYXRlOiAnY29tcG9zaXRpb251cGRhdGUnLFxuICB0b3BDb250ZXh0TWVudTogJ2NvbnRleHRtZW51JyxcbiAgdG9wQ29weTogJ2NvcHknLFxuICB0b3BDdXQ6ICdjdXQnLFxuICB0b3BEb3VibGVDbGljazogJ2RibGNsaWNrJyxcbiAgdG9wRHJhZzogJ2RyYWcnLFxuICB0b3BEcmFnRW5kOiAnZHJhZ2VuZCcsXG4gIHRvcERyYWdFbnRlcjogJ2RyYWdlbnRlcicsXG4gIHRvcERyYWdFeGl0OiAnZHJhZ2V4aXQnLFxuICB0b3BEcmFnTGVhdmU6ICdkcmFnbGVhdmUnLFxuICB0b3BEcmFnT3ZlcjogJ2RyYWdvdmVyJyxcbiAgdG9wRHJhZ1N0YXJ0OiAnZHJhZ3N0YXJ0JyxcbiAgdG9wRHJvcDogJ2Ryb3AnLFxuICB0b3BEdXJhdGlvbkNoYW5nZTogJ2R1cmF0aW9uY2hhbmdlJyxcbiAgdG9wRW1wdGllZDogJ2VtcHRpZWQnLFxuICB0b3BFbmNyeXB0ZWQ6ICdlbmNyeXB0ZWQnLFxuICB0b3BFbmRlZDogJ2VuZGVkJyxcbiAgdG9wRXJyb3I6ICdlcnJvcicsXG4gIHRvcEZvY3VzOiAnZm9jdXMnLFxuICB0b3BJbnB1dDogJ2lucHV0JyxcbiAgdG9wS2V5RG93bjogJ2tleWRvd24nLFxuICB0b3BLZXlQcmVzczogJ2tleXByZXNzJyxcbiAgdG9wS2V5VXA6ICdrZXl1cCcsXG4gIHRvcExvYWRlZERhdGE6ICdsb2FkZWRkYXRhJyxcbiAgdG9wTG9hZGVkTWV0YWRhdGE6ICdsb2FkZWRtZXRhZGF0YScsXG4gIHRvcExvYWRTdGFydDogJ2xvYWRzdGFydCcsXG4gIHRvcE1vdXNlRG93bjogJ21vdXNlZG93bicsXG4gIHRvcE1vdXNlTW92ZTogJ21vdXNlbW92ZScsXG4gIHRvcE1vdXNlT3V0OiAnbW91c2VvdXQnLFxuICB0b3BNb3VzZU92ZXI6ICdtb3VzZW92ZXInLFxuICB0b3BNb3VzZVVwOiAnbW91c2V1cCcsXG4gIHRvcFBhc3RlOiAncGFzdGUnLFxuICB0b3BQYXVzZTogJ3BhdXNlJyxcbiAgdG9wUGxheTogJ3BsYXknLFxuICB0b3BQbGF5aW5nOiAncGxheWluZycsXG4gIHRvcFByb2dyZXNzOiAncHJvZ3Jlc3MnLFxuICB0b3BSYXRlQ2hhbmdlOiAncmF0ZWNoYW5nZScsXG4gIHRvcFNjcm9sbDogJ3Njcm9sbCcsXG4gIHRvcFNlZWtlZDogJ3NlZWtlZCcsXG4gIHRvcFNlZWtpbmc6ICdzZWVraW5nJyxcbiAgdG9wU2VsZWN0aW9uQ2hhbmdlOiAnc2VsZWN0aW9uY2hhbmdlJyxcbiAgdG9wU3RhbGxlZDogJ3N0YWxsZWQnLFxuICB0b3BTdXNwZW5kOiAnc3VzcGVuZCcsXG4gIHRvcFRleHRJbnB1dDogJ3RleHRJbnB1dCcsXG4gIHRvcFRpbWVVcGRhdGU6ICd0aW1ldXBkYXRlJyxcbiAgdG9wVG91Y2hDYW5jZWw6ICd0b3VjaGNhbmNlbCcsXG4gIHRvcFRvdWNoRW5kOiAndG91Y2hlbmQnLFxuICB0b3BUb3VjaE1vdmU6ICd0b3VjaG1vdmUnLFxuICB0b3BUb3VjaFN0YXJ0OiAndG91Y2hzdGFydCcsXG4gIHRvcFZvbHVtZUNoYW5nZTogJ3ZvbHVtZWNoYW5nZScsXG4gIHRvcFdhaXRpbmc6ICd3YWl0aW5nJyxcbiAgdG9wV2hlZWw6ICd3aGVlbCdcbn07XG5cbi8qKlxuICogVG8gZW5zdXJlIG5vIGNvbmZsaWN0cyB3aXRoIG90aGVyIHBvdGVudGlhbCBSZWFjdCBpbnN0YW5jZXMgb24gdGhlIHBhZ2VcbiAqL1xudmFyIHRvcExpc3RlbmVyc0lES2V5ID0gJ19yZWFjdExpc3RlbmVyc0lEJyArIFN0cmluZyhNYXRoLnJhbmRvbSgpKS5zbGljZSgyKTtcblxuZnVuY3Rpb24gZ2V0TGlzdGVuaW5nRm9yRG9jdW1lbnQobW91bnRBdCkge1xuICAvLyBJbiBJRTgsIGBtb3VudEF0YCBpcyBhIGhvc3Qgb2JqZWN0IGFuZCBkb2Vzbid0IGhhdmUgYGhhc093blByb3BlcnR5YFxuICAvLyBkaXJlY3RseS5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW91bnRBdCwgdG9wTGlzdGVuZXJzSURLZXkpKSB7XG4gICAgbW91bnRBdFt0b3BMaXN0ZW5lcnNJREtleV0gPSByZWFjdFRvcExpc3RlbmVyc0NvdW50ZXIrKztcbiAgICBhbHJlYWR5TGlzdGVuaW5nVG9bbW91bnRBdFt0b3BMaXN0ZW5lcnNJREtleV1dID0ge307XG4gIH1cbiAgcmV0dXJuIGFscmVhZHlMaXN0ZW5pbmdUb1ttb3VudEF0W3RvcExpc3RlbmVyc0lES2V5XV07XG59XG5cbi8qKlxuICogYFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlcmAgaXMgdXNlZCB0byBhdHRhY2ggdG9wLWxldmVsIGV2ZW50IGxpc3RlbmVycy4gRm9yXG4gKiBleGFtcGxlOlxuICpcbiAqICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLnB1dExpc3RlbmVyKCdteUlEJywgJ29uQ2xpY2snLCBteUZ1bmN0aW9uKTtcbiAqXG4gKiBUaGlzIHdvdWxkIGFsbG9jYXRlIGEgXCJyZWdpc3RyYXRpb25cIiBvZiBgKCdvbkNsaWNrJywgbXlGdW5jdGlvbilgIG9uICdteUlEJy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlciA9IGFzc2lnbih7fSwgUmVhY3RFdmVudEVtaXR0ZXJNaXhpbiwge1xuXG4gIC8qKlxuICAgKiBJbmplY3RhYmxlIGV2ZW50IGJhY2tlbmRcbiAgICovXG4gIFJlYWN0RXZlbnRMaXN0ZW5lcjogbnVsbCxcblxuICBpbmplY3Rpb246IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gUmVhY3RFdmVudExpc3RlbmVyXG4gICAgICovXG4gICAgaW5qZWN0UmVhY3RFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoUmVhY3RFdmVudExpc3RlbmVyKSB7XG4gICAgICBSZWFjdEV2ZW50TGlzdGVuZXIuc2V0SGFuZGxlVG9wTGV2ZWwoUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLmhhbmRsZVRvcExldmVsKTtcbiAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIgPSBSZWFjdEV2ZW50TGlzdGVuZXI7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgb3Igbm90IGFueSBjcmVhdGVkIGNhbGxiYWNrcyBzaG91bGQgYmUgZW5hYmxlZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIFRydWUgaWYgY2FsbGJhY2tzIHNob3VsZCBiZSBlbmFibGVkLlxuICAgKi9cbiAgc2V0RW5hYmxlZDogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICBpZiAoUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lcikge1xuICAgICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lci5zZXRFbmFibGVkKGVuYWJsZWQpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBjYWxsYmFja3MgYXJlIGVuYWJsZWQuXG4gICAqL1xuICBpc0VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISEoUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lciAmJiBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLmlzRW5hYmxlZCgpKTtcbiAgfSxcblxuICAvKipcbiAgICogV2UgbGlzdGVuIGZvciBidWJibGVkIHRvdWNoIGV2ZW50cyBvbiB0aGUgZG9jdW1lbnQgb2JqZWN0LlxuICAgKlxuICAgKiBGaXJlZm94IHY4LjAxIChhbmQgcG9zc2libHkgb3RoZXJzKSBleGhpYml0ZWQgc3RyYW5nZSBiZWhhdmlvciB3aGVuXG4gICAqIG1vdW50aW5nIGBvbm1vdXNlbW92ZWAgZXZlbnRzIGF0IHNvbWUgbm9kZSB0aGF0IHdhcyBub3QgdGhlIGRvY3VtZW50XG4gICAqIGVsZW1lbnQuIFRoZSBzeW1wdG9tcyB3ZXJlIHRoYXQgaWYgeW91ciBtb3VzZSBpcyBub3QgbW92aW5nIG92ZXIgc29tZXRoaW5nXG4gICAqIGNvbnRhaW5lZCB3aXRoaW4gdGhhdCBtb3VudCBwb2ludCAoZm9yIGV4YW1wbGUgb24gdGhlIGJhY2tncm91bmQpIHRoZVxuICAgKiB0b3AtbGV2ZWwgbGlzdGVuZXJzIGZvciBgb25tb3VzZW1vdmVgIHdvbid0IGJlIGNhbGxlZC4gSG93ZXZlciwgaWYgeW91XG4gICAqIHJlZ2lzdGVyIHRoZSBgbW91c2Vtb3ZlYCBvbiB0aGUgZG9jdW1lbnQgb2JqZWN0LCB0aGVuIGl0IHdpbGwgb2YgY291cnNlXG4gICAqIGNhdGNoIGFsbCBgbW91c2Vtb3ZlYHMuIFRoaXMgYWxvbmcgd2l0aCBpT1MgcXVpcmtzLCBqdXN0aWZpZXMgcmVzdHJpY3RpbmdcbiAgICogdG9wLWxldmVsIGxpc3RlbmVycyB0byB0aGUgZG9jdW1lbnQgb2JqZWN0IG9ubHksIGF0IGxlYXN0IGZvciB0aGVzZVxuICAgKiBtb3ZlbWVudCB0eXBlcyBvZiBldmVudHMgYW5kIHBvc3NpYmx5IGFsbCBldmVudHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTAvMDkvY2xpY2tfZXZlbnRfZGVsLmh0bWxcbiAgICpcbiAgICogQWxzbywgYGtleXVwYC9ga2V5cHJlc3NgL2BrZXlkb3duYCBkbyBub3QgYnViYmxlIHRvIHRoZSB3aW5kb3cgb24gSUUsIGJ1dFxuICAgKiB0aGV5IGJ1YmJsZSB0byBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlZ2lzdHJhdGlvbk5hbWUgTmFtZSBvZiBsaXN0ZW5lciAoZS5nLiBgb25DbGlja2ApLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGVudERvY3VtZW50SGFuZGxlIERvY3VtZW50IHdoaWNoIG93bnMgdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgbGlzdGVuVG86IGZ1bmN0aW9uIChyZWdpc3RyYXRpb25OYW1lLCBjb250ZW50RG9jdW1lbnRIYW5kbGUpIHtcbiAgICB2YXIgbW91bnRBdCA9IGNvbnRlbnREb2N1bWVudEhhbmRsZTtcbiAgICB2YXIgaXNMaXN0ZW5pbmcgPSBnZXRMaXN0ZW5pbmdGb3JEb2N1bWVudChtb3VudEF0KTtcbiAgICB2YXIgZGVwZW5kZW5jaWVzID0gRXZlbnRQbHVnaW5SZWdpc3RyeS5yZWdpc3RyYXRpb25OYW1lRGVwZW5kZW5jaWVzW3JlZ2lzdHJhdGlvbk5hbWVdO1xuXG4gICAgdmFyIHRvcExldmVsVHlwZXMgPSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVwZW5kZW5jeSA9IGRlcGVuZGVuY2llc1tpXTtcbiAgICAgIGlmICghKGlzTGlzdGVuaW5nLmhhc093blByb3BlcnR5KGRlcGVuZGVuY3kpICYmIGlzTGlzdGVuaW5nW2RlcGVuZGVuY3ldKSkge1xuICAgICAgICBpZiAoZGVwZW5kZW5jeSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BXaGVlbCkge1xuICAgICAgICAgIGlmIChpc0V2ZW50U3VwcG9ydGVkKCd3aGVlbCcpKSB7XG4gICAgICAgICAgICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBCdWJibGVkRXZlbnQodG9wTGV2ZWxUeXBlcy50b3BXaGVlbCwgJ3doZWVsJywgbW91bnRBdCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc0V2ZW50U3VwcG9ydGVkKCdtb3VzZXdoZWVsJykpIHtcbiAgICAgICAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIudHJhcEJ1YmJsZWRFdmVudCh0b3BMZXZlbFR5cGVzLnRvcFdoZWVsLCAnbW91c2V3aGVlbCcsIG1vdW50QXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IG5lZWRzIHRvIGNhcHR1cmUgYSBkaWZmZXJlbnQgbW91c2Ugc2Nyb2xsIGV2ZW50LlxuICAgICAgICAgICAgLy8gQHNlZSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2RvbS9ldmVudHMvdGVzdHMvc2Nyb2xsLmh0bWxcbiAgICAgICAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIudHJhcEJ1YmJsZWRFdmVudCh0b3BMZXZlbFR5cGVzLnRvcFdoZWVsLCAnRE9NTW91c2VTY3JvbGwnLCBtb3VudEF0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwZW5kZW5jeSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BTY3JvbGwpIHtcblxuICAgICAgICAgIGlmIChpc0V2ZW50U3VwcG9ydGVkKCdzY3JvbGwnLCB0cnVlKSkge1xuICAgICAgICAgICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lci50cmFwQ2FwdHVyZWRFdmVudCh0b3BMZXZlbFR5cGVzLnRvcFNjcm9sbCwgJ3Njcm9sbCcsIG1vdW50QXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBCdWJibGVkRXZlbnQodG9wTGV2ZWxUeXBlcy50b3BTY3JvbGwsICdzY3JvbGwnLCBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLldJTkRPV19IQU5ETEUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkZXBlbmRlbmN5ID09PSB0b3BMZXZlbFR5cGVzLnRvcEZvY3VzIHx8IGRlcGVuZGVuY3kgPT09IHRvcExldmVsVHlwZXMudG9wQmx1cikge1xuXG4gICAgICAgICAgaWYgKGlzRXZlbnRTdXBwb3J0ZWQoJ2ZvY3VzJywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIudHJhcENhcHR1cmVkRXZlbnQodG9wTGV2ZWxUeXBlcy50b3BGb2N1cywgJ2ZvY3VzJywgbW91bnRBdCk7XG4gICAgICAgICAgICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBDYXB0dXJlZEV2ZW50KHRvcExldmVsVHlwZXMudG9wQmx1ciwgJ2JsdXInLCBtb3VudEF0KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzRXZlbnRTdXBwb3J0ZWQoJ2ZvY3VzaW4nKSkge1xuICAgICAgICAgICAgLy8gSUUgaGFzIGBmb2N1c2luYCBhbmQgYGZvY3Vzb3V0YCBldmVudHMgd2hpY2ggYnViYmxlLlxuICAgICAgICAgICAgLy8gQHNlZSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2Jsb2cvYXJjaGl2ZXMvMjAwOC8wNC9kZWxlZ2F0aW5nX3RoZS5odG1sXG4gICAgICAgICAgICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBCdWJibGVkRXZlbnQodG9wTGV2ZWxUeXBlcy50b3BGb2N1cywgJ2ZvY3VzaW4nLCBtb3VudEF0KTtcbiAgICAgICAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIudHJhcEJ1YmJsZWRFdmVudCh0b3BMZXZlbFR5cGVzLnRvcEJsdXIsICdmb2N1c291dCcsIG1vdW50QXQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHRvIG1ha2Ugc3VyZSBibHVyIGFuZCBmb2N1cyBldmVudCBsaXN0ZW5lcnMgYXJlIG9ubHkgYXR0YWNoZWQgb25jZVxuICAgICAgICAgIGlzTGlzdGVuaW5nW3RvcExldmVsVHlwZXMudG9wQmx1cl0gPSB0cnVlO1xuICAgICAgICAgIGlzTGlzdGVuaW5nW3RvcExldmVsVHlwZXMudG9wRm9jdXNdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3BFdmVudE1hcHBpbmcuaGFzT3duUHJvcGVydHkoZGVwZW5kZW5jeSkpIHtcbiAgICAgICAgICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBCdWJibGVkRXZlbnQoZGVwZW5kZW5jeSwgdG9wRXZlbnRNYXBwaW5nW2RlcGVuZGVuY3ldLCBtb3VudEF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzTGlzdGVuaW5nW2RlcGVuZGVuY3ldID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJhcEJ1YmJsZWRFdmVudDogZnVuY3Rpb24gKHRvcExldmVsVHlwZSwgaGFuZGxlckJhc2VOYW1lLCBoYW5kbGUpIHtcbiAgICByZXR1cm4gUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lci50cmFwQnViYmxlZEV2ZW50KHRvcExldmVsVHlwZSwgaGFuZGxlckJhc2VOYW1lLCBoYW5kbGUpO1xuICB9LFxuXG4gIHRyYXBDYXB0dXJlZEV2ZW50OiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCBoYW5kbGVyQmFzZU5hbWUsIGhhbmRsZSkge1xuICAgIHJldHVybiBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuUmVhY3RFdmVudExpc3RlbmVyLnRyYXBDYXB0dXJlZEV2ZW50KHRvcExldmVsVHlwZSwgaGFuZGxlckJhc2VOYW1lLCBoYW5kbGUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIHdpbmRvdyBzY3JvbGwgYW5kIHJlc2l6ZSBldmVudHMuIFdlIGNhY2hlIHNjcm9sbCB2YWx1ZXMgc28gdGhhdFxuICAgKiBhcHBsaWNhdGlvbiBjb2RlIGNhbiBhY2Nlc3MgdGhlbSB3aXRob3V0IHRyaWdnZXJpbmcgcmVmbG93cy5cbiAgICpcbiAgICogTk9URTogU2Nyb2xsIGV2ZW50cyBkbyBub3QgYnViYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvZG9tL2V2ZW50cy9zY3JvbGwuaHRtbFxuICAgKi9cbiAgZW5zdXJlU2Nyb2xsVmFsdWVNb25pdG9yaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpc01vbml0b3JpbmdTY3JvbGxWYWx1ZSkge1xuICAgICAgdmFyIHJlZnJlc2ggPSBWaWV3cG9ydE1ldHJpY3MucmVmcmVzaFNjcm9sbFZhbHVlcztcbiAgICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5SZWFjdEV2ZW50TGlzdGVuZXIubW9uaXRvclNjcm9sbFZhbHVlKHJlZnJlc2gpO1xuICAgICAgaXNNb25pdG9yaW5nU2Nyb2xsVmFsdWUgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBldmVudE5hbWVEaXNwYXRjaENvbmZpZ3M6IEV2ZW50UGx1Z2luSHViLmV2ZW50TmFtZURpc3BhdGNoQ29uZmlncyxcblxuICByZWdpc3RyYXRpb25OYW1lTW9kdWxlczogRXZlbnRQbHVnaW5IdWIucmVnaXN0cmF0aW9uTmFtZU1vZHVsZXMsXG5cbiAgcHV0TGlzdGVuZXI6IEV2ZW50UGx1Z2luSHViLnB1dExpc3RlbmVyLFxuXG4gIGdldExpc3RlbmVyOiBFdmVudFBsdWdpbkh1Yi5nZXRMaXN0ZW5lcixcblxuICBkZWxldGVMaXN0ZW5lcjogRXZlbnRQbHVnaW5IdWIuZGVsZXRlTGlzdGVuZXIsXG5cbiAgZGVsZXRlQWxsTGlzdGVuZXJzOiBFdmVudFBsdWdpbkh1Yi5kZWxldGVBbGxMaXN0ZW5lcnNcblxufSk7XG5cblJlYWN0UGVyZi5tZWFzdXJlTWV0aG9kcyhSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIsICdSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXInLCB7XG4gIHB1dExpc3RlbmVyOiAncHV0TGlzdGVuZXInLFxuICBkZWxldGVMaXN0ZW5lcjogJ2RlbGV0ZUxpc3RlbmVyJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyOyJdfQ==