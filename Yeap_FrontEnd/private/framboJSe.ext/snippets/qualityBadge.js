//----------------------------------------------------------------------------------------
// File  : qualityBadge.js
//
// Desc  : Visualizza bollino qualità dati
// Path  : /Private/framboJse.ext/snippets
// target:  <snp_qualityBadge />
// output:  div icone
//----------------------------------------------------------------------------------------
define ([], function() {

    var _ITEMNAME = 'qualityBadge';																		// Item's name
    var _ITEMTAG  = 'snp_';																				// Item's tag prefix

    return {
		itemName : _ITEMNAME,																			// Item's name
		itemTag  : _ITEMTAG,																			// Item's tag prefix
		BuildHtml: buildHtml,																			// Item's HTML
	//	Extend   : extend																				// Callback function management
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

		// HTML definition
		myHtml += '<div id="dataQuality" class="">';

		myHtml +=   '<div class="bollino ok">';
		myHtml +=     '<i class="fa fa-check-circle"></i>';
		myHtml +=     '<span>Dati certificati</span>';												// Label tipo dati
		myHtml +=   '</div>';

		myHtml +=   '<div class="bollino ko">';
		myHtml +=     '<i class="fa fa-times-circle"></i>';
		myHtml +=     '<span>Dati non certificati</span>';											// Label tipo dati
		myHtml +=   '</div>';
 
		myHtml +=   '<div class="bollino warning">';
		myHtml +=     '<i class="fa fa-exclamation-circle"></i>';
		myHtml +=     '<span>Dati forzati</span>';												// Label tipo dati
		myHtml +=   '</div>';
 
		myHtml += '</div>';
 
 		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });

	}

});