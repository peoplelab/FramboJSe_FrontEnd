//----------------------------------------------------------------------------------------
// File: templateshandler.presenter.js
//
// Desc: Template controller and XML values' filler
// Path: /system/framboJSe.fw/presenter
//----------------------------------------------------------------------------------------

define([
	'jquery', 
	'templatesList_sys'                             // "System" template definitions
], function ($, template_sys) {

	var _cTR   = 0;                                 // codice tipo rapporto "forzato" (nuovo)
	var _requestsQueue = [];                        // requests queue: it contains the requests in a json format {key, xml, extra}
	var _templatesArchive = [];                     // the templates definition list
	
	
	// §§§§ -> Gestione di Public e Private: aggiungere le liste definizioni
	
	

	return {

		Render: init                              // Gets (and eventually fills) the specified HTML template
        
	}	



	function init(params) {

		_templatesArchive = template_sys.List();

		if (__PageScope == 'private') {
			// if you are in private scope, you must load the private templates' declaration archive
			SystemJS.import('templatesList_pvt').then(function (templates_pvt) {
                
				var pvt_list = templates_pvt.List();

				if (pvt_list != undefined && pvt_list != '') {
					$.extend(_templatesArchive, pvt_list);
				}
                
				render(params);
			});
		}
		else {
			// you are in public scope, so you must load the public templates' declaration archive
			SystemJS.import('templatesList_pub').then(function (templates_pub) {

				var pub_list = templates_pub.List();

				if (pub_list != undefined && pub_list != '') {
					$.extend(_templatesArchive, pub_list);
				}

				render(params);
			});
		}
	}


	// FUNCTION: render
	//  Gets the HTML template to be included into the master page and fills its fields with the corresponding XML values
	// PARAMS:
	//  params.code     : the tmeplate ID
	//  params.XML      : the XML's raw data from web service
	//  params.extra    : Extra data to be passed to "replaceValues" for the template's data resolution
	//  params.tRap     : codice "tipo rapporto" (al momento non usato)
	// RETURN:
	//  the HTML template's filled code
	function render(params) {
    
		// Gets the params values (if any)
		_cTR   = (params.tRap  == null) ? _cTR   : params.tRap;
		_requestsQueue.push({ key: params.code, xml: params.XML, extra: (params.extra == null) ? [] : params.extra });
        
		// Gets the HTML template path name
		var myPath = getTemplatePath({templateID: params.code})     // Template's ID
		if (myPath == '') {
			return params.onFailed({ code: params.code, descr: 'Il template codice "' + params.code + '" non è censito nella Template List.' });
		}



		console.log("-> Template Handler Download: " + myPath);

		// Gets the HTML source file and starts process
		$.ajax({
			type: "GET",
		//	url: myPath,
			url: myPath + __SYS_version,
			dataType: "html",
			success: function (html) {
               
				var current_element = getCurrentElement(_requestsQueue, html);      // get the current element from the "queue"
				var xml = current_element.xml;
				var extra = current_element.extra;

				if (xml != null && xml != '') {

					var XML_List = scanXML(xml);                    // scans the XML data and build the "key/value" couples array
					XML_List = XML_List.concat(extra);              // Adds the "extra" array for enhanced data solving into the HTML template
                    
					for (i = 0; i < XML_List.length; i++) {         // Customizes form's title: search for "codice" key
						if (XML_List[i][0] == 'codice') {
							if (XML_List[i][1] == 0) {              // Compare the value of the item code (0 if a new one)                                
								html = html.replace(                // Note: "html" it's a string, can't operate JQuery functions on it
									'id="mainTitle">Modifica', 
									'id="mainTitle">Aggiungi'
								);
							}
							break;
						}
					}

					html = replaceValues(html, XML_List);           // replaces the data's markers with their values
				}
				params.onSuccess(html);                             // Invoke the subsequentials renders functions

			},
			failure: function (response) {
				console.log("-> Template Handler Download: " + myPath + " ... FAILED");
				return '';
			}
		});
    
	}

	// FUNCTION: getCurrentElement
	//  extract one element (based on a template file) from the queue, and remove it.
	//  the element key must be contained in the template file.
	// PARAMS:
	//  queue : the queue
	//  template_file  : template file
	// RETURN:
	//  queue element in a json format {key, xml}
	function getCurrentElement(queue, template_file) {

		var ret_value;
		var reserved_index1 = template_file.indexOf('reserved_header_section');
		var reserved_index2 = template_file.indexOf('</reserved_header_section>');
		var reserved_length = reserved_index2 + ('</reserved_header_section>').length - reserved_index1 + 1;
		var str_reserved = template_file.substr(reserved_index1 - 1, reserved_length);

		var xml_reserved = $.parseXML(str_reserved);
		var key = $(xml_reserved).find('reserved_header_section').attr('templateID');

		for (var i=0; i<_requestsQueue.length; i++){
			var el = _requestsQueue[i];
			if (el.key == key) {
				// found it
				ret_value = el;
				_requestsQueue.splice(i, 1);
				break;
			}
		}

		return ret_value;
	}



	function getKeysFromNode(currentNode) {

		if (currentNode.children.length == 0) return [];

		var myList = [];
		$(currentNode).children().each(function () {

			var childrenList = getKeysFromNode(this);

			if (childrenList.length > 0) {

				myList = myList.concat(childrenList);
                
			} else {
				myList.push([                                   // Inserts the new couple:
					getParentKey(this),                              // Name (key)
					decodeURIComponent(this.textContent)        // value
				]);
			}
		})

		return myList;

	}
	function getParentKey(currentNode) {
		var ret = currentNode.nodeName;

		while (currentNode.parentNode.nodeName != 'data') {
			currentNode = currentNode.parentNode;
			ret = currentNode.nodeName + '||' + ret;
		}

		return ret;
	}


	// FUNCTION: scanXML
	//  Parses the XML document and build the "key/value" couples array
	// PARAMS:
	//  myXml : original XML document
	// RETURN:
	//  myList : array of "key/value" couples
	function scanXML(myXml) {

		var myList = [];														// Initialization
		var data_T = ['Data'];													// Array of the "data" nodes tipologies to be parsed

		// Searchs the "response" node
		response = $(myXml).find('Response');
		if (response.length > 0) {

			// Scans for every "data" type
			for (ndx = 0; ndx < data_T.length; ndx++) {
				dataset = $(response).find(data_T[ndx]);						// Gets the "data" node
				if (dataset.length > 0) {										// Processes the items (if any)
					$(dataset).children().each(function(){
						var name = this.nodeName
						myList.push([											// Inserts the new couple:
							name,												// Name (key)
							decodeURIComponent(this.textContent)				// value
						]);
						// Patch (15/05/2018): estrae e accoda tutti gli attributi
						$.each(this.attributes, function() {
							if (this.specified) {
								myList.push([									// Inserts the new couple:
			                        name + '.' + this.nodeName,					// Name (key)
									decodeURIComponent(this.textContent)		// value
								]);
							}
						});
					})
				}
			}
		}
		return myList;
	}



	// FUNCTION: replaceValues
	//  Replaces the data's markers into the raw HTML code with their values
	// PARAMS:
	//  html    : raw HTML code
	//  xmlList : array of "key/value" couples
	// RETURN:
	//  html : Precompiled HTML template
	function replaceValues(html, xmlList) {

		// Step 1: replaces the snippet's self-referenced data markers

		// Nota: vedi user story 188 in "features" - Ref.: Controllo sintattico su "data-pars"
		for (i = 0; i < xmlList.length; i++) {

			var xmlKey = xmlList[i][0];
			var xmlVal = xmlList[i][1];


			var searchKey = new RegExp("val..:='{{" + xmlKey + "}}'");			// Finds generic "valxx" attribute inside snippets
			var runSearch = searchKey.test(html)								// Test returns true/false

			while (runSearch) {

				if (runSearch) {
					myKey = searchKey.exec(html);								// Finded occourrence of my key
					keyID = html.substr(html.indexOf(myKey) + 3, 2);			// Extracts key's suffix (should be 'ue', '01, '02', ...)

					// Builds the 'val' and the 'key' attributes whit the correspondant xml "key/value" data
					replaceKey  = "val" + keyID + ":='" + xmlVal + "'";
					replaceKey += " || ";
					replaceKey += "key" + ((keyID =='ue')? '' : keyID) + ":='" + xmlKey + "'";
					html = html.replace(searchKey, replaceKey);

				}
				runSearch = searchKey.test(html);								// Searchs for another occourrence of the key
			}

		}


		// Step 2: replaces others data markers
		for (i = 0; i < xmlList.length; i++) {
			var myKey = new RegExp('{{' + xmlList[i][0] + '}}', "g");
			var myVal = xmlList[i][1];
			html = html.replace(myKey, myVal);
		}

		// Step 3: clears unreplaced data markers
		search = true;
		secure = 0;																// Security dummy counter for break in case of infinite loop
		while (search && secure < 200) {
			secure++;															// Increase security counter
			from = html.search('{{'); 
			to   = html.search('}}');
			if (from < 0 ) {
				search = false;
			} else {
				var myKey = '{{' + html.substring(from + 2, to) + '}}';
				html = html.replace(myKey, '');
			}
		}

		return html;
	}


	// FUNCTION: getTemplatePath
	//  Gets the HTML template path from its ID
	// PARAMS:
	//  params.templateID : the HTML template's ID
	// RETURN:
	//  the HTML template's path
	function getTemplatePath(params) {

		var templatePath = _templatesArchive[params.templateID];

		return (templatePath == null)? '' : templatePath;
	}

});
