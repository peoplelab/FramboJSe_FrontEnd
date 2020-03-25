// setsHours.js -> "setsHours" widget management file
// target:  <widget_getsHours/>
// funct.:  Introduzione ore/minuti in due campi con spin button
// output:  input range formattato
define (['../snippets/input_range.js'], function(range) {

    var itemName = 'setsHours';                             // Item's name
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

        var glyphIcon = 'glyphicon-time';                                   // Glyph icon 
        var separator = ':';                                                // Symbol for separate 
        var step = 5;                                                       // Step value for the minutes spin buttons


        // Widget wrapper
        widgetHtml  = '<div class="' + itemName + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
        widgetHtml += ' <div class="input-group">';

        // "Hours" input group declaration:
        localTPars = { value: tagPars.val_h, key: tagPars.key_h }           // Sets "Hours" values from main "tagPars"
        localPAttr = [                                                      // Sets the specific input field's attributes:
            ' text-right ' +                                                // Added to the "class" attribute
            ((pbAttrs[1].indexOf('autofill') > -1)? ' autofill ': ''),      // Checks for the "autofill" attribute
            ' min="0" max="99999"  placeholder="Ore (hh)" maxlength="5"'    // Others tag's attributes
        ];
        widgetHtml += '<span class="input-group-addon glyphicon ' + glyphIcon + '"></span>';
        widgetHtml += 
            range.BuildHtmlSync(localTPars,  localPAttr);

        // "Minutes" input group declaration:
        localTPars = { value: tagPars.val_m, key: tagPars.key_m }           // Sets "Minutes" values from main "tagPars"
        localPAttr = [                                                      // Sets the specific input field's attributes:
            ' text-right autofill ',                                        // Added to the "class" attribute ("autofill" mandatory)
            ' min="0" max="59"  step="' + step +                            // Others tag's attributes
            '" placeholder="Min. (mm)" maxlength="2"'
        ];
        widgetHtml += '<span class="input-group-addon internal">' + separator + '</span>';
        widgetHtml += 
            range.BuildHtmlSync(localTPars,  localPAttr);

        // Close wrapper
        widgetHtml += ' </div>';
        widgetHtml += '</div>';

        // Return value
        return new Promise((resolve, reject) => { resolve(widgetHtml) });

    }

});