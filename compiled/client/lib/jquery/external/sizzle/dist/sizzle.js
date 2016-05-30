"use strict";

/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function (window) {

	var i,
	    support,
	    Expr,
	    getText,
	    isXML,
	    tokenize,
	    compile,
	    select,
	    outermostContext,
	    sortInput,
	    hasDuplicate,


	// Local document vars
	setDocument,
	    document,
	    docElem,
	    documentIsHTML,
	    rbuggyQSA,
	    rbuggyMatches,
	    matches,
	    contains,


	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	    preferredDoc = window.document,
	    dirruns = 0,
	    done = 0,
	    classCache = createCache(),
	    tokenCache = createCache(),
	    compilerCache = createCache(),
	    sortOrder = function sortOrder(a, b) {
		if (a === b) {
			hasDuplicate = true;
		}
		return 0;
	},


	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,


	// Instance methods
	hasOwn = {}.hasOwnProperty,
	    arr = [],
	    pop = arr.pop,
	    push_native = arr.push,
	    push = arr.push,
	    slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function indexOf(list, elem) {
		var i = 0,
		    len = list.length;
		for (; i < len; i++) {
			if (list[i] === elem) {
				return i;
			}
		}
		return -1;
	},
	    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",


	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",


	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
	// Operator (capture 2)
	"*([*^$|!~]?=)" + whitespace +
	// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
	    pseudos = ":(" + identifier + ")(?:\\((" +
	// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
	// 1. quoted (capture 3; capture 4 or capture 5)
	"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
	// 2. simple (capture 6)
	"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
	// 3. anything else (capture 2)
	".*" + ")\\)|)",


	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp(whitespace + "+", "g"),
	    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
	    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
	    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
	    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
	    rpseudo = new RegExp(pseudos),
	    ridentifier = new RegExp("^" + identifier + "$"),
	    matchExpr = {
		"ID": new RegExp("^#(" + identifier + ")"),
		"CLASS": new RegExp("^\\.(" + identifier + ")"),
		"TAG": new RegExp("^(" + identifier + "|[*])"),
		"ATTR": new RegExp("^" + attributes),
		"PSEUDO": new RegExp("^" + pseudos),
		"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
		"bool": new RegExp("^(?:" + booleans + ")$", "i"),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
	},
	    rinputs = /^(?:input|select|textarea|button)$/i,
	    rheader = /^h\d$/i,
	    rnative = /^[^{]+\{\s*\[native \w/,


	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	    rsibling = /[+~]/,
	    rescape = /'|\\/g,


	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
	    funescape = function funescape(_, escaped, escapedWhitespace) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ? escaped : high < 0 ?
		// BMP codepoint
		String.fromCharCode(high + 0x10000) :
		// Supplemental Plane codepoint (surrogate pair)
		String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
	},


	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function unloadHandler() {
		setDocument();
	};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[preferredDoc.childNodes.length].nodeType;
	} catch (e) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function (target, els) {
				push_native.apply(target, slice.call(els));
			} :

			// Support: IE<9
			// Otherwise append directly
			function (target, els) {
				var j = target.length,
				    i = 0;
				// Can't trust NodeList.length
				while (target[j++] = els[i++]) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle(selector, context, results, seed) {
		var m,
		    i,
		    elem,
		    nid,
		    nidselect,
		    match,
		    groups,
		    newSelector,
		    newContext = context && context.ownerDocument,


		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if (!seed) {

			if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
				setDocument(context);
			}
			context = context || document;

			if (documentIsHTML) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

					// ID selector
					if (m = match[1]) {

						// Document context
						if (nodeType === 9) {
							if (elem = context.getElementById(m)) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (elem.id === m) {
									results.push(elem);
									return results;
								}
							} else {
								return results;
							}

							// Element context
						} else {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

									results.push(elem);
									return results;
								}
							}

						// Type selector
					} else if (match[2]) {
							push.apply(results, context.getElementsByTagName(selector));
							return results;

							// Class selector
						} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

								push.apply(results, context.getElementsByClassName(m));
								return results;
							}
				}

				// Take advantage of querySelectorAll
				if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

					if (nodeType !== 1) {
						newContext = context;
						newSelector = selector;

						// qSA looks outside Element context, which is not what we want
						// Thanks to Andrew Dupont for this workaround technique
						// Support: IE <=8
						// Exclude object elements
					} else if (context.nodeName.toLowerCase() !== "object") {

							// Capture the context ID, setting it first if necessary
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rescape, "\\$&");
							} else {
								context.setAttribute("id", nid = expando);
							}

							// Prefix every selector in the list
							groups = tokenize(selector);
							i = groups.length;
							nidselect = ridentifier.test(nid) ? "#" + nid : "[id='" + nid + "']";
							while (i--) {
								groups[i] = nidselect + " " + toSelector(groups[i]);
							}
							newSelector = groups.join(",");

							// Expand context for sibling selectors
							newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
						}

					if (newSelector) {
						try {
							push.apply(results, newContext.querySelectorAll(newSelector));
							return results;
						} catch (qsaError) {} finally {
							if (nid === expando) {
								context.removeAttribute("id");
							}
						}
					}
				}
			}
		}

		// All others
		return select(selector.replace(rtrim, "$1"), context, results, seed);
	}

	/**
  * Create key-value caches of limited size
  * @returns {function(string, object)} Returns the Object data after storing it on itself with
  *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
  *	deleting the oldest entry
  */
	function createCache() {
		var keys = [];

		function cache(key, value) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if (keys.push(key + " ") > Expr.cacheLength) {
				// Only keep the most recent entries
				delete cache[keys.shift()];
			}
			return cache[key + " "] = value;
		}
		return cache;
	}

	/**
  * Mark a function for special use by Sizzle
  * @param {Function} fn The function to mark
  */
	function markFunction(fn) {
		fn[expando] = true;
		return fn;
	}

	/**
  * Support testing using an element
  * @param {Function} fn Passed the created div and expects a boolean result
  */
	function assert(fn) {
		var div = document.createElement("div");

		try {
			return !!fn(div);
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if (div.parentNode) {
				div.parentNode.removeChild(div);
			}
			// release memory in IE
			div = null;
		}
	}

	/**
  * Adds the same handler for all of the specified attrs
  * @param {String} attrs Pipe-separated list of attributes
  * @param {Function} handler The method that will be applied
  */
	function addHandle(attrs, handler) {
		var arr = attrs.split("|"),
		    i = arr.length;

		while (i--) {
			Expr.attrHandle[arr[i]] = handler;
		}
	}

	/**
  * Checks document order of two siblings
  * @param {Element} a
  * @param {Element} b
  * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
  */
	function siblingCheck(a, b) {
		var cur = b && a,
		    diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);

		// Use IE sourceIndex if available on both nodes
		if (diff) {
			return diff;
		}

		// Check if b follows a
		if (cur) {
			while (cur = cur.nextSibling) {
				if (cur === b) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
  * Returns a function to use in pseudos for input types
  * @param {String} type
  */
	function createInputPseudo(type) {
		return function (elem) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
  * Returns a function to use in pseudos for buttons
  * @param {String} type
  */
	function createButtonPseudo(type) {
		return function (elem) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
  * Returns a function to use in pseudos for positionals
  * @param {Function} fn
  */
	function createPositionalPseudo(fn) {
		return markFunction(function (argument) {
			argument = +argument;
			return markFunction(function (seed, matches) {
				var j,
				    matchIndexes = fn([], seed.length, argument),
				    i = matchIndexes.length;

				// Match elements found at the specified indexes
				while (i--) {
					if (seed[j = matchIndexes[i]]) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
  * Checks a node for validity as a Sizzle context
  * @param {Element|Object=} context
  * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
  */
	function testContext(context) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
  * Detects XML nodes
  * @param {Element|Object} elem An element or a document
  * @returns {Boolean} True iff elem is a non-HTML XML node
  */
	isXML = Sizzle.isXML = function (elem) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
  * Sets document-related variables once based on the current document
  * @param {Element|Object} [doc] An element or document object to use to set the document
  * @returns {Object} Returns the current document
  */
	setDocument = Sizzle.setDocument = function (node) {
		var hasCompare,
		    parent,
		    doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML(document);

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ((parent = document.defaultView) && parent.top !== parent) {
			// Support: IE 11
			if (parent.addEventListener) {
				parent.addEventListener("unload", unloadHandler, false);

				// Support: IE 9 - 10 only
			} else if (parent.attachEvent) {
					parent.attachEvent("onunload", unloadHandler);
				}
		}

		/* Attributes
  ---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function (div) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
  ---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function (div) {
			div.appendChild(document.createComment(""));
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test(document.getElementsByClassName);

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function (div) {
			docElem.appendChild(div).id = expando;
			return !document.getElementsByName || !document.getElementsByName(expando).length;
		});

		// ID find and filter
		if (support.getById) {
			Expr.find["ID"] = function (id, context) {
				if (typeof context.getElementById !== "undefined" && documentIsHTML) {
					var m = context.getElementById(id);
					return m ? [m] : [];
				}
			};
			Expr.filter["ID"] = function (id) {
				var attrId = id.replace(runescape, funescape);
				return function (elem) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] = function (id) {
				var attrId = id.replace(runescape, funescape);
				return function (elem) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
			if (typeof context.getElementsByTagName !== "undefined") {
				return context.getElementsByTagName(tag);

				// DocumentFragment nodes don't have gEBTN
			} else if (support.qsa) {
					return context.querySelectorAll(tag);
				}
		} : function (tag, context) {
			var elem,
			    tmp = [],
			    i = 0,

			// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
			results = context.getElementsByTagName(tag);

			// Filter out possible comments
			if (tag === "*") {
				while (elem = results[i++]) {
					if (elem.nodeType === 1) {
						tmp.push(elem);
					}
				}

				return tmp;
			}
			return results;
		};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
			if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
				return context.getElementsByClassName(className);
			}
		};

		/* QSA/matchesSelector
  ---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if (support.qsa = rnative.test(document.querySelectorAll)) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function (div) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if (div.querySelectorAll("[msallowcapture^='']").length) {
					rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if (!div.querySelectorAll("[selected]").length) {
					rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if (!div.querySelectorAll(":checked").length) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if (!div.querySelectorAll("a#" + expando + "+*").length) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function (div) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				div.appendChild(input).setAttribute("name", "D");

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if (div.querySelectorAll("[name=d]").length) {
					rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if (!div.querySelectorAll(":enabled").length) {
					rbuggyQSA.push(":enabled", ":disabled");
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

			assert(function (div) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call(div, "div");

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call(div, "[s!='']:x");
				rbuggyMatches.push("!=", pseudos);
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
		rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

		/* Contains
  ---------------------------------------------------------------------- */
		hasCompare = rnative.test(docElem.compareDocumentPosition);

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
			    bup = b && b.parentNode;
			return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
		} : function (a, b) {
			if (b) {
				while (b = b.parentNode) {
					if (b === a) {
						return true;
					}
				}
			}
			return false;
		};

		/* Sorting
  ---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ? function (a, b) {

			// Flag for duplicate removal
			if (a === b) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if (compare) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

			// Otherwise we know they are disconnected
			1;

			// Disconnected nodes
			if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

				// Choose the first element that is related to our preferred document
				if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
					return -1;
				}
				if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
					return 1;
				}

				// Maintain original order
				return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
			}

			return compare & 4 ? -1 : 1;
		} : function (a, b) {
			// Exit early if the nodes are identical
			if (a === b) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
			    i = 0,
			    aup = a.parentNode,
			    bup = b.parentNode,
			    ap = [a],
			    bp = [b];

			// Parentless nodes are either documents or disconnected
			if (!aup || !bup) {
				return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

				// If the nodes are siblings, we can do a quick check
			} else if (aup === bup) {
					return siblingCheck(a, b);
				}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while (cur = cur.parentNode) {
				ap.unshift(cur);
			}
			cur = b;
			while (cur = cur.parentNode) {
				bp.unshift(cur);
			}

			// Walk down the tree looking for a discrepancy
			while (ap[i] === bp[i]) {
				i++;
			}

			return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck(ap[i], bp[i]) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
		};

		return document;
	};

	Sizzle.matches = function (expr, elements) {
		return Sizzle(expr, null, null, elements);
	};

	Sizzle.matchesSelector = function (elem, expr) {
		// Set document vars if needed
		if ((elem.ownerDocument || elem) !== document) {
			setDocument(elem);
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace(rattributeQuotes, "='$1']");

		if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

			try {
				var ret = matches.call(elem, expr);

				// IE 9's matchesSelector returns false on disconnected nodes
				if (ret || support.disconnectedMatch ||
				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle(expr, document, null, [elem]).length > 0;
	};

	Sizzle.contains = function (context, elem) {
		// Set document vars if needed
		if ((context.ownerDocument || context) !== document) {
			setDocument(context);
		}
		return contains(context, elem);
	};

	Sizzle.attr = function (elem, name) {
		// Set document vars if needed
		if ((elem.ownerDocument || elem) !== document) {
			setDocument(elem);
		}

		var fn = Expr.attrHandle[name.toLowerCase()],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

		return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
	};

	Sizzle.error = function (msg) {
		throw new Error("Syntax error, unrecognized expression: " + msg);
	};

	/**
  * Document sorting and removing duplicates
  * @param {ArrayLike} results
  */
	Sizzle.uniqueSort = function (results) {
		var elem,
		    duplicates = [],
		    j = 0,
		    i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice(0);
		results.sort(sortOrder);

		if (hasDuplicate) {
			while (elem = results[i++]) {
				if (elem === results[i]) {
					j = duplicates.push(i);
				}
			}
			while (j--) {
				results.splice(duplicates[j], 1);
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
  * Utility function for retrieving the text value of an array of DOM nodes
  * @param {Array|Element} elem
  */
	getText = Sizzle.getText = function (elem) {
		var node,
		    ret = "",
		    i = 0,
		    nodeType = elem.nodeType;

		if (!nodeType) {
			// If no nodeType, this is expected to be an array
			while (node = elem[i++]) {
				// Do not traverse comment nodes
				ret += getText(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if (typeof elem.textContent === "string") {
				return elem.textContent;
			} else {
				// Traverse its children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText(elem);
				}
			}
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function ATTR(match) {
				match[1] = match[1].replace(runescape, funescape);

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

				if (match[2] === "~=") {
					match[3] = " " + match[3] + " ";
				}

				return match.slice(0, 4);
			},

			"CHILD": function CHILD(match) {
				/* matches from matchExpr["CHILD"]
    	1 type (only|nth|...)
    	2 what (child|of-type)
    	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    	4 xn-component of xn+y argument ([+-]?\d*n|)
    	5 sign of xn-component
    	6 x of xn-component
    	7 sign of y-component
    	8 y of y-component
    */
				match[1] = match[1].toLowerCase();

				if (match[1].slice(0, 3) === "nth") {
					// nth-* requires argument
					if (!match[3]) {
						Sizzle.error(match[0]);
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
					match[5] = +(match[7] + match[8] || match[3] === "odd");

					// other types prohibit arguments
				} else if (match[3]) {
						Sizzle.error(match[0]);
					}

				return match;
			},

			"PSEUDO": function PSEUDO(match) {
				var excess,
				    unquoted = !match[6] && match[2];

				if (matchExpr["CHILD"].test(match[0])) {
					return null;
				}

				// Accept quoted arguments as-is
				if (match[3]) {
					match[2] = match[4] || match[5] || "";

					// Strip excess characters from unquoted arguments
				} else if (unquoted && rpseudo.test(unquoted) && (
					// Get excess from tokenize (recursively)
					excess = tokenize(unquoted, true)) && (
					// advance to the next closing parenthesis
					excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

						// excess is a negative index
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice(0, 3);
			}
		},

		filter: {

			"TAG": function TAG(nodeNameSelector) {
				var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
				return nodeNameSelector === "*" ? function () {
					return true;
				} : function (elem) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
			},

			"CLASS": function CLASS(className) {
				var pattern = classCache[className + " "];

				return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
					return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
				});
			},

			"ATTR": function ATTR(name, operator, check) {
				return function (elem) {
					var result = Sizzle.attr(elem, name);

					if (result == null) {
						return operator === "!=";
					}
					if (!operator) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
				};
			},

			"CHILD": function CHILD(type, what, argument, first, last) {
				var simple = type.slice(0, 3) !== "nth",
				    forward = type.slice(-4) !== "last",
				    ofType = what === "of-type";

				return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function (elem) {
					return !!elem.parentNode;
				} : function (elem, context, xml) {
					var cache,
					    uniqueCache,
					    outerCache,
					    node,
					    nodeIndex,
					    start,
					    dir = simple !== forward ? "nextSibling" : "previousSibling",
					    parent = elem.parentNode,
					    name = ofType && elem.nodeName.toLowerCase(),
					    useCache = !xml && !ofType,
					    diff = false;

					if (parent) {

						// :(first|last|only)-(child|of-type)
						if (simple) {
							while (dir) {
								node = elem;
								while (node = node[dir]) {
									if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [forward ? parent.firstChild : parent.lastChild];

						// non-xml :nth-child(...) stores cache data on `parent`
						if (forward && useCache) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[expando] || (node[expando] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

							cache = uniqueCache[type] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = nodeIndex && cache[2];
							node = nodeIndex && parent.childNodes[nodeIndex];

							while (node = ++nodeIndex && node && node[dir] || (

							// Fallback to seeking `elem` from the start
							diff = nodeIndex = 0) || start.pop()) {

								// When found, cache indexes on `parent` and break
								if (node.nodeType === 1 && ++diff && node === elem) {
									uniqueCache[type] = [dirruns, nodeIndex, diff];
									break;
								}
							}
						} else {
							// Use previously-cached element index if available
							if (useCache) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[expando] || (node[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if (diff === false) {
								// Use the same loop as above to seek `elem` from the start
								while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

									if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

										// Cache the index of each encountered element
										if (useCache) {
											outerCache = node[expando] || (node[expando] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

											uniqueCache[type] = [dirruns, diff];
										}

										if (node === elem) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || diff % first === 0 && diff / first >= 0;
					}
				};
			},

			"PSEUDO": function PSEUDO(pseudo, argument) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
				    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if (fn[expando]) {
					return fn(argument);
				}

				// But maintain support for old signatures
				if (fn.length > 1) {
					args = [pseudo, pseudo, "", argument];
					return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
						var idx,
						    matched = fn(seed, argument),
						    i = matched.length;
						while (i--) {
							idx = indexOf(seed, matched[i]);
							seed[idx] = !(matches[idx] = matched[i]);
						}
					}) : function (elem) {
						return fn(elem, 0, args);
					};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function (selector) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
				    results = [],
				    matcher = compile(selector.replace(rtrim, "$1"));

				return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
					var elem,
					    unmatched = matcher(seed, null, xml, []),
					    i = seed.length;

					// Match elements unmatched by `matcher`
					while (i--) {
						if (elem = unmatched[i]) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) : function (elem, context, xml) {
					input[0] = elem;
					matcher(input, null, xml, results);
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
			}),

			"has": markFunction(function (selector) {
				return function (elem) {
					return Sizzle(selector, elem).length > 0;
				};
			}),

			"contains": markFunction(function (text) {
				text = text.replace(runescape, funescape);
				return function (elem) {
					return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction(function (lang) {
				// lang value must be a valid identifier
				if (!ridentifier.test(lang || "")) {
					Sizzle.error("unsupported lang: " + lang);
				}
				lang = lang.replace(runescape, funescape).toLowerCase();
				return function (elem) {
					var elemLang;
					do {
						if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
						}
					} while ((elem = elem.parentNode) && elem.nodeType === 1);
					return false;
				};
			}),

			// Miscellaneous
			"target": function target(elem) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice(1) === elem.id;
			},

			"root": function root(elem) {
				return elem === docElem;
			},

			"focus": function focus(elem) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function enabled(elem) {
				return elem.disabled === false;
			},

			"disabled": function disabled(elem) {
				return elem.disabled === true;
			},

			"checked": function checked(elem) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
			},

			"selected": function selected(elem) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if (elem.parentNode) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function empty(elem) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					if (elem.nodeType < 6) {
						return false;
					}
				}
				return true;
			},

			"parent": function parent(elem) {
				return !Expr.pseudos["empty"](elem);
			},

			// Element/input types
			"header": function header(elem) {
				return rheader.test(elem.nodeName);
			},

			"input": function input(elem) {
				return rinputs.test(elem.nodeName);
			},

			"button": function button(elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function text(elem) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
			},

			// Position-in-collection
			"first": createPositionalPseudo(function () {
				return [0];
			}),

			"last": createPositionalPseudo(function (matchIndexes, length) {
				return [length - 1];
			}),

			"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
				return [argument < 0 ? argument + length : argument];
			}),

			"even": createPositionalPseudo(function (matchIndexes, length) {
				var i = 0;
				for (; i < length; i += 2) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function (matchIndexes, length) {
				var i = 1;
				for (; i < length; i += 2) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
				var i = argument < 0 ? argument + length : argument;
				for (; --i >= 0;) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
				var i = argument < 0 ? argument + length : argument;
				for (; ++i < length;) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
		Expr.pseudos[i] = createInputPseudo(i);
	}
	for (i in { submit: true, reset: true }) {
		Expr.pseudos[i] = createButtonPseudo(i);
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function (selector, parseOnly) {
		var matched,
		    match,
		    tokens,
		    type,
		    soFar,
		    groups,
		    preFilters,
		    cached = tokenCache[selector + " "];

		if (cached) {
			return parseOnly ? 0 : cached.slice(0);
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while (soFar) {

			// Comma and first run
			if (!matched || (match = rcomma.exec(soFar))) {
				if (match) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice(match[0].length) || soFar;
				}
				groups.push(tokens = []);
			}

			matched = false;

			// Combinators
			if (match = rcombinators.exec(soFar)) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace(rtrim, " ")
				});
				soFar = soFar.slice(matched.length);
			}

			// Filters
			for (type in Expr.filter) {
				if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice(matched.length);
				}
			}

			if (!matched) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
		// Cache the tokens
		tokenCache(selector, groups).slice(0);
	};

	function toSelector(tokens) {
		var i = 0,
		    len = tokens.length,
		    selector = "";
		for (; i < len; i++) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator(matcher, combinator, base) {
		var dir = combinator.dir,
		    checkNonElements = base && dir === "parentNode",
		    doneName = done++;

		return combinator.first ?
		// Check against closest ancestor/preceding element
		function (elem, context, xml) {
			while (elem = elem[dir]) {
				if (elem.nodeType === 1 || checkNonElements) {
					return matcher(elem, context, xml);
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function (elem, context, xml) {
			var oldCache,
			    uniqueCache,
			    outerCache,
			    newCache = [dirruns, doneName];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if (xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						if (matcher(elem, context, xml)) {
							return true;
						}
					}
				}
			} else {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						outerCache = elem[expando] || (elem[expando] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

						if ((oldCache = uniqueCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

							// Assign to newCache so results back-propagate to previous elements
							return newCache[2] = oldCache[2];
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[dir] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if (newCache[2] = matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				}
			}
		};
	}

	function elementMatcher(matchers) {
		return matchers.length > 1 ? function (elem, context, xml) {
			var i = matchers.length;
			while (i--) {
				if (!matchers[i](elem, context, xml)) {
					return false;
				}
			}
			return true;
		} : matchers[0];
	}

	function multipleContexts(selector, contexts, results) {
		var i = 0,
		    len = contexts.length;
		for (; i < len; i++) {
			Sizzle(selector, contexts[i], results);
		}
		return results;
	}

	function condense(unmatched, map, filter, context, xml) {
		var elem,
		    newUnmatched = [],
		    i = 0,
		    len = unmatched.length,
		    mapped = map != null;

		for (; i < len; i++) {
			if (elem = unmatched[i]) {
				if (!filter || filter(elem, context, xml)) {
					newUnmatched.push(elem);
					if (mapped) {
						map.push(i);
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
		if (postFilter && !postFilter[expando]) {
			postFilter = setMatcher(postFilter);
		}
		if (postFinder && !postFinder[expando]) {
			postFinder = setMatcher(postFinder, postSelector);
		}
		return markFunction(function (seed, results, context, xml) {
			var temp,
			    i,
			    elem,
			    preMap = [],
			    postMap = [],
			    preexisting = results.length,


			// Get initial elements from seed or context
			elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
			    matcherOut = matcher ?
			// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
			postFinder || (seed ? preFilter : preexisting || postFilter) ?

			// ...intermediate processing is necessary
			[] :

			// ...otherwise use results directly
			results : matcherIn;

			// Find primary matches
			if (matcher) {
				matcher(matcherIn, matcherOut, context, xml);
			}

			// Apply postFilter
			if (postFilter) {
				temp = condense(matcherOut, postMap);
				postFilter(temp, [], context, xml);

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while (i--) {
					if (elem = temp[i]) {
						matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
					}
				}
			}

			if (seed) {
				if (postFinder || preFilter) {
					if (postFinder) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while (i--) {
							if (elem = matcherOut[i]) {
								// Restore matcherIn since elem is not yet a final match
								temp.push(matcherIn[i] = elem);
							}
						}
						postFinder(null, matcherOut = [], temp, xml);
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while (i--) {
						if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

				// Add elements to results, through postFinder if defined
			} else {
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
		});
	}

	function matcherFromTokens(tokens) {
		var checkContext,
		    matcher,
		    j,
		    len = tokens.length,
		    leadingRelative = Expr.relative[tokens[0].type],
		    implicitRelative = leadingRelative || Expr.relative[" "],
		    i = leadingRelative ? 1 : 0,


		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator(function (elem) {
			return elem === checkContext;
		}, implicitRelative, true),
		    matchAnyContext = addCombinator(function (elem) {
			return indexOf(checkContext, elem) > -1;
		}, implicitRelative, true),
		    matchers = [function (elem, context, xml) {
			var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		}];

		for (; i < len; i++) {
			if (matcher = Expr.relative[tokens[i].type]) {
				matchers = [addCombinator(elementMatcher(matchers), matcher)];
			} else {
				matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

				// Return special upon seeing a positional matcher
				if (matcher[expando]) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for (; j < len; j++) {
						if (Expr.relative[tokens[j].type]) {
							break;
						}
					}
					return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
				}
				matchers.push(matcher);
			}
		}

		return elementMatcher(matchers);
	}

	function matcherFromGroupMatchers(elementMatchers, setMatchers) {
		var bySet = setMatchers.length > 0,
		    byElement = elementMatchers.length > 0,
		    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
			var elem,
			    j,
			    matcher,
			    matchedCount = 0,
			    i = "0",
			    unmatched = seed && [],
			    setMatched = [],
			    contextBackup = outermostContext,

			// We must always have either seed elements or outermost context
			elems = seed || byElement && Expr.find["TAG"]("*", outermost),

			// Use integer dirruns iff this is the outermost matcher
			dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
			    len = elems.length;

			if (outermost) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for (; i !== len && (elem = elems[i]) != null; i++) {
				if (byElement && elem) {
					j = 0;
					if (!context && elem.ownerDocument !== document) {
						setDocument(elem);
						xml = !documentIsHTML;
					}
					while (matcher = elementMatchers[j++]) {
						if (matcher(elem, context || document, xml)) {
							results.push(elem);
							break;
						}
					}
					if (outermost) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if (bySet) {
					// They will have gone through all possible matchers
					if (elem = !matcher && elem) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if (seed) {
						unmatched.push(elem);
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if (bySet && i !== matchedCount) {
				j = 0;
				while (matcher = setMatchers[j++]) {
					matcher(unmatched, setMatched, context, xml);
				}

				if (seed) {
					// Reintegrate element matches to eliminate the need for sorting
					if (matchedCount > 0) {
						while (i--) {
							if (!(unmatched[i] || setMatched[i])) {
								setMatched[i] = pop.call(results);
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense(setMatched);
				}

				// Add matches to results
				push.apply(results, setMatched);

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

					Sizzle.uniqueSort(results);
				}
			}

			// Override manipulation of globals by nested matchers
			if (outermost) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

		return bySet ? markFunction(superMatcher) : superMatcher;
	}

	compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
		var i,
		    setMatchers = [],
		    elementMatchers = [],
		    cached = compilerCache[selector + " "];

		if (!cached) {
			// Generate a function of recursive functions that can be used to check each element
			if (!match) {
				match = tokenize(selector);
			}
			i = match.length;
			while (i--) {
				cached = matcherFromTokens(match[i]);
				if (cached[expando]) {
					setMatchers.push(cached);
				} else {
					elementMatchers.push(cached);
				}
			}

			// Cache the compiled function
			cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
  * A low-level selection function that works with Sizzle's compiled
  *  selector functions
  * @param {String|Function} selector A selector or a pre-compiled
  *  selector function built with Sizzle.compile
  * @param {Element} context
  * @param {Array} [results]
  * @param {Array} [seed] A set of elements to match against
  */
	select = Sizzle.select = function (selector, context, results, seed) {
		var i,
		    tokens,
		    token,
		    type,
		    find,
		    compiled = typeof selector === "function" && selector,
		    match = !seed && tokenize(selector = compiled.selector || selector);

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if (match.length === 1) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice(0);
			if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

				context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
				if (!context) {
					return results;

					// Precompiled matchers will still verify ancestry, so step up a level
				} else if (compiled) {
						context = context.parentNode;
					}

				selector = selector.slice(tokens.shift().value.length);
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
			while (i--) {
				token = tokens[i];

				// Abort if we hit a combinator
				if (Expr.relative[type = token.type]) {
					break;
				}
				if (find = Expr.find[type]) {
					// Search, expanding context for leading sibling combinators
					if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice(i, 1);
						selector = seed.length && toSelector(tokens);
						if (!selector) {
							push.apply(results, seed);
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function (div1) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition(document.createElement("div")) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if (!assert(function (div) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#";
	})) {
		addHandle("type|href|height|width", function (elem, name, isXML) {
			if (!isXML) {
				return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if (!support.attributes || !assert(function (div) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute("value", "");
		return div.firstChild.getAttribute("value") === "";
	})) {
		addHandle("value", function (elem, name, isXML) {
			if (!isXML && elem.nodeName.toLowerCase() === "input") {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if (!assert(function (div) {
		return div.getAttribute("disabled") == null;
	})) {
		addHandle(booleans, function (elem, name, isXML) {
			var val;
			if (!isXML) {
				return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
			}
		});
	}

	// EXPOSE
	if (typeof define === "function" && define.amd) {
		define(function () {
			return Sizzle;
		});
		// Sizzle requires that there be a global window in Common-JS like environments
	} else if (typeof module !== "undefined" && module.exports) {
			module.exports = Sizzle;
		} else {
			window.Sizzle = Sizzle;
		}
	// EXPOSE
})(window);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L2V4dGVybmFsL3NpenpsZS9kaXN0L3NpenpsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFVQSxDQUFDLFVBQVUsTUFBVixFQUFtQjs7QUFFcEIsS0FBSSxDQUFKO0tBQ0MsT0FERDtLQUVDLElBRkQ7S0FHQyxPQUhEO0tBSUMsS0FKRDtLQUtDLFFBTEQ7S0FNQyxPQU5EO0tBT0MsTUFQRDtLQVFDLGdCQVJEO0tBU0MsU0FURDtLQVVDLFlBVkQ7Ozs7QUFhQyxZQWJEO0tBY0MsUUFkRDtLQWVDLE9BZkQ7S0FnQkMsY0FoQkQ7S0FpQkMsU0FqQkQ7S0FrQkMsYUFsQkQ7S0FtQkMsT0FuQkQ7S0FvQkMsUUFwQkQ7Ozs7QUF1QkMsV0FBVSxXQUFXLElBQUksSUFBSSxJQUFKLEVBdkIxQjtLQXdCQyxlQUFlLE9BQU8sUUF4QnZCO0tBeUJDLFVBQVUsQ0F6Qlg7S0EwQkMsT0FBTyxDQTFCUjtLQTJCQyxhQUFhLGFBM0JkO0tBNEJDLGFBQWEsYUE1QmQ7S0E2QkMsZ0JBQWdCLGFBN0JqQjtLQThCQyxZQUFZLG1CQUFVLENBQVYsRUFBYSxDQUFiLEVBQWlCO0FBQzVCLE1BQUssTUFBTSxDQUFYLEVBQWU7QUFDZCxrQkFBZSxJQUFmO0FBQ0E7QUFDRCxTQUFPLENBQVA7QUFDQSxFQW5DRjs7OztBQXNDQyxnQkFBZSxLQUFLLEVBdENyQjs7OztBQXlDQyxVQUFVLEVBQUQsQ0FBSyxjQXpDZjtLQTBDQyxNQUFNLEVBMUNQO0tBMkNDLE1BQU0sSUFBSSxHQTNDWDtLQTRDQyxjQUFjLElBQUksSUE1Q25CO0tBNkNDLE9BQU8sSUFBSSxJQTdDWjtLQThDQyxRQUFRLElBQUksS0E5Q2I7Ozs7QUFpREMsV0FBVSxTQUFWLE9BQVUsQ0FBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXVCO0FBQ2hDLE1BQUksSUFBSSxDQUFSO01BQ0MsTUFBTSxLQUFLLE1BRFo7QUFFQSxTQUFRLElB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QVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBTyxPQUE3QyxFQUF1RDtBQUM3RCxVQUFPLE9BQVAsR0FBaUIsTUFBakI7QUFDQSxHQUZNLE1BRUE7QUFDTixVQUFPLE1BQVAsR0FBZ0IsTUFBaEI7QUFDQTs7QUFHQSxDQXBsRUQsRUFvbEVJLE1BcGxFSiIsImZpbGUiOiJzaXp6bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYyLjIuMVxuICogaHR0cDovL3NpenpsZWpzLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogRGF0ZTogMjAxNS0xMC0xN1xuICovXG4oZnVuY3Rpb24oIHdpbmRvdyApIHtcblxudmFyIGksXG5cdHN1cHBvcnQsXG5cdEV4cHIsXG5cdGdldFRleHQsXG5cdGlzWE1MLFxuXHR0b2tlbml6ZSxcblx0Y29tcGlsZSxcblx0c2VsZWN0LFxuXHRvdXRlcm1vc3RDb250ZXh0LFxuXHRzb3J0SW5wdXQsXG5cdGhhc0R1cGxpY2F0ZSxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIDEgKiBuZXcgRGF0ZSgpLFxuXHRwcmVmZXJyZWREb2MgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdGRpcnJ1bnMgPSAwLFxuXHRkb25lID0gMCxcblx0Y2xhc3NDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHRva2VuQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRjb21waWxlckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIDA7XG5cdH0sXG5cblx0Ly8gR2VuZXJhbC1wdXJwb3NlIGNvbnN0YW50c1xuXHRNQVhfTkVHQVRJVkUgPSAxIDw8IDMxLFxuXG5cdC8vIEluc3RhbmNlIG1ldGhvZHNcblx0aGFzT3duID0gKHt9KS5oYXNPd25Qcm9wZXJ0eSxcblx0YXJyID0gW10sXG5cdHBvcCA9IGFyci5wb3AsXG5cdHB1c2hfbmF0aXZlID0gYXJyLnB1c2gsXG5cdHB1c2ggPSBhcnIucHVzaCxcblx0c2xpY2UgPSBhcnIuc2xpY2UsXG5cdC8vIFVzZSBhIHN0cmlwcGVkLWRvd24gaW5kZXhPZiBhcyBpdCdzIGZhc3RlciB0aGFuIG5hdGl2ZVxuXHQvLyBodHRwOi8vanNwZXJmLmNvbS90aG9yLWluZGV4b2YtdnMtZm9yLzVcblx0aW5kZXhPZiA9IGZ1bmN0aW9uKCBsaXN0LCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCBsaXN0W2ldID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58aXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jd2hpdGVzcGFjZVxuXHR3aGl0ZXNwYWNlID0gXCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLFxuXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCN2YWx1ZS1kZWYtaWRlbnRpZmllclxuXHRpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXC58W1xcXFx3LV18W15cXFxceDAwLVxcXFx4YTBdKStcIixcblxuXHQvLyBBdHRyaWJ1dGUgc2VsZWN0b3JzOiBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2F0dHJpYnV0ZS1zZWxlY3RvcnNcblx0YXR0cmlidXRlcyA9IFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XCIgKyB3aGl0ZXNwYWNlICtcblx0XHQvLyBPcGVyYXRvciAoY2FwdHVyZSAyKVxuXHRcdFwiKihbKl4kfCF+XT89KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0Ly8gXCJBdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzIFtjYXB0dXJlIDVdIG9yIHN0cmluZ3MgW2NhcHR1cmUgMyBvciBjYXB0dXJlIDRdXCJcblx0XHRcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiICsgaWRlbnRpZmllciArIFwiKSl8KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCIqXFxcXF1cIixcblxuXHRwc2V1ZG9zID0gXCI6KFwiICsgaWRlbnRpZmllciArIFwiKSg/OlxcXFwoKFwiICtcblx0XHQvLyBUbyByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnMgbmVlZGluZyB0b2tlbml6ZSBpbiB0aGUgcHJlRmlsdGVyLCBwcmVmZXIgYXJndW1lbnRzOlxuXHRcdC8vIDEuIHF1b3RlZCAoY2FwdHVyZSAzOyBjYXB0dXJlIDQgb3IgY2FwdHVyZSA1KVxuXHRcdFwiKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8XCIgK1xuXHRcdC8vIDIuIHNpbXBsZSAoY2FwdHVyZSA2KVxuXHRcdFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcyArIFwiKSopfFwiICtcblx0XHQvLyAzLiBhbnl0aGluZyBlbHNlIChjYXB0dXJlIDIpXG5cdFx0XCIuKlwiICtcblx0XHRcIilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRyd2hpdGVzcGFjZSA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcIitcIiwgXCJnXCIgKSxcblx0cnRyaW0gPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgKyB3aGl0ZXNwYWNlICsgXCIrJFwiLCBcImdcIiApLFxuXG5cdHJjb21tYSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKixcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXHRyY29tYmluYXRvcnMgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiooWz4rfl18XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXCIgKSxcblxuXHRyYXR0cmlidXRlUXVvdGVzID0gbmV3IFJlZ0V4cCggXCI9XCIgKyB3aGl0ZXNwYWNlICsgXCIqKFteXFxcXF0nXFxcIl0qPylcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcXVwiLCBcImdcIiApLFxuXG5cdHJwc2V1ZG8gPSBuZXcgUmVnRXhwKCBwc2V1ZG9zICksXG5cdHJpZGVudGlmaWVyID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBpZGVudGlmaWVyICsgXCIkXCIgKSxcblxuXHRtYXRjaEV4cHIgPSB7XG5cdFx0XCJJRFwiOiBuZXcgUmVnRXhwKCBcIl4jKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiVEFHXCI6IG5ldyBSZWdFeHAoIFwiXihcIiArIGlkZW50aWZpZXIgKyBcInxbKl0pXCIgKSxcblx0XHRcIkFUVFJcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBhdHRyaWJ1dGVzICksXG5cdFx0XCJQU0VVRE9cIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBwc2V1ZG9zICksXG5cdFx0XCJDSElMRFwiOiBuZXcgUmVnRXhwKCBcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86KFsrLV18KVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIiooXFxcXGQrKXwpKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfClcIiwgXCJpXCIgKSxcblx0XHRcImJvb2xcIjogbmV3IFJlZ0V4cCggXCJeKD86XCIgKyBib29sZWFucyArIFwiKSRcIiwgXCJpXCIgKSxcblx0XHQvLyBGb3IgdXNlIGluIGxpYnJhcmllcyBpbXBsZW1lbnRpbmcgLmlzKClcblx0XHQvLyBXZSB1c2UgdGhpcyBmb3IgUE9TIG1hdGNoaW5nIGluIGBzZWxlY3RgXG5cdFx0XCJuZWVkc0NvbnRleHRcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIgKVxuXHR9LFxuXG5cdHJpbnB1dHMgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyaGVhZGVyID0gL15oXFxkJC9pLFxuXG5cdHJuYXRpdmUgPSAvXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFxuXG5cdC8vIEVhc2lseS1wYXJzZWFibGUvcmV0cmlldmFibGUgSUQgb3IgVEFHIG9yIENMQVNTIHNlbGVjdG9yc1xuXHRycXVpY2tFeHByID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG5cblx0cnNpYmxpbmcgPSAvWyt+XS8sXG5cdHJlc2NhcGUgPSAvJ3xcXFxcL2csXG5cblx0Ly8gQ1NTIGVzY2FwZXMgaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMjEvc3luZGF0YS5odG1sI2VzY2FwZWQtY2hhcmFjdGVyc1xuXHRydW5lc2NhcGUgPSBuZXcgUmVnRXhwKCBcIlxcXFxcXFxcKFtcXFxcZGEtZl17MSw2fVwiICsgd2hpdGVzcGFjZSArIFwiP3woXCIgKyB3aGl0ZXNwYWNlICsgXCIpfC4pXCIsIFwiaWdcIiApLFxuXHRmdW5lc2NhcGUgPSBmdW5jdGlvbiggXywgZXNjYXBlZCwgZXNjYXBlZFdoaXRlc3BhY2UgKSB7XG5cdFx0dmFyIGhpZ2ggPSBcIjB4XCIgKyBlc2NhcGVkIC0gMHgxMDAwMDtcblx0XHQvLyBOYU4gbWVhbnMgbm9uLWNvZGVwb2ludFxuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3g8MjRcblx0XHQvLyBXb3JrYXJvdW5kIGVycm9uZW91cyBudW1lcmljIGludGVycHJldGF0aW9uIG9mICtcIjB4XCJcblx0XHRyZXR1cm4gaGlnaCAhPT0gaGlnaCB8fCBlc2NhcGVkV2hpdGVzcGFjZSA/XG5cdFx0XHRlc2NhcGVkIDpcblx0XHRcdGhpZ2ggPCAwID9cblx0XHRcdFx0Ly8gQk1QIGNvZGVwb2ludFxuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoICsgMHgxMDAwMCApIDpcblx0XHRcdFx0Ly8gU3VwcGxlbWVudGFsIFBsYW5lIGNvZGVwb2ludCAoc3Vycm9nYXRlIHBhaXIpXG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggPj4gMTAgfCAweEQ4MDAsIGhpZ2ggJiAweDNGRiB8IDB4REMwMCApO1xuXHR9LFxuXG5cdC8vIFVzZWQgZm9yIGlmcmFtZXNcblx0Ly8gU2VlIHNldERvY3VtZW50KClcblx0Ly8gUmVtb3ZpbmcgdGhlIGZ1bmN0aW9uIHdyYXBwZXIgY2F1c2VzIGEgXCJQZXJtaXNzaW9uIERlbmllZFwiXG5cdC8vIGVycm9yIGluIElFXG5cdHVubG9hZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXREb2N1bWVudCgpO1xuXHR9O1xuXG4vLyBPcHRpbWl6ZSBmb3IgcHVzaC5hcHBseSggXywgTm9kZUxpc3QgKVxudHJ5IHtcblx0cHVzaC5hcHBseShcblx0XHQoYXJyID0gc2xpY2UuY2FsbCggcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMgKSksXG5cdFx0cHJlZmVycmVkRG9jLmNoaWxkTm9kZXNcblx0KTtcblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0Ly8gRGV0ZWN0IHNpbGVudGx5IGZhaWxpbmcgcHVzaC5hcHBseVxuXHRhcnJbIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzLmxlbmd0aCBdLm5vZGVUeXBlO1xufSBjYXRjaCAoIGUgKSB7XG5cdHB1c2ggPSB7IGFwcGx5OiBhcnIubGVuZ3RoID9cblxuXHRcdC8vIExldmVyYWdlIHNsaWNlIGlmIHBvc3NpYmxlXG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0cHVzaF9uYXRpdmUuYXBwbHkoIHRhcmdldCwgc2xpY2UuY2FsbChlbHMpICk7XG5cdFx0fSA6XG5cblx0XHQvLyBTdXBwb3J0OiBJRTw5XG5cdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZCBkaXJlY3RseVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHZhciBqID0gdGFyZ2V0Lmxlbmd0aCxcblx0XHRcdFx0aSA9IDA7XG5cdFx0XHQvLyBDYW4ndCB0cnVzdCBOb2RlTGlzdC5sZW5ndGhcblx0XHRcdHdoaWxlICggKHRhcmdldFtqKytdID0gZWxzW2krK10pICkge31cblx0XHRcdHRhcmdldC5sZW5ndGggPSBqIC0gMTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBtLCBpLCBlbGVtLCBuaWQsIG5pZHNlbGVjdCwgbWF0Y2gsIGdyb3VwcywgbmV3U2VsZWN0b3IsXG5cdFx0bmV3Q29udGV4dCA9IGNvbnRleHQgJiYgY29udGV4dC5vd25lckRvY3VtZW50LFxuXG5cdFx0Ly8gbm9kZVR5cGUgZGVmYXVsdHMgdG8gOSwgc2luY2UgY29udGV4dCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHRcdG5vZGVUeXBlID0gY29udGV4dCA/IGNvbnRleHQubm9kZVR5cGUgOiA5O1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFJldHVybiBlYXJseSBmcm9tIGNhbGxzIHdpdGggaW52YWxpZCBzZWxlY3RvciBvciBjb250ZXh0XG5cdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiIHx8ICFzZWxlY3RvciB8fFxuXHRcdG5vZGVUeXBlICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICYmIG5vZGVUeXBlICE9PSAxMSApIHtcblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0Ly8gVHJ5IHRvIHNob3J0Y3V0IGZpbmQgb3BlcmF0aW9ucyAoYXMgb3Bwb3NlZCB0byBmaWx0ZXJzKSBpbiBIVE1MIGRvY3VtZW50c1xuXHRpZiAoICFzZWVkICkge1xuXG5cdFx0aWYgKCAoIGNvbnRleHQgPyBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCA6IHByZWZlcnJlZERvYyApICE9PSBkb2N1bWVudCApIHtcblx0XHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdFx0fVxuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0aWYgKCBkb2N1bWVudElzSFRNTCApIHtcblxuXHRcdFx0Ly8gSWYgdGhlIHNlbGVjdG9yIGlzIHN1ZmZpY2llbnRseSBzaW1wbGUsIHRyeSB1c2luZyBhIFwiZ2V0KkJ5KlwiIERPTSBtZXRob2Rcblx0XHRcdC8vIChleGNlcHRpbmcgRG9jdW1lbnRGcmFnbWVudCBjb250ZXh0LCB3aGVyZSB0aGUgbWV0aG9kcyBkb24ndCBleGlzdClcblx0XHRcdGlmICggbm9kZVR5cGUgIT09IDExICYmIChtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSkgKSB7XG5cblx0XHRcdFx0Ly8gSUQgc2VsZWN0b3Jcblx0XHRcdFx0aWYgKCAobSA9IG1hdGNoWzFdKSApIHtcblxuXHRcdFx0XHRcdC8vIERvY3VtZW50IGNvbnRleHRcblx0XHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBjb250ZXh0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgJiYgKGVsZW0gPSBuZXdDb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkpICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICkgJiZcblx0XHRcdFx0XHRcdFx0ZWxlbS5pZCA9PT0gbSApIHtcblxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFR5cGUgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbMl0gKSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHRcdC8vIENsYXNzIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoIChtID0gbWF0Y2hbM10pICYmIHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJlxuXHRcdFx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbSApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVGFrZSBhZHZhbnRhZ2Ugb2YgcXVlcnlTZWxlY3RvckFsbFxuXHRcdFx0aWYgKCBzdXBwb3J0LnFzYSAmJlxuXHRcdFx0XHQhY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdICYmXG5cdFx0XHRcdCghcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSkgKSB7XG5cblx0XHRcdFx0aWYgKCBub2RlVHlwZSAhPT0gMSApIHtcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gY29udGV4dDtcblx0XHRcdFx0XHRuZXdTZWxlY3RvciA9IHNlbGVjdG9yO1xuXG5cdFx0XHRcdC8vIHFTQSBsb29rcyBvdXRzaWRlIEVsZW1lbnQgY29udGV4dCwgd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudFxuXHRcdFx0XHQvLyBUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhpcyB3b3JrYXJvdW5kIHRlY2huaXF1ZVxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8PThcblx0XHRcdFx0Ly8gRXhjbHVkZSBvYmplY3QgZWxlbWVudHNcblx0XHRcdFx0fSBlbHNlIGlmICggY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHRcdFx0Ly8gQ2FwdHVyZSB0aGUgY29udGV4dCBJRCwgc2V0dGluZyBpdCBmaXJzdCBpZiBuZWNlc3Nhcnlcblx0XHRcdFx0XHRpZiAoIChuaWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSggXCJpZFwiICkpICkge1xuXHRcdFx0XHRcdFx0bmlkID0gbmlkLnJlcGxhY2UoIHJlc2NhcGUsIFwiXFxcXCQmXCIgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgKG5pZCA9IGV4cGFuZG8pICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJlZml4IGV2ZXJ5IHNlbGVjdG9yIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0aSA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdFx0bmlkc2VsZWN0ID0gcmlkZW50aWZpZXIudGVzdCggbmlkICkgPyBcIiNcIiArIG5pZCA6IFwiW2lkPSdcIiArIG5pZCArIFwiJ11cIjtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGdyb3Vwc1tpXSA9IG5pZHNlbGVjdCArIFwiIFwiICsgdG9TZWxlY3RvciggZ3JvdXBzW2ldICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld1NlbGVjdG9yID0gZ3JvdXBzLmpvaW4oIFwiLFwiICk7XG5cblx0XHRcdFx0XHQvLyBFeHBhbmQgY29udGV4dCBmb3Igc2libGluZyBzZWxlY3RvcnNcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIG5ld1NlbGVjdG9yICkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLFxuXHRcdFx0XHRcdFx0XHRuZXdDb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIG5ld1NlbGVjdG9yIClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9IGNhdGNoICggcXNhRXJyb3IgKSB7XG5cdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdGlmICggbmlkID09PSBleHBhbmRvICkge1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWxsIG90aGVyc1xuXHRyZXR1cm4gc2VsZWN0KCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUga2V5LXZhbHVlIGNhY2hlcyBvZiBsaW1pdGVkIHNpemVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl9IFJldHVybnMgdGhlIE9iamVjdCBkYXRhIGFmdGVyIHN0b3JpbmcgaXQgb24gaXRzZWxmIHdpdGhcbiAqXHRwcm9wZXJ0eSBuYW1lIHRoZSAoc3BhY2Utc3VmZml4ZWQpIHN0cmluZyBhbmQgKGlmIHRoZSBjYWNoZSBpcyBsYXJnZXIgdGhhbiBFeHByLmNhY2hlTGVuZ3RoKVxuICpcdGRlbGV0aW5nIHRoZSBvbGRlc3QgZW50cnlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUoKSB7XG5cdHZhciBrZXlzID0gW107XG5cblx0ZnVuY3Rpb24gY2FjaGUoIGtleSwgdmFsdWUgKSB7XG5cdFx0Ly8gVXNlIChrZXkgKyBcIiBcIikgdG8gYXZvaWQgY29sbGlzaW9uIHdpdGggbmF0aXZlIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChzZWUgSXNzdWUgIzE1Nylcblx0XHRpZiAoIGtleXMucHVzaCgga2V5ICsgXCIgXCIgKSA+IEV4cHIuY2FjaGVMZW5ndGggKSB7XG5cdFx0XHQvLyBPbmx5IGtlZXAgdGhlIG1vc3QgcmVjZW50IGVudHJpZXNcblx0XHRcdGRlbGV0ZSBjYWNoZVsga2V5cy5zaGlmdCgpIF07XG5cdFx0fVxuXHRcdHJldHVybiAoY2FjaGVbIGtleSArIFwiIFwiIF0gPSB2YWx1ZSk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZGl2IGFuZCBleHBlY3RzIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZGl2ICk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBkaXYucGFyZW50Tm9kZSApIHtcblx0XHRcdGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0XHR9XG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRkaXYgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdChcInxcIiksXG5cdFx0aSA9IGFyci5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0RXhwci5hdHRySGFuZGxlWyBhcnJbaV0gXSA9IGhhbmRsZXI7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZG9jdW1lbnQgb3JkZXIgb2YgdHdvIHNpYmxpbmdzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYlxuICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyBsZXNzIHRoYW4gMCBpZiBhIHByZWNlZGVzIGIsIGdyZWF0ZXIgdGhhbiAwIGlmIGEgZm9sbG93cyBiXG4gKi9cbmZ1bmN0aW9uIHNpYmxpbmdDaGVjayggYSwgYiApIHtcblx0dmFyIGN1ciA9IGIgJiYgYSxcblx0XHRkaWZmID0gY3VyICYmIGEubm9kZVR5cGUgPT09IDEgJiYgYi5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0KCB+Yi5zb3VyY2VJbmRleCB8fCBNQVhfTkVHQVRJVkUgKSAtXG5cdFx0XHQoIH5hLnNvdXJjZUluZGV4IHx8IE1BWF9ORUdBVElWRSApO1xuXG5cdC8vIFVzZSBJRSBzb3VyY2VJbmRleCBpZiBhdmFpbGFibGUgb24gYm90aCBub2Rlc1xuXHRpZiAoIGRpZmYgKSB7XG5cdFx0cmV0dXJuIGRpZmY7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBiIGZvbGxvd3MgYVxuXHRpZiAoIGN1ciApIHtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIubmV4dFNpYmxpbmcpICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYSA/IDEgOiAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGlucHV0IHR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dFBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgYnV0dG9uc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQnV0dG9uUHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIChuYW1lID09PSBcImlucHV0XCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIikgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgcG9zaXRpb25hbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZuICkge1xuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBhcmd1bWVudCApIHtcblx0XHRhcmd1bWVudCA9ICthcmd1bWVudDtcblx0XHRyZXR1cm4gbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0dmFyIGosXG5cdFx0XHRcdG1hdGNoSW5kZXhlcyA9IGZuKCBbXSwgc2VlZC5sZW5ndGgsIGFyZ3VtZW50ICksXG5cdFx0XHRcdGkgPSBtYXRjaEluZGV4ZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBNYXRjaCBlbGVtZW50cyBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4ZXNcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoIHNlZWRbIChqID0gbWF0Y2hJbmRleGVzW2ldKSBdICkge1xuXHRcdFx0XHRcdHNlZWRbal0gPSAhKG1hdGNoZXNbal0gPSBzZWVkW2pdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgYSBub2RlIGZvciB2YWxpZGl0eSBhcyBhIFNpenpsZSBjb250ZXh0XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0PX0gY29udGV4dFxuICogQHJldHVybnMge0VsZW1lbnR8T2JqZWN0fEJvb2xlYW59IFRoZSBpbnB1dCBub2RlIGlmIGFjY2VwdGFibGUsIG90aGVyd2lzZSBhIGZhbHN5IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250ZXh0KCBjb250ZXh0ICkge1xuXHRyZXR1cm4gY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb250ZXh0O1xufVxuXG4vLyBFeHBvc2Ugc3VwcG9ydCB2YXJzIGZvciBjb252ZW5pZW5jZVxuc3VwcG9ydCA9IFNpenpsZS5zdXBwb3J0ID0ge307XG5cbi8qKlxuICogRGV0ZWN0cyBYTUwgbm9kZXNcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZmYgZWxlbSBpcyBhIG5vbi1IVE1MIFhNTCBub2RlXG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdC8vIGRvY3VtZW50RWxlbWVudCBpcyB2ZXJpZmllZCBmb3IgY2FzZXMgd2hlcmUgaXQgZG9lc24ndCB5ZXQgZXhpc3Rcblx0Ly8gKHN1Y2ggYXMgbG9hZGluZyBpZnJhbWVzIGluIElFIC0gIzQ4MzMpXG5cdHZhciBkb2N1bWVudEVsZW1lbnQgPSBlbGVtICYmIChlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSkuZG9jdW1lbnRFbGVtZW50O1xuXHRyZXR1cm4gZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lICE9PSBcIkhUTUxcIiA6IGZhbHNlO1xufTtcblxuLyoqXG4gKiBTZXRzIGRvY3VtZW50LXJlbGF0ZWQgdmFyaWFibGVzIG9uY2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IFtkb2NdIEFuIGVsZW1lbnQgb3IgZG9jdW1lbnQgb2JqZWN0IHRvIHVzZSB0byBzZXQgdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKi9cbnNldERvY3VtZW50ID0gU2l6emxlLnNldERvY3VtZW50ID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cdHZhciBoYXNDb21wYXJlLCBwYXJlbnQsXG5cdFx0ZG9jID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCB8fCBub2RlIDogcHJlZmVycmVkRG9jO1xuXG5cdC8vIFJldHVybiBlYXJseSBpZiBkb2MgaXMgaW52YWxpZCBvciBhbHJlYWR5IHNlbGVjdGVkXG5cdGlmICggZG9jID09PSBkb2N1bWVudCB8fCBkb2Mubm9kZVR5cGUgIT09IDkgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQgKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cblx0Ly8gVXBkYXRlIGdsb2JhbCB2YXJpYWJsZXNcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdGRvY3VtZW50SXNIVE1MID0gIWlzWE1MKCBkb2N1bWVudCApO1xuXG5cdC8vIFN1cHBvcnQ6IElFIDktMTEsIEVkZ2Vcblx0Ly8gQWNjZXNzaW5nIGlmcmFtZSBkb2N1bWVudHMgYWZ0ZXIgdW5sb2FkIHRocm93cyBcInBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3JzIChqUXVlcnkgIzEzOTM2KVxuXHRpZiAoIChwYXJlbnQgPSBkb2N1bWVudC5kZWZhdWx0VmlldykgJiYgcGFyZW50LnRvcCAhPT0gcGFyZW50ICkge1xuXHRcdC8vIFN1cHBvcnQ6IElFIDExXG5cdFx0aWYgKCBwYXJlbnQuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdHBhcmVudC5hZGRFdmVudExpc3RlbmVyKCBcInVubG9hZFwiLCB1bmxvYWRIYW5kbGVyLCBmYWxzZSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgOSAtIDEwIG9ubHlcblx0XHR9IGVsc2UgaWYgKCBwYXJlbnQuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRwYXJlbnQuYXR0YWNoRXZlbnQoIFwib251bmxvYWRcIiwgdW5sb2FkSGFuZGxlciApO1xuXHRcdH1cblx0fVxuXG5cdC8qIEF0dHJpYnV0ZXNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFN1cHBvcnQ6IElFPDhcblx0Ly8gVmVyaWZ5IHRoYXQgZ2V0QXR0cmlidXRlIHJlYWxseSByZXR1cm5zIGF0dHJpYnV0ZXMgYW5kIG5vdCBwcm9wZXJ0aWVzXG5cdC8vIChleGNlcHRpbmcgSUU4IGJvb2xlYW5zKVxuXHRzdXBwb3J0LmF0dHJpYnV0ZXMgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRkaXYuY2xhc3NOYW1lID0gXCJpXCI7XG5cdFx0cmV0dXJuICFkaXYuZ2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIpO1xuXHR9KTtcblxuXHQvKiBnZXRFbGVtZW50KHMpQnkqXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgcmV0dXJucyBvbmx5IGVsZW1lbnRzXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRkaXYuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJcIikgKTtcblx0XHRyZXR1cm4gIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RoO1xuXHR9KTtcblxuXHQvLyBTdXBwb3J0OiBJRTw5XG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDEwXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRCeUlkIHJldHVybnMgZWxlbWVudHMgYnkgbmFtZVxuXHQvLyBUaGUgYnJva2VuIGdldEVsZW1lbnRCeUlkIG1ldGhvZHMgZG9uJ3QgcGljayB1cCBwcm9ncmFtYXRpY2FsbHktc2V0IG5hbWVzLFxuXHQvLyBzbyB1c2UgYSByb3VuZGFib3V0IGdldEVsZW1lbnRzQnlOYW1lIHRlc3Rcblx0c3VwcG9ydC5nZXRCeUlkID0gYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZGl2ICkuaWQgPSBleHBhbmRvO1xuXHRcdHJldHVybiAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCBleHBhbmRvICkubGVuZ3RoO1xuXHR9KTtcblxuXHQvLyBJRCBmaW5kIGFuZCBmaWx0ZXJcblx0aWYgKCBzdXBwb3J0LmdldEJ5SWQgKSB7XG5cdFx0RXhwci5maW5kW1wiSURcIl0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdHJldHVybiBtID8gWyBtIF0gOiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdEV4cHIuZmlsdGVyW1wiSURcIl0gPSBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHQvLyBTdXBwb3J0OiBJRTYvN1xuXHRcdC8vIGdldEVsZW1lbnRCeUlkIGlzIG5vdCByZWxpYWJsZSBhcyBhIGZpbmQgc2hvcnRjdXRcblx0XHRkZWxldGUgRXhwci5maW5kW1wiSURcIl07XG5cblx0XHRFeHByLmZpbHRlcltcIklEXCJdID0gIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKTtcblx0XHRcdFx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cblx0Ly8gVGFnXG5cdEV4cHIuZmluZFtcIlRBR1wiXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgP1xuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgZG9uJ3QgaGF2ZSBnRUJUTlxuXHRcdFx0fSBlbHNlIGlmICggc3VwcG9ydC5xc2EgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyApO1xuXHRcdFx0fVxuXHRcdH0gOlxuXG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdC8vIEJ5IGhhcHB5IGNvaW5jaWRlbmNlLCBhIChicm9rZW4pIGdFQlROIGFwcGVhcnMgb24gRG9jdW1lbnRGcmFnbWVudCBub2RlcyB0b29cblx0XHRcdFx0cmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IHBvc3NpYmxlIGNvbW1lbnRzXG5cdFx0XHRpZiAoIHRhZyA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSByZXN1bHRzW2krK10pICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0Ly8gQ2xhc3Ncblx0RXhwci5maW5kW1wiQ0xBU1NcIl0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgZnVuY3Rpb24oIGNsYXNzTmFtZSwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgKSkgKSB7XG5cdFx0Ly8gQnVpbGQgUVNBIHJlZ2V4XG5cdFx0Ly8gUmVnZXggc3RyYXRlZ3kgYWRvcHRlZCBmcm9tIERpZWdvIFBlcmluaVxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdFx0Ly8gU2VsZWN0IGlzIHNldCB0byBlbXB0eSBzdHJpbmcgb24gcHVycG9zZVxuXHRcdFx0Ly8gVGhpcyBpcyB0byB0ZXN0IElFJ3MgdHJlYXRtZW50IG9mIG5vdCBleHBsaWNpdGx5XG5cdFx0XHQvLyBzZXR0aW5nIGEgYm9vbGVhbiBjb250ZW50IGF0dHJpYnV0ZSxcblx0XHRcdC8vIHNpbmNlIGl0cyBwcmVzZW5jZSBzaG91bGQgYmUgZW5vdWdoXG5cdFx0XHQvLyBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjM1OVxuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZGl2ICkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyBleHBhbmRvICsgXCInPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBpZD0nXCIgKyBleHBhbmRvICsgXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+XCIgK1xuXHRcdFx0XHRcIjxvcHRpb24gc2VsZWN0ZWQ9Jyc+PC9vcHRpb24+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOCwgT3BlcmEgMTEtMTIuMTZcblx0XHRcdC8vIE5vdGhpbmcgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gZW1wdHkgc3RyaW5ncyBmb2xsb3cgXj0gb3IgJD0gb3IgKj1cblx0XHRcdC8vIFRoZSB0ZXN0IGF0dHJpYnV0ZSBtdXN0IGJlIHVua25vd24gaW4gT3BlcmEgYnV0IFwic2FmZVwiIGZvciBXaW5SVFxuXHRcdFx0Ly8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2hoNDY1Mzg4LmFzcHgjYXR0cmlidXRlX3NlY3Rpb25cblx0XHRcdGlmICggZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGFuZCBcInZhbHVlXCIgYXJlIG5vdCB0cmVhdGVkIGNvcnJlY3RseVxuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc2VsZWN0ZWRdXCIpLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooPzp2YWx1ZXxcIiArIGJvb2xlYW5zICsgXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lPDI5LCBBbmRyb2lkPDQuNCwgU2FmYXJpPDcuMCssIGlPUzw3LjArLCBQaGFudG9tSlM8MS45LjgrXG5cdFx0XHRpZiAoICFkaXYucXVlcnlTZWxlY3RvckFsbCggXCJbaWR+PVwiICsgZXhwYW5kbyArIFwiLV1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goXCJ+PVwiKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2Via2l0L09wZXJhIC0gOmNoZWNrZWQgc2hvdWxkIHJldHVybiBzZWxlY3RlZCBvcHRpb24gZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKFwiOmNoZWNrZWRcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA4KywgaU9TIDgrXG5cdFx0XHQvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM2ODUxXG5cdFx0XHQvLyBJbi1wYWdlIGBzZWxlY3RvciNpZCBzaWJpbmctY29tYmluYXRvciBzZWxlY3RvcmAgZmFpbHNcblx0XHRcdGlmICggIWRpdi5xdWVyeVNlbGVjdG9yQWxsKCBcImEjXCIgKyBleHBhbmRvICsgXCIrKlwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaChcIi4jLitbK35dXCIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGFuZCBuYW1lIGF0dHJpYnV0ZXMgYXJlIHJlc3RyaWN0ZWQgZHVyaW5nIC5pbm5lckhUTUwgYXNzaWdubWVudFxuXHRcdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJoaWRkZW5cIiApO1xuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiRFwiICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gRW5mb3JjZSBjYXNlLXNlbnNpdGl2aXR5IG9mIG5hbWUgYXR0cmlidXRlXG5cdFx0XHRpZiAoIGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9ZF1cIikubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqWypeJHwhfl0/PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6ZW5hYmxlZFwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiKiw6eFwiKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKFwiLC4qOlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggKHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAobWF0Y2hlcyA9IGRvY0VsZW0ubWF0Y2hlcyB8fFxuXHRcdGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yKSApKSApIHtcblxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZGl2LCBcImRpdlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZGl2LCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0pO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbihcInxcIikgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbihcInxcIikgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdGhhc0NvbXBhcmUgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29tcGFyZURvY3VtZW50UG9zaXRpb24gKTtcblxuXHQvLyBFbGVtZW50IGNvbnRhaW5zIGFub3RoZXJcblx0Ly8gUHVycG9zZWZ1bGx5IHNlbGYtZXhjbHVzaXZlXG5cdC8vIEFzIGluLCBhbiBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gaXRzZWxmXG5cdGNvbnRhaW5zID0gaGFzQ29tcGFyZSB8fCBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSA/XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0XHRidXAgPSBiICYmIGIucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgKFxuXHRcdFx0XHRhZG93bi5jb250YWlucyA/XG5cdFx0XHRcdFx0YWRvd24uY29udGFpbnMoIGJ1cCApIDpcblx0XHRcdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGJ1cCApICYgMTZcblx0XHRcdCkpO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0aWYgKCBiICkge1xuXHRcdFx0XHR3aGlsZSAoIChiID0gYi5wYXJlbnROb2RlKSApIHtcblx0XHRcdFx0XHRpZiAoIGIgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdC8qIFNvcnRpbmdcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIERvY3VtZW50IG9yZGVyIHNvcnRpbmdcblx0c29ydE9yZGVyID0gaGFzQ29tcGFyZSA/XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydCBvbiBtZXRob2QgZXhpc3RlbmNlIGlmIG9ubHkgb25lIGlucHV0IGhhcyBjb21wYXJlRG9jdW1lbnRQb3NpdGlvblxuXHRcdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHRyZXR1cm4gY29tcGFyZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdFx0Y29tcGFyZSA9ICggYS5vd25lckRvY3VtZW50IHx8IGEgKSA9PT0gKCBiLm93bmVyRG9jdW1lbnQgfHwgYiApID9cblx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdFx0MTtcblxuXHRcdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdCghc3VwcG9ydC5zb3J0RGV0YWNoZWQgJiYgYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYSApID09PSBjb21wYXJlKSApIHtcblxuXHRcdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0XHRpZiAoIGEgPT09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PT0gcHJlZmVycmVkRG9jICYmIGNvbnRhaW5zKHByZWZlcnJlZERvYywgYSkgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHRcdGlmICggYiA9PT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09PSBwcmVmZXJyZWREb2MgJiYgY29udGFpbnMocHJlZmVycmVkRG9jLCBiKSApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1haW50YWluIG9yaWdpbmFsIG9yZGVyXG5cdFx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wYXJlICYgNCA/IC0xIDogMTtcblx0fSA6XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdC8vIEV4aXQgZWFybHkgaWYgdGhlIG5vZGVzIGFyZSBpZGVudGljYWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBQYXJlbnRsZXNzIG5vZGVzIGFyZSBlaXRoZXIgZG9jdW1lbnRzIG9yIGRpc2Nvbm5lY3RlZFxuXHRcdGlmICggIWF1cCB8fCAhYnVwICkge1xuXHRcdFx0cmV0dXJuIGEgPT09IGRvY3VtZW50ID8gLTEgOlxuXHRcdFx0XHRiID09PSBkb2N1bWVudCA/IDEgOlxuXHRcdFx0XHRhdXAgPyAtMSA6XG5cdFx0XHRcdGJ1cCA/IDEgOlxuXHRcdFx0XHRzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cblx0XHQvLyBJZiB0aGUgbm9kZXMgYXJlIHNpYmxpbmdzLCB3ZSBjYW4gZG8gYSBxdWljayBjaGVja1xuXHRcdH0gZWxzZSBpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIGZ1bGwgbGlzdHMgb2YgdGhlaXIgYW5jZXN0b3JzIGZvciBjb21wYXJpc29uXG5cdFx0Y3VyID0gYTtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIucGFyZW50Tm9kZSkgKSB7XG5cdFx0XHRhcC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cdFx0Y3VyID0gYjtcblx0XHR3aGlsZSAoIChjdXIgPSBjdXIucGFyZW50Tm9kZSkgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cblx0XHQvLyBXYWxrIGRvd24gdGhlIHRyZWUgbG9va2luZyBmb3IgYSBkaXNjcmVwYW5jeVxuXHRcdHdoaWxlICggYXBbaV0gPT09IGJwW2ldICkge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiBpID9cblx0XHRcdC8vIERvIGEgc2libGluZyBjaGVjayBpZiB0aGUgbm9kZXMgaGF2ZSBhIGNvbW1vbiBhbmNlc3RvclxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFtpXSwgYnBbaV0gKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSBub2RlcyBpbiBvdXIgZG9jdW1lbnQgc29ydCBmaXJzdFxuXHRcdFx0YXBbaV0gPT09IHByZWZlcnJlZERvYyA/IC0xIDpcblx0XHRcdGJwW2ldID09PSBwcmVmZXJyZWREb2MgPyAxIDpcblx0XHRcdDA7XG5cdH07XG5cblx0cmV0dXJuIGRvY3VtZW50O1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IGF0dHJpYnV0ZSBzZWxlY3RvcnMgYXJlIHF1b3RlZFxuXHRleHByID0gZXhwci5yZXBsYWNlKCByYXR0cmlidXRlUXVvdGVzLCBcIj0nJDEnXVwiICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCFjb21waWxlckNhY2hlWyBleHByICsgXCIgXCIgXSAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cdFx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7fVxuXHR9XG5cblx0cmV0dXJuIFNpenpsZSggZXhwciwgZG9jdW1lbnQsIG51bGwsIFsgZWxlbSBdICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID9cblx0XHR2YWwgOlxuXHRcdHN1cHBvcnQuYXR0cmlidXRlcyB8fCAhZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKSA6XG5cdFx0XHQodmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKG5hbWUpKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoIChlbGVtID0gcmVzdWx0c1tpKytdKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdHdoaWxlICggKG5vZGUgPSBlbGVtW2krK10pICkge1xuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKGpRdWVyeSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbM10gPSAoIG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzJdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWzNdID0gXCIgXCIgKyBtYXRjaFszXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzFdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWzNdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbMF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWzRdID0gKyggbWF0Y2hbNF0gPyBtYXRjaFs1XSArIChtYXRjaFs2XSB8fCAxKSA6IDIgKiAoIG1hdGNoWzNdID09PSBcImV2ZW5cIiB8fCBtYXRjaFszXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWzVdID0gKyggKCBtYXRjaFs3XSArIG1hdGNoWzhdICkgfHwgbWF0Y2hbM10gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFszXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFswXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWzZdICYmIG1hdGNoWzJdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwcltcIkNISUxEXCJdLnRlc3QoIG1hdGNoWzBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFszXSApIHtcblx0XHRcdFx0bWF0Y2hbMl0gPSBtYXRjaFs0XSB8fCBtYXRjaFs1XSB8fCBcIlwiO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdChleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSkgJiZcblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdChleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGgpICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWzBdID0gbWF0Y2hbMF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsyXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQocGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkpICYmXG5cdFx0XHRcdGNsYXNzQ2FjaGUoIGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCggdHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIgKTtcblx0XHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbmFtZSwgb3BlcmF0b3IsIGNoZWNrICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gU2l6emxlLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCIhPVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggIW9wZXJhdG9yICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ICs9IFwiXCI7XG5cblx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIj1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiE9XCIgPyByZXN1bHQgIT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJePVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPT09IDAgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIio9XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIkPVwiID8gY2hlY2sgJiYgcmVzdWx0LnNsaWNlKCAtY2hlY2subGVuZ3RoICkgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ+PVwiID8gKCBcIiBcIiArIHJlc3VsdC5yZXBsYWNlKCByd2hpdGVzcGFjZSwgXCIgXCIgKSArIFwiIFwiICkuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ8PVwiID8gcmVzdWx0ID09PSBjaGVjayB8fCByZXN1bHQuc2xpY2UoIDAsIGNoZWNrLmxlbmd0aCArIDEgKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdFx0ZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCB0eXBlLCB3aGF0LCBhcmd1bWVudCwgZmlyc3QsIGxhc3QgKSB7XG5cdFx0XHR2YXIgc2ltcGxlID0gdHlwZS5zbGljZSggMCwgMyApICE9PSBcIm50aFwiLFxuXHRcdFx0XHRmb3J3YXJkID0gdHlwZS5zbGljZSggLTQgKSAhPT0gXCJsYXN0XCIsXG5cdFx0XHRcdG9mVHlwZSA9IHdoYXQgPT09IFwib2YtdHlwZVwiO1xuXG5cdFx0XHRyZXR1cm4gZmlyc3QgPT09IDEgJiYgbGFzdCA9PT0gMCA/XG5cblx0XHRcdFx0Ly8gU2hvcnRjdXQgZm9yIDpudGgtKihuKVxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gISFlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdH0gOlxuXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGNhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSwgbm9kZSwgbm9kZUluZGV4LCBzdGFydCxcblx0XHRcdFx0XHRcdGRpciA9IHNpbXBsZSAhPT0gZm9yd2FyZCA/IFwibmV4dFNpYmxpbmdcIiA6IFwicHJldmlvdXNTaWJsaW5nXCIsXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0XHRuYW1lID0gb2ZUeXBlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHVzZUNhY2hlID0gIXhtbCAmJiAhb2ZUeXBlLFxuXHRcdFx0XHRcdFx0ZGlmZiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIDooZmlyc3R8bGFzdHxvbmx5KS0oY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0XHRcdGlmICggc2ltcGxlICkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIGRpciApIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gbm9kZVsgZGlyIF0pICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmV2ZXJzZSBkaXJlY3Rpb24gZm9yIDpvbmx5LSogKGlmIHdlIGhhdmVuJ3QgeWV0IGRvbmUgc28pXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBkaXIgPSB0eXBlID09PSBcIm9ubHlcIiAmJiAhc3RhcnQgJiYgXCJuZXh0U2libGluZ1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzdGFydCA9IFsgZm9yd2FyZCA/IHBhcmVudC5maXJzdENoaWxkIDogcGFyZW50Lmxhc3RDaGlsZCBdO1xuXG5cdFx0XHRcdFx0XHQvLyBub24teG1sIDpudGgtY2hpbGQoLi4uKSBzdG9yZXMgY2FjaGUgZGF0YSBvbiBgcGFyZW50YFxuXHRcdFx0XHRcdFx0aWYgKCBmb3J3YXJkICYmIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXG5cdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHBhcmVudDtcblx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAobm9kZVsgZXhwYW5kbyBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0KG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleCAmJiBjYWNoZVsgMiBdO1xuXHRcdFx0XHRcdFx0XHRub2RlID0gbm9kZUluZGV4ICYmIHBhcmVudC5jaGlsZE5vZGVzWyBub2RlSW5kZXggXTtcblxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIChub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmFsbGJhY2sgdG8gc2Vla2luZyBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHQoZGlmZiA9IG5vZGVJbmRleCA9IDApIHx8IHN0YXJ0LnBvcCgpKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFdoZW4gZm91bmQsIGNhY2hlIGluZGV4ZXMgb24gYHBhcmVudGAgYW5kIGJyZWFrXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICYmICsrZGlmZiAmJiBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKG5vZGVbIGV4cGFuZG8gXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLilcblx0XHRcdFx0XHRcdFx0Ly8gb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpZmYgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0XHRcdC8vIFVzZSB0aGUgc2FtZSBsb29wIGFzIGFib3ZlIHRvIHNlZWsgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAobm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdChkaWZmID0gbm9kZUluZGV4ID0gMCkgfHwgc3RhcnQucG9wKCkpICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsrZGlmZiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYWNoZSB0aGUgaW5kZXggb2YgZWFjaCBlbmNvdW50ZXJlZCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAobm9kZVsgZXhwYW5kbyBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQob3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZiggc2VlZCwgbWF0Y2hlZFtpXSApO1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpZHggXSA9ICEoIG1hdGNoZXNbIGlkeCBdID0gbWF0Y2hlZFtpXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pIDpcblx0XHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmbiggZWxlbSwgMCwgYXJncyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9XG5cdH0sXG5cblx0cHNldWRvczoge1xuXHRcdC8vIFBvdGVudGlhbGx5IGNvbXBsZXggcHNldWRvc1xuXHRcdFwibm90XCI6IG1hcmtGdW5jdGlvbihmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHQvLyBUcmltIHRoZSBzZWxlY3RvciBwYXNzZWQgdG8gY29tcGlsZVxuXHRcdFx0Ly8gdG8gYXZvaWQgdHJlYXRpbmcgbGVhZGluZyBhbmQgdHJhaWxpbmdcblx0XHRcdC8vIHNwYWNlcyBhcyBjb21iaW5hdG9yc1xuXHRcdFx0dmFyIGlucHV0ID0gW10sXG5cdFx0XHRcdHJlc3VsdHMgPSBbXSxcblx0XHRcdFx0bWF0Y2hlciA9IGNvbXBpbGUoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSApO1xuXG5cdFx0XHRyZXR1cm4gbWF0Y2hlclsgZXhwYW5kbyBdID9cblx0XHRcdFx0bWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQgPSBtYXRjaGVyKCBzZWVkLCBudWxsLCB4bWwsIFtdICksXG5cdFx0XHRcdFx0XHRpID0gc2VlZC5sZW5ndGg7XG5cblx0XHRcdFx0XHQvLyBNYXRjaCBlbGVtZW50cyB1bm1hdGNoZWQgYnkgYG1hdGNoZXJgXG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoIChlbGVtID0gdW5tYXRjaGVkW2ldKSApIHtcblx0XHRcdFx0XHRcdFx0c2VlZFtpXSA9ICEobWF0Y2hlc1tpXSA9IGVsZW0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkgOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdGlucHV0WzBdID0gZWxlbTtcblx0XHRcdFx0XHRtYXRjaGVyKCBpbnB1dCwgbnVsbCwgeG1sLCByZXN1bHRzICk7XG5cdFx0XHRcdFx0Ly8gRG9uJ3Qga2VlcCB0aGUgZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdFx0XHRpbnB1dFswXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuICFyZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHR9O1xuXHRcdH0pLFxuXG5cdFx0XCJoYXNcIjogbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFNpenpsZSggc2VsZWN0b3IsIGVsZW0gKS5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblx0XHR9KSxcblxuXHRcdFwiY29udGFpbnNcIjogbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS50ZXh0Q29udGVudCB8fCBlbGVtLmlubmVyVGV4dCB8fCBnZXRUZXh0KCBlbGVtICkgKS5pbmRleE9mKCB0ZXh0ICkgPiAtMTtcblx0XHRcdH07XG5cdFx0fSksXG5cblx0XHQvLyBcIldoZXRoZXIgYW4gZWxlbWVudCBpcyByZXByZXNlbnRlZCBieSBhIDpsYW5nKCkgc2VsZWN0b3Jcblx0XHQvLyBpcyBiYXNlZCBzb2xlbHkgb24gdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZVxuXHRcdC8vIGJlaW5nIGVxdWFsIHRvIHRoZSBpZGVudGlmaWVyIEMsXG5cdFx0Ly8gb3IgYmVnaW5uaW5nIHdpdGggdGhlIGlkZW50aWZpZXIgQyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSBcIi1cIi5cblx0XHQvLyBUaGUgbWF0Y2hpbmcgb2YgQyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWUgaXMgcGVyZm9ybWVkIGNhc2UtaW5zZW5zaXRpdmVseS5cblx0XHQvLyBUaGUgaWRlbnRpZmllciBDIGRvZXMgbm90IGhhdmUgdG8gYmUgYSB2YWxpZCBsYW5ndWFnZSBuYW1lLlwiXG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNsYW5nLXBzZXVkb1xuXHRcdFwibGFuZ1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBsYW5nICkge1xuXHRcdFx0Ly8gbGFuZyB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgaWRlbnRpZmllclxuXHRcdFx0aWYgKCAhcmlkZW50aWZpZXIudGVzdChsYW5nIHx8IFwiXCIpICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgbGFuZzogXCIgKyBsYW5nICk7XG5cdFx0XHR9XG5cdFx0XHRsYW5nID0gbGFuZy5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBlbGVtTGFuZztcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGlmICggKGVsZW1MYW5nID0gZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0XHRcdFx0ZWxlbS5sYW5nIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKFwieG1sOmxhbmdcIikgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKSApIHtcblxuXHRcdFx0XHRcdFx0ZWxlbUxhbmcgPSBlbGVtTGFuZy50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1MYW5nID09PSBsYW5nIHx8IGVsZW1MYW5nLmluZGV4T2YoIGxhbmcgKyBcIi1cIiApID09PSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB3aGlsZSAoIChlbGVtID0gZWxlbS5wYXJlbnROb2RlKSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSksXG5cblx0XHQvLyBNaXNjZWxsYW5lb3VzXG5cdFx0XCJ0YXJnZXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdHJldHVybiBoYXNoICYmIGhhc2guc2xpY2UoIDEgKSA9PT0gZWxlbS5pZDtcblx0XHR9LFxuXG5cdFx0XCJyb290XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY0VsZW07XG5cdFx0fSxcblxuXHRcdFwiZm9jdXNcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoIWRvY3VtZW50Lmhhc0ZvY3VzIHx8IGRvY3VtZW50Lmhhc0ZvY3VzKCkpICYmICEhKGVsZW0udHlwZSB8fCBlbGVtLmhyZWYgfHwgfmVsZW0udGFiSW5kZXgpO1xuXHRcdH0sXG5cblx0XHQvLyBCb29sZWFuIHByb3BlcnRpZXNcblx0XHRcImVuYWJsZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZmFsc2U7XG5cdFx0fSxcblxuXHRcdFwiZGlzYWJsZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJjaGVja2VkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0Ly8gSW4gQ1NTMywgOmNoZWNrZWQgc2hvdWxkIHJldHVybiBib3RoIGNoZWNrZWQgYW5kIHNlbGVjdGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0dmFyIG5vZGVOYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIChub2RlTmFtZSA9PT0gXCJpbnB1dFwiICYmICEhZWxlbS5jaGVja2VkKSB8fCAobm9kZU5hbWUgPT09IFwib3B0aW9uXCIgJiYgISFlbGVtLnNlbGVjdGVkKTtcblx0XHR9LFxuXG5cdFx0XCJzZWxlY3RlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdC8vIENvbnRlbnRzXG5cdFx0XCJlbXB0eVwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jZW1wdHktcHNldWRvXG5cdFx0XHQvLyA6ZW1wdHkgaXMgbmVnYXRlZCBieSBlbGVtZW50ICgxKSBvciBjb250ZW50IG5vZGVzICh0ZXh0OiAzOyBjZGF0YTogNDsgZW50aXR5IHJlZjogNSksXG5cdFx0XHQvLyAgIGJ1dCBub3QgYnkgb3RoZXJzIChjb21tZW50OiA4OyBwcm9jZXNzaW5nIGluc3RydWN0aW9uOiA3OyBldGMuKVxuXHRcdFx0Ly8gbm9kZVR5cGUgPCA2IHdvcmtzIGJlY2F1c2UgYXR0cmlidXRlcyAoMikgZG8gbm90IGFwcGVhciBhcyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA8IDYgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJwYXJlbnRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIUV4cHIucHNldWRvc1tcImVtcHR5XCJdKCBlbGVtICk7XG5cdFx0fSxcblxuXHRcdC8vIEVsZW1lbnQvaW5wdXQgdHlwZXNcblx0XHRcImhlYWRlclwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaGVhZGVyLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJpbnB1dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaW5wdXRzLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJidXR0b25cIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCI7XG5cdFx0fSxcblxuXHRcdFwidGV4dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBhdHRyO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmXG5cdFx0XHRcdGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCIgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTw4XG5cdFx0XHRcdC8vIE5ldyBIVE1MNSBhdHRyaWJ1dGUgdmFsdWVzIChlLmcuLCBcInNlYXJjaFwiKSBhcHBlYXIgd2l0aCBlbGVtLnR5cGUgPT09IFwidGV4dFwiXG5cdFx0XHRcdCggKGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZShcInR5cGVcIikpID09IG51bGwgfHwgYXR0ci50b0xvd2VyQ2FzZSgpID09PSBcInRleHRcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBQb3NpdGlvbi1pbi1jb2xsZWN0aW9uXG5cdFx0XCJmaXJzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFsgMCBdO1xuXHRcdH0pLFxuXG5cdFx0XCJsYXN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIFsgbGVuZ3RoIC0gMSBdO1xuXHRcdH0pLFxuXG5cdFx0XCJlcVwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gWyBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50IF07XG5cdFx0fSksXG5cblx0XHRcImV2ZW5cIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyhmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSksXG5cblx0XHRcIm9kZFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9KSxcblxuXHRcdFwibHRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyhmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyAtLWkgPj0gMDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0pLFxuXG5cdFx0XCJndFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7ICsraSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0pXG5cdH1cbn07XG5cbkV4cHIucHNldWRvc1tcIm50aFwiXSA9IEV4cHIucHNldWRvc1tcImVxXCJdO1xuXG4vLyBBZGQgYnV0dG9uL2lucHV0IHR5cGUgcHNldWRvc1xuZm9yICggaSBpbiB7IHJhZGlvOiB0cnVlLCBjaGVja2JveDogdHJ1ZSwgZmlsZTogdHJ1ZSwgcGFzc3dvcmQ6IHRydWUsIGltYWdlOiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlSW5wdXRQc2V1ZG8oIGkgKTtcbn1cbmZvciAoIGkgaW4geyBzdWJtaXQ6IHRydWUsIHJlc2V0OiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlQnV0dG9uUHNldWRvKCBpICk7XG59XG5cbi8vIEVhc3kgQVBJIGZvciBjcmVhdGluZyBuZXcgc2V0RmlsdGVyc1xuZnVuY3Rpb24gc2V0RmlsdGVycygpIHt9XG5zZXRGaWx0ZXJzLnByb3RvdHlwZSA9IEV4cHIuZmlsdGVycyA9IEV4cHIucHNldWRvcztcbkV4cHIuc2V0RmlsdGVycyA9IG5ldyBzZXRGaWx0ZXJzKCk7XG5cbnRva2VuaXplID0gU2l6emxlLnRva2VuaXplID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAobWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFswXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCAodG9rZW5zID0gW10pICk7XG5cdFx0fVxuXG5cdFx0bWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gQ29tYmluYXRvcnNcblx0XHRpZiAoIChtYXRjaCA9IHJjb21iaW5hdG9ycy5leGVjKCBzb0ZhciApKSApIHtcblx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0Ly8gQ2FzdCBkZXNjZW5kYW50IGNvbWJpbmF0b3JzIHRvIHNwYWNlXG5cdFx0XHRcdHR5cGU6IG1hdGNoWzBdLnJlcGxhY2UoIHJ0cmltLCBcIiBcIiApXG5cdFx0XHR9KTtcblx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmlsdGVyc1xuXHRcdGZvciAoIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoIChtYXRjaCA9IG1hdGNoRXhwclsgdHlwZSBdLmV4ZWMoIHNvRmFyICkpICYmICghcHJlRmlsdGVyc1sgdHlwZSBdIHx8XG5cdFx0XHRcdChtYXRjaCA9IHByZUZpbHRlcnNbIHR5cGUgXSggbWF0Y2ggKSkpICkge1xuXHRcdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdFx0bWF0Y2hlczogbWF0Y2hcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhbWF0Y2hlZCApIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnZhbGlkIGV4Y2Vzc1xuXHQvLyBpZiB3ZSdyZSBqdXN0IHBhcnNpbmdcblx0Ly8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvciBvciByZXR1cm4gdG9rZW5zXG5cdHJldHVybiBwYXJzZU9ubHkgP1xuXHRcdHNvRmFyLmxlbmd0aCA6XG5cdFx0c29GYXIgP1xuXHRcdFx0U2l6emxlLmVycm9yKCBzZWxlY3RvciApIDpcblx0XHRcdC8vIENhY2hlIHRoZSB0b2tlbnNcblx0XHRcdHRva2VuQ2FjaGUoIHNlbGVjdG9yLCBncm91cHMgKS5zbGljZSggMCApO1xufTtcblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1tpXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBkaXIgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoZWxlbSA9IGVsZW1bIGRpciBdKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIG9sZENhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSxcblx0XHRcdFx0bmV3Q2FjaGUgPSBbIGRpcnJ1bnMsIGRvbmVOYW1lIF07XG5cblx0XHRcdC8vIFdlIGNhbid0IHNldCBhcmJpdHJhcnkgZGF0YSBvbiBYTUwgbm9kZXMsIHNvIHRoZXkgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbWJpbmF0b3IgY2FjaGluZ1xuXHRcdFx0aWYgKCB4bWwgKSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSBlbGVtWyBkaXIgXSkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSBlbGVtWyBkaXIgXSkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gZWxlbVsgZXhwYW5kbyBdIHx8IChlbGVtWyBleHBhbmRvIF0gPSB7fSk7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gfHwgKG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSA9IHt9KTtcblxuXHRcdFx0XHRcdFx0aWYgKCAob2xkQ2FjaGUgPSB1bmlxdWVDYWNoZVsgZGlyIF0pICYmXG5cdFx0XHRcdFx0XHRcdG9sZENhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgb2xkQ2FjaGVbIDEgXSA9PT0gZG9uZU5hbWUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQXNzaWduIHRvIG5ld0NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChuZXdDYWNoZVsgMiBdID0gb2xkQ2FjaGVbIDIgXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXVzZSBuZXdjYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyBkaXIgXSA9IG5ld0NhY2hlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEEgbWF0Y2ggbWVhbnMgd2UncmUgZG9uZTsgYSBmYWlsIG1lYW5zIHdlIGhhdmUgdG8ga2VlcCBjaGVja2luZ1xuXHRcdFx0XHRcdFx0XHRpZiAoIChuZXdDYWNoZVsgMiBdID0gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkpICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzW2ldKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWzBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzW2ldLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGNvbmRlbnNlKCB1bm1hdGNoZWQsIG1hcCwgZmlsdGVyLCBjb250ZXh0LCB4bWwgKSB7XG5cdHZhciBlbGVtLFxuXHRcdG5ld1VubWF0Y2hlZCA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGxlbiA9IHVubWF0Y2hlZC5sZW5ndGgsXG5cdFx0bWFwcGVkID0gbWFwICE9IG51bGw7XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoZWxlbSA9IHVubWF0Y2hlZFtpXSkgKSB7XG5cdFx0XHRpZiAoICFmaWx0ZXIgfHwgZmlsdGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0bmV3VW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0aWYgKCBtYXBwZWQgKSB7XG5cdFx0XHRcdFx0bWFwLnB1c2goIGkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdVbm1hdGNoZWQ7XG59XG5cbmZ1bmN0aW9uIHNldE1hdGNoZXIoIHByZUZpbHRlciwgc2VsZWN0b3IsIG1hdGNoZXIsIHBvc3RGaWx0ZXIsIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApIHtcblx0aWYgKCBwb3N0RmlsdGVyICYmICFwb3N0RmlsdGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbHRlciA9IHNldE1hdGNoZXIoIHBvc3RGaWx0ZXIgKTtcblx0fVxuXHRpZiAoIHBvc3RGaW5kZXIgJiYgIXBvc3RGaW5kZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmluZGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICk7XG5cdH1cblx0cmV0dXJuIG1hcmtGdW5jdGlvbihmdW5jdGlvbiggc2VlZCwgcmVzdWx0cywgY29udGV4dCwgeG1sICkge1xuXHRcdHZhciB0ZW1wLCBpLCBlbGVtLFxuXHRcdFx0cHJlTWFwID0gW10sXG5cdFx0XHRwb3N0TWFwID0gW10sXG5cdFx0XHRwcmVleGlzdGluZyA9IHJlc3VsdHMubGVuZ3RoLFxuXG5cdFx0XHQvLyBHZXQgaW5pdGlhbCBlbGVtZW50cyBmcm9tIHNlZWQgb3IgY29udGV4dFxuXHRcdFx0ZWxlbXMgPSBzZWVkIHx8IG11bHRpcGxlQ29udGV4dHMoIHNlbGVjdG9yIHx8IFwiKlwiLCBjb250ZXh0Lm5vZGVUeXBlID8gWyBjb250ZXh0IF0gOiBjb250ZXh0LCBbXSApLFxuXG5cdFx0XHQvLyBQcmVmaWx0ZXIgdG8gZ2V0IG1hdGNoZXIgaW5wdXQsIHByZXNlcnZpbmcgYSBtYXAgZm9yIHNlZWQtcmVzdWx0cyBzeW5jaHJvbml6YXRpb25cblx0XHRcdG1hdGNoZXJJbiA9IHByZUZpbHRlciAmJiAoIHNlZWQgfHwgIXNlbGVjdG9yICkgP1xuXHRcdFx0XHRjb25kZW5zZSggZWxlbXMsIHByZU1hcCwgcHJlRmlsdGVyLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdGVsZW1zLFxuXG5cdFx0XHRtYXRjaGVyT3V0ID0gbWF0Y2hlciA/XG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgYSBwb3N0RmluZGVyLCBvciBmaWx0ZXJlZCBzZWVkLCBvciBub24tc2VlZCBwb3N0RmlsdGVyIG9yIHByZWV4aXN0aW5nIHJlc3VsdHMsXG5cdFx0XHRcdHBvc3RGaW5kZXIgfHwgKCBzZWVkID8gcHJlRmlsdGVyIDogcHJlZXhpc3RpbmcgfHwgcG9zdEZpbHRlciApID9cblxuXHRcdFx0XHRcdC8vIC4uLmludGVybWVkaWF0ZSBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFtdIDpcblxuXHRcdFx0XHRcdC8vIC4uLm90aGVyd2lzZSB1c2UgcmVzdWx0cyBkaXJlY3RseVxuXHRcdFx0XHRcdHJlc3VsdHMgOlxuXHRcdFx0XHRtYXRjaGVySW47XG5cblx0XHQvLyBGaW5kIHByaW1hcnkgbWF0Y2hlc1xuXHRcdGlmICggbWF0Y2hlciApIHtcblx0XHRcdG1hdGNoZXIoIG1hdGNoZXJJbiwgbWF0Y2hlck91dCwgY29udGV4dCwgeG1sICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcG9zdEZpbHRlclxuXHRcdGlmICggcG9zdEZpbHRlciApIHtcblx0XHRcdHRlbXAgPSBjb25kZW5zZSggbWF0Y2hlck91dCwgcG9zdE1hcCApO1xuXHRcdFx0cG9zdEZpbHRlciggdGVtcCwgW10sIGNvbnRleHQsIHhtbCApO1xuXG5cdFx0XHQvLyBVbi1tYXRjaCBmYWlsaW5nIGVsZW1lbnRzIGJ5IG1vdmluZyB0aGVtIGJhY2sgdG8gbWF0Y2hlckluXG5cdFx0XHRpID0gdGVtcC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAoZWxlbSA9IHRlbXBbaV0pICkge1xuXHRcdFx0XHRcdG1hdGNoZXJPdXRbIHBvc3RNYXBbaV0gXSA9ICEobWF0Y2hlckluWyBwb3N0TWFwW2ldIF0gPSBlbGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdGlmICggcG9zdEZpbmRlciB8fCBwcmVGaWx0ZXIgKSB7XG5cdFx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblx0XHRcdFx0XHQvLyBHZXQgdGhlIGZpbmFsIG1hdGNoZXJPdXQgYnkgY29uZGVuc2luZyB0aGlzIGludGVybWVkaWF0ZSBpbnRvIHBvc3RGaW5kZXIgY29udGV4dHNcblx0XHRcdFx0XHR0ZW1wID0gW107XG5cdFx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoZWxlbSA9IG1hdGNoZXJPdXRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlIG1hdGNoZXJJbiBzaW5jZSBlbGVtIGlzIG5vdCB5ZXQgYSBmaW5hbCBtYXRjaFxuXHRcdFx0XHRcdFx0XHR0ZW1wLnB1c2goIChtYXRjaGVySW5baV0gPSBlbGVtKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCAobWF0Y2hlck91dCA9IFtdKSwgdGVtcCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIG1hdGNoZWQgZWxlbWVudHMgZnJvbSBzZWVkIHRvIHJlc3VsdHMgdG8ga2VlcCB0aGVtIHN5bmNocm9uaXplZFxuXHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdGlmICggKGVsZW0gPSBtYXRjaGVyT3V0W2ldKSAmJlxuXHRcdFx0XHRcdFx0KHRlbXAgPSBwb3N0RmluZGVyID8gaW5kZXhPZiggc2VlZCwgZWxlbSApIDogcHJlTWFwW2ldKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkW3RlbXBdID0gIShyZXN1bHRzW3RlbXBdID0gZWxlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbMF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVtcIiBcIl0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YoIGNoZWNrQ29udGV4dCwgZWxlbSApID4gLTE7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoZXJzID0gWyBmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIHJldCA9ICggIWxlYWRpbmdSZWxhdGl2ZSAmJiAoIHhtbCB8fCBjb250ZXh0ICE9PSBvdXRlcm1vc3RDb250ZXh0ICkgKSB8fCAoXG5cdFx0XHRcdChjaGVja0NvbnRleHQgPSBjb250ZXh0KS5ub2RlVHlwZSA/XG5cdFx0XHRcdFx0bWF0Y2hDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdFx0bWF0Y2hBbnlDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSApO1xuXHRcdFx0Ly8gQXZvaWQgaGFuZ2luZyBvbnRvIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRjaGVja0NvbnRleHQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9IF07XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAobWF0Y2hlciA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1tpXS50eXBlIF0pICkge1xuXHRcdFx0bWF0Y2hlcnMgPSBbIGFkZENvbWJpbmF0b3IoZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksIG1hdGNoZXIpIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXIgPSBFeHByLmZpbHRlclsgdG9rZW5zW2ldLnR5cGUgXS5hcHBseSggbnVsbCwgdG9rZW5zW2ldLm1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gUmV0dXJuIHNwZWNpYWwgdXBvbiBzZWVpbmcgYSBwb3NpdGlvbmFsIG1hdGNoZXJcblx0XHRcdGlmICggbWF0Y2hlclsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHQvLyBGaW5kIHRoZSBuZXh0IHJlbGF0aXZlIG9wZXJhdG9yIChpZiBhbnkpIGZvciBwcm9wZXIgaGFuZGxpbmdcblx0XHRcdFx0aiA9ICsraTtcblx0XHRcdFx0Zm9yICggOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyB0b2tlbnNbal0udHlwZSBdICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZXRNYXRjaGVyKFxuXHRcdFx0XHRcdGkgPiAxICYmIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLFxuXHRcdFx0XHRcdGkgPiAxICYmIHRvU2VsZWN0b3IoXG5cdFx0XHRcdFx0XHQvLyBJZiB0aGUgcHJlY2VkaW5nIHRva2VuIHdhcyBhIGRlc2NlbmRhbnQgY29tYmluYXRvciwgaW5zZXJ0IGFuIGltcGxpY2l0IGFueS1lbGVtZW50IGAqYFxuXHRcdFx0XHRcdFx0dG9rZW5zLnNsaWNlKCAwLCBpIC0gMSApLmNvbmNhdCh7IHZhbHVlOiB0b2tlbnNbIGkgLSAyIF0udHlwZSA9PT0gXCIgXCIgPyBcIipcIiA6IFwiXCIgfSlcblx0XHRcdFx0XHQpLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSxcblx0XHRcdFx0XHRtYXRjaGVyLFxuXHRcdFx0XHRcdGkgPCBqICYmIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMuc2xpY2UoIGksIGogKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgbWF0Y2hlckZyb21Ub2tlbnMoICh0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIGogKSkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIHRvU2VsZWN0b3IoIHRva2VucyApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVycy5wdXNoKCBtYXRjaGVyICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSB7XG5cdHZhciBieVNldCA9IHNldE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0YnlFbGVtZW50ID0gZWxlbWVudE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0c3VwZXJNYXRjaGVyID0gZnVuY3Rpb24oIHNlZWQsIGNvbnRleHQsIHhtbCwgcmVzdWx0cywgb3V0ZXJtb3N0ICkge1xuXHRcdFx0dmFyIGVsZW0sIGosIG1hdGNoZXIsXG5cdFx0XHRcdG1hdGNoZWRDb3VudCA9IDAsXG5cdFx0XHRcdGkgPSBcIjBcIixcblx0XHRcdFx0dW5tYXRjaGVkID0gc2VlZCAmJiBbXSxcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRjb250ZXh0QmFja3VwID0gb3V0ZXJtb3N0Q29udGV4dCxcblx0XHRcdFx0Ly8gV2UgbXVzdCBhbHdheXMgaGF2ZSBlaXRoZXIgc2VlZCBlbGVtZW50cyBvciBvdXRlcm1vc3QgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFtcIlRBR1wiXSggXCIqXCIsIG91dGVybW9zdCApLFxuXHRcdFx0XHQvLyBVc2UgaW50ZWdlciBkaXJydW5zIGlmZiB0aGlzIGlzIHRoZSBvdXRlcm1vc3QgbWF0Y2hlclxuXHRcdFx0XHRkaXJydW5zVW5pcXVlID0gKGRpcnJ1bnMgKz0gY29udGV4dEJhY2t1cCA9PSBudWxsID8gMSA6IE1hdGgucmFuZG9tKCkgfHwgMC4xKSxcblx0XHRcdFx0bGVuID0gZWxlbXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHQgPT09IGRvY3VtZW50IHx8IGNvbnRleHQgfHwgb3V0ZXJtb3N0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gU3VwcG9ydDogSUU8OSwgU2FmYXJpXG5cdFx0XHQvLyBUb2xlcmF0ZSBOb2RlTGlzdCBwcm9wZXJ0aWVzIChJRTogXCJsZW5ndGhcIjsgU2FmYXJpOiA8bnVtYmVyPikgbWF0Y2hpbmcgZWxlbWVudHMgYnkgaWRcblx0XHRcdGZvciAoIDsgaSAhPT0gbGVuICYmIChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblx0XHRcdFx0XHRpZiAoICFjb250ZXh0ICYmIGVsZW0ub3duZXJEb2N1bWVudCAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHRcdFx0XHRcdFx0eG1sID0gIWRvY3VtZW50SXNIVE1MO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAoIChtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0IHx8IGRvY3VtZW50LCB4bWwpICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoIChlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYGlgIGlzIG5vdyB0aGUgY291bnQgb2YgZWxlbWVudHMgdmlzaXRlZCBhYm92ZSwgYW5kIGFkZGluZyBpdCB0byBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gbWFrZXMgdGhlIGxhdHRlciBub25uZWdhdGl2ZS5cblx0XHRcdG1hdGNoZWRDb3VudCArPSBpO1xuXG5cdFx0XHQvLyBBcHBseSBzZXQgZmlsdGVycyB0byB1bm1hdGNoZWQgZWxlbWVudHNcblx0XHRcdC8vIE5PVEU6IFRoaXMgY2FuIGJlIHNraXBwZWQgaWYgdGhlcmUgYXJlIG5vIHVubWF0Y2hlZCBlbGVtZW50cyAoaS5lLiwgYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIGVxdWFscyBgaWApLCB1bmxlc3Mgd2UgZGlkbid0IHZpc2l0IF9hbnlfIGVsZW1lbnRzIGluIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgaGF2ZVxuXHRcdFx0Ly8gbm8gZWxlbWVudCBtYXRjaGVycyBhbmQgbm8gc2VlZC5cblx0XHRcdC8vIEluY3JlbWVudGluZyBhbiBpbml0aWFsbHktc3RyaW5nIFwiMFwiIGBpYCBhbGxvd3MgYGlgIHRvIHJlbWFpbiBhIHN0cmluZyBvbmx5IGluIHRoYXRcblx0XHRcdC8vIGNhc2UsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgXCIwMFwiIGBtYXRjaGVkQ291bnRgIHRoYXQgZGlmZmVycyBmcm9tIGBpYCBidXQgaXMgYWxzb1xuXHRcdFx0Ly8gbnVtZXJpY2FsbHkgemVyby5cblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAobWF0Y2hlciA9IHNldE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEodW5tYXRjaGVkW2ldIHx8IHNldE1hdGNoZWRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbaV0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgbWF0Y2ggLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBtYXRjaC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggbWF0Y2hbaV0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoIHNlbGVjdG9yLCBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSApO1xuXG5cdFx0Ly8gU2F2ZSBzZWxlY3RvciBhbmQgdG9rZW5pemF0aW9uXG5cdFx0Y2FjaGVkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdH1cblx0cmV0dXJuIGNhY2hlZDtcbn07XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgd29ya3Mgd2l0aCBTaXp6bGUncyBjb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHNlbGVjdG9yIEEgc2VsZWN0b3Igb3IgYSBwcmUtY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbiBidWlsdCB3aXRoIFNpenpsZS5jb21waWxlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHRzXVxuICogQHBhcmFtIHtBcnJheX0gW3NlZWRdIEEgc2V0IG9mIGVsZW1lbnRzIHRvIG1hdGNoIGFnYWluc3RcbiAqL1xuc2VsZWN0ID0gU2l6emxlLnNlbGVjdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIGksIHRva2VucywgdG9rZW4sIHR5cGUsIGZpbmQsXG5cdFx0Y29tcGlsZWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJiBzZWxlY3Rvcixcblx0XHRtYXRjaCA9ICFzZWVkICYmIHRva2VuaXplKCAoc2VsZWN0b3IgPSBjb21waWxlZC5zZWxlY3RvciB8fCBzZWxlY3RvcikgKTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBzZWxlY3RvciBpbiB0aGUgbGlzdCBhbmQgbm8gc2VlZFxuXHQvLyAodGhlIGxhdHRlciBvZiB3aGljaCBndWFyYW50ZWVzIHVzIGNvbnRleHQpXG5cdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0Ly8gUmVkdWNlIGNvbnRleHQgaWYgdGhlIGxlYWRpbmcgY29tcG91bmQgc2VsZWN0b3IgaXMgYW4gSURcblx0XHR0b2tlbnMgPSBtYXRjaFswXSA9IG1hdGNoWzBdLnNsaWNlKCAwICk7XG5cdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAodG9rZW4gPSB0b2tlbnNbMF0pLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0XHRzdXBwb3J0LmdldEJ5SWQgJiYgY29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdFx0XHRFeHByLnJlbGF0aXZlWyB0b2tlbnNbMV0udHlwZSBdICkge1xuXG5cdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbXCJJRFwiXSggdG9rZW4ubWF0Y2hlc1swXS5yZXBsYWNlKHJ1bmVzY2FwZSwgZnVuZXNjYXBlKSwgY29udGV4dCApIHx8IFtdIClbMF07XG5cdFx0XHRpZiAoICFjb250ZXh0ICkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gUHJlY29tcGlsZWQgbWF0Y2hlcnMgd2lsbCBzdGlsbCB2ZXJpZnkgYW5jZXN0cnksIHNvIHN0ZXAgdXAgYSBsZXZlbFxuXHRcdFx0fSBlbHNlIGlmICggY29tcGlsZWQgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc2xpY2UoIHRva2Vucy5zaGlmdCgpLnZhbHVlLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRpID0gbWF0Y2hFeHByW1wibmVlZHNDb250ZXh0XCJdLnRlc3QoIHNlbGVjdG9yICkgPyAwIDogdG9rZW5zLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHRva2VuID0gdG9rZW5zW2ldO1xuXG5cdFx0XHQvLyBBYm9ydCBpZiB3ZSBoaXQgYSBjb21iaW5hdG9yXG5cdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbICh0eXBlID0gdG9rZW4udHlwZSkgXSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIChmaW5kID0gRXhwci5maW5kWyB0eXBlIF0pICkge1xuXHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0aWYgKCAoc2VlZCA9IGZpbmQoXG5cdFx0XHRcdFx0dG9rZW4ubWF0Y2hlc1swXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLFxuXHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1swXS50eXBlICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8IGNvbnRleHRcblx0XHRcdFx0KSkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiBzZWVkIGlzIGVtcHR5IG9yIG5vIHRva2VucyByZW1haW4sIHdlIGNhbiByZXR1cm4gZWFybHlcblx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWVkLmxlbmd0aCAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKTtcblx0XHRcdFx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ29tcGlsZSBhbmQgZXhlY3V0ZSBhIGZpbHRlcmluZyBmdW5jdGlvbiBpZiBvbmUgaXMgbm90IHByb3ZpZGVkXG5cdC8vIFByb3ZpZGUgYG1hdGNoYCB0byBhdm9pZCByZXRva2VuaXphdGlvbiBpZiB3ZSBtb2RpZmllZCB0aGUgc2VsZWN0b3IgYWJvdmVcblx0KCBjb21waWxlZCB8fCBjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKSApKFxuXHRcdHNlZWQsXG5cdFx0Y29udGV4dCxcblx0XHQhZG9jdW1lbnRJc0hUTUwsXG5cdFx0cmVzdWx0cyxcblx0XHQhY29udGV4dCB8fCByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fCBjb250ZXh0XG5cdCk7XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoXCJcIikuc29ydCggc29ydE9yZGVyICkuam9pbihcIlwiKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lIDE0LTM1K1xuLy8gQWx3YXlzIGFzc3VtZSBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlbid0IHBhc3NlZCB0byB0aGUgY29tcGFyaXNvbiBmdW5jdGlvblxuc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzID0gISFoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdjEgKSB7XG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZGl2MS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSApICYgMTtcbn0pO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGRpdi5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI1wiIDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGRpdi5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBkaXYuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdHJldHVybiBkaXYuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIikgPT0gbnVsbDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHRcdCh2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcblx0XHR9XG5cdH0pO1xufVxuXG4vLyBFWFBPU0VcbmlmICggdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgKSB7XG5cdGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIFNpenpsZTsgfSk7XG4vLyBTaXp6bGUgcmVxdWlyZXMgdGhhdCB0aGVyZSBiZSBhIGdsb2JhbCB3aW5kb3cgaW4gQ29tbW9uLUpTIGxpa2UgZW52aXJvbm1lbnRzXG59IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFNpenpsZTtcbn0gZWxzZSB7XG5cdHdpbmRvdy5TaXp6bGUgPSBTaXp6bGU7XG59XG4vLyBFWFBPU0VcblxufSkoIHdpbmRvdyApO1xuIl19