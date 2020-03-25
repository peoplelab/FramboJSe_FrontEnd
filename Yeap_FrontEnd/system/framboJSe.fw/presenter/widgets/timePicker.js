// timePicker.js -> "timePicker" widget management file
// target:  <widget_timePicker/>
// funct.:  Introduzione ore/minuti in due campi con spin button
// output:  input range formattato
define (['../snippets/input_range.js'], function(range) {

	var itemName = 'timePicker';												// Item's name
	var itemTag  = 'widget_';													// Item's tag prefix

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

		var glyphIcon = 'far fa-clock';											// Glyph icon 
		var separator = ':';													// Symbol for separate 
		var step = 5;															// Step value for the minutes spin buttons


		widgetHtml  = '<div class="' + itemName + pbAttrs[0] + '" ' + pbAttrs[1] + ' autofill >';
		widgetHtml += ' <div class="input-group">';

		// "Hours" section declarations: icon and input field
		widgetHtml += '  <span class="input-group-addon"><i class="' + glyphIcon + '"></i></span>';
		widgetHtml += 
			range.BuildHtmlSync(
				{value: tagPars.val_h, key: tagPars.key_h}, 
				['', ' min="0" max="23" placeholder="Ore (hh)" maxlength="2"'] 
			);

		// "Minutes" section declarations: separator symbol and input field
		widgetHtml += '  <span class="input-group-addon internal">' + separator + '</span>';
		widgetHtml += 
			range.BuildHtmlSync(
				{value: tagPars.val_m, key: tagPars.key_m}, 
				['', ' min="0" max="59" step="' + step + '" placeholder="Min. (mm)" maxlength="2"']
			);

		widgetHtml += ' </div>';
		widgetHtml += '</div>';

		// Return value
		return new Promise((resolve, reject) => { resolve(widgetHtml) });

	}

});