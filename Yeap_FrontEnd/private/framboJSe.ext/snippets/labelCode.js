//----------------------------------------------------------------------------------------
// File  : labelCode.js
//
// Desc  : Costruisce una label prelevando il testo dal nodo XML richiesto
// Path  : /Private/framboJse.ext/snippets
// target:  <snp_labelcode />
// output:  label
//----------------------------------------------------------------------------------------
define ([
	'/system/framboJSe.fw/presenter/snippets/glyph_mandatory.js',
], function(gm, map) {

    var _ITEMNAME = 'labelCode';												// Item's name
    var _ITEMTAG  = 'snp_';														// Item's tag prefix

    return {
        itemName : _ITEMNAME,
        itemTag  : _ITEMTAG,
        BuildHtml: buildHtml,
        Extend   : extend														// Callback function management
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
        
    	var myHtml   = '';

        // HTML definition
        myHtml += '<label class="rowLabel df-' + _ITEMNAME + pbAttrs[0] + '" ';
		myHtml += 'ref="' + tagPars.code + '" ';
        myHtml += pbAttrs[1] + '>';
        myHtml += getLabel({code: tagPars.code});
        myHtml += '</label>';

        // Checks for appending the mandatory field icon
        if (pbAttrs[1].toLowerCase().indexOf('mandatory') > -1 ) {

            // Invokes the resolution of "mandatory" snippet via synchronous method
        	var behavior = (pbAttrs[1].indexOf('nodefault') > -1) ? ' nodefault ' : '';
        	var labelRef = 'ref="' + tagPars.code.replace(' ', '_').toLowerCase() + '"';

        	myGlyph = gm.BuildHtmlSync('', [behavior, labelRef]);
            myHtml = myGlyph + myHtml;

        }

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

    	var domain = (params.domain != undefined) ? params.domain : '';

    	$(domain + '.glyph_mandatory').not('.nodefault').popover();

    }


	// FUNCTION: getLabel
	//  Restituisce il testo dell'etichetta contrassegnata
	// PARAMS:
	//  code : codice della label
	// RETURN:
	//  Testo dell'etichetta
	function getLabel(params) {

		var labelCode = params.code;
		var tipologie = [
			'QtaVenduta',
			'PrezzoMedio',
			'Ricavo',
			'CostoMagazzino_MateriePrime',
			'CostiMagazzino_ProdottiFiniti',
		]

		for (var i = 0; i < tipologie.length; i++) {
			if (labelCode.indexOf(tipologie[i]) > -1) {;
				labelCode = labelCode.replace(tipologie[i], 'Tipologia');
			}
		}

		var labels = {

			// Sez. 1.1
			'Tipologia_1': 'Tipologia 1',
			'Tipologia_2': 'Tipologia 2',
			'Tipologia_3': 'Prodotto 3sss',
			'Tipologia_4': 'Tipologia 4',
			'Tipologia_5': 'Tipologia 5',

			'PercIva_Ricavi_1': 'IVA Ricavi',
			'PercIva_CostiEsterni_1': 'IVA Costi esterni',
			'IvaDebito_1': 'IVA a debito',
			'RicaviTotali_1': 'Ricavi totali',
		}

		return ((labels[labelCode] == undefined)? labelCode : labels[labelCode]);
	}
})
