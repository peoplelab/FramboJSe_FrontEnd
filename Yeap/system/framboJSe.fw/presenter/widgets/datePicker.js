// datePicker.js -> "datePicker" widget management file
// target:  <widget_datePicker/>
// funct.:  Introduzione data in un campo con datePicker popup
// output:  input range formattato
define([
    'base_presenter',
	'datepicker',
    '../snippets/input_text.js',
    '../snippets/input_hidden.js'
], function (pBase, dp, text, hidden) {

	var itemName    = 'datePicker';												// Item's name
	var itemTag     = 'widget_';												// Item's tag prefix
	var snippetName = 'widget_datePicker';										// Snippet's name

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

		var widgetHtml = '';

		var glyphIcon  = 'far fa-calendar-alt';									// Glyph icon 
		var rootName   = tagPars.root;
		var dateGgMmAa = '';

		var disabled_rawvalue  = (tagPars.disabled == null) ? '' : tagPars.disabled;
		var disabled_value = false;

		if (disabled_rawvalue.length > 0) {
			try {
				disabled_value = eval(disabled_rawvalue);
			} catch (err){
				disabled_value = false;
			}
		}

		// Normalizes date values (only if it has been defined a date value)
		if (tagPars.gg != '') {
			dateGgMmAa  = ((tagPars.gg < 10)? '0' : '') + tagPars.gg + '/';
			dateGgMmAa += ((tagPars.mm < 10)? '0' : '') + tagPars.mm + '/';
			dateGgMmAa += tagPars.aa;
		}


		// Define HTML
		widgetHtml  = '<div class="' + itemName + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
		widgetHtml += ' <div class="input-group date">';
		widgetHtml += '  <span class="input-group-addon"><i class=" ' + glyphIcon + '"></i></span>';

		widgetHtml += 
			text.BuildHtmlSync(
				{value: dateGgMmAa},
				[' datepicker ', 'placeholder="gg/mm/aaaa" maxlength="10" ref="' + rootName + '" ' + (disabled_value ? 'disabled="disabled"':'')]
			);
		widgetHtml += hidden.BuildHtmlSync( {value: tagPars.gg, key: rootName + '_gg'}, ['',''] );
		widgetHtml += hidden.BuildHtmlSync( {value: tagPars.mm, key: rootName + '_mm'}, ['',''] );
		widgetHtml += hidden.BuildHtmlSync( {value: tagPars.aa, key: rootName + '_aa'}, ['',''] );

		widgetHtml += ' </div>';
		widgetHtml += '</div>';

		// Return value
		return new Promise((resolve, reject) => { resolve(widgetHtml) });

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

		// Loads requested resources:
		pBase.LoadResources( {css: ['{{trd}}/datepicker/datepicker.min.css']} );

		var $picker = $(params.domain + '.datepicker');

		var dpParams = {
			format     : 'dd/mm/yyyy',
			language   : 'it',
			orientation: 'auto',
			todayHighlight: true
		};
		dp.Datepicker({ obj: $picker, options: dpParams })

		
		$picker
		.on('keypress', function () {
			return pBase.ValidatesChar(event, '0123456789/', $(this).val().length, $(this).attr('maxlength'));
		})
		.on('change, blur', function () {

			ref = '#' + $(this).attr('ref');
			if ($(this).val() != null && $(this).val() != '') {
				
				var myDate = dp.GetDate( $(this) );								// Gets the date value of the datapicker object				
				var my_gg  = myDate.getDate();
				var my_mm  = myDate.getMonth() + 1;
				var my_aa  = myDate.getFullYear();

				// Check date
				if (my_gg < 10) { my_gg = '0' + my_gg }
				if (my_mm < 10) { my_mm = '0' + my_mm }
				if (my_aa < 10) { my_aa = '0' + my_aa }
				if (parseInt(my_aa) < 100) { my_aa = '20' + my_aa }

				$(ref + '_gg').val(my_gg);
				$(ref + '_mm').val(my_mm);
				$(ref + '_aa').val(my_aa);

				var normalizedDate = my_gg + '/' + my_mm + '/' + my_aa;
				if ($(this).val() != normalizedDate) {
					$(this).val(normalizedDate);
				}

			} else {

				$(ref + '_gg').val('');
				$(ref + '_mm').val('');
				$(ref + '_aa').val('');

			}
			$(this).change();													// Forza l'evento "change" del campo per triggerare eventuali listener

		})
		.on('changeDate', function() {											// Hide the datapicker after selecting a date
			$(this).datepicker('hide');
		});
	}

});