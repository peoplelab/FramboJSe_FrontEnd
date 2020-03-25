//----------------------------------------------------------------------------------------
// File: ricavi.presenter.js
//
// Desc: Presenter della pagina "Economics - Ricavi"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
	'datagrid',
], function (pBase, th, snippets, modals, dashboard, model, menu, dg) {

	// ** Module management **
	var _module = {};														// Mapping of the current module
	var _resources = {};														// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _onInit = true;															// Flag for "I'm initializing objects"
	var _xml = '';															// XML data (to show)
	var _pageID = '';															// Sitemap/page ID
	var _templateID = '';														// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';									// Target container (ID) for the modal windows
	var _menuContainer = '#menuContainer';									// Target container (ID) for the filter template
	var _pageContainer = '#pageContainer';									// Target container (ID) for the list template 
	var _isLabelReady = false;
	var _isDDReady = false;
	var _idRadioAttivo;


	return {

		Init: init,														// Initializes (setup) the page
		RenderPage: renderPage,													// Render del contenuto pagina
		GetData4Saving: function () {											// Gets data from page controls for saving
			return pBase.BuildsJson4Save('')
		},
		Show_ok_modal: function () {											// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer
			})
		},
		Show_ko_modal: function (code, msg) {									// "Error" modal window's handler
			modals.ShowErr({
				target: _modalsContainer,
				errCode: code,
				errMsg: msg
			})
		},
		Show_ko: function (code, msg) {											// "Error" handler
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

		_module.id = SystemJS.map.currentPresenter.replace(location.origin, '');
		_pageID = params.pageID;
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
					templateHtml: result,
					//onSaveCallBack: params.OnSave,								// Callback per salvataggio dati.
					xmlDocument: _xml,
				});
				render_snippet({
					domain: _pageContainer,														// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
					onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
					onCompile: params.Compile,												// Callback per salvataggio dati.
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
		menu.Render({ active: _pageID });

	}

	// FUNCTION: render_template_page
	//  Initializes the custom elements in the page.
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function render_template_page(params) {

		$(_pageContainer).html(params.templateHtml);							// Fills the HTML's case with the precompiled HTML template

		$('.preventDefault').click(function (e) {
			e.preventDefault();
		});


		// Gestione tab menu
		$('#tabMenu a').click(function (e) {

			e.preventDefault();

			var href = $(this).attr('href');									// Determina l'oggetto "container" da attivare
			$('#tabMenu a').removeClass('btn-action-light');					// Toglie la classe 
			$(this).addClass('btn-action-light');
			$('.tabContent').hide();
			$(href).show();

		});

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function (e) {

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

		});

		// Gestione radio button
		$('[name="tfrInAzienda"]').on('click', function (e) {
			_idRadioAttivo = '#' + $(this).attr("id");
			$('#PercTFR').val($(_idRadioAttivo).val());
		});
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
		var compileCBack = params.onCompile     							// Pulsante "Compila"

		var myXml = params.xmlData;

		// Invokes the snippets resolution
		snippets.Render({
			domain: params.domain,
			callBack: snippetsCallBack,
			others: myXml,
		});


		// FUNCTION: snippetsCallBack
		//  Handles the callbacks for the new DOM elements (snippets replacement)
		// PARAMS:
		//  params.domain  : name of the domain (container ID) the snippet belongs to
		//  params.snippet : name of the snippet to be processed
		// RETURN:
		//  none
		function snippetsCallBack(params) {

			var domain = params.domain;										// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'btnConsole':
					$('#btn-save').click(function (e) {
						e.preventDefault();

						var isValid = true;

						// Controllo validazione dati
						isValid = checkValidation();
						
						if (isValid) {
							saveCallBack()																// Callback per salvataggio dati
							.then(function () {
								menu.Render({ active: _pageID });													// Riconfigura il menu
							})
						} else {
							modals.ShowErr({
								target: _modalsContainer,
								errCode: '',
								errMsg: 'Attenzione!<br>Sono presenti dati non validi: controllare tutti i valori inseriti'
							})
						}
					});

					$('#btn-compile').click(function (e) {
						e.preventDefault();

						var isValid = true;

						// Controllo validazione dati
						isValid = checkValidation();
						
						if (isValid) {
							compileCBack();																// Callback per compilazione.
						} else {
							modals.ShowErr({
								target: _modalsContainer,
								errCode: '',
								errMsg: 'Attenzione!<br>Sono presenti dati non validi: controllare tutti i valori inseriti'
							})
						}
					});
					break;

				case 'dd_custom':
					_isDDReady = true;
					$('#N_Prodotti').change(function() {
						abilitazioneProdotti();
					});
					abilitazioneProdotti();
					break;

				case 'label':
					_isLabelReady = true;
					abilitazioneProdotti();
                    break;

                case 'input_generic':

                    break;

				default:
					break;

			}
		}
	}

	// FUNCTION: abilitazioneProdotti
	//	Abilitazione/blocco dei campi delle etichette prodotti 
	function abilitazioneProdotti() {

		if (_isDDReady && _isLabelReady) {

			var nProds = +$('#N_Prodotti :selected').text();
			var prodLabels = $('[id^="P"].form-control.input_text.cleanInput');
			prodLabels.each(function (index, elem) {

				if (index < nProds) {
					elem.disabled = '';
				} else {
					elem.disabled = 'disabled';
				}
			});
		}
	}

	// FUNCTION: checkValidation
	//	Controllo validazione dei dati obbligatori
	// PARAMS:
	//	None
	// RETURN
	//	Risultato controllo (true/false)
	function checkValidation() {

		var check  = true;
		var fields = [
				'NumAnni', 'AnnoInizioRef',
				'N_Prodotti',
				//'GiorniIncassoClienti', 'GiorniPagamentoCostiEsterni', 'GiorniPagamentoMkgtComm',
			];

		// Azzera gli errori di pagina
		$('label.error').removeClass('visible');
		$('.form-control.error').removeClass('error');

		// Controllo
		for (var i = 0; i < fields.length; i++) {
		
			var f = '#' + fields[i];
			var v = $(f).val();
			if (v == 0 || isNaN(v) || v == null) {

				check = false;
				$('label.error[for=' + fields[i] + ']').addClass('visible');
				$(f).addClass('error');
			}
		}

		return check;
	}

});