"use strict";

define(["./core", "./var/slice", "./callbacks"], function (jQuery, slice) {

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [

			// action, add listener, listener list, final state
			["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				then: function then() /* fnDone, fnFail, fnProgress */{
					var fns = arguments;
					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {
							var fn = jQuery.isFunction(fns[i]) && fns[i];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && jQuery.isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this === _promise ? newDefer.promise() : this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			// Keep pipe for back-compat
			_promise.pipe = _promise.then;

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				_promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = [ resolved | rejected ]
						_state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}

				// deferred[ resolve | reject | notify ]
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? _promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			_promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function when(subordinate /* , ..., subordinateN */) {
			var i = 0,
			    resolveValues = slice.call(arguments),
			    length = resolveValues.length,


			// the count of uncompleted subordinates
			remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,


			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),


			// Update function for both resolve and progress values
			updateFunc = function updateFunc(i, contexts, values) {
				return function (value) {
					contexts[i] = this;
					values[i] = arguments.length > 1 ? slice.call(arguments) : value;
					if (values === progressValues) {
						deferred.notifyWith(contexts, values);
					} else if (! --remaining) {
						deferred.resolveWith(contexts, values);
					}
				};
			},
			    progressValues,
			    progressContexts,
			    resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if (length > 1) {
				progressValues = new Array(length);
				progressContexts = new Array(length);
				resolveContexts = new Array(length);
				for (; i < length; i++) {
					if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
						resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if (!remaining) {
				deferred.resolveWith(resolveContexts, resolveValues);
			}

			return deferred.promise();
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kZWZlcnJlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAsYUFGTyxFQUdQLGFBSE8sQ0FBUixFQUlHLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUEwQjs7QUFFN0IsUUFBTyxNQUFQLENBQWU7O0FBRWQsWUFBVSxrQkFBVSxJQUFWLEVBQWlCO0FBQzFCLE9BQUksU0FBUzs7O0FBR1gsSUFBRSxTQUFGLEVBQWEsTUFBYixFQUFxQixPQUFPLFNBQVAsQ0FBa0IsYUFBbEIsQ0FBckIsRUFBd0QsVUFBeEQsQ0FIVyxFQUlYLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0IsT0FBTyxTQUFQLENBQWtCLGFBQWxCLENBQXBCLEVBQXVELFVBQXZELENBSlcsRUFLWCxDQUFFLFFBQUYsRUFBWSxVQUFaLEVBQXdCLE9BQU8sU0FBUCxDQUFrQixRQUFsQixDQUF4QixDQUxXLENBQVQ7T0FPSCxTQUFRLFNBQVI7T0FDQSxXQUFVO0FBQ1QsV0FBTyxpQkFBVztBQUNqQixZQUFPLE1BQVAsQ0FEaUI7S0FBWDtBQUdQLFlBQVEsa0JBQVc7QUFDbEIsY0FBUyxJQUFULENBQWUsU0FBZixFQUEyQixJQUEzQixDQUFpQyxTQUFqQyxFQURrQjtBQUVsQixZQUFPLElBQVAsQ0FGa0I7S0FBWDtBQUlSLFVBQU0sZ0RBQTZDO0FBQ2xELFNBQUksTUFBTSxTQUFOLENBRDhDO0FBRWxELFlBQU8sT0FBTyxRQUFQLENBQWlCLFVBQVUsUUFBVixFQUFxQjtBQUM1QyxhQUFPLElBQVAsQ0FBYSxNQUFiLEVBQXFCLFVBQVUsQ0FBVixFQUFhLEtBQWIsRUFBcUI7QUFDekMsV0FBSSxLQUFLLE9BQU8sVUFBUCxDQUFtQixJQUFLLENBQUwsQ0FBbkIsS0FBaUMsSUFBSyxDQUFMLENBQWpDOzs7QUFEZ0MsZUFJekMsQ0FBVSxNQUFPLENBQVAsQ0FBVixFQUF3QixZQUFXO0FBQ2xDLFlB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bER1RDtHQUFsRDtFQWhHUCxFQUY2Qjs7QUF3SjdCLFFBQU8sTUFBUCxDQXhKNkI7Q0FBMUIsQ0FKSCIsImZpbGUiOiJkZWZlcnJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vdmFyL3NsaWNlXCIsXG5cdFwiLi9jYWxsYmFja3NcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgc2xpY2UgKSB7XG5cbmpRdWVyeS5leHRlbmQoIHtcblxuXHREZWZlcnJlZDogZnVuY3Rpb24oIGZ1bmMgKSB7XG5cdFx0dmFyIHR1cGxlcyA9IFtcblxuXHRcdFx0XHQvLyBhY3Rpb24sIGFkZCBsaXN0ZW5lciwgbGlzdGVuZXIgbGlzdCwgZmluYWwgc3RhdGVcblx0XHRcdFx0WyBcInJlc29sdmVcIiwgXCJkb25lXCIsIGpRdWVyeS5DYWxsYmFja3MoIFwib25jZSBtZW1vcnlcIiApLCBcInJlc29sdmVkXCIgXSxcblx0XHRcdFx0WyBcInJlamVjdFwiLCBcImZhaWxcIiwgalF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksIFwicmVqZWN0ZWRcIiBdLFxuXHRcdFx0XHRbIFwibm90aWZ5XCIsIFwicHJvZ3Jlc3NcIiwgalF1ZXJ5LkNhbGxiYWNrcyggXCJtZW1vcnlcIiApIF1cblx0XHRcdF0sXG5cdFx0XHRzdGF0ZSA9IFwicGVuZGluZ1wiLFxuXHRcdFx0cHJvbWlzZSA9IHtcblx0XHRcdFx0c3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWx3YXlzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkZWZlcnJlZC5kb25lKCBhcmd1bWVudHMgKS5mYWlsKCBhcmd1bWVudHMgKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblx0XHRcdFx0dGhlbjogZnVuY3Rpb24oIC8qIGZuRG9uZSwgZm5GYWlsLCBmblByb2dyZXNzICovICkge1xuXHRcdFx0XHRcdHZhciBmbnMgPSBhcmd1bWVudHM7XG5cdFx0XHRcdFx0cmV0dXJuIGpRdWVyeS5EZWZlcnJlZCggZnVuY3Rpb24oIG5ld0RlZmVyICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmVhY2goIHR1cGxlcywgZnVuY3Rpb24oIGksIHR1cGxlICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZm4gPSBqUXVlcnkuaXNGdW5jdGlvbiggZm5zWyBpIF0gKSAmJiBmbnNbIGkgXTtcblxuXHRcdFx0XHRcdFx0XHQvLyBkZWZlcnJlZFsgZG9uZSB8IGZhaWwgfCBwcm9ncmVzcyBdIGZvciBmb3J3YXJkaW5nIGFjdGlvbnMgdG8gbmV3RGVmZXJcblx0XHRcdFx0XHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAxIF0gXSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJldHVybmVkID0gZm4gJiYgZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdGlmICggcmV0dXJuZWQgJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIHJldHVybmVkLnByb21pc2UgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybmVkLnByb21pc2UoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQucHJvZ3Jlc3MoIG5ld0RlZmVyLm5vdGlmeSApXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5kb25lKCBuZXdEZWZlci5yZXNvbHZlIClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmZhaWwoIG5ld0RlZmVyLnJlamVjdCApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRuZXdEZWZlclsgdHVwbGVbIDAgXSArIFwiV2l0aFwiIF0oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMgPT09IHByb21pc2UgPyBuZXdEZWZlci5wcm9taXNlKCkgOiB0aGlzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmbiA/IFsgcmV0dXJuZWQgXSA6IGFyZ3VtZW50c1xuXHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdGZucyA9IG51bGw7XG5cdFx0XHRcdFx0fSApLnByb21pc2UoKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBHZXQgYSBwcm9taXNlIGZvciB0aGlzIGRlZmVycmVkXG5cdFx0XHRcdC8vIElmIG9iaiBpcyBwcm92aWRlZCwgdGhlIHByb21pc2UgYXNwZWN0IGlzIGFkZGVkIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0cHJvbWlzZTogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgPyBqUXVlcnkuZXh0ZW5kKCBvYmosIHByb21pc2UgKSA6IHByb21pc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRkZWZlcnJlZCA9IHt9O1xuXG5cdFx0Ly8gS2VlcCBwaXBlIGZvciBiYWNrLWNvbXBhdFxuXHRcdHByb21pc2UucGlwZSA9IHByb21pc2UudGhlbjtcblxuXHRcdC8vIEFkZCBsaXN0LXNwZWNpZmljIG1ldGhvZHNcblx0XHRqUXVlcnkuZWFjaCggdHVwbGVzLCBmdW5jdGlvbiggaSwgdHVwbGUgKSB7XG5cdFx0XHR2YXIgbGlzdCA9IHR1cGxlWyAyIF0sXG5cdFx0XHRcdHN0YXRlU3RyaW5nID0gdHVwbGVbIDMgXTtcblxuXHRcdFx0Ly8gcHJvbWlzZVsgZG9uZSB8IGZhaWwgfCBwcm9ncmVzcyBdID0gbGlzdC5hZGRcblx0XHRcdHByb21pc2VbIHR1cGxlWyAxIF0gXSA9IGxpc3QuYWRkO1xuXG5cdFx0XHQvLyBIYW5kbGUgc3RhdGVcblx0XHRcdGlmICggc3RhdGVTdHJpbmcgKSB7XG5cdFx0XHRcdGxpc3QuYWRkKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdC8vIHN0YXRlID0gWyByZXNvbHZlZCB8IHJlamVjdGVkIF1cblx0XHRcdFx0XHRzdGF0ZSA9IHN0YXRlU3RyaW5nO1xuXG5cdFx0XHRcdC8vIFsgcmVqZWN0X2xpc3QgfCByZXNvbHZlX2xpc3QgXS5kaXNhYmxlOyBwcm9ncmVzc19saXN0LmxvY2tcblx0XHRcdFx0fSwgdHVwbGVzWyBpIF4gMSBdWyAyIF0uZGlzYWJsZSwgdHVwbGVzWyAyIF1bIDIgXS5sb2NrICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRlZmVycmVkWyByZXNvbHZlIHwgcmVqZWN0IHwgbm90aWZ5IF1cblx0XHRcdGRlZmVycmVkWyB0dXBsZVsgMCBdIF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAwIF0gKyBcIldpdGhcIiBdKCB0aGlzID09PSBkZWZlcnJlZCA/IHByb21pc2UgOiB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9O1xuXHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAwIF0gKyBcIldpdGhcIiBdID0gbGlzdC5maXJlV2l0aDtcblx0XHR9ICk7XG5cblx0XHQvLyBNYWtlIHRoZSBkZWZlcnJlZCBhIHByb21pc2Vcblx0XHRwcm9taXNlLnByb21pc2UoIGRlZmVycmVkICk7XG5cblx0XHQvLyBDYWxsIGdpdmVuIGZ1bmMgaWYgYW55XG5cdFx0aWYgKCBmdW5jICkge1xuXHRcdFx0ZnVuYy5jYWxsKCBkZWZlcnJlZCwgZGVmZXJyZWQgKTtcblx0XHR9XG5cblx0XHQvLyBBbGwgZG9uZSFcblx0XHRyZXR1cm4gZGVmZXJyZWQ7XG5cdH0sXG5cblx0Ly8gRGVmZXJyZWQgaGVscGVyXG5cdHdoZW46IGZ1bmN0aW9uKCBzdWJvcmRpbmF0ZSAvKiAsIC4uLiwgc3Vib3JkaW5hdGVOICovICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdHJlc29sdmVWYWx1ZXMgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcblx0XHRcdGxlbmd0aCA9IHJlc29sdmVWYWx1ZXMubGVuZ3RoLFxuXG5cdFx0XHQvLyB0aGUgY291bnQgb2YgdW5jb21wbGV0ZWQgc3Vib3JkaW5hdGVzXG5cdFx0XHRyZW1haW5pbmcgPSBsZW5ndGggIT09IDEgfHxcblx0XHRcdFx0KCBzdWJvcmRpbmF0ZSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggc3Vib3JkaW5hdGUucHJvbWlzZSApICkgPyBsZW5ndGggOiAwLFxuXG5cdFx0XHQvLyB0aGUgbWFzdGVyIERlZmVycmVkLlxuXHRcdFx0Ly8gSWYgcmVzb2x2ZVZhbHVlcyBjb25zaXN0IG9mIG9ubHkgYSBzaW5nbGUgRGVmZXJyZWQsIGp1c3QgdXNlIHRoYXQuXG5cdFx0XHRkZWZlcnJlZCA9IHJlbWFpbmluZyA9PT0gMSA/IHN1Ym9yZGluYXRlIDogalF1ZXJ5LkRlZmVycmVkKCksXG5cblx0XHRcdC8vIFVwZGF0ZSBmdW5jdGlvbiBmb3IgYm90aCByZXNvbHZlIGFuZCBwcm9ncmVzcyB2YWx1ZXNcblx0XHRcdHVwZGF0ZUZ1bmMgPSBmdW5jdGlvbiggaSwgY29udGV4dHMsIHZhbHVlcyApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdFx0XHRjb250ZXh0c1sgaSBdID0gdGhpcztcblx0XHRcdFx0XHR2YWx1ZXNbIGkgXSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gc2xpY2UuY2FsbCggYXJndW1lbnRzICkgOiB2YWx1ZTtcblx0XHRcdFx0XHRpZiAoIHZhbHVlcyA9PT0gcHJvZ3Jlc3NWYWx1ZXMgKSB7XG5cdFx0XHRcdFx0XHRkZWZlcnJlZC5ub3RpZnlXaXRoKCBjb250ZXh0cywgdmFsdWVzICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISggLS1yZW1haW5pbmcgKSApIHtcblx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjb250ZXh0cywgdmFsdWVzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fSxcblxuXHRcdFx0cHJvZ3Jlc3NWYWx1ZXMsIHByb2dyZXNzQ29udGV4dHMsIHJlc29sdmVDb250ZXh0cztcblxuXHRcdC8vIEFkZCBsaXN0ZW5lcnMgdG8gRGVmZXJyZWQgc3Vib3JkaW5hdGVzOyB0cmVhdCBvdGhlcnMgYXMgcmVzb2x2ZWRcblx0XHRpZiAoIGxlbmd0aCA+IDEgKSB7XG5cdFx0XHRwcm9ncmVzc1ZhbHVlcyA9IG5ldyBBcnJheSggbGVuZ3RoICk7XG5cdFx0XHRwcm9ncmVzc0NvbnRleHRzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdHJlc29sdmVDb250ZXh0cyA9IG5ldyBBcnJheSggbGVuZ3RoICk7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCByZXNvbHZlVmFsdWVzWyBpIF0gJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIHJlc29sdmVWYWx1ZXNbIGkgXS5wcm9taXNlICkgKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZVZhbHVlc1sgaSBdLnByb21pc2UoKVxuXHRcdFx0XHRcdFx0LnByb2dyZXNzKCB1cGRhdGVGdW5jKCBpLCBwcm9ncmVzc0NvbnRleHRzLCBwcm9ncmVzc1ZhbHVlcyApIClcblx0XHRcdFx0XHRcdC5kb25lKCB1cGRhdGVGdW5jKCBpLCByZXNvbHZlQ29udGV4dHMsIHJlc29sdmVWYWx1ZXMgKSApXG5cdFx0XHRcdFx0XHQuZmFpbCggZGVmZXJyZWQucmVqZWN0ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0LS1yZW1haW5pbmc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiB3ZSdyZSBub3Qgd2FpdGluZyBvbiBhbnl0aGluZywgcmVzb2x2ZSB0aGUgbWFzdGVyXG5cdFx0aWYgKCAhcmVtYWluaW5nICkge1xuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZVdpdGgoIHJlc29sdmVDb250ZXh0cywgcmVzb2x2ZVZhbHVlcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cdH1cbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==