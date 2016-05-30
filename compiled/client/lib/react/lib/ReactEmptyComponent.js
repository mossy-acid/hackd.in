/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEmptyComponent
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactEmptyComponentRegistry = require('./ReactEmptyComponentRegistry');
var ReactReconciler = require('./ReactReconciler');

var assign = require('./Object.assign');

var placeholderElement;

var ReactEmptyComponentInjection = {
  injectEmptyComponent: function injectEmptyComponent(component) {
    placeholderElement = ReactElement.createElement(component);
  }
};

function registerNullComponentID() {
  ReactEmptyComponentRegistry.registerNullComponentID(this._rootNodeID);
}

var ReactEmptyComponent = function ReactEmptyComponent(instantiate) {
  this._currentElement = null;
  this._rootNodeID = null;
  this._renderedComponent = instantiate(placeholderElement);
};
assign(ReactEmptyComponent.prototype, {
  construct: function construct(element) {},
  mountComponent: function mountComponent(rootID, transaction, context) {
    transaction.getReactMountReady().enqueue(registerNullComponentID, this);
    this._rootNodeID = rootID;
    return ReactReconciler.mountComponent(this._renderedComponent, rootID, transaction, context);
  },
  receiveComponent: function receiveComponent() {},
  unmountComponent: function unmountComponent(rootID, transaction, context) {
    ReactReconciler.unmountComponent(this._renderedComponent);
    ReactEmptyComponentRegistry.deregisterNullComponentID(this._rootNodeID);
    this._rootNodeID = null;
    this._renderedComponent = null;
  }
});

ReactEmptyComponent.injection = ReactEmptyComponentInjection;

module.exports = ReactEmptyComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RW1wdHlDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFmO0FBQ0osSUFBSSw4QkFBOEIsUUFBUSwrQkFBUixDQUE5QjtBQUNKLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBbEI7O0FBRUosSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDs7QUFFSixJQUFJLGtCQUFKOztBQUVBLElBQUksK0JBQStCO0FBQ2pDLHdCQUFzQiw4QkFBVSxTQUFWLEVBQXFCO0FBQ3pDLHlCQUFxQixhQUFhLGFBQWIsQ0FBMkIsU0FBM0IsQ0FBckIsQ0FEeUM7R0FBckI7Q0FEcEI7O0FBTUosU0FBUyx1QkFBVCxHQUFtQztBQUNqQyw4QkFBNEIsdUJBQTVCLENBQW9ELEtBQUssV0FBTCxDQUFwRCxDQURpQztDQUFuQzs7QUFJQSxJQUFJLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxXQUFWLEVBQXVCO0FBQy9DLE9BQUssZUFBTCxHQUF1QixJQUF2QixDQUQrQztBQUUvQyxPQUFLLFdBQUwsR0FBbUIsSUFBbkIsQ0FGK0M7QUFHL0MsT0FBSyxrQkFBTCxHQUEwQixZQUFZLGtCQUFaLENBQTFCLENBSCtDO0NBQXZCO0FBSzFCLE9BQU8sb0JBQW9CLFNBQXBCLEVBQStCO0FBQ3BDLGFBQVcsbUJBQVUsT0FBVixFQUFtQixFQUFuQjtBQUNYLGtCQUFnQix3QkFBVSxNQUFWLEVBQWtCLFdBQWxCLEVBQStCLE9BQS9CLEVBQXdDO0FBQ3RELGdCQUFZLGtCQUFaLEdBQWlDLE9BQWpDLENBQXlDLHVCQUF6QyxFQUFrRSxJQUFsRSxFQURzRDtBQUV0RCxTQUFLLFdBQUwsR0FBbUIsTUFBbkIsQ0FGc0Q7QUFHdEQsV0FBTyxnQkFBZ0IsY0FBaEIsQ0FBK0IsS0FBSyxrQkFBTCxFQUF5QixNQUF4RCxFQUFnRSxXQUFoRSxFQUE2RSxPQUE3RSxDQUFQLENBSHNEO0dBQXhDO0FBS2hCLG9CQUFrQiw0QkFBWSxFQUFaO0FBQ2xCLG9CQUFrQiwwQkFBVSxNQUFWLEVBQWtCLFdBQWxCLEVBQStCLE9BQS9CLEVBQXdDO0FBQ3hELG9CQUFnQixnQkFBaEIsQ0FBaUMsS0FBSyxrQkFBTCxDQUFqQyxDQUR3RDtBQUV4RCxnQ0FBNEIseUJBQTVCLENBQXNELEtBQUssV0FBTCxDQUF0RCxDQUZ3RDtBQUd4RCxTQUFLLFdBQUwsR0FBbUIsSUFBbkIsQ0FId0Q7QUFJeEQsU0FBSyxrQkFBTCxHQUEwQixJQUExQixDQUp3RDtHQUF4QztDQVJwQjs7QUFnQkEsb0JBQW9CLFNBQXBCLEdBQWdDLDRCQUFoQzs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6IlJlYWN0RW1wdHlDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RFbXB0eUNvbXBvbmVudFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RFbXB0eUNvbXBvbmVudFJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi9SZWFjdEVtcHR5Q29tcG9uZW50UmVnaXN0cnknKTtcbnZhciBSZWFjdFJlY29uY2lsZXIgPSByZXF1aXJlKCcuL1JlYWN0UmVjb25jaWxlcicpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG5cbnZhciBwbGFjZWhvbGRlckVsZW1lbnQ7XG5cbnZhciBSZWFjdEVtcHR5Q29tcG9uZW50SW5qZWN0aW9uID0ge1xuICBpbmplY3RFbXB0eUNvbXBvbmVudDogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHBsYWNlaG9sZGVyRWxlbWVudCA9IFJlYWN0RWxlbWVudC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTnVsbENvbXBvbmVudElEKCkge1xuICBSZWFjdEVtcHR5Q29tcG9uZW50UmVnaXN0cnkucmVnaXN0ZXJOdWxsQ29tcG9uZW50SUQodGhpcy5fcm9vdE5vZGVJRCk7XG59XG5cbnZhciBSZWFjdEVtcHR5Q29tcG9uZW50ID0gZnVuY3Rpb24gKGluc3RhbnRpYXRlKSB7XG4gIHRoaXMuX2N1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgdGhpcy5fcm9vdE5vZGVJRCA9IG51bGw7XG4gIHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50ID0gaW5zdGFudGlhdGUocGxhY2Vob2xkZXJFbGVtZW50KTtcbn07XG5hc3NpZ24oUmVhY3RFbXB0eUNvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgY29uc3RydWN0OiBmdW5jdGlvbiAoZWxlbWVudCkge30sXG4gIG1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAocm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgIHRyYW5zYWN0aW9uLmdldFJlYWN0TW91bnRSZWFkeSgpLmVucXVldWUocmVnaXN0ZXJOdWxsQ29tcG9uZW50SUQsIHRoaXMpO1xuICAgIHRoaXMuX3Jvb3ROb2RlSUQgPSByb290SUQ7XG4gICAgcmV0dXJuIFJlYWN0UmVjb25jaWxlci5tb3VudENvbXBvbmVudCh0aGlzLl9yZW5kZXJlZENvbXBvbmVudCwgcm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gIH0sXG4gIHJlY2VpdmVDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHt9LFxuICB1bm1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAocm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgIFJlYWN0UmVjb25jaWxlci51bm1vdW50Q29tcG9uZW50KHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50KTtcbiAgICBSZWFjdEVtcHR5Q29tcG9uZW50UmVnaXN0cnkuZGVyZWdpc3Rlck51bGxDb21wb25lbnRJRCh0aGlzLl9yb290Tm9kZUlEKTtcbiAgICB0aGlzLl9yb290Tm9kZUlEID0gbnVsbDtcbiAgICB0aGlzLl9yZW5kZXJlZENvbXBvbmVudCA9IG51bGw7XG4gIH1cbn0pO1xuXG5SZWFjdEVtcHR5Q29tcG9uZW50LmluamVjdGlvbiA9IFJlYWN0RW1wdHlDb21wb25lbnRJbmplY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RFbXB0eUNvbXBvbmVudDsiXX0=