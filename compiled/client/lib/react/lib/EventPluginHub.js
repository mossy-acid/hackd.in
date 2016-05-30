/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginHub
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var EventPluginRegistry = require('./EventPluginRegistry');
var EventPluginUtils = require('./EventPluginUtils');
var ReactErrorUtils = require('./ReactErrorUtils');

var accumulateInto = require('./accumulateInto');
var forEachAccumulated = require('./forEachAccumulated');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @private
 */
var executeDispatchesAndRelease = function executeDispatchesAndRelease(event, simulated) {
  if (event) {
    EventPluginUtils.executeDispatchesInOrder(event, simulated);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};
var executeDispatchesAndReleaseSimulated = function executeDispatchesAndReleaseSimulated(e) {
  return executeDispatchesAndRelease(e, true);
};
var executeDispatchesAndReleaseTopLevel = function executeDispatchesAndReleaseTopLevel(e) {
  return executeDispatchesAndRelease(e, false);
};

/**
 * - `InstanceHandle`: [required] Module that performs logical traversals of DOM
 *   hierarchy given ids of the logical DOM elements involved.
 */
var InstanceHandle = null;

function validateInstanceHandle() {
  var valid = InstanceHandle && InstanceHandle.traverseTwoPhase && InstanceHandle.traverseEnterLeave;
  process.env.NODE_ENV !== 'production' ? warning(valid, 'InstanceHandle not injected before use!') : undefined;
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {object} InjectedMount
     * @public
     */
    injectMount: EventPluginUtils.injection.injectMount,

    /**
     * @param {object} InjectedInstanceHandle
     * @public
     */
    injectInstanceHandle: function injectInstanceHandle(InjectedInstanceHandle) {
      InstanceHandle = InjectedInstanceHandle;
      if (process.env.NODE_ENV !== 'production') {
        validateInstanceHandle();
      }
    },

    getInstanceHandle: function getInstanceHandle() {
      if (process.env.NODE_ENV !== 'production') {
        validateInstanceHandle();
      }
      return InstanceHandle;
    },

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,

  registrationNameModules: EventPluginRegistry.registrationNameModules,

  /**
   * Stores `listener` at `listenerBank[registrationName][id]`. Is idempotent.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {?function} listener The callback to store.
   */
  putListener: function putListener(id, registrationName, listener) {
    !(typeof listener === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s listener to be a function, instead got type %s', registrationName, typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) : invariant(false) : undefined;

    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[id] = listener;

    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
    if (PluginModule && PluginModule.didPutListener) {
      PluginModule.didPutListener(id, registrationName, listener);
    }
  },

  /**
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function getListener(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    return bankForRegistrationName && bankForRegistrationName[id];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function deleteListener(id, registrationName) {
    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
    if (PluginModule && PluginModule.willDeleteListener) {
      PluginModule.willDeleteListener(id, registrationName);
    }

    var bankForRegistrationName = listenerBank[registrationName];
    // TODO: This should never be null -- when is it?
    if (bankForRegistrationName) {
      delete bankForRegistrationName[id];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {string} id ID of the DOM element.
   */
  deleteAllListeners: function deleteAllListeners(id) {
    for (var registrationName in listenerBank) {
      if (!listenerBank[registrationName][id]) {
        continue;
      }

      var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
      if (PluginModule && PluginModule.willDeleteListener) {
        PluginModule.willDeleteListener(id, registrationName);
      }

      delete listenerBank[registrationName][id];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0; i < plugins.length; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(topLevelType, topLevelTarget, topLevelTargetID, nativeEvent, nativeEventTarget);
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function enqueueEvents(events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function processEventQueue(simulated) {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    if (simulated) {
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
    } else {
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
    }
    !!eventQueue ? process.env.NODE_ENV !== 'production' ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing ' + 'an event queue. Support for this has not yet been implemented.') : invariant(false) : undefined;
    // This would be a good time to rethrow if any of the event handlers threw.
    ReactErrorUtils.rethrowCaughtError();
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function __purge() {
    listenerBank = {};
  },

  __getListenerBank: function __getListenerBank() {
    return listenerBank;
  }

};

module.exports = EventPluginHub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0V2ZW50UGx1Z2luSHViLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7Ozs7QUFFQSxJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQXRCO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjtBQUNKLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBbEI7O0FBRUosSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFqQjtBQUNKLElBQUkscUJBQXFCLFFBQVEsc0JBQVIsQ0FBckI7QUFDSixJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaO0FBQ0osSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBVjs7Ozs7QUFLSixJQUFJLGVBQWUsRUFBZjs7Ozs7O0FBTUosSUFBSSxhQUFhLElBQWI7Ozs7Ozs7OztBQVNKLElBQUksOEJBQThCLFNBQTlCLDJCQUE4QixDQUFVLEtBQVYsRUFBaUIsU0FBakIsRUFBNEI7QUFDNUQsTUFBSSxLQUFKLEVBQVc7QUFDVCxxQkFBaUIsd0JBQWpCLENBQTBDLEtBQTFDLEVBQWlELFNBQWpELEVBRFM7O0FBR1QsUUFBSSxDQUFDLE1BQU0sWUFBTixFQUFELEVBQXVCO0FBQ3pCLFlBQU0sV0FBTixDQUFrQixPQUFsQixDQUEwQixLQUExQixFQUR5QjtLQUEzQjtHQUhGO0NBRGdDO0FBU2xDLElBQUksdUNBQXVDLFNBQXZDLG9DQUF1QyxDQUFVLENBQVYsRUFBYTtBQUN0RCxTQUFPLDRCQUE0QixDQUE1QixFQUErQixJQUEvQixDQUFQLENBRHNEO0NBQWI7QUFHM0MsSUFBSSxzQ0FBc0MsU0FBdEMsbUNBQXNDLENBQVUsQ0FBVixFQUFhO0FBQ3JELFNBQU8sNEJBQTRCLENBQTVCLEVBQStCLEtBQS9CLENBQVAsQ0FEcUQ7Q0FBYjs7Ozs7O0FBUTFDLElBQUksaUJBQWlCLElBQWpCOztBQUVKLFNBQVMsc0JBQVQsR0FBa0M7QUFDaEMsTUFBSSxRQUFR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Q0FBQyxVQUFELEdBQWMsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsMkVBQTJFLGdFQUEzRSxDQUF6RCxHQUF3TSxVQUFVLEtBQVYsQ0FBeE0sR0FBMk4sU0FBMU87O0FBVnNDLG1CQVl0QyxDQUFnQixrQkFBaEIsR0Fac0M7R0FBckI7Ozs7O0FBa0JuQixXQUFTLG1CQUFZO0FBQ25CLG1CQUFlLEVBQWYsQ0FEbUI7R0FBWjs7QUFJVCxxQkFBbUIsNkJBQVk7QUFDN0IsV0FBTyxZQUFQLENBRDZCO0dBQVo7O0NBdkxqQjs7QUE2TEosT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6IkV2ZW50UGx1Z2luSHViLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEV2ZW50UGx1Z2luSHViXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRQbHVnaW5SZWdpc3RyeSA9IHJlcXVpcmUoJy4vRXZlbnRQbHVnaW5SZWdpc3RyeScpO1xudmFyIEV2ZW50UGx1Z2luVXRpbHMgPSByZXF1aXJlKCcuL0V2ZW50UGx1Z2luVXRpbHMnKTtcbnZhciBSZWFjdEVycm9yVXRpbHMgPSByZXF1aXJlKCcuL1JlYWN0RXJyb3JVdGlscycpO1xuXG52YXIgYWNjdW11bGF0ZUludG8gPSByZXF1aXJlKCcuL2FjY3VtdWxhdGVJbnRvJyk7XG52YXIgZm9yRWFjaEFjY3VtdWxhdGVkID0gcmVxdWlyZSgnLi9mb3JFYWNoQWNjdW11bGF0ZWQnKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG4vKipcbiAqIEludGVybmFsIHN0b3JlIGZvciBldmVudCBsaXN0ZW5lcnNcbiAqL1xudmFyIGxpc3RlbmVyQmFuayA9IHt9O1xuXG4vKipcbiAqIEludGVybmFsIHF1ZXVlIG9mIGV2ZW50cyB0aGF0IGhhdmUgYWNjdW11bGF0ZWQgdGhlaXIgZGlzcGF0Y2hlcyBhbmQgYXJlXG4gKiB3YWl0aW5nIHRvIGhhdmUgdGhlaXIgZGlzcGF0Y2hlcyBleGVjdXRlZC5cbiAqL1xudmFyIGV2ZW50UXVldWUgPSBudWxsO1xuXG4vKipcbiAqIERpc3BhdGNoZXMgYW4gZXZlbnQgYW5kIHJlbGVhc2VzIGl0IGJhY2sgaW50byB0aGUgcG9vbCwgdW5sZXNzIHBlcnNpc3RlbnQuXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBldmVudCBTeW50aGV0aWMgZXZlbnQgdG8gYmUgZGlzcGF0Y2hlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2ltdWxhdGVkIElmIHRoZSBldmVudCBpcyBzaW11bGF0ZWQgKGNoYW5nZXMgZXhuIGJlaGF2aW9yKVxuICogQHByaXZhdGVcbiAqL1xudmFyIGV4ZWN1dGVEaXNwYXRjaGVzQW5kUmVsZWFzZSA9IGZ1bmN0aW9uIChldmVudCwgc2ltdWxhdGVkKSB7XG4gIGlmIChldmVudCkge1xuICAgIEV2ZW50UGx1Z2luVXRpbHMuZXhlY3V0ZURpc3BhdGNoZXNJbk9yZGVyKGV2ZW50LCBzaW11bGF0ZWQpO1xuXG4gICAgaWYgKCFldmVudC5pc1BlcnNpc3RlbnQoKSkge1xuICAgICAgZXZlbnQuY29uc3RydWN0b3IucmVsZWFzZShldmVudCk7XG4gICAgfVxuICB9XG59O1xudmFyIGV4ZWN1dGVEaXNwYXRjaGVzQW5kUmVsZWFzZVNpbXVsYXRlZCA9IGZ1bmN0aW9uIChlKSB7XG4gIHJldHVybiBleGVjdXRlRGlzcGF0Y2hlc0FuZFJlbGVhc2UoZSwgdHJ1ZSk7XG59O1xudmFyIGV4ZWN1dGVEaXNwYXRjaGVzQW5kUmVsZWFzZVRvcExldmVsID0gZnVuY3Rpb24gKGUpIHtcbiAgcmV0dXJuIGV4ZWN1dGVEaXNwYXRjaGVzQW5kUmVsZWFzZShlLCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIC0gYEluc3RhbmNlSGFuZGxlYDogW3JlcXVpcmVkXSBNb2R1bGUgdGhhdCBwZXJmb3JtcyBsb2dpY2FsIHRyYXZlcnNhbHMgb2YgRE9NXG4gKiAgIGhpZXJhcmNoeSBnaXZlbiBpZHMgb2YgdGhlIGxvZ2ljYWwgRE9NIGVsZW1lbnRzIGludm9sdmVkLlxuICovXG52YXIgSW5zdGFuY2VIYW5kbGUgPSBudWxsO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUluc3RhbmNlSGFuZGxlKCkge1xuICB2YXIgdmFsaWQgPSBJbnN0YW5jZUhhbmRsZSAmJiBJbnN0YW5jZUhhbmRsZS50cmF2ZXJzZVR3b1BoYXNlICYmIEluc3RhbmNlSGFuZGxlLnRyYXZlcnNlRW50ZXJMZWF2ZTtcbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodmFsaWQsICdJbnN0YW5jZUhhbmRsZSBub3QgaW5qZWN0ZWQgYmVmb3JlIHVzZSEnKSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGV2ZW50IHBsdWdpbnMgdG8gYmUgaW5zdGFsbGVkIGFuZCBjb25maWd1cmVkLlxuICpcbiAqIEV2ZW50IHBsdWdpbnMgY2FuIGltcGxlbWVudCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICBgZXh0cmFjdEV2ZW50c2Age2Z1bmN0aW9uKHN0cmluZywgRE9NRXZlbnRUYXJnZXQsIHN0cmluZywgb2JqZWN0KTogKn1cbiAqICAgICBSZXF1aXJlZC4gV2hlbiBhIHRvcC1sZXZlbCBldmVudCBpcyBmaXJlZCwgdGhpcyBtZXRob2QgaXMgZXhwZWN0ZWQgdG9cbiAqICAgICBleHRyYWN0IHN5bnRoZXRpYyBldmVudHMgdGhhdCB3aWxsIGluIHR1cm4gYmUgcXVldWVkIGFuZCBkaXNwYXRjaGVkLlxuICpcbiAqICAgYGV2ZW50VHlwZXNgIHtvYmplY3R9XG4gKiAgICAgT3B0aW9uYWwsIHBsdWdpbnMgdGhhdCBmaXJlIGV2ZW50cyBtdXN0IHB1Ymxpc2ggYSBtYXBwaW5nIG9mIHJlZ2lzdHJhdGlvblxuICogICAgIG5hbWVzIHRoYXQgYXJlIHVzZWQgdG8gcmVnaXN0ZXIgbGlzdGVuZXJzLiBWYWx1ZXMgb2YgdGhpcyBtYXBwaW5nIG11c3RcbiAqICAgICBiZSBvYmplY3RzIHRoYXQgY29udGFpbiBgcmVnaXN0cmF0aW9uTmFtZWAgb3IgYHBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzYC5cbiAqXG4gKiAgIGBleGVjdXRlRGlzcGF0Y2hgIHtmdW5jdGlvbihvYmplY3QsIGZ1bmN0aW9uLCBzdHJpbmcpfVxuICogICAgIE9wdGlvbmFsLCBhbGxvd3MgcGx1Z2lucyB0byBvdmVycmlkZSBob3cgYW4gZXZlbnQgZ2V0cyBkaXNwYXRjaGVkLiBCeVxuICogICAgIGRlZmF1bHQsIHRoZSBsaXN0ZW5lciBpcyBzaW1wbHkgaW52b2tlZC5cbiAqXG4gKiBFYWNoIHBsdWdpbiB0aGF0IGlzIGluamVjdGVkIGludG8gYEV2ZW50c1BsdWdpbkh1YmAgaXMgaW1tZWRpYXRlbHkgb3BlcmFibGUuXG4gKlxuICogQHB1YmxpY1xuICovXG52YXIgRXZlbnRQbHVnaW5IdWIgPSB7XG5cbiAgLyoqXG4gICAqIE1ldGhvZHMgZm9yIGluamVjdGluZyBkZXBlbmRlbmNpZXMuXG4gICAqL1xuICBpbmplY3Rpb246IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBJbmplY3RlZE1vdW50XG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluamVjdE1vdW50OiBFdmVudFBsdWdpblV0aWxzLmluamVjdGlvbi5pbmplY3RNb3VudCxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBJbmplY3RlZEluc3RhbmNlSGFuZGxlXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGluamVjdEluc3RhbmNlSGFuZGxlOiBmdW5jdGlvbiAoSW5qZWN0ZWRJbnN0YW5jZUhhbmRsZSkge1xuICAgICAgSW5zdGFuY2VIYW5kbGUgPSBJbmplY3RlZEluc3RhbmNlSGFuZGxlO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFsaWRhdGVJbnN0YW5jZUhhbmRsZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZUhhbmRsZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFsaWRhdGVJbnN0YW5jZUhhbmRsZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEluc3RhbmNlSGFuZGxlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBJbmplY3RlZEV2ZW50UGx1Z2luT3JkZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgaW5qZWN0RXZlbnRQbHVnaW5PcmRlcjogRXZlbnRQbHVnaW5SZWdpc3RyeS5pbmplY3RFdmVudFBsdWdpbk9yZGVyLFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGluamVjdGVkTmFtZXNUb1BsdWdpbnMgTWFwIGZyb20gbmFtZXMgdG8gcGx1Z2luIG1vZHVsZXMuXG4gICAgICovXG4gICAgaW5qZWN0RXZlbnRQbHVnaW5zQnlOYW1lOiBFdmVudFBsdWdpblJlZ2lzdHJ5LmluamVjdEV2ZW50UGx1Z2luc0J5TmFtZVxuXG4gIH0sXG5cbiAgZXZlbnROYW1lRGlzcGF0Y2hDb25maWdzOiBFdmVudFBsdWdpblJlZ2lzdHJ5LmV2ZW50TmFtZURpc3BhdGNoQ29uZmlncyxcblxuICByZWdpc3RyYXRpb25OYW1lTW9kdWxlczogRXZlbnRQbHVnaW5SZWdpc3RyeS5yZWdpc3RyYXRpb25OYW1lTW9kdWxlcyxcblxuICAvKipcbiAgICogU3RvcmVzIGBsaXN0ZW5lcmAgYXQgYGxpc3RlbmVyQmFua1tyZWdpc3RyYXRpb25OYW1lXVtpZF1gLiBJcyBpZGVtcG90ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgSUQgb2YgdGhlIERPTSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVnaXN0cmF0aW9uTmFtZSBOYW1lIG9mIGxpc3RlbmVyIChlLmcuIGBvbkNsaWNrYCkuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgY2FsbGJhY2sgdG8gc3RvcmUuXG4gICAqL1xuICBwdXRMaXN0ZW5lcjogZnVuY3Rpb24gKGlkLCByZWdpc3RyYXRpb25OYW1lLCBsaXN0ZW5lcikge1xuICAgICEodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCAlcyBsaXN0ZW5lciB0byBiZSBhIGZ1bmN0aW9uLCBpbnN0ZWFkIGdvdCB0eXBlICVzJywgcmVnaXN0cmF0aW9uTmFtZSwgdHlwZW9mIGxpc3RlbmVyKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgYmFua0ZvclJlZ2lzdHJhdGlvbk5hbWUgPSBsaXN0ZW5lckJhbmtbcmVnaXN0cmF0aW9uTmFtZV0gfHwgKGxpc3RlbmVyQmFua1tyZWdpc3RyYXRpb25OYW1lXSA9IHt9KTtcbiAgICBiYW5rRm9yUmVnaXN0cmF0aW9uTmFtZVtpZF0gPSBsaXN0ZW5lcjtcblxuICAgIHZhciBQbHVnaW5Nb2R1bGUgPSBFdmVudFBsdWdpblJlZ2lzdHJ5LnJlZ2lzdHJhdGlvbk5hbWVNb2R1bGVzW3JlZ2lzdHJhdGlvbk5hbWVdO1xuICAgIGlmIChQbHVnaW5Nb2R1bGUgJiYgUGx1Z2luTW9kdWxlLmRpZFB1dExpc3RlbmVyKSB7XG4gICAgICBQbHVnaW5Nb2R1bGUuZGlkUHV0TGlzdGVuZXIoaWQsIHJlZ2lzdHJhdGlvbk5hbWUsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBJRCBvZiB0aGUgRE9NIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWdpc3RyYXRpb25OYW1lIE5hbWUgb2YgbGlzdGVuZXIgKGUuZy4gYG9uQ2xpY2tgKS5cbiAgICogQHJldHVybiB7P2Z1bmN0aW9ufSBUaGUgc3RvcmVkIGNhbGxiYWNrLlxuICAgKi9cbiAgZ2V0TGlzdGVuZXI6IGZ1bmN0aW9uIChpZCwgcmVnaXN0cmF0aW9uTmFtZSkge1xuICAgIHZhciBiYW5rRm9yUmVnaXN0cmF0aW9uTmFtZSA9IGxpc3RlbmVyQmFua1tyZWdpc3RyYXRpb25OYW1lXTtcbiAgICByZXR1cm4gYmFua0ZvclJlZ2lzdHJhdGlvbk5hbWUgJiYgYmFua0ZvclJlZ2lzdHJhdGlvbk5hbWVbaWRdO1xuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGEgbGlzdGVuZXIgZnJvbSB0aGUgcmVnaXN0cmF0aW9uIGJhbmsuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBJRCBvZiB0aGUgRE9NIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWdpc3RyYXRpb25OYW1lIE5hbWUgb2YgbGlzdGVuZXIgKGUuZy4gYG9uQ2xpY2tgKS5cbiAgICovXG4gIGRlbGV0ZUxpc3RlbmVyOiBmdW5jdGlvbiAoaWQsIHJlZ2lzdHJhdGlvbk5hbWUpIHtcbiAgICB2YXIgUGx1Z2luTW9kdWxlID0gRXZlbnRQbHVnaW5SZWdpc3RyeS5yZWdpc3RyYXRpb25OYW1lTW9kdWxlc1tyZWdpc3RyYXRpb25OYW1lXTtcbiAgICBpZiAoUGx1Z2luTW9kdWxlICYmIFBsdWdpbk1vZHVsZS53aWxsRGVsZXRlTGlzdGVuZXIpIHtcbiAgICAgIFBsdWdpbk1vZHVsZS53aWxsRGVsZXRlTGlzdGVuZXIoaWQsIHJlZ2lzdHJhdGlvbk5hbWUpO1xuICAgIH1cblxuICAgIHZhciBiYW5rRm9yUmVnaXN0cmF0aW9uTmFtZSA9IGxpc3RlbmVyQmFua1tyZWdpc3RyYXRpb25OYW1lXTtcbiAgICAvLyBUT0RPOiBUaGlzIHNob3VsZCBuZXZlciBiZSBudWxsIC0tIHdoZW4gaXMgaXQ/XG4gICAgaWYgKGJhbmtGb3JSZWdpc3RyYXRpb25OYW1lKSB7XG4gICAgICBkZWxldGUgYmFua0ZvclJlZ2lzdHJhdGlvbk5hbWVbaWRdO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlcyBhbGwgbGlzdGVuZXJzIGZvciB0aGUgRE9NIGVsZW1lbnQgd2l0aCB0aGUgc3VwcGxpZWQgSUQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBJRCBvZiB0aGUgRE9NIGVsZW1lbnQuXG4gICAqL1xuICBkZWxldGVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uIChpZCkge1xuICAgIGZvciAodmFyIHJlZ2lzdHJhdGlvbk5hbWUgaW4gbGlzdGVuZXJCYW5rKSB7XG4gICAgICBpZiAoIWxpc3RlbmVyQmFua1tyZWdpc3RyYXRpb25OYW1lXVtpZF0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBQbHVnaW5Nb2R1bGUgPSBFdmVudFBsdWdpblJlZ2lzdHJ5LnJlZ2lzdHJhdGlvbk5hbWVNb2R1bGVzW3JlZ2lzdHJhdGlvbk5hbWVdO1xuICAgICAgaWYgKFBsdWdpbk1vZHVsZSAmJiBQbHVnaW5Nb2R1bGUud2lsbERlbGV0ZUxpc3RlbmVyKSB7XG4gICAgICAgIFBsdWdpbk1vZHVsZS53aWxsRGVsZXRlTGlzdGVuZXIoaWQsIHJlZ2lzdHJhdGlvbk5hbWUpO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgbGlzdGVuZXJCYW5rW3JlZ2lzdHJhdGlvbk5hbWVdW2lkXTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFsbG93cyByZWdpc3RlcmVkIHBsdWdpbnMgYW4gb3Bwb3J0dW5pdHkgdG8gZXh0cmFjdCBldmVudHMgZnJvbSB0b3AtbGV2ZWxcbiAgICogbmF0aXZlIGJyb3dzZXIgZXZlbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9wTGV2ZWxUeXBlIFJlY29yZCBmcm9tIGBFdmVudENvbnN0YW50c2AuXG4gICAqIEBwYXJhbSB7RE9NRXZlbnRUYXJnZXR9IHRvcExldmVsVGFyZ2V0IFRoZSBsaXN0ZW5pbmcgY29tcG9uZW50IHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcExldmVsVGFyZ2V0SUQgSUQgb2YgYHRvcExldmVsVGFyZ2V0YC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICAgKiBAcmV0dXJuIHsqfSBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBleHRyYWN0RXZlbnRzOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KSB7XG4gICAgdmFyIGV2ZW50cztcbiAgICB2YXIgcGx1Z2lucyA9IEV2ZW50UGx1Z2luUmVnaXN0cnkucGx1Z2lucztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIE5vdCBldmVyeSBwbHVnaW4gaW4gdGhlIG9yZGVyaW5nIG1heSBiZSBsb2FkZWQgYXQgcnVudGltZS5cbiAgICAgIHZhciBwb3NzaWJsZVBsdWdpbiA9IHBsdWdpbnNbaV07XG4gICAgICBpZiAocG9zc2libGVQbHVnaW4pIHtcbiAgICAgICAgdmFyIGV4dHJhY3RlZEV2ZW50cyA9IHBvc3NpYmxlUGx1Z2luLmV4dHJhY3RFdmVudHModG9wTGV2ZWxUeXBlLCB0b3BMZXZlbFRhcmdldCwgdG9wTGV2ZWxUYXJnZXRJRCwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbiAgICAgICAgaWYgKGV4dHJhY3RlZEV2ZW50cykge1xuICAgICAgICAgIGV2ZW50cyA9IGFjY3VtdWxhdGVJbnRvKGV2ZW50cywgZXh0cmFjdGVkRXZlbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXZlbnRzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyBhIHN5bnRoZXRpYyBldmVudCB0aGF0IHNob3VsZCBiZSBkaXNwYXRjaGVkIHdoZW5cbiAgICogYHByb2Nlc3NFdmVudFF1ZXVlYCBpcyBpbnZva2VkLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGV2ZW50cyBBbiBhY2N1bXVsYXRpb24gb2Ygc3ludGhldGljIGV2ZW50cy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlRXZlbnRzOiBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gICAgaWYgKGV2ZW50cykge1xuICAgICAgZXZlbnRRdWV1ZSA9IGFjY3VtdWxhdGVJbnRvKGV2ZW50UXVldWUsIGV2ZW50cyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFsbCBzeW50aGV0aWMgZXZlbnRzIG9uIHRoZSBldmVudCBxdWV1ZS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm9jZXNzRXZlbnRRdWV1ZTogZnVuY3Rpb24gKHNpbXVsYXRlZCkge1xuICAgIC8vIFNldCBgZXZlbnRRdWV1ZWAgdG8gbnVsbCBiZWZvcmUgcHJvY2Vzc2luZyBpdCBzbyB0aGF0IHdlIGNhbiB0ZWxsIGlmIG1vcmVcbiAgICAvLyBldmVudHMgZ2V0IGVucXVldWVkIHdoaWxlIHByb2Nlc3NpbmcuXG4gICAgdmFyIHByb2Nlc3NpbmdFdmVudFF1ZXVlID0gZXZlbnRRdWV1ZTtcbiAgICBldmVudFF1ZXVlID0gbnVsbDtcbiAgICBpZiAoc2ltdWxhdGVkKSB7XG4gICAgICBmb3JFYWNoQWNjdW11bGF0ZWQocHJvY2Vzc2luZ0V2ZW50UXVldWUsIGV4ZWN1dGVEaXNwYXRjaGVzQW5kUmVsZWFzZVNpbXVsYXRlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvckVhY2hBY2N1bXVsYXRlZChwcm9jZXNzaW5nRXZlbnRRdWV1ZSwgZXhlY3V0ZURpc3BhdGNoZXNBbmRSZWxlYXNlVG9wTGV2ZWwpO1xuICAgIH1cbiAgICAhIWV2ZW50UXVldWUgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAncHJvY2Vzc0V2ZW50UXVldWUoKTogQWRkaXRpb25hbCBldmVudHMgd2VyZSBlbnF1ZXVlZCB3aGlsZSBwcm9jZXNzaW5nICcgKyAnYW4gZXZlbnQgcXVldWUuIFN1cHBvcnQgZm9yIHRoaXMgaGFzIG5vdCB5ZXQgYmVlbiBpbXBsZW1lbnRlZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgLy8gVGhpcyB3b3VsZCBiZSBhIGdvb2QgdGltZSB0byByZXRocm93IGlmIGFueSBvZiB0aGUgZXZlbnQgaGFuZGxlcnMgdGhyZXcuXG4gICAgUmVhY3RFcnJvclV0aWxzLnJldGhyb3dDYXVnaHRFcnJvcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGVzZSBhcmUgbmVlZGVkIGZvciB0ZXN0cyBvbmx5LiBEbyBub3QgdXNlIVxuICAgKi9cbiAgX19wdXJnZTogZnVuY3Rpb24gKCkge1xuICAgIGxpc3RlbmVyQmFuayA9IHt9O1xuICB9LFxuXG4gIF9fZ2V0TGlzdGVuZXJCYW5rOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQmFuaztcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50UGx1Z2luSHViOyJdfQ==