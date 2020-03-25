// button_add.js -> "button_add" snippet management file
// target:  <snp_button_add />
// funct.:  Inserimento del pulsante "Aggiungi" nelle tabelle delle viste
// output:  button
define ([], function() {

	var _ITEMNAME = 'button_add';												// Item's name
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
	//  myHtml  : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {

		var myHtml = '';
		var icon = 'fa fa-plus-circle';											// font awesome icon

		// HTML definition
		myHtml += '<a class="' + _ITEMNAME + pbAttrs[0] + ' btn" href="#add" ' + pbAttrs[1] + '>';
		myHtml += '  Aggiungi<span class="margin-l-5"><i class="' + icon + ' color-on"></i></span>';
		myHtml += '</a>';

		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });

	}

});
