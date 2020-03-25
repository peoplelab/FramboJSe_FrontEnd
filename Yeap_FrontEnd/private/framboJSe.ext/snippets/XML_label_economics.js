//----------------------------------------------------------------------------------------
// File  : XML_label.js
//
// Desc  : Costruisce una label prelevando il testo dal nodo XML richiesto
// Path  : /Private/framboJse.ext/snippets
// target:  <dd_elenchiQA />
// output:  label
//----------------------------------------------------------------------------------------
define ([
	'templatesHandler',
	'dd_base',
	'/system/framboJSe.fw/presenter/snippets/glyph_mandatory.js',
//	'https://localhost:9000/system/framboJSe.fw/presenter/snippets/glyph_mandatory.js',        // §§§ X Framework in rete
], function (th, base, gm) {

	var _ITEMNAME = 'XML_label_economics';
	var _ITEMTAG  = 'snp_';

	return {
		itemName : _ITEMNAME,													// Item's name
		itemTag  : _ITEMTAG,													// Item's tag prefix
		BuildHtml: buildHtml,													// Item's HTML
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
	//  myHtml  : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {
        
		tagPars.itemName = _ITEMNAME;


    	var myHtml = '';
		var val    = (tagPars.value != null)? tagPars.value : '0';
		var attr   = (tagPars.attr  != null)? tagPars.attr  : 'codiceUI';
		var hasAdd = (tagPars.add   != null)? tagPars.add   : '';

		var xmlNode = base.GetXmlNode({
			xmlRaw : __Preloads.economics.RawData,								// XML precaricato (economics presenter)
			element: '[' + attr + '=' + val + ']',
		});

		// HTML definition
		if (xmlNode.length > 0) {
			var txt = xmlNode[0].textContent;
			var lnk = $(xmlNode).attr('link');

			// PATCH (08/01/2020): Gestione label "added" => escamotage per gestire etichette alternative tramite il contenuto dell'attributo "add"
			// ** NOTA: alcuni campi sono ripetuti (es. "Finanziamenti bancari") -> hanno la stessa etichetta -> nella pag. degli errori non si riescono a distinguere ==> aggiungo solo dove serve un suffisso per identificarli
			var add = $(xmlNode).attr('add');
			if (add != null && add != undefined && hasAdd == 'true') {
				txt += add;
			}
		} else {
			var txt = val;
			var lnk;
		}

		// Patch (08/11/2018): se il nodo ha l'attributo "link" [Vedi economics.xml] costruisce un tag "<a>", altrimenti crea un'etichetta
		if (lnk == null || lnk == '') {

			myHtml += '<label class="' + ( (pbAttrs[0].indexOf('title') < 0)? 'rowLabel ' : '' );
			myHtml += 'df-' + _ITEMNAME + pbAttrs[0] + '" ';
			myHtml += 'ref="' + tagPars.value + '" ';
			myHtml += pbAttrs[1] + '>';
			myHtml += (txt != '')? decodeURIComponent(txt) : '[xml]';
			myHtml += '</label>';
			myHtml += (tagPars.label)? '<span style="font-size:80%;color:#96c;float:right;padding-left:15px"><i>(' + val + ')</i></span>' : '';		// Stampa il codice etichetta (sviluppo)

			// Checks for appending the mandatory field icon
			if (pbAttrs[1].toLowerCase().indexOf('mandatory') > -1 ) {

				// Invokes the resolution of "mandatory" snippet via synchronous method
        		var behavior = (pbAttrs[1].indexOf('nodefault') > -1) ? ' nodefault ' : '';
        		var labelRef = 'ref="' + tagPars.text.replace(' ', '_').toLowerCase() + '"';

        		myGlyph = gm.BuildHtmlSync('', [behavior, labelRef]);
				myHtml = myGlyph + myHtml;

			}
		} else {

			myHtml += '<a class="' + ( (pbAttrs[0].indexOf('title') < 0)? 'rowLabel ' : '' );
			myHtml += 'df-' + _ITEMNAME + pbAttrs[0] + '" ';
			myHtml += 'href="' + lnk + '">';
			myHtml += (txt != '')? decodeURIComponent(txt) : '[xml]';
			myHtml += '</a>';

		}

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

})
