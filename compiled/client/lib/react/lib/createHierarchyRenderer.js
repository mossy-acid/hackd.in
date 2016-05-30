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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2NyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDSixTQUFTLHVCQUFULEdBQW1DO0FBQ2pDLE9BQUssSUFBSSxPQUFPLFVBQVUsTUFBVixFQUFrQixnQkFBZ0IsTUFBTSxJQUFOLENBQWhCLEVBQTZCLE9BQU8sQ0FBUCxFQUFVLE9BQU8sSUFBUCxFQUFhLE1BQXRGLEVBQThGO0FBQzVGLGtCQUFjLElBQWQsSUFBc0IsVUFBVSxJQUFWLENBQXRCLENBRDRGO0dBQTlGOztBQUlBLE1BQUksU0FBSixDQUxpQztBQU1qQyxNQUFJLGFBQWEsY0FBYyxXQUFkLENBQTBCLFVBQVUscUJBQVYsRUFBaUMsWUFBakMsRUFBK0MsS0FBL0MsRUFBc0Q7QUFDL0YsUUFBSSxZQUFZLE1BQU0sV0FBTixDQUFrQjtBQUNoQyxtQkFBYSxhQUFhLElBQWI7QUFDYixjQUFRLGtCQUFZO0FBQ2xCLGtCQUFVLEtBQVYsRUFBaUIsSUFBakIsQ0FBc0IsSUFBdEIsRUFEa0I7QUFFbEIsZUFBTyxhQUFhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIscUJBQXpCLENBQVAsQ0FGa0I7T0FBWjtLQUZNLENBQVosQ0FEMkY7QUFRL0YsV0FBTyxDQUFDLFNBQUQsRUFBWSxNQUFaLENBQW1CLHFCQUFuQixDQUFQLENBUitGO0dBQXRELEVBU3hDLEVBVGMsQ0FBYjs7Ozs7QUFONkIsV0FvQnhCLGVBQVQsQ0FBeUIsZUFBekIsRUFBMEM7QUFDeEMsZ0JBQVksY0FBYyxHQUFkLENBQWtCLFlBQVk7QUFDeEMsYUFBTyxFQUFQLENBRHdDO0tBQVosQ0FBOUIsQ0FEd0M7QUFJeEMsb0JBQWdCLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBSndDO0FBS3hDLFdBQU8sU0FBUCxDQUx3QztHQUExQztBQU9BLFNBQU8sZUFBUCxDQTNCaUM7Q0FBbkM7O0FBOEJBLE9BQU8sT0FBUCxHQUFpQix1QkFBakIiLCJmaWxlIjoiY3JlYXRlSGllcmFyY2h5UmVuZGVyZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgY3JlYXRlSGllcmFyY2h5UmVuZGVyZXJcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJy4vUmVhY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVuZGVyIG1ldGhvZCB0aGF0IG1ha2VzIGl0IGVhc2llciB0byBjcmVhdGUsIHJlbmRlciwgYW5kIGluc3BlY3QgYVxuICogaGllcmFyY2h5IG9mIG1vY2sgUmVhY3QgY29tcG9uZW50IGNsYXNzZXMuXG4gKlxuICogQSBjb21wb25lbnQgY2xhc3MgaXMgY3JlYXRlZCBmb3IgZWFjaCBvZiB0aGUgc3VwcGxpZWQgcmVuZGVyIG1ldGhvZHMuIEVhY2hcbiAqIHJlbmRlciBtZXRob2QgaXMgaW52b2tlZCB3aXRoIHRoZSBjbGFzc2VzIGNyZWF0ZWQgdXNpbmcgdGhlIHJlbmRlciBtZXRob2RzXG4gKiB0aGF0IGNvbWUgYWZ0ZXIgaXQgaW4gdGhlIHN1cHBsaWVkIGxpc3Qgb2YgcmVuZGVyIG1ldGhvZHMuXG4gKlxuICogICB2YXIgcmVuZGVySGllcmFyY2h5ID0gY3JlYXRlSGllcmFyY2h5UmVuZGVyZXIoXG4gKiAgICAgZnVuY3Rpb24gQ29tcG9uZW50QShDb21wb25lbnRCLCBDb21wb25lbnRDKSB7Li4ufSxcbiAqICAgICBmdW5jdGlvbiBDb21wb25lbnRCKENvbXBvbmVudEMpIHsuLi59LFxuICogICAgIGZ1bmN0aW9uIENvbXBvbmVudEMoKSB7Li4ufVxuICogICApO1xuICpcbiAqIFdoZW4gdGhlIGhpZXJhcmNoeSBpcyBpbnZva2VkLCBhIHR3by1kaW1lbnNpb25hbCBhcnJheSBpcyByZXR1cm5lZC4gRWFjaFxuICogYXJyYXkgY29ycmVzcG9uZHMgdG8gYSBzdXBwbGllZCByZW5kZXIgbWV0aG9kIGFuZCBjb250YWlucyB0aGUgaW5zdGFuY2VzXG4gKiByZXR1cm5lZCBieSB0aGF0IHJlbmRlciBtZXRob2QgaW4gdGhlIG9yZGVyIGl0IHdhcyBpbnZva2VkLlxuICpcbiAqICAgdmFyIGluc3RhbmNlcyA9IHJlbmRlckhpZXJhcmNoeShcbiAqICAgICBmdW5jdGlvbihDb21wb25lbnRBWywgQ29tcG9uZW50QiwgQ29tcG9uZW50Q10pIHtcbiAqICAgICAgIFJlYWN0RE9NLnJlbmRlcig8Q29tcG9uZW50QSAvPiwgLi4uKTtcbiAqICAgICB9KVxuICogICApO1xuICogICBpbnN0YW5jZXNbMF1bMF07IC8vIEZpcnN0IHJldHVybiB2YWx1ZSBvZiBmaXJzdCByZW5kZXIgbWV0aG9kLlxuICogICBpbnN0YW5jZXNbMV1bMF07IC8vIEZpcnN0IHJldHVybiB2YWx1ZSBvZiBzZWNvbmQgcmVuZGVyIG1ldGhvZC5cbiAqICAgaW5zdGFuY2VzWzFdWzFdOyAvLyBTZWNvbmQgcmV0dXJuIHZhbHVlIG9mIHNlY29uZCByZW5kZXIgbWV0aG9kLlxuICpcbiAqIFJlZnMgc2hvdWxkIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGNvbXBvbmVudHMgdGhhdCBhcmUgbm90IHRoZSByZXR1cm4gdmFsdWUgb2ZcbiAqIHJlbmRlciBtZXRob2RzLlxuICpcbiAqICAgZXhwZWN0KGluc3RhbmNlc1swXVswXS5yZWZzLlgpLnRvQmUoLi4uKTtcbiAqXG4gKiBOT1RFOiBUaGUgY29tcG9uZW50IGNsYXNzZXMgY3JlYXRlZCBmb3IgZWFjaCByZW5kZXIgbWV0aG9kIGFyZSByZS11c2VkIGZvclxuICogZWFjaCBpbnZvY2F0aW9uIG9mIHRoZSBoaWVyYXJjaHkgcmVuZGVyZXIuIElmIG5ldyBjbGFzc2VzIGFyZSBuZWVkZWQsIHlvdVxuICogc2hvdWxkIHJlLWV4ZWN1dGUgYGNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyYCB3aXRoIHRoZSBzYW1lIGFyZ3VtZW50cy5cbiAqXG4gKiBAcGFyYW0ge2FycmF5PGZ1bmN0aW9uPn0gLi4ucmVuZGVyTWV0aG9kc1xuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgcmVuZGVyTWV0aG9kcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHJlbmRlck1ldGhvZHNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgaW5zdGFuY2VzO1xuICB2YXIgQ29tcG9uZW50cyA9IHJlbmRlck1ldGhvZHMucmVkdWNlUmlnaHQoZnVuY3Rpb24gKENvbXBvbmVudHNBY2N1bXVsYXRvciwgcmVuZGVyTWV0aG9kLCBkZXB0aCkge1xuICAgIHZhciBDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgICBkaXNwbGF5TmFtZTogcmVuZGVyTWV0aG9kLm5hbWUsXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5zdGFuY2VzW2RlcHRoXS5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gcmVuZGVyTWV0aG9kLmFwcGx5KHRoaXMsIENvbXBvbmVudHNBY2N1bXVsYXRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFtDb21wb25lbnRdLmNvbmNhdChDb21wb25lbnRzQWNjdW11bGF0b3IpO1xuICB9LCBbXSk7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSByZW5kZXJDb21wb25lbnRcbiAgICogQHJldHVybiB7YXJyYXk8YXJyYXk8Kj4+fVxuICAgKi9cbiAgZnVuY3Rpb24gcmVuZGVySGllcmFyY2h5KHJlbmRlckNvbXBvbmVudCkge1xuICAgIGluc3RhbmNlcyA9IHJlbmRlck1ldGhvZHMubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9KTtcbiAgICByZW5kZXJDb21wb25lbnQuYXBwbHkobnVsbCwgQ29tcG9uZW50cyk7XG4gICAgcmV0dXJuIGluc3RhbmNlcztcbiAgfVxuICByZXR1cm4gcmVuZGVySGllcmFyY2h5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUhpZXJhcmNoeVJlbmRlcmVyOyJdfQ==