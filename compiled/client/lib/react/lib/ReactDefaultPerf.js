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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RGVmYXVsdFBlcmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7Ozs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWQ7QUFDSixJQUFJLDJCQUEyQixRQUFRLDRCQUFSLENBQTNCO0FBQ0osSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFiO0FBQ0osSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFaOztBQUVKLElBQUksaUJBQWlCLFFBQVEseUJBQVIsQ0FBakI7O0FBRUosU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCO0FBQ3ZCLFNBQU8sS0FBSyxLQUFMLENBQVcsTUFBTSxHQUFOLENBQVgsR0FBd0IsR0FBeEIsQ0FEZ0I7Q0FBekI7O0FBSUEsU0FBUyxRQUFULENBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLE1BQUksR0FBSixJQUFXLENBQUMsSUFBSSxHQUFKLEtBQVksQ0FBWixDQUFELEdBQWtCLEdBQWxCLENBRG9CO0NBQWpDOztBQUlBLElBQUksbUJBQW1CO0FBQ3JCLG9CQUFrQixFQUFsQjtBQUNBLGVBQWEsQ0FBQyxDQUFELENBQWI7QUFDQSxhQUFXLEtBQVg7O0FBRUEsU0FBTyxpQkFBWTtBQUNqQixRQUFJLENBQUMsaUJBQWlCLFNBQWpCLEVBQTRCO0FBQy9CLGdCQUFVLFNBQVYsQ0FBb0IsYUFBcEIsQ0FBa0MsaUJBQWlCLE9BQWpCLENBQWxDLENBRCtCO0tBQWpDOztBQUlBLHFCQUFpQixnQkFBakIsQ0FBa0MsTUFBbEMsR0FBMkMsQ0FBM0MsQ0FMaUI7QUFNakIsY0FBVSxhQUFWLEdBQTBCLElBQTFCLENBTmlCO0dBQVo7O0FBU1AsUUFBTSxnQkFBWTtBQUNoQixjQUFVLGFBQVYsR0FBMEIsS0FBMUIsQ0FEZ0I7R0FBWjs7QUFJTix1QkFBcUIsK0JBQVk7QUFDL0IsV0FBTyxpQkFBaUIsZ0JBQWpCLENB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LENBQTRCLE9BQTVCLEVBQTlCLEdBQXNFLFFBQXRFO1NBRlQsQ0FuQ3VDOztBQXdDdkMsZUFBTyxFQUFQLENBeEN1QztPQURsQyxNQTBDQTtBQUNMLGVBQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFQLENBREs7T0ExQ0E7S0EvREYsQ0FEb0M7R0FBcEM7Q0E5RlA7O0FBK01KLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiUmVhY3REZWZhdWx0UGVyZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERlZmF1bHRQZXJmXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIERPTVByb3BlcnR5ID0gcmVxdWlyZSgnLi9ET01Qcm9wZXJ0eScpO1xudmFyIFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcyA9IHJlcXVpcmUoJy4vUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzJyk7XG52YXIgUmVhY3RNb3VudCA9IHJlcXVpcmUoJy4vUmVhY3RNb3VudCcpO1xudmFyIFJlYWN0UGVyZiA9IHJlcXVpcmUoJy4vUmVhY3RQZXJmJyk7XG5cbnZhciBwZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ2ZianMvbGliL3BlcmZvcm1hbmNlTm93Jyk7XG5cbmZ1bmN0aW9uIHJvdW5kRmxvYXQodmFsKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKHZhbCAqIDEwMCkgLyAxMDA7XG59XG5cbmZ1bmN0aW9uIGFkZFZhbHVlKG9iaiwga2V5LCB2YWwpIHtcbiAgb2JqW2tleV0gPSAob2JqW2tleV0gfHwgMCkgKyB2YWw7XG59XG5cbnZhciBSZWFjdERlZmF1bHRQZXJmID0ge1xuICBfYWxsTWVhc3VyZW1lbnRzOiBbXSwgLy8gbGFzdCBpdGVtIGluIHRoZSBsaXN0IGlzIHRoZSBjdXJyZW50IG9uZVxuICBfbW91bnRTdGFjazogWzBdLFxuICBfaW5qZWN0ZWQ6IGZhbHNlLFxuXG4gIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFSZWFjdERlZmF1bHRQZXJmLl9pbmplY3RlZCkge1xuICAgICAgUmVhY3RQZXJmLmluamVjdGlvbi5pbmplY3RNZWFzdXJlKFJlYWN0RGVmYXVsdFBlcmYubWVhc3VyZSk7XG4gICAgfVxuXG4gICAgUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgUmVhY3RQZXJmLmVuYWJsZU1lYXN1cmUgPSB0cnVlO1xuICB9LFxuXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICBSZWFjdFBlcmYuZW5hYmxlTWVhc3VyZSA9IGZhbHNlO1xuICB9LFxuXG4gIGdldExhc3RNZWFzdXJlbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzO1xuICB9LFxuXG4gIHByaW50RXhjbHVzaXZlOiBmdW5jdGlvbiAobWVhc3VyZW1lbnRzKSB7XG4gICAgbWVhc3VyZW1lbnRzID0gbWVhc3VyZW1lbnRzIHx8IFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50cztcbiAgICB2YXIgc3VtbWFyeSA9IFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5nZXRFeGNsdXNpdmVTdW1tYXJ5KG1lYXN1cmVtZW50cyk7XG4gICAgY29uc29sZS50YWJsZShzdW1tYXJ5Lm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ0NvbXBvbmVudCBjbGFzcyBuYW1lJzogaXRlbS5jb21wb25lbnROYW1lLFxuICAgICAgICAnVG90YWwgaW5jbHVzaXZlIHRpbWUgKG1zKSc6IHJvdW5kRmxvYXQoaXRlbS5pbmNsdXNpdmUpLFxuICAgICAgICAnRXhjbHVzaXZlIG1vdW50IHRpbWUgKG1zKSc6IHJvdW5kRmxvYXQoaXRlbS5leGNsdXNpdmUpLFxuICAgICAgICAnRXhjbHVzaXZlIHJlbmRlciB0aW1lIChtcyknOiByb3VuZEZsb2F0KGl0ZW0ucmVuZGVyKSxcbiAgICAgICAgJ01vdW50IHRpbWUgcGVyIGluc3RhbmNlIChtcyknOiByb3VuZEZsb2F0KGl0ZW0uZXhjbHVzaXZlIC8gaXRlbS5jb3VudCksXG4gICAgICAgICdSZW5kZXIgdGltZSBwZXIgaW5zdGFuY2UgKG1zKSc6IHJvdW5kRmxvYXQoaXRlbS5yZW5kZXIgLyBpdGVtLmNvdW50KSxcbiAgICAgICAgJ0luc3RhbmNlcyc6IGl0ZW0uY291bnRcbiAgICAgIH07XG4gICAgfSkpO1xuICAgIC8vIFRPRE86IFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5nZXRUb3RhbFRpbWUoKSBkb2VzIG5vdCByZXR1cm4gdGhlIGNvcnJlY3RcbiAgICAvLyBudW1iZXIuXG4gIH0sXG5cbiAgcHJpbnRJbmNsdXNpdmU6IGZ1bmN0aW9uIChtZWFzdXJlbWVudHMpIHtcbiAgICBtZWFzdXJlbWVudHMgPSBtZWFzdXJlbWVudHMgfHwgUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzO1xuICAgIHZhciBzdW1tYXJ5ID0gUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmdldEluY2x1c2l2ZVN1bW1hcnkobWVhc3VyZW1lbnRzKTtcbiAgICBjb25zb2xlLnRhYmxlKHN1bW1hcnkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAnT3duZXIgPiBjb21wb25lbnQnOiBpdGVtLmNvbXBvbmVudE5hbWUsXG4gICAgICAgICdJbmNsdXNpdmUgdGltZSAobXMpJzogcm91bmRGbG9hdChpdGVtLnRpbWUpLFxuICAgICAgICAnSW5zdGFuY2VzJzogaXRlbS5jb3VudFxuICAgICAgfTtcbiAgICB9KSk7XG4gICAgY29uc29sZS5sb2coJ1RvdGFsIHRpbWU6JywgUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmdldFRvdGFsVGltZShtZWFzdXJlbWVudHMpLnRvRml4ZWQoMikgKyAnIG1zJyk7XG4gIH0sXG5cbiAgZ2V0TWVhc3VyZW1lbnRzU3VtbWFyeU1hcDogZnVuY3Rpb24gKG1lYXN1cmVtZW50cykge1xuICAgIHZhciBzdW1tYXJ5ID0gUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmdldEluY2x1c2l2ZVN1bW1hcnkobWVhc3VyZW1lbnRzLCB0cnVlKTtcbiAgICByZXR1cm4gc3VtbWFyeS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICdPd25lciA+IGNvbXBvbmVudCc6IGl0ZW0uY29tcG9uZW50TmFtZSxcbiAgICAgICAgJ1dhc3RlZCB0aW1lIChtcyknOiBpdGVtLnRpbWUsXG4gICAgICAgICdJbnN0YW5jZXMnOiBpdGVtLmNvdW50XG4gICAgICB9O1xuICAgIH0pO1xuICB9LFxuXG4gIHByaW50V2FzdGVkOiBmdW5jdGlvbiAobWVhc3VyZW1lbnRzKSB7XG4gICAgbWVhc3VyZW1lbnRzID0gbWVhc3VyZW1lbnRzIHx8IFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50cztcbiAgICBjb25zb2xlLnRhYmxlKFJlYWN0RGVmYXVsdFBlcmYuZ2V0TWVhc3VyZW1lbnRzU3VtbWFyeU1hcChtZWFzdXJlbWVudHMpKTtcbiAgICBjb25zb2xlLmxvZygnVG90YWwgdGltZTonLCBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0VG90YWxUaW1lKG1lYXN1cmVtZW50cykudG9GaXhlZCgyKSArICcgbXMnKTtcbiAgfSxcblxuICBwcmludERPTTogZnVuY3Rpb24gKG1lYXN1cmVtZW50cykge1xuICAgIG1lYXN1cmVtZW50cyA9IG1lYXN1cmVtZW50cyB8fCBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHM7XG4gICAgdmFyIHN1bW1hcnkgPSBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0RE9NU3VtbWFyeShtZWFzdXJlbWVudHMpO1xuICAgIGNvbnNvbGUudGFibGUoc3VtbWFyeS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdFtET01Qcm9wZXJ0eS5JRF9BVFRSSUJVVEVfTkFNRV0gPSBpdGVtLmlkO1xuICAgICAgcmVzdWx0LnR5cGUgPSBpdGVtLnR5cGU7XG4gICAgICByZXN1bHQuYXJncyA9IEpTT04uc3RyaW5naWZ5KGl0ZW0uYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pKTtcbiAgICBjb25zb2xlLmxvZygnVG90YWwgdGltZTonLCBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXMuZ2V0VG90YWxUaW1lKG1lYXN1cmVtZW50cykudG9GaXhlZCgyKSArICcgbXMnKTtcbiAgfSxcblxuICBfcmVjb3JkV3JpdGU6IGZ1bmN0aW9uIChpZCwgZm5OYW1lLCB0b3RhbFRpbWUsIGFyZ3MpIHtcbiAgICAvLyBUT0RPOiB0b3RhbFRpbWUgaXNuJ3QgdGhhdCB1c2VmdWwgc2luY2UgaXQgZG9lc24ndCBjb3VudCBwYWludHMvcmVmbG93c1xuICAgIHZhciB3cml0ZXMgPSBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHNbUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzLmxlbmd0aCAtIDFdLndyaXRlcztcbiAgICB3cml0ZXNbaWRdID0gd3JpdGVzW2lkXSB8fCBbXTtcbiAgICB3cml0ZXNbaWRdLnB1c2goe1xuICAgICAgdHlwZTogZm5OYW1lLFxuICAgICAgdGltZTogdG90YWxUaW1lLFxuICAgICAgYXJnczogYXJnc1xuICAgIH0pO1xuICB9LFxuXG4gIG1lYXN1cmU6IGZ1bmN0aW9uIChtb2R1bGVOYW1lLCBmbk5hbWUsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsVGltZTtcbiAgICAgIHZhciBydjtcbiAgICAgIHZhciBzdGFydDtcblxuICAgICAgaWYgKGZuTmFtZSA9PT0gJ19yZW5kZXJOZXdSb290Q29tcG9uZW50JyB8fCBmbk5hbWUgPT09ICdmbHVzaEJhdGNoZWRVcGRhdGVzJykge1xuICAgICAgICAvLyBBIFwibWVhc3VyZW1lbnRcIiBpcyBhIHNldCBvZiBtZXRyaWNzIHJlY29yZGVkIGZvciBlYWNoIGZsdXNoLiBXZSB3YW50XG4gICAgICAgIC8vIHRvIGdyb3VwIHRoZSBtZXRyaWNzIGZvciBhIGdpdmVuIGZsdXNoIHRvZ2V0aGVyIHNvIHdlIGNhbiBsb29rIGF0IHRoZVxuICAgICAgICAvLyBjb21wb25lbnRzIHRoYXQgcmVuZGVyZWQgYW5kIHRoZSBET00gb3BlcmF0aW9ucyB0aGF0IGFjdHVhbGx5XG4gICAgICAgIC8vIGhhcHBlbmVkIHRvIGRldGVybWluZSB0aGUgYW1vdW50IG9mIFwid2FzdGVkIHdvcmtcIiBwZXJmb3JtZWQuXG4gICAgICAgIFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50cy5wdXNoKHtcbiAgICAgICAgICBleGNsdXNpdmU6IHt9LFxuICAgICAgICAgIGluY2x1c2l2ZToge30sXG4gICAgICAgICAgcmVuZGVyOiB7fSxcbiAgICAgICAgICBjb3VudHM6IHt9LFxuICAgICAgICAgIHdyaXRlczoge30sXG4gICAgICAgICAgZGlzcGxheU5hbWVzOiB7fSxcbiAgICAgICAgICB0b3RhbFRpbWU6IDAsXG4gICAgICAgICAgY3JlYXRlZDoge31cbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0ID0gcGVyZm9ybWFuY2VOb3coKTtcbiAgICAgICAgcnYgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICBSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHNbUmVhY3REZWZhdWx0UGVyZi5fYWxsTWVhc3VyZW1lbnRzLmxlbmd0aCAtIDFdLnRvdGFsVGltZSA9IHBlcmZvcm1hbmNlTm93KCkgLSBzdGFydDtcbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgfSBlbHNlIGlmIChmbk5hbWUgPT09ICdfbW91bnRJbWFnZUludG9Ob2RlJyB8fCBtb2R1bGVOYW1lID09PSAnUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyJyB8fCBtb2R1bGVOYW1lID09PSAnUmVhY3RET01JRE9wZXJhdGlvbnMnIHx8IG1vZHVsZU5hbWUgPT09ICdDU1NQcm9wZXJ0eU9wZXJhdGlvbnMnIHx8IG1vZHVsZU5hbWUgPT09ICdET01DaGlsZHJlbk9wZXJhdGlvbnMnIHx8IG1vZHVsZU5hbWUgPT09ICdET01Qcm9wZXJ0eU9wZXJhdGlvbnMnKSB7XG4gICAgICAgIHN0YXJ0ID0gcGVyZm9ybWFuY2VOb3coKTtcbiAgICAgICAgcnYgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB0b3RhbFRpbWUgPSBwZXJmb3JtYW5jZU5vdygpIC0gc3RhcnQ7XG5cbiAgICAgICAgaWYgKGZuTmFtZSA9PT0gJ19tb3VudEltYWdlSW50b05vZGUnKSB7XG4gICAgICAgICAgdmFyIG1vdW50SUQgPSBSZWFjdE1vdW50LmdldElEKGFyZ3NbMV0pO1xuICAgICAgICAgIFJlYWN0RGVmYXVsdFBlcmYuX3JlY29yZFdyaXRlKG1vdW50SUQsIGZuTmFtZSwgdG90YWxUaW1lLCBhcmdzWzBdKTtcbiAgICAgICAgfSBlbHNlIGlmIChmbk5hbWUgPT09ICdkYW5nZXJvdXNseVByb2Nlc3NDaGlsZHJlblVwZGF0ZXMnKSB7XG4gICAgICAgICAgLy8gc3BlY2lhbCBmb3JtYXRcbiAgICAgICAgICBhcmdzWzBdLmZvckVhY2goZnVuY3Rpb24gKHVwZGF0ZSkge1xuICAgICAgICAgICAgdmFyIHdyaXRlQXJncyA9IHt9O1xuICAgICAgICAgICAgaWYgKHVwZGF0ZS5mcm9tSW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgd3JpdGVBcmdzLmZyb21JbmRleCA9IHVwZGF0ZS5mcm9tSW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlLnRvSW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgd3JpdGVBcmdzLnRvSW5kZXggPSB1cGRhdGUudG9JbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGUudGV4dENvbnRlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgd3JpdGVBcmdzLnRleHRDb250ZW50ID0gdXBkYXRlLnRleHRDb250ZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZS5tYXJrdXBJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB3cml0ZUFyZ3MubWFya3VwID0gYXJnc1sxXVt1cGRhdGUubWFya3VwSW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmVhY3REZWZhdWx0UGVyZi5fcmVjb3JkV3JpdGUodXBkYXRlLnBhcmVudElELCB1cGRhdGUudHlwZSwgdG90YWxUaW1lLCB3cml0ZUFyZ3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGJhc2ljIGZvcm1hdFxuICAgICAgICAgIHZhciBpZCA9IGFyZ3NbMF07XG4gICAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlkID0gUmVhY3RNb3VudC5nZXRJRChhcmdzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgUmVhY3REZWZhdWx0UGVyZi5fcmVjb3JkV3JpdGUoaWQsIGZuTmFtZSwgdG90YWxUaW1lLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgICAgfSBlbHNlIGlmIChtb2R1bGVOYW1lID09PSAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnICYmIChmbk5hbWUgPT09ICdtb3VudENvbXBvbmVudCcgfHwgZm5OYW1lID09PSAndXBkYXRlQ29tcG9uZW50JyB8fCAvLyBUT0RPOiByZWNlaXZlQ29tcG9uZW50KCk/XG4gICAgICBmbk5hbWUgPT09ICdfcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50JykpIHtcblxuICAgICAgICBpZiAodGhpcy5fY3VycmVudEVsZW1lbnQudHlwZSA9PT0gUmVhY3RNb3VudC5Ub3BMZXZlbFdyYXBwZXIpIHtcbiAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByb290Tm9kZUlEID0gZm5OYW1lID09PSAnbW91bnRDb21wb25lbnQnID8gYXJnc1swXSA6IHRoaXMuX3Jvb3ROb2RlSUQ7XG4gICAgICAgIHZhciBpc1JlbmRlciA9IGZuTmFtZSA9PT0gJ19yZW5kZXJWYWxpZGF0ZWRDb21wb25lbnQnO1xuICAgICAgICB2YXIgaXNNb3VudCA9IGZuTmFtZSA9PT0gJ21vdW50Q29tcG9uZW50JztcblxuICAgICAgICB2YXIgbW91bnRTdGFjayA9IFJlYWN0RGVmYXVsdFBlcmYuX21vdW50U3RhY2s7XG4gICAgICAgIHZhciBlbnRyeSA9IFJlYWN0RGVmYXVsdFBlcmYuX2FsbE1lYXN1cmVtZW50c1tSZWFjdERlZmF1bHRQZXJmLl9hbGxNZWFzdXJlbWVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgaWYgKGlzUmVuZGVyKSB7XG4gICAgICAgICAgYWRkVmFsdWUoZW50cnkuY291bnRzLCByb290Tm9kZUlELCAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdW50KSB7XG4gICAgICAgICAgZW50cnkuY3JlYXRlZFtyb290Tm9kZUlEXSA9IHRydWU7XG4gICAgICAgICAgbW91bnRTdGFjay5wdXNoKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnQgPSBwZXJmb3JtYW5jZU5vdygpO1xuICAgICAgICBydiA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIHRvdGFsVGltZSA9IHBlcmZvcm1hbmNlTm93KCkgLSBzdGFydDtcblxuICAgICAgICBpZiAoaXNSZW5kZXIpIHtcbiAgICAgICAgICBhZGRWYWx1ZShlbnRyeS5yZW5kZXIsIHJvb3ROb2RlSUQsIHRvdGFsVGltZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNNb3VudCkge1xuICAgICAgICAgIHZhciBzdWJNb3VudFRpbWUgPSBtb3VudFN0YWNrLnBvcCgpO1xuICAgICAgICAgIG1vdW50U3RhY2tbbW91bnRTdGFjay5sZW5ndGggLSAxXSArPSB0b3RhbFRpbWU7XG4gICAgICAgICAgYWRkVmFsdWUoZW50cnkuZXhjbHVzaXZlLCByb290Tm9kZUlELCB0b3RhbFRpbWUgLSBzdWJNb3VudFRpbWUpO1xuICAgICAgICAgIGFkZFZhbHVlKGVudHJ5LmluY2x1c2l2ZSwgcm9vdE5vZGVJRCwgdG90YWxUaW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGRWYWx1ZShlbnRyeS5pbmNsdXNpdmUsIHJvb3ROb2RlSUQsIHRvdGFsVGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbnRyeS5kaXNwbGF5TmFtZXNbcm9vdE5vZGVJRF0gPSB7XG4gICAgICAgICAgY3VycmVudDogdGhpcy5nZXROYW1lKCksXG4gICAgICAgICAgb3duZXI6IHRoaXMuX2N1cnJlbnRFbGVtZW50Ll9vd25lciA/IHRoaXMuX2N1cnJlbnRFbGVtZW50Ll9vd25lci5nZXROYW1lKCkgOiAnPHJvb3Q+J1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBydjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3REZWZhdWx0UGVyZjsiXX0=