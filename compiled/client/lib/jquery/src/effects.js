"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./var/document", "./var/rcssNum", "./css/var/cssExpand", "./var/rnotwhite", "./css/var/isHidden", "./css/adjustCSS", "./css/defaultDisplay", "./data/var/dataPriv", "./core/init", "./effects/Tween", "./queue", "./css", "./deferred", "./traversing"], function (jQuery, document, rcssNum, cssExpand, rnotwhite, isHidden, adjustCSS, defaultDisplay, dataPriv) {

	var fxNow,
	    timerId,
	    rfxtypes = /^(?:toggle|show|hide)$/,
	    rrun = /queueHooks$/;

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return fxNow = jQuery.now();
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
		    i = 0,
		    attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
		    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
		    index = 0,
		    length = collection.length;
		for (; index < length; index++) {
			if (tween = collection[index].call(animation, prop, value)) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		/* jshint validthis: true */
		var prop,
		    value,
		    toggle,
		    tween,
		    hooks,
		    oldfire,
		    display,
		    checkDisplay,
		    anim = this,
		    orig = {},
		    style = elem.style,
		    hidden = elem.nodeType && isHidden(elem),
		    dataShow = dataPriv.get(elem, "fxshow");

		// Handle queue: false promises
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Height/width overflow pass
		if (elem.nodeType === 1 && ("height" in props || "width" in props)) {

			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css(elem, "display");

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ? dataPriv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

			if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
				style.display = "inline-block";
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// show/hide pass
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.exec(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

				// Any non-fx value stops us from restoring the original display value
			} else {
					display = undefined;
				}
		}

		if (!jQuery.isEmptyObject(orig)) {
			if (dataShow) {
				if ("hidden" in dataShow) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access(elem, "fxshow", {});
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if (toggle) {
				dataShow.hidden = !hidden;
			}
			if (hidden) {
				jQuery(elem).show();
			} else {
				anim.done(function () {
					jQuery(elem).hide();
				});
			}
			anim.done(function () {
				var prop;

				dataPriv.remove(elem, "fxshow");
				for (prop in orig) {
					jQuery.style(elem, prop, orig[prop]);
				}
			});
			for (prop in orig) {
				tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

				if (!(prop in dataShow)) {
					dataShow[prop] = tween.start;
					if (hidden) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

			// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
				style.display = display;
			}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (jQuery.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
		    stopped,
		    index = 0,
		    length = Animation.prefilters.length,
		    deferred = jQuery.Deferred().always(function () {

			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		    tick = function tick() {
			if (stopped) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
			    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


			// Support: Android 2.3
			// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
			temp = remaining / animation.duration || 0,
			    percent = 1 - temp,
			    index = 0,
			    length = animation.tweens.length;

			for (; index < length; index++) {
				animation.tweens[index].run(percent);
			}

			deferred.notifyWith(elem, [animation, percent, remaining]);

			if (percent < 1 && length) {
				return remaining;
			} else {
				deferred.resolveWith(elem, [animation]);
				return false;
			}
		},
		    animation = deferred.promise({
			elem: elem,
			props: jQuery.extend({}, properties),
			opts: jQuery.extend(true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function createTween(prop, end) {
				var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
				animation.tweens.push(tween);
				return tween;
			},
			stop: function stop(gotoEnd) {
				var index = 0,


				// If we are going to the end, we want to run all the tweens
				// otherwise we skip this part
				length = gotoEnd ? animation.tweens.length : 0;
				if (stopped) {
					return this;
				}
				stopped = true;
				for (; index < length; index++) {
					animation.tweens[index].run(1);
				}

				// Resolve when we played the last frame; otherwise, reject
				if (gotoEnd) {
					deferred.notifyWith(elem, [animation, 1, 0]);
					deferred.resolveWith(elem, [animation, gotoEnd]);
				} else {
					deferred.rejectWith(elem, [animation, gotoEnd]);
				}
				return this;
			}
		}),
		    props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		}));

		// attach callbacks from options
		return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
	}

	jQuery.Animation = jQuery.extend(Animation, {
		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function tweener(props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnotwhite);
			}

			var prop,
			    index = 0,
			    length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHidden).css("opacity", 0).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
			    optall = jQuery.speed(speed, easing, callback),
			    doAnimation = function doAnimation() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation(this, jQuery.extend({}, prop), optall);

				// Empty animations, or finishing resolves immediately
				if (empty || dataPriv.get(this, "finish")) {
					anim.stop(true);
				}
			};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
				    index = type != null && type + "queueHooks",
				    timers = jQuery.timers,
				    data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
				    data = dataPriv.get(this),
				    queue = data[type + "queue"],
				    hooks = data[type + "queueHooks"],
				    timers = jQuery.timers,
				    length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
		    i = 0,
		    timers = jQuery.timers;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Checks the timer has not already been removed
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		if (timer()) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (!timerId) {
			timerId = window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
		}
	};

	jQuery.fx.stop = function () {
		window.clearInterval(timerId);

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9lZmZlY3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsZUFITyxFQUlQLHFCQUpPLEVBS1AsaUJBTE8sRUFNUCxvQkFOTyxFQU9QLGlCQVBPLEVBUVAsc0JBUk8sRUFTUCxxQkFUTyxFQVdQLGFBWE8sRUFZUCxpQkFaTyxFQWFQLFNBYk8sRUFjUCxPQWRPLEVBZVAsWUFmTyxFQWdCUCxjQWhCTyxDQUFSLEVBaUJHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixPQUE1QixFQUFxQyxTQUFyQyxFQUFnRCxTQUFoRCxFQUNGLFFBREUsRUFDUSxTQURSLEVBQ21CLGNBRG5CLEVBQ21DLFFBRG5DLEVBQzhDOztBQUVqRCxLQUNDLEtBREQ7S0FDUSxPQURSO0tBRUMsV0FBVyx3QkFGWjtLQUdDLE9BQU8sYUFIUjs7O0FBTUEsVUFBUyxXQUFULEdBQXVCO0FBQ3RCLFNBQU8sVUFBUCxDQUFtQixZQUFXO0FBQzdCLFdBQVEsU0FBUjtBQUNBLEdBRkQ7QUFHQSxTQUFTLFFBQVEsT0FBTyxHQUFQLEVBQWpCO0FBQ0E7OztBQUdELFVBQVMsS0FBVCxDQUFnQixJQUFoQixFQUFzQixZQUF0QixFQUFxQztBQUNwQyxNQUFJLEtBQUo7TUFDQyxJQUFJLENBREw7TUFFQyxRQUFRLEVBQUUsUUFBUSxJQUFWLEVBRlQ7Ozs7QUFNQSxpQkFBZSxlQUFlLENBQWYsR0FBbUIsQ0FBbEM7QUFDQSxTQUFRLElBQUksQ0FBWixFQUFnQixLQUFLLElBQUksWUFBekIsRUFBd0M7QUFDdkMsV0FBUSxVQUFXLENBQVgsQ0FBUjtBQUNBLFNBQU8sV0FBVyxLQUFsQixJQUE0QixNQUFPLFlBQVksS0FBbkIsSUFBNkIsSUFBekQ7QUFDQTs7QUFFRCxNQUFLLFlBQUwsRUFBb0I7QUFDbkIsU0FBTSxPQUFOLEdBQWdCLE1BQU0sS0FBTixHQUFjLElB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QVEsQ0FBUixDQUFSOzs7QUFHQSxPQUFLLENBQUMsT0FBRCxJQUFZLE9BQVEsQ0FBUixNQUFnQixLQUFqQyxFQUF5QztBQUN4QyxXQUFPLE1BQVAsQ0FBZSxHQUFmLEVBQW9CLENBQXBCO0FBQ0E7QUFDRDs7QUFFRCxNQUFLLENBQUMsT0FBTyxNQUFiLEVBQXNCO0FBQ3JCLFVBQU8sRUFBUCxDQUFVLElBQVY7QUFDQTtBQUNELFVBQVEsU0FBUjtBQUNBLEVBcEJEOztBQXNCQSxRQUFPLEVBQVAsQ0FBVSxLQUFWLEdBQWtCLFVBQVUsS0FBVixFQUFrQjtBQUNuQyxTQUFPLE1BQVAsQ0FBYyxJQUFkLENBQW9CLEtBQXBCO0FBQ0EsTUFBSyxPQUFMLEVBQWU7QUFDZCxVQUFPLEVBQVAsQ0FBVSxLQUFWO0FBQ0EsR0FGRCxNQUVPO0FBQ04sVUFBTyxNQUFQLENBQWMsR0FBZDtBQUNBO0FBQ0QsRUFQRDs7QUFTQSxRQUFPLEVBQVAsQ0FBVSxRQUFWLEdBQXFCLEVBQXJCO0FBQ0EsUUFBTyxFQUFQLENBQVUsS0FBVixHQUFrQixZQUFXO0FBQzVCLE1BQUssQ0FBQyxPQUFOLEVBQWdCO0FBQ2YsYUFBVSxPQUFPLFdBQVAsQ0FBb0IsT0FBTyxFQUFQLENBQVUsSUFBOUIsRUFBb0MsT0FBTyxFQUFQLENBQVUsUUFBOUMsQ0FBVjtBQUNBO0FBQ0QsRUFKRDs7QUFNQSxRQUFPLEVBQVAsQ0FBVSxJQUFWLEdBQWlCLFlBQVc7QUFDM0IsU0FBTyxhQUFQLENBQXNCLE9BQXRCOztBQUVBLFlBQVUsSUFBVjtBQUNBLEVBSkQ7O0FBTUEsUUFBTyxFQUFQLENBQVUsTUFBVixHQUFtQjtBQUNsQixRQUFNLEdBRFk7QUFFbEIsUUFBTSxHQUZZOzs7QUFLbEIsWUFBVTtBQUxRLEVBQW5COztBQVFBLFFBQU8sTUFBUDtBQUNDLENBcG5CRCIsImZpbGUiOiJlZmZlY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9yY3NzTnVtXCIsXG5cdFwiLi9jc3MvdmFyL2Nzc0V4cGFuZFwiLFxuXHRcIi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4vY3NzL3Zhci9pc0hpZGRlblwiLFxuXHRcIi4vY3NzL2FkanVzdENTU1wiLFxuXHRcIi4vY3NzL2RlZmF1bHREaXNwbGF5XCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL2VmZmVjdHMvVHdlZW5cIixcblx0XCIuL3F1ZXVlXCIsXG5cdFwiLi9jc3NcIixcblx0XCIuL2RlZmVycmVkXCIsXG5cdFwiLi90cmF2ZXJzaW5nXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCByY3NzTnVtLCBjc3NFeHBhbmQsIHJub3R3aGl0ZSxcblx0aXNIaWRkZW4sIGFkanVzdENTUywgZGVmYXVsdERpc3BsYXksIGRhdGFQcml2ICkge1xuXG52YXJcblx0ZnhOb3csIHRpbWVySWQsXG5cdHJmeHR5cGVzID0gL14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLFxuXHRycnVuID0gL3F1ZXVlSG9va3MkLztcblxuLy8gQW5pbWF0aW9ucyBjcmVhdGVkIHN5bmNocm9ub3VzbHkgd2lsbCBydW4gc3luY2hyb25vdXNseVxuZnVuY3Rpb24gY3JlYXRlRnhOb3coKSB7XG5cdHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRmeE5vdyA9IHVuZGVmaW5lZDtcblx0fSApO1xuXHRyZXR1cm4gKCBmeE5vdyA9IGpRdWVyeS5ub3coKSApO1xufVxuXG4vLyBHZW5lcmF0ZSBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSBhIHN0YW5kYXJkIGFuaW1hdGlvblxuZnVuY3Rpb24gZ2VuRngoIHR5cGUsIGluY2x1ZGVXaWR0aCApIHtcblx0dmFyIHdoaWNoLFxuXHRcdGkgPSAwLFxuXHRcdGF0dHJzID0geyBoZWlnaHQ6IHR5cGUgfTtcblxuXHQvLyBJZiB3ZSBpbmNsdWRlIHdpZHRoLCBzdGVwIHZhbHVlIGlzIDEgdG8gZG8gYWxsIGNzc0V4cGFuZCB2YWx1ZXMsXG5cdC8vIG90aGVyd2lzZSBzdGVwIHZhbHVlIGlzIDIgdG8gc2tpcCBvdmVyIExlZnQgYW5kIFJpZ2h0XG5cdGluY2x1ZGVXaWR0aCA9IGluY2x1ZGVXaWR0aCA/IDEgOiAwO1xuXHRmb3IgKCA7IGkgPCA0IDsgaSArPSAyIC0gaW5jbHVkZVdpZHRoICkge1xuXHRcdHdoaWNoID0gY3NzRXhwYW5kWyBpIF07XG5cdFx0YXR0cnNbIFwibWFyZ2luXCIgKyB3aGljaCBdID0gYXR0cnNbIFwicGFkZGluZ1wiICsgd2hpY2ggXSA9IHR5cGU7XG5cdH1cblxuXHRpZiAoIGluY2x1ZGVXaWR0aCApIHtcblx0XHRhdHRycy5vcGFjaXR5ID0gYXR0cnMud2lkdGggPSB0eXBlO1xuXHR9XG5cblx0cmV0dXJuIGF0dHJzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUd2VlbiggdmFsdWUsIHByb3AsIGFuaW1hdGlvbiApIHtcblx0dmFyIHR3ZWVuLFxuXHRcdGNvbGxlY3Rpb24gPSAoIEFuaW1hdGlvbi50d2VlbmVyc1sgcHJvcCBdIHx8IFtdICkuY29uY2F0KCBBbmltYXRpb24udHdlZW5lcnNbIFwiKlwiIF0gKSxcblx0XHRpbmRleCA9IDAsXG5cdFx0bGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0aWYgKCAoIHR3ZWVuID0gY29sbGVjdGlvblsgaW5kZXggXS5jYWxsKCBhbmltYXRpb24sIHByb3AsIHZhbHVlICkgKSApIHtcblxuXHRcdFx0Ly8gV2UncmUgZG9uZSB3aXRoIHRoaXMgcHJvcGVydHlcblx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdFByZWZpbHRlciggZWxlbSwgcHJvcHMsIG9wdHMgKSB7XG5cdC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cblx0dmFyIHByb3AsIHZhbHVlLCB0b2dnbGUsIHR3ZWVuLCBob29rcywgb2xkZmlyZSwgZGlzcGxheSwgY2hlY2tEaXNwbGF5LFxuXHRcdGFuaW0gPSB0aGlzLFxuXHRcdG9yaWcgPSB7fSxcblx0XHRzdHlsZSA9IGVsZW0uc3R5bGUsXG5cdFx0aGlkZGVuID0gZWxlbS5ub2RlVHlwZSAmJiBpc0hpZGRlbiggZWxlbSApLFxuXHRcdGRhdGFTaG93ID0gZGF0YVByaXYuZ2V0KCBlbGVtLCBcImZ4c2hvd1wiICk7XG5cblx0Ly8gSGFuZGxlIHF1ZXVlOiBmYWxzZSBwcm9taXNlc1xuXHRpZiAoICFvcHRzLnF1ZXVlICkge1xuXHRcdGhvb2tzID0galF1ZXJ5Ll9xdWV1ZUhvb2tzKCBlbGVtLCBcImZ4XCIgKTtcblx0XHRpZiAoIGhvb2tzLnVucXVldWVkID09IG51bGwgKSB7XG5cdFx0XHRob29rcy51bnF1ZXVlZCA9IDA7XG5cdFx0XHRvbGRmaXJlID0gaG9va3MuZW1wdHkuZmlyZTtcblx0XHRcdGhvb2tzLmVtcHR5LmZpcmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAhaG9va3MudW5xdWV1ZWQgKSB7XG5cdFx0XHRcdFx0b2xkZmlyZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRob29rcy51bnF1ZXVlZCsrO1xuXG5cdFx0YW5pbS5hbHdheXMoIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBFbnN1cmUgdGhlIGNvbXBsZXRlIGhhbmRsZXIgaXMgY2FsbGVkIGJlZm9yZSB0aGlzIGNvbXBsZXRlc1xuXHRcdFx0YW5pbS5hbHdheXMoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRob29rcy51bnF1ZXVlZC0tO1xuXHRcdFx0XHRpZiAoICFqUXVlcnkucXVldWUoIGVsZW0sIFwiZnhcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRob29rcy5lbXB0eS5maXJlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBIZWlnaHQvd2lkdGggb3ZlcmZsb3cgcGFzc1xuXHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgKCBcImhlaWdodFwiIGluIHByb3BzIHx8IFwid2lkdGhcIiBpbiBwcm9wcyApICkge1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbm90aGluZyBzbmVha3Mgb3V0XG5cdFx0Ly8gUmVjb3JkIGFsbCAzIG92ZXJmbG93IGF0dHJpYnV0ZXMgYmVjYXVzZSBJRTktMTAgZG8gbm90XG5cdFx0Ly8gY2hhbmdlIHRoZSBvdmVyZmxvdyBhdHRyaWJ1dGUgd2hlbiBvdmVyZmxvd1ggYW5kXG5cdFx0Ly8gb3ZlcmZsb3dZIGFyZSBzZXQgdG8gdGhlIHNhbWUgdmFsdWVcblx0XHRvcHRzLm92ZXJmbG93ID0gWyBzdHlsZS5vdmVyZmxvdywgc3R5bGUub3ZlcmZsb3dYLCBzdHlsZS5vdmVyZmxvd1kgXTtcblxuXHRcdC8vIFNldCBkaXNwbGF5IHByb3BlcnR5IHRvIGlubGluZS1ibG9jayBmb3IgaGVpZ2h0L3dpZHRoXG5cdFx0Ly8gYW5pbWF0aW9ucyBvbiBpbmxpbmUgZWxlbWVudHMgdGhhdCBhcmUgaGF2aW5nIHdpZHRoL2hlaWdodCBhbmltYXRlZFxuXHRcdGRpc3BsYXkgPSBqUXVlcnkuY3NzKCBlbGVtLCBcImRpc3BsYXlcIiApO1xuXG5cdFx0Ly8gVGVzdCBkZWZhdWx0IGRpc3BsYXkgaWYgZGlzcGxheSBpcyBjdXJyZW50bHkgXCJub25lXCJcblx0XHRjaGVja0Rpc3BsYXkgPSBkaXNwbGF5ID09PSBcIm5vbmVcIiA/XG5cdFx0XHRkYXRhUHJpdi5nZXQoIGVsZW0sIFwib2xkZGlzcGxheVwiICkgfHwgZGVmYXVsdERpc3BsYXkoIGVsZW0ubm9kZU5hbWUgKSA6IGRpc3BsYXk7XG5cblx0XHRpZiAoIGNoZWNrRGlzcGxheSA9PT0gXCJpbmxpbmVcIiAmJiBqUXVlcnkuY3NzKCBlbGVtLCBcImZsb2F0XCIgKSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRzdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcblx0XHR9XG5cdH1cblxuXHRpZiAoIG9wdHMub3ZlcmZsb3cgKSB7XG5cdFx0c3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXHRcdGFuaW0uYWx3YXlzKCBmdW5jdGlvbigpIHtcblx0XHRcdHN0eWxlLm92ZXJmbG93ID0gb3B0cy5vdmVyZmxvd1sgMCBdO1xuXHRcdFx0c3R5bGUub3ZlcmZsb3dYID0gb3B0cy5vdmVyZmxvd1sgMSBdO1xuXHRcdFx0c3R5bGUub3ZlcmZsb3dZID0gb3B0cy5vdmVyZmxvd1sgMiBdO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIHNob3cvaGlkZSBwYXNzXG5cdGZvciAoIHByb3AgaW4gcHJvcHMgKSB7XG5cdFx0dmFsdWUgPSBwcm9wc1sgcHJvcCBdO1xuXHRcdGlmICggcmZ4dHlwZXMuZXhlYyggdmFsdWUgKSApIHtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgcHJvcCBdO1xuXHRcdFx0dG9nZ2xlID0gdG9nZ2xlIHx8IHZhbHVlID09PSBcInRvZ2dsZVwiO1xuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gKCBoaWRkZW4gPyBcImhpZGVcIiA6IFwic2hvd1wiICkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgZGF0YVNob3cgbGVmdCBvdmVyIGZyb20gYSBzdG9wcGVkIGhpZGUgb3Igc2hvd1xuXHRcdFx0XHQvLyBhbmQgd2UgYXJlIGdvaW5nIHRvIHByb2NlZWQgd2l0aCBzaG93LCB3ZSBzaG91bGQgcHJldGVuZCB0byBiZSBoaWRkZW5cblx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gXCJzaG93XCIgJiYgZGF0YVNob3cgJiYgZGF0YVNob3dbIHByb3AgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGhpZGRlbiA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9yaWdbIHByb3AgXSA9IGRhdGFTaG93ICYmIGRhdGFTaG93WyBwcm9wIF0gfHwgalF1ZXJ5LnN0eWxlKCBlbGVtLCBwcm9wICk7XG5cblx0XHQvLyBBbnkgbm9uLWZ4IHZhbHVlIHN0b3BzIHVzIGZyb20gcmVzdG9yaW5nIHRoZSBvcmlnaW5hbCBkaXNwbGF5IHZhbHVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpc3BsYXkgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhalF1ZXJ5LmlzRW1wdHlPYmplY3QoIG9yaWcgKSApIHtcblx0XHRpZiAoIGRhdGFTaG93ICkge1xuXHRcdFx0aWYgKCBcImhpZGRlblwiIGluIGRhdGFTaG93ICkge1xuXHRcdFx0XHRoaWRkZW4gPSBkYXRhU2hvdy5oaWRkZW47XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGFTaG93ID0gZGF0YVByaXYuYWNjZXNzKCBlbGVtLCBcImZ4c2hvd1wiLCB7fSApO1xuXHRcdH1cblxuXHRcdC8vIFN0b3JlIHN0YXRlIGlmIGl0cyB0b2dnbGUgLSBlbmFibGVzIC5zdG9wKCkudG9nZ2xlKCkgdG8gXCJyZXZlcnNlXCJcblx0XHRpZiAoIHRvZ2dsZSApIHtcblx0XHRcdGRhdGFTaG93LmhpZGRlbiA9ICFoaWRkZW47XG5cdFx0fVxuXHRcdGlmICggaGlkZGVuICkge1xuXHRcdFx0alF1ZXJ5KCBlbGVtICkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhbmltLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRqUXVlcnkoIGVsZW0gKS5oaWRlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdGFuaW0uZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcHJvcDtcblxuXHRcdFx0ZGF0YVByaXYucmVtb3ZlKCBlbGVtLCBcImZ4c2hvd1wiICk7XG5cdFx0XHRmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG5cdFx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgcHJvcCwgb3JpZ1sgcHJvcCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHRcdGZvciAoIHByb3AgaW4gb3JpZyApIHtcblx0XHRcdHR3ZWVuID0gY3JlYXRlVHdlZW4oIGhpZGRlbiA/IGRhdGFTaG93WyBwcm9wIF0gOiAwLCBwcm9wLCBhbmltICk7XG5cblx0XHRcdGlmICggISggcHJvcCBpbiBkYXRhU2hvdyApICkge1xuXHRcdFx0XHRkYXRhU2hvd1sgcHJvcCBdID0gdHdlZW4uc3RhcnQ7XG5cdFx0XHRcdGlmICggaGlkZGVuICkge1xuXHRcdFx0XHRcdHR3ZWVuLmVuZCA9IHR3ZWVuLnN0YXJ0O1xuXHRcdFx0XHRcdHR3ZWVuLnN0YXJ0ID0gcHJvcCA9PT0gXCJ3aWR0aFwiIHx8IHByb3AgPT09IFwiaGVpZ2h0XCIgPyAxIDogMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHQvLyBJZiB0aGlzIGlzIGEgbm9vcCBsaWtlIC5oaWRlKCkuaGlkZSgpLCByZXN0b3JlIGFuIG92ZXJ3cml0dGVuIGRpc3BsYXkgdmFsdWVcblx0fSBlbHNlIGlmICggKCBkaXNwbGF5ID09PSBcIm5vbmVcIiA/IGRlZmF1bHREaXNwbGF5KCBlbGVtLm5vZGVOYW1lICkgOiBkaXNwbGF5ICkgPT09IFwiaW5saW5lXCIgKSB7XG5cdFx0c3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJvcEZpbHRlciggcHJvcHMsIHNwZWNpYWxFYXNpbmcgKSB7XG5cdHZhciBpbmRleCwgbmFtZSwgZWFzaW5nLCB2YWx1ZSwgaG9va3M7XG5cblx0Ly8gY2FtZWxDYXNlLCBzcGVjaWFsRWFzaW5nIGFuZCBleHBhbmQgY3NzSG9vayBwYXNzXG5cdGZvciAoIGluZGV4IGluIHByb3BzICkge1xuXHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBpbmRleCApO1xuXHRcdGVhc2luZyA9IHNwZWNpYWxFYXNpbmdbIG5hbWUgXTtcblx0XHR2YWx1ZSA9IHByb3BzWyBpbmRleCBdO1xuXHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIHZhbHVlICkgKSB7XG5cdFx0XHRlYXNpbmcgPSB2YWx1ZVsgMSBdO1xuXHRcdFx0dmFsdWUgPSBwcm9wc1sgaW5kZXggXSA9IHZhbHVlWyAwIF07XG5cdFx0fVxuXG5cdFx0aWYgKCBpbmRleCAhPT0gbmFtZSApIHtcblx0XHRcdHByb3BzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgaW5kZXggXTtcblx0XHR9XG5cblx0XHRob29rcyA9IGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdO1xuXHRcdGlmICggaG9va3MgJiYgXCJleHBhbmRcIiBpbiBob29rcyApIHtcblx0XHRcdHZhbHVlID0gaG9va3MuZXhwYW5kKCB2YWx1ZSApO1xuXHRcdFx0ZGVsZXRlIHByb3BzWyBuYW1lIF07XG5cblx0XHRcdC8vIE5vdCBxdWl0ZSAkLmV4dGVuZCwgdGhpcyB3b24ndCBvdmVyd3JpdGUgZXhpc3Rpbmcga2V5cy5cblx0XHRcdC8vIFJldXNpbmcgJ2luZGV4JyBiZWNhdXNlIHdlIGhhdmUgdGhlIGNvcnJlY3QgXCJuYW1lXCJcblx0XHRcdGZvciAoIGluZGV4IGluIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICEoIGluZGV4IGluIHByb3BzICkgKSB7XG5cdFx0XHRcdFx0cHJvcHNbIGluZGV4IF0gPSB2YWx1ZVsgaW5kZXggXTtcblx0XHRcdFx0XHRzcGVjaWFsRWFzaW5nWyBpbmRleCBdID0gZWFzaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNwZWNpYWxFYXNpbmdbIG5hbWUgXSA9IGVhc2luZztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gQW5pbWF0aW9uKCBlbGVtLCBwcm9wZXJ0aWVzLCBvcHRpb25zICkge1xuXHR2YXIgcmVzdWx0LFxuXHRcdHN0b3BwZWQsXG5cdFx0aW5kZXggPSAwLFxuXHRcdGxlbmd0aCA9IEFuaW1hdGlvbi5wcmVmaWx0ZXJzLmxlbmd0aCxcblx0XHRkZWZlcnJlZCA9IGpRdWVyeS5EZWZlcnJlZCgpLmFsd2F5cyggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIERvbid0IG1hdGNoIGVsZW0gaW4gdGhlIDphbmltYXRlZCBzZWxlY3RvclxuXHRcdFx0ZGVsZXRlIHRpY2suZWxlbTtcblx0XHR9ICksXG5cdFx0dGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCBzdG9wcGVkICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgY3VycmVudFRpbWUgPSBmeE5vdyB8fCBjcmVhdGVGeE5vdygpLFxuXHRcdFx0XHRyZW1haW5pbmcgPSBNYXRoLm1heCggMCwgYW5pbWF0aW9uLnN0YXJ0VGltZSArIGFuaW1hdGlvbi5kdXJhdGlvbiAtIGN1cnJlbnRUaW1lICksXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZCAyLjNcblx0XHRcdFx0Ly8gQXJjaGFpYyBjcmFzaCBidWcgd29uJ3QgYWxsb3cgdXMgdG8gdXNlIGAxIC0gKCAwLjUgfHwgMCApYCAoIzEyNDk3KVxuXHRcdFx0XHR0ZW1wID0gcmVtYWluaW5nIC8gYW5pbWF0aW9uLmR1cmF0aW9uIHx8IDAsXG5cdFx0XHRcdHBlcmNlbnQgPSAxIC0gdGVtcCxcblx0XHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0XHRsZW5ndGggPSBhbmltYXRpb24udHdlZW5zLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggOyBpbmRleCA8IGxlbmd0aCA7IGluZGV4KysgKSB7XG5cdFx0XHRcdGFuaW1hdGlvbi50d2VlbnNbIGluZGV4IF0ucnVuKCBwZXJjZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIGVsZW0sIFsgYW5pbWF0aW9uLCBwZXJjZW50LCByZW1haW5pbmcgXSApO1xuXG5cdFx0XHRpZiAoIHBlcmNlbnQgPCAxICYmIGxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuIHJlbWFpbmluZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiBdICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFuaW1hdGlvbiA9IGRlZmVycmVkLnByb21pc2UoIHtcblx0XHRcdGVsZW06IGVsZW0sXG5cdFx0XHRwcm9wczogalF1ZXJ5LmV4dGVuZCgge30sIHByb3BlcnRpZXMgKSxcblx0XHRcdG9wdHM6IGpRdWVyeS5leHRlbmQoIHRydWUsIHtcblx0XHRcdFx0c3BlY2lhbEVhc2luZzoge30sXG5cdFx0XHRcdGVhc2luZzogalF1ZXJ5LmVhc2luZy5fZGVmYXVsdFxuXHRcdFx0fSwgb3B0aW9ucyApLFxuXHRcdFx0b3JpZ2luYWxQcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuXHRcdFx0b3JpZ2luYWxPcHRpb25zOiBvcHRpb25zLFxuXHRcdFx0c3RhcnRUaW1lOiBmeE5vdyB8fCBjcmVhdGVGeE5vdygpLFxuXHRcdFx0ZHVyYXRpb246IG9wdGlvbnMuZHVyYXRpb24sXG5cdFx0XHR0d2VlbnM6IFtdLFxuXHRcdFx0Y3JlYXRlVHdlZW46IGZ1bmN0aW9uKCBwcm9wLCBlbmQgKSB7XG5cdFx0XHRcdHZhciB0d2VlbiA9IGpRdWVyeS5Ud2VlbiggZWxlbSwgYW5pbWF0aW9uLm9wdHMsIHByb3AsIGVuZCxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbi5vcHRzLnNwZWNpYWxFYXNpbmdbIHByb3AgXSB8fCBhbmltYXRpb24ub3B0cy5lYXNpbmcgKTtcblx0XHRcdFx0YW5pbWF0aW9uLnR3ZWVucy5wdXNoKCB0d2VlbiApO1xuXHRcdFx0XHRyZXR1cm4gdHdlZW47XG5cdFx0XHR9LFxuXHRcdFx0c3RvcDogZnVuY3Rpb24oIGdvdG9FbmQgKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IDAsXG5cblx0XHRcdFx0XHQvLyBJZiB3ZSBhcmUgZ29pbmcgdG8gdGhlIGVuZCwgd2Ugd2FudCB0byBydW4gYWxsIHRoZSB0d2VlbnNcblx0XHRcdFx0XHQvLyBvdGhlcndpc2Ugd2Ugc2tpcCB0aGlzIHBhcnRcblx0XHRcdFx0XHRsZW5ndGggPSBnb3RvRW5kID8gYW5pbWF0aW9uLnR3ZWVucy5sZW5ndGggOiAwO1xuXHRcdFx0XHRpZiAoIHN0b3BwZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RvcHBlZCA9IHRydWU7XG5cdFx0XHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0XHRcdGFuaW1hdGlvbi50d2VlbnNbIGluZGV4IF0ucnVuKCAxICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZXNvbHZlIHdoZW4gd2UgcGxheWVkIHRoZSBsYXN0IGZyYW1lOyBvdGhlcndpc2UsIHJlamVjdFxuXHRcdFx0XHRpZiAoIGdvdG9FbmQgKSB7XG5cdFx0XHRcdFx0ZGVmZXJyZWQubm90aWZ5V2l0aCggZWxlbSwgWyBhbmltYXRpb24sIDEsIDAgXSApO1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiwgZ290b0VuZCBdICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggZWxlbSwgWyBhbmltYXRpb24sIGdvdG9FbmQgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0gKSxcblx0XHRwcm9wcyA9IGFuaW1hdGlvbi5wcm9wcztcblxuXHRwcm9wRmlsdGVyKCBwcm9wcywgYW5pbWF0aW9uLm9wdHMuc3BlY2lhbEVhc2luZyApO1xuXG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdHJlc3VsdCA9IEFuaW1hdGlvbi5wcmVmaWx0ZXJzWyBpbmRleCBdLmNhbGwoIGFuaW1hdGlvbiwgZWxlbSwgcHJvcHMsIGFuaW1hdGlvbi5vcHRzICk7XG5cdFx0aWYgKCByZXN1bHQgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCByZXN1bHQuc3RvcCApICkge1xuXHRcdFx0XHRqUXVlcnkuX3F1ZXVlSG9va3MoIGFuaW1hdGlvbi5lbGVtLCBhbmltYXRpb24ub3B0cy5xdWV1ZSApLnN0b3AgPVxuXHRcdFx0XHRcdGpRdWVyeS5wcm94eSggcmVzdWx0LnN0b3AsIHJlc3VsdCApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdH1cblxuXHRqUXVlcnkubWFwKCBwcm9wcywgY3JlYXRlVHdlZW4sIGFuaW1hdGlvbiApO1xuXG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGFuaW1hdGlvbi5vcHRzLnN0YXJ0ICkgKSB7XG5cdFx0YW5pbWF0aW9uLm9wdHMuc3RhcnQuY2FsbCggZWxlbSwgYW5pbWF0aW9uICk7XG5cdH1cblxuXHRqUXVlcnkuZngudGltZXIoXG5cdFx0alF1ZXJ5LmV4dGVuZCggdGljaywge1xuXHRcdFx0ZWxlbTogZWxlbSxcblx0XHRcdGFuaW06IGFuaW1hdGlvbixcblx0XHRcdHF1ZXVlOiBhbmltYXRpb24ub3B0cy5xdWV1ZVxuXHRcdH0gKVxuXHQpO1xuXG5cdC8vIGF0dGFjaCBjYWxsYmFja3MgZnJvbSBvcHRpb25zXG5cdHJldHVybiBhbmltYXRpb24ucHJvZ3Jlc3MoIGFuaW1hdGlvbi5vcHRzLnByb2dyZXNzIClcblx0XHQuZG9uZSggYW5pbWF0aW9uLm9wdHMuZG9uZSwgYW5pbWF0aW9uLm9wdHMuY29tcGxldGUgKVxuXHRcdC5mYWlsKCBhbmltYXRpb24ub3B0cy5mYWlsIClcblx0XHQuYWx3YXlzKCBhbmltYXRpb24ub3B0cy5hbHdheXMgKTtcbn1cblxualF1ZXJ5LkFuaW1hdGlvbiA9IGpRdWVyeS5leHRlbmQoIEFuaW1hdGlvbiwge1xuXHR0d2VlbmVyczoge1xuXHRcdFwiKlwiOiBbIGZ1bmN0aW9uKCBwcm9wLCB2YWx1ZSApIHtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuY3JlYXRlVHdlZW4oIHByb3AsIHZhbHVlICk7XG5cdFx0XHRhZGp1c3RDU1MoIHR3ZWVuLmVsZW0sIHByb3AsIHJjc3NOdW0uZXhlYyggdmFsdWUgKSwgdHdlZW4gKTtcblx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHR9IF1cblx0fSxcblxuXHR0d2VlbmVyOiBmdW5jdGlvbiggcHJvcHMsIGNhbGxiYWNrICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHByb3BzICkgKSB7XG5cdFx0XHRjYWxsYmFjayA9IHByb3BzO1xuXHRcdFx0cHJvcHMgPSBbIFwiKlwiIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb3BzID0gcHJvcHMubWF0Y2goIHJub3R3aGl0ZSApO1xuXHRcdH1cblxuXHRcdHZhciBwcm9wLFxuXHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0bGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG5cdFx0Zm9yICggOyBpbmRleCA8IGxlbmd0aCA7IGluZGV4KysgKSB7XG5cdFx0XHRwcm9wID0gcHJvcHNbIGluZGV4IF07XG5cdFx0XHRBbmltYXRpb24udHdlZW5lcnNbIHByb3AgXSA9IEFuaW1hdGlvbi50d2VlbmVyc1sgcHJvcCBdIHx8IFtdO1xuXHRcdFx0QW5pbWF0aW9uLnR3ZWVuZXJzWyBwcm9wIF0udW5zaGlmdCggY2FsbGJhY2sgKTtcblx0XHR9XG5cdH0sXG5cblx0cHJlZmlsdGVyczogWyBkZWZhdWx0UHJlZmlsdGVyIF0sXG5cblx0cHJlZmlsdGVyOiBmdW5jdGlvbiggY2FsbGJhY2ssIHByZXBlbmQgKSB7XG5cdFx0aWYgKCBwcmVwZW5kICkge1xuXHRcdFx0QW5pbWF0aW9uLnByZWZpbHRlcnMudW5zaGlmdCggY2FsbGJhY2sgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0QW5pbWF0aW9uLnByZWZpbHRlcnMucHVzaCggY2FsbGJhY2sgKTtcblx0XHR9XG5cdH1cbn0gKTtcblxualF1ZXJ5LnNwZWVkID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGZuICkge1xuXHR2YXIgb3B0ID0gc3BlZWQgJiYgdHlwZW9mIHNwZWVkID09PSBcIm9iamVjdFwiID8galF1ZXJ5LmV4dGVuZCgge30sIHNwZWVkICkgOiB7XG5cdFx0Y29tcGxldGU6IGZuIHx8ICFmbiAmJiBlYXNpbmcgfHxcblx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxuXHRcdGR1cmF0aW9uOiBzcGVlZCxcblx0XHRlYXNpbmc6IGZuICYmIGVhc2luZyB8fCBlYXNpbmcgJiYgIWpRdWVyeS5pc0Z1bmN0aW9uKCBlYXNpbmcgKSAmJiBlYXNpbmdcblx0fTtcblxuXHRvcHQuZHVyYXRpb24gPSBqUXVlcnkuZngub2ZmID8gMCA6IHR5cGVvZiBvcHQuZHVyYXRpb24gPT09IFwibnVtYmVyXCIgP1xuXHRcdG9wdC5kdXJhdGlvbiA6IG9wdC5kdXJhdGlvbiBpbiBqUXVlcnkuZnguc3BlZWRzID9cblx0XHRcdGpRdWVyeS5meC5zcGVlZHNbIG9wdC5kdXJhdGlvbiBdIDogalF1ZXJ5LmZ4LnNwZWVkcy5fZGVmYXVsdDtcblxuXHQvLyBOb3JtYWxpemUgb3B0LnF1ZXVlIC0gdHJ1ZS91bmRlZmluZWQvbnVsbCAtPiBcImZ4XCJcblx0aWYgKCBvcHQucXVldWUgPT0gbnVsbCB8fCBvcHQucXVldWUgPT09IHRydWUgKSB7XG5cdFx0b3B0LnF1ZXVlID0gXCJmeFwiO1xuXHR9XG5cblx0Ly8gUXVldWVpbmdcblx0b3B0Lm9sZCA9IG9wdC5jb21wbGV0ZTtcblxuXHRvcHQuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBvcHQub2xkICkgKSB7XG5cdFx0XHRvcHQub2xkLmNhbGwoIHRoaXMgKTtcblx0XHR9XG5cblx0XHRpZiAoIG9wdC5xdWV1ZSApIHtcblx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCBvcHQucXVldWUgKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIG9wdDtcbn07XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0ZmFkZVRvOiBmdW5jdGlvbiggc3BlZWQsIHRvLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXG5cdFx0Ly8gU2hvdyBhbnkgaGlkZGVuIGVsZW1lbnRzIGFmdGVyIHNldHRpbmcgb3BhY2l0eSB0byAwXG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKCBpc0hpZGRlbiApLmNzcyggXCJvcGFjaXR5XCIsIDAgKS5zaG93KClcblxuXHRcdFx0Ly8gQW5pbWF0ZSB0byB0aGUgdmFsdWUgc3BlY2lmaWVkXG5cdFx0XHQuZW5kKCkuYW5pbWF0ZSggeyBvcGFjaXR5OiB0byB9LCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9LFxuXHRhbmltYXRlOiBmdW5jdGlvbiggcHJvcCwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0dmFyIGVtcHR5ID0galF1ZXJ5LmlzRW1wdHlPYmplY3QoIHByb3AgKSxcblx0XHRcdG9wdGFsbCA9IGpRdWVyeS5zcGVlZCggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSxcblx0XHRcdGRvQW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8gT3BlcmF0ZSBvbiBhIGNvcHkgb2YgcHJvcCBzbyBwZXItcHJvcGVydHkgZWFzaW5nIHdvbid0IGJlIGxvc3Rcblx0XHRcdFx0dmFyIGFuaW0gPSBBbmltYXRpb24oIHRoaXMsIGpRdWVyeS5leHRlbmQoIHt9LCBwcm9wICksIG9wdGFsbCApO1xuXG5cdFx0XHRcdC8vIEVtcHR5IGFuaW1hdGlvbnMsIG9yIGZpbmlzaGluZyByZXNvbHZlcyBpbW1lZGlhdGVseVxuXHRcdFx0XHRpZiAoIGVtcHR5IHx8IGRhdGFQcml2LmdldCggdGhpcywgXCJmaW5pc2hcIiApICkge1xuXHRcdFx0XHRcdGFuaW0uc3RvcCggdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0ZG9BbmltYXRpb24uZmluaXNoID0gZG9BbmltYXRpb247XG5cblx0XHRyZXR1cm4gZW1wdHkgfHwgb3B0YWxsLnF1ZXVlID09PSBmYWxzZSA/XG5cdFx0XHR0aGlzLmVhY2goIGRvQW5pbWF0aW9uICkgOlxuXHRcdFx0dGhpcy5xdWV1ZSggb3B0YWxsLnF1ZXVlLCBkb0FuaW1hdGlvbiApO1xuXHR9LFxuXHRzdG9wOiBmdW5jdGlvbiggdHlwZSwgY2xlYXJRdWV1ZSwgZ290b0VuZCApIHtcblx0XHR2YXIgc3RvcFF1ZXVlID0gZnVuY3Rpb24oIGhvb2tzICkge1xuXHRcdFx0dmFyIHN0b3AgPSBob29rcy5zdG9wO1xuXHRcdFx0ZGVsZXRlIGhvb2tzLnN0b3A7XG5cdFx0XHRzdG9wKCBnb3RvRW5kICk7XG5cdFx0fTtcblxuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRnb3RvRW5kID0gY2xlYXJRdWV1ZTtcblx0XHRcdGNsZWFyUXVldWUgPSB0eXBlO1xuXHRcdFx0dHlwZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBjbGVhclF1ZXVlICYmIHR5cGUgIT09IGZhbHNlICkge1xuXHRcdFx0dGhpcy5xdWV1ZSggdHlwZSB8fCBcImZ4XCIsIFtdICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGVxdWV1ZSA9IHRydWUsXG5cdFx0XHRcdGluZGV4ID0gdHlwZSAhPSBudWxsICYmIHR5cGUgKyBcInF1ZXVlSG9va3NcIixcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0ZGF0YSA9IGRhdGFQcml2LmdldCggdGhpcyApO1xuXG5cdFx0XHRpZiAoIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoIGRhdGFbIGluZGV4IF0gJiYgZGF0YVsgaW5kZXggXS5zdG9wICkge1xuXHRcdFx0XHRcdHN0b3BRdWV1ZSggZGF0YVsgaW5kZXggXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCBpbmRleCBpbiBkYXRhICkge1xuXHRcdFx0XHRcdGlmICggZGF0YVsgaW5kZXggXSAmJiBkYXRhWyBpbmRleCBdLnN0b3AgJiYgcnJ1bi50ZXN0KCBpbmRleCApICkge1xuXHRcdFx0XHRcdFx0c3RvcFF1ZXVlKCBkYXRhWyBpbmRleCBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIGluZGV4ID0gdGltZXJzLmxlbmd0aDsgaW5kZXgtLTsgKSB7XG5cdFx0XHRcdGlmICggdGltZXJzWyBpbmRleCBdLmVsZW0gPT09IHRoaXMgJiZcblx0XHRcdFx0XHQoIHR5cGUgPT0gbnVsbCB8fCB0aW1lcnNbIGluZGV4IF0ucXVldWUgPT09IHR5cGUgKSApIHtcblxuXHRcdFx0XHRcdHRpbWVyc1sgaW5kZXggXS5hbmltLnN0b3AoIGdvdG9FbmQgKTtcblx0XHRcdFx0XHRkZXF1ZXVlID0gZmFsc2U7XG5cdFx0XHRcdFx0dGltZXJzLnNwbGljZSggaW5kZXgsIDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdGFydCB0aGUgbmV4dCBpbiB0aGUgcXVldWUgaWYgdGhlIGxhc3Qgc3RlcCB3YXNuJ3QgZm9yY2VkLlxuXHRcdFx0Ly8gVGltZXJzIGN1cnJlbnRseSB3aWxsIGNhbGwgdGhlaXIgY29tcGxldGUgY2FsbGJhY2tzLCB3aGljaFxuXHRcdFx0Ly8gd2lsbCBkZXF1ZXVlIGJ1dCBvbmx5IGlmIHRoZXkgd2VyZSBnb3RvRW5kLlxuXHRcdFx0aWYgKCBkZXF1ZXVlIHx8ICFnb3RvRW5kICkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblx0ZmluaXNoOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRpZiAoIHR5cGUgIT09IGZhbHNlICkge1xuXHRcdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCxcblx0XHRcdFx0ZGF0YSA9IGRhdGFQcml2LmdldCggdGhpcyApLFxuXHRcdFx0XHRxdWV1ZSA9IGRhdGFbIHR5cGUgKyBcInF1ZXVlXCIgXSxcblx0XHRcdFx0aG9va3MgPSBkYXRhWyB0eXBlICsgXCJxdWV1ZUhvb2tzXCIgXSxcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0bGVuZ3RoID0gcXVldWUgPyBxdWV1ZS5sZW5ndGggOiAwO1xuXG5cdFx0XHQvLyBFbmFibGUgZmluaXNoaW5nIGZsYWcgb24gcHJpdmF0ZSBkYXRhXG5cdFx0XHRkYXRhLmZpbmlzaCA9IHRydWU7XG5cblx0XHRcdC8vIEVtcHR5IHRoZSBxdWV1ZSBmaXJzdFxuXHRcdFx0alF1ZXJ5LnF1ZXVlKCB0aGlzLCB0eXBlLCBbXSApO1xuXG5cdFx0XHRpZiAoIGhvb2tzICYmIGhvb2tzLnN0b3AgKSB7XG5cdFx0XHRcdGhvb2tzLnN0b3AuY2FsbCggdGhpcywgdHJ1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb29rIGZvciBhbnkgYWN0aXZlIGFuaW1hdGlvbnMsIGFuZCBmaW5pc2ggdGhlbVxuXHRcdFx0Zm9yICggaW5kZXggPSB0aW1lcnMubGVuZ3RoOyBpbmRleC0tOyApIHtcblx0XHRcdFx0aWYgKCB0aW1lcnNbIGluZGV4IF0uZWxlbSA9PT0gdGhpcyAmJiB0aW1lcnNbIGluZGV4IF0ucXVldWUgPT09IHR5cGUgKSB7XG5cdFx0XHRcdFx0dGltZXJzWyBpbmRleCBdLmFuaW0uc3RvcCggdHJ1ZSApO1xuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoIGluZGV4LCAxICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vayBmb3IgYW55IGFuaW1hdGlvbnMgaW4gdGhlIG9sZCBxdWV1ZSBhbmQgZmluaXNoIHRoZW1cblx0XHRcdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRcdGlmICggcXVldWVbIGluZGV4IF0gJiYgcXVldWVbIGluZGV4IF0uZmluaXNoICkge1xuXHRcdFx0XHRcdHF1ZXVlWyBpbmRleCBdLmZpbmlzaC5jYWxsKCB0aGlzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVHVybiBvZmYgZmluaXNoaW5nIGZsYWdcblx0XHRcdGRlbGV0ZSBkYXRhLmZpbmlzaDtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmVhY2goIFsgXCJ0b2dnbGVcIiwgXCJzaG93XCIsIFwiaGlkZVwiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHR2YXIgY3NzRm4gPSBqUXVlcnkuZm5bIG5hbWUgXTtcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHNwZWVkID09IG51bGwgfHwgdHlwZW9mIHNwZWVkID09PSBcImJvb2xlYW5cIiA/XG5cdFx0XHRjc3NGbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgOlxuXHRcdFx0dGhpcy5hbmltYXRlKCBnZW5GeCggbmFtZSwgdHJ1ZSApLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9O1xufSApO1xuXG4vLyBHZW5lcmF0ZSBzaG9ydGN1dHMgZm9yIGN1c3RvbSBhbmltYXRpb25zXG5qUXVlcnkuZWFjaCgge1xuXHRzbGlkZURvd246IGdlbkZ4KCBcInNob3dcIiApLFxuXHRzbGlkZVVwOiBnZW5GeCggXCJoaWRlXCIgKSxcblx0c2xpZGVUb2dnbGU6IGdlbkZ4KCBcInRvZ2dsZVwiICksXG5cdGZhZGVJbjogeyBvcGFjaXR5OiBcInNob3dcIiB9LFxuXHRmYWRlT3V0OiB7IG9wYWNpdHk6IFwiaGlkZVwiIH0sXG5cdGZhZGVUb2dnbGU6IHsgb3BhY2l0eTogXCJ0b2dnbGVcIiB9XG59LCBmdW5jdGlvbiggbmFtZSwgcHJvcHMgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLmFuaW1hdGUoIHByb3BzLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9O1xufSApO1xuXG5qUXVlcnkudGltZXJzID0gW107XG5qUXVlcnkuZngudGljayA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGltZXIsXG5cdFx0aSA9IDAsXG5cdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycztcblxuXHRmeE5vdyA9IGpRdWVyeS5ub3coKTtcblxuXHRmb3IgKCA7IGkgPCB0aW1lcnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0dGltZXIgPSB0aW1lcnNbIGkgXTtcblxuXHRcdC8vIENoZWNrcyB0aGUgdGltZXIgaGFzIG5vdCBhbHJlYWR5IGJlZW4gcmVtb3ZlZFxuXHRcdGlmICggIXRpbWVyKCkgJiYgdGltZXJzWyBpIF0gPT09IHRpbWVyICkge1xuXHRcdFx0dGltZXJzLnNwbGljZSggaS0tLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhdGltZXJzLmxlbmd0aCApIHtcblx0XHRqUXVlcnkuZnguc3RvcCgpO1xuXHR9XG5cdGZ4Tm93ID0gdW5kZWZpbmVkO1xufTtcblxualF1ZXJ5LmZ4LnRpbWVyID0gZnVuY3Rpb24oIHRpbWVyICkge1xuXHRqUXVlcnkudGltZXJzLnB1c2goIHRpbWVyICk7XG5cdGlmICggdGltZXIoKSApIHtcblx0XHRqUXVlcnkuZnguc3RhcnQoKTtcblx0fSBlbHNlIHtcblx0XHRqUXVlcnkudGltZXJzLnBvcCgpO1xuXHR9XG59O1xuXG5qUXVlcnkuZnguaW50ZXJ2YWwgPSAxMztcbmpRdWVyeS5meC5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoICF0aW1lcklkICkge1xuXHRcdHRpbWVySWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoIGpRdWVyeS5meC50aWNrLCBqUXVlcnkuZnguaW50ZXJ2YWwgKTtcblx0fVxufTtcblxualF1ZXJ5LmZ4LnN0b3AgPSBmdW5jdGlvbigpIHtcblx0d2luZG93LmNsZWFySW50ZXJ2YWwoIHRpbWVySWQgKTtcblxuXHR0aW1lcklkID0gbnVsbDtcbn07XG5cbmpRdWVyeS5meC5zcGVlZHMgPSB7XG5cdHNsb3c6IDYwMCxcblx0ZmFzdDogMjAwLFxuXG5cdC8vIERlZmF1bHQgc3BlZWRcblx0X2RlZmF1bHQ6IDQwMFxufTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==