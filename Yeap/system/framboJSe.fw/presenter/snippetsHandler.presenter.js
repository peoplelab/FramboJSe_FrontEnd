//----------------------------------------------------------------------------------------
// File: Snippets_handler.presenter.js
//
// Desc: Resolves snippets declared into html templates - System engine
// Path: /system/framboJSe.fw/presenter
//----------------------------------------------------------------------------------------

define ([
	'require',
	'snippetsList_sys',																					// List of system snippets
	'widgetsList_sys',																					// List of system widgets
], function (require, snp_sys, wdg_sys) {

	return {
		Render: scanSnippets																			// Scan for snippets' palceholder
	}


	// FUNCTION: scanSnippets
	//  Finds the snippets in the document, invokes their constructor and replaces the placeholders whit the new DOM elements
	// PARAMS:
	//  params.domain  : domain's name (container ID) the snippet belongs to
	//  params.callBack: events handler for the new DOM elements (function)
	// RETURN:
	//  none
	function scanSnippets(params) {

		var snippetsList = [];																			// List of the defined snippets/widgets to be resolved

		// ** Step 1: Solves the system snippets (default) **
		// Snippets definition:
		snippetsList.push({
			type   : 'snippets',																		// Type of elements
			archive: snp_sys.List(),																	// List of defined element
			jsPath : _sysFrameWork + 'presenter/snippets/',												// Path of the files of the elements' constructors
			tagName: 'snp_'																				// Prefix: used to build the tag name
		})
		// Widgets definition:
		snippetsList.push({
			type   : 'widgets',																			// Type of elements
			archive: wdg_sys.List(),																	// List of defined element
			jsPath : _sysFrameWork + 'presenter/widgets/',												// Path of the files of the elements' constructors
			tagName: 'widget_'																			// Prefix: used to build the tag name
		})
		// Snippets resolution:
		snippetsSolver({																				// Replaces the listed snippets with their HTML code
			List: snippetsList,																			// Snippets list
			Pars: params																				// External params (from calling function)
		});


		// ** Step 2: Solves the public snippets (specific for the current web application) **
		// 1 - Snippets:
		SystemJS.import('snippetsList_pub').then(function (controller) {

			var subList = [{																			// Sublist of snippets/widgets
				type   : 'snippets',																	// Type of elements
				archive: controller.List(),																// List of defined element
				jsPath : _pubPaths.framework  + 'snippets/',											// Path of the files of the elements' constructors
				tagName: 'snp_'																			// Prefix: used to build the tag name
			}];
			snippetsSolver({																			// Replaces the listed snippets with their HTML code
				List: subList,																			// Snippets list
				Pars: params																			// External params (from calling function)
			});
		});
		// 2 - Widgets:
		SystemJS.import('widgetsList_pub').then(function (controller) {

			var subList = [{																			// Sublist of snippets/widgets
				type   : 'widgets',																		// Type of elements
				archive: controller.List(),																// List of defined element
				jsPath : _pubPaths.framework + 'widgets/',												// Path of the files of the elements' constructors
				tagName: 'widget_'																		// Prefix: used to build the tag name
			}];
			snippetsSolver({																			// Replaces the listed snippets with their HTML code
				List: subList,																			// Snippets list
				Pars: params																			// External params (from calling function)
			});
		});

		
		// ** Step 3: Solves the private snippets (specific for the current web application) **
		if (__PageScope == 'private') {
			// 1 - Snippets:
			SystemJS.import('snippetsList_pvt').then(function (controller) {

				var subList = [{																		// Sublist of snippets/widgets
					type   : 'snippets',																// Type of elements
					archive: controller.List(),															// List of defined element
					jsPath : _pvtPaths.framework + 'snippets/',											// Path of the files of the elements' constructors
					tagName: 'snp_'																		// Prefix: used to build the tag name
				}];
				snippetsSolver({																		// Replaces the listed snippets with their HTML code
					List: subList,																		// Snippets list
					Pars: params																		// External params (from calling function)
				});
			});
			// 2 - Widgets:
			SystemJS.import('widgetsList_pvt').then(function (controller) {

				var subList = [{																		// Sublist of snippets/widgets
					type   : 'widgets',																	// Type of elements
					archive: controller.List(),															// List of defined element
					jsPath : _pvtPaths.framework + 'widgets/',											// Path of the files of the elements' constructors
					tagName: 'widget_'																	// Prefix: used to build the tag name
				}];
				snippetsSolver({																		// Replaces the listed snippets with their HTML code
					List: subList,																		// Snippets list
					Pars: params																		// External params (from calling function)
				});
			});
		}

	}



	// FUNCTION: snippetsSolver
	//  Solves the snippets into the template
	// PARAMS:
	//	params.List          : list of defined snippets
	//  params.Pars.domain   : domain's name (container ID) the snippet belongs to
	//  params.Pars.callBack : events handler for the new DOM elements (function)
	// RETURN:
	//  none
	//function snippetsSolver(_domain, params){
	// function snippetsSolver(_snpSets, params){
	function snippetsSolver(params){


		var _snpSets;																					// Array of defined sets of elements (snippets, widgets, ...)
		var _domain;																					// Domain's name (container ID) the snippet belongs to
		var _callBack;																					// Events handler for the new DOM elements (function)
		var _others;																					// Parametri/dati/altro di altra natura da passare agli snippets

		_snpSets  = (params.List == null)? [] : params.List;
		_domain   = (params.Pars.domain == null)? '' : params.Pars.domain + ' ';
		_callBack = params.Pars.callBack;
		_others   = params.Pars.others;


		// Scans the sets of the defined elements
		$(_snpSets).each(function(){

			var $set = this;

			// Searches and replaces all the elements presents in the specified domain
			for (ndx = 0; ndx < $set.archive.length; ndx++) {

				var element = $set.tagName + $set.archive[ndx];
				if ($(_domain + element).length > 0) {

					// If founded, replace the snippet placeholders
				//	require([$set.jsPath + $set.archive[ndx] + ".js"], function(mySnippet){
					require([$set.jsPath + $set.archive[ndx] + ".js" + __SYS_version], function(mySnippet){

						var itemName = mySnippet.itemName;												// Gets element's name
						var itemTag  = mySnippet.itemTag;												// Gets element's tag prefix
						var cnt      = $(_domain + itemTag + itemName).length;							// Gets the element's number of occurrences in the page
						var times    = 0;

						$(_domain + itemTag + itemName).each(function() {								// Process all the occurrences into the specified domain

							times += 1;

							tagPars = dataParser( $(this).attr('data-pars') );							// Gets element's "private" params
							pbAttrs = getPublicAttrs( $(this) );										// Gets the "public" attributes
							var sender = $(this);														// Tracks the element

							mySnippet.BuildHtml(														// Runs the element's building function
								tagPars,
								pbAttrs,
								_others																	// PATCH: Dati (es. xml) o altro da passare agli snippet
							).then(
								function (htmlresult) {

									$(sender).replaceWith(htmlresult);									// Replaces element's placeholder with HTML
									if (--cnt == 0) {													// Decreases counter and check for it's last occurrence

										try {
											mySnippet.Extend({ domain: _domain });
											if (__SYS_consoleLog) {
												console.log("-> Snippet Handler: extensions found on " + _domain.trim() + "." + mySnippet.itemName + "...added!");
											}
										} catch (err) { }

										_callBack({														// Binds the callback functions
											snippet: itemName,
											domain : _domain
										});
									}

								}
							);

						});

						if (__SYS_consoleLog) {
							console.log("-> Snippet Handler: " + _domain.trim() + "." + mySnippet.itemName + " resolved " + times + " time(s).");
						}
					});
				}
			}

		});

	}


	// FUNCTION: dataParser
	//  Converts the raw data string into a JSON format object
	// (This function is invoked by the element's constructor to process its parameters)
	// PARAMS:
	//  raw : raw data string (from the element attribute "data-pars")
	// RETURN:
	//  jString : JSON format data string
	// NOTES:
	//  Explanation of the raw data format:
	//  "key" and "value" are separated by colons-equal (":="); multiple "key::value" are separated by double pipe ("||")
	//  e.g.: "par1:= value || par2:= 'string value' || ..."
	function dataParser(raw) {

		if (raw == undefined || raw == '') {
			return JSON.parse('{ }');
		}

		jString = '';
		paramsSet = raw.split('||');  // Creates the "key/value" couples array

		jString = '';
		for (k = 0; k < paramsSet.length; k++) {
			myPar = paramsSet[k].split(':=');
			// 1: Estrae e accoda la chiave
			jString += '"' + myPar[0].trim() + '": ';
			myPar[1] = myPar[1].trim();
			// 2: Sostituisce l'eventuale delimitatore stringa (da apice a virgolette) e accoda il valore
			if (myPar[1].charAt(0) == "'") {
				myPar[1] = '"' + myPar[1].substring(1, myPar[1].length - 1) + '"'; // JSON.parse esige le virgolette
			}
			jString += escapeChars(myPar[1]);
			//jString += myPar[1];

			// 3: Accoda eventuale separatore
			if (k < paramsSet.length - 1) { jString += ', '; }
		}

		jString = JSON.parse('{' + jString + '}');

		return jString;
	}


	// FUNCTION: getPublicAttrs
	//  Gets the "public" attributes to be applied to the snippet's "shell" (the most external element of the new DOM object)
	// PARAMS:
	//  snipObj : the element object (as read from DOM)
	// RETURN:
	//  myAttrs : string of the attributes to be applied to the snippet's "shell"
	function getPublicAttrs(snipObj) {

		var myAttrs = ['', ''];								 		            // Array of detected attributes
		$(snipObj).removeAttr('data-pars');					 		            // Removes the "private params" attribute

		// Step 1: gets the 'class' attribute and stores separately its value
		pClass = $(snipObj).attr('class');
		myAttrs[0] = (pClass == undefined) ? '' : ' ' + pClass + ' ';
		$(snipObj).removeAttr('class');

		// Step 2: gets all others attributes declared into the snippet's placeholder
		pAttrs = snipObj[0].attributes;
		if (pAttrs.length > 0) {									            // Converts the attributes array into a string

			for (i = 0; i < pAttrs.length; i++) {
				myAttrs[1] += pAttrs[i].name;						            // Attribute's name
				myAttrs[1] += '="' + pAttrs[i].value +'" ';			            // Attribute's value
			}
		}

		return myAttrs;
	}


	// FUNCTION: escapeChars
	//  Escapes chars from XML values
	// PARAMS:
	//  text : the original value (as read from XML)
	// RETURN:
	//  text : value with replaced chars
	function escapeChars(text) {

		text = text
			.replace( /\n/g, "\\n" )
			//.replace( /.../, "...")
			//.replace( /.../, "...")	   							            // Concat a new regexp to replace other escape chars

		return text;
	}
});

