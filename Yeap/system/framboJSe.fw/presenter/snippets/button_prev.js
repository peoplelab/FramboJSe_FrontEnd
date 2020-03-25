// button_prev.js -> "button_prev" snippet management file
// target:  <snp_button_prev />
// funct.:  Inserimento del pulsante "Precedente" per la navigazione "step -1"
// output:  button
define ([], function() {

	var _ITEMNAME = 'button_prev';												// Item's name
	var _ITEMTAG  = 'snp_';														// Item's tag prefix

	return {
		itemName : _ITEMNAME,
		itemTag  : _ITEMTAG,
		BuildHtml: buildHtml
	}


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

		var myHtml = '';
		var icon = 'fa fa-play-circle fa-rotate-180';							// Font awesome icon

		// HTML definition
		myHtml += '<button class="' + _ITEMNAME + pbAttrs[0] + ' btn btn-default" href="#next" ' + pbAttrs[1] + '>';
		myHtml += '  <span class="margin-l-5"><i class="' + icon + ' color-on"></i></span>';
		myHtml += '</button>';

		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });

	}

});
