//----------------------------------------------------------------------------------------
// File  : dd_elenchiQA.js
//
// Desc  : Costruttore dei drop down dei campi Analisi Qualitativa
// Path  : /Private/framboJse.ext/snippets
// target:  <dd_elenchiQA />
// output:  drop down
//----------------------------------------------------------------------------------------

define([
	'templatesHandler',
	'dd_base',
	'/private/modules/common/model/resources.model.js'
], function (th, base, resources) {

	var _ITEMNAME = 'dd_elenchiQA';
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

		var search = tagPars.search
		var filter = tagPars.filter
		
		return retrieveXmlSource()
			.then( function(response){

				var tipoAzienda = $('#bpTipologyCode').text();					// Codice tipologia azienda (letto dal campo nascosto della dashboard)
				search = (search == undefined)? 'element' : search;
				filter = (filter == undefined)? ':has(parent_ext:contains("' + tipoAzienda + '"))' : filter;
				var searchFor = '>' +search +'s>' + search;
							
				var myHtml = base.RenderXmlNode({
					xmlData : base.GetXmlNode({
						xmlRaw : response,
						element: tagPars.root + searchFor,
						filter : filter,
					}),
					xmlValue: 'code',
					xmlLabel: 'name',
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

		return resources.XmlQA({
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
	//  ...
	// RETURN:
	//  ...
	function extend(params) {

	}

});