// input_hidden.js -> "input_hidden" snippet management file
// target:  <snp_input_hidden/>
// funct.:  
// output:  campo input nascosto
define (['./input_kernel.js'], function(kernel) {

    var _ITEMNAME = 'input_hidden';                          // Item's name
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
    //  builds the snippet's HTML code (syncronous mode)
    // PARAMS:
    //  tagPars : tag's custom parameters (in JSON format)
    //  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
    //              pbAttrs[0] : extension of "class" attribute,
    //              pbAttrs[1] : all others attributes 
    // RETURN:
    //  Textual HTML code
    function coreHtml(tagPars, pbAttrs) {

        var customAttrs = pbAttrs[1];

        var kPars = {
            Input: 'hidden',
            Class: _ITEMNAME + pbAttrs[0],
            Attrs: customAttrs
        }
        return kernel.Build(kPars, tagPars);
    }

});