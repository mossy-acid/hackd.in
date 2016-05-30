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
    global.carousel = mod.exports;
  }
})(undefined, function (exports, module, _util) {
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
   * Bootstrap (v4.0.0-alpha.2): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Carousel = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'carousel';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.carousel';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 600;

    var Default = {
      interval: 5000,
      keyboard: true,
      slide: false,
      pause: 'hover',
      wrap: true
    };

    var DefaultType = {
      interval: '(number|boolean)',
      keyboard: 'boolean',
      slide: '(boolean|string)',
      pause: '(string|boolean)',
      wrap: 'boolean'
    };

    var Direction = {
      NEXT: 'next',
      PREVIOUS: 'prev'
    };

    var Event = {
      SLIDE: 'slide' + EVENT_KEY,
      SLID: 'slid' + EVENT_KEY,
      KEYDOWN: 'keydown' + EVENT_KEY,
      MOUSEENTER: 'mouseenter' + EVENT_KEY,
      MOUSELEAVE: 'mouseleave' + EVENT_KEY,
      LOAD_DATA_API: 'load' + EVENT_KEY + DATA_API_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      CAROUSEL: 'carousel',
      ACTIVE: 'active',
      SLIDE: 'slide',
      RIGHT: 'right',
      LEFT: 'left',
      ITEM: 'carousel-item'
    };

    var Selector = {
      ACTIVE: '.active',
      ACTIVE_ITEM: '.active.carousel-item',
      ITEM: '.carousel-item',
      NEXT_PREV: '.next, .prev',
      INDICATORS: '.carousel-indicators',
      DATA_SLIDE: '[data-slide], [data-slide-to]',
      DATA_RIDE: '[data-ride="carousel"]'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Carousel = function () {
      function Carousel(element, config) {
        _classCallCheck(this, Carousel);

        this._items = null;
        this._interval = null;
        this._activeElement = null;

        this._isPaused = false;
        this._isSliding = false;

        this._config = this._getConfig(config);
        this._element = $(element)[0];
        this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0];

        this._addEventListeners();
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Carousel, [{
        key: 'next',

        // public

        value: function next() {
          if (!this._isSliding) {
            this._slide(Direction.NEXT);
          }
        }
      }, {
        key: 'nextWhenVisible',
        value: function nextWhenVisible() {
          // Don't call next when the page isn't visible
          if (!document.hidden) {
            this.next();
          }
        }
      }, {
        key: 'prev',
        value: function prev() {
          if (!this._isSliding) {
            this._slide(Direction.PREVIOUS);
          }
        }
      }, {
        key: 'pause',
        value: function pause(event) {
          if (!event) {
            this._isPaused = true;
          }

          if ($(this._element).find(Selector.NEXT_PREV)[0] && _Util['default'].supportsTransitionEnd()) {
            _Util['default'].triggerTransitionEnd(this._element);
            this.cycle(true);
          }

          clearInterval(this._interval);
          this._interval = null;
        }
      }, {
        key: 'cycle',
        value: function cycle(event) {
          if (!event) {
            this._isPaused = false;
          }

          if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
          }

          if (this._config.interval && !this._isPaused) {
            this._interval = setInterval($.proxy(document.visibilityState ? this.nextWhenVisible : this.next, this), this._config.interval);
          }
        }
      }, {
        key: 'to',
        value: function to(index) {
          var _this = this;

          this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];

          var activeIndex = this._getItemIndex(this._activeElement);

          if (index > this._items.length - 1 || index < 0) {
            return;
          }

          if (this._isSliding) {
            $(this._element).one(Event.SLID, function () {
              return _this.to(index);
            });
            return;
          }

          if (activeIndex === index) {
            this.pause();
            this.cycle();
            return;
          }

          var direction = index > activeIndex ? Direction.NEXT : Direction.PREVIOUS;

          this._slide(direction, this._items[index]);
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          $(this._element).off(EVENT_KEY);
          $.removeData(this._element, DATA_KEY);

          this._items = null;
          this._config = null;
          this._element = null;
          this._interval = null;
          this._isPaused = null;
          this._isSliding = null;
          this._activeElement = null;
          this._indicatorsElement = null;
        }

        // private

      }, {
        key: '_getConfig',
        value: function _getConfig(config) {
          config = $.extend({}, Default, config);
          _Util['default'].typeCheckConfig(NAME, config, DefaultType);
          return config;
        }
      }, {
        key: '_addEventListeners',
        value: function _addEventListeners() {
          if (this._config.keyboard) {
            $(this._element).on(Event.KEYDOWN, $.proxy(this._keydown, this));
          }

          if (this._config.pause === 'hover' && !('ontouchstart' in document.documentElement)) {
            $(this._element).on(Event.MOUSEENTER, $.proxy(this.pause, this)).on(Event.MOUSELEAVE, $.proxy(this.cycle, this));
          }
        }
      }, {
        key: '_keydown',
        value: function _keydown(event) {
          event.preventDefault();

          if (/input|textarea/i.test(event.target.tagName)) {
            return;
          }

          switch (event.which) {
            case 37:
              this.prev();break;
            case 39:
              this.next();break;
            default:
              return;
          }
        }
      }, {
        key: '_getItemIndex',
        value: function _getItemIndex(element) {
          this._items = $.makeArray($(element).parent().find(Selector.ITEM));
          return this._items.indexOf(element);
        }
      }, {
        key: '_getItemByDirection',
        value: function _getItemByDirection(direction, activeElement) {
          var isNextDirection = direction === Direction.NEXT;
          var isPrevDirection = direction === Direction.PREVIOUS;
          var activeIndex = this._getItemIndex(activeElement);
          var lastItemIndex = this._items.length - 1;
          var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

          if (isGoingToWrap && !this._config.wrap) {
            return activeElement;
          }

          var delta = direction === Direction.PREVIOUS ? -1 : 1;
          var itemIndex = (activeIndex + delta) % this._items.length;

          return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
        }
      }, {
        key: '_triggerSlideEvent',
        value: function _triggerSlideEvent(relatedTarget, directionalClassname) {
          var slideEvent = $.Event(Event.SLIDE, {
            relatedTarget: relatedTarget,
            direction: directionalClassname
          });

          $(this._element).trigger(slideEvent);

          return slideEvent;
        }
      }, {
        key: '_setActiveIndicatorElement',
        value: function _setActiveIndicatorElement(element) {
          if (this._indicatorsElement) {
            $(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

            var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

            if (nextIndicator) {
              $(nextIndicator).addClass(ClassName.ACTIVE);
            }
          }
        }
      }, {
        key: '_slide',
        value: function _slide(direction, element) {
          var _this2 = this;

          var activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];
          var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

          var isCycling = Boolean(this._interval);

          var directionalClassName = direction === Direction.NEXT ? ClassName.LEFT : ClassName.RIGHT;

          if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
            this._isSliding = false;
            return;
          }

          var slideEvent = this._triggerSlideEvent(nextElement, directionalClassName);
          if (slideEvent.isDefaultPrevented()) {
            return;
          }

          if (!activeElement || !nextElement) {
            // some weirdness is happening, so we bail
            return;
          }

          this._isSliding = true;

          if (isCycling) {
            this.pause();
          }

          this._setActiveIndicatorElement(nextElement);

          var slidEvent = $.Event(Event.SLID, {
            relatedTarget: nextElement,
            direction: directionalClassName
          });

          if (_Util['default'].supportsTransitionEnd() && $(this._element).hasClass(ClassName.SLIDE)) {

            $(nextElement).addClass(direction);

            _Util['default'].reflow(nextElement);

            $(activeElement).addClass(directionalClassName);
            $(nextElement).addClass(directionalClassName);

            $(activeElement).one(_Util['default'].TRANSITION_END, function () {
              $(nextElement).removeClass(directionalClassName).removeClass(direction);

              $(nextElement).addClass(ClassName.ACTIVE);

              $(activeElement).removeClass(ClassName.ACTIVE).removeClass(direction).removeClass(directionalClassName);

              _this2._isSliding = false;

              setTimeout(function () {
                return $(_this2._element).trigger(slidEvent);
              }, 0);
            }).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            $(activeElement).removeClass(ClassName.ACTIVE);
            $(nextElement).addClass(ClassName.ACTIVE);

            this._isSliding = false;
            $(this._element).trigger(slidEvent);
          }

          if (isCycling) {
            this.cycle();
          }
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = $(this).data(DATA_KEY);
            var _config = $.extend({}, Default, $(this).data());

            if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
              $.extend(_config, config);
            }

            var action = typeof config === 'string' ? config : _config.slide;

            if (!data) {
              data = new Carousel(this, _config);
              $(this).data(DATA_KEY, data);
            }

            if (typeof config === 'number') {
              data.to(config);
            } else if (typeof action === 'string') {
              if (data[action] === undefined) {
                throw new Error('No method named "' + action + '"');
              }
              data[action]();
            } else if (_config.interval) {
              data.pause();
              data.cycle();
            }
          });
        }
      }, {
        key: '_dataApiClickHandler',
        value: function _dataApiClickHandler(event) {
          var selector = _Util['default'].getSelectorFromElement(this);

          if (!selector) {
            return;
          }

          var target = $(selector)[0];

          if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
            return;
          }

          var config = $.extend({}, $(target).data(), $(this).data());
          var slideIndex = this.getAttribute('data-slide-to');

          if (slideIndex) {
            config.interval = false;
          }

          Carousel._jQueryInterface.call($(target), config);

          if (slideIndex) {
            $(target).data(DATA_KEY).to(slideIndex);
          }

          event.preventDefault();
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
      }]);

      return Carousel;
    }();

    $(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);

    $(window).on(Event.LOAD_DATA_API, function () {
      $(Selector.DATA_RIDE).each(function () {
        var $carousel = $(this);
        Carousel._jQueryInterface.call($carousel, $carousel.data());
      });
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Carousel._jQueryInterface;
    $.fn[NAME].Constructor = Carousel;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Carousel._jQueryInterface;
    };

    return Carousel;
  }(jQuery);

  module.exports = Carousel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL2Nhcm91c2VsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxDQUFDLFVBQVUsTUFBVixFQUFrQixPQUFsQixFQUEyQjtBQUMxQixNQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzlDLFdBQU8sQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixRQUF0QixDQUFQLEVBQXdDLE9BQXhDO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sTUFBUCxLQUFrQixXQUF4RCxFQUFxRTtBQUMxRSxZQUFRLE9BQVIsRUFBaUIsTUFBakIsRUFBeUIsUUFBUSxRQUFSLENBQXpCO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsUUFBSSxNQUFNO0FBQ1IsZUFBUztBQURELEtBQVY7QUFHQSxZQUFRLElBQUksT0FBWixFQUFxQixHQUFyQixFQUEwQixPQUFPLElBQWpDO0FBQ0EsV0FBTyxRQUFQLEdBQWtCLElBQUksT0FBdEI7QUFDRDtBQUNGLENBWkQsYUFZUyxVQUFVLE9BQVYsRUFBbUIsTUFBbkIsRUFBMkIsS0FBM0IsRUFBa0M7QUFDekM7O0FBRUEsTUFBSSxlQUFnQixZQUFZO0FBQUUsYUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUFFLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQUUsWUFBSSxhQUFhLE1BQU0sQ0FBTixDQUFqQixDQUEyQixXQUFXLFVBQVgsR0FBd0IsV0FBVyxVQUFYLElBQXlCLEtBQWpELENBQXdELFdBQVcsWUFBWCxHQUEwQixJQUExQixDQUFnQyxJQUFJLFdBQVcsVUFBZixFQUEyQixXQUFXLFFBQVgsR0FBc0IsSUFBdEIsQ0FBNEIsT0FBTyxjQUFQLENB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R0FBZTtBQUNsQixpQkFBTyxPQUFQO0FBQ0Q7QUFKQSxPQWxFQyxDQTFRSjs7QUFtVkEsYUFBTyxRQUFQO0FBQ0QsS0E5V2MsRUFBZjs7QUFnWEEsTUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE1BQU0sY0FBckIsRUFBcUMsU0FBUyxVQUE5QyxFQUEwRCxTQUFTLG9CQUFuRTs7QUFFQSxNQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsTUFBTSxhQUFuQixFQUFrQyxZQUFZO0FBQzVDLFFBQUUsU0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLFlBQVk7QUFDckMsWUFBSSxZQUFZLEVBQUUsSUFBRixDQUFoQjtBQUNBLGlCQUFTLGdCQUFULENBQTBCLElBQTFCLENBQStCLFNBQS9CLEVBQTBDLFVBQVUsSUFBVixFQUExQztBQUNELE9BSEQ7QUFJRCxLQUxEOzs7Ozs7OztBQWFBLE1BQUUsRUFBRixDQUFLLElBQUwsSUFBYSxTQUFTLGdCQUF0QjtBQUNBLE1BQUUsRUFBRixDQUFLLElBQUwsRUFBVyxXQUFYLEdBQXlCLFFBQXpCO0FBQ0EsTUFBRSxFQUFGLENBQUssSUFBTCxFQUFXLFVBQVgsR0FBd0IsWUFBWTtBQUNsQyxRQUFFLEVBQUYsQ0FBSyxJQUFMLElBQWEsa0JBQWI7QUFDQSxhQUFPLFNBQVMsZ0JBQWhCO0FBQ0QsS0FIRDs7QUFLQSxXQUFPLFFBQVA7QUFDRCxHQS9jYyxDQStjWixNQS9jWSxDQUFmOztBQWlkQSxTQUFPLE9BQVAsR0FBaUIsUUFBakI7QUFDRCxDQWhmRCIsImZpbGUiOiJjYXJvdXNlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJywgJ21vZHVsZScsICcuL3V0aWwnXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzLCBtb2R1bGUsIHJlcXVpcmUoJy4vdXRpbCcpKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbW9kID0ge1xuICAgICAgZXhwb3J0czoge31cbiAgICB9O1xuICAgIGZhY3RvcnkobW9kLmV4cG9ydHMsIG1vZCwgZ2xvYmFsLlV0aWwpO1xuICAgIGdsb2JhbC5jYXJvdXNlbCA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cywgbW9kdWxlLCBfdXRpbCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuICBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbiAgdmFyIF9VdGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbCk7XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIEJvb3RzdHJhcCAodjQuMC4wLWFscGhhLjIpOiBjYXJvdXNlbC5qc1xuICAgKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICB2YXIgQ2Fyb3VzZWwgPSAoZnVuY3Rpb24gKCQpIHtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIENvbnN0YW50c1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgdmFyIE5BTUUgPSAnY2Fyb3VzZWwnO1xuICAgIHZhciBWRVJTSU9OID0gJzQuMC4wLWFscGhhJztcbiAgICB2YXIgREFUQV9LRVkgPSAnYnMuY2Fyb3VzZWwnO1xuICAgIHZhciBFVkVOVF9LRVkgPSAnLicgKyBEQVRBX0tFWTtcbiAgICB2YXIgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG4gICAgdmFyIEpRVUVSWV9OT19DT05GTElDVCA9ICQuZm5bTkFNRV07XG4gICAgdmFyIFRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDA7XG5cbiAgICB2YXIgRGVmYXVsdCA9IHtcbiAgICAgIGludGVydmFsOiA1MDAwLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICBzbGlkZTogZmFsc2UsXG4gICAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICAgIHdyYXA6IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIERlZmF1bHRUeXBlID0ge1xuICAgICAgaW50ZXJ2YWw6ICcobnVtYmVyfGJvb2xlYW4pJyxcbiAgICAgIGtleWJvYXJkOiAnYm9vbGVhbicsXG4gICAgICBzbGlkZTogJyhib29sZWFufHN0cmluZyknLFxuICAgICAgcGF1c2U6ICcoc3RyaW5nfGJvb2xlYW4pJyxcbiAgICAgIHdyYXA6ICdib29sZWFuJ1xuICAgIH07XG5cbiAgICB2YXIgRGlyZWN0aW9uID0ge1xuICAgICAgTkVYVDogJ25leHQnLFxuICAgICAgUFJFVklPVVM6ICdwcmV2J1xuICAgIH07XG5cbiAgICB2YXIgRXZlbnQgPSB7XG4gICAgICBTTElERTogJ3NsaWRlJyArIEVWRU5UX0tFWSxcbiAgICAgIFNMSUQ6ICdzbGlkJyArIEVWRU5UX0tFWSxcbiAgICAgIEtFWURPV046ICdrZXlkb3duJyArIEVWRU5UX0tFWSxcbiAgICAgIE1PVVNFRU5URVI6ICdtb3VzZWVudGVyJyArIEVWRU5UX0tFWSxcbiAgICAgIE1PVVNFTEVBVkU6ICdtb3VzZWxlYXZlJyArIEVWRU5UX0tFWSxcbiAgICAgIExPQURfREFUQV9BUEk6ICdsb2FkJyArIEVWRU5UX0tFWSArIERBVEFfQVBJX0tFWSxcbiAgICAgIENMSUNLX0RBVEFfQVBJOiAnY2xpY2snICsgRVZFTlRfS0VZICsgREFUQV9BUElfS0VZXG4gICAgfTtcblxuICAgIHZhciBDbGFzc05hbWUgPSB7XG4gICAgICBDQVJPVVNFTDogJ2Nhcm91c2VsJyxcbiAgICAgIEFDVElWRTogJ2FjdGl2ZScsXG4gICAgICBTTElERTogJ3NsaWRlJyxcbiAgICAgIFJJR0hUOiAncmlnaHQnLFxuICAgICAgTEVGVDogJ2xlZnQnLFxuICAgICAgSVRFTTogJ2Nhcm91c2VsLWl0ZW0nXG4gICAgfTtcblxuICAgIHZhciBTZWxlY3RvciA9IHtcbiAgICAgIEFDVElWRTogJy5hY3RpdmUnLFxuICAgICAgQUNUSVZFX0lURU06ICcuYWN0aXZlLmNhcm91c2VsLWl0ZW0nLFxuICAgICAgSVRFTTogJy5jYXJvdXNlbC1pdGVtJyxcbiAgICAgIE5FWFRfUFJFVjogJy5uZXh0LCAucHJldicsXG4gICAgICBJTkRJQ0FUT1JTOiAnLmNhcm91c2VsLWluZGljYXRvcnMnLFxuICAgICAgREFUQV9TTElERTogJ1tkYXRhLXNsaWRlXSwgW2RhdGEtc2xpZGUtdG9dJyxcbiAgICAgIERBVEFfUklERTogJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXSdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgdmFyIENhcm91c2VsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZ1bmN0aW9uIENhcm91c2VsKGVsZW1lbnQsIGNvbmZpZykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2Fyb3VzZWwpO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gbnVsbDtcbiAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jb25maWcgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9ICQoZWxlbWVudClbMF07XG4gICAgICAgIHRoaXMuX2luZGljYXRvcnNFbGVtZW50ID0gJCh0aGlzLl9lbGVtZW50KS5maW5kKFNlbGVjdG9yLklORElDQVRPUlMpWzBdO1xuXG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKi9cblxuICAgICAgLy8gZ2V0dGVyc1xuXG4gICAgICBfY3JlYXRlQ2xhc3MoQ2Fyb3VzZWwsIFt7XG4gICAgICAgIGtleTogJ25leHQnLFxuXG4gICAgICAgIC8vIHB1YmxpY1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIGlmICghdGhpcy5faXNTbGlkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9zbGlkZShEaXJlY3Rpb24uTkVYVCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ25leHRXaGVuVmlzaWJsZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0V2hlblZpc2libGUoKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2FsbCBuZXh0IHdoZW4gdGhlIHBhZ2UgaXNuJ3QgdmlzaWJsZVxuICAgICAgICAgIGlmICghZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAncHJldicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2KCkge1xuICAgICAgICAgIGlmICghdGhpcy5faXNTbGlkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9zbGlkZShEaXJlY3Rpb24uUFJFVklPVVMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdwYXVzZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwYXVzZShldmVudCkge1xuICAgICAgICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJCh0aGlzLl9lbGVtZW50KS5maW5kKFNlbGVjdG9yLk5FWFRfUFJFVilbMF0gJiYgX1V0aWxbJ2RlZmF1bHQnXS5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSkge1xuICAgICAgICAgICAgX1V0aWxbJ2RlZmF1bHQnXS50cmlnZ2VyVHJhbnNpdGlvbkVuZCh0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMuY3ljbGUodHJ1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbCk7XG4gICAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2N5Y2xlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGN5Y2xlKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5faW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpO1xuICAgICAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLl9jb25maWcuaW50ZXJ2YWwgJiYgIXRoaXMuX2lzUGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHNldEludGVydmFsKCQucHJveHkoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID8gdGhpcy5uZXh0V2hlblZpc2libGUgOiB0aGlzLm5leHQsIHRoaXMpLCB0aGlzLl9jb25maWcuaW50ZXJ2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd0bycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0byhpbmRleCkge1xuICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gJCh0aGlzLl9lbGVtZW50KS5maW5kKFNlbGVjdG9yLkFDVElWRV9JVEVNKVswXTtcblxuICAgICAgICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleCh0aGlzLl9hY3RpdmVFbGVtZW50KTtcblxuICAgICAgICAgIGlmIChpbmRleCA+IHRoaXMuX2l0ZW1zLmxlbmd0aCAtIDEgfHwgaW5kZXggPCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbmUoRXZlbnQuU0xJRCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMudG8oaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFjdGl2ZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5jeWNsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBpbmRleCA+IGFjdGl2ZUluZGV4ID8gRGlyZWN0aW9uLk5FWFQgOiBEaXJlY3Rpb24uUFJFVklPVVM7XG5cbiAgICAgICAgICB0aGlzLl9zbGlkZShkaXJlY3Rpb24sIHRoaXMuX2l0ZW1zW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGlzcG9zZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwb3NlKCkge1xuICAgICAgICAgICQodGhpcy5fZWxlbWVudCkub2ZmKEVWRU5UX0tFWSk7XG4gICAgICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZKTtcblxuICAgICAgICAgIHRoaXMuX2l0ZW1zID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jb25maWcgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2ludGVydmFsID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcml2YXRlXG5cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2dldENvbmZpZycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICAgIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBEZWZhdWx0LCBjb25maWcpO1xuICAgICAgICAgIF9VdGlsWydkZWZhdWx0J10udHlwZUNoZWNrQ29uZmlnKE5BTUUsIGNvbmZpZywgRGVmYXVsdFR5cGUpO1xuICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2FkZEV2ZW50TGlzdGVuZXJzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgICBpZiAodGhpcy5fY29uZmlnLmtleWJvYXJkKSB7XG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LktFWURPV04sICQucHJveHkodGhpcy5fa2V5ZG93biwgdGhpcykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLl9jb25maWcucGF1c2UgPT09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50Lk1PVVNFRU5URVIsICQucHJveHkodGhpcy5wYXVzZSwgdGhpcykpLm9uKEV2ZW50Lk1PVVNFTEVBVkUsICQucHJveHkodGhpcy5jeWNsZSwgdGhpcykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfa2V5ZG93bicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfa2V5ZG93bihldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICB0aGlzLnByZXYoKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgIHRoaXMubmV4dCgpO2JyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0SXRlbUluZGV4JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRJdGVtSW5kZXgoZWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuX2l0ZW1zID0gJC5tYWtlQXJyYXkoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKFNlbGVjdG9yLklURU0pKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMuaW5kZXhPZihlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0SXRlbUJ5RGlyZWN0aW9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRJdGVtQnlEaXJlY3Rpb24oZGlyZWN0aW9uLCBhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgdmFyIGlzTmV4dERpcmVjdGlvbiA9IGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLk5FWFQ7XG4gICAgICAgICAgdmFyIGlzUHJldkRpcmVjdGlvbiA9IGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlBSRVZJT1VTO1xuICAgICAgICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChhY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICB2YXIgbGFzdEl0ZW1JbmRleCA9IHRoaXMuX2l0ZW1zLmxlbmd0aCAtIDE7XG4gICAgICAgICAgdmFyIGlzR29pbmdUb1dyYXAgPSBpc1ByZXZEaXJlY3Rpb24gJiYgYWN0aXZlSW5kZXggPT09IDAgfHwgaXNOZXh0RGlyZWN0aW9uICYmIGFjdGl2ZUluZGV4ID09PSBsYXN0SXRlbUluZGV4O1xuXG4gICAgICAgICAgaWYgKGlzR29pbmdUb1dyYXAgJiYgIXRoaXMuX2NvbmZpZy53cmFwKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT09IERpcmVjdGlvbi5QUkVWSU9VUyA/IC0xIDogMTtcbiAgICAgICAgICB2YXIgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy5faXRlbXMubGVuZ3RoO1xuXG4gICAgICAgICAgcmV0dXJuIGl0ZW1JbmRleCA9PT0gLTEgPyB0aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGggLSAxXSA6IHRoaXMuX2l0ZW1zW2l0ZW1JbmRleF07XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX3RyaWdnZXJTbGlkZUV2ZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF90cmlnZ2VyU2xpZGVFdmVudChyZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb25hbENsYXNzbmFtZSkge1xuICAgICAgICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudChFdmVudC5TTElERSwge1xuICAgICAgICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uYWxDbGFzc25hbWVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihzbGlkZUV2ZW50KTtcblxuICAgICAgICAgIHJldHVybiBzbGlkZUV2ZW50O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ19zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICBpZiAodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpIHtcbiAgICAgICAgICAgICQodGhpcy5faW5kaWNhdG9yc0VsZW1lbnQpLmZpbmQoU2VsZWN0b3IuQUNUSVZFKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQUNUSVZFKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJbmRpY2F0b3IgPSB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudC5jaGlsZHJlblt0aGlzLl9nZXRJdGVtSW5kZXgoZWxlbWVudCldO1xuXG4gICAgICAgICAgICBpZiAobmV4dEluZGljYXRvcikge1xuICAgICAgICAgICAgICAkKG5leHRJbmRpY2F0b3IpLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfc2xpZGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3NsaWRlKGRpcmVjdGlvbiwgZWxlbWVudCkge1xuICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgdmFyIGFjdGl2ZUVsZW1lbnQgPSAkKHRoaXMuX2VsZW1lbnQpLmZpbmQoU2VsZWN0b3IuQUNUSVZFX0lURU0pWzBdO1xuICAgICAgICAgIHZhciBuZXh0RWxlbWVudCA9IGVsZW1lbnQgfHwgYWN0aXZlRWxlbWVudCAmJiB0aGlzLl9nZXRJdGVtQnlEaXJlY3Rpb24oZGlyZWN0aW9uLCBhY3RpdmVFbGVtZW50KTtcblxuICAgICAgICAgIHZhciBpc0N5Y2xpbmcgPSBCb29sZWFuKHRoaXMuX2ludGVydmFsKTtcblxuICAgICAgICAgIHZhciBkaXJlY3Rpb25hbENsYXNzTmFtZSA9IGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLk5FWFQgPyBDbGFzc05hbWUuTEVGVCA6IENsYXNzTmFtZS5SSUdIVDtcblxuICAgICAgICAgIGlmIChuZXh0RWxlbWVudCAmJiAkKG5leHRFbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuQUNUSVZFKSkge1xuICAgICAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHNsaWRlRXZlbnQgPSB0aGlzLl90cmlnZ2VyU2xpZGVFdmVudChuZXh0RWxlbWVudCwgZGlyZWN0aW9uYWxDbGFzc05hbWUpO1xuICAgICAgICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFhY3RpdmVFbGVtZW50IHx8ICFuZXh0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gc29tZSB3ZWlyZG5lc3MgaXMgaGFwcGVuaW5nLCBzbyB3ZSBiYWlsXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChpc0N5Y2xpbmcpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KG5leHRFbGVtZW50KTtcblxuICAgICAgICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KEV2ZW50LlNMSUQsIHtcbiAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IG5leHRFbGVtZW50LFxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25hbENsYXNzTmFtZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKF9VdGlsWydkZWZhdWx0J10uc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkgJiYgJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuU0xJREUpKSB7XG5cbiAgICAgICAgICAgICQobmV4dEVsZW1lbnQpLmFkZENsYXNzKGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgIF9VdGlsWydkZWZhdWx0J10ucmVmbG93KG5leHRFbGVtZW50KTtcblxuICAgICAgICAgICAgJChhY3RpdmVFbGVtZW50KS5hZGRDbGFzcyhkaXJlY3Rpb25hbENsYXNzTmFtZSk7XG4gICAgICAgICAgICAkKG5leHRFbGVtZW50KS5hZGRDbGFzcyhkaXJlY3Rpb25hbENsYXNzTmFtZSk7XG5cbiAgICAgICAgICAgICQoYWN0aXZlRWxlbWVudCkub25lKF9VdGlsWydkZWZhdWx0J10uVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJChuZXh0RWxlbWVudCkucmVtb3ZlQ2xhc3MoZGlyZWN0aW9uYWxDbGFzc05hbWUpLnJlbW92ZUNsYXNzKGRpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgJChuZXh0RWxlbWVudCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSk7XG5cbiAgICAgICAgICAgICAgJChhY3RpdmVFbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQUNUSVZFKS5yZW1vdmVDbGFzcyhkaXJlY3Rpb24pLnJlbW92ZUNsYXNzKGRpcmVjdGlvbmFsQ2xhc3NOYW1lKTtcblxuICAgICAgICAgICAgICBfdGhpczIuX2lzU2xpZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkKF90aGlzMi5fZWxlbWVudCkudHJpZ2dlcihzbGlkRXZlbnQpO1xuICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRSQU5TSVRJT05fRFVSQVRJT04pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKGFjdGl2ZUVsZW1lbnQpLnJlbW92ZUNsYXNzKENsYXNzTmFtZS5BQ1RJVkUpO1xuICAgICAgICAgICAgJChuZXh0RWxlbWVudCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHNsaWRFdmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzQ3ljbGluZykge1xuICAgICAgICAgICAgdGhpcy5jeWNsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0YXRpY1xuXG4gICAgICB9XSwgW3tcbiAgICAgICAga2V5OiAnX2pRdWVyeUludGVyZmFjZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkpO1xuICAgICAgICAgICAgdmFyIF9jb25maWcgPSAkLmV4dGVuZCh7fSwgRGVmYXVsdCwgJCh0aGlzKS5kYXRhKCkpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgJC5leHRlbmQoX2NvbmZpZywgY29uZmlnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnID8gY29uZmlnIDogX2NvbmZpZy5zbGlkZTtcblxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgX2NvbmZpZyk7XG4gICAgICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSwgZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICBkYXRhLnRvKGNvbmZpZyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGlmIChkYXRhW2FjdGlvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbWV0aG9kIG5hbWVkIFwiJyArIGFjdGlvbiArICdcIicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRhdGFbYWN0aW9uXSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfY29uZmlnLmludGVydmFsKSB7XG4gICAgICAgICAgICAgIGRhdGEucGF1c2UoKTtcbiAgICAgICAgICAgICAgZGF0YS5jeWNsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ19kYXRhQXBpQ2xpY2tIYW5kbGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kYXRhQXBpQ2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIHNlbGVjdG9yID0gX1V0aWxbJ2RlZmF1bHQnXS5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMpO1xuXG4gICAgICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHNlbGVjdG9yKVswXTtcblxuICAgICAgICAgIGlmICghdGFyZ2V0IHx8ICEkKHRhcmdldCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkNBUk9VU0VMKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwgJCh0YXJnZXQpLmRhdGEoKSwgJCh0aGlzKS5kYXRhKCkpO1xuICAgICAgICAgIHZhciBzbGlkZUluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUtdG8nKTtcblxuICAgICAgICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICAgICAgICBjb25maWcuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJCh0YXJnZXQpLCBjb25maWcpO1xuXG4gICAgICAgICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICAgICAgICQodGFyZ2V0KS5kYXRhKERBVEFfS0VZKS50byhzbGlkZUluZGV4KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ1ZFUlNJT04nLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gVkVSU0lPTjtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdEZWZhdWx0JyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIERlZmF1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcblxuICAgICAgcmV0dXJuIENhcm91c2VsO1xuICAgIH0pKCk7XG5cbiAgICAkKGRvY3VtZW50KS5vbihFdmVudC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9TTElERSwgQ2Fyb3VzZWwuX2RhdGFBcGlDbGlja0hhbmRsZXIpO1xuXG4gICAgJCh3aW5kb3cpLm9uKEV2ZW50LkxPQURfREFUQV9BUEksIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoU2VsZWN0b3IuREFUQV9SSURFKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRjYXJvdXNlbCA9ICQodGhpcyk7XG4gICAgICAgIENhcm91c2VsLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBqUXVlcnlcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cblxuICAgICQuZm5bTkFNRV0gPSBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlO1xuICAgICQuZm5bTkFNRV0uQ29uc3RydWN0b3IgPSBDYXJvdXNlbDtcbiAgICAkLmZuW05BTUVdLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkLmZuW05BTUVdID0gSlFVRVJZX05PX0NPTkZMSUNUO1xuICAgICAgcmV0dXJuIENhcm91c2VsLl9qUXVlcnlJbnRlcmZhY2U7XG4gICAgfTtcblxuICAgIHJldHVybiBDYXJvdXNlbDtcbiAgfSkoalF1ZXJ5KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IENhcm91c2VsO1xufSk7XG4iXX0=