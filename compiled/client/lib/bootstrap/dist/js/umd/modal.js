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
    global.modal = mod.exports;
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
   * Bootstrap (v4.0.0-alpha.2): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Modal = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'modal';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.modal';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];
    var TRANSITION_DURATION = 300;
    var BACKDROP_TRANSITION_DURATION = 150;

    var Default = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true
    };

    var DefaultType = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      focus: 'boolean',
      show: 'boolean'
    };

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      FOCUSIN: 'focusin' + EVENT_KEY,
      RESIZE: 'resize' + EVENT_KEY,
      CLICK_DISMISS: 'click.dismiss' + EVENT_KEY,
      KEYDOWN_DISMISS: 'keydown.dismiss' + EVENT_KEY,
      MOUSEUP_DISMISS: 'mouseup.dismiss' + EVENT_KEY,
      MOUSEDOWN_DISMISS: 'mousedown.dismiss' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
      BACKDROP: 'modal-backdrop',
      OPEN: 'modal-open',
      FADE: 'fade',
      IN: 'in'
    };

    var Selector = {
      DIALOG: '.modal-dialog',
      DATA_TOGGLE: '[data-toggle="modal"]',
      DATA_DISMISS: '[data-dismiss="modal"]',
      FIXED_CONTENT: '.navbar-fixed-top, .navbar-fixed-bottom, .is-fixed'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Modal = function () {
      function Modal(element, config) {
        _classCallCheck(this, Modal);

        this._config = this._getConfig(config);
        this._element = element;
        this._dialog = $(element).find(Selector.DIALOG)[0];
        this._backdrop = null;
        this._isShown = false;
        this._isBodyOverflowing = false;
        this._ignoreBackdropClick = false;
        this._originalBodyPadding = 0;
        this._scrollbarWidth = 0;
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Modal, [{
        key: 'toggle',

        // public

        value: function toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }
      }, {
        key: 'show',
        value: function show(relatedTarget) {
          var _this = this;

          var showEvent = $.Event(Event.SHOW, {
            relatedTarget: relatedTarget
          });

          $(this._element).trigger(showEvent);

          if (this._isShown || showEvent.isDefaultPrevented()) {
            return;
          }

          this._isShown = true;

          this._checkScrollbar();
          this._setScrollbar();

          $(document.body).addClass(ClassName.OPEN);

          this._setEscapeEvent();
          this._setResizeEvent();

          $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, $.proxy(this.hide, this));

          $(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
            $(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
              if ($(event.target).is(_this._element)) {
                _this._ignoreBackdropClick = true;
              }
            });
          });

          this._showBackdrop($.proxy(this._showElement, this, relatedTarget));
        }
      }, {
        key: 'hide',
        value: function hide(event) {
          if (event) {
            event.preventDefault();
          }

          var hideEvent = $.Event(Event.HIDE);

          $(this._element).trigger(hideEvent);

          if (!this._isShown || hideEvent.isDefaultPrevented()) {
            return;
          }

          this._isShown = false;

          this._setEscapeEvent();
          this._setResizeEvent();

          $(document).off(Event.FOCUSIN);

          $(this._element).removeClass(ClassName.IN);

          $(this._element).off(Event.CLICK_DISMISS);
          $(this._dialog).off(Event.MOUSEDOWN_DISMISS);

          if (_Util['default'].supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {

            $(this._element).one(_Util['default'].TRANSITION_END, $.proxy(this._hideModal, this)).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            this._hideModal();
          }
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          $.removeData(this._element, DATA_KEY);

          $(window).off(EVENT_KEY);
          $(document).off(EVENT_KEY);
          $(this._element).off(EVENT_KEY);
          $(this._backdrop).off(EVENT_KEY);

          this._config = null;
          this._element = null;
          this._dialog = null;
          this._backdrop = null;
          this._isShown = null;
          this._isBodyOverflowing = null;
          this._ignoreBackdropClick = null;
          this._originalBodyPadding = null;
          this._scrollbarWidth = null;
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
        key: '_showElement',
        value: function _showElement(relatedTarget) {
          var _this2 = this;

          var transition = _Util['default'].supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

          if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
            // don't move modals dom position
            document.body.appendChild(this._element);
          }

          this._element.style.display = 'block';
          this._element.scrollTop = 0;

          if (transition) {
            _Util['default'].reflow(this._element);
          }

          $(this._element).addClass(ClassName.IN);

          if (this._config.focus) {
            this._enforceFocus();
          }

          var shownEvent = $.Event(Event.SHOWN, {
            relatedTarget: relatedTarget
          });

          var transitionComplete = function transitionComplete() {
            if (_this2._config.focus) {
              _this2._element.focus();
            }
            $(_this2._element).trigger(shownEvent);
          };

          if (transition) {
            $(this._dialog).one(_Util['default'].TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
          } else {
            transitionComplete();
          }
        }
      }, {
        key: '_enforceFocus',
        value: function _enforceFocus() {
          var _this3 = this;

          $(document).off(Event.FOCUSIN) // guard against infinite focus loop
          .on(Event.FOCUSIN, function (event) {
            if (_this3._element !== event.target && !$(_this3._element).has(event.target).length) {
              _this3._element.focus();
            }
          });
        }
      }, {
        key: '_setEscapeEvent',
        value: function _setEscapeEvent() {
          var _this4 = this;

          if (this._isShown && this._config.keyboard) {
            $(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
              if (event.which === 27) {
                _this4.hide();
              }
            });
          } else if (!this._isShown) {
            $(this._element).off(Event.KEYDOWN_DISMISS);
          }
        }
      }, {
        key: '_setResizeEvent',
        value: function _setResizeEvent() {
          if (this._isShown) {
            $(window).on(Event.RESIZE, $.proxy(this._handleUpdate, this));
          } else {
            $(window).off(Event.RESIZE);
          }
        }
      }, {
        key: '_hideModal',
        value: function _hideModal() {
          var _this5 = this;

          this._element.style.display = 'none';
          this._showBackdrop(function () {
            $(document.body).removeClass(ClassName.OPEN);
            _this5._resetAdjustments();
            _this5._resetScrollbar();
            $(_this5._element).trigger(Event.HIDDEN);
          });
        }
      }, {
        key: '_removeBackdrop',
        value: function _removeBackdrop() {
          if (this._backdrop) {
            $(this._backdrop).remove();
            this._backdrop = null;
          }
        }
      }, {
        key: '_showBackdrop',
        value: function _showBackdrop(callback) {
          var _this6 = this;

          var animate = $(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

          if (this._isShown && this._config.backdrop) {
            var doAnimate = _Util['default'].supportsTransitionEnd() && animate;

            this._backdrop = document.createElement('div');
            this._backdrop.className = ClassName.BACKDROP;

            if (animate) {
              $(this._backdrop).addClass(animate);
            }

            $(this._backdrop).appendTo(document.body);

            $(this._element).on(Event.CLICK_DISMISS, function (event) {
              if (_this6._ignoreBackdropClick) {
                _this6._ignoreBackdropClick = false;
                return;
              }
              if (event.target !== event.currentTarget) {
                return;
              }
              if (_this6._config.backdrop === 'static') {
                _this6._element.focus();
              } else {
                _this6.hide();
              }
            });

            if (doAnimate) {
              _Util['default'].reflow(this._backdrop);
            }

            $(this._backdrop).addClass(ClassName.IN);

            if (!callback) {
              return;
            }

            if (!doAnimate) {
              callback();
              return;
            }

            $(this._backdrop).one(_Util['default'].TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
          } else if (!this._isShown && this._backdrop) {
            $(this._backdrop).removeClass(ClassName.IN);

            var callbackRemove = function callbackRemove() {
              _this6._removeBackdrop();
              if (callback) {
                callback();
              }
            };

            if (_Util['default'].supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
              $(this._backdrop).one(_Util['default'].TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
            } else {
              callbackRemove();
            }
          } else if (callback) {
            callback();
          }
        }

        // ----------------------------------------------------------------------
        // the following methods are used to handle overflowing modals
        // todo (fat): these should probably be refactored out of modal.js
        // ----------------------------------------------------------------------

      }, {
        key: '_handleUpdate',
        value: function _handleUpdate() {
          this._adjustDialog();
        }
      }, {
        key: '_adjustDialog',
        value: function _adjustDialog() {
          var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

          if (!this._isBodyOverflowing && isModalOverflowing) {
            this._element.style.paddingLeft = this._scrollbarWidth + 'px';
          }

          if (this._isBodyOverflowing && !isModalOverflowing) {
            this._element.style.paddingRight = this._scrollbarWidth + 'px~';
          }
        }
      }, {
        key: '_resetAdjustments',
        value: function _resetAdjustments() {
          this._element.style.paddingLeft = '';
          this._element.style.paddingRight = '';
        }
      }, {
        key: '_checkScrollbar',
        value: function _checkScrollbar() {
          var fullWindowWidth = window.innerWidth;
          if (!fullWindowWidth) {
            // workaround for missing window.innerWidth in IE8
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
          }
          this._isBodyOverflowing = document.body.clientWidth < fullWindowWidth;
          this._scrollbarWidth = this._getScrollbarWidth();
        }
      }, {
        key: '_setScrollbar',
        value: function _setScrollbar() {
          var bodyPadding = parseInt($(Selector.FIXED_CONTENT).css('padding-right') || 0, 10);

          this._originalBodyPadding = document.body.style.paddingRight || '';

          if (this._isBodyOverflowing) {
            document.body.style.paddingRight = bodyPadding + this._scrollbarWidth + 'px';
          }
        }
      }, {
        key: '_resetScrollbar',
        value: function _resetScrollbar() {
          document.body.style.paddingRight = this._originalBodyPadding;
        }
      }, {
        key: '_getScrollbarWidth',
        value: function _getScrollbarWidth() {
          // thx d.walsh
          var scrollDiv = document.createElement('div');
          scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
          document.body.appendChild(scrollDiv);
          var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config, relatedTarget) {
          return this.each(function () {
            var data = $(this).data(DATA_KEY);
            var _config = $.extend({}, Modal.Default, $(this).data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

            if (!data) {
              data = new Modal(this, _config);
              $(this).data(DATA_KEY, data);
            }

            if (typeof config === 'string') {
              if (data[config] === undefined) {
                throw new Error('No method named "' + config + '"');
              }
              data[config](relatedTarget);
            } else if (_config.show) {
              data.show(relatedTarget);
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
      }]);

      return Modal;
    }();

    $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      var _this7 = this;

      var target = undefined;
      var selector = _Util['default'].getSelectorFromElement(this);

      if (selector) {
        target = $(selector)[0];
      }

      var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

      if (this.tagName === 'A') {
        event.preventDefault();
      }

      var $target = $(target).one(Event.SHOW, function (showEvent) {
        if (showEvent.isDefaultPrevented()) {
          // only register focus restorer if modal will actually get shown
          return;
        }

        $target.one(Event.HIDDEN, function () {
          if ($(_this7).is(':visible')) {
            _this7.focus();
          }
        });
      });

      Modal._jQueryInterface.call($(target), config, this);
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Modal._jQueryInterface;
    $.fn[NAME].Constructor = Modal;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Modal._jQueryInterface;
    };

    return Modal;
  }(jQuery);

  module.exports = Modal;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL21vZGFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxDQUFDLFVBQVUsTUFBVixFQUFrQixPQUFsQixFQUEyQjtBQUMxQixNQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzlDLFdBQU8sQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixRQUF0QixDQUFQLEVBQXdDLE9BQXhDO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sTUFBUCxLQUFrQixXQUF4RCxFQUFxRTtBQUMxRSxZQUFRLE9BQVIsRUFBaUIsTUFBakIsRUFBeUIsUUFBUSxRQUFSLENBQXpCO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsUUFBSSxNQUFNO0FBQ1IsZUFBUztBQURELEtBQVY7QUFHQSxZQUFRLElBQUksT0FBWixFQUFxQixHQUFyQixFQUEwQixPQUFPLElBQWpDO0FBQ0EsV0FBTyxLQUFQLEdBQWUsSUFBSSxPQUFuQjtBQUNEO0FBQ0YsQ0FaRCxhQVlTLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQixLQUEzQixFQUFrQztBQUN6Qzs7QUFFQSxNQUFJLGVBQWdCLFlBQVk7QUFBRSxhQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxZQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCLENBQTJCLFdBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQsQ0FBd0QsV0FBVyxZQUFYLEdBQTBCLElBQTFCLENBQWdDLElBQUksV0FBVyxVQUFmLEVBQTJCLFdBQVcsUUFBWCxHQUFzQixJQUF0QixDQUE0QixPQUFPLGNBQVAsQ0FBc0Is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QUpEO0FBS0QsT0FYYSxDQUFkOztBQWFBLFlBQU0sZ0JBQU4sQ0FBdUIsSUFBdkIsQ0FBNEIsRUFBRSxNQUFGLENBQTVCLEVBQXVDLE1BQXZDLEVBQStDLElBQS9DO0FBQ0QsS0E5QkQ7Ozs7Ozs7O0FBc0NBLE1BQUUsRUFBRixDQUFLLElBQUwsSUFBYSxNQUFNLGdCQUFuQjtBQUNBLE1BQUUsRUFBRixDQUFLLElBQUwsRUFBVyxXQUFYLEdBQXlCLEtBQXpCO0FBQ0EsTUFBRSxFQUFGLENBQUssSUFBTCxFQUFXLFVBQVgsR0FBd0IsWUFBWTtBQUNsQyxRQUFFLEVBQUYsQ0FBSyxJQUFMLElBQWEsa0JBQWI7QUFDQSxhQUFPLE1BQU0sZ0JBQWI7QUFDRCxLQUhEOztBQUtBLFdBQU8sS0FBUDtBQUNELEdBemdCVyxDQXlnQlQsTUF6Z0JTLENBQVo7O0FBMmdCQSxTQUFPLE9BQVAsR0FBaUIsS0FBakI7QUFDRCxDQTFpQkQiLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cycsICdtb2R1bGUnLCAnLi91dGlsJ10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIGZhY3RvcnkoZXhwb3J0cywgbW9kdWxlLCByZXF1aXJlKCcuL3V0aWwnKSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZC5leHBvcnRzLCBtb2QsIGdsb2JhbC5VdGlsKTtcbiAgICBnbG9iYWwubW9kYWwgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsIG1vZHVsZSwgX3V0aWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbiAgZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG4gIHZhciBfVXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWwpO1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBCb290c3RyYXAgKHY0LjAuMC1hbHBoYS4yKTogbW9kYWwuanNcbiAgICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgdmFyIE1vZGFsID0gKGZ1bmN0aW9uICgkKSB7XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBDb25zdGFudHNcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cblxuICAgIHZhciBOQU1FID0gJ21vZGFsJztcbiAgICB2YXIgVkVSU0lPTiA9ICc0LjAuMC1hbHBoYSc7XG4gICAgdmFyIERBVEFfS0VZID0gJ2JzLm1vZGFsJztcbiAgICB2YXIgRVZFTlRfS0VZID0gJy4nICsgREFUQV9LRVk7XG4gICAgdmFyIERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknO1xuICAgIHZhciBKUVVFUllfTk9fQ09ORkxJQ1QgPSAkLmZuW05BTUVdO1xuICAgIHZhciBUUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwO1xuICAgIHZhciBCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwO1xuXG4gICAgdmFyIERlZmF1bHQgPSB7XG4gICAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgZm9jdXM6IHRydWUsXG4gICAgICBzaG93OiB0cnVlXG4gICAgfTtcblxuICAgIHZhciBEZWZhdWx0VHlwZSA9IHtcbiAgICAgIGJhY2tkcm9wOiAnKGJvb2xlYW58c3RyaW5nKScsXG4gICAgICBrZXlib2FyZDogJ2Jvb2xlYW4nLFxuICAgICAgZm9jdXM6ICdib29sZWFuJyxcbiAgICAgIHNob3c6ICdib29sZWFuJ1xuICAgIH07XG5cbiAgICB2YXIgRXZlbnQgPSB7XG4gICAgICBISURFOiAnaGlkZScgKyBFVkVOVF9LRVksXG4gICAgICBISURERU46ICdoaWRkZW4nICsgRVZFTlRfS0VZLFxuICAgICAgU0hPVzogJ3Nob3cnICsgRVZFTlRfS0VZLFxuICAgICAgU0hPV046ICdzaG93bicgKyBFVkVOVF9LRVksXG4gICAgICBGT0NVU0lOOiAnZm9jdXNpbicgKyBFVkVOVF9LRVksXG4gICAgICBSRVNJWkU6ICdyZXNpemUnICsgRVZFTlRfS0VZLFxuICAgICAgQ0xJQ0tfRElTTUlTUzogJ2NsaWNrLmRpc21pc3MnICsgRVZFTlRfS0VZLFxuICAgICAgS0VZRE9XTl9ESVNNSVNTOiAna2V5ZG93bi5kaXNtaXNzJyArIEVWRU5UX0tFWSxcbiAgICAgIE1PVVNFVVBfRElTTUlTUzogJ21vdXNldXAuZGlzbWlzcycgKyBFVkVOVF9LRVksXG4gICAgICBNT1VTRURPV05fRElTTUlTUzogJ21vdXNlZG93bi5kaXNtaXNzJyArIEVWRU5UX0tFWSxcbiAgICAgIENMSUNLX0RBVEFfQVBJOiAnY2xpY2snICsgRVZFTlRfS0VZICsgREFUQV9BUElfS0VZXG4gICAgfTtcblxuICAgIHZhciBDbGFzc05hbWUgPSB7XG4gICAgICBTQ1JPTExCQVJfTUVBU1VSRVI6ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZScsXG4gICAgICBCQUNLRFJPUDogJ21vZGFsLWJhY2tkcm9wJyxcbiAgICAgIE9QRU46ICdtb2RhbC1vcGVuJyxcbiAgICAgIEZBREU6ICdmYWRlJyxcbiAgICAgIElOOiAnaW4nXG4gICAgfTtcblxuICAgIHZhciBTZWxlY3RvciA9IHtcbiAgICAgIERJQUxPRzogJy5tb2RhbC1kaWFsb2cnLFxuICAgICAgREFUQV9UT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsXG4gICAgICBEQVRBX0RJU01JU1M6ICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLFxuICAgICAgRklYRURfQ09OVEVOVDogJy5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICB2YXIgTW9kYWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZnVuY3Rpb24gTW9kYWwoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb2RhbCk7XG5cbiAgICAgICAgdGhpcy5fY29uZmlnID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLl9kaWFsb2cgPSAkKGVsZW1lbnQpLmZpbmQoU2VsZWN0b3IuRElBTE9HKVswXTtcbiAgICAgICAgdGhpcy5fYmFja2Ryb3AgPSBudWxsO1xuICAgICAgICB0aGlzLl9pc1Nob3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lzQm9keU92ZXJmbG93aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZyA9IDA7XG4gICAgICAgIHRoaXMuX3Njcm9sbGJhcldpZHRoID0gMDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAqL1xuXG4gICAgICAvLyBnZXR0ZXJzXG5cbiAgICAgIF9jcmVhdGVDbGFzcyhNb2RhbCwgW3tcbiAgICAgICAga2V5OiAndG9nZ2xlJyxcblxuICAgICAgICAvLyBwdWJsaWNcblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlKHJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5faXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KHJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3Nob3cnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdyhyZWxhdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KEV2ZW50LlNIT1csIHtcbiAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihzaG93RXZlbnQpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2lzU2hvd24gfHwgc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5faXNTaG93biA9IHRydWU7XG5cbiAgICAgICAgICB0aGlzLl9jaGVja1Njcm9sbGJhcigpO1xuICAgICAgICAgIHRoaXMuX3NldFNjcm9sbGJhcigpO1xuXG4gICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhDbGFzc05hbWUuT1BFTik7XG5cbiAgICAgICAgICB0aGlzLl9zZXRFc2NhcGVFdmVudCgpO1xuICAgICAgICAgIHRoaXMuX3NldFJlc2l6ZUV2ZW50KCk7XG5cbiAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LkNMSUNLX0RJU01JU1MsIFNlbGVjdG9yLkRBVEFfRElTTUlTUywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKTtcblxuICAgICAgICAgICQodGhpcy5fZGlhbG9nKS5vbihFdmVudC5NT1VTRURPV05fRElTTUlTUywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChfdGhpcy5fZWxlbWVudCkub25lKEV2ZW50Lk1PVVNFVVBfRElTTUlTUywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaXMoX3RoaXMuX2VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuX3Nob3dCYWNrZHJvcCgkLnByb3h5KHRoaXMuX3Nob3dFbGVtZW50LCB0aGlzLCByZWxhdGVkVGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGlkZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoaWRlKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KEV2ZW50LkhJREUpO1xuXG4gICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKGhpZGVFdmVudCk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzU2hvd24gfHwgaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5faXNTaG93biA9IGZhbHNlO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXNjYXBlRXZlbnQoKTtcbiAgICAgICAgICB0aGlzLl9zZXRSZXNpemVFdmVudCgpO1xuXG4gICAgICAgICAgJChkb2N1bWVudCkub2ZmKEV2ZW50LkZPQ1VTSU4pO1xuXG4gICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuSU4pO1xuXG4gICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRXZlbnQuQ0xJQ0tfRElTTUlTUyk7XG4gICAgICAgICAgJCh0aGlzLl9kaWFsb2cpLm9mZihFdmVudC5NT1VTRURPV05fRElTTUlTUyk7XG5cbiAgICAgICAgICBpZiAoX1V0aWxbJ2RlZmF1bHQnXS5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJiAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5GQURFKSkge1xuXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uZShfVXRpbFsnZGVmYXVsdCddLlRSQU5TSVRJT05fRU5ELCAkLnByb3h5KHRoaXMuX2hpZGVNb2RhbCwgdGhpcykpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRSQU5TSVRJT05fRFVSQVRJT04pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9oaWRlTW9kYWwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGlzcG9zZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwb3NlKCkge1xuICAgICAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSk7XG5cbiAgICAgICAgICAkKHdpbmRvdykub2ZmKEVWRU5UX0tFWSk7XG4gICAgICAgICAgJChkb2N1bWVudCkub2ZmKEVWRU5UX0tFWSk7XG4gICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRVZFTlRfS0VZKTtcbiAgICAgICAgICAkKHRoaXMuX2JhY2tkcm9wKS5vZmYoRVZFTlRfS0VZKTtcblxuICAgICAgICAgIHRoaXMuX2NvbmZpZyA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fZGlhbG9nID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9iYWNrZHJvcCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5faXNTaG93biA9IG51bGw7XG4gICAgICAgICAgdGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2lnbm9yZUJhY2tkcm9wQ2xpY2sgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX29yaWdpbmFsQm9keVBhZGRpbmcgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX3Njcm9sbGJhcldpZHRoID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByaXZhdGVcblxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0Q29uZmlnJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9nZXRDb25maWcoY29uZmlnKSB7XG4gICAgICAgICAgY29uZmlnID0gJC5leHRlbmQoe30sIERlZmF1bHQsIGNvbmZpZyk7XG4gICAgICAgICAgX1V0aWxbJ2RlZmF1bHQnXS50eXBlQ2hlY2tDb25maWcoTkFNRSwgY29uZmlnLCBEZWZhdWx0VHlwZSk7XG4gICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfc2hvd0VsZW1lbnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3Nob3dFbGVtZW50KHJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gX1V0aWxbJ2RlZmF1bHQnXS5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJiAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5GQURFKTtcblxuICAgICAgICAgIGlmICghdGhpcy5fZWxlbWVudC5wYXJlbnROb2RlIHx8IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc2Nyb2xsVG9wID0gMDtcblxuICAgICAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICBfVXRpbFsnZGVmYXVsdCddLnJlZmxvdyh0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLmFkZENsYXNzKENsYXNzTmFtZS5JTik7XG5cbiAgICAgICAgICBpZiAodGhpcy5fY29uZmlnLmZvY3VzKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmZvcmNlRm9jdXMoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2hvd25FdmVudCA9ICQuRXZlbnQoRXZlbnQuU0hPV04sIHtcbiAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciB0cmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiB0cmFuc2l0aW9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMyLl9jb25maWcuZm9jdXMpIHtcbiAgICAgICAgICAgICAgX3RoaXMyLl9lbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKF90aGlzMi5fZWxlbWVudCkudHJpZ2dlcihzaG93bkV2ZW50KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICQodGhpcy5fZGlhbG9nKS5vbmUoX1V0aWxbJ2RlZmF1bHQnXS5UUkFOU0lUSU9OX0VORCwgdHJhbnNpdGlvbkNvbXBsZXRlKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChUUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ19lbmZvcmNlRm9jdXMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2VuZm9yY2VGb2N1cygpIHtcbiAgICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICAgICQoZG9jdW1lbnQpLm9mZihFdmVudC5GT0NVU0lOKSAvLyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGZvY3VzIGxvb3BcbiAgICAgICAgICAub24oRXZlbnQuRk9DVVNJTiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMzLl9lbGVtZW50ICE9PSBldmVudC50YXJnZXQgJiYgISQoX3RoaXMzLl9lbGVtZW50KS5oYXMoZXZlbnQudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgX3RoaXMzLl9lbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX3NldEVzY2FwZUV2ZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRFc2NhcGVFdmVudCgpIHtcbiAgICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICAgIGlmICh0aGlzLl9pc1Nob3duICYmIHRoaXMuX2NvbmZpZy5rZXlib2FyZCkge1xuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudC5LRVlET1dOX0RJU01JU1MsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICAgICAgX3RoaXM0LmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5faXNTaG93bikge1xuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRXZlbnQuS0VZRE9XTl9ESVNNSVNTKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX3NldFJlc2l6ZUV2ZW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zZXRSZXNpemVFdmVudCgpIHtcbiAgICAgICAgICBpZiAodGhpcy5faXNTaG93bikge1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKEV2ZW50LlJFU0laRSwgJC5wcm94eSh0aGlzLl9oYW5kbGVVcGRhdGUsIHRoaXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihFdmVudC5SRVNJWkUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfaGlkZU1vZGFsJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oaWRlTW9kYWwoKSB7XG4gICAgICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgdGhpcy5fc2hvd0JhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLk9QRU4pO1xuICAgICAgICAgICAgX3RoaXM1Ll9yZXNldEFkanVzdG1lbnRzKCk7XG4gICAgICAgICAgICBfdGhpczUuX3Jlc2V0U2Nyb2xsYmFyKCk7XG4gICAgICAgICAgICAkKF90aGlzNS5fZWxlbWVudCkudHJpZ2dlcihFdmVudC5ISURERU4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ19yZW1vdmVCYWNrZHJvcCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVtb3ZlQmFja2Ryb3AoKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2JhY2tkcm9wKSB7XG4gICAgICAgICAgICAkKHRoaXMuX2JhY2tkcm9wKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tkcm9wID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX3Nob3dCYWNrZHJvcCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2hvd0JhY2tkcm9wKGNhbGxiYWNrKSB7XG4gICAgICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgYW5pbWF0ZSA9ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkZBREUpID8gQ2xhc3NOYW1lLkZBREUgOiAnJztcblxuICAgICAgICAgIGlmICh0aGlzLl9pc1Nob3duICYmIHRoaXMuX2NvbmZpZy5iYWNrZHJvcCkge1xuICAgICAgICAgICAgdmFyIGRvQW5pbWF0ZSA9IF9VdGlsWydkZWZhdWx0J10uc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkgJiYgYW5pbWF0ZTtcblxuICAgICAgICAgICAgdGhpcy5fYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuX2JhY2tkcm9wLmNsYXNzTmFtZSA9IENsYXNzTmFtZS5CQUNLRFJPUDtcblxuICAgICAgICAgICAgaWYgKGFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MoYW5pbWF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGhpcy5fYmFja2Ryb3ApLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LkNMSUNLX0RJU01JU1MsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICBpZiAoX3RoaXM2Ll9pZ25vcmVCYWNrZHJvcENsaWNrKSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2Ll9pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5fY29uZmlnLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuICAgICAgICAgICAgICAgIF90aGlzNi5fZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzNi5oaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZG9BbmltYXRlKSB7XG4gICAgICAgICAgICAgIF9VdGlsWydkZWZhdWx0J10ucmVmbG93KHRoaXMuX2JhY2tkcm9wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLklOKTtcblxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZG9BbmltYXRlKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0aGlzLl9iYWNrZHJvcCkub25lKF9VdGlsWydkZWZhdWx0J10uVFJBTlNJVElPTl9FTkQsIGNhbGxiYWNrKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc1Nob3duICYmIHRoaXMuX2JhY2tkcm9wKSB7XG4gICAgICAgICAgICAkKHRoaXMuX2JhY2tkcm9wKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuSU4pO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiBjYWxsYmFja1JlbW92ZSgpIHtcbiAgICAgICAgICAgICAgX3RoaXM2Ll9yZW1vdmVCYWNrZHJvcCgpO1xuICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoX1V0aWxbJ2RlZmF1bHQnXS5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJiAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5GQURFKSkge1xuICAgICAgICAgICAgICAkKHRoaXMuX2JhY2tkcm9wKS5vbmUoX1V0aWxbJ2RlZmF1bHQnXS5UUkFOU0lUSU9OX0VORCwgY2FsbGJhY2tSZW1vdmUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2tSZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcbiAgICAgICAgLy8gdG9kbyAoZmF0KTogdGhlc2Ugc2hvdWxkIHByb2JhYmx5IGJlIHJlZmFjdG9yZWQgb3V0IG9mIG1vZGFsLmpzXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfaGFuZGxlVXBkYXRlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oYW5kbGVVcGRhdGUoKSB7XG4gICAgICAgICAgdGhpcy5fYWRqdXN0RGlhbG9nKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2FkanVzdERpYWxvZycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfYWRqdXN0RGlhbG9nKCkge1xuICAgICAgICAgIHZhciBpc01vZGFsT3ZlcmZsb3dpbmcgPSB0aGlzLl9lbGVtZW50LnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgICBpZiAoIXRoaXMuX2lzQm9keU92ZXJmbG93aW5nICYmIGlzTW9kYWxPdmVyZmxvd2luZykge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IHRoaXMuX3Njcm9sbGJhcldpZHRoICsgJ3B4JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5faXNCb2R5T3ZlcmZsb3dpbmcgJiYgIWlzTW9kYWxPdmVyZmxvd2luZykge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSB0aGlzLl9zY3JvbGxiYXJXaWR0aCArICdweH4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfcmVzZXRBZGp1c3RtZW50cycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVzZXRBZGp1c3RtZW50cygpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gJyc7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfY2hlY2tTY3JvbGxiYXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2NoZWNrU2Nyb2xsYmFyKCkge1xuICAgICAgICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkge1xuICAgICAgICAgICAgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcbiAgICAgICAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2lzQm9keU92ZXJmbG93aW5nID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaW5kb3dXaWR0aDtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxiYXJXaWR0aCA9IHRoaXMuX2dldFNjcm9sbGJhcldpZHRoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX3NldFNjcm9sbGJhcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc2V0U2Nyb2xsYmFyKCkge1xuICAgICAgICAgIHZhciBib2R5UGFkZGluZyA9IHBhcnNlSW50KCQoU2VsZWN0b3IuRklYRURfQ09OVEVOVCkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCwgMTApO1xuXG4gICAgICAgICAgdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZyA9IGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0IHx8ICcnO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2lzQm9keU92ZXJmbG93aW5nKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGJvZHlQYWRkaW5nICsgdGhpcy5fc2Nyb2xsYmFyV2lkdGggKyAncHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfcmVzZXRTY3JvbGxiYXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3Jlc2V0U2Nyb2xsYmFyKCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gdGhpcy5fb3JpZ2luYWxCb2R5UGFkZGluZztcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0U2Nyb2xsYmFyV2lkdGgnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFNjcm9sbGJhcldpZHRoKCkge1xuICAgICAgICAgIC8vIHRoeCBkLndhbHNoXG4gICAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSBDbGFzc05hbWUuU0NST0xMQkFSX01FQVNVUkVSO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICAgICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0YXRpY1xuXG4gICAgICB9XSwgW3tcbiAgICAgICAga2V5OiAnX2pRdWVyeUludGVyZmFjZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZywgcmVsYXRlZFRhcmdldCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkpO1xuICAgICAgICAgICAgdmFyIF9jb25maWcgPSAkLmV4dGVuZCh7fSwgTW9kYWwuRGVmYXVsdCwgJCh0aGlzKS5kYXRhKCksIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICBkYXRhID0gbmV3IE1vZGFsKHRoaXMsIF9jb25maWcpO1xuICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVksIGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgaWYgKGRhdGFbY29uZmlnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtZXRob2QgbmFtZWQgXCInICsgY29uZmlnICsgJ1wiJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGF0YVtjb25maWddKHJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfY29uZmlnLnNob3cpIHtcbiAgICAgICAgICAgICAgZGF0YS5zaG93KHJlbGF0ZWRUYXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ1ZFUlNJT04nLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gVkVSU0lPTjtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdEZWZhdWx0JyxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIERlZmF1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcblxuICAgICAgcmV0dXJuIE1vZGFsO1xuICAgIH0pKCk7XG5cbiAgICAkKGRvY3VtZW50KS5vbihFdmVudC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIHZhciB0YXJnZXQgPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgc2VsZWN0b3IgPSBfVXRpbFsnZGVmYXVsdCddLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcyk7XG5cbiAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICB0YXJnZXQgPSAkKHNlbGVjdG9yKVswXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbmZpZyA9ICQodGFyZ2V0KS5kYXRhKERBVEFfS0VZKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoe30sICQodGFyZ2V0KS5kYXRhKCksICQodGhpcykuZGF0YSgpKTtcblxuICAgICAgaWYgKHRoaXMudGFnTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciAkdGFyZ2V0ID0gJCh0YXJnZXQpLm9uZShFdmVudC5TSE9XLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgICAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRhcmdldC5vbmUoRXZlbnQuSElEREVOLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCQoX3RoaXM3KS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgX3RoaXM3LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBNb2RhbC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJCh0YXJnZXQpLCBjb25maWcsIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogalF1ZXJ5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICAkLmZuW05BTUVdID0gTW9kYWwuX2pRdWVyeUludGVyZmFjZTtcbiAgICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gTW9kYWw7XG4gICAgJC5mbltOQU1FXS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVDtcbiAgICAgIHJldHVybiBNb2RhbC5falF1ZXJ5SW50ZXJmYWNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gTW9kYWw7XG4gIH0pKGpRdWVyeSk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBNb2RhbDtcbn0pO1xuIl19