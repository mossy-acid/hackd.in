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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1RyYW5zYWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0RKLElBQUksUUFBUTs7Ozs7Ozs7QUFRViwyQkFBeUIsbUNBQVk7QUFDbkMsU0FBSyxtQkFBTCxHQUEyQixLQUFLLHNCQUFMLEVBQTNCLENBRG1DO0FBRW5DLFFBQUksS0FBSyxlQUFMLEVBQXNCO0FBQ3hCLFdBQUssZUFBTCxDQUFxQixNQUFyQixHQUE4QixDQUE5QixDQUR3QjtLQUExQixNQUVPO0FBQ0wsV0FBSyxlQUFMLEdBQXVCLEVBQXZCLENBREs7S0FGUDtBQUtBLFNBQUssZ0JBQUwsR0FBd0IsS0FBeEIsQ0FQbUM7R0FBWjs7QUFVekIsb0JBQWtCLEtBQWxCOzs7Ozs7QUFNQSwwQkFBd0IsSUFBeEI7O0FBRUEsbUJBQWlCLDJCQUFZO0FBQzNCLFdBQU8sQ0FBQyxDQUFDLEtBQUssZ0JBQUwsQ0FEa0I7R0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCakIsV0FBUyxpQkFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLEVBQTJDO0FBQ2xELEtBQUMsQ0FBQyxLQUFLLGVBQUwsRUFBRCxHQUEwQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiwwRUFBMEUsd0NBQTFFLENBQXpELEdBQStLLFVBQVUsS0FBVixDQUEvSyxHQUFrTSxTQUE3TixDQURrRDtBQUVsRCxRQUFJLFdBQUosQ0FGa0Q7QUFHbEQsUUFBSSxHQUFKLENBSGtEO0FBSWxELFFBQUk7QUFDRixXQUFLLGdCQUFMLEdBQXdCLElBQXhCOzs7OztBQURFLGlCQU1GLEdBQWMsSUFBZCxDQU5FO0FBT0YsV0FBSyxhQUFMLENBQW1CLENBQW5CLEVBUEU7QUFRRixZQUFNLE9BQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsQ0FBTixDQVJFO0FBU0Ysb0JBQWMsS0FBZCxDQVRFO0tBQUosU0FVVTtBQUNSLFVBQUk7QUFDRixZQUFJLFdBQUosRUFBaUI7OztBQUdmLGNBQUk7QUFDRixpQkFBSyxRQUFMLENBQWMsQ0FBZCxFQURFO1dBQUosQ0FFRSxPQUFPLEdBQVAsRUFBWSxFQUFaO1NBTEosTUFNTzs7O0FBR0wsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUhLO1NBTlA7T0FERixTQVlVO0FBQ1IsYUFBSyxnQkFBTCxHQUF3QixLQUF4QixDQURRO09BWlY7S0FYRjtBQTJCQSxXQUFPLEdBQVAsQ0EvQmtEO0dBQTNDOztBQWtDVCxpQkFBZSx1QkFBVSxVQUFWLEVBQXNCO0FBQ25DLFFBQUksc0JBQXNCLEtBQUssbUJBQUwsQ0FEUztBQUVuQyxTQUFLLElBQUksSUFBSSxVQUFKLEVBQWdCLElBQUksb0JBQW9CLE1BQXBCLEVBQTRCLEdBQXpELEVBQThEO0FBQzVELFVBQUksVUFBVSxvQkFBb0IsQ0FBcEIsQ0FBVixDQUR3RDtBQUU1RCxVQUFJOzs7OztBQUtGLGFBQUssZUFBTCxDQUFxQixDQUFyQixJQUEwQixZQUFZLGNBQVosQ0FMeEI7QUFNRixhQUFLLGVBQUwsQ0FBcUIsQ0FBckIsSUFBMEIsUUFBUSxVQUFSLEdBQXFCLFFBQVEsVUFBUixDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQixHQUFxRCxJQUFyRCxDQU54QjtPQUFKLFNBT1U7QUFDUixZQUFJLEtBQUssZUFBTCxDQUFxQixDQUFyQixNQUE0QixZQUFZLGNBQVosRUFBNEI7Ozs7QUFJMUQsY0FBSTtBQUNGLGlCQUFLLGFBQUwsQ0FBbUIsSUFBSSxDQUFKLENBQW5CLENBREU7V0FBSixDQUVFLE9BQU8sR0FBUCxFQUFZLEVBQVo7U0FOSjtPQVJGO0tBRkY7R0FGYTs7Ozs7Ozs7QUE4QmYsWUFBVSxrQkFBVSxVQUFWLEVBQXNCO0FBQzlCLEtBQUMsS0FBSyxlQUFMLEVBQUQsR0FBMEIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsc0VBQWpCLENBQXhDLEdBQW1JLFVBQVUsS0FBVixDQUFuSSxHQUFzSixTQUFoTCxDQUQ4QjtBQUU5QixRQUFJLHNCQUFzQixLQUFLLG1CQUFMLENBRkk7QUFHOUIsU0FBSyxJQUFJLElBQUksVUFBSixFQUFnQixJQUFJLG9CQUFvQixNQUFwQixFQUE0QixHQUF6RCxFQUE4RDtBQUM1RCxVQUFJLFVBQVUsb0JBQW9CLENBQXBCLENBQVYsQ0FEd0Q7QUFFNUQsVUFBSSxXQUFXLEtBQUssZUFBTCxDQUFxQixDQUFyQixDQUFYLENBRndEO0FBRzVELFVBQUksV0FBSixDQUg0RDtBQUk1RCxVQUFJOzs7OztBQUtGLHNCQUFjLElBQWQsQ0FMRTtBQU1GLFlBQUksYUFBYSxZQUFZLGNBQVosSUFBOEIsUUFBUSxLQUFSLEVBQWU7QUFDNUQsa0JBQVEsS0FBUixDQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsUUFBekIsRUFENEQ7U0FBOUQ7QUFHQSxzQkFBYyxLQUFkLENBVEU7T0FBSixTQVVVO0FBQ1IsWUFBSSxXQUFKLEVBQWlCOzs7O0FBSWYsY0FBSTtBQUNGLGlCQUFLLFFBQUwsQ0FBYyxJQUFJLENBQUosQ0FBZCxDQURFO1dBQUosQ0FFRSxPQUFPLENBQVAsRUFBVSxFQUFWO1NBTko7T0FYRjtLQUpGO0FBeUJBLFNBQUssZUFBTCxDQUFxQixNQUFyQixHQUE4QixDQUE5QixDQTVCOEI7R0FBdEI7Q0EvR1I7O0FBK0lKLElBQUksY0FBYzs7QUFFaEIsU0FBTyxLQUFQOzs7OztBQUtBLGtCQUFnQixFQUFoQjs7Q0FQRTs7QUFXSixPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiVHJhbnNhY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgVHJhbnNhY3Rpb25cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuLyoqXG4gKiBgVHJhbnNhY3Rpb25gIGNyZWF0ZXMgYSBibGFjayBib3ggdGhhdCBpcyBhYmxlIHRvIHdyYXAgYW55IG1ldGhvZCBzdWNoIHRoYXRcbiAqIGNlcnRhaW4gaW52YXJpYW50cyBhcmUgbWFpbnRhaW5lZCBiZWZvcmUgYW5kIGFmdGVyIHRoZSBtZXRob2QgaXMgaW52b2tlZFxuICogKEV2ZW4gaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biB3aGlsZSBpbnZva2luZyB0aGUgd3JhcHBlZCBtZXRob2QpLiBXaG9ldmVyXG4gKiBpbnN0YW50aWF0ZXMgYSB0cmFuc2FjdGlvbiBjYW4gcHJvdmlkZSBlbmZvcmNlcnMgb2YgdGhlIGludmFyaWFudHMgYXRcbiAqIGNyZWF0aW9uIHRpbWUuIFRoZSBgVHJhbnNhY3Rpb25gIGNsYXNzIGl0c2VsZiB3aWxsIHN1cHBseSBvbmUgYWRkaXRpb25hbFxuICogYXV0b21hdGljIGludmFyaWFudCBmb3IgeW91IC0gdGhlIGludmFyaWFudCB0aGF0IGFueSB0cmFuc2FjdGlvbiBpbnN0YW5jZVxuICogc2hvdWxkIG5vdCBiZSBydW4gd2hpbGUgaXQgaXMgYWxyZWFkeSBiZWluZyBydW4uIFlvdSB3b3VsZCB0eXBpY2FsbHkgY3JlYXRlIGFcbiAqIHNpbmdsZSBpbnN0YW5jZSBvZiBhIGBUcmFuc2FjdGlvbmAgZm9yIHJldXNlIG11bHRpcGxlIHRpbWVzLCB0aGF0IHBvdGVudGlhbGx5XG4gKiBpcyB1c2VkIHRvIHdyYXAgc2V2ZXJhbCBkaWZmZXJlbnQgbWV0aG9kcy4gV3JhcHBlcnMgYXJlIGV4dHJlbWVseSBzaW1wbGUgLVxuICogdGhleSBvbmx5IHJlcXVpcmUgaW1wbGVtZW50aW5nIHR3byBtZXRob2RzLlxuICpcbiAqIDxwcmU+XG4gKiAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlcnMgKGluamVjdGVkIGF0IGNyZWF0aW9uIHRpbWUpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAgICAgICAgK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICArLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS18LS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgdiAgICAgICAgfCAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgIHwgICAgICArLS0tLS0tLS0tLS0tLS0tKyAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgKy0tfCAgICB3cmFwcGVyMSAgIHwtLS18LS0tLSsgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCAgIHwgICstLS0tLS0tLS0tLS0tLS0rICAgdiAgICB8ICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgIHwgICB8ICAgICAgICAgICstLS0tLS0tLS0tLS0tKyAgfCAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgfCAgICAgKy0tLS18ICAgd3JhcHBlcjIgIHwtLS0tLS0tLSsgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCAgIHwgICAgIHwgICAgKy0tLS0tLS0tLS0tLS0rICB8ICAgICB8ICAgfFxuICogICAgICAgICAgICAgICAgICAgIHwgICB8ICAgICB8ICAgICAgICAgICAgICAgICAgICAgfCAgICAgfCAgIHxcbiAqICAgICAgICAgICAgICAgICAgICB8ICAgdiAgICAgdiAgICAgICAgICAgICAgICAgICAgIHYgICAgIHYgICB8IHdyYXBwZXJcbiAqICAgICAgICAgICAgICAgICAgICB8ICstLS0rICstLS0rICAgKy0tLS0tLS0tLSsgICArLS0tKyArLS0tKyB8IGludmFyaWFudHNcbiAqIHBlcmZvcm0oYW55TWV0aG9kKSB8IHwgICB8IHwgICB8ICAgfCAgICAgICAgIHwgICB8ICAgfCB8ICAgfCB8IG1haW50YWluZWRcbiAqICstLS0tLS0tLS0tLS0tLS0tLT58LXwtLS18LXwtLS18LS0+fGFueU1ldGhvZHwtLS18LS0tfC18LS0tfC18LS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICAgfCB8ICAgfCB8ICAgfCAgIHwgICAgICAgICB8ICAgfCAgIHwgfCAgIHwgfFxuICogICAgICAgICAgICAgICAgICAgIHwgfCAgIHwgfCAgIHwgICB8ICAgICAgICAgfCAgIHwgICB8IHwgICB8IHxcbiAqICAgICAgICAgICAgICAgICAgICB8IHwgICB8IHwgICB8ICAgfCAgICAgICAgIHwgICB8ICAgfCB8ICAgfCB8XG4gKiAgICAgICAgICAgICAgICAgICAgfCArLS0tKyArLS0tKyAgICstLS0tLS0tLS0rICAgKy0tLSsgKy0tLSsgfFxuICogICAgICAgICAgICAgICAgICAgIHwgIGluaXRpYWxpemUgICAgICAgICAgICAgICAgICAgIGNsb3NlICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiA8L3ByZT5cbiAqXG4gKiBVc2UgY2FzZXM6XG4gKiAtIFByZXNlcnZpbmcgdGhlIGlucHV0IHNlbGVjdGlvbiByYW5nZXMgYmVmb3JlL2FmdGVyIHJlY29uY2lsaWF0aW9uLlxuICogICBSZXN0b3Jpbmcgc2VsZWN0aW9uIGV2ZW4gaW4gdGhlIGV2ZW50IG9mIGFuIHVuZXhwZWN0ZWQgZXJyb3IuXG4gKiAtIERlYWN0aXZhdGluZyBldmVudHMgd2hpbGUgcmVhcnJhbmdpbmcgdGhlIERPTSwgcHJldmVudGluZyBibHVycy9mb2N1c2VzLFxuICogICB3aGlsZSBndWFyYW50ZWVpbmcgdGhhdCBhZnRlcndhcmRzLCB0aGUgZXZlbnQgc3lzdGVtIGlzIHJlYWN0aXZhdGVkLlxuICogLSBGbHVzaGluZyBhIHF1ZXVlIG9mIGNvbGxlY3RlZCBET00gbXV0YXRpb25zIHRvIHRoZSBtYWluIFVJIHRocmVhZCBhZnRlciBhXG4gKiAgIHJlY29uY2lsaWF0aW9uIHRha2VzIHBsYWNlIGluIGEgd29ya2VyIHRocmVhZC5cbiAqIC0gSW52b2tpbmcgYW55IGNvbGxlY3RlZCBgY29tcG9uZW50RGlkVXBkYXRlYCBjYWxsYmFja3MgYWZ0ZXIgcmVuZGVyaW5nIG5ld1xuICogICBjb250ZW50LlxuICogLSAoRnV0dXJlIHVzZSBjYXNlKTogV3JhcHBpbmcgcGFydGljdWxhciBmbHVzaGVzIG9mIHRoZSBgUmVhY3RXb3JrZXJgIHF1ZXVlXG4gKiAgIHRvIHByZXNlcnZlIHRoZSBgc2Nyb2xsVG9wYCAoYW4gYXV0b21hdGljIHNjcm9sbCBhd2FyZSBET00pLlxuICogLSAoRnV0dXJlIHVzZSBjYXNlKTogTGF5b3V0IGNhbGN1bGF0aW9ucyBiZWZvcmUgYW5kIGFmdGVyIERPTSB1cGRhdGVzLlxuICpcbiAqIFRyYW5zYWN0aW9uYWwgcGx1Z2luIEFQSTpcbiAqIC0gQSBtb2R1bGUgdGhhdCBoYXMgYW4gYGluaXRpYWxpemVgIG1ldGhvZCB0aGF0IHJldHVybnMgYW55IHByZWNvbXB1dGF0aW9uLlxuICogLSBhbmQgYSBgY2xvc2VgIG1ldGhvZCB0aGF0IGFjY2VwdHMgdGhlIHByZWNvbXB1dGF0aW9uLiBgY2xvc2VgIGlzIGludm9rZWRcbiAqICAgd2hlbiB0aGUgd3JhcHBlZCBwcm9jZXNzIGlzIGNvbXBsZXRlZCwgb3IgaGFzIGZhaWxlZC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PFRyYW5zYWN0aW9uYWxXcmFwcGVyPn0gdHJhbnNhY3Rpb25XcmFwcGVyIFdyYXBwZXIgbW9kdWxlc1xuICogdGhhdCBpbXBsZW1lbnQgYGluaXRpYWxpemVgIGFuZCBgY2xvc2VgLlxuICogQHJldHVybiB7VHJhbnNhY3Rpb259IFNpbmdsZSB0cmFuc2FjdGlvbiBmb3IgcmV1c2UgaW4gdGhyZWFkLlxuICpcbiAqIEBjbGFzcyBUcmFuc2FjdGlvblxuICovXG52YXIgTWl4aW4gPSB7XG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoaXMgaW5zdGFuY2Ugc28gdGhhdCBpdCBpcyBwcmVwYXJlZCBmb3IgY29sbGVjdGluZyBtZXRyaWNzLiBEb2VzXG4gICAqIHNvIHN1Y2ggdGhhdCB0aGlzIHNldHVwIG1ldGhvZCBtYXkgYmUgdXNlZCBvbiBhbiBpbnN0YW5jZSB0aGF0IGlzIGFscmVhZHlcbiAgICogaW5pdGlhbGl6ZWQsIGluIGEgd2F5IHRoYXQgZG9lcyBub3QgY29uc3VtZSBhZGRpdGlvbmFsIG1lbW9yeSB1cG9uIHJldXNlLlxuICAgKiBUaGF0IGNhbiBiZSB1c2VmdWwgaWYgeW91IGRlY2lkZSB0byBtYWtlIHlvdXIgc3ViY2xhc3Mgb2YgdGhpcyBtaXhpbiBhXG4gICAqIFwiUG9vbGVkQ2xhc3NcIi5cbiAgICovXG4gIHJlaW5pdGlhbGl6ZVRyYW5zYWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50cmFuc2FjdGlvbldyYXBwZXJzID0gdGhpcy5nZXRUcmFuc2FjdGlvbldyYXBwZXJzKCk7XG4gICAgaWYgKHRoaXMud3JhcHBlckluaXREYXRhKSB7XG4gICAgICB0aGlzLndyYXBwZXJJbml0RGF0YS5sZW5ndGggPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLndyYXBwZXJJbml0RGF0YSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl9pc0luVHJhbnNhY3Rpb24gPSBmYWxzZTtcbiAgfSxcblxuICBfaXNJblRyYW5zYWN0aW9uOiBmYWxzZSxcblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqIEByZXR1cm4ge0FycmF5PFRyYW5zYWN0aW9uV3JhcHBlcj59IEFycmF5IG9mIHRyYW5zYWN0aW9uIHdyYXBwZXJzLlxuICAgKi9cbiAgZ2V0VHJhbnNhY3Rpb25XcmFwcGVyczogbnVsbCxcblxuICBpc0luVHJhbnNhY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9pc0luVHJhbnNhY3Rpb247XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBmdW5jdGlvbiB3aXRoaW4gYSBzYWZldHkgd2luZG93LiBVc2UgdGhpcyBmb3IgdGhlIHRvcCBsZXZlbFxuICAgKiBtZXRob2RzIHRoYXQgcmVzdWx0IGluIGxhcmdlIGFtb3VudHMgb2YgY29tcHV0YXRpb24vbXV0YXRpb25zIHRoYXQgd291bGRcbiAgICogbmVlZCB0byBiZSBzYWZldHkgY2hlY2tlZC4gVGhlIG9wdGlvbmFsIGFyZ3VtZW50cyBoZWxwcyBwcmV2ZW50IHRoZSBuZWVkXG4gICAqIHRvIGJpbmQgaW4gbWFueSBjYXNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kIE1lbWJlciBvZiBzY29wZSB0byBjYWxsLlxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGUgU2NvcGUgdG8gaW52b2tlIGZyb20uXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGEgQXJndW1lbnQgdG8gcGFzcyB0byB0aGUgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdD89fSBiIEFyZ3VtZW50IHRvIHBhc3MgdG8gdGhlIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gYyBBcmd1bWVudCB0byBwYXNzIHRvIHRoZSBtZXRob2QuXG4gICAqIEBwYXJhbSB7T2JqZWN0Pz19IGQgQXJndW1lbnQgdG8gcGFzcyB0byB0aGUgbWV0aG9kLlxuICAgKiBAcGFyYW0ge09iamVjdD89fSBlIEFyZ3VtZW50IHRvIHBhc3MgdG8gdGhlIG1ldGhvZC5cbiAgICogQHBhcmFtIHtPYmplY3Q/PX0gZiBBcmd1bWVudCB0byBwYXNzIHRvIHRoZSBtZXRob2QuXG4gICAqXG4gICAqIEByZXR1cm4geyp9IFJldHVybiB2YWx1ZSBmcm9tIGBtZXRob2RgLlxuICAgKi9cbiAgcGVyZm9ybTogZnVuY3Rpb24gKG1ldGhvZCwgc2NvcGUsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgICAhIXRoaXMuaXNJblRyYW5zYWN0aW9uKCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVHJhbnNhY3Rpb24ucGVyZm9ybSguLi4pOiBDYW5ub3QgaW5pdGlhbGl6ZSBhIHRyYW5zYWN0aW9uIHdoZW4gdGhlcmUgJyArICdpcyBhbHJlYWR5IGFuIG91dHN0YW5kaW5nIHRyYW5zYWN0aW9uLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgZXJyb3JUaHJvd247XG4gICAgdmFyIHJldDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5faXNJblRyYW5zYWN0aW9uID0gdHJ1ZTtcbiAgICAgIC8vIENhdGNoaW5nIGVycm9ycyBtYWtlcyBkZWJ1Z2dpbmcgbW9yZSBkaWZmaWN1bHQsIHNvIHdlIHN0YXJ0IHdpdGhcbiAgICAgIC8vIGVycm9yVGhyb3duIHNldCB0byB0cnVlIGJlZm9yZSBzZXR0aW5nIGl0IHRvIGZhbHNlIGFmdGVyIGNhbGxpbmdcbiAgICAgIC8vIGNsb3NlIC0tIGlmIGl0J3Mgc3RpbGwgc2V0IHRvIHRydWUgaW4gdGhlIGZpbmFsbHkgYmxvY2ssIGl0IG1lYW5zXG4gICAgICAvLyBvbmUgb2YgdGhlc2UgY2FsbHMgdGhyZXcuXG4gICAgICBlcnJvclRocm93biA9IHRydWU7XG4gICAgICB0aGlzLmluaXRpYWxpemVBbGwoMCk7XG4gICAgICByZXQgPSBtZXRob2QuY2FsbChzY29wZSwgYSwgYiwgYywgZCwgZSwgZik7XG4gICAgICBlcnJvclRocm93biA9IGZhbHNlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAvLyBJZiBgbWV0aG9kYCB0aHJvd3MsIHByZWZlciB0byBzaG93IHRoYXQgc3RhY2sgdHJhY2Ugb3ZlciBhbnkgdGhyb3duXG4gICAgICAgICAgLy8gYnkgaW52b2tpbmcgYGNsb3NlQWxsYC5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZUFsbCgwKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2luY2UgYG1ldGhvZGAgZGlkbid0IHRocm93LCB3ZSBkb24ndCB3YW50IHRvIHNpbGVuY2UgdGhlIGV4Y2VwdGlvblxuICAgICAgICAgIC8vIGhlcmUuXG4gICAgICAgICAgdGhpcy5jbG9zZUFsbCgwKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5faXNJblRyYW5zYWN0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZUFsbDogZnVuY3Rpb24gKHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgdHJhbnNhY3Rpb25XcmFwcGVycyA9IHRoaXMudHJhbnNhY3Rpb25XcmFwcGVycztcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleDsgaSA8IHRyYW5zYWN0aW9uV3JhcHBlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB3cmFwcGVyID0gdHJhbnNhY3Rpb25XcmFwcGVyc1tpXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIENhdGNoaW5nIGVycm9ycyBtYWtlcyBkZWJ1Z2dpbmcgbW9yZSBkaWZmaWN1bHQsIHNvIHdlIHN0YXJ0IHdpdGggdGhlXG4gICAgICAgIC8vIE9CU0VSVkVEX0VSUk9SIHN0YXRlIGJlZm9yZSBvdmVyd3JpdGluZyBpdCB3aXRoIHRoZSByZWFsIHJldHVybiB2YWx1ZVxuICAgICAgICAvLyBvZiBpbml0aWFsaXplIC0tIGlmIGl0J3Mgc3RpbGwgc2V0IHRvIE9CU0VSVkVEX0VSUk9SIGluIHRoZSBmaW5hbGx5XG4gICAgICAgIC8vIGJsb2NrLCBpdCBtZWFucyB3cmFwcGVyLmluaXRpYWxpemUgdGhyZXcuXG4gICAgICAgIHRoaXMud3JhcHBlckluaXREYXRhW2ldID0gVHJhbnNhY3Rpb24uT0JTRVJWRURfRVJST1I7XG4gICAgICAgIHRoaXMud3JhcHBlckluaXREYXRhW2ldID0gd3JhcHBlci5pbml0aWFsaXplID8gd3JhcHBlci5pbml0aWFsaXplLmNhbGwodGhpcykgOiBudWxsO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKHRoaXMud3JhcHBlckluaXREYXRhW2ldID09PSBUcmFuc2FjdGlvbi5PQlNFUlZFRF9FUlJPUikge1xuICAgICAgICAgIC8vIFRoZSBpbml0aWFsaXplciBmb3Igd3JhcHBlciBpIHRocmV3IGFuIGVycm9yOyBpbml0aWFsaXplIHRoZVxuICAgICAgICAgIC8vIHJlbWFpbmluZyB3cmFwcGVycyBidXQgc2lsZW5jZSBhbnkgZXhjZXB0aW9ucyBmcm9tIHRoZW0gdG8gZW5zdXJlXG4gICAgICAgICAgLy8gdGhhdCB0aGUgZmlyc3QgZXJyb3IgaXMgdGhlIG9uZSB0byBidWJibGUgdXAuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFsbChpICsgMSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnZva2VzIGVhY2ggb2YgYHRoaXMudHJhbnNhY3Rpb25XcmFwcGVycy5jbG9zZVtpXWAgZnVuY3Rpb25zLCBwYXNzaW5nIGludG9cbiAgICogdGhlbSB0aGUgcmVzcGVjdGl2ZSByZXR1cm4gdmFsdWVzIG9mIGB0aGlzLnRyYW5zYWN0aW9uV3JhcHBlcnMuaW5pdFtpXWBcbiAgICogKGBjbG9zZWBycyB0aGF0IGNvcnJlc3BvbmQgdG8gaW5pdGlhbGl6ZXJzIHRoYXQgZmFpbGVkIHdpbGwgbm90IGJlXG4gICAqIGludm9rZWQpLlxuICAgKi9cbiAgY2xvc2VBbGw6IGZ1bmN0aW9uIChzdGFydEluZGV4KSB7XG4gICAgIXRoaXMuaXNJblRyYW5zYWN0aW9uKCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVHJhbnNhY3Rpb24uY2xvc2VBbGwoKTogQ2Fubm90IGNsb3NlIHRyYW5zYWN0aW9uIHdoZW4gbm9uZSBhcmUgb3Blbi4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHRyYW5zYWN0aW9uV3JhcHBlcnMgPSB0aGlzLnRyYW5zYWN0aW9uV3JhcHBlcnM7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7IGkgPCB0cmFuc2FjdGlvbldyYXBwZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgd3JhcHBlciA9IHRyYW5zYWN0aW9uV3JhcHBlcnNbaV07XG4gICAgICB2YXIgaW5pdERhdGEgPSB0aGlzLndyYXBwZXJJbml0RGF0YVtpXTtcbiAgICAgIHZhciBlcnJvclRocm93bjtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIENhdGNoaW5nIGVycm9ycyBtYWtlcyBkZWJ1Z2dpbmcgbW9yZSBkaWZmaWN1bHQsIHNvIHdlIHN0YXJ0IHdpdGhcbiAgICAgICAgLy8gZXJyb3JUaHJvd24gc2V0IHRvIHRydWUgYmVmb3JlIHNldHRpbmcgaXQgdG8gZmFsc2UgYWZ0ZXIgY2FsbGluZ1xuICAgICAgICAvLyBjbG9zZSAtLSBpZiBpdCdzIHN0aWxsIHNldCB0byB0cnVlIGluIHRoZSBmaW5hbGx5IGJsb2NrLCBpdCBtZWFuc1xuICAgICAgICAvLyB3cmFwcGVyLmNsb3NlIHRocmV3LlxuICAgICAgICBlcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIGlmIChpbml0RGF0YSAhPT0gVHJhbnNhY3Rpb24uT0JTRVJWRURfRVJST1IgJiYgd3JhcHBlci5jbG9zZSkge1xuICAgICAgICAgIHdyYXBwZXIuY2xvc2UuY2FsbCh0aGlzLCBpbml0RGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3JUaHJvd24gPSBmYWxzZTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlcnJvclRocm93bikge1xuICAgICAgICAgIC8vIFRoZSBjbG9zZXIgZm9yIHdyYXBwZXIgaSB0aHJldyBhbiBlcnJvcjsgY2xvc2UgdGhlIHJlbWFpbmluZ1xuICAgICAgICAgIC8vIHdyYXBwZXJzIGJ1dCBzaWxlbmNlIGFueSBleGNlcHRpb25zIGZyb20gdGhlbSB0byBlbnN1cmUgdGhhdCB0aGVcbiAgICAgICAgICAvLyBmaXJzdCBlcnJvciBpcyB0aGUgb25lIHRvIGJ1YmJsZSB1cC5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZUFsbChpICsgMSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLndyYXBwZXJJbml0RGF0YS5sZW5ndGggPSAwO1xuICB9XG59O1xuXG52YXIgVHJhbnNhY3Rpb24gPSB7XG5cbiAgTWl4aW46IE1peGluLFxuXG4gIC8qKlxuICAgKiBUb2tlbiB0byBsb29rIGZvciB0byBkZXRlcm1pbmUgaWYgYW4gZXJyb3Igb2NjdXJyZWQuXG4gICAqL1xuICBPQlNFUlZFRF9FUlJPUjoge31cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2FjdGlvbjsiXX0=