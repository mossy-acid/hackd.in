/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SimpleEventPlugin
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventListener = require('fbjs/lib/EventListener');
var EventPropagators = require('./EventPropagators');
var ReactMount = require('./ReactMount');
var SyntheticClipboardEvent = require('./SyntheticClipboardEvent');
var SyntheticEvent = require('./SyntheticEvent');
var SyntheticFocusEvent = require('./SyntheticFocusEvent');
var SyntheticKeyboardEvent = require('./SyntheticKeyboardEvent');
var SyntheticMouseEvent = require('./SyntheticMouseEvent');
var SyntheticDragEvent = require('./SyntheticDragEvent');
var SyntheticTouchEvent = require('./SyntheticTouchEvent');
var SyntheticUIEvent = require('./SyntheticUIEvent');
var SyntheticWheelEvent = require('./SyntheticWheelEvent');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getEventCharCode = require('./getEventCharCode');
var invariant = require('fbjs/lib/invariant');
var keyOf = require('fbjs/lib/keyOf');

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  abort: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onAbort: true }),
      captured: keyOf({ onAbortCapture: true })
    }
  },
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onBlur: true }),
      captured: keyOf({ onBlurCapture: true })
    }
  },
  canPlay: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCanPlay: true }),
      captured: keyOf({ onCanPlayCapture: true })
    }
  },
  canPlayThrough: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCanPlayThrough: true }),
      captured: keyOf({ onCanPlayThroughCapture: true })
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onClick: true }),
      captured: keyOf({ onClickCapture: true })
    }
  },
  contextMenu: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onContextMenu: true }),
      captured: keyOf({ onContextMenuCapture: true })
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCopy: true }),
      captured: keyOf({ onCopyCapture: true })
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onCut: true }),
      captured: keyOf({ onCutCapture: true })
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDoubleClick: true }),
      captured: keyOf({ onDoubleClickCapture: true })
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDrag: true }),
      captured: keyOf({ onDragCapture: true })
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragEnd: true }),
      captured: keyOf({ onDragEndCapture: true })
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragEnter: true }),
      captured: keyOf({ onDragEnterCapture: true })
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragExit: true }),
      captured: keyOf({ onDragExitCapture: true })
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragLeave: true }),
      captured: keyOf({ onDragLeaveCapture: true })
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragOver: true }),
      captured: keyOf({ onDragOverCapture: true })
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDragStart: true }),
      captured: keyOf({ onDragStartCapture: true })
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDrop: true }),
      captured: keyOf({ onDropCapture: true })
    }
  },
  durationChange: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onDurationChange: true }),
      captured: keyOf({ onDurationChangeCapture: true })
    }
  },
  emptied: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onEmptied: true }),
      captured: keyOf({ onEmptiedCapture: true })
    }
  },
  encrypted: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onEncrypted: true }),
      captured: keyOf({ onEncryptedCapture: true })
    }
  },
  ended: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onEnded: true }),
      captured: keyOf({ onEndedCapture: true })
    }
  },
  error: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onError: true }),
      captured: keyOf({ onErrorCapture: true })
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onFocus: true }),
      captured: keyOf({ onFocusCapture: true })
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onInput: true }),
      captured: keyOf({ onInputCapture: true })
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onKeyDown: true }),
      captured: keyOf({ onKeyDownCapture: true })
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onKeyPress: true }),
      captured: keyOf({ onKeyPressCapture: true })
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onKeyUp: true }),
      captured: keyOf({ onKeyUpCapture: true })
    }
  },
  load: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onLoad: true }),
      captured: keyOf({ onLoadCapture: true })
    }
  },
  loadedData: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onLoadedData: true }),
      captured: keyOf({ onLoadedDataCapture: true })
    }
  },
  loadedMetadata: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onLoadedMetadata: true }),
      captured: keyOf({ onLoadedMetadataCapture: true })
    }
  },
  loadStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onLoadStart: true }),
      captured: keyOf({ onLoadStartCapture: true })
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMouseDown: true }),
      captured: keyOf({ onMouseDownCapture: true })
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMouseMove: true }),
      captured: keyOf({ onMouseMoveCapture: true })
    }
  },
  mouseOut: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMouseOut: true }),
      captured: keyOf({ onMouseOutCapture: true })
    }
  },
  mouseOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMouseOver: true }),
      captured: keyOf({ onMouseOverCapture: true })
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onMouseUp: true }),
      captured: keyOf({ onMouseUpCapture: true })
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onPaste: true }),
      captured: keyOf({ onPasteCapture: true })
    }
  },
  pause: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onPause: true }),
      captured: keyOf({ onPauseCapture: true })
    }
  },
  play: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onPlay: true }),
      captured: keyOf({ onPlayCapture: true })
    }
  },
  playing: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onPlaying: true }),
      captured: keyOf({ onPlayingCapture: true })
    }
  },
  progress: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onProgress: true }),
      captured: keyOf({ onProgressCapture: true })
    }
  },
  rateChange: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onRateChange: true }),
      captured: keyOf({ onRateChangeCapture: true })
    }
  },
  reset: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onReset: true }),
      captured: keyOf({ onResetCapture: true })
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onScroll: true }),
      captured: keyOf({ onScrollCapture: true })
    }
  },
  seeked: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onSeeked: true }),
      captured: keyOf({ onSeekedCapture: true })
    }
  },
  seeking: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onSeeking: true }),
      captured: keyOf({ onSeekingCapture: true })
    }
  },
  stalled: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onStalled: true }),
      captured: keyOf({ onStalledCapture: true })
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onSubmit: true }),
      captured: keyOf({ onSubmitCapture: true })
    }
  },
  suspend: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onSuspend: true }),
      captured: keyOf({ onSuspendCapture: true })
    }
  },
  timeUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTimeUpdate: true }),
      captured: keyOf({ onTimeUpdateCapture: true })
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTouchCancel: true }),
      captured: keyOf({ onTouchCancelCapture: true })
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTouchEnd: true }),
      captured: keyOf({ onTouchEndCapture: true })
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTouchMove: true }),
      captured: keyOf({ onTouchMoveCapture: true })
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onTouchStart: true }),
      captured: keyOf({ onTouchStartCapture: true })
    }
  },
  volumeChange: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onVolumeChange: true }),
      captured: keyOf({ onVolumeChangeCapture: true })
    }
  },
  waiting: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onWaiting: true }),
      captured: keyOf({ onWaitingCapture: true })
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({ onWheel: true }),
      captured: keyOf({ onWheelCapture: true })
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topAbort: eventTypes.abort,
  topBlur: eventTypes.blur,
  topCanPlay: eventTypes.canPlay,
  topCanPlayThrough: eventTypes.canPlayThrough,
  topClick: eventTypes.click,
  topContextMenu: eventTypes.contextMenu,
  topCopy: eventTypes.copy,
  topCut: eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag: eventTypes.drag,
  topDragEnd: eventTypes.dragEnd,
  topDragEnter: eventTypes.dragEnter,
  topDragExit: eventTypes.dragExit,
  topDragLeave: eventTypes.dragLeave,
  topDragOver: eventTypes.dragOver,
  topDragStart: eventTypes.dragStart,
  topDrop: eventTypes.drop,
  topDurationChange: eventTypes.durationChange,
  topEmptied: eventTypes.emptied,
  topEncrypted: eventTypes.encrypted,
  topEnded: eventTypes.ended,
  topError: eventTypes.error,
  topFocus: eventTypes.focus,
  topInput: eventTypes.input,
  topKeyDown: eventTypes.keyDown,
  topKeyPress: eventTypes.keyPress,
  topKeyUp: eventTypes.keyUp,
  topLoad: eventTypes.load,
  topLoadedData: eventTypes.loadedData,
  topLoadedMetadata: eventTypes.loadedMetadata,
  topLoadStart: eventTypes.loadStart,
  topMouseDown: eventTypes.mouseDown,
  topMouseMove: eventTypes.mouseMove,
  topMouseOut: eventTypes.mouseOut,
  topMouseOver: eventTypes.mouseOver,
  topMouseUp: eventTypes.mouseUp,
  topPaste: eventTypes.paste,
  topPause: eventTypes.pause,
  topPlay: eventTypes.play,
  topPlaying: eventTypes.playing,
  topProgress: eventTypes.progress,
  topRateChange: eventTypes.rateChange,
  topReset: eventTypes.reset,
  topScroll: eventTypes.scroll,
  topSeeked: eventTypes.seeked,
  topSeeking: eventTypes.seeking,
  topStalled: eventTypes.stalled,
  topSubmit: eventTypes.submit,
  topSuspend: eventTypes.suspend,
  topTimeUpdate: eventTypes.timeUpdate,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd: eventTypes.touchEnd,
  topTouchMove: eventTypes.touchMove,
  topTouchStart: eventTypes.touchStart,
  topVolumeChange: eventTypes.volumeChange,
  topWaiting: eventTypes.waiting,
  topWheel: eventTypes.wheel
};

for (var type in topLevelEventsToDispatchConfig) {
  topLevelEventsToDispatchConfig[type].dependencies = [type];
}

var ON_CLICK_KEY = keyOf({ onClick: null });
var onClickListeners = {};

var SimpleEventPlugin = {

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
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case topLevelTypes.topAbort:
      case topLevelTypes.topCanPlay:
      case topLevelTypes.topCanPlayThrough:
      case topLevelTypes.topDurationChange:
      case topLevelTypes.topEmptied:
      case topLevelTypes.topEncrypted:
      case topLevelTypes.topEnded:
      case topLevelTypes.topError:
      case topLevelTypes.topInput:
      case topLevelTypes.topLoad:
      case topLevelTypes.topLoadedData:
      case topLevelTypes.topLoadedMetadata:
      case topLevelTypes.topLoadStart:
      case topLevelTypes.topPause:
      case topLevelTypes.topPlay:
      case topLevelTypes.topPlaying:
      case topLevelTypes.topProgress:
      case topLevelTypes.topRateChange:
      case topLevelTypes.topReset:
      case topLevelTypes.topSeeked:
      case topLevelTypes.topSeeking:
      case topLevelTypes.topStalled:
      case topLevelTypes.topSubmit:
      case topLevelTypes.topSuspend:
      case topLevelTypes.topTimeUpdate:
      case topLevelTypes.topVolumeChange:
      case topLevelTypes.topWaiting:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyPress:
        // FireFox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
      /* falls through */
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
      /* falls through */
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseOut:
      case topLevelTypes.topMouseOver:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
        EventConstructor = SyntheticDragEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    !EventConstructor ? process.env.NODE_ENV !== 'production' ? invariant(false, 'SimpleEventPlugin: Unhandled event type, `%s`.', topLevelType) : invariant(false) : undefined;
    var event = EventConstructor.getPooled(dispatchConfig, topLevelTargetID, nativeEvent, nativeEventTarget);
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  },

  didPutListener: function didPutListener(id, registrationName, listener) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    if (registrationName === ON_CLICK_KEY) {
      var node = ReactMount.getNode(id);
      if (!onClickListeners[id]) {
        onClickListeners[id] = EventListener.listen(node, 'click', emptyFunction);
      }
    }
  },

  willDeleteListener: function willDeleteListener(id, registrationName) {
    if (registrationName === ON_CLICK_KEY) {
      onClickListeners[id].remove();
      delete onClickListeners[id];
    }
  }

};

module.exports = SimpleEventPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1NpbXBsZUV2ZW50UGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjtBQUNBLElBQUksZ0JBQWdCLFFBQVEsd0JBQVIsQ0FBcEI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFqQjtBQUNBLElBQUksMEJBQTBCLFFBQVEsMkJBQVIsQ0FBOUI7QUFDQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQXJCO0FBQ0EsSUFBSSxzQkFBc0IsUUFBUSx1QkFBUixDQUExQjtBQUNBLElBQUkseUJBQXlCLFFBQVEsMEJBQVIsQ0FBN0I7QUFDQSxJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQTFCO0FBQ0EsSUFBSSxxQkFBcUIsUUFBUSxzQkFBUixDQUF6QjtBQUNBLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBMUI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxzQkFBc0IsUUFBUSx1QkFBUixDQUExQjs7QUFFQSxJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQXBCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBWjs7QUFFQSxJQUFJLGdCQUFnQixlQUFlLGFBQW5DOztBQUVBLElBQUksYUFBYTtBQUNmLFNBQU87QUFDTCw2QkFBeUI7QUFDdkIsZUFBUyxNQUFNLEVBQUUsU0FBUyxJQUFYLEVBQU4sQ0FEYztBQUV2QixnQkFBVSxNQUFNLEVBQUUsZ0JBQWdCLElBQWxCLEVBQU47QUFGYTtBQURwQixHQURRO0FBT2YsUUFBTTtBQUNKLDZCQUF5QjtBQUN2QixlQUFTLE1BQU0sRUFB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b3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgU2ltcGxlRXZlbnRQbHVnaW5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRXZlbnRDb25zdGFudHMnKTtcbnZhciBFdmVudExpc3RlbmVyID0gcmVxdWlyZSgnZmJqcy9saWIvRXZlbnRMaXN0ZW5lcicpO1xudmFyIEV2ZW50UHJvcGFnYXRvcnMgPSByZXF1aXJlKCcuL0V2ZW50UHJvcGFnYXRvcnMnKTtcbnZhciBSZWFjdE1vdW50ID0gcmVxdWlyZSgnLi9SZWFjdE1vdW50Jyk7XG52YXIgU3ludGhldGljQ2xpcGJvYXJkRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0NsaXBib2FyZEV2ZW50Jyk7XG52YXIgU3ludGhldGljRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0V2ZW50Jyk7XG52YXIgU3ludGhldGljRm9jdXNFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljRm9jdXNFdmVudCcpO1xudmFyIFN5bnRoZXRpY0tleWJvYXJkRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0tleWJvYXJkRXZlbnQnKTtcbnZhciBTeW50aGV0aWNNb3VzZUV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNNb3VzZUV2ZW50Jyk7XG52YXIgU3ludGhldGljRHJhZ0V2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNEcmFnRXZlbnQnKTtcbnZhciBTeW50aGV0aWNUb3VjaEV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNUb3VjaEV2ZW50Jyk7XG52YXIgU3ludGhldGljVUlFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljVUlFdmVudCcpO1xudmFyIFN5bnRoZXRpY1doZWVsRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY1doZWVsRXZlbnQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgZ2V0RXZlbnRDaGFyQ29kZSA9IHJlcXVpcmUoJy4vZ2V0RXZlbnRDaGFyQ29kZScpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIGtleU9mID0gcmVxdWlyZSgnZmJqcy9saWIva2V5T2YnKTtcblxudmFyIHRvcExldmVsVHlwZXMgPSBFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzO1xuXG52YXIgZXZlbnRUeXBlcyA9IHtcbiAgYWJvcnQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkFib3J0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25BYm9ydENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGJsdXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkJsdXI6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkJsdXJDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBjYW5QbGF5OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25DYW5QbGF5OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25DYW5QbGF5Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgY2FuUGxheVRocm91Z2g6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkNhblBsYXlUaHJvdWdoOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25DYW5QbGF5VGhyb3VnaENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGNsaWNrOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25DbGljazogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ2xpY2tDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBjb250ZXh0TWVudToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ29udGV4dE1lbnU6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkNvbnRleHRNZW51Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgY29weToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ29weTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ29weUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGN1dDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ3V0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25DdXRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkb3VibGVDbGljazoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRG91YmxlQ2xpY2s6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRvdWJsZUNsaWNrQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHJhZzoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRHJhZzogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRHJhZ0NhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyYWdFbmQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWdFbmQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyYWdFbmRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkcmFnRW50ZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWdFbnRlcjogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRHJhZ0VudGVyQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHJhZ0V4aXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWdFeGl0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EcmFnRXhpdENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyYWdMZWF2ZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRHJhZ0xlYXZlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EcmFnTGVhdmVDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkcmFnT3Zlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRHJhZ092ZXI6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyYWdPdmVyQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHJhZ1N0YXJ0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25EcmFnU3RhcnQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyYWdTdGFydENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyb3A6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyb3A6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyb3BDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkdXJhdGlvbkNoYW5nZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRHVyYXRpb25DaGFuZ2U6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkR1cmF0aW9uQ2hhbmdlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZW1wdGllZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRW1wdGllZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRW1wdGllZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGVuY3J5cHRlZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRW5jcnlwdGVkOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25FbmNyeXB0ZWRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBlbmRlZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRW5kZWQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkVuZGVkQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZXJyb3I6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkVycm9yOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25FcnJvckNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGZvY3VzOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Gb2N1czogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRm9jdXNDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBpbnB1dDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uSW5wdXQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbklucHV0Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAga2V5RG93bjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uS2V5RG93bjogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uS2V5RG93bkNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGtleVByZXNzOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25LZXlQcmVzczogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uS2V5UHJlc3NDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBrZXlVcDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uS2V5VXA6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbktleVVwQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbG9hZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTG9hZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTG9hZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGxvYWRlZERhdGE6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkxvYWRlZERhdGE6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkxvYWRlZERhdGFDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBsb2FkZWRNZXRhZGF0YToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTG9hZGVkTWV0YWRhdGE6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkxvYWRlZE1ldGFkYXRhQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbG9hZFN0YXJ0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Mb2FkU3RhcnQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkxvYWRTdGFydENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIC8vIE5vdGU6IFdlIGRvIG5vdCBhbGxvdyBsaXN0ZW5pbmcgdG8gbW91c2VPdmVyIGV2ZW50cy4gSW5zdGVhZCwgdXNlIHRoZVxuICAvLyBvbk1vdXNlRW50ZXIvb25Nb3VzZUxlYXZlIGNyZWF0ZWQgYnkgYEVudGVyTGVhdmVFdmVudFBsdWdpbmAuXG4gIG1vdXNlRG93bjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTW91c2VEb3duOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Nb3VzZURvd25DYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBtb3VzZU1vdmU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbk1vdXNlTW92ZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW91c2VNb3ZlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbW91c2VPdXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbk1vdXNlT3V0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Nb3VzZU91dENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIG1vdXNlT3Zlcjoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTW91c2VPdmVyOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Nb3VzZU92ZXJDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBtb3VzZVVwOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Nb3VzZVVwOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Nb3VzZVVwQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgcGFzdGU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblBhc3RlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25QYXN0ZUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHBhdXNlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25QYXVzZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUGF1c2VDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBwbGF5OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25QbGF5OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25QbGF5Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgcGxheWluZzoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uUGxheWluZzogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUGxheWluZ0NhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHByb2dyZXNzOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Qcm9ncmVzczogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUHJvZ3Jlc3NDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICByYXRlQ2hhbmdlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25SYXRlQ2hhbmdlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25SYXRlQ2hhbmdlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgcmVzZXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblJlc2V0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25SZXNldENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHNjcm9sbDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU2Nyb2xsOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25TY3JvbGxDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBzZWVrZWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblNlZWtlZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU2Vla2VkQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgc2Vla2luZzoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU2Vla2luZzogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU2Vla2luZ0NhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHN0YWxsZWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblN0YWxsZWQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblN0YWxsZWRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBzdWJtaXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblN1Ym1pdDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU3VibWl0Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgc3VzcGVuZDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uU3VzcGVuZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU3VzcGVuZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHRpbWVVcGRhdGU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblRpbWVVcGRhdGU6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblRpbWVVcGRhdGVDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB0b3VjaENhbmNlbDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uVG91Y2hDYW5jZWw6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblRvdWNoQ2FuY2VsQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgdG91Y2hFbmQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblRvdWNoRW5kOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Ub3VjaEVuZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHRvdWNoTW92ZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uVG91Y2hNb3ZlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Ub3VjaE1vdmVDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB0b3VjaFN0YXJ0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Ub3VjaFN0YXJ0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Ub3VjaFN0YXJ0Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgdm9sdW1lQ2hhbmdlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Wb2x1bWVDaGFuZ2U6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblZvbHVtZUNoYW5nZUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHdhaXRpbmc6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbldhaXRpbmc6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbldhaXRpbmdDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB3aGVlbDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uV2hlZWw6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbldoZWVsQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfVxufTtcblxudmFyIHRvcExldmVsRXZlbnRzVG9EaXNwYXRjaENvbmZpZyA9IHtcbiAgdG9wQWJvcnQ6IGV2ZW50VHlwZXMuYWJvcnQsXG4gIHRvcEJsdXI6IGV2ZW50VHlwZXMuYmx1cixcbiAgdG9wQ2FuUGxheTogZXZlbnRUeXBlcy5jYW5QbGF5LFxuICB0b3BDYW5QbGF5VGhyb3VnaDogZXZlbnRUeXBlcy5jYW5QbGF5VGhyb3VnaCxcbiAgdG9wQ2xpY2s6IGV2ZW50VHlwZXMuY2xpY2ssXG4gIHRvcENvbnRleHRNZW51OiBldmVudFR5cGVzLmNvbnRleHRNZW51LFxuICB0b3BDb3B5OiBldmVudFR5cGVzLmNvcHksXG4gIHRvcEN1dDogZXZlbnRUeXBlcy5jdXQsXG4gIHRvcERvdWJsZUNsaWNrOiBldmVudFR5cGVzLmRvdWJsZUNsaWNrLFxuICB0b3BEcmFnOiBldmVudFR5cGVzLmRyYWcsXG4gIHRvcERyYWdFbmQ6IGV2ZW50VHlwZXMuZHJhZ0VuZCxcbiAgdG9wRHJhZ0VudGVyOiBldmVudFR5cGVzLmRyYWdFbnRlcixcbiAgdG9wRHJhZ0V4aXQ6IGV2ZW50VHlwZXMuZHJhZ0V4aXQsXG4gIHRvcERyYWdMZWF2ZTogZXZlbnRUeXBlcy5kcmFnTGVhdmUsXG4gIHRvcERyYWdPdmVyOiBldmVudFR5cGVzLmRyYWdPdmVyLFxuICB0b3BEcmFnU3RhcnQ6IGV2ZW50VHlwZXMuZHJhZ1N0YXJ0LFxuICB0b3BEcm9wOiBldmVudFR5cGVzLmRyb3AsXG4gIHRvcER1cmF0aW9uQ2hhbmdlOiBldmVudFR5cGVzLmR1cmF0aW9uQ2hhbmdlLFxuICB0b3BFbXB0aWVkOiBldmVudFR5cGVzLmVtcHRpZWQsXG4gIHRvcEVuY3J5cHRlZDogZXZlbnRUeXBlcy5lbmNyeXB0ZWQsXG4gIHRvcEVuZGVkOiBldmVudFR5cGVzLmVuZGVkLFxuICB0b3BFcnJvcjogZXZlbnRUeXBlcy5lcnJvcixcbiAgdG9wRm9jdXM6IGV2ZW50VHlwZXMuZm9jdXMsXG4gIHRvcElucHV0OiBldmVudFR5cGVzLmlucHV0LFxuICB0b3BLZXlEb3duOiBldmVudFR5cGVzLmtleURvd24sXG4gIHRvcEtleVByZXNzOiBldmVudFR5cGVzLmtleVByZXNzLFxuICB0b3BLZXlVcDogZXZlbnRUeXBlcy5rZXlVcCxcbiAgdG9wTG9hZDogZXZlbnRUeXBlcy5sb2FkLFxuICB0b3BMb2FkZWREYXRhOiBldmVudFR5cGVzLmxvYWRlZERhdGEsXG4gIHRvcExvYWRlZE1ldGFkYXRhOiBldmVudFR5cGVzLmxvYWRlZE1ldGFkYXRhLFxuICB0b3BMb2FkU3RhcnQ6IGV2ZW50VHlwZXMubG9hZFN0YXJ0LFxuICB0b3BNb3VzZURvd246IGV2ZW50VHlwZXMubW91c2VEb3duLFxuICB0b3BNb3VzZU1vdmU6IGV2ZW50VHlwZXMubW91c2VNb3ZlLFxuICB0b3BNb3VzZU91dDogZXZlbnRUeXBlcy5tb3VzZU91dCxcbiAgdG9wTW91c2VPdmVyOiBldmVudFR5cGVzLm1vdXNlT3ZlcixcbiAgdG9wTW91c2VVcDogZXZlbnRUeXBlcy5tb3VzZVVwLFxuICB0b3BQYXN0ZTogZXZlbnRUeXBlcy5wYXN0ZSxcbiAgdG9wUGF1c2U6IGV2ZW50VHlwZXMucGF1c2UsXG4gIHRvcFBsYXk6IGV2ZW50VHlwZXMucGxheSxcbiAgdG9wUGxheWluZzogZXZlbnRUeXBlcy5wbGF5aW5nLFxuICB0b3BQcm9ncmVzczogZXZlbnRUeXBlcy5wcm9ncmVzcyxcbiAgdG9wUmF0ZUNoYW5nZTogZXZlbnRUeXBlcy5yYXRlQ2hhbmdlLFxuICB0b3BSZXNldDogZXZlbnRUeXBlcy5yZXNldCxcbiAgdG9wU2Nyb2xsOiBldmVudFR5cGVzLnNjcm9sbCxcbiAgdG9wU2Vla2VkOiBldmVudFR5cGVzLnNlZWtlZCxcbiAgdG9wU2Vla2luZzogZXZlbnRUeXBlcy5zZWVraW5nLFxuICB0b3BTdGFsbGVkOiBldmVudFR5cGVzLnN0YWxsZWQsXG4gIHRvcFN1Ym1pdDogZXZlbnRUeXBlcy5zdWJtaXQsXG4gIHRvcFN1c3BlbmQ6IGV2ZW50VHlwZXMuc3VzcGVuZCxcbiAgdG9wVGltZVVwZGF0ZTogZXZlbnRUeXBlcy50aW1lVXBkYXRlLFxuICB0b3BUb3VjaENhbmNlbDogZXZlbnRUeXBlcy50b3VjaENhbmNlbCxcbiAgdG9wVG91Y2hFbmQ6IGV2ZW50VHlwZXMudG91Y2hFbmQsXG4gIHRvcFRvdWNoTW92ZTogZXZlbnRUeXBlcy50b3VjaE1vdmUsXG4gIHRvcFRvdWNoU3RhcnQ6IGV2ZW50VHlwZXMudG91Y2hTdGFydCxcbiAgdG9wVm9sdW1lQ2hhbmdlOiBldmVudFR5cGVzLnZvbHVtZUNoYW5nZSxcbiAgdG9wV2FpdGluZzogZXZlbnRUeXBlcy53YWl0aW5nLFxuICB0b3BXaGVlbDogZXZlbnRUeXBlcy53aGVlbFxufTtcblxuZm9yICh2YXIgdHlwZSBpbiB0b3BMZXZlbEV2ZW50c1RvRGlzcGF0Y2hDb25maWcpIHtcbiAgdG9wTGV2ZWxFdmVudHNUb0Rpc3BhdGNoQ29uZmlnW3R5cGVdLmRlcGVuZGVuY2llcyA9IFt0eXBlXTtcbn1cblxudmFyIE9OX0NMSUNLX0tFWSA9IGtleU9mKHsgb25DbGljazogbnVsbCB9KTtcbnZhciBvbkNsaWNrTGlzdGVuZXJzID0ge307XG5cbnZhciBTaW1wbGVFdmVudFBsdWdpbiA9IHtcblxuICBldmVudFR5cGVzOiBldmVudFR5cGVzLFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gICAqIEBwYXJhbSB7RE9NRXZlbnRUYXJnZXR9IHRvcExldmVsVGFyZ2V0IFRoZSBsaXN0ZW5pbmcgY29tcG9uZW50IHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICAgKiBAcmV0dXJuIHsqfSBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAgICogQHNlZSB7RXZlbnRQbHVnaW5IdWIuZXh0cmFjdEV2ZW50c31cbiAgICovXG4gIGV4dHJhY3RFdmVudHM6IGZ1bmN0aW9uICh0b3BMZXZlbFR5cGUsIHRvcExldmVsVGFyZ2V0LCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgICB2YXIgZGlzcGF0Y2hDb25maWcgPSB0b3BMZXZlbEV2ZW50c1RvRGlzcGF0Y2hDb25maWdbdG9wTGV2ZWxUeXBlXTtcbiAgICBpZiAoIWRpc3BhdGNoQ29uZmlnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIEV2ZW50Q29uc3RydWN0b3I7XG4gICAgc3dpdGNoICh0b3BMZXZlbFR5cGUpIHtcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BBYm9ydDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDYW5QbGF5OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcENhblBsYXlUaHJvdWdoOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcER1cmF0aW9uQ2hhbmdlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEVtcHRpZWQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRW5jcnlwdGVkOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEVuZGVkOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEVycm9yOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcElucHV0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcExvYWQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTG9hZGVkRGF0YTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BMb2FkZWRNZXRhZGF0YTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BMb2FkU3RhcnQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUGF1c2U6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUGxheTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BQbGF5aW5nOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFByb2dyZXNzOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFJhdGVDaGFuZ2U6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUmVzZXQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wU2Vla2VkOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFNlZWtpbmc6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wU3RhbGxlZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BTdWJtaXQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wU3VzcGVuZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUaW1lVXBkYXRlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFZvbHVtZUNoYW5nZTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BXYWl0aW5nOlxuICAgICAgICAvLyBIVE1MIEV2ZW50c1xuICAgICAgICAvLyBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2luZGV4Lmh0bWwjZXZlbnRzLTBcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY0V2ZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlQcmVzczpcbiAgICAgICAgLy8gRmlyZUZveCBjcmVhdGVzIGEga2V5cHJlc3MgZXZlbnQgZm9yIGZ1bmN0aW9uIGtleXMgdG9vLiBUaGlzIHJlbW92ZXNcbiAgICAgICAgLy8gdGhlIHVud2FudGVkIGtleXByZXNzIGV2ZW50cy4gRW50ZXIgaXMgaG93ZXZlciBib3RoIHByaW50YWJsZSBhbmRcbiAgICAgICAgLy8gbm9uLXByaW50YWJsZS4gT25lIHdvdWxkIGV4cGVjdCBUYWIgdG8gYmUgYXMgd2VsbCAoYnV0IGl0IGlzbid0KS5cbiAgICAgICAgaWYgKGdldEV2ZW50Q2hhckNvZGUobmF0aXZlRXZlbnQpID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlEb3duOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEtleVVwOlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljS2V5Ym9hcmRFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQmx1cjpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BGb2N1czpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY0ZvY3VzRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcENsaWNrOlxuICAgICAgICAvLyBGaXJlZm94IGNyZWF0ZXMgYSBjbGljayBldmVudCBvbiByaWdodCBtb3VzZSBjbGlja3MuIFRoaXMgcmVtb3ZlcyB0aGVcbiAgICAgICAgLy8gdW53YW50ZWQgY2xpY2sgZXZlbnRzLlxuICAgICAgICBpZiAobmF0aXZlRXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb250ZXh0TWVudTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEb3VibGVDbGljazpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZURvd246XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTW91c2VNb3ZlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3V0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlT3ZlcjpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZVVwOlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljTW91c2VFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZzpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEcmFnRW5kOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcERyYWdFbnRlcjpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEcmFnRXhpdDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEcmFnTGVhdmU6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZ092ZXI6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZ1N0YXJ0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcERyb3A6XG4gICAgICAgIEV2ZW50Q29uc3RydWN0b3IgPSBTeW50aGV0aWNEcmFnRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFRvdWNoQ2FuY2VsOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFRvdWNoRW5kOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFRvdWNoTW92ZTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUb3VjaFN0YXJ0OlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljVG91Y2hFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wU2Nyb2xsOlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljVUlFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wV2hlZWw6XG4gICAgICAgIEV2ZW50Q29uc3RydWN0b3IgPSBTeW50aGV0aWNXaGVlbEV2ZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDb3B5OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEN1dDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BQYXN0ZTpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY0NsaXBib2FyZEV2ZW50O1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgIUV2ZW50Q29uc3RydWN0b3IgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnU2ltcGxlRXZlbnRQbHVnaW46IFVuaGFuZGxlZCBldmVudCB0eXBlLCBgJXNgLicsIHRvcExldmVsVHlwZSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHZhciBldmVudCA9IEV2ZW50Q29uc3RydWN0b3IuZ2V0UG9vbGVkKGRpc3BhdGNoQ29uZmlnLCB0b3BMZXZlbFRhcmdldElELCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpO1xuICAgIEV2ZW50UHJvcGFnYXRvcnMuYWNjdW11bGF0ZVR3b1BoYXNlRGlzcGF0Y2hlcyhldmVudCk7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9LFxuXG4gIGRpZFB1dExpc3RlbmVyOiBmdW5jdGlvbiAoaWQsIHJlZ2lzdHJhdGlvbk5hbWUsIGxpc3RlbmVyKSB7XG4gICAgLy8gTW9iaWxlIFNhZmFyaSBkb2VzIG5vdCBmaXJlIHByb3Blcmx5IGJ1YmJsZSBjbGljayBldmVudHMgb25cbiAgICAvLyBub24taW50ZXJhY3RpdmUgZWxlbWVudHMsIHdoaWNoIG1lYW5zIGRlbGVnYXRlZCBjbGljayBsaXN0ZW5lcnMgZG8gbm90XG4gICAgLy8gZmlyZS4gVGhlIHdvcmthcm91bmQgZm9yIHRoaXMgYnVnIGludm9sdmVzIGF0dGFjaGluZyBhbiBlbXB0eSBjbGlja1xuICAgIC8vIGxpc3RlbmVyIG9uIHRoZSB0YXJnZXQgbm9kZS5cbiAgICBpZiAocmVnaXN0cmF0aW9uTmFtZSA9PT0gT05fQ0xJQ0tfS0VZKSB7XG4gICAgICB2YXIgbm9kZSA9IFJlYWN0TW91bnQuZ2V0Tm9kZShpZCk7XG4gICAgICBpZiAoIW9uQ2xpY2tMaXN0ZW5lcnNbaWRdKSB7XG4gICAgICAgIG9uQ2xpY2tMaXN0ZW5lcnNbaWRdID0gRXZlbnRMaXN0ZW5lci5saXN0ZW4obm9kZSwgJ2NsaWNrJywgZW1wdHlGdW5jdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHdpbGxEZWxldGVMaXN0ZW5lcjogZnVuY3Rpb24gKGlkLCByZWdpc3RyYXRpb25OYW1lKSB7XG4gICAgaWYgKHJlZ2lzdHJhdGlvbk5hbWUgPT09IE9OX0NMSUNLX0tFWSkge1xuICAgICAgb25DbGlja0xpc3RlbmVyc1tpZF0ucmVtb3ZlKCk7XG4gICAgICBkZWxldGUgb25DbGlja0xpc3RlbmVyc1tpZF07XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2ltcGxlRXZlbnRQbHVnaW47Il19