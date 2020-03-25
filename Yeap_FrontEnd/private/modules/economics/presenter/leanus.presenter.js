//----------------------------------------------------------------------------------------
// File: messaggi.presenter.js
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
	'menu',
//	'/private/modules/common/controller/report.controller.js',
	'reportController',
], function (pBase, th, snippets, modals, dashboard,  menu, cReport) {

	// ** Module management **
	var _module    = {};														// Mapping of the current module
	var _resources = {};														// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _onInit = true;															// Flag for "I'm initializing objects"
	var _xml    = '';															// XML data (to show)
	var _pageID = '';															// Sitemap/page ID
	var _templateID  = '';														// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';									// Target container (ID) for the modal windows
	var _menuContainer   = '#menuContainer';									// Target container (ID) for the filter template
	var _pageContainer   = '#pageContainer';									// Target container (ID) for the list template 


	return {

		Init      : init,														// Initializes (setup) the page
		RenderPage: renderPage,													// Render del contenuto pagina
		ShowResult: showResult,
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

		th.Render({
			code: _templateID[0],
			onSuccess: function (result) {
			
				var html = result;

				render_template_page({ 
					templateHtml  : html,
					onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
					onCompile     : params.Compile,												// Callback per salvataggio dati.
					onReset       : params.Reset,
				});
				render_snippet({
					domain: _pageContainer,														// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
				});
				pBase.LoadResources(_resources);												// Loads additional resources (.css and/or .js)
			
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

		var reset = params.onReset;

		$(_pageContainer).html(params.templateHtml);							// Fills the HTML's case with the precompiled HTML template

		$('.preventDefault').click(function(e) {
			e.preventDefault();
		});


		// ** Differenziazione per pagine
		switch (_pageID) {
			case 'repLeanus':
				break;

			case 'repTestiWord':

				$('h2.pageTitle span').html('"Testi"');

				$('#btnReportWord').click(function (e) {																// Lettura dei dati testuali (compilati in Wordpress)
					e.preventDefault();

					var token = __WACookie.Token;
					var bearer = __WACookie.TokenApiRest;

				//	repName = encodeURIComponent('Testi')

					jQuery.ajax({
						url: __WPressSiteURL + '/wp-json/wp/v2/business-plan/' + token,
						method: 'GET',
						contentType: 'application/json',
						processData: false,
						beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + bearer); },
						success: function (response) {

							var str = JSON.stringify(response);
							var obj = JSON.parse(str);
							var list = getListFromJson(obj.meta);
							var str_xml = getXmlFromList(list);

							cReport.GetTestiWP({
								reptID: 'datiTestuali',
								xmlTxt: str_xml,
								format: 2,
							});
						},
						error: function (responseError) { console.log('Errore nella lettura testi WP') },

					});
				});
				break;

			case 'repProspWord':

				$('h2.pageTitle span').html('"Documento Business Plan"');

				$('#btnReportWord').click(function (e) {																// Lettura dei dati testuali (compilati in Wordpress)
					e.preventDefault();

					if (!$(this).hasClass('disabled')) {
						var token = __WACookie.Token;
						var bearer = __WACookie.TokenApiRest;

					//	repName = encodeURIComponent('Sintesi progetto')

						jQuery.ajax({
							url: __WPressSiteURL + '/wp-json/wp/v2/business-plan/' + token,
							method: 'GET',
							contentType: 'application/json',
							processData: false,
							beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + bearer); },
							success: function (response) {

								var str     = JSON.stringify(response);
								var obj     = JSON.parse(str);
								var list    = getListFromJson(obj.meta);
								var str_xml = getXmlFromList(list);

								cReport.GetTestiWP({
									reptID: 'testualiProspetti',
									xmlTxt: str_xml,
									format: 2,
								});
							},
							error: function (responseError) { console.log('Errore nella lettura testi WP') },

						});
					}
				});
				break;
		}

	}
	function getListFromJson(json_meta) {

		var step = 'step';
		var lista = new Array();
		var keys = Object.keys(json_meta);
		var element = new Object();

		keys.forEach(function (key) {
			if (key.indexOf(step) >= 0) {
				element = new Object();
				element.chiave = key;
				element.valore = getStringFromArray(json_meta[key]);
				lista.push(element)
			}
		});
		return lista;
	}
	function getXmlFromList(list) {																			// Trasforma da list a XML
		var xml = '';


		// PATCH (27/01/2020): modificata la costuzione del "body":
		// - Il parametro "format" specifica il tipo output (5 = PDF, bisogna parametrizzare)
		// - I testi sono ora nodi "Text" figli del nodo "Texts"
		xml  = '<Data>';
		xml += '<Format>' + 2 + '</Format>';
		xml += '<Texts>';
	
		list.forEach(function (element) {
			xml += "<Text Key='" + element.chiave + "'>" + encodeURIComponent(element.valore) + '</Text>';
		});
		xml += '</Texts>';
		xml += '</Data>';


		return xml;
	}
	function getStringFromArray(stringArray) {

		if (stringArray == null || stringArray.length == 0) {
			return "";
		} else {
			return stringArray[0];
		}
	}



	
	// FUNCTION: showResult
	//  Visualizza il box corrispondente al risultato della verifica esistenza report Leanus
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function showResult(params){

		var xmlDoc = $.parseXML(params.d);
		var code   = $(xmlDoc).find('Result>Codice').text();
		var desc   = $(xmlDoc).find('Result>Descrizione').text();
		var url    = decodeURIComponent( $(xmlDoc).find('Data>Url').text() );

		$('.leanusMsg').hide();

		if (code == 0 && !(url == null || url == '') ) {
			$('#btnLeanus').attr('href', url);
			$('.leanusOk').show('fast');

			// ** GESTIONE TIMEOUT: il report ha una durata olte la quale bisogna ricaricare la pagina
			setTimeout("$('.leanusOk').hide(\'fast\'); $('.leanusTimeOut').show('\fast\');", 1000 * 60);

		} else {
			$('.leanusError').show('fast');
		}
		menu.Render({active: _pageID});																	// Rigenera il menu => Forza aggiornamento stati di WP

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

			var domain  = params.domain;																// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'switcher':

					// Abilitazione Leanus
					$('#confermaWord').change(function(e){
						var c = $(this).prop('checked');
						if (c) {
							$('#btnReportWord').removeClass('disabled');
						} else {
							$('#btnReportWord').addClass('disabled');
						}
					});
					break;

				default:
					break;
			}
		}
	}


});
