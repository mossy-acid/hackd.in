'use strict';

(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.util = mod.exports;
  }
})(undefined, function (exports, module) {
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.0.0-alpha.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  'use strict';

  var Util = function ($) {

    /**
     * ------------------------------------------------------------------------
     * Private TransitionEnd Helpers
     * ------------------------------------------------------------------------
     */

    var transition = false;

    var TransitionEndEvent = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    // shoutout AngusCroll (https://goo.gl/pxwQGp)
    function toType(obj) {
      return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }

    function isElement(obj) {
      return (obj[0] || obj).nodeType;
    }

    function getSpecialTransitionEndEvent() {
      return {
        bindType: transition.end,
        delegateType: transition.end,
        handle: function handle(event) {
          if ($(event.target).is(this)) {
            return event.handleObj.handler.apply(this, arguments);
          }
        }
      };
    }

    function transitionEndTest() {
      if (window.QUnit) {
        return false;
      }

      var el = document.createElement('bootstrap');

      for (var _name in TransitionEndEvent) {
        if (el.style[_name] !== undefined) {
          return { end: TransitionEndEvent[_name] };
        }
      }

      return false;
    }

    function transitionEndEmulator(duration) {
      var _this = this;

      var called = false;

      $(this).one(Util.TRANSITION_END, function () {
        called = true;
      });

      setTimeout(function () {
        if (!called) {
          Util.triggerTransitionEnd(_this);
        }
      }, duration);

      return this;
    }

    function setTransitionEndSupport() {
      transition = transitionEndTest();

      $.fn.emulateTransitionEnd = transitionEndEmulator;

      if (Util.supportsTransitionEnd()) {
        $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
      }
    }

    /**
     * --------------------------------------------------------------------------
     * Public Util Api
     * --------------------------------------------------------------------------
     */

    var Util = {

      TRANSITION_END: 'bsTransitionEnd',

      getUID: function getUID(prefix) {
        do {
          prefix += ~ ~(Math.random() * 1000000); // "~~" acts like a faster Math.floor() here
        } while (document.getElementById(prefix));
        return prefix;
      },

      getSelectorFromElement: function getSelectorFromElement(element) {
        var selector = element.getAttribute('data-target');

        if (!selector) {
          selector = element.getAttribute('href') || '';
          selector = /^#[a-z]/i.test(selector) ? selector : null;
        }

        return selector;
      },

      reflow: function reflow(element) {
        new Function('bs', 'return bs')(element.offsetHeight);
      },

      triggerTransitionEnd: function triggerTransitionEnd(element) {
        $(element).trigger(transition.end);
      },

      supportsTransitionEnd: function supportsTransitionEnd() {
        return Boolean(transition);
      },

      typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
        for (var property in configTypes) {
          if (configTypes.hasOwnProperty(property)) {
            var expectedTypes = configTypes[property];
            var value = config[property];
            var valueType = undefined;

            if (value && isElement(value)) {
              valueType = 'element';
            } else {
              valueType = toType(value);
            }

            if (!new RegExp(expectedTypes).test(valueType)) {
              throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
            }
          }
        }
      }
    };

    setTransitionEndSupport();

    return Util;
  }(jQuery);

  module.exports = Util;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvdW1kL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLFVBQVUsTUFBVixFQUFrQixPQUFsQixFQUEyQjtBQUMxQixNQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzlDLFdBQU8sQ0FBQyxTQUFELEVBQVksUUFBWixDQUFQLEVBQThCLE9BQTlCO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sTUFBUCxLQUFrQixXQUF4RCxFQUFxRTtBQUMxRSxZQUFRLE9BQVIsRUFBaUIsTUFBakI7QUFDRCxHQUZNLE1BRUE7QUFDTCxRQUFJLE1BQU07QUFDUixlQUFTO0FBREQsS0FBVjtBQUdBLFlBQVEsSUFBSSxPQUFaLEVBQXFCLEdBQXJCO0FBQ0EsV0FBTyxJQUFQLEdBQWMsSUFBSSxPQUFsQjtBQUNEO0FBQ0YsQ0FaRCxhQVlTLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQjs7Ozs7Ozs7QUFRbEM7O0FBRUEsTUFBSSxPQUFRLFVBQVUsQ0FBVixFQUFhOzs7Ozs7OztBQVF2QixRQUFJLGFBQWEsS0FBakI7O0FBRUEsUUFBSSxxQkFBcUI7QUFDdkIsd0JBQWtCLHFCQURLO0FBRXZCLHFCQUFlLGVBRlE7QUFHdkIsbUJBQWEsK0JBSFU7QUFJdkIsa0JBQVk7QUFKVyxLQUF6Qjs7O0FBUUEsYUFBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLGFBQVEsRUFBRCxDQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEdBQW5CLEVBQXdCLEtBQXhCLENBQThCLGVBQTlCLEVBQStDLENBQS9DLEVBQWtELFdBQWxELEVBQVA7QUFDRDs7QUFFRCxhQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0I7QUFDdEIsYUFBTyxDQUFDLElBQUksQ0FBSixLQUFVLEdBQVgs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RUFBZ0QsV0FBaEQsRUFBNkQ7QUFDNUUsYUFBSyxJQUFJLFFBQVQsSUFBcUIsV0FBckIsRUFBa0M7QUFDaEMsY0FBSSxZQUFZLGNBQVosQ0FBMkIsUUFBM0IsQ0FBSixFQUEwQztBQUN4QyxnQkFBSSxnQkFBZ0IsWUFBWSxRQUFaLENBQXBCO0FBQ0EsZ0JBQUksUUFBUSxPQUFPLFFBQVAsQ0FBWjtBQUNBLGdCQUFJLFlBQVksU0FBaEI7O0FBRUEsZ0JBQUksU0FBUyxVQUFVLEtBQVYsQ0FBYixFQUErQjtBQUM3QiwwQkFBWSxTQUFaO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsMEJBQVksT0FBTyxLQUFQLENBQVo7QUFDRDs7QUFFRCxnQkFBSSxDQUFDLElBQUksTUFBSixDQUFXLGFBQVgsRUFBMEIsSUFBMUIsQ0FBK0IsU0FBL0IsQ0FBTCxFQUFnRDtBQUM5QyxvQkFBTSxJQUFJLEtBQUosQ0FBVSxjQUFjLFdBQWQsS0FBOEIsSUFBOUIsSUFBc0MsYUFBYSxRQUFiLEdBQXdCLG1CQUF4QixHQUE4QyxTQUE5QyxHQUEwRCxJQUFoRyxLQUF5Ryx3QkFBd0IsYUFBeEIsR0FBd0MsSUFBakosQ0FBVixDQUFOO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFwRFEsS0FBWDs7QUF1REE7O0FBRUEsV0FBTyxJQUFQO0FBQ0QsR0FsSlUsQ0FrSlIsTUFsSlEsQ0FBWDs7QUFvSkEsU0FBTyxPQUFQLEdBQWlCLElBQWpCO0FBQ0QsQ0EzS0QiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJywgJ21vZHVsZSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMsIG1vZHVsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZC5leHBvcnRzLCBtb2QpO1xuICAgIGdsb2JhbC51dGlsID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzLCBtb2R1bGUpIHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIEJvb3RzdHJhcCAodjQuMC4wLWFscGhhLjIpOiB1dGlsLmpzXG4gICAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgVXRpbCA9IChmdW5jdGlvbiAoJCkge1xuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogUHJpdmF0ZSBUcmFuc2l0aW9uRW5kIEhlbHBlcnNcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cblxuICAgIHZhciB0cmFuc2l0aW9uID0gZmFsc2U7XG5cbiAgICB2YXIgVHJhbnNpdGlvbkVuZEV2ZW50ID0ge1xuICAgICAgV2Via2l0VHJhbnNpdGlvbjogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgTW96VHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb246ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9O1xuXG4gICAgLy8gc2hvdXRvdXQgQW5ndXNDcm9sbCAoaHR0cHM6Ly9nb28uZ2wvcHh3UUdwKVxuICAgIGZ1bmN0aW9uIHRvVHlwZShvYmopIHtcbiAgICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwob2JqKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRWxlbWVudChvYmopIHtcbiAgICAgIHJldHVybiAob2JqWzBdIHx8IG9iaikubm9kZVR5cGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3BlY2lhbFRyYW5zaXRpb25FbmRFdmVudCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJpbmRUeXBlOiB0cmFuc2l0aW9uLmVuZCxcbiAgICAgICAgZGVsZWdhdGVUeXBlOiB0cmFuc2l0aW9uLmVuZCxcbiAgICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGUoZXZlbnQpIHtcbiAgICAgICAgICBpZiAoJChldmVudC50YXJnZXQpLmlzKHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZFRlc3QoKSB7XG4gICAgICBpZiAod2luZG93LlFVbml0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJyk7XG5cbiAgICAgIGZvciAodmFyIF9uYW1lIGluIFRyYW5zaXRpb25FbmRFdmVudCkge1xuICAgICAgICBpZiAoZWwuc3R5bGVbX25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4geyBlbmQ6IFRyYW5zaXRpb25FbmRFdmVudFtfbmFtZV0gfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZEVtdWxhdG9yKGR1cmF0aW9uKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgICAgICQodGhpcykub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICBVdGlsLnRyaWdnZXJUcmFuc2l0aW9uRW5kKF90aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSwgZHVyYXRpb24pO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUcmFuc2l0aW9uRW5kU3VwcG9ydCgpIHtcbiAgICAgIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kVGVzdCgpO1xuXG4gICAgICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gdHJhbnNpdGlvbkVuZEVtdWxhdG9yO1xuXG4gICAgICBpZiAoVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSkge1xuICAgICAgICAkLmV2ZW50LnNwZWNpYWxbVXRpbC5UUkFOU0lUSU9OX0VORF0gPSBnZXRTcGVjaWFsVHJhbnNpdGlvbkVuZEV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBQdWJsaWMgVXRpbCBBcGlcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuXG4gICAgdmFyIFV0aWwgPSB7XG5cbiAgICAgIFRSQU5TSVRJT05fRU5EOiAnYnNUcmFuc2l0aW9uRW5kJyxcblxuICAgICAgZ2V0VUlEOiBmdW5jdGlvbiBnZXRVSUQocHJlZml4KSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBwcmVmaXggKz0gfiB+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKTsgLy8gXCJ+flwiIGFjdHMgbGlrZSBhIGZhc3RlciBNYXRoLmZsb29yKCkgaGVyZVxuICAgICAgICB9IHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKTtcbiAgICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICAgIH0sXG5cbiAgICAgIGdldFNlbGVjdG9yRnJvbUVsZW1lbnQ6IGZ1bmN0aW9uIGdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudCkge1xuICAgICAgICB2YXIgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKTtcblxuICAgICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICAgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcnO1xuICAgICAgICAgIHNlbGVjdG9yID0gL14jW2Etel0vaS50ZXN0KHNlbGVjdG9yKSA/IHNlbGVjdG9yIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICAgIH0sXG5cbiAgICAgIHJlZmxvdzogZnVuY3Rpb24gcmVmbG93KGVsZW1lbnQpIHtcbiAgICAgICAgbmV3IEZ1bmN0aW9uKCdicycsICdyZXR1cm4gYnMnKShlbGVtZW50Lm9mZnNldEhlaWdodCk7XG4gICAgICB9LFxuXG4gICAgICB0cmlnZ2VyVHJhbnNpdGlvbkVuZDogZnVuY3Rpb24gdHJpZ2dlclRyYW5zaXRpb25FbmQoZWxlbWVudCkge1xuICAgICAgICAkKGVsZW1lbnQpLnRyaWdnZXIodHJhbnNpdGlvbi5lbmQpO1xuICAgICAgfSxcblxuICAgICAgc3VwcG9ydHNUcmFuc2l0aW9uRW5kOiBmdW5jdGlvbiBzdXBwb3J0c1RyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRyYW5zaXRpb24pO1xuICAgICAgfSxcblxuICAgICAgdHlwZUNoZWNrQ29uZmlnOiBmdW5jdGlvbiB0eXBlQ2hlY2tDb25maWcoY29tcG9uZW50TmFtZSwgY29uZmlnLCBjb25maWdUeXBlcykge1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBjb25maWdUeXBlcykge1xuICAgICAgICAgIGlmIChjb25maWdUeXBlcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHZhciBleHBlY3RlZFR5cGVzID0gY29uZmlnVHlwZXNbcHJvcGVydHldO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIHZhciB2YWx1ZVR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiBpc0VsZW1lbnQodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHZhbHVlVHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhbHVlVHlwZSA9IHRvVHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbmV3IFJlZ0V4cChleHBlY3RlZFR5cGVzKS50ZXN0KHZhbHVlVHlwZSkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNvbXBvbmVudE5hbWUudG9VcHBlckNhc2UoKSArICc6ICcgKyAoJ09wdGlvbiBcIicgKyBwcm9wZXJ0eSArICdcIiBwcm92aWRlZCB0eXBlIFwiJyArIHZhbHVlVHlwZSArICdcIiAnKSArICgnYnV0IGV4cGVjdGVkIHR5cGUgXCInICsgZXhwZWN0ZWRUeXBlcyArICdcIi4nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNldFRyYW5zaXRpb25FbmRTdXBwb3J0KCk7XG5cbiAgICByZXR1cm4gVXRpbDtcbiAgfSkoalF1ZXJ5KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IFV0aWw7XG59KTtcbiJdfQ==