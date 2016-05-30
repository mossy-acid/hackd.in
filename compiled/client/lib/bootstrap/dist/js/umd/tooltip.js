'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './util'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./util'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.Util);
    global.tooltip = mod.exports;
  }
})(undefined, function (exports, module, _util) {
  /* global Tether */

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

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _Util = _interopRequireDefault(_util);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Tooltip = function ($) {

    /**
     * Check for Tether dependency
     * Tether - http://github.hubspot.com/tether/
     */
    if (window.Tether === undefined) {
      throw new Error('Bootstrap tooltips require Tether (http://github.hubspot.com/tether/)');
    }

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'tooltip';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.tooltip';
    var EVENT_KEY = '.' + DATA_KEY;
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 150;
    var CLASS_PREFIX = 'bs-tether';

    var Default = {
      animation: true,
      template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      selector: false,
      placement: 'top',
      offset: '0 0',
      constraints: []
    };

    var DefaultType = {
      animation: 'boolean',
      template: 'string',
      title: '(string|element|function)',
      trigger: 'string',
      delay: '(number|object)',
      html: 'boolean',
      selector: '(string|boolean)',
      placement: '(string|function)',
      offset: 'string',
      constraints: 'array'
    };

    var AttachmentMap = {
      TOP: 'bottom center',
      RIGHT: 'middle left',
      BOTTOM: 'top center',
      LEFT: 'middle right'
    };

    var HoverState = {
      IN: 'in',
      OUT: 'out'
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

    var ClassName = {
      FADE: 'fade',
      IN: 'in'
    };

    var Selector = {
      TOOLTIP: '.tooltip',
      TOOLTIP_INNER: '.tooltip-inner'
    };

    var TetherClass = {
      element: false,
      enabled: false
    };

    var Trigger = {
      HOVER: 'hover',
      FOCUS: 'focus',
      CLICK: 'click',
      MANUAL: 'manual'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Tooltip = function () {
      function Tooltip(element, config) {
        _classCallCheck(this, Tooltip);

        // private
        this._isEnabled = true;
        this._timeout = 0;
        this._hoverState = '';
        this._activeTrigger = {};
        this._tether = null;

        // protected
        this.element = element;
        this.config = this._getConfig(config);
        this.tip = null;

        this._setListeners();
      }

      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Tooltip, [{
        key: 'enable',

        // public

        value: function enable() {
          this._isEnabled = true;
        }
      }, {
        key: 'disable',
        value: function disable() {
          this._isEnabled = false;
        }
      }, {
        key: 'toggleEnabled',
        value: function toggleEnabled() {
          this._isEnabled = !this._isEnabled;
        }
      }, {
        key: 'toggle',
        value: function toggle(event) {
          if (event) {
            var dataKey = this.constructor.DATA_KEY;
            var context = $(event.currentTarget).data(dataKey);

            if (!context) {
              context = new this.constructor(event.currentTarget, this._getDelegateConfig());
              $(event.currentTarget).data(dataKey, context);
            }

            context._activeTrigger.click = !context._activeTrigger.click;

            if (context._isWithActiveTrigger()) {
              context._enter(null, context);
            } else {
              context._leave(null, context);
            }
          } else {

            if ($(this.getTipElement()).hasClass(ClassName.IN)) {
              this._leave(null, this);
              return;
            }

            this._enter(null, this);
          }
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          clearTimeout(this._timeout);

          this.cleanupTether();

          $.removeData(this.element, this.constructor.DATA_KEY);

          $(this.element).off(this.constructor.EVENT_KEY);

          if (this.tip) {
            $(this.tip).remove();
          }

          this._isEnabled = null;
          this._timeout = null;
          this._hoverState = null;
          this._activeTrigger = null;
          this._tether = null;

          this.element = null;
          this.config = null;
          this.tip = null;
        }
      }, {
        key: 'show',
        value: function show() {
          var _this = this;

          var showEvent = $.Event(this.constructor.Event.SHOW);

          if (this.isWithContent() && this._isEnabled) {
            $(this.element).trigger(showEvent);

            var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

            if (showEvent.isDefaultPrevented() || !isInTheDom) {
              return;
            }

            var tip = this.getTipElement();
            var tipId = _Util['default'].getUID(this.constructor.NAME);

            tip.setAttribute('id', tipId);
            this.element.setAttribute('aria-describedby', tipId);

            this.setContent();

            if (this.config.animation) {
              $(tip).addClass(ClassName.FADE);
            }

            var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

            var attachment = this._getAttachment(placement);

            $(tip).data(this.constructor.DATA_KEY, this).appendTo(document.body);

            $(this.element).trigger(this.constructor.Event.INSERTED);

            this._tether = new Tether({
              attachment: attachment,
              element: tip,
              target: this.element,
              classes: TetherClass,
              classPrefix: CLASS_PREFIX,
              offset: this.config.offset,
              constraints: this.config.constraints,
              addTargetClasses: false
            });

            _Util['default'].reflow(tip);
            this._tether.position();

            $(tip).addClass(ClassName.IN);

            var complete = function complete() {
              var prevHoverState = _this._hoverState;
              _this._hoverState = null;

              $(_this.element).trigger(_this.constructor.Event.SHOWN);

              if (prevHoverState === HoverState.OUT) {
                _this._leave(null, _this);
              }
            };

            if (_Util['default'].supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
              $(this.tip).one(_Util['default'].TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
              return;
            }

            complete();
          }
        }
      }, {
        key: 'hide',
        value: function hide(callback) {
          var _this2 = this;

          var tip = this.getTipElement();
          var hideEvent = $.Event(this.constructor.Event.HIDE);
          var complete = function complete() {
            if (_this2._hoverState !== HoverState.IN && tip.parentNode) {
              tip.parentNode.removeChild(tip);
            }

            _this2.element.removeAttribute('aria-describedby');
            $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);
            _this2.cleanupTether();

            if (callback) {
              callback();
            }
          };

          $(this.element).trigger(hideEvent);

          if (hideEvent.isDefaultPrevented()) {
            return;
          }

          $(tip).removeClass(ClassName.IN);

          if (_Util['default'].supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {

            $(tip).one(_Util['default'].TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            complete();
          }

          this._hoverState = '';
        }

        // protected

      }, {
        key: 'isWithContent',
        value: function isWithContent() {
          return Boolean(this.getTitle());
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

          this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());

          $tip.removeClass(ClassName.FADE).removeClass(ClassName.IN);

          this.cleanupTether();
        }
      }, {
        key: 'setElementContent',
        value: function setElementContent($element, content) {
          var html = this.config.html;
          if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' && (content.nodeType || content.jquery)) {
            // content is a DOM node or a jQuery
            if (html) {
              if (!$(content).parent().is($element)) {
                $element.empty().append(content);
              }
            } else {
              $element.text($(content).text());
            }
          } else {
            $element[html ? 'html' : 'text'](content);
          }
        }
      }, {
        key: 'getTitle',
        value: function getTitle() {
          var title = this.element.getAttribute('data-original-title');

          if (!title) {
            title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
          }

          return title;
        }
      }, {
        key: 'cleanupTether',
        value: function cleanupTether() {
          if (this._tether) {
            this._tether.destroy();
          }
        }

        // private

      }, {
        key: '_getAttachment',
        value: function _getAttachment(placement) {
          return AttachmentMap[placement.toUpperCase()];
        }
      }, {
        key: '_setListeners',
        value: function _setListeners() {
          var _this3 = this;

          var triggers = this.config.trigger.split(' ');

          triggers.forEach(function (trigger) {
            if (trigger === 'click') {
              $(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, $.proxy(_this3.toggle, _this3));
            } else if (trigger !== Trigger.MANUAL) {
              var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
              var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;

              $(_this3.element).on(eventIn, _this3.config.selector, $.proxy(_this3._enter, _this3)).on(eventOut, _this3.config.selector, $.proxy(_this3._leave, _this3));
            }
          });

          if (this.config.selector) {
            this.config = $.extend({}, this.config, {
              trigger: 'manual',
              selector: ''
            });
          } else {
            this._fixTitle();
          }
        }
      }, {
        key: '_fixTitle',
        value: function _fixTitle() {
          var titleType = _typeof(this.element.getAttribute('data-original-title'));
          if (this.element.getAttribute('title') || titleType !== 'string') {
            this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
            this.element.setAttribute('title', '');
          }
        }
      }, {
        key: '_enter',
        value: function _enter(event, context) {
          var dataKey = this.constructor.DATA_KEY;

          context = context || $(event.currentTarget).data(dataKey);

          if (!context) {
            context = new this.constructor(event.currentTarget, this._getDelegateConfig());
            $(event.currentTarget).data(dataKey, context);
          }

          if (event) {
            context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
          }

          if ($(context.getTipElement()).hasClass(ClassName.IN) || context._hoverState === HoverState.IN) {
            context._hoverState = HoverState.IN;
            return;
          }

          clearTimeout(context._timeout);

          context._hoverState = HoverState.IN;

          if (!context.config.delay || !context.config.delay.show) {
            context.show();
            return;
          }

          context._timeout = setTimeout(function () {
            if (context._hoverState === HoverState.IN) {
              context.show();
            }
          }, context.config.delay.show);
        }
      }, {
        key: '_leave',
        value: function _leave(event, context) {
          var dataKey = this.constructor.DATA_KEY;

          context = context || $(event.currentTarget).data(dataKey);

          if (!context) {
            context = new this.constructor(event.currentTarget, this._getDelegateConfig());
            $(event.currentTarget).data(dataKey, context);
          }

          if (event) {
            context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
          }

          if (context._isWithActiveTrigger()) {
            return;
          }

          clearTimeout(context._timeout);

          context._hoverState = HoverState.OUT;

          if (!context.config.delay || !context.config.delay.hide) {
            context.hide();
            return;
          }

          context._timeout = setTimeout(function () {
            if (context._hoverState === HoverState.OUT) {
              context.hide();
            }
          }, context.config.delay.hide);
        }
      }, {
        key: '_isWithActiveTrigger',
        value: function _isWithActiveTrigger() {
          for (var trigger in this._activeTrigger) {
            if (this._activeTrigger[trigger]) {
              return true;
            }
          }

          return false;
        }
      }, {
        key: '_getConfig',
        value: function _getConfig(config) {
          config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

          if (config.delay && typeof config.delay === 'number') {
            config.delay = {
              show: config.delay,
              hide: config.delay
            };
          }

          _Util['default'].typeCheckConfig(NAME, config, this.constructor.DefaultType);

          return config;
        }
      }, {
        key: '_getDelegateConfig',
        value: function _getDelegateConfig() {
          var config = {};

          if (this.config) {
            for (var key in this.config) {
              if (this.constructor.Default[key] !== this.config[key]) {
                config[key] = this.config[key];
              }
            }
          }

          return config;
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
              data = new Tooltip(this, _config);
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

      return Tooltip;
    }();

    $.fn[NAME] = Tooltip._jQueryInterface;
    $.fn[NAME].Constructor = Tooltip;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Tooltip._jQueryInterface;
    };

    return Tooltip;
  }(jQuery);

  module.exports = Tooltip;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL3Rvb2x0aXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLENBQUMsVUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCO0FBQzFCLE1BQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDOUMsV0FBTyxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFFBQXRCLENBQVAsRUFBd0MsT0FBeEM7QUFDRCxHQUZELE1BRU8sSUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0MsT0FBTyxNQUFQLEtBQWtCLFdBQXhELEVBQXFFO0FBQzFFLFlBQVEsT0FBUixFQUFpQixNQUFqQixFQUF5QixRQUFRLFFBQVIsQ0FBekI7QUFDRCxHQUZNLE1BRUE7QUFDTCxRQUFJLE1BQU07QUFDUixlQUFTO0FBREQsS0FBVjtBQUdBLFlBQVEsSUFBSSxPQUFaLEVBQXFCLEdBQXJCLEVBQTBCLE9BQU8sSUFBakM7QUFDQSxXQUFPLE9BQVAsR0FBaUIsSUFBSSxPQUFyQjtBQUNEO0FBQ0YsQ0FaRCxhQVlTLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQixLQUEzQixFQUFrQzs7O0FBR3pDOztBQUVBLE1BQUksZUFBZ0IsWUFBWTtBQUFFLGFBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsS0FBbEMsRUFBeUM7QUFBRSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUFFLFlBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQTREO0FBQUUsS0FBQyxPQUFPLFVBQVUsV0FBVixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRDtBQUFFLFVBQUksVUFBSixFQUFnQixpQkFBaUIsWUFBWSxTQUE3QixFQUF3QyxVQUF4QyxFQUFxRCxJQUFJLFdBQUosRUFBaUIsaUJBQWlCLFdBQWpCLEVBQThCLFdBQTlCLEVBQTRDLE9BQU8sV0FBUDtBQUFxQixLQUFoTjtBQUFtTixHQUEvaEIsRUFBbkI7O0FBRUEsV0FBUyxzQkFBVCxDQUFnQyxHQUFoQyxFQUFxQztBQUFFLFdBQU8sT0FBTyxJQUFJLFVBQVgsR0FBd0IsR0FBeEIsR0FBOEIsRUFBRSxXQUFXLEdBQWIsRUFBckM7QUFBMEQ7O0FBRWpHLFdBQVMsZUFBVCxDQUF5QixRQUF6QixFQUFtQyxXQUFuQyxFQUFnRDtBQUFFLFFBQUksRUFBRSxvQkFBb0IsV0FBdEIsQ0FBSixFQUF3QztBQUFFLFlBQU0sSUFBSSxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUEyRDtBQUFFOztBQUV6SixNQUFJLFFBQVEsdUJBQXVCLEtBQXZCLENBQVo7Ozs7Ozs7OztBQVNBLE1BQUksVUFBVyxVQUFVLENBQVYsRUFBYTs7Ozs7O0FBTTFCLFFBQUksT0FBTyxNQUFQLEtBQWtCLFNBQXRCLEVBQWlDO0FBQy9CLFlBQU0sSUFBSSxLQUFKLENBQVUsdUVBQVYsQ0FBTjtBQUNEOzs7Ozs7OztBQVFELFFBQUksT0FBTyxTQUFYO0FBQ0EsUUFBSSxVQUFVLGFBQWQ7QUFDQSxRQUFJLFdBQVcsWUFBZjtBQUNBLFFBQUksWUFBWSxNQUFNLFFBQXRCO0FBQ0EsUUFBSSxxQkFBcUIsRUFBRSxFQUFGLENBQUssSUFBTCxDQUF6QjtBQUNBLFFBQUksc0JBQXNCLEdBQTFCO0FBQ0EsUUFBSSxlQUFlLFdBQW5COztBQUVBLFFBQUksVUFBVTtBQUNaLGlCQUFXLElBREM7QUFFWixnQkFBVSx5Q0FBeUMsbUNBQXpDLEdBQStFLHlDQUY3RTtBQUdaLGVBQVMsYUFIRztBQUlaLGFBQU8sRUFKSztBQUtaLGFBQU8sQ0FMSztBQU1aLFlBQU0sS0FOTTtBQU9aLGdCQUFVLEtBUEU7QUFRWixpQkFBVyxLQVJDO0FBU1osY0FBUSxLQVRJO0FBVVosbUJBQWE7QUFWRCxLQUFkOztBQWFBLFFBQUksY0FBYztBQUNoQixpQkFBVyxTQURLO0FBRWhCLGdCQUFVLFFBRk07QUFHaEIsYUFBTywyQkFIUztBQUloQixlQUFTLFFBSk87QUFLaEIsYUFBTyxpQkFMUztBQU1oQixZQUFNLFNBTlU7QUFPaEIsZ0JBQVUsa0JBUE07QUFRaEIsaUJBQVcsbUJBUks7QUFTaEIsY0FBUSxRQVRRO0FBVWhCLG1CQUFhO0FBVkcsS0FBbEI7O0FBYUEsUUFBSSxnQkFBZ0I7QUFDbEIsV0FBSyxlQURhO0FBRWxCLGFBQU8sYUFGVztBQUdsQixjQUFRLFlBSFU7QUFJbEIsWUFBTTtBQUpZLEtBQXBCOztBQU9BLFFBQUksYUFBYTtBQUNmLFVBQUksSUFEVztBQUVmLFdBQUs7QUFGVSxLQUFqQjs7QUFLQSxRQUFJLFFBQVE7QUFDVixZQUFNLFNBQVMsU0FETDtBQUVWLGNBQVEsV0FBVyxTQUZUO0FBR1YsWUFBTSxTQUFTLFNBSEw7QUFJVixhQUFPLFVBQVUsU0FKUDtBQUtWLGdCQUFVLGFBQWEsU0FMYjtBQU1WLGFBQU8sVUFBVSxTQU5QO0FBT1YsZUFBUyxZQUFZLFNBUFg7QUFRVixnQkFBVSxhQUFhLFNBUmI7QUFTVixrQkFBWSxlQUFlLFNBVGpCO0FBVVYsa0JBQVksZUFBZTtBQVZqQixLQUFaOztBQWFBLFFBQUksWUFBWTtBQUNkLFlBQU0sTUFEUTtBQUVkLFVBQUk7QUFGVSxLQUFoQjs7QUFLQSxRQUFJLFdBQVc7QUFDYixlQUFTLFVBREk7QUFFYixxQkFBZTtBQUZGLEtBQWY7O0FBS0EsUUFBSSxjQUFjO0FBQ2hCLGVBQVMsS0FETztBQUVoQixlQUFTO0FBRk8sS0FBbEI7O0FBS0EsUUFBSSxVQUFVO0FBQ1osYUFBTyxPQURLO0FBRVosYUFBTyxPQUZLO0FBR1osYUFBTyxPQUhLO0FBSVosY0FBUTtBQUpJLEtBQWQ7Ozs7Ozs7O0FBYUEsUUFBSSxVQUFXLFlBQVk7QUFDekIsZUFBUyxPQUFULENBQWlCLE9BQWpCLEVBQTBCLE1BQTFCLEVBQWtDO0FBQ2hDLHdCQUFnQixJQUFoQixFQUFzQixPQUF0Qjs7O0FBR0EsYUFBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLENBQWhCO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsSUFBZjs7O0FBR0EsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssTUFBTCxHQUFjLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFkO0FBQ0EsYUFBSyxHQUFMLEdBQVcsSUFBWDs7QUFFQSxhQUFLLGFBQUw7QUFDRDs7Ozs7Ozs7OztBQVVELG1CQUFhLE9BQWIsRUFBc0IsQ0FBQztBQUNyQixhQUFLLFFBRGdCOzs7O0FBS3JCLGVBQU8sU0FBUyxNQUFULEdBQWtCO0FBQ3ZCLGVBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNEO0FBUG9CLE9BQUQsRUFRbkI7QUFDRCxhQUFLLFNBREo7QUFFRCxlQUFPLFNBQVMsT0FBVCxHQUFtQjtBQUN4QixlQUFLLFVBQUwsR0FBa0IsS0FBbEI7QUFDRDtBQUpBLE9BUm1CLEVBYW5CO0FBQ0QsYUFBSyxlQURKO0FBRUQsZUFBTyxTQUFTLGFBQVQsR0FBeUI7QUFDOUIsZUFBSyxVQUFMLEdBQWtCLENBQUMsS0FBSyxVQUF4QjtBQUNEO0FBSkEsT0FibUIsRUFrQm5CO0FBQ0QsYUFBSyxRQURKO0FBRUQsZUFBTyxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDNUIsY0FBSSxLQUFKLEVBQVc7QUFDVCxnQkFBSSxVQUFVLEtBQUssV0FBTCxDQUFpQixRQUEvQjtBQUNBLGdCQUFJLFVBQVUsRUFBRSxNQUFNLGFBQVIsRUFBdUIsSUFBdkIsQ0FBNEIsT0FBNUIsQ0FBZDs7QUFFQSxnQkFBSSxDQUFDLE9BQUwsRUFBYztBQUNaLHdCQUFVLElBQUksS0FBSyxXQUFULENBQXFCLE1BQU0sYUFBM0IsRUFBMEMsS0FBSyxrQkFBTCxFQUExQyxDQUFWO0FBQ0EsZ0JBQUUsTUFBTSxhQUFSLEVBQXVCLElBQXZCLENBQTRCLE9BQTVCLEVBQXFDLE9BQXJDO0FBQ0Q7O0FBRUQsb0JBQVEsY0FBUixDQUF1QixLQUF2QixHQUErQixDQUFDLFFBQVEsY0FBUixDQUF1QixLQUF2RDs7QUFFQSxnQkFBSSxRQUFRLG9CQUFSLEVBQUosRUFBb0M7QUFDbEMsc0JBQVEsTUFBUixDQUFlLElBQWYsRUFBcUIsT0FBckI7QUFDRCxhQUZELE1BRU87QUFDTCxzQkFBUSxNQUFSLENBQWUsSUFBZixFQUFxQixPQUFyQjtBQUNEO0FBQ0YsV0FoQkQsTUFnQk87O0FBRUwsZ0JBQUksRUFBRSxLQUFLLGFBQUwsRUFBRixFQUF3QixRQUF4QixDQUFpQyxVQUFVLEVBQTNDLENBQUosRUFBb0Q7QUFDbEQsbUJBQUssTUFBTCxDQUFZLElBQVosRUFBa0IsSUFBbEI7QUFDQTtBQUNEOztBQUVELGlCQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLElBQWxCO0FBQ0Q7QUFDRjtBQTVCQSxPQWxCbUIsRUErQ25CO0FBQ0QsYUFBSyxTQURKO0FBRUQsZUFBTyxTQUFTLE9BQVQsR0FBbUI7QUFDeEIsdUJBQWEsS0FBSyxRQUFsQjs7QUFFQSxlQUFLLGFBQUw7O0FBRUEsWUFBRSxVQUFGLENBQWEsS0FBSyxPQUFsQixFQUEyQixLQUFLLFdBQUwsQ0FBaUIsUUFBNUM7O0FBRUEsWUFBRSxLQUFLLE9BQVAsRUFBZ0IsR0FBaEIsQ0FBb0IsS0FBSyxXQUFMLENBQWlCLFNBQXJDOztBQUVBLGNBQUksS0FBSyxHQUFULEVBQWM7QUFDWixjQUFFLEtBQUssR0FBUCxFQUFZLE1BQVo7QUFDRDs7QUFFRCxlQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxlQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxlQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxlQUFLLE9BQUwsR0FBZSxJQUFmOztBQUVBLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxlQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsZUFBSyxHQUFMLEdBQVcsSUFBWDtBQUNEO0FBeEJBLE9BL0NtQixFQXdFbkI7QUFDRCxhQUFLLE1BREo7QUFFRCxlQUFPLFNBQVMsSUFBVCxHQUFnQjtBQUNyQixjQUFJLFFBQVEsSUFBWjs7QUFFQSxjQUFJLFlBQVksRUFBRSxLQUFGLENBQVEsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLElBQS9CLENBQWhCOztBQUVBLGNBQUksS0FBSyxhQUFMLE1BQXdCLEtBQUssVUFBakMsRUFBNkM7QUFDM0MsY0FBRSxLQUFLLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBd0IsU0FBeEI7O0FBRUEsZ0JBQUksYUFBYSxFQUFFLFFBQUYsQ0FBVyxLQUFLLE9BQUwsQ0FBYSxhQUFiLENBQTJCLGVBQXRDLEVBQXVELEtBQUssT0FBNUQsQ0FBakI7O0FBRUEsZ0JBQUksVUFBVSxrQkFBVixNQUFrQyxDQUFDLFVBQXZDLEVBQW1EO0FBQ2pEO0FBQ0Q7O0FBRUQsZ0JBQUksTUFBTSxLQUFLLGFBQUwsRUFBVjtBQUNBLGdCQUFJLFFBQVEsTUFBTSxTQUFOLEVBQWlCLE1BQWpCLENBQXdCLEtBQUssV0FBTCxDQUFpQixJQUF6QyxDQUFaOztBQUVBLGdCQUFJLFlBQUosQ0FBaUIsSUFBakIsRUFBdUIsS0FBdkI7QUFDQSxpQkFBSyxPQUFMLENBQWEsWUFBYixDQUEwQixrQkFBMUIsRUFBOEMsS0FBOUM7O0FBRUEsaUJBQUssVUFBTDs7QUFFQSxnQkFBSSxLQUFLLE1BQUwsQ0FBWSxTQUFoQixFQUEyQjtBQUN6QixnQkFBRSxHQUFGLEVBQU8sUUFBUCxDQUFnQixVQUFVLElBQTFCO0FBQ0Q7O0FBRUQsZ0JBQUksWUFBWSxPQUFPLEtBQUssTUFBTCxDQUFZLFNBQW5CLEtBQWlDLFVBQWpDLEdBQThDLEtBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBc0MsS0FBSyxPQUEzQyxDQUE5QyxHQUFvRyxLQUFLLE1BQUwsQ0FBWSxTQUFoSTs7QUFFQSxnQkFBSSxhQUFhLEtBQUssY0FBTCxDQUFvQixTQUFwQixDQUFqQjs7QUFFQSxjQUFFLEdBQUYsRUFBTyxJQUFQLENBQVksS0FBSyxXQUFMLENBQWlCLFFBQTdCLEVBQXVDLElBQXZDLEVBQTZDLFFBQTdDLENBQXNELFNBQVMsSUFBL0Q7O0FBRUEsY0FBRSxLQUFLLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBd0IsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLFFBQS9DOztBQUVBLGlCQUFLLE9BQUwsR0FBZSxJQUFJLE1BQUosQ0FBVztBQUN4QiwwQkFBWSxVQURZO0FBRXhCLHVCQUFTLEdBRmU7QUFHeEIsc0JBQVEsS0FBSyxPQUhXO0FBSXhCLHVCQUFTLFdBSmU7QUFLeEIsMkJBQWEsWUFMVztBQU14QixzQkFBUSxLQUFLLE1BQUwsQ0FBWSxNQU5JO0FBT3hCLDJCQUFhLEtBQUssTUFBTCxDQUFZLFdBUEQ7QUFReEIsZ0NBQWtCO0FBUk0sYUFBWCxDQUFmOztBQVdBLGtCQUFNLFNBQU4sRUFBaUIsTUFBakIsQ0FBd0IsR0FBeEI7QUFDQSxpQkFBSyxPQUFMLENBQWEsUUFBYjs7QUFFQSxjQUFFLEdBQUYsRUFBTyxRQUFQLENBQWdCLFVBQVUsRUFBMUI7O0FBRUEsZ0JBQUksV0FBVyxTQUFTLFFBQVQsR0FBb0I7QUFDakMsa0JBQUksaUJBQWlCLE1BQU0sV0FBM0I7QUFDQSxvQkFBTSxXQUFOLEdBQW9CLElBQXBCOztBQUVBLGdCQUFFLE1BQU0sT0FBUixFQUFpQixPQUFqQixDQUF5QixNQUFNLFdBQU4sQ0FBa0IsS0FBbEIsQ0FBd0IsS0FBakQ7O0FBRUEsa0JBQUksbUJBQW1CLFdBQVcsR0FBbEMsRUFBdUM7QUFDckMsc0JBQU0sTUFBTixDQUFhLElBQWIsRUFBbUIsS0FBbkI7QUFDRDtBQUNGLGFBVEQ7O0FBV0EsZ0JBQUksTUFBTSxTQUFOLEVBQWlCLHFCQUFqQixNQUE0QyxFQUFFLEtBQUssR0FBUCxFQUFZLFFBQVosQ0FBcUIsVUFBVSxJQUEvQixDQUFoRCxFQUFzRjtBQUNwRixnQkFBRSxLQUFLLEdBQVAsRUFBWSxHQUFaLENBQWdCLE1BQU0sU0FBTixFQUFpQixjQUFqQyxFQUFpRCxRQUFqRCxFQUEyRCxvQkFBM0QsQ0FBZ0YsUUFBUSxvQkFBeEY7QUFDQTtBQUNEOztBQUVEO0FBQ0Q7QUFDRjtBQXRFQSxPQXhFbUIsRUErSW5CO0FBQ0QsYUFBSyxNQURKO0FBRUQsZUFBTyxTQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCO0FBQzdCLGNBQUksU0FBUyxJQUFiOztBQUVBLGNBQUksTUFBTSxLQUFLLGFBQUwsRUFBVjtBQUNBLGNBQUksWUFBWSxFQUFFLEtBQUYsQ0FBUSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsSUFBL0IsQ0FBaEI7QUFDQSxjQUFJLFdBQVcsU0FBUyxRQUFULEdBQW9CO0FBQ2pDLGdCQUFJLE9BQU8sV0FBUCxLQUF1QixXQUFXLEVBQWxDLElBQXdDLElBQUksVUFBaEQsRUFBNEQ7QUFDMUQsa0JBQUksVUFBSixDQUFlLFdBQWYsQ0FBMkIsR0FBM0I7QUFDRDs7QUFFRCxtQkFBTyxPQUFQLENBQWUsZUFBZixDQUErQixrQkFBL0I7QUFDQSxjQUFFLE9BQU8sT0FBVCxFQUFrQixPQUFsQixDQUEwQixPQUFPLFdBQVAsQ0FBbUIsS0FBbkIsQ0FBeUIsTUFBbkQ7QUFDQSxtQkFBTyxhQUFQOztBQUVBLGdCQUFJLFFBQUosRUFBYztBQUNaO0FBQ0Q7QUFDRixXQVpEOztBQWNBLFlBQUUsS0FBSyxPQUFQLEVBQWdCLE9BQWhCLENBQXdCLFNBQXhCOztBQUVBLGNBQUksVUFBVSxrQkFBVixFQUFKLEVBQW9DO0FBQ2xDO0FBQ0Q7O0FBRUQsWUFBRSxHQUFGLEVBQU8sV0FBUCxDQUFtQixVQUFVLEVBQTdCOztBQUVBLGNBQUksTUFBTSxTQUFOLEVBQWlCLHFCQUFqQixNQUE0QyxFQUFFLEtBQUssR0FBUCxFQUFZLFFBQVosQ0FBcUIsVUFBVSxJQUEvQixDQUFoRCxFQUFzRjs7QUFFcEYsY0FBRSxHQUFGLEVBQU8sR0FBUCxDQUFXLE1BQU0sU0FBTixFQUFpQixjQUE1QixFQUE0QyxRQUE1QyxFQUFzRCxvQkFBdEQsQ0FBMkUsbUJBQTNFO0FBQ0QsV0FIRCxNQUdPO0FBQ0w7QUFDRDs7QUFFRCxlQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDRDs7OztBQXJDQSxPQS9JbUIsRUF3TG5CO0FBQ0QsYUFBSyxlQURKO0FBRUQsZUFBTyxTQUFTLGFBQVQsR0FBeUI7QUFDOUIsaUJBQU8sUUFBUSxLQUFLLFFBQUwsRUFBUixDQUFQO0FBQ0Q7QUFKQSxPQXhMbUIsRUE2TG5CO0FBQ0QsYUFBSyxlQURKO0FBRUQsZUFBTyxTQUFTLGFBQVQsR0FBeUI7QUFDOUIsaUJBQU8sS0FBSyxHQUFMLEdBQVcsS0FBSyxHQUFMLElBQVksRUFBRSxLQUFLLE1BQUwsQ0FBWSxRQUFkLEVBQXdCLENBQXhCLENBQTlCO0FBQ0Q7QUFKQSxPQTdMbUIsRUFrTW5CO0FBQ0QsYUFBSyxZQURKO0FBRUQsZUFBTyxTQUFTLFVBQVQsR0FBc0I7QUFDM0IsY0FBSSxPQUFPLEVBQUUsS0FBSyxhQUFMLEVBQUYsQ0FBWDs7QUFFQSxlQUFLLGlCQUFMLENBQXVCLEtBQUssSUFBTCxDQUFVLFNBQVMsYUFBbkIsQ0FBdkIsRUFBMEQsS0FBSyxRQUFMLEVBQTFEOztBQUVBLGVBQUssV0FBTCxDQUFpQixVQUFVLElBQTNCLEVBQWlDLFdBQWpDLENBQTZDLFVBQVUsRUFBdkQ7O0FBRUEsZUFBSyxhQUFMO0FBQ0Q7QUFWQSxPQWxNbUIsRUE2TW5CO0FBQ0QsYUFBSyxtQkFESjtBQUVELGVBQU8sU0FBUyxpQkFBVCxDQUEyQixRQUEzQixFQUFxQyxPQUFyQyxFQUE4QztBQUNuRCxjQUFJLE9BQU8sS0FBSyxNQUFMLENBQVksSUFBdkI7QUFDQSxjQUFJLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQW5CLEtBQWdDLFFBQVEsUUFBUixJQUFvQixRQUFRLE1BQTVELENBQUosRUFBeUU7O0FBRXZFLGdCQUFJLElBQUosRUFBVTtBQUNSLGtCQUFJLENBQUMsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixFQUFwQixDQUF1QixRQUF2QixDQUFMLEVBQXVDO0FBQ3JDLHlCQUFTLEtBQVQsR0FBaUIsTUFBakIsQ0FBd0IsT0FBeEI7QUFDRDtBQUNGLGFBSkQsTUFJTztBQUNMLHVCQUFTLElBQVQsQ0FBYyxFQUFFLE9BQUYsRUFBVyxJQUFYLEVBQWQ7QUFDRDtBQUNGLFdBVEQsTUFTTztBQUNMLHFCQUFTLE9BQU8sTUFBUCxHQUFnQixNQUF6QixFQUFpQyxPQUFqQztBQUNEO0FBQ0Y7QUFoQkEsT0E3TW1CLEVBOE5uQjtBQUNELGFBQUssVUFESjtBQUVELGVBQU8sU0FBUyxRQUFULEdBQW9CO0FBQ3pCLGNBQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxZQUFiLENBQTBCLHFCQUExQixDQUFaOztBQUVBLGNBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixvQkFBUSxPQUFPLEtBQUssTUFBTCxDQUFZLEtBQW5CLEtBQTZCLFVBQTdCLEdBQTBDLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsSUFBbEIsQ0FBdUIsS0FBSyxPQUE1QixDQUExQyxHQUFpRixLQUFLLE1BQUwsQ0FBWSxLQUFyRztBQUNEOztBQUVELGlCQUFPLEtBQVA7QUFDRDtBQVZBLE9BOU5tQixFQXlPbkI7QUFDRCxhQUFLLGVBREo7QUFFRCxlQUFPLFNBQVMsYUFBVCxHQUF5QjtBQUM5QixjQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixpQkFBSyxPQUFMLENBQWEsT0FBYjtBQUNEO0FBQ0Y7Ozs7QUFOQSxPQXpPbUIsRUFtUG5CO0FBQ0QsYUFBSyxnQkFESjtBQUVELGVBQU8sU0FBUyxjQUFULENBQXdCLFNBQXhCLEVBQW1DO0FBQ3hDLGlCQUFPLGNBQWMsVUFBVSxXQUFWLEVBQWQsQ0FBUDtBQUNEO0FBSkEsT0FuUG1CLEVBd1BuQjtBQUNELGFBQUssZUFESjtBQUVELGVBQU8sU0FBUyxhQUFULEdBQXlCO0FBQzlCLGNBQUksU0FBUyxJQUFiOztBQUVBLGNBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLEtBQXBCLENBQTBCLEdBQTFCLENBQWY7O0FBRUEsbUJBQVMsT0FBVCxDQUFpQixVQUFVLE9BQVYsRUFBbUI7QUFDbEMsZ0JBQUksWUFBWSxPQUFoQixFQUF5QjtBQUN2QixnQkFBRSxPQUFPLE9BQVQsRUFBa0IsRUFBbEIsQ0FBcUIsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQXlCLEtBQTlDLEVBQXFELE9BQU8sTUFBUCxDQUFjLFFBQW5FLEVBQTZFLEVBQUUsS0FBRixDQUFRLE9BQU8sTUFBZixFQUF1QixNQUF2QixDQUE3RTtBQUNELGFBRkQsTUFFTyxJQUFJLFlBQVksUUFBUSxNQUF4QixFQUFnQztBQUNyQyxrQkFBSSxVQUFVLFlBQVksUUFBUSxLQUFwQixHQUE0QixPQUFPLFdBQVAsQ0FBbUIsS0FBbkIsQ0FBeUIsVUFBckQsR0FBa0UsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQXlCLE9BQXpHO0FBQ0Esa0JBQUksV0FBVyxZQUFZLFFBQVEsS0FBcEIsR0FBNEIsT0FBTyxXQUFQLENBQW1CLEtBQW5CLENBQXlCLFVBQXJELEdBQWtFLE9BQU8sV0FBUCxDQUFtQixLQUFuQixDQUF5QixRQUExRzs7QUFFQSxnQkFBRSxPQUFPLE9BQVQsRUFBa0IsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsT0FBTyxNQUFQLENBQWMsUUFBNUMsRUFBc0QsRUFBRSxLQUFGLENBQVEsT0FBTyxNQUFmLEVBQXVCLE1BQXZCLENBQXRELEVBQXNGLEVBQXRGLENBQXlGLFFBQXpGLEVBQW1HLE9BQU8sTUFBUCxDQUFjLFFBQWpILEVBQTJILEVBQUUsS0FBRixDQUFRLE9BQU8sTUFBZixFQUF1QixNQUF2QixDQUEzSDtBQUNEO0FBQ0YsV0FURDs7QUFXQSxjQUFJLEtBQUssTUFBTCxDQUFZLFFBQWhCLEVBQTBCO0FBQ3hCLGlCQUFLLE1BQUwsR0FBYyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsS0FBSyxNQUFsQixFQUEwQjtBQUN0Qyx1QkFBUyxRQUQ2QjtBQUV0Qyx3QkFBVTtBQUY0QixhQUExQixDQUFkO0FBSUQsV0FMRCxNQUtPO0FBQ0wsaUJBQUssU0FBTDtBQUNEO0FBQ0Y7QUExQkEsT0F4UG1CLEVBbVJuQjtBQUNELGFBQUssV0FESjtBQUVELGVBQU8sU0FBUyxTQUFULEdBQXFCO0FBQzFCLGNBQUksb0JBQW1CLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIscUJBQTFCLENBQW5CLENBQUo7QUFDQSxjQUFJLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsT0FBMUIsS0FBc0MsY0FBYyxRQUF4RCxFQUFrRTtBQUNoRSxpQkFBSyxPQUFMLENBQWEsWUFBYixDQUEwQixxQkFBMUIsRUFBaUQsS0FBSyxPQUFMLENBQWEsWUFBYixDQUEwQixPQUExQixLQUFzQyxFQUF2RjtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxZQUFiLENBQTBCLE9BQTFCLEVBQW1DLEVBQW5DO0FBQ0Q7QUFDRjtBQVJBLE9BblJtQixFQTRSbkI7QUFDRCxhQUFLLFFBREo7QUFFRCxlQUFPLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QixPQUF2QixFQUFnQztBQUNyQyxjQUFJLFVBQVUsS0FBSyxXQUFMLENBQWlCLFFBQS9COztBQUVBLG9CQUFVLFdBQVcsRUFBRSxNQUFNLGFBQVIsRUFBdUIsSUFBdkIsQ0FBNEIsT0FBNUIsQ0FBckI7O0FBRUEsY0FBSSxDQUFDLE9BQUwsRUFBYztBQUNaLHNCQUFVLElBQUksS0FBSyxXQUFULENBQXFCLE1BQU0sYUFBM0IsRUFBMEMsS0FBSyxrQkFBTCxFQUExQyxDQUFWO0FBQ0EsY0FBRSxNQUFNLGFBQVIsRUFBdUIsSUFBdkIsQ0FBNEIsT0FBNUIsRUFBcUMsT0FBckM7QUFDRDs7QUFFRCxjQUFJLEtBQUosRUFBVztBQUNULG9CQUFRLGNBQVIsQ0FBdUIsTUFBTSxJQUFOLEtBQWUsU0FBZixHQUEyQixRQUFRLEtBQW5DLEdBQTJDLFFBQVEsS0FBMUUsSUFBbUYsSUFBbkY7QUFDRDs7QUFFRCxjQUFJLEVBQUUsUUFBUSxhQUFSLEVBQUYsRUFBMkIsUUFBM0IsQ0FBb0MsVUFBVSxFQUE5QyxLQUFxRCxRQUFRLFdBQVIsS0FBd0IsV0FBVyxFQUE1RixFQUFnRztBQUM5RixvQkFBUSxXQUFSLEdBQXNCLFdBQVcsRUFBakM7QUFDQTtBQUNEOztBQUVELHVCQUFhLFFBQVEsUUFBckI7O0FBRUEsa0JBQVEsV0FBUixHQUFzQixXQUFXLEVBQWpDOztBQUVBLGNBQUksQ0FBQyxRQUFRLE1BQVIsQ0FBZSxLQUFoQixJQUF5QixDQUFDLFFBQVEsTUFBUixDQUFlLEtBQWYsQ0FBcUIsSUFBbkQsRUFBeUQ7QUFDdkQsb0JBQVEsSUFBUjtBQUNBO0FBQ0Q7O0FBRUQsa0JBQVEsUUFBUixHQUFtQixXQUFXLFlBQVk7QUFDeEMsZ0JBQUksUUFBUSxXQUFSLEtBQXdCLFdBQVcsRUFBdkMsRUFBMkM7QUFDekMsc0JBQVEsSUFBUjtBQUNEO0FBQ0YsV0FKa0IsRUFJaEIsUUFBUSxNQUFSLENBQWUsS0FBZixDQUFxQixJQUpMLENBQW5CO0FBS0Q7QUFuQ0EsT0E1Um1CLEVBZ1VuQjtBQUNELGFBQUssUUFESjtBQUVELGVBQU8sU0FBUyxNQUFULENBQWdCLEtBQWhCLEVBQXVCLE9BQXZCLEVBQWdDO0FBQ3JDLGNBQUksVUFBVSxLQUFLLFdBQUwsQ0FBaUIsUUFBL0I7O0FBRUEsb0JBQVUsV0FBVyxFQUFFLE1BQU0sYUFBUixFQUF1QixJQUF2QixDQUE0QixPQUE1QixDQUFyQjs7QUFFQSxjQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1osc0JBQVUsSUFBSSxLQUFLLFdBQVQsQ0FBcUIsTUFBTSxhQUEzQixFQUEwQyxLQUFLLGtCQUFMLEVBQTFDLENBQVY7QUFDQSxjQUFFLE1BQU0sYUFBUixFQUF1QixJQUF2QixDQUE0QixPQUE1QixFQUFxQyxPQUFyQztBQUNEOztBQUVELGNBQUksS0FBSixFQUFXO0FBQ1Qsb0JBQVEsY0FBUixDQUF1QixNQUFNLElBQU4sS0FBZSxVQUFmLEdBQTRCLFFBQVEsS0FBcEMsR0FBNEMsUUFBUSxLQUEzRSxJQUFvRixLQUFwRjtBQUNEOztBQUVELGNBQUksUUFBUSxvQkFBUixFQUFKLEVBQW9DO0FBQ2xDO0FBQ0Q7O0FBRUQsdUJBQWEsUUFBUSxRQUFyQjs7QUFFQSxrQkFBUSxXQUFSLEdBQXNCLFdBQVcsR0FBakM7O0FBRUEsY0FBSSxDQUFDLFFBQVEsTUFBUixDQUFlLEtBQWhCLElBQXlCLENBQUMsUUFBUSxNQUFSLENBQWUsS0FBZixDQUFxQixJQUFuRCxFQUF5RDtBQUN2RCxvQkFBUSxJQUFSO0FBQ0E7QUFDRDs7QUFFRCxrQkFBUSxRQUFSLEdBQW1CLFdBQVcsWUFBWTtBQUN4QyxnQkFBSSxRQUFRLFdBQVIsS0FBd0IsV0FBVyxHQUF2QyxFQUE0QztBQUMxQyxzQkFBUSxJQUFSO0FBQ0Q7QUFDRixXQUprQixFQUloQixRQUFRLE1BQVIsQ0FBZSxLQUFmLENBQXFCLElBSkwsQ0FBbkI7QUFLRDtBQWxDQSxPQWhVbUIsRUFtV25CO0FBQ0QsYUFBSyxzQkFESjtBQUVELGVBQU8sU0FBUyxvQkFBVCxHQUFnQztBQUNyQyxlQUFLLElBQUksT0FBVCxJQUFvQixLQUFLLGNBQXpCLEVBQXlDO0FBQ3ZDLGdCQUFJLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFKLEVBQWtDO0FBQ2hDLHFCQUFPLElBQVA7QUFDRDtBQUNGOztBQUVELGlCQUFPLEtBQVA7QUFDRDtBQVZBLE9BbldtQixFQThXbkI7QUFDRCxhQUFLLFlBREo7QUFFRCxlQUFPLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUNqQyxtQkFBUyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsS0FBSyxXQUFMLENBQWlCLE9BQTlCLEVBQXVDLEVBQUUsS0FBSyxPQUFQLEVBQWdCLElBQWhCLEVBQXZDLEVBQStELE1BQS9ELENBQVQ7O0FBRUEsY0FBSSxPQUFPLEtBQVAsSUFBZ0IsT0FBTyxPQUFPLEtBQWQsS0FBd0IsUUFBNUMsRUFBc0Q7QUFDcEQsbUJBQU8sS0FBUCxHQUFlO0FBQ2Isb0JBQU0sT0FBTyxLQURBO0FBRWIsb0JBQU0sT0FBTztBQUZBLGFBQWY7QUFJRDs7QUFFRCxnQkFBTSxTQUFOLEVBQWlCLGVBQWpCLENBQWlDLElBQWpDLEVBQXVDLE1BQXZDLEVBQStDLEtBQUssV0FBTCxDQUFpQixXQUFoRTs7QUFFQSxpQkFBTyxNQUFQO0FBQ0Q7QUFmQSxPQTlXbUIsRUE4WG5CO0FBQ0QsYUFBSyxvQkFESjtBQUVELGVBQU8sU0FBUyxrQkFBVCxHQUE4QjtBQUNuQyxjQUFJLFNBQVMsRUFBYjs7QUFFQSxjQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLGlCQUFLLElBQUksR0FBVCxJQUFnQixLQUFLLE1BQXJCLEVBQTZCO0FBQzNCLGtCQUFJLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixHQUF6QixNQUFrQyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQXRDLEVBQXdEO0FBQ3RELHVCQUFPLEdBQVAsSUFBYyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWQ7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsaUJBQU8sTUFBUDtBQUNEOzs7O0FBZEEsT0E5WG1CLENBQXRCLEVBZ1pJLENBQUM7QUFDSCxhQUFLLGtCQURGO0FBRUgsZUFBTyxTQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDO0FBQ3ZDLGlCQUFPLEtBQUssSUFBTCxDQUFVLFlBQVk7QUFDM0IsZ0JBQUksT0FBTyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsUUFBYixDQUFYO0FBQ0EsZ0JBQUksVUFBVSxRQUFPLE1BQVAseUNBQU8sTUFBUCxPQUFrQixRQUFsQixHQUE2QixNQUE3QixHQUFzQyxJQUFwRDs7QUFFQSxnQkFBSSxDQUFDLElBQUQsSUFBUyxlQUFlLElBQWYsQ0FBb0IsTUFBcEIsQ0FBYixFQUEwQztBQUN4QztBQUNEOztBQUVELGdCQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1QscUJBQU8sSUFBSSxPQUFKLENBQVksSUFBWixFQUFrQixPQUFsQixDQUFQO0FBQ0EsZ0JBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxRQUFiLEVBQXVCLElBQXZCO0FBQ0Q7O0FBRUQsZ0JBQUksT0FBTyxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLGtCQUFJLEtBQUssTUFBTCxNQUFpQixTQUFyQixFQUFnQztBQUM5QixzQkFBTSxJQUFJLEtBQUosQ0FBVSxzQkFBc0IsTUFBdEIsR0FBK0IsR0FBekMsQ0FBTjtBQUNEO0FBQ0QsbUJBQUssTUFBTDtBQUNEO0FBQ0YsV0FuQk0sQ0FBUDtBQW9CRDtBQXZCRSxPQUFELEVBd0JEO0FBQ0QsYUFBSyxTQURKO0FBRUQsYUFBSyxTQUFTLEdBQVQsR0FBZTtBQUNsQixpQkFBTyxPQUFQO0FBQ0Q7QUFKQSxPQXhCQyxFQTZCRDtBQUNELGFBQUssU0FESjtBQUVELGFBQUssU0FBUyxHQUFULEdBQWU7QUFDbEIsaUJBQU8sT0FBUDtBQUNEO0FBSkEsT0E3QkMsRUFrQ0Q7QUFDRCxhQUFLLE1BREo7QUFFRCxhQUFLLFNBQVMsR0FBVCxHQUFlO0FBQ2xCLGlCQUFPLElBQVA7QUFDRDtBQUpBLE9BbENDLEVBdUNEO0FBQ0QsYUFBSyxVQURKO0FBRUQsYUFBSyxTQUFTLEdBQVQsR0FBZTtBQUNsQixpQkFBTyxRQUFQO0FBQ0Q7QUFKQSxPQXZDQyxFQTRDRDtBQUNELGFBQUssT0FESjtBQUVELGFBQUssU0FBUyxHQUFULEdBQWU7QUFDbEIsaUJBQU8sS0FBUDtBQUNEO0FBSkEsT0E1Q0MsRUFpREQ7QUFDRCxhQUFLLFdBREo7QUFFRCxhQUFLLFNBQVMsR0FBVCxHQUFlO0FBQ2xCLGlCQUFPLFNBQVA7QUFDRDtBQUpBLE9BakRDLEVBc0REO0FBQ0QsYUFBSyxhQURKO0FBRUQsYUFBSyxTQUFTLEdBQVQsR0FBZTtBQUNsQixpQkFBTyxXQUFQO0FBQ0Q7QUFKQSxPQXREQyxDQWhaSjs7QUE2Y0EsYUFBTyxPQUFQO0FBQ0QsS0F6ZWEsRUFBZDs7QUEyZUEsTUFBRSxFQUFGLENBQUssSUFBTCxJQUFhLFFBQVEsZ0JBQXJCO0FBQ0EsTUFBRSxFQUFGLENBQUssSUFBTCxFQUFXLFdBQVgsR0FBeUIsT0FBekI7QUFDQSxNQUFFLEVBQUYsQ0FBSyxJQUFMLEVBQVcsVUFBWCxHQUF3QixZQUFZO0FBQ2xDLFFBQUUsRUFBRixDQUFLLElBQUwsSUFBYSxrQkFBYjtBQUNBLGFBQU8sUUFBUSxnQkFBZjtBQUNELEtBSEQ7O0FBS0EsV0FBTyxPQUFQO0FBQ0QsR0ExbEJhLENBMGxCWCxNQTFsQlcsQ0FBZDs7QUE0bEJBLFNBQU8sT0FBUCxHQUFpQixPQUFqQjtBQUNELENBN25CRCIsImZpbGUiOiJ0b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnLCAnbW9kdWxlJywgJy4vdXRpbCddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMsIG1vZHVsZSwgcmVxdWlyZSgnLi91dGlsJykpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QuZXhwb3J0cywgbW9kLCBnbG9iYWwuVXRpbCk7XG4gICAgZ2xvYmFsLnRvb2x0aXAgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsIG1vZHVsZSwgX3V0aWwpIHtcbiAgLyogZ2xvYmFsIFRldGhlciAqL1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuICB2YXIgX1V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsKTtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQm9vdHN0cmFwICh2NC4wLjAtYWxwaGEuMik6IHRvb2x0aXAuanNcbiAgICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgdmFyIFRvb2x0aXAgPSAoZnVuY3Rpb24gKCQpIHtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciBUZXRoZXIgZGVwZW5kZW5jeVxuICAgICAqIFRldGhlciAtIGh0dHA6Ly9naXRodWIuaHVic3BvdC5jb20vdGV0aGVyL1xuICAgICAqL1xuICAgIGlmICh3aW5kb3cuVGV0aGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgVGV0aGVyIChodHRwOi8vZ2l0aHViLmh1YnNwb3QuY29tL3RldGhlci8pJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogQ29uc3RhbnRzXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICB2YXIgTkFNRSA9ICd0b29sdGlwJztcbiAgICB2YXIgVkVSU0lPTiA9ICc0LjAuMC1hbHBoYSc7XG4gICAgdmFyIERBVEFfS0VZID0gJ2JzLnRvb2x0aXAnO1xuICAgIHZhciBFVkVOVF9LRVkgPSAnLicgKyBEQVRBX0tFWTtcbiAgICB2YXIgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltOQU1FXTtcbiAgICB2YXIgVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MDtcbiAgICB2YXIgQ0xBU1NfUFJFRklYID0gJ2JzLXRldGhlcic7XG5cbiAgICB2YXIgRGVmYXVsdCA9IHtcbiAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPicgKyAnPGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gICAgICB0aXRsZTogJycsXG4gICAgICBkZWxheTogMCxcbiAgICAgIGh0bWw6IGZhbHNlLFxuICAgICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgIG9mZnNldDogJzAgMCcsXG4gICAgICBjb25zdHJhaW50czogW11cbiAgICB9O1xuXG4gICAgdmFyIERlZmF1bHRUeXBlID0ge1xuICAgICAgYW5pbWF0aW9uOiAnYm9vbGVhbicsXG4gICAgICB0ZW1wbGF0ZTogJ3N0cmluZycsXG4gICAgICB0aXRsZTogJyhzdHJpbmd8ZWxlbWVudHxmdW5jdGlvbiknLFxuICAgICAgdHJpZ2dlcjogJ3N0cmluZycsXG4gICAgICBkZWxheTogJyhudW1iZXJ8b2JqZWN0KScsXG4gICAgICBodG1sOiAnYm9vbGVhbicsXG4gICAgICBzZWxlY3RvcjogJyhzdHJpbmd8Ym9vbGVhbiknLFxuICAgICAgcGxhY2VtZW50OiAnKHN0cmluZ3xmdW5jdGlvbiknLFxuICAgICAgb2Zmc2V0OiAnc3RyaW5nJyxcbiAgICAgIGNvbnN0cmFpbnRzOiAnYXJyYXknXG4gICAgfTtcblxuICAgIHZhciBBdHRhY2htZW50TWFwID0ge1xuICAgICAgVE9QOiAnYm90dG9tIGNlbnRlcicsXG4gICAgICBSSUdIVDogJ21pZGRsZSBsZWZ0JyxcbiAgICAgIEJPVFRPTTogJ3RvcCBjZW50ZXInLFxuICAgICAgTEVGVDogJ21pZGRsZSByaWdodCdcbiAgICB9O1xuXG4gICAgdmFyIEhvdmVyU3RhdGUgPSB7XG4gICAgICBJTjogJ2luJyxcbiAgICAgIE9VVDogJ291dCdcbiAgICB9O1xuXG4gICAgdmFyIEV2ZW50ID0ge1xuICAgICAgSElERTogJ2hpZGUnICsgRVZFTlRfS0VZLFxuICAgICAgSElEREVOOiAnaGlkZGVuJyArIEVWRU5UX0tFWSxcbiAgICAgIFNIT1c6ICdzaG93JyArIEVWRU5UX0tFWSxcbiAgICAgIFNIT1dOOiAnc2hvd24nICsgRVZFTlRfS0VZLFxuICAgICAgSU5TRVJURUQ6ICdpbnNlcnRlZCcgKyBFVkVOVF9LRVksXG4gICAgICBDTElDSzogJ2NsaWNrJyArIEVWRU5UX0tFWSxcbiAgICAgIEZPQ1VTSU46ICdmb2N1c2luJyArIEVWRU5UX0tFWSxcbiAgICAgIEZPQ1VTT1VUOiAnZm9jdXNvdXQnICsgRVZFTlRfS0VZLFxuICAgICAgTU9VU0VFTlRFUjogJ21vdXNlZW50ZXInICsgRVZFTlRfS0VZLFxuICAgICAgTU9VU0VMRUFWRTogJ21vdXNlbGVhdmUnICsgRVZFTlRfS0VZXG4gICAgfTtcblxuICAgIHZhciBDbGFzc05hbWUgPSB7XG4gICAgICBGQURFOiAnZmFkZScsXG4gICAgICBJTjogJ2luJ1xuICAgIH07XG5cbiAgICB2YXIgU2VsZWN0b3IgPSB7XG4gICAgICBUT09MVElQOiAnLnRvb2x0aXAnLFxuICAgICAgVE9PTFRJUF9JTk5FUjogJy50b29sdGlwLWlubmVyJ1xuICAgIH07XG5cbiAgICB2YXIgVGV0aGVyQ2xhc3MgPSB7XG4gICAgICBlbGVtZW50OiBmYWxzZSxcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHZhciBUcmlnZ2VyID0ge1xuICAgICAgSE9WRVI6ICdob3ZlcicsXG4gICAgICBGT0NVUzogJ2ZvY3VzJyxcbiAgICAgIENMSUNLOiAnY2xpY2snLFxuICAgICAgTUFOVUFMOiAnbWFudWFsJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICB2YXIgVG9vbHRpcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICBmdW5jdGlvbiBUb29sdGlwKGVsZW1lbnQsIGNvbmZpZykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVG9vbHRpcCk7XG5cbiAgICAgICAgLy8gcHJpdmF0ZVxuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgICAgICAgdGhpcy5faG92ZXJTdGF0ZSA9ICcnO1xuICAgICAgICB0aGlzLl9hY3RpdmVUcmlnZ2VyID0ge307XG4gICAgICAgIHRoaXMuX3RldGhlciA9IG51bGw7XG5cbiAgICAgICAgLy8gcHJvdGVjdGVkXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMudGlwID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9zZXRMaXN0ZW5lcnMoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAqIGpRdWVyeVxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKi9cblxuICAgICAgLy8gZ2V0dGVyc1xuXG4gICAgICBfY3JlYXRlQ2xhc3MoVG9vbHRpcCwgW3tcbiAgICAgICAga2V5OiAnZW5hYmxlJyxcblxuICAgICAgICAvLyBwdWJsaWNcblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGlzYWJsZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xuICAgICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZUVuYWJsZWQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlRW5hYmxlZCgpIHtcbiAgICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSAhdGhpcy5faXNFbmFibGVkO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3RvZ2dsZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGUoZXZlbnQpIHtcbiAgICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBkYXRhS2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKGRhdGFLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgY29udGV4dCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGV2ZW50LmN1cnJlbnRUYXJnZXQsIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpO1xuICAgICAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXIuY2xpY2sgPSAhY29udGV4dC5fYWN0aXZlVHJpZ2dlci5jbGljaztcblxuICAgICAgICAgICAgaWYgKGNvbnRleHQuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSkge1xuICAgICAgICAgICAgICBjb250ZXh0Ll9lbnRlcihudWxsLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHQuX2xlYXZlKG51bGwsIGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhDbGFzc05hbWUuSU4pKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xlYXZlKG51bGwsIHRoaXMpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VudGVyKG51bGwsIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdkaXNwb3NlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVvdXQpO1xuXG4gICAgICAgICAgdGhpcy5jbGVhbnVwVGV0aGVyKCk7XG5cbiAgICAgICAgICAkLnJlbW92ZURhdGEodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKTtcblxuICAgICAgICAgICQodGhpcy5lbGVtZW50KS5vZmYodGhpcy5jb25zdHJ1Y3Rvci5FVkVOVF9LRVkpO1xuXG4gICAgICAgICAgaWYgKHRoaXMudGlwKSB7XG4gICAgICAgICAgICAkKHRoaXMudGlwKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2hvdmVyU3RhdGUgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXIgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3RldGhlciA9IG51bGw7XG5cbiAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnRpcCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2hvdycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuaXNXaXRoQ29udGVudCgpICYmIHRoaXMuX2lzRW5hYmxlZCkge1xuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoc2hvd0V2ZW50KTtcblxuICAgICAgICAgICAgdmFyIGlzSW5UaGVEb20gPSAkLmNvbnRhaW5zKHRoaXMuZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy5lbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaXNJblRoZURvbSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aXAgPSB0aGlzLmdldFRpcEVsZW1lbnQoKTtcbiAgICAgICAgICAgIHZhciB0aXBJZCA9IF9VdGlsWydkZWZhdWx0J10uZ2V0VUlEKHRoaXMuY29uc3RydWN0b3IuTkFNRSk7XG5cbiAgICAgICAgICAgIHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGlwSWQpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIHRpcElkKTtcblxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgJCh0aXApLmFkZENsYXNzKENsYXNzTmFtZS5GQURFKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLmNvbmZpZy5wbGFjZW1lbnQgPT09ICdmdW5jdGlvbicgPyB0aGlzLmNvbmZpZy5wbGFjZW1lbnQuY2FsbCh0aGlzLCB0aXAsIHRoaXMuZWxlbWVudCkgOiB0aGlzLmNvbmZpZy5wbGFjZW1lbnQ7XG5cbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50ID0gdGhpcy5fZ2V0QXR0YWNobWVudChwbGFjZW1lbnQpO1xuXG4gICAgICAgICAgICAkKHRpcCkuZGF0YSh0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLCB0aGlzKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5JTlNFUlRFRCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3RldGhlciA9IG5ldyBUZXRoZXIoe1xuICAgICAgICAgICAgICBhdHRhY2htZW50OiBhdHRhY2htZW50LFxuICAgICAgICAgICAgICBlbGVtZW50OiB0aXAsXG4gICAgICAgICAgICAgIHRhcmdldDogdGhpcy5lbGVtZW50LFxuICAgICAgICAgICAgICBjbGFzc2VzOiBUZXRoZXJDbGFzcyxcbiAgICAgICAgICAgICAgY2xhc3NQcmVmaXg6IENMQVNTX1BSRUZJWCxcbiAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmNvbmZpZy5vZmZzZXQsXG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzOiB0aGlzLmNvbmZpZy5jb25zdHJhaW50cyxcbiAgICAgICAgICAgICAgYWRkVGFyZ2V0Q2xhc3NlczogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfVXRpbFsnZGVmYXVsdCddLnJlZmxvdyh0aXApO1xuICAgICAgICAgICAgdGhpcy5fdGV0aGVyLnBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICQodGlwKS5hZGRDbGFzcyhDbGFzc05hbWUuSU4pO1xuXG4gICAgICAgICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gX3RoaXMuX2hvdmVyU3RhdGU7XG4gICAgICAgICAgICAgIF90aGlzLl9ob3ZlclN0YXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICAkKF90aGlzLmVsZW1lbnQpLnRyaWdnZXIoX3RoaXMuY29uc3RydWN0b3IuRXZlbnQuU0hPV04pO1xuXG4gICAgICAgICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PT0gSG92ZXJTdGF0ZS5PVVQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fbGVhdmUobnVsbCwgX3RoaXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoX1V0aWxbJ2RlZmF1bHQnXS5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJiAkKHRoaXMudGlwKS5oYXNDbGFzcyhDbGFzc05hbWUuRkFERSkpIHtcbiAgICAgICAgICAgICAgJCh0aGlzLnRpcCkub25lKF9VdGlsWydkZWZhdWx0J10uVFJBTlNJVElPTl9FTkQsIGNvbXBsZXRlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLl9UUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb21wbGV0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdoaWRlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoY2FsbGJhY2spIHtcbiAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgIHZhciB0aXAgPSB0aGlzLmdldFRpcEVsZW1lbnQoKTtcbiAgICAgICAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkhJREUpO1xuICAgICAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzMi5faG92ZXJTdGF0ZSAhPT0gSG92ZXJTdGF0ZS5JTiAmJiB0aXAucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICB0aXAucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGhpczIuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgICQoX3RoaXMyLmVsZW1lbnQpLnRyaWdnZXIoX3RoaXMyLmNvbnN0cnVjdG9yLkV2ZW50LkhJRERFTik7XG4gICAgICAgICAgICBfdGhpczIuY2xlYW51cFRldGhlcigpO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoaGlkZUV2ZW50KTtcblxuICAgICAgICAgIGlmIChoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKHRpcCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLklOKTtcblxuICAgICAgICAgIGlmIChfVXRpbFsnZGVmYXVsdCddLnN1cHBvcnRzVHJhbnNpdGlvbkVuZCgpICYmICQodGhpcy50aXApLmhhc0NsYXNzKENsYXNzTmFtZS5GQURFKSkge1xuXG4gICAgICAgICAgICAkKHRpcCkub25lKF9VdGlsWydkZWZhdWx0J10uVFJBTlNJVElPTl9FTkQsIGNvbXBsZXRlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChUUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGxldGUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9ob3ZlclN0YXRlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcm90ZWN0ZWRcblxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdpc1dpdGhDb250ZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzV2l0aENvbnRlbnQoKSB7XG4gICAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRUaXBFbGVtZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRpcEVsZW1lbnQoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudGlwID0gdGhpcy50aXAgfHwgJCh0aGlzLmNvbmZpZy50ZW1wbGF0ZSlbMF07XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2V0Q29udGVudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDb250ZW50KCkge1xuICAgICAgICAgIHZhciAkdGlwID0gJCh0aGlzLmdldFRpcEVsZW1lbnQoKSk7XG5cbiAgICAgICAgICB0aGlzLnNldEVsZW1lbnRDb250ZW50KCR0aXAuZmluZChTZWxlY3Rvci5UT09MVElQX0lOTkVSKSwgdGhpcy5nZXRUaXRsZSgpKTtcblxuICAgICAgICAgICR0aXAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkZBREUpLnJlbW92ZUNsYXNzKENsYXNzTmFtZS5JTik7XG5cbiAgICAgICAgICB0aGlzLmNsZWFudXBUZXRoZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzZXRFbGVtZW50Q29udGVudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRFbGVtZW50Q29udGVudCgkZWxlbWVudCwgY29udGVudCkge1xuICAgICAgICAgIHZhciBodG1sID0gdGhpcy5jb25maWcuaHRtbDtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnICYmIChjb250ZW50Lm5vZGVUeXBlIHx8IGNvbnRlbnQuanF1ZXJ5KSkge1xuICAgICAgICAgICAgLy8gY29udGVudCBpcyBhIERPTSBub2RlIG9yIGEgalF1ZXJ5XG4gICAgICAgICAgICBpZiAoaHRtbCkge1xuICAgICAgICAgICAgICBpZiAoISQoY29udGVudCkucGFyZW50KCkuaXMoJGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQoY29udGVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRlbGVtZW50LnRleHQoJChjb250ZW50KS50ZXh0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkZWxlbWVudFtodG1sID8gJ2h0bWwnIDogJ3RleHQnXShjb250ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0VGl0bGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VGl0bGUoKSB7XG4gICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScpO1xuXG4gICAgICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAgICAgdGl0bGUgPSB0eXBlb2YgdGhpcy5jb25maWcudGl0bGUgPT09ICdmdW5jdGlvbicgPyB0aGlzLmNvbmZpZy50aXRsZS5jYWxsKHRoaXMuZWxlbWVudCkgOiB0aGlzLmNvbmZpZy50aXRsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdGl0bGU7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnY2xlYW51cFRldGhlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhbnVwVGV0aGVyKCkge1xuICAgICAgICAgIGlmICh0aGlzLl90ZXRoZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3RldGhlci5kZXN0cm95KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJpdmF0ZVxuXG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ19nZXRBdHRhY2htZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRBdHRhY2htZW50KHBsYWNlbWVudCkge1xuICAgICAgICAgIHJldHVybiBBdHRhY2htZW50TWFwW3BsYWNlbWVudC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfc2V0TGlzdGVuZXJzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLmNvbmZpZy50cmlnZ2VyLnNwbGl0KCcgJyk7XG5cbiAgICAgICAgICB0cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0cmlnZ2VyKSB7XG4gICAgICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ2NsaWNrJykge1xuICAgICAgICAgICAgICAkKF90aGlzMy5lbGVtZW50KS5vbihfdGhpczMuY29uc3RydWN0b3IuRXZlbnQuQ0xJQ0ssIF90aGlzMy5jb25maWcuc2VsZWN0b3IsICQucHJveHkoX3RoaXMzLnRvZ2dsZSwgX3RoaXMzKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT09IFRyaWdnZXIuTUFOVUFMKSB7XG4gICAgICAgICAgICAgIHZhciBldmVudEluID0gdHJpZ2dlciA9PT0gVHJpZ2dlci5IT1ZFUiA/IF90aGlzMy5jb25zdHJ1Y3Rvci5FdmVudC5NT1VTRUVOVEVSIDogX3RoaXMzLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTSU47XG4gICAgICAgICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT09IFRyaWdnZXIuSE9WRVIgPyBfdGhpczMuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VMRUFWRSA6IF90aGlzMy5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU09VVDtcblxuICAgICAgICAgICAgICAkKF90aGlzMy5lbGVtZW50KS5vbihldmVudEluLCBfdGhpczMuY29uZmlnLnNlbGVjdG9yLCAkLnByb3h5KF90aGlzMy5fZW50ZXIsIF90aGlzMykpLm9uKGV2ZW50T3V0LCBfdGhpczMuY29uZmlnLnNlbGVjdG9yLCAkLnByb3h5KF90aGlzMy5fbGVhdmUsIF90aGlzMykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmNvbmZpZywge1xuICAgICAgICAgICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICAgICAgICAgICAgc2VsZWN0b3I6ICcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZml4VGl0bGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2ZpeFRpdGxlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9maXhUaXRsZSgpIHtcbiAgICAgICAgICB2YXIgdGl0bGVUeXBlID0gdHlwZW9mIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKTtcbiAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGl0bGUnKSB8fCB0aXRsZVR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGl0bGUnKSB8fCAnJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aXRsZScsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2VudGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9lbnRlcihldmVudCwgY29udGV4dCkge1xuICAgICAgICAgIHZhciBkYXRhS2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtcblxuICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShkYXRhS2V5KTtcblxuICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGV2ZW50LmN1cnJlbnRUYXJnZXQsIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpO1xuICAgICAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKGRhdGFLZXksIGNvbnRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgY29udGV4dC5fYWN0aXZlVHJpZ2dlcltldmVudC50eXBlID09PSAnZm9jdXNpbicgPyBUcmlnZ2VyLkZPQ1VTIDogVHJpZ2dlci5IT1ZFUl0gPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICgkKGNvbnRleHQuZ2V0VGlwRWxlbWVudCgpKS5oYXNDbGFzcyhDbGFzc05hbWUuSU4pIHx8IGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuSU4pIHtcbiAgICAgICAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLklOO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNsZWFyVGltZW91dChjb250ZXh0Ll90aW1lb3V0KTtcblxuICAgICAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLklOO1xuXG4gICAgICAgICAgaWYgKCFjb250ZXh0LmNvbmZpZy5kZWxheSB8fCAhY29udGV4dC5jb25maWcuZGVsYXkuc2hvdykge1xuICAgICAgICAgICAgY29udGV4dC5zaG93KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5fdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuSU4pIHtcbiAgICAgICAgICAgICAgY29udGV4dC5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgY29udGV4dC5jb25maWcuZGVsYXkuc2hvdyk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2xlYXZlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9sZWF2ZShldmVudCwgY29udGV4dCkge1xuICAgICAgICAgIHZhciBkYXRhS2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWTtcblxuICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShkYXRhS2V5KTtcblxuICAgICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGV2ZW50LmN1cnJlbnRUYXJnZXQsIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKCkpO1xuICAgICAgICAgICAgJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKGRhdGFLZXksIGNvbnRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgY29udGV4dC5fYWN0aXZlVHJpZ2dlcltldmVudC50eXBlID09PSAnZm9jdXNvdXQnID8gVHJpZ2dlci5GT0NVUyA6IFRyaWdnZXIuSE9WRVJdID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuX2lzV2l0aEFjdGl2ZVRyaWdnZXIoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNsZWFyVGltZW91dChjb250ZXh0Ll90aW1lb3V0KTtcblxuICAgICAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLk9VVDtcblxuICAgICAgICAgIGlmICghY29udGV4dC5jb25maWcuZGVsYXkgfHwgIWNvbnRleHQuY29uZmlnLmRlbGF5LmhpZGUpIHtcbiAgICAgICAgICAgIGNvbnRleHQuaGlkZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0Ll9ob3ZlclN0YXRlID09PSBIb3ZlclN0YXRlLk9VVCkge1xuICAgICAgICAgICAgICBjb250ZXh0LmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBjb250ZXh0LmNvbmZpZy5kZWxheS5oaWRlKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfaXNXaXRoQWN0aXZlVHJpZ2dlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaXNXaXRoQWN0aXZlVHJpZ2dlcigpIHtcbiAgICAgICAgICBmb3IgKHZhciB0cmlnZ2VyIGluIHRoaXMuX2FjdGl2ZVRyaWdnZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVUcmlnZ2VyW3RyaWdnZXJdKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0Q29uZmlnJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgICAgICAgY29uZmlnID0gJC5leHRlbmQoe30sIHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdCwgJCh0aGlzLmVsZW1lbnQpLmRhdGEoKSwgY29uZmlnKTtcblxuICAgICAgICAgIGlmIChjb25maWcuZGVsYXkgJiYgdHlwZW9mIGNvbmZpZy5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5kZWxheSA9IHtcbiAgICAgICAgICAgICAgc2hvdzogY29uZmlnLmRlbGF5LFxuICAgICAgICAgICAgICBoaWRlOiBjb25maWcuZGVsYXlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX1V0aWxbJ2RlZmF1bHQnXS50eXBlQ2hlY2tDb25maWcoTkFNRSwgY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlKTtcblxuICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2dldERlbGVnYXRlQ29uZmlnJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXREZWxlZ2F0ZUNvbmZpZygpIHtcbiAgICAgICAgICB2YXIgY29uZmlnID0ge307XG5cbiAgICAgICAgICBpZiAodGhpcy5jb25maWcpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNvbmZpZykge1xuICAgICAgICAgICAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0W2tleV0gIT09IHRoaXMuY29uZmlnW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IHRoaXMuY29uZmlnW2tleV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RhdGljXG5cbiAgICAgIH1dLCBbe1xuICAgICAgICBrZXk6ICdfalF1ZXJ5SW50ZXJmYWNlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YShEQVRBX0tFWSk7XG4gICAgICAgICAgICB2YXIgX2NvbmZpZyA9IHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gY29uZmlnIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3QoY29uZmlnKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICBkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgX2NvbmZpZyk7XG4gICAgICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSwgZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBpZiAoZGF0YVtjb25maWddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicgKyBjb25maWcgKyAnXCInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkYXRhW2NvbmZpZ10oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdWRVJTSU9OJyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIFZFUlNJT047XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnRGVmYXVsdCcsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBEZWZhdWx0O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ05BTUUnLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gTkFNRTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdEQVRBX0tFWScsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBEQVRBX0tFWTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdFdmVudCcsXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBFdmVudDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdFVkVOVF9LRVknLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gRVZFTlRfS0VZO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ0RlZmF1bHRUeXBlJyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIERlZmF1bHRUeXBlO1xuICAgICAgICB9XG4gICAgICB9XSk7XG5cbiAgICAgIHJldHVybiBUb29sdGlwO1xuICAgIH0pKCk7XG5cbiAgICAkLmZuW05BTUVdID0gVG9vbHRpcC5falF1ZXJ5SW50ZXJmYWNlO1xuICAgICQuZm5bTkFNRV0uQ29uc3RydWN0b3IgPSBUb29sdGlwO1xuICAgICQuZm5bTkFNRV0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICQuZm5bTkFNRV0gPSBKUVVFUllfTk9fQ09ORkxJQ1Q7XG4gICAgICByZXR1cm4gVG9vbHRpcC5falF1ZXJ5SW50ZXJmYWNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gVG9vbHRpcDtcbiAgfSkoalF1ZXJ5KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XG59KTtcbiJdfQ==