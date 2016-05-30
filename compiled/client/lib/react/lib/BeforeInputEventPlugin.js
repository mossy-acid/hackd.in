/**
 * Copyright 2013-2015 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BeforeInputEventPlugin
 * @typechecks static-only
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var EventConstants = require('./EventConstants');
var EventPropagators = require('./EventPropagators');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var FallbackCompositionState = require('./FallbackCompositionState');
var SyntheticCompositionEvent = require('./SyntheticCompositionEvent');
var SyntheticInputEvent = require('./SyntheticInputEvent');

var keyOf = require('fbjs/lib/keyOf');

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var canUseCompositionEvent = ExecutionEnvironment.canUseDOM && 'CompositionEvent' in window;

var documentMode = null;
if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
}

// Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.
var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.
var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return (typeof opera === 'undefined' ? 'undefined' : _typeof(opera)) === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

var topLevelTypes = EventConstants.topLevelTypes;

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onBeforeInput: null }),
      captured: keyOf({ onBeforeInputCapture: null })
    },
    dependencies: [topLevelTypes.topCompositionEnd, topLevelTypes.topKeyPress, topLevelTypes.topTextInput, topLevelTypes.topPaste]
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCompositionEnd: null }),
      captured: keyOf({ onCompositionEndCapture: null })
    },
    dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionEnd, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCompositionStart: null }),
      captured: keyOf({ onCompositionStartCapture: null })
    },
    dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionStart, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCompositionUpdate: null }),
      captured: keyOf({ onCompositionUpdateCapture: null })
    },
    dependencies: [topLevelTypes.topBlur, topLevelTypes.topCompositionUpdate, topLevelTypes.topKeyDown, topLevelTypes.topKeyPress, topLevelTypes.topKeyUp, topLevelTypes.topMouseDown]
  }
};

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
  // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(nativeEvent.ctrlKey && nativeEvent.altKey);
}

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionStart:
      return eventTypes.compositionStart;
    case topLevelTypes.topCompositionEnd:
      return eventTypes.compositionEnd;
    case topLevelTypes.topCompositionUpdate:
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return topLevelType === topLevelTypes.topKeyDown && nativeEvent.keyCode === START_KEYCODE;
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topKeyUp:
      // Command keys insert or clear IME input.
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
    case topLevelTypes.topKeyDown:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return nativeEvent.keyCode !== START_KEYCODE;
    case topLevelTypes.topKeyPress:
    case topLevelTypes.topMouseDown:
    case topLevelTypes.topBlur:
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */
function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;
  if ((typeof detail === 'undefined' ? 'undefined' : _typeof(detail)) === 'object' && 'data' in detail) {
    return detail.data;
  }
  return null;
}

// Track the current IME composition fallback object, if any.
var currentComposition = null;

/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {DOMEventTarget} topLevelTarget The listening component root node.
 * @param {string} topLevelTargetID ID of `topLevelTarget`.
 * @param {object} nativeEvent Native browser event.
 * @return {?object} A SyntheticCompositionEvent.
 */
function extractCompositionEvent(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!currentComposition) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!currentComposition && eventType === eventTypes.compositionStart) {
      currentComposition = FallbackCompositionState.getPooled(topLevelTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (currentComposition) {
        fallbackData = currentComposition.getData();
      }
    }
  }

  var event = SyntheticCompositionEvent.getPooled(eventType, topLevelTargetID, nativeEvent, nativeEventTarget);

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);
    if (customData !== null) {
      event.data = customData;
    }
  }

  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */
function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionEnd:
      return getDataFromCustomEvent(nativeEvent);
    case topLevelTypes.topKeyPress:
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;
      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case topLevelTypes.topTextInput:
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data;

      // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to blacklist it.
      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}

/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */
function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  if (currentComposition) {
    if (topLevelType === topLevelTypes.topCompositionEnd || isFallbackCompositionEnd(topLevelType, nativeEvent)) {
      var chars = currentComposition.getData();
      FallbackCompositionState.release(currentComposition);
      currentComposition = null;
      return chars;
    }
    return null;
  }

  switch (topLevelType) {
    case topLevelTypes.topPaste:
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;
    case topLevelTypes.topKeyPress:
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
        return String.fromCharCode(nativeEvent.which);
      }
      return null;
    case topLevelTypes.topCompositionEnd:
      return useFallbackCompositionData ? null : nativeEvent.data;
    default:
      return null;
  }
}

/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @param {string} topLevelType Record from `EventConstants`.
 * @param {DOMEventTarget} topLevelTarget The listening component root node.
 * @param {string} topLevelTargetID ID of `topLevelTarget`.
 * @param {object} nativeEvent Native browser event.
 * @return {?object} A SyntheticInputEvent.
 */
function extractBeforeInputEvent(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  }

  // If no characters are being inserted, no BeforeInput event should
  // be fired.
  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, topLevelTargetID, nativeEvent, nativeEventTarget);

  event.data = chars;
  EventPropagators.accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */
var BeforeInputEventPlugin = {

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
    return [extractCompositionEvent(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget)];
  }
};

module.exports = BeforeInputEventPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0JlZm9yZUlucHV0RXZlbnRQbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjtBQUNKLElBQUksdUJBQXVCLFFBQVEsK0JBQVIsQ0FBdkI7QUFDSixJQUFJLDJCQUEyQixRQUFRLDRCQUFSLENBQTNCO0FBQ0osSUFBSSw0QkFBNEIsUUFBUSw2QkFBUixDQUE1QjtBQUNKLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBdEI7O0FBRUosSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBUjs7QUFFSixJQUFJLGVBQWUsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFaLENBQWY7QUFDSixJQUFJLGdCQUFnQixHQUFoQjs7QUFFSixJQUFJLHlCQUF5QixxQkFBcUIsU0FBckIsSUFBa0Msc0JBQXNCLE1BQXRCOztBQUUvRCxJQUFJLGVBQWUsSUFBZjtBQUNKLElBQUkscUJBQXFCLFNBQXJCLElBQWtDLGtCQUFrQixRQUFsQixFQUE0QjtBQUNoRSxpQkFBZSxTQUFTLFlBQVQsQ0FEaUQ7Q0FBbEU7Ozs7O0FBT0EsSUFBSSx1QkFBdUIscUJBQXFCLFNBQXJCLElBQWtDLGVBQWUsTUFBZixJQUF5QixDQUFDLFlBQUQsSUFBaUIsQ0FBQyxVQUFEOzs7OztBQUt2RyxJQUFJLDZCQUE2QixxQkFBcUIsU0FBckIsS0FBbUMsQ0FBQyxzQkFBRCxJQUEyQixnQkFBZ0IsZUFBZSxDQUFmLElBQW9CLGdCQUFnQixFQUFoQixDQUFsRzs7Ozs7O0FBTWpDLFNBQVMsUUFBVCxHQUFvQjtBQUNsQixNQUFJLFFBQVEsT0FBTyxLQUFQLENBRE07QUFFbEIsU0FBTyxRQUFPLHFEQUFQLEtBQWlCLFFBQWpCLElBQTZCLE9BQU8sTUFBTSxPQUFOLEtB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d0MsV0FBeEMsQ0FBUixDQUR3QjtHQUExQixNQUVPO0FBQ0wsWUFBUSw0QkFBNEIsWUFBNUIsRUFBMEMsV0FBMUMsQ0FBUixDQURLO0dBRlA7Ozs7QUFIK0csTUFXM0csQ0FBQyxLQUFELEVBQVE7QUFDVixXQUFPLElBQVAsQ0FEVTtHQUFaOztBQUlBLE1BQUksUUFBUSxvQkFBb0IsU0FBcEIsQ0FBOEIsV0FBVyxXQUFYLEVBQXdCLGdCQUF0RCxFQUF3RSxXQUF4RSxFQUFxRixpQkFBckYsQ0FBUixDQWYyRzs7QUFpQi9HLFFBQU0sSUFBTixHQUFhLEtBQWIsQ0FqQitHO0FBa0IvRyxtQkFBaUIsNEJBQWpCLENBQThDLEtBQTlDLEVBbEIrRztBQW1CL0csU0FBTyxLQUFQLENBbkIrRztDQUFqSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Q0EsSUFBSSx5QkFBeUI7O0FBRTNCLGNBQVksVUFBWjs7Ozs7Ozs7OztBQVVBLGlCQUFlLHVCQUFVLFlBQVYsRUFBd0IsY0FBeEIsRUFBd0MsZ0JBQXhDLEVBQTBELFdBQTFELEVBQXVFLGlCQUF2RSxFQUEwRjtBQUN2RyxXQUFPLENBQUMsd0JBQXdCLFlBQXhCLEVBQXNDLGNBQXRDLEVBQXNELGdCQUF0RCxFQUF3RSxXQUF4RSxFQUFxRixpQkFBckYsQ0FBRCxFQUEwRyx3QkFBd0IsWUFBeEIsRUFBc0MsY0FBdEMsRUFBc0QsZ0JBQXRELEVBQXdFLFdBQXhFLEVBQXFGLGlCQUFyRixDQUExRyxDQUFQLENBRHVHO0dBQTFGO0NBWmI7O0FBaUJKLE9BQU8sT0FBUCxHQUFpQixzQkFBakIiLCJmaWxlIjoiQmVmb3JlSW5wdXRFdmVudFBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEJlZm9yZUlucHV0RXZlbnRQbHVnaW5cbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgRXZlbnRQcm9wYWdhdG9ycyA9IHJlcXVpcmUoJy4vRXZlbnRQcm9wYWdhdG9ycycpO1xudmFyIEV4ZWN1dGlvbkVudmlyb25tZW50ID0gcmVxdWlyZSgnZmJqcy9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnKTtcbnZhciBGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGUgPSByZXF1aXJlKCcuL0ZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZScpO1xudmFyIFN5bnRoZXRpY0NvbXBvc2l0aW9uRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0NvbXBvc2l0aW9uRXZlbnQnKTtcbnZhciBTeW50aGV0aWNJbnB1dEV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNJbnB1dEV2ZW50Jyk7XG5cbnZhciBrZXlPZiA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU9mJyk7XG5cbnZhciBFTkRfS0VZQ09ERVMgPSBbOSwgMTMsIDI3LCAzMl07IC8vIFRhYiwgUmV0dXJuLCBFc2MsIFNwYWNlXG52YXIgU1RBUlRfS0VZQ09ERSA9IDIyOTtcblxudmFyIGNhblVzZUNvbXBvc2l0aW9uRXZlbnQgPSBFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00gJiYgJ0NvbXBvc2l0aW9uRXZlbnQnIGluIHdpbmRvdztcblxudmFyIGRvY3VtZW50TW9kZSA9IG51bGw7XG5pZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NICYmICdkb2N1bWVudE1vZGUnIGluIGRvY3VtZW50KSB7XG4gIGRvY3VtZW50TW9kZSA9IGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbn1cblxuLy8gV2Via2l0IG9mZmVycyBhIHZlcnkgdXNlZnVsIGB0ZXh0SW5wdXRgIGV2ZW50IHRoYXQgY2FuIGJlIHVzZWQgdG9cbi8vIGRpcmVjdGx5IHJlcHJlc2VudCBgYmVmb3JlSW5wdXRgLiBUaGUgSUUgYHRleHRpbnB1dGAgZXZlbnQgaXMgbm90IGFzXG4vLyB1c2VmdWwsIHNvIHdlIGRvbid0IHVzZSBpdC5cbnZhciBjYW5Vc2VUZXh0SW5wdXRFdmVudCA9IEV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSAmJiAnVGV4dEV2ZW50JyBpbiB3aW5kb3cgJiYgIWRvY3VtZW50TW9kZSAmJiAhaXNQcmVzdG8oKTtcblxuLy8gSW4gSUU5Kywgd2UgaGF2ZSBhY2Nlc3MgdG8gY29tcG9zaXRpb24gZXZlbnRzLCBidXQgdGhlIGRhdGEgc3VwcGxpZWRcbi8vIGJ5IHRoZSBuYXRpdmUgY29tcG9zaXRpb25lbmQgZXZlbnQgbWF5IGJlIGluY29ycmVjdC4gSmFwYW5lc2UgaWRlb2dyYXBoaWNcbi8vIHNwYWNlcywgZm9yIGluc3RhbmNlIChcXHUzMDAwKSBhcmUgbm90IHJlY29yZGVkIGNvcnJlY3RseS5cbnZhciB1c2VGYWxsYmFja0NvbXBvc2l0aW9uRGF0YSA9IEV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSAmJiAoIWNhblVzZUNvbXBvc2l0aW9uRXZlbnQgfHwgZG9jdW1lbnRNb2RlICYmIGRvY3VtZW50TW9kZSA+IDggJiYgZG9jdW1lbnRNb2RlIDw9IDExKTtcblxuLyoqXG4gKiBPcGVyYSA8PSAxMiBpbmNsdWRlcyBUZXh0RXZlbnQgaW4gd2luZG93LCBidXQgZG9lcyBub3QgZmlyZVxuICogdGV4dCBpbnB1dCBldmVudHMuIFJlbHkgb24ga2V5cHJlc3MgaW5zdGVhZC5cbiAqL1xuZnVuY3Rpb24gaXNQcmVzdG8oKSB7XG4gIHZhciBvcGVyYSA9IHdpbmRvdy5vcGVyYTtcbiAgcmV0dXJuIHR5cGVvZiBvcGVyYSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9wZXJhLnZlcnNpb24gPT09ICdmdW5jdGlvbicgJiYgcGFyc2VJbnQob3BlcmEudmVyc2lvbigpLCAxMCkgPD0gMTI7XG59XG5cbnZhciBTUEFDRUJBUl9DT0RFID0gMzI7XG52YXIgU1BBQ0VCQVJfQ0hBUiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoU1BBQ0VCQVJfQ09ERSk7XG5cbnZhciB0b3BMZXZlbFR5cGVzID0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcztcblxuLy8gRXZlbnRzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG5hbWVzLlxudmFyIGV2ZW50VHlwZXMgPSB7XG4gIGJlZm9yZUlucHV0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25CZWZvcmVJbnB1dDogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQmVmb3JlSW5wdXRDYXB0dXJlOiBudWxsIH0pXG4gICAgfSxcbiAgICBkZXBlbmRlbmNpZXM6IFt0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uRW5kLCB0b3BMZXZlbFR5cGVzLnRvcEtleVByZXNzLCB0b3BMZXZlbFR5cGVzLnRvcFRleHRJbnB1dCwgdG9wTGV2ZWxUeXBlcy50b3BQYXN0ZV1cbiAgfSxcbiAgY29tcG9zaXRpb25FbmQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkNvbXBvc2l0aW9uRW5kOiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Db21wb3NpdGlvbkVuZENhcHR1cmU6IG51bGwgfSlcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczogW3RvcExldmVsVHlwZXMudG9wQmx1ciwgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvbkVuZCwgdG9wTGV2ZWxUeXBlcy50b3BLZXlEb3duLCB0b3BMZXZlbFR5cGVzLnRvcEtleVByZXNzLCB0b3BMZXZlbFR5cGVzLnRvcEtleVVwLCB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlRG93bl1cbiAgfSxcbiAgY29tcG9zaXRpb25TdGFydDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ29tcG9zaXRpb25TdGFydDogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ29tcG9zaXRpb25TdGFydENhcHR1cmU6IG51bGwgfSlcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczogW3RvcExldmVsVHlwZXMudG9wQmx1ciwgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvblN0YXJ0LCB0b3BMZXZlbFR5cGVzLnRvcEtleURvd24sIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3MsIHRvcExldmVsVHlwZXMudG9wS2V5VXAsIHRvcExldmVsVHlwZXMudG9wTW91c2VEb3duXVxuICB9LFxuICBjb21wb3NpdGlvblVwZGF0ZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ29tcG9zaXRpb25VcGRhdGU6IG51bGwgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkNvbXBvc2l0aW9uVXBkYXRlQ2FwdHVyZTogbnVsbCB9KVxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiBbdG9wTGV2ZWxUeXBlcy50b3BCbHVyLCB0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uVXBkYXRlLCB0b3BMZXZlbFR5cGVzLnRvcEtleURvd24sIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3MsIHRvcExldmVsVHlwZXMudG9wS2V5VXAsIHRvcExldmVsVHlwZXMudG9wTW91c2VEb3duXVxuICB9XG59O1xuXG4vLyBUcmFjayB3aGV0aGVyIHdlJ3ZlIGV2ZXIgaGFuZGxlZCBhIGtleXByZXNzIG9uIHRoZSBzcGFjZSBrZXkuXG52YXIgaGFzU3BhY2VLZXlwcmVzcyA9IGZhbHNlO1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgbmF0aXZlIGtleXByZXNzIGV2ZW50IGlzIGFzc3VtZWQgdG8gYmUgYSBjb21tYW5kLlxuICogVGhpcyBpcyByZXF1aXJlZCBiZWNhdXNlIEZpcmVmb3ggZmlyZXMgYGtleXByZXNzYCBldmVudHMgZm9yIGtleSBjb21tYW5kc1xuICogKGN1dCwgY29weSwgc2VsZWN0LWFsbCwgZXRjLikgZXZlbiB0aG91Z2ggbm8gY2hhcmFjdGVyIGlzIGluc2VydGVkLlxuICovXG5mdW5jdGlvbiBpc0tleXByZXNzQ29tbWFuZChuYXRpdmVFdmVudCkge1xuICByZXR1cm4gKG5hdGl2ZUV2ZW50LmN0cmxLZXkgfHwgbmF0aXZlRXZlbnQuYWx0S2V5IHx8IG5hdGl2ZUV2ZW50Lm1ldGFLZXkpICYmXG4gIC8vIGN0cmxLZXkgJiYgYWx0S2V5IGlzIGVxdWl2YWxlbnQgdG8gQWx0R3IsIGFuZCBpcyBub3QgYSBjb21tYW5kLlxuICAhKG5hdGl2ZUV2ZW50LmN0cmxLZXkgJiYgbmF0aXZlRXZlbnQuYWx0S2V5KTtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgbmF0aXZlIHRvcCBsZXZlbCBldmVudHMgaW50byBldmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvc2l0aW9uRXZlbnRUeXBlKHRvcExldmVsVHlwZSkge1xuICBzd2l0Y2ggKHRvcExldmVsVHlwZSkge1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvblN0YXJ0OlxuICAgICAgcmV0dXJuIGV2ZW50VHlwZXMuY29tcG9zaXRpb25TdGFydDtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25FbmQ6XG4gICAgICByZXR1cm4gZXZlbnRUeXBlcy5jb21wb3NpdGlvbkVuZDtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25VcGRhdGU6XG4gICAgICByZXR1cm4gZXZlbnRUeXBlcy5jb21wb3NpdGlvblVwZGF0ZTtcbiAgfVxufVxuXG4vKipcbiAqIERvZXMgb3VyIGZhbGxiYWNrIGJlc3QtZ3Vlc3MgbW9kZWwgdGhpbmsgdGhpcyBldmVudCBzaWduaWZpZXMgdGhhdFxuICogY29tcG9zaXRpb24gaGFzIGJlZ3VuP1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGYWxsYmFja0NvbXBvc2l0aW9uU3RhcnQodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkge1xuICByZXR1cm4gdG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcEtleURvd24gJiYgbmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gU1RBUlRfS0VZQ09ERTtcbn1cblxuLyoqXG4gKiBEb2VzIG91ciBmYWxsYmFjayBtb2RlIHRoaW5rIHRoYXQgdGhpcyBldmVudCBpcyB0aGUgZW5kIG9mIGNvbXBvc2l0aW9uP1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGYWxsYmFja0NvbXBvc2l0aW9uRW5kKHRvcExldmVsVHlwZSwgbmF0aXZlRXZlbnQpIHtcbiAgc3dpdGNoICh0b3BMZXZlbFR5cGUpIHtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5VXA6XG4gICAgICAvLyBDb21tYW5kIGtleXMgaW5zZXJ0IG9yIGNsZWFyIElNRSBpbnB1dC5cbiAgICAgIHJldHVybiBFTkRfS0VZQ09ERVMuaW5kZXhPZihuYXRpdmVFdmVudC5rZXlDb2RlKSAhPT0gLTE7XG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEtleURvd246XG4gICAgICAvLyBFeHBlY3QgSU1FIGtleUNvZGUgb24gZWFjaCBrZXlkb3duLiBJZiB3ZSBnZXQgYW55IG90aGVyXG4gICAgICAvLyBjb2RlIHdlIG11c3QgaGF2ZSBleGl0ZWQgZWFybGllci5cbiAgICAgIHJldHVybiBuYXRpdmVFdmVudC5rZXlDb2RlICE9PSBTVEFSVF9LRVlDT0RFO1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzczpcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTW91c2VEb3duOlxuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BCbHVyOlxuICAgICAgLy8gRXZlbnRzIGFyZSBub3QgcG9zc2libGUgd2l0aG91dCBjYW5jZWxsaW5nIElNRS5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBHb29nbGUgSW5wdXQgVG9vbHMgcHJvdmlkZXMgY29tcG9zaXRpb24gZGF0YSB2aWEgYSBDdXN0b21FdmVudCxcbiAqIHdpdGggdGhlIGBkYXRhYCBwcm9wZXJ0eSBwb3B1bGF0ZWQgaW4gdGhlIGBkZXRhaWxgIG9iamVjdC4gSWYgdGhpc1xuICogaXMgYXZhaWxhYmxlIG9uIHRoZSBldmVudCBvYmplY3QsIHVzZSBpdC4gSWYgbm90LCB0aGlzIGlzIGEgcGxhaW5cbiAqIGNvbXBvc2l0aW9uIGV2ZW50IGFuZCB3ZSBoYXZlIG5vdGhpbmcgc3BlY2lhbCB0byBleHRyYWN0LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudFxuICogQHJldHVybiB7P3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YUZyb21DdXN0b21FdmVudChuYXRpdmVFdmVudCkge1xuICB2YXIgZGV0YWlsID0gbmF0aXZlRXZlbnQuZGV0YWlsO1xuICBpZiAodHlwZW9mIGRldGFpbCA9PT0gJ29iamVjdCcgJiYgJ2RhdGEnIGluIGRldGFpbCkge1xuICAgIHJldHVybiBkZXRhaWwuZGF0YTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gVHJhY2sgdGhlIGN1cnJlbnQgSU1FIGNvbXBvc2l0aW9uIGZhbGxiYWNrIG9iamVjdCwgaWYgYW55LlxudmFyIGN1cnJlbnRDb21wb3NpdGlvbiA9IG51bGw7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gdG9wTGV2ZWxUYXJnZXQgVGhlIGxpc3RlbmluZyBjb21wb25lbnQgcm9vdCBub2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4gez9vYmplY3R9IEEgU3ludGhldGljQ29tcG9zaXRpb25FdmVudC5cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdENvbXBvc2l0aW9uRXZlbnQodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gIHZhciBldmVudFR5cGU7XG4gIHZhciBmYWxsYmFja0RhdGE7XG5cbiAgaWYgKGNhblVzZUNvbXBvc2l0aW9uRXZlbnQpIHtcbiAgICBldmVudFR5cGUgPSBnZXRDb21wb3NpdGlvbkV2ZW50VHlwZSh0b3BMZXZlbFR5cGUpO1xuICB9IGVsc2UgaWYgKCFjdXJyZW50Q29tcG9zaXRpb24pIHtcbiAgICBpZiAoaXNGYWxsYmFja0NvbXBvc2l0aW9uU3RhcnQodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgIGV2ZW50VHlwZSA9IGV2ZW50VHlwZXMuY29tcG9zaXRpb25TdGFydDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGYWxsYmFja0NvbXBvc2l0aW9uRW5kKHRvcExldmVsVHlwZSwgbmF0aXZlRXZlbnQpKSB7XG4gICAgZXZlbnRUeXBlID0gZXZlbnRUeXBlcy5jb21wb3NpdGlvbkVuZDtcbiAgfVxuXG4gIGlmICghZXZlbnRUeXBlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAodXNlRmFsbGJhY2tDb21wb3NpdGlvbkRhdGEpIHtcbiAgICAvLyBUaGUgY3VycmVudCBjb21wb3NpdGlvbiBpcyBzdG9yZWQgc3RhdGljYWxseSBhbmQgbXVzdCBub3QgYmVcbiAgICAvLyBvdmVyd3JpdHRlbiB3aGlsZSBjb21wb3NpdGlvbiBjb250aW51ZXMuXG4gICAgaWYgKCFjdXJyZW50Q29tcG9zaXRpb24gJiYgZXZlbnRUeXBlID09PSBldmVudFR5cGVzLmNvbXBvc2l0aW9uU3RhcnQpIHtcbiAgICAgIGN1cnJlbnRDb21wb3NpdGlvbiA9IEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZS5nZXRQb29sZWQodG9wTGV2ZWxUYXJnZXQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlID09PSBldmVudFR5cGVzLmNvbXBvc2l0aW9uRW5kKSB7XG4gICAgICBpZiAoY3VycmVudENvbXBvc2l0aW9uKSB7XG4gICAgICAgIGZhbGxiYWNrRGF0YSA9IGN1cnJlbnRDb21wb3NpdGlvbi5nZXREYXRhKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGV2ZW50ID0gU3ludGhldGljQ29tcG9zaXRpb25FdmVudC5nZXRQb29sZWQoZXZlbnRUeXBlLCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuXG4gIGlmIChmYWxsYmFja0RhdGEpIHtcbiAgICAvLyBJbmplY3QgZGF0YSBnZW5lcmF0ZWQgZnJvbSBmYWxsYmFjayBwYXRoIGludG8gdGhlIHN5bnRoZXRpYyBldmVudC5cbiAgICAvLyBUaGlzIG1hdGNoZXMgdGhlIHByb3BlcnR5IG9mIG5hdGl2ZSBDb21wb3NpdGlvbkV2ZW50SW50ZXJmYWNlLlxuICAgIGV2ZW50LmRhdGEgPSBmYWxsYmFja0RhdGE7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1c3RvbURhdGEgPSBnZXREYXRhRnJvbUN1c3RvbUV2ZW50KG5hdGl2ZUV2ZW50KTtcbiAgICBpZiAoY3VzdG9tRGF0YSAhPT0gbnVsbCkge1xuICAgICAgZXZlbnQuZGF0YSA9IGN1c3RvbURhdGE7XG4gICAgfVxuICB9XG5cbiAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlVHdvUGhhc2VEaXNwYXRjaGVzKGV2ZW50KTtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4gez9zdHJpbmd9IFRoZSBzdHJpbmcgY29ycmVzcG9uZGluZyB0byB0aGlzIGBiZWZvcmVJbnB1dGAgZXZlbnQuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZUJlZm9yZUlucHV0Q2hhcnModG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkge1xuICBzd2l0Y2ggKHRvcExldmVsVHlwZSkge1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvbkVuZDpcbiAgICAgIHJldHVybiBnZXREYXRhRnJvbUN1c3RvbUV2ZW50KG5hdGl2ZUV2ZW50KTtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3M6XG4gICAgICAvKipcbiAgICAgICAqIElmIG5hdGl2ZSBgdGV4dElucHV0YCBldmVudHMgYXJlIGF2YWlsYWJsZSwgb3VyIGdvYWwgaXMgdG8gbWFrZVxuICAgICAgICogdXNlIG9mIHRoZW0uIEhvd2V2ZXIsIHRoZXJlIGlzIGEgc3BlY2lhbCBjYXNlOiB0aGUgc3BhY2ViYXIga2V5LlxuICAgICAgICogSW4gV2Via2l0LCBwcmV2ZW50aW5nIGRlZmF1bHQgb24gYSBzcGFjZWJhciBgdGV4dElucHV0YCBldmVudFxuICAgICAgICogY2FuY2VscyBjaGFyYWN0ZXIgaW5zZXJ0aW9uLCBidXQgaXQgKmFsc28qIGNhdXNlcyB0aGUgYnJvd3NlclxuICAgICAgICogdG8gZmFsbCBiYWNrIHRvIGl0cyBkZWZhdWx0IHNwYWNlYmFyIGJlaGF2aW9yIG9mIHNjcm9sbGluZyB0aGVcbiAgICAgICAqIHBhZ2UuXG4gICAgICAgKlxuICAgICAgICogVHJhY2tpbmcgYXQ6XG4gICAgICAgKiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MzU1MTAzXG4gICAgICAgKlxuICAgICAgICogVG8gYXZvaWQgdGhpcyBpc3N1ZSwgdXNlIHRoZSBrZXlwcmVzcyBldmVudCBhcyBpZiBubyBgdGV4dElucHV0YFxuICAgICAgICogZXZlbnQgaXMgYXZhaWxhYmxlLlxuICAgICAgICovXG4gICAgICB2YXIgd2hpY2ggPSBuYXRpdmVFdmVudC53aGljaDtcbiAgICAgIGlmICh3aGljaCAhPT0gU1BBQ0VCQVJfQ09ERSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaGFzU3BhY2VLZXlwcmVzcyA9IHRydWU7XG4gICAgICByZXR1cm4gU1BBQ0VCQVJfQ0hBUjtcblxuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUZXh0SW5wdXQ6XG4gICAgICAvLyBSZWNvcmQgdGhlIGNoYXJhY3RlcnMgdG8gYmUgYWRkZWQgdG8gdGhlIERPTS5cbiAgICAgIHZhciBjaGFycyA9IG5hdGl2ZUV2ZW50LmRhdGE7XG5cbiAgICAgIC8vIElmIGl0J3MgYSBzcGFjZWJhciBjaGFyYWN0ZXIsIGFzc3VtZSB0aGF0IHdlIGhhdmUgYWxyZWFkeSBoYW5kbGVkXG4gICAgICAvLyBpdCBhdCB0aGUga2V5cHJlc3MgbGV2ZWwgYW5kIGJhaWwgaW1tZWRpYXRlbHkuIEFuZHJvaWQgQ2hyb21lXG4gICAgICAvLyBkb2Vzbid0IGdpdmUgdXMga2V5Y29kZXMsIHNvIHdlIG5lZWQgdG8gYmxhY2tsaXN0IGl0LlxuICAgICAgaWYgKGNoYXJzID09PSBTUEFDRUJBUl9DSEFSICYmIGhhc1NwYWNlS2V5cHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGFycztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBGb3Igb3RoZXIgbmF0aXZlIGV2ZW50IHR5cGVzLCBkbyBub3RoaW5nLlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBGb3IgYnJvd3NlcnMgdGhhdCBkbyBub3QgcHJvdmlkZSB0aGUgYHRleHRJbnB1dGAgZXZlbnQsIGV4dHJhY3QgdGhlXG4gKiBhcHByb3ByaWF0ZSBzdHJpbmcgdG8gdXNlIGZvciBTeW50aGV0aWNJbnB1dEV2ZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4gez9zdHJpbmd9IFRoZSBmYWxsYmFjayBzdHJpbmcgZm9yIHRoaXMgYGJlZm9yZUlucHV0YCBldmVudC5cbiAqL1xuZnVuY3Rpb24gZ2V0RmFsbGJhY2tCZWZvcmVJbnB1dENoYXJzKHRvcExldmVsVHlwZSwgbmF0aXZlRXZlbnQpIHtcbiAgLy8gSWYgd2UgYXJlIGN1cnJlbnRseSBjb21wb3NpbmcgKElNRSkgYW5kIHVzaW5nIGEgZmFsbGJhY2sgdG8gZG8gc28sXG4gIC8vIHRyeSB0byBleHRyYWN0IHRoZSBjb21wb3NlZCBjaGFyYWN0ZXJzIGZyb20gdGhlIGZhbGxiYWNrIG9iamVjdC5cbiAgaWYgKGN1cnJlbnRDb21wb3NpdGlvbikge1xuICAgIGlmICh0b3BMZXZlbFR5cGUgPT09IHRvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25FbmQgfHwgaXNGYWxsYmFja0NvbXBvc2l0aW9uRW5kKHRvcExldmVsVHlwZSwgbmF0aXZlRXZlbnQpKSB7XG4gICAgICB2YXIgY2hhcnMgPSBjdXJyZW50Q29tcG9zaXRpb24uZ2V0RGF0YSgpO1xuICAgICAgRmFsbGJhY2tDb21wb3NpdGlvblN0YXRlLnJlbGVhc2UoY3VycmVudENvbXBvc2l0aW9uKTtcbiAgICAgIGN1cnJlbnRDb21wb3NpdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm4gY2hhcnM7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc3dpdGNoICh0b3BMZXZlbFR5cGUpIHtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUGFzdGU6XG4gICAgICAvLyBJZiBhIHBhc3RlIGV2ZW50IG9jY3VycyBhZnRlciBhIGtleXByZXNzLCB0aHJvdyBvdXQgdGhlIGlucHV0XG4gICAgICAvLyBjaGFycy4gUGFzdGUgZXZlbnRzIHNob3VsZCBub3QgbGVhZCB0byBCZWZvcmVJbnB1dCBldmVudHMuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3M6XG4gICAgICAvKipcbiAgICAgICAqIEFzIG9mIHYyNywgRmlyZWZveCBtYXkgZmlyZSBrZXlwcmVzcyBldmVudHMgZXZlbiB3aGVuIG5vIGNoYXJhY3RlclxuICAgICAgICogd2lsbCBiZSBpbnNlcnRlZC4gQSBmZXcgcG9zc2liaWxpdGllczpcbiAgICAgICAqXG4gICAgICAgKiAtIGB3aGljaGAgaXMgYDBgLiBBcnJvdyBrZXlzLCBFc2Mga2V5LCBldGMuXG4gICAgICAgKlxuICAgICAgICogLSBgd2hpY2hgIGlzIHRoZSBwcmVzc2VkIGtleSBjb2RlLCBidXQgbm8gY2hhciBpcyBhdmFpbGFibGUuXG4gICAgICAgKiAgIEV4OiAnQWx0R3IgKyBkYCBpbiBQb2xpc2guIFRoZXJlIGlzIG5vIG1vZGlmaWVkIGNoYXJhY3RlciBmb3JcbiAgICAgICAqICAgdGhpcyBrZXkgY29tYmluYXRpb24gYW5kIG5vIGNoYXJhY3RlciBpcyBpbnNlcnRlZCBpbnRvIHRoZVxuICAgICAgICogICBkb2N1bWVudCwgYnV0IEZGIGZpcmVzIHRoZSBrZXlwcmVzcyBmb3IgY2hhciBjb2RlIGAxMDBgIGFueXdheS5cbiAgICAgICAqICAgTm8gYGlucHV0YCBldmVudCB3aWxsIG9jY3VyLlxuICAgICAgICpcbiAgICAgICAqIC0gYHdoaWNoYCBpcyB0aGUgcHJlc3NlZCBrZXkgY29kZSwgYnV0IGEgY29tbWFuZCBjb21iaW5hdGlvbiBpc1xuICAgICAgICogICBiZWluZyB1c2VkLiBFeDogYENtZCtDYC4gTm8gY2hhcmFjdGVyIGlzIGluc2VydGVkLCBhbmQgbm9cbiAgICAgICAqICAgYGlucHV0YCBldmVudCB3aWxsIG9jY3VyLlxuICAgICAgICovXG4gICAgICBpZiAobmF0aXZlRXZlbnQud2hpY2ggJiYgIWlzS2V5cHJlc3NDb21tYW5kKG5hdGl2ZUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShuYXRpdmVFdmVudC53aGljaCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25FbmQ6XG4gICAgICByZXR1cm4gdXNlRmFsbGJhY2tDb21wb3NpdGlvbkRhdGEgPyBudWxsIDogbmF0aXZlRXZlbnQuZGF0YTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IGEgU3ludGhldGljSW5wdXRFdmVudCBmb3IgYGJlZm9yZUlucHV0YCwgYmFzZWQgb24gZWl0aGVyIG5hdGl2ZVxuICogYHRleHRJbnB1dGAgb3IgZmFsbGJhY2sgYmVoYXZpb3IuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gdG9wTGV2ZWxUYXJnZXQgVGhlIGxpc3RlbmluZyBjb21wb25lbnQgcm9vdCBub2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqIEByZXR1cm4gez9vYmplY3R9IEEgU3ludGhldGljSW5wdXRFdmVudC5cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEJlZm9yZUlucHV0RXZlbnQodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gIHZhciBjaGFycztcblxuICBpZiAoY2FuVXNlVGV4dElucHV0RXZlbnQpIHtcbiAgICBjaGFycyA9IGdldE5hdGl2ZUJlZm9yZUlucHV0Q2hhcnModG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCk7XG4gIH0gZWxzZSB7XG4gICAgY2hhcnMgPSBnZXRGYWxsYmFja0JlZm9yZUlucHV0Q2hhcnModG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCk7XG4gIH1cblxuICAvLyBJZiBubyBjaGFyYWN0ZXJzIGFyZSBiZWluZyBpbnNlcnRlZCwgbm8gQmVmb3JlSW5wdXQgZXZlbnQgc2hvdWxkXG4gIC8vIGJlIGZpcmVkLlxuICBpZiAoIWNoYXJzKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgZXZlbnQgPSBTeW50aGV0aWNJbnB1dEV2ZW50LmdldFBvb2xlZChldmVudFR5cGVzLmJlZm9yZUlucHV0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuXG4gIGV2ZW50LmRhdGEgPSBjaGFycztcbiAgRXZlbnRQcm9wYWdhdG9ycy5hY2N1bXVsYXRlVHdvUGhhc2VEaXNwYXRjaGVzKGV2ZW50KTtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBgb25CZWZvcmVJbnB1dGAgZXZlbnQgdG8gbWF0Y2hcbiAqIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTMvV0QtRE9NLUxldmVsLTMtRXZlbnRzLTIwMTMxMTA1LyNldmVudHMtaW5wdXRldmVudHMuXG4gKlxuICogVGhpcyBldmVudCBwbHVnaW4gaXMgYmFzZWQgb24gdGhlIG5hdGl2ZSBgdGV4dElucHV0YCBldmVudFxuICogYXZhaWxhYmxlIGluIENocm9tZSwgU2FmYXJpLCBPcGVyYSwgYW5kIElFLiBUaGlzIGV2ZW50IGZpcmVzIGFmdGVyXG4gKiBgb25LZXlQcmVzc2AgYW5kIGBvbkNvbXBvc2l0aW9uRW5kYCwgYnV0IGJlZm9yZSBgb25JbnB1dGAuXG4gKlxuICogYGJlZm9yZUlucHV0YCBpcyBzcGVjJ2QgYnV0IG5vdCBpbXBsZW1lbnRlZCBpbiBhbnkgYnJvd3NlcnMsIGFuZFxuICogdGhlIGBpbnB1dGAgZXZlbnQgZG9lcyBub3QgcHJvdmlkZSBhbnkgdXNlZnVsIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgaGFzXG4gKiBhY3R1YWxseSBiZWVuIGFkZGVkLCBjb250cmFyeSB0byB0aGUgc3BlYy4gVGh1cywgYHRleHRJbnB1dGAgaXMgdGhlIGJlc3RcbiAqIGF2YWlsYWJsZSBldmVudCB0byBpZGVudGlmeSB0aGUgY2hhcmFjdGVycyB0aGF0IGhhdmUgYWN0dWFsbHkgYmVlbiBpbnNlcnRlZFxuICogaW50byB0aGUgdGFyZ2V0IG5vZGUuXG4gKlxuICogVGhpcyBwbHVnaW4gaXMgYWxzbyByZXNwb25zaWJsZSBmb3IgZW1pdHRpbmcgYGNvbXBvc2l0aW9uYCBldmVudHMsIHRodXNcbiAqIGFsbG93aW5nIHVzIHRvIHNoYXJlIGNvbXBvc2l0aW9uIGZhbGxiYWNrIGNvZGUgZm9yIGJvdGggYGJlZm9yZUlucHV0YCBhbmRcbiAqIGBjb21wb3NpdGlvbmAgZXZlbnQgdHlwZXMuXG4gKi9cbnZhciBCZWZvcmVJbnB1dEV2ZW50UGx1Z2luID0ge1xuXG4gIGV2ZW50VHlwZXM6IGV2ZW50VHlwZXMsXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGUgUmVjb3JkIGZyb20gYEV2ZW50Q29uc3RhbnRzYC5cbiAgICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gdG9wTGV2ZWxUYXJnZXQgVGhlIGxpc3RlbmluZyBjb21wb25lbnQgcm9vdCBub2RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUYXJnZXRJRCBJRCBvZiBgdG9wTGV2ZWxUYXJnZXRgLlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmF0aXZlRXZlbnQgTmF0aXZlIGJyb3dzZXIgZXZlbnQuXG4gICAqIEByZXR1cm4geyp9IEFuIGFjY3VtdWxhdGlvbiBvZiBzeW50aGV0aWMgZXZlbnRzLlxuICAgKiBAc2VlIHtFdmVudFBsdWdpbkh1Yi5leHRyYWN0RXZlbnRzfVxuICAgKi9cbiAgZXh0cmFjdEV2ZW50czogZnVuY3Rpb24gKHRvcExldmVsVHlwZSwgdG9wTGV2ZWxUYXJnZXQsIHRvcExldmVsVGFyZ2V0SUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCkge1xuICAgIHJldHVybiBbZXh0cmFjdENvbXBvc2l0aW9uRXZlbnQodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSwgZXh0cmFjdEJlZm9yZUlucHV0RXZlbnQodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KV07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVmb3JlSW5wdXRFdmVudFBsdWdpbjsiXX0=