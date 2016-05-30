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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsaUJBSE8sRUFJUCxxQkFKTyxFQUtQLGtCQUxPLEVBTVAsbUJBTk8sRUFRUCxhQVJPLEVBU1Asa0JBVE8sRUFVUCxpQkFWTyxFQVdQLGlCQVhPLEVBWVAsWUFaTyxDQUFSLEVBYUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLFNBQTVCLEVBQXVDLFFBQXZDLEVBQWlELEtBQWpELEVBQXdELE1BQXhELEVBQWlFOztBQUVwRSxLQUNDLFFBQVEsTUFEVDtLQUVDLE1BQU0sZUFGUDtLQUdDLFdBQVcsNEJBSFo7Ozs7QUFNQyxrQkFBaUIsMkRBTmxCO0tBT0MsYUFBYSxnQkFQZDtLQVFDLFlBQVksT0FSYjs7Ozs7Ozs7Ozs7O0FBbUJDLGNBQWEsRUFuQmQ7Ozs7Ozs7O0FBMEJDLGNBQWEsRUExQmQ7Ozs7QUE2QkMsWUFBVyxLQUFLLE1BQUwsQ0FBYSxHQUFiLENBN0JaOzs7O0FBZ0NDLGdCQUFlLFNBQVMsYUFBVCxDQUF3QixHQUF4QixDQWhDaEI7QUFpQ0MsY0FBYSxJQUFiLEdBQW9CLFNBQVMsSUFBN0I7OztBQUdELFVBQVMsMkJBQVQsQ0FBc0MsU0FBdEMsRUFBa0Q7OztBQUdqRCxTQUFPLFVBQVUsa0JBQVYsRUFBOEIsSUFBOUIsRUFBcUM7O0FBRTNDLE9BQUssT0FBTyxrQkFBUCxLQUE4QixRQUFuQyxFQUE4QztBQUM3QyxXQUFPLGtCQUFQO0FBQ0EseUJBQXFCLEdBQXJCO0FBQ0E7O0FBRUQsT0FBSSxRQUFKO09BQ0MsSUFBSSxDQURMO09BRUMsWUFBWSxtQkFBbUIsV0FBbkIsR0FBaUMsS0FBakMsQ0FBd0MsU0FBeEMsS0FBdUQsRUFGcEU7O0FBSUEsT0FBSyxPQUFPLFVBQVAsQ0FBbUIsSUFBbkIsQ0FBTCxFQUFpQzs7O0FBR2hDLFdBQVUsV0FBVyxV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QUFVLElBSHdCO0FBSWxDLFVBQU0sSUFKNEI7QUFLbEMsYUFBUztBQUx5QixJQUFmLEVBTWpCLE9BQU8sYUFBUCxDQUFzQixHQUF0QixLQUErQixHQU5kLENBQWIsQ0FBUDtBQU9BLEdBakJEO0FBa0JBLEVBbkJEOztBQXFCQSxRQUFPLE1BQVA7QUFDQyxDQTUwQkQiLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi92YXIvcm5vdHdoaXRlXCIsXG5cdFwiLi9hamF4L3Zhci9sb2NhdGlvblwiLFxuXHRcIi4vYWpheC92YXIvbm9uY2VcIixcblx0XCIuL2FqYXgvdmFyL3JxdWVyeVwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL2FqYXgvcGFyc2VKU09OXCIsXG5cdFwiLi9hamF4L3BhcnNlWE1MXCIsXG5cdFwiLi9ldmVudC90cmlnZ2VyXCIsXG5cdFwiLi9kZWZlcnJlZFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBkb2N1bWVudCwgcm5vdHdoaXRlLCBsb2NhdGlvbiwgbm9uY2UsIHJxdWVyeSApIHtcblxudmFyXG5cdHJoYXNoID0gLyMuKiQvLFxuXHRydHMgPSAvKFs/Jl0pXz1bXiZdKi8sXG5cdHJoZWFkZXJzID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZyxcblxuXHQvLyAjNzY1MywgIzgxMjUsICM4MTUyOiBsb2NhbCBwcm90b2NvbCBkZXRlY3Rpb25cblx0cmxvY2FsUHJvdG9jb2wgPSAvXig/OmFib3V0fGFwcHxhcHAtc3RvcmFnZXwuKy1leHRlbnNpb258ZmlsZXxyZXN8d2lkZ2V0KTokLyxcblx0cm5vQ29udGVudCA9IC9eKD86R0VUfEhFQUQpJC8sXG5cdHJwcm90b2NvbCA9IC9eXFwvXFwvLyxcblxuXHQvKiBQcmVmaWx0ZXJzXG5cdCAqIDEpIFRoZXkgYXJlIHVzZWZ1bCB0byBpbnRyb2R1Y2UgY3VzdG9tIGRhdGFUeXBlcyAoc2VlIGFqYXgvanNvbnAuanMgZm9yIGFuIGV4YW1wbGUpXG5cdCAqIDIpIFRoZXNlIGFyZSBjYWxsZWQ6XG5cdCAqICAgIC0gQkVGT1JFIGFza2luZyBmb3IgYSB0cmFuc3BvcnRcblx0ICogICAgLSBBRlRFUiBwYXJhbSBzZXJpYWxpemF0aW9uIChzLmRhdGEgaXMgYSBzdHJpbmcgaWYgcy5wcm9jZXNzRGF0YSBpcyB0cnVlKVxuXHQgKiAzKSBrZXkgaXMgdGhlIGRhdGFUeXBlXG5cdCAqIDQpIHRoZSBjYXRjaGFsbCBzeW1ib2wgXCIqXCIgY2FuIGJlIHVzZWRcblx0ICogNSkgZXhlY3V0aW9uIHdpbGwgc3RhcnQgd2l0aCB0cmFuc3BvcnQgZGF0YVR5cGUgYW5kIFRIRU4gY29udGludWUgZG93biB0byBcIipcIiBpZiBuZWVkZWRcblx0ICovXG5cdHByZWZpbHRlcnMgPSB7fSxcblxuXHQvKiBUcmFuc3BvcnRzIGJpbmRpbmdzXG5cdCAqIDEpIGtleSBpcyB0aGUgZGF0YVR5cGVcblx0ICogMikgdGhlIGNhdGNoYWxsIHN5bWJvbCBcIipcIiBjYW4gYmUgdXNlZFxuXHQgKiAzKSBzZWxlY3Rpb24gd2lsbCBzdGFydCB3aXRoIHRyYW5zcG9ydCBkYXRhVHlwZSBhbmQgVEhFTiBnbyB0byBcIipcIiBpZiBuZWVkZWRcblx0ICovXG5cdHRyYW5zcG9ydHMgPSB7fSxcblxuXHQvLyBBdm9pZCBjb21tZW50LXByb2xvZyBjaGFyIHNlcXVlbmNlICgjMTAwOTgpOyBtdXN0IGFwcGVhc2UgbGludCBhbmQgZXZhZGUgY29tcHJlc3Npb25cblx0YWxsVHlwZXMgPSBcIiovXCIuY29uY2F0KCBcIipcIiApLFxuXG5cdC8vIEFuY2hvciB0YWcgZm9yIHBhcnNpbmcgdGhlIGRvY3VtZW50IG9yaWdpblxuXHRvcmlnaW5BbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXHRvcmlnaW5BbmNob3IuaHJlZiA9IGxvY2F0aW9uLmhyZWY7XG5cbi8vIEJhc2UgXCJjb25zdHJ1Y3RvclwiIGZvciBqUXVlcnkuYWpheFByZWZpbHRlciBhbmQgalF1ZXJ5LmFqYXhUcmFuc3BvcnRcbmZ1bmN0aW9uIGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggc3RydWN0dXJlICkge1xuXG5cdC8vIGRhdGFUeXBlRXhwcmVzc2lvbiBpcyBvcHRpb25hbCBhbmQgZGVmYXVsdHMgdG8gXCIqXCJcblx0cmV0dXJuIGZ1bmN0aW9uKCBkYXRhVHlwZUV4cHJlc3Npb24sIGZ1bmMgKSB7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhVHlwZUV4cHJlc3Npb24gIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRmdW5jID0gZGF0YVR5cGVFeHByZXNzaW9uO1xuXHRcdFx0ZGF0YVR5cGVFeHByZXNzaW9uID0gXCIqXCI7XG5cdFx0fVxuXG5cdFx0dmFyIGRhdGFUeXBlLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRkYXRhVHlwZXMgPSBkYXRhVHlwZUV4cHJlc3Npb24udG9Mb3dlckNhc2UoKS5tYXRjaCggcm5vdHdoaXRlICkgfHwgW107XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBmdW5jICkgKSB7XG5cblx0XHRcdC8vIEZvciBlYWNoIGRhdGFUeXBlIGluIHRoZSBkYXRhVHlwZUV4cHJlc3Npb25cblx0XHRcdHdoaWxlICggKCBkYXRhVHlwZSA9IGRhdGFUeXBlc1sgaSsrIF0gKSApIHtcblxuXHRcdFx0XHQvLyBQcmVwZW5kIGlmIHJlcXVlc3RlZFxuXHRcdFx0XHRpZiAoIGRhdGFUeXBlWyAwIF0gPT09IFwiK1wiICkge1xuXHRcdFx0XHRcdGRhdGFUeXBlID0gZGF0YVR5cGUuc2xpY2UoIDEgKSB8fCBcIipcIjtcblx0XHRcdFx0XHQoIHN0cnVjdHVyZVsgZGF0YVR5cGUgXSA9IHN0cnVjdHVyZVsgZGF0YVR5cGUgXSB8fCBbXSApLnVuc2hpZnQoIGZ1bmMgKTtcblxuXHRcdFx0XHQvLyBPdGhlcndpc2UgYXBwZW5kXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KCBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gPSBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gfHwgW10gKS5wdXNoKCBmdW5jICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbi8vIEJhc2UgaW5zcGVjdGlvbiBmdW5jdGlvbiBmb3IgcHJlZmlsdGVycyBhbmQgdHJhbnNwb3J0c1xuZnVuY3Rpb24gaW5zcGVjdFByZWZpbHRlcnNPclRyYW5zcG9ydHMoIHN0cnVjdHVyZSwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCBqcVhIUiApIHtcblxuXHR2YXIgaW5zcGVjdGVkID0ge30sXG5cdFx0c2Vla2luZ1RyYW5zcG9ydCA9ICggc3RydWN0dXJlID09PSB0cmFuc3BvcnRzICk7XG5cblx0ZnVuY3Rpb24gaW5zcGVjdCggZGF0YVR5cGUgKSB7XG5cdFx0dmFyIHNlbGVjdGVkO1xuXHRcdGluc3BlY3RlZFsgZGF0YVR5cGUgXSA9IHRydWU7XG5cdFx0alF1ZXJ5LmVhY2goIHN0cnVjdHVyZVsgZGF0YVR5cGUgXSB8fCBbXSwgZnVuY3Rpb24oIF8sIHByZWZpbHRlck9yRmFjdG9yeSApIHtcblx0XHRcdHZhciBkYXRhVHlwZU9yVHJhbnNwb3J0ID0gcHJlZmlsdGVyT3JGYWN0b3J5KCBvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIGpxWEhSICk7XG5cdFx0XHRpZiAoIHR5cGVvZiBkYXRhVHlwZU9yVHJhbnNwb3J0ID09PSBcInN0cmluZ1wiICYmXG5cdFx0XHRcdCFzZWVraW5nVHJhbnNwb3J0ICYmICFpbnNwZWN0ZWRbIGRhdGFUeXBlT3JUcmFuc3BvcnQgXSApIHtcblxuXHRcdFx0XHRvcHRpb25zLmRhdGFUeXBlcy51bnNoaWZ0KCBkYXRhVHlwZU9yVHJhbnNwb3J0ICk7XG5cdFx0XHRcdGluc3BlY3QoIGRhdGFUeXBlT3JUcmFuc3BvcnQgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSBlbHNlIGlmICggc2Vla2luZ1RyYW5zcG9ydCApIHtcblx0XHRcdFx0cmV0dXJuICEoIHNlbGVjdGVkID0gZGF0YVR5cGVPclRyYW5zcG9ydCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0XHRyZXR1cm4gc2VsZWN0ZWQ7XG5cdH1cblxuXHRyZXR1cm4gaW5zcGVjdCggb3B0aW9ucy5kYXRhVHlwZXNbIDAgXSApIHx8ICFpbnNwZWN0ZWRbIFwiKlwiIF0gJiYgaW5zcGVjdCggXCIqXCIgKTtcbn1cblxuLy8gQSBzcGVjaWFsIGV4dGVuZCBmb3IgYWpheCBvcHRpb25zXG4vLyB0aGF0IHRha2VzIFwiZmxhdFwiIG9wdGlvbnMgKG5vdCB0byBiZSBkZWVwIGV4dGVuZGVkKVxuLy8gRml4ZXMgIzk4ODdcbmZ1bmN0aW9uIGFqYXhFeHRlbmQoIHRhcmdldCwgc3JjICkge1xuXHR2YXIga2V5LCBkZWVwLFxuXHRcdGZsYXRPcHRpb25zID0galF1ZXJ5LmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9ucyB8fCB7fTtcblxuXHRmb3IgKCBrZXkgaW4gc3JjICkge1xuXHRcdGlmICggc3JjWyBrZXkgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0KCBmbGF0T3B0aW9uc1sga2V5IF0gPyB0YXJnZXQgOiAoIGRlZXAgfHwgKCBkZWVwID0ge30gKSApIClbIGtleSBdID0gc3JjWyBrZXkgXTtcblx0XHR9XG5cdH1cblx0aWYgKCBkZWVwICkge1xuXHRcdGpRdWVyeS5leHRlbmQoIHRydWUsIHRhcmdldCwgZGVlcCApO1xuXHR9XG5cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuLyogSGFuZGxlcyByZXNwb25zZXMgdG8gYW4gYWpheCByZXF1ZXN0OlxuICogLSBmaW5kcyB0aGUgcmlnaHQgZGF0YVR5cGUgKG1lZGlhdGVzIGJldHdlZW4gY29udGVudC10eXBlIGFuZCBleHBlY3RlZCBkYXRhVHlwZSlcbiAqIC0gcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyByZXNwb25zZVxuICovXG5mdW5jdGlvbiBhamF4SGFuZGxlUmVzcG9uc2VzKCBzLCBqcVhIUiwgcmVzcG9uc2VzICkge1xuXG5cdHZhciBjdCwgdHlwZSwgZmluYWxEYXRhVHlwZSwgZmlyc3REYXRhVHlwZSxcblx0XHRjb250ZW50cyA9IHMuY29udGVudHMsXG5cdFx0ZGF0YVR5cGVzID0gcy5kYXRhVHlwZXM7XG5cblx0Ly8gUmVtb3ZlIGF1dG8gZGF0YVR5cGUgYW5kIGdldCBjb250ZW50LXR5cGUgaW4gdGhlIHByb2Nlc3Ncblx0d2hpbGUgKCBkYXRhVHlwZXNbIDAgXSA9PT0gXCIqXCIgKSB7XG5cdFx0ZGF0YVR5cGVzLnNoaWZ0KCk7XG5cdFx0aWYgKCBjdCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0Y3QgPSBzLm1pbWVUeXBlIHx8IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKCBcIkNvbnRlbnQtVHlwZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgd2UncmUgZGVhbGluZyB3aXRoIGEga25vd24gY29udGVudC10eXBlXG5cdGlmICggY3QgKSB7XG5cdFx0Zm9yICggdHlwZSBpbiBjb250ZW50cyApIHtcblx0XHRcdGlmICggY29udGVudHNbIHR5cGUgXSAmJiBjb250ZW50c1sgdHlwZSBdLnRlc3QoIGN0ICkgKSB7XG5cdFx0XHRcdGRhdGFUeXBlcy51bnNoaWZ0KCB0eXBlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBoYXZlIGEgcmVzcG9uc2UgZm9yIHRoZSBleHBlY3RlZCBkYXRhVHlwZVxuXHRpZiAoIGRhdGFUeXBlc1sgMCBdIGluIHJlc3BvbnNlcyApIHtcblx0XHRmaW5hbERhdGFUeXBlID0gZGF0YVR5cGVzWyAwIF07XG5cdH0gZWxzZSB7XG5cblx0XHQvLyBUcnkgY29udmVydGlibGUgZGF0YVR5cGVzXG5cdFx0Zm9yICggdHlwZSBpbiByZXNwb25zZXMgKSB7XG5cdFx0XHRpZiAoICFkYXRhVHlwZXNbIDAgXSB8fCBzLmNvbnZlcnRlcnNbIHR5cGUgKyBcIiBcIiArIGRhdGFUeXBlc1sgMCBdIF0gKSB7XG5cdFx0XHRcdGZpbmFsRGF0YVR5cGUgPSB0eXBlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICggIWZpcnN0RGF0YVR5cGUgKSB7XG5cdFx0XHRcdGZpcnN0RGF0YVR5cGUgPSB0eXBlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE9yIGp1c3QgdXNlIGZpcnN0IG9uZVxuXHRcdGZpbmFsRGF0YVR5cGUgPSBmaW5hbERhdGFUeXBlIHx8IGZpcnN0RGF0YVR5cGU7XG5cdH1cblxuXHQvLyBJZiB3ZSBmb3VuZCBhIGRhdGFUeXBlXG5cdC8vIFdlIGFkZCB0aGUgZGF0YVR5cGUgdG8gdGhlIGxpc3QgaWYgbmVlZGVkXG5cdC8vIGFuZCByZXR1cm4gdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2Vcblx0aWYgKCBmaW5hbERhdGFUeXBlICkge1xuXHRcdGlmICggZmluYWxEYXRhVHlwZSAhPT0gZGF0YVR5cGVzWyAwIF0gKSB7XG5cdFx0XHRkYXRhVHlwZXMudW5zaGlmdCggZmluYWxEYXRhVHlwZSApO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcG9uc2VzWyBmaW5hbERhdGFUeXBlIF07XG5cdH1cbn1cblxuLyogQ2hhaW4gY29udmVyc2lvbnMgZ2l2ZW4gdGhlIHJlcXVlc3QgYW5kIHRoZSBvcmlnaW5hbCByZXNwb25zZVxuICogQWxzbyBzZXRzIHRoZSByZXNwb25zZVhYWCBmaWVsZHMgb24gdGhlIGpxWEhSIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGFqYXhDb252ZXJ0KCBzLCByZXNwb25zZSwganFYSFIsIGlzU3VjY2VzcyApIHtcblx0dmFyIGNvbnYyLCBjdXJyZW50LCBjb252LCB0bXAsIHByZXYsXG5cdFx0Y29udmVydGVycyA9IHt9LFxuXG5cdFx0Ly8gV29yayB3aXRoIGEgY29weSBvZiBkYXRhVHlwZXMgaW4gY2FzZSB3ZSBuZWVkIHRvIG1vZGlmeSBpdCBmb3IgY29udmVyc2lvblxuXHRcdGRhdGFUeXBlcyA9IHMuZGF0YVR5cGVzLnNsaWNlKCk7XG5cblx0Ly8gQ3JlYXRlIGNvbnZlcnRlcnMgbWFwIHdpdGggbG93ZXJjYXNlZCBrZXlzXG5cdGlmICggZGF0YVR5cGVzWyAxIF0gKSB7XG5cdFx0Zm9yICggY29udiBpbiBzLmNvbnZlcnRlcnMgKSB7XG5cdFx0XHRjb252ZXJ0ZXJzWyBjb252LnRvTG93ZXJDYXNlKCkgXSA9IHMuY29udmVydGVyc1sgY29udiBdO1xuXHRcdH1cblx0fVxuXG5cdGN1cnJlbnQgPSBkYXRhVHlwZXMuc2hpZnQoKTtcblxuXHQvLyBDb252ZXJ0IHRvIGVhY2ggc2VxdWVudGlhbCBkYXRhVHlwZVxuXHR3aGlsZSAoIGN1cnJlbnQgKSB7XG5cblx0XHRpZiAoIHMucmVzcG9uc2VGaWVsZHNbIGN1cnJlbnQgXSApIHtcblx0XHRcdGpxWEhSWyBzLnJlc3BvbnNlRmllbGRzWyBjdXJyZW50IF0gXSA9IHJlc3BvbnNlO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHRoZSBkYXRhRmlsdGVyIGlmIHByb3ZpZGVkXG5cdFx0aWYgKCAhcHJldiAmJiBpc1N1Y2Nlc3MgJiYgcy5kYXRhRmlsdGVyICkge1xuXHRcdFx0cmVzcG9uc2UgPSBzLmRhdGFGaWx0ZXIoIHJlc3BvbnNlLCBzLmRhdGFUeXBlICk7XG5cdFx0fVxuXG5cdFx0cHJldiA9IGN1cnJlbnQ7XG5cdFx0Y3VycmVudCA9IGRhdGFUeXBlcy5zaGlmdCgpO1xuXG5cdFx0aWYgKCBjdXJyZW50ICkge1xuXG5cdFx0Ly8gVGhlcmUncyBvbmx5IHdvcmsgdG8gZG8gaWYgY3VycmVudCBkYXRhVHlwZSBpcyBub24tYXV0b1xuXHRcdFx0aWYgKCBjdXJyZW50ID09PSBcIipcIiApIHtcblxuXHRcdFx0XHRjdXJyZW50ID0gcHJldjtcblxuXHRcdFx0Ly8gQ29udmVydCByZXNwb25zZSBpZiBwcmV2IGRhdGFUeXBlIGlzIG5vbi1hdXRvIGFuZCBkaWZmZXJzIGZyb20gY3VycmVudFxuXHRcdFx0fSBlbHNlIGlmICggcHJldiAhPT0gXCIqXCIgJiYgcHJldiAhPT0gY3VycmVudCApIHtcblxuXHRcdFx0XHQvLyBTZWVrIGEgZGlyZWN0IGNvbnZlcnRlclxuXHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgcHJldiArIFwiIFwiICsgY3VycmVudCBdIHx8IGNvbnZlcnRlcnNbIFwiKiBcIiArIGN1cnJlbnQgXTtcblxuXHRcdFx0XHQvLyBJZiBub25lIGZvdW5kLCBzZWVrIGEgcGFpclxuXHRcdFx0XHRpZiAoICFjb252ICkge1xuXHRcdFx0XHRcdGZvciAoIGNvbnYyIGluIGNvbnZlcnRlcnMgKSB7XG5cblx0XHRcdFx0XHRcdC8vIElmIGNvbnYyIG91dHB1dHMgY3VycmVudFxuXHRcdFx0XHRcdFx0dG1wID0gY29udjIuc3BsaXQoIFwiIFwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIHRtcFsgMSBdID09PSBjdXJyZW50ICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIElmIHByZXYgY2FuIGJlIGNvbnZlcnRlZCB0byBhY2NlcHRlZCBpbnB1dFxuXHRcdFx0XHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgcHJldiArIFwiIFwiICsgdG1wWyAwIF0gXSB8fFxuXHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlcnNbIFwiKiBcIiArIHRtcFsgMCBdIF07XG5cdFx0XHRcdFx0XHRcdGlmICggY29udiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIENvbmRlbnNlIGVxdWl2YWxlbmNlIGNvbnZlcnRlcnNcblx0XHRcdFx0XHRcdFx0XHRpZiAoIGNvbnYgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb252ID0gY29udmVydGVyc1sgY29udjIgXTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgaW5zZXJ0IHRoZSBpbnRlcm1lZGlhdGUgZGF0YVR5cGVcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBjb252ZXJ0ZXJzWyBjb252MiBdICE9PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y3VycmVudCA9IHRtcFsgMCBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YVR5cGVzLnVuc2hpZnQoIHRtcFsgMSBdICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQXBwbHkgY29udmVydGVyIChpZiBub3QgYW4gZXF1aXZhbGVuY2UpXG5cdFx0XHRcdGlmICggY29udiAhPT0gdHJ1ZSApIHtcblxuXHRcdFx0XHRcdC8vIFVubGVzcyBlcnJvcnMgYXJlIGFsbG93ZWQgdG8gYnViYmxlLCBjYXRjaCBhbmQgcmV0dXJuIHRoZW1cblx0XHRcdFx0XHRpZiAoIGNvbnYgJiYgcy50aHJvd3MgKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IGNvbnYoIHJlc3BvbnNlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gY29udiggcmVzcG9uc2UgKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlOiBcInBhcnNlcmVycm9yXCIsXG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGNvbnYgPyBlIDogXCJObyBjb252ZXJzaW9uIGZyb20gXCIgKyBwcmV2ICsgXCIgdG8gXCIgKyBjdXJyZW50XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgc3RhdGU6IFwic3VjY2Vzc1wiLCBkYXRhOiByZXNwb25zZSB9O1xufVxuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gQ291bnRlciBmb3IgaG9sZGluZyB0aGUgbnVtYmVyIG9mIGFjdGl2ZSBxdWVyaWVzXG5cdGFjdGl2ZTogMCxcblxuXHQvLyBMYXN0LU1vZGlmaWVkIGhlYWRlciBjYWNoZSBmb3IgbmV4dCByZXF1ZXN0XG5cdGxhc3RNb2RpZmllZDoge30sXG5cdGV0YWc6IHt9LFxuXG5cdGFqYXhTZXR0aW5nczoge1xuXHRcdHVybDogbG9jYXRpb24uaHJlZixcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdGlzTG9jYWw6IHJsb2NhbFByb3RvY29sLnRlc3QoIGxvY2F0aW9uLnByb3RvY29sICksXG5cdFx0Z2xvYmFsOiB0cnVlLFxuXHRcdHByb2Nlc3NEYXRhOiB0cnVlLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLFxuXHRcdC8qXG5cdFx0dGltZW91dDogMCxcblx0XHRkYXRhOiBudWxsLFxuXHRcdGRhdGFUeXBlOiBudWxsLFxuXHRcdHVzZXJuYW1lOiBudWxsLFxuXHRcdHBhc3N3b3JkOiBudWxsLFxuXHRcdGNhY2hlOiBudWxsLFxuXHRcdHRocm93czogZmFsc2UsXG5cdFx0dHJhZGl0aW9uYWw6IGZhbHNlLFxuXHRcdGhlYWRlcnM6IHt9LFxuXHRcdCovXG5cblx0XHRhY2NlcHRzOiB7XG5cdFx0XHRcIipcIjogYWxsVHlwZXMsXG5cdFx0XHR0ZXh0OiBcInRleHQvcGxhaW5cIixcblx0XHRcdGh0bWw6IFwidGV4dC9odG1sXCIsXG5cdFx0XHR4bWw6IFwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLFxuXHRcdFx0anNvbjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIlxuXHRcdH0sXG5cblx0XHRjb250ZW50czoge1xuXHRcdFx0eG1sOiAvXFxieG1sXFxiLyxcblx0XHRcdGh0bWw6IC9cXGJodG1sLyxcblx0XHRcdGpzb246IC9cXGJqc29uXFxiL1xuXHRcdH0sXG5cblx0XHRyZXNwb25zZUZpZWxkczoge1xuXHRcdFx0eG1sOiBcInJlc3BvbnNlWE1MXCIsXG5cdFx0XHR0ZXh0OiBcInJlc3BvbnNlVGV4dFwiLFxuXHRcdFx0anNvbjogXCJyZXNwb25zZUpTT05cIlxuXHRcdH0sXG5cblx0XHQvLyBEYXRhIGNvbnZlcnRlcnNcblx0XHQvLyBLZXlzIHNlcGFyYXRlIHNvdXJjZSAob3IgY2F0Y2hhbGwgXCIqXCIpIGFuZCBkZXN0aW5hdGlvbiB0eXBlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG5cdFx0Y29udmVydGVyczoge1xuXG5cdFx0XHQvLyBDb252ZXJ0IGFueXRoaW5nIHRvIHRleHRcblx0XHRcdFwiKiB0ZXh0XCI6IFN0cmluZyxcblxuXHRcdFx0Ly8gVGV4dCB0byBodG1sICh0cnVlID0gbm8gdHJhbnNmb3JtYXRpb24pXG5cdFx0XHRcInRleHQgaHRtbFwiOiB0cnVlLFxuXG5cdFx0XHQvLyBFdmFsdWF0ZSB0ZXh0IGFzIGEganNvbiBleHByZXNzaW9uXG5cdFx0XHRcInRleHQganNvblwiOiBqUXVlcnkucGFyc2VKU09OLFxuXG5cdFx0XHQvLyBQYXJzZSB0ZXh0IGFzIHhtbFxuXHRcdFx0XCJ0ZXh0IHhtbFwiOiBqUXVlcnkucGFyc2VYTUxcblx0XHR9LFxuXG5cdFx0Ly8gRm9yIG9wdGlvbnMgdGhhdCBzaG91bGRuJ3QgYmUgZGVlcCBleHRlbmRlZDpcblx0XHQvLyB5b3UgY2FuIGFkZCB5b3VyIG93biBjdXN0b20gb3B0aW9ucyBoZXJlIGlmXG5cdFx0Ly8gYW5kIHdoZW4geW91IGNyZWF0ZSBvbmUgdGhhdCBzaG91bGRuJ3QgYmVcblx0XHQvLyBkZWVwIGV4dGVuZGVkIChzZWUgYWpheEV4dGVuZClcblx0XHRmbGF0T3B0aW9uczoge1xuXHRcdFx0dXJsOiB0cnVlLFxuXHRcdFx0Y29udGV4dDogdHJ1ZVxuXHRcdH1cblx0fSxcblxuXHQvLyBDcmVhdGVzIGEgZnVsbCBmbGVkZ2VkIHNldHRpbmdzIG9iamVjdCBpbnRvIHRhcmdldFxuXHQvLyB3aXRoIGJvdGggYWpheFNldHRpbmdzIGFuZCBzZXR0aW5ncyBmaWVsZHMuXG5cdC8vIElmIHRhcmdldCBpcyBvbWl0dGVkLCB3cml0ZXMgaW50byBhamF4U2V0dGluZ3MuXG5cdGFqYXhTZXR1cDogZnVuY3Rpb24oIHRhcmdldCwgc2V0dGluZ3MgKSB7XG5cdFx0cmV0dXJuIHNldHRpbmdzID9cblxuXHRcdFx0Ly8gQnVpbGRpbmcgYSBzZXR0aW5ncyBvYmplY3Rcblx0XHRcdGFqYXhFeHRlbmQoIGFqYXhFeHRlbmQoIHRhcmdldCwgalF1ZXJ5LmFqYXhTZXR0aW5ncyApLCBzZXR0aW5ncyApIDpcblxuXHRcdFx0Ly8gRXh0ZW5kaW5nIGFqYXhTZXR0aW5nc1xuXHRcdFx0YWpheEV4dGVuZCggalF1ZXJ5LmFqYXhTZXR0aW5ncywgdGFyZ2V0ICk7XG5cdH0sXG5cblx0YWpheFByZWZpbHRlcjogYWRkVG9QcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBwcmVmaWx0ZXJzICksXG5cdGFqYXhUcmFuc3BvcnQ6IGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cyApLFxuXG5cdC8vIE1haW4gbWV0aG9kXG5cdGFqYXg6IGZ1bmN0aW9uKCB1cmwsIG9wdGlvbnMgKSB7XG5cblx0XHQvLyBJZiB1cmwgaXMgYW4gb2JqZWN0LCBzaW11bGF0ZSBwcmUtMS41IHNpZ25hdHVyZVxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdG9wdGlvbnMgPSB1cmw7XG5cdFx0XHR1cmwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yY2Ugb3B0aW9ucyB0byBiZSBhbiBvYmplY3Rcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHZhciB0cmFuc3BvcnQsXG5cblx0XHRcdC8vIFVSTCB3aXRob3V0IGFudGktY2FjaGUgcGFyYW1cblx0XHRcdGNhY2hlVVJMLFxuXG5cdFx0XHQvLyBSZXNwb25zZSBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZUhlYWRlcnNTdHJpbmcsXG5cdFx0XHRyZXNwb25zZUhlYWRlcnMsXG5cblx0XHRcdC8vIHRpbWVvdXQgaGFuZGxlXG5cdFx0XHR0aW1lb3V0VGltZXIsXG5cblx0XHRcdC8vIFVybCBjbGVhbnVwIHZhclxuXHRcdFx0dXJsQW5jaG9yLFxuXG5cdFx0XHQvLyBUbyBrbm93IGlmIGdsb2JhbCBldmVudHMgYXJlIHRvIGJlIGRpc3BhdGNoZWRcblx0XHRcdGZpcmVHbG9iYWxzLFxuXG5cdFx0XHQvLyBMb29wIHZhcmlhYmxlXG5cdFx0XHRpLFxuXG5cdFx0XHQvLyBDcmVhdGUgdGhlIGZpbmFsIG9wdGlvbnMgb2JqZWN0XG5cdFx0XHRzID0galF1ZXJ5LmFqYXhTZXR1cCgge30sIG9wdGlvbnMgKSxcblxuXHRcdFx0Ly8gQ2FsbGJhY2tzIGNvbnRleHRcblx0XHRcdGNhbGxiYWNrQ29udGV4dCA9IHMuY29udGV4dCB8fCBzLFxuXG5cdFx0XHQvLyBDb250ZXh0IGZvciBnbG9iYWwgZXZlbnRzIGlzIGNhbGxiYWNrQ29udGV4dCBpZiBpdCBpcyBhIERPTSBub2RlIG9yIGpRdWVyeSBjb2xsZWN0aW9uXG5cdFx0XHRnbG9iYWxFdmVudENvbnRleHQgPSBzLmNvbnRleHQgJiZcblx0XHRcdFx0KCBjYWxsYmFja0NvbnRleHQubm9kZVR5cGUgfHwgY2FsbGJhY2tDb250ZXh0LmpxdWVyeSApID9cblx0XHRcdFx0XHRqUXVlcnkoIGNhbGxiYWNrQ29udGV4dCApIDpcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQsXG5cblx0XHRcdC8vIERlZmVycmVkc1xuXHRcdFx0ZGVmZXJyZWQgPSBqUXVlcnkuRGVmZXJyZWQoKSxcblx0XHRcdGNvbXBsZXRlRGVmZXJyZWQgPSBqUXVlcnkuQ2FsbGJhY2tzKCBcIm9uY2UgbWVtb3J5XCIgKSxcblxuXHRcdFx0Ly8gU3RhdHVzLWRlcGVuZGVudCBjYWxsYmFja3Ncblx0XHRcdHN0YXR1c0NvZGUgPSBzLnN0YXR1c0NvZGUgfHwge30sXG5cblx0XHRcdC8vIEhlYWRlcnMgKHRoZXkgYXJlIHNlbnQgYWxsIGF0IG9uY2UpXG5cdFx0XHRyZXF1ZXN0SGVhZGVycyA9IHt9LFxuXHRcdFx0cmVxdWVzdEhlYWRlcnNOYW1lcyA9IHt9LFxuXG5cdFx0XHQvLyBUaGUganFYSFIgc3RhdGVcblx0XHRcdHN0YXRlID0gMCxcblxuXHRcdFx0Ly8gRGVmYXVsdCBhYm9ydCBtZXNzYWdlXG5cdFx0XHRzdHJBYm9ydCA9IFwiY2FuY2VsZWRcIixcblxuXHRcdFx0Ly8gRmFrZSB4aHJcblx0XHRcdGpxWEhSID0ge1xuXHRcdFx0XHRyZWFkeVN0YXRlOiAwLFxuXG5cdFx0XHRcdC8vIEJ1aWxkcyBoZWFkZXJzIGhhc2h0YWJsZSBpZiBuZWVkZWRcblx0XHRcdFx0Z2V0UmVzcG9uc2VIZWFkZXI6IGZ1bmN0aW9uKCBrZXkgKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoO1xuXHRcdFx0XHRcdGlmICggc3RhdGUgPT09IDIgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICFyZXNwb25zZUhlYWRlcnMgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlSGVhZGVycyA9IHt9O1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbWF0Y2ggPSByaGVhZGVycy5leGVjKCByZXNwb25zZUhlYWRlcnNTdHJpbmcgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlSGVhZGVyc1sgbWF0Y2hbIDEgXS50b0xvd2VyQ2FzZSgpIF0gPSBtYXRjaFsgMiBdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtYXRjaCA9IHJlc3BvbnNlSGVhZGVyc1sga2V5LnRvTG93ZXJDYXNlKCkgXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoID09IG51bGwgPyBudWxsIDogbWF0Y2g7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gUmF3IHN0cmluZ1xuXHRcdFx0XHRnZXRBbGxSZXNwb25zZUhlYWRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZSA9PT0gMiA/IHJlc3BvbnNlSGVhZGVyc1N0cmluZyA6IG51bGw7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQ2FjaGVzIHRoZSBoZWFkZXJcblx0XHRcdFx0c2V0UmVxdWVzdEhlYWRlcjogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdFx0XHRcdHZhciBsbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRpZiAoICFzdGF0ZSApIHtcblx0XHRcdFx0XHRcdG5hbWUgPSByZXF1ZXN0SGVhZGVyc05hbWVzWyBsbmFtZSBdID0gcmVxdWVzdEhlYWRlcnNOYW1lc1sgbG5hbWUgXSB8fCBuYW1lO1xuXHRcdFx0XHRcdFx0cmVxdWVzdEhlYWRlcnNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBPdmVycmlkZXMgcmVzcG9uc2UgY29udGVudC10eXBlIGhlYWRlclxuXHRcdFx0XHRvdmVycmlkZU1pbWVUeXBlOiBmdW5jdGlvbiggdHlwZSApIHtcblx0XHRcdFx0XHRpZiAoICFzdGF0ZSApIHtcblx0XHRcdFx0XHRcdHMubWltZVR5cGUgPSB0eXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvLyBTdGF0dXMtZGVwZW5kZW50IGNhbGxiYWNrc1xuXHRcdFx0XHRzdGF0dXNDb2RlOiBmdW5jdGlvbiggbWFwICkge1xuXHRcdFx0XHRcdHZhciBjb2RlO1xuXHRcdFx0XHRcdGlmICggbWFwICkge1xuXHRcdFx0XHRcdFx0aWYgKCBzdGF0ZSA8IDIgKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoIGNvZGUgaW4gbWFwICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gTGF6eS1hZGQgdGhlIG5ldyBjYWxsYmFjayBpbiBhIHdheSB0aGF0IHByZXNlcnZlcyBvbGQgb25lc1xuXHRcdFx0XHRcdFx0XHRcdHN0YXR1c0NvZGVbIGNvZGUgXSA9IFsgc3RhdHVzQ29kZVsgY29kZSBdLCBtYXBbIGNvZGUgXSBdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGFwcHJvcHJpYXRlIGNhbGxiYWNrc1xuXHRcdFx0XHRcdFx0XHRqcVhIUi5hbHdheXMoIG1hcFsganFYSFIuc3RhdHVzIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQ2FuY2VsIHRoZSByZXF1ZXN0XG5cdFx0XHRcdGFib3J0OiBmdW5jdGlvbiggc3RhdHVzVGV4dCApIHtcblx0XHRcdFx0XHR2YXIgZmluYWxUZXh0ID0gc3RhdHVzVGV4dCB8fCBzdHJBYm9ydDtcblx0XHRcdFx0XHRpZiAoIHRyYW5zcG9ydCApIHtcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5hYm9ydCggZmluYWxUZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRvbmUoIDAsIGZpbmFsVGV4dCApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Ly8gQXR0YWNoIGRlZmVycmVkc1xuXHRcdGRlZmVycmVkLnByb21pc2UoIGpxWEhSICkuY29tcGxldGUgPSBjb21wbGV0ZURlZmVycmVkLmFkZDtcblx0XHRqcVhIUi5zdWNjZXNzID0ganFYSFIuZG9uZTtcblx0XHRqcVhIUi5lcnJvciA9IGpxWEhSLmZhaWw7XG5cblx0XHQvLyBSZW1vdmUgaGFzaCBjaGFyYWN0ZXIgKCM3NTMxOiBhbmQgc3RyaW5nIHByb21vdGlvbilcblx0XHQvLyBBZGQgcHJvdG9jb2wgaWYgbm90IHByb3ZpZGVkIChwcmVmaWx0ZXJzIG1pZ2h0IGV4cGVjdCBpdClcblx0XHQvLyBIYW5kbGUgZmFsc3kgdXJsIGluIHRoZSBzZXR0aW5ncyBvYmplY3QgKCMxMDA5MzogY29uc2lzdGVuY3kgd2l0aCBvbGQgc2lnbmF0dXJlKVxuXHRcdC8vIFdlIGFsc28gdXNlIHRoZSB1cmwgcGFyYW1ldGVyIGlmIGF2YWlsYWJsZVxuXHRcdHMudXJsID0gKCAoIHVybCB8fCBzLnVybCB8fCBsb2NhdGlvbi5ocmVmICkgKyBcIlwiICkucmVwbGFjZSggcmhhc2gsIFwiXCIgKVxuXHRcdFx0LnJlcGxhY2UoIHJwcm90b2NvbCwgbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKTtcblxuXHRcdC8vIEFsaWFzIG1ldGhvZCBvcHRpb24gdG8gdHlwZSBhcyBwZXIgdGlja2V0ICMxMjAwNFxuXHRcdHMudHlwZSA9IG9wdGlvbnMubWV0aG9kIHx8IG9wdGlvbnMudHlwZSB8fCBzLm1ldGhvZCB8fCBzLnR5cGU7XG5cblx0XHQvLyBFeHRyYWN0IGRhdGFUeXBlcyBsaXN0XG5cdFx0cy5kYXRhVHlwZXMgPSBqUXVlcnkudHJpbSggcy5kYXRhVHlwZSB8fCBcIipcIiApLnRvTG93ZXJDYXNlKCkubWF0Y2goIHJub3R3aGl0ZSApIHx8IFsgXCJcIiBdO1xuXG5cdFx0Ly8gQSBjcm9zcy1kb21haW4gcmVxdWVzdCBpcyBpbiBvcmRlciB3aGVuIHRoZSBvcmlnaW4gZG9lc24ndCBtYXRjaCB0aGUgY3VycmVudCBvcmlnaW4uXG5cdFx0aWYgKCBzLmNyb3NzRG9tYWluID09IG51bGwgKSB7XG5cdFx0XHR1cmxBbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTgtMTErXG5cdFx0XHQvLyBJRSB0aHJvd3MgZXhjZXB0aW9uIGlmIHVybCBpcyBtYWxmb3JtZWQsIGUuZy4gaHR0cDovL2V4YW1wbGUuY29tOjgweC9cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHVybEFuY2hvci5ocmVmID0gcy51cmw7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUU4LTExK1xuXHRcdFx0XHQvLyBBbmNob3IncyBob3N0IHByb3BlcnR5IGlzbid0IGNvcnJlY3RseSBzZXQgd2hlbiBzLnVybCBpcyByZWxhdGl2ZVxuXHRcdFx0XHR1cmxBbmNob3IuaHJlZiA9IHVybEFuY2hvci5ocmVmO1xuXHRcdFx0XHRzLmNyb3NzRG9tYWluID0gb3JpZ2luQW5jaG9yLnByb3RvY29sICsgXCIvL1wiICsgb3JpZ2luQW5jaG9yLmhvc3QgIT09XG5cdFx0XHRcdFx0dXJsQW5jaG9yLnByb3RvY29sICsgXCIvL1wiICsgdXJsQW5jaG9yLmhvc3Q7XG5cdFx0XHR9IGNhdGNoICggZSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciBwYXJzaW5nIHRoZSBVUkwsIGFzc3VtZSBpdCBpcyBjcm9zc0RvbWFpbixcblx0XHRcdFx0Ly8gaXQgY2FuIGJlIHJlamVjdGVkIGJ5IHRoZSB0cmFuc3BvcnQgaWYgaXQgaXMgaW52YWxpZFxuXHRcdFx0XHRzLmNyb3NzRG9tYWluID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IGRhdGEgaWYgbm90IGFscmVhZHkgYSBzdHJpbmdcblx0XHRpZiAoIHMuZGF0YSAmJiBzLnByb2Nlc3NEYXRhICYmIHR5cGVvZiBzLmRhdGEgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRzLmRhdGEgPSBqUXVlcnkucGFyYW0oIHMuZGF0YSwgcy50cmFkaXRpb25hbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHByZWZpbHRlcnNcblx0XHRpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggcHJlZmlsdGVycywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIHJlcXVlc3Qgd2FzIGFib3J0ZWQgaW5zaWRlIGEgcHJlZmlsdGVyLCBzdG9wIHRoZXJlXG5cdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdHJldHVybiBqcVhIUjtcblx0XHR9XG5cblx0XHQvLyBXZSBjYW4gZmlyZSBnbG9iYWwgZXZlbnRzIGFzIG9mIG5vdyBpZiBhc2tlZCB0b1xuXHRcdC8vIERvbid0IGZpcmUgZXZlbnRzIGlmIGpRdWVyeS5ldmVudCBpcyB1bmRlZmluZWQgaW4gYW4gQU1ELXVzYWdlIHNjZW5hcmlvICgjMTUxMTgpXG5cdFx0ZmlyZUdsb2JhbHMgPSBqUXVlcnkuZXZlbnQgJiYgcy5nbG9iYWw7XG5cblx0XHQvLyBXYXRjaCBmb3IgYSBuZXcgc2V0IG9mIHJlcXVlc3RzXG5cdFx0aWYgKCBmaXJlR2xvYmFscyAmJiBqUXVlcnkuYWN0aXZlKysgPT09IDAgKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggXCJhamF4U3RhcnRcIiApO1xuXHRcdH1cblxuXHRcdC8vIFVwcGVyY2FzZSB0aGUgdHlwZVxuXHRcdHMudHlwZSA9IHMudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHJlcXVlc3QgaGFzIGNvbnRlbnRcblx0XHRzLmhhc0NvbnRlbnQgPSAhcm5vQ29udGVudC50ZXN0KCBzLnR5cGUgKTtcblxuXHRcdC8vIFNhdmUgdGhlIFVSTCBpbiBjYXNlIHdlJ3JlIHRveWluZyB3aXRoIHRoZSBJZi1Nb2RpZmllZC1TaW5jZVxuXHRcdC8vIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciBsYXRlciBvblxuXHRcdGNhY2hlVVJMID0gcy51cmw7XG5cblx0XHQvLyBNb3JlIG9wdGlvbnMgaGFuZGxpbmcgZm9yIHJlcXVlc3RzIHdpdGggbm8gY29udGVudFxuXHRcdGlmICggIXMuaGFzQ29udGVudCApIHtcblxuXHRcdFx0Ly8gSWYgZGF0YSBpcyBhdmFpbGFibGUsIGFwcGVuZCBkYXRhIHRvIHVybFxuXHRcdFx0aWYgKCBzLmRhdGEgKSB7XG5cdFx0XHRcdGNhY2hlVVJMID0gKCBzLnVybCArPSAoIHJxdWVyeS50ZXN0KCBjYWNoZVVSTCApID8gXCImXCIgOiBcIj9cIiApICsgcy5kYXRhICk7XG5cblx0XHRcdFx0Ly8gIzk2ODI6IHJlbW92ZSBkYXRhIHNvIHRoYXQgaXQncyBub3QgdXNlZCBpbiBhbiBldmVudHVhbCByZXRyeVxuXHRcdFx0XHRkZWxldGUgcy5kYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgYW50aS1jYWNoZSBpbiB1cmwgaWYgbmVlZGVkXG5cdFx0XHRpZiAoIHMuY2FjaGUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRzLnVybCA9IHJ0cy50ZXN0KCBjYWNoZVVSTCApID9cblxuXHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSAnXycgcGFyYW1ldGVyLCBzZXQgaXRzIHZhbHVlXG5cdFx0XHRcdFx0Y2FjaGVVUkwucmVwbGFjZSggcnRzLCBcIiQxXz1cIiArIG5vbmNlKysgKSA6XG5cblx0XHRcdFx0XHQvLyBPdGhlcndpc2UgYWRkIG9uZSB0byB0aGUgZW5kXG5cdFx0XHRcdFx0Y2FjaGVVUkwgKyAoIHJxdWVyeS50ZXN0KCBjYWNoZVVSTCApID8gXCImXCIgOiBcIj9cIiApICsgXCJfPVwiICsgbm9uY2UrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciwgaWYgaW4gaWZNb2RpZmllZCBtb2RlLlxuXHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0aWYgKCBqUXVlcnkubGFzdE1vZGlmaWVkWyBjYWNoZVVSTCBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU1vZGlmaWVkLVNpbmNlXCIsIGpRdWVyeS5sYXN0TW9kaWZpZWRbIGNhY2hlVVJMIF0gKTtcblx0XHRcdH1cblx0XHRcdGlmICggalF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gKSB7XG5cdFx0XHRcdGpxWEhSLnNldFJlcXVlc3RIZWFkZXIoIFwiSWYtTm9uZS1NYXRjaFwiLCBqUXVlcnkuZXRhZ1sgY2FjaGVVUkwgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgY29ycmVjdCBoZWFkZXIsIGlmIGRhdGEgaXMgYmVpbmcgc2VudFxuXHRcdGlmICggcy5kYXRhICYmIHMuaGFzQ29udGVudCAmJiBzLmNvbnRlbnRUeXBlICE9PSBmYWxzZSB8fCBvcHRpb25zLmNvbnRlbnRUeXBlICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgcy5jb250ZW50VHlwZSApO1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgQWNjZXB0cyBoZWFkZXIgZm9yIHRoZSBzZXJ2ZXIsIGRlcGVuZGluZyBvbiB0aGUgZGF0YVR5cGVcblx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKFxuXHRcdFx0XCJBY2NlcHRcIixcblx0XHRcdHMuZGF0YVR5cGVzWyAwIF0gJiYgcy5hY2NlcHRzWyBzLmRhdGFUeXBlc1sgMCBdIF0gP1xuXHRcdFx0XHRzLmFjY2VwdHNbIHMuZGF0YVR5cGVzWyAwIF0gXSArXG5cdFx0XHRcdFx0KCBzLmRhdGFUeXBlc1sgMCBdICE9PSBcIipcIiA/IFwiLCBcIiArIGFsbFR5cGVzICsgXCI7IHE9MC4wMVwiIDogXCJcIiApIDpcblx0XHRcdFx0cy5hY2NlcHRzWyBcIipcIiBdXG5cdFx0KTtcblxuXHRcdC8vIENoZWNrIGZvciBoZWFkZXJzIG9wdGlvblxuXHRcdGZvciAoIGkgaW4gcy5oZWFkZXJzICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggaSwgcy5oZWFkZXJzWyBpIF0gKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyBjdXN0b20gaGVhZGVycy9taW1ldHlwZXMgYW5kIGVhcmx5IGFib3J0XG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgJiZcblx0XHRcdCggcy5iZWZvcmVTZW5kLmNhbGwoIGNhbGxiYWNrQ29udGV4dCwganFYSFIsIHMgKSA9PT0gZmFsc2UgfHwgc3RhdGUgPT09IDIgKSApIHtcblxuXHRcdFx0Ly8gQWJvcnQgaWYgbm90IGRvbmUgYWxyZWFkeSBhbmQgcmV0dXJuXG5cdFx0XHRyZXR1cm4ganFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHQvLyBBYm9ydGluZyBpcyBubyBsb25nZXIgYSBjYW5jZWxsYXRpb25cblx0XHRzdHJBYm9ydCA9IFwiYWJvcnRcIjtcblxuXHRcdC8vIEluc3RhbGwgY2FsbGJhY2tzIG9uIGRlZmVycmVkc1xuXHRcdGZvciAoIGkgaW4geyBzdWNjZXNzOiAxLCBlcnJvcjogMSwgY29tcGxldGU6IDEgfSApIHtcblx0XHRcdGpxWEhSWyBpIF0oIHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0cmFuc3BvcnRcblx0XHR0cmFuc3BvcnQgPSBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIG5vIHRyYW5zcG9ydCwgd2UgYXV0by1hYm9ydFxuXHRcdGlmICggIXRyYW5zcG9ydCApIHtcblx0XHRcdGRvbmUoIC0xLCBcIk5vIFRyYW5zcG9ydFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSAxO1xuXG5cdFx0XHQvLyBTZW5kIGdsb2JhbCBldmVudFxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheFNlbmRcIiwgWyBqcVhIUiwgcyBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHJlcXVlc3Qgd2FzIGFib3J0ZWQgaW5zaWRlIGFqYXhTZW5kLCBzdG9wIHRoZXJlXG5cdFx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0XHRyZXR1cm4ganFYSFI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRpbWVvdXRcblx0XHRcdGlmICggcy5hc3luYyAmJiBzLnRpbWVvdXQgPiAwICkge1xuXHRcdFx0XHR0aW1lb3V0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0anFYSFIuYWJvcnQoIFwidGltZW91dFwiICk7XG5cdFx0XHRcdH0sIHMudGltZW91dCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRzdGF0ZSA9IDE7XG5cdFx0XHRcdHRyYW5zcG9ydC5zZW5kKCByZXF1ZXN0SGVhZGVycywgZG9uZSApO1xuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cblx0XHRcdFx0Ly8gUHJvcGFnYXRlIGV4Y2VwdGlvbiBhcyBlcnJvciBpZiBub3QgZG9uZVxuXHRcdFx0XHRpZiAoIHN0YXRlIDwgMiApIHtcblx0XHRcdFx0XHRkb25lKCAtMSwgZSApO1xuXG5cdFx0XHRcdC8vIFNpbXBseSByZXRocm93IG90aGVyd2lzZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWxsYmFjayBmb3Igd2hlbiBldmVyeXRoaW5nIGlzIGRvbmVcblx0XHRmdW5jdGlvbiBkb25lKCBzdGF0dXMsIG5hdGl2ZVN0YXR1c1RleHQsIHJlc3BvbnNlcywgaGVhZGVycyApIHtcblx0XHRcdHZhciBpc1N1Y2Nlc3MsIHN1Y2Nlc3MsIGVycm9yLCByZXNwb25zZSwgbW9kaWZpZWQsXG5cdFx0XHRcdHN0YXR1c1RleHQgPSBuYXRpdmVTdGF0dXNUZXh0O1xuXG5cdFx0XHQvLyBDYWxsZWQgb25jZVxuXHRcdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdGF0ZSBpcyBcImRvbmVcIiBub3dcblx0XHRcdHN0YXRlID0gMjtcblxuXHRcdFx0Ly8gQ2xlYXIgdGltZW91dCBpZiBpdCBleGlzdHNcblx0XHRcdGlmICggdGltZW91dFRpbWVyICkge1xuXHRcdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KCB0aW1lb3V0VGltZXIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRGVyZWZlcmVuY2UgdHJhbnNwb3J0IGZvciBlYXJseSBnYXJiYWdlIGNvbGxlY3Rpb25cblx0XHRcdC8vIChubyBtYXR0ZXIgaG93IGxvbmcgdGhlIGpxWEhSIG9iamVjdCB3aWxsIGJlIHVzZWQpXG5cdFx0XHR0cmFuc3BvcnQgPSB1bmRlZmluZWQ7XG5cblx0XHRcdC8vIENhY2hlIHJlc3BvbnNlIGhlYWRlcnNcblx0XHRcdHJlc3BvbnNlSGVhZGVyc1N0cmluZyA9IGhlYWRlcnMgfHwgXCJcIjtcblxuXHRcdFx0Ly8gU2V0IHJlYWR5U3RhdGVcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSBzdGF0dXMgPiAwID8gNCA6IDA7XG5cblx0XHRcdC8vIERldGVybWluZSBpZiBzdWNjZXNzZnVsXG5cdFx0XHRpc1N1Y2Nlc3MgPSBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcblxuXHRcdFx0Ly8gR2V0IHJlc3BvbnNlIGRhdGFcblx0XHRcdGlmICggcmVzcG9uc2VzICkge1xuXHRcdFx0XHRyZXNwb25zZSA9IGFqYXhIYW5kbGVSZXNwb25zZXMoIHMsIGpxWEhSLCByZXNwb25zZXMgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udmVydCBubyBtYXR0ZXIgd2hhdCAodGhhdCB3YXkgcmVzcG9uc2VYWFggZmllbGRzIGFyZSBhbHdheXMgc2V0KVxuXHRcdFx0cmVzcG9uc2UgPSBhamF4Q29udmVydCggcywgcmVzcG9uc2UsIGpxWEhSLCBpc1N1Y2Nlc3MgKTtcblxuXHRcdFx0Ly8gSWYgc3VjY2Vzc2Z1bCwgaGFuZGxlIHR5cGUgY2hhaW5pbmdcblx0XHRcdGlmICggaXNTdWNjZXNzICkge1xuXG5cdFx0XHRcdC8vIFNldCB0aGUgSWYtTW9kaWZpZWQtU2luY2UgYW5kL29yIElmLU5vbmUtTWF0Y2ggaGVhZGVyLCBpZiBpbiBpZk1vZGlmaWVkIG1vZGUuXG5cdFx0XHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0XHRcdG1vZGlmaWVkID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoIFwiTGFzdC1Nb2RpZmllZFwiICk7XG5cdFx0XHRcdFx0aWYgKCBtb2RpZmllZCApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5sYXN0TW9kaWZpZWRbIGNhY2hlVVJMIF0gPSBtb2RpZmllZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bW9kaWZpZWQgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlciggXCJldGFnXCIgKTtcblx0XHRcdFx0XHRpZiAoIG1vZGlmaWVkICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gPSBtb2RpZmllZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiBubyBjb250ZW50XG5cdFx0XHRcdGlmICggc3RhdHVzID09PSAyMDQgfHwgcy50eXBlID09PSBcIkhFQURcIiApIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gXCJub2NvbnRlbnRcIjtcblxuXHRcdFx0XHQvLyBpZiBub3QgbW9kaWZpZWRcblx0XHRcdFx0fSBlbHNlIGlmICggc3RhdHVzID09PSAzMDQgKSB7XG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IFwibm90bW9kaWZpZWRcIjtcblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGRhdGEsIGxldCdzIGNvbnZlcnQgaXRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gcmVzcG9uc2Uuc3RhdGU7XG5cdFx0XHRcdFx0c3VjY2VzcyA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdFx0ZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcblx0XHRcdFx0XHRpc1N1Y2Nlc3MgPSAhZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gRXh0cmFjdCBlcnJvciBmcm9tIHN0YXR1c1RleHQgYW5kIG5vcm1hbGl6ZSBmb3Igbm9uLWFib3J0c1xuXHRcdFx0XHRlcnJvciA9IHN0YXR1c1RleHQ7XG5cdFx0XHRcdGlmICggc3RhdHVzIHx8ICFzdGF0dXNUZXh0ICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcImVycm9yXCI7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPCAwICkge1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGRhdGEgZm9yIHRoZSBmYWtlIHhociBvYmplY3Rcblx0XHRcdGpxWEhSLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdGpxWEhSLnN0YXR1c1RleHQgPSAoIG5hdGl2ZVN0YXR1c1RleHQgfHwgc3RhdHVzVGV4dCApICsgXCJcIjtcblxuXHRcdFx0Ly8gU3VjY2Vzcy9FcnJvclxuXHRcdFx0aWYgKCBpc1N1Y2Nlc3MgKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjYWxsYmFja0NvbnRleHQsIFsgc3VjY2Vzcywgc3RhdHVzVGV4dCwganFYSFIgXSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0LCBlcnJvciBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRqcVhIUi5zdGF0dXNDb2RlKCBzdGF0dXNDb2RlICk7XG5cdFx0XHRzdGF0dXNDb2RlID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAoIGZpcmVHbG9iYWxzICkge1xuXHRcdFx0XHRnbG9iYWxFdmVudENvbnRleHQudHJpZ2dlciggaXNTdWNjZXNzID8gXCJhamF4U3VjY2Vzc1wiIDogXCJhamF4RXJyb3JcIixcblx0XHRcdFx0XHRbIGpxWEhSLCBzLCBpc1N1Y2Nlc3MgPyBzdWNjZXNzIDogZXJyb3IgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb21wbGV0ZVxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZC5maXJlV2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0IF0gKTtcblxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheENvbXBsZXRlXCIsIFsganFYSFIsIHMgXSApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgZ2xvYmFsIEFKQVggY291bnRlclxuXHRcdFx0XHRpZiAoICEoIC0talF1ZXJ5LmFjdGl2ZSApICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBcImFqYXhTdG9wXCIgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBqcVhIUjtcblx0fSxcblxuXHRnZXRKU09OOiBmdW5jdGlvbiggdXJsLCBkYXRhLCBjYWxsYmFjayApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdldCggdXJsLCBkYXRhLCBjYWxsYmFjaywgXCJqc29uXCIgKTtcblx0fSxcblxuXHRnZXRTY3JpcHQ6IGZ1bmN0aW9uKCB1cmwsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ2V0KCB1cmwsIHVuZGVmaW5lZCwgY2FsbGJhY2ssIFwic2NyaXB0XCIgKTtcblx0fVxufSApO1xuXG5qUXVlcnkuZWFjaCggWyBcImdldFwiLCBcInBvc3RcIiBdLCBmdW5jdGlvbiggaSwgbWV0aG9kICkge1xuXHRqUXVlcnlbIG1ldGhvZCBdID0gZnVuY3Rpb24oIHVybCwgZGF0YSwgY2FsbGJhY2ssIHR5cGUgKSB7XG5cblx0XHQvLyBTaGlmdCBhcmd1bWVudHMgaWYgZGF0YSBhcmd1bWVudCB3YXMgb21pdHRlZFxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGRhdGEgKSApIHtcblx0XHRcdHR5cGUgPSB0eXBlIHx8IGNhbGxiYWNrO1xuXHRcdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXHRcdFx0ZGF0YSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBUaGUgdXJsIGNhbiBiZSBhbiBvcHRpb25zIG9iamVjdCAod2hpY2ggdGhlbiBtdXN0IGhhdmUgLnVybClcblx0XHRyZXR1cm4galF1ZXJ5LmFqYXgoIGpRdWVyeS5leHRlbmQoIHtcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0dHlwZTogbWV0aG9kLFxuXHRcdFx0ZGF0YVR5cGU6IHR5cGUsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c3VjY2VzczogY2FsbGJhY2tcblx0XHR9LCBqUXVlcnkuaXNQbGFpbk9iamVjdCggdXJsICkgJiYgdXJsICkgKTtcblx0fTtcbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==