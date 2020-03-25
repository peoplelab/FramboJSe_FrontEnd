// button_delete.js -> "button_delete" snippet management file
// target:  <snp_button_delete />
// funct.:  Inserimento del pulsante "Cancella" nelle righe delle tabelle
// output:  button
define ([], function() {

    var _ITEMNAME = 'button_delete';                         // Item's name
    var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

    return {
        itemName: _ITEMNAME,
        itemTag: _ITEMTAG,
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
		var icon   = 'far fa-window-close';										// Font awesome icon

        // HTML definition
        myHtml += '<button class="' + _ITEMNAME + pbAttrs[0] + ' btn" ref="' + tagPars.ref + '" title="Elimina" type="button" ' + pbAttrs[1] + '>';
		myHtml += '  <i class="' + icon + '"></i>';
        myHtml += '</button>';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }

});