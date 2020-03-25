// slider.js -> "slider" widget management file
// target:  <widget_slider/>
// funct.:  Costruzione di uno slider jQuery-ui
// output:  input range formattato
define ([
    '../snippets/input_hidden.js'
], function(hidden) {

    var itemName    = 'slider';													// Item's name
    var itemTag     = 'widget_';												// Item's tag prefix
    var snippetName = 'widget_slider';											// Snippet's name

    return {
        itemName,
        itemTag,
        BuildHtml: buildHtml,
        Extend   : extend,
		//GetLabel : getLabel
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
        
        var myHtml    = '';
        var rootName  = tagPars.root;

        // HTML definition
        myHtml += '<div class="' + itemName + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
		myHtml += '<div class="sliderBar" ref="' + rootName + '"></div>';
		myHtml += '<div class="sliderLabel">lalalabel</div>';
		myHtml += hidden.BuildHtmlSync( {value: tagPars.min, key: rootName + '_min'}, ['',''] );
		myHtml += hidden.BuildHtmlSync( {value: tagPars.max, key: rootName + '_max'}, ['',''] );
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
	function extend(params) {

		var $slider = $(params.domain + '.slider')

		$slider.each(function() {

			var wSlider = $(this).find('.sliderBar');
			var wLabel  = $(this).find('.sliderLabel');
			var unit    = $(this).attr('data-unit')
			var ref     = '#' + wSlider.attr('ref');


			wSlider.slider({
				range: true,
				min: eval($(this).attr('data-bottom')),						// Slider: estremo inferiore
				max: eval($(this).attr('data-top')),							// Slider: estremo superiore
				step: eval($(this).attr('data-step')),						// Passo
				values: [
					$(ref+'_min').val(),										// Range: limite inferiore
					$(ref+'_max').val(),										// Range: limite superiore
				],
				slide: function(event,ui) {

					$(ref+'_min').val(ui.values[0]);							// Aggiorna valore minimo
					$(ref+'_max').val(ui.values[1]);							// Aggiorna valore massimo
					$(this).trigger('drawlabel');
				},
				change: function(event,ui) {
					if (event.originalEvent) {
						$(this).trigger('haschanged');
					}
				}
				
			})
			.bind('drawlabel', function() {										// Metodo aggiuntivo per scrivere la didascalia
				
				var $slider = $($(this).parent());								// Risale al container dello slider

				var obj = $slider.find('.sliderLabel');							// Container della didascalia
				var min = $slider.find('input[id*=_min]').val();				// Hidden field del valore min.
				var max = $slider.find('input[id*=_max]').val();				// Hidden field del valore max.
				var um  = $slider.attr('data-unit');							// Attributo: unità di misura

				var label = '';
				label += 'Da: <span class="value">' + min + '</span> ';			// Costruzione nuova didascalia
				label += 'a: <span class="value">' + max + '</span> ';
				label += '<span class="unit">' + um + '</span> ';
				$(obj).html(label);												// Replace della didascalia

			})
			.bind('haschanged', function() {									// Metodo aggiuntivo per tracciare l'evento "change"
				return true;
			});

			$(this).find('.sliderBar').trigger('drawlabel');					// Inizializza la didascalia

		});
	}

});



