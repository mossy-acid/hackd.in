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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1NpbXBsZUV2ZW50UGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFqQjtBQUNKLElBQUksZ0JBQWdCLFFBQVEsd0JBQVIsQ0FBaEI7QUFDSixJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQW5CO0FBQ0osSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFiO0FBQ0osSUFBSSwwQkFBMEIsUUFBUSwyQkFBUixDQUExQjtBQUNKLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7QUFDSixJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQXRCO0FBQ0osSUFBSSx5QkFBeUIsUUFBUSwwQkFBUixDQUF6QjtBQUNKLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBdEI7QUFDSixJQUFJLHFCQUFxQixRQUFRLHNCQUFSLENBQXJCO0FBQ0osSUFBSSxzQkFBc0IsUUFBUSx1QkFBUixDQUF0QjtBQUNKLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBbkI7QUFDSixJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQXRCOztBQUVKLElBQUksZ0JBQWdCLFFBQVEsd0JBQVIsQ0FBaEI7QUFDSixJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQW5CO0FBQ0osSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBWjtBQUNKLElBQUksUUFBUSxRQUFRLGdCQUFSLENBQVI7O0FBRUosSUFBSSxnQkFBZ0IsZUFBZSxhQUFmOztBQUVwQixJQUFJLGFBQWE7QUFDZixTQUFPO0FBQ0wsNkJBQXlCO0FBQ3ZCLGVBQVMsTUFBTSxFQUFFLFNBQVMsSUFBVCxFQUFSLENBQVQ7QUFDQSxnQkFBVSxNQUFNLEVBQUUsZ0JBQWdCLElBQWhCLEVBQVIsQ0FBVjtLQUZGO0dBREY7QUFNQSxRQUFNO0FBQ0osNkJBQXlCO0FBQ3ZCLGVBQVMsTUFBTSxFQUFFLFFBQVEs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Q0FqSWxCOztBQTBJSixPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6IlNpbXBsZUV2ZW50UGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFNpbXBsZUV2ZW50UGx1Z2luXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgRXZlbnRMaXN0ZW5lciA9IHJlcXVpcmUoJ2ZianMvbGliL0V2ZW50TGlzdGVuZXInKTtcbnZhciBFdmVudFByb3BhZ2F0b3JzID0gcmVxdWlyZSgnLi9FdmVudFByb3BhZ2F0b3JzJyk7XG52YXIgUmVhY3RNb3VudCA9IHJlcXVpcmUoJy4vUmVhY3RNb3VudCcpO1xudmFyIFN5bnRoZXRpY0NsaXBib2FyZEV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNDbGlwYm9hcmRFdmVudCcpO1xudmFyIFN5bnRoZXRpY0V2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNFdmVudCcpO1xudmFyIFN5bnRoZXRpY0ZvY3VzRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY0ZvY3VzRXZlbnQnKTtcbnZhciBTeW50aGV0aWNLZXlib2FyZEV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNLZXlib2FyZEV2ZW50Jyk7XG52YXIgU3ludGhldGljTW91c2VFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljTW91c2VFdmVudCcpO1xudmFyIFN5bnRoZXRpY0RyYWdFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljRHJhZ0V2ZW50Jyk7XG52YXIgU3ludGhldGljVG91Y2hFdmVudCA9IHJlcXVpcmUoJy4vU3ludGhldGljVG91Y2hFdmVudCcpO1xudmFyIFN5bnRoZXRpY1VJRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY1VJRXZlbnQnKTtcbnZhciBTeW50aGV0aWNXaGVlbEV2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNXaGVlbEV2ZW50Jyk7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGdldEV2ZW50Q2hhckNvZGUgPSByZXF1aXJlKCcuL2dldEV2ZW50Q2hhckNvZGUnKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBrZXlPZiA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU9mJyk7XG5cbnZhciB0b3BMZXZlbFR5cGVzID0gRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcztcblxudmFyIGV2ZW50VHlwZXMgPSB7XG4gIGFib3J0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25BYm9ydDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQWJvcnRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBibHVyOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25CbHVyOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25CbHVyQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgY2FuUGxheToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ2FuUGxheTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ2FuUGxheUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGNhblBsYXlUaHJvdWdoOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25DYW5QbGF5VGhyb3VnaDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ2FuUGxheVRocm91Z2hDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBjbGljazoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uQ2xpY2s6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkNsaWNrQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgY29udGV4dE1lbnU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkNvbnRleHRNZW51OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Db250ZXh0TWVudUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGNvcHk6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkNvcHk6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkNvcHlDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBjdXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkN1dDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uQ3V0Q2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZG91YmxlQ2xpY2s6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRvdWJsZUNsaWNrOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Eb3VibGVDbGlja0NhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyYWc6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWc6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyYWdDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkcmFnRW5kOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25EcmFnRW5kOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EcmFnRW5kQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHJhZ0VudGVyOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25EcmFnRW50ZXI6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkRyYWdFbnRlckNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyYWdFeGl0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25EcmFnRXhpdDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRHJhZ0V4aXRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkcmFnTGVhdmU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWdMZWF2ZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRHJhZ0xlYXZlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHJhZ092ZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkRyYWdPdmVyOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EcmFnT3ZlckNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGRyYWdTdGFydDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRHJhZ1N0YXJ0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EcmFnU3RhcnRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBkcm9wOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Ecm9wOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Ecm9wQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZHVyYXRpb25DaGFuZ2U6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkR1cmF0aW9uQ2hhbmdlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25EdXJhdGlvbkNoYW5nZUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGVtcHRpZWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkVtcHRpZWQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkVtcHRpZWRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBlbmNyeXB0ZWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkVuY3J5cHRlZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRW5jcnlwdGVkQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgZW5kZWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkVuZGVkOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25FbmRlZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGVycm9yOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25FcnJvcjogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uRXJyb3JDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBmb2N1czoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uRm9jdXM6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkZvY3VzQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbklucHV0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25JbnB1dENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGtleURvd246IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbktleURvd246IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbktleURvd25DYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBrZXlQcmVzczoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uS2V5UHJlc3M6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbktleVByZXNzQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAga2V5VXA6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbktleVVwOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25LZXlVcENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGxvYWQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkxvYWQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbkxvYWRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBsb2FkZWREYXRhOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Mb2FkZWREYXRhOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Mb2FkZWREYXRhQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbG9hZGVkTWV0YWRhdGE6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbkxvYWRlZE1ldGFkYXRhOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Mb2FkZWRNZXRhZGF0YUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIGxvYWRTdGFydDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTG9hZFN0YXJ0OiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Mb2FkU3RhcnRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICAvLyBOb3RlOiBXZSBkbyBub3QgYWxsb3cgbGlzdGVuaW5nIHRvIG1vdXNlT3ZlciBldmVudHMuIEluc3RlYWQsIHVzZSB0aGVcbiAgLy8gb25Nb3VzZUVudGVyL29uTW91c2VMZWF2ZSBjcmVhdGVkIGJ5IGBFbnRlckxlYXZlRXZlbnRQbHVnaW5gLlxuICBtb3VzZURvd246IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbk1vdXNlRG93bjogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW91c2VEb3duQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbW91c2VNb3ZlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Nb3VzZU1vdmU6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvbk1vdXNlTW92ZUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIG1vdXNlT3V0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Nb3VzZU91dDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW91c2VPdXRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBtb3VzZU92ZXI6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbk1vdXNlT3ZlcjogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW91c2VPdmVyQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgbW91c2VVcDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uTW91c2VVcDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uTW91c2VVcENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHBhc3RlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25QYXN0ZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUGFzdGVDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBwYXVzZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uUGF1c2U6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblBhdXNlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgcGxheToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uUGxheTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUGxheUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHBsYXlpbmc6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblBsYXlpbmc6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblBsYXlpbmdDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBwcm9ncmVzczoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uUHJvZ3Jlc3M6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblByb2dyZXNzQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgcmF0ZUNoYW5nZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uUmF0ZUNoYW5nZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUmF0ZUNoYW5nZUNhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHJlc2V0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25SZXNldDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uUmVzZXRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBzY3JvbGw6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblNjcm9sbDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uU2Nyb2xsQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgc2Vla2VkOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25TZWVrZWQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblNlZWtlZENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHNlZWtpbmc6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblNlZWtpbmc6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblNlZWtpbmdDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICBzdGFsbGVkOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25TdGFsbGVkOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25TdGFsbGVkQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgc3VibWl0OiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25TdWJtaXQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblN1Ym1pdENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHN1c3BlbmQ6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblN1c3BlbmQ6IHRydWUgfSksXG4gICAgICBjYXB0dXJlZDoga2V5T2YoeyBvblN1c3BlbmRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB0aW1lVXBkYXRlOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25UaW1lVXBkYXRlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25UaW1lVXBkYXRlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgdG91Y2hDYW5jZWw6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblRvdWNoQ2FuY2VsOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Ub3VjaENhbmNlbENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHRvdWNoRW5kOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25Ub3VjaEVuZDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uVG91Y2hFbmRDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB0b3VjaE1vdmU6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvblRvdWNoTW92ZTogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uVG91Y2hNb3ZlQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgdG91Y2hTdGFydDoge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uVG91Y2hTdGFydDogdHJ1ZSB9KSxcbiAgICAgIGNhcHR1cmVkOiBrZXlPZih7IG9uVG91Y2hTdGFydENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH0sXG4gIHZvbHVtZUNoYW5nZToge1xuICAgIHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzOiB7XG4gICAgICBidWJibGVkOiBrZXlPZih7IG9uVm9sdW1lQ2hhbmdlOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25Wb2x1bWVDaGFuZ2VDYXB0dXJlOiB0cnVlIH0pXG4gICAgfVxuICB9LFxuICB3YWl0aW5nOiB7XG4gICAgcGhhc2VkUmVnaXN0cmF0aW9uTmFtZXM6IHtcbiAgICAgIGJ1YmJsZWQ6IGtleU9mKHsgb25XYWl0aW5nOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25XYWl0aW5nQ2FwdHVyZTogdHJ1ZSB9KVxuICAgIH1cbiAgfSxcbiAgd2hlZWw6IHtcbiAgICBwaGFzZWRSZWdpc3RyYXRpb25OYW1lczoge1xuICAgICAgYnViYmxlZDoga2V5T2YoeyBvbldoZWVsOiB0cnVlIH0pLFxuICAgICAgY2FwdHVyZWQ6IGtleU9mKHsgb25XaGVlbENhcHR1cmU6IHRydWUgfSlcbiAgICB9XG4gIH1cbn07XG5cbnZhciB0b3BMZXZlbEV2ZW50c1RvRGlzcGF0Y2hDb25maWcgPSB7XG4gIHRvcEFib3J0OiBldmVudFR5cGVzLmFib3J0LFxuICB0b3BCbHVyOiBldmVudFR5cGVzLmJsdXIsXG4gIHRvcENhblBsYXk6IGV2ZW50VHlwZXMuY2FuUGxheSxcbiAgdG9wQ2FuUGxheVRocm91Z2g6IGV2ZW50VHlwZXMuY2FuUGxheVRocm91Z2gsXG4gIHRvcENsaWNrOiBldmVudFR5cGVzLmNsaWNrLFxuICB0b3BDb250ZXh0TWVudTogZXZlbnRUeXBlcy5jb250ZXh0TWVudSxcbiAgdG9wQ29weTogZXZlbnRUeXBlcy5jb3B5LFxuICB0b3BDdXQ6IGV2ZW50VHlwZXMuY3V0LFxuICB0b3BEb3VibGVDbGljazogZXZlbnRUeXBlcy5kb3VibGVDbGljayxcbiAgdG9wRHJhZzogZXZlbnRUeXBlcy5kcmFnLFxuICB0b3BEcmFnRW5kOiBldmVudFR5cGVzLmRyYWdFbmQsXG4gIHRvcERyYWdFbnRlcjogZXZlbnRUeXBlcy5kcmFnRW50ZXIsXG4gIHRvcERyYWdFeGl0OiBldmVudFR5cGVzLmRyYWdFeGl0LFxuICB0b3BEcmFnTGVhdmU6IGV2ZW50VHlwZXMuZHJhZ0xlYXZlLFxuICB0b3BEcmFnT3ZlcjogZXZlbnRUeXBlcy5kcmFnT3ZlcixcbiAgdG9wRHJhZ1N0YXJ0OiBldmVudFR5cGVzLmRyYWdTdGFydCxcbiAgdG9wRHJvcDogZXZlbnRUeXBlcy5kcm9wLFxuICB0b3BEdXJhdGlvbkNoYW5nZTogZXZlbnRUeXBlcy5kdXJhdGlvbkNoYW5nZSxcbiAgdG9wRW1wdGllZDogZXZlbnRUeXBlcy5lbXB0aWVkLFxuICB0b3BFbmNyeXB0ZWQ6IGV2ZW50VHlwZXMuZW5jcnlwdGVkLFxuICB0b3BFbmRlZDogZXZlbnRUeXBlcy5lbmRlZCxcbiAgdG9wRXJyb3I6IGV2ZW50VHlwZXMuZXJyb3IsXG4gIHRvcEZvY3VzOiBldmVudFR5cGVzLmZvY3VzLFxuICB0b3BJbnB1dDogZXZlbnRUeXBlcy5pbnB1dCxcbiAgdG9wS2V5RG93bjogZXZlbnRUeXBlcy5rZXlEb3duLFxuICB0b3BLZXlQcmVzczogZXZlbnRUeXBlcy5rZXlQcmVzcyxcbiAgdG9wS2V5VXA6IGV2ZW50VHlwZXMua2V5VXAsXG4gIHRvcExvYWQ6IGV2ZW50VHlwZXMubG9hZCxcbiAgdG9wTG9hZGVkRGF0YTogZXZlbnRUeXBlcy5sb2FkZWREYXRhLFxuICB0b3BMb2FkZWRNZXRhZGF0YTogZXZlbnRUeXBlcy5sb2FkZWRNZXRhZGF0YSxcbiAgdG9wTG9hZFN0YXJ0OiBldmVudFR5cGVzLmxvYWRTdGFydCxcbiAgdG9wTW91c2VEb3duOiBldmVudFR5cGVzLm1vdXNlRG93bixcbiAgdG9wTW91c2VNb3ZlOiBldmVudFR5cGVzLm1vdXNlTW92ZSxcbiAgdG9wTW91c2VPdXQ6IGV2ZW50VHlwZXMubW91c2VPdXQsXG4gIHRvcE1vdXNlT3ZlcjogZXZlbnRUeXBlcy5tb3VzZU92ZXIsXG4gIHRvcE1vdXNlVXA6IGV2ZW50VHlwZXMubW91c2VVcCxcbiAgdG9wUGFzdGU6IGV2ZW50VHlwZXMucGFzdGUsXG4gIHRvcFBhdXNlOiBldmVudFR5cGVzLnBhdXNlLFxuICB0b3BQbGF5OiBldmVudFR5cGVzLnBsYXksXG4gIHRvcFBsYXlpbmc6IGV2ZW50VHlwZXMucGxheWluZyxcbiAgdG9wUHJvZ3Jlc3M6IGV2ZW50VHlwZXMucHJvZ3Jlc3MsXG4gIHRvcFJhdGVDaGFuZ2U6IGV2ZW50VHlwZXMucmF0ZUNoYW5nZSxcbiAgdG9wUmVzZXQ6IGV2ZW50VHlwZXMucmVzZXQsXG4gIHRvcFNjcm9sbDogZXZlbnRUeXBlcy5zY3JvbGwsXG4gIHRvcFNlZWtlZDogZXZlbnRUeXBlcy5zZWVrZWQsXG4gIHRvcFNlZWtpbmc6IGV2ZW50VHlwZXMuc2Vla2luZyxcbiAgdG9wU3RhbGxlZDogZXZlbnRUeXBlcy5zdGFsbGVkLFxuICB0b3BTdWJtaXQ6IGV2ZW50VHlwZXMuc3VibWl0LFxuICB0b3BTdXNwZW5kOiBldmVudFR5cGVzLnN1c3BlbmQsXG4gIHRvcFRpbWVVcGRhdGU6IGV2ZW50VHlwZXMudGltZVVwZGF0ZSxcbiAgdG9wVG91Y2hDYW5jZWw6IGV2ZW50VHlwZXMudG91Y2hDYW5jZWwsXG4gIHRvcFRvdWNoRW5kOiBldmVudFR5cGVzLnRvdWNoRW5kLFxuICB0b3BUb3VjaE1vdmU6IGV2ZW50VHlwZXMudG91Y2hNb3ZlLFxuICB0b3BUb3VjaFN0YXJ0OiBldmVudFR5cGVzLnRvdWNoU3RhcnQsXG4gIHRvcFZvbHVtZUNoYW5nZTogZXZlbnRUeXBlcy52b2x1bWVDaGFuZ2UsXG4gIHRvcFdhaXRpbmc6IGV2ZW50VHlwZXMud2FpdGluZyxcbiAgdG9wV2hlZWw6IGV2ZW50VHlwZXMud2hlZWxcbn07XG5cbmZvciAodmFyIHR5cGUgaW4gdG9wTGV2ZWxFdmVudHNUb0Rpc3BhdGNoQ29uZmlnKSB7XG4gIHRvcExldmVsRXZlbnRzVG9EaXNwYXRjaENvbmZpZ1t0eXBlXS5kZXBlbmRlbmNpZXMgPSBbdHlwZV07XG59XG5cbnZhciBPTl9DTElDS19LRVkgPSBrZXlPZih7IG9uQ2xpY2s6IG51bGwgfSk7XG52YXIgb25DbGlja0xpc3RlbmVycyA9IHt9O1xuXG52YXIgU2ltcGxlRXZlbnRQbHVnaW4gPSB7XG5cbiAgZXZlbnRUeXBlczogZXZlbnRUeXBlcyxcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVHlwZSBSZWNvcmQgZnJvbSBgRXZlbnRDb25zdGFudHNgLlxuICAgKiBAcGFyYW0ge0RPTUV2ZW50VGFyZ2V0fSB0b3BMZXZlbFRhcmdldCBUaGUgbGlzdGVuaW5nIGNvbXBvbmVudCByb290IG5vZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BMZXZlbFRhcmdldElEIElEIG9mIGB0b3BMZXZlbFRhcmdldGAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAgICogQHJldHVybiB7Kn0gQW4gYWNjdW11bGF0aW9uIG9mIHN5bnRoZXRpYyBldmVudHMuXG4gICAqIEBzZWUge0V2ZW50UGx1Z2luSHViLmV4dHJhY3RFdmVudHN9XG4gICAqL1xuICBleHRyYWN0RXZlbnRzOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gICAgdmFyIGRpc3BhdGNoQ29uZmlnID0gdG9wTGV2ZWxFdmVudHNUb0Rpc3BhdGNoQ29uZmlnW3RvcExldmVsVHlwZV07XG4gICAgaWYgKCFkaXNwYXRjaENvbmZpZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBFdmVudENvbnN0cnVjdG9yO1xuICAgIHN3aXRjaCAodG9wTGV2ZWxUeXBlKSB7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQWJvcnQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ2FuUGxheTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDYW5QbGF5VGhyb3VnaDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEdXJhdGlvbkNoYW5nZTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BFbXB0aWVkOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEVuY3J5cHRlZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BFbmRlZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BFcnJvcjpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BJbnB1dDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BMb2FkOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcExvYWRlZERhdGE6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTG9hZGVkTWV0YWRhdGE6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTG9hZFN0YXJ0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFBhdXNlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFBsYXk6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUGxheWluZzpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BQcm9ncmVzczpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BSYXRlQ2hhbmdlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFJlc2V0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFNlZWtlZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BTZWVraW5nOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFN0YWxsZWQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wU3VibWl0OlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFN1c3BlbmQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wVGltZVVwZGF0ZTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BWb2x1bWVDaGFuZ2U6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wV2FpdGluZzpcbiAgICAgICAgLy8gSFRNTCBFdmVudHNcbiAgICAgICAgLy8gQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9pbmRleC5odG1sI2V2ZW50cy0wXG4gICAgICAgIEV2ZW50Q29uc3RydWN0b3IgPSBTeW50aGV0aWNFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5UHJlc3M6XG4gICAgICAgIC8vIEZpcmVGb3ggY3JlYXRlcyBhIGtleXByZXNzIGV2ZW50IGZvciBmdW5jdGlvbiBrZXlzIHRvby4gVGhpcyByZW1vdmVzXG4gICAgICAgIC8vIHRoZSB1bndhbnRlZCBrZXlwcmVzcyBldmVudHMuIEVudGVyIGlzIGhvd2V2ZXIgYm90aCBwcmludGFibGUgYW5kXG4gICAgICAgIC8vIG5vbi1wcmludGFibGUuIE9uZSB3b3VsZCBleHBlY3QgVGFiIHRvIGJlIGFzIHdlbGwgKGJ1dCBpdCBpc24ndCkuXG4gICAgICAgIGlmIChnZXRFdmVudENoYXJDb2RlKG5hdGl2ZUV2ZW50KSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wS2V5RG93bjpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BLZXlVcDpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY0tleWJvYXJkRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcEJsdXI6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRm9jdXM6XG4gICAgICAgIEV2ZW50Q29uc3RydWN0b3IgPSBTeW50aGV0aWNGb2N1c0V2ZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDbGljazpcbiAgICAgICAgLy8gRmlyZWZveCBjcmVhdGVzIGEgY2xpY2sgZXZlbnQgb24gcmlnaHQgbW91c2UgY2xpY2tzLiBUaGlzIHJlbW92ZXMgdGhlXG4gICAgICAgIC8vIHVud2FudGVkIGNsaWNrIGV2ZW50cy5cbiAgICAgICAgaWYgKG5hdGl2ZUV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ29udGV4dE1lbnU6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRG91YmxlQ2xpY2s6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTW91c2VEb3duOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlTW92ZTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU91dDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BNb3VzZU92ZXI6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wTW91c2VVcDpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY01vdXNlRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcERyYWc6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZ0VuZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEcmFnRW50ZXI6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZ0V4aXQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wRHJhZ0xlYXZlOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcERyYWdPdmVyOlxuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcERyYWdTdGFydDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BEcm9wOlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljRHJhZ0V2ZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUb3VjaENhbmNlbDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUb3VjaEVuZDpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BUb3VjaE1vdmU6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wVG91Y2hTdGFydDpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY1RvdWNoRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFNjcm9sbDpcbiAgICAgICAgRXZlbnRDb25zdHJ1Y3RvciA9IFN5bnRoZXRpY1VJRXZlbnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0b3BMZXZlbFR5cGVzLnRvcFdoZWVsOlxuICAgICAgICBFdmVudENvbnN0cnVjdG9yID0gU3ludGhldGljV2hlZWxFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wQ29weTpcbiAgICAgIGNhc2UgdG9wTGV2ZWxUeXBlcy50b3BDdXQ6XG4gICAgICBjYXNlIHRvcExldmVsVHlwZXMudG9wUGFzdGU6XG4gICAgICAgIEV2ZW50Q29uc3RydWN0b3IgPSBTeW50aGV0aWNDbGlwYm9hcmRFdmVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgICFFdmVudENvbnN0cnVjdG9yID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1NpbXBsZUV2ZW50UGx1Z2luOiBVbmhhbmRsZWQgZXZlbnQgdHlwZSwgYCVzYC4nLCB0b3BMZXZlbFR5cGUpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgZXZlbnQgPSBFdmVudENvbnN0cnVjdG9yLmdldFBvb2xlZChkaXNwYXRjaENvbmZpZywgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXMoZXZlbnQpO1xuICAgIHJldHVybiBldmVudDtcbiAgfSxcblxuICBkaWRQdXRMaXN0ZW5lcjogZnVuY3Rpb24gKGlkLCByZWdpc3RyYXRpb25OYW1lLCBsaXN0ZW5lcikge1xuICAgIC8vIE1vYmlsZSBTYWZhcmkgZG9lcyBub3QgZmlyZSBwcm9wZXJseSBidWJibGUgY2xpY2sgZXZlbnRzIG9uXG4gICAgLy8gbm9uLWludGVyYWN0aXZlIGVsZW1lbnRzLCB3aGljaCBtZWFucyBkZWxlZ2F0ZWQgY2xpY2sgbGlzdGVuZXJzIGRvIG5vdFxuICAgIC8vIGZpcmUuIFRoZSB3b3JrYXJvdW5kIGZvciB0aGlzIGJ1ZyBpbnZvbHZlcyBhdHRhY2hpbmcgYW4gZW1wdHkgY2xpY2tcbiAgICAvLyBsaXN0ZW5lciBvbiB0aGUgdGFyZ2V0IG5vZGUuXG4gICAgaWYgKHJlZ2lzdHJhdGlvbk5hbWUgPT09IE9OX0NMSUNLX0tFWSkge1xuICAgICAgdmFyIG5vZGUgPSBSZWFjdE1vdW50LmdldE5vZGUoaWQpO1xuICAgICAgaWYgKCFvbkNsaWNrTGlzdGVuZXJzW2lkXSkge1xuICAgICAgICBvbkNsaWNrTGlzdGVuZXJzW2lkXSA9IEV2ZW50TGlzdGVuZXIubGlzdGVuKG5vZGUsICdjbGljaycsIGVtcHR5RnVuY3Rpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB3aWxsRGVsZXRlTGlzdGVuZXI6IGZ1bmN0aW9uIChpZCwgcmVnaXN0cmF0aW9uTmFtZSkge1xuICAgIGlmIChyZWdpc3RyYXRpb25OYW1lID09PSBPTl9DTElDS19LRVkpIHtcbiAgICAgIG9uQ2xpY2tMaXN0ZW5lcnNbaWRdLnJlbW92ZSgpO1xuICAgICAgZGVsZXRlIG9uQ2xpY2tMaXN0ZW5lcnNbaWRdO1xuICAgIH1cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXBsZUV2ZW50UGx1Z2luOyJdfQ==