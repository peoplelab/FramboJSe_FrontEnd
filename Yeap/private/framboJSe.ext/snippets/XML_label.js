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
    '/private/modules/common/model/resources.model.js',
	'/system/framboJSe.fw/presenter/snippets/glyph_mandatory.js',
], function (th, base, resources, gm) {

    var _ITEMNAME = 'XML_label';
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
		var attr   = (tagPars.attr  != null)? tagPars.attr  : 'qcode';

        return retrieveXmlSource()
			.then( function(response){
				

				var xmlNode = base.GetXmlNode({
					xmlRaw : response,
					element: '[' + attr + '=' + val + ']',
				});

				// HTML definition
				myHtml += '<label class="df-label ' + _ITEMNAME + pbAttrs[0] + '" ';
				myHtml += pbAttrs[1] + '>';
				myHtml += (tagPars.before != null)? tagPars.before : '';
				myHtml += $(xmlNode).attr('name');
				myHtml += (tagPars.after != null)? tagPars.after : '';
				myHtml += '</label>';

				// Checks for appending the mandatory field icon
				if (pbAttrs[1].toLowerCase().indexOf('mandatory') > -1 ) {

					// Invokes the resolution of "mandatory" snippet via synchronous method
        			var behavior = (pbAttrs[1].indexOf('nodefault') > -1) ? ' nodefault ' : '';
        			var labelRef = 'ref="' + tagPars.text.replace(' ', '_').toLowerCase() + '"';

        			myGlyph = gm.BuildHtmlSync('', [behavior, labelRef]);
					myHtml = myGlyph + myHtml;

				}

				//return myHtml;
				// Return value
				return new Promise((resolve, reject) => { resolve(myHtml) });

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
