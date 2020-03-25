//----------------------------------------------------------------------------------------
// File: crea.presenter.js
//
// Desc: Presenter della creazione/modifica del "Controllo di gestione"
// Path: /Private/modules/controllo/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
//	'datagrid',
], function (pBase, th, snippets, modals, dashboard, model, menu) {

	//pBase.ShowBreakLabels(true)																		// Mostra il box con le dimensioni attuali del viewport

	// ** Module management **
	var _module = {};																					// Mapping of the current module
	var _resources = {};																				// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _onInit = true;																					// Flag for "I'm initializing objects"
	var _xml = '';																						// XML data (to show)
	var _pageID = '';																					// Sitemap/page ID
	var _templateID = '';																				// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';															// Target container (ID) for the modal windows
	var _menuContainer = '#menuContainer';																// Target container (ID) for the filter template
	var _pageContainer = '#pageContainer';																// Target container (ID) for the list template 
	var _isLabelReady = false;
	var _isDDReady = false;
	var _idRadioAttivo;
	var _status;

	return {

		Init: init,																						// Initializes (setup) the page
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
				target: _modalsContainer,
				errCode: code,
				errMsg: msg
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


		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function (e) {
			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}
		});

		// ** Determina lo status **
		_status = eval($(params.xmlDocument).find('Status').text());
		
		// ** 1 - Prepara la select di scelta dell'anno **
		var options = "{'(Selezionare un anno)': 0";
		for (i = 0; i < __WACookie.nYears; i++) {
			options += ", '&nbsp; " + (i + __WACookie.init) + "': " + (i + 1);
		}
		options += '}';
		$('snp_dd_custom[ref=Anno]').attr('data-options', options);
		if (_status > 10) {
			$('snp_dd_custom[ref=Anno]').attr('disabled','disabled');
		}


		// ** 2: Gestione radio button **
		var tImp = $('#TipoImport').val();																// Accende il radiobutton del valore attuale
		$('[name=TipoImport]').filter('[value=' + tImp + ']').prop('checked', true);

		$('[name="TipoImport"]').on('click', function (e) {												// Gestione campo hidden
			__SYS_status.hasChanged = true;																// Aggiornamento STATUS globale: attiva il flag di valore modificato
			_idRadioAttivo = '#' + $(this).attr("id");
			$('#TipoImport').val($(_idRadioAttivo).val());
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

				case 'btnConsole_CDG':
					$('#btn-importDP, #btn-modifica').click(function (e) {
						e.preventDefault();

						var isValid = true;

						// Controllo validazione dati
						isValid = checkValidation();
						
						if (isValid) {
							saveCallBack({
								btn: $(this).attr('id')
							})																// Callback per salvataggio dati
							.then(function () {
								menu.Render({ active: _pageID });										// Riconfigura il menu
								dashboard.Render({})													// Reimposta la dashboard e i cookie
							})
						} else {
							modals.ShowErr({
								target: _modalsContainer,
								errCode: '',
								errMsg: 'Attenzione!<br>I dati non sono validi: controllare tutti i valori inseriti'
							})
						}
					});
					break;

				case 'dd_custom':
					console.log ('status')
					break;

				case 'label':
					_isLabelReady = true;
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

		//	var nProds = +$('#N_Prodotti :selected').text();
			var nProds = $('#N_Prodotti :selected').text();
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

	// FUNCTION: abilitazioneMaterie
	//	Abilitazione/blocco dei campi delle materie prime
	function abilitazioneMaterie() {

		if (_isDDReady && _isLabelReady) {

			var nMat      = $('#N_MateriePrime :selected').text();
			var matLabels = $('[id^="M"].form-control.input_text.cleanInput');
			matLabels.each(function (index, elem) {

				if (index < nMat) {
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
				'Anno',
				'TipoImport',
				'TipoGestionale',
				'Raggruppamento',
			];

		// Azzera gli errori di pagina
		$('label.error').removeClass('visible');
		$('.form-control.error').removeClass('error');
		$('#tabMenu .ico-error').removeClass('isVisible');
		$('span.radioText').removeClass('error');

		// Controllo
		for (var i = 0; i < fields.length; i++) {
		
			var f      = '#' + fields[i];
			var v      = $(f).val();
			var okZero = false;

			switch (f) {																	// Vaglia gli eventuali campi per i quali 0 è un valore accettabile
				case '#TipoImport':
				//	okZero = true;
			}

			if ((v == 0 && !okZero) || isNaN(v) || v == null || v == '') {
				check = false;
				$('label.error[for=' + fields[i] + ']').addClass('visible');
				$(f).addClass('error');

				if (f === '#TipoImport') {
					$('span.radioText').addClass('error');
				}
			}
			
		}

		return check;
	}

});