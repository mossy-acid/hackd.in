'use strict';

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
    global.dropdown = mod.exports;
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
   * Bootstrap (v4.0.0-alpha.2): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  var Dropdown = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'dropdown';
    var VERSION = '4.0.0-alpha';
    var DATA_KEY = 'bs.dropdown';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $.fn[NAME];

    var Event = {
      HIDE: 'hide' + EVENT_KEY,
      HIDDEN: 'hidden' + EVENT_KEY,
      SHOW: 'show' + EVENT_KEY,
      SHOWN: 'shown' + EVENT_KEY,
      CLICK: 'click' + EVENT_KEY,
      CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
      KEYDOWN_DATA_API: 'keydown' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      BACKDROP: 'dropdown-backdrop',
      DISABLED: 'disabled',
      OPEN: 'open'
    };

    var Selector = {
      BACKDROP: '.dropdown-backdrop',
      DATA_TOGGLE: '[data-toggle="dropdown"]',
      FORM_CHILD: '.dropdown form',
      ROLE_MENU: '[role="menu"]',
      ROLE_LISTBOX: '[role="listbox"]',
      NAVBAR_NAV: '.navbar-nav',
      VISIBLE_ITEMS: '[role="menu"] li:not(.disabled) a, ' + '[role="listbox"] li:not(.disabled) a'
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Dropdown = function () {
      function Dropdown(element) {
        _classCallCheck(this, Dropdown);

        this._element = element;

        this._addEventListeners();
      }

      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */

      // getters

      _createClass(Dropdown, [{
        key: 'toggle',

        // public

        value: function toggle() {
          if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
            return false;
          }

          var parent = Dropdown._getParentFromElement(this);
          var isActive = $(parent).hasClass(ClassName.OPEN);

          Dropdown._clearMenus();

          if (isActive) {
            return false;
          }

          if ('ontouchstart' in document.documentElement && !$(parent).closest(Selector.NAVBAR_NAV).length) {

            // if mobile we use a backdrop because click events don't delegate
            var dropdown = document.createElement('div');
            dropdown.className = ClassName.BACKDROP;
            $(dropdown).insertBefore(this);
            $(dropdown).on('click', Dropdown._clearMenus);
          }

          var relatedTarget = { relatedTarget: this };
          var showEvent = $.Event(Event.SHOW, relatedTarget);

          $(parent).trigger(showEvent);

          if (showEvent.isDefaultPrevented()) {
            return false;
          }

          this.focus();
          this.setAttribute('aria-expanded', 'true');

          $(parent).toggleClass(ClassName.OPEN);
          $(parent).trigger($.Event(Event.SHOWN, relatedTarget));

          return false;
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          $.removeData(this._element, DATA_KEY);
          $(this._element).off(EVENT_KEY);
          this._element = null;
        }

        // private

      }, {
        key: '_addEventListeners',
        value: function _addEventListeners() {
          $(this._element).on(Event.CLICK, this.toggle);
        }

        // static

      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(config) {
          return this.each(function () {
            var data = $(this).data(DATA_KEY);

            if (!data) {
              $(this).data(DATA_KEY, data = new Dropdown(this));
            }

            if (typeof config === 'string') {
              if (data[config] === undefined) {
                throw new Error('No method named "' + config + '"');
              }
              data[config].call(this);
            }
          });
        }
      }, {
        key: '_clearMenus',
        value: function _clearMenus(event) {
          if (event && event.which === 3) {
            return;
          }

          var backdrop = $(Selector.BACKDROP)[0];
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }

          var toggles = $.makeArray($(Selector.DATA_TOGGLE));

          for (var i = 0; i < toggles.length; i++) {
            var _parent = Dropdown._getParentFromElement(toggles[i]);
            var relatedTarget = { relatedTarget: toggles[i] };

            if (!$(_parent).hasClass(ClassName.OPEN)) {
              continue;
            }

            if (event && event.type === 'click' && /input|textarea/i.test(event.target.tagName) && $.contains(_parent, event.target)) {
              continue;
            }

            var hideEvent = $.Event(Event.HIDE, relatedTarget);
            $(_parent).trigger(hideEvent);
            if (hideEvent.isDefaultPrevented()) {
              continue;
            }

            toggles[i].setAttribute('aria-expanded', 'false');

            $(_parent).removeClass(ClassName.OPEN).trigger($.Event(Event.HIDDEN, relatedTarget));
          }
        }
      }, {
        key: '_getParentFromElement',
        value: function _getParentFromElement(element) {
          var parent = undefined;
          var selector = _Util['default'].getSelectorFromElement(element);

          if (selector) {
            parent = $(selector)[0];
          }

          return parent || element.parentNode;
        }
      }, {
        key: '_dataApiKeydownHandler',
        value: function _dataApiKeydownHandler(event) {
          if (!/(38|40|27|32)/.test(event.which) || /input|textarea/i.test(event.target.tagName)) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
            return;
          }

          var parent = Dropdown._getParentFromElement(this);
          var isActive = $(parent).hasClass(ClassName.OPEN);

          if (!isActive && event.which !== 27 || isActive && event.which === 27) {

            if (event.which === 27) {
              var toggle = $(parent).find(Selector.DATA_TOGGLE)[0];
              $(toggle).trigger('focus');
            }

            $(this).trigger('click');
            return;
          }

          var items = $.makeArray($(Selector.VISIBLE_ITEMS));

          items = items.filter(function (item) {
            return item.offsetWidth || item.offsetHeight;
          });

          if (!items.length) {
            return;
          }

          var index = items.indexOf(event.target);

          if (event.which === 38 && index > 0) {
            // up
            index--;
          }

          if (event.which === 40 && index < items.length - 1) {
            // down
            index++;
          }

          if (! ~index) {
            index = 0;
          }

          items[index].focus();
        }
      }, {
        key: 'VERSION',
        get: function get() {
          return VERSION;
        }
      }]);

      return Dropdown;
    }();

    $(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_MENU, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, Dropdown.prototype.toggle).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
      e.stopPropagation();
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Dropdown._jQueryInterface;
    $.fn[NAME].Constructor = Dropdown;
    $.fn[NAME].noConflict = function () {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Dropdown._jQueryInterface;
    };

    return Dropdown;
  }(jQuery);

  module.exports = Dropdown;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL2Ryb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxVQUFVLE1BQVYsRUFBa0IsT0FBbEIsRUFBMkI7QUFDMUIsTUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUEzQyxFQUFnRDtBQUM5QyxXQUFPLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsUUFBdEIsQ0FBUCxFQUF3QyxPQUF4QztBQUNELEdBRkQsTUFFTyxJQUFJLE9BQU8sT0FBUCxLQUFtQixXQUFuQixJQUFrQyxPQUFPLE1BQVAsS0FBa0IsV0FBeEQsRUFBcUU7QUFDMUUsWUFBUSxPQUFSLEVBQWlCLE1BQWpCLEVBQXlCLFFBQVEsUUFBUixDQUF6QjtBQUNELEdBRk0sTUFFQTtBQUNMLFFBQUksTUFBTTtBQUNSLGVBQVM7QUFERCxLQUFWO0FBR0EsWUFBUSxJQUFJLE9BQVosRUFBcUIsR0FBckIsRUFBMEIsT0FBTyxJQUFqQztBQUNBLFdBQU8sUUFBUCxHQUFrQixJQUFJLE9BQXRCO0FBQ0Q7QUFDRixDQVpELGFBWVMsVUFBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCLEtBQTNCLEVBQWtDO0FBQ3pDOztBQUVBLE1BQUksZUFBZ0IsWUFBWTtBQUFFLGFBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsS0FBbEMsRUFBeUM7QUFBRSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUFFLFlBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFz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UCxHQUFpQixRQUFqQjtBQUNELENBdlREIiwiZmlsZSI6ImRyb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2V4cG9ydHMnLCAnbW9kdWxlJywgJy4vdXRpbCddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMsIG1vZHVsZSwgcmVxdWlyZSgnLi91dGlsJykpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QuZXhwb3J0cywgbW9kLCBnbG9iYWwuVXRpbCk7XG4gICAgZ2xvYmFsLmRyb3Bkb3duID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzLCBtb2R1bGUsIF91dGlsKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG4gIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuICB2YXIgX1V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsKTtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQm9vdHN0cmFwICh2NC4wLjAtYWxwaGEuMik6IGRyb3Bkb3duLmpzXG4gICAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIHZhciBEcm9wZG93biA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogQ29uc3RhbnRzXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICB2YXIgTkFNRSA9ICdkcm9wZG93bic7XG4gICAgdmFyIFZFUlNJT04gPSAnNC4wLjAtYWxwaGEnO1xuICAgIHZhciBEQVRBX0tFWSA9ICdicy5kcm9wZG93bic7XG4gICAgdmFyIEVWRU5UX0tFWSA9ICcuJyArIERBVEFfS0VZO1xuICAgIHZhciBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJztcbiAgICB2YXIgSlFVRVJZX05PX0NPTkZMSUNUID0gJC5mbltOQU1FXTtcblxuICAgIHZhciBFdmVudCA9IHtcbiAgICAgIEhJREU6ICdoaWRlJyArIEVWRU5UX0tFWSxcbiAgICAgIEhJRERFTjogJ2hpZGRlbicgKyBFVkVOVF9LRVksXG4gICAgICBTSE9XOiAnc2hvdycgKyBFVkVOVF9LRVksXG4gICAgICBTSE9XTjogJ3Nob3duJyArIEVWRU5UX0tFWSxcbiAgICAgIENMSUNLOiAnY2xpY2snICsgRVZFTlRfS0VZLFxuICAgICAgQ0xJQ0tfREFUQV9BUEk6ICdjbGljaycgKyBFVkVOVF9LRVkgKyBEQVRBX0FQSV9LRVksXG4gICAgICBLRVlET1dOX0RBVEFfQVBJOiAna2V5ZG93bicgKyBFVkVOVF9LRVkgKyBEQVRBX0FQSV9LRVlcbiAgICB9O1xuXG4gICAgdmFyIENsYXNzTmFtZSA9IHtcbiAgICAgIEJBQ0tEUk9QOiAnZHJvcGRvd24tYmFja2Ryb3AnLFxuICAgICAgRElTQUJMRUQ6ICdkaXNhYmxlZCcsXG4gICAgICBPUEVOOiAnb3BlbidcbiAgICB9O1xuXG4gICAgdmFyIFNlbGVjdG9yID0ge1xuICAgICAgQkFDS0RST1A6ICcuZHJvcGRvd24tYmFja2Ryb3AnLFxuICAgICAgREFUQV9UT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICBGT1JNX0NISUxEOiAnLmRyb3Bkb3duIGZvcm0nLFxuICAgICAgUk9MRV9NRU5VOiAnW3JvbGU9XCJtZW51XCJdJyxcbiAgICAgIFJPTEVfTElTVEJPWDogJ1tyb2xlPVwibGlzdGJveFwiXScsXG4gICAgICBOQVZCQVJfTkFWOiAnLm5hdmJhci1uYXYnLFxuICAgICAgVklTSUJMRV9JVEVNUzogJ1tyb2xlPVwibWVudVwiXSBsaTpub3QoLmRpc2FibGVkKSBhLCAnICsgJ1tyb2xlPVwibGlzdGJveFwiXSBsaTpub3QoLmRpc2FibGVkKSBhJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICB2YXIgRHJvcGRvd24gPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZnVuY3Rpb24gRHJvcGRvd24oZWxlbWVudCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJvcGRvd24pO1xuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuXG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgKi9cblxuICAgICAgLy8gZ2V0dGVyc1xuXG4gICAgICBfY3JlYXRlQ2xhc3MoRHJvcGRvd24sIFt7XG4gICAgICAgIGtleTogJ3RvZ2dsZScsXG5cbiAgICAgICAgLy8gcHVibGljXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHtcbiAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAkKHRoaXMpLmhhc0NsYXNzKENsYXNzTmFtZS5ESVNBQkxFRCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcGFyZW50ID0gRHJvcGRvd24uX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpO1xuICAgICAgICAgIHZhciBpc0FjdGl2ZSA9ICQocGFyZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuT1BFTik7XG5cbiAgICAgICAgICBEcm9wZG93bi5fY2xlYXJNZW51cygpO1xuXG4gICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAhJChwYXJlbnQpLmNsb3Nlc3QoU2VsZWN0b3IuTkFWQkFSX05BVikubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAgICAgdmFyIGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkcm9wZG93bi5jbGFzc05hbWUgPSBDbGFzc05hbWUuQkFDS0RST1A7XG4gICAgICAgICAgICAkKGRyb3Bkb3duKS5pbnNlcnRCZWZvcmUodGhpcyk7XG4gICAgICAgICAgICAkKGRyb3Bkb3duKS5vbignY2xpY2snLCBEcm9wZG93bi5fY2xlYXJNZW51cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfTtcbiAgICAgICAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudChFdmVudC5TSE9XLCByZWxhdGVkVGFyZ2V0KTtcblxuICAgICAgICAgICQocGFyZW50KS50cmlnZ2VyKHNob3dFdmVudCk7XG5cbiAgICAgICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcblxuICAgICAgICAgICQocGFyZW50KS50b2dnbGVDbGFzcyhDbGFzc05hbWUuT1BFTik7XG4gICAgICAgICAgJChwYXJlbnQpLnRyaWdnZXIoJC5FdmVudChFdmVudC5TSE9XTiwgcmVsYXRlZFRhcmdldCkpO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2Rpc3Bvc2UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcG9zZSgpIHtcbiAgICAgICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkpO1xuICAgICAgICAgICQodGhpcy5fZWxlbWVudCkub2ZmKEVWRU5UX0tFWSk7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwcml2YXRlXG5cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2FkZEV2ZW50TGlzdGVuZXJzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LkNMSUNLLCB0aGlzLnRvZ2dsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdGF0aWNcblxuICAgICAgfV0sIFt7XG4gICAgICAgIGtleTogJ19qUXVlcnlJbnRlcmZhY2UnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZKTtcblxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSwgZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBpZiAoZGF0YVtjb25maWddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1ldGhvZCBuYW1lZCBcIicgKyBjb25maWcgKyAnXCInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkYXRhW2NvbmZpZ10uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfY2xlYXJNZW51cycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfY2xlYXJNZW51cyhldmVudCkge1xuICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC53aGljaCA9PT0gMykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBiYWNrZHJvcCA9ICQoU2VsZWN0b3IuQkFDS0RST1ApWzBdO1xuICAgICAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICAgICAgYmFja2Ryb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiYWNrZHJvcCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHRvZ2dsZXMgPSAkLm1ha2VBcnJheSgkKFNlbGVjdG9yLkRBVEFfVE9HR0xFKSk7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfcGFyZW50ID0gRHJvcGRvd24uX2dldFBhcmVudEZyb21FbGVtZW50KHRvZ2dsZXNbaV0pO1xuICAgICAgICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRvZ2dsZXNbaV0gfTtcblxuICAgICAgICAgICAgaWYgKCEkKF9wYXJlbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5PUEVOKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnR5cGUgPT09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucyhfcGFyZW50LCBldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudChFdmVudC5ISURFLCByZWxhdGVkVGFyZ2V0KTtcbiAgICAgICAgICAgICQoX3BhcmVudCkudHJpZ2dlcihoaWRlRXZlbnQpO1xuICAgICAgICAgICAgaWYgKGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9nZ2xlc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgJChfcGFyZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuT1BFTikudHJpZ2dlcigkLkV2ZW50KEV2ZW50LkhJRERFTiwgcmVsYXRlZFRhcmdldCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdfZ2V0UGFyZW50RnJvbUVsZW1lbnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFBhcmVudEZyb21FbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgcGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHZhciBzZWxlY3RvciA9IF9VdGlsWydkZWZhdWx0J10uZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KTtcblxuICAgICAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgcGFyZW50ID0gJChzZWxlY3RvcilbMF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHBhcmVudCB8fCBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnX2RhdGFBcGlLZXlkb3duSGFuZGxlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGF0YUFwaUtleWRvd25IYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChldmVudC53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgJCh0aGlzKS5oYXNDbGFzcyhDbGFzc05hbWUuRElTQUJMRUQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHBhcmVudCA9IERyb3Bkb3duLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0aGlzKTtcbiAgICAgICAgICB2YXIgaXNBY3RpdmUgPSAkKHBhcmVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLk9QRU4pO1xuXG4gICAgICAgICAgaWYgKCFpc0FjdGl2ZSAmJiBldmVudC53aGljaCAhPT0gMjcgfHwgaXNBY3RpdmUgJiYgZXZlbnQud2hpY2ggPT09IDI3KSB7XG5cbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgdmFyIHRvZ2dsZSA9ICQocGFyZW50KS5maW5kKFNlbGVjdG9yLkRBVEFfVE9HR0xFKVswXTtcbiAgICAgICAgICAgICAgJCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaXRlbXMgPSAkLm1ha2VBcnJheSgkKFNlbGVjdG9yLlZJU0lCTEVfSVRFTVMpKTtcblxuICAgICAgICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vZmZzZXRXaWR0aCB8fCBpdGVtLm9mZnNldEhlaWdodDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGluZGV4ID0gaXRlbXMuaW5kZXhPZihldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAzOCAmJiBpbmRleCA+IDApIHtcbiAgICAgICAgICAgIC8vIHVwXG4gICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gNDAgJiYgaW5kZXggPCBpdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAvLyBkb3duXG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghIH5pbmRleCkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ1ZFUlNJT04nLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gVkVSU0lPTjtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gRHJvcGRvd247XG4gICAgfSkoKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKEV2ZW50LktFWURPV05fREFUQV9BUEksIFNlbGVjdG9yLkRBVEFfVE9HR0xFLCBEcm9wZG93bi5fZGF0YUFwaUtleWRvd25IYW5kbGVyKS5vbihFdmVudC5LRVlET1dOX0RBVEFfQVBJLCBTZWxlY3Rvci5ST0xFX01FTlUsIERyb3Bkb3duLl9kYXRhQXBpS2V5ZG93bkhhbmRsZXIpLm9uKEV2ZW50LktFWURPV05fREFUQV9BUEksIFNlbGVjdG9yLlJPTEVfTElTVEJPWCwgRHJvcGRvd24uX2RhdGFBcGlLZXlkb3duSGFuZGxlcikub24oRXZlbnQuQ0xJQ0tfREFUQV9BUEksIERyb3Bkb3duLl9jbGVhck1lbnVzKS5vbihFdmVudC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9UT0dHTEUsIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUpLm9uKEV2ZW50LkNMSUNLX0RBVEFfQVBJLCBTZWxlY3Rvci5GT1JNX0NISUxELCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGpRdWVyeVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgJC5mbltOQU1FXSA9IERyb3Bkb3duLl9qUXVlcnlJbnRlcmZhY2U7XG4gICAgJC5mbltOQU1FXS5Db25zdHJ1Y3RvciA9IERyb3Bkb3duO1xuICAgICQuZm5bTkFNRV0ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICQuZm5bTkFNRV0gPSBKUVVFUllfTk9fQ09ORkxJQ1Q7XG4gICAgICByZXR1cm4gRHJvcGRvd24uX2pRdWVyeUludGVyZmFjZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIERyb3Bkb3duO1xuICB9KShqUXVlcnkpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG59KTtcbiJdfQ==