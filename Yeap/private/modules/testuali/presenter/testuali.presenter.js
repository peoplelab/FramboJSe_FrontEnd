//----------------------------------------------------------------------------------------
// File: testuali.presenter.js
//
// Desc: Presenter della pagina "Dati testuali"
// Path: /Private/modules/testuali/presenter
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
	'/private/modules/common/model/resources.model.js',
], function (pBase, th, snippets, modals, dashboard, model, menu, dg, resources) {

	// ** Module management **
	var _module = {};																					// Mapping of the current module
	var _resources = {}																					// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _xml = '';																						// XML data (to show)
	var _pageID = '';																					// Sitemap/page ID
	var _templateID = '';																				// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';															// Target container (ID) for the modal windows
	var _menuContainer   = '#menuContainer';															// Target container (ID) for the filter template
	var _pageContainer   = '#pageContainer';															// Target container (ID) for the list template 

	return {

		Init: init,																						// Initializes (setup) the page
		RenderPage: renderPage,																			// Render del contenuto pagina
		GetData4Saving: function () {																	// Gets data from page controls for saving
			return dg.BuildsXML({ name: _pageID });
		},
		Show_ok_modal: function (params) {																// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer,
				URL   : params.redirect,
			});
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

		_module.id = SystemJS.map.currentPresenter.replace(location.origin, '');
		_pageID = params.pageID;
		_templateID = params.templateID;


		// Initializes Pagedashboard
		dashboard.Init({ container: "dashboard" })

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
        var existConfiguration = params.configuration;
        var disabledList = params._disableIdList;
		_module.fn = pBase.fnName(arguments);									// Traces the current function
        _xml = $.parseXML(params.RawData);										// Transforms raw XML data into an XML document

		th.Render({
			code: _templateID[0],
			XML: _xml,
			onSuccess: function (result) {
				render_template_page({ 
					templateHtml  : result,
					onSaveCallBack: params.OnSave,								// Callback per salvataggio dati.
				});
				render_snippet({
					domain: _pageContainer,										// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
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

		$('.preventDefault').click(function(e) {
			e.preventDefault();
		});

		// Gestione pulsante Salva
		var saveCallBack = params.onSaveCallBack;
		$('#btn-save').click(function(e) {

			e.preventDefault();
			saveCallBack();														// Callback per salvataggio dati.

		});


		// W.I.P.  //§§§§§§§§§§
		//$('.infoPopup.info').popover({html: true});

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function (e) {

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

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

		var onDeleteCallback = params.onDeleteCallback;
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

				case 'input_text':
				break;

				case 'drawerTitle':																		// Attribuzione delle classi 'error' ai cassetti
					console.log('drawerTitle')
					$('.infoPopup.info').popover({html: true});
					break;

				case 'btnConsole_testuali':
				//	$('.infoPopup.info').popover({html: true});
					break;

				case 'include_file':

					// Aggiorna la Consolle Dati Testuali
					$('.btn-action-light-grey[ref=' + _pageID + ']').addClass('active');				// Evidenzia il pulsante della pagina attiva
					break;
			
			}
		}
    }

});
