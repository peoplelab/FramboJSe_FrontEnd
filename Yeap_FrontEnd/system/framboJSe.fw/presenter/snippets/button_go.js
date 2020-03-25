// button_go.js -> "button_go" snippet management file
// target:  <snp_button_add />
// funct.:  Inserimento del pulsante "esegui" nelle tabelle delle viste
// output:  button
define ([], function() {

	var _ITEMNAME = 'button_go';												// Item's name
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
		var icon   = 'far fa-play-circle';										// Font awesome icon

		// HTML definition
		if (tagPars.type != 'button') {

			myHtml += '<a class="' + _ITEMNAME + pbAttrs[0] + ' btn" href="#go" ref="' + tagPars.ref + '" ' + pbAttrs[1] + '>';
			myHtml += '  <span class="margin-l-5 padding-h-5"><i class="' + icon + ' margin-l--5"></i></span>';
			myHtml += '</a>';

		} else {

			myHtml += '<button class="' + _ITEMNAME + pbAttrs[0] + ' btn" href="#go" ref="' + tagPars.ref + '" ' + pbAttrs[1] + '>';
			myHtml += '  <i class="' + icon + '"></i>';
			myHtml += '</button>';

		}

		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });

	}

});
