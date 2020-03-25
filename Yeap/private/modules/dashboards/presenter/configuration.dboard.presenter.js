//----------------------------------------------------------------------------------------
// File: configuration.dboard.presenter.js
//
// Desc: Dashboard handler for the pages of the "Configurations" section - Presenter
// Path: /Private/modules/dashboards/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
//	'/private/modules/economics/model/economics.model.js,
	'economicsModel',
], function (pBase, th, model) {

	var _module = {id: 'dashboards.presenter.js'};								// Maps the current module

	var _container   = '';														// ID of the dashboard container
	var _DASHBOARDID = 1510;													// ID of the dashboard template


	return {

		Init  : init,															// Initializes (setup) the dashboard
		Render: render,															// Render the dashboard in page

	}


	// FUNCTION: init
	//  Initializes the dashboard elements
	// PARAMS:
	//  params.container : ID of the dashboard container
	//  params.dashboard : ID of the dashboard template
	// RETURN:
	//  none
	function init(params) {

		_container   = params.container;

		return;
	}


	// FUNCTION: render
	//  Renders the specified dashboard
	// PARAMS:
	//  None
	// RETURN:
	//  None
	function render(params) {

		_module.fn = pBase.fnName(arguments);									// Traces the current function

		th.Render({
			code: _DASHBOARDID,
			onSuccess: function (result) {
				render_template({ templateHtml: result });
			},
			onFailed: function (result) {
				pBase.RedirectToErrorPage(result.code, result.descr, _module);
			}
		});

	}

	// FUNCTION: render_template
	//  Renders and initializes the template elements in the page.
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function render_template(params) {

		$('#' + _container).html(params.templateHtml);							// Fills the HTML's case with the precompiled HTML template
		jQuery.noConflict();													// Prevent jquery and bootstrap scripts conflicting because of several declarations

		//history.pushState(null, null, window.location.origin);
		//window.onpopstate = function (event) {
		//    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
		//};

		// ** Assegnazione funzionalità dei controlli e lettura dati specifici **

		// 1: Pulsante di riduzione colonna menu
		$('#mainMenu').click(function(e){

			var menuSx = $('#menuContainer');
			var status = $(this).attr('status');
			var trTime = 400;																			// Durata transizione
			var rWidth = 220;																			// Larghezza della colonna estesa
			var rSmall = 0;																				// Larghezza della colonna ridotta

			if (status =='open') {

				$('#menuContainer').animate({width: rSmall}, trTime, function(){
					$('#mainMenu').attr('status', 'close');
					$('#mainMenu .openIcons').hide();
					$('#mainMenu .closeIcons').show();
					$('#leftMenu').hide('slow')
					$('#mainContainer').animate({marginLeft: rSmall}, trTime);
				});

			} else {

				$('#menuContainer').animate({width: rWidth}, trTime);
				$('#mainContainer').animate({marginLeft: rWidth}, trTime, function(){

					$('#mainMenu').attr('status', 'open');
					$('#mainMenu .openIcons').show();
					$('#mainMenu .closeIcons').hide();
					$('#leftMenu').removeClass('reduced');
					$('#leftMenu').show('fast')
				});
			}

		});
		
		// 2: Lettura dati da Saas
		model.Common_Get({																				// Servizio: Lettura dati del BP
			page     : 'dashboard',
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(params) {

				var data = $( $.parseXML(params.RawData) );												// Parse dell'XML di ritorno
				var nome = decodeURIComponent(data.find('Nome').text());								// Nome del Business Plan
				var code = data.find('CodiceTipologia').text();											// Codice tipologia azienda
				var CF   = data.find('CF_Piva').text();													// Codice fiscale / Partita IVA
				var tipo = decodeURIComponent(data.find('Tipologia').text());							// Descrizione tipologia azienda
				var aPre = eval(data.find('UtilizzoAnnoPrec').text());									// Flag utilizzo Anno precedente
				var anni = eval(data.find('NumAnni').text())    / 1000;									// Nr. di anni del BP (scalato)
				var init = eval(data.find('AnnoInizio').text()) / 1000;									// Anno iniziale (scalato)
				var prod = eval(data.find('N_Prodotti').text()) / 1000;									// Nr. prodotti gestiti (scalato)
				var matP = eval(data.find('N_MateriePrime').text()) / 1000;								// Nr. materie prime gestite (scalato)
				var Iva  = eval(data.find('IvaDefault').text()) / 1000;									// Iva di default (scalato)
				var Tfr  = eval(data.find('PercTFR').text())    / 1000;									// Percentuale TFR (scalato)

				$('#bpName').html(nome);																// Aggiorna i campi della dashboard
				$('#bpYears').html(anni);
				$('#bpTipology').html(tipo);
				$('#bpTipologyCode').html(code);

				// Patch: aggiunge il Codice Tipologia al cookie
				__WACookie = $.extend(__WACookie, {
					tc        : code,
					nYears    : anni,
					init      : init,
					nProdotti : prod,
					nMatPrime : matP,
					ivaDefault: Iva,
					percTFR   : Tfr,
					annoPrec  : aPre,
					CF_Piva   : CF,
				});
				Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });

			}
		});

		// 3: Gestione logo ODC
		if (__WACookie.ruolo == undefined || __WACookie.ruolo.toUpperCase() != "ODC") {					// Se non proviene da "Open Dot Com" rimuove il logo
	//	if (__WACookie.ruolo == undefined || __WACookie.ruolo != "ODC") {								// Se non proviene da "Open Dot Com" rimuove il logo

			$('#logoODC').remove();
			$('#footerODC').remove();
			$('#logoYeap').show();				// Nota: i div esistono già nel DOM (da Private.Master)
			$('#footerYeap').show();

		} else {

			$('#logoYeap').remove();
			$('#footerYeap').remove();
			$('#logoODC').show();				// Nota: i div esistono già nel DOM (da Private.Master)
			$('#footerODC').show();

		}


		// 4: Gestione documento expired
		if (__WACookie.trial_expired == 'true') {
			$('#isExpired').show();
		}
	}

});
