// textarea.js -> "textarea" snippet management file
// target:  <snp_textarea />
// funct.:  
// output:  text area
define ([], function() {

    var _ITEMNAME = 'textarea';                              // Item's name
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
		var enabled, classes, html, v;

        // Sets specific attributes for disabled or enabled fields
        enabled  = (pbAttrs[1].toLowerCase().indexOf('disabled') > -1) ? false : true;

        // HTML definition
        myHtml  = '<textarea class="form-control cleanInput noresize ' + _ITEMNAME + pbAttrs[0] + '"';

        v = ((tagPars.value != null) ? tagPars.value : 'null');
        myHtml += ((enabled)? ' ov="' + v + '" ' : '');							// ov

        if (tagPars.key != null) {
            myHtml += ' id="'  + tagPars.key + '"';								// id
            myHtml += ' key="' + tagPars.key + '"';								// key
        }

        myHtml += pbAttrs[1] + '>' + tagPars.value + '</textarea>';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }
});