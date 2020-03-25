//----------------------------------------------------------------------------------------
// File  : input_scaled.js
//
// Desc  : Campo di input e relativo campo mirror/hidden per gestire i valori scalati scambiati con Saas
// Path  : /Private/framboJse.ext/widgets
// target:  <widget_input_scaled/>
// output:  campo input testo generico e campo hidden
//----------------------------------------------------------------------------------------
define ([
	'input_text',
	'input_hidden',
], function(text, hidden) {

    var _ITEMNAME   = 'input_scaled';											// Item's name
    var _ITEMTAG    = 'widget_';												// Item's tag prefix
	var snippetName = 'widget_input_scaled';									// Snippet's name

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
	//  myHtnml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {
        
		var widgetHtml = '';

		var value  = tagPars.value;
		var scale  = tagPars.scale;
		var scaled = value / scale;


		// Define HTML
		widgetHtml  = '<div class="' + _ITEMNAME + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
		widgetHtml += 
			text.BuildHtmlSync(
				{value: scaled},
				['', ' ref="' + tagPars.key + '" ' + ' id="' + tagPars.key + 'Ref" ' + pbAttrs[1] ]
			);
		widgetHtml += hidden.BuildHtmlSync( {value: value, key: tagPars.key}, ['','scale="' + scale +'"'] );
		widgetHtml += '</div>';

		// Return value
		return new Promise((resolve, reject) => { resolve(widgetHtml) });

    }


	// FUNCTION: extend
	//  extends functionality of snippet/widget after putting object in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	function extend(params) {
	
		// Aggiornamento campo mirror
		$('.' + _ITEMNAME + ' .input_text').change(function(){

			var mirror = '#' + $(this).attr('ref');														// ID del campo 'mirror' (valore effettivo)
			var value  = $(this).val();																	// Valore iintrodotto
			var newVal;																					// Nuovo valore effettivo

			// Check 1
			if (value != null && value != '') {


				// Non è null:
				if (value.indexOf(',') > -1) {															// Normalizza il formato dei decimali
					value = value.replace(/\./g, "");
					value = value.replace(',', ".");
				}

				var scale  = $(mirror).attr('scale');													// Determina il fattore di scala
				var mValue = value * scale;
			
				if (!isNaN(mValue)) {
					newVal = parseInt(mValue);
				}
			}

			__SYS_status.hasChanged = true;																// Aggiornamento STATUS globale: attiva il flag di valore modificato
			$(this).addClass('hasChanged');
			$(mirror).val( newVal );
		});
	}


	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function _extend(params) {

		// Aggiorna il flag "changed"
		$('.input_scaled .input_text').change(function(){
			__SYS_status.hasChanged = true;																// Aggiornamento STATUS globale: attiva il flag di valore modificato

			$(this).addClass('hasChanged');

		});
	}

})
