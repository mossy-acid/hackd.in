'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './tooltip'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./tooltip'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Tooltip);
    global.popover = mod.exports;
  }
})(undefined, function (exports, module, _tooltip) {
  'use strict';

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  }();

  var _get = function get(_x, _x2, _x3) {
    var _again = true;_function: while (_again) {
      var object = _x,
          property = _x2,
          receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
          return undefined;
        } else {
          _x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;
        }
      } else if ('value' in desc) {
        return desc.value;
      } else {
        var getter = desc.get;if (getter === undefined) {
          return undefined;
        }return getter.call(receiver);
      }
    }
  };

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _Tooltip2 = _interopRequireDefault(_tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Popover = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'popover';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.popover';
    var EVENT_KEY = '.' + DATA_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME];

    var Default = $.extend({}, _Tooltip2['default'].Default, {
      placement: 'right',
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-title"></h3>' + '<div class="popover-content"></div></div>'
    });

    var DefaultType = $.extend({}, _Tooltip2['default'].DefaultType, {
      content: '(string|element|function)'
    });

    var ClassName = {
      FADE: 'fade',
      IN: 'in'
    };

    var Selector = {
      TITLE: '.popover-title',
      CONTENT: '.popover-content',
      ARROW: '.popover-arrow'
    };

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      INSERTED: 'inserted' + EVENT_KEY,
      CLICK: 'click' + EVENT_KEY,
      FOCUSIN: 'focusin' + EVENT_KEY,
      FOCUSOUT: 'focusout' + EVENT_KEY,
      MOUSEENTER: 'mouseenter' + EVENT_KEY,
      MOUSELEAVE: 'mouseleave' + EVENT_KEY
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Popover = function (_Tooltip) {
      _inherits(Popover, _Tooltip);

      function Popover() {
        _classCallCheck(this, Popover);

        _get(Object.getPrototypeOf(Popover.prototype), 'constructor', this).apply(this, arguments);
      }

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      _createClass(Popover, [{
        key: 'isWithContent',

        // overrides

        value: function isWithContent() {
          return this.getTitle() || this._getContent();
        }
      }, {
        key: 'getTipElement',
        value: function getTipElement() {
          return this.tip = this.tip || $(this.config.template)[0];
        }
      }, {
        key: 'setContent',
        value: function setContent() {
          var $tip = $(this.getTipElement());

          // we use append for html objects to maintain js events
          this.setElementContent($tip.find(Selector.TITLE), this.getTitle());
          this.setElementContent($tip.find(Selector.CONTENT), this._getContent());

          $tip.removeClass(ClassName.FADE).removeClass(ClassName.IN);

          this.cleanupTether();
        }

        // private

      }, {
        key: '_getContent',
        value: function _getContent() {
          return this.element.getAttribute('data-content') || (typeof this.config.content === 'function' ? this.config.content.call(this.element) : this.config.content);
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = $(this).data(DATA_KEY);
            var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' ? config : null;

            if (!data && /destroy|hide/.test(config)) {
              return;
            }

            if (!data) {
              data = new Popover(this, _config);
              $(this).data(DATA_KEY, data);
            }

            if (typeof config === 'string') {
              if (data[config] === undefined) {
                throw new Error('No method named "' + config + '"');
              }
              data[config]();
            }
          });
        }
      }, {
        key: 'VERSION',

        // getters

        get: function get() {
          return VERSION;
        }
      }, {
        key: 'Default',
        get: function get() {
          return Default;
        }
      }, {
        key: 'NAME',
        get: function get() {
          return NAME;
        }
      }, {
        key: 'DATA_KEY',
        get: function get() {
          return DATA_KEY;
        }
      }, {
        key: 'Event',
        get: function get() {
          return Event;
        }
      }, {
        key: 'EVENT_KEY',
        get: function get() {
          return EVENT_KEY;
        }
      }, {
        key: 'DefaultType',
        get: function get() {
          return DefaultType;
        }
      }]);

      return Popover;
    }(_Tooltip2['default']);

    $.fn[NAME] = Popover._jQueryInterface;
    $.fn[NAME].Constructor = Popover;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Popover._jQueryInterface;
    };

    return Popover;
  }(jQuery);

  module.exports = Popover;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL3BvcG92ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLENBQUMsVUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCO0FBQzFCLE1BQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDOUMsV0FBTyxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFdBQXRCLENBQVAsRUFBMkMsT0FBM0M7QUFDRCxHQUZELE1BRU8sSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0MsT0FBTyxNQUFQLEtBQWtCLFdBQXhELEVBQXFFO0FBQzFFLFlBQVEsT0FBUixFQUFpQixNQUFqQixFQUF5QixRQUFRLFdBQVIsQ0FBekI7QUFDRCxHQUZNLE1BRUE7QUFDTCxRQUFJLE1BQU07QUFDUixlQUFTO0FBREQsS0FBVjtBQUdBLFlBQVEsSUFBSSxPQUFaLEVBQXFCLEdBQXJCLEVBQTBCLE9BQU8sT0FBakM7QUFDQSxXQUFPLE9BQVAsR0FBaUIsSUFBSSxPQUFyQjtBQUNEO0FBQ0YsQ0FaRCxhQVlTLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQixRQUEzQixFQUFxQztBQUM1Qzs7QUFFQSxNQUFJLGVBQWdCLFlBQVk7QUFBRSxhQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxZQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCLENBQTJCLFdBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQsQ0FBd0QsV0FBVyxZQUFYLEdBQTBCLElBQTFCLENBQWdDLElBQUksV0FBVyxVQUFmLEVBQTJCLFdBQVcsUUFBWCxHQUFzQixJQUF0QixDQUE0QixPQUFPLGNBQVAsQ0FB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aUJBQU8sUUFBUDtBQUNEO0FBSkEsT0ExQ0MsRUErQ0Q7QUFDRCxhQUFLLE9BREo7QUFFRCxhQUFLLFNBQVMsR0FBVCxHQUFlO0FBQ2xCLGlCQUFPLEtBQVA7QUFDRDtBQUpBLE9BL0NDLEVBb0REO0FBQ0QsYUFBSyxXQURKO0FBRUQsYUFBSyxTQUFTLEdBQVQsR0FBZTtBQUNsQixpQkFBTyxTQUFQO0FBQ0Q7QUFKQSxPQXBEQyxFQXlERDtBQUNELGFBQUssYUFESjtBQUVELGFBQUssU0FBUyxHQUFULEdBQWU7QUFDbEIsaUJBQU8sV0FBUDtBQUNEO0FBSkEsT0F6REMsQ0FyQ0o7O0FBcUdBLGFBQU8sT0FBUDtBQUNELEtBckhhLENBcUhYLFVBQVUsU0FBVixDQXJIVyxDQUFkOztBQXVIQSxNQUFFLEVBQUYsQ0FBSyxJQUFMLElBQWEsUUFBUSxnQkFBckI7QUFDQSxNQUFFLEVBQUYsQ0FBSyxJQUFMLEVBQVcsV0FBWCxHQUF5QixPQUF6QjtBQUNBLE1BQUUsRUFBRixDQUFLLElBQUwsRUFBVyxVQUFYLEdBQXdCLFlBQVk7QUFDbEMsUUFBRSxFQUFGLENBQUssSUFBTCxJQUFhLGtCQUFiO0FBQ0EsYUFBTyxRQUFRLGdCQUFmO0FBQ0QsS0FIRDs7QUFLQSxXQUFPLE9BQVA7QUFDRCxHQXRMYSxDQXNMWCxNQXRMVyxDQUFkOztBQXdMQSxTQUFPLE9BQVAsR0FBaUIsT0FBakI7QUFDRCxDQTNORCIsImZpbGUiOiJwb3BvdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnLCAnbW9kdWxlJywgJy4vdG9vbHRpcCddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMsIG1vZHVsZSwgcmVxdWlyZSgnLi90b29sdGlwJykpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QuZXhwb3J0cywgbW9kLCBnbG9iYWwuVG9vbHRpcCk7XG4gICAgZ2xvYmFsLnBvcG92ZXIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsIG1vZHVsZSwgX3Rvb2x0aXApIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbiAgdmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7IHZhciBfYWdhaW4gPSB0cnVlOyBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHsgdmFyIG9iamVjdCA9IF94LCBwcm9wZXJ0eSA9IF94MiwgcmVjZWl2ZXIgPSBfeDM7IF9hZ2FpbiA9IGZhbHNlOyBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgX3ggPSBwYXJlbnQ7IF94MiA9IHByb3BlcnR5OyBfeDMgPSByZWNlaXZlcjsgX2FnYWluID0gdHJ1ZTsgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDsgY29udGludWUgX2Z1bmN0aW9uOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfSB9O1xuXG4gIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuICBmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG4gIHZhciBfVG9vbHRpcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90b29sdGlwKTtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQm9vdHN0cmFwICh2NC4wLjAtYWxwaGEuMik6IHBvcG92ZXIuanNcbiAgICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgdmFyIFBvcG92ZXIgPSAoZnVuY3Rpb24gKCQpIHtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIENvbnN0YW50c1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgdmFyIE5BTUUgPSAncG9wb3Zlcic7XG4gICAgdmFyIFZFUlNJT04gPSAnNC4wLjAtYWxwaGEnO1xuICAgIHZhciBEQVRBX0tFWSA9ICdicy5wb3BvdmVyJztcbiAgICB2YXIgRVZFTlRfS0VZID0gJy4nICsgREFUQV9LRVk7XG4gICAgdmFyIEpRVUVSWV9OT19DT05GTElDVCA9ICQuZm5bTkFNRV07XG5cbiAgICB2YXIgRGVmYXVsdCA9ICQuZXh0ZW5kKHt9LCBfVG9vbHRpcDJbJ2RlZmF1bHQnXS5EZWZhdWx0LCB7XG4gICAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgICAgY29udGVudDogJycsXG4gICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj4nICsgJzxkaXYgY2xhc3M9XCJwb3BvdmVyLWFycm93XCI+PC9kaXY+JyArICc8aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz4nICsgJzxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gICAgfSk7XG5cbiAgICB2YXIgRGVmYXVsdFR5cGUgPSAkLmV4dGVuZCh7fSwgX1Rvb2x0aXAyWydkZWZhdWx0J10uRGVmYXVsdFR5cGUsIHtcbiAgICAgIGNvbnRlbnQ6ICcoc3RyaW5nfGVsZW1lbnR8ZnVuY3Rpb24pJ1xuICAgIH0pO1xuXG4gICAgdmFyIENsYXNzTmFtZSA9IHtcbiAgICAgIEZBREU6ICdmYWRlJyxcbiAgICAgIElOOiAnaW4nXG4gICAgfTtcblxuICAgIHZhciBTZWxlY3RvciA9IHtcbiAgICAgIFRJVExFOiAnLnBvcG92ZXItdGl0bGUnLFxuICAgICAgQ09OVEVOVDogJy5wb3BvdmVyLWNvbnRlbnQnLFxuICAgICAgQVJST1c6ICcucG9wb3Zlci1hcnJvdydcbiAgICB9O1xuXG4gICAgdmFyIEV2ZW50ID0ge1xuICAgICAgSElERTogJ2hpZGUnICsgRVZFTlRfS0VZLFxuICAgICAgSElEREVOOiAnaGlkZGVuJyArIEVWRU5UX0tFWSxcbiAgICAgIFNIT1c6ICdzaG93JyArIEVWRU5UX0tFWSxcbiAgICAgIFNIT1dOOiAnc2hvd24nICsgRVZFTlRfS0VZLFxuICAgICAgSU5TRVJURUQ6ICdpbnNlcnRlZCcgKyBFVkVOVF9LRVksXG4gICAgICBDTElDSzogJ2NsaWNrJyArIEVWRU5UX0tFWSxcbiAgICAgIEZPQ1VTSU46ICdmb2N1c2luJyArIEVWRU5UX0tFWSxcbiAgICAgIEZPQ1VTT1VUOiAnZm9jdXNvdXQnICsgRVZFTlRfS0VZLFxuICAgICAgTU9VU0VFTlRFUjogJ21vdXNlZW50ZXInICsgRVZFTlRfS0VZLFxuICAgICAgTU9VU0VMRUFWRTogJ21vdXNlbGVhdmUnICsgRVZFTlRfS0VZXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIENsYXNzIERlZmluaXRpb25cbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cblxuICAgIHZhciBQb3BvdmVyID0gKGZ1bmN0aW9uIChfVG9vbHRpcCkge1xuICAgICAgX2luaGVyaXRzKFBvcG92ZXIsIF9Ub29sdGlwKTtcblxuICAgICAgZnVuY3Rpb24gUG9wb3ZlcigpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvcG92ZXIpO1xuXG4gICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKFBvcG92ZXIucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAqIGpRdWVyeVxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKi9cblxuICAgICAgX2NyZWF0ZUNsYXNzKFBvcG92ZXIsIFt7XG4gICAgICAgIGtleTogJ2lzV2l0aENvbnRlbnQnLFxuXG4gICAgICAgIC8vIG92ZXJyaWRlc1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc1dpdGhDb250ZW50KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5fZ2V0Q29udGVudCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFRpcEVsZW1lbnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VGlwRWxlbWVudCgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50aXAgPSB0aGlzLnRpcCB8fCAkKHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzZXRDb250ZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldENvbnRlbnQoKSB7XG4gICAgICAgICAgdmFyICR0aXAgPSAkKHRoaXMuZ2V0VGlwRWxlbWVudCgpKTtcblxuICAgICAgICAgIC8vIHdlIHVzZSBhcHBlbmQgZm9yIGh0bWwgb2JqZWN0cyB0byBtYWludGFpbiBqcyBldmVudHNcbiAgICAgICAgICB0aGlzLnNldEVsZW1lbnRDb250ZW50KCR0aXAuZmluZChTZWxlY3Rvci5USVRMRSksIHRoaXMuZ2V0VGl0bGUoKSk7XG4gICAgICAgICAgdGhpcy5zZXRFbGVtZW50Q29udGVudCgkdGlwLmZpbmQoU2VsZWN0b3IuQ09OVEVOVCksIHRoaXMuX2dldENvbnRlbnQoKSk7XG5cbiAgICAgICAgICAkdGlwLnJlbW92ZUNsYXNzKENsYXNzTmFtZS5GQURFKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuSU4pO1xuXG4gICAgICAgICAgdGhpcy5jbGVhbnVwVGV0aGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcml2YXRlXG5cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2dldENvbnRlbnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldENvbnRlbnQoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpIHx8ICh0eXBlb2YgdGhpcy5jb25maWcuY29udGVudCA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuY29uZmlnLmNvbnRlbnQuY2FsbCh0aGlzLmVsZW1lbnQpIDogdGhpcy5jb25maWcuY29udGVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdGF0aWNcblxuICAgICAgfV0sIFt7XG4gICAgICAgIGtleTogJ19qUXVlcnlJbnRlcmZhY2UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZKTtcbiAgICAgICAgICAgIHZhciBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChjb25maWcpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBfY29uZmlnKTtcbiAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKERBVEFfS0VZLCBkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGlmIChkYXRhW2NvbmZpZ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyArIGNvbmZpZyArICdcIicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRhdGFbY29uZmlnXSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ1ZFUlNJT04nLFxuXG4gICAgICAgIC8vIGdldHRlcnNcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gVkVSU0lPTjtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdEZWZhdWx0JyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIERlZmF1bHQ7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnTkFNRScsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBOQU1FO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ0RBVEFfS0VZJyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIERBVEFfS0VZO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ0V2ZW50JyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIEV2ZW50O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ0VWRU5UX0tFWScsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBFVkVOVF9LRVk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnRGVmYXVsdFR5cGUnLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gRGVmYXVsdFR5cGU7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcblxuICAgICAgcmV0dXJuIFBvcG92ZXI7XG4gICAgfSkoX1Rvb2x0aXAyWydkZWZhdWx0J10pO1xuXG4gICAgJC5mbltOQU1FXSA9IFBvcG92ZXIuX2pRdWVyeUludGVyZmFjZTtcbiAgICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gUG9wb3ZlcjtcbiAgICAkLmZuW05BTUVdLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkLmZuW05BTUVdID0gSlFVRVJZX05PX0NPTkZMSUNUO1xuICAgICAgcmV0dXJuIFBvcG92ZXIuX2pRdWVyeUludGVyZmFjZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFBvcG92ZXI7XG4gIH0pKGpRdWVyeSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBQb3BvdmVyO1xufSk7XG4iXX0=