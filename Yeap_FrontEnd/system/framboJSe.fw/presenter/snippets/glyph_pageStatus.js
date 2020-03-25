// glyph_pageStatus.js -> "glyph_pageStatus" snippet management file
// target:  <snp_glyph_pageStatus />
// funct.:  Inserimento dell'icona di rappresentazione dello stato/funzionalità della pagina
// output:  glyphicon
define ([], function() {

    var _ITEMNAME = 'glyph_pageStatus';                      // Item's name
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
    //  myHtml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
    function buildHtml(tagPars, pbAttrs) {
        
        // HTML definition
        switch (tagPars.type) {
            case 'settings':
                var icon = 'fa-cog';
                break;

            case 'edit':
            default:
                var icon = 'fa-pencil-alt';
        }
        var myHtml = '<span class="' + _ITEMNAME + ' pageTypeIcon ' + pbAttrs[0] + '" ' + pbAttrs[1] + '><i class="fa ' + icon + '"></i></span>'

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }

});
