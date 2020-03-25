//----------------------------------------------------------------------------------------
// File  : dd_settoriAzienda.js
//
// Desc  : Elenco delle Tipologie Azienda (settings)
// Path  : /Private/framboJse.ext/snippets
// target:  <snp_dd_tipologieAzienda />
// output:  drop down
//----------------------------------------------------------------------------------------

define([
    'templatesHandler',
    'dd_base',
    '/private/modules/common/model/resources.model.js'
], function (th, base, resources) {

	var _ITEMNAME = 'dd_settoriAzienda';
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

        return retrieveXmlSource()
			.then( function(response){
            
				var tipoAzienda = $('#bpTipologyCode').text();					// Codice tipologia azienda (letto dal campo nascosto della dashboard)

				var myHtml = base.RenderXmlNode({
					xmlData : base.GetXmlNode({
						xmlRaw : response,
						element: 'settore',
						filter : ':has(parent:contains("' + tipoAzienda + '"))',
					}),
					xmlValue: 'code',
					xmlLabel: 'desc',
					tagPars : tagPars,
					pbAttrs : pbAttrs,
				});
				return myHtml;
			});
    }

	// FUNCTION: retrieveXmlSource
	//  Retrievies the specific XML data source 
	// PARAMS:
	//	none
	// RETURN:
	//	the XML file
	function retrieveXmlSource() {

        return resources.XmlGeneral({
            onSuccess: onSuccessResult,
            onFailure: onFailureCall
        });

    }
    function onSuccessResult(result) {											// Currently: nothing
	}
    function onFailureCall(result) {											// Currently: nothing
	}
	

	// FUNCTION: extend
	//  extends functionality of snippet/widget after putting object in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  none, but datePicker object:
	//  1) will be transformed in "datepicker" jquery object;
	//  2) will have "keypress" event attached (only numbers will be valid numbers);
	//  3) will handle hidden textboxes of date parts
	function extend(params) {

		// $('#CodiceSettore').change(function(e){
		// 
		// })

	}

});