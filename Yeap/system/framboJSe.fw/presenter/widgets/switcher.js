// switcher.js -> "switcher" widget management file
// target:  <widget_switcher/>
// funct.:  Rappresentazione grafica delle checkboxes come switcher "on/off"
// output:  slider "slideThree" 
define ([], function() {

    var itemName = 'switcher';                              // Item's name
    var itemTag  = 'widget_';                               // Item's tag prefix
    var snippetName = 'widget_switcher';     // Snippet's name

    return {
        itemName,
        itemTag,
        BuildHtml: buildHtml,
		Extend   : extend
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

        // HTML definition
        myHtml += '<div class="' + itemName + pbAttrs[0] + ' slideThree custom" ';
		if (tagPars.key != null) {
			myHtml += 'ref="' + tagPars.key + '" ';
		}
		myHtml += pbAttrs[1] + '>';
        myHtml += '  <input ';
		if (tagPars.key != null) {
			myHtml += ' id="' + tagPars.key + '"';								// id
			myHtml += ' key="' + tagPars.key + '"';								// key
		}
        myHtml += '  class="cleanInput" type="checkbox"';
        myHtml +=     (tagPars.value == '1')? ' checked="checked"' : '';  
        myHtml += '   ov="' + tagPars.value + '" key="' + tagPars.key + '">';
        myHtml += '  <label class="checkbox" for="' + tagPars.key + '"></label>';
        myHtml += '</div>';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }

	// FUNCTION: extend
	//  extends functionality of snippet/widget after putting object in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  none, but datePicker object:
	//  1) will be transformed in "datepicker" jquery object;
	//  2) will have "keypress" event attached (only numbers will be valid numbers);
	//  3) will handle hidden textboxes of date parts
	function extend(params) {

		// Aggiorna il flag "changed"
		$('.switcher.trace-on input').change(function(){
			__SYS_status.hasChanged = true;										// Aggiornamento STATUS globale: attiva il flag di valore modificato

		//	$(this).addClass('hasChanged');										// Non c'è un elemento da colorare...

		});

	}

});
