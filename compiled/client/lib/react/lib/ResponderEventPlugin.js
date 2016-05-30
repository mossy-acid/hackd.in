/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ResponderEventPlugin
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventPluginUtils = require('./EventPluginUtils');
var EventPropagators = require('./EventPropagators');
var ReactInstanceHandles = require('./ReactInstanceHandles');
var ResponderSyntheticEvent = require('./ResponderSyntheticEvent');
var ResponderTouchHistoryStore = require('./ResponderTouchHistoryStore');

var accumulate = require('./accumulate');
var invariant = require('fbjs/lib/invariant');
var keyOf = require('fbjs/lib/keyOf');

var isStartish = EventPluginUtils.isStartish;
var isMoveish = EventPluginUtils.isMoveish;
var isEndish = EventPluginUtils.isEndish;
var executeDirectDispatch = EventPluginUtils.executeDirectDispatch;
var hasDispatches = EventPluginUtils.hasDispatches;
var executeDispatchesInOrderStopAtTrue = EventPluginUtils.executeDispatchesInOrderStopAtTrue;

/**
 * ID of element that should respond to touch/move types of interactions, as
 * indicated explicitly by relevant callbacks.
 */
var responderID = null;

/**
 * Count of current touches. A textInput should become responder iff the
 * the selection changes while there is a touch on the screen.
 */
var trackedTouchCount = 0;

/**
 * Last reported number of active touches.
 */
var previousActiveTouches = 0;

var changeResponder = function changeResponder(nextResponderID, blockNativeResponder) {
  var oldResponderID = responderID;
  responderID = nextResponderID;
  if (ResponderEventPlugin.GlobalResponderHandler !== null) {
    ResponderEventPlugin.GlobalResponderHandler.onChange(oldResponderID, nextResponderID, blockNativeResponder);
  }
};

var eventTypes = {
  /**
   * On a `touchStart`/`mouseDown`, is it desired that this element become the
   * responder?
   */
  startShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onStartShouldSetResponder: null }),
      captured: keyOf({ onStartShouldSetResponderCapture: null })
    }
  },

  /**
   * On a `scroll`, is it desired that this element become the responder? This
   * is usually not needed, but should be used to retroactively infer that a
   * `touchStart` had occured during momentum scroll. During a momentum scroll,
   * a touch start will be immediately followed by a scroll event if the view is
   * currently scrolling.
   *
   * TODO: This shouldn't bubble.
   */
  scrollShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onScrollShouldSetResponder: null }),
      captured: keyOf({ onScrollShouldSetResponderCapture: null })
    }
  },

  /**
   * On text selection change, should this element become the responder? This
   * is needed for text inputs or other views with native selection, so the
   * JS view can claim the responder.
   *
   * TODO: This shouldn't bubble.
   */
  selectionChangeShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onSelectionChangeShouldSetResponder: null }),
      captured: keyOf({ onSelectionChangeShouldSetResponderCapture: null })
    }
  },

  /**
   * On a `touchMove`/`mouseMove`, is it desired that this element become the
   * responder?
   */
  moveShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMoveShouldSetResponder: null }),
      captured: keyOf({ onMoveShouldSetResponderCapture: null })
    }
  },

  /**
   * Direct responder events dispatched directly to responder. Do not bubble.
   */
  responderStart: { registrationName: keyOf({ onResponderStart: null }) },
  responderMove: { registrationName: keyOf({ onResponderMove: null }) },
  responderEnd: { registrationName: keyOf({ onResponderEnd: null }) },
  responderRelease: { registrationName: keyOf({ onResponderRelease: null }) },
  responderTerminationRequest: {
    registrationName: keyOf({ onResponderTerminationRequest: null })
  },
  responderGrant: { registrationName: keyOf({ onResponderGrant: null }) },
  responderReject: { registrationName: keyOf({ onResponderReject: null }) },
  responderTerminate: { registrationName: keyOf({ onResponderTerminate: null }) }
};

/**
 *
 * Responder System:
 * ----------------
 *
 * - A global, solitary "interaction lock" on a view.
 * - If a node becomes the responder, it should convey visual feedback
 *   immediately to indicate so, either by highlighting or moving accordingly.
 * - To be the responder means, that touches are exclusively important to that
 *   responder view, and no other view.
 * - While touches are still occuring, the responder lock can be transfered to
 *   a new view, but only to increasingly "higher" views (meaning ancestors of
 *   the current responder).
 *
 * Responder being granted:
 * ------------------------
 *
 * - Touch starts, moves, and scrolls can cause an ID to become the responder.
 * - We capture/bubble `startShouldSetResponder`/`moveShouldSetResponder` to
 *   the "appropriate place".
 * - If nothing is currently the responder, the "appropriate place" is the
 *   initiating event's `targetID`.
 * - If something *is* already the responder, the "appropriate place" is the
 *   first common ancestor of the event target and the current `responderID`.
 * - Some negotiation happens: See the timing diagram below.
 * - Scrolled views automatically become responder. The reasoning is that a
 *   platform scroll view that isn't built on top of the responder system has
 *   began scrolling, and the active responder must now be notified that the
 *   interaction is no longer locked to it - the system has taken over.
 *
 * - Responder being released:
 *   As soon as no more touches that *started* inside of descendents of the
 *   *current* responderID, an `onResponderRelease` event is dispatched to the
 *   current responder, and the responder lock is released.
 *
 * TODO:
 * - on "end", a callback hook for `onResponderEndShouldRemainResponder` that
 *   determines if the responder lock should remain.
 * - If a view shouldn't "remain" the responder, any active touches should by
 *   default be considered "dead" and do not influence future negotiations or
 *   bubble paths. It should be as if those touches do not exist.
 * -- For multitouch: Usually a translate-z will choose to "remain" responder
 *  after one out of many touches ended. For translate-y, usually the view
 *  doesn't wish to "remain" responder after one of many touches end.
 * - Consider building this on top of a `stopPropagation` model similar to
 *   `W3C` events.
 * - Ensure that `onResponderTerminate` is called on touch cancels, whether or
 *   not `onResponderTerminationRequest` returns `true` or `false`.
 *
 */

/*                                             Negotiation Performed
                                             +-----------------------+
                                            /                         \
Process low level events to    +     Current Responder      +   wantsResponderID
determine who to perform negot-|   (if any exists at all)   |
iation/transition              | Otherwise just pass through|
-------------------------------+----------------------------+------------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchStart|           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onStartShouldSetResponder|----->|onResponderStart (cur)  |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderStart|
                               |                            | +----------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchMove |           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onMoveShouldSetResponder |----->|onResponderMove (cur)   |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderRejec|
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderMove |
                               |                            | +----------------+
                               |                            |
                               |                            |
      Some active touch started|                            |
      inside current responder | +------------------------+ |
      +------------------------->|      onResponderEnd    | |
      |                        | +------------------------+ |
  +---+---------+              |                            |
  | onTouchEnd  |              |                            |
  +---+---------+              |                            |
      |                        | +------------------------+ |
      +------------------------->|     onResponderEnd     | |
      No active touches started| +-----------+------------+ |
      inside current responder |             |              |
                               |             v              |
                               | +------------------------+ |
                               | |    onResponderRelease  | |
                               | +------------------------+ |
                               |                            |
                               +                            + */

/**
 * A note about event ordering in the `EventPluginHub`.
 *
 * Suppose plugins are injected in the following order:
 *
 * `[R, S, C]`
 *
 * To help illustrate the example, assume `S` is `SimpleEventPlugin` (for
 * `onClick` etc) and `R` is `ResponderEventPlugin`.
 *
 * "Deferred-Dispatched Events":
 *
 * - The current event plugin system will traverse the list of injected plugins,
 *   in order, and extract events by collecting the plugin's return value of
 *   `extractEvents()`.
 * - These events that are returned from `extractEvents` are "deferred
 *   dispatched events".
 * - When returned from `extractEvents`, deferred-dispatched events contain an
 *   "accumulation" of deferred dispatches.
 * - These deferred dispatches are accumulated/collected before they are
 *   returned, but processed at a later time by the `EventPluginHub` (hence the
 *   name deferred).
 *
 * In the process of returning their deferred-dispatched events, event plugins
 * themselves can dispatch events on-demand without returning them from
 * `extractEvents`. Plugins might want to do this, so that they can use event
 * dispatching as a tool that helps them decide which events should be extracted
 * in the first place.
 *
 * "On-Demand-Dispatched Events":
 *
 * - On-demand-dispatched events are not returned from `extractEvents`.
 * - On-demand-dispatched events are dispatched during the process of returning
 *   the deferred-dispatched events.
 * - They should not have side effects.
 * - They should be avoided, and/or eventually be replaced with another
 *   abstraction that allows event plugins to perform multiple "rounds" of event
 *   extraction.
 *
 * Therefore, the sequence of event dispatches becomes:
 *
 * - `R`s on-demand events (if any)   (dispatched by `R` on-demand)
 * - `S`s on-demand events (if any)   (dispatched by `S` on-demand)
 * - `C`s on-demand events (if any)   (dispatched by `C` on-demand)
 * - `R`s extracted events (if any)   (dispatched by `EventPluginHub`)
 * - `S`s extracted events (if any)   (dispatched by `EventPluginHub`)
 * - `C`s extracted events (if any)   (dispatched by `EventPluginHub`)
 *
 * In the case of `ResponderEventPlugin`: If the `startShouldSetResponder`
 * on-demand dispatch returns `true` (and some other details are satisfied) the
 * `onResponderGrant` deferred dispatched event is returned from
 * `extractEvents`. The sequence of dispatch executions in this case
 * will appear as follows:
 *
 * - `startShouldSetResponder` (`ResponderEventPlugin` dispatches on-demand)
 * - `touchStartCapture`       (`EventPluginHub` dispatches as usual)
 * - `touchStart`              (`EventPluginHub` dispatches as usual)
 * - `responderGrant/Reject`   (`EventPluginHub` dispatches as usual)
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {string} topLevelTargetID ID of deepest React rendered element.
 * @param {object} nativeEvent Native browser event.
 * @return {*} An accumulation of synthetic events.
 */
function setResponderAndExtractTransfer(topLevelType, topLevelTargetID, nativeEvent, nativeEventTarget) {
  var shouldSetEventType = isStartish(topLevelType) ? eventTypes.startShouldSetResponder : isMoveish(topLevelType) ? eventTypes.moveShouldSetResponder : topLevelType === EventConstants.topLevelTypes.topSelectionChange ? eventTypes.selectionChangeShouldSetResponder : eventTypes.scrollShouldSetResponder;

  // TODO: stop one short of the the current responder.
  var bubbleShouldSetFrom = !responderID ? topLevelTargetID : ReactInstanceHandles.getFirstCommonAncestorID(responderID, topLevelTargetID);

  // When capturing/bubbling the "shouldSet" event, we want to skip the target
  // (deepest ID) if it happens to be the current responder. The reasoning:
  // It's strange to get an `onMoveShouldSetResponder` when you're *already*
  // the responder.
  var skipOverBubbleShouldSetFrom = bubbleShouldSetFrom === responderID;
  var shouldSetEvent = ResponderSyntheticEvent.getPooled(shouldSetEventType, bubbleShouldSetFrom, nativeEvent, nativeEventTarget);
  shouldSetEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
  if (skipOverBubbleShouldSetFrom) {
    EventPropagators.accumulateTwoPhaseDispatchesSkipTarget(shouldSetEvent);
  } else {
    EventPropagators.accumulateTwoPhaseDispatches(shouldSetEvent);
  }
  var wantsResponderID = executeDispatchesInOrderStopAtTrue(shouldSetEvent);
  if (!shouldSetEvent.isPersistent()) {
    shouldSetEvent.constructor.release(shouldSetEvent);
  }

  if (!wantsResponderID || wantsResponderID === responderID) {
    return null;
  }
  var extracted;
  var grantEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderGrant, wantsResponderID, nativeEvent, nativeEventTarget);
  grantEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;

  EventPropagators.accumulateDirectDispatches(grantEvent);
  var blockNativeResponder = executeDirectDispatch(grantEvent) === true;
  if (responderID) {

    var terminationRequestEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderTerminationRequest, responderID, nativeEvent, nativeEventTarget);
    terminationRequestEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
    EventPropagators.accumulateDirectDispatches(terminationRequestEvent);
    var shouldSwitch = !hasDispatches(terminationRequestEvent) || executeDirectDispatch(terminationRequestEvent);
    if (!terminationRequestEvent.isPersistent()) {
      terminationRequestEvent.constructor.release(terminationRequestEvent);
    }

    if (shouldSwitch) {
      var terminateType = eventTypes.responderTerminate;
      var terminateEvent = ResponderSyntheticEvent.getPooled(terminateType, responderID, nativeEvent, nativeEventTarget);
      terminateEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(terminateEvent);
      extracted = accumulate(extracted, [grantEvent, terminateEvent]);
      changeResponder(wantsResponderID, blockNativeResponder);
    } else {
      var rejectEvent = ResponderSyntheticEvent.getPooled(eventTypes.responderReject, wantsResponderID, nativeEvent, nativeEventTarget);
      rejectEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(rejectEvent);
      extracted = accumulate(extracted, rejectEvent);
    }
  } else {
    extracted = accumulate(extracted, grantEvent);
    changeResponder(wantsResponderID, blockNativeResponder);
  }
  return extracted;
}

/**
 * A transfer is a negotiation between a currently set responder and the next
 * element to claim responder status. Any start event could trigger a transfer
 * of responderID. Any move event could trigger a transfer.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @return {boolean} True if a transfer of responder could possibly occur.
 */
function canTriggerTransfer(topLevelType, topLevelTargetID, nativeEvent) {
  return topLevelTargetID && (
  // responderIgnoreScroll: We are trying to migrate away from specifically tracking native scroll
  // events here and responderIgnoreScroll indicates we will send topTouchCancel to handle
  // canceling touch events instead
  topLevelType === EventConstants.topLevelTypes.topScroll && !nativeEvent.responderIgnoreScroll || trackedTouchCount > 0 && topLevelType === EventConstants.topLevelTypes.topSelectionChange || isStartish(topLevelType) || isMoveish(topLevelType));
}

/**
 * Returns whether or not this touch end event makes it such that there are no
 * longer any touches that started inside of the current `responderID`.
 *
 * @param {NativeEvent} nativeEvent Native touch end event.
 * @return {boolean} Whether or not this touch end event ends the responder.
 */
function noResponderTouches(nativeEvent) {
  var touches = nativeEvent.touches;
  if (!touches || touches.length === 0) {
    return true;
  }
  for (var i = 0; i < touches.length; i++) {
    var activeTouch = touches[i];
    var target = activeTouch.target;
    if (target !== null && target !== undefined && target !== 0) {
      // Is the original touch location inside of the current responder?
      var isAncestor = ReactInstanceHandles.isAncestorIDOf(responderID, EventPluginUtils.getID(target));
      if (isAncestor) {
        return false;
      }
    }
  }
  return true;
}

var ResponderEventPlugin = {

  getResponderID: function getResponderID() {
    return responderID;
  },

  eventTypes: eventTypes,

  /**
   * We must be resilient to `topLevelTargetID` being `undefined` on
   * `touchMove`, or `touchEnd`. On certain platforms, this means that a native
   * scroll has assumed control and the original touch targets are destroyed.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
    if (isStartish(topLevelType)) {
      trackedTouchCount += 1;
    } else if (isEndish(topLevelType)) {
      trackedTouchCount -= 1;
      !(trackedTouchCount >= 0) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Ended a touch event which was not counted in trackedTouchCount.') : invariant(false) : undefined;
    }

    ResponderTouchHistoryStore.recordTouchTrack(topLevelType, nativeEvent, nativeEventTarget);

    var extracted = canTriggerTransfer(topLevelType, topLevelTargetID, nativeEvent) ? setResponderAndExtractTransfer(topLevelType, topLevelTargetID, nativeEvent, nativeEventTarget) : null;
    // Responder may or may not have transfered on a new touch start/move.
    // Regardless, whoever is the responder after any potential transfer, we
    // direct all touch start/move/ends to them in the form of
    // `onResponderMove/Start/End`. These will be called for *every* additional
    // finger that move/start/end, dispatched directly to whoever is the
    // current responder at that moment, until the responder is "released".
    //
    // These multiple individual change touch events are are always bookended
    // by `onResponderGrant`, and one of
    // (`onResponderRelease/onResponderTerminate`).
    var isResponderTouchStart = responderID && isStartish(topLevelType);
    var isResponderTouchMove = responderID && isMoveish(topLevelType);
    var isResponderTouchEnd = responderID && isEndish(topLevelType);
    var incrementalTouch = isResponderTouchStart ? eventTypes.responderStart : isResponderTouchMove ? eventTypes.responderMove : isResponderTouchEnd ? eventTypes.responderEnd : null;

    if (incrementalTouch) {
      var gesture = ResponderSyntheticEvent.getPooled(incrementalTouch, responderID, nativeEvent, nativeEventTarget);
      gesture.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(gesture);
      extracted = accumulate(extracted, gesture);
    }

    var isResponderTerminate = responderID && topLevelType === EventConstants.topLevelTypes.topTouchCancel;
    var isResponderRelease = responderID && !isResponderTerminate && isEndish(topLevelType) && noResponderTouches(nativeEvent);
    var finalTouch = isResponderTerminate ? eventTypes.responderTerminate : isResponderRelease ? eventTypes.responderRelease : null;
    if (finalTouch) {
      var finalEvent = ResponderSyntheticEvent.getPooled(finalTouch, responderID, nativeEvent, nativeEventTarget);
      finalEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      EventPropagators.accumulateDirectDispatches(finalEvent);
      extracted = accumulate(extracted, finalEvent);
      changeResponder(null);
    }

    var numberActiveTouches = ResponderTouchHistoryStore.touchHistory.numberActiveTouches;
    if (ResponderEventPlugin.GlobalInteractionHandler && numberActiveTouches !== previousActiveTouches) {
      ResponderEventPlugin.GlobalInteractionHandler.onChange(numberActiveTouches);
    }
    previousActiveTouches = numberActiveTouches;

    return extracted;
  },

  GlobalResponderHandler: null,
  GlobalInteractionHandler: null,

  injection: {
    /**
     * @param {{onChange: (ReactID, ReactID) => void} GlobalResponderHandler
     * Object that handles any change in responder. Use this to inject
     * integration with an existing touch handling system etc.
     */
    injectGlobalResponderHandler: function injectGlobalResponderHandler(GlobalResponderHandler) {
      ResponderEventPlugin.GlobalResponderHandler = GlobalResponderHandler;
    },

    /**
     * @param {{onChange: (numberActiveTouches) => void} GlobalInteractionHandler
     * Object that handles any change in the number of active touches.
     */
    injectGlobalInteractionHandler: function injectGlobalInteractionHandler(GlobalInteractionHandler) {
      ResponderEventPlugin.GlobalInteractionHandler = GlobalInteractionHandler;
    }
  }
};

module.exports = ResponderEventPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1Jlc3BvbmRlckV2ZW50UGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFqQjtBQUNKLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBbkI7QUFDSixJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQW5CO0FBQ0osSUFBSSx1QkFBdUIsUUFBUSx3QkFBUixDQUF2QjtBQUNKLElBQUksMEJBQTBCLFFBQVEsMkJBQVIsQ0FBMUI7QUFDSixJQUFJLDZCQUE2QixRQUFRLDhCQUFSLENBQTdCOztBQUVKLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBYjtBQUNKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7QUFDSixJQUFJLFFBQVEsUUFBUSxnQkFBUixDQUFSOztBQUVKLElBQUksYUFBYSxpQkFBaUIsVUFBakI7QUFDakIsSUFBSSxZQUFZLGlCQUFpQixTQUFqQjtBQUNoQixJQUFJLFdBQVcsaUJBQWlCLFFBQWpCO0FBQ2YsSUFBSSx3QkFBd0IsaUJBQWlCLHFCQUFqQjtBQUM1QixJQUFJLGdCQUFnQixpQkFBaUIsYUFBakI7QUFDcEIsSUFBSSxxQ0FBcUMsaUJBQWlCLGtDQUFqQjs7Ozs7O0FBTXpDLElBQUksY0FBYyxJQUFkOzs7Ozs7QUFNSixJQUFJLG9CQUFvQixDQUFwQjs7Ozs7QUFLSixJQUFJLHdCQUF3QixDQUF4Qjs7QUFFSixJQUFJLGtCQUFrQixTQUFsQixlQUFrQixDQUFVLGVBQVYsRUFBMkIsb0JBQTNCLEVBQWlEO0FBQ3JFLE1BQUksaUJBQWlCLFdBQWpCLENBRGlFO0FBRXJFLGdCQUFjLGVBQWQsQ0FGcUU7QUFHckUsTUFBSSxxQkFBcUIsc0JBQXJCLEtBQWdELElBQWhELEVBQXNEO0FBQ3hELHlCQUFxQixzQkFBckIsQ0FBNEMsUUFBNUMsQ0FBcUQsY0FBckQsRUFBcUUsZUFBckUsRUFBc0Ysb0JBQXRGLEVBRHdEO0dBQTFEO0NBSG9COztBQVF0QixJQUFJLGFBQWE7Ozs7O0FBS2YsMkJBQXlCO0FBQ3ZCLDZCQUF5QjtBQUN2QixlQUFTLE1BQU0sRUFBRSwyQkFBMkIsSUFBM0IsRUFBUixDQUFUO0FBQ0EsZ0JBQVUsTUFBTSxFQUFFLGtDQUFrQyxJQUFsQyxFQUFSLENBQVY7S0FGRjtHQURGOzs7Ozs7Ozs7OztBQWdCQSw0QkFBMEI7QUFDeEIsNkJBQXlCO0FBQ3ZCLGVBQVMsTUFBTSxFQUFFLDRCQUE0QixJQUE1QixFQUFSLENBQVQ7QUFDQSxnQkFBVSxNQUFNLEVBQUUsbUNBQW1DLElBQW5DLEVBQVIsQ0FBVjtLQUZGO0dBREY7Ozs7Ozs7OztBQWNBLHFDQUFtQztBQUNqQyw2QkFBeUI7QUFDdkIsZUFBUyxNQUFNLEVBQUUscUNBQXFDLElBQXJDLEVBQVIsQ0FBVDtBQUNBLGdCQUFVLE1BQU0sRUFBRSw0Q0FBNEMsSUFBNUMsRUFBUixDQUFWO0tBRkY7R0FERjs7Ozs7O0FBV0EsMEJBQXdCO0FBQ3RCLDZCQUF5QjtBQUN2QixlQUFTLE1BQU0sRUFBRSwwQkFBMEIsSUFBMUIsRUFBUixDQUFUO0FBQ0EsZ0JBQVUsTUFBTSxFQUFFLGlDQUFpQyxJQUFqQyxFQUFSLENBQVY7S0FGRjtHQURGOzs7OztBQVVBLGtCQUFnQixFQUFFLGtCQUFrQixNQUFNLEVBQUUsa0JBQWtCLElBQWxCLEVBQVIsQ0FBbEIsRUFBbEI7QUFDQSxpQkFBZSxFQUFFLGtCQUFrQixNQUFNLEVBQUUsaUJBQWlCLElBQWpCLEVBQVIsQ0FBbEIsRUFBakI7QUFDQSxnQkFBYyxFQUFFLGtCQUFrQixNQUFNLEVBQUUsZ0JBQWdCLElBQWhCLEVBQVIsQ0FBbEIsRUFBaEI7QUFDQSxvQkFBa0IsRUFBRSxrQkFBa0IsTUFBTSxFQUFFLG9CQUFvQixJQUFwQixFQUFSLENBQWxCLEVBQXBCO0FBQ0EsK0JBQTZCO0FBQzNCLHNCQUFrQixNQUFNLEVBQUUsK0JBQStCLElBQS9CLEVBQVIsQ0FBbEI7R0FERjtBQUdBLGtCQUFnQixFQUFFLGtCQUFrQixNQUFNLEVBQUUsa0JBQWtCLElBQWxCLEVBQVIsQ0FBbEIsRUFBbEI7QUFDQSxtQkFBaUIsRUFBRSxrQkFBa0IsTUFBTSxFQUFFLG1CQUFtQixJQUFuQixFQUFSLENBQWxCLEVBQW5CO0FBQ0Esc0JBQW9CLEVBQUUsa0JBQWtCLE1BQU0sRUFBRSxzQkFBc0IsSUFBdEIsRUFBUixDQUFsQixFQUF0QjtDQWpFRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNRSixTQUFTLDhCQUFULENBQXdDLFlBQXhDLEVBQXNELGdCQUF0RCxFQUF3RSxXQUF4RSxFQUFxRixpQkFBckYsRUFBd0c7QUFDdEcsTUFBSSxxQkFBcUIsV0FBVyxZQUFYLElBQTJCLFdBQVcsdUJBQVgsR0FBcUMsVUFBVSxZQUFWLElBQTBCLFdBQVcsc0JBQVgsR0FBb0MsaUJBQWlCLGVBQWUsYUFBZixDQUE2QixrQkFBN0IsR0FBa0QsV0FBVyxpQ0FBWCxHQUErQyxXQUFXLHdCQUFYOzs7QUFEbkssTUFJbEcsc0JBQXNCLENBQUMsV0FBRCxHQUFlLGdCQUFmLEdBQWtDLHFCQUFxQix3QkFBckIsQ0FBOEMsV0FBOUMsRUFBMkQsZ0JBQTNELENBQWxDOzs7Ozs7QUFKNEUsTUFVbEcsOEJBQThCLHdCQUF3QixXQUF4QixDQVZvRTtBQVd0RyxNQUFJLGlCQUFpQix3QkFBd0IsU0FBeEIsQ0FBa0Msa0JBQWxDLEVBQXNELG1CQUF0RCxFQUEyRSxXQUEzRSxFQUF3RixpQkFBeEYsQ0FBakIsQ0FYa0c7QUFZdEcsaUJBQWUsWUFBZixHQUE4QiwyQkFBMkIsWUFBM0IsQ0Fad0U7QUFhdEcsTUFBSSwyQkFBSixFQUFpQztBQUMvQixxQkFBaUIsc0NBQWpCLENBQXdELGNBQXhELEVBRCtCO0dBQWpDLE1BRU87QUFDTCxxQkFBaUIsNEJBQWpCLENBQThDLGNBQTlDLEVBREs7R0FGUDtBQUtBLE1BQUksbUJBQW1CLG1DQUFtQyxjQUFuQyxDQUFuQixDQWxCa0c7QUFtQnRHLE1BQUksQ0FBQyxlQUFlLFlBQWYsRUFBRCxFQUFnQztBQUNsQyxtQkFBZSxXQUFmLENBQTJCLE9BQTNCLENBQW1DLGNBQW5DLEVBRGtDO0dBQXBDOztBQUlBLE1BQUksQ0FBQyxnQkFBRCxJQUFxQixxQkFBcUIsV0FBckIsRUFBa0M7QUFDekQsV0FBTyxJQUFQLENBRHlEO0dBQTNEO0FBR0EsTUFBSSxTQUFKLENBMUJzRztBQTJCdEcsTUFBSSxhQUFhLHdCQUF3QixTQUF4QixDQUFrQyxXQUFXLGNBQVgsRUFBMkIsZ0JBQTdELEVBQStFLFdBQS9FLEVBQTRGLGlCQUE1RixDQUFiLENBM0JrRztBQTRCdEcsYUFBVyxZQUFYLEdBQTBCLDJCQUEyQixZQUEzQixDQTVCNEU7O0FBOEJ0RyxtQkFBaUIsMEJBQWpCLENBQTRDLFVBQTVDLEVBOUJzRztBQStCdEcsTUFBSSx1QkFBdUIsc0JBQXNCLFVBQXRCLE1BQXNDLElBQXRDLENBL0IyRTtBQWdDdEcsTUFBSSxXQUFKLEVBQWlCOztBQUVmLFFBQUksMEJBQTBCLHdCQUF3QixTQUF4QixDQUFrQyxXQUFXLDJCQUFYLEVBQXdDLFdBQTFFLEVBQXVGLFdBQXZGLEVBQW9HLGlCQUFwRyxDQUExQixDQUZXO0FBR2YsNEJBQXdCLFlBQXhCLEdBQXVDLDJCQUEyQixZQUEzQixDQUh4QjtBQUlmLHFCQUFpQiwwQkFBakIsQ0FBNEMsdUJBQTVDLEVBSmU7QUFLZixRQUFJLGVBQWUsQ0FBQyxjQUFjLHVCQUFkLENBQUQsSUFBMkMsc0JBQXNCLHVCQUF0QixDQUEzQyxDQUxKO0FBTWYsUUFBSSxDQUFDLHdCQUF3QixZQUF4QixFQUFELEVBQXlDO0FBQzNDLDhCQUF3QixXQUF4QixDQUFvQyxPQUFwQyxDQUE0Qyx1QkFBNUMsRUFEMkM7S0FBN0M7O0FBSUEsUUFBSSxZQUFKLEVBQWtCO0FBQ2hCLFVBQUksZ0JBQWdCLFdBQVcsa0JBQVgsQ0FESjtBQUVoQixVQUFJLGlCQUFpQix3QkFBd0IsU0FBeEIsQ0FBa0MsYUFBbEMsRUFBaUQsV0FBakQsRUFBOEQsV0FBOUQsRUFBMkUsaUJBQTNFLENBQWpCLENBRlk7QUFHaEIscUJBQWUsWUFBZixHQUE4QiwyQkFBMkIsWUFBM0IsQ0FIZDtBQUloQix1QkFBaUIsMEJBQWpCLENBQTRDLGNBQTVDLEVBSmdCO0FBS2hCLGtCQUFZLFdBQVcsU0FBWCxFQUFzQixDQUFDLFVBQUQsRUFBYSxjQUFiLENBQXRCLENBQVosQ0FMZ0I7QUFNaEIsc0JBQWdCLGdCQUFoQixFQUFrQyxvQkFBbEMsRUFOZ0I7S0FBbEIsTUFPTztBQUNMLFVBQUksY0FBYyx3QkFBd0IsU0FBeEIsQ0FBa0MsV0FBVyxlQUFYLEVBQTRCLGdCQUE5RCxFQUFnRixXQUFoRixFQUE2RixpQkFBN0YsQ0FBZCxDQURDO0FBRUwsa0JBQVksWUFBWixHQUEyQiwyQkFBMkIsWUFBM0IsQ0FGdEI7QUFHTCx1QkFBaUIsMEJBQWpCLENBQTRDLFdBQTVDLEVBSEs7QUFJTCxrQkFBWSxXQUFXLFNBQVgsRUFBc0IsV0FBdEIsQ0FBWixDQUpLO0tBUFA7R0FWRixNQXVCTztBQUNMLGdCQUFZLFdBQVcsU0FBWCxFQUFzQixVQUF0QixDQUFaLENBREs7QUFFTCxvQkFBZ0IsZ0JBQWhCLEVBQWtDLG9CQUFsQyxFQUZLO0dBdkJQO0FBMkJBLFNBQU8sU0FBUCxDQTNEc0c7Q0FBeEc7Ozs7Ozs7Ozs7QUFzRUEsU0FBUyxrQkFBVCxDQUE0QixZQUE1QixFQUEwQyxnQkFBMUMsRUFBNEQsV0FBNUQsRUFBeUU7QUFDdkUsU0FBTzs7OztBQUlQLG1CQUFpQixlQUFlLGFBQWYsQ0FBNkIsU0FBN0IsSUFBMEMsQ0FBQyxZQUFZLHFCQUFaLElBQXFDLG9CQUFvQixDQUFwQixJQUF5QixpQkFBaUIsZUFBZSxhQUFmLENBQTZCLGtCQUE3QixJQUFtRCxXQUFXLFlBQVgsQ0FBOUwsSUFBME4sVUFBVSxZQUFWLENBQTFOLENBSk8sQ0FEZ0U7Q0FBekU7Ozs7Ozs7OztBQWVBLFNBQVMsa0JBQVQsQ0FBNEIsV0FBNUIsRUFBeUM7QUFDdkMsTUFBSSxVQUFVLFlBQVksT0FBWixDQUR5QjtBQUV2QyxNQUFJLENBQUMsT0FBRCxJQUFZLFFBQVEsTUFBUixLQUFtQixDQUFuQixFQUFzQjtBQUNwQyxXQUFPLElBQVAsQ0FEb0M7R0FBdEM7QUFHQSxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxRQUFRLE1BQVIsRUFBZ0IsR0FBcEMsRUFBeUM7QUFDdkMsUUFBSSxjQUFjLFFBQVEsQ0FBUixDQUFkLENBRG1DO0FBRXZDLFFBQUksU0FBUyxZQUFZLE1BQVosQ0FGMEI7QUFHdkMsUUFBSSxXQUFXLElBQVgsSUFBbUIsV0FBVyxTQUFYLElBQXdCLFdBQVcsQ0FBWCxFQUFjOztBQUUzRCxVQUFJLGFBQWEscUJBQXFCLGNBQXJCLENBQW9DLFdBQXBDLEVBQWlELGlCQUFpQixLQUFqQixDQUF1QixNQUF2QixDQUFqRCxDQUFiLENBRnVEO0FBRzNELFVBQUksVUFBSixFQUFnQjtBQUNkLGVBQU8sS0FBUCxDQURjO09BQWhCO0tBSEY7R0FIRjtBQVdBLFNBQU8sSUFBUCxDQWhCdUM7Q0FBekM7O0FBbUJBLElBQUksdUJBQXVCOztBQUV6QixrQkFBZ0IsMEJBQVk7QUFDMUIsV0FBTyxXQUFQLENBRDBCO0dBQVo7O0FBSWhCLGNBQVksVUFBWjs7Ozs7Ozs7Ozs7Ozs7QUFjQSxpQkFBZSx1QkFBVSxZQUFWLEVBQXdCLGNBQXhCLEVBQXdDLGdCQUF4QyxFQUEwRCxXQUExRCxFQUF1RSxpQkFBdkUsRUFBMEY7QUFDdkcsUUFBSSxXQUFXLFlBQVgsQ0FBSixFQUE4QjtBQUM1QiwyQkFBcUIsQ0FBckIsQ0FENEI7S0FBOUIsTUFFTyxJQUFJLFNBQVMsWUFBVCxDQUFKLEVBQTRCO0FBQ2pDLDJCQUFxQixDQUFyQixDQURpQztBQUVqQyxRQUFFLHFCQUFxQixDQUFyQixDQUFGLEdBQTRCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLGlFQUFqQixDQUF4QyxHQUE4SCxVQUFVLEtBQVYsQ0FBOUgsR0FBaUosU0FBN0ssQ0FGaUM7S0FBNUI7O0FBS1AsK0JBQTJCLGdCQUEzQixDQUE0QyxZQUE1QyxFQUEwRCxXQUExRCxFQUF1RSxpQkFBdkUsRUFSdUc7O0FBVXZHLFFBQUksWUFBWSxtQkFBbUIsWUFBbkIsRUFBaUMsZ0JBQWpDLEVBQW1ELFdBQW5ELElBQWtFLCtCQUErQixZQUEvQixFQUE2QyxnQkFBN0MsRUFBK0QsV0FBL0QsRUFBNEUsaUJBQTVFLENBQWxFLEdBQW1LLElBQW5LOzs7Ozs7Ozs7OztBQVZ1RixRQXFCbkcsd0JBQXdCLGVBQWUsV0FBVyxZQUFYLENBQWYsQ0FyQjJFO0FBc0J2RyxRQUFJLHVCQUF1QixlQUFlLFVBQVUsWUFBVixDQUFmLENBdEI0RTtBQXVCdkcsUUFBSSxzQkFBc0IsZUFBZSxTQUFTLFlBQVQsQ0FBZixDQXZCNkU7QUF3QnZHLFFBQUksbUJBQW1CLHdCQUF3QixXQUFXLGNBQVgsR0FBNEIsdUJBQXVCLFdBQVcsYUFBWCxHQUEyQixzQkFBc0IsV0FBVyxZQUFYLEdBQTBCLElBQWhELENBeEJ0Qjs7QUEwQnZHLFFBQUksZ0JBQUosRUFBc0I7QUFDcEIsVUFBSSxVQUFVLHdCQUF3QixTQUF4QixDQUFrQyxnQkFBbEMsRUFBb0QsV0FBcEQsRUFBaUUsV0FBakUsRUFBOEUsaUJBQTlFLENBQVYsQ0FEZ0I7QUFFcEIsY0FBUSxZQUFSLEdBQXVCLDJCQUEyQixZQUEzQixDQUZIO0FBR3BCLHVCQUFpQiwwQkFBakIsQ0FBNEMsT0FBNUMsRUFIb0I7QUFJcEIsa0JBQVksV0FBVyxTQUFYLEVBQXNCLE9BQXRCLENBQVosQ0FKb0I7S0FBdEI7O0FBT0EsUUFBSSx1QkFBdUIsZUFBZSxpQkFBaUIsZUFBZSxhQUFmLENBQTZCLGNBQTdCLENBakM0QztBQWtDdkcsUUFBSSxxQkFBcUIsZUFBZSxDQUFDLG9CQUFELElBQXlCLFNBQVMsWUFBVCxDQUF4QyxJQUFrRSxtQkFBbUIsV0FBbkIsQ0FBbEUsQ0FsQzhFO0FBbUN2RyxRQUFJLGFBQWEsdUJBQXVCLFdBQVcsa0JBQVgsR0FBZ0MscUJBQXFCLFdBQVcsZ0JBQVgsR0FBOEIsSUFBbkQsQ0FuQytCO0FBb0N2RyxRQUFJLFVBQUosRUFBZ0I7QUFDZCxVQUFJLGFBQWEsd0JBQXdCLFNBQXhCLENBQWtDLFVBQWxDLEVBQThDLFdBQTlDLEVBQTJELFdBQTNELEVBQXdFLGlCQUF4RSxDQUFiLENBRFU7QUFFZCxpQkFBVyxZQUFYLEdBQTBCLDJCQUEyQixZQUEzQixDQUZaO0FBR2QsdUJBQWlCLDBCQUFqQixDQUE0QyxVQUE1QyxFQUhjO0FBSWQsa0JBQVksV0FBVyxTQUFYLEVBQXNCLFVBQXRCLENBQVosQ0FKYztBQUtkLHNCQUFnQixJQUFoQixFQUxjO0tBQWhCOztBQVFBLFFBQUksc0JBQXNCLDJCQUEyQixZQUEzQixDQUF3QyxtQkFBeEMsQ0E1QzZFO0FBNkN2RyxRQUFJLHFCQUFxQix3QkFBckIsSUFBaUQsd0JBQXdCLHFCQUF4QixFQUErQztBQUNsRywyQkFBcUIsd0JBQXJCLENBQThDLFFBQTlDLENBQXVELG1CQUF2RCxFQURrRztLQUFwRztBQUdBLDRCQUF3QixtQkFBeEIsQ0FoRHVHOztBQWtEdkcsV0FBTyxTQUFQLENBbER1RztHQUExRjs7QUFxRGYsMEJBQXdCLElBQXhCO0FBQ0EsNEJBQTBCLElBQTFCOztBQUVBLGFBQVc7Ozs7OztBQU1ULGtDQUE4QixzQ0FBVSxzQkFBVixFQUFrQztBQUM5RCwyQkFBcUIsc0JBQXJCLEdBQThDLHNCQUE5QyxDQUQ4RDtLQUFsQzs7Ozs7O0FBUTlCLG9DQUFnQyx3Q0FBVSx3QkFBVixFQUFvQztBQUNsRSwyQkFBcUIsd0JBQXJCLEdBQWdELHdCQUFoRCxDQURrRTtLQUFwQztHQWRsQztDQTVFRTs7QUFnR0osT0FBTyxPQUFQLEdBQWlCLG9CQUFqQiIsImZpbGUiOiJSZXNwb25kZXJFdmVudFBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZXNwb25kZXJFdmVudFBsdWdpblxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9FdmVudENvbnN0YW50cycpO1xudmFyIEV2ZW50UGx1Z2luVXRpbHMgPSByZXF1aXJlKCcuL0V2ZW50UGx1Z2luVXRpbHMnKTtcbnZhciBFdmVudFByb3BhZ2F0b3JzID0gcmVxdWlyZSgnLi9FdmVudFByb3BhZ2F0b3JzJyk7XG52YXIgUmVhY3RJbnN0YW5jZUhhbmRsZXMgPSByZXF1aXJlKCcuL1JlYWN0SW5zdGFuY2VIYW5kbGVzJyk7XG52YXIgUmVzcG9uZGVyU3ludGhldGljRXZlbnQgPSByZXF1aXJlKCcuL1Jlc3BvbmRlclN5bnRoZXRpY0V2ZW50Jyk7XG52YXIgUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUgPSByZXF1aXJlKCcuL1Jlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlJyk7XG5cbnZhciBhY2N1bXVsYXRlID0gcmVxdWlyZSgnLi9hY2N1bXVsYXRlJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG52YXIga2V5T2YgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlPZicpO1xuXG52YXIgaXNTdGFydGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNTdGFydGlzaDtcbnZhciBpc01vdmVpc2ggPSBFdmVudFBsdWdpblV0aWxzLmlzTW92ZWlzaDtcbnZhciBpc0VuZGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNFbmRpc2g7XG52YXIgZXhlY3V0ZURpcmVjdERpc3BhdGNoID0gRXZlbnRQbHVnaW5VdGlscy5leGVjdXRlRGlyZWN0RGlzcGF0Y2g7XG52YXIgaGFzRGlzcGF0Y2hlcyA9IEV2ZW50UGx1Z2luVXRpbHMuaGFzRGlzcGF0Y2hlcztcbnZhciBleGVjdXRlRGlzcGF0Y2hlc0luT3JkZXJTdG9wQXRUcnVlID0gRXZlbnRQbHVnaW5VdGlscy5leGVjdXRlRGlzcGF0Y2hlc0luT3JkZXJTdG9wQXRUcnVlO1xuXG4vKipcbiAqIElEIG9mIGVsZW1lbnQgdGhhdCBzaG91bGQgcmVzcG9uZCB0byB0b3VjaC9tb3ZlIHR5cGVzIG9mIGludGVyYWN0aW9ucywgYXNcbiAqIGluZGljYXRlZCBleHBsaWNpdGx5IGJ5IHJlbGV2YW50IGNhbGxiYWNrcy5cbiAqL1xudmFyIHJlc3BvbmRlcklEID0gbnVsbDtcblxuLyoqXG4gKiBDb3VudCBvZiBjdXJyZW50IHRvdWNoZXMuIEEgdGV4dElucHV0IHNob3VsZCBiZWNvbWUgcmVzcG9uZGVyIGlmZiB0aGVcbiAqIHRoZSBzZWxlY3Rpb24gY2hhbmdlcyB3aGlsZSB0aGVyZSBpcyBhIHRvdWNoIG9uIHRoZSBzY3JlZW4uXG4gKi9cbnZhciB0cmFja2VkVG91Y2hDb3VudCA9IDA7XG5cbi8qKlxuICogTGFzdCByZXBvcnRlZCBudW1iZXIgb2YgYWN0aXZlIHRvdWNoZXMuXG4gKi9cbnZhciBwcmV2aW91c0FjdGl2ZVRvdWNoZXMgPSAwO1xuXG52YXIgY2hhbmdlUmVzcG9uZGVyID0gZnVuY3Rpb24gKG5leHRSZXNwb25kZXJJRCwgYmxvY2tOYXRpdmVSZXNwb25kZXIpIHtcbiAgdmFyIG9sZFJlc3BvbmRlcklEID0gcmVzcG9uZGVySUQ7XG4gIHJlc3BvbmRlcklEID0gbmV4dFJlc3BvbmRlcklEO1xuICBpZiAoUmVzcG9uZGVyRXZlbnRQbHVnaW4uR2xvYmFsUmVzcG9uZGVySGFuZGxlciAhPT0gbnVsbCkge1xuICAgIFJlc3BvbmRlckV2ZW50UGx1Z2luLkdsb2JhbFJlc3BvbmRlckhhbmRsZXIub25DaGFuZ2Uob2xkUmVzcG9uZGVySUQsIG5leHRSZXNwb25kZXJJRCwgYmxvY2tOYXRpdmVSZXNwb25kZXIpO1xuICB9XG59O1xuXG52YXIgZXZlbnRUeXBlcyA9IHtcbiAgLyoqXG4gICAqIE9uIGEgYHRvdWNoU3RhcnRgL2Btb3VzZURvd25gLCBpcyBpdCBkZXNpcmVkIHRoYXQgdGhpcyBlbGVtZW50IGJlY29tZSB0aGVcbiAgICogcmVzcG9uZGVyP1xuICAgKi9cbiAgc3RhcnRTaG91bGRTZXRSZXNwb25kZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyOiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25TdGFydFNob3VsZFNldFJlc3BvbmRlckNhcHR1cmU6IG51bGwgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIE9uIGEgYHNjcm9sbGAsIGlzIGl0IGRlc2lyZWQgdGhhdCB0aGlzIGVsZW1lbnQgYmVjb21lIHRoZSByZXNwb25kZXI/IFRoaXNcbiAgICogaXMgdXN1YWxseSBub3QgbmVlZGVkLCBidXQgc2hvdWxkIGJlIHVzZWQgdG8gcmV0cm9hY3RpdmVseSBpbmZlciB0aGF0IGFcbiAgICogYHRvdWNoU3RhcnRgIGhhZCBvY2N1cmVkIGR1cmluZyBtb21lbnR1bSBzY3JvbGwuIER1cmluZyBhIG1vbWVudHVtIHNjcm9sbCxcbiAgICogYSB0b3VjaCBzdGFydCB3aWxsIGJlIGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IGEgc2Nyb2xsIGV2ZW50IGlmIHRoZSB2aWV3IGlzXG4gICAqIGN1cnJlbnRseSBzY3JvbGxpbmcuXG4gICAqXG4gICAqIFRPRE86IFRoaXMgc2hvdWxkbid0IGJ1YmJsZS5cbiAgICovXG4gIHNjcm9sbFNob3VsZFNldFJlc3BvbmRlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU2Nyb2xsU2hvdWxkU2V0UmVzcG9uZGVyOiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25TY3JvbGxTaG91bGRTZXRSZXNwb25kZXJDYXB0dXJlOiBudWxsIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBPbiB0ZXh0IHNlbGVjdGlvbiBjaGFuZ2UsIHNob3VsZCB0aGlzIGVsZW1lbnQgYmVjb21lIHRoZSByZXNwb25kZXI/IFRoaXNcbiAgICogaXMgbmVlZGVkIGZvciB0ZXh0IGlucHV0cyBvciBvdGhlciB2aWV3cyB3aXRoIG5hdGl2ZSBzZWxlY3Rpb24sIHNvIHRoZVxuICAgKiBKUyB2aWV3IGNhbiBjbGFpbSB0aGUgcmVzcG9uZGVyLlxuICAgKlxuICAgKiBUT0RPOiBUaGlzIHNob3VsZG4ndCBidWJibGUuXG4gICAqL1xuICBzZWxlY3Rpb25DaGFuZ2VTaG91bGRTZXRSZXNwb25kZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblNlbGVjdGlvbkNoYW5nZVNob3VsZFNldFJlc3BvbmRlcjogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU2VsZWN0aW9uQ2hhbmdlU2hvdWxkU2V0UmVzcG9uZGVyQ2FwdHVyZTogbnVsbCB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogT24gYSBgdG91Y2hNb3ZlYC9gbW91c2VNb3ZlYCwgaXMgaXQgZGVzaXJlZCB0aGF0IHRoaXMgZWxlbWVudCBiZWNvbWUgdGhlXG4gICAqIHJlc3BvbmRlcj9cbiAgICovXG4gIG1vdmVTaG91bGRTZXRSZXNwb25kZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbk1vdmVTaG91bGRTZXRSZXNwb25kZXI6IG51bGwgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbk1vdmVTaG91bGRTZXRSZXNwb25kZXJDYXB0dXJlOiBudWxsIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaXJlY3QgcmVzcG9uZGVyIGV2ZW50cyBkaXNwYXRjaGVkIGRpcmVjdGx5IHRvIHJlc3BvbmRlci4gRG8gbm90IGJ1YmJsZS5cbiAgICovXG4gIHJlc3BvbmRlclN0YXJ0OiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJTdGFydDogbnVsbCB9KSB9LFxuICByZXNwb25kZXJNb3ZlOiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJNb3ZlOiBudWxsIH0pIH0sXG4gIHJlc3BvbmRlckVuZDogeyByZWdpc3RyYXRpb25OYW1lOiBrZXlPZih7IG9uUmVzcG9uZGVyRW5kOiBudWxsIH0pIH0sXG4gIHJlc3BvbmRlclJlbGVhc2U6IHsgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlclJlbGVhc2U6IG51bGwgfSkgfSxcbiAgcmVzcG9uZGVyVGVybWluYXRpb25SZXF1ZXN0OiB7XG4gICAgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlclRlcm1pbmF0aW9uUmVxdWVzdDogbnVsbCB9KVxuICB9LFxuICByZXNwb25kZXJHcmFudDogeyByZWdpc3RyYXRpb25OYW1lOiBrZXlPZih7IG9uUmVzcG9uZGVyR3JhbnQ6IG51bGwgfSkgfSxcbiAgcmVzcG9uZGVyUmVqZWN0OiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJSZWplY3Q6IG51bGwgfSkgfSxcbiAgcmVzcG9uZGVyVGVybWluYXRlOiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJUZXJtaW5hdGU6IG51bGwgfSkgfVxufTtcblxuLyoqXG4gKlxuICogUmVzcG9uZGVyIFN5c3RlbTpcbiAqIC0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAtIEEgZ2xvYmFsLCBzb2xpdGFyeSBcImludGVyYWN0aW9uIGxvY2tcIiBvbiBhIHZpZXcuXG4gKiAtIElmIGEgbm9kZSBiZWNvbWVzIHRoZSByZXNwb25kZXIsIGl0IHNob3VsZCBjb252ZXkgdmlzdWFsIGZlZWRiYWNrXG4gKiAgIGltbWVkaWF0ZWx5IHRvIGluZGljYXRlIHNvLCBlaXRoZXIgYnkgaGlnaGxpZ2h0aW5nIG9yIG1vdmluZyBhY2NvcmRpbmdseS5cbiAqIC0gVG8gYmUgdGhlIHJlc3BvbmRlciBtZWFucywgdGhhdCB0b3VjaGVzIGFyZSBleGNsdXNpdmVseSBpbXBvcnRhbnQgdG8gdGhhdFxuICogICByZXNwb25kZXIgdmlldywgYW5kIG5vIG90aGVyIHZpZXcuXG4gKiAtIFdoaWxlIHRvdWNoZXMgYXJlIHN0aWxsIG9jY3VyaW5nLCB0aGUgcmVzcG9uZGVyIGxvY2sgY2FuIGJlIHRyYW5zZmVyZWQgdG9cbiAqICAgYSBuZXcgdmlldywgYnV0IG9ubHkgdG8gaW5jcmVhc2luZ2x5IFwiaGlnaGVyXCIgdmlld3MgKG1lYW5pbmcgYW5jZXN0b3JzIG9mXG4gKiAgIHRoZSBjdXJyZW50IHJlc3BvbmRlcikuXG4gKlxuICogUmVzcG9uZGVyIGJlaW5nIGdyYW50ZWQ6XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiAtIFRvdWNoIHN0YXJ0cywgbW92ZXMsIGFuZCBzY3JvbGxzIGNhbiBjYXVzZSBhbiBJRCB0byBiZWNvbWUgdGhlIHJlc3BvbmRlci5cbiAqIC0gV2UgY2FwdHVyZS9idWJibGUgYHN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyYC9gbW92ZVNob3VsZFNldFJlc3BvbmRlcmAgdG9cbiAqICAgdGhlIFwiYXBwcm9wcmlhdGUgcGxhY2VcIi5cbiAqIC0gSWYgbm90aGluZyBpcyBjdXJyZW50bHkgdGhlIHJlc3BvbmRlciwgdGhlIFwiYXBwcm9wcmlhdGUgcGxhY2VcIiBpcyB0aGVcbiAqICAgaW5pdGlhdGluZyBldmVudCdzIGB0YXJnZXRJRGAuXG4gKiAtIElmIHNvbWV0aGluZyAqaXMqIGFscmVhZHkgdGhlIHJlc3BvbmRlciwgdGhlIFwiYXBwcm9wcmlhdGUgcGxhY2VcIiBpcyB0aGVcbiAqICAgZmlyc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBldmVudCB0YXJnZXQgYW5kIHRoZSBjdXJyZW50IGByZXNwb25kZXJJRGAuXG4gKiAtIFNvbWUgbmVnb3RpYXRpb24gaGFwcGVuczogU2VlIHRoZSB0aW1pbmcgZGlhZ3JhbSBiZWxvdy5cbiAqIC0gU2Nyb2xsZWQgdmlld3MgYXV0b21hdGljYWxseSBiZWNvbWUgcmVzcG9uZGVyLiBUaGUgcmVhc29uaW5nIGlzIHRoYXQgYVxuICogICBwbGF0Zm9ybSBzY3JvbGwgdmlldyB0aGF0IGlzbid0IGJ1aWx0IG9uIHRvcCBvZiB0aGUgcmVzcG9uZGVyIHN5c3RlbSBoYXNcbiAqICAgYmVnYW4gc2Nyb2xsaW5nLCBhbmQgdGhlIGFjdGl2ZSByZXNwb25kZXIgbXVzdCBub3cgYmUgbm90aWZpZWQgdGhhdCB0aGVcbiAqICAgaW50ZXJhY3Rpb24gaXMgbm8gbG9uZ2VyIGxvY2tlZCB0byBpdCAtIHRoZSBzeXN0ZW0gaGFzIHRha2VuIG92ZXIuXG4gKlxuICogLSBSZXNwb25kZXIgYmVpbmcgcmVsZWFzZWQ6XG4gKiAgIEFzIHNvb24gYXMgbm8gbW9yZSB0b3VjaGVzIHRoYXQgKnN0YXJ0ZWQqIGluc2lkZSBvZiBkZXNjZW5kZW50cyBvZiB0aGVcbiAqICAgKmN1cnJlbnQqIHJlc3BvbmRlcklELCBhbiBgb25SZXNwb25kZXJSZWxlYXNlYCBldmVudCBpcyBkaXNwYXRjaGVkIHRvIHRoZVxuICogICBjdXJyZW50IHJlc3BvbmRlciwgYW5kIHRoZSByZXNwb25kZXIgbG9jayBpcyByZWxlYXNlZC5cbiAqXG4gKiBUT0RPOlxuICogLSBvbiBcImVuZFwiLCBhIGNhbGxiYWNrIGhvb2sgZm9yIGBvblJlc3BvbmRlckVuZFNob3VsZFJlbWFpblJlc3BvbmRlcmAgdGhhdFxuICogICBkZXRlcm1pbmVzIGlmIHRoZSByZXNwb25kZXIgbG9jayBzaG91bGQgcmVtYWluLlxuICogLSBJZiBhIHZpZXcgc2hvdWxkbid0IFwicmVtYWluXCIgdGhlIHJlc3BvbmRlciwgYW55IGFjdGl2ZSB0b3VjaGVzIHNob3VsZCBieVxuICogICBkZWZhdWx0IGJlIGNvbnNpZGVyZWQgXCJkZWFkXCIgYW5kIGRvIG5vdCBpbmZsdWVuY2UgZnV0dXJlIG5lZ290aWF0aW9ucyBvclxuICogICBidWJibGUgcGF0aHMuIEl0IHNob3VsZCBiZSBhcyBpZiB0aG9zZSB0b3VjaGVzIGRvIG5vdCBleGlzdC5cbiAqIC0tIEZvciBtdWx0aXRvdWNoOiBVc3VhbGx5IGEgdHJhbnNsYXRlLXogd2lsbCBjaG9vc2UgdG8gXCJyZW1haW5cIiByZXNwb25kZXJcbiAqICBhZnRlciBvbmUgb3V0IG9mIG1hbnkgdG91Y2hlcyBlbmRlZC4gRm9yIHRyYW5zbGF0ZS15LCB1c3VhbGx5IHRoZSB2aWV3XG4gKiAgZG9lc24ndCB3aXNoIHRvIFwicmVtYWluXCIgcmVzcG9uZGVyIGFmdGVyIG9uZSBvZiBtYW55IHRvdWNoZXMgZW5kLlxuICogLSBDb25zaWRlciBidWlsZGluZyB0aGlzIG9uIHRvcCBvZiBhIGBzdG9wUHJvcGFnYXRpb25gIG1vZGVsIHNpbWlsYXIgdG9cbiAqICAgYFczQ2AgZXZlbnRzLlxuICogLSBFbnN1cmUgdGhhdCBgb25SZXNwb25kZXJUZXJtaW5hdGVgIGlzIGNhbGxlZCBvbiB0b3VjaCBjYW5jZWxzLCB3aGV0aGVyIG9yXG4gKiAgIG5vdCBgb25SZXNwb25kZXJUZXJtaW5hdGlvblJlcXVlc3RgIHJldHVybnMgYHRydWVgIG9yIGBmYWxzZWAuXG4gKlxuICovXG5cbi8qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmVnb3RpYXRpb24gUGVyZm9ybWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8gICAgICAgICAgICAgICAgICAgICAgICAgXFxcblByb2Nlc3MgbG93IGxldmVsIGV2ZW50cyB0byAgICArICAgICBDdXJyZW50IFJlc3BvbmRlciAgICAgICsgICB3YW50c1Jlc3BvbmRlcklEXG5kZXRlcm1pbmUgd2hvIHRvIHBlcmZvcm0gbmVnb3QtfCAgIChpZiBhbnkgZXhpc3RzIGF0IGFsbCkgICB8XG5pYXRpb24vdHJhbnNpdGlvbiAgICAgICAgICAgICAgfCBPdGhlcndpc2UganVzdCBwYXNzIHRocm91Z2h8XG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tK1xuQnViYmxlIHRvIGZpbmQgZmlyc3QgSUQgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxudG8gcmV0dXJuIHRydWU6d2FudHNSZXNwb25kZXJJRHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICArLS0tLS0tLS0tLS0tLSsgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICB8IG9uVG91Y2hTdGFydHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICArLS0tLS0tKy0tLS0tLSsgICAgIG5vbmUgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgfCAgICAgICAgICAgIHJldHVybnwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuKy0tLS0tLS0tLS0tdi0tLS0tLS0tLS0tLS0rdHJ1ZXwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxufG9uU3RhcnRTaG91bGRTZXRSZXNwb25kZXJ8LS0tLS0+fG9uUmVzcG9uZGVyU3RhcnQgKGN1cikgIHw8LS0tLS0tLS0tLS0rXG4rLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLSsgICAgfCArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyB8ICAgICAgICAgIHxcbiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tKy0tLS0tLS0rXG4gICAgICAgICAgICB8IHJldHVybmVkIHRydWUgZm9yfCAgICAgICBmYWxzZTpSRUpFQ1QgKy0tLS0tLS0tPnxvblJlc3BvbmRlclJlamVjdFxuICAgICAgICAgICAgfCB3YW50c1Jlc3BvbmRlcklEIHwgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgIHwgKG5vdyBhdHRlbXB0ICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0rIHxcbiAgICAgICAgICAgIHwgIGhhbmRvZmYpICAgICAgICB8IHwgICBvblJlc3BvbmRlciAgICAgICAgICB8IHxcbiAgICAgICAgICAgICstLS0tLS0tLS0tLS0tLS0tLS0tPnwgICAgICBUZXJtaW5hdGlvblJlcXVlc3R8IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0rIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgIHRydWU6R1JBTlQgKy0tLS0tLS0tPnxvblJlc3BvbmRlckdyYW50fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0rLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHwgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgfCAgIG9uUmVzcG9uZGVyVGVybWluYXRlIHw8LS0tLS0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tKyB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICstLS0tLS0tLT58b25SZXNwb25kZXJTdGFydHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0rXG5CdWJibGUgdG8gZmluZCBmaXJzdCBJRCAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG50byByZXR1cm4gdHJ1ZTp3YW50c1Jlc3BvbmRlcklEfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICstLS0tLS0tLS0tLS0tKyAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgIHwgb25Ub3VjaE1vdmUgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICstLS0tLS0rLS0tLS0tKyAgICAgbm9uZSAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICB8ICAgICAgICAgICAgcmV0dXJufCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4rLS0tLS0tLS0tLS12LS0tLS0tLS0tLS0tLSt0cnVlfCArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyB8XG58b25Nb3ZlU2hvdWxkU2V0UmVzcG9uZGVyIHwtLS0tLT58b25SZXNwb25kZXJNb3ZlIChjdXIpICAgfDwtLS0tLS0tLS0tLStcbistLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tKyAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHwgICAgICAgICAgfFxuICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0rLS0tLS0tLStcbiAgICAgICAgICAgIHwgcmV0dXJuZWQgdHJ1ZSBmb3J8ICAgICAgIGZhbHNlOlJFSkVDVCArLS0tLS0tLS0+fG9uUmVzcG9uZGVyUmVqZWN8XG4gICAgICAgICAgICB8IHdhbnRzUmVzcG9uZGVySUQgfCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgfCAobm93IGF0dGVtcHQgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLSsgfFxuICAgICAgICAgICAgfCAgaGFuZG9mZikgICAgICAgIHwgfCAgIG9uUmVzcG9uZGVyICAgICAgICAgIHwgfFxuICAgICAgICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0+fCAgICAgIFRlcm1pbmF0aW9uUmVxdWVzdHwgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLSsgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgdHJ1ZTpHUkFOVCArLS0tLS0tLS0+fG9uUmVzcG9uZGVyR3JhbnR8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLSstLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfCAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB8ICAgb25SZXNwb25kZXJUZXJtaW5hdGUgfDwtLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0rIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0tPnxvblJlc3BvbmRlck1vdmUgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgIFNvbWUgYWN0aXZlIHRvdWNoIHN0YXJ0ZWR8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgIGluc2lkZSBjdXJyZW50IHJlc3BvbmRlciB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbiAgICAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPnwgICAgICBvblJlc3BvbmRlckVuZCAgICB8IHxcbiAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbiAgKy0tLSstLS0tLS0tLS0rICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgfCBvblRvdWNoRW5kICB8ICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgKy0tLSstLS0tLS0tLS0rICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbiAgICAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPnwgICAgIG9uUmVzcG9uZGVyRW5kICAgICB8IHxcbiAgICAgIE5vIGFjdGl2ZSB0b3VjaGVzIHN0YXJ0ZWR8ICstLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0rIHxcbiAgICAgIGluc2lkZSBjdXJyZW50IHJlc3BvbmRlciB8ICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgIHYgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHwgICAgb25SZXNwb25kZXJSZWxlYXNlICB8IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKi9cblxuLyoqXG4gKiBBIG5vdGUgYWJvdXQgZXZlbnQgb3JkZXJpbmcgaW4gdGhlIGBFdmVudFBsdWdpbkh1YmAuXG4gKlxuICogU3VwcG9zZSBwbHVnaW5zIGFyZSBpbmplY3RlZCBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICpcbiAqIGBbUiwgUywgQ11gXG4gKlxuICogVG8gaGVscCBpbGx1c3RyYXRlIHRoZSBleGFtcGxlLCBhc3N1bWUgYFNgIGlzIGBTaW1wbGVFdmVudFBsdWdpbmAgKGZvclxuICogYG9uQ2xpY2tgIGV0YykgYW5kIGBSYCBpcyBgUmVzcG9uZGVyRXZlbnRQbHVnaW5gLlxuICpcbiAqIFwiRGVmZXJyZWQtRGlzcGF0Y2hlZCBFdmVudHNcIjpcbiAqXG4gKiAtIFRoZSBjdXJyZW50IGV2ZW50IHBsdWdpbiBzeXN0ZW0gd2lsbCB0cmF2ZXJzZSB0aGUgbGlzdCBvZiBpbmplY3RlZCBwbHVnaW5zLFxuICogICBpbiBvcmRlciwgYW5kIGV4dHJhY3QgZXZlbnRzIGJ5IGNvbGxlY3RpbmcgdGhlIHBsdWdpbidzIHJldHVybiB2YWx1ZSBvZlxuICogICBgZXh0cmFjdEV2ZW50cygpYC5cbiAqIC0gVGhlc2UgZXZlbnRzIHRoYXQgYXJlIHJldHVybmVkIGZyb20gYGV4dHJhY3RFdmVudHNgIGFyZSBcImRlZmVycmVkXG4gKiAgIGRpc3BhdGNoZWQgZXZlbnRzXCIuXG4gKiAtIFdoZW4gcmV0dXJuZWQgZnJvbSBgZXh0cmFjdEV2ZW50c2AsIGRlZmVycmVkLWRpc3BhdGNoZWQgZXZlbnRzIGNvbnRhaW4gYW5cbiAqICAgXCJhY2N1bXVsYXRpb25cIiBvZiBkZWZlcnJlZCBkaXNwYXRjaGVzLlxuICogLSBUaGVzZSBkZWZlcnJlZCBkaXNwYXRjaGVzIGFyZSBhY2N1bXVsYXRlZC9jb2xsZWN0ZWQgYmVmb3JlIHRoZXkgYXJlXG4gKiAgIHJldHVybmVkLCBidXQgcHJvY2Vzc2VkIGF0IGEgbGF0ZXIgdGltZSBieSB0aGUgYEV2ZW50UGx1Z2luSHViYCAoaGVuY2UgdGhlXG4gKiAgIG5hbWUgZGVmZXJyZWQpLlxuICpcbiAqIEluIHRoZSBwcm9jZXNzIG9mIHJldHVybmluZyB0aGVpciBkZWZlcnJlZC1kaXNwYXRjaGVkIGV2ZW50cywgZXZlbnQgcGx1Z2luc1xuICogdGhlbXNlbHZlcyBjYW4gZGlzcGF0Y2ggZXZlbnRzIG9uLWRlbWFuZCB3aXRob3V0IHJldHVybmluZyB0aGVtIGZyb21cbiAqIGBleHRyYWN0RXZlbnRzYC4gUGx1Z2lucyBtaWdodCB3YW50IHRvIGRvIHRoaXMsIHNvIHRoYXQgdGhleSBjYW4gdXNlIGV2ZW50XG4gKiBkaXNwYXRjaGluZyBhcyBhIHRvb2wgdGhhdCBoZWxwcyB0aGVtIGRlY2lkZSB3aGljaCBldmVudHMgc2hvdWxkIGJlIGV4dHJhY3RlZFxuICogaW4gdGhlIGZpcnN0IHBsYWNlLlxuICpcbiAqIFwiT24tRGVtYW5kLURpc3BhdGNoZWQgRXZlbnRzXCI6XG4gKlxuICogLSBPbi1kZW1hbmQtZGlzcGF0Y2hlZCBldmVudHMgYXJlIG5vdCByZXR1cm5lZCBmcm9tIGBleHRyYWN0RXZlbnRzYC5cbiAqIC0gT24tZGVtYW5kLWRpc3BhdGNoZWQgZXZlbnRzIGFyZSBkaXNwYXRjaGVkIGR1cmluZyB0aGUgcHJvY2VzcyBvZiByZXR1cm5pbmdcbiAqICAgdGhlIGRlZmVycmVkLWRpc3BhdGNoZWQgZXZlbnRzLlxuICogLSBUaGV5IHNob3VsZCBub3QgaGF2ZSBzaWRlIGVmZmVjdHMuXG4gKiAtIFRoZXkgc2hvdWxkIGJlIGF2b2lkZWQsIGFuZC9vciBldmVudHVhbGx5IGJlIHJlcGxhY2VkIHdpdGggYW5vdGhlclxuICogICBhYnN0cmFjdGlvbiB0aGF0IGFsbG93cyBldmVudCBwbHVnaW5zIHRvIHBlcmZvcm0gbXVsdGlwbGUgXCJyb3VuZHNcIiBvZiBldmVudFxuICogICBleHRyYWN0aW9uLlxuICpcbiAqIFRoZXJlZm9yZSwgdGhlIHNlcXVlbmNlIG9mIGV2ZW50IGRpc3BhdGNoZXMgYmVjb21lczpcbiAqXG4gKiAtIGBSYHMgb24tZGVtYW5kIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBSYCBvbi1kZW1hbmQpXG4gKiAtIGBTYHMgb24tZGVtYW5kIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBTYCBvbi1kZW1hbmQpXG4gKiAtIGBDYHMgb24tZGVtYW5kIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBDYCBvbi1kZW1hbmQpXG4gKiAtIGBSYHMgZXh0cmFjdGVkIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBFdmVudFBsdWdpbkh1YmApXG4gKiAtIGBTYHMgZXh0cmFjdGVkIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBFdmVudFBsdWdpbkh1YmApXG4gKiAtIGBDYHMgZXh0cmFjdGVkIGV2ZW50cyAoaWYgYW55KSAgIChkaXNwYXRjaGVkIGJ5IGBFdmVudFBsdWdpbkh1YmApXG4gKlxuICogSW4gdGhlIGNhc2Ugb2YgYFJlc3BvbmRlckV2ZW50UGx1Z2luYDogSWYgdGhlIGBzdGFydFNob3VsZFNldFJlc3BvbmRlcmBcbiAqIG9uLWRlbWFuZCBkaXNwYXRjaCByZXR1cm5zIGB0cnVlYCAoYW5kIHNvbWUgb3RoZXIgZGV0YWlscyBhcmUgc2F0aXNmaWVkKSB0aGVcbiAqIGBvblJlc3BvbmRlckdyYW50YCBkZWZlcnJlZCBkaXNwYXRjaGVkIGV2ZW50IGlzIHJldHVybmVkIGZyb21cbiAqIGBleHRyYWN0RXZlbnRzYC4gVGhlIHNlcXVlbmNlIG9mIGRpc3BhdGNoIGV4ZWN1dGlvbnMgaW4gdGhpcyBjYXNlXG4gKiB3aWxsIGFwcGVhciBhcyBmb2xsb3dzOlxuICpcbiAqIC0gYHN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyYCAoYFJlc3BvbmRlckV2ZW50UGx1Z2luYCBkaXNwYXRjaGVzIG9uLWRlbWFuZClcbiAqIC0gYHRvdWNoU3RhcnRDYXB0dXJlYCAgICAgICAoYEV2ZW50UGx1Z2luSHViYCBkaXNwYXRjaGVzIGFzIHVzdWFsKVxuICogLSBgdG91Y2hTdGFydGAgICAgICAgICAgICAgIChgRXZlbnRQbHVnaW5IdWJgIGRpc3BhdGNoZXMgYXMgdXN1YWwpXG4gKiAtIGByZXNwb25kZXJHcmFudC9SZWplY3RgICAgKGBFdmVudFBsdWdpbkh1YmAgZGlzcGF0Y2hlcyBhcyB1c3VhbClcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUYXJnZXRJRCBJRCBvZiBkZWVwZXN0IFJlYWN0IHJlbmRlcmVkIGVsZW1lbnQuXG4gKiBAcGFyYW0ge29iamVjdH0gbmF0aXZlRXZlbnQgTmF0aXZlIGJyb3dzZXIgZXZlbnQuXG4gKiBAcmV0dXJuIHsqfSBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAqL1xuZnVuY3Rpb24gc2V0UmVzcG9uZGVyQW5kRXh0cmFjdFRyYW5zZmVyKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gIHZhciBzaG91bGRTZXRFdmVudFR5cGUgPSBpc1N0YXJ0aXNoKHRvcExldmVsVHlwZSkgPyBldmVudFR5cGVzLnN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyIDogaXNNb3ZlaXNoKHRvcExldmVsVHlwZSkgPyBldmVudFR5cGVzLm1vdmVTaG91bGRTZXRSZXNwb25kZXIgOiB0b3BMZXZlbFR5cGUgPT09IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXMudG9wU2VsZWN0aW9uQ2hhbmdlID8gZXZlbnRUeXBlcy5zZWxlY3Rpb25DaGFuZ2VTaG91bGRTZXRSZXNwb25kZXIgOiBldmVudFR5cGVzLnNjcm9sbFNob3VsZFNldFJlc3BvbmRlcjtcblxuICAvLyBUT0RPOiBzdG9wIG9uZSBzaG9ydCBvZiB0aGUgdGhlIGN1cnJlbnQgcmVzcG9uZGVyLlxuICB2YXIgYnViYmxlU2hvdWxkU2V0RnJvbSA9ICFyZXNwb25kZXJJRCA/IHRvcExldmVsVGFyZ2V0SUQgOiBSZWFjdEluc3RhbmNlSGFuZGxlcy5nZXRGaXJzdENvbW1vbkFuY2VzdG9ySUQocmVzcG9uZGVySUQsIHRvcExldmVsVGFyZ2V0SUQpO1xuXG4gIC8vIFdoZW4gY2FwdHVyaW5nL2J1YmJsaW5nIHRoZSBcInNob3VsZFNldFwiIGV2ZW50LCB3ZSB3YW50IHRvIHNraXAgdGhlIHRhcmdldFxuICAvLyAoZGVlcGVzdCBJRCkgaWYgaXQgaGFwcGVucyB0byBiZSB0aGUgY3VycmVudCByZXNwb25kZXIuIFRoZSByZWFzb25pbmc6XG4gIC8vIEl0J3Mgc3RyYW5nZSB0byBnZXQgYW4gYG9uTW92ZVNob3VsZFNldFJlc3BvbmRlcmAgd2hlbiB5b3UncmUgKmFscmVhZHkqXG4gIC8vIHRoZSByZXNwb25kZXIuXG4gIHZhciBza2lwT3ZlckJ1YmJsZVNob3VsZFNldEZyb20gPSBidWJibGVTaG91bGRTZXRGcm9tID09PSByZXNwb25kZXJJRDtcbiAgdmFyIHNob3VsZFNldEV2ZW50ID0gUmVzcG9uZGVyU3ludGhldGljRXZlbnQuZ2V0UG9vbGVkKHNob3VsZFNldEV2ZW50VHlwZSwgYnViYmxlU2hvdWxkU2V0RnJvbSwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgc2hvdWxkU2V0RXZlbnQudG91Y2hIaXN0b3J5ID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUudG91Y2hIaXN0b3J5O1xuICBpZiAoc2tpcE92ZXJCdWJibGVTaG91bGRTZXRGcm9tKSB7XG4gICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlVHdvUGhhc2VEaXNwYXRjaGVzU2tpcFRhcmdldChzaG91bGRTZXRFdmVudCk7XG4gIH0gZWxzZSB7XG4gICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlVHdvUGhhc2VEaXNwYXRjaGVzKHNob3VsZFNldEV2ZW50KTtcbiAgfVxuICB2YXIgd2FudHNSZXNwb25kZXJJRCA9IGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWUoc2hvdWxkU2V0RXZlbnQpO1xuICBpZiAoIXNob3VsZFNldEV2ZW50LmlzUGVyc2lzdGVudCgpKSB7XG4gICAgc2hvdWxkU2V0RXZlbnQuY29uc3RydWN0b3IucmVsZWFzZShzaG91bGRTZXRFdmVudCk7XG4gIH1cblxuICBpZiAoIXdhbnRzUmVzcG9uZGVySUQgfHwgd2FudHNSZXNwb25kZXJJRCA9PT0gcmVzcG9uZGVySUQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgZXh0cmFjdGVkO1xuICB2YXIgZ3JhbnRFdmVudCA9IFJlc3BvbmRlclN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZChldmVudFR5cGVzLnJlc3BvbmRlckdyYW50LCB3YW50c1Jlc3BvbmRlcklELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICBncmFudEV2ZW50LnRvdWNoSGlzdG9yeSA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeTtcblxuICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVEaXJlY3REaXNwYXRjaGVzKGdyYW50RXZlbnQpO1xuICB2YXIgYmxvY2tOYXRpdmVSZXNwb25kZXIgPSBleGVjdXRlRGlyZWN0RGlzcGF0Y2goZ3JhbnRFdmVudCkgPT09IHRydWU7XG4gIGlmIChyZXNwb25kZXJJRCkge1xuXG4gICAgdmFyIHRlcm1pbmF0aW9uUmVxdWVzdEV2ZW50ID0gUmVzcG9uZGVyU3ludGhldGljRXZlbnQuZ2V0UG9vbGVkKGV2ZW50VHlwZXMucmVzcG9uZGVyVGVybWluYXRpb25SZXF1ZXN0LCByZXNwb25kZXJJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICB0ZXJtaW5hdGlvblJlcXVlc3RFdmVudC50b3VjaEhpc3RvcnkgPSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS50b3VjaEhpc3Rvcnk7XG4gICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlRGlyZWN0RGlzcGF0Y2hlcyh0ZXJtaW5hdGlvblJlcXVlc3RFdmVudCk7XG4gICAgdmFyIHNob3VsZFN3aXRjaCA9ICFoYXNEaXNwYXRjaGVzKHRlcm1pbmF0aW9uUmVxdWVzdEV2ZW50KSB8fCBleGVjdXRlRGlyZWN0RGlzcGF0Y2godGVybWluYXRpb25SZXF1ZXN0RXZlbnQpO1xuICAgIGlmICghdGVybWluYXRpb25SZXF1ZXN0RXZlbnQuaXNQZXJzaXN0ZW50KCkpIHtcbiAgICAgIHRlcm1pbmF0aW9uUmVxdWVzdEV2ZW50LmNvbnN0cnVjdG9yLnJlbGVhc2UodGVybWluYXRpb25SZXF1ZXN0RXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRTd2l0Y2gpIHtcbiAgICAgIHZhciB0ZXJtaW5hdGVUeXBlID0gZXZlbnRUeXBlcy5yZXNwb25kZXJUZXJtaW5hdGU7XG4gICAgICB2YXIgdGVybWluYXRlRXZlbnQgPSBSZXNwb25kZXJTeW50aGV0aWNFdmVudC5nZXRQb29sZWQodGVybWluYXRlVHlwZSwgcmVzcG9uZGVySUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG4gICAgICB0ZXJtaW5hdGVFdmVudC50b3VjaEhpc3RvcnkgPSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS50b3VjaEhpc3Rvcnk7XG4gICAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVEaXJlY3REaXNwYXRjaGVzKHRlcm1pbmF0ZUV2ZW50KTtcbiAgICAgIGV4dHJhY3RlZCA9IGFjY3VtdWxhdGUoZXh0cmFjdGVkLCBbZ3JhbnRFdmVudCwgdGVybWluYXRlRXZlbnRdKTtcbiAgICAgIGNoYW5nZVJlc3BvbmRlcih3YW50c1Jlc3BvbmRlcklELCBibG9ja05hdGl2ZVJlc3BvbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWplY3RFdmVudCA9IFJlc3BvbmRlclN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZChldmVudFR5cGVzLnJlc3BvbmRlclJlamVjdCwgd2FudHNSZXNwb25kZXJJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICAgIHJlamVjdEV2ZW50LnRvdWNoSGlzdG9yeSA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeTtcbiAgICAgIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZURpcmVjdERpc3BhdGNoZXMocmVqZWN0RXZlbnQpO1xuICAgICAgZXh0cmFjdGVkID0gYWNjdW11bGF0ZShleHRyYWN0ZWQsIHJlamVjdEV2ZW50KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZXh0cmFjdGVkID0gYWNjdW11bGF0ZShleHRyYWN0ZWQsIGdyYW50RXZlbnQpO1xuICAgIGNoYW5nZVJlc3BvbmRlcih3YW50c1Jlc3BvbmRlcklELCBibG9ja05hdGl2ZVJlc3BvbmRlcik7XG4gIH1cbiAgcmV0dXJuIGV4dHJhY3RlZDtcbn1cblxuLyoqXG4gKiBBIHRyYW5zZmVyIGlzIGEgbmVnb3RpYXRpb24gYmV0d2VlbiBhIGN1cnJlbnRseSBzZXQgcmVzcG9uZGVyIGFuZCB0aGUgbmV4dFxuICogZWxlbWVudCB0byBjbGFpbSByZXNwb25kZXIgc3RhdHVzLiBBbnkgc3RhcnQgZXZlbnQgY291bGQgdHJpZ2dlciBhIHRyYW5zZmVyXG4gKiBvZiByZXNwb25kZXJJRC4gQW55IG1vdmUgZXZlbnQgY291bGQgdHJpZ2dlciBhIHRyYW5zZmVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYSB0cmFuc2ZlciBvZiByZXNwb25kZXIgY291bGQgcG9zc2libHkgb2NjdXIuXG4gKi9cbmZ1bmN0aW9uIGNhblRyaWdnZXJUcmFuc2Zlcih0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0SUQsIG5hdGl2ZUV2ZW50KSB7XG4gIHJldHVybiB0b3BMZXZlbFRhcmdldElEICYmIChcbiAgLy8gcmVzcG9uZGVySWdub3JlU2Nyb2xsOiBXZSBhcmUgdHJ5aW5nIHRvIG1pZ3JhdGUgYXdheSBmcm9tIHNwZWNpZmljYWxseSB0cmFja2luZyBuYXRpdmUgc2Nyb2xsXG4gIC8vIGV2ZW50cyBoZXJlIGFuZCByZXNwb25kZXJJZ25vcmVTY3JvbGwgaW5kaWNhdGVzIHdlIHdpbGwgc2VuZCB0b3BUb3VjaENhbmNlbCB0byBoYW5kbGVcbiAgLy8gY2FuY2VsaW5nIHRvdWNoIGV2ZW50cyBpbnN0ZWFkXG4gIHRvcExldmVsVHlwZSA9PT0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BTY3JvbGwgJiYgIW5hdGl2ZUV2ZW50LnJlc3BvbmRlcklnbm9yZVNjcm9sbCB8fCB0cmFja2VkVG91Y2hDb3VudCA+IDAgJiYgdG9wTGV2ZWxUeXBlID09PSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzLnRvcFNlbGVjdGlvbkNoYW5nZSB8fCBpc1N0YXJ0aXNoKHRvcExldmVsVHlwZSkgfHwgaXNNb3ZlaXNoKHRvcExldmVsVHlwZSkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhpcyB0b3VjaCBlbmQgZXZlbnQgbWFrZXMgaXQgc3VjaCB0aGF0IHRoZXJlIGFyZSBub1xuICogbG9uZ2VyIGFueSB0b3VjaGVzIHRoYXQgc3RhcnRlZCBpbnNpZGUgb2YgdGhlIGN1cnJlbnQgYHJlc3BvbmRlcklEYC5cbiAqXG4gKiBAcGFyYW0ge05hdGl2ZUV2ZW50fSBuYXRpdmVFdmVudCBOYXRpdmUgdG91Y2ggZW5kIGV2ZW50LlxuICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhpcyB0b3VjaCBlbmQgZXZlbnQgZW5kcyB0aGUgcmVzcG9uZGVyLlxuICovXG5mdW5jdGlvbiBub1Jlc3BvbmRlclRvdWNoZXMobmF0aXZlRXZlbnQpIHtcbiAgdmFyIHRvdWNoZXMgPSBuYXRpdmVFdmVudC50b3VjaGVzO1xuICBpZiAoIXRvdWNoZXMgfHwgdG91Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYWN0aXZlVG91Y2ggPSB0b3VjaGVzW2ldO1xuICAgIHZhciB0YXJnZXQgPSBhY3RpdmVUb3VjaC50YXJnZXQ7XG4gICAgaWYgKHRhcmdldCAhPT0gbnVsbCAmJiB0YXJnZXQgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXQgIT09IDApIHtcbiAgICAgIC8vIElzIHRoZSBvcmlnaW5hbCB0b3VjaCBsb2NhdGlvbiBpbnNpZGUgb2YgdGhlIGN1cnJlbnQgcmVzcG9uZGVyP1xuICAgICAgdmFyIGlzQW5jZXN0b3IgPSBSZWFjdEluc3RhbmNlSGFuZGxlcy5pc0FuY2VzdG9ySURPZihyZXNwb25kZXJJRCwgRXZlbnRQbHVnaW5VdGlscy5nZXRJRCh0YXJnZXQpKTtcbiAgICAgIGlmIChpc0FuY2VzdG9yKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBSZXNwb25kZXJFdmVudFBsdWdpbiA9IHtcblxuICBnZXRSZXNwb25kZXJJRDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZXNwb25kZXJJRDtcbiAgfSxcblxuICBldmVudFR5cGVzOiBldmVudFR5cGVzLFxuXG4gIC8qKlxuICAgKiBXZSBtdXN0IGJlIHJlc2lsaWVudCB0byBgdG9wTGV2ZWxUYXJnZXRJRGAgYmVpbmcgYHVuZGVmaW5lZGAgb25cbiAgICogYHRvdWNoTW92ZWAsIG9yIGB0b3VjaEVuZGAuIE9uIGNlcnRhaW4gcGxhdGZvcm1zLCB0aGlzIG1lYW5zIHRoYXQgYSBuYXRpdmVcbiAgICogc2Nyb2xsIGhhcyBhc3N1bWVkIGNvbnRyb2wgYW5kIHRoZSBvcmlnaW5hbCB0b3VjaCB0YXJnZXRzIGFyZSBkZXN0cm95ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAgICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gdG9wTGV2ZWxUYXJnZXQgVGhlIGxpc3RlbmluZyBjb21wb25lbnQgcm9vdCBub2RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUYXJnZXRJRCBJRCBvZiBgdG9wTGV2ZWxUYXJnZXRgLlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmF0aXZlRXZlbnQgTmF0aXZlIGJyb3dzZXIgZXZlbnQuXG4gICAqIEByZXR1cm4geyp9IEFuIGFjY3VtdWxhdGlvbiBvZiBzeW50aGV0aWMgZXZlbnRzLlxuICAgKiBAc2VlIHtFdmVudFBsdWdpbkh1Yi5leHRyYWN0RXZlbnRzfVxuICAgKi9cbiAgZXh0cmFjdEV2ZW50czogZnVuY3Rpb24gKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXQsIHRvcExldmVsVGFyZ2V0SUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCkge1xuICAgIGlmIChpc1N0YXJ0aXNoKHRvcExldmVsVHlwZSkpIHtcbiAgICAgIHRyYWNrZWRUb3VjaENvdW50ICs9IDE7XG4gICAgfSBlbHNlIGlmIChpc0VuZGlzaCh0b3BMZXZlbFR5cGUpKSB7XG4gICAgICB0cmFja2VkVG91Y2hDb3VudCAtPSAxO1xuICAgICAgISh0cmFja2VkVG91Y2hDb3VudCA+PSAwKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFbmRlZCBhIHRvdWNoIGV2ZW50IHdoaWNoIHdhcyBub3QgY291bnRlZCBpbiB0cmFja2VkVG91Y2hDb3VudC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUucmVjb3JkVG91Y2hUcmFjayh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG5cbiAgICB2YXIgZXh0cmFjdGVkID0gY2FuVHJpZ2dlclRyYW5zZmVyKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQpID8gc2V0UmVzcG9uZGVyQW5kRXh0cmFjdFRyYW5zZmVyKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSA6IG51bGw7XG4gICAgLy8gUmVzcG9uZGVyIG1heSBvciBtYXkgbm90IGhhdmUgdHJhbnNmZXJlZCBvbiBhIG5ldyB0b3VjaCBzdGFydC9tb3ZlLlxuICAgIC8vIFJlZ2FyZGxlc3MsIHdob2V2ZXIgaXMgdGhlIHJlc3BvbmRlciBhZnRlciBhbnkgcG90ZW50aWFsIHRyYW5zZmVyLCB3ZVxuICAgIC8vIGRpcmVjdCBhbGwgdG91Y2ggc3RhcnQvbW92ZS9lbmRzIHRvIHRoZW0gaW4gdGhlIGZvcm0gb2ZcbiAgICAvLyBgb25SZXNwb25kZXJNb3ZlL1N0YXJ0L0VuZGAuIFRoZXNlIHdpbGwgYmUgY2FsbGVkIGZvciAqZXZlcnkqIGFkZGl0aW9uYWxcbiAgICAvLyBmaW5nZXIgdGhhdCBtb3ZlL3N0YXJ0L2VuZCwgZGlzcGF0Y2hlZCBkaXJlY3RseSB0byB3aG9ldmVyIGlzIHRoZVxuICAgIC8vIGN1cnJlbnQgcmVzcG9uZGVyIGF0IHRoYXQgbW9tZW50LCB1bnRpbCB0aGUgcmVzcG9uZGVyIGlzIFwicmVsZWFzZWRcIi5cbiAgICAvL1xuICAgIC8vIFRoZXNlIG11bHRpcGxlIGluZGl2aWR1YWwgY2hhbmdlIHRvdWNoIGV2ZW50cyBhcmUgYXJlIGFsd2F5cyBib29rZW5kZWRcbiAgICAvLyBieSBgb25SZXNwb25kZXJHcmFudGAsIGFuZCBvbmUgb2ZcbiAgICAvLyAoYG9uUmVzcG9uZGVyUmVsZWFzZS9vblJlc3BvbmRlclRlcm1pbmF0ZWApLlxuICAgIHZhciBpc1Jlc3BvbmRlclRvdWNoU3RhcnQgPSByZXNwb25kZXJJRCAmJiBpc1N0YXJ0aXNoKHRvcExldmVsVHlwZSk7XG4gICAgdmFyIGlzUmVzcG9uZGVyVG91Y2hNb3ZlID0gcmVzcG9uZGVySUQgJiYgaXNNb3ZlaXNoKHRvcExldmVsVHlwZSk7XG4gICAgdmFyIGlzUmVzcG9uZGVyVG91Y2hFbmQgPSByZXNwb25kZXJJRCAmJiBpc0VuZGlzaCh0b3BMZXZlbFR5cGUpO1xuICAgIHZhciBpbmNyZW1lbnRhbFRvdWNoID0gaXNSZXNwb25kZXJUb3VjaFN0YXJ0ID8gZXZlbnRUeXBlcy5yZXNwb25kZXJTdGFydCA6IGlzUmVzcG9uZGVyVG91Y2hNb3ZlID8gZXZlbnRUeXBlcy5yZXNwb25kZXJNb3ZlIDogaXNSZXNwb25kZXJUb3VjaEVuZCA/IGV2ZW50VHlwZXMucmVzcG9uZGVyRW5kIDogbnVsbDtcblxuICAgIGlmIChpbmNyZW1lbnRhbFRvdWNoKSB7XG4gICAgICB2YXIgZ2VzdHVyZSA9IFJlc3BvbmRlclN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZChpbmNyZW1lbnRhbFRvdWNoLCByZXNwb25kZXJJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICAgIGdlc3R1cmUudG91Y2hIaXN0b3J5ID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUudG91Y2hIaXN0b3J5O1xuICAgICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlRGlyZWN0RGlzcGF0Y2hlcyhnZXN0dXJlKTtcbiAgICAgIGV4dHJhY3RlZCA9IGFjY3VtdWxhdGUoZXh0cmFjdGVkLCBnZXN0dXJlKTtcbiAgICB9XG5cbiAgICB2YXIgaXNSZXNwb25kZXJUZXJtaW5hdGUgPSByZXNwb25kZXJJRCAmJiB0b3BMZXZlbFR5cGUgPT09IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXMudG9wVG91Y2hDYW5jZWw7XG4gICAgdmFyIGlzUmVzcG9uZGVyUmVsZWFzZSA9IHJlc3BvbmRlcklEICYmICFpc1Jlc3BvbmRlclRlcm1pbmF0ZSAmJiBpc0VuZGlzaCh0b3BMZXZlbFR5cGUpICYmIG5vUmVzcG9uZGVyVG91Y2hlcyhuYXRpdmVFdmVudCk7XG4gICAgdmFyIGZpbmFsVG91Y2ggPSBpc1Jlc3BvbmRlclRlcm1pbmF0ZSA/IGV2ZW50VHlwZXMucmVzcG9uZGVyVGVybWluYXRlIDogaXNSZXNwb25kZXJSZWxlYXNlID8gZXZlbnRUeXBlcy5yZXNwb25kZXJSZWxlYXNlIDogbnVsbDtcbiAgICBpZiAoZmluYWxUb3VjaCkge1xuICAgICAgdmFyIGZpbmFsRXZlbnQgPSBSZXNwb25kZXJTeW50aGV0aWNFdmVudC5nZXRQb29sZWQoZmluYWxUb3VjaCwgcmVzcG9uZGVySUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG4gICAgICBmaW5hbEV2ZW50LnRvdWNoSGlzdG9yeSA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeTtcbiAgICAgIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZURpcmVjdERpc3BhdGNoZXMoZmluYWxFdmVudCk7XG4gICAgICBleHRyYWN0ZWQgPSBhY2N1bXVsYXRlKGV4dHJhY3RlZCwgZmluYWxFdmVudCk7XG4gICAgICBjaGFuZ2VSZXNwb25kZXIobnVsbCk7XG4gICAgfVxuXG4gICAgdmFyIG51bWJlckFjdGl2ZVRvdWNoZXMgPSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS50b3VjaEhpc3RvcnkubnVtYmVyQWN0aXZlVG91Y2hlcztcbiAgICBpZiAoUmVzcG9uZGVyRXZlbnRQbHVnaW4uR2xvYmFsSW50ZXJhY3Rpb25IYW5kbGVyICYmIG51bWJlckFjdGl2ZVRvdWNoZXMgIT09IHByZXZpb3VzQWN0aXZlVG91Y2hlcykge1xuICAgICAgUmVzcG9uZGVyRXZlbnRQbHVnaW4uR2xvYmFsSW50ZXJhY3Rpb25IYW5kbGVyLm9uQ2hhbmdlKG51bWJlckFjdGl2ZVRvdWNoZXMpO1xuICAgIH1cbiAgICBwcmV2aW91c0FjdGl2ZVRvdWNoZXMgPSBudW1iZXJBY3RpdmVUb3VjaGVzO1xuXG4gICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgfSxcblxuICBHbG9iYWxSZXNwb25kZXJIYW5kbGVyOiBudWxsLFxuICBHbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXI6IG51bGwsXG5cbiAgaW5qZWN0aW9uOiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHt7b25DaGFuZ2U6IChSZWFjdElELCBSZWFjdElEKSA9PiB2b2lkfSBHbG9iYWxSZXNwb25kZXJIYW5kbGVyXG4gICAgICogT2JqZWN0IHRoYXQgaGFuZGxlcyBhbnkgY2hhbmdlIGluIHJlc3BvbmRlci4gVXNlIHRoaXMgdG8gaW5qZWN0XG4gICAgICogaW50ZWdyYXRpb24gd2l0aCBhbiBleGlzdGluZyB0b3VjaCBoYW5kbGluZyBzeXN0ZW0gZXRjLlxuICAgICAqL1xuICAgIGluamVjdEdsb2JhbFJlc3BvbmRlckhhbmRsZXI6IGZ1bmN0aW9uIChHbG9iYWxSZXNwb25kZXJIYW5kbGVyKSB7XG4gICAgICBSZXNwb25kZXJFdmVudFBsdWdpbi5HbG9iYWxSZXNwb25kZXJIYW5kbGVyID0gR2xvYmFsUmVzcG9uZGVySGFuZGxlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHt7b25DaGFuZ2U6IChudW1iZXJBY3RpdmVUb3VjaGVzKSA9PiB2b2lkfSBHbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXJcbiAgICAgKiBPYmplY3QgdGhhdCBoYW5kbGVzIGFueSBjaGFuZ2UgaW4gdGhlIG51bWJlciBvZiBhY3RpdmUgdG91Y2hlcy5cbiAgICAgKi9cbiAgICBpbmplY3RHbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXI6IGZ1bmN0aW9uIChHbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXIpIHtcbiAgICAgIFJlc3BvbmRlckV2ZW50UGx1Z2luLkdsb2JhbEludGVyYWN0aW9uSGFuZGxlciA9IEdsb2JhbEludGVyYWN0aW9uSGFuZGxlcjtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uZGVyRXZlbnRQbHVnaW47Il19