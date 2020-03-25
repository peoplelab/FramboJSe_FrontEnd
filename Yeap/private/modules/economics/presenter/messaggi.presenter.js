//----------------------------------------------------------------------------------------
// File: messaggi.presenter.js
//
// Desc: Presenter della pagina "Economics - Ricavi"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'tableSorter',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
	'/private/modules/common/model/resources.model.js',
//	'/private/modules/common/controller/report.controller.js',
	'reportController',
], function (pBase, th, ts, snippets, modals, dashboard, model, menu, resources, cReport) {

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
				target : _modalsContainer, 
				errCode: code,
				errMsg : msg
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

		_module.id  = SystemJS.map.currentPresenter.replace(location.origin, '');
		_pageID     = params.pageID;
		_templateID = params.templateID;

		ts.Init();

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
			
				var html = result;
			
				resources.XmlEconomics({
					onSuccess: function(result) {
						__Preloads.economics = result;
				
						render_template_page({ 
							templateHtml  : html,
							onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
							onCompile     : params.Compile,												// Callback per salvataggio dati.
							onReset       : params.Reset,
							xmlDocument   : _xml,
						});
						render_snippet({
							domain: _pageContainer,														// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
							onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
							onCompile     : params.Compile,												// Callback per salvataggio dati.
						});
						pBase.LoadResources(_resources);												// Loads additional resources (.css and/or .js)
			
					}
				});
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

		// ** Crea la matrice dei messaggi d'errore contenuti nell'XML (più facili da gestire nella costruzione della pagina) **
		var Messaggi = [];
		var _xmlMess = $(params.xmlDocument).find('Messaggio')
		
		for (var i = 0; i < _xmlMess.length; i++) {

			mess = _xmlMess[i];
			temp             = {};
			temp.anno        = parseInt($(mess).find('Anno').text());
			temp.codice      = $(mess).find('Codice').text();
			temp.descrizione = decodeURIComponent($(mess).find('Descrizione').text());
			temp.severity    = $(mess).find('Severity').text();
			temp.modulo      = $(mess).find('Modulo').text();
			temp.codiceCampo = $(mess).find('CodiceCampo').text();

			Messaggi.push(temp);
		}

		// Popolamento  accordion:
		messDescriptor = [																				// Parametri dei container (accordion) delle categorie di errori
			{severity: 1, target: '#Errori', cnt: '#errCnt'},
			{severity: 2, target: '#Warning', cnt: '#warnCnt'},
		];

		for (var i = 0; i < messDescriptor.length; i++) {														// Scansione delle categorie errori

			var msgCnt = 0;
			var myHtml = '';
			var descr  = messDescriptor[i];

			for (var j = 0; j < Messaggi.length; j++) {

				mess = Messaggi[j];
				if (mess.severity == descr.severity) {

//---
if(mess.codiceCampo=='4440'){
	console.log('x');
}
//---

					myHtml += '<tr>';
					myHtml +=   '<td class="textCenter count">' + (j + 1) + '</td>';
					myHtml +=   '<td class="">' + mess.descrizione + '</td>';
					myHtml +=   '<td class="">';
					myHtml +=     '<snp_XML_label_economics data-pars="value:=\'Menu' + mess.modulo + '\'" />';
					myHtml +=   '</td>';
					myHtml +=   '<td class="">';
					myHtml +=     '<snp_XML_label_economics data-pars="value:=\'' + mess.codiceCampo + '\' || attr:=\'codiceRPT\' || add:=\'true\'" />';
					myHtml +=   '</td>';
					myHtml +=   '<td class="">' + (__WACookie.init + mess.anno - 1) + '</td>';
					myHtml += '</tr>';

					msgCnt++;
				}
			}
			$(descr.target + ' tbody').append(myHtml);
			$(descr.cnt).text('(' + msgCnt + ')');
		}

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function(e){

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

		});


		// ** Gestione pulsante "Invia richiesta" **
		$('#layerBlocca')
			.width( $('#testoAvvisi').width() )
			.height( $('#testoAvvisi').height() );


		$('#btnLeanus').click(function(e){			
			e.preventDefault();
			cReport.SendLeanus( {reptID: 'sendLeanus'} )
				.then(function(){
					reset(); 
				})
		});

		// ** Gestione pulsante "Richiedi analisi dettagliata" **
		$('#btnAnalisi').click(function(e){
			e.preventDefault();

			var mailLink = '';
			var re = new RegExp('\\+', 'g');

			mailLink += 'mailto:gestione-ordine@yeapitaly.it?';
		//	mailLink += 'subject=' + encodeURIComponent('Richiesta analisi dettagliata BP: "' + __WACookie.Title.replace(re, ' ') + '"');
			mailLink += 'subject=Richiesta analisi dettagliata BP: "' + __WACookie.Title.replace(re, ' ') + '"';
			mailLink += '&body=' + encodeURIComponent('Buongiorno.\n\nDesidero ricevere il documento di analisi dettagliata del mio Business Plan al seguente indirizzo email: (scrivere qui) ');
			mailLink += encodeURIComponent('\n\nRIFERIMENTI:');
			mailLink += encodeURIComponent('\n\nNome del Busines plan: "' + __WACookie.Title.replace(re, ' ') + '"');
			mailLink += encodeURIComponent('\nPartita IVA: "' + __WACookie.CF_Piva + '"');
			mailLink += encodeURIComponent('\n\nGrazie e distinti saluti.\n\n\n\n ');

			window.location.href = mailLink;
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

			var domain  = params.domain;										// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'XML_label_economics':
					ts.Tablesorter({ obj: $('.messages'), sort: [1, 1, 1, 1, 1] });						// transform table -> tablesorter
					break;

				case 'switcher':
					// Notifica messaggi
					if (!__WACookie.showErr) {
						$('#notificaMsg').prop('checked', false);
					}
					$('#notificaMsg').change(function(e){

						var c = $(this).prop('checked');

						if (!c) {
							$('.hasErr').removeClass('hasErr').addClass('hasHiddenErr');
							$('.hasWarning').removeClass('hasWarning').addClass('hasHiddenWarning');
						} else {
							$('.hasHiddenErr').removeClass('hasHiddenErr').addClass('hasErr');
							$('.hasHiddenWarning').removeClass('hasHiddenWarning').addClass('hasWarning');
						}
						__WACookie.showErr = c;
		                Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });
					});

					// Abilitazione Leanus
					$('#avvisi').change(function(e){
						var c = $(this).prop('checked');
						if (c) {
							$('#btnLeanus').removeClass('disabled');
						} else {
							$('#btnLeanus').addClass('disabled');
						}
					});
					break;

				case 'btnConsole':
					var status = $('#statusInfo .status').text();
					switch (status) {
						case 'Inviato':
						case 'Elaborato':
							$('#giaInviato, #layerBlocca').show();
							break;
						case 'Vuoto':
						case 'Salvato':
						case 'Compilato con errori':
							$('#noCompilato, #layerBlocca').show();
							break;
					}
					break;

				default:
					break;

			}
		}
	}

});
