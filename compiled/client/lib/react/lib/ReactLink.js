/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactLink
 * @typechecks static-only
 */

'use strict';

/**
 * ReactLink encapsulates a common pattern in which a component wants to modify
 * a prop received from its parent. ReactLink allows the parent to pass down a
 * value coupled with a callback that, when invoked, expresses an intent to
 * modify that value. For example:
 *
 * React.createClass({
 *   getInitialState: function() {
 *     return {value: ''};
 *   },
 *   render: function() {
 *     var valueLink = new ReactLink(this.state.value, this._handleValueChange);
 *     return <input valueLink={valueLink} />;
 *   },
 *   _handleValueChange: function(newValue) {
 *     this.setState({value: newValue});
 *   }
 * });
 *
 * We have provided some sugary mixins to make the creation and
 * consumption of ReactLink easier; see LinkedValueUtils and LinkedStateMixin.
 */

var React = require('./React');

/**
 * @param {*} value current value of the link
 * @param {function} requestChange callback to request a change
 */
function ReactLink(value, requestChange) {
  this.value = value;
  this.requestChange = requestChange;
}

/**
 * Creates a PropType that enforces the ReactLink API and optionally checks the
 * type of the value being passed inside the link. Example:
 *
 * MyComponent.propTypes = {
 *   tabIndexLink: ReactLink.PropTypes.link(React.PropTypes.number)
 * }
 */
function createLinkTypeChecker(linkType) {
  var shapes = {
    value: typeof linkType === 'undefined' ? React.PropTypes.any.isRequired : linkType.isRequired,
    requestChange: React.PropTypes.func.isRequired
  };
  return React.PropTypes.shape(shapes);
}

ReactLink.PropTypes = {
  link: createLinkTypeChecker
};

module.exports = ReactLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7Ozs7OztBQU1BLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixhQUExQixFQUF5QztBQUN2QyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0Q7Ozs7Ozs7Ozs7QUFVRCxTQUFTLHFCQUFULENBQStCLFFBQS9CLEVBQXlDO0FBQ3ZDLE1BQUksU0FBUztBQUNYLFdBQU8sT0FBTyxRQUFQLEtBQW9CLFdBQXBCLEdBQWtDLE1BQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixVQUF0RCxHQUFtRSxTQUFTLFVBRHhFO0FBRVgsbUJBQWUsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCO0FBRnpCLEdBQWI7QUFJQSxTQUFPLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixNQUF0QixDQUFQO0FBQ0Q7O0FBRUQsVUFBVSxTQUFWLEdBQXNCO0FBQ3BCLFFBQU07QUFEYyxDQUF0Qjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiUmVhY3RMaW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0TGlua1xuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUmVhY3RMaW5rIGVuY2Fwc3VsYXRlcyBhIGNvbW1vbiBwYXR0ZXJuIGluIHdoaWNoIGEgY29tcG9uZW50IHdhbnRzIHRvIG1vZGlmeVxuICogYSBwcm9wIHJlY2VpdmVkIGZyb20gaXRzIHBhcmVudC4gUmVhY3RMaW5rIGFsbG93cyB0aGUgcGFyZW50IHRvIHBhc3MgZG93biBhXG4gKiB2YWx1ZSBjb3VwbGVkIHdpdGggYSBjYWxsYmFjayB0aGF0LCB3aGVuIGludm9rZWQsIGV4cHJlc3NlcyBhbiBpbnRlbnQgdG9cbiAqIG1vZGlmeSB0aGF0IHZhbHVlLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gKiAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gKiAgICAgcmV0dXJuIHt2YWx1ZTogJyd9O1xuICogICB9LFxuICogICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICogICAgIHZhciB2YWx1ZUxpbmsgPSBuZXcgUmVhY3RMaW5rKHRoaXMuc3RhdGUudmFsdWUsIHRoaXMuX2hhbmRsZVZhbHVlQ2hhbmdlKTtcbiAqICAgICByZXR1cm4gPGlucHV0IHZhbHVlTGluaz17dmFsdWVMaW5rfSAvPjtcbiAqICAgfSxcbiAqICAgX2hhbmRsZVZhbHVlQ2hhbmdlOiBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICogICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBuZXdWYWx1ZX0pO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBXZSBoYXZlIHByb3ZpZGVkIHNvbWUgc3VnYXJ5IG1peGlucyB0byBtYWtlIHRoZSBjcmVhdGlvbiBhbmRcbiAqIGNvbnN1bXB0aW9uIG9mIFJlYWN0TGluayBlYXNpZXI7IHNlZSBMaW5rZWRWYWx1ZVV0aWxzIGFuZCBMaW5rZWRTdGF0ZU1peGluLlxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJy4vUmVhY3QnKTtcblxuLyoqXG4gKiBAcGFyYW0geyp9IHZhbHVlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGxpbmtcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlcXVlc3RDaGFuZ2UgY2FsbGJhY2sgdG8gcmVxdWVzdCBhIGNoYW5nZVxuICovXG5mdW5jdGlvbiBSZWFjdExpbmsodmFsdWUsIHJlcXVlc3RDaGFuZ2UpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB0aGlzLnJlcXVlc3RDaGFuZ2UgPSByZXF1ZXN0Q2hhbmdlO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBQcm9wVHlwZSB0aGF0IGVuZm9yY2VzIHRoZSBSZWFjdExpbmsgQVBJIGFuZCBvcHRpb25hbGx5IGNoZWNrcyB0aGVcbiAqIHR5cGUgb2YgdGhlIHZhbHVlIGJlaW5nIHBhc3NlZCBpbnNpZGUgdGhlIGxpbmsuIEV4YW1wbGU6XG4gKlxuICogTXlDb21wb25lbnQucHJvcFR5cGVzID0ge1xuICogICB0YWJJbmRleExpbms6IFJlYWN0TGluay5Qcm9wVHlwZXMubGluayhSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKVxuICogfVxuICovXG5mdW5jdGlvbiBjcmVhdGVMaW5rVHlwZUNoZWNrZXIobGlua1R5cGUpIHtcbiAgdmFyIHNoYXBlcyA9IHtcbiAgICB2YWx1ZTogdHlwZW9mIGxpbmtUeXBlID09PSAndW5kZWZpbmVkJyA/IFJlYWN0LlByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZCA6IGxpbmtUeXBlLmlzUmVxdWlyZWQsXG4gICAgcmVxdWVzdENoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9O1xuICByZXR1cm4gUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHNoYXBlcyk7XG59XG5cblJlYWN0TGluay5Qcm9wVHlwZXMgPSB7XG4gIGxpbms6IGNyZWF0ZUxpbmtUeXBlQ2hlY2tlclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdExpbms7Il19