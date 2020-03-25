// input_float.js -> "input_float" snippet management file
// target:  <snp_input_float/>
// funct.:  
// output:  campo input testo generico
define(['./input_kernel.js', 'base_constants', 'base_presenter'], function (kernel, constants, pBase) {

	var _ITEMNAME = 'input_boxedNr';                         // Item's name
	var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

	return {
		itemName : _ITEMNAME,													// Item's name
		itemTag  : _ITEMTAG,													// Item's tag prefix
		BuildHtml: buildHtml,													// Item's HTML
		Extend   : extend														// Callback function management
	};


	// FUNCTION: buildHtml
	//  builds the snippet's HTML code 
	// PARAMS:
	//  tagPars : tag's custom parameters (in JSON format)
	//  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
	//              pbAttrs[0] : extension of "class" attribute,
	//              pbAttrs[1] : all others attributes 
	// RETURN:
	//  myHtnml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {

		var value = tagPars.value;
		var currencyID = tagPars.currency;
		var symbolID = tagPars.symbol;
		var min = tagPars.min;
		var max = tagPars.max;


		var customAttrs = pbAttrs[1] + ' checksFor="float" ';

		var kPars = {
			Input: 'text',
			Class: _ITEMNAME + pbAttrs[0],
			Attrs: customAttrs
		};

		params = {
			currency: currencyID,
			symbol: symbolID
		};

		var symbol = constants.GetSymbol(params);

		var htmlWrap, closeWrap;
		var myHtml = '<div class="input_boxedNr ' + pbAttrs[0] + '">';
		myHtml += '<input type="number" class="form-control input_number cleanInput" value="' + value;
		myHtml += '" min="' + min + '" max="' + max + '" key="' + tagPars.key + '" ' + pbAttrs[1] + '/>';
		if (symbol) {
			myHtml += '<span class="symbol">' + symbol + '</span>';
		}
		myHtml += '</div>';

		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });
	}


	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function extend(params) {

		// Aggiorna il flag "changed"
		$('.input_boxedNr .input_number').change(function(){
			__SYS_status.hasChanged = true;										// Aggiornamento STATUS globale: attiva il flag di valore modificato

			$(this).addClass('hasChanged');

		});
	}

});