'use strict';

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2pzL3RyYW5zaXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVNBLENBQUMsVUFBVSxDQUFWLEVBQWE7QUFDWjs7Ozs7QUFLQSxXQUFTLGFBQVQsR0FBeUI7QUFDdkIsUUFBSSxLQUFLLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFUOztBQUVBLFFBQUkscUJBQXFCO0FBQ3ZCLHdCQUFtQixxQkFESTtBQUV2QixxQkFBbUIsZUFGSTtBQUd2QixtQkFBbUIsK0JBSEk7QUFJdkIsa0JBQW1CO0FBSkksS0FBekI7O0FBT0EsU0FBSyxJQUFJLElBQVQsSUFBaUIsa0JBQWpCLEVBQXFDO0FBQ25DLFVBQUksR0FBRyxLQUFILENBQVMsSUFBVCxNQUFtQixTQUF2QixFQUFrQztBQUNoQyxlQUFPLEVBQUUsS0FBSyxtQkFBbUIsSUFBbkIsQ0FBUCxFQUFQO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLEtBQVAsQztBQUNEOzs7QUFHRCxJQUFFLEVBQUYsQ0FBSyxvQkFBTCxHQUE0QixVQUFVLFFBQVYsRUFBb0I7QUFDOUMsUUFBSSxTQUFTLEtBQWI7QUFDQSxRQUFJLE1BQU0sSUFBVjtBQUNBLE1BQUUsSUFBRixFQUFRLEdBQVIsQ0FBWSxpQkFBWixFQUErQixZQUFZO0FBQUUsZUFBUyxJQUFUO0FBQWUsS0FBNUQ7QUFDQSxRQUFJLFdBQVcsU0FBWCxRQUFXLEdBQVk7QUFBRSxVQUFJLENBQUMsTUFBTCxFQUFhLEVBQUUsR0FBRixFQUFPLE9BQVAsQ0FBZSxFQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLEdBQXBDO0FBQTBDLEtBQXBGO0FBQ0EsZUFBVyxRQUFYLEVBQXFCLFFBQXJCO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FQRDs7QUFTQSxJQUFFLFlBQVk7QUFDWixNQUFFLE9BQUYsQ0FBVSxVQUFWLEdBQXVCLGVBQXZCOztBQUVBLFFBQUksQ0FBQyxFQUFFLE9BQUYsQ0FBVSxVQUFmLEVBQTJCOztBQUUzQixNQUFFLEtBQUYsQ0FBUSxPQUFSLENBQWdCLGVBQWhCLEdBQWtDO0FBQ2hDLGdCQUFVLEVBQUUsT0FBRixDQUFVLFVBQVYsQ0FBcUIsR0FEQztBQUVoQyxvQkFBYyxFQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLEdBRkg7QUFHaEMsY0FBUSxnQkFBVSxDQUFWLEVBQWE7QUFDbkIsWUFBSSxFQUFFLEVBQUUsTUFBSixFQUFZLEVBQVosQ0FBZSxJQUFmLENBQUosRUFBMEIsT0FBTyxFQUFFLFNBQUYsQ0FBWSxPQUFaLENBQW9CLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDLFNBQWhDLENBQVA7QUFDM0I7QUFMK0IsS0FBbEM7QUFPRCxHQVpEO0FBY0QsQ0FqREEsQ0FpREMsTUFqREQsQ0FBRCIsImZpbGUiOiJ0cmFuc2l0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRyYW5zaXRpb24uanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyN0cmFuc2l0aW9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENTUyBUUkFOU0lUSU9OIFNVUFBPUlQgKFNob3V0b3V0OiBodHRwOi8vd3d3Lm1vZGVybml6ci5jb20vKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Jvb3RzdHJhcCcpXG5cbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgIE1velRyYW5zaXRpb24gICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICBPVHJhbnNpdGlvbiAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV0gfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcbiAgfVxuXG4gIC8vIGh0dHA6Ly9ibG9nLmFsZXhtYWNjYXcuY29tL2Nzcy10cmFuc2l0aW9uc1xuICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyICRlbCA9IHRoaXNcbiAgICAkKHRoaXMpLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkgeyBjYWxsZWQgPSB0cnVlIH0pXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBpZiAoIWNhbGxlZCkgJCgkZWwpLnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSB9XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgZHVyYXRpb24pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkVuZCgpXG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm5cblxuICAgICQuZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQgPSB7XG4gICAgICBiaW5kVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgZGVsZWdhdGVUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGlzKSkgcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxufShqUXVlcnkpO1xuIl19