// setsNumber.js -> "setsNumber" widget management file
// target:  <widget_setsNumber/>
// funct.:  Introduzione ore/minuti in due campi con spin button
// output:  input range formattato
define (['../snippets/input_range.js'], function(range) {

    var itemName = 'setsNumber';                            // Item's name
    var itemTag  = 'widget_';                               // Item's tag prefix

    return {
        itemName,
        itemTag,
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

        var widgetHtml = '';
        var localTPars, localPAttr;

        var sInt    = 'Nr';                                                 // Symbol for number
        var sDec    = ',';                                                  // Symbol for separate 
        var maxInt  = (tagPars.max != null)? tagPars.max: '*';              // Sets max value ("*": no limit)
        var minInt  = (tagPars.min != null)? tagPars.min: '0';              // Sets min value (default: 0)
        var stepInt = (tagPars.step != null)? tagPars.step: 1;              // Step value for the "Int" spin buttons
        var stepDec = (tagPars.stepD != null)? tagPars.stepD: 1;            // Step value for the "Dec" spin buttons
        if (isNaN(maxInt)) {                                                // Builds "maxlength" attribute for the "Int" field
            var maxLength = '';
        } else {
            var maxLength = ' maxlength="' + maxInt.toString().length + '" ';
        }


        // Widget wrapper
        widgetHtml  = '<div class="' + itemName + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
        widgetHtml += ' <div class="input-group">';

        // "Integer" input group declaration:
        localTPars = { value: tagPars.val_i, key: tagPars.key_i }           // Sets "Int" values from main "tagPars"
        localPAttr = [                                                      // Sets the specific input field's attributes:
            ' text-right ' +                                                // Added to the "class" attribute
            ((pbAttrs[1].indexOf('autofill') > -1)? ' autofill ': ''),      // Checks for the "autofill" attribute
            ' min="' + minInt + '" max="' + maxInt + '"step="' +            // Others tag's attributes
                stepInt + '" placeholder="(Int)" ' + maxLength
        ];
        widgetHtml += '<span class="input-group-addon">' + sInt + '</span>';
        widgetHtml += 
            range.BuildHtmlSync(localTPars,  localPAttr);

        // "Decimal" input group declaration:
        localTPars = { value: tagPars.val_d, key: tagPars.key_d }           // Sets "Dec" values from main "tagPars"
        localPAttr = [                                                      // Sets the specific input field's attributes
            ' text-right autofill ',                                        // Added to the "class" attribute ("autofill" mandatory)
            ' min="0" max="99" step="' + stepDec +                          // Others tag's attributes
                '" placeholder="(dec.)" maxlength="2"'
        ];
        widgetHtml += '<span class="input-group-addon internal">' + sDec + '</span>';
        widgetHtml += 
            range.BuildHtmlSync(localTPars,  localPAttr);

        // Close wrapper
        widgetHtml += ' </div>';
        widgetHtml += '</div>';


        // Return value
        return new Promise((resolve, reject) => { resolve(widgetHtml) });

    }

});