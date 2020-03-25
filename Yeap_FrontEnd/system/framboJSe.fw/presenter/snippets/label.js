// label.js -> "label" snippet management file
// label.js -> File di gestione dello snippet "label"
// target:  <snp_label />
// funct.:  
// output:  Label
define (['./glyph_mandatory.js'], function(gm) {

    var _ITEMNAME = 'label';                                 // Item's name
    var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

    return {
        itemName: _ITEMNAME,
        itemTag: _ITEMTAG,
        BuildHtml: buildHtml,
        Extend: extend										// Callback function management
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
    	//var behavior = (pbAttrs[1].indexOf('nodefault') > -1) ? ' nodefault ' : '';

        // HTML definition
        myHtml += '<label class="df-' + _ITEMNAME + pbAttrs[0] + '" ';
        myHtml += pbAttrs[1] + '>';
        myHtml += tagPars.text;
        myHtml += '</label>';

        // Checks for appending the mandatory field icon
        if (pbAttrs[1].toLowerCase().indexOf('mandatory') > -1 ) {

            // Invokes the resolution of "mandatory" snippet via synchronous method
        	var behavior = (pbAttrs[1].indexOf('nodefault') > -1) ? ' nodefault ' : '';
        	var labelRef = 'ref="' + tagPars.text.replace(' ', '_').toLowerCase() + '"';

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

})
