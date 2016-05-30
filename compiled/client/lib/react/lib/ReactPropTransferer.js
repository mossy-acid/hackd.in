/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTransferer
 */

'use strict';

var assign = require('./Object.assign');
var emptyFunction = require('fbjs/lib/emptyFunction');
var joinClasses = require('fbjs/lib/joinClasses');

/**
 * Creates a transfer strategy that will merge prop values using the supplied
 * `mergeStrategy`. If a prop was previously unset, this just sets it.
 *
 * @param {function} mergeStrategy
 * @return {function}
 */
function createTransferStrategy(mergeStrategy) {
  return function (props, key, value) {
    if (!props.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      props[key] = mergeStrategy(props[key], value);
    }
  };
}

var transferStrategyMerge = createTransferStrategy(function (a, b) {
  // `merge` overrides the first object's (`props[key]` above) keys using the
  // second object's (`value`) keys. An object's style's existing `propA` would
  // get overridden. Flip the order here.
  return assign({}, b, a);
});

/**
 * Transfer strategies dictate how props are transferred by `transferPropsTo`.
 * NOTE: if you add any more exceptions to this list you should be sure to
 * update `cloneWithProps()` accordingly.
 */
var TransferStrategies = {
  /**
   * Never transfer `children`.
   */
  children: emptyFunction,
  /**
   * Transfer the `className` prop by merging them.
   */
  className: createTransferStrategy(joinClasses),
  /**
   * Transfer the `style` prop (which is an object) by merging them.
   */
  style: transferStrategyMerge
};

/**
 * Mutates the first argument by transferring the properties from the second
 * argument.
 *
 * @param {object} props
 * @param {object} newProps
 * @return {object}
 */
function transferInto(props, newProps) {
  for (var thisKey in newProps) {
    if (!newProps.hasOwnProperty(thisKey)) {
      continue;
    }

    var transferStrategy = TransferStrategies[thisKey];

    if (transferStrategy && TransferStrategies.hasOwnProperty(thisKey)) {
      transferStrategy(props, thisKey, newProps[thisKey]);
    } else if (!props.hasOwnProperty(thisKey)) {
      props[thisKey] = newProps[thisKey];
    }
  }
  return props;
}

/**
 * ReactPropTransferer are capable of transferring props to another component
 * using a `transferPropsTo` method.
 *
 * @class ReactPropTransferer
 */
var ReactPropTransferer = {

  /**
   * Merge two props objects using TransferStrategies.
   *
   * @param {object} oldProps original props (they take precedence)
   * @param {object} newProps new props to merge in
   * @return {object} a new object containing both sets of props merged.
   */
  mergeProps: function mergeProps(oldProps, newProps) {
    return transferInto(assign({}, oldProps), newProps);
  }

};

module.exports = ReactPropTransferer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0UHJvcFRyYW5zZmVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxnQkFBZ0IsUUFBUSx3QkFBUixDQUFoQjtBQUNKLElBQUksY0FBYyxRQUFRLHNCQUFSLENBQWQ7Ozs7Ozs7OztBQVNKLFNBQVMsc0JBQVQsQ0FBZ0MsYUFBaEMsRUFBK0M7QUFDN0MsU0FBTyxVQUFVLEtBQVYsRUFBaUIsR0FBakIsRUFBc0IsS0FBdEIsRUFBNkI7QUFDbEMsUUFBSSxDQUFDLE1BQU0sY0FBTixDQUFxQixHQUFyQixDQUFELEVBQTRCO0FBQzlCLFlBQU0sR0FBTixJQUFhLEtBQWIsQ0FEOEI7S0FBaEMsTUFFTztBQUNMLFlBQU0sR0FBTixJQUFhLGNBQWMsTUFBTSxHQUFOLENBQWQsRUFBMEIsS0FBMUIsQ0FBYixDQURLO0tBRlA7R0FESyxDQURzQztDQUEvQzs7QUFVQSxJQUFJLHdCQUF3Qix1QkFBdUIsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjs7OztBQUlqRSxTQUFPLE9BQU8sRUFBUCxFQUFXLENBQVgsRUFBYyxDQUFkLENBQVAsQ0FKaUU7Q0FBaEIsQ0FBL0M7Ozs7Ozs7QUFZSixJQUFJLHFCQUFxQjs7OztBQUl2QixZQUFVLGFBQVY7Ozs7QUFJQSxhQUFXLHVCQUF1QixXQUF2QixDQUFYOzs7O0FBSUEsU0FBTyxxQkFBUDtDQVpFOzs7Ozs7Ozs7O0FBdUJKLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixRQUE3QixFQUF1QztBQUNyQyxPQUFLLElBQUksT0FBSixJQUFlLFFBQXBCLEVBQThCO0FBQzVCLFFBQUksQ0FBQyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBRCxFQUFtQztBQUNyQyxlQURxQztLQUF2Qzs7QUFJQSxRQUFJLG1CQUFtQixtQkFBbUIsT0FBbkIsQ0FBbkIsQ0FMd0I7O0FBTzVCLFFBQUksb0JBQW9CLG1CQUFtQixjQUFuQixDQUFrQyxPQUFsQyxDQUFwQixFQUFnRTtBQUNsRSx1QkFBaUIsS0FBakIsRUFBd0IsT0FBeEIsRUFBaUMsU0FBUyxPQUFULENBQWpDLEVBRGtFO0tBQXBFLE1BRU8sSUFBSSxDQUFDLE1BQU0sY0FBTixDQUFxQixPQUFyQixDQUFELEVBQWdDO0FBQ3pDLFlBQU0sT0FBTixJQUFpQixTQUFTLE9BQVQsQ0FBakIsQ0FEeUM7S0FBcEM7R0FUVDtBQWFBLFNBQU8sS0FBUCxDQWRxQztDQUF2Qzs7Ozs7Ozs7QUF1QkEsSUFBSSxzQkFBc0I7Ozs7Ozs7OztBQVN4QixjQUFZLG9CQUFVLFFBQVYsRUFBb0IsUUFBcEIsRUFBOEI7QUFDeEMsV0FBTyxhQUFhLE9BQU8sRUFBUCxFQUFXLFFBQVgsQ0FBYixFQUFtQyxRQUFuQyxDQUFQLENBRHdDO0dBQTlCOztDQVRWOztBQWVKLE9BQU8sT0FBUCxHQUFpQixtQkFBakIiLCJmaWxlIjoiUmVhY3RQcm9wVHJhbnNmZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFByb3BUcmFuc2ZlcmVyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBqb2luQ2xhc3NlcyA9IHJlcXVpcmUoJ2ZianMvbGliL2pvaW5DbGFzc2VzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRyYW5zZmVyIHN0cmF0ZWd5IHRoYXQgd2lsbCBtZXJnZSBwcm9wIHZhbHVlcyB1c2luZyB0aGUgc3VwcGxpZWRcbiAqIGBtZXJnZVN0cmF0ZWd5YC4gSWYgYSBwcm9wIHdhcyBwcmV2aW91c2x5IHVuc2V0LCB0aGlzIGp1c3Qgc2V0cyBpdC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZXJnZVN0cmF0ZWd5XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVHJhbnNmZXJTdHJhdGVneShtZXJnZVN0cmF0ZWd5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAocHJvcHMsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoIXByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHByb3BzW2tleV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHNba2V5XSA9IG1lcmdlU3RyYXRlZ3kocHJvcHNba2V5XSwgdmFsdWUpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIHRyYW5zZmVyU3RyYXRlZ3lNZXJnZSA9IGNyZWF0ZVRyYW5zZmVyU3RyYXRlZ3koZnVuY3Rpb24gKGEsIGIpIHtcbiAgLy8gYG1lcmdlYCBvdmVycmlkZXMgdGhlIGZpcnN0IG9iamVjdCdzIChgcHJvcHNba2V5XWAgYWJvdmUpIGtleXMgdXNpbmcgdGhlXG4gIC8vIHNlY29uZCBvYmplY3QncyAoYHZhbHVlYCkga2V5cy4gQW4gb2JqZWN0J3Mgc3R5bGUncyBleGlzdGluZyBgcHJvcEFgIHdvdWxkXG4gIC8vIGdldCBvdmVycmlkZGVuLiBGbGlwIHRoZSBvcmRlciBoZXJlLlxuICByZXR1cm4gYXNzaWduKHt9LCBiLCBhKTtcbn0pO1xuXG4vKipcbiAqIFRyYW5zZmVyIHN0cmF0ZWdpZXMgZGljdGF0ZSBob3cgcHJvcHMgYXJlIHRyYW5zZmVycmVkIGJ5IGB0cmFuc2ZlclByb3BzVG9gLlxuICogTk9URTogaWYgeW91IGFkZCBhbnkgbW9yZSBleGNlcHRpb25zIHRvIHRoaXMgbGlzdCB5b3Ugc2hvdWxkIGJlIHN1cmUgdG9cbiAqIHVwZGF0ZSBgY2xvbmVXaXRoUHJvcHMoKWAgYWNjb3JkaW5nbHkuXG4gKi9cbnZhciBUcmFuc2ZlclN0cmF0ZWdpZXMgPSB7XG4gIC8qKlxuICAgKiBOZXZlciB0cmFuc2ZlciBgY2hpbGRyZW5gLlxuICAgKi9cbiAgY2hpbGRyZW46IGVtcHR5RnVuY3Rpb24sXG4gIC8qKlxuICAgKiBUcmFuc2ZlciB0aGUgYGNsYXNzTmFtZWAgcHJvcCBieSBtZXJnaW5nIHRoZW0uXG4gICAqL1xuICBjbGFzc05hbWU6IGNyZWF0ZVRyYW5zZmVyU3RyYXRlZ3koam9pbkNsYXNzZXMpLFxuICAvKipcbiAgICogVHJhbnNmZXIgdGhlIGBzdHlsZWAgcHJvcCAod2hpY2ggaXMgYW4gb2JqZWN0KSBieSBtZXJnaW5nIHRoZW0uXG4gICAqL1xuICBzdHlsZTogdHJhbnNmZXJTdHJhdGVneU1lcmdlXG59O1xuXG4vKipcbiAqIE11dGF0ZXMgdGhlIGZpcnN0IGFyZ3VtZW50IGJ5IHRyYW5zZmVycmluZyB0aGUgcHJvcGVydGllcyBmcm9tIHRoZSBzZWNvbmRcbiAqIGFyZ3VtZW50LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICogQHBhcmFtIHtvYmplY3R9IG5ld1Byb3BzXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zZmVySW50byhwcm9wcywgbmV3UHJvcHMpIHtcbiAgZm9yICh2YXIgdGhpc0tleSBpbiBuZXdQcm9wcykge1xuICAgIGlmICghbmV3UHJvcHMuaGFzT3duUHJvcGVydHkodGhpc0tleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2ZlclN0cmF0ZWd5ID0gVHJhbnNmZXJTdHJhdGVnaWVzW3RoaXNLZXldO1xuXG4gICAgaWYgKHRyYW5zZmVyU3RyYXRlZ3kgJiYgVHJhbnNmZXJTdHJhdGVnaWVzLmhhc093blByb3BlcnR5KHRoaXNLZXkpKSB7XG4gICAgICB0cmFuc2ZlclN0cmF0ZWd5KHByb3BzLCB0aGlzS2V5LCBuZXdQcm9wc1t0aGlzS2V5XSk7XG4gICAgfSBlbHNlIGlmICghcHJvcHMuaGFzT3duUHJvcGVydHkodGhpc0tleSkpIHtcbiAgICAgIHByb3BzW3RoaXNLZXldID0gbmV3UHJvcHNbdGhpc0tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBwcm9wcztcbn1cblxuLyoqXG4gKiBSZWFjdFByb3BUcmFuc2ZlcmVyIGFyZSBjYXBhYmxlIG9mIHRyYW5zZmVycmluZyBwcm9wcyB0byBhbm90aGVyIGNvbXBvbmVudFxuICogdXNpbmcgYSBgdHJhbnNmZXJQcm9wc1RvYCBtZXRob2QuXG4gKlxuICogQGNsYXNzIFJlYWN0UHJvcFRyYW5zZmVyZXJcbiAqL1xudmFyIFJlYWN0UHJvcFRyYW5zZmVyZXIgPSB7XG5cbiAgLyoqXG4gICAqIE1lcmdlIHR3byBwcm9wcyBvYmplY3RzIHVzaW5nIFRyYW5zZmVyU3RyYXRlZ2llcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG9sZFByb3BzIG9yaWdpbmFsIHByb3BzICh0aGV5IHRha2UgcHJlY2VkZW5jZSlcbiAgICogQHBhcmFtIHtvYmplY3R9IG5ld1Byb3BzIG5ldyBwcm9wcyB0byBtZXJnZSBpblxuICAgKiBAcmV0dXJuIHtvYmplY3R9IGEgbmV3IG9iamVjdCBjb250YWluaW5nIGJvdGggc2V0cyBvZiBwcm9wcyBtZXJnZWQuXG4gICAqL1xuICBtZXJnZVByb3BzOiBmdW5jdGlvbiAob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgcmV0dXJuIHRyYW5zZmVySW50byhhc3NpZ24oe30sIG9sZFByb3BzKSwgbmV3UHJvcHMpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHJhbnNmZXJlcjsiXX0=