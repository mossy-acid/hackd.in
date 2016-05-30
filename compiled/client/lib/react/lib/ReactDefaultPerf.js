/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var DOMProperty = require('./DOMProperty');
var ReactDefaultPerfAnalysis = require('./ReactDefaultPerfAnalysis');
var ReactMount = require('./ReactMount');
var ReactPerf = require('./ReactPerf');

var performanceNow = require('fbjs/lib/performanceNow');

function roundFloat(val) {
  return Math.floor(val * 100) / 100;
}

function addValue(obj, key, val) {
  obj[key] = (obj[key] || 0) + val;
}

var ReactDefaultPerf = {
  _allMeasurements: [], // last item in the list is the current one
  _mountStack: [0],
  _injected: false,

  start: function start() {
    if (!ReactDefaultPerf._injected) {
      ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure);
    }

    ReactDefaultPerf._allMeasurements.length = 0;
    ReactPerf.enableMeasure = true;
  },

  stop: function stop() {
    ReactPerf.enableMeasure = false;
  },

  getLastMeasurements: function getLastMeasurements() {
    return ReactDefaultPerf._allMeasurements;
  },

  printExclusive: function printExclusive(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
    console.table(summary.map(function (item) {
      return {
        'Component class name': item.componentName,
        'Total inclusive time (ms)': roundFloat(item.inclusive),
        'Exclusive mount time (ms)': roundFloat(item.exclusive),
        'Exclusive render time (ms)': roundFloat(item.render),
        'Mount time per instance (ms)': roundFloat(item.exclusive / item.count),
        'Render time per instance (ms)': roundFloat(item.render / item.count),
        'Instances': item.count
      };
    }));
    // TODO: ReactDefaultPerfAnalysis.getTotalTime() does not return the correct
    // number.
  },

  printInclusive: function printInclusive(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
    console.table(summary.map(function (item) {
      return {
        'Owner > component': item.componentName,
        'Inclusive time (ms)': roundFloat(item.time),
        'Instances': item.count
      };
    }));
    console.log('Total time:', ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms');
  },

  getMeasurementsSummaryMap: function getMeasurementsSummaryMap(measurements) {
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements, true);
    return summary.map(function (item) {
      return {
        'Owner > component': item.componentName,
        'Wasted time (ms)': item.time,
        'Instances': item.count
      };
    });
  },

  printWasted: function printWasted(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    console.table(ReactDefaultPerf.getMeasurementsSummaryMap(measurements));
    console.log('Total time:', ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms');
  },

  printDOM: function printDOM(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
    console.table(summary.map(function (item) {
      var result = {};
      result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id;
      result.type = item.type;
      result.args = JSON.stringify(item.args);
      return result;
    }));
    console.log('Total time:', ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms');
  },

  _recordWrite: function _recordWrite(id, fnName, totalTime, args) {
    // TODO: totalTime isn't that useful since it doesn't count paints/reflows
    var writes = ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1].writes;
    writes[id] = writes[id] || [];
    writes[id].push({
      type: fnName,
      time: totalTime,
      args: args
    });
  },

  measure: function measure(moduleName, fnName, func) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var totalTime;
      var rv;
      var start;

      if (fnName === '_renderNewRootComponent' || fnName === 'flushBatchedUpdates') {
        // A "measurement" is a set of metrics recorded for each flush. We want
        // to group the metrics for a given flush together so we can look at the
        // components that rendered and the DOM operations that actually
        // happened to determine the amount of "wasted work" performed.
        ReactDefaultPerf._allMeasurements.push({
          exclusive: {},
          inclusive: {},
          render: {},
          counts: {},
          writes: {},
          displayNames: {},
          totalTime: 0,
          created: {}
        });
        start = performanceNow();
        rv = func.apply(this, args);
        ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1].totalTime = performanceNow() - start;
        return rv;
      } else if (fnName === '_mountImageIntoNode' || moduleName === 'ReactBrowserEventEmitter' || moduleName === 'ReactDOMIDOperations' || moduleName === 'CSSPropertyOperations' || moduleName === 'DOMChildrenOperations' || moduleName === 'DOMPropertyOperations') {
        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (fnName === '_mountImageIntoNode') {
          var mountID = ReactMount.getID(args[1]);
          ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0]);
        } else if (fnName === 'dangerouslyProcessChildrenUpdates') {
          // special format
          args[0].forEach(function (update) {
            var writeArgs = {};
            if (update.fromIndex !== null) {
              writeArgs.fromIndex = update.fromIndex;
            }
            if (update.toIndex !== null) {
              writeArgs.toIndex = update.toIndex;
            }
            if (update.textContent !== null) {
              writeArgs.textContent = update.textContent;
            }
            if (update.markupIndex !== null) {
              writeArgs.markup = args[1][update.markupIndex];
            }
            ReactDefaultPerf._recordWrite(update.parentID, update.type, totalTime, writeArgs);
          });
        } else {
          // basic format
          var id = args[0];
          if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object') {
            id = ReactMount.getID(args[0]);
          }
          ReactDefaultPerf._recordWrite(id, fnName, totalTime, Array.prototype.slice.call(args, 1));
        }
        return rv;
      } else if (moduleName === 'ReactCompositeComponent' && (fnName === 'mountComponent' || fnName === 'updateComponent' || // TODO: receiveComponent()?
      fnName === '_renderValidatedComponent')) {

        if (this._currentElement.type === ReactMount.TopLevelWrapper) {
          return func.apply(this, args);
        }

        var rootNodeID = fnName === 'mountComponent' ? args[0] : this._rootNodeID;
        var isRender = fnName === '_renderValidatedComponent';
        var isMount = fnName === 'mountComponent';

        var mountStack = ReactDefaultPerf._mountStack;
        var entry = ReactDefaultPerf._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1];

        if (isRender) {
          addValue(entry.counts, rootNodeID, 1);
        } else if (isMount) {
          entry.created[rootNodeID] = true;
          mountStack.push(0);
        }

        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (isRender) {
          addValue(entry.render, rootNodeID, totalTime);
        } else if (isMount) {
          var subMountTime = mountStack.pop();
          mountStack[mountStack.length - 1] += totalTime;
          addValue(entry.exclusive, rootNodeID, totalTime - subMountTime);
          addValue(entry.inclusive, rootNodeID, totalTime);
        } else {
          addValue(entry.inclusive, rootNodeID, totalTime);
        }

        entry.displayNames[rootNodeID] = {
          current: this.getName(),
          owner: this._currentElement._owner ? this._currentElement._owner.getName() : '<root>'
        };

        return rv;
      } else {
        return func.apply(this, args);
      }
    };
  }
};

module.exports = ReactDefaultPerf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RGVmYXVsdFBlcmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCO0FBQ0EsSUFBSSwyQkFBMkIsUUFBUSw0QkFBUixDQUEvQjtBQUNBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCOztBQUVBLElBQUksaUJBQWlCLFFBQVEseUJBQVIsQ0FBckI7O0FBRUEsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLFNBQU8sS0FBSyxLQUFMLENBQVcsTUFBTSxHQUFqQixJQUF3QixHQUEvQjtBQUNEOztBQUVELFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QixHQUF2QixFQUE0QixHQUE1QixFQUFpQztBQUMvQixNQUFJLEdBQUosSUFBVyxDQUFDLElBQUksR0FBSixLQUFZLENBQWIsSUFBa0IsR0FBN0I7QUFDRDs7QUFFRCxJQUFJLG1CQUFtQjtBQUNyQixvQkFBa0IsRUFERyxFO0FBRXJCLGVBQWEsQ0FBQyxDQUFELENBRlE7QUFHckIsYUFBVyxLQUhVOztBQUtyQixTQUFPLGlCQUFZO0FBQ2pCLFFBQUksQ0FBQyxpQkFBaUIsU0FBdEIsRUFBaUM7QUFDL0IsZ0JBQVUsU0FBVixDQUFvQixhQUFwQixDQUFrQyxpQkFBaUIsT0FBbkQ7QUFDRDs7QUFFRCxxQkFBaUIsZ0JBQWpCLENBQWtDLE1BQWxDLEdBQTJDLENBQTNDO0FBQ0EsY0FBVSxhQUFWLEdBQTBCLElBQTFCO0FBQ0QsR0Fab0I7O0FBY3JCLFFBQU0sZ0JBQVk7QUFDaEIsY0FBVSxhQUFWLEdBQTBCLEtBQTFCO0FBQ0QsR0FoQm9COztBQWtCckIsdUJBQXFCLCtCQUFZO0FBQy9CLFdBQU8saUJBQWlCLGdCQUF4QjtBQUNELEdBcEJvQjs7QUFzQnJCLGtCQUFnQix3QkFB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QUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLElBQWpCLENBQUw7QUFDQSxvQkFBWSxtQkFBbUIsS0FBL0I7O0FBRUEsWUFBSSxRQUFKLEVBQWM7QUFDWixtQkFBUyxNQUFNLE1BQWYsRUFBdUIsVUFBdkIsRUFBbUMsU0FBbkM7QUFDRCxTQUZELE1BRU8sSUFBSSxPQUFKLEVBQWE7QUFDbEIsY0FBSSxlQUFlLFdBQVcsR0FBWCxFQUFuQjtBQUNBLHFCQUFXLFdBQVcsTUFBWCxHQUFvQixDQUEvQixLQUFxQyxTQUFyQztBQUNBLG1CQUFTLE1BQU0sU0FBZixFQUEwQixVQUExQixFQUFzQyxZQUFZLFlBQWxEO0FBQ0EsbUJBQVMsTUFBTSxTQUFmLEVBQTBCLFVBQTFCLEVBQXNDLFNBQXRDO0FBQ0QsU0FMTSxNQUtBO0FBQ0wsbUJBQVMsTUFBTSxTQUFmLEVBQTBCLFVBQTFCLEVBQXNDLFNBQXRDO0FBQ0Q7O0FBRUQsY0FBTSxZQUFOLENBQW1CLFVBQW5CLElBQWlDO0FBQy9CLG1CQUFTLEtBQUssT0FBTCxFQURzQjtBQUUvQixpQkFBTyxLQUFLLGVBQUwsQ0FBcUIsTUFBckIsR0FBOEIsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQTRCLE9BQTVCLEVBQTlCLEdBQXNFO0FBRjlDLFNBQWpDOztBQUtBLGVBQU8sRUFBUDtBQUNELE9BMUNNLE1BMENBO0FBQ0wsZUFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLElBQWpCLENBQVA7QUFDRDtBQUNGLEtBNUdEO0FBNkdEO0FBNU1vQixDQUF2Qjs7QUErTUEsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQiIsImZpbGUiOiJSZWFjdERlZmF1bHRQZXJmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RGVmYXVsdFBlcmZcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NUHJvcGVydHkgPSByZXF1aXJlKCcuL0RPTVByb3BlcnR5Jyk7XG52YXIgUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzID0gcmVxdWlyZSgnLi9SZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMnKTtcbnZhciBSZWFjdE1vdW50ID0gcmVxdWlyZSgnLi9SZWFjdE1vdW50Jyk7XG52YXIgUmVhY3RQZXJmID0gcmVxdWlyZSgnLi9SZWFjdFBlcmYnKTtcblxudmFyIHBlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgnZmJqcy9saWIvcGVyZm9ybWFuY2VOb3cnKTtcblxuZnVuY3Rpb24gcm91bmRGbG9hdCh2YWwpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IodmFsICogMTAwKSAvIDEwMDtcbn1cblxuZnVuY3Rpb24gYWRkVmFsdWUob2JqLCBrZXksIHZhbCkge1xuICBvYmpba2V5XSA9IChvYmpba2V5XSB8fCAwKSArIHZhbDtcbn1cblxudmFyIFJlYWN0RGVmYXVsdFBlcmYgPSB7XG4gIF9hbGxNZWFzdXJlbWVudHM6IFtdLCAvLyBsYXN0IGl0ZW0gaW4gdGhlIGxpc3QgaXMgdGhlIGN1cnJlbnQgb25lXG4gIF9tb3VudFN0YWNrOiBbMF0sXG4gIF9pbmplY3RlZDogZmFsc2UsXG5cbiAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIVJlYWN0RGVmYXVsdFBlcmYuX2luamVjdGVkKSB7XG4gICAgICBSZWFjdFBlcmYuaW5qZWN0aW9uLmluamVjdE1lYXN1cmUoUmVhY3REZWZhdWx0UGVyZi5tZWFzdXJlKTtcbiAgICB9XG5cbiAgICBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHMubGVuZ3RoID0gMDtcbiAgICBSZWFjdFBlcmYuZW5hYmxlTWVhc3VyZSA9IHRydWU7XG4gIH0sXG5cbiAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgIFJlYWN0UGVyZi5lbmFibGVNZWFzdXJlID0gZmFsc2U7XG4gIH0sXG5cbiAgZ2V0TGFzdE1lYXN1cmVtZW50czogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHM7XG4gIH0sXG5cbiAgcHJpbnRFeGNsdXNpdmU6IGZ1bmN0aW9uIChtZWFzdXJlbWVudHMpIHtcbiAgICBtZWFzdXJlbWVudHMgPSBtZWFzdXJlbWVudHMgfHwgUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzO1xuICAgIHZhciBzdW1tYXJ5ID0gUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmdldEV4Y2x1c2l2ZVN1bW1hcnkobWVhc3VyZW1lbnRzKTtcbiAgICBjb25zb2xlLnRhYmxlKHN1bW1hcnkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAnQ29tcG9uZW50IGNsYXNzIG5hbWUnOiBpdGVtLmNvbXBvbmVudE5hbWUsXG4gICAgICAgICdUb3RhbCBpbmNsdXNpdmUgdGltZSAobXMpJzogcm91bmRGbG9hdChpdGVtLmluY2x1c2l2ZSksXG4gICAgICAgICdFeGNsdXNpdmUgbW91bnQgdGltZSAobXMpJzogcm91bmRGbG9hdChpdGVtLmV4Y2x1c2l2ZSksXG4gICAgICAgICdFeGNsdXNpdmUgcmVuZGVyIHRpbWUgKG1zKSc6IHJvdW5kRmxvYXQoaXRlbS5yZW5kZXIpLFxuICAgICAgICAnTW91bnQgdGltZSBwZXIgaW5zdGFuY2UgKG1zKSc6IHJvdW5kRmxvYXQoaXRlbS5leGNsdXNpdmUgLyBpdGVtLmNvdW50KSxcbiAgICAgICAgJ1JlbmRlciB0aW1lIHBlciBpbnN0YW5jZSAobXMpJzogcm91bmRGbG9hdChpdGVtLnJlbmRlciAvIGl0ZW0uY291bnQpLFxuICAgICAgICAnSW5zdGFuY2VzJzogaXRlbS5jb3VudFxuICAgICAgfTtcbiAgICB9KSk7XG4gICAgLy8gVE9ETzogUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmdldFRvdGFsVGltZSgpIGRvZXMgbm90IHJldHVybiB0aGUgY29ycmVjdFxuICAgIC8vIG51bWJlci5cbiAgfSxcblxuICBwcmludEluY2x1c2l2ZTogZnVuY3Rpb24gKG1lYXN1cmVtZW50cykge1xuICAgIG1lYXN1cmVtZW50cyA9IG1lYXN1cmVtZW50cyB8fCBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHM7XG4gICAgdmFyIHN1bW1hcnkgPSBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0SW5jbHVzaXZlU3VtbWFyeShtZWFzdXJlbWVudHMpO1xuICAgIGNvbnNvbGUudGFibGUoc3VtbWFyeS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdPd25lciA+IGNvbXBvbmVudCc6IGl0ZW0uY29tcG9uZW50TmFtZSxcbiAgICAgICAgJ0luY2x1c2l2ZSB0aW1lIChtcyknOiByb3VuZEZsb2F0KGl0ZW0udGltZSksXG4gICAgICAgICdJbnN0YW5jZXMnOiBpdGVtLmNvdW50XG4gICAgICB9O1xuICAgIH0pKTtcbiAgICBjb25zb2xlLmxvZygnVG90YWwgdGltZTonLCBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0VG90YWxUaW1lKG1lYXN1cmVtZW50cykudG9GaXhlZCgyKSArICcgbXMnKTtcbiAgfSxcblxuICBnZXRNZWFzdXJlbWVudHNTdW1tYXJ5TWFwOiBmdW5jdGlvbiAobWVhc3VyZW1lbnRzKSB7XG4gICAgdmFyIHN1bW1hcnkgPSBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0SW5jbHVzaXZlU3VtbWFyeShtZWFzdXJlbWVudHMsIHRydWUpO1xuICAgIHJldHVybiBzdW1tYXJ5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ093bmVyID4gY29tcG9uZW50JzogaXRlbS5jb21wb25lbnROYW1lLFxuICAgICAgICAnV2FzdGVkIHRpbWUgKG1zKSc6IGl0ZW0udGltZSxcbiAgICAgICAgJ0luc3RhbmNlcyc6IGl0ZW0uY291bnRcbiAgICAgIH07XG4gICAgfSk7XG4gIH0sXG5cbiAgcHJpbnRXYXN0ZWQ6IGZ1bmN0aW9uIChtZWFzdXJlbWVudHMpIHtcbiAgICBtZWFzdXJlbWVudHMgPSBtZWFzdXJlbWVudHMgfHwgUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzO1xuICAgIGNvbnNvbGUudGFibGUoUmVhY3REZWZhdWx0UGVyZi5nZXRNZWFzdXJlbWVudHNTdW1tYXJ5TWFwKG1lYXN1cmVtZW50cykpO1xuICAgIGNvbnNvbGUubG9nKCdUb3RhbCB0aW1lOicsIFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5nZXRUb3RhbFRpbWUobWVhc3VyZW1lbnRzKS50b0ZpeGVkKDIpICsgJyBtcycpO1xuICB9LFxuXG4gIHByaW50RE9NOiBmdW5jdGlvbiAobWVhc3VyZW1lbnRzKSB7XG4gICAgbWVhc3VyZW1lbnRzID0gbWVhc3VyZW1lbnRzIHx8IFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50cztcbiAgICB2YXIgc3VtbWFyeSA9IFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5nZXRET01TdW1tYXJ5KG1lYXN1cmVtZW50cyk7XG4gICAgY29uc29sZS50YWJsZShzdW1tYXJ5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0W0RPTVByb3BlcnR5LklEX0FUVFJJQlVURV9OQU1FXSA9IGl0ZW0uaWQ7XG4gICAgICByZXN1bHQudHlwZSA9IGl0ZW0udHlwZTtcbiAgICAgIHJlc3VsdC5hcmdzID0gSlNPTi5zdHJpbmdpZnkoaXRlbS5hcmdzKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSkpO1xuICAgIGNvbnNvbGUubG9nKCdUb3RhbCB0aW1lOicsIFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5nZXRUb3RhbFRpbWUobWVhc3VyZW1lbnRzKS50b0ZpeGVkKDIpICsgJyBtcycpO1xuICB9LFxuXG4gIF9yZWNvcmRXcml0ZTogZnVuY3Rpb24gKGlkLCBmbk5hbWUsIHRvdGFsVGltZSwgYXJncykge1xuICAgIC8vIFRPRE86IHRvdGFsVGltZSBpc24ndCB0aGF0IHVzZWZ1bCBzaW5jZSBpdCBkb2Vzbid0IGNvdW50IHBhaW50cy9yZWZsb3dzXG4gICAgdmFyIHdyaXRlcyA9IFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50c1tSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHMubGVuZ3RoIC0gMV0ud3JpdGVzO1xuICAgIHdyaXRlc1tpZF0gPSB3cml0ZXNbaWRdIHx8IFtdO1xuICAgIHdyaXRlc1tpZF0ucHVzaCh7XG4gICAgICB0eXBlOiBmbk5hbWUsXG4gICAgICB0aW1lOiB0b3RhbFRpbWUsXG4gICAgICBhcmdzOiBhcmdzXG4gICAgfSk7XG4gIH0sXG5cbiAgbWVhc3VyZTogZnVuY3Rpb24gKG1vZHVsZU5hbWUsIGZuTmFtZSwgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG90YWxUaW1lO1xuICAgICAgdmFyIHJ2O1xuICAgICAgdmFyIHN0YXJ0O1xuXG4gICAgICBpZiAoZm5OYW1lID09PSAnX3JlbmRlck5ld1Jvb3RDb21wb25lbnQnIHx8IGZuTmFtZSA9PT0gJ2ZsdXNoQmF0Y2hlZFVwZGF0ZXMnKSB7XG4gICAgICAgIC8vIEEgXCJtZWFzdXJlbWVudFwiIGlzIGEgc2V0IG9mIG1ldHJpY3MgcmVjb3JkZWQgZm9yIGVhY2ggZmx1c2guIFdlIHdhbnRcbiAgICAgICAgLy8gdG8gZ3JvdXAgdGhlIG1ldHJpY3MgZm9yIGEgZ2l2ZW4gZmx1c2ggdG9nZXRoZXIgc28gd2UgY2FuIGxvb2sgYXQgdGhlXG4gICAgICAgIC8vIGNvbXBvbmVudHMgdGhhdCByZW5kZXJlZCBhbmQgdGhlIERPTSBvcGVyYXRpb25zIHRoYXQgYWN0dWFsbHlcbiAgICAgICAgLy8gaGFwcGVuZWQgdG8gZGV0ZXJtaW5lIHRoZSBhbW91bnQgb2YgXCJ3YXN0ZWQgd29ya1wiIHBlcmZvcm1lZC5cbiAgICAgICAgUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzLnB1c2goe1xuICAgICAgICAgIGV4Y2x1c2l2ZToge30sXG4gICAgICAgICAgaW5jbHVzaXZlOiB7fSxcbiAgICAgICAgICByZW5kZXI6IHt9LFxuICAgICAgICAgIGNvdW50czoge30sXG4gICAgICAgICAgd3JpdGVzOiB7fSxcbiAgICAgICAgICBkaXNwbGF5TmFtZXM6IHt9LFxuICAgICAgICAgIHRvdGFsVGltZTogMCxcbiAgICAgICAgICBjcmVhdGVkOiB7fVxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnQgPSBwZXJmb3JtYW5jZU5vdygpO1xuICAgICAgICBydiA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50c1tSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHMubGVuZ3RoIC0gMV0udG90YWxUaW1lID0gcGVyZm9ybWFuY2VOb3coKSAtIHN0YXJ0O1xuICAgICAgICByZXR1cm4gcnY7XG4gICAgICB9IGVsc2UgaWYgKGZuTmFtZSA9PT0gJ19tb3VudEltYWdlSW50b05vZGUnIHx8IG1vZHVsZU5hbWUgPT09ICdSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXInIHx8IG1vZHVsZU5hbWUgPT09ICdSZWFjdERPTUlET3BlcmF0aW9ucycgfHwgbW9kdWxlTmFtZSA9PT0gJ0NTU1Byb3BlcnR5T3BlcmF0aW9ucycgfHwgbW9kdWxlTmFtZSA9PT0gJ0RPTUNoaWxkcmVuT3BlcmF0aW9ucycgfHwgbW9kdWxlTmFtZSA9PT0gJ0RPTVByb3BlcnR5T3BlcmF0aW9ucycpIHtcbiAgICAgICAgc3RhcnQgPSBwZXJmb3JtYW5jZU5vdygpO1xuICAgICAgICBydiA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIHRvdGFsVGltZSA9IHBlcmZvcm1hbmNlTm93KCkgLSBzdGFydDtcblxuICAgICAgICBpZiAoZm5OYW1lID09PSAnX21vdW50SW1hZ2VJbnRvTm9kZScpIHtcbiAgICAgICAgICB2YXIgbW91bnRJRCA9IFJlYWN0TW91bnQuZ2V0SUQoYXJnc1sxXSk7XG4gICAgICAgICAgUmVhY3REZWZhdWx0UGVyZi5fcmVjb3JkV3JpdGUobW91bnRJRCwgZm5OYW1lLCB0b3RhbFRpbWUsIGFyZ3NbMF0pO1xuICAgICAgICB9IGVsc2UgaWYgKGZuTmFtZSA9PT0gJ2Rhbmdlcm91c2x5UHJvY2Vzc0NoaWxkcmVuVXBkYXRlcycpIHtcbiAgICAgICAgICAvLyBzcGVjaWFsIGZvcm1hdFxuICAgICAgICAgIGFyZ3NbMF0uZm9yRWFjaChmdW5jdGlvbiAodXBkYXRlKSB7XG4gICAgICAgICAgICB2YXIgd3JpdGVBcmdzID0ge307XG4gICAgICAgICAgICBpZiAodXBkYXRlLmZyb21JbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB3cml0ZUFyZ3MuZnJvbUluZGV4ID0gdXBkYXRlLmZyb21JbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGUudG9JbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB3cml0ZUFyZ3MudG9JbmRleCA9IHVwZGF0ZS50b0luZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZS50ZXh0Q29udGVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB3cml0ZUFyZ3MudGV4dENvbnRlbnQgPSB1cGRhdGUudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlLm1hcmt1cEluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHdyaXRlQXJncy5tYXJrdXAgPSBhcmdzWzFdW3VwZGF0ZS5tYXJrdXBJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSZWFjdERlZmF1bHRQZXJmLl9yZWNvcmRXcml0ZSh1cGRhdGUucGFyZW50SUQsIHVwZGF0ZS50eXBlLCB0b3RhbFRpbWUsIHdyaXRlQXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYmFzaWMgZm9ybWF0XG4gICAgICAgICAgdmFyIGlkID0gYXJnc1swXTtcbiAgICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWQgPSBSZWFjdE1vdW50LmdldElEKGFyZ3NbMF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBSZWFjdERlZmF1bHRQZXJmLl9yZWNvcmRXcml0ZShpZCwgZm5OYW1lLCB0b3RhbFRpbWUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgICB9IGVsc2UgaWYgKG1vZHVsZU5hbWUgPT09ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcgJiYgKGZuTmFtZSA9PT0gJ21vdW50Q29tcG9uZW50JyB8fCBmbk5hbWUgPT09ICd1cGRhdGVDb21wb25lbnQnIHx8IC8vIFRPRE86IHJlY2VpdmVDb21wb25lbnQoKT9cbiAgICAgIGZuTmFtZSA9PT0gJ19yZW5kZXJWYWxpZGF0ZWRDb21wb25lbnQnKSkge1xuXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50RWxlbWVudC50eXBlID09PSBSZWFjdE1vdW50LlRvcExldmVsV3JhcHBlcikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvb3ROb2RlSUQgPSBmbk5hbWUgPT09ICdtb3VudENvbXBvbmVudCcgPyBhcmdzWzBdIDogdGhpcy5fcm9vdE5vZGVJRDtcbiAgICAgICAgdmFyIGlzUmVuZGVyID0gZm5OYW1lID09PSAnX3JlbmRlclZhbGlkYXRlZENvbXBvbmVudCc7XG4gICAgICAgIHZhciBpc01vdW50ID0gZm5OYW1lID09PSAnbW91bnRDb21wb25lbnQnO1xuXG4gICAgICAgIHZhciBtb3VudFN0YWNrID0gUmVhY3REZWZhdWx0UGVyZi5fbW91bnRTdGFjaztcbiAgICAgICAgdmFyIGVudHJ5ID0gUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzW1JlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICBpZiAoaXNSZW5kZXIpIHtcbiAgICAgICAgICBhZGRWYWx1ZShlbnRyeS5jb3VudHMsIHJvb3ROb2RlSUQsIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTW91bnQpIHtcbiAgICAgICAgICBlbnRyeS5jcmVhdGVkW3Jvb3ROb2RlSURdID0gdHJ1ZTtcbiAgICAgICAgICBtb3VudFN0YWNrLnB1c2goMCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCA9IHBlcmZvcm1hbmNlTm93KCk7XG4gICAgICAgIHJ2ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgdG90YWxUaW1lID0gcGVyZm9ybWFuY2VOb3coKSAtIHN0YXJ0O1xuXG4gICAgICAgIGlmIChpc1JlbmRlcikge1xuICAgICAgICAgIGFkZFZhbHVlKGVudHJ5LnJlbmRlciwgcm9vdE5vZGVJRCwgdG90YWxUaW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdW50KSB7XG4gICAgICAgICAgdmFyIHN1Yk1vdW50VGltZSA9IG1vdW50U3RhY2sucG9wKCk7XG4gICAgICAgICAgbW91bnRTdGFja1ttb3VudFN0YWNrLmxlbmd0aCAtIDFdICs9IHRvdGFsVGltZTtcbiAgICAgICAgICBhZGRWYWx1ZShlbnRyeS5leGNsdXNpdmUsIHJvb3ROb2RlSUQsIHRvdGFsVGltZSAtIHN1Yk1vdW50VGltZSk7XG4gICAgICAgICAgYWRkVmFsdWUoZW50cnkuaW5jbHVzaXZlLCByb290Tm9kZUlELCB0b3RhbFRpbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkZFZhbHVlKGVudHJ5LmluY2x1c2l2ZSwgcm9vdE5vZGVJRCwgdG90YWxUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVudHJ5LmRpc3BsYXlOYW1lc1tyb290Tm9kZUlEXSA9IHtcbiAgICAgICAgICBjdXJyZW50OiB0aGlzLmdldE5hbWUoKSxcbiAgICAgICAgICBvd25lcjogdGhpcy5fY3VycmVudEVsZW1lbnQuX293bmVyID8gdGhpcy5fY3VycmVudEVsZW1lbnQuX293bmVyLmdldE5hbWUoKSA6ICc8cm9vdD4nXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERlZmF1bHRQZXJmOyJdfQ==