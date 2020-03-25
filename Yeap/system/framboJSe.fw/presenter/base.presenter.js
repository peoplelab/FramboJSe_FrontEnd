// "static module" for edit presenters
// a set of common functions used in "edit" pages.

define(['jquery'], function ($) {

	// Defines constants
	var _PAGE_UNAUTHORIZED    = '/system/pages/unauthorized.html';				// unauthorized error page
	var _PAGE_GENERICERROR    = '/system/pages/genericerror.html';				// generic error page
	var _ERRORCOOKIE_NAME     = 'pm-error';                       				// error cookie name
	var _ERRORCOOKIE_KEYCODE  = 'Error-code';                   				// error cookie key code
	var _ERRORCOOKIE_KEYDESC  = 'Error-msg';                    				// error cookie key message
	var _ERRORCOOKIE_KEYFNAME = 'Function';                         			// error cookie key function name


	showBreakLabels(__SYS_showBreaks);

	return {

		BuildsJson4Save     : buildsJson4Save,									// Gets values from input controls and collects them into a JSON object
		ValidatesChar       : validatesChar,									// Validates character pressed on the keyboard
		Capitalize          : capitalize,
		GetIntDec           : getIntDec,										// Restituisce le parti intera e decimale di un numero

		ClearsValues        : clearsValues,										// clears input values
		RestoresValues      : restoresValues,									// restores original input values
		RedirectToErrorPage : redirectToErrorPage,								// redirect to error page
		ValidatesRange      : validatesRange,									// Checks if the value is within the limits
		AutoFillDigits      : autoFillDigits,									// Fills the value with '0' to the left till the requested length
		GetDayName          : getDayName,
		GetMonthName        : getMonthName,
		ShowBreakLabels     : showBreakLabels,									// Abilita visualizzazione etichette dello stato del viewport

		fnName              : functionName,										// Gets the current function name
        LoadResources       : loadResources,    								// Loads the additional resources (.css and/or .js files)

        OnGenericFailure    : onGenericFailure,									// handler for generic communication failure with Saas
		GetXmlNode          : getXmlNode,										// Restituisce il contenuto del nodo XML specificato
		GetXmlNodeAttr      : getXmlNodeAttr,									// Restituisce il valore dell'attributo specificato del nodo XML richiesto
	}

	// Funzioni private:
	// _getKeyCode
	// _autoFill

	// --------


	// FUNCTION: loadResources
	//  Uploads the additional files (.css and/or .js) needed by the page
	// PARAMS:
	//  params.args : "arguments" object of the parent function
	// RETURN:
	//  None
	// -----
	//	SAMPLE: How to declare additional resources into "presenter" file:
	//	var _resources = {														// Mapping of the additional resources (.css and/or .js files)
	//		css: [																// Declares CSS files
	//			'{{pvt}}/timesheet/configuration/profiloOrario.css',
	//			'{{sys}}/altro.css'
	//		],
	//		js: [																// Declares the JS files (loaded asynchronously)
	//			'{{pvt}}/timesheet/configuration/profiloOrario.js',
	//			'{{pub}}/myModule/altro.js',
	//			'https://maps.googleapis.com/maps/api/js?v=3.24&key=AIzaSyBFVm7CapEb7FxjC7pzzsw4y7fgwx2-LtU'
	//		]
	//	}
	// -----
	function loadResources(params){

		var jsFiles   = params.js;
		var cssFiles  = params.css;
		var filePaths = {
				trd: _sysRoot + '3rd-parties',
				sys: _sysFrameWork + 'libs/',
				pub: _pubRoot + 'resources/',
				pvt: _pvtRoot + 'resources/',
			}

		// ** Step 1: css files
		if (cssFiles != undefined) {

			for (i = 0; i < cssFiles.length; i++) {

				var myFile = cssFiles[i];
				var cssRef = document.createElement("link");

				// Resolves path:
				myFile = myFile.replace('{{trd}}', (filePaths.trd));
				myFile = myFile.replace('{{sys}}', (filePaths.sys + 'css'));
				myFile = myFile.replace('{{pvt}}', (filePaths.pvt + 'css'));
				myFile = myFile.replace('{{pub}}', (filePaths.pub + 'css'));
				// Creates new DOM element
				cssRef.setAttribute("rel" , "stylesheet");
				cssRef.setAttribute("type", "text/css");
				cssRef.setAttribute("href", myFile);
				$('head').append(cssRef);

				if (__SYS_consoleLog) {
					console.log('-> Resource loader: loaded "' + myFile +'"');
				}
			}
		}

		// ** Step 2: js files -> synchronous
		if (jsFiles != undefined) {

			for (i = 0; i < jsFiles.length; i++) {

				var myFile = jsFiles[i];
				var jsRef  = document.createElement("script");

				// Resolves path:
				myFile = myFile.replace('{{trd}}', (filePaths.trd));
				myFile = myFile.replace('{{sys}}', (filePaths.sys + 'js'));
				myFile = myFile.replace('{{pvt}}', (filePaths.pvt + 'js'));
				myFile = myFile.replace('{{pub}}', (filePaths.pub + 'js'));
				// Creates new DOM element
				jsRef.setAttribute("async", "");
				jsRef.setAttribute("defer", "");
				jsRef.setAttribute("type" , "text/javascript");
				jsRef.setAttribute("src"  , myFile);
				$('head').append(jsRef);

				if (__SYS_consoleLog) {
					console.log('-> Resource loader: loaded "' + myFile +'"');
				}
			}
		}
	}


	// FUNCTION: functionName
	//  Returns the function name that invoked this method (parent function)
	// PARAMS:
	//  params.args : "arguments" object of the parent function
	// RETURN:
	//  Name of the current function
	function functionName(args){

		var myName = args.callee.toString();
		myName = myName.substr('function '.length);
		myName = myName.substr(0, myName.indexOf('('));

		return myName;
	}

	// FUNCTION: redirectToErrorPage
	//  Initializes the HTML page objects for UI render
	// PARAMS:
	//  params.page_id : page ID
	//  params.code    : ID of the item to be edited
	// RETURN:
	//  none
	function redirectToErrorPage(code, description, module) {

		// write cookie to log error message
		var k = '\"';
		var key = new RegExp(k, "g");       // regular expression to replace " with '.

		var _cookieValues = '{';
		_cookieValues += '"' + _ERRORCOOKIE_KEYCODE + '": "' + code + '"';
		_cookieValues += ',';
		_cookieValues += '"' + _ERRORCOOKIE_KEYDESC + '": "' + description.replace(key, "'") + '"';
		if (module != undefined) {
			_cookieValues += ',';
			_cookieValues += '"' + _ERRORCOOKIE_KEYFNAME + '": "' + module.id + ' > Function: ' + module.fn + '"';
		}
		_cookieValues += '}';

		// Creates cookie
		Cookies.set(_ERRORCOOKIE_NAME, _cookieValues, { expires: 1 });

		if (code == '1008') {
			window.location.replace(_PAGE_UNAUTHORIZED);
		}
		else {
			window.location.replace(_PAGE_GENERICERROR);
		}
	}


	// FUNCTION: clearValues
	//  Clears the values of the input controls in the page
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function clearsValues() {

		$(".cleanInput").each(function () {
			$(this).val('');
		});

		$("input.cleanDatePicker").each(function () {
			$(this).val('');
		});

		$(':input,select option, checkbox').prop("checked", false).prop("selected", false);

	}


	// FUNCTION: restoresValues
	//  Restores the original values of the input controls in the page
	// PARAMS:
	//  params.domain
	// RETURN:
	//  none
	function restoresValues(params) {

		var domain = (params != undefined)? params.domain : '';


		$(domain + ' [ov]').not('[disabled]').each(function(){

			e = $(this);
			t = e.attr('type');
			v = e.attr('ov');

			switch(t) {
				case 'checkbox':
					e.prop('checked', (v == 1) ? 'checked' : '');
					break;

				case 'radio':
					break;

				default:
					e.val(v);
			}
		});

	}


	// FUNCTION: buildsJson4Save
	//  Gets the values from the input controls in the page and collects them into a JSON object
	// PARAMS:
	//  code: lookup code (optional)
	// RETURN:
	//  data : JSON object containing fields names and values
	function buildsJson4Save(code, domain) {

		var data  = {};
		var dName = (domain == undefined)? '' : domain;

		$(dName + ' [ov]').each(function(){
			
			var key, val;
			
			key = $(this).attr('key');

			// ** NOTA: "key" può essere "undefined" in alcuni campi ausiliari (dvedi datePicker)
			// che possono essre valorizzati ma non sono legati all'XML => lo scarto
			if (key != undefined) {

				if ($(this).attr('type') == 'checkbox') {
					val = $(this).prop("checked") ? "1" : "0";
				} else {
					val = $(this).val();
				}
				data[key] = val;

			}
		})

		return data;

	}

	// FUNCTION: validatesChar
	//  Validates character pressed on the keyboard
	// PARAMS:
	//  none
	// RETURN:
	//  char validation (true/false)
	function validatesChar(e, validchars, len, limit) {
		var key, keychar;

		key = _getKeyCode(e);
		if (key == null) return true;
		keychar = String.fromCharCode(key).toLowerCase();
		validchars = validchars.toLowerCase();
		if (validchars.indexOf(keychar) != -1) {

			// Handles situations when exists a text selection, and a new char will replaces it instead of exceeding the max length
			sel = window.getSelection().toString();
			if (len < limit || (len == limit && sel != '')) return true;
		}
		if (key == null || key == 0 || key == 8 || key == 9 || key == 13 || key == 27)
			return true;

		return false;
	}
	// FUNCTION: _getKeyCode
	//  Returns the code of the key pressed during the event
	//  Support function for "validatesChar" function.
	function _getKeyCode(e) {
		if (window.event)
			return window.event.keyCode;
		else if (e)
			return e.which;
		else
			return null;
	}


	// FUNCTION: validatesRange
	//  Validates character pressed on the keyboard
	// PARAMS:
	//  none
	// RETURN:
	//  char validation (true/false)
	function validatesRange(d) {

		var val = $(d).val()
		var min = $(d).attr('min');
		var max = $(d).attr('max');

		if (val != '' && val != null) {

			val = parseInt(val);
			if (isNaN(val)) {
				return false;
			}
			val2 = val;

			min = parseInt(min);
			max = parseInt(max);

			if (!isNaN(min) && val < min) { val2 = min}
			if (!isNaN(max) && val > max) { val2 = max}

			if (val != val2) {
				$(d).val(val2);
			}
		}
		return true
	}


	// FUNCTION: autoFillDigits
	//  Fills the value with '0' to the left till the requested length
	// PARAMS:
	//  obj : DOM object to be processed
	// RETURN:
	//  none
	function autoFillDigits(obj){
		nrDigits = $(obj).attr('maxlength');									// Formats the value by filling with '0' to the left till the requested length
		txtValue = $(obj).val();												// Value to be formattedd

		while (txtValue.length < nrDigits) { txtValue = '0' + txtValue; };		// Loop for "0" attaching
		$(obj).val(txtValue);

	}


	// FUNCTION: capitalizeText
	//  Sets the text to lower case and capitalizes the first letter
	// PARAMS:
	//  txt : The text to be formatted
	//  all : If true, sets to uppercase all of the first letters in the phrase
	// RETURN:
	//  Formatted text
	function capitalize(params) {

		var words = [];
		var myTxt = '';

		words = (params.all)? params.txt.split(' ') : [params.txt];
		for (i = 0; i < words.length; i++){
			myTxt += words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase() + ' ';
		}

		return myTxt.trim();

	}

	// FUNCTION: getIntDec()
	//	Restituisce le parti intera e decimale di un numero
	// PARAMS:
	//	value : valore
	// RETURN:
	//	Hashmap parte intera / parte decimale
	function getIntDec(value) {

		var val, int, dec;

		if (isNaN(value)) {
			val = eval(value.replace(',', '.'));		// Uniforma a formato numerico
		} else {
			val = value;
		}
		int = parseInt(val);
		dec = parseInt(parseFloat((val - int) * 100).toFixed(0));

		return { int: int, dec: ((dec < 10) ? '0' : '') + dec }
	}

	// FUNCTION: dayMonthName()
	//	Restituisce il nome del giorno nel formato richiesto
	// PARAMS:
	//	pDay    : numero del giorno della settimana
	//	pFormat : formato del nome da restituire
	// RETURN:
	//	Nome del giorno formattato
	function getDayName(pDay, pFormat) {

		var day    = 0;
		var format = 'long';									// Formato del nome: 'long', 'short', 'narrow'
		var names  = [
			{long: '*****'    , short: '***', narrow: '*'},
			{long: 'Lunedì'   , short: 'Lun', narrow: 'L'},
			{long: 'Martedì'  , short: 'Mar', narrow: 'M'},
			{long: 'Mercoledì', short: 'Mer', narrow: 'M'},
			{long: 'Giovedì'  , short: 'Gio', narrow: 'G'},
			{long: 'Venerdì'  , short: 'Ven', narrow: 'V'},
			{long: 'Sabato'   , short: 'Sab', narrow: 'S'},
			{long: 'Domenica' , short: 'Dom', narrow: 'D'}
		];

		// Check for pDay validity
		if (pDay == undefined || isNaN(pDay)) check = false;
		if (check &&  (pDay < 1 || pDay > 7)) check = false;
		if (check &&  pDay != parseInt(pDay)) check = false;

		day    = (check)? pDay : day;
		format = (pFormat == 'short' || pFormat == 'narrow')? pFormat : format;

		return names[day][format];

	}

	// FUNCTION: getMonthName()
	//	Restituisce il nome del mese nel formato richiesto
	// PARAMS:
	//	pMonth  : numero del mese
	//	pFormat : formato del nome da restituire
	// RETURN:
	//	Nome del mese formattato
	function getMonthName(pMonth, pFormat) {

		var check  = true;
		var month  = 0;
		var format = 'long';									// Formato del nome: 'long', 'short', 'narrow'
		var names  = [
			{long: '*****'    , short: '***', narrow: '*'},
			{long: 'Gennaio'  , short: 'Gen', narrow: 'G'},
			{long: 'Febbraio' , short: 'Feb', narrow: 'F'},
			{long: 'Marzo'    , short: 'Mar', narrow: 'M'},
			{long: 'Aprile'   , short: 'Apr', narrow: 'A'},
			{long: 'Maggio'   , short: 'Mag', narrow: 'M'},
			{long: 'Giugno'   , short: 'Giu', narrow: 'G'},
			{long: 'Luglio'   , short: 'Lug', narrow: 'L'},
			{long: 'Agosto'   , short: 'Ago', narrow: 'A'},
			{long: 'Settembre', short: 'Set', narrow: 'S'},
			{long: 'Ottobre'  , short: 'Ott', narrow: 'O'},
			{long: 'Novembre' , short: 'Nov', narrow: 'N'},
			{long: 'Dicembre' , short: 'Dic', narrow: 'D'}
		];

		// Check for pMonth validity
		if (pMonth == undefined || isNaN(pMonth)) check = false;
		if (check && (pMonth < 1 || pMonth > 12)) check = false;
		if (check &&  pMonth != parseInt(pMonth)) check = false;

		month  = (check)? pMonth : month;
		format = (pFormat == 'short' || pFormat == 'narrow')? pFormat : format;

		return names[month][format];

	}

	// FUNCTION: showBreakLabels()
	//	Gestisce visualizzazione etichette dello stato del viewport
	// PARAMS:
	//	mode : stato visualizzazione
	// RETURN:
	//	none
	function showBreakLabels(mode) {

		if (mode == true || mode == 'true' || mode == 'show')   {

			$('#xSize').html(' - ' + $(window).width() + 'px');
			$('#breakLabelsContainer').show();

			$(window).resize(function(e) {
				$('#xSize').html(' - ' + $(this).width() + 'px');
			});
		}
		if (mode == false || mode == 'false' || mode == 'hide') {
			$('#breakLabelsContainer').hide();
		}

	}


    // FUNCTION: onGenericFailure(result)
	//  Handler for a generic request failure (no connection, Saas 500 error, etc etc...)
    function onGenericFailure(result) {
        var response_code = result.ResponseCode;            // response code -> -1 on failure
        var response_message = result.ResponseMessage;      // response message -> '' on failure
        var failure_code = result.FailureCode;              // failure code -> server status code
        var rawdata = result.RawData;                       // raw data -> jqXHR object

        alert(response_message);
    }








    // FUNCTION: getXmlNodeElements
    //	Estrae dal nodo XML richiesto gli elementi
    // PARAMS:
	//	xmlRaw  : Testo dell'XML da analizzare
	//	element : nome/path degli elementi da estrarre
	//  filter  : Eventuale regola di filtro sugli elementi
    // RETURN:
    //	Insieme degli elementi estratti
    function getXmlNode(params) {

        //var xml_node_element = 'settore';
		var xmlDoc;
		var retrived;
        var searchFor = '';

        searchFor += params.element;												// Aggiunge il nome degli elementi da estrarre
		searchFor += (params.filter != null)? params.filter : '';					// Aggiunge l'eventuale regola filtro

        xmlDoc   = $.parseXML(params.xmlRaw);
        //retrived = $(xmlDoc).find('settore:has(parent:contains("3"))');
        retrived = $(xmlDoc).find(searchFor);

        return retrived;
    }

    // FUNCTION: getXmlNodeAttr
    //	Estrae dal nodo XML richiesto il valore dell'attributo specificato
    // PARAMS:
	//	xmlRaw  : Testo dell'XML da analizzare
	//	element : nome/path degli elementi da estrarre
	//  filter  : Eventuale regola di filtro sugli elementi
	//  attr    : nome dell'attributo richiesto
    // RETURN:
    //	Valore dell'attributo
    function getXmlNodeAttr(params) {

		var xmlDoc;
		var xmlNode;
		var retrived;
        var searchFor = '';

        searchFor += params.element;												// Aggiunge il nome degli elementi da estrarre
		searchFor += (params.filter != null)? params.filter : '';					// Aggiunge l'eventuale regola filtro

        xmlDoc   = $.parseXML(params.xmlRaw);
        xmlNode  = $(xmlDoc).find(searchFor);										// Seleziona il nodo richiesto
		retrived = $(xmlNode).attr(params.attr);									// Recupera il valore dell'attributo

        return retrived;
    }

});