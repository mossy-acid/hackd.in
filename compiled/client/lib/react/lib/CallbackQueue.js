/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CallbackQueue
 */

'use strict';

var PooledClass = require('./PooledClass');

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */
function CallbackQueue() {
  this._callbacks = null;
  this._contexts = null;
}

assign(CallbackQueue.prototype, {

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */
  enqueue: function enqueue(callback, context) {
    this._callbacks = this._callbacks || [];
    this._contexts = this._contexts || [];
    this._callbacks.push(callback);
    this._contexts.push(context);
  },

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */
  notifyAll: function notifyAll() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    if (callbacks) {
      !(callbacks.length === contexts.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Mismatched list of contexts in callback queue') : invariant(false) : undefined;
      this._callbacks = null;
      this._contexts = null;
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(contexts[i]);
      }
      callbacks.length = 0;
      contexts.length = 0;
    }
  },

  /**
   * Resets the internal queue.
   *
   * @internal
   */
  reset: function reset() {
    this._callbacks = null;
    this._contexts = null;
  },

  /**
   * `PooledClass` looks for this.
   */
  destructor: function destructor() {
    this.reset();
  }

});

PooledClass.addPoolingTo(CallbackQueue);

module.exports = CallbackQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0NhbGxiYWNrUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWQ7O0FBRUosSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDtBQUNKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7QUFhSixTQUFTLGFBQVQsR0FBeUI7QUFDdkIsT0FBSyxVQUFMLEdBQWtCLElBQWxCLENBRHVCO0FBRXZCLE9BQUssU0FBTCxHQUFpQixJQUFqQixDQUZ1QjtDQUF6Qjs7QUFLQSxPQUFPLGNBQWMsU0FBZCxFQUF5Qjs7Ozs7Ozs7O0FBUzlCLFdBQVMsaUJBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QjtBQUNwQyxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLElBQW1CLEVBQW5CLENBRGtCO0FBRXBDLFNBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsSUFBa0IsRUFBbEIsQ0FGbUI7QUFHcEMsU0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLFFBQXJCLEVBSG9DO0FBSXBDLFNBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsT0FBcEIsRUFKb0M7R0FBN0I7Ozs7Ozs7O0FBYVQsYUFBVyxxQkFBWTtBQUNyQixRQUFJLFlBQVksS0FBSyxVQUFMLENBREs7QUFFckIsUUFBSSxXQUFXLEtBQUssU0FBTCxDQUZNO0FBR3JCLFFBQUksU0FBSixFQUFlO0FBQ2IsUUFBRSxVQUFVLE1BQVYsS0FBcUIsU0FBUyxNQUFULENBQXZCLEdBQTBDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLCtDQUFqQixDQUF4QyxHQUE0RyxVQUFVLEtBQVYsQ0FBNUcsR0FBK0gsU0FBekssQ0FEYTtBQUViLFdBQUssVUFBTCxHQUFrQixJQUFsQixDQUZhO0FBR2IsV0FBSyxTQUFMLEdBQWlCLElBQWpCLENBSGE7QUFJYixXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxVQUFVLE1BQVYsRUFBa0IsR0FBdEMsRUFBMkM7QUFDekMsa0JBQVUsQ0FBVixFQUFhLElBQWIsQ0FBa0IsU0FBUyxDQUFULENBQWxCLEVBRHlDO09BQTNDO0FBR0EsZ0JBQVUsTUFBVixHQUFtQixDQUFuQixDQVBhO0FBUWIsZUFBUyxNQUFULEdBQWtCLENBQWxCLENBUmE7S0FBZjtHQUhTOzs7Ozs7O0FBb0JYLFNBQU8saUJBQVk7QUFDakIsU0FBSyxVQUFMLEdBQWtCLElBQWxCLENBRGlCO0FBRWpCLFNBQUssU0FBTCxHQUFpQixJQUFqQixDQUZpQjtHQUFaOzs7OztBQVFQLGNBQVksc0JBQVk7QUFDdEIsU0FBSyxLQUFMLEdBRHNCO0dBQVo7O0NBbERkOztBQXdEQSxZQUFZLFlBQVosQ0FBeUIsYUFBekI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6IkNhbGxiYWNrUXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgQ2FsbGJhY2tRdWV1ZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFBvb2xlZENsYXNzID0gcmVxdWlyZSgnLi9Qb29sZWRDbGFzcycpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCBwc2V1ZG8tZXZlbnQgbW9kdWxlIHRvIGhlbHAga2VlcCB0cmFjayBvZiBjb21wb25lbnRzIHdhaXRpbmcgdG9cbiAqIGJlIG5vdGlmaWVkIHdoZW4gdGhlaXIgRE9NIHJlcHJlc2VudGF0aW9ucyBhcmUgYXZhaWxhYmxlIGZvciB1c2UuXG4gKlxuICogVGhpcyBpbXBsZW1lbnRzIGBQb29sZWRDbGFzc2AsIHNvIHlvdSBzaG91bGQgbmV2ZXIgbmVlZCB0byBpbnN0YW50aWF0ZSB0aGlzLlxuICogSW5zdGVhZCwgdXNlIGBDYWxsYmFja1F1ZXVlLmdldFBvb2xlZCgpYC5cbiAqXG4gKiBAY2xhc3MgUmVhY3RNb3VudFJlYWR5XG4gKiBAaW1wbGVtZW50cyBQb29sZWRDbGFzc1xuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIENhbGxiYWNrUXVldWUoKSB7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IG51bGw7XG4gIHRoaXMuX2NvbnRleHRzID0gbnVsbDtcbn1cblxuYXNzaWduKENhbGxiYWNrUXVldWUucHJvdG90eXBlLCB7XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIGBub3RpZnlBbGxgIGlzIGludm9rZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEludm9rZWQgd2hlbiBgbm90aWZ5QWxsYCBpcyBpbnZva2VkLlxuICAgKiBAcGFyYW0gez9vYmplY3R9IGNvbnRleHQgQ29udGV4dCB0byBjYWxsIGBjYWxsYmFja2Agd2l0aC5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwgW107XG4gICAgdGhpcy5fY29udGV4dHMgPSB0aGlzLl9jb250ZXh0cyB8fCBbXTtcbiAgICB0aGlzLl9jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgdGhpcy5fY29udGV4dHMucHVzaChjb250ZXh0KTtcbiAgfSxcblxuICAvKipcbiAgICogSW52b2tlcyBhbGwgZW5xdWV1ZWQgY2FsbGJhY2tzIGFuZCBjbGVhcnMgdGhlIHF1ZXVlLiBUaGlzIGlzIGludm9rZWQgYWZ0ZXJcbiAgICogdGhlIERPTSByZXByZXNlbnRhdGlvbiBvZiBhIGNvbXBvbmVudCBoYXMgYmVlbiBjcmVhdGVkIG9yIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgbm90aWZ5QWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcztcbiAgICB2YXIgY29udGV4dHMgPSB0aGlzLl9jb250ZXh0cztcbiAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAhKGNhbGxiYWNrcy5sZW5ndGggPT09IGNvbnRleHRzLmxlbmd0aCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnTWlzbWF0Y2hlZCBsaXN0IG9mIGNvbnRleHRzIGluIGNhbGxiYWNrIHF1ZXVlJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fY2FsbGJhY2tzID0gbnVsbDtcbiAgICAgIHRoaXMuX2NvbnRleHRzID0gbnVsbDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrc1tpXS5jYWxsKGNvbnRleHRzW2ldKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgICAgY29udGV4dHMubGVuZ3RoID0gMDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJuYWwgcXVldWUuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHRzID0gbnVsbDtcbiAgfSxcblxuICAvKipcbiAgICogYFBvb2xlZENsYXNzYCBsb29rcyBmb3IgdGhpcy5cbiAgICovXG4gIGRlc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxufSk7XG5cblBvb2xlZENsYXNzLmFkZFBvb2xpbmdUbyhDYWxsYmFja1F1ZXVlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYWxsYmFja1F1ZXVlOyJdfQ==