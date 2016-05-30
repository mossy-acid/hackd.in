'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.3.6';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').children().detach().end()[// we use append for html objects to maintain js events
    this.options.html ? typeof content == 'string' ? 'html' : 'append' : 'text'](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2pzL3BvcG92ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBU0EsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaOzs7OztBQUtBLE1BQUksVUFBVSxTQUFWLE9BQVUsQ0FBVSxPQUFWLEVBQW1CLE9BQW5CLEVBQTRCO0FBQ3hDLFNBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsT0FBckIsRUFBOEIsT0FBOUI7QUFDRCxHQUZEOztBQUlBLE1BQUksQ0FBQyxFQUFFLEVBQUYsQ0FBSyxPQUFWLEVBQW1CLE1BQU0sSUFBSSxLQUFKLENBQVUsNkJBQVYsQ0FBTjs7QUFFbkIsVUFBUSxPQUFSLEdBQW1CLE9BQW5COztBQUVBLFVBQVEsUUFBUixHQUFtQixFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsRUFBRSxFQUFGLENBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsUUFBdEMsRUFBZ0Q7QUFDakUsZUFBVyxPQURzRDtBQUVqRSxhQUFTLE9BRndEO0FBR2pFLGFBQVMsRUFId0Q7QUFJakUsY0FBVTtBQUp1RCxHQUFoRCxDQUFuQjs7Ozs7QUFXQSxVQUFRLFNBQVIsR0FBb0IsRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLEVBQUUsRUFBRixDQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLFNBQXRDLENBQXBCOztBQUVBLFVBQVEsU0FBUixDQUFrQixXQUFsQixHQUFnQyxPQUFoQzs7QUFFQSxVQUFRLFNBQVIsQ0FBa0IsV0FBbEIsR0FBZ0MsWUFBWTtBQUMxQyxXQUFPLFFBQVEsUUFBZjtBQUNELEdBRkQ7O0FBSUEsVUFBUSxTQUFSLENBQWtCLFVBQWxCLEdBQStCLFlBQVk7QUFDekMsUUFBSSxPQUFVLEtBQUssR0FBTCxFQUFkO0FBQ0EsUUFBSSxRQUFVLEtBQUssUUFBTCxFQUFkO0FBQ0EsUUFBSSxVQUFVLEtBQUssVUFBTCxFQUFkOztBQUVBLFNBQUssSUFBTCxDQUFVLGdCQUFWLEVBQTRCLEtBQUssT0FBTCxDQUFhLElBQWIsR0FBb0IsTUFBcEIsR0FBNkIsTUFBekQsRUFBaUUsS0FBakU7QUFDQSxTQUFLLElBQUwsQ0FBVSxrQkFBVixFQUE4QixRQUE5QixHQUF5QyxNQUF6QyxHQUFrRCxHQUFsRCxHO0FBQ0UsU0FBSyxPQUFMLENBQWEsSUFBYixHQUFxQixPQUFPLE9BQVAsSUFBa0IsUUFBbEIsR0FBNkIsTUFBN0IsR0FBc0MsUUFBM0QsR0FBdUUsTUFEekUsRUFFRSxPQUZGOztBQUlBLFNBQUssV0FBTCxDQUFpQiwrQkFBakI7Ozs7QUFJQSxRQUFJLENBQUMsS0FBSyxJQUFMLENBQVUsZ0JBQVYsRUFBNEIsSUFBNUIsRUFBTCxFQUF5QyxLQUFLLElBQUwsQ0FBVSxnQkFBVixFQUE0QixJQUE1QjtBQUMxQyxHQWZEOztBQWlCQSxVQUFRLFNBQVIsQ0FBa0IsVUFBbEIsR0FBK0IsWUFBWTtBQUN6QyxXQUFPLEtBQUssUUFBTCxNQUFtQixLQUFLLFVBQUwsRUFBMUI7QUFDRCxHQUZEOztBQUlBLFVBQVEsU0FBUixDQUFrQixVQUFsQixHQUErQixZQUFZO0FBQ3pDLFFBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxRQUFJLElBQUssS0FBSyxPQUFkOztBQUVBLFdBQU8sR0FBRyxJQUFILENBQVEsY0FBUixNQUNELE9BQU8sRUFBRSxPQUFULElBQW9CLFVBQXBCLEdBQ0UsRUFBRSxPQUFGLENBQVUsSUFBVixDQUFlLEdBQUcsQ0FBSCxDQUFmLENBREYsR0FFRSxFQUFFLE9BSEgsQ0FBUDtBQUlELEdBUkQ7O0FBVUEsVUFBUSxTQUFSLENBQWtCLEtBQWxCLEdBQTBCLFlBQVk7QUFDcEMsV0FBUSxLQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsSUFBZSxLQUFLLEdBQUwsR0FBVyxJQUFYLENBQWdCLFFBQWhCLENBQXJDO0FBQ0QsR0FGRDs7Ozs7QUFRQSxXQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsV0FBTyxLQUFLLElBQUwsQ0FBVSxZQUFZO0FBQzNCLFVBQUksUUFBVSxFQUFFLElBQUYsQ0FBZDtBQUNBLFVBQUksT0FBVSxNQUFNLElBQU4sQ0FBVyxZQUFYLENBQWQ7QUFDQSxVQUFJLFVBQVUsUUFBTyxNQUFQLHlDQUFPLE1BQVAsTUFBaUIsUUFBakIsSUFBNkIsTUFBM0M7O0FBRUEsVUFBSSxDQUFDLElBQUQsSUFBUyxlQUFlLElBQWYsQ0FBb0IsTUFBcEIsQ0FBYixFQUEwQztBQUMxQyxVQUFJLENBQUMsSUFBTCxFQUFXLE1BQU0sSUFBTixDQUFXLFlBQVgsRUFBMEIsT0FBTyxJQUFJLE9BQUosQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBQWpDO0FBQ1gsVUFBSSxPQUFPLE1BQVAsSUFBaUIsUUFBckIsRUFBK0IsS0FBSyxNQUFMO0FBQ2hDLEtBUk0sQ0FBUDtBQVNEOztBQUVELE1BQUksTUFBTSxFQUFFLEVBQUYsQ0FBSyxPQUFmOztBQUVBLElBQUUsRUFBRixDQUFLLE9BQUwsR0FBMkIsTUFBM0I7QUFDQSxJQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsV0FBYixHQUEyQixPQUEzQjs7Ozs7QUFNQSxJQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsVUFBYixHQUEwQixZQUFZO0FBQ3BDLE1BQUUsRUFBRixDQUFLLE9BQUwsR0FBZSxHQUFmO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDtBQUtELENBbEdBLENBa0dDLE1BbEdELENBQUQiLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jcG9wb3ZlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghJC5mbi50b29sdGlwKSB0aHJvdyBuZXcgRXJyb3IoJ1BvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qcycpXG5cbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjMuNidcblxuICBQb3BvdmVyLkRFRkFVTFRTID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUywge1xuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuICAvLyBOT1RFOiBQT1BPVkVSIEVYVEVORFMgdG9vbHRpcC5qc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIFBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlICAgPSB0aGlzLmdldFRpdGxlKClcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJylbdGhpcy5vcHRpb25zLmh0bWwgPyAnaHRtbCcgOiAndGV4dCddKHRpdGxlKVxuICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbIC8vIHdlIHVzZSBhcHBlbmQgZm9yIGh0bWwgb2JqZWN0cyB0byBtYWludGFpbiBqcyBldmVudHNcbiAgICAgIHRoaXMub3B0aW9ucy5odG1sID8gKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCcpIDogJ3RleHQnXG4gICAgXShjb250ZW50KVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuXG4gICAgLy8gSUU4IGRvZXNuJ3QgYWNjZXB0IGhpZGluZyB2aWEgdGhlIGA6ZW1wdHlgIHBzZXVkbyBzZWxlY3Rvciwgd2UgaGF2ZSB0byBkb1xuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxuICAgIGlmICghJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwoKSkgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmhpZGUoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuZ2V0Q29udGVudCgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuICAgICAgfHwgKHR5cGVvZiBvLmNvbnRlbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxuICAgICAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuIl19