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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0NhbGxiYWNrUXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVMsYUFBVCxHQUF5QjtBQUN2QixPQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDRDs7QUFFRCxPQUFPLGNBQWMsU0FBckIsRUFBZ0M7Ozs7Ozs7OztBQVM5QixXQUFTLGlCQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDcEMsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxJQUFtQixFQUFyQztBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsSUFBa0IsRUFBbkM7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsUUFBckI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLE9BQXBCO0FBQ0QsR0FkNkI7Ozs7Ozs7O0FBc0I5QixhQUFXLHFCQUFZO0FBQ3JCLFFBQUksWUFBWSxLQUFLLFVBQXJCO0FBQ0EsUUFBSSxXQUFXLEtBQUssU0FBcEI7QUFDQSxRQUFJLFNBQUosRUFBZTtBQUNiLFFBQUUsVUFBVSxNQUFWLEtBQXFCLFNBQVMsTUFBaEMsSUFBMEMsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsK0NBQWpCLENBQXhDLEdBQTRHLFVBQVUsS0FBVixDQUF0SixHQUF5SyxTQUF6SztBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLGtCQUFVLENBQVYsRUFBYSxJQUFiLENBQWtCLFNBQVMsQ0FBVCxDQUFsQjtBQUNEO0FBQ0QsZ0JBQVUsTUFBVixHQUFtQixDQUFuQjtBQUNBLGVBQVMsTUFBVCxHQUFrQixDQUFsQjtBQUNEO0FBQ0YsR0FuQzZCOzs7Ozs7O0FBMEM5QixTQUFPLGlCQUFZO0FBQ2pCLFNBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNELEdBN0M2Qjs7Ozs7QUFrRDlCLGNBQVksc0JBQVk7QUFDdEIsU0FBSyxLQUFMO0FBQ0Q7O0FBcEQ2QixDQUFoQzs7QUF3REEsWUFBWSxZQUFaLENBQXlCLGFBQXpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJDYWxsYmFja1F1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIENhbGxiYWNrUXVldWVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBQb29sZWRDbGFzcyA9IHJlcXVpcmUoJy4vUG9vbGVkQ2xhc3MnKTtcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgcHNldWRvLWV2ZW50IG1vZHVsZSB0byBoZWxwIGtlZXAgdHJhY2sgb2YgY29tcG9uZW50cyB3YWl0aW5nIHRvXG4gKiBiZSBub3RpZmllZCB3aGVuIHRoZWlyIERPTSByZXByZXNlbnRhdGlvbnMgYXJlIGF2YWlsYWJsZSBmb3IgdXNlLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50cyBgUG9vbGVkQ2xhc3NgLCBzbyB5b3Ugc2hvdWxkIG5ldmVyIG5lZWQgdG8gaW5zdGFudGlhdGUgdGhpcy5cbiAqIEluc3RlYWQsIHVzZSBgQ2FsbGJhY2tRdWV1ZS5nZXRQb29sZWQoKWAuXG4gKlxuICogQGNsYXNzIFJlYWN0TW91bnRSZWFkeVxuICogQGltcGxlbWVudHMgUG9vbGVkQ2xhc3NcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBDYWxsYmFja1F1ZXVlKCkge1xuICB0aGlzLl9jYWxsYmFja3MgPSBudWxsO1xuICB0aGlzLl9jb250ZXh0cyA9IG51bGw7XG59XG5cbmFzc2lnbihDYWxsYmFja1F1ZXVlLnByb3RvdHlwZSwge1xuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiBgbm90aWZ5QWxsYCBpcyBpbnZva2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBJbnZva2VkIHdoZW4gYG5vdGlmeUFsbGAgaXMgaW52b2tlZC5cbiAgICogQHBhcmFtIHs/b2JqZWN0fSBjb250ZXh0IENvbnRleHQgdG8gY2FsbCBgY2FsbGJhY2tgIHdpdGguXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IFtdO1xuICAgIHRoaXMuX2NvbnRleHRzID0gdGhpcy5fY29udGV4dHMgfHwgW107XG4gICAgdGhpcy5fY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIHRoaXMuX2NvbnRleHRzLnB1c2goY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEludm9rZXMgYWxsIGVucXVldWVkIGNhbGxiYWNrcyBhbmQgY2xlYXJzIHRoZSBxdWV1ZS4gVGhpcyBpcyBpbnZva2VkIGFmdGVyXG4gICAqIHRoZSBET00gcmVwcmVzZW50YXRpb24gb2YgYSBjb21wb25lbnQgaGFzIGJlZW4gY3JlYXRlZCBvciB1cGRhdGVkLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG5vdGlmeUFsbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3M7XG4gICAgdmFyIGNvbnRleHRzID0gdGhpcy5fY29udGV4dHM7XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgIShjYWxsYmFja3MubGVuZ3RoID09PSBjb250ZXh0cy5sZW5ndGgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ01pc21hdGNoZWQgbGlzdCBvZiBjb250ZXh0cyBpbiBjYWxsYmFjayBxdWV1ZScpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2NhbGxiYWNrcyA9IG51bGw7XG4gICAgICB0aGlzLl9jb250ZXh0cyA9IG51bGw7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYWxsYmFja3NbaV0uY2FsbChjb250ZXh0c1tpXSk7XG4gICAgICB9XG4gICAgICBjYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICAgIGNvbnRleHRzLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGludGVybmFsIHF1ZXVlLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0gbnVsbDtcbiAgICB0aGlzLl9jb250ZXh0cyA9IG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIGBQb29sZWRDbGFzc2AgbG9va3MgZm9yIHRoaXMuXG4gICAqL1xuICBkZXN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbn0pO1xuXG5Qb29sZWRDbGFzcy5hZGRQb29saW5nVG8oQ2FsbGJhY2tRdWV1ZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FsbGJhY2tRdWV1ZTsiXX0=