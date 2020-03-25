// group_dashboard.js -> "group_dashboard" snippet management file
// target:  <snp_group_dashboard />
// funct.:  Dashboard dei controlli delle pagine di edit
// output:  Div container > buttons
define ([], function() {

    var _ITEMNAME = 'group_dashboard';                       // Item's name
    var _ITEMTAG  = 'snp_';                                  // Item's tag prefix
	var btnMask  = 'SUCR';									// Dashboard buttons' view mask: Save Undo Clear Return (default: all)

    return {
        itemName: _ITEMNAME,
        itemTag: _ITEMTAG,
        BuildHtml: buildHtml,
        //Extend: extend				// Da sbloccare con più calma
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
        
        var myHtml, txtMsg;
        
		btnMask = (tagPars.mask != undefined && tagPars.mask != '')? tagPars.mask.toUpperCase() : btnMask;		// Gets the buttons' mask

        // HTML definition
        txtMsg  = '';
        txtMsg += (btnMask.indexOf('S') < 0)? '' : '<p><b>Salva:</b> salva i dati;</p>';
        txtMsg += (btnMask.indexOf('U') < 0)? '' : '<p><b>Ripristina:</b> ripristina i valori originali <i>(senza salvare)</i></p>';
        txtMsg += (btnMask.indexOf('C') < 0)? '' : '<p><b>Pulisci:</b> svuota tutti i campi visualizzati <i>(non effettua salvataggio)</i>;</p>';
        txtMsg += (btnMask.indexOf('R') < 0)? '' : '<p><b>Ritorna:</b> ritorna alla pagina precedente.</p>';

        myHtml  = '<div class="dashboard'  + pbAttrs[0] + '" ' + pbAttrs[1] + '>';
		myHtml += (btnMask.indexOf('S') < 0)? '' : '<a class="btn button_save">Salva</a> ';
		myHtml += (btnMask.indexOf('U') < 0)? '' : '<a class="btn button_undo">Ripristina</a> ';
		myHtml += (btnMask.indexOf('C') < 0)? '' : '<a class="btn button_clear">Pulisci</a> ';
		myHtml += (btnMask.indexOf('R') < 0)? '' : '<a class="btn button_return">Ritorna</a> ';
		if (txtMsg != '') {
			myHtml += '<a class="infoPopup edit" tabindex="999" role="button" data-toggle="popover" data-trigger="focus" data-html="true" data-content="' + txtMsg + '" data-placement="left">';
            myHtml += '  <span><i class="fas fa-info-circle fa-lg"></i></span>';
			myHtml += '</a>';
		}
		myHtml += '</div>';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }


    // FUNCTION: extend
    //  extends functionality of snippet/widget after object creation in the DOM.
    // PARAMS:
    //  domain : html object container.
    // RETURN:
    //  Object's callback functions
    function extend(params) {


		// *** AL MOMENTO E' DISABILITATA 
		// *** OK PER LA LETTURA DELL'URL (ANDREBBE SCRITTO IN UN CAMPO DEL SITEMAP)
		// *** DA VEDERE COME FARGLI ARRIVARE LA VALORIZZAZIONE DI ONSAVE (VARIABILE GLOBALE?)
		// ***
		// *** RISOLUZIONE RIMANDATA A UN SECONDO MOMENTO

		var domain  = (params.Domain != undefined)? params.Domain : '';
		var nodeUrl = (params.NodeUrl != undefined)? params.NodeUrl : '';
		var onSave  = params.OnSave;


        //$(domain + '.button_return').on("click",
        //    function(){									// Redirect to the view page
        //        location.href = nodeUrl;
        //    }
        //);      
        $(domain + '.button_return').on("click",
            function(){									// Redirect to the view page
                var $items = $('#siteMap .breadcrumb a');
				var parent = $($items[$items.length - 2]).attr('href');
				location.href = parent;		//console.log ('href: '+href)
            }
        );      
        $(domain + '.button_clear').on("click",
            function(){									// Clears all input values 
				$(".cleanInput").each(function () {
					$(this).val('');
				});

				$("input.cleanDatePicker").each(function () {
					$(this).val('');
				});

				$(':input,select option, checkbox').prop("checked", false).prop("selected", false);
            }
        );
        $(domain + '.button_undo').on("click",
            function(){									// Resets the original values
				$('[ov]').not('[disabled]').each(function(){

					e = $(this);
					t = e.attr('type');
					v = e.attr('ov');

					switch(t) {
						case 'checkbox':
							e.prop('checked', (v == 1) ? 'checked' : '');
							break;

						case 'radio':
							break;
                                    
						default:
							e.val(v);
					}
				});
            }
        );  
        $(domain + '.button_save').on("click",
            function () {								// "Save data" callback
                onSave();
            }
        );
        $(domain + '.infoPopup.edit').popover();

	}

});