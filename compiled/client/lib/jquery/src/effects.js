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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9lZmZlY3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsZUFITyxFQUlQLHFCQUpPLEVBS1AsaUJBTE8sRUFNUCxvQkFOTyxFQU9QLGlCQVBPLEVBUVAsc0JBUk8sRUFTUCxxQkFUTyxFQVdQLGFBWE8sRUFZUCxpQkFaTyxFQWFQLFNBYk8sRUFjUCxPQWRPLEVBZVAsWUFmTyxFQWdCUCxjQWhCTyxDQUFSLEVBaUJHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixPQUE1QixFQUFxQyxTQUFyQyxFQUFnRCxTQUFoRCxFQUNGLFFBREUsRUFDUSxTQURSLEVBQ21CLGNBRG5CLEVBQ21DLFFBRG5DLEVBQzhDOztBQUVqRCxLQUNDLEtBREQ7S0FDUSxPQURSO0tBRUMsV0FBVyx3QkFBWDtLQUNBLE9BQU8sYUFBUDs7O0FBTGdELFVBUXhDLFdBQVQsR0FBdUI7QUFDdEIsU0FBTyxVQUFQLENBQW1CLFlBQVc7QUFDN0IsV0FBUSxTQUFSLENBRDZCO0dBQVgsQ0FBbkIsQ0FEc0I7QUFJdEIsU0FBUyxRQUFRLE9BQU8sR0FBUCxFQUFSLENBSmE7RUFBdkI7OztBQVJpRCxVQWdCeEMsS0FBVCxDQUFnQixJQUFoQixFQUFzQixZQUF0QixFQUFxQztBQUNwQyxNQUFJLEtBQUo7TUFDQyxJQUFJLENBQUo7TUFDQSxRQUFRLEVBQUUsUUFBUSxJQUFSLEVBQVY7Ozs7QUFIbUMsY0FPcEMsR0FBZSxlQUFlLENBQWYsR0FBbUIsQ0FBbkIsQ0FQcUI7QUFRcEMsU0FBUSxJQUFJLENBQUosRUFBUSxLQUFLLElBQUksWUFBSixFQUFtQjtBQUN2QyxXQUFRLFVBQVcsQ0FBWCxDQUFSLENBRHVDO0FBRXZDLFNBQU8sV0FBVyxLQUFYLENBQVAsR0FBNEIsTUFBTyxZQUFZLEtBQVosQ0FBUCxHQUE2QixJQUE3QixDQUZXO0dBQXhDOztBQUtBLE1B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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9yY3NzTnVtXCIsXG5cdFwiLi9jc3MvdmFyL2Nzc0V4cGFuZFwiLFxuXHRcIi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4vY3NzL3Zhci9pc0hpZGRlblwiLFxuXHRcIi4vY3NzL2FkanVzdENTU1wiLFxuXHRcIi4vY3NzL2RlZmF1bHREaXNwbGF5XCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL2VmZmVjdHMvVHdlZW5cIixcblx0XCIuL3F1ZXVlXCIsXG5cdFwiLi9jc3NcIixcblx0XCIuL2RlZmVycmVkXCIsXG5cdFwiLi90cmF2ZXJzaW5nXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCByY3NzTnVtLCBjc3NFeHBhbmQsIHJub3R3aGl0ZSxcblx0aXNIaWRkZW4sIGFkanVzdENTUywgZGVmYXVsdERpc3BsYXksIGRhdGFQcml2ICkge1xuXG52YXJcblx0ZnhOb3csIHRpbWVySWQsXG5cdHJmeHR5cGVzID0gL14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLFxuXHRycnVuID0gL3F1ZXVlSG9va3MkLztcblxuLy8gQW5pbWF0aW9ucyBjcmVhdGVkIHN5bmNocm9ub3VzbHkgd2lsbCBydW4gc3luY2hyb25vdXNseVxuZnVuY3Rpb24gY3JlYXRlRnhOb3coKSB7XG5cdHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRmeE5vdyA9IHVuZGVmaW5lZDtcblx0fSApO1xuXHRyZXR1cm4gKCBmeE5vdyA9IGpRdWVyeS5ub3coKSApO1xufVxuXG4vLyBHZW5lcmF0ZSBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSBhIHN0YW5kYXJkIGFuaW1hdGlvblxuZnVuY3Rpb24gZ2VuRngoIHR5cGUsIGluY2x1ZGVXaWR0aCApIHtcblx0dmFyIHdoaWNoLFxuXHRcdGkgPSAwLFxuXHRcdGF0dHJzID0geyBoZWlnaHQ6IHR5cGUgfTtcblxuXHQvLyBJZiB3ZSBpbmNsdWRlIHdpZHRoLCBzdGVwIHZhbHVlIGlzIDEgdG8gZG8gYWxsIGNzc0V4cGFuZCB2YWx1ZXMsXG5cdC8vIG90aGVyd2lzZSBzdGVwIHZhbHVlIGlzIDIgdG8gc2tpcCBvdmVyIExlZnQgYW5kIFJpZ2h0XG5cdGluY2x1ZGVXaWR0aCA9IGluY2x1ZGVXaWR0aCA/IDEgOiAwO1xuXHRmb3IgKCA7IGkgPCA0IDsgaSArPSAyIC0gaW5jbHVkZVdpZHRoICkge1xuXHRcdHdoaWNoID0gY3NzRXhwYW5kWyBpIF07XG5cdFx0YXR0cnNbIFwibWFyZ2luXCIgKyB3aGljaCBdID0gYXR0cnNbIFwicGFkZGluZ1wiICsgd2hpY2ggXSA9IHR5cGU7XG5cdH1cblxuXHRpZiAoIGluY2x1ZGVXaWR0aCApIHtcblx0XHRhdHRycy5vcGFjaXR5ID0gYXR0cnMud2lkdGggPSB0eXBlO1xuXHR9XG5cblx0cmV0dXJuIGF0dHJzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUd2VlbiggdmFsdWUsIHByb3AsIGFuaW1hdGlvbiApIHtcblx0dmFyIHR3ZWVuLFxuXHRcdGNvbGxlY3Rpb24gPSAoIEFuaW1hdGlvbi50d2VlbmVyc1sgcHJvcCBdIHx8IFtdICkuY29uY2F0KCBBbmltYXRpb24udHdlZW5lcnNbIFwiKlwiIF0gKSxcblx0XHRpbmRleCA9IDAsXG5cdFx0bGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0aWYgKCAoIHR3ZWVuID0gY29sbGVjdGlvblsgaW5kZXggXS5jYWxsKCBhbmltYXRpb24sIHByb3AsIHZhbHVlICkgKSApIHtcblxuXHRcdFx0Ly8gV2UncmUgZG9uZSB3aXRoIHRoaXMgcHJvcGVydHlcblx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZGVmYXVsdFByZWZpbHRlciggZWxlbSwgcHJvcHMsIG9wdHMgKSB7XG5cdC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cblx0dmFyIHByb3AsIHZhbHVlLCB0b2dnbGUsIHR3ZWVuLCBob29rcywgb2xkZmlyZSwgZGlzcGxheSwgY2hlY2tEaXNwbGF5LFxuXHRcdGFuaW0gPSB0aGlzLFxuXHRcdG9yaWcgPSB7fSxcblx0XHRzdHlsZSA9IGVsZW0uc3R5bGUsXG5cdFx0aGlkZGVuID0gZWxlbS5ub2RlVHlwZSAmJiBpc0hpZGRlbiggZWxlbSApLFxuXHRcdGRhdGFTaG93ID0gZGF0YVByaXYuZ2V0KCBlbGVtLCBcImZ4c2hvd1wiICk7XG5cblx0Ly8gSGFuZGxlIHF1ZXVlOiBmYWxzZSBwcm9taXNlc1xuXHRpZiAoICFvcHRzLnF1ZXVlICkge1xuXHRcdGhvb2tzID0galF1ZXJ5Ll9xdWV1ZUhvb2tzKCBlbGVtLCBcImZ4XCIgKTtcblx0XHRpZiAoIGhvb2tzLnVucXVldWVkID09IG51bGwgKSB7XG5cdFx0XHRob29rcy51bnF1ZXVlZCA9IDA7XG5cdFx0XHRvbGRmaXJlID0gaG9va3MuZW1wdHkuZmlyZTtcblx0XHRcdGhvb2tzLmVtcHR5LmZpcmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAhaG9va3MudW5xdWV1ZWQgKSB7XG5cdFx0XHRcdFx0b2xkZmlyZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRob29rcy51bnF1ZXVlZCsrO1xuXG5cdFx0YW5pbS5hbHdheXMoIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBFbnN1cmUgdGhlIGNvbXBsZXRlIGhhbmRsZXIgaXMgY2FsbGVkIGJlZm9yZSB0aGlzIGNvbXBsZXRlc1xuXHRcdFx0YW5pbS5hbHdheXMoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRob29rcy51bnF1ZXVlZC0tO1xuXHRcdFx0XHRpZiAoICFqUXVlcnkucXVldWUoIGVsZW0sIFwiZnhcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRob29rcy5lbXB0eS5maXJlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBIZWlnaHQvd2lkdGggb3ZlcmZsb3cgcGFzc1xuXHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgKCBcImhlaWdodFwiIGluIHByb3BzIHx8IFwid2lkdGhcIiBpbiBwcm9wcyApICkge1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgbm90aGluZyBzbmVha3Mgb3V0XG5cdFx0Ly8gUmVjb3JkIGFsbCAzIG92ZXJmbG93IGF0dHJpYnV0ZXMgYmVjYXVzZSBJRTktMTAgZG8gbm90XG5cdFx0Ly8gY2hhbmdlIHRoZSBvdmVyZmxvdyBhdHRyaWJ1dGUgd2hlbiBvdmVyZmxvd1ggYW5kXG5cdFx0Ly8gb3ZlcmZsb3dZIGFyZSBzZXQgdG8gdGhlIHNhbWUgdmFsdWVcblx0XHRvcHRzLm92ZXJmbG93ID0gWyBzdHlsZS5vdmVyZmxvdywgc3R5bGUub3ZlcmZsb3dYLCBzdHlsZS5vdmVyZmxvd1kgXTtcblxuXHRcdC8vIFNldCBkaXNwbGF5IHByb3BlcnR5IHRvIGlubGluZS1ibG9jayBmb3IgaGVpZ2h0L3dpZHRoXG5cdFx0Ly8gYW5pbWF0aW9ucyBvbiBpbmxpbmUgZWxlbWVudHMgdGhhdCBhcmUgaGF2aW5nIHdpZHRoL2hlaWdodCBhbmltYXRlZFxuXHRcdGRpc3BsYXkgPSBqUXVlcnkuY3NzKCBlbGVtLCBcImRpc3BsYXlcIiApO1xuXG5cdFx0Ly8gVGVzdCBkZWZhdWx0IGRpc3BsYXkgaWYgZGlzcGxheSBpcyBjdXJyZW50bHkgXCJub25lXCJcblx0XHRjaGVja0Rpc3BsYXkgPSBkaXNwbGF5ID09PSBcIm5vbmVcIiA/XG5cdFx0XHRkYXRhUHJpdi5nZXQoIGVsZW0sIFwib2xkZGlzcGxheVwiICkgfHwgZGVmYXVsdERpc3BsYXkoIGVsZW0ubm9kZU5hbWUgKSA6IGRpc3BsYXk7XG5cblx0XHRpZiAoIGNoZWNrRGlzcGxheSA9PT0gXCJpbmxpbmVcIiAmJiBqUXVlcnkuY3NzKCBlbGVtLCBcImZsb2F0XCIgKSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRzdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcblx0XHR9XG5cdH1cblxuXHRpZiAoIG9wdHMub3ZlcmZsb3cgKSB7XG5cdFx0c3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXHRcdGFuaW0uYWx3YXlzKCBmdW5jdGlvbigpIHtcblx0XHRcdHN0eWxlLm92ZXJmbG93ID0gb3B0cy5vdmVyZmxvd1sgMCBdO1xuXHRcdFx0c3R5bGUub3ZlcmZsb3dYID0gb3B0cy5vdmVyZmxvd1sgMSBdO1xuXHRcdFx0c3R5bGUub3ZlcmZsb3dZID0gb3B0cy5vdmVyZmxvd1sgMiBdO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIHNob3cvaGlkZSBwYXNzXG5cdGZvciAoIHByb3AgaW4gcHJvcHMgKSB7XG5cdFx0dmFsdWUgPSBwcm9wc1sgcHJvcCBdO1xuXHRcdGlmICggcmZ4dHlwZXMuZXhlYyggdmFsdWUgKSApIHtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgcHJvcCBdO1xuXHRcdFx0dG9nZ2xlID0gdG9nZ2xlIHx8IHZhbHVlID09PSBcInRvZ2dsZVwiO1xuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gKCBoaWRkZW4gPyBcImhpZGVcIiA6IFwic2hvd1wiICkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgZGF0YVNob3cgbGVmdCBvdmVyIGZyb20gYSBzdG9wcGVkIGhpZGUgb3Igc2hvd1xuXHRcdFx0XHQvLyBhbmQgd2UgYXJlIGdvaW5nIHRvIHByb2NlZWQgd2l0aCBzaG93LCB3ZSBzaG91bGQgcHJldGVuZCB0byBiZSBoaWRkZW5cblx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gXCJzaG93XCIgJiYgZGF0YVNob3cgJiYgZGF0YVNob3dbIHByb3AgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGhpZGRlbiA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9yaWdbIHByb3AgXSA9IGRhdGFTaG93ICYmIGRhdGFTaG93WyBwcm9wIF0gfHwgalF1ZXJ5LnN0eWxlKCBlbGVtLCBwcm9wICk7XG5cblx0XHQvLyBBbnkgbm9uLWZ4IHZhbHVlIHN0b3BzIHVzIGZyb20gcmVzdG9yaW5nIHRoZSBvcmlnaW5hbCBkaXNwbGF5IHZhbHVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpc3BsYXkgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhalF1ZXJ5LmlzRW1wdHlPYmplY3QoIG9yaWcgKSApIHtcblx0XHRpZiAoIGRhdGFTaG93ICkge1xuXHRcdFx0aWYgKCBcImhpZGRlblwiIGluIGRhdGFTaG93ICkge1xuXHRcdFx0XHRoaWRkZW4gPSBkYXRhU2hvdy5oaWRkZW47XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGFTaG93ID0gZGF0YVByaXYuYWNjZXNzKCBlbGVtLCBcImZ4c2hvd1wiLCB7fSApO1xuXHRcdH1cblxuXHRcdC8vIFN0b3JlIHN0YXRlIGlmIGl0cyB0b2dnbGUgLSBlbmFibGVzIC5zdG9wKCkudG9nZ2xlKCkgdG8gXCJyZXZlcnNlXCJcblx0XHRpZiAoIHRvZ2dsZSApIHtcblx0XHRcdGRhdGFTaG93LmhpZGRlbiA9ICFoaWRkZW47XG5cdFx0fVxuXHRcdGlmICggaGlkZGVuICkge1xuXHRcdFx0alF1ZXJ5KCBlbGVtICkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhbmltLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRqUXVlcnkoIGVsZW0gKS5oaWRlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdGFuaW0uZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcHJvcDtcblxuXHRcdFx0ZGF0YVByaXYucmVtb3ZlKCBlbGVtLCBcImZ4c2hvd1wiICk7XG5cdFx0XHRmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG5cdFx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgcHJvcCwgb3JpZ1sgcHJvcCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHRcdGZvciAoIHByb3AgaW4gb3JpZyApIHtcblx0XHRcdHR3ZWVuID0gY3JlYXRlVHdlZW4oIGhpZGRlbiA/IGRhdGFTaG93WyBwcm9wIF0gOiAwLCBwcm9wLCBhbmltICk7XG5cblx0XHRcdGlmICggISggcHJvcCBpbiBkYXRhU2hvdyApICkge1xuXHRcdFx0XHRkYXRhU2hvd1sgcHJvcCBdID0gdHdlZW4uc3RhcnQ7XG5cdFx0XHRcdGlmICggaGlkZGVuICkge1xuXHRcdFx0XHRcdHR3ZWVuLmVuZCA9IHR3ZWVuLnN0YXJ0O1xuXHRcdFx0XHRcdHR3ZWVuLnN0YXJ0ID0gcHJvcCA9PT0gXCJ3aWR0aFwiIHx8IHByb3AgPT09IFwiaGVpZ2h0XCIgPyAxIDogMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHQvLyBJZiB0aGlzIGlzIGEgbm9vcCBsaWtlIC5oaWRlKCkuaGlkZSgpLCByZXN0b3JlIGFuIG92ZXJ3cml0dGVuIGRpc3BsYXkgdmFsdWVcblx0fSBlbHNlIGlmICggKCBkaXNwbGF5ID09PSBcIm5vbmVcIiA/IGRlZmF1bHREaXNwbGF5KCBlbGVtLm5vZGVOYW1lICkgOiBkaXNwbGF5ICkgPT09IFwiaW5saW5lXCIgKSB7XG5cdFx0c3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJvcEZpbHRlciggcHJvcHMsIHNwZWNpYWxFYXNpbmcgKSB7XG5cdHZhciBpbmRleCwgbmFtZSwgZWFzaW5nLCB2YWx1ZSwgaG9va3M7XG5cblx0Ly8gY2FtZWxDYXNlLCBzcGVjaWFsRWFzaW5nIGFuZCBleHBhbmQgY3NzSG9vayBwYXNzXG5cdGZvciAoIGluZGV4IGluIHByb3BzICkge1xuXHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBpbmRleCApO1xuXHRcdGVhc2luZyA9IHNwZWNpYWxFYXNpbmdbIG5hbWUgXTtcblx0XHR2YWx1ZSA9IHByb3BzWyBpbmRleCBdO1xuXHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIHZhbHVlICkgKSB7XG5cdFx0XHRlYXNpbmcgPSB2YWx1ZVsgMSBdO1xuXHRcdFx0dmFsdWUgPSBwcm9wc1sgaW5kZXggXSA9IHZhbHVlWyAwIF07XG5cdFx0fVxuXG5cdFx0aWYgKCBpbmRleCAhPT0gbmFtZSApIHtcblx0XHRcdHByb3BzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgaW5kZXggXTtcblx0XHR9XG5cblx0XHRob29rcyA9IGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdO1xuXHRcdGlmICggaG9va3MgJiYgXCJleHBhbmRcIiBpbiBob29rcyApIHtcblx0XHRcdHZhbHVlID0gaG9va3MuZXhwYW5kKCB2YWx1ZSApO1xuXHRcdFx0ZGVsZXRlIHByb3BzWyBuYW1lIF07XG5cblx0XHRcdC8vIE5vdCBxdWl0ZSAkLmV4dGVuZCwgdGhpcyB3b24ndCBvdmVyd3JpdGUgZXhpc3Rpbmcga2V5cy5cblx0XHRcdC8vIFJldXNpbmcgJ2luZGV4JyBiZWNhdXNlIHdlIGhhdmUgdGhlIGNvcnJlY3QgXCJuYW1lXCJcblx0XHRcdGZvciAoIGluZGV4IGluIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICEoIGluZGV4IGluIHByb3BzICkgKSB7XG5cdFx0XHRcdFx0cHJvcHNbIGluZGV4IF0gPSB2YWx1ZVsgaW5kZXggXTtcblx0XHRcdFx0XHRzcGVjaWFsRWFzaW5nWyBpbmRleCBdID0gZWFzaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNwZWNpYWxFYXNpbmdbIG5hbWUgXSA9IGVhc2luZztcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gQW5pbWF0aW9uKCBlbGVtLCBwcm9wZXJ0aWVzLCBvcHRpb25zICkge1xuXHR2YXIgcmVzdWx0LFxuXHRcdHN0b3BwZWQsXG5cdFx0aW5kZXggPSAwLFxuXHRcdGxlbmd0aCA9IEFuaW1hdGlvbi5wcmVmaWx0ZXJzLmxlbmd0aCxcblx0XHRkZWZlcnJlZCA9IGpRdWVyeS5EZWZlcnJlZCgpLmFsd2F5cyggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIERvbid0IG1hdGNoIGVsZW0gaW4gdGhlIDphbmltYXRlZCBzZWxlY3RvclxuXHRcdFx0ZGVsZXRlIHRpY2suZWxlbTtcblx0XHR9ICksXG5cdFx0dGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCBzdG9wcGVkICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgY3VycmVudFRpbWUgPSBmeE5vdyB8fCBjcmVhdGVGeE5vdygpLFxuXHRcdFx0XHRyZW1haW5pbmcgPSBNYXRoLm1heCggMCwgYW5pbWF0aW9uLnN0YXJ0VGltZSArIGFuaW1hdGlvbi5kdXJhdGlvbiAtIGN1cnJlbnRUaW1lICksXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZCAyLjNcblx0XHRcdFx0Ly8gQXJjaGFpYyBjcmFzaCBidWcgd29uJ3QgYWxsb3cgdXMgdG8gdXNlIGAxIC0gKCAwLjUgfHwgMCApYCAoIzEyNDk3KVxuXHRcdFx0XHR0ZW1wID0gcmVtYWluaW5nIC8gYW5pbWF0aW9uLmR1cmF0aW9uIHx8IDAsXG5cdFx0XHRcdHBlcmNlbnQgPSAxIC0gdGVtcCxcblx0XHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0XHRsZW5ndGggPSBhbmltYXRpb24udHdlZW5zLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggOyBpbmRleCA8IGxlbmd0aCA7IGluZGV4KysgKSB7XG5cdFx0XHRcdGFuaW1hdGlvbi50d2VlbnNbIGluZGV4IF0ucnVuKCBwZXJjZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIGVsZW0sIFsgYW5pbWF0aW9uLCBwZXJjZW50LCByZW1haW5pbmcgXSApO1xuXG5cdFx0XHRpZiAoIHBlcmNlbnQgPCAxICYmIGxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuIHJlbWFpbmluZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiBdICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFuaW1hdGlvbiA9IGRlZmVycmVkLnByb21pc2UoIHtcblx0XHRcdGVsZW06IGVsZW0sXG5cdFx0XHRwcm9wczogalF1ZXJ5LmV4dGVuZCgge30sIHByb3BlcnRpZXMgKSxcblx0XHRcdG9wdHM6IGpRdWVyeS5leHRlbmQoIHRydWUsIHtcblx0XHRcdFx0c3BlY2lhbEVhc2luZzoge30sXG5cdFx0XHRcdGVhc2luZzogalF1ZXJ5LmVhc2luZy5fZGVmYXVsdFxuXHRcdFx0fSwgb3B0aW9ucyApLFxuXHRcdFx0b3JpZ2luYWxQcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuXHRcdFx0b3JpZ2luYWxPcHRpb25zOiBvcHRpb25zLFxuXHRcdFx0c3RhcnRUaW1lOiBmeE5vdyB8fCBjcmVhdGVGeE5vdygpLFxuXHRcdFx0ZHVyYXRpb246IG9wdGlvbnMuZHVyYXRpb24sXG5cdFx0XHR0d2VlbnM6IFtdLFxuXHRcdFx0Y3JlYXRlVHdlZW46IGZ1bmN0aW9uKCBwcm9wLCBlbmQgKSB7XG5cdFx0XHRcdHZhciB0d2VlbiA9IGpRdWVyeS5Ud2VlbiggZWxlbSwgYW5pbWF0aW9uLm9wdHMsIHByb3AsIGVuZCxcblx0XHRcdFx0XHRcdGFuaW1hdGlvbi5vcHRzLnNwZWNpYWxFYXNpbmdbIHByb3AgXSB8fCBhbmltYXRpb24ub3B0cy5lYXNpbmcgKTtcblx0XHRcdFx0YW5pbWF0aW9uLnR3ZWVucy5wdXNoKCB0d2VlbiApO1xuXHRcdFx0XHRyZXR1cm4gdHdlZW47XG5cdFx0XHR9LFxuXHRcdFx0c3RvcDogZnVuY3Rpb24oIGdvdG9FbmQgKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IDAsXG5cblx0XHRcdFx0XHQvLyBJZiB3ZSBhcmUgZ29pbmcgdG8gdGhlIGVuZCwgd2Ugd2FudCB0byBydW4gYWxsIHRoZSB0d2VlbnNcblx0XHRcdFx0XHQvLyBvdGhlcndpc2Ugd2Ugc2tpcCB0aGlzIHBhcnRcblx0XHRcdFx0XHRsZW5ndGggPSBnb3RvRW5kID8gYW5pbWF0aW9uLnR3ZWVucy5sZW5ndGggOiAwO1xuXHRcdFx0XHRpZiAoIHN0b3BwZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RvcHBlZCA9IHRydWU7XG5cdFx0XHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0XHRcdGFuaW1hdGlvbi50d2VlbnNbIGluZGV4IF0ucnVuKCAxICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZXNvbHZlIHdoZW4gd2UgcGxheWVkIHRoZSBsYXN0IGZyYW1lOyBvdGhlcndpc2UsIHJlamVjdFxuXHRcdFx0XHRpZiAoIGdvdG9FbmQgKSB7XG5cdFx0XHRcdFx0ZGVmZXJyZWQubm90aWZ5V2l0aCggZWxlbSwgWyBhbmltYXRpb24sIDEsIDAgXSApO1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiwgZ290b0VuZCBdICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggZWxlbSwgWyBhbmltYXRpb24sIGdvdG9FbmQgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdH0gKSxcblx0XHRwcm9wcyA9IGFuaW1hdGlvbi5wcm9wcztcblxuXHRwcm9wRmlsdGVyKCBwcm9wcywgYW5pbWF0aW9uLm9wdHMuc3BlY2lhbEVhc2luZyApO1xuXG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdHJlc3VsdCA9IEFuaW1hdGlvbi5wcmVmaWx0ZXJzWyBpbmRleCBdLmNhbGwoIGFuaW1hdGlvbiwgZWxlbSwgcHJvcHMsIGFuaW1hdGlvbi5vcHRzICk7XG5cdFx0aWYgKCByZXN1bHQgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCByZXN1bHQuc3RvcCApICkge1xuXHRcdFx0XHRqUXVlcnkuX3F1ZXVlSG9va3MoIGFuaW1hdGlvbi5lbGVtLCBhbmltYXRpb24ub3B0cy5xdWV1ZSApLnN0b3AgPVxuXHRcdFx0XHRcdGpRdWVyeS5wcm94eSggcmVzdWx0LnN0b3AsIHJlc3VsdCApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdH1cblxuXHRqUXVlcnkubWFwKCBwcm9wcywgY3JlYXRlVHdlZW4sIGFuaW1hdGlvbiApO1xuXG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGFuaW1hdGlvbi5vcHRzLnN0YXJ0ICkgKSB7XG5cdFx0YW5pbWF0aW9uLm9wdHMuc3RhcnQuY2FsbCggZWxlbSwgYW5pbWF0aW9uICk7XG5cdH1cblxuXHRqUXVlcnkuZngudGltZXIoXG5cdFx0alF1ZXJ5LmV4dGVuZCggdGljaywge1xuXHRcdFx0ZWxlbTogZWxlbSxcblx0XHRcdGFuaW06IGFuaW1hdGlvbixcblx0XHRcdHF1ZXVlOiBhbmltYXRpb24ub3B0cy5xdWV1ZVxuXHRcdH0gKVxuXHQpO1xuXG5cdC8vIGF0dGFjaCBjYWxsYmFja3MgZnJvbSBvcHRpb25zXG5cdHJldHVybiBhbmltYXRpb24ucHJvZ3Jlc3MoIGFuaW1hdGlvbi5vcHRzLnByb2dyZXNzIClcblx0XHQuZG9uZSggYW5pbWF0aW9uLm9wdHMuZG9uZSwgYW5pbWF0aW9uLm9wdHMuY29tcGxldGUgKVxuXHRcdC5mYWlsKCBhbmltYXRpb24ub3B0cy5mYWlsIClcblx0XHQuYWx3YXlzKCBhbmltYXRpb24ub3B0cy5hbHdheXMgKTtcbn1cblxualF1ZXJ5LkFuaW1hdGlvbiA9IGpRdWVyeS5leHRlbmQoIEFuaW1hdGlvbiwge1xuXHR0d2VlbmVyczoge1xuXHRcdFwiKlwiOiBbIGZ1bmN0aW9uKCBwcm9wLCB2YWx1ZSApIHtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuY3JlYXRlVHdlZW4oIHByb3AsIHZhbHVlICk7XG5cdFx0XHRhZGp1c3RDU1MoIHR3ZWVuLmVsZW0sIHByb3AsIHJjc3NOdW0uZXhlYyggdmFsdWUgKSwgdHdlZW4gKTtcblx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHR9IF1cblx0fSxcblxuXHR0d2VlbmVyOiBmdW5jdGlvbiggcHJvcHMsIGNhbGxiYWNrICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHByb3BzICkgKSB7XG5cdFx0XHRjYWxsYmFjayA9IHByb3BzO1xuXHRcdFx0cHJvcHMgPSBbIFwiKlwiIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb3BzID0gcHJvcHMubWF0Y2goIHJub3R3aGl0ZSApO1xuXHRcdH1cblxuXHRcdHZhciBwcm9wLFxuXHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0bGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG5cdFx0Zm9yICggOyBpbmRleCA8IGxlbmd0aCA7IGluZGV4KysgKSB7XG5cdFx0XHRwcm9wID0gcHJvcHNbIGluZGV4IF07XG5cdFx0XHRBbmltYXRpb24udHdlZW5lcnNbIHByb3AgXSA9IEFuaW1hdGlvbi50d2VlbmVyc1sgcHJvcCBdIHx8IFtdO1xuXHRcdFx0QW5pbWF0aW9uLnR3ZWVuZXJzWyBwcm9wIF0udW5zaGlmdCggY2FsbGJhY2sgKTtcblx0XHR9XG5cdH0sXG5cblx0cHJlZmlsdGVyczogWyBkZWZhdWx0UHJlZmlsdGVyIF0sXG5cblx0cHJlZmlsdGVyOiBmdW5jdGlvbiggY2FsbGJhY2ssIHByZXBlbmQgKSB7XG5cdFx0aWYgKCBwcmVwZW5kICkge1xuXHRcdFx0QW5pbWF0aW9uLnByZWZpbHRlcnMudW5zaGlmdCggY2FsbGJhY2sgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0QW5pbWF0aW9uLnByZWZpbHRlcnMucHVzaCggY2FsbGJhY2sgKTtcblx0XHR9XG5cdH1cbn0gKTtcblxualF1ZXJ5LnNwZWVkID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGZuICkge1xuXHR2YXIgb3B0ID0gc3BlZWQgJiYgdHlwZW9mIHNwZWVkID09PSBcIm9iamVjdFwiID8galF1ZXJ5LmV4dGVuZCgge30sIHNwZWVkICkgOiB7XG5cdFx0Y29tcGxldGU6IGZuIHx8ICFmbiAmJiBlYXNpbmcgfHxcblx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxuXHRcdGR1cmF0aW9uOiBzcGVlZCxcblx0XHRlYXNpbmc6IGZuICYmIGVhc2luZyB8fCBlYXNpbmcgJiYgIWpRdWVyeS5pc0Z1bmN0aW9uKCBlYXNpbmcgKSAmJiBlYXNpbmdcblx0fTtcblxuXHRvcHQuZHVyYXRpb24gPSBqUXVlcnkuZngub2ZmID8gMCA6IHR5cGVvZiBvcHQuZHVyYXRpb24gPT09IFwibnVtYmVyXCIgP1xuXHRcdG9wdC5kdXJhdGlvbiA6IG9wdC5kdXJhdGlvbiBpbiBqUXVlcnkuZnguc3BlZWRzID9cblx0XHRcdGpRdWVyeS5meC5zcGVlZHNbIG9wdC5kdXJhdGlvbiBdIDogalF1ZXJ5LmZ4LnNwZWVkcy5fZGVmYXVsdDtcblxuXHQvLyBOb3JtYWxpemUgb3B0LnF1ZXVlIC0gdHJ1ZS91bmRlZmluZWQvbnVsbCAtPiBcImZ4XCJcblx0aWYgKCBvcHQucXVldWUgPT0gbnVsbCB8fCBvcHQucXVldWUgPT09IHRydWUgKSB7XG5cdFx0b3B0LnF1ZXVlID0gXCJmeFwiO1xuXHR9XG5cblx0Ly8gUXVldWVpbmdcblx0b3B0Lm9sZCA9IG9wdC5jb21wbGV0ZTtcblxuXHRvcHQuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBvcHQub2xkICkgKSB7XG5cdFx0XHRvcHQub2xkLmNhbGwoIHRoaXMgKTtcblx0XHR9XG5cblx0XHRpZiAoIG9wdC5xdWV1ZSApIHtcblx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCBvcHQucXVldWUgKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIG9wdDtcbn07XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0ZmFkZVRvOiBmdW5jdGlvbiggc3BlZWQsIHRvLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXG5cdFx0Ly8gU2hvdyBhbnkgaGlkZGVuIGVsZW1lbnRzIGFmdGVyIHNldHRpbmcgb3BhY2l0eSB0byAwXG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKCBpc0hpZGRlbiApLmNzcyggXCJvcGFjaXR5XCIsIDAgKS5zaG93KClcblxuXHRcdFx0Ly8gQW5pbWF0ZSB0byB0aGUgdmFsdWUgc3BlY2lmaWVkXG5cdFx0XHQuZW5kKCkuYW5pbWF0ZSggeyBvcGFjaXR5OiB0byB9LCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9LFxuXHRhbmltYXRlOiBmdW5jdGlvbiggcHJvcCwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0dmFyIGVtcHR5ID0galF1ZXJ5LmlzRW1wdHlPYmplY3QoIHByb3AgKSxcblx0XHRcdG9wdGFsbCA9IGpRdWVyeS5zcGVlZCggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSxcblx0XHRcdGRvQW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8gT3BlcmF0ZSBvbiBhIGNvcHkgb2YgcHJvcCBzbyBwZXItcHJvcGVydHkgZWFzaW5nIHdvbid0IGJlIGxvc3Rcblx0XHRcdFx0dmFyIGFuaW0gPSBBbmltYXRpb24oIHRoaXMsIGpRdWVyeS5leHRlbmQoIHt9LCBwcm9wICksIG9wdGFsbCApO1xuXG5cdFx0XHRcdC8vIEVtcHR5IGFuaW1hdGlvbnMsIG9yIGZpbmlzaGluZyByZXNvbHZlcyBpbW1lZGlhdGVseVxuXHRcdFx0XHRpZiAoIGVtcHR5IHx8IGRhdGFQcml2LmdldCggdGhpcywgXCJmaW5pc2hcIiApICkge1xuXHRcdFx0XHRcdGFuaW0uc3RvcCggdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0ZG9BbmltYXRpb24uZmluaXNoID0gZG9BbmltYXRpb247XG5cblx0XHRyZXR1cm4gZW1wdHkgfHwgb3B0YWxsLnF1ZXVlID09PSBmYWxzZSA/XG5cdFx0XHR0aGlzLmVhY2goIGRvQW5pbWF0aW9uICkgOlxuXHRcdFx0dGhpcy5xdWV1ZSggb3B0YWxsLnF1ZXVlLCBkb0FuaW1hdGlvbiApO1xuXHR9LFxuXHRzdG9wOiBmdW5jdGlvbiggdHlwZSwgY2xlYXJRdWV1ZSwgZ290b0VuZCApIHtcblx0XHR2YXIgc3RvcFF1ZXVlID0gZnVuY3Rpb24oIGhvb2tzICkge1xuXHRcdFx0dmFyIHN0b3AgPSBob29rcy5zdG9wO1xuXHRcdFx0ZGVsZXRlIGhvb2tzLnN0b3A7XG5cdFx0XHRzdG9wKCBnb3RvRW5kICk7XG5cdFx0fTtcblxuXHRcdGlmICggdHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRnb3RvRW5kID0gY2xlYXJRdWV1ZTtcblx0XHRcdGNsZWFyUXVldWUgPSB0eXBlO1xuXHRcdFx0dHlwZSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBjbGVhclF1ZXVlICYmIHR5cGUgIT09IGZhbHNlICkge1xuXHRcdFx0dGhpcy5xdWV1ZSggdHlwZSB8fCBcImZ4XCIsIFtdICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGVxdWV1ZSA9IHRydWUsXG5cdFx0XHRcdGluZGV4ID0gdHlwZSAhPSBudWxsICYmIHR5cGUgKyBcInF1ZXVlSG9va3NcIixcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0ZGF0YSA9IGRhdGFQcml2LmdldCggdGhpcyApO1xuXG5cdFx0XHRpZiAoIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoIGRhdGFbIGluZGV4IF0gJiYgZGF0YVsgaW5kZXggXS5zdG9wICkge1xuXHRcdFx0XHRcdHN0b3BRdWV1ZSggZGF0YVsgaW5kZXggXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCBpbmRleCBpbiBkYXRhICkge1xuXHRcdFx0XHRcdGlmICggZGF0YVsgaW5kZXggXSAmJiBkYXRhWyBpbmRleCBdLnN0b3AgJiYgcnJ1bi50ZXN0KCBpbmRleCApICkge1xuXHRcdFx0XHRcdFx0c3RvcFF1ZXVlKCBkYXRhWyBpbmRleCBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIGluZGV4ID0gdGltZXJzLmxlbmd0aDsgaW5kZXgtLTsgKSB7XG5cdFx0XHRcdGlmICggdGltZXJzWyBpbmRleCBdLmVsZW0gPT09IHRoaXMgJiZcblx0XHRcdFx0XHQoIHR5cGUgPT0gbnVsbCB8fCB0aW1lcnNbIGluZGV4IF0ucXVldWUgPT09IHR5cGUgKSApIHtcblxuXHRcdFx0XHRcdHRpbWVyc1sgaW5kZXggXS5hbmltLnN0b3AoIGdvdG9FbmQgKTtcblx0XHRcdFx0XHRkZXF1ZXVlID0gZmFsc2U7XG5cdFx0XHRcdFx0dGltZXJzLnNwbGljZSggaW5kZXgsIDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdGFydCB0aGUgbmV4dCBpbiB0aGUgcXVldWUgaWYgdGhlIGxhc3Qgc3RlcCB3YXNuJ3QgZm9yY2VkLlxuXHRcdFx0Ly8gVGltZXJzIGN1cnJlbnRseSB3aWxsIGNhbGwgdGhlaXIgY29tcGxldGUgY2FsbGJhY2tzLCB3aGljaFxuXHRcdFx0Ly8gd2lsbCBkZXF1ZXVlIGJ1dCBvbmx5IGlmIHRoZXkgd2VyZSBnb3RvRW5kLlxuXHRcdFx0aWYgKCBkZXF1ZXVlIHx8ICFnb3RvRW5kICkge1xuXHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblx0ZmluaXNoOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRpZiAoIHR5cGUgIT09IGZhbHNlICkge1xuXHRcdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCxcblx0XHRcdFx0ZGF0YSA9IGRhdGFQcml2LmdldCggdGhpcyApLFxuXHRcdFx0XHRxdWV1ZSA9IGRhdGFbIHR5cGUgKyBcInF1ZXVlXCIgXSxcblx0XHRcdFx0aG9va3MgPSBkYXRhWyB0eXBlICsgXCJxdWV1ZUhvb2tzXCIgXSxcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0bGVuZ3RoID0gcXVldWUgPyBxdWV1ZS5sZW5ndGggOiAwO1xuXG5cdFx0XHQvLyBFbmFibGUgZmluaXNoaW5nIGZsYWcgb24gcHJpdmF0ZSBkYXRhXG5cdFx0XHRkYXRhLmZpbmlzaCA9IHRydWU7XG5cblx0XHRcdC8vIEVtcHR5IHRoZSBxdWV1ZSBmaXJzdFxuXHRcdFx0alF1ZXJ5LnF1ZXVlKCB0aGlzLCB0eXBlLCBbXSApO1xuXG5cdFx0XHRpZiAoIGhvb2tzICYmIGhvb2tzLnN0b3AgKSB7XG5cdFx0XHRcdGhvb2tzLnN0b3AuY2FsbCggdGhpcywgdHJ1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb29rIGZvciBhbnkgYWN0aXZlIGFuaW1hdGlvbnMsIGFuZCBmaW5pc2ggdGhlbVxuXHRcdFx0Zm9yICggaW5kZXggPSB0aW1lcnMubGVuZ3RoOyBpbmRleC0tOyApIHtcblx0XHRcdFx0aWYgKCB0aW1lcnNbIGluZGV4IF0uZWxlbSA9PT0gdGhpcyAmJiB0aW1lcnNbIGluZGV4IF0ucXVldWUgPT09IHR5cGUgKSB7XG5cdFx0XHRcdFx0dGltZXJzWyBpbmRleCBdLmFuaW0uc3RvcCggdHJ1ZSApO1xuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoIGluZGV4LCAxICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vayBmb3IgYW55IGFuaW1hdGlvbnMgaW4gdGhlIG9sZCBxdWV1ZSBhbmQgZmluaXNoIHRoZW1cblx0XHRcdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRcdGlmICggcXVldWVbIGluZGV4IF0gJiYgcXVldWVbIGluZGV4IF0uZmluaXNoICkge1xuXHRcdFx0XHRcdHF1ZXVlWyBpbmRleCBdLmZpbmlzaC5jYWxsKCB0aGlzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVHVybiBvZmYgZmluaXNoaW5nIGZsYWdcblx0XHRcdGRlbGV0ZSBkYXRhLmZpbmlzaDtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmVhY2goIFsgXCJ0b2dnbGVcIiwgXCJzaG93XCIsIFwiaGlkZVwiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHR2YXIgY3NzRm4gPSBqUXVlcnkuZm5bIG5hbWUgXTtcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHNwZWVkID09IG51bGwgfHwgdHlwZW9mIHNwZWVkID09PSBcImJvb2xlYW5cIiA/XG5cdFx0XHRjc3NGbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgOlxuXHRcdFx0dGhpcy5hbmltYXRlKCBnZW5GeCggbmFtZSwgdHJ1ZSApLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9O1xufSApO1xuXG4vLyBHZW5lcmF0ZSBzaG9ydGN1dHMgZm9yIGN1c3RvbSBhbmltYXRpb25zXG5qUXVlcnkuZWFjaCgge1xuXHRzbGlkZURvd246IGdlbkZ4KCBcInNob3dcIiApLFxuXHRzbGlkZVVwOiBnZW5GeCggXCJoaWRlXCIgKSxcblx0c2xpZGVUb2dnbGU6IGdlbkZ4KCBcInRvZ2dsZVwiICksXG5cdGZhZGVJbjogeyBvcGFjaXR5OiBcInNob3dcIiB9LFxuXHRmYWRlT3V0OiB7IG9wYWNpdHk6IFwiaGlkZVwiIH0sXG5cdGZhZGVUb2dnbGU6IHsgb3BhY2l0eTogXCJ0b2dnbGVcIiB9XG59LCBmdW5jdGlvbiggbmFtZSwgcHJvcHMgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLmFuaW1hdGUoIHByb3BzLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApO1xuXHR9O1xufSApO1xuXG5qUXVlcnkudGltZXJzID0gW107XG5qUXVlcnkuZngudGljayA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGltZXIsXG5cdFx0aSA9IDAsXG5cdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycztcblxuXHRmeE5vdyA9IGpRdWVyeS5ub3coKTtcblxuXHRmb3IgKCA7IGkgPCB0aW1lcnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0dGltZXIgPSB0aW1lcnNbIGkgXTtcblxuXHRcdC8vIENoZWNrcyB0aGUgdGltZXIgaGFzIG5vdCBhbHJlYWR5IGJlZW4gcmVtb3ZlZFxuXHRcdGlmICggIXRpbWVyKCkgJiYgdGltZXJzWyBpIF0gPT09IHRpbWVyICkge1xuXHRcdFx0dGltZXJzLnNwbGljZSggaS0tLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhdGltZXJzLmxlbmd0aCApIHtcblx0XHRqUXVlcnkuZnguc3RvcCgpO1xuXHR9XG5cdGZ4Tm93ID0gdW5kZWZpbmVkO1xufTtcblxualF1ZXJ5LmZ4LnRpbWVyID0gZnVuY3Rpb24oIHRpbWVyICkge1xuXHRqUXVlcnkudGltZXJzLnB1c2goIHRpbWVyICk7XG5cdGlmICggdGltZXIoKSApIHtcblx0XHRqUXVlcnkuZnguc3RhcnQoKTtcblx0fSBlbHNlIHtcblx0XHRqUXVlcnkudGltZXJzLnBvcCgpO1xuXHR9XG59O1xuXG5qUXVlcnkuZnguaW50ZXJ2YWwgPSAxMztcbmpRdWVyeS5meC5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoICF0aW1lcklkICkge1xuXHRcdHRpbWVySWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoIGpRdWVyeS5meC50aWNrLCBqUXVlcnkuZnguaW50ZXJ2YWwgKTtcblx0fVxufTtcblxualF1ZXJ5LmZ4LnN0b3AgPSBmdW5jdGlvbigpIHtcblx0d2luZG93LmNsZWFySW50ZXJ2YWwoIHRpbWVySWQgKTtcblxuXHR0aW1lcklkID0gbnVsbDtcbn07XG5cbmpRdWVyeS5meC5zcGVlZHMgPSB7XG5cdHNsb3c6IDYwMCxcblx0ZmFzdDogMjAwLFxuXG5cdC8vIERlZmF1bHQgc3BlZWRcblx0X2RlZmF1bHQ6IDQwMFxufTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==