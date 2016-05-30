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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0JlZm9yZUlucHV0RXZlbnRQbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQXJCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksdUJBQXVCLFFBQVEsK0JBQVIsQ0FBM0I7QUFDQSxJQUFJLDJCQUEyQixRQUFRLDRCQUFSLENBQS9CO0FBQ0EsSUFBSSw0QkFBNEIsUUFBUSw2QkFBUixDQUFoQztBQUNBLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBMUI7O0FBRUEsSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBWjs7QUFFQSxJQUFJLGVBQWUsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFaLENBQW5CLEM7QUFDQSxJQUFJLGdCQUFnQixHQUFwQjs7QUFFQSxJQUFJLHlCQUF5QixxQkFBcUIsU0FBckIsSUFBa0Msc0JBQXNCLE1BQXJGOztBQUVBLElBQUksZUFBZSxJQUFuQjtBQUNBLElBQUkscUJBQXFCLFNBQXJCLElBQWtDLGtCQUFrQixRQUF4RCxFQUFrRTtBQUNoRSxpQkFBZSxTQUFTLFlBQXhCO0FBQ0Q7Ozs7O0FBS0QsSUFBSSx1QkFBdUIscUJBQXFCLFNBQXJCLElBQWtDLGVBQWUsTUFBakQsSUFBMkQsQ0FBQyxZQUE1RCxJQUE0RSxDQUFDLFVBQXhHOzs7OztBQUtBLElBQUksNkJBQTZCLHFCQUFxQixTQUFyQixLQUFtQyxDQUFDLHNCQUFELElBQTJCLGdCQUFnQixlQUFlLENBQS9CLElBQW9DLGdCQUFnQixFQUFsSCxDQUFqQzs7Ozs7O0FBTUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCLE1BQUksUUFBUSxPQUFPLEtBQW5CO0FBQ0EsU0FBTyxRQUFPLEtBQVAseUNBQU8sS0FBUCxPQUFpQixRQUFqQixJQUE2QixPQUFPLE1BQU0s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QThDLEtBQTlDO0FBQ0EsU0FBTyxLQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JELElBQUkseUJBQXlCOztBQUUzQixjQUFZLFVBRmU7Ozs7Ozs7Ozs7QUFZM0IsaUJBQWUsdUJBQVUsWUFBVixFQUF3QixjQUF4QixFQUF3QyxnQkFBeEMsRUFBMEQsV0FBMUQsRUFBdUUsaUJBQXZFLEVBQTBGO0FBQ3ZHLFdBQU8sQ0FBQyx3QkFBd0IsWUFBeEIsRUFBc0MsY0FBdEMsRUFBc0QsZ0JBQXRELEVBQXdFLFdBQXhFLEVBQXFGLGlCQUFyRixDQUFELEVBQTBHLHdCQUF3QixZQUF4QixFQUFzQyxjQUF0QyxFQUFzRCxnQkFBdEQsRUFBd0UsV0FBeEUsRUFBcUYsaUJBQXJGLENBQTFHLENBQVA7QUFDRDtBQWQwQixDQUE3Qjs7QUFpQkEsT0FBTyxPQUFQLEdBQWlCLHNCQUFqQiIsImZpbGUiOiJCZWZvcmVJbnB1dEV2ZW50UGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1IEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgQmVmb3JlSW5wdXRFdmVudFBsdWdpblxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRXZlbnRDb25zdGFudHMnKTtcbnZhciBFdmVudFByb3BhZ2F0b3JzID0gcmVxdWlyZSgnLi9FdmVudFByb3BhZ2F0b3JzJyk7XG52YXIgRXhlY3V0aW9uRW52aXJvbm1lbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudCcpO1xudmFyIEZhbGxiYWNrQ29tcG9zaXRpb25TdGF0ZSA9IHJlcXVpcmUoJy4vRmFsbGJhY2tDb21wb3NpdGlvblN0YXRlJyk7XG52YXIgU3ludGhldGljQ29tcG9zaXRpb25FdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljQ29tcG9zaXRpb25FdmVudCcpO1xudmFyIFN5bnRoZXRpY0lucHV0RXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0lucHV0RXZlbnQnKTtcblxudmFyIGtleU9mID0gcmVxdWlyZSgnZmJqcy9saWIva2V5T2YnKTtcblxudmFyIEVORF9LRVlDT0RFUyA9IFs5LCAxMywgMjcsIDMyXTsgLy8gVGFiLCBSZXR1cm4sIEVzYywgU3BhY2VcbnZhciBTVEFSVF9LRVlDT0RFID0gMjI5O1xuXG52YXIgY2FuVXNlQ29tcG9zaXRpb25FdmVudCA9IEV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSAmJiAnQ29tcG9zaXRpb25FdmVudCcgaW4gd2luZG93O1xuXG52YXIgZG9jdW1lbnRNb2RlID0gbnVsbDtcbmlmIChFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00gJiYgJ2RvY3VtZW50TW9kZScgaW4gZG9jdW1lbnQpIHtcbiAgZG9jdW1lbnRNb2RlID0gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xufVxuXG4vLyBXZWJraXQgb2ZmZXJzIGEgdmVyeSB1c2VmdWwgYHRleHRJbnB1dGAgZXZlbnQgdGhhdCBjYW4gYmUgdXNlZCB0b1xuLy8gZGlyZWN0bHkgcmVwcmVzZW50IGBiZWZvcmVJbnB1dGAuIFRoZSBJRSBgdGV4dGlucHV0YCBldmVudCBpcyBub3QgYXNcbi8vIHVzZWZ1bCwgc28gd2UgZG9uJ3QgdXNlIGl0LlxudmFyIGNhblVzZVRleHRJbnB1dEV2ZW50ID0gRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NICYmICdUZXh0RXZlbnQnIGluIHdpbmRvdyAmJiAhZG9jdW1lbnRNb2RlICYmICFpc1ByZXN0bygpO1xuXG4vLyBJbiBJRTkrLCB3ZSBoYXZlIGFjY2VzcyB0byBjb21wb3NpdGlvbiBldmVudHMsIGJ1dCB0aGUgZGF0YSBzdXBwbGllZFxuLy8gYnkgdGhlIG5hdGl2ZSBjb21wb3NpdGlvbmVuZCBldmVudCBtYXkgYmUgaW5jb3JyZWN0LiBKYXBhbmVzZSBpZGVvZ3JhcGhpY1xuLy8gc3BhY2VzLCBmb3IgaW5zdGFuY2UgKFxcdTMwMDApIGFyZSBub3QgcmVjb3JkZWQgY29ycmVjdGx5LlxudmFyIHVzZUZhbGxiYWNrQ29tcG9zaXRpb25EYXRhID0gRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NICYmICghY2FuVXNlQ29tcG9zaXRpb25FdmVudCB8fCBkb2N1bWVudE1vZGUgJiYgZG9jdW1lbnRNb2RlID4gOCAmJiBkb2N1bWVudE1vZGUgPD0gMTEpO1xuXG4vKipcbiAqIE9wZXJhIDw9IDEyIGluY2x1ZGVzIFRleHRFdmVudCBpbiB3aW5kb3csIGJ1dCBkb2VzIG5vdCBmaXJlXG4gKiB0ZXh0IGlucHV0IGV2ZW50cy4gUmVseSBvbiBrZXlwcmVzcyBpbnN0ZWFkLlxuICovXG5mdW5jdGlvbiBpc1ByZXN0bygpIHtcbiAgdmFyIG9wZXJhID0gd2luZG93Lm9wZXJhO1xuICByZXR1cm4gdHlwZW9mIG9wZXJhID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3BlcmEudmVyc2lvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBwYXJzZUludChvcGVyYS52ZXJzaW9uKCksIDEwKSA8PSAxMjtcbn1cblxudmFyIFNQQUNFQkFSX0NPREUgPSAzMjtcbnZhciBTUEFDRUJBUl9DSEFSID0gU3RyaW5nLmZyb21DaGFyQ29kZShTUEFDRUJBUl9DT0RFKTtcblxudmFyIHRvcExldmVsVHlwZXMgPSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzO1xuXG4vLyBFdmVudHMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgbmFtZXMuXG52YXIgZXZlbnRUeXBlcyA9IHtcbiAgYmVmb3JlSW5wdXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkJlZm9yZUlucHV0OiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25CZWZvcmVJbnB1dENhcHR1cmU6IG51bGwgfSlcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczogW3RvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25FbmQsIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3MsIHRvcExldmVsVHlwZXMudG9wVGV4dElucHV0LCB0b3BMZXZlbFR5cGVzLnRvcFBhc3RlXVxuICB9LFxuICBjb21wb3NpdGlvbkVuZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ29tcG9zaXRpb25FbmQ6IG51bGwgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkNvbXBvc2l0aW9uRW5kQ2FwdHVyZTogbnVsbCB9KVxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiBbdG9wTGV2ZWxUeXBlcy50b3BCbHVyLCB0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uRW5kLCB0b3BMZXZlbFR5cGVzLnRvcEtleURvd24sIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3MsIHRvcExldmVsVHlwZXMudG9wS2V5VXAsIHRvcExldmVsVHlwZXMudG9wTW91c2VEb3duXVxuICB9LFxuICBjb21wb3NpdGlvblN0YXJ0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Db21wb3NpdGlvblN0YXJ0OiBudWxsIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Db21wb3NpdGlvblN0YXJ0Q2FwdHVyZTogbnVsbCB9KVxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiBbdG9wTGV2ZWxUeXBlcy50b3BCbHVyLCB0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uU3RhcnQsIHRvcExldmVsVHlwZXMudG9wS2V5RG93biwgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzcywgdG9wTGV2ZWxUeXBlcy50b3BLZXlVcCwgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZURvd25dXG4gIH0sXG4gIGNvbXBvc2l0aW9uVXBkYXRlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Db21wb3NpdGlvblVwZGF0ZTogbnVsbCB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ29tcG9zaXRpb25VcGRhdGVDYXB0dXJlOiBudWxsIH0pXG4gICAgfSxcbiAgICBkZXBlbmRlbmNpZXM6IFt0b3BMZXZlbFR5cGVzLnRvcEJsdXIsIHRvcExldmVsVHlwZXMudG9wQ29tcG9zaXRpb25VcGRhdGUsIHRvcExldmVsVHlwZXMudG9wS2V5RG93biwgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzcywgdG9wTGV2ZWxUeXBlcy50b3BLZXlVcCwgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZURvd25dXG4gIH1cbn07XG5cbi8vIFRyYWNrIHdoZXRoZXIgd2UndmUgZXZlciBoYW5kbGVkIGEga2V5cHJlc3Mgb24gdGhlIHNwYWNlIGtleS5cbnZhciBoYXNTcGFjZUtleXByZXNzID0gZmFsc2U7XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgYSBuYXRpdmUga2V5cHJlc3MgZXZlbnQgaXMgYXNzdW1lZCB0byBiZSBhIGNvbW1hbmQuXG4gKiBUaGlzIGlzIHJlcXVpcmVkIGJlY2F1c2UgRmlyZWZveCBmaXJlcyBga2V5cHJlc3NgIGV2ZW50cyBmb3Iga2V5IGNvbW1hbmRzXG4gKiAoY3V0LCBjb3B5LCBzZWxlY3QtYWxsLCBldGMuKSBldmVuIHRob3VnaCBubyBjaGFyYWN0ZXIgaXMgaW5zZXJ0ZWQuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5cHJlc3NDb21tYW5kKG5hdGl2ZUV2ZW50KSB7XG4gIHJldHVybiAobmF0aXZlRXZlbnQuY3RybEtleSB8fCBuYXRpdmVFdmVudC5hbHRLZXkgfHwgbmF0aXZlRXZlbnQubWV0YUtleSkgJiZcbiAgLy8gY3RybEtleSAmJiBhbHRLZXkgaXMgZXF1aXZhbGVudCB0byBBbHRHciwgYW5kIGlzIG5vdCBhIGNvbW1hbmQuXG4gICEobmF0aXZlRXZlbnQuY3RybEtleSAmJiBuYXRpdmVFdmVudC5hbHRLZXkpO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSBuYXRpdmUgdG9wIGxldmVsIGV2ZW50cyBpbnRvIGV2ZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFR5cGVcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9zaXRpb25FdmVudFR5cGUodG9wTGV2ZWxUeXBlKSB7XG4gIHN3aXRjaCAodG9wTGV2ZWxUeXBlKSB7XG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uU3RhcnQ6XG4gICAgICByZXR1cm4gZXZlbnRUeXBlcy5jb21wb3NpdGlvblN0YXJ0O1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvbkVuZDpcbiAgICAgIHJldHVybiBldmVudFR5cGVzLmNvbXBvc2l0aW9uRW5kO1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvblVwZGF0ZTpcbiAgICAgIHJldHVybiBldmVudFR5cGVzLmNvbXBvc2l0aW9uVXBkYXRlO1xuICB9XG59XG5cbi8qKlxuICogRG9lcyBvdXIgZmFsbGJhY2sgYmVzdC1ndWVzcyBtb2RlbCB0aGluayB0aGlzIGV2ZW50IHNpZ25pZmllcyB0aGF0XG4gKiBjb21wb3NpdGlvbiBoYXMgYmVndW4/XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ZhbGxiYWNrQ29tcG9zaXRpb25TdGFydCh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50KSB7XG4gIHJldHVybiB0b3BMZXZlbFR5cGUgPT09IHRvcExldmVsVHlwZXMudG9wS2V5RG93biAmJiBuYXRpdmVFdmVudC5rZXlDb2RlID09PSBTVEFSVF9LRVlDT0RFO1xufVxuXG4vKipcbiAqIERvZXMgb3VyIGZhbGxiYWNrIG1vZGUgdGhpbmsgdGhhdCB0aGlzIGV2ZW50IGlzIHRoZSBlbmQgb2YgY29tcG9zaXRpb24/XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ZhbGxiYWNrQ29tcG9zaXRpb25FbmQodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkge1xuICBzd2l0Y2ggKHRvcExldmVsVHlwZSkge1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlVcDpcbiAgICAgIC8vIENvbW1hbmQga2V5cyBpbnNlcnQgb3IgY2xlYXIgSU1FIGlucHV0LlxuICAgICAgcmV0dXJuIEVORF9LRVlDT0RFUy5pbmRleE9mKG5hdGl2ZUV2ZW50LmtleUNvZGUpICE9PSAtMTtcbiAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5RG93bjpcbiAgICAgIC8vIEV4cGVjdCBJTUUga2V5Q29kZSBvbiBlYWNoIGtleWRvd24uIElmIHdlIGdldCBhbnkgb3RoZXJcbiAgICAgIC8vIGNvZGUgd2UgbXVzdCBoYXZlIGV4aXRlZCBlYXJsaWVyLlxuICAgICAgcmV0dXJuIG5hdGl2ZUV2ZW50LmtleUNvZGUgIT09IFNUQVJUX0tFWUNPREU7XG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEtleVByZXNzOlxuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZURvd246XG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEJsdXI6XG4gICAgICAvLyBFdmVudHMgYXJlIG5vdCBwb3NzaWJsZSB3aXRob3V0IGNhbmNlbGxpbmcgSU1FLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEdvb2dsZSBJbnB1dCBUb29scyBwcm92aWRlcyBjb21wb3NpdGlvbiBkYXRhIHZpYSBhIEN1c3RvbUV2ZW50LFxuICogd2l0aCB0aGUgYGRhdGFgIHByb3BlcnR5IHBvcHVsYXRlZCBpbiB0aGUgYGRldGFpbGAgb2JqZWN0LiBJZiB0aGlzXG4gKiBpcyBhdmFpbGFibGUgb24gdGhlIGV2ZW50IG9iamVjdCwgdXNlIGl0LiBJZiBub3QsIHRoaXMgaXMgYSBwbGFpblxuICogY29tcG9zaXRpb24gZXZlbnQgYW5kIHdlIGhhdmUgbm90aGluZyBzcGVjaWFsIHRvIGV4dHJhY3QuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50XG4gKiBAcmV0dXJuIHs/c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXREYXRhRnJvbUN1c3RvbUV2ZW50KG5hdGl2ZUV2ZW50KSB7XG4gIHZhciBkZXRhaWwgPSBuYXRpdmVFdmVudC5kZXRhaWw7XG4gIGlmICh0eXBlb2YgZGV0YWlsID09PSAnb2JqZWN0JyAmJiAnZGF0YScgaW4gZGV0YWlsKSB7XG4gICAgcmV0dXJuIGRldGFpbC5kYXRhO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBUcmFjayB0aGUgY3VycmVudCBJTUUgY29tcG9zaXRpb24gZmFsbGJhY2sgb2JqZWN0LCBpZiBhbnkuXG52YXIgY3VycmVudENvbXBvc2l0aW9uID0gbnVsbDtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUYXJnZXRJRCBJRCBvZiBgdG9wTGV2ZWxUYXJnZXRgLlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7P29iamVjdH0gQSBTeW50aGV0aWNDb21wb3NpdGlvbkV2ZW50LlxuICovXG5mdW5jdGlvbiBleHRyYWN0Q29tcG9zaXRpb25FdmVudCh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgdmFyIGV2ZW50VHlwZTtcbiAgdmFyIGZhbGxiYWNrRGF0YTtcblxuICBpZiAoY2FuVXNlQ29tcG9zaXRpb25FdmVudCkge1xuICAgIGV2ZW50VHlwZSA9IGdldENvbXBvc2l0aW9uRXZlbnRUeXBlKHRvcExldmVsVHlwZSk7XG4gIH0gZWxzZSBpZiAoIWN1cnJlbnRDb21wb3NpdGlvbikge1xuICAgIGlmIChpc0ZhbGxiYWNrQ29tcG9zaXRpb25TdGFydCh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50KSkge1xuICAgICAgZXZlbnRUeXBlID0gZXZlbnRUeXBlcy5jb21wb3NpdGlvblN0YXJ0O1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0ZhbGxiYWNrQ29tcG9zaXRpb25FbmQodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkpIHtcbiAgICBldmVudFR5cGUgPSBldmVudFR5cGVzLmNvbXBvc2l0aW9uRW5kO1xuICB9XG5cbiAgaWYgKCFldmVudFR5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICh1c2VGYWxsYmFja0NvbXBvc2l0aW9uRGF0YSkge1xuICAgIC8vIFRoZSBjdXJyZW50IGNvbXBvc2l0aW9uIGlzIHN0b3JlZCBzdGF0aWNhbGx5IGFuZCBtdXN0IG5vdCBiZVxuICAgIC8vIG92ZXJ3cml0dGVuIHdoaWxlIGNvbXBvc2l0aW9uIGNvbnRpbnVlcy5cbiAgICBpZiAoIWN1cnJlbnRDb21wb3NpdGlvbiAmJiBldmVudFR5cGUgPT09IGV2ZW50VHlwZXMuY29tcG9zaXRpb25TdGFydCkge1xuICAgICAgY3VycmVudENvbXBvc2l0aW9uID0gRmFsbGJhY2tDb21wb3NpdGlvblN0YXRlLmdldFBvb2xlZCh0b3BMZXZlbFRhcmdldCk7XG4gICAgfSBlbHNlIGlmIChldmVudFR5cGUgPT09IGV2ZW50VHlwZXMuY29tcG9zaXRpb25FbmQpIHtcbiAgICAgIGlmIChjdXJyZW50Q29tcG9zaXRpb24pIHtcbiAgICAgICAgZmFsbGJhY2tEYXRhID0gY3VycmVudENvbXBvc2l0aW9uLmdldERhdGEoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgZXZlbnQgPSBTeW50aGV0aWNDb21wb3NpdGlvbkV2ZW50LmdldFBvb2xlZChldmVudFR5cGUsIHRvcExldmVsVGFyZ2V0SUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG5cbiAgaWYgKGZhbGxiYWNrRGF0YSkge1xuICAgIC8vIEluamVjdCBkYXRhIGdlbmVyYXRlZCBmcm9tIGZhbGxiYWNrIHBhdGggaW50byB0aGUgc3ludGhldGljIGV2ZW50LlxuICAgIC8vIFRoaXMgbWF0Y2hlcyB0aGUgcHJvcGVydHkgb2YgbmF0aXZlIENvbXBvc2l0aW9uRXZlbnRJbnRlcmZhY2UuXG4gICAgZXZlbnQuZGF0YSA9IGZhbGxiYWNrRGF0YTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VzdG9tRGF0YSA9IGdldERhdGFGcm9tQ3VzdG9tRXZlbnQobmF0aXZlRXZlbnQpO1xuICAgIGlmIChjdXN0b21EYXRhICE9PSBudWxsKSB7XG4gICAgICBldmVudC5kYXRhID0gY3VzdG9tRGF0YTtcbiAgICB9XG4gIH1cblxuICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXMoZXZlbnQpO1xuICByZXR1cm4gZXZlbnQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7P3N0cmluZ30gVGhlIHN0cmluZyBjb3JyZXNwb25kaW5nIHRvIHRoaXMgYGJlZm9yZUlucHV0YCBldmVudC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlQmVmb3JlSW5wdXRDaGFycyh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50KSB7XG4gIHN3aXRjaCAodG9wTGV2ZWxUeXBlKSB7XG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcENvbXBvc2l0aW9uRW5kOlxuICAgICAgcmV0dXJuIGdldERhdGFGcm9tQ3VzdG9tRXZlbnQobmF0aXZlRXZlbnQpO1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzczpcbiAgICAgIC8qKlxuICAgICAgICogSWYgbmF0aXZlIGB0ZXh0SW5wdXRgIGV2ZW50cyBhcmUgYXZhaWxhYmxlLCBvdXIgZ29hbCBpcyB0byBtYWtlXG4gICAgICAgKiB1c2Ugb2YgdGhlbS4gSG93ZXZlciwgdGhlcmUgaXMgYSBzcGVjaWFsIGNhc2U6IHRoZSBzcGFjZWJhciBrZXkuXG4gICAgICAgKiBJbiBXZWJraXQsIHByZXZlbnRpbmcgZGVmYXVsdCBvbiBhIHNwYWNlYmFyIGB0ZXh0SW5wdXRgIGV2ZW50XG4gICAgICAgKiBjYW5jZWxzIGNoYXJhY3RlciBpbnNlcnRpb24sIGJ1dCBpdCAqYWxzbyogY2F1c2VzIHRoZSBicm93c2VyXG4gICAgICAgKiB0byBmYWxsIGJhY2sgdG8gaXRzIGRlZmF1bHQgc3BhY2ViYXIgYmVoYXZpb3Igb2Ygc2Nyb2xsaW5nIHRoZVxuICAgICAgICogcGFnZS5cbiAgICAgICAqXG4gICAgICAgKiBUcmFja2luZyBhdDpcbiAgICAgICAqIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zNTUxMDNcbiAgICAgICAqXG4gICAgICAgKiBUbyBhdm9pZCB0aGlzIGlzc3VlLCB1c2UgdGhlIGtleXByZXNzIGV2ZW50IGFzIGlmIG5vIGB0ZXh0SW5wdXRgXG4gICAgICAgKiBldmVudCBpcyBhdmFpbGFibGUuXG4gICAgICAgKi9cbiAgICAgIHZhciB3aGljaCA9IG5hdGl2ZUV2ZW50LndoaWNoO1xuICAgICAgaWYgKHdoaWNoICE9PSBTUEFDRUJBUl9DT0RFKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBoYXNTcGFjZUtleXByZXNzID0gdHJ1ZTtcbiAgICAgIHJldHVybiBTUEFDRUJBUl9DSEFSO1xuXG4gICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFRleHRJbnB1dDpcbiAgICAgIC8vIFJlY29yZCB0aGUgY2hhcmFjdGVycyB0byBiZSBhZGRlZCB0byB0aGUgRE9NLlxuICAgICAgdmFyIGNoYXJzID0gbmF0aXZlRXZlbnQuZGF0YTtcblxuICAgICAgLy8gSWYgaXQncyBhIHNwYWNlYmFyIGNoYXJhY3RlciwgYXNzdW1lIHRoYXQgd2UgaGF2ZSBhbHJlYWR5IGhhbmRsZWRcbiAgICAgIC8vIGl0IGF0IHRoZSBrZXlwcmVzcyBsZXZlbCBhbmQgYmFpbCBpbW1lZGlhdGVseS4gQW5kcm9pZCBDaHJvbWVcbiAgICAgIC8vIGRvZXNuJ3QgZ2l2ZSB1cyBrZXljb2Rlcywgc28gd2UgbmVlZCB0byBibGFja2xpc3QgaXQuXG4gICAgICBpZiAoY2hhcnMgPT09IFNQQUNFQkFSX0NIQVIgJiYgaGFzU3BhY2VLZXlwcmVzcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNoYXJzO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIEZvciBvdGhlciBuYXRpdmUgZXZlbnQgdHlwZXMsIGRvIG5vdGhpbmcuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEZvciBicm93c2VycyB0aGF0IGRvIG5vdCBwcm92aWRlIHRoZSBgdGV4dElucHV0YCBldmVudCwgZXh0cmFjdCB0aGVcbiAqIGFwcHJvcHJpYXRlIHN0cmluZyB0byB1c2UgZm9yIFN5bnRoZXRpY0lucHV0RXZlbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7P3N0cmluZ30gVGhlIGZhbGxiYWNrIHN0cmluZyBmb3IgdGhpcyBgYmVmb3JlSW5wdXRgIGV2ZW50LlxuICovXG5mdW5jdGlvbiBnZXRGYWxsYmFja0JlZm9yZUlucHV0Q2hhcnModG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkge1xuICAvLyBJZiB3ZSBhcmUgY3VycmVudGx5IGNvbXBvc2luZyAoSU1FKSBhbmQgdXNpbmcgYSBmYWxsYmFjayB0byBkbyBzbyxcbiAgLy8gdHJ5IHRvIGV4dHJhY3QgdGhlIGNvbXBvc2VkIGNoYXJhY3RlcnMgZnJvbSB0aGUgZmFsbGJhY2sgb2JqZWN0LlxuICBpZiAoY3VycmVudENvbXBvc2l0aW9uKSB7XG4gICAgaWYgKHRvcExldmVsVHlwZSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvbkVuZCB8fCBpc0ZhbGxiYWNrQ29tcG9zaXRpb25FbmQodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkpIHtcbiAgICAgIHZhciBjaGFycyA9IGN1cnJlbnRDb21wb3NpdGlvbi5nZXREYXRhKCk7XG4gICAgICBGYWxsYmFja0NvbXBvc2l0aW9uU3RhdGUucmVsZWFzZShjdXJyZW50Q29tcG9zaXRpb24pO1xuICAgICAgY3VycmVudENvbXBvc2l0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybiBjaGFycztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzd2l0Y2ggKHRvcExldmVsVHlwZSkge1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BQYXN0ZTpcbiAgICAgIC8vIElmIGEgcGFzdGUgZXZlbnQgb2NjdXJzIGFmdGVyIGEga2V5cHJlc3MsIHRocm93IG91dCB0aGUgaW5wdXRcbiAgICAgIC8vIGNoYXJzLiBQYXN0ZSBldmVudHMgc2hvdWxkIG5vdCBsZWFkIHRvIEJlZm9yZUlucHV0IGV2ZW50cy5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzczpcbiAgICAgIC8qKlxuICAgICAgICogQXMgb2YgdjI3LCBGaXJlZm94IG1heSBmaXJlIGtleXByZXNzIGV2ZW50cyBldmVuIHdoZW4gbm8gY2hhcmFjdGVyXG4gICAgICAgKiB3aWxsIGJlIGluc2VydGVkLiBBIGZldyBwb3NzaWJpbGl0aWVzOlxuICAgICAgICpcbiAgICAgICAqIC0gYHdoaWNoYCBpcyBgMGAuIEFycm93IGtleXMsIEVzYyBrZXksIGV0Yy5cbiAgICAgICAqXG4gICAgICAgKiAtIGB3aGljaGAgaXMgdGhlIHByZXNzZWQga2V5IGNvZGUsIGJ1dCBubyBjaGFyIGlzIGF2YWlsYWJsZS5cbiAgICAgICAqICAgRXg6ICdBbHRHciArIGRgIGluIFBvbGlzaC4gVGhlcmUgaXMgbm8gbW9kaWZpZWQgY2hhcmFjdGVyIGZvclxuICAgICAgICogICB0aGlzIGtleSBjb21iaW5hdGlvbiBhbmQgbm8gY2hhcmFjdGVyIGlzIGluc2VydGVkIGludG8gdGhlXG4gICAgICAgKiAgIGRvY3VtZW50LCBidXQgRkYgZmlyZXMgdGhlIGtleXByZXNzIGZvciBjaGFyIGNvZGUgYDEwMGAgYW55d2F5LlxuICAgICAgICogICBObyBgaW5wdXRgIGV2ZW50IHdpbGwgb2NjdXIuXG4gICAgICAgKlxuICAgICAgICogLSBgd2hpY2hgIGlzIHRoZSBwcmVzc2VkIGtleSBjb2RlLCBidXQgYSBjb21tYW5kIGNvbWJpbmF0aW9uIGlzXG4gICAgICAgKiAgIGJlaW5nIHVzZWQuIEV4OiBgQ21kK0NgLiBObyBjaGFyYWN0ZXIgaXMgaW5zZXJ0ZWQsIGFuZCBub1xuICAgICAgICogICBgaW5wdXRgIGV2ZW50IHdpbGwgb2NjdXIuXG4gICAgICAgKi9cbiAgICAgIGlmIChuYXRpdmVFdmVudC53aGljaCAmJiAhaXNLZXlwcmVzc0NvbW1hbmQobmF0aXZlRXZlbnQpKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKG5hdGl2ZUV2ZW50LndoaWNoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb21wb3NpdGlvbkVuZDpcbiAgICAgIHJldHVybiB1c2VGYWxsYmFja0NvbXBvc2l0aW9uRGF0YSA/IG51bGwgOiBuYXRpdmVFdmVudC5kYXRhO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgYSBTeW50aGV0aWNJbnB1dEV2ZW50IGZvciBgYmVmb3JlSW5wdXRgLCBiYXNlZCBvbiBlaXRoZXIgbmF0aXZlXG4gKiBgdGV4dElucHV0YCBvciBmYWxsYmFjayBiZWhhdmlvci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUYXJnZXRJRCBJRCBvZiBgdG9wTGV2ZWxUYXJnZXRgLlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQHJldHVybiB7P29iamVjdH0gQSBTeW50aGV0aWNJbnB1dEV2ZW50LlxuICovXG5mdW5jdGlvbiBleHRyYWN0QmVmb3JlSW5wdXRFdmVudCh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgdmFyIGNoYXJzO1xuXG4gIGlmIChjYW5Vc2VUZXh0SW5wdXRFdmVudCkge1xuICAgIGNoYXJzID0gZ2V0TmF0aXZlQmVmb3JlSW5wdXRDaGFycyh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBjaGFycyA9IGdldEZhbGxiYWNrQmVmb3JlSW5wdXRDaGFycyh0b3BMZXZlbFR5cGUsIG5hdGl2ZUV2ZW50KTtcbiAgfVxuXG4gIC8vIElmIG5vIGNoYXJhY3RlcnMgYXJlIGJlaW5nIGluc2VydGVkLCBubyBCZWZvcmVJbnB1dCBldmVudCBzaG91bGRcbiAgLy8gYmUgZmlyZWQuXG4gIGlmICghY2hhcnMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBldmVudCA9IFN5bnRoZXRpY0lucHV0RXZlbnQuZ2V0UG9vbGVkKGV2ZW50VHlwZXMuYmVmb3JlSW5wdXQsIHRvcExldmVsVGFyZ2V0SUQsIG5hdGl2ZUV2ZW50LCBuYXRpdmVFdmVudFRhcmdldCk7XG5cbiAgZXZlbnQuZGF0YSA9IGNoYXJzO1xuICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXMoZXZlbnQpO1xuICByZXR1cm4gZXZlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIGBvbkJlZm9yZUlucHV0YCBldmVudCB0byBtYXRjaFxuICogaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMy9XRC1ET00tTGV2ZWwtMy1FdmVudHMtMjAxMzExMDUvI2V2ZW50cy1pbnB1dGV2ZW50cy5cbiAqXG4gKiBUaGlzIGV2ZW50IHBsdWdpbiBpcyBiYXNlZCBvbiB0aGUgbmF0aXZlIGB0ZXh0SW5wdXRgIGV2ZW50XG4gKiBhdmFpbGFibGUgaW4gQ2hyb21lLCBTYWZhcmksIE9wZXJhLCBhbmQgSUUuIFRoaXMgZXZlbnQgZmlyZXMgYWZ0ZXJcbiAqIGBvbktleVByZXNzYCBhbmQgYG9uQ29tcG9zaXRpb25FbmRgLCBidXQgYmVmb3JlIGBvbklucHV0YC5cbiAqXG4gKiBgYmVmb3JlSW5wdXRgIGlzIHNwZWMnZCBidXQgbm90IGltcGxlbWVudGVkIGluIGFueSBicm93c2VycywgYW5kXG4gKiB0aGUgYGlucHV0YCBldmVudCBkb2VzIG5vdCBwcm92aWRlIGFueSB1c2VmdWwgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBoYXNcbiAqIGFjdHVhbGx5IGJlZW4gYWRkZWQsIGNvbnRyYXJ5IHRvIHRoZSBzcGVjLiBUaHVzLCBgdGV4dElucHV0YCBpcyB0aGUgYmVzdFxuICogYXZhaWxhYmxlIGV2ZW50IHRvIGlkZW50aWZ5IHRoZSBjaGFyYWN0ZXJzIHRoYXQgaGF2ZSBhY3R1YWxseSBiZWVuIGluc2VydGVkXG4gKiBpbnRvIHRoZSB0YXJnZXQgbm9kZS5cbiAqXG4gKiBUaGlzIHBsdWdpbiBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBlbWl0dGluZyBgY29tcG9zaXRpb25gIGV2ZW50cywgdGh1c1xuICogYWxsb3dpbmcgdXMgdG8gc2hhcmUgY29tcG9zaXRpb24gZmFsbGJhY2sgY29kZSBmb3IgYm90aCBgYmVmb3JlSW5wdXRgIGFuZFxuICogYGNvbXBvc2l0aW9uYCBldmVudCB0eXBlcy5cbiAqL1xudmFyIEJlZm9yZUlucHV0RXZlbnRQbHVnaW4gPSB7XG5cbiAgZXZlbnRUeXBlczogZXZlbnRUeXBlcyxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICAgKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFRhcmdldElEIElEIG9mIGB0b3BMZXZlbFRhcmdldGAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAgICogQHJldHVybiB7Kn0gQW4gYWNjdW11bGF0aW9uIG9mIHN5bnRoZXRpYyBldmVudHMuXG4gICAqIEBzZWUge0V2ZW50UGx1Z2luSHViLmV4dHJhY3RFdmVudHN9XG4gICAqL1xuICBleHRyYWN0RXZlbnRzOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gICAgcmV0dXJuIFtleHRyYWN0Q29tcG9zaXRpb25FdmVudCh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpLCBleHRyYWN0QmVmb3JlSW5wdXRFdmVudCh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpXTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWZvcmVJbnB1dEV2ZW50UGx1Z2luOyJdfQ==