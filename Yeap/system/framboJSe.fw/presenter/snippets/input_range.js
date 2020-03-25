// input_range.js -> "input_range" snippet management file
// target:  <snp_input_range/>
// funct.:  
// output:  campo input testo generico
define (['./input_kernel.js'], function(kernel) {

    var _ITEMNAME = 'input_range';                           // Item's name
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
    //  Textual HTML code
    function coreHtml(tagPars, pbAttrs) {

        var customAttrs = pbAttrs[1] + ' checksFor="range" ';

        var kPars = {
            Input: 'number',
            Class: _ITEMNAME + pbAttrs[0],
            Attrs: customAttrs
        }
        var myHtml = kernel.Build(kPars, tagPars);

        // Defines field's type symbol (if requested)
        if (pbAttrs[1].toLowerCase().indexOf('hasicon') > -1 ) {

            var htmlWrap, closeWrap;

            htmlWrap  = '<div class="input-group">';
            htmlWrap += '<span class="input-group-addon text"';
            htmlWrap += 'title="Campo numerico intero">';           // Tooltip text shown on mouseover
            htmlWrap += 'Nr';                                       // Symbol/text displayed 
            htmlWrap += '</span>';

            closeWrap = '</div>';

            myHtml = htmlWrap + myHtml + closeWrap;
        }

        // Return value
        return myHtml;

    }

});