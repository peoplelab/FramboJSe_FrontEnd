// glyph_mandatory.js -> "glyph_mandatory" snippet management file
// target:  <snp_glyph_mandatory />
// funct.:  Inserimento del link/icona "info" di marcatura dei campi obbligatori
// output:  glyphicon/link
define ([], function() {

    var _ITEMNAME = 'glyph_mandatory';                       // Item's name
    var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

    return {
        itemName: _ITEMNAME,
        itemTag: _ITEMTAG,
        BuildHtml: buildHtml, 
        BuildHtmlSync: buildHtmlSync 
    }


    // FUNCTION: buildHtml
    //  Invokes the snippet resolution in Asyncronous mode
    // PARAMS:
    //  Parameters to be passed to the builder function ("coreHtml")
    // RETURN:
    //  myHtnml : new Ppromise containing the HTML code
    function buildHtml(tagPars, pbAttrs) {
        
        return new Promise((resolve, reject) => { resolve( coreHtml(tagPars, pbAttrs) ) });
    }


    // FUNCTION: buildHtmlSync
    //  Invokes the snippet resolution in Syncronous mode
    // PARAMS:
    //  Parameters to be passed to the builder function ("coreHtml")
    // RETURN:
    //  myHtnml : simple textual HTML code
    function buildHtmlSync(tagPars, pbAttrs) {
        
        return coreHtml(tagPars, pbAttrs);
    }


    // FUNCTION: coreHtml
    //  builds the snippet's HTML code 
    // PARAMS:
    //  tagPars : tag's custom parameters (in JSON format)
    //  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
    //              pbAttrs[0] : extension of "class" attribute,
    //              pbAttrs[1] : all others attributes 
    // RETURN:
    //  myHtnml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
    //  Textual HTML code
    function coreHtml(tagPars, pbAttrs) {

        var myHtml = '';

        // HTML definition
        myHtml += '<a class="' + _ITEMNAME + pbAttrs[0] + ' infoPopup mandatory"';
        myHtml += '  tabindex="999" role="button" data-toggle="popover" data-trigger="focus" data-placement="top"';
        myHtml += '  data-content="Campo obbligatorio"';
        myHtml += pbAttrs[1] + '>';
        myHtml += '  <span class="fa fa-asterisk margin-r-5"></span>';
        myHtml += '</a>';
        
        // Return value
        return myHtml
        
    }

});