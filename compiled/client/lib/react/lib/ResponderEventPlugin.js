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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1Jlc3BvbmRlckV2ZW50UGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjtBQUNBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSx3QkFBUixDQUEzQjtBQUNBLElBQUksMEJBQTBCLFFBQVEsMkJBQVIsQ0FBOUI7QUFDQSxJQUFJLDZCQUE2QixRQUFRLDhCQUFSLENBQWpDOztBQUVBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjtBQUNBLElBQUksUUFBUSxRQUFRLGdCQUFSLENBQVo7O0FBRUEsSUFBSSxhQUFhLGlCQUFpQixVQUFsQztBQUNBLElBQUksWUFBWSxpQkFBaUIsU0FBakM7QUFDQSxJQUFJLFdBQVcsaUJBQWlCLFFBQWhDO0FBQ0EsSUFBSSx3QkFBd0IsaUJBQWlCLHFCQUE3QztBQUNBLElBQUksZ0JBQWdCLGlCQUFpQixhQUFyQztBQUNBLElBQUkscUNBQXFDLGlCQUFpQixrQ0FBMUQ7Ozs7OztBQU1BLElBQUksY0FBYyxJQUFsQjs7Ozs7O0FBTUEsSUFBSSxvQkFBb0IsQ0FBeEI7Ozs7O0FBS0EsSUFBSSx3QkFBd0IsQ0FBNUI7O0FBRUEsSUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBVSxlQUFWLEVBQTJCLG9CQUEzQixFQUFpRDtBQUNyRSxNQUFJLGlCQUFpQixXQUFyQjtBQUNBLGdCQUFjLGVBQWQ7QUFDQSxNQUFJLHFCQUFxQixzQkFBckIsS0FBZ0QsSUFBcEQsRUFBMEQ7QUFDeEQseUJBQXFCLHNCQUFyQixDQUE0QyxRQUE1QyxDQUFxRCxjQUFyRCxFQUFxRSxlQUFyRSxFQUFzRixvQkFBdEY7QUFDRDtB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QUFoQjtBQUNEOztBQUVELFFBQUksc0JBQXNCLDJCQUEyQixZQUEzQixDQUF3QyxtQkFBbEU7QUFDQSxRQUFJLHFCQUFxQix3QkFBckIsSUFBaUQsd0JBQXdCLHFCQUE3RSxFQUFvRztBQUNsRywyQkFBcUIsd0JBQXJCLENBQThDLFFBQTlDLENBQXVELG1CQUF2RDtBQUNEO0FBQ0QsNEJBQXdCLG1CQUF4Qjs7QUFFQSxXQUFPLFNBQVA7QUFDRCxHQXZFd0I7O0FBeUV6QiwwQkFBd0IsSUF6RUM7QUEwRXpCLDRCQUEwQixJQTFFRDs7QUE0RXpCLGFBQVc7Ozs7OztBQU1ULGtDQUE4QixzQ0FBVSxzQkFBVixFQUFrQztBQUM5RCwyQkFBcUIsc0JBQXJCLEdBQThDLHNCQUE5QztBQUNELEtBUlE7Ozs7OztBQWNULG9DQUFnQyx3Q0FBVSx3QkFBVixFQUFvQztBQUNsRSwyQkFBcUIsd0JBQXJCLEdBQWdELHdCQUFoRDtBQUNEO0FBaEJRO0FBNUVjLENBQTNCOztBQWdHQSxPQUFPLE9BQVAsR0FBaUIsb0JBQWpCIiwiZmlsZSI6IlJlc3BvbmRlckV2ZW50UGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlc3BvbmRlckV2ZW50UGx1Z2luXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgRXZlbnRQbHVnaW5VdGlscyA9IHJlcXVpcmUoJy4vRXZlbnRQbHVnaW5VdGlscycpO1xudmFyIEV2ZW50UHJvcGFnYXRvcnMgPSByZXF1aXJlKCcuL0V2ZW50UHJvcGFnYXRvcnMnKTtcbnZhciBSZWFjdEluc3RhbmNlSGFuZGxlcyA9IHJlcXVpcmUoJy4vUmVhY3RJbnN0YW5jZUhhbmRsZXMnKTtcbnZhciBSZXNwb25kZXJTeW50aGV0aWNFdmVudCA9IHJlcXVpcmUoJy4vUmVzcG9uZGVyU3ludGhldGljRXZlbnQnKTtcbnZhciBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZSA9IHJlcXVpcmUoJy4vUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUnKTtcblxudmFyIGFjY3VtdWxhdGUgPSByZXF1aXJlKCcuL2FjY3VtdWxhdGUnKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBrZXlPZiA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU9mJyk7XG5cbnZhciBpc1N0YXJ0aXNoID0gRXZlbnRQbHVnaW5VdGlscy5pc1N0YXJ0aXNoO1xudmFyIGlzTW92ZWlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNNb3ZlaXNoO1xudmFyIGlzRW5kaXNoID0gRXZlbnRQbHVnaW5VdGlscy5pc0VuZGlzaDtcbnZhciBleGVjdXRlRGlyZWN0RGlzcGF0Y2ggPSBFdmVudFBsdWdpblV0aWxzLmV4ZWN1dGVEaXJlY3REaXNwYXRjaDtcbnZhciBoYXNEaXNwYXRjaGVzID0gRXZlbnRQbHVnaW5VdGlscy5oYXNEaXNwYXRjaGVzO1xudmFyIGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWUgPSBFdmVudFBsdWdpblV0aWxzLmV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWU7XG5cbi8qKlxuICogSUQgb2YgZWxlbWVudCB0aGF0IHNob3VsZCByZXNwb25kIHRvIHRvdWNoL21vdmUgdHlwZXMgb2YgaW50ZXJhY3Rpb25zLCBhc1xuICogaW5kaWNhdGVkIGV4cGxpY2l0bHkgYnkgcmVsZXZhbnQgY2FsbGJhY2tzLlxuICovXG52YXIgcmVzcG9uZGVySUQgPSBudWxsO1xuXG4vKipcbiAqIENvdW50IG9mIGN1cnJlbnQgdG91Y2hlcy4gQSB0ZXh0SW5wdXQgc2hvdWxkIGJlY29tZSByZXNwb25kZXIgaWZmIHRoZVxuICogdGhlIHNlbGVjdGlvbiBjaGFuZ2VzIHdoaWxlIHRoZXJlIGlzIGEgdG91Y2ggb24gdGhlIHNjcmVlbi5cbiAqL1xudmFyIHRyYWNrZWRUb3VjaENvdW50ID0gMDtcblxuLyoqXG4gKiBMYXN0IHJlcG9ydGVkIG51bWJlciBvZiBhY3RpdmUgdG91Y2hlcy5cbiAqL1xudmFyIHByZXZpb3VzQWN0aXZlVG91Y2hlcyA9IDA7XG5cbnZhciBjaGFuZ2VSZXNwb25kZXIgPSBmdW5jdGlvbiAobmV4dFJlc3BvbmRlcklELCBibG9ja05hdGl2ZVJlc3BvbmRlcikge1xuICB2YXIgb2xkUmVzcG9uZGVySUQgPSByZXNwb25kZXJJRDtcbiAgcmVzcG9uZGVySUQgPSBuZXh0UmVzcG9uZGVySUQ7XG4gIGlmIChSZXNwb25kZXJFdmVudFBsdWdpbi5HbG9iYWxSZXNwb25kZXJIYW5kbGVyICE9PSBudWxsKSB7XG4gICAgUmVzcG9uZGVyRXZlbnRQbHVnaW4uR2xvYmFsUmVzcG9uZGVySGFuZGxlci5vbkNoYW5nZShvbGRSZXNwb25kZXJJRCwgbmV4dFJlc3BvbmRlcklELCBibG9ja05hdGl2ZVJlc3BvbmRlcik7XG4gIH1cbn07XG5cbnZhciBldmVudFR5cGVzID0ge1xuICAvKipcbiAgICogT24gYSBgdG91Y2hTdGFydGAvYG1vdXNlRG93bmAsIGlzIGl0IGRlc2lyZWQgdGhhdCB0aGlzIGVsZW1lbnQgYmVjb21lIHRoZVxuICAgKiByZXNwb25kZXI/XG4gICAqL1xuICBzdGFydFNob3VsZFNldFJlc3BvbmRlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU3RhcnRTaG91bGRTZXRSZXNwb25kZXI6IG51bGwgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyQ2FwdHVyZTogbnVsbCB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogT24gYSBgc2Nyb2xsYCwgaXMgaXQgZGVzaXJlZCB0aGF0IHRoaXMgZWxlbWVudCBiZWNvbWUgdGhlIHJlc3BvbmRlcj8gVGhpc1xuICAgKiBpcyB1c3VhbGx5IG5vdCBuZWVkZWQsIGJ1dCBzaG91bGQgYmUgdXNlZCB0byByZXRyb2FjdGl2ZWx5IGluZmVyIHRoYXQgYVxuICAgKiBgdG91Y2hTdGFydGAgaGFkIG9jY3VyZWQgZHVyaW5nIG1vbWVudHVtIHNjcm9sbC4gRHVyaW5nIGEgbW9tZW50dW0gc2Nyb2xsLFxuICAgKiBhIHRvdWNoIHN0YXJ0IHdpbGwgYmUgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgYSBzY3JvbGwgZXZlbnQgaWYgdGhlIHZpZXcgaXNcbiAgICogY3VycmVudGx5IHNjcm9sbGluZy5cbiAgICpcbiAgICogVE9ETzogVGhpcyBzaG91bGRuJ3QgYnViYmxlLlxuICAgKi9cbiAgc2Nyb2xsU2hvdWxkU2V0UmVzcG9uZGVyOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25TY3JvbGxTaG91bGRTZXRSZXNwb25kZXI6IG51bGwgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblNjcm9sbFNob3VsZFNldFJlc3BvbmRlckNhcHR1cmU6IG51bGwgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIE9uIHRleHQgc2VsZWN0aW9uIGNoYW5nZSwgc2hvdWxkIHRoaXMgZWxlbWVudCBiZWNvbWUgdGhlIHJlc3BvbmRlcj8gVGhpc1xuICAgKiBpcyBuZWVkZWQgZm9yIHRleHQgaW5wdXRzIG9yIG90aGVyIHZpZXdzIHdpdGggbmF0aXZlIHNlbGVjdGlvbiwgc28gdGhlXG4gICAqIEpTIHZpZXcgY2FuIGNsYWltIHRoZSByZXNwb25kZXIuXG4gICAqXG4gICAqIFRPRE86IFRoaXMgc2hvdWxkbid0IGJ1YmJsZS5cbiAgICovXG4gIHNlbGVjdGlvbkNoYW5nZVNob3VsZFNldFJlc3BvbmRlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU2VsZWN0aW9uQ2hhbmdlU2hvdWxkU2V0UmVzcG9uZGVyOiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25TZWxlY3Rpb25DaGFuZ2VTaG91bGRTZXRSZXNwb25kZXJDYXB0dXJlOiBudWxsIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBPbiBhIGB0b3VjaE1vdmVgL2Btb3VzZU1vdmVgLCBpcyBpdCBkZXNpcmVkIHRoYXQgdGhpcyBlbGVtZW50IGJlY29tZSB0aGVcbiAgICogcmVzcG9uZGVyP1xuICAgKi9cbiAgbW92ZVNob3VsZFNldFJlc3BvbmRlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTW92ZVNob3VsZFNldFJlc3BvbmRlcjogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW92ZVNob3VsZFNldFJlc3BvbmRlckNhcHR1cmU6IG51bGwgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERpcmVjdCByZXNwb25kZXIgZXZlbnRzIGRpc3BhdGNoZWQgZGlyZWN0bHkgdG8gcmVzcG9uZGVyLiBEbyBub3QgYnViYmxlLlxuICAgKi9cbiAgcmVzcG9uZGVyU3RhcnQ6IHsgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlclN0YXJ0OiBudWxsIH0pIH0sXG4gIHJlc3BvbmRlck1vdmU6IHsgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlck1vdmU6IG51bGwgfSkgfSxcbiAgcmVzcG9uZGVyRW5kOiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJFbmQ6IG51bGwgfSkgfSxcbiAgcmVzcG9uZGVyUmVsZWFzZTogeyByZWdpc3RyYXRpb25OYW1lOiBrZXlPZih7IG9uUmVzcG9uZGVyUmVsZWFzZTogbnVsbCB9KSB9LFxuICByZXNwb25kZXJUZXJtaW5hdGlvblJlcXVlc3Q6IHtcbiAgICByZWdpc3RyYXRpb25OYW1lOiBrZXlPZih7IG9uUmVzcG9uZGVyVGVybWluYXRpb25SZXF1ZXN0OiBudWxsIH0pXG4gIH0sXG4gIHJlc3BvbmRlckdyYW50OiB7IHJlZ2lzdHJhdGlvbk5hbWU6IGtleU9mKHsgb25SZXNwb25kZXJHcmFudDogbnVsbCB9KSB9LFxuICByZXNwb25kZXJSZWplY3Q6IHsgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlclJlamVjdDogbnVsbCB9KSB9LFxuICByZXNwb25kZXJUZXJtaW5hdGU6IHsgcmVnaXN0cmF0aW9uTmFtZToga2V5T2YoeyBvblJlc3BvbmRlclRlcm1pbmF0ZTogbnVsbCB9KSB9XG59O1xuXG4vKipcbiAqXG4gKiBSZXNwb25kZXIgU3lzdGVtOlxuICogLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIC0gQSBnbG9iYWwsIHNvbGl0YXJ5IFwiaW50ZXJhY3Rpb24gbG9ja1wiIG9uIGEgdmlldy5cbiAqIC0gSWYgYSBub2RlIGJlY29tZXMgdGhlIHJlc3BvbmRlciwgaXQgc2hvdWxkIGNvbnZleSB2aXN1YWwgZmVlZGJhY2tcbiAqICAgaW1tZWRpYXRlbHkgdG8gaW5kaWNhdGUgc28sIGVpdGhlciBieSBoaWdobGlnaHRpbmcgb3IgbW92aW5nIGFjY29yZGluZ2x5LlxuICogLSBUbyBiZSB0aGUgcmVzcG9uZGVyIG1lYW5zLCB0aGF0IHRvdWNoZXMgYXJlIGV4Y2x1c2l2ZWx5IGltcG9ydGFudCB0byB0aGF0XG4gKiAgIHJlc3BvbmRlciB2aWV3LCBhbmQgbm8gb3RoZXIgdmlldy5cbiAqIC0gV2hpbGUgdG91Y2hlcyBhcmUgc3RpbGwgb2NjdXJpbmcsIHRoZSByZXNwb25kZXIgbG9jayBjYW4gYmUgdHJhbnNmZXJlZCB0b1xuICogICBhIG5ldyB2aWV3LCBidXQgb25seSB0byBpbmNyZWFzaW5nbHkgXCJoaWdoZXJcIiB2aWV3cyAobWVhbmluZyBhbmNlc3RvcnMgb2ZcbiAqICAgdGhlIGN1cnJlbnQgcmVzcG9uZGVyKS5cbiAqXG4gKiBSZXNwb25kZXIgYmVpbmcgZ3JhbnRlZDpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIC0gVG91Y2ggc3RhcnRzLCBtb3ZlcywgYW5kIHNjcm9sbHMgY2FuIGNhdXNlIGFuIElEIHRvIGJlY29tZSB0aGUgcmVzcG9uZGVyLlxuICogLSBXZSBjYXB0dXJlL2J1YmJsZSBgc3RhcnRTaG91bGRTZXRSZXNwb25kZXJgL2Btb3ZlU2hvdWxkU2V0UmVzcG9uZGVyYCB0b1xuICogICB0aGUgXCJhcHByb3ByaWF0ZSBwbGFjZVwiLlxuICogLSBJZiBub3RoaW5nIGlzIGN1cnJlbnRseSB0aGUgcmVzcG9uZGVyLCB0aGUgXCJhcHByb3ByaWF0ZSBwbGFjZVwiIGlzIHRoZVxuICogICBpbml0aWF0aW5nIGV2ZW50J3MgYHRhcmdldElEYC5cbiAqIC0gSWYgc29tZXRoaW5nICppcyogYWxyZWFkeSB0aGUgcmVzcG9uZGVyLCB0aGUgXCJhcHByb3ByaWF0ZSBwbGFjZVwiIGlzIHRoZVxuICogICBmaXJzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIGV2ZW50IHRhcmdldCBhbmQgdGhlIGN1cnJlbnQgYHJlc3BvbmRlcklEYC5cbiAqIC0gU29tZSBuZWdvdGlhdGlvbiBoYXBwZW5zOiBTZWUgdGhlIHRpbWluZyBkaWFncmFtIGJlbG93LlxuICogLSBTY3JvbGxlZCB2aWV3cyBhdXRvbWF0aWNhbGx5IGJlY29tZSByZXNwb25kZXIuIFRoZSByZWFzb25pbmcgaXMgdGhhdCBhXG4gKiAgIHBsYXRmb3JtIHNjcm9sbCB2aWV3IHRoYXQgaXNuJ3QgYnVpbHQgb24gdG9wIG9mIHRoZSByZXNwb25kZXIgc3lzdGVtIGhhc1xuICogICBiZWdhbiBzY3JvbGxpbmcsIGFuZCB0aGUgYWN0aXZlIHJlc3BvbmRlciBtdXN0IG5vdyBiZSBub3RpZmllZCB0aGF0IHRoZVxuICogICBpbnRlcmFjdGlvbiBpcyBubyBsb25nZXIgbG9ja2VkIHRvIGl0IC0gdGhlIHN5c3RlbSBoYXMgdGFrZW4gb3Zlci5cbiAqXG4gKiAtIFJlc3BvbmRlciBiZWluZyByZWxlYXNlZDpcbiAqICAgQXMgc29vbiBhcyBubyBtb3JlIHRvdWNoZXMgdGhhdCAqc3RhcnRlZCogaW5zaWRlIG9mIGRlc2NlbmRlbnRzIG9mIHRoZVxuICogICAqY3VycmVudCogcmVzcG9uZGVySUQsIGFuIGBvblJlc3BvbmRlclJlbGVhc2VgIGV2ZW50IGlzIGRpc3BhdGNoZWQgdG8gdGhlXG4gKiAgIGN1cnJlbnQgcmVzcG9uZGVyLCBhbmQgdGhlIHJlc3BvbmRlciBsb2NrIGlzIHJlbGVhc2VkLlxuICpcbiAqIFRPRE86XG4gKiAtIG9uIFwiZW5kXCIsIGEgY2FsbGJhY2sgaG9vayBmb3IgYG9uUmVzcG9uZGVyRW5kU2hvdWxkUmVtYWluUmVzcG9uZGVyYCB0aGF0XG4gKiAgIGRldGVybWluZXMgaWYgdGhlIHJlc3BvbmRlciBsb2NrIHNob3VsZCByZW1haW4uXG4gKiAtIElmIGEgdmlldyBzaG91bGRuJ3QgXCJyZW1haW5cIiB0aGUgcmVzcG9uZGVyLCBhbnkgYWN0aXZlIHRvdWNoZXMgc2hvdWxkIGJ5XG4gKiAgIGRlZmF1bHQgYmUgY29uc2lkZXJlZCBcImRlYWRcIiBhbmQgZG8gbm90IGluZmx1ZW5jZSBmdXR1cmUgbmVnb3RpYXRpb25zIG9yXG4gKiAgIGJ1YmJsZSBwYXRocy4gSXQgc2hvdWxkIGJlIGFzIGlmIHRob3NlIHRvdWNoZXMgZG8gbm90IGV4aXN0LlxuICogLS0gRm9yIG11bHRpdG91Y2g6IFVzdWFsbHkgYSB0cmFuc2xhdGUteiB3aWxsIGNob29zZSB0byBcInJlbWFpblwiIHJlc3BvbmRlclxuICogIGFmdGVyIG9uZSBvdXQgb2YgbWFueSB0b3VjaGVzIGVuZGVkLiBGb3IgdHJhbnNsYXRlLXksIHVzdWFsbHkgdGhlIHZpZXdcbiAqICBkb2Vzbid0IHdpc2ggdG8gXCJyZW1haW5cIiByZXNwb25kZXIgYWZ0ZXIgb25lIG9mIG1hbnkgdG91Y2hlcyBlbmQuXG4gKiAtIENvbnNpZGVyIGJ1aWxkaW5nIHRoaXMgb24gdG9wIG9mIGEgYHN0b3BQcm9wYWdhdGlvbmAgbW9kZWwgc2ltaWxhciB0b1xuICogICBgVzNDYCBldmVudHMuXG4gKiAtIEVuc3VyZSB0aGF0IGBvblJlc3BvbmRlclRlcm1pbmF0ZWAgaXMgY2FsbGVkIG9uIHRvdWNoIGNhbmNlbHMsIHdoZXRoZXIgb3JcbiAqICAgbm90IGBvblJlc3BvbmRlclRlcm1pbmF0aW9uUmVxdWVzdGAgcmV0dXJucyBgdHJ1ZWAgb3IgYGZhbHNlYC5cbiAqXG4gKi9cblxuLyogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZWdvdGlhdGlvbiBQZXJmb3JtZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuUHJvY2VzcyBsb3cgbGV2ZWwgZXZlbnRzIHRvICAgICsgICAgIEN1cnJlbnQgUmVzcG9uZGVyICAgICAgKyAgIHdhbnRzUmVzcG9uZGVySURcbmRldGVybWluZSB3aG8gdG8gcGVyZm9ybSBuZWdvdC18ICAgKGlmIGFueSBleGlzdHMgYXQgYWxsKSAgIHxcbmlhdGlvbi90cmFuc2l0aW9uICAgICAgICAgICAgICB8IE90aGVyd2lzZSBqdXN0IHBhc3MgdGhyb3VnaHxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0rXG5CdWJibGUgdG8gZmluZCBmaXJzdCBJRCAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG50byByZXR1cm4gdHJ1ZTp3YW50c1Jlc3BvbmRlcklEfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICstLS0tLS0tLS0tLS0tKyAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgIHwgb25Ub3VjaFN0YXJ0fCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICstLS0tLS0rLS0tLS0tKyAgICAgbm9uZSAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICB8ICAgICAgICAgICAgcmV0dXJufCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4rLS0tLS0tLS0tLS12LS0tLS0tLS0tLS0tLSt0cnVlfCArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyB8XG58b25TdGFydFNob3VsZFNldFJlc3BvbmRlcnwtLS0tLT58b25SZXNwb25kZXJTdGFydCAoY3VyKSAgfDwtLS0tLS0tLS0tLStcbistLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tKyAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHwgICAgICAgICAgfFxuICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0rLS0tLS0tLStcbiAgICAgICAgICAgIHwgcmV0dXJuZWQgdHJ1ZSBmb3J8ICAgICAgIGZhbHNlOlJFSkVDVCArLS0tLS0tLS0+fG9uUmVzcG9uZGVyUmVqZWN0XG4gICAgICAgICAgICB8IHdhbnRzUmVzcG9uZGVySUQgfCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgfCAobm93IGF0dGVtcHQgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLSsgfFxuICAgICAgICAgICAgfCAgaGFuZG9mZikgICAgICAgIHwgfCAgIG9uUmVzcG9uZGVyICAgICAgICAgIHwgfFxuICAgICAgICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0+fCAgICAgIFRlcm1pbmF0aW9uUmVxdWVzdHwgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLSsgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgdHJ1ZTpHUkFOVCArLS0tLS0tLS0+fG9uUmVzcG9uZGVyR3JhbnR8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLSstLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfCAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB8ICAgb25SZXNwb25kZXJUZXJtaW5hdGUgfDwtLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0rIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0tPnxvblJlc3BvbmRlclN0YXJ0fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbkJ1YmJsZSB0byBmaW5kIGZpcnN0IElEICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbnRvIHJldHVybiB0cnVlOndhbnRzUmVzcG9uZGVySUR8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgKy0tLS0tLS0tLS0tLS0rICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgfCBvblRvdWNoTW92ZSB8ICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgKy0tLS0tLSstLS0tLS0rICAgICBub25lICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgIHwgICAgICAgICAgICByZXR1cm58ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbistLS0tLS0tLS0tLXYtLS0tLS0tLS0tLS0tK3RydWV8ICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rIHxcbnxvbk1vdmVTaG91bGRTZXRSZXNwb25kZXIgfC0tLS0tPnxvblJlc3BvbmRlck1vdmUgKGN1cikgICB8PC0tLS0tLS0tLS0tK1xuKy0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0rICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfCAgICAgICAgICB8XG4gICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLSstLS0tLS0tK1xuICAgICAgICAgICAgfCByZXR1cm5lZCB0cnVlIGZvcnwgICAgICAgZmFsc2U6UkVKRUNUICstLS0tLS0tLT58b25SZXNwb25kZXJSZWplY3xcbiAgICAgICAgICAgIHwgd2FudHNSZXNwb25kZXJJRCB8ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0rXG4gICAgICAgICAgICB8IChub3cgYXR0ZW1wdCAgICAgfCArLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tKyB8XG4gICAgICAgICAgICB8ICBoYW5kb2ZmKSAgICAgICAgfCB8ICAgb25SZXNwb25kZXIgICAgICAgICAgfCB8XG4gICAgICAgICAgICArLS0tLS0tLS0tLS0tLS0tLS0tLT58ICAgICAgVGVybWluYXRpb25SZXF1ZXN0fCB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tKyB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICB0cnVlOkdSQU5UICstLS0tLS0tLT58b25SZXNwb25kZXJHcmFudHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tKy0tLS0tLS0rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyB8ICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHwgICBvblJlc3BvbmRlclRlcm1pbmF0ZSB8PC0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLSsgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfCArLS0tLS0tLS0tLS0tLS0tLStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICArLS0tLS0tLS0+fG9uUmVzcG9uZGVyTW92ZSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICstLS0tLS0tLS0tLS0tLS0tK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgU29tZSBhY3RpdmUgdG91Y2ggc3RhcnRlZHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgaW5zaWRlIGN1cnJlbnQgcmVzcG9uZGVyIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxuICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+fCAgICAgIG9uUmVzcG9uZGVyRW5kICAgIHwgfFxuICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxuICArLS0tKy0tLS0tLS0tLSsgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICB8IG9uVG91Y2hFbmQgIHwgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICArLS0tKy0tLS0tLS0tLSsgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxuICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+fCAgICAgb25SZXNwb25kZXJFbmQgICAgIHwgfFxuICAgICAgTm8gYWN0aXZlIHRvdWNoZXMgc3RhcnRlZHwgKy0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLSsgfFxuICAgICAgaW5zaWRlIGN1cnJlbnQgcmVzcG9uZGVyIHwgICAgICAgICAgICAgfCAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgdiAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgfCAgICBvblJlc3BvbmRlclJlbGVhc2UgIHwgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAqL1xuXG4vKipcbiAqIEEgbm90ZSBhYm91dCBldmVudCBvcmRlcmluZyBpbiB0aGUgYEV2ZW50UGx1Z2luSHViYC5cbiAqXG4gKiBTdXBwb3NlIHBsdWdpbnMgYXJlIGluamVjdGVkIGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKlxuICogYFtSLCBTLCBDXWBcbiAqXG4gKiBUbyBoZWxwIGlsbHVzdHJhdGUgdGhlIGV4YW1wbGUsIGFzc3VtZSBgU2AgaXMgYFNpbXBsZUV2ZW50UGx1Z2luYCAoZm9yXG4gKiBgb25DbGlja2AgZXRjKSBhbmQgYFJgIGlzIGBSZXNwb25kZXJFdmVudFBsdWdpbmAuXG4gKlxuICogXCJEZWZlcnJlZC1EaXNwYXRjaGVkIEV2ZW50c1wiOlxuICpcbiAqIC0gVGhlIGN1cnJlbnQgZXZlbnQgcGx1Z2luIHN5c3RlbSB3aWxsIHRyYXZlcnNlIHRoZSBsaXN0IG9mIGluamVjdGVkIHBsdWdpbnMsXG4gKiAgIGluIG9yZGVyLCBhbmQgZXh0cmFjdCBldmVudHMgYnkgY29sbGVjdGluZyB0aGUgcGx1Z2luJ3MgcmV0dXJuIHZhbHVlIG9mXG4gKiAgIGBleHRyYWN0RXZlbnRzKClgLlxuICogLSBUaGVzZSBldmVudHMgdGhhdCBhcmUgcmV0dXJuZWQgZnJvbSBgZXh0cmFjdEV2ZW50c2AgYXJlIFwiZGVmZXJyZWRcbiAqICAgZGlzcGF0Y2hlZCBldmVudHNcIi5cbiAqIC0gV2hlbiByZXR1cm5lZCBmcm9tIGBleHRyYWN0RXZlbnRzYCwgZGVmZXJyZWQtZGlzcGF0Y2hlZCBldmVudHMgY29udGFpbiBhblxuICogICBcImFjY3VtdWxhdGlvblwiIG9mIGRlZmVycmVkIGRpc3BhdGNoZXMuXG4gKiAtIFRoZXNlIGRlZmVycmVkIGRpc3BhdGNoZXMgYXJlIGFjY3VtdWxhdGVkL2NvbGxlY3RlZCBiZWZvcmUgdGhleSBhcmVcbiAqICAgcmV0dXJuZWQsIGJ1dCBwcm9jZXNzZWQgYXQgYSBsYXRlciB0aW1lIGJ5IHRoZSBgRXZlbnRQbHVnaW5IdWJgIChoZW5jZSB0aGVcbiAqICAgbmFtZSBkZWZlcnJlZCkuXG4gKlxuICogSW4gdGhlIHByb2Nlc3Mgb2YgcmV0dXJuaW5nIHRoZWlyIGRlZmVycmVkLWRpc3BhdGNoZWQgZXZlbnRzLCBldmVudCBwbHVnaW5zXG4gKiB0aGVtc2VsdmVzIGNhbiBkaXNwYXRjaCBldmVudHMgb24tZGVtYW5kIHdpdGhvdXQgcmV0dXJuaW5nIHRoZW0gZnJvbVxuICogYGV4dHJhY3RFdmVudHNgLiBQbHVnaW5zIG1pZ2h0IHdhbnQgdG8gZG8gdGhpcywgc28gdGhhdCB0aGV5IGNhbiB1c2UgZXZlbnRcbiAqIGRpc3BhdGNoaW5nIGFzIGEgdG9vbCB0aGF0IGhlbHBzIHRoZW0gZGVjaWRlIHdoaWNoIGV2ZW50cyBzaG91bGQgYmUgZXh0cmFjdGVkXG4gKiBpbiB0aGUgZmlyc3QgcGxhY2UuXG4gKlxuICogXCJPbi1EZW1hbmQtRGlzcGF0Y2hlZCBFdmVudHNcIjpcbiAqXG4gKiAtIE9uLWRlbWFuZC1kaXNwYXRjaGVkIGV2ZW50cyBhcmUgbm90IHJldHVybmVkIGZyb20gYGV4dHJhY3RFdmVudHNgLlxuICogLSBPbi1kZW1hbmQtZGlzcGF0Y2hlZCBldmVudHMgYXJlIGRpc3BhdGNoZWQgZHVyaW5nIHRoZSBwcm9jZXNzIG9mIHJldHVybmluZ1xuICogICB0aGUgZGVmZXJyZWQtZGlzcGF0Y2hlZCBldmVudHMuXG4gKiAtIFRoZXkgc2hvdWxkIG5vdCBoYXZlIHNpZGUgZWZmZWN0cy5cbiAqIC0gVGhleSBzaG91bGQgYmUgYXZvaWRlZCwgYW5kL29yIGV2ZW50dWFsbHkgYmUgcmVwbGFjZWQgd2l0aCBhbm90aGVyXG4gKiAgIGFic3RyYWN0aW9uIHRoYXQgYWxsb3dzIGV2ZW50IHBsdWdpbnMgdG8gcGVyZm9ybSBtdWx0aXBsZSBcInJvdW5kc1wiIG9mIGV2ZW50XG4gKiAgIGV4dHJhY3Rpb24uXG4gKlxuICogVGhlcmVmb3JlLCB0aGUgc2VxdWVuY2Ugb2YgZXZlbnQgZGlzcGF0Y2hlcyBiZWNvbWVzOlxuICpcbiAqIC0gYFJgcyBvbi1kZW1hbmQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYFJgIG9uLWRlbWFuZClcbiAqIC0gYFNgcyBvbi1kZW1hbmQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYFNgIG9uLWRlbWFuZClcbiAqIC0gYENgcyBvbi1kZW1hbmQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYENgIG9uLWRlbWFuZClcbiAqIC0gYFJgcyBleHRyYWN0ZWQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYEV2ZW50UGx1Z2luSHViYClcbiAqIC0gYFNgcyBleHRyYWN0ZWQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYEV2ZW50UGx1Z2luSHViYClcbiAqIC0gYENgcyBleHRyYWN0ZWQgZXZlbnRzIChpZiBhbnkpICAgKGRpc3BhdGNoZWQgYnkgYEV2ZW50UGx1Z2luSHViYClcbiAqXG4gKiBJbiB0aGUgY2FzZSBvZiBgUmVzcG9uZGVyRXZlbnRQbHVnaW5gOiBJZiB0aGUgYHN0YXJ0U2hvdWxkU2V0UmVzcG9uZGVyYFxuICogb24tZGVtYW5kIGRpc3BhdGNoIHJldHVybnMgYHRydWVgIChhbmQgc29tZSBvdGhlciBkZXRhaWxzIGFyZSBzYXRpc2ZpZWQpIHRoZVxuICogYG9uUmVzcG9uZGVyR3JhbnRgIGRlZmVycmVkIGRpc3BhdGNoZWQgZXZlbnQgaXMgcmV0dXJuZWQgZnJvbVxuICogYGV4dHJhY3RFdmVudHNgLiBUaGUgc2VxdWVuY2Ugb2YgZGlzcGF0Y2ggZXhlY3V0aW9ucyBpbiB0aGlzIGNhc2VcbiAqIHdpbGwgYXBwZWFyIGFzIGZvbGxvd3M6XG4gKlxuICogLSBgc3RhcnRTaG91bGRTZXRSZXNwb25kZXJgIChgUmVzcG9uZGVyRXZlbnRQbHVnaW5gIGRpc3BhdGNoZXMgb24tZGVtYW5kKVxuICogLSBgdG91Y2hTdGFydENhcHR1cmVgICAgICAgIChgRXZlbnRQbHVnaW5IdWJgIGRpc3BhdGNoZXMgYXMgdXN1YWwpXG4gKiAtIGB0b3VjaFN0YXJ0YCAgICAgICAgICAgICAgKGBFdmVudFBsdWdpbkh1YmAgZGlzcGF0Y2hlcyBhcyB1c3VhbClcbiAqIC0gYHJlc3BvbmRlckdyYW50L1JlamVjdGAgICAoYEV2ZW50UGx1Z2luSHViYCBkaXNwYXRjaGVzIGFzIHVzdWFsKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFRhcmdldElEIElEIG9mIGRlZXBlc3QgUmVhY3QgcmVuZGVyZWQgZWxlbWVudC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4geyp9IEFuIGFjY3VtdWxhdGlvbiBvZiBzeW50aGV0aWMgZXZlbnRzLlxuICovXG5mdW5jdGlvbiBzZXRSZXNwb25kZXJBbmRFeHRyYWN0VHJhbnNmZXIodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgdmFyIHNob3VsZFNldEV2ZW50VHlwZSA9IGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSA/IGV2ZW50VHlwZXMuc3RhcnRTaG91bGRTZXRSZXNwb25kZXIgOiBpc01vdmVpc2godG9wTGV2ZWxUeXBlKSA/IGV2ZW50VHlwZXMubW92ZVNob3VsZFNldFJlc3BvbmRlciA6IHRvcExldmVsVHlwZSA9PT0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BTZWxlY3Rpb25DaGFuZ2UgPyBldmVudFR5cGVzLnNlbGVjdGlvbkNoYW5nZVNob3VsZFNldFJlc3BvbmRlciA6IGV2ZW50VHlwZXMuc2Nyb2xsU2hvdWxkU2V0UmVzcG9uZGVyO1xuXG4gIC8vIFRPRE86IHN0b3Agb25lIHNob3J0IG9mIHRoZSB0aGUgY3VycmVudCByZXNwb25kZXIuXG4gIHZhciBidWJibGVTaG91bGRTZXRGcm9tID0gIXJlc3BvbmRlcklEID8gdG9wTGV2ZWxUYXJnZXRJRCA6IFJlYWN0SW5zdGFuY2VIYW5kbGVzLmdldEZpcnN0Q29tbW9uQW5jZXN0b3JJRChyZXNwb25kZXJJRCwgdG9wTGV2ZWxUYXJnZXRJRCk7XG5cbiAgLy8gV2hlbiBjYXB0dXJpbmcvYnViYmxpbmcgdGhlIFwic2hvdWxkU2V0XCIgZXZlbnQsIHdlIHdhbnQgdG8gc2tpcCB0aGUgdGFyZ2V0XG4gIC8vIChkZWVwZXN0IElEKSBpZiBpdCBoYXBwZW5zIHRvIGJlIHRoZSBjdXJyZW50IHJlc3BvbmRlci4gVGhlIHJlYXNvbmluZzpcbiAgLy8gSXQncyBzdHJhbmdlIHRvIGdldCBhbiBgb25Nb3ZlU2hvdWxkU2V0UmVzcG9uZGVyYCB3aGVuIHlvdSdyZSAqYWxyZWFkeSpcbiAgLy8gdGhlIHJlc3BvbmRlci5cbiAgdmFyIHNraXBPdmVyQnViYmxlU2hvdWxkU2V0RnJvbSA9IGJ1YmJsZVNob3VsZFNldEZyb20gPT09IHJlc3BvbmRlcklEO1xuICB2YXIgc2hvdWxkU2V0RXZlbnQgPSBSZXNwb25kZXJTeW50aGV0aWNFdmVudC5nZXRQb29sZWQoc2hvdWxkU2V0RXZlbnRUeXBlLCBidWJibGVTaG91bGRTZXRGcm9tLCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICBzaG91bGRTZXRFdmVudC50b3VjaEhpc3RvcnkgPSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS50b3VjaEhpc3Rvcnk7XG4gIGlmIChza2lwT3ZlckJ1YmJsZVNob3VsZFNldEZyb20pIHtcbiAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXNTa2lwVGFyZ2V0KHNob3VsZFNldEV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXMoc2hvdWxkU2V0RXZlbnQpO1xuICB9XG4gIHZhciB3YW50c1Jlc3BvbmRlcklEID0gZXhlY3V0ZURpc3BhdGNoZXNJbk9yZGVyU3RvcEF0VHJ1ZShzaG91bGRTZXRFdmVudCk7XG4gIGlmICghc2hvdWxkU2V0RXZlbnQuaXNQZXJzaXN0ZW50KCkpIHtcbiAgICBzaG91bGRTZXRFdmVudC5jb25zdHJ1Y3Rvci5yZWxlYXNlKHNob3VsZFNldEV2ZW50KTtcbiAgfVxuXG4gIGlmICghd2FudHNSZXNwb25kZXJJRCB8fCB3YW50c1Jlc3BvbmRlcklEID09PSByZXNwb25kZXJJRCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBleHRyYWN0ZWQ7XG4gIHZhciBncmFudEV2ZW50ID0gUmVzcG9uZGVyU3ludGhldGljRXZlbnQuZ2V0UG9vbGVkKGV2ZW50VHlwZXMucmVzcG9uZGVyR3JhbnQsIHdhbnRzUmVzcG9uZGVySUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG4gIGdyYW50RXZlbnQudG91Y2hIaXN0b3J5ID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUudG91Y2hIaXN0b3J5O1xuXG4gIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZURpcmVjdERpc3BhdGNoZXMoZ3JhbnRFdmVudCk7XG4gIHZhciBibG9ja05hdGl2ZVJlc3BvbmRlciA9IGV4ZWN1dGVEaXJlY3REaXNwYXRjaChncmFudEV2ZW50KSA9PT0gdHJ1ZTtcbiAgaWYgKHJlc3BvbmRlcklEKSB7XG5cbiAgICB2YXIgdGVybWluYXRpb25SZXF1ZXN0RXZlbnQgPSBSZXNwb25kZXJTeW50aGV0aWNFdmVudC5nZXRQb29sZWQoZXZlbnRUeXBlcy5yZXNwb25kZXJUZXJtaW5hdGlvblJlcXVlc3QsIHJlc3BvbmRlcklELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICAgIHRlcm1pbmF0aW9uUmVxdWVzdEV2ZW50LnRvdWNoSGlzdG9yeSA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeTtcbiAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVEaXJlY3REaXNwYXRjaGVzKHRlcm1pbmF0aW9uUmVxdWVzdEV2ZW50KTtcbiAgICB2YXIgc2hvdWxkU3dpdGNoID0gIWhhc0Rpc3BhdGNoZXModGVybWluYXRpb25SZXF1ZXN0RXZlbnQpIHx8IGV4ZWN1dGVEaXJlY3REaXNwYXRjaCh0ZXJtaW5hdGlvblJlcXVlc3RFdmVudCk7XG4gICAgaWYgKCF0ZXJtaW5hdGlvblJlcXVlc3RFdmVudC5pc1BlcnNpc3RlbnQoKSkge1xuICAgICAgdGVybWluYXRpb25SZXF1ZXN0RXZlbnQuY29uc3RydWN0b3IucmVsZWFzZSh0ZXJtaW5hdGlvblJlcXVlc3RFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFN3aXRjaCkge1xuICAgICAgdmFyIHRlcm1pbmF0ZVR5cGUgPSBldmVudFR5cGVzLnJlc3BvbmRlclRlcm1pbmF0ZTtcbiAgICAgIHZhciB0ZXJtaW5hdGVFdmVudCA9IFJlc3BvbmRlclN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZCh0ZXJtaW5hdGVUeXBlLCByZXNwb25kZXJJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICAgIHRlcm1pbmF0ZUV2ZW50LnRvdWNoSGlzdG9yeSA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeTtcbiAgICAgIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZURpcmVjdERpc3BhdGNoZXModGVybWluYXRlRXZlbnQpO1xuICAgICAgZXh0cmFjdGVkID0gYWNjdW11bGF0ZShleHRyYWN0ZWQsIFtncmFudEV2ZW50LCB0ZXJtaW5hdGVFdmVudF0pO1xuICAgICAgY2hhbmdlUmVzcG9uZGVyKHdhbnRzUmVzcG9uZGVySUQsIGJsb2NrTmF0aXZlUmVzcG9uZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlamVjdEV2ZW50ID0gUmVzcG9uZGVyU3ludGhldGljRXZlbnQuZ2V0UG9vbGVkKGV2ZW50VHlwZXMucmVzcG9uZGVyUmVqZWN0LCB3YW50c1Jlc3BvbmRlcklELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICAgICAgcmVqZWN0RXZlbnQudG91Y2hIaXN0b3J5ID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUudG91Y2hIaXN0b3J5O1xuICAgICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlRGlyZWN0RGlzcGF0Y2hlcyhyZWplY3RFdmVudCk7XG4gICAgICBleHRyYWN0ZWQgPSBhY2N1bXVsYXRlKGV4dHJhY3RlZCwgcmVqZWN0RXZlbnQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBleHRyYWN0ZWQgPSBhY2N1bXVsYXRlKGV4dHJhY3RlZCwgZ3JhbnRFdmVudCk7XG4gICAgY2hhbmdlUmVzcG9uZGVyKHdhbnRzUmVzcG9uZGVySUQsIGJsb2NrTmF0aXZlUmVzcG9uZGVyKTtcbiAgfVxuICByZXR1cm4gZXh0cmFjdGVkO1xufVxuXG4vKipcbiAqIEEgdHJhbnNmZXIgaXMgYSBuZWdvdGlhdGlvbiBiZXR3ZWVuIGEgY3VycmVudGx5IHNldCByZXNwb25kZXIgYW5kIHRoZSBuZXh0XG4gKiBlbGVtZW50IHRvIGNsYWltIHJlc3BvbmRlciBzdGF0dXMuIEFueSBzdGFydCBldmVudCBjb3VsZCB0cmlnZ2VyIGEgdHJhbnNmZXJcbiAqIG9mIHJlc3BvbmRlcklELiBBbnkgbW92ZSBldmVudCBjb3VsZCB0cmlnZ2VyIGEgdHJhbnNmZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBhIHRyYW5zZmVyIG9mIHJlc3BvbmRlciBjb3VsZCBwb3NzaWJseSBvY2N1ci5cbiAqL1xuZnVuY3Rpb24gY2FuVHJpZ2dlclRyYW5zZmVyKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQpIHtcbiAgcmV0dXJuIHRvcExldmVsVGFyZ2V0SUQgJiYgKFxuICAvLyByZXNwb25kZXJJZ25vcmVTY3JvbGw6IFdlIGFyZSB0cnlpbmcgdG8gbWlncmF0ZSBhd2F5IGZyb20gc3BlY2lmaWNhbGx5IHRyYWNraW5nIG5hdGl2ZSBzY3JvbGxcbiAgLy8gZXZlbnRzIGhlcmUgYW5kIHJlc3BvbmRlcklnbm9yZVNjcm9sbCBpbmRpY2F0ZXMgd2Ugd2lsbCBzZW5kIHRvcFRvdWNoQ2FuY2VsIHRvIGhhbmRsZVxuICAvLyBjYW5jZWxpbmcgdG91Y2ggZXZlbnRzIGluc3RlYWRcbiAgdG9wTGV2ZWxUeXBlID09PSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzLnRvcFNjcm9sbCAmJiAhbmF0aXZlRXZlbnQucmVzcG9uZGVySWdub3JlU2Nyb2xsIHx8IHRyYWNrZWRUb3VjaENvdW50ID4gMCAmJiB0b3BMZXZlbFR5cGUgPT09IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXMudG9wU2VsZWN0aW9uQ2hhbmdlIHx8IGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSB8fCBpc01vdmVpc2godG9wTGV2ZWxUeXBlKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGlzIHRvdWNoIGVuZCBldmVudCBtYWtlcyBpdCBzdWNoIHRoYXQgdGhlcmUgYXJlIG5vXG4gKiBsb25nZXIgYW55IHRvdWNoZXMgdGhhdCBzdGFydGVkIGluc2lkZSBvZiB0aGUgY3VycmVudCBgcmVzcG9uZGVySURgLlxuICpcbiAqIEBwYXJhbSB7TmF0aXZlRXZlbnR9IG5hdGl2ZUV2ZW50IE5hdGl2ZSB0b3VjaCBlbmQgZXZlbnQuXG4gKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGlzIHRvdWNoIGVuZCBldmVudCBlbmRzIHRoZSByZXNwb25kZXIuXG4gKi9cbmZ1bmN0aW9uIG5vUmVzcG9uZGVyVG91Y2hlcyhuYXRpdmVFdmVudCkge1xuICB2YXIgdG91Y2hlcyA9IG5hdGl2ZUV2ZW50LnRvdWNoZXM7XG4gIGlmICghdG91Y2hlcyB8fCB0b3VjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBhY3RpdmVUb3VjaCA9IHRvdWNoZXNbaV07XG4gICAgdmFyIHRhcmdldCA9IGFjdGl2ZVRvdWNoLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0ICE9PSBudWxsICYmIHRhcmdldCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldCAhPT0gMCkge1xuICAgICAgLy8gSXMgdGhlIG9yaWdpbmFsIHRvdWNoIGxvY2F0aW9uIGluc2lkZSBvZiB0aGUgY3VycmVudCByZXNwb25kZXI/XG4gICAgICB2YXIgaXNBbmNlc3RvciA9IFJlYWN0SW5zdGFuY2VIYW5kbGVzLmlzQW5jZXN0b3JJRE9mKHJlc3BvbmRlcklELCBFdmVudFBsdWdpblV0aWxzLmdldElEKHRhcmdldCkpO1xuICAgICAgaWYgKGlzQW5jZXN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFJlc3BvbmRlckV2ZW50UGx1Z2luID0ge1xuXG4gIGdldFJlc3BvbmRlcklEOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHJlc3BvbmRlcklEO1xuICB9LFxuXG4gIGV2ZW50VHlwZXM6IGV2ZW50VHlwZXMsXG5cbiAgLyoqXG4gICAqIFdlIG11c3QgYmUgcmVzaWxpZW50IHRvIGB0b3BMZXZlbFRhcmdldElEYCBiZWluZyBgdW5kZWZpbmVkYCBvblxuICAgKiBgdG91Y2hNb3ZlYCwgb3IgYHRvdWNoRW5kYC4gT24gY2VydGFpbiBwbGF0Zm9ybXMsIHRoaXMgbWVhbnMgdGhhdCBhIG5hdGl2ZVxuICAgKiBzY3JvbGwgaGFzIGFzc3VtZWQgY29udHJvbCBhbmQgdGhlIG9yaWdpbmFsIHRvdWNoIHRhcmdldHMgYXJlIGRlc3Ryb3llZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICAgKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFRhcmdldElEIElEIG9mIGB0b3BMZXZlbFRhcmdldGAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAgICogQHJldHVybiB7Kn0gQW4gYWNjdW11bGF0aW9uIG9mIHN5bnRoZXRpYyBldmVudHMuXG4gICAqIEBzZWUge0V2ZW50UGx1Z2luSHViLmV4dHJhY3RFdmVudHN9XG4gICAqL1xuICBleHRyYWN0RXZlbnRzOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gICAgaWYgKGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSkge1xuICAgICAgdHJhY2tlZFRvdWNoQ291bnQgKz0gMTtcbiAgICB9IGVsc2UgaWYgKGlzRW5kaXNoKHRvcExldmVsVHlwZSkpIHtcbiAgICAgIHRyYWNrZWRUb3VjaENvdW50IC09IDE7XG4gICAgICAhKHRyYWNrZWRUb3VjaENvdW50ID49IDApID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0VuZGVkIGEgdG91Y2ggZXZlbnQgd2hpY2ggd2FzIG5vdCBjb3VudGVkIGluIHRyYWNrZWRUb3VjaENvdW50LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS5yZWNvcmRUb3VjaFRyYWNrKHRvcExldmVsVHlwZSwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcblxuICAgIHZhciBleHRyYWN0ZWQgPSBjYW5UcmlnZ2VyVHJhbnNmZXIodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCkgPyBzZXRSZXNwb25kZXJBbmRFeHRyYWN0VHJhbnNmZXIodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIDogbnVsbDtcbiAgICAvLyBSZXNwb25kZXIgbWF5IG9yIG1heSBub3QgaGF2ZSB0cmFuc2ZlcmVkIG9uIGEgbmV3IHRvdWNoIHN0YXJ0L21vdmUuXG4gICAgLy8gUmVnYXJkbGVzcywgd2hvZXZlciBpcyB0aGUgcmVzcG9uZGVyIGFmdGVyIGFueSBwb3RlbnRpYWwgdHJhbnNmZXIsIHdlXG4gICAgLy8gZGlyZWN0IGFsbCB0b3VjaCBzdGFydC9tb3ZlL2VuZHMgdG8gdGhlbSBpbiB0aGUgZm9ybSBvZlxuICAgIC8vIGBvblJlc3BvbmRlck1vdmUvU3RhcnQvRW5kYC4gVGhlc2Ugd2lsbCBiZSBjYWxsZWQgZm9yICpldmVyeSogYWRkaXRpb25hbFxuICAgIC8vIGZpbmdlciB0aGF0IG1vdmUvc3RhcnQvZW5kLCBkaXNwYXRjaGVkIGRpcmVjdGx5IHRvIHdob2V2ZXIgaXMgdGhlXG4gICAgLy8gY3VycmVudCByZXNwb25kZXIgYXQgdGhhdCBtb21lbnQsIHVudGlsIHRoZSByZXNwb25kZXIgaXMgXCJyZWxlYXNlZFwiLlxuICAgIC8vXG4gICAgLy8gVGhlc2UgbXVsdGlwbGUgaW5kaXZpZHVhbCBjaGFuZ2UgdG91Y2ggZXZlbnRzIGFyZSBhcmUgYWx3YXlzIGJvb2tlbmRlZFxuICAgIC8vIGJ5IGBvblJlc3BvbmRlckdyYW50YCwgYW5kIG9uZSBvZlxuICAgIC8vIChgb25SZXNwb25kZXJSZWxlYXNlL29uUmVzcG9uZGVyVGVybWluYXRlYCkuXG4gICAgdmFyIGlzUmVzcG9uZGVyVG91Y2hTdGFydCA9IHJlc3BvbmRlcklEICYmIGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKTtcbiAgICB2YXIgaXNSZXNwb25kZXJUb3VjaE1vdmUgPSByZXNwb25kZXJJRCAmJiBpc01vdmVpc2godG9wTGV2ZWxUeXBlKTtcbiAgICB2YXIgaXNSZXNwb25kZXJUb3VjaEVuZCA9IHJlc3BvbmRlcklEICYmIGlzRW5kaXNoKHRvcExldmVsVHlwZSk7XG4gICAgdmFyIGluY3JlbWVudGFsVG91Y2ggPSBpc1Jlc3BvbmRlclRvdWNoU3RhcnQgPyBldmVudFR5cGVzLnJlc3BvbmRlclN0YXJ0IDogaXNSZXNwb25kZXJUb3VjaE1vdmUgPyBldmVudFR5cGVzLnJlc3BvbmRlck1vdmUgOiBpc1Jlc3BvbmRlclRvdWNoRW5kID8gZXZlbnRUeXBlcy5yZXNwb25kZXJFbmQgOiBudWxsO1xuXG4gICAgaWYgKGluY3JlbWVudGFsVG91Y2gpIHtcbiAgICAgIHZhciBnZXN0dXJlID0gUmVzcG9uZGVyU3ludGhldGljRXZlbnQuZ2V0UG9vbGVkKGluY3JlbWVudGFsVG91Y2gsIHJlc3BvbmRlcklELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICAgICAgZ2VzdHVyZS50b3VjaEhpc3RvcnkgPSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS50b3VjaEhpc3Rvcnk7XG4gICAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVEaXJlY3REaXNwYXRjaGVzKGdlc3R1cmUpO1xuICAgICAgZXh0cmFjdGVkID0gYWNjdW11bGF0ZShleHRyYWN0ZWQsIGdlc3R1cmUpO1xuICAgIH1cblxuICAgIHZhciBpc1Jlc3BvbmRlclRlcm1pbmF0ZSA9IHJlc3BvbmRlcklEICYmIHRvcExldmVsVHlwZSA9PT0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BUb3VjaENhbmNlbDtcbiAgICB2YXIgaXNSZXNwb25kZXJSZWxlYXNlID0gcmVzcG9uZGVySUQgJiYgIWlzUmVzcG9uZGVyVGVybWluYXRlICYmIGlzRW5kaXNoKHRvcExldmVsVHlwZSkgJiYgbm9SZXNwb25kZXJUb3VjaGVzKG5hdGl2ZUV2ZW50KTtcbiAgICB2YXIgZmluYWxUb3VjaCA9IGlzUmVzcG9uZGVyVGVybWluYXRlID8gZXZlbnRUeXBlcy5yZXNwb25kZXJUZXJtaW5hdGUgOiBpc1Jlc3BvbmRlclJlbGVhc2UgPyBldmVudFR5cGVzLnJlc3BvbmRlclJlbGVhc2UgOiBudWxsO1xuICAgIGlmIChmaW5hbFRvdWNoKSB7XG4gICAgICB2YXIgZmluYWxFdmVudCA9IFJlc3BvbmRlclN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZChmaW5hbFRvdWNoLCByZXNwb25kZXJJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICAgIGZpbmFsRXZlbnQudG91Y2hIaXN0b3J5ID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmUudG91Y2hIaXN0b3J5O1xuICAgICAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlRGlyZWN0RGlzcGF0Y2hlcyhmaW5hbEV2ZW50KTtcbiAgICAgIGV4dHJhY3RlZCA9IGFjY3VtdWxhdGUoZXh0cmFjdGVkLCBmaW5hbEV2ZW50KTtcbiAgICAgIGNoYW5nZVJlc3BvbmRlcihudWxsKTtcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyQWN0aXZlVG91Y2hlcyA9IFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLnRvdWNoSGlzdG9yeS5udW1iZXJBY3RpdmVUb3VjaGVzO1xuICAgIGlmIChSZXNwb25kZXJFdmVudFBsdWdpbi5HbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXIgJiYgbnVtYmVyQWN0aXZlVG91Y2hlcyAhPT0gcHJldmlvdXNBY3RpdmVUb3VjaGVzKSB7XG4gICAgICBSZXNwb25kZXJFdmVudFBsdWdpbi5HbG9iYWxJbnRlcmFjdGlvbkhhbmRsZXIub25DaGFuZ2UobnVtYmVyQWN0aXZlVG91Y2hlcyk7XG4gICAgfVxuICAgIHByZXZpb3VzQWN0aXZlVG91Y2hlcyA9IG51bWJlckFjdGl2ZVRvdWNoZXM7XG5cbiAgICByZXR1cm4gZXh0cmFjdGVkO1xuICB9LFxuXG4gIEdsb2JhbFJlc3BvbmRlckhhbmRsZXI6IG51bGwsXG4gIEdsb2JhbEludGVyYWN0aW9uSGFuZGxlcjogbnVsbCxcblxuICBpbmplY3Rpb246IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3tvbkNoYW5nZTogKFJlYWN0SUQsIFJlYWN0SUQpID0+IHZvaWR9IEdsb2JhbFJlc3BvbmRlckhhbmRsZXJcbiAgICAgKiBPYmplY3QgdGhhdCBoYW5kbGVzIGFueSBjaGFuZ2UgaW4gcmVzcG9uZGVyLiBVc2UgdGhpcyB0byBpbmplY3RcbiAgICAgKiBpbnRlZ3JhdGlvbiB3aXRoIGFuIGV4aXN0aW5nIHRvdWNoIGhhbmRsaW5nIHN5c3RlbSBldGMuXG4gICAgICovXG4gICAgaW5qZWN0R2xvYmFsUmVzcG9uZGVySGFuZGxlcjogZnVuY3Rpb24gKEdsb2JhbFJlc3BvbmRlckhhbmRsZXIpIHtcbiAgICAgIFJlc3BvbmRlckV2ZW50UGx1Z2luLkdsb2JhbFJlc3BvbmRlckhhbmRsZXIgPSBHbG9iYWxSZXNwb25kZXJIYW5kbGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3tvbkNoYW5nZTogKG51bWJlckFjdGl2ZVRvdWNoZXMpID0+IHZvaWR9IEdsb2JhbEludGVyYWN0aW9uSGFuZGxlclxuICAgICAqIE9iamVjdCB0aGF0IGhhbmRsZXMgYW55IGNoYW5nZSBpbiB0aGUgbnVtYmVyIG9mIGFjdGl2ZSB0b3VjaGVzLlxuICAgICAqL1xuICAgIGluamVjdEdsb2JhbEludGVyYWN0aW9uSGFuZGxlcjogZnVuY3Rpb24gKEdsb2JhbEludGVyYWN0aW9uSGFuZGxlcikge1xuICAgICAgUmVzcG9uZGVyRXZlbnRQbHVnaW4uR2xvYmFsSW50ZXJhY3Rpb25IYW5kbGVyID0gR2xvYmFsSW50ZXJhY3Rpb25IYW5kbGVyO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25kZXJFdmVudFBsdWdpbjsiXX0=