/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Transaction
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM updates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function reinitializeTransaction() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (this.wrapperInitData) {
      this.wrapperInitData.length = 0;
    } else {
      this.wrapperInitData = [];
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function isInTransaction() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked. The optional arguments helps prevent the need
   * to bind in many cases.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} a Argument to pass to the method.
   * @param {Object?=} b Argument to pass to the method.
   * @param {Object?=} c Argument to pass to the method.
   * @param {Object?=} d Argument to pass to the method.
   * @param {Object?=} e Argument to pass to the method.
   * @param {Object?=} f Argument to pass to the method.
   *
   * @return {*} Return value from `method`.
   */
  perform: function perform(method, scope, a, b, c, d, e, f) {
    !!this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.perform(...): Cannot initialize a transaction when there ' + 'is already an outstanding transaction.') : invariant(false) : undefined;
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {}
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function initializeAll(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
      } finally {
        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {}
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function closeAll(startIndex) {
    !this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Transaction.closeAll(): Cannot close transaction when none are open.') : invariant(false) : undefined;
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== Transaction.OBSERVED_ERROR && wrapper.close) {
          wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {}
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occurred.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1RyYW5zYWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStEQSxJQUFJLFFBQVE7Ozs7Ozs7O0FBUVYsMkJBQXlCLG1DQUFZO0FBQ25DLFNBQUssbUJBQUwsR0FBMkIsS0FBSyxzQkFBTCxFQUEzQjtBQUNBLFFBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLFdBQUssZUFBTCxDQUFxQixNQUFyQixHQUE4QixDQUE5QjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0QsU0FBSyxnQkFBTCxHQUF3QixLQUF4QjtBQUNELEdBaEJTOztBQWtCVixvQkFBa0IsS0FsQlI7Ozs7OztBQXdCViwwQkFBd0IsSUF4QmQ7O0FBMEJWLG1CQUFpQiwyQkFBWTtBQUMzQixXQUFPLENBQUMsQ0FBQyxLQUFLLGdCQUFkO0FBQ0QsR0E1QlM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQ1YsV0FBUyxpQkFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLEVBQTJDO0FBQ2xELEtBQUMsQ0FBQyxLQUFLLGVBQUwsRUFBRixHQUEyQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiwwRUFBMEUsd0NBQTNGLENBQXhDLEdBQStLLFVBQVUsS0FBVixDQUExTSxHQUE2TixTQUE3TjtBQUNBLFFBQUksV0FBSjtBQUNBLFFBQUksR0FBSjtBQUNBLFFBQUk7QUFDRixXQUFLLGdCQUFMLEdBQXdCLElBQXhCOzs7OztBQUtBLG9CQUFjLElBQWQ7QUFDQSxXQUFLLGFBQUwsQ0FBbUIsQ0FBbkI7QUFDQSxZQUFNLE9BQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsQ0FBTjtBQUNBLG9CQUFjLEtBQWQ7QUFDRCxLQVZELFNBVVU7QUFDUixVQUFJO0FBQ0YsWUFBSSxXQUFKLEVBQWlCOzs7QUFHZixjQUFJO0FBQ0YsaUJBQUssUUFBTCxDQUFjLENBQWQ7QUFDRCxXQUZELENBRUUsT0FBTyxHQUFQLEVBQVksQ0FBRTtBQUNqQixTQU5ELE1BTU87OztBQUdMLGVBQUssUUFBTCxDQUFjLENBQWQ7QUFDRDtBQUNGLE9BWkQsU0FZVTtBQUNSLGFBQUssZ0JBQUwsR0FBd0IsS0FBeEI7QUFDRDtBQUNGO0FBQ0QsV0FBTyxHQUFQO0FBQ0QsR0EvRVM7O0FBaUZWLGlCQUFlLHVCQUFVLFVBQVYsRUFBc0I7QUFDbkMsUUFBSSxzQkFBc0IsS0FBSyxtQkFBL0I7QUFDQSxTQUFLLElBQUksSUFBSSxVQUFiLEVBQXlCLElBQUksb0JBQW9CLE1BQWpELEVBQXlELEdBQXpELEVBQThEO0FBQzVELFVBQUksVUFBVSxvQkFBb0IsQ0FBcEIsQ0FBZDtBQUNBLFVBQUk7Ozs7O0FBS0YsYUFBSyxlQUFMLENBQXFCLENBQXJCLElBQTBCLFlBQVksY0FBdEM7QUFDQSxhQUFLLGVBQUwsQ0FBcUIsQ0FBckIsSUFBMEIsUUFBUSxVQUFSLEdBQXFCLFFBQVEsVUFBUixDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQixHQUFxRCxJQUEvRTtBQUNELE9BUEQsU0FPVTtBQUNSLFlBQUksS0FBSyxlQUFMLENBQXFCLENBQXJCLE1BQTRCLFlBQVksY0FBNUMsRUFBNEQ7Ozs7QUFJMUQsY0FBSTtBQUNGLGlCQUFLLGFBQUwsQ0FBbUIsSUFBSSxDQUF2QjtBQUNELFdBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWSxDQUFFO0FBQ2pCO0FBQ0Y7QUFDRjtBQUNGLEdBdkdTOzs7Ozs7OztBQStHVixZQUFVLGtCQUFVLFVBQVYsRUFBc0I7QUFDOUIsS0FBQyxLQUFLLGVBQUwsRUFBRCxHQUEwQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQixzRUFBakIsQ0FBeEMsR0FBbUksVUFBVSxLQUFWLENBQTdKLEdBQWdMLFNBQWhMO0FBQ0EsUUFBSSxzQkFBc0IsS0FBSyxtQkFBL0I7QUFDQSxTQUFLLElBQUksSUFBSSxVQUFiLEVBQXlCLElBQUksb0JBQW9CLE1BQWpELEVBQXlELEdBQXpELEVBQThEO0FBQzVELFVBQUksVUFBVSxvQkFBb0IsQ0FBcEIsQ0FBZDtBQUNBLFVBQUksV0FBVyxLQUFLLGVBQUwsQ0FBcUIsQ0FBckIsQ0FBZjtBQUNBLFVBQUksV0FBSjtBQUNBLFVBQUk7Ozs7O0FBS0Ysc0JBQWMsSUFBZDtBQUNBLFlBQUksYUFBYSxZQUFZLGNBQXpCLElBQTJDLFFBQVEsS0FBdkQsRUFBOEQ7QUFDNUQsa0JBQVEsS0FBUixDQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsUUFBekI7QUFDRDtBQUNELHNCQUFjLEtBQWQ7QUFDRCxPQVZELFNBVVU7QUFDUixZQUFJLFdBQUosRUFBaUI7Ozs7QUFJZixjQUFJO0FBQ0YsaUJBQUssUUFBTCxDQUFjLElBQUksQ0FBbEI7QUFDRCxXQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNmO0FBQ0Y7QUFDRjtBQUNELFNBQUssZUFBTCxDQUFxQixNQUFyQixHQUE4QixDQUE5QjtBQUNEO0FBNUlTLENBQVo7O0FBK0lBLElBQUksY0FBYzs7QUFFaEIsU0FBTyxLQUZTOzs7OztBQU9oQixrQkFBZ0I7O0FBUEEsQ0FBbEI7O0FBV0EsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6IlRyYW5zYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFRyYW5zYWN0aW9uXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbi8qKlxuICogYFRyYW5zYWN0aW9uYCBjcmVhdGVzIGEgYmxhY2sgYm94IHRoYXQgaXMgYWJsZSB0byB3cmFwIGFueSBtZXRob2Qgc3VjaCB0aGF0XG4gKiBjZXJ0YWluIGludmFyaWFudHMgYXJlIG1haW50YWluZWQgYmVmb3JlIGFuZCBhZnRlciB0aGUgbWV0aG9kIGlzIGludm9rZWRcbiAqIChFdmVuIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gd2hpbGUgaW52b2tpbmcgdGhlIHdyYXBwZWQgbWV0aG9kKS4gV2hvZXZlclxuICogaW5zdGFudGlhdGVzIGEgdHJhbnNhY3Rpb24gY2FuIHByb3ZpZGUgZW5mb3JjZXJzIG9mIHRoZSBpbnZhcmlhbnRzIGF0XG4gKiBjcmVhdGlvbiB0aW1lLiBUaGUgYFRyYW5zYWN0aW9uYCBjbGFzcyBpdHNlbGYgd2lsbCBzdXBwbHkgb25lIGFkZGl0aW9uYWxcbiAqIGF1dG9tYXRpYyBpbnZhcmlhbnQgZm9yIHlvdSAtIHRoZSBpbnZhcmlhbnQgdGhhdCBhbnkgdHJhbnNhY3Rpb24gaW5zdGFuY2VcbiAqIHNob3VsZCBub3QgYmUgcnVuIHdoaWxlIGl0IGlzIGFscmVhZHkgYmVpbmcgcnVuLiBZb3Ugd291bGQgdHlwaWNhbGx5IGNyZWF0ZSBhXG4gKiBzaW5nbGUgaW5zdGFuY2Ugb2YgYSBgVHJhbnNhY3Rpb25gIGZvciByZXVzZSBtdWx0aXBsZSB0aW1lcywgdGhhdCBwb3RlbnRpYWxseVxuICogaXMgdXNlZCB0byB3cmFwIHNldmVyYWwgZGlmZmVyZW50IG1ldGhvZHMuIFdyYXBwZXJzIGFyZSBleHRyZW1lbHkgc2ltcGxlIC1cbiAqIHRoZXkgb25seSByZXF1aXJlIGltcGxlbWVudGluZyB0d28gbWV0aG9kcy5cbiAqXG4gKiA8cHJlPlxuICogICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXJzIChpbmplY3RlZCBhdCBjcmVhdGlvbiB0aW1lKVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgICAgICAgICtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tfC0tLS0tLS0tLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgIHYgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgICAgKy0tLS0tLS0tLS0tLS0tLSsgICB8ICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCAgICstLXwgICAgd3JhcHBlcjEgICB8LS0tfC0tLS0rICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgIHwgICB8ICArLS0tLS0tLS0tLS0tLS0tKyAgIHYgICAgfCAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgfCAgICAgICAgICArLS0tLS0tLS0tLS0tLSsgIHwgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCAgIHwgICAgICstLS0tfCAgIHdyYXBwZXIyICB8LS0tLS0tLS0rICAgfFxuICogICAgICAgICAgICAgICAgICAgIHwgICB8ICAgICB8ICAgICstLS0tLS0tLS0tLS0tKyAgfCAgICAgfCAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgfCAgICAgfCAgICAgICAgICAgICAgICAgICAgIHwgICAgIHwgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCAgIHYgICAgIHYgICAgICAgICAgICAgICAgICAgICB2ICAgICB2ICAgfCB3cmFwcGVyXG4gKiAgICAgICAgICAgICAgICAgICAgfCArLS0tKyArLS0tKyAgICstLS0tLS0tLS0rICAgKy0tLSsgKy0tLSsgfCBpbnZhcmlhbnRzXG4gKiBwZXJmb3JtKGFueU1ldGhvZCkgfCB8ICAgfCB8ICAgfCAgIHwgICAgICAgICB8ICAgfCAgIHwgfCAgIHwgfCBtYWludGFpbmVkXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0+fC18LS0tfC18LS0tfC0tPnxhbnlNZXRob2R8LS0tfC0tLXwtfC0tLXwtfC0tLS0tLS0tPlxuICogICAgICAgICAgICAgICAgICAgIHwgfCAgIHwgfCAgIHwgICB8ICAgICAgICAgfCAgIHwgICB8IHwgICB8IHxcbiAqICAgICAgICAgICAgICAgICAgICB8IHwgICB8IHwgICB8ICAgfCAgICAgICAgIHwgICB8ICAgfCB8ICAgfCB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCB8ICAgfCB8ICAgfCAgIHwgICAgICAgICB8ICAgfCAgIHwgfCAgIHwgfFxuICogICAgICAgICAgICAgICAgICAgIHwgKy0tLSsgKy0tLSsgICArLS0tLS0tLS0tKyAgICstLS0rICstLS0rIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICBpbml0aWFsaXplICAgICAgICAgICAgICAgICAgICBjbG9zZSAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICogPC9wcmU+XG4gKlxuICogVXNlIGNhc2VzOlxuICogLSBQcmVzZXJ2aW5nIHRoZSBpbnB1dCBzZWxlY3Rpb24gcmFuZ2VzIGJlZm9yZS9hZnRlciByZWNvbmNpbGlhdGlvbi5cbiAqICAgUmVzdG9yaW5nIHNlbGVjdGlvbiBldmVuIGluIHRoZSBldmVudCBvZiBhbiB1bmV4cGVjdGVkIGVycm9yLlxuICogLSBEZWFjdGl2YXRpbmcgZXZlbnRzIHdoaWxlIHJlYXJyYW5naW5nIHRoZSBET00sIHByZXZlbnRpbmcgYmx1cnMvZm9jdXNlcyxcbiAqICAgd2hpbGUgZ3VhcmFudGVlaW5nIHRoYXQgYWZ0ZXJ3YXJkcywgdGhlIGV2ZW50IHN5c3RlbSBpcyByZWFjdGl2YXRlZC5cbiAqIC0gRmx1c2hpbmcgYSBxdWV1ZSBvZiBjb2xsZWN0ZWQgRE9NIG11dGF0aW9ucyB0byB0aGUgbWFpbiBVSSB0aHJlYWQgYWZ0ZXIgYVxuICogICByZWNvbmNpbGlhdGlvbiB0YWtlcyBwbGFjZSBpbiBhIHdvcmtlciB0aHJlYWQuXG4gKiAtIEludm9raW5nIGFueSBjb2xsZWN0ZWQgYGNvbXBvbmVudERpZFVwZGF0ZWAgY2FsbGJhY2tzIGFmdGVyIHJlbmRlcmluZyBuZXdcbiAqICAgY29udGVudC5cbiAqIC0gKEZ1dHVyZSB1c2UgY2FzZSk6IFdyYXBwaW5nIHBhcnRpY3VsYXIgZmx1c2hlcyBvZiB0aGUgYFJlYWN0V29ya2VyYCBxdWV1ZVxuICogICB0byBwcmVzZXJ2ZSB0aGUgYHNjcm9sbFRvcGAgKGFuIGF1dG9tYXRpYyBzY3JvbGwgYXdhcmUgRE9NKS5cbiAqIC0gKEZ1dHVyZSB1c2UgY2FzZSk6IExheW91dCBjYWxjdWxhdGlvbnMgYmVmb3JlIGFuZCBhZnRlciBET00gdXBkYXRlcy5cbiAqXG4gKiBUcmFuc2FjdGlvbmFsIHBsdWdpbiBBUEk6XG4gKiAtIEEgbW9kdWxlIHRoYXQgaGFzIGFuIGBpbml0aWFsaXplYCBtZXRob2QgdGhhdCByZXR1cm5zIGFueSBwcmVjb21wdXRhdGlvbi5cbiAqIC0gYW5kIGEgYGNsb3NlYCBtZXRob2QgdGhhdCBhY2NlcHRzIHRoZSBwcmVjb21wdXRhdGlvbi4gYGNsb3NlYCBpcyBpbnZva2VkXG4gKiAgIHdoZW4gdGhlIHdyYXBwZWQgcHJvY2VzcyBpcyBjb21wbGV0ZWQsIG9yIGhhcyBmYWlsZWQuXG4gKlxuICogQHBhcmFtIHtBcnJheTxUcmFuc2FjdGlvbmFsV3JhcHBlcj59IHRyYW5zYWN0aW9uV3JhcHBlciBXcmFwcGVyIG1vZHVsZXNcbiAqIHRoYXQgaW1wbGVtZW50IGBpbml0aWFsaXplYCBhbmQgYGNsb3NlYC5cbiAqIEByZXR1cm4ge1RyYW5zYWN0aW9ufSBTaW5nbGUgdHJhbnNhY3Rpb24gZm9yIHJldXNlIGluIHRocmVhZC5cbiAqXG4gKiBAY2xhc3MgVHJhbnNhY3Rpb25cbiAqL1xudmFyIE1peGluID0ge1xuICAvKipcbiAgICogU2V0cyB1cCB0aGlzIGluc3RhbmNlIHNvIHRoYXQgaXQgaXMgcHJlcGFyZWQgZm9yIGNvbGxlY3RpbmcgbWV0cmljcy4gRG9lc1xuICAgKiBzbyBzdWNoIHRoYXQgdGhpcyBzZXR1cCBtZXRob2QgbWF5IGJlIHVzZWQgb24gYW4gaW5zdGFuY2UgdGhhdCBpcyBhbHJlYWR5XG4gICAqIGluaXRpYWxpemVkLCBpbiBhIHdheSB0aGF0IGRvZXMgbm90IGNvbnN1bWUgYWRkaXRpb25hbCBtZW1vcnkgdXBvbiByZXVzZS5cbiAgICogVGhhdCBjYW4gYmUgdXNlZnVsIGlmIHlvdSBkZWNpZGUgdG8gbWFrZSB5b3VyIHN1YmNsYXNzIG9mIHRoaXMgbWl4aW4gYVxuICAgKiBcIlBvb2xlZENsYXNzXCIuXG4gICAqL1xuICByZWluaXRpYWxpemVUcmFuc2FjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudHJhbnNhY3Rpb25XcmFwcGVycyA9IHRoaXMuZ2V0VHJhbnNhY3Rpb25XcmFwcGVycygpO1xuICAgIGlmICh0aGlzLndyYXBwZXJJbml0RGF0YSkge1xuICAgICAgdGhpcy53cmFwcGVySW5pdERhdGEubGVuZ3RoID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53cmFwcGVySW5pdERhdGEgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5faXNJblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gIH0sXG5cbiAgX2lzSW5UcmFuc2FjdGlvbjogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKiBAcmV0dXJuIHtBcnJheTxUcmFuc2FjdGlvbldyYXBwZXI+fSBBcnJheSBvZiB0cmFuc2FjdGlvbiB3cmFwcGVycy5cbiAgICovXG4gIGdldFRyYW5zYWN0aW9uV3JhcHBlcnM6IG51bGwsXG5cbiAgaXNJblRyYW5zYWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5faXNJblRyYW5zYWN0aW9uO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgZnVuY3Rpb24gd2l0aGluIGEgc2FmZXR5IHdpbmRvdy4gVXNlIHRoaXMgZm9yIHRoZSB0b3AgbGV2ZWxcbiAgICogbWV0aG9kcyB0aGF0IHJlc3VsdCBpbiBsYXJnZSBhbW91bnRzIG9mIGNvbXB1dGF0aW9uL211dGF0aW9ucyB0aGF0IHdvdWxkXG4gICAqIG5lZWQgdG8gYmUgc2FmZXR5IGNoZWNrZWQuIFRoZSBvcHRpb25hbCBhcmd1bWVudHMgaGVscHMgcHJldmVudCB0aGUgbmVlZFxuICAgKiB0byBiaW5kIGluIG1hbnkgY2FzZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZCBNZW1iZXIgb2Ygc2NvcGUgdG8gY2FsbC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlIFNjb3BlIHRvIGludm9rZSBmcm9tLlxuICAgKiBAcGFyYW0ge09iamVjdD89fSBhIEFyZ3VtZW50IHRvIHBhc3MgdG8gdGhlIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gYiBBcmd1bWVudCB0byBwYXNzIHRvIHRoZSBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGMgQXJndW1lbnQgdG8gcGFzcyB0byB0aGUgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdD89fSBkIEFyZ3VtZW50IHRvIHBhc3MgdG8gdGhlIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gZSBBcmd1bWVudCB0byBwYXNzIHRvIHRoZSBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGYgQXJndW1lbnQgdG8gcGFzcyB0byB0aGUgbWV0aG9kLlxuICAgKlxuICAgKiBAcmV0dXJuIHsqfSBSZXR1cm4gdmFsdWUgZnJvbSBgbWV0aG9kYC5cbiAgICovXG4gIHBlcmZvcm06IGZ1bmN0aW9uIChtZXRob2QsIHNjb3BlLCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgISF0aGlzLmlzSW5UcmFuc2FjdGlvbigpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1RyYW5zYWN0aW9uLnBlcmZvcm0oLi4uKTogQ2Fubm90IGluaXRpYWxpemUgYSB0cmFuc2FjdGlvbiB3aGVuIHRoZXJlICcgKyAnaXMgYWxyZWFkeSBhbiBvdXRzdGFuZGluZyB0cmFuc2FjdGlvbi4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGVycm9yVGhyb3duO1xuICAgIHZhciByZXQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2lzSW5UcmFuc2FjdGlvbiA9IHRydWU7XG4gICAgICAvLyBDYXRjaGluZyBlcnJvcnMgbWFrZXMgZGVidWdnaW5nIG1vcmUgZGlmZmljdWx0LCBzbyB3ZSBzdGFydCB3aXRoXG4gICAgICAvLyBlcnJvclRocm93biBzZXQgdG8gdHJ1ZSBiZWZvcmUgc2V0dGluZyBpdCB0byBmYWxzZSBhZnRlciBjYWxsaW5nXG4gICAgICAvLyBjbG9zZSAtLSBpZiBpdCdzIHN0aWxsIHNldCB0byB0cnVlIGluIHRoZSBmaW5hbGx5IGJsb2NrLCBpdCBtZWFuc1xuICAgICAgLy8gb25lIG9mIHRoZXNlIGNhbGxzIHRocmV3LlxuICAgICAgZXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgdGhpcy5pbml0aWFsaXplQWxsKDApO1xuICAgICAgcmV0ID0gbWV0aG9kLmNhbGwoc2NvcGUsIGEsIGIsIGMsIGQsIGUsIGYpO1xuICAgICAgZXJyb3JUaHJvd24gPSBmYWxzZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgLy8gSWYgYG1ldGhvZGAgdGhyb3dzLCBwcmVmZXIgdG8gc2hvdyB0aGF0IHN0YWNrIHRyYWNlIG92ZXIgYW55IHRocm93blxuICAgICAgICAgIC8vIGJ5IGludm9raW5nIGBjbG9zZUFsbGAuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VBbGwoMCk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNpbmNlIGBtZXRob2RgIGRpZG4ndCB0aHJvdywgd2UgZG9uJ3Qgd2FudCB0byBzaWxlbmNlIHRoZSBleGNlcHRpb25cbiAgICAgICAgICAvLyBoZXJlLlxuICAgICAgICAgIHRoaXMuY2xvc2VBbGwoMCk7XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuX2lzSW5UcmFuc2FjdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIGluaXRpYWxpemVBbGw6IGZ1bmN0aW9uIChzdGFydEluZGV4KSB7XG4gICAgdmFyIHRyYW5zYWN0aW9uV3JhcHBlcnMgPSB0aGlzLnRyYW5zYWN0aW9uV3JhcHBlcnM7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7IGkgPCB0cmFuc2FjdGlvbldyYXBwZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgd3JhcHBlciA9IHRyYW5zYWN0aW9uV3JhcHBlcnNbaV07XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDYXRjaGluZyBlcnJvcnMgbWFrZXMgZGVidWdnaW5nIG1vcmUgZGlmZmljdWx0LCBzbyB3ZSBzdGFydCB3aXRoIHRoZVxuICAgICAgICAvLyBPQlNFUlZFRF9FUlJPUiBzdGF0ZSBiZWZvcmUgb3ZlcndyaXRpbmcgaXQgd2l0aCB0aGUgcmVhbCByZXR1cm4gdmFsdWVcbiAgICAgICAgLy8gb2YgaW5pdGlhbGl6ZSAtLSBpZiBpdCdzIHN0aWxsIHNldCB0byBPQlNFUlZFRF9FUlJPUiBpbiB0aGUgZmluYWxseVxuICAgICAgICAvLyBibG9jaywgaXQgbWVhbnMgd3JhcHBlci5pbml0aWFsaXplIHRocmV3LlxuICAgICAgICB0aGlzLndyYXBwZXJJbml0RGF0YVtpXSA9IFRyYW5zYWN0aW9uLk9CU0VSVkVEX0VSUk9SO1xuICAgICAgICB0aGlzLndyYXBwZXJJbml0RGF0YVtpXSA9IHdyYXBwZXIuaW5pdGlhbGl6ZSA/IHdyYXBwZXIuaW5pdGlhbGl6ZS5jYWxsKHRoaXMpIDogbnVsbDtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmICh0aGlzLndyYXBwZXJJbml0RGF0YVtpXSA9PT0gVHJhbnNhY3Rpb24uT0JTRVJWRURfRVJST1IpIHtcbiAgICAgICAgICAvLyBUaGUgaW5pdGlhbGl6ZXIgZm9yIHdyYXBwZXIgaSB0aHJldyBhbiBlcnJvcjsgaW5pdGlhbGl6ZSB0aGVcbiAgICAgICAgICAvLyByZW1haW5pbmcgd3JhcHBlcnMgYnV0IHNpbGVuY2UgYW55IGV4Y2VwdGlvbnMgZnJvbSB0aGVtIHRvIGVuc3VyZVxuICAgICAgICAgIC8vIHRoYXQgdGhlIGZpcnN0IGVycm9yIGlzIHRoZSBvbmUgdG8gYnViYmxlIHVwLlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBbGwoaSArIDEpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW52b2tlcyBlYWNoIG9mIGB0aGlzLnRyYW5zYWN0aW9uV3JhcHBlcnMuY2xvc2VbaV1gIGZ1bmN0aW9ucywgcGFzc2luZyBpbnRvXG4gICAqIHRoZW0gdGhlIHJlc3BlY3RpdmUgcmV0dXJuIHZhbHVlcyBvZiBgdGhpcy50cmFuc2FjdGlvbldyYXBwZXJzLmluaXRbaV1gXG4gICAqIChgY2xvc2VgcnMgdGhhdCBjb3JyZXNwb25kIHRvIGluaXRpYWxpemVycyB0aGF0IGZhaWxlZCB3aWxsIG5vdCBiZVxuICAgKiBpbnZva2VkKS5cbiAgICovXG4gIGNsb3NlQWxsOiBmdW5jdGlvbiAoc3RhcnRJbmRleCkge1xuICAgICF0aGlzLmlzSW5UcmFuc2FjdGlvbigpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1RyYW5zYWN0aW9uLmNsb3NlQWxsKCk6IENhbm5vdCBjbG9zZSB0cmFuc2FjdGlvbiB3aGVuIG5vbmUgYXJlIG9wZW4uJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHZhciB0cmFuc2FjdGlvbldyYXBwZXJzID0gdGhpcy50cmFuc2FjdGlvbldyYXBwZXJzO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4OyBpIDwgdHJhbnNhY3Rpb25XcmFwcGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHdyYXBwZXIgPSB0cmFuc2FjdGlvbldyYXBwZXJzW2ldO1xuICAgICAgdmFyIGluaXREYXRhID0gdGhpcy53cmFwcGVySW5pdERhdGFbaV07XG4gICAgICB2YXIgZXJyb3JUaHJvd247XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDYXRjaGluZyBlcnJvcnMgbWFrZXMgZGVidWdnaW5nIG1vcmUgZGlmZmljdWx0LCBzbyB3ZSBzdGFydCB3aXRoXG4gICAgICAgIC8vIGVycm9yVGhyb3duIHNldCB0byB0cnVlIGJlZm9yZSBzZXR0aW5nIGl0IHRvIGZhbHNlIGFmdGVyIGNhbGxpbmdcbiAgICAgICAgLy8gY2xvc2UgLS0gaWYgaXQncyBzdGlsbCBzZXQgdG8gdHJ1ZSBpbiB0aGUgZmluYWxseSBibG9jaywgaXQgbWVhbnNcbiAgICAgICAgLy8gd3JhcHBlci5jbG9zZSB0aHJldy5cbiAgICAgICAgZXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICBpZiAoaW5pdERhdGEgIT09IFRyYW5zYWN0aW9uLk9CU0VSVkVEX0VSUk9SICYmIHdyYXBwZXIuY2xvc2UpIHtcbiAgICAgICAgICB3cmFwcGVyLmNsb3NlLmNhbGwodGhpcywgaW5pdERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yVGhyb3duID0gZmFsc2U7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAvLyBUaGUgY2xvc2VyIGZvciB3cmFwcGVyIGkgdGhyZXcgYW4gZXJyb3I7IGNsb3NlIHRoZSByZW1haW5pbmdcbiAgICAgICAgICAvLyB3cmFwcGVycyBidXQgc2lsZW5jZSBhbnkgZXhjZXB0aW9ucyBmcm9tIHRoZW0gdG8gZW5zdXJlIHRoYXQgdGhlXG4gICAgICAgICAgLy8gZmlyc3QgZXJyb3IgaXMgdGhlIG9uZSB0byBidWJibGUgdXAuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VBbGwoaSArIDEpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy53cmFwcGVySW5pdERhdGEubGVuZ3RoID0gMDtcbiAgfVxufTtcblxudmFyIFRyYW5zYWN0aW9uID0ge1xuXG4gIE1peGluOiBNaXhpbixcblxuICAvKipcbiAgICogVG9rZW4gdG8gbG9vayBmb3IgdG8gZGV0ZXJtaW5lIGlmIGFuIGVycm9yIG9jY3VycmVkLlxuICAgKi9cbiAgT0JTRVJWRURfRVJST1I6IHt9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNhY3Rpb247Il19