//----------------------------------------------------------------------------------------
// File: settings.presenter.js
//
// Desc: Presenter for Homepage
// Path: /Private/modules/settings/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu'
], function (pBase, th, snippets, modals, dashboard, model, menu) {

	// ** Module management **
	var _module    = {};																				// Mapping of the current module
	var _resources = {};                          														// Dichiarazione CSS aggiuntivo


	// ** Global variables **
	var _onInit = true;																					// Flag for "I'm initializing objects"
	var _xml    = '';																					// XML data (to show)
	var _pageID = '';																					// Sitemap/page ID
	var _templateID  = '';																				// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';															// Target container (ID) for the modal windows
	var _menuContainer   = '#menuContainer';															// Target container (ID) for the filter template
	var _pageContainer   = '#pageContainer';															// Target container (ID) for the list template
	var codiceUtente;


	return {

		Init      : init,																				// Initializes (setup) the page
		RenderPage: renderPage,																			// Render del contenuto pagina
		GetData4Saving: function () {																	// Gets data from page controls for saving
			return pBase.BuildsJson4Save('')
		},
		Show_ok_modal: function () {																	// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer
			})
		},
		Show_ko_modal: function (code, msg) {															// "Error" modal window's handler
			modals.ShowErr({
				target : _modalsContainer, 
				errCode: code,
				errMsg : msg
			})
		},
		Show_ko: function (code, msg) {																	// "Error" handler
			pBase.RedirectToErrorPage(code, msg);
		}

	}


	// FUNCTION: init
	//  Initializes the HTML page objects for UI render
	// PARAMS:
	//  params.page_id : page ID
	// RETURN:
	//  none
	function init(params) {

		_module.id  = SystemJS.map.currentPresenter.replace(location.origin, '');
		_pageID     = params.pageID;
		_templateID = params.templateID;

		// Initializes Pagedashboard
		dashboard.Init({ container: "dashboard" });

		// Initializes Menu
		menu.Init({ container: _menuContainer });
	}


	// FUNCTION: renderPage
	//  Starts process of getting the HTML template, fills it with XML values and initializes its custom elements
	// PARAMS:
	//  params.rawData             : XML raw data.
	//  params.onDeleteButtonClick : event handler (callback) for "Delete" button click.
	// RETURN:
	//  none
	function renderPage(params) {

		_module.fn = pBase.fnName(arguments);									// Traces the current function
		_xml = $.parseXML(params.RawData);										// Transforms raw XML data into an XML document

		th.Render({
			code: _templateID[0],
			XML: _xml,
			onSuccess: function (result) {
				render_template_page({ 
					templateHtml  : result,
					onGenerateCallBack: params.onGenerateCallBack,				// Callback per generare token univoco p.iva
				});
				render_snippet({
					domain: _pageContainer,										// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
					onSaveCallBack: params.OnSave,								// Callback per salvataggio dati.
				});
				pBase.LoadResources(_resources);								// Loads additional resources (.css and/or .js)
			},
			onFailed: function (result) {
				pBase.RedirectToErrorPage(result.code, result.descr, _module);
			}
		});

		// Renders the Dashboard
		dashboard.Render({});

		// Renders the menu
		menu.Render({active: _pageID});

	}

	// FUNCTION: render_template_page
	//  Initializes the custom elements in the page.
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function render_template_page(params) {

		$(_pageContainer).html(params.templateHtml);							// Fills the HTML's case with the precompiled HTML template
		$('.preventDefault').click(function(e) {
			e.preventDefault();
		});

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function(e){

			var y = window.scrollY;
			if (y > 60) {
				$('#mainTitle').hide('fast');
				$('#scrollTitle').show('fast');
			} else {
				$('#mainTitle').show('fast');
				$('#scrollTitle').hide('fast');
			}

		});

		// Gestione pulsante Genera
		$('#btn-generate').click(function (e) {

			e.preventDefault();
			var prodID = __WACookie.prodNr;																// Codice prodotto (ID)
			var codIVA = prodID;																		// Inizializza col codice prodotto
			while (codIVA.length < 11) { codIVA = '0' + codIVA; };										// Riempie con "0" fino a raggiungere 11 chars
			var codIVA = "MPR" + codIVA;																// Aggiunge il prefisso identificativo richiesto da Leanus
			$("#CF_Piva").prop("disabled", true).val(codIVA);											// Aggiorna il campo Partita IVA e lo disabilita (non deve essere modificato)

		});

		
		// PATCH (28/01/2020): Gestione condizione "trial expired"
		if (__WACookie.trial_expired == 'true') {
			$('snp_input_text, snp_dd_tipologieAzienda, snp_dd_settoriAzienda').attr('disabled', 'disabled');
			$('#btn-generate').addClass('disabled');
		}

	}


	// FUNCTION: render_snippet
	//  Resolves snippet and assigns callback functions to the new DOM elements
	// PARAMS:
	//  params.domain           : name of the domain (container ID) the snippet belongs to
	//  params.onDeleteCallback : event handler (callback) for "Delete" button click.
	// RETURN:
	//  none
	function render_snippet(params) {

		var saveCallBack = params.onSaveCallBack							// Pulsante "Salva"
		var myXml = params.xmlData;

		// Invokes the snippets resolution
		snippets.Render({
			domain  : params.domain,
			callBack: snippetsCallBack,
			others  : myXml,
		});


		// FUNCTION: snippetsCallBack
		//  Handles the callbacks for the new DOM elements (snippets replacement)
		// PARAMS:
		//  params.domain  : name of the domain (container ID) the snippet belongs to
		//  params.snippet : name of the snippet to be processed
		// RETURN:
		//  none
		function snippetsCallBack(params) {

			var domain = params.domain;											// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'btnConsole':
					$('#btn-save').click(function(e) {
						e.preventDefault();

						var isOk = true;

						// ** Validazione **
						// P.IVA:
						var l = $('#CF_Piva').val().length;
						if (l < 11 || l > 14) {
							isOk = false;
							modals.ShowErr({
								target : _modalsContainer, 
								errCode: 'V001',
								errMsg : 'La lunghezza del campo [b]Partita IVA[/b] deve essere compresa tra [b]11 e 14 caratteri[/b].'
							});
						}

						if(isOk) {
							$('#statusInfo .status').text('Salvato');									// Aggiorna lo status del BP
							$('#repPiano').addClass('disabled');
							saveCallBack()																// Callback per salvataggio dati
							.then(function(){
								menu.Render({active: _pageID});											// Riconfigura il menu
							});
						}

					});
					break;

				case 'dd_tipologieAzienda':
				case 'dd_settoriAzienda':
					$('.' + snippet + ' option[selected]').addClass('initialChecked');

					// Gestione eventi
					$('select').change(function(){

						if ($(this).val() != $(this).attr('ov')) {
							$(this).addClass('changed');												// Evidenzia il campo
						} else {						
							$(this).removeClass('changed');												// Ripristina valore precedente: toglie la formattazione
						}
					});

					break;

			}
		}
	}

});