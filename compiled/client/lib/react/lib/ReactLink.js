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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVI7Ozs7OztBQU1KLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixhQUExQixFQUF5QztBQUN2QyxPQUFLLEtBQUwsR0FBYSxLQUFiLENBRHVDO0FBRXZDLE9BQUssYUFBTCxHQUFxQixhQUFyQixDQUZ1QztDQUF6Qzs7Ozs7Ozs7OztBQWFBLFNBQVMscUJBQVQsQ0FBK0IsUUFBL0IsRUFBeUM7QUFDdkMsTUFBSSxTQUFTO0FBQ1gsV0FBTyxPQUFPLFFBQVAsS0FBb0IsV0FBcEIsR0FBa0MsTUFBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLFVBQXBCLEdBQWlDLFNBQVMsVUFBVDtBQUMxRSxtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7R0FGYixDQURtQztBQUt2QyxTQUFPLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixNQUF0QixDQUFQLENBTHVDO0NBQXpDOztBQVFBLFVBQVUsU0FBVixHQUFzQjtBQUNwQixRQUFNLHFCQUFOO0NBREY7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6IlJlYWN0TGluay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdExpbmtcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFJlYWN0TGluayBlbmNhcHN1bGF0ZXMgYSBjb21tb24gcGF0dGVybiBpbiB3aGljaCBhIGNvbXBvbmVudCB3YW50cyB0byBtb2RpZnlcbiAqIGEgcHJvcCByZWNlaXZlZCBmcm9tIGl0cyBwYXJlbnQuIFJlYWN0TGluayBhbGxvd3MgdGhlIHBhcmVudCB0byBwYXNzIGRvd24gYVxuICogdmFsdWUgY291cGxlZCB3aXRoIGEgY2FsbGJhY2sgdGhhdCwgd2hlbiBpbnZva2VkLCBleHByZXNzZXMgYW4gaW50ZW50IHRvXG4gKiBtb2RpZnkgdGhhdCB2YWx1ZS4gRm9yIGV4YW1wbGU6XG4gKlxuICogUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICogICAgIHJldHVybiB7dmFsdWU6ICcnfTtcbiAqICAgfSxcbiAqICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAqICAgICB2YXIgdmFsdWVMaW5rID0gbmV3IFJlYWN0TGluayh0aGlzLnN0YXRlLnZhbHVlLCB0aGlzLl9oYW5kbGVWYWx1ZUNoYW5nZSk7XG4gKiAgICAgcmV0dXJuIDxpbnB1dCB2YWx1ZUxpbms9e3ZhbHVlTGlua30gLz47XG4gKiAgIH0sXG4gKiAgIF9oYW5kbGVWYWx1ZUNoYW5nZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAqICAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogbmV3VmFsdWV9KTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogV2UgaGF2ZSBwcm92aWRlZCBzb21lIHN1Z2FyeSBtaXhpbnMgdG8gbWFrZSB0aGUgY3JlYXRpb24gYW5kXG4gKiBjb25zdW1wdGlvbiBvZiBSZWFjdExpbmsgZWFzaWVyOyBzZWUgTGlua2VkVmFsdWVVdGlscyBhbmQgTGlua2VkU3RhdGVNaXhpbi5cbiAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCcuL1JlYWN0Jyk7XG5cbi8qKlxuICogQHBhcmFtIHsqfSB2YWx1ZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBsaW5rXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSByZXF1ZXN0Q2hhbmdlIGNhbGxiYWNrIHRvIHJlcXVlc3QgYSBjaGFuZ2VcbiAqL1xuZnVuY3Rpb24gUmVhY3RMaW5rKHZhbHVlLCByZXF1ZXN0Q2hhbmdlKSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5yZXF1ZXN0Q2hhbmdlID0gcmVxdWVzdENoYW5nZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgUHJvcFR5cGUgdGhhdCBlbmZvcmNlcyB0aGUgUmVhY3RMaW5rIEFQSSBhbmQgb3B0aW9uYWxseSBjaGVja3MgdGhlXG4gKiB0eXBlIG9mIHRoZSB2YWx1ZSBiZWluZyBwYXNzZWQgaW5zaWRlIHRoZSBsaW5rLiBFeGFtcGxlOlxuICpcbiAqIE15Q29tcG9uZW50LnByb3BUeXBlcyA9IHtcbiAqICAgdGFiSW5kZXhMaW5rOiBSZWFjdExpbmsuUHJvcFR5cGVzLmxpbmsoUmVhY3QuUHJvcFR5cGVzLm51bWJlcilcbiAqIH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTGlua1R5cGVDaGVja2VyKGxpbmtUeXBlKSB7XG4gIHZhciBzaGFwZXMgPSB7XG4gICAgdmFsdWU6IHR5cGVvZiBsaW5rVHlwZSA9PT0gJ3VuZGVmaW5lZCcgPyBSZWFjdC5Qcm9wVHlwZXMuYW55LmlzUmVxdWlyZWQgOiBsaW5rVHlwZS5pc1JlcXVpcmVkLFxuICAgIHJlcXVlc3RDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfTtcbiAgcmV0dXJuIFJlYWN0LlByb3BUeXBlcy5zaGFwZShzaGFwZXMpO1xufVxuXG5SZWFjdExpbmsuUHJvcFR5cGVzID0ge1xuICBsaW5rOiBjcmVhdGVMaW5rVHlwZUNoZWNrZXJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RMaW5rOyJdfQ==