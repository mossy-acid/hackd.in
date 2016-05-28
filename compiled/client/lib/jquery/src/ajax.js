"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./var/document", "./var/rnotwhite", "./ajax/var/location", "./ajax/var/nonce", "./ajax/var/rquery", "./core/init", "./ajax/parseJSON", "./ajax/parseXML", "./event/trigger", "./deferred"], function (jQuery, document, rnotwhite, location, nonce, rquery) {

	var rhash = /#.*$/,
	    rts = /([?&])_=[^&]*/,
	    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	    rnoContent = /^(?:GET|HEAD)$/,
	    rprotocol = /^\/\//,


	/* Prefilters
  * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
  * 2) These are called:
  *    - BEFORE asking for a transport
  *    - AFTER param serialization (s.data is a string if s.processData is true)
  * 3) key is the dataType
  * 4) the catchall symbol "*" can be used
  * 5) execution will start with transport dataType and THEN continue down to "*" if needed
  */
	prefilters = {},


	/* Transports bindings
  * 1) key is the dataType
  * 2) the catchall symbol "*" can be used
  * 3) selection will start with transport dataType and THEN go to "*" if needed
  */
	transports = {},


	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*"),


	// Anchor tag for parsing the document origin
	originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
			    i = 0,
			    dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

			if (jQuery.isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while (dataType = dataTypes[i++]) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
							(structure[dataType] = structure[dataType] || []).push(func);
						}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
		    seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key,
		    deep,
		    flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
  * - finds the right dataType (mediates between content-type and expected dataType)
  * - returns the corresponding response
  */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct,
		    type,
		    finalDataType,
		    firstDataType,
		    contents = s.contents,
		    dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
  * Also sets the responseXXX fields on the jqXHR instance
  */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
		    current,
		    conv,
		    tmp,
		    prev,
		    converters = {},


		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

						// Seek a direct converter
						conv = converters[prev + " " + current] || converters["* " + current];

						// If none found, seek a pair
						if (!conv) {
							for (conv2 in converters) {

								// If conv2 outputs current
								tmp = conv2.split(" ");
								if (tmp[1] === current) {

									// If prev can be converted to accepted input
									conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
									if (conv) {

										// Condense equivalence converters
										if (conv === true) {
											conv = converters[conv2];

											// Otherwise, insert the intermediate dataType
										} else if (converters[conv2] !== true) {
												current = tmp[0];
												dataTypes.unshift(tmp[1]);
											}
										break;
									}
								}
							}
						}

						// Apply converter (if not an equivalence)
						if (conv !== true) {

							// Unless errors are allowed to bubble, catch and return them
							if (conv && s.throws) {
								response = conv(response);
							} else {
								try {
									response = conv(response);
								} catch (e) {
									return {
										state: "parsererror",
										error: conv ? e : "No conversion from " + prev + " to " + current
									};
								}
							}
						}
					}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
   timeout: 0,
   data: null,
   dataType: null,
   username: null,
   password: null,
   cache: null,
   throws: false,
   traditional: false,
   headers: {},
   */

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function ajaxSetup(target, settings) {
			return settings ?

			// Building a settings object
			ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

			// Extending ajaxSettings
			ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function ajax(url, options) {

			// If url is an object, simulate pre-1.5 signature
			if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,


			// URL without anti-cache param
			cacheURL,


			// Response headers
			responseHeadersString,
			    responseHeaders,


			// timeout handle
			timeoutTimer,


			// Url cleanup var
			urlAnchor,


			// To know if global events are to be dispatched
			fireGlobals,


			// Loop variable
			i,


			// Create the final options object
			s = jQuery.ajaxSetup({}, options),


			// Callbacks context
			callbackContext = s.context || s,


			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


			// Deferreds
			deferred = jQuery.Deferred(),
			    completeDeferred = jQuery.Callbacks("once memory"),


			// Status-dependent callbacks
			_statusCode = s.statusCode || {},


			// Headers (they are sent all at once)
			requestHeaders = {},
			    requestHeadersNames = {},


			// The jqXHR state
			state = 0,


			// Default abort message
			strAbort = "canceled",


			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function getResponseHeader(key) {
					var match;
					if (state === 2) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (match = rheaders.exec(responseHeadersString)) {
								responseHeaders[match[1].toLowerCase()] = match[2];
							}
						}
						match = responseHeaders[key.toLowerCase()];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function getAllResponseHeaders() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function setRequestHeader(name, value) {
					var lname = name.toLowerCase();
					if (!state) {
						name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function overrideMimeType(type) {
					if (!state) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function statusCode(map) {
					var code;
					if (map) {
						if (state < 2) {
							for (code in map) {

								// Lazy-add the new callback in a way that preserves old ones
								_statusCode[code] = [_statusCode[code], map[code]];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always(map[jqXHR.status]);
						}
					}
					return this;
				},

				// Cancel the request
				abort: function abort(statusText) {
					var finalText = statusText || strAbort;
					if (transport) {
						transport.abort(finalText);
					}
					done(0, finalText);
					return this;
				}
			};

			// Attach deferreds
			deferred.promise(jqXHR).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "").replace(rhash, "").replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (state === 2) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if (!s.hasContent) {

				// If data is available, append data to url
				if (s.data) {
					cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if (s.cache === false) {
					s.url = rts.test(cacheURL) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace(rts, "$1_=" + nonce++) :

					// Otherwise add one to the end
					cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for (i in { success: 1, error: 1, complete: 1 }) {
				jqXHR[i](s[i]);
			}

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (state === 2) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Propagate exception as error if not done
					if (state < 2) {
						done(-1, e);

						// Simply rethrow otherwise
					} else {
							throw e;
						}
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
				    success,
				    error,
				    response,
				    modified,
				    statusText = nativeStatusText;

				// Called once
				if (state === 2) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
							statusText = "notmodified";

							// If we have data, let's convert it
						} else {
								statusText = response.state;
								success = response.data;
								error = response.error;
								isSuccess = !error;
							}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (! --jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsaUJBSE8sRUFJUCxxQkFKTyxFQUtQLGtCQUxPLEVBTVAsbUJBTk8sRUFRUCxhQVJPLEVBU1Asa0JBVE8sRUFVUCxpQkFWTyxFQVdQLGlCQVhPLEVBWVAsWUFaTyxDQUFSLEVBYUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLFNBQTVCLEVBQXVDLFFBQXZDLEVBQWlELEtBQWpELEVBQXdELE1BQXhELEVBQWlFOztBQUVwRSxLQUNDLFFBQVEsTUFBUjtLQUNBLE1BQU0sZUFBTjtLQUNBLFdBQVcsNEJBQVg7Ozs7QUFHQSxrQkFBaUIsMkRBQWpCO0tBQ0EsYUFBYSxnQkFBYjtLQUNBLFlBQVksT0FBWjs7Ozs7Ozs7Ozs7O0FBV0EsY0FBYSxFQUFiOzs7Ozs7OztBQU9BLGNBQWEsRUFBYjs7OztBQUdBLFlBQVcsS0FBSyxNQUFMLENBQWEsR0FBYixDQUFYOzs7O0FBR0EsZ0JBQWUsU0FBUyxhQUFULENBQXdCLEdBQXhCLENBQWYsQ0FsQ21FO0FBbUNuRSxjQUFhLElBQWIsR0FBb0IsU0FBUyxJQUFUOzs7QUFuQytDLFVBc0MzRCwyQkFBVCxDQUFzQyxTQUF0QyxFQUFrRDs7O0FBR2pELFNBQU8sVUFBVSxrQkFBVixFQUE4QixJQUE5QixFQUFxQzs7QUFFM0MsT0FBSyxPQUFPLGtCQUFQLEtBQThCLFFBQTlCLEVBQXlDO0FBQzdDLFdBQU8sa0JBQVAsQ0FENkM7QUFFN0MseUJBQXFCLEdBQXJCLENBRjZDO0lBQTlDOztBQUtBLE9BQUksUUFBSjtPQUNDLElBQUksQ0FBSjtPQUNBLFlBQVksbUJBQW1CLFdBQW5CLEdBQWlDLEtBQWpDLENBQXdDLFNBQXhDLEtBQXVELEVBQXZELENBVDhCOztBQVczQyxPQUFLLE9BQU8sVUFBUCxDQUFtQixJQUFuQixDQUFMLEVBQWlD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SGdDO0lBQWpDOzs7QUFId0QsVUFVakQsT0FBTyxJQUFQLENBQWEsT0FBTyxNQUFQLENBQWU7QUFDbEMsU0FBSyxHQUFMO0FBQ0EsVUFBTSxNQUFOO0FBQ0EsY0FBVSxJQUFWO0FBQ0EsVUFBTSxJQUFOO0FBQ0EsYUFBUyxRQUFUO0lBTG1CLEVBTWpCLE9BQU8sYUFBUCxDQUFzQixHQUF0QixLQUErQixHQUEvQixDQU5JLENBQVAsQ0FWd0Q7R0FBdEMsQ0FEa0M7RUFBdEIsQ0FBaEMsQ0F6eUJvRTs7QUE4ekJwRSxRQUFPLE1BQVAsQ0E5ekJvRTtDQUFqRSxDQWJIIiwiZmlsZSI6ImFqYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL3Zhci9kb2N1bWVudFwiLFxuXHRcIi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4vYWpheC92YXIvbG9jYXRpb25cIixcblx0XCIuL2FqYXgvdmFyL25vbmNlXCIsXG5cdFwiLi9hamF4L3Zhci9ycXVlcnlcIixcblxuXHRcIi4vY29yZS9pbml0XCIsXG5cdFwiLi9hamF4L3BhcnNlSlNPTlwiLFxuXHRcIi4vYWpheC9wYXJzZVhNTFwiLFxuXHRcIi4vZXZlbnQvdHJpZ2dlclwiLFxuXHRcIi4vZGVmZXJyZWRcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgZG9jdW1lbnQsIHJub3R3aGl0ZSwgbG9jYXRpb24sIG5vbmNlLCBycXVlcnkgKSB7XG5cbnZhclxuXHRyaGFzaCA9IC8jLiokLyxcblx0cnRzID0gLyhbPyZdKV89W14mXSovLFxuXHRyaGVhZGVycyA9IC9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvbWcsXG5cblx0Ly8gIzc2NTMsICM4MTI1LCAjODE1MjogbG9jYWwgcHJvdG9jb2wgZGV0ZWN0aW9uXG5cdHJsb2NhbFByb3RvY29sID0gL14oPzphYm91dHxhcHB8YXBwLXN0b3JhZ2V8ListZXh0ZW5zaW9ufGZpbGV8cmVzfHdpZGdldCk6JC8sXG5cdHJub0NvbnRlbnQgPSAvXig/OkdFVHxIRUFEKSQvLFxuXHRycHJvdG9jb2wgPSAvXlxcL1xcLy8sXG5cblx0LyogUHJlZmlsdGVyc1xuXHQgKiAxKSBUaGV5IGFyZSB1c2VmdWwgdG8gaW50cm9kdWNlIGN1c3RvbSBkYXRhVHlwZXMgKHNlZSBhamF4L2pzb25wLmpzIGZvciBhbiBleGFtcGxlKVxuXHQgKiAyKSBUaGVzZSBhcmUgY2FsbGVkOlxuXHQgKiAgICAtIEJFRk9SRSBhc2tpbmcgZm9yIGEgdHJhbnNwb3J0XG5cdCAqICAgIC0gQUZURVIgcGFyYW0gc2VyaWFsaXphdGlvbiAocy5kYXRhIGlzIGEgc3RyaW5nIGlmIHMucHJvY2Vzc0RhdGEgaXMgdHJ1ZSlcblx0ICogMykga2V5IGlzIHRoZSBkYXRhVHlwZVxuXHQgKiA0KSB0aGUgY2F0Y2hhbGwgc3ltYm9sIFwiKlwiIGNhbiBiZSB1c2VkXG5cdCAqIDUpIGV4ZWN1dGlvbiB3aWxsIHN0YXJ0IHdpdGggdHJhbnNwb3J0IGRhdGFUeXBlIGFuZCBUSEVOIGNvbnRpbnVlIGRvd24gdG8gXCIqXCIgaWYgbmVlZGVkXG5cdCAqL1xuXHRwcmVmaWx0ZXJzID0ge30sXG5cblx0LyogVHJhbnNwb3J0cyBiaW5kaW5nc1xuXHQgKiAxKSBrZXkgaXMgdGhlIGRhdGFUeXBlXG5cdCAqIDIpIHRoZSBjYXRjaGFsbCBzeW1ib2wgXCIqXCIgY2FuIGJlIHVzZWRcblx0ICogMykgc2VsZWN0aW9uIHdpbGwgc3RhcnQgd2l0aCB0cmFuc3BvcnQgZGF0YVR5cGUgYW5kIFRIRU4gZ28gdG8gXCIqXCIgaWYgbmVlZGVkXG5cdCAqL1xuXHR0cmFuc3BvcnRzID0ge30sXG5cblx0Ly8gQXZvaWQgY29tbWVudC1wcm9sb2cgY2hhciBzZXF1ZW5jZSAoIzEwMDk4KTsgbXVzdCBhcHBlYXNlIGxpbnQgYW5kIGV2YWRlIGNvbXByZXNzaW9uXG5cdGFsbFR5cGVzID0gXCIqL1wiLmNvbmNhdCggXCIqXCIgKSxcblxuXHQvLyBBbmNob3IgdGFnIGZvciBwYXJzaW5nIHRoZSBkb2N1bWVudCBvcmlnaW5cblx0b3JpZ2luQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcblx0b3JpZ2luQW5jaG9yLmhyZWYgPSBsb2NhdGlvbi5ocmVmO1xuXG4vLyBCYXNlIFwiY29uc3RydWN0b3JcIiBmb3IgalF1ZXJ5LmFqYXhQcmVmaWx0ZXIgYW5kIGpRdWVyeS5hamF4VHJhbnNwb3J0XG5mdW5jdGlvbiBhZGRUb1ByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHN0cnVjdHVyZSApIHtcblxuXHQvLyBkYXRhVHlwZUV4cHJlc3Npb24gaXMgb3B0aW9uYWwgYW5kIGRlZmF1bHRzIHRvIFwiKlwiXG5cdHJldHVybiBmdW5jdGlvbiggZGF0YVR5cGVFeHByZXNzaW9uLCBmdW5jICkge1xuXG5cdFx0aWYgKCB0eXBlb2YgZGF0YVR5cGVFeHByZXNzaW9uICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0ZnVuYyA9IGRhdGFUeXBlRXhwcmVzc2lvbjtcblx0XHRcdGRhdGFUeXBlRXhwcmVzc2lvbiA9IFwiKlwiO1xuXHRcdH1cblxuXHRcdHZhciBkYXRhVHlwZSxcblx0XHRcdGkgPSAwLFxuXHRcdFx0ZGF0YVR5cGVzID0gZGF0YVR5cGVFeHByZXNzaW9uLnRvTG93ZXJDYXNlKCkubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZnVuYyApICkge1xuXG5cdFx0XHQvLyBGb3IgZWFjaCBkYXRhVHlwZSBpbiB0aGUgZGF0YVR5cGVFeHByZXNzaW9uXG5cdFx0XHR3aGlsZSAoICggZGF0YVR5cGUgPSBkYXRhVHlwZXNbIGkrKyBdICkgKSB7XG5cblx0XHRcdFx0Ly8gUHJlcGVuZCBpZiByZXF1ZXN0ZWRcblx0XHRcdFx0aWYgKCBkYXRhVHlwZVsgMCBdID09PSBcIitcIiApIHtcblx0XHRcdFx0XHRkYXRhVHlwZSA9IGRhdGFUeXBlLnNsaWNlKCAxICkgfHwgXCIqXCI7XG5cdFx0XHRcdFx0KCBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gPSBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gfHwgW10gKS51bnNoaWZ0KCBmdW5jICk7XG5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCggc3RydWN0dXJlWyBkYXRhVHlwZSBdID0gc3RydWN0dXJlWyBkYXRhVHlwZSBdIHx8IFtdICkucHVzaCggZnVuYyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG4vLyBCYXNlIGluc3BlY3Rpb24gZnVuY3Rpb24gZm9yIHByZWZpbHRlcnMgYW5kIHRyYW5zcG9ydHNcbmZ1bmN0aW9uIGluc3BlY3RQcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBzdHJ1Y3R1cmUsIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywganFYSFIgKSB7XG5cblx0dmFyIGluc3BlY3RlZCA9IHt9LFxuXHRcdHNlZWtpbmdUcmFuc3BvcnQgPSAoIHN0cnVjdHVyZSA9PT0gdHJhbnNwb3J0cyApO1xuXG5cdGZ1bmN0aW9uIGluc3BlY3QoIGRhdGFUeXBlICkge1xuXHRcdHZhciBzZWxlY3RlZDtcblx0XHRpbnNwZWN0ZWRbIGRhdGFUeXBlIF0gPSB0cnVlO1xuXHRcdGpRdWVyeS5lYWNoKCBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gfHwgW10sIGZ1bmN0aW9uKCBfLCBwcmVmaWx0ZXJPckZhY3RvcnkgKSB7XG5cdFx0XHR2YXIgZGF0YVR5cGVPclRyYW5zcG9ydCA9IHByZWZpbHRlck9yRmFjdG9yeSggb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCBqcVhIUiApO1xuXHRcdFx0aWYgKCB0eXBlb2YgZGF0YVR5cGVPclRyYW5zcG9ydCA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0XHQhc2Vla2luZ1RyYW5zcG9ydCAmJiAhaW5zcGVjdGVkWyBkYXRhVHlwZU9yVHJhbnNwb3J0IF0gKSB7XG5cblx0XHRcdFx0b3B0aW9ucy5kYXRhVHlwZXMudW5zaGlmdCggZGF0YVR5cGVPclRyYW5zcG9ydCApO1xuXHRcdFx0XHRpbnNwZWN0KCBkYXRhVHlwZU9yVHJhbnNwb3J0ICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gZWxzZSBpZiAoIHNlZWtpbmdUcmFuc3BvcnQgKSB7XG5cdFx0XHRcdHJldHVybiAhKCBzZWxlY3RlZCA9IGRhdGFUeXBlT3JUcmFuc3BvcnQgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdFx0cmV0dXJuIHNlbGVjdGVkO1xuXHR9XG5cblx0cmV0dXJuIGluc3BlY3QoIG9wdGlvbnMuZGF0YVR5cGVzWyAwIF0gKSB8fCAhaW5zcGVjdGVkWyBcIipcIiBdICYmIGluc3BlY3QoIFwiKlwiICk7XG59XG5cbi8vIEEgc3BlY2lhbCBleHRlbmQgZm9yIGFqYXggb3B0aW9uc1xuLy8gdGhhdCB0YWtlcyBcImZsYXRcIiBvcHRpb25zIChub3QgdG8gYmUgZGVlcCBleHRlbmRlZClcbi8vIEZpeGVzICM5ODg3XG5mdW5jdGlvbiBhamF4RXh0ZW5kKCB0YXJnZXQsIHNyYyApIHtcblx0dmFyIGtleSwgZGVlcCxcblx0XHRmbGF0T3B0aW9ucyA9IGpRdWVyeS5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnMgfHwge307XG5cblx0Zm9yICgga2V5IGluIHNyYyApIHtcblx0XHRpZiAoIHNyY1sga2V5IF0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdCggZmxhdE9wdGlvbnNbIGtleSBdID8gdGFyZ2V0IDogKCBkZWVwIHx8ICggZGVlcCA9IHt9ICkgKSApWyBrZXkgXSA9IHNyY1sga2V5IF07XG5cdFx0fVxuXHR9XG5cdGlmICggZGVlcCApIHtcblx0XHRqUXVlcnkuZXh0ZW5kKCB0cnVlLCB0YXJnZXQsIGRlZXAgKTtcblx0fVxuXG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbi8qIEhhbmRsZXMgcmVzcG9uc2VzIHRvIGFuIGFqYXggcmVxdWVzdDpcbiAqIC0gZmluZHMgdGhlIHJpZ2h0IGRhdGFUeXBlIChtZWRpYXRlcyBiZXR3ZWVuIGNvbnRlbnQtdHlwZSBhbmQgZXhwZWN0ZWQgZGF0YVR5cGUpXG4gKiAtIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gYWpheEhhbmRsZVJlc3BvbnNlcyggcywganFYSFIsIHJlc3BvbnNlcyApIHtcblxuXHR2YXIgY3QsIHR5cGUsIGZpbmFsRGF0YVR5cGUsIGZpcnN0RGF0YVR5cGUsXG5cdFx0Y29udGVudHMgPSBzLmNvbnRlbnRzLFxuXHRcdGRhdGFUeXBlcyA9IHMuZGF0YVR5cGVzO1xuXG5cdC8vIFJlbW92ZSBhdXRvIGRhdGFUeXBlIGFuZCBnZXQgY29udGVudC10eXBlIGluIHRoZSBwcm9jZXNzXG5cdHdoaWxlICggZGF0YVR5cGVzWyAwIF0gPT09IFwiKlwiICkge1xuXHRcdGRhdGFUeXBlcy5zaGlmdCgpO1xuXHRcdGlmICggY3QgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGN0ID0gcy5taW1lVHlwZSB8fCBqcVhIUi5nZXRSZXNwb25zZUhlYWRlciggXCJDb250ZW50LVR5cGVcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIGlmIHdlJ3JlIGRlYWxpbmcgd2l0aCBhIGtub3duIGNvbnRlbnQtdHlwZVxuXHRpZiAoIGN0ICkge1xuXHRcdGZvciAoIHR5cGUgaW4gY29udGVudHMgKSB7XG5cdFx0XHRpZiAoIGNvbnRlbnRzWyB0eXBlIF0gJiYgY29udGVudHNbIHR5cGUgXS50ZXN0KCBjdCApICkge1xuXHRcdFx0XHRkYXRhVHlwZXMudW5zaGlmdCggdHlwZSApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBDaGVjayB0byBzZWUgaWYgd2UgaGF2ZSBhIHJlc3BvbnNlIGZvciB0aGUgZXhwZWN0ZWQgZGF0YVR5cGVcblx0aWYgKCBkYXRhVHlwZXNbIDAgXSBpbiByZXNwb25zZXMgKSB7XG5cdFx0ZmluYWxEYXRhVHlwZSA9IGRhdGFUeXBlc1sgMCBdO1xuXHR9IGVsc2Uge1xuXG5cdFx0Ly8gVHJ5IGNvbnZlcnRpYmxlIGRhdGFUeXBlc1xuXHRcdGZvciAoIHR5cGUgaW4gcmVzcG9uc2VzICkge1xuXHRcdFx0aWYgKCAhZGF0YVR5cGVzWyAwIF0gfHwgcy5jb252ZXJ0ZXJzWyB0eXBlICsgXCIgXCIgKyBkYXRhVHlwZXNbIDAgXSBdICkge1xuXHRcdFx0XHRmaW5hbERhdGFUeXBlID0gdHlwZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoICFmaXJzdERhdGFUeXBlICkge1xuXHRcdFx0XHRmaXJzdERhdGFUeXBlID0gdHlwZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBPciBqdXN0IHVzZSBmaXJzdCBvbmVcblx0XHRmaW5hbERhdGFUeXBlID0gZmluYWxEYXRhVHlwZSB8fCBmaXJzdERhdGFUeXBlO1xuXHR9XG5cblx0Ly8gSWYgd2UgZm91bmQgYSBkYXRhVHlwZVxuXHQvLyBXZSBhZGQgdGhlIGRhdGFUeXBlIHRvIHRoZSBsaXN0IGlmIG5lZWRlZFxuXHQvLyBhbmQgcmV0dXJuIHRoZSBjb3JyZXNwb25kaW5nIHJlc3BvbnNlXG5cdGlmICggZmluYWxEYXRhVHlwZSApIHtcblx0XHRpZiAoIGZpbmFsRGF0YVR5cGUgIT09IGRhdGFUeXBlc1sgMCBdICkge1xuXHRcdFx0ZGF0YVR5cGVzLnVuc2hpZnQoIGZpbmFsRGF0YVR5cGUgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3BvbnNlc1sgZmluYWxEYXRhVHlwZSBdO1xuXHR9XG59XG5cbi8qIENoYWluIGNvbnZlcnNpb25zIGdpdmVuIHRoZSByZXF1ZXN0IGFuZCB0aGUgb3JpZ2luYWwgcmVzcG9uc2VcbiAqIEFsc28gc2V0cyB0aGUgcmVzcG9uc2VYWFggZmllbGRzIG9uIHRoZSBqcVhIUiBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBhamF4Q29udmVydCggcywgcmVzcG9uc2UsIGpxWEhSLCBpc1N1Y2Nlc3MgKSB7XG5cdHZhciBjb252MiwgY3VycmVudCwgY29udiwgdG1wLCBwcmV2LFxuXHRcdGNvbnZlcnRlcnMgPSB7fSxcblxuXHRcdC8vIFdvcmsgd2l0aCBhIGNvcHkgb2YgZGF0YVR5cGVzIGluIGNhc2Ugd2UgbmVlZCB0byBtb2RpZnkgaXQgZm9yIGNvbnZlcnNpb25cblx0XHRkYXRhVHlwZXMgPSBzLmRhdGFUeXBlcy5zbGljZSgpO1xuXG5cdC8vIENyZWF0ZSBjb252ZXJ0ZXJzIG1hcCB3aXRoIGxvd2VyY2FzZWQga2V5c1xuXHRpZiAoIGRhdGFUeXBlc1sgMSBdICkge1xuXHRcdGZvciAoIGNvbnYgaW4gcy5jb252ZXJ0ZXJzICkge1xuXHRcdFx0Y29udmVydGVyc1sgY29udi50b0xvd2VyQ2FzZSgpIF0gPSBzLmNvbnZlcnRlcnNbIGNvbnYgXTtcblx0XHR9XG5cdH1cblxuXHRjdXJyZW50ID0gZGF0YVR5cGVzLnNoaWZ0KCk7XG5cblx0Ly8gQ29udmVydCB0byBlYWNoIHNlcXVlbnRpYWwgZGF0YVR5cGVcblx0d2hpbGUgKCBjdXJyZW50ICkge1xuXG5cdFx0aWYgKCBzLnJlc3BvbnNlRmllbGRzWyBjdXJyZW50IF0gKSB7XG5cdFx0XHRqcVhIUlsgcy5yZXNwb25zZUZpZWxkc1sgY3VycmVudCBdIF0gPSByZXNwb25zZTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSB0aGUgZGF0YUZpbHRlciBpZiBwcm92aWRlZFxuXHRcdGlmICggIXByZXYgJiYgaXNTdWNjZXNzICYmIHMuZGF0YUZpbHRlciApIHtcblx0XHRcdHJlc3BvbnNlID0gcy5kYXRhRmlsdGVyKCByZXNwb25zZSwgcy5kYXRhVHlwZSApO1xuXHRcdH1cblxuXHRcdHByZXYgPSBjdXJyZW50O1xuXHRcdGN1cnJlbnQgPSBkYXRhVHlwZXMuc2hpZnQoKTtcblxuXHRcdGlmICggY3VycmVudCApIHtcblxuXHRcdC8vIFRoZXJlJ3Mgb25seSB3b3JrIHRvIGRvIGlmIGN1cnJlbnQgZGF0YVR5cGUgaXMgbm9uLWF1dG9cblx0XHRcdGlmICggY3VycmVudCA9PT0gXCIqXCIgKSB7XG5cblx0XHRcdFx0Y3VycmVudCA9IHByZXY7XG5cblx0XHRcdC8vIENvbnZlcnQgcmVzcG9uc2UgaWYgcHJldiBkYXRhVHlwZSBpcyBub24tYXV0byBhbmQgZGlmZmVycyBmcm9tIGN1cnJlbnRcblx0XHRcdH0gZWxzZSBpZiAoIHByZXYgIT09IFwiKlwiICYmIHByZXYgIT09IGN1cnJlbnQgKSB7XG5cblx0XHRcdFx0Ly8gU2VlayBhIGRpcmVjdCBjb252ZXJ0ZXJcblx0XHRcdFx0Y29udiA9IGNvbnZlcnRlcnNbIHByZXYgKyBcIiBcIiArIGN1cnJlbnQgXSB8fCBjb252ZXJ0ZXJzWyBcIiogXCIgKyBjdXJyZW50IF07XG5cblx0XHRcdFx0Ly8gSWYgbm9uZSBmb3VuZCwgc2VlayBhIHBhaXJcblx0XHRcdFx0aWYgKCAhY29udiApIHtcblx0XHRcdFx0XHRmb3IgKCBjb252MiBpbiBjb252ZXJ0ZXJzICkge1xuXG5cdFx0XHRcdFx0XHQvLyBJZiBjb252MiBvdXRwdXRzIGN1cnJlbnRcblx0XHRcdFx0XHRcdHRtcCA9IGNvbnYyLnNwbGl0KCBcIiBcIiApO1xuXHRcdFx0XHRcdFx0aWYgKCB0bXBbIDEgXSA9PT0gY3VycmVudCApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBJZiBwcmV2IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYWNjZXB0ZWQgaW5wdXRcblx0XHRcdFx0XHRcdFx0Y29udiA9IGNvbnZlcnRlcnNbIHByZXYgKyBcIiBcIiArIHRtcFsgMCBdIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJzWyBcIiogXCIgKyB0bXBbIDAgXSBdO1xuXHRcdFx0XHRcdFx0XHRpZiAoIGNvbnYgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBDb25kZW5zZSBlcXVpdmFsZW5jZSBjb252ZXJ0ZXJzXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBjb252ID09PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29udiA9IGNvbnZlcnRlcnNbIGNvbnYyIF07XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBPdGhlcndpc2UsIGluc2VydCB0aGUgaW50ZXJtZWRpYXRlIGRhdGFUeXBlXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggY29udmVydGVyc1sgY29udjIgXSAhPT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnQgPSB0bXBbIDAgXTtcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFUeXBlcy51bnNoaWZ0KCB0bXBbIDEgXSApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFwcGx5IGNvbnZlcnRlciAoaWYgbm90IGFuIGVxdWl2YWxlbmNlKVxuXHRcdFx0XHRpZiAoIGNvbnYgIT09IHRydWUgKSB7XG5cblx0XHRcdFx0XHQvLyBVbmxlc3MgZXJyb3JzIGFyZSBhbGxvd2VkIHRvIGJ1YmJsZSwgY2F0Y2ggYW5kIHJldHVybiB0aGVtXG5cdFx0XHRcdFx0aWYgKCBjb252ICYmIHMudGhyb3dzICkge1xuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBjb252KCByZXNwb25zZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IGNvbnYoIHJlc3BvbnNlICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZTogXCJwYXJzZXJlcnJvclwiLFxuXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBjb252ID8gZSA6IFwiTm8gY29udmVyc2lvbiBmcm9tIFwiICsgcHJldiArIFwiIHRvIFwiICsgY3VycmVudFxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7IHN0YXRlOiBcInN1Y2Nlc3NcIiwgZGF0YTogcmVzcG9uc2UgfTtcbn1cblxualF1ZXJ5LmV4dGVuZCgge1xuXG5cdC8vIENvdW50ZXIgZm9yIGhvbGRpbmcgdGhlIG51bWJlciBvZiBhY3RpdmUgcXVlcmllc1xuXHRhY3RpdmU6IDAsXG5cblx0Ly8gTGFzdC1Nb2RpZmllZCBoZWFkZXIgY2FjaGUgZm9yIG5leHQgcmVxdWVzdFxuXHRsYXN0TW9kaWZpZWQ6IHt9LFxuXHRldGFnOiB7fSxcblxuXHRhamF4U2V0dGluZ3M6IHtcblx0XHR1cmw6IGxvY2F0aW9uLmhyZWYsXG5cdFx0dHlwZTogXCJHRVRcIixcblx0XHRpc0xvY2FsOiBybG9jYWxQcm90b2NvbC50ZXN0KCBsb2NhdGlvbi5wcm90b2NvbCApLFxuXHRcdGdsb2JhbDogdHJ1ZSxcblx0XHRwcm9jZXNzRGF0YTogdHJ1ZSxcblx0XHRhc3luYzogdHJ1ZSxcblx0XHRjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIixcblx0XHQvKlxuXHRcdHRpbWVvdXQ6IDAsXG5cdFx0ZGF0YTogbnVsbCxcblx0XHRkYXRhVHlwZTogbnVsbCxcblx0XHR1c2VybmFtZTogbnVsbCxcblx0XHRwYXNzd29yZDogbnVsbCxcblx0XHRjYWNoZTogbnVsbCxcblx0XHR0aHJvd3M6IGZhbHNlLFxuXHRcdHRyYWRpdGlvbmFsOiBmYWxzZSxcblx0XHRoZWFkZXJzOiB7fSxcblx0XHQqL1xuXG5cdFx0YWNjZXB0czoge1xuXHRcdFx0XCIqXCI6IGFsbFR5cGVzLFxuXHRcdFx0dGV4dDogXCJ0ZXh0L3BsYWluXCIsXG5cdFx0XHRodG1sOiBcInRleHQvaHRtbFwiLFxuXHRcdFx0eG1sOiBcImFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWxcIixcblx0XHRcdGpzb246IFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0XCJcblx0XHR9LFxuXG5cdFx0Y29udGVudHM6IHtcblx0XHRcdHhtbDogL1xcYnhtbFxcYi8sXG5cdFx0XHRodG1sOiAvXFxiaHRtbC8sXG5cdFx0XHRqc29uOiAvXFxianNvblxcYi9cblx0XHR9LFxuXG5cdFx0cmVzcG9uc2VGaWVsZHM6IHtcblx0XHRcdHhtbDogXCJyZXNwb25zZVhNTFwiLFxuXHRcdFx0dGV4dDogXCJyZXNwb25zZVRleHRcIixcblx0XHRcdGpzb246IFwicmVzcG9uc2VKU09OXCJcblx0XHR9LFxuXG5cdFx0Ly8gRGF0YSBjb252ZXJ0ZXJzXG5cdFx0Ly8gS2V5cyBzZXBhcmF0ZSBzb3VyY2UgKG9yIGNhdGNoYWxsIFwiKlwiKSBhbmQgZGVzdGluYXRpb24gdHlwZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuXHRcdGNvbnZlcnRlcnM6IHtcblxuXHRcdFx0Ly8gQ29udmVydCBhbnl0aGluZyB0byB0ZXh0XG5cdFx0XHRcIiogdGV4dFwiOiBTdHJpbmcsXG5cblx0XHRcdC8vIFRleHQgdG8gaHRtbCAodHJ1ZSA9IG5vIHRyYW5zZm9ybWF0aW9uKVxuXHRcdFx0XCJ0ZXh0IGh0bWxcIjogdHJ1ZSxcblxuXHRcdFx0Ly8gRXZhbHVhdGUgdGV4dCBhcyBhIGpzb24gZXhwcmVzc2lvblxuXHRcdFx0XCJ0ZXh0IGpzb25cIjogalF1ZXJ5LnBhcnNlSlNPTixcblxuXHRcdFx0Ly8gUGFyc2UgdGV4dCBhcyB4bWxcblx0XHRcdFwidGV4dCB4bWxcIjogalF1ZXJ5LnBhcnNlWE1MXG5cdFx0fSxcblxuXHRcdC8vIEZvciBvcHRpb25zIHRoYXQgc2hvdWxkbid0IGJlIGRlZXAgZXh0ZW5kZWQ6XG5cdFx0Ly8geW91IGNhbiBhZGQgeW91ciBvd24gY3VzdG9tIG9wdGlvbnMgaGVyZSBpZlxuXHRcdC8vIGFuZCB3aGVuIHlvdSBjcmVhdGUgb25lIHRoYXQgc2hvdWxkbid0IGJlXG5cdFx0Ly8gZGVlcCBleHRlbmRlZCAoc2VlIGFqYXhFeHRlbmQpXG5cdFx0ZmxhdE9wdGlvbnM6IHtcblx0XHRcdHVybDogdHJ1ZSxcblx0XHRcdGNvbnRleHQ6IHRydWVcblx0XHR9XG5cdH0sXG5cblx0Ly8gQ3JlYXRlcyBhIGZ1bGwgZmxlZGdlZCBzZXR0aW5ncyBvYmplY3QgaW50byB0YXJnZXRcblx0Ly8gd2l0aCBib3RoIGFqYXhTZXR0aW5ncyBhbmQgc2V0dGluZ3MgZmllbGRzLlxuXHQvLyBJZiB0YXJnZXQgaXMgb21pdHRlZCwgd3JpdGVzIGludG8gYWpheFNldHRpbmdzLlxuXHRhamF4U2V0dXA6IGZ1bmN0aW9uKCB0YXJnZXQsIHNldHRpbmdzICkge1xuXHRcdHJldHVybiBzZXR0aW5ncyA/XG5cblx0XHRcdC8vIEJ1aWxkaW5nIGEgc2V0dGluZ3Mgb2JqZWN0XG5cdFx0XHRhamF4RXh0ZW5kKCBhamF4RXh0ZW5kKCB0YXJnZXQsIGpRdWVyeS5hamF4U2V0dGluZ3MgKSwgc2V0dGluZ3MgKSA6XG5cblx0XHRcdC8vIEV4dGVuZGluZyBhamF4U2V0dGluZ3Ncblx0XHRcdGFqYXhFeHRlbmQoIGpRdWVyeS5hamF4U2V0dGluZ3MsIHRhcmdldCApO1xuXHR9LFxuXG5cdGFqYXhQcmVmaWx0ZXI6IGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggcHJlZmlsdGVycyApLFxuXHRhamF4VHJhbnNwb3J0OiBhZGRUb1ByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHRyYW5zcG9ydHMgKSxcblxuXHQvLyBNYWluIG1ldGhvZFxuXHRhamF4OiBmdW5jdGlvbiggdXJsLCBvcHRpb25zICkge1xuXG5cdFx0Ly8gSWYgdXJsIGlzIGFuIG9iamVjdCwgc2ltdWxhdGUgcHJlLTEuNSBzaWduYXR1cmVcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0XHRvcHRpb25zID0gdXJsO1xuXHRcdFx0dXJsID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdC8vIEZvcmNlIG9wdGlvbnMgdG8gYmUgYW4gb2JqZWN0XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHR2YXIgdHJhbnNwb3J0LFxuXG5cdFx0XHQvLyBVUkwgd2l0aG91dCBhbnRpLWNhY2hlIHBhcmFtXG5cdFx0XHRjYWNoZVVSTCxcblxuXHRcdFx0Ly8gUmVzcG9uc2UgaGVhZGVyc1xuXHRcdFx0cmVzcG9uc2VIZWFkZXJzU3RyaW5nLFxuXHRcdFx0cmVzcG9uc2VIZWFkZXJzLFxuXG5cdFx0XHQvLyB0aW1lb3V0IGhhbmRsZVxuXHRcdFx0dGltZW91dFRpbWVyLFxuXG5cdFx0XHQvLyBVcmwgY2xlYW51cCB2YXJcblx0XHRcdHVybEFuY2hvcixcblxuXHRcdFx0Ly8gVG8ga25vdyBpZiBnbG9iYWwgZXZlbnRzIGFyZSB0byBiZSBkaXNwYXRjaGVkXG5cdFx0XHRmaXJlR2xvYmFscyxcblxuXHRcdFx0Ly8gTG9vcCB2YXJpYWJsZVxuXHRcdFx0aSxcblxuXHRcdFx0Ly8gQ3JlYXRlIHRoZSBmaW5hbCBvcHRpb25zIG9iamVjdFxuXHRcdFx0cyA9IGpRdWVyeS5hamF4U2V0dXAoIHt9LCBvcHRpb25zICksXG5cblx0XHRcdC8vIENhbGxiYWNrcyBjb250ZXh0XG5cdFx0XHRjYWxsYmFja0NvbnRleHQgPSBzLmNvbnRleHQgfHwgcyxcblxuXHRcdFx0Ly8gQ29udGV4dCBmb3IgZ2xvYmFsIGV2ZW50cyBpcyBjYWxsYmFja0NvbnRleHQgaWYgaXQgaXMgYSBET00gbm9kZSBvciBqUXVlcnkgY29sbGVjdGlvblxuXHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0ID0gcy5jb250ZXh0ICYmXG5cdFx0XHRcdCggY2FsbGJhY2tDb250ZXh0Lm5vZGVUeXBlIHx8IGNhbGxiYWNrQ29udGV4dC5qcXVlcnkgKSA/XG5cdFx0XHRcdFx0alF1ZXJ5KCBjYWxsYmFja0NvbnRleHQgKSA6XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LFxuXG5cdFx0XHQvLyBEZWZlcnJlZHNcblx0XHRcdGRlZmVycmVkID0galF1ZXJ5LkRlZmVycmVkKCksXG5cdFx0XHRjb21wbGV0ZURlZmVycmVkID0galF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksXG5cblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRzdGF0dXNDb2RlID0gcy5zdGF0dXNDb2RlIHx8IHt9LFxuXG5cdFx0XHQvLyBIZWFkZXJzICh0aGV5IGFyZSBzZW50IGFsbCBhdCBvbmNlKVxuXHRcdFx0cmVxdWVzdEhlYWRlcnMgPSB7fSxcblx0XHRcdHJlcXVlc3RIZWFkZXJzTmFtZXMgPSB7fSxcblxuXHRcdFx0Ly8gVGhlIGpxWEhSIHN0YXRlXG5cdFx0XHRzdGF0ZSA9IDAsXG5cblx0XHRcdC8vIERlZmF1bHQgYWJvcnQgbWVzc2FnZVxuXHRcdFx0c3RyQWJvcnQgPSBcImNhbmNlbGVkXCIsXG5cblx0XHRcdC8vIEZha2UgeGhyXG5cdFx0XHRqcVhIUiA9IHtcblx0XHRcdFx0cmVhZHlTdGF0ZTogMCxcblxuXHRcdFx0XHQvLyBCdWlsZHMgaGVhZGVycyBoYXNodGFibGUgaWYgbmVlZGVkXG5cdFx0XHRcdGdldFJlc3BvbnNlSGVhZGVyOiBmdW5jdGlvbigga2V5ICkge1xuXHRcdFx0XHRcdHZhciBtYXRjaDtcblx0XHRcdFx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0XHRcdFx0aWYgKCAhcmVzcG9uc2VIZWFkZXJzICkge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZUhlYWRlcnMgPSB7fTtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoID0gcmhlYWRlcnMuZXhlYyggcmVzcG9uc2VIZWFkZXJzU3RyaW5nICkgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXNwb25zZUhlYWRlcnNbIG1hdGNoWyAxIF0udG9Mb3dlckNhc2UoKSBdID0gbWF0Y2hbIDIgXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWF0Y2ggPSByZXNwb25zZUhlYWRlcnNbIGtleS50b0xvd2VyQ2FzZSgpIF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBtYXRjaCA9PSBudWxsID8gbnVsbCA6IG1hdGNoO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIFJhdyBzdHJpbmdcblx0XHRcdFx0Z2V0QWxsUmVzcG9uc2VIZWFkZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gc3RhdGUgPT09IDIgPyByZXNwb25zZUhlYWRlcnNTdHJpbmcgOiBudWxsO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIENhY2hlcyB0aGUgaGVhZGVyXG5cdFx0XHRcdHNldFJlcXVlc3RIZWFkZXI6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcblx0XHRcdFx0XHR2YXIgbG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0aWYgKCAhc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRuYW1lID0gcmVxdWVzdEhlYWRlcnNOYW1lc1sgbG5hbWUgXSA9IHJlcXVlc3RIZWFkZXJzTmFtZXNbIGxuYW1lIF0gfHwgbmFtZTtcblx0XHRcdFx0XHRcdHJlcXVlc3RIZWFkZXJzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gT3ZlcnJpZGVzIHJlc3BvbnNlIGNvbnRlbnQtdHlwZSBoZWFkZXJcblx0XHRcdFx0b3ZlcnJpZGVNaW1lVHlwZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRzLm1pbWVUeXBlID0gdHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gU3RhdHVzLWRlcGVuZGVudCBjYWxsYmFja3Ncblx0XHRcdFx0c3RhdHVzQ29kZTogZnVuY3Rpb24oIG1hcCApIHtcblx0XHRcdFx0XHR2YXIgY29kZTtcblx0XHRcdFx0XHRpZiAoIG1hcCApIHtcblx0XHRcdFx0XHRcdGlmICggc3RhdGUgPCAyICkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKCBjb2RlIGluIG1hcCApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIExhenktYWRkIHRoZSBuZXcgY2FsbGJhY2sgaW4gYSB3YXkgdGhhdCBwcmVzZXJ2ZXMgb2xkIG9uZXNcblx0XHRcdFx0XHRcdFx0XHRzdGF0dXNDb2RlWyBjb2RlIF0gPSBbIHN0YXR1c0NvZGVbIGNvZGUgXSwgbWFwWyBjb2RlIF0gXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBFeGVjdXRlIHRoZSBhcHByb3ByaWF0ZSBjYWxsYmFja3Ncblx0XHRcdFx0XHRcdFx0anFYSFIuYWx3YXlzKCBtYXBbIGpxWEhSLnN0YXR1cyBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIENhbmNlbCB0aGUgcmVxdWVzdFxuXHRcdFx0XHRhYm9ydDogZnVuY3Rpb24oIHN0YXR1c1RleHQgKSB7XG5cdFx0XHRcdFx0dmFyIGZpbmFsVGV4dCA9IHN0YXR1c1RleHQgfHwgc3RyQWJvcnQ7XG5cdFx0XHRcdFx0aWYgKCB0cmFuc3BvcnQgKSB7XG5cdFx0XHRcdFx0XHR0cmFuc3BvcnQuYWJvcnQoIGZpbmFsVGV4dCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkb25lKCAwLCBmaW5hbFRleHQgKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdC8vIEF0dGFjaCBkZWZlcnJlZHNcblx0XHRkZWZlcnJlZC5wcm9taXNlKCBqcVhIUiApLmNvbXBsZXRlID0gY29tcGxldGVEZWZlcnJlZC5hZGQ7XG5cdFx0anFYSFIuc3VjY2VzcyA9IGpxWEhSLmRvbmU7XG5cdFx0anFYSFIuZXJyb3IgPSBqcVhIUi5mYWlsO1xuXG5cdFx0Ly8gUmVtb3ZlIGhhc2ggY2hhcmFjdGVyICgjNzUzMTogYW5kIHN0cmluZyBwcm9tb3Rpb24pXG5cdFx0Ly8gQWRkIHByb3RvY29sIGlmIG5vdCBwcm92aWRlZCAocHJlZmlsdGVycyBtaWdodCBleHBlY3QgaXQpXG5cdFx0Ly8gSGFuZGxlIGZhbHN5IHVybCBpbiB0aGUgc2V0dGluZ3Mgb2JqZWN0ICgjMTAwOTM6IGNvbnNpc3RlbmN5IHdpdGggb2xkIHNpZ25hdHVyZSlcblx0XHQvLyBXZSBhbHNvIHVzZSB0aGUgdXJsIHBhcmFtZXRlciBpZiBhdmFpbGFibGVcblx0XHRzLnVybCA9ICggKCB1cmwgfHwgcy51cmwgfHwgbG9jYXRpb24uaHJlZiApICsgXCJcIiApLnJlcGxhY2UoIHJoYXNoLCBcIlwiIClcblx0XHRcdC5yZXBsYWNlKCBycHJvdG9jb2wsIGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICk7XG5cblx0XHQvLyBBbGlhcyBtZXRob2Qgb3B0aW9uIHRvIHR5cGUgYXMgcGVyIHRpY2tldCAjMTIwMDRcblx0XHRzLnR5cGUgPSBvcHRpb25zLm1ldGhvZCB8fCBvcHRpb25zLnR5cGUgfHwgcy5tZXRob2QgfHwgcy50eXBlO1xuXG5cdFx0Ly8gRXh0cmFjdCBkYXRhVHlwZXMgbGlzdFxuXHRcdHMuZGF0YVR5cGVzID0galF1ZXJ5LnRyaW0oIHMuZGF0YVR5cGUgfHwgXCIqXCIgKS50b0xvd2VyQ2FzZSgpLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbIFwiXCIgXTtcblxuXHRcdC8vIEEgY3Jvc3MtZG9tYWluIHJlcXVlc3QgaXMgaW4gb3JkZXIgd2hlbiB0aGUgb3JpZ2luIGRvZXNuJ3QgbWF0Y2ggdGhlIGN1cnJlbnQgb3JpZ2luLlxuXHRcdGlmICggcy5jcm9zc0RvbWFpbiA9PSBudWxsICkge1xuXHRcdFx0dXJsQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJhXCIgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4LTExK1xuXHRcdFx0Ly8gSUUgdGhyb3dzIGV4Y2VwdGlvbiBpZiB1cmwgaXMgbWFsZm9ybWVkLCBlLmcuIGh0dHA6Ly9leGFtcGxlLmNvbTo4MHgvXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR1cmxBbmNob3IuaHJlZiA9IHMudXJsO1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFOC0xMStcblx0XHRcdFx0Ly8gQW5jaG9yJ3MgaG9zdCBwcm9wZXJ0eSBpc24ndCBjb3JyZWN0bHkgc2V0IHdoZW4gcy51cmwgaXMgcmVsYXRpdmVcblx0XHRcdFx0dXJsQW5jaG9yLmhyZWYgPSB1cmxBbmNob3IuaHJlZjtcblx0XHRcdFx0cy5jcm9zc0RvbWFpbiA9IG9yaWdpbkFuY2hvci5wcm90b2NvbCArIFwiLy9cIiArIG9yaWdpbkFuY2hvci5ob3N0ICE9PVxuXHRcdFx0XHRcdHVybEFuY2hvci5wcm90b2NvbCArIFwiLy9cIiArIHVybEFuY2hvci5ob3N0O1xuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYW4gZXJyb3IgcGFyc2luZyB0aGUgVVJMLCBhc3N1bWUgaXQgaXMgY3Jvc3NEb21haW4sXG5cdFx0XHRcdC8vIGl0IGNhbiBiZSByZWplY3RlZCBieSB0aGUgdHJhbnNwb3J0IGlmIGl0IGlzIGludmFsaWRcblx0XHRcdFx0cy5jcm9zc0RvbWFpbiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ29udmVydCBkYXRhIGlmIG5vdCBhbHJlYWR5IGEgc3RyaW5nXG5cdFx0aWYgKCBzLmRhdGEgJiYgcy5wcm9jZXNzRGF0YSAmJiB0eXBlb2Ygcy5kYXRhICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cy5kYXRhID0galF1ZXJ5LnBhcmFtKCBzLmRhdGEsIHMudHJhZGl0aW9uYWwgKTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSBwcmVmaWx0ZXJzXG5cdFx0aW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHByZWZpbHRlcnMsIHMsIG9wdGlvbnMsIGpxWEhSICk7XG5cblx0XHQvLyBJZiByZXF1ZXN0IHdhcyBhYm9ydGVkIGluc2lkZSBhIHByZWZpbHRlciwgc3RvcCB0aGVyZVxuXHRcdGlmICggc3RhdGUgPT09IDIgKSB7XG5cdFx0XHRyZXR1cm4ganFYSFI7XG5cdFx0fVxuXG5cdFx0Ly8gV2UgY2FuIGZpcmUgZ2xvYmFsIGV2ZW50cyBhcyBvZiBub3cgaWYgYXNrZWQgdG9cblx0XHQvLyBEb24ndCBmaXJlIGV2ZW50cyBpZiBqUXVlcnkuZXZlbnQgaXMgdW5kZWZpbmVkIGluIGFuIEFNRC11c2FnZSBzY2VuYXJpbyAoIzE1MTE4KVxuXHRcdGZpcmVHbG9iYWxzID0galF1ZXJ5LmV2ZW50ICYmIHMuZ2xvYmFsO1xuXG5cdFx0Ly8gV2F0Y2ggZm9yIGEgbmV3IHNldCBvZiByZXF1ZXN0c1xuXHRcdGlmICggZmlyZUdsb2JhbHMgJiYgalF1ZXJ5LmFjdGl2ZSsrID09PSAwICkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIFwiYWpheFN0YXJ0XCIgKTtcblx0XHR9XG5cblx0XHQvLyBVcHBlcmNhc2UgdGhlIHR5cGVcblx0XHRzLnR5cGUgPSBzLnR5cGUudG9VcHBlckNhc2UoKTtcblxuXHRcdC8vIERldGVybWluZSBpZiByZXF1ZXN0IGhhcyBjb250ZW50XG5cdFx0cy5oYXNDb250ZW50ID0gIXJub0NvbnRlbnQudGVzdCggcy50eXBlICk7XG5cblx0XHQvLyBTYXZlIHRoZSBVUkwgaW4gY2FzZSB3ZSdyZSB0b3lpbmcgd2l0aCB0aGUgSWYtTW9kaWZpZWQtU2luY2Vcblx0XHQvLyBhbmQvb3IgSWYtTm9uZS1NYXRjaCBoZWFkZXIgbGF0ZXIgb25cblx0XHRjYWNoZVVSTCA9IHMudXJsO1xuXG5cdFx0Ly8gTW9yZSBvcHRpb25zIGhhbmRsaW5nIGZvciByZXF1ZXN0cyB3aXRoIG5vIGNvbnRlbnRcblx0XHRpZiAoICFzLmhhc0NvbnRlbnQgKSB7XG5cblx0XHRcdC8vIElmIGRhdGEgaXMgYXZhaWxhYmxlLCBhcHBlbmQgZGF0YSB0byB1cmxcblx0XHRcdGlmICggcy5kYXRhICkge1xuXHRcdFx0XHRjYWNoZVVSTCA9ICggcy51cmwgKz0gKCBycXVlcnkudGVzdCggY2FjaGVVUkwgKSA/IFwiJlwiIDogXCI/XCIgKSArIHMuZGF0YSApO1xuXG5cdFx0XHRcdC8vICM5NjgyOiByZW1vdmUgZGF0YSBzbyB0aGF0IGl0J3Mgbm90IHVzZWQgaW4gYW4gZXZlbnR1YWwgcmV0cnlcblx0XHRcdFx0ZGVsZXRlIHMuZGF0YTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIGFudGktY2FjaGUgaW4gdXJsIGlmIG5lZWRlZFxuXHRcdFx0aWYgKCBzLmNhY2hlID09PSBmYWxzZSApIHtcblx0XHRcdFx0cy51cmwgPSBydHMudGVzdCggY2FjaGVVUkwgKSA/XG5cblx0XHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGEgJ18nIHBhcmFtZXRlciwgc2V0IGl0cyB2YWx1ZVxuXHRcdFx0XHRcdGNhY2hlVVJMLnJlcGxhY2UoIHJ0cywgXCIkMV89XCIgKyBub25jZSsrICkgOlxuXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGFkZCBvbmUgdG8gdGhlIGVuZFxuXHRcdFx0XHRcdGNhY2hlVVJMICsgKCBycXVlcnkudGVzdCggY2FjaGVVUkwgKSA/IFwiJlwiIDogXCI/XCIgKSArIFwiXz1cIiArIG5vbmNlKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHRoZSBJZi1Nb2RpZmllZC1TaW5jZSBhbmQvb3IgSWYtTm9uZS1NYXRjaCBoZWFkZXIsIGlmIGluIGlmTW9kaWZpZWQgbW9kZS5cblx0XHRpZiAoIHMuaWZNb2RpZmllZCApIHtcblx0XHRcdGlmICggalF1ZXJ5Lmxhc3RNb2RpZmllZFsgY2FjaGVVUkwgXSApIHtcblx0XHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJJZi1Nb2RpZmllZC1TaW5jZVwiLCBqUXVlcnkubGFzdE1vZGlmaWVkWyBjYWNoZVVSTCBdICk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGpRdWVyeS5ldGFnWyBjYWNoZVVSTCBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU5vbmUtTWF0Y2hcIiwgalF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIGNvcnJlY3QgaGVhZGVyLCBpZiBkYXRhIGlzIGJlaW5nIHNlbnRcblx0XHRpZiAoIHMuZGF0YSAmJiBzLmhhc0NvbnRlbnQgJiYgcy5jb250ZW50VHlwZSAhPT0gZmFsc2UgfHwgb3B0aW9ucy5jb250ZW50VHlwZSApIHtcblx0XHRcdGpxWEhSLnNldFJlcXVlc3RIZWFkZXIoIFwiQ29udGVudC1UeXBlXCIsIHMuY29udGVudFR5cGUgKTtcblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIEFjY2VwdHMgaGVhZGVyIGZvciB0aGUgc2VydmVyLCBkZXBlbmRpbmcgb24gdGhlIGRhdGFUeXBlXG5cdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlcihcblx0XHRcdFwiQWNjZXB0XCIsXG5cdFx0XHRzLmRhdGFUeXBlc1sgMCBdICYmIHMuYWNjZXB0c1sgcy5kYXRhVHlwZXNbIDAgXSBdID9cblx0XHRcdFx0cy5hY2NlcHRzWyBzLmRhdGFUeXBlc1sgMCBdIF0gK1xuXHRcdFx0XHRcdCggcy5kYXRhVHlwZXNbIDAgXSAhPT0gXCIqXCIgPyBcIiwgXCIgKyBhbGxUeXBlcyArIFwiOyBxPTAuMDFcIiA6IFwiXCIgKSA6XG5cdFx0XHRcdHMuYWNjZXB0c1sgXCIqXCIgXVxuXHRcdCk7XG5cblx0XHQvLyBDaGVjayBmb3IgaGVhZGVycyBvcHRpb25cblx0XHRmb3IgKCBpIGluIHMuaGVhZGVycyApIHtcblx0XHRcdGpxWEhSLnNldFJlcXVlc3RIZWFkZXIoIGksIHMuaGVhZGVyc1sgaSBdICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWxsb3cgY3VzdG9tIGhlYWRlcnMvbWltZXR5cGVzIGFuZCBlYXJseSBhYm9ydFxuXHRcdGlmICggcy5iZWZvcmVTZW5kICYmXG5cdFx0XHQoIHMuYmVmb3JlU2VuZC5jYWxsKCBjYWxsYmFja0NvbnRleHQsIGpxWEhSLCBzICkgPT09IGZhbHNlIHx8IHN0YXRlID09PSAyICkgKSB7XG5cblx0XHRcdC8vIEFib3J0IGlmIG5vdCBkb25lIGFscmVhZHkgYW5kIHJldHVyblxuXHRcdFx0cmV0dXJuIGpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0Ly8gQWJvcnRpbmcgaXMgbm8gbG9uZ2VyIGEgY2FuY2VsbGF0aW9uXG5cdFx0c3RyQWJvcnQgPSBcImFib3J0XCI7XG5cblx0XHQvLyBJbnN0YWxsIGNhbGxiYWNrcyBvbiBkZWZlcnJlZHNcblx0XHRmb3IgKCBpIGluIHsgc3VjY2VzczogMSwgZXJyb3I6IDEsIGNvbXBsZXRlOiAxIH0gKSB7XG5cdFx0XHRqcVhIUlsgaSBdKCBzWyBpIF0gKTtcblx0XHR9XG5cblx0XHQvLyBHZXQgdHJhbnNwb3J0XG5cdFx0dHJhbnNwb3J0ID0gaW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHRyYW5zcG9ydHMsIHMsIG9wdGlvbnMsIGpxWEhSICk7XG5cblx0XHQvLyBJZiBubyB0cmFuc3BvcnQsIHdlIGF1dG8tYWJvcnRcblx0XHRpZiAoICF0cmFuc3BvcnQgKSB7XG5cdFx0XHRkb25lKCAtMSwgXCJObyBUcmFuc3BvcnRcIiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRqcVhIUi5yZWFkeVN0YXRlID0gMTtcblxuXHRcdFx0Ly8gU2VuZCBnbG9iYWwgZXZlbnRcblx0XHRcdGlmICggZmlyZUdsb2JhbHMgKSB7XG5cdFx0XHRcdGdsb2JhbEV2ZW50Q29udGV4dC50cmlnZ2VyKCBcImFqYXhTZW5kXCIsIFsganFYSFIsIHMgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiByZXF1ZXN0IHdhcyBhYm9ydGVkIGluc2lkZSBhamF4U2VuZCwgc3RvcCB0aGVyZVxuXHRcdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdFx0cmV0dXJuIGpxWEhSO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUaW1lb3V0XG5cdFx0XHRpZiAoIHMuYXN5bmMgJiYgcy50aW1lb3V0ID4gMCApIHtcblx0XHRcdFx0dGltZW91dFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGpxWEhSLmFib3J0KCBcInRpbWVvdXRcIiApO1xuXHRcdFx0XHR9LCBzLnRpbWVvdXQgKTtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0c3RhdGUgPSAxO1xuXHRcdFx0XHR0cmFuc3BvcnQuc2VuZCggcmVxdWVzdEhlYWRlcnMsIGRvbmUgKTtcblx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXG5cdFx0XHRcdC8vIFByb3BhZ2F0ZSBleGNlcHRpb24gYXMgZXJyb3IgaWYgbm90IGRvbmVcblx0XHRcdFx0aWYgKCBzdGF0ZSA8IDIgKSB7XG5cdFx0XHRcdFx0ZG9uZSggLTEsIGUgKTtcblxuXHRcdFx0XHQvLyBTaW1wbHkgcmV0aHJvdyBvdGhlcndpc2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsbGJhY2sgZm9yIHdoZW4gZXZlcnl0aGluZyBpcyBkb25lXG5cdFx0ZnVuY3Rpb24gZG9uZSggc3RhdHVzLCBuYXRpdmVTdGF0dXNUZXh0LCByZXNwb25zZXMsIGhlYWRlcnMgKSB7XG5cdFx0XHR2YXIgaXNTdWNjZXNzLCBzdWNjZXNzLCBlcnJvciwgcmVzcG9uc2UsIG1vZGlmaWVkLFxuXHRcdFx0XHRzdGF0dXNUZXh0ID0gbmF0aXZlU3RhdHVzVGV4dDtcblxuXHRcdFx0Ly8gQ2FsbGVkIG9uY2Vcblx0XHRcdGlmICggc3RhdGUgPT09IDIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3RhdGUgaXMgXCJkb25lXCIgbm93XG5cdFx0XHRzdGF0ZSA9IDI7XG5cblx0XHRcdC8vIENsZWFyIHRpbWVvdXQgaWYgaXQgZXhpc3RzXG5cdFx0XHRpZiAoIHRpbWVvdXRUaW1lciApIHtcblx0XHRcdFx0d2luZG93LmNsZWFyVGltZW91dCggdGltZW91dFRpbWVyICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERlcmVmZXJlbmNlIHRyYW5zcG9ydCBmb3IgZWFybHkgZ2FyYmFnZSBjb2xsZWN0aW9uXG5cdFx0XHQvLyAobm8gbWF0dGVyIGhvdyBsb25nIHRoZSBqcVhIUiBvYmplY3Qgd2lsbCBiZSB1c2VkKVxuXHRcdFx0dHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHQvLyBDYWNoZSByZXNwb25zZSBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZUhlYWRlcnNTdHJpbmcgPSBoZWFkZXJzIHx8IFwiXCI7XG5cblx0XHRcdC8vIFNldCByZWFkeVN0YXRlXG5cdFx0XHRqcVhIUi5yZWFkeVN0YXRlID0gc3RhdHVzID4gMCA/IDQgOiAwO1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgaWYgc3VjY2Vzc2Z1bFxuXHRcdFx0aXNTdWNjZXNzID0gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG5cblx0XHRcdC8vIEdldCByZXNwb25zZSBkYXRhXG5cdFx0XHRpZiAoIHJlc3BvbnNlcyApIHtcblx0XHRcdFx0cmVzcG9uc2UgPSBhamF4SGFuZGxlUmVzcG9uc2VzKCBzLCBqcVhIUiwgcmVzcG9uc2VzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnZlcnQgbm8gbWF0dGVyIHdoYXQgKHRoYXQgd2F5IHJlc3BvbnNlWFhYIGZpZWxkcyBhcmUgYWx3YXlzIHNldClcblx0XHRcdHJlc3BvbnNlID0gYWpheENvbnZlcnQoIHMsIHJlc3BvbnNlLCBqcVhIUiwgaXNTdWNjZXNzICk7XG5cblx0XHRcdC8vIElmIHN1Y2Nlc3NmdWwsIGhhbmRsZSB0eXBlIGNoYWluaW5nXG5cdFx0XHRpZiAoIGlzU3VjY2VzcyApIHtcblxuXHRcdFx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciwgaWYgaW4gaWZNb2RpZmllZCBtb2RlLlxuXHRcdFx0XHRpZiAoIHMuaWZNb2RpZmllZCApIHtcblx0XHRcdFx0XHRtb2RpZmllZCA9IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKCBcIkxhc3QtTW9kaWZpZWRcIiApO1xuXHRcdFx0XHRcdGlmICggbW9kaWZpZWQgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkubGFzdE1vZGlmaWVkWyBjYWNoZVVSTCBdID0gbW9kaWZpZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1vZGlmaWVkID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoIFwiZXRhZ1wiICk7XG5cdFx0XHRcdFx0aWYgKCBtb2RpZmllZCApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5ldGFnWyBjYWNoZVVSTCBdID0gbW9kaWZpZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaWYgbm8gY29udGVudFxuXHRcdFx0XHRpZiAoIHN0YXR1cyA9PT0gMjA0IHx8IHMudHlwZSA9PT0gXCJIRUFEXCIgKSB7XG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IFwibm9jb250ZW50XCI7XG5cblx0XHRcdFx0Ly8gaWYgbm90IG1vZGlmaWVkXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHN0YXR1cyA9PT0gMzA0ICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcIm5vdG1vZGlmaWVkXCI7XG5cblx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBkYXRhLCBsZXQncyBjb252ZXJ0IGl0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IHJlc3BvbnNlLnN0YXRlO1xuXHRcdFx0XHRcdHN1Y2Nlc3MgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRcdGVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG5cdFx0XHRcdFx0aXNTdWNjZXNzID0gIWVycm9yO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIEV4dHJhY3QgZXJyb3IgZnJvbSBzdGF0dXNUZXh0IGFuZCBub3JtYWxpemUgZm9yIG5vbi1hYm9ydHNcblx0XHRcdFx0ZXJyb3IgPSBzdGF0dXNUZXh0O1xuXHRcdFx0XHRpZiAoIHN0YXR1cyB8fCAhc3RhdHVzVGV4dCApIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gXCJlcnJvclwiO1xuXHRcdFx0XHRcdGlmICggc3RhdHVzIDwgMCApIHtcblx0XHRcdFx0XHRcdHN0YXR1cyA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCBkYXRhIGZvciB0aGUgZmFrZSB4aHIgb2JqZWN0XG5cdFx0XHRqcVhIUi5zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHRqcVhIUi5zdGF0dXNUZXh0ID0gKCBuYXRpdmVTdGF0dXNUZXh0IHx8IHN0YXR1c1RleHQgKSArIFwiXCI7XG5cblx0XHRcdC8vIFN1Y2Nlc3MvRXJyb3Jcblx0XHRcdGlmICggaXNTdWNjZXNzICkge1xuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIHN1Y2Nlc3MsIHN0YXR1c1RleHQsIGpxWEhSIF0gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdFdpdGgoIGNhbGxiYWNrQ29udGV4dCwgWyBqcVhIUiwgc3RhdHVzVGV4dCwgZXJyb3IgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdGF0dXMtZGVwZW5kZW50IGNhbGxiYWNrc1xuXHRcdFx0anFYSFIuc3RhdHVzQ29kZSggc3RhdHVzQ29kZSApO1xuXHRcdFx0c3RhdHVzQ29kZSA9IHVuZGVmaW5lZDtcblxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIGlzU3VjY2VzcyA/IFwiYWpheFN1Y2Nlc3NcIiA6IFwiYWpheEVycm9yXCIsXG5cdFx0XHRcdFx0WyBqcVhIUiwgcywgaXNTdWNjZXNzID8gc3VjY2VzcyA6IGVycm9yIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29tcGxldGVcblx0XHRcdGNvbXBsZXRlRGVmZXJyZWQuZmlyZVdpdGgoIGNhbGxiYWNrQ29udGV4dCwgWyBqcVhIUiwgc3RhdHVzVGV4dCBdICk7XG5cblx0XHRcdGlmICggZmlyZUdsb2JhbHMgKSB7XG5cdFx0XHRcdGdsb2JhbEV2ZW50Q29udGV4dC50cmlnZ2VyKCBcImFqYXhDb21wbGV0ZVwiLCBbIGpxWEhSLCBzIF0gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIGdsb2JhbCBBSkFYIGNvdW50ZXJcblx0XHRcdFx0aWYgKCAhKCAtLWpRdWVyeS5hY3RpdmUgKSApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RvcFwiICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4ganFYSFI7XG5cdH0sXG5cblx0Z2V0SlNPTjogZnVuY3Rpb24oIHVybCwgZGF0YSwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5nZXQoIHVybCwgZGF0YSwgY2FsbGJhY2ssIFwianNvblwiICk7XG5cdH0sXG5cblx0Z2V0U2NyaXB0OiBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdldCggdXJsLCB1bmRlZmluZWQsIGNhbGxiYWNrLCBcInNjcmlwdFwiICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmVhY2goIFsgXCJnZXRcIiwgXCJwb3N0XCIgXSwgZnVuY3Rpb24oIGksIG1ldGhvZCApIHtcblx0alF1ZXJ5WyBtZXRob2QgXSA9IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrLCB0eXBlICkge1xuXG5cdFx0Ly8gU2hpZnQgYXJndW1lbnRzIGlmIGRhdGEgYXJndW1lbnQgd2FzIG9taXR0ZWRcblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBkYXRhICkgKSB7XG5cdFx0XHR0eXBlID0gdHlwZSB8fCBjYWxsYmFjaztcblx0XHRcdGNhbGxiYWNrID0gZGF0YTtcblx0XHRcdGRhdGEgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIHVybCBjYW4gYmUgYW4gb3B0aW9ucyBvYmplY3QgKHdoaWNoIHRoZW4gbXVzdCBoYXZlIC51cmwpXG5cdFx0cmV0dXJuIGpRdWVyeS5hamF4KCBqUXVlcnkuZXh0ZW5kKCB7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHR5cGU6IG1ldGhvZCxcblx0XHRcdGRhdGFUeXBlOiB0eXBlLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHN1Y2Nlc3M6IGNhbGxiYWNrXG5cdFx0fSwgalF1ZXJ5LmlzUGxhaW5PYmplY3QoIHVybCApICYmIHVybCApICk7XG5cdH07XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=