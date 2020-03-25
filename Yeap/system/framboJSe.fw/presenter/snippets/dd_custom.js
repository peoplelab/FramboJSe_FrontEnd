// dd_custom -> Select generica popolata con elementi passati come parametro (JSON)
// target:  <snp_dd_custom />
// output:  drop down

define(["./dd_base.js"], function (base) {

	var _ITEMNAME = 'dd_custom';
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
	//  htmlRes : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {

		var attrId = 'data-options';
		var myHtml = '';
		
		if (pbAttrs[1].includes(attrId)) {

			var charFrom;
			var charTo;
			var options;
			var data = { items: [] };												// Array degli items da aggiungere alla select
			var keys;

			charFrom   = pbAttrs[1].indexOf(attrId) + attrId.length + 2;			// Posizione apertura stringa
			charTo     = pbAttrs[1].indexOf('"', charFrom);							// Posizione chiusura stringa
			options    = pbAttrs[1].substring(charFrom, charTo);					// Estrae la stringa JSON
			pbAttrs[1] = pbAttrs[1].replace(attrId + '="' + options + '"', '');		// Elimina l'attributo da pbAttrs

			options = options.replace(/'/g,'"');									// Sostituizione delimitatori apice singolo (') in virgolette (")
			jOpts   = JSON.parse(options);											// Trasformazione in JSON
			keys    = Object.keys(jOpts);											// Costruzione dell'array delle chiavi

			for (var i = 0; i < keys.length; i++) {									// Costruzione dell'array degli item
				data.items.push({ 
					Value: jOpts[keys[i]],
					Text : keys[i]
				});
			}

			tagPars.itemName = _ITEMNAME;
			myHtml = base.RenderJson(data, tagPars, pbAttrs);

		}

		return new Promise((resolve,reject) => { resolve(myHtml) });

	}


	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function extend(params) {

		// Aggiorna il flag "changed"
		$('.dd_custom').change(function(){
			__SYS_status.hasChanged = true;										// Aggiornamento STATUS globale: attiva il flag di valore modificato

			$(this).addClass('hasChanged');

		});
	}

});
