'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 2) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3');
  }
}(jQuery);

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

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.3.6';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = $(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.3.6';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target);
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault();
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.3.6';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var href;
    var $this = $(this);
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    if (!$target.hasClass('carousel')) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.3.6';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.3.6';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (! ~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.3.6';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

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

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.3.6';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.3.6';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.3.6';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxRQUFNLElBQUksS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxDQUFDLFVBQVUsQ0FBVixFQUFhO0FBQ1o7O0FBQ0EsTUFBSSxVQUFVLEVBQUUsRUFBRixDQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCLENBQWdDLEdBQWhDLENBQWQ7QUFDQSxNQUFLLFFBQVEsQ0FBUixJQUFhLENBQWIsSUFBa0IsUUFBUSxDQUFSLElBQWEsQ0FBaEMsSUFBdUMsUUFBUSxDQUFSLEtBQWMsQ0FBZCxJQUFtQixRQUFRLENBQVIsS0FBYyxDQUFqQyxJQUFzQyxRQUFRLENBQVIsSUFBYSxDQUExRixJQUFpRyxRQUFRLENBQVIsSUFBYSxDQUFsSCxFQUFzSDtBQUNwSCxVQUFNLElBQUksS0FBSixDQUFVLDJGQUFWLENBQU47QUFDRDtBQUNGLENBTkEsQ0FNQyxNQU5ELENBQUQ7Ozs7Ozs7Ozs7QUFpQkEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaOzs7OztBQUtBLFdBQVMsYUFBVCxHQUF5QjtBQUN2QixRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQVQ7O0FBRUEsUUFBSSxxQkFBcUI7QUFDdkIsd0JBQW1CLHFCQURJO0FBRXZCLHFCQUFtQixlQUZJO0FBR3ZCLG1CQUFtQiwrQkFISTtBQUl2QixrQkFBbUI7QUFKSSxLQUF6Qjs7QUFPQSxTQUFLLElBQUksSUFBVCxJQUFpQixrQkFBakIsRUFBcUM7QUFDbkMsVUFBSSxHQUFHLEtBQUgsQ0FBUyxJQUFULE1BQW1CLFNBQXZCLEVBQWtDO0FBQ2hDLGVBQU8sRUFBRSxLQUFLLG1CQUFtQixJQUFuQixDQUFQ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QVk7QUFDL0IsTUFBRSxvQkFBRixFQUF3QixJQUF4QixDQUE2QixZQUFZO0FBQ3ZDLFVBQUksT0FBTyxFQUFFLElBQUYsQ0FBWDtBQUNBLFVBQUksT0FBTyxLQUFLLElBQUwsRUFBWDs7QUFFQSxXQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsSUFBZSxFQUE3Qjs7QUFFQSxVQUFJLEtBQUssWUFBTCxJQUFxQixJQUF6QixFQUErQixLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssWUFBMUI7QUFDL0IsVUFBSSxLQUFLLFNBQUwsSUFBcUIsSUFBekIsRUFBK0IsS0FBSyxNQUFMLENBQVksR0FBWixHQUFxQixLQUFLLFNBQTFCOztBQUUvQixhQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLElBQWxCO0FBQ0QsS0FWRDtBQVdELEdBWkQ7QUFjRCxDQXhKQSxDQXdKQyxNQXhKRCxDQUFEIiwiZmlsZSI6ImJvb3RzdHJhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQm9vdHN0cmFwIHYzLjMuNiAoaHR0cDovL2dldGJvb3RzdHJhcC5jb20pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ID09PSAndW5kZWZpbmVkJykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKVxufVxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgdmVyc2lvbiA9ICQuZm4uanF1ZXJ5LnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKVxuICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPiAyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiAzJylcbiAgfVxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdHJhbnNpdGlvbi5qcyB2My4zLjZcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI3RyYW5zaXRpb25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ1NTIFRSQU5TSVRJT04gU1VQUE9SVCAoU2hvdXRvdXQ6IGh0dHA6Ly93d3cubW9kZXJuaXpyLmNvbS8pXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJylcblxuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRUcmFuc2l0aW9uIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgdHJhbnNpdGlvbiAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH1cblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4geyBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlIC8vIGV4cGxpY2l0IGZvciBpZTggKCAgLl8uKVxuICB9XG5cbiAgLy8gaHR0cDovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgJGVsID0gdGhpc1xuICAgICQodGhpcykub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWUgfSlcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkdXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVyblxuXG4gICAgJC5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZCA9IHtcbiAgICAgIGJpbmRUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoaXMpKSByZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhbGVydC5qcyB2My4zLjZcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI2FsZXJ0c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFMRVJUIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBkaXNtaXNzID0gJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSdcbiAgdmFyIEFsZXJ0ICAgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAkKGVsKS5vbignY2xpY2snLCBkaXNtaXNzLCB0aGlzLmNsb3NlKVxuICB9XG5cbiAgQWxlcnQuVkVSU0lPTiA9ICczLjMuNidcblxuICBBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgQWxlcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICAgPSAkKHRoaXMpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9ICQoc2VsZWN0b3IpXG5cbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoISRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICAkcGFyZW50ID0gJHRoaXMuY2xvc2VzdCgnLmFsZXJ0JylcbiAgICB9XG5cbiAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2Nsb3NlLmJzLmFsZXJ0JykpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KCkge1xuICAgICAgLy8gZGV0YWNoIGZyb20gcGFyZW50LCBmaXJlIGV2ZW50IHRoZW4gY2xlYW4gdXAgZGF0YVxuICAgICAgJHBhcmVudC5kZXRhY2goKS50cmlnZ2VyKCdjbG9zZWQuYnMuYWxlcnQnKS5yZW1vdmUoKVxuICAgIH1cblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkcGFyZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIHJlbW92ZUVsZW1lbnQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICByZW1vdmVFbGVtZW50KClcbiAgfVxuXG5cbiAgLy8gQUxFUlQgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5hbGVydCcpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWxlcnQnLCAoZGF0YSA9IG5ldyBBbGVydCh0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XG5cbiAgJC5mbi5hbGVydCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFsZXJ0LkNvbnN0cnVjdG9yID0gQWxlcnRcblxuXG4gIC8vIEFMRVJUIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hbGVydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWxlcnQgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBTEVSVCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYnV0dG9uLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9ICQuZXh0ZW5kKHt9LCBCdXR0b24uREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICB9XG5cbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuMy42J1xuXG4gIEJ1dHRvbi5ERUZBVUxUUyA9IHtcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGQgICAgPSAnZGlzYWJsZWQnXG4gICAgdmFyICRlbCAgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuICAgIHZhciBkYXRhID0gJGVsLmRhdGEoKVxuXG4gICAgc3RhdGUgKz0gJ1RleHQnXG5cbiAgICBpZiAoZGF0YS5yZXNldFRleHQgPT0gbnVsbCkgJGVsLmRhdGEoJ3Jlc2V0VGV4dCcsICRlbFt2YWxdKCkpXG5cbiAgICAvLyBwdXNoIHRvIGV2ZW50IGxvb3AgdG8gYWxsb3cgZm9ybXMgdG8gc3VibWl0XG4gICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXG5cbiAgICAgIGlmIChzdGF0ZSA9PSAnbG9hZGluZ1RleHQnKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhkKS5yZW1vdmVBdHRyKGQpXG4gICAgICB9XG4gICAgfSwgdGhpcyksIDApXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hhbmdlZCA9IHRydWVcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpXG5cbiAgICBpZiAoJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdyYWRpbycpIHtcbiAgICAgICAgaWYgKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICAkcGFyZW50LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIH0gZWxzZSBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGlmICgoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgIT09IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICAgIH1cbiAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICBpZiAoY2hhbmdlZCkgJGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1wcmVzc2VkJywgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICB9XG4gIH1cblxuXG4gIC8vIEJVVFRPTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYnV0dG9uJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5idXR0b24nLCAoZGF0YSA9IG5ldyBCdXR0b24odGhpcywgb3B0aW9ucykpKVxuXG4gICAgICBpZiAob3B0aW9uID09ICd0b2dnbGUnKSBkYXRhLnRvZ2dsZSgpXG4gICAgICBlbHNlIGlmIChvcHRpb24pIGRhdGEuc2V0U3RhdGUob3B0aW9uKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5idXR0b25cblxuICAkLmZuLmJ1dHRvbiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmJ1dHRvbi5Db25zdHJ1Y3RvciA9IEJ1dHRvblxuXG5cbiAgLy8gQlVUVE9OIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYnV0dG9uLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5idXR0b24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBCVVRUT04gREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldClcbiAgICAgIGlmICghJGJ0bi5oYXNDbGFzcygnYnRuJykpICRidG4gPSAkYnRuLmNsb3Nlc3QoJy5idG4nKVxuICAgICAgUGx1Z2luLmNhbGwoJGJ0biwgJ3RvZ2dsZScpXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdJykgfHwgJChlLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSlcbiAgICAub24oJ2ZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXG4gICAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNjYXJvdXNlbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENBUk9VU0VMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXG4gICAgdGhpcy5vcHRpb25zICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdXNlZCAgICAgID0gbnVsbFxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXG4gICAgdGhpcy5pbnRlcnZhbCAgICA9IG51bGxcbiAgICB0aGlzLiRhY3RpdmUgICAgID0gbnVsbFxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXG5cbiAgICB0aGlzLm9wdGlvbnMua2V5Ym9hcmQgJiYgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSlcblxuICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9PSAnaG92ZXInICYmICEoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXIuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuMy42J1xuXG4gIENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDBcblxuICBDYXJvdXNlbC5ERUZBVUxUUyA9IHtcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICB3cmFwOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgY2FzZSAzNzogdGhpcy5wcmV2KCk7IGJyZWFrXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVyblxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmN5Y2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IGZhbHNlKVxuXG4gICAgdGhpcy5pbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcbiAgICAgICYmICF0aGlzLnBhdXNlZFxuICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdGhpcy4kaXRlbXMgPSBpdGVtLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbScpXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChhY3RpdmUpXG4gICAgdmFyIHdpbGxXcmFwID0gKGRpcmVjdGlvbiA9PSAncHJldicgJiYgYWN0aXZlSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxuICAgIGlmICh3aWxsV3JhcCAmJiAhdGhpcy5vcHRpb25zLndyYXApIHJldHVybiBhY3RpdmVcbiAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT0gJ3ByZXYnID8gLTEgOiAxXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5lcShpdGVtSW5kZXgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgdmFyIHRoYXQgICAgICAgID0gdGhpc1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXG5cbiAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2xpZGluZykgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkLmJzLmNhcm91c2VsJywgZnVuY3Rpb24gKCkgeyB0aGF0LnRvKHBvcykgfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmIChhY3RpdmVJbmRleCA9PSBwb3MpIHJldHVybiB0aGlzLnBhdXNlKCkuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsIHRoaXMuJGl0ZW1zLmVxKHBvcykpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gdHJ1ZSlcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQoJy5uZXh0LCAucHJldicpLmxlbmd0aCAmJiAkLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZClcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgdmFyICRhY3RpdmUgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJylcbiAgICB2YXIgJG5leHQgICAgID0gbmV4dCB8fCB0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odHlwZSwgJGFjdGl2ZSlcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxuICAgIHZhciBkaXJlY3Rpb24gPSB0eXBlID09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB2YXIgdGhhdCAgICAgID0gdGhpc1xuXG4gICAgaWYgKCRuZXh0Lmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuICh0aGlzLnNsaWRpbmcgPSBmYWxzZSlcblxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cbiAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoJ3NsaWRlLmJzLmNhcm91c2VsJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgfSlcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZGVFdmVudClcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWRpbmcgPSB0cnVlXG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5wYXVzZSgpXG5cbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGluZGljYXRvcnMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgdmFyICRuZXh0SW5kaWNhdG9yID0gJCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoJG5leHQpXSlcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3NsaWRlJykpIHtcbiAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgJHRhcmdldCA9ICQoJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCAoaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgdmFyIHNsaWRlSW5kZXggPSAkdGhpcy5hdHRyKCdkYXRhLXNsaWRlLXRvJylcbiAgICBpZiAoc2xpZGVJbmRleCkgb3B0aW9ucy5pbnRlcnZhbCA9IGZhbHNlXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb25zKVxuXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICR0YXJnZXQuZGF0YSgnYnMuY2Fyb3VzZWwnKS50byhzbGlkZUluZGV4KVxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNhcm91c2VsID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDb2xsYXBzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLiR0cmlnZ2VyICAgICAgPSAkKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnICsgZWxlbWVudC5pZCArICdcIl0nKVxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IG51bGxcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFyZW50KSB7XG4gICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuJGVsZW1lbnQsIHRoaXMuJHRyaWdnZXIpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2dnbGUpIHRoaXMudG9nZ2xlKClcbiAgfVxuXG4gIENvbGxhcHNlLlZFUlNJT04gID0gJzMuMy42J1xuXG4gIENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzNTBcblxuICBDb2xsYXBzZS5ERUZBVUxUUyA9IHtcbiAgICB0b2dnbGU6IHRydWVcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5kaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc1dpZHRoID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnd2lkdGgnKVxuICAgIHJldHVybiBoYXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0J1xuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBhY3RpdmVzRGF0YVxuICAgIHZhciBhY3RpdmVzID0gdGhpcy4kcGFyZW50ICYmIHRoaXMuJHBhcmVudC5jaGlsZHJlbignLnBhbmVsJykuY2hpbGRyZW4oJy5pbiwgLmNvbGxhcHNpbmcnKVxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZXNEYXRhID0gYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICBpZiAoYWN0aXZlc0RhdGEgJiYgYWN0aXZlc0RhdGEudHJhbnNpdGlvbmluZykgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgUGx1Z2luLmNhbGwoYWN0aXZlcywgJ2hpZGUnKVxuICAgICAgYWN0aXZlc0RhdGEgfHwgYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScsIG51bGwpXG4gICAgfVxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKVxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylbZGltZW5zaW9uXSgwKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJylbZGltZW5zaW9uXSgnJylcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnRyaWdnZXIoJ3Nob3duLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdmFyIHNjcm9sbFNpemUgPSAkLmNhbWVsQ2FzZShbJ3Njcm9sbCcsIGRpbWVuc2lvbl0uam9pbignLScpKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50WzBdW3Njcm9sbFNpemVdKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKCkpWzBdLm9mZnNldEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgW2RpbWVuc2lvbl0oMClcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSA/ICdoaWRlJyA6ICdzaG93J10oKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJCh0aGlzLm9wdGlvbnMucGFyZW50KVxuICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyArIHRoaXMub3B0aW9ucy5wYXJlbnQgKyAnXCJdJylcbiAgICAgIC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhnZXRUYXJnZXRGcm9tVHJpZ2dlcigkZWxlbWVudCksICRlbGVtZW50KVxuICAgICAgfSwgdGhpcykpXG4gICAgICAuZW5kKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICR0cmlnZ2VyKSB7XG4gICAgdmFyIGlzT3BlbiA9ICRlbGVtZW50Lmhhc0NsYXNzKCdpbicpXG5cbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICR0cmlnZ2VyXG4gICAgICAudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcsICFpc09wZW4pXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRhcmdldEZyb21UcmlnZ2VyKCR0cmlnZ2VyKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgdGFyZ2V0ID0gJHRyaWdnZXIuYXR0cignZGF0YS10YXJnZXQnKVxuICAgICAgfHwgKGhyZWYgPSAkdHJpZ2dlci5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHJldHVybiAkKHRhcmdldClcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSAmJiBvcHRpb25zLnRvZ2dsZSAmJiAvc2hvd3xoaWRlLy50ZXN0KG9wdGlvbikpIG9wdGlvbnMudG9nZ2xlID0gZmFsc2VcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnLCAoZGF0YSA9IG5ldyBDb2xsYXBzZSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY29sbGFwc2VcblxuICAkLmZuLmNvbGxhcHNlICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY29sbGFwc2UuQ29uc3RydWN0b3IgPSBDb2xsYXBzZVxuXG5cbiAgLy8gQ09MTEFQU0UgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jb2xsYXBzZSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcblxuICAgIGlmICghJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgJHRhcmdldCA9IGdldFRhcmdldEZyb21UcmlnZ2VyKCR0aGlzKVxuICAgIHZhciBkYXRhICAgID0gJHRhcmdldC5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgdmFyIG9wdGlvbiAgPSBkYXRhID8gJ3RvZ2dsZScgOiAkdGhpcy5kYXRhKClcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbilcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuMy42XG4gKiBodHRwOi8vZ2V0Ym9vdHN0cmFwLmNvbS9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy4zLjYnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICYmICQoc2VsZWN0b3IpXG5cbiAgICByZXR1cm4gJHBhcmVudCAmJiAkcGFyZW50Lmxlbmd0aCA/ICRwYXJlbnQgOiAkdGhpcy5wYXJlbnQoKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cyhlKSB7XG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxuXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2hpZGUuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCQuRXZlbnQoJ2hpZGRlbi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH0pXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgY2xlYXJNZW51cygpXG5cbiAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxuICAgICAgICAgIC5pbnNlcnRBZnRlcigkKHRoaXMpKVxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpc1xuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcblxuICAgICAgJHBhcmVudFxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICByZXR1cm4gJHRoaXMudHJpZ2dlcignY2xpY2snKVxuICAgIH1cblxuICAgIHZhciBkZXNjID0gJyBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGEnXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcblxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXG5cbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxuICAgIGlmICghfmluZGV4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXG4gIH1cblxuXG4gIC8vIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxuXG4gICQuZm4uZHJvcGRvd24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXG5cblxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBtb2RhbC5qcyB2My4zLjZcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIE1PREFMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zICAgICAgICAgICAgID0gb3B0aW9uc1xuICAgIHRoaXMuJGJvZHkgICAgICAgICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kZGlhbG9nICAgICAgICAgICAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcubW9kYWwtZGlhbG9nJylcbiAgICB0aGlzLiRiYWNrZHJvcCAgICAgICAgICAgPSBudWxsXG4gICAgdGhpcy5pc1Nob3duICAgICAgICAgICAgID0gbnVsbFxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkICAgICA9IG51bGxcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoICAgICAgPSAwXG4gICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3RlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5maW5kKCcubW9kYWwtY29udGVudCcpXG4gICAgICAgIC5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsICQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignbG9hZGVkLmJzLm1vZGFsJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwuVkVSU0lPTiAgPSAnMy4zLjYnXG5cbiAgTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMFxuICBNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgTW9kYWwuREVGQVVMVFMgPSB7XG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgc2hvdzogdHJ1ZVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmlzU2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdzaG93LmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAodGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZVxuXG4gICAgdGhpcy5jaGVja1Njcm9sbGJhcigpXG4gICAgdGhpcy5zZXRTY3JvbGxiYXIoKVxuICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9uKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub25lKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhhdC4kZWxlbWVudCkpIHRoYXQuaWdub3JlQmFja2Ryb3BDbGljayA9IHRydWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJylcblxuICAgICAgaWYgKCF0aGF0LiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aCkge1xuICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKHRoYXQuJGJvZHkpIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgIC5zaG93KClcbiAgICAgICAgLnNjcm9sbFRvcCgwKVxuXG4gICAgICB0aGF0LmFkanVzdERpYWxvZygpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgdGhhdC5lbmZvcmNlRm9jdXMoKVxuXG4gICAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3duLmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgdGhhdC4kZGlhbG9nIC8vIHdhaXQgZm9yIG1vZGFsIHRvIHNsaWRlIGluXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBlID0gJC5FdmVudCgnaGlkZS5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2VcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICAkKGRvY3VtZW50KS5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdpbicpXG4gICAgICAub2ZmKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICAgIC5vZmYoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRkaWFsb2cub2ZmKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KHRoaXMuaGlkZU1vZGFsLCB0aGlzKSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHRoaXMuaGlkZU1vZGFsKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lbmZvcmNlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudClcbiAgICAgIC5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKSAvLyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGZvY3VzIGxvb3BcbiAgICAgIC5vbignZm9jdXNpbi5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0gIT09IGUudGFyZ2V0ICYmICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5rZXlib2FyZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93bikge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRib2R5LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcbiAgICAgIHRoYXQucmVzZXRBZGp1c3RtZW50cygpXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcbiAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuLmJzLm1vZGFsJylcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYmFja2Ryb3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXG5cbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5iYWNrZHJvcCkge1xuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgdGhpcy4kYmFja2Ryb3AgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxuICAgICAgICAuYXBwZW5kVG8odGhpcy4kYm9keSlcblxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaykge1xuICAgICAgICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcbiAgICAgICAgICA/IHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKVxuICAgICAgICAgIDogdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuXG4gICAgICBpZiAoZG9BbmltYXRlKSB0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXG5cbiAgICAgIGRvQW5pbWF0ZSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2spXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrUmVtb3ZlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrUmVtb3ZlKClcblxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGVzZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXG5cbiAgTW9kYWwucHJvdG90eXBlLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkanVzdERpYWxvZygpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYWRqdXN0RGlhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAgIXRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiB0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmICFtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZ1bGxXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaWYgKCFmdWxsV2luZG93V2lkdGgpIHsgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcbiAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBmdWxsV2luZG93V2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KVxuICAgIH1cbiAgICB0aGlzLmJvZHlJc092ZXJmbG93aW5nID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaW5kb3dXaWR0aFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLm1lYXN1cmVTY3JvbGxiYXIoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keVBhZCA9IHBhcnNlSW50KCh0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcpIHx8IDApLCAxMClcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0IHx8ICcnXG4gICAgaWYgKHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcpIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHRoaXMuc2Nyb2xsYmFyV2lkdGgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5tZWFzdXJlU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkgeyAvLyB0aHggd2Fsc2hcbiAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJ1xuICAgIHRoaXMuJGJvZHkuYXBwZW5kKHNjcm9sbERpdilcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGhcbiAgICB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHNjcm9sbERpdilcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGhcbiAgfVxuXG5cbiAgLy8gTU9EQUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uLCBfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLm1vZGFsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIE1vZGFsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLm1vZGFsJywgKGRhdGEgPSBuZXcgTW9kYWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXShfcmVsYXRlZFRhcmdldClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2hvdykgZGF0YS5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5tb2RhbFxuXG4gICQuZm4ubW9kYWwgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5tb2RhbC5Db25zdHJ1Y3RvciA9IE1vZGFsXG5cblxuICAvLyBNT0RBTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ubW9kYWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLm1vZGFsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gTU9EQUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMubW9kYWwuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgIHZhciBocmVmICAgID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgdmFyICR0YXJnZXQgPSAkKCR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgKGhyZWYgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgdmFyIG9wdGlvbiAgPSAkdGFyZ2V0LmRhdGEoJ2JzLm1vZGFsJykgPyAndG9nZ2xlJyA6ICQuZXh0ZW5kKHsgcmVtb3RlOiAhLyMvLnRlc3QoaHJlZikgJiYgaHJlZiB9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldC5vbmUoJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxuICAgICAgJHRhcmdldC5vbmUoJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRoaXMuaXMoJzp2aXNpYmxlJykgJiYgJHRoaXMudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfSlcbiAgICB9KVxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbiwgdGhpcylcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdG9vbHRpcC5qcyB2My4zLjZcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI3Rvb2x0aXBcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUT09MVElQIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy50eXBlICAgICAgID0gbnVsbFxuICAgIHRoaXMub3B0aW9ucyAgICA9IG51bGxcbiAgICB0aGlzLmVuYWJsZWQgICAgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ICAgID0gbnVsbFxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcbiAgICB0aGlzLiRlbGVtZW50ICAgPSBudWxsXG4gICAgdGhpcy5pblN0YXRlICAgID0gbnVsbFxuXG4gICAgdGhpcy5pbml0KCd0b29sdGlwJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIFRvb2x0aXAuVkVSU0lPTiAgPSAnMy4zLjYnXG5cbiAgVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVG9vbHRpcC5ERUZBVUxUUyA9IHtcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsXG4gICAgdHJpZ2dlcjogJ2hvdmVyIGZvY3VzJyxcbiAgICB0aXRsZTogJycsXG4gICAgZGVsYXk6IDAsXG4gICAgaHRtbDogZmFsc2UsXG4gICAgY29udGFpbmVyOiBmYWxzZSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgIHBhZGRpbmc6IDBcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVuYWJsZWQgICA9IHRydWVcbiAgICB0aGlzLnR5cGUgICAgICA9IHR5cGVcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKVxuICAgIHRoaXMuJHZpZXdwb3J0ID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmICQoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCkgPyB0aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLCB0aGlzLiRlbGVtZW50KSA6ICh0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLnZpZXdwb3J0KSlcbiAgICB0aGlzLmluU3RhdGUgICA9IHsgY2xpY2s6IGZhbHNlLCBob3ZlcjogZmFsc2UsIGZvY3VzOiBmYWxzZSB9XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXSBpbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yICYmICF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlbGVjdG9yYCBvcHRpb24gbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgJyArIHRoaXMudHlwZSArICcgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhJylcbiAgICB9XG5cbiAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdCgnICcpXG5cbiAgICBmb3IgKHZhciBpID0gdHJpZ2dlcnMubGVuZ3RoOyBpLS07KSB7XG4gICAgICB2YXIgdHJpZ2dlciA9IHRyaWdnZXJzW2ldXG5cbiAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMudG9nZ2xlLCB0aGlzKSlcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAhPSAnbWFudWFsJykge1xuICAgICAgICB2YXIgZXZlbnRJbiAgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXNpbidcbiAgICAgICAgdmFyIGV2ZW50T3V0ID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlbGVhdmUnIDogJ2ZvY3Vzb3V0J1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRJbiAgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmVudGVyLCB0aGlzKSlcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudE91dCArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMubGVhdmUsIHRoaXMpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5zZWxlY3RvciA/XG4gICAgICAodGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHsgdHJpZ2dlcjogJ21hbnVhbCcsIHNlbGVjdG9yOiAnJyB9KSkgOlxuICAgICAgdGhpcy5maXhUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gVG9vbHRpcC5ERUZBVUxUU1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldERlZmF1bHRzKCksIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKVxuXG4gICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgdHlwZW9mIG9wdGlvbnMuZGVsYXkgPT0gJ251bWJlcicpIHtcbiAgICAgIG9wdGlvbnMuZGVsYXkgPSB7XG4gICAgICAgIHNob3c6IG9wdGlvbnMuZGVsYXksXG4gICAgICAgIGhpZGU6IG9wdGlvbnMuZGVsYXlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zICA9IHt9XG4gICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0cygpXG5cbiAgICB0aGlzLl9vcHRpb25zICYmICQuZWFjaCh0aGlzLl9vcHRpb25zLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKGRlZmF1bHRzW2tleV0gIT0gdmFsdWUpIG9wdGlvbnNba2V5XSA9IHZhbHVlXG4gICAgfSlcblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbnRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c2luJyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSB8fCBzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykge1xuICAgICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdykgcmV0dXJuIHNlbGYuc2hvdygpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmlzSW5TdGF0ZVRydWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaW5TdGF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5TdGF0ZVtrZXldKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNvdXQnID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHJldHVyblxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdvdXQnXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpIHJldHVybiBzZWxmLmhpZGUoKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdvdXQnKSBzZWxmLmhpZGUoKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5oaWRlKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICh0aGlzLmhhc0NvbnRlbnQoKSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICB2YXIgaW5Eb20gPSAkLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaW5Eb20pIHJldHVyblxuICAgICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuXG4gICAgICB2YXIgdGlwSWQgPSB0aGlzLmdldFVJRCh0aGlzLnR5cGUpXG5cbiAgICAgIHRoaXMuc2V0Q29udGVudCgpXG4gICAgICAkdGlwLmF0dHIoJ2lkJywgdGlwSWQpXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24pICR0aXAuYWRkQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICB2YXIgcGxhY2VtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLCAkdGlwWzBdLCB0aGlzLiRlbGVtZW50WzBdKSA6XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnRcblxuICAgICAgdmFyIGF1dG9Ub2tlbiA9IC9cXHM/YXV0bz9cXHM/L2lcbiAgICAgIHZhciBhdXRvUGxhY2UgPSBhdXRvVG9rZW4udGVzdChwbGFjZW1lbnQpXG4gICAgICBpZiAoYXV0b1BsYWNlKSBwbGFjZW1lbnQgPSBwbGFjZW1lbnQucmVwbGFjZShhdXRvVG9rZW4sICcnKSB8fCAndG9wJ1xuXG4gICAgICAkdGlwXG4gICAgICAgIC5kZXRhY2goKVxuICAgICAgICAuY3NzKHsgdG9wOiAwLCBsZWZ0OiAwLCBkaXNwbGF5OiAnYmxvY2snIH0pXG4gICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICAgIC5kYXRhKCdicy4nICsgdGhpcy50eXBlLCB0aGlzKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyID8gJHRpcC5hcHBlbmRUbyh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSA6ICR0aXAuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudClcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaW5zZXJ0ZWQuYnMuJyArIHRoaXMudHlwZSlcblxuICAgICAgdmFyIHBvcyAgICAgICAgICA9IHRoaXMuZ2V0UG9zaXRpb24oKVxuICAgICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgICBpZiAoYXV0b1BsYWNlKSB7XG4gICAgICAgIHZhciBvcmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRcbiAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgJiYgcG9zLmJvdHRvbSArIGFjdHVhbEhlaWdodCA+IHZpZXdwb3J0RGltLmJvdHRvbSA/ICd0b3AnICAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgICYmIHBvcy50b3AgICAgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgICAgPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAncmlnaHQnICAmJiBwb3MucmlnaHQgICsgYWN0dWFsV2lkdGggID4gdmlld3BvcnREaW0ud2lkdGggID8gJ2xlZnQnICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgJiYgcG9zLmxlZnQgICAtIGFjdHVhbFdpZHRoICA8IHZpZXdwb3J0RGltLmxlZnQgICA/ICdyaWdodCcgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50XG5cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcmdQbGFjZW1lbnQpXG4gICAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGN1bGF0ZWRPZmZzZXQgPSB0aGlzLmdldENhbGN1bGF0ZWRPZmZzZXQocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQoY2FsY3VsYXRlZE9mZnNldCwgcGxhY2VtZW50KVxuXG4gICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2SG92ZXJTdGF0ZSA9IHRoYXQuaG92ZXJTdGF0ZVxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3duLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICAgIHRoYXQuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgICAgICBpZiAocHJldkhvdmVyU3RhdGUgPT0gJ291dCcpIHRoYXQubGVhdmUodGhhdClcbiAgICAgIH1cblxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICAkdGlwXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjb21wbGV0ZSgpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0LCBwbGFjZW1lbnQpIHtcbiAgICB2YXIgJHRpcCAgID0gdGhpcy50aXAoKVxuICAgIHZhciB3aWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAvLyBtYW51YWxseSByZWFkIG1hcmdpbnMgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaW5jbHVkZXMgZGlmZmVyZW5jZVxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLXRvcCcpLCAxMClcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMClcblxuICAgIC8vIHdlIG11c3QgY2hlY2sgZm9yIE5hTiBmb3IgaWUgOC85XG4gICAgaWYgKGlzTmFOKG1hcmdpblRvcCkpICBtYXJnaW5Ub3AgID0gMFxuICAgIGlmIChpc05hTihtYXJnaW5MZWZ0KSkgbWFyZ2luTGVmdCA9IDBcblxuICAgIG9mZnNldC50b3AgICs9IG1hcmdpblRvcFxuICAgIG9mZnNldC5sZWZ0ICs9IG1hcmdpbkxlZnRcblxuICAgIC8vICQuZm4ub2Zmc2V0IGRvZXNuJ3Qgcm91bmQgcGl4ZWwgdmFsdWVzXG4gICAgLy8gc28gd2UgdXNlIHNldE9mZnNldCBkaXJlY3RseSB3aXRoIG91ciBvd24gZnVuY3Rpb24gQi0wXG4gICAgJC5vZmZzZXQuc2V0T2Zmc2V0KCR0aXBbMF0sICQuZXh0ZW5kKHtcbiAgICAgIHVzaW5nOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgJHRpcC5jc3Moe1xuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChwcm9wcy50b3ApLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQocHJvcHMubGVmdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBvZmZzZXQpLCAwKVxuXG4gICAgJHRpcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHBsYWNpbmcgdGlwIGluIG5ldyBvZmZzZXQgY2F1c2VkIHRoZSB0aXAgdG8gcmVzaXplIGl0c2VsZlxuICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICBpZiAocGxhY2VtZW50ID09ICd0b3AnICYmIGFjdHVhbEhlaWdodCAhPSBoZWlnaHQpIHtcbiAgICAgIG9mZnNldC50b3AgPSBvZmZzZXQudG9wICsgaGVpZ2h0IC0gYWN0dWFsSGVpZ2h0XG4gICAgfVxuXG4gICAgdmFyIGRlbHRhID0gdGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEocGxhY2VtZW50LCBvZmZzZXQsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICBpZiAoZGVsdGEubGVmdCkgb2Zmc2V0LmxlZnQgKz0gZGVsdGEubGVmdFxuICAgIGVsc2Ugb2Zmc2V0LnRvcCArPSBkZWx0YS50b3BcblxuICAgIHZhciBpc1ZlcnRpY2FsICAgICAgICAgID0gL3RvcHxib3R0b20vLnRlc3QocGxhY2VtZW50KVxuICAgIHZhciBhcnJvd0RlbHRhICAgICAgICAgID0gaXNWZXJ0aWNhbCA/IGRlbHRhLmxlZnQgKiAyIC0gd2lkdGggKyBhY3R1YWxXaWR0aCA6IGRlbHRhLnRvcCAqIDIgLSBoZWlnaHQgKyBhY3R1YWxIZWlnaHRcbiAgICB2YXIgYXJyb3dPZmZzZXRQb3NpdGlvbiA9IGlzVmVydGljYWwgPyAnb2Zmc2V0V2lkdGgnIDogJ29mZnNldEhlaWdodCdcblxuICAgICR0aXAub2Zmc2V0KG9mZnNldClcbiAgICB0aGlzLnJlcGxhY2VBcnJvdyhhcnJvd0RlbHRhLCAkdGlwWzBdW2Fycm93T2Zmc2V0UG9zaXRpb25dLCBpc1ZlcnRpY2FsKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUucmVwbGFjZUFycm93ID0gZnVuY3Rpb24gKGRlbHRhLCBkaW1lbnNpb24sIGlzVmVydGljYWwpIHtcbiAgICB0aGlzLmFycm93KClcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnLCA1MCAqICgxIC0gZGVsdGEgLyBkaW1lbnNpb24pICsgJyUnKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCcsICcnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpXG5cbiAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJylbdGhpcy5vcHRpb25zLmh0bWwgPyAnaHRtbCcgOiAndGV4dCddKHRpdGxlKVxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgJHRpcCA9ICQodGhpcy4kdGlwKVxuICAgIHZhciBlICAgID0gJC5FdmVudCgnaGlkZS5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBpZiAodGhhdC5ob3ZlclN0YXRlICE9ICdpbicpICR0aXAuZGV0YWNoKClcbiAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKVxuICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHRpcFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgY29tcGxldGUoKVxuXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICBpZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcblxuICAgIHZhciBlbCAgICAgPSAkZWxlbWVudFswXVxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xuXG4gICAgdmFyIGVsUmVjdCAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XG4gICAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNzaW5nIGluIElFOCwgc28gY29tcHV0ZSB0aGVtIG1hbnVhbGx5OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDA5M1xuICAgICAgZWxSZWN0ID0gJC5leHRlbmQoe30sIGVsUmVjdCwgeyB3aWR0aDogZWxSZWN0LnJpZ2h0IC0gZWxSZWN0LmxlZnQsIGhlaWdodDogZWxSZWN0LmJvdHRvbSAtIGVsUmVjdC50b3AgfSlcbiAgICB9XG4gICAgdmFyIGVsT2Zmc2V0ICA9IGlzQm9keSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAkZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciBzY3JvbGwgICAgPSB7IHNjcm9sbDogaXNCb2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6ICRlbGVtZW50LnNjcm9sbFRvcCgpIH1cbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGVsUmVjdCwgc2Nyb2xsLCBvdXRlckRpbXMsIGVsT2Zmc2V0KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldCA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgPyB7IHRvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCB9IDpcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cblxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgdmFyIGRlbHRhID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxuXG4gICAgdmFyIHZpZXdwb3J0UGFkZGluZyA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiB0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZyB8fCAwXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICBpZiAoL3JpZ2h0fGxlZnQvLnRlc3QocGxhY2VtZW50KSkge1xuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxuICAgICAgdmFyIGJvdHRvbUVkZ2VPZmZzZXQgPSBwb3MudG9wICsgdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbCArIGFjdHVhbEhlaWdodFxuICAgICAgaWYgKHRvcEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMudG9wKSB7IC8vIHRvcCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChib3R0b21FZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQpIHsgLy8gYm90dG9tIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC0gYm90dG9tRWRnZU9mZnNldFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVmdEVkZ2VPZmZzZXQgID0gcG9zLmxlZnQgLSB2aWV3cG9ydFBhZGRpbmdcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXG4gICAgICBpZiAobGVmdEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCkgeyAvLyBsZWZ0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCAtIGxlZnRFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgKyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGggLSByaWdodEVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsdGFcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZVxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHRpdGxlID0gJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpXG4gICAgICB8fCAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJyA/IG8udGl0bGUuY2FsbCgkZVswXSkgOiAgby50aXRsZSlcblxuICAgIHJldHVybiB0aXRsZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIGRvIHByZWZpeCArPSB+fihNYXRoLnJhbmRvbSgpICogMTAwMDAwMClcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcbiAgICByZXR1cm4gcHJlZml4XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxuICAgICAgaWYgKHRoaXMuJHRpcC5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiR0aXBcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmIChlKSB7XG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG4gICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZS5jbGljayA9ICFzZWxmLmluU3RhdGUuY2xpY2tcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxuICAgICAgZWxzZSBzZWxmLmxlYXZlKHNlbGYpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB0aGlzLmhpZGUoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vZmYoJy4nICsgdGhhdC50eXBlKS5yZW1vdmVEYXRhKCdicy4nICsgdGhhdC50eXBlKVxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xuICAgICAgICB0aGF0LiR0aXAuZGV0YWNoKClcbiAgICAgIH1cbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcbiAgICAgIHRoYXQuJGFycm93ID0gbnVsbFxuICAgICAgdGhhdC4kdmlld3BvcnQgPSBudWxsXG4gICAgfSlcbiAgfVxuXG5cbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuXG5cbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jcG9wb3ZlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghJC5mbi50b29sdGlwKSB0aHJvdyBuZXcgRXJyb3IoJ1BvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qcycpXG5cbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjMuNidcblxuICBQb3BvdmVyLkRFRkFVTFRTID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUywge1xuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuICAvLyBOT1RFOiBQT1BPVkVSIEVYVEVORFMgdG9vbHRpcC5qc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIFBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlICAgPSB0aGlzLmdldFRpdGxlKClcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJylbdGhpcy5vcHRpb25zLmh0bWwgPyAnaHRtbCcgOiAndGV4dCddKHRpdGxlKVxuICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbIC8vIHdlIHVzZSBhcHBlbmQgZm9yIGh0bWwgb2JqZWN0cyB0byBtYWludGFpbiBqcyBldmVudHNcbiAgICAgIHRoaXMub3B0aW9ucy5odG1sID8gKHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCcpIDogJ3RleHQnXG4gICAgXShjb250ZW50KVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuXG4gICAgLy8gSUU4IGRvZXNuJ3QgYWNjZXB0IGhpZGluZyB2aWEgdGhlIGA6ZW1wdHlgIHBzZXVkbyBzZWxlY3Rvciwgd2UgaGF2ZSB0byBkb1xuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxuICAgIGlmICghJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwoKSkgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmhpZGUoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuZ2V0Q29udGVudCgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuICAgICAgfHwgKHR5cGVvZiBvLmNvbnRlbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxuICAgICAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jc2Nyb2xsc3B5XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gU0NST0xMU1BZIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBTY3JvbGxTcHkoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGJvZHkgICAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICQoZWxlbWVudCkuaXMoZG9jdW1lbnQuYm9keSkgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgICA9ICQuZXh0ZW5kKHt9LCBTY3JvbGxTcHkuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5zZWxlY3RvciAgICAgICA9ICh0aGlzLm9wdGlvbnMudGFyZ2V0IHx8ICcnKSArICcgLm5hdiBsaSA+IGEnXG4gICAgdGhpcy5vZmZzZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgICA9IG51bGxcbiAgICB0aGlzLnNjcm9sbEhlaWdodCAgID0gMFxuXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudC5vbignc2Nyb2xsLmJzLnNjcm9sbHNweScsICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSlcbiAgICB0aGlzLnJlZnJlc2goKVxuICAgIHRoaXMucHJvY2VzcygpXG4gIH1cblxuICBTY3JvbGxTcHkuVkVSU0lPTiAgPSAnMy4zLjYnXG5cbiAgU2Nyb2xsU3B5LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMTBcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodCB8fCBNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodClcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgICA9IHRoaXNcbiAgICB2YXIgb2Zmc2V0TWV0aG9kICA9ICdvZmZzZXQnXG4gICAgdmFyIG9mZnNldEJhc2UgICAgPSAwXG5cbiAgICB0aGlzLm9mZnNldHMgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgPSBbXVxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuXG4gICAgaWYgKCEkLmlzV2luZG93KHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0pKSB7XG4gICAgICBvZmZzZXRNZXRob2QgPSAncG9zaXRpb24nXG4gICAgICBvZmZzZXRCYXNlICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpXG4gICAgfVxuXG4gICAgdGhpcy4kYm9keVxuICAgICAgLmZpbmQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGVsICAgPSAkKHRoaXMpXG4gICAgICAgIHZhciBocmVmICA9ICRlbC5kYXRhKCd0YXJnZXQnKSB8fCAkZWwuYXR0cignaHJlZicpXG4gICAgICAgIHZhciAkaHJlZiA9IC9eIy4vLnRlc3QoaHJlZikgJiYgJChocmVmKVxuXG4gICAgICAgIHJldHVybiAoJGhyZWZcbiAgICAgICAgICAmJiAkaHJlZi5sZW5ndGhcbiAgICAgICAgICAmJiAkaHJlZi5pcygnOnZpc2libGUnKVxuICAgICAgICAgICYmIFtbJGhyZWZbb2Zmc2V0TWV0aG9kXSgpLnRvcCArIG9mZnNldEJhc2UsIGhyZWZdXSkgfHwgbnVsbFxuICAgICAgfSlcbiAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhWzBdIC0gYlswXSB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Lm9mZnNldHMucHVzaCh0aGlzWzBdKVxuICAgICAgICB0aGF0LnRhcmdldHMucHVzaCh0aGlzWzFdKVxuICAgICAgfSlcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSArIHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuICAgIHZhciBtYXhTY3JvbGwgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgc2Nyb2xsSGVpZ2h0IC0gdGhpcy4kc2Nyb2xsRWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXRzICAgICAgPSB0aGlzLm9mZnNldHNcbiAgICB2YXIgdGFyZ2V0cyAgICAgID0gdGhpcy50YXJnZXRzXG4gICAgdmFyIGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0XG4gICAgdmFyIGlcblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHJldHVybiBhY3RpdmVUYXJnZXQgIT0gKGkgPSB0YXJnZXRzW3RhcmdldHMubGVuZ3RoIC0gMV0pICYmIHRoaXMuYWN0aXZhdGUoaSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlVGFyZ2V0ICYmIHNjcm9sbFRvcCA8IG9mZnNldHNbMF0pIHtcbiAgICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gbnVsbFxuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKVxuICAgIH1cblxuICAgIGZvciAoaSA9IG9mZnNldHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICBhY3RpdmVUYXJnZXQgIT0gdGFyZ2V0c1tpXVxuICAgICAgICAmJiBzY3JvbGxUb3AgPj0gb2Zmc2V0c1tpXVxuICAgICAgICAmJiAob2Zmc2V0c1tpICsgMV0gPT09IHVuZGVmaW5lZCB8fCBzY3JvbGxUb3AgPCBvZmZzZXRzW2kgKyAxXSlcbiAgICAgICAgJiYgdGhpcy5hY3RpdmF0ZSh0YXJnZXRzW2ldKVxuICAgIH1cbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSB0YXJnZXRcblxuICAgIHRoaXMuY2xlYXIoKVxuXG4gICAgdmFyIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArXG4gICAgICAnW2RhdGEtdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIl0sJyArXG4gICAgICB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXG5cbiAgICB2YXIgYWN0aXZlID0gJChzZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzKCdsaScpXG4gICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICBpZiAoYWN0aXZlLnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgYWN0aXZlLnRyaWdnZXIoJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCwgJy5hY3RpdmUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JywgKGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcblxuICAkLmZuLnNjcm9sbHNweSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxuXG5cbiAgLy8gU0NST0xMU1BZIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5zY3JvbGxzcHkgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdGFiLmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jdGFic1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRBQiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRhYiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8ganNjczpkaXNhYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KVxuICAgIC8vIGpzY3M6ZW5hYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gIH1cblxuICBUYWIuVkVSU0lPTiA9ICczLjMuNidcblxuICBUYWIuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRhYi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgICAgPSB0aGlzLmVsZW1lbnRcbiAgICB2YXIgJHVsICAgICAgPSAkdGhpcy5jbG9zZXN0KCd1bDpub3QoLmRyb3Bkb3duLW1lbnUpJylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBpZiAoJHRoaXMucGFyZW50KCdsaScpLmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHByZXZpb3VzID0gJHVsLmZpbmQoJy5hY3RpdmU6bGFzdCBhJylcbiAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgIH0pXG4gICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgfSlcblxuICAgICRwcmV2aW91cy50cmlnZ2VyKGhpZGVFdmVudClcbiAgICAkdGhpcy50cmlnZ2VyKHNob3dFdmVudClcblxuICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciAkdGFyZ2V0ID0gJChzZWxlY3RvcilcblxuICAgIHRoaXMuYWN0aXZhdGUoJHRoaXMuY2xvc2VzdCgnbGknKSwgJHVsKVxuICAgIHRoaXMuYWN0aXZhdGUoJHRhcmdldCwgJHRhcmdldC5wYXJlbnQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHByZXZpb3VzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnaGlkZGVuLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgICB9KVxuICAgICAgJHRoaXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdzaG93bi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIFRhYi5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgIHZhciAkYWN0aXZlICAgID0gY29udGFpbmVyLmZpbmQoJz4gLmFjdGl2ZScpXG4gICAgdmFyIHRyYW5zaXRpb24gPSBjYWxsYmFja1xuICAgICAgJiYgJC5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgICYmICgkYWN0aXZlLmxlbmd0aCAmJiAkYWN0aXZlLmhhc0NsYXNzKCdmYWRlJykgfHwgISFjb250YWluZXIuZmluZCgnPiAuZmFkZScpLmxlbmd0aClcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJz4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlJylcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5lbmQoKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgICBlbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICBlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIHJlZmxvdyBmb3IgdHJhbnNpdGlvblxuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdpbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdmYWRlJylcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgICRhY3RpdmUubGVuZ3RoICYmIHRyYW5zaXRpb24gP1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBuZXh0KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVGFiLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIG5leHQoKVxuXG4gICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnaW4nKVxuICB9XG5cblxuICAvLyBUQUIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMudGFiJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50YWInLCAoZGF0YSA9IG5ldyBUYWIodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRhYlxuXG4gICQuZm4udGFiICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udGFiLkNvbnN0cnVjdG9yID0gVGFiXG5cblxuICAvLyBUQUIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJC5mbi50YWIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRhYiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFRBQiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBQbHVnaW4uY2FsbCgkKHRoaXMpLCAnc2hvdycpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJwaWxsXCJdJywgY2xpY2tIYW5kbGVyKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhZmZpeC5qcyB2My4zLjZcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tL2phdmFzY3JpcHQvI2FmZml4XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUZGSVggQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEFmZml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQWZmaXguREVGQVVMVFMsIG9wdGlvbnMpXG5cbiAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMub3B0aW9ucy50YXJnZXQpXG4gICAgICAub24oJ3Njcm9sbC5icy5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYnMuYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLCB0aGlzKSlcblxuICAgIHRoaXMuJGVsZW1lbnQgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuYWZmaXhlZCAgICAgID0gbnVsbFxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxuICAgIHRoaXMucGlubmVkT2Zmc2V0ID0gbnVsbFxuXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgfVxuXG4gIEFmZml4LlZFUlNJT04gID0gJzMuMy42J1xuXG4gIEFmZml4LlJFU0VUICAgID0gJ2FmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b20nXG5cbiAgQWZmaXguREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAwLFxuICAgIHRhcmdldDogd2luZG93XG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgICAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHRoaXMuYWZmaXhlZCA9PSAndG9wJykgcmV0dXJuIHNjcm9sbFRvcCA8IG9mZnNldFRvcCA/ICd0b3AnIDogZmFsc2VcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgPT0gJ2JvdHRvbScpIHtcbiAgICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCkgcmV0dXJuIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXG4gICAgdmFyIGNvbGxpZGVyVG9wICAgID0gaW5pdGlhbGl6aW5nID8gc2Nyb2xsVG9wIDogcG9zaXRpb24udG9wXG4gICAgdmFyIGNvbGxpZGVySGVpZ2h0ID0gaW5pdGlhbGl6aW5nID8gdGFyZ2V0SGVpZ2h0IDogaGVpZ2h0XG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCkgcmV0dXJuICd0b3AnXG4gICAgaWYgKG9mZnNldEJvdHRvbSAhPSBudWxsICYmIChjb2xsaWRlclRvcCArIGNvbGxpZGVySGVpZ2h0ID49IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkpIHJldHVybiAnYm90dG9tJ1xuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBpbm5lZE9mZnNldCkgcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm5cblxuICAgIHZhciBoZWlnaHQgICAgICAgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldCAgICAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxuICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KCQoZG9jdW1lbnQpLmhlaWdodCgpLCAkKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKVxuXG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgIT0gJ29iamVjdCcpICAgICAgICAgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0VG9wID0gb2Zmc2V0XG4gICAgaWYgKHR5cGVvZiBvZmZzZXRUb3AgPT0gJ2Z1bmN0aW9uJykgICAgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcCh0aGlzLiRlbGVtZW50KVxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcblxuICAgIHZhciBhZmZpeCA9IHRoaXMuZ2V0U3RhdGUoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCAhPSBhZmZpeCkge1xuICAgICAgaWYgKHRoaXMudW5waW4gIT0gbnVsbCkgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsICcnKVxuXG4gICAgICB2YXIgYWZmaXhUeXBlID0gJ2FmZml4JyArIChhZmZpeCA/ICctJyArIGFmZml4IDogJycpXG4gICAgICB2YXIgZSAgICAgICAgID0gJC5FdmVudChhZmZpeFR5cGUgKyAnLmJzLmFmZml4JylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgdGhpcy5hZmZpeGVkID0gYWZmaXhcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxuICAgICAgICAuYWRkQ2xhc3MoYWZmaXhUeXBlKVxuICAgICAgICAudHJpZ2dlcihhZmZpeFR5cGUucmVwbGFjZSgnYWZmaXgnLCAnYWZmaXhlZCcpICsgJy5icy5hZmZpeCcpXG4gICAgfVxuXG4gICAgaWYgKGFmZml4ID09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XG4gICAgICAgIHRvcDogc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0IC0gb2Zmc2V0Qm90dG9tXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQUZGSVggUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYWZmaXgnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XG5cbiAgJC5mbi5hZmZpeCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcblxuXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWZmaXggPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBRkZJWCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXG5cbiAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwge31cblxuICAgICAgaWYgKGRhdGEub2Zmc2V0Qm90dG9tICE9IG51bGwpIGRhdGEub2Zmc2V0LmJvdHRvbSA9IGRhdGEub2Zmc2V0Qm90dG9tXG4gICAgICBpZiAoZGF0YS5vZmZzZXRUb3AgICAgIT0gbnVsbCkgZGF0YS5vZmZzZXQudG9wICAgID0gZGF0YS5vZmZzZXRUb3BcblxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgZGF0YSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG4iXX0=