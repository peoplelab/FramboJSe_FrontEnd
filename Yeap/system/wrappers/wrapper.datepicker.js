// wrapper.datepicker.js -> wrapper for datepicker "as a module"
// http://jcrop.org/

define([
	'jquery',
	'bs_datepicker',
	'bs_datepicker_it'
	], function ($) {

	return {

		Init      : init,											// Setup (init).
		Datepicker: render,											// Render object with jcrop in page
		GetDate   : getDate											// Gets the date

	}	


	// FUNCTION: init
	//	Object setup ( -> empty fnction)
	// PARAMS:
	//	None
	// RETURN:
	//  None
	function init() { }


	// FUNCTION: render
	//	Creates the instance of the datapicker object
	// PARAMS:
	//	params.obj     : target object
	//	params.options : datepicker initial parameters
	// RETURN:
	//  None
	function render(params) {

		var obj     = params.obj;
		var options = params.options

		$(obj).datepicker(options, params.onSuccess);

	}


	// FUNCTION: getDate
	//	Gets the date vaule from the object
	// PARAMS:
	//	params.obj : target object
	// RETURN:
	//  date value
	function getDate(obj) {

		return $(obj).datepicker('getDate');

	}

})