/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createHierarchyRenderer
 */

'use strict';

var React = require('./React');

/**
 * Creates a render method that makes it easier to create, render, and inspect a
 * hierarchy of mock React component classes.
 *
 * A component class is created for each of the supplied render methods. Each
 * render method is invoked with the classes created using the render methods
 * that come after it in the supplied list of render methods.
 *
 *   var renderHierarchy = createHierarchyRenderer(
 *     function ComponentA(ComponentB, ComponentC) {...},
 *     function ComponentB(ComponentC) {...},
 *     function ComponentC() {...}
 *   );
 *
 * When the hierarchy is invoked, a two-dimensional array is returned. Each
 * array corresponds to a supplied render method and contains the instances
 * returned by that render method in the order it was invoked.
 *
 *   var instances = renderHierarchy(
 *     function(ComponentA[, ComponentB, ComponentC]) {
 *       ReactDOM.render(<ComponentA />, ...);
 *     })
 *   );
 *   instances[0][0]; // First return value of first render method.
 *   instances[1][0]; // First return value of second render method.
 *   instances[1][1]; // Second return value of second render method.
 *
 * Refs should be used to reference components that are not the return value of
 * render methods.
 *
 *   expect(instances[0][0].refs.X).toBe(...);
 *
 * NOTE: The component classes created for each render method are re-used for
 * each invocation of the hierarchy renderer. If new classes are needed, you
 * should re-execute `createHierarchyRenderer` with the same arguments.
 *
 * @param {array<function>} ...renderMethods
 * @return {function}
 */
function createHierarchyRenderer() {
  for (var _len = arguments.length, renderMethods = Array(_len), _key = 0; _key < _len; _key++) {
    renderMethods[_key] = arguments[_key];
  }

  var instances;
  var Components = renderMethods.reduceRight(function (ComponentsAccumulator, renderMethod, depth) {
    var Component = React.createClass({
      displayName: renderMethod.name,
      render: function render() {
        instances[depth].push(this);
        return renderMethod.apply(this, ComponentsAccumulator);
      }
    });
    return [Component].concat(ComponentsAccumulator);
  }, []);
  /**
   * @param {function} renderComponent
   * @return {array<array<*>>}
   */
  function renderHierarchy(renderComponent) {
    instances = renderMethods.map(function () {
      return [];
    });
    renderComponent.apply(null, Components);
    return instances;
  }
  return renderHierarchy;
}

module.exports = createHierarchyRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2NyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxTQUFTLHVCQUFULEdBQW1DO0FBQ2pDLE9BQUssSUFBSSxPQUFPLFVBQVUsTUFBckIsRUFBNkIsZ0JBQWdCLE1BQU0sSUFBTixDQUE3QyxFQUEwRCxPQUFPLENBQXRFLEVBQXlFLE9BQU8sSUFBaEYsRUFBc0YsTUFBdEYsRUFBOEY7QUFDNUYsa0JBQWMsSUFBZCxJQUFzQixVQUFVLElBQVYsQ0FBdEI7QUFDRDs7QUFFRCxNQUFJLFNBQUo7QUFDQSxNQUFJLGFBQWEsY0FBYyxXQUFkLENBQTBCLFVBQVUscUJBQVYsRUFBaUMsWUFBakMsRUFBK0MsS0FBL0MsRUFBc0Q7QUFDL0YsUUFBSSxZQUFZLE1BQU0sV0FBTixDQUFrQjtBQUNoQyxtQkFBYSxhQUFhLElBRE07QUFFaEMsY0FBUSxrQkFBWTtBQUNsQixrQkFBVSxLQUFWLEVBQWlCLElBQWpCLENBQXNCLElBQXRCO0FBQ0EsZUFBTyxhQUFhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIscUJBQXpCLENBQVA7QUFDRDtBQUwrQixLQUFsQixDQUFoQjtBQU9BLFdBQU8sQ0FBQyxTQUFELEVBQVksTUFBWixDQUFtQixxQkFBbkIsQ0FBUDtBQUNELEdBVGdCLEVBU2QsRUFUYyxDQUFqQjs7Ozs7QUFjQSxXQUFTLGVBQVQsQ0FBeUIsZUFBekIsRUFBMEM7QUFDeEMsZ0JBQVksY0FBYyxHQUFkLENBQWtCLFlBQVk7QUFDeEMsYUFBTyxFQUFQO0FBQ0QsS0FGVyxDQUFaO0FBR0Esb0JBQWdCLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCO0FBQ0EsV0FBTyxTQUFQO0FBQ0Q7QUFDRCxTQUFPLGVBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsdUJBQWpCIiwiZmlsZSI6ImNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCcuL1JlYWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlbmRlciBtZXRob2QgdGhhdCBtYWtlcyBpdCBlYXNpZXIgdG8gY3JlYXRlLCByZW5kZXIsIGFuZCBpbnNwZWN0IGFcbiAqIGhpZXJhcmNoeSBvZiBtb2NrIFJlYWN0IGNvbXBvbmVudCBjbGFzc2VzLlxuICpcbiAqIEEgY29tcG9uZW50IGNsYXNzIGlzIGNyZWF0ZWQgZm9yIGVhY2ggb2YgdGhlIHN1cHBsaWVkIHJlbmRlciBtZXRob2RzLiBFYWNoXG4gKiByZW5kZXIgbWV0aG9kIGlzIGludm9rZWQgd2l0aCB0aGUgY2xhc3NlcyBjcmVhdGVkIHVzaW5nIHRoZSByZW5kZXIgbWV0aG9kc1xuICogdGhhdCBjb21lIGFmdGVyIGl0IGluIHRoZSBzdXBwbGllZCBsaXN0IG9mIHJlbmRlciBtZXRob2RzLlxuICpcbiAqICAgdmFyIHJlbmRlckhpZXJhcmNoeSA9IGNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyKFxuICogICAgIGZ1bmN0aW9uIENvbXBvbmVudEEoQ29tcG9uZW50QiwgQ29tcG9uZW50Qykgey4uLn0sXG4gKiAgICAgZnVuY3Rpb24gQ29tcG9uZW50QihDb21wb25lbnRDKSB7Li4ufSxcbiAqICAgICBmdW5jdGlvbiBDb21wb25lbnRDKCkgey4uLn1cbiAqICAgKTtcbiAqXG4gKiBXaGVuIHRoZSBoaWVyYXJjaHkgaXMgaW52b2tlZCwgYSB0d28tZGltZW5zaW9uYWwgYXJyYXkgaXMgcmV0dXJuZWQuIEVhY2hcbiAqIGFycmF5IGNvcnJlc3BvbmRzIHRvIGEgc3VwcGxpZWQgcmVuZGVyIG1ldGhvZCBhbmQgY29udGFpbnMgdGhlIGluc3RhbmNlc1xuICogcmV0dXJuZWQgYnkgdGhhdCByZW5kZXIgbWV0aG9kIGluIHRoZSBvcmRlciBpdCB3YXMgaW52b2tlZC5cbiAqXG4gKiAgIHZhciBpbnN0YW5jZXMgPSByZW5kZXJIaWVyYXJjaHkoXG4gKiAgICAgZnVuY3Rpb24oQ29tcG9uZW50QVssIENvbXBvbmVudEIsIENvbXBvbmVudENdKSB7XG4gKiAgICAgICBSZWFjdERPTS5yZW5kZXIoPENvbXBvbmVudEEgLz4sIC4uLik7XG4gKiAgICAgfSlcbiAqICAgKTtcbiAqICAgaW5zdGFuY2VzWzBdWzBdOyAvLyBGaXJzdCByZXR1cm4gdmFsdWUgb2YgZmlyc3QgcmVuZGVyIG1ldGhvZC5cbiAqICAgaW5zdGFuY2VzWzFdWzBdOyAvLyBGaXJzdCByZXR1cm4gdmFsdWUgb2Ygc2Vjb25kIHJlbmRlciBtZXRob2QuXG4gKiAgIGluc3RhbmNlc1sxXVsxXTsgLy8gU2Vjb25kIHJldHVybiB2YWx1ZSBvZiBzZWNvbmQgcmVuZGVyIG1ldGhvZC5cbiAqXG4gKiBSZWZzIHNob3VsZCBiZSB1c2VkIHRvIHJlZmVyZW5jZSBjb21wb25lbnRzIHRoYXQgYXJlIG5vdCB0aGUgcmV0dXJuIHZhbHVlIG9mXG4gKiByZW5kZXIgbWV0aG9kcy5cbiAqXG4gKiAgIGV4cGVjdChpbnN0YW5jZXNbMF1bMF0ucmVmcy5YKS50b0JlKC4uLik7XG4gKlxuICogTk9URTogVGhlIGNvbXBvbmVudCBjbGFzc2VzIGNyZWF0ZWQgZm9yIGVhY2ggcmVuZGVyIG1ldGhvZCBhcmUgcmUtdXNlZCBmb3JcbiAqIGVhY2ggaW52b2NhdGlvbiBvZiB0aGUgaGllcmFyY2h5IHJlbmRlcmVyLiBJZiBuZXcgY2xhc3NlcyBhcmUgbmVlZGVkLCB5b3VcbiAqIHNob3VsZCByZS1leGVjdXRlIGBjcmVhdGVIaWVyYXJjaHlSZW5kZXJlcmAgd2l0aCB0aGUgc2FtZSBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHthcnJheTxmdW5jdGlvbj59IC4uLnJlbmRlck1ldGhvZHNcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBjcmVhdGVIaWVyYXJjaHlSZW5kZXJlcigpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHJlbmRlck1ldGhvZHMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICByZW5kZXJNZXRob2RzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGluc3RhbmNlcztcbiAgdmFyIENvbXBvbmVudHMgPSByZW5kZXJNZXRob2RzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChDb21wb25lbnRzQWNjdW11bGF0b3IsIHJlbmRlck1ldGhvZCwgZGVwdGgpIHtcbiAgICB2YXIgQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgZGlzcGxheU5hbWU6IHJlbmRlck1ldGhvZC5uYW1lLFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluc3RhbmNlc1tkZXB0aF0ucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHJlbmRlck1ldGhvZC5hcHBseSh0aGlzLCBDb21wb25lbnRzQWNjdW11bGF0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBbQ29tcG9uZW50XS5jb25jYXQoQ29tcG9uZW50c0FjY3VtdWxhdG9yKTtcbiAgfSwgW10pO1xuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVuZGVyQ29tcG9uZW50XG4gICAqIEByZXR1cm4ge2FycmF5PGFycmF5PCo+Pn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlbmRlckhpZXJhcmNoeShyZW5kZXJDb21wb25lbnQpIHtcbiAgICBpbnN0YW5jZXMgPSByZW5kZXJNZXRob2RzLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSk7XG4gICAgcmVuZGVyQ29tcG9uZW50LmFwcGx5KG51bGwsIENvbXBvbmVudHMpO1xuICAgIHJldHVybiBpbnN0YW5jZXM7XG4gIH1cbiAgcmV0dXJuIHJlbmRlckhpZXJhcmNoeTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVIaWVyYXJjaHlSZW5kZXJlcjsiXX0=