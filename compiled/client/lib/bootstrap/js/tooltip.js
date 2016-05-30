'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.3.6';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var elOffset = isBody ? { top: 0, left: 0 } : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~ ~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
    });
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2pzL3Rvb2x0aXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVVBLENBQUMsVUFBVSxDQUFWLEVBQWE7QUFDWjs7Ozs7QUFLQSxNQUFJLFVBQVUsU0FBVixPQUFVLENBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUN4QyxTQUFLLElBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLE9BQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLFFBQUwsR0FBa0IsSUFBbEI7QUFDQSxTQUFLLE9BQUwsR0FBa0IsSUFBbEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsU0FBVixFQUFxQixPQUFyQixFQUE4QixPQUE5QjtBQUNELEdBVkQ7O0FBWUEsVUFBUSxPQUFSLEdBQW1CLE9BQW5COztBQUVBLFVBQVEsbUJBQVIsR0FBOEIsR0FBOUI7O0FBRUEsVUFBUSxRQUFSLEdBQW1CO0FBQ2pCLGVBQVcsSUFETTtBQUVqQixlQUFXLEtBRk07QUFHakIsY0FBVSxLQUhPO0FBSWpCLGNBQVUsOEdBSk87QUFLakIsYUFBUyxhQUxRO0FBTWpCLFdBQU8sRUFOVTtBQU9qQixXQUFPLENBUFU7QUFRakIsVUFBTSxLQVJXO0FBU2pCLGVBQVcsS0FUTTtBQVVqQixjQUFVO0FBQ1IsZ0JBQVUsTUFERjtBQUVSLGVBQVM7QUFGRDtBQVZPLEdBQW5COztBQWdCQSxVQUFRLFNBQVIsQ0FBa0IsSUFBbEIsR0FBeUIsVUFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDO0FBQ3pELFNBQUssT0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUssSUFBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFpQixFQUFFLE9BQUYsQ0FBakI7QUFDQSxT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SUFBTCxFQUFXLE1BQU0sSUFBTixDQUFXLFlBQVgsRUFBMEIsT0FBTyxJQUFJLE9BQUosQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBQWpDO0FBQ1gsVUFBSSxPQUFPLE1BQVAsSUFBaUIsUUFBckIsRUFBK0IsS0FBSyxNQUFMO0FBQ2hDLEtBUk0sQ0FBUDtBQVNEOztBQUVELE1BQUksTUFBTSxFQUFFLEVBQUYsQ0FBSyxPQUFmOztBQUVBLElBQUUsRUFBRixDQUFLLE9BQUwsR0FBMkIsTUFBM0I7QUFDQSxJQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsV0FBYixHQUEyQixPQUEzQjs7Ozs7QUFNQSxJQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsVUFBYixHQUEwQixZQUFZO0FBQ3BDLE1BQUUsRUFBRixDQUFLLE9BQUwsR0FBZSxHQUFmO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FIRDtBQUtELENBdmZBLENBdWZDLE1BdmZELENBQUQiLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjMuNidcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKHRoaXMub3B0aW9ucy5jb250YWluZXIpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10odGl0bGUpXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkdGlwXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBjb21wbGV0ZSgpXG5cbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZiAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykgIT0gJ3N0cmluZycpIHtcbiAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudCAgID0gJGVsZW1lbnQgfHwgdGhpcy4kZWxlbWVudFxuXG4gICAgdmFyIGVsICAgICA9ICRlbGVtZW50WzBdXG4gICAgdmFyIGlzQm9keSA9IGVsLnRhZ05hbWUgPT0gJ0JPRFknXG5cbiAgICB2YXIgZWxSZWN0ICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoZWxSZWN0LndpZHRoID09IG51bGwpIHtcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXG4gICAgICBlbFJlY3QgPSAkLmV4dGVuZCh7fSwgZWxSZWN0LCB7IHdpZHRoOiBlbFJlY3QucmlnaHQgLSBlbFJlY3QubGVmdCwgaGVpZ2h0OiBlbFJlY3QuYm90dG9tIC0gZWxSZWN0LnRvcCB9KVxuICAgIH1cbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6ICRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHNjcm9sbCAgICA9IHsgc2Nyb2xsOiBpc0JvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogJGVsZW1lbnQuc2Nyb2xsVG9wKCkgfVxuICAgIHZhciBvdXRlckRpbXMgPSBpc0JvZHkgPyB7IHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgfSA6IG51bGxcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZWxSZWN0LCBzY3JvbGwsIG91dGVyRGltcywgZWxPZmZzZXQpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0ID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudCA9PSAnYm90dG9tJyA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgICBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRoIH0gOlxuICAgICAgICAvKiBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAqLyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggfVxuXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICB2YXIgZGVsdGEgPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gICAgaWYgKCF0aGlzLiR2aWV3cG9ydCkgcmV0dXJuIGRlbHRhXG5cbiAgICB2YXIgdmlld3BvcnRQYWRkaW5nID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmIHRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nIHx8IDBcbiAgICB2YXIgdmlld3BvcnREaW1lbnNpb25zID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgIGlmICgvcmlnaHR8bGVmdC8udGVzdChwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgdG9wRWRnZU9mZnNldCAgICA9IHBvcy50b3AgLSB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XG4gICAgICBpZiAodG9wRWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy50b3ApIHsgLy8gdG9wIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgLSB0b3BFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQgLSBib3R0b21FZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZWZ0RWRnZU9mZnNldCAgPSBwb3MubGVmdCAtIHZpZXdwb3J0UGFkZGluZ1xuICAgICAgdmFyIHJpZ2h0RWRnZU9mZnNldCA9IHBvcy5sZWZ0ICsgdmlld3BvcnRQYWRkaW5nICsgYWN0dWFsV2lkdGhcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0IC0gbGVmdEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAocmlnaHRFZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnJpZ2h0KSB7IC8vIHJpZ2h0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWx0YVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgIHx8ICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nID8gby50aXRsZS5jYWxsKCRlWzBdKSA6ICBvLnRpdGxlKVxuXG4gICAgcmV0dXJuIHRpdGxlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgZG8gcHJlZml4ICs9IH5+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKVxuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuICAgIHJldHVybiBwcmVmaXhcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJHRpcCkge1xuICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUgKyAnIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHRpcFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLnRvb2x0aXAtYXJyb3cnKSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgc2VsZi5pblN0YXRlLmNsaWNrID0gIXNlbGYuaW5TdGF0ZS5jbGlja1xuICAgICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSBzZWxmLmVudGVyKHNlbGYpXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSA/IHNlbGYubGVhdmUoc2VsZikgOiBzZWxmLmVudGVyKHNlbGYpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9mZignLicgKyB0aGF0LnR5cGUpLnJlbW92ZURhdGEoJ2JzLicgKyB0aGF0LnR5cGUpXG4gICAgICBpZiAodGhhdC4kdGlwKSB7XG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxuICAgICAgfVxuICAgICAgdGhhdC4kdGlwID0gbnVsbFxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXG4gICAgICB0aGF0LiR2aWV3cG9ydCA9IG51bGxcbiAgICB9KVxuICB9XG5cblxuICAvLyBUT09MVElQIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IgPSBUb29sdGlwXG5cblxuICAvLyBUT09MVElQIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnRvb2x0aXAubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcbiJdfQ==