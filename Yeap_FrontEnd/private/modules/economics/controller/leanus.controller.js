//----------------------------------------------------------------------------------------
// File: leanus.controller.js
//
// Desc: Controller della pagina "Economics" per i report
// Path: /Private/modules/economics/controller
//----------------------------------------------------------------------------------------

define([
    'base_controller',
    'base_presenter',
    'currentModel',
    'currentPresenter',
	'reportController',
], function (cBase, pBase, model, presenter, cReport) {

	var _onInit     = true;														// Monitoring first time executing code...
	var _pageID     = '';														// Page ID (for presenter)
	var _templateID = '';														// ID of the page template
	var _checkYeap_FrontEnd	= '';														// Flag per identificare se arrivo da Yeap_FrontEnd o da navigazione interna
	var _initPars   = '';														// Set dei parametri iniziali della Setup (usati per il re-setup dopo il save)
	var _renderPars = {};														// JSON dei parametri da passare alla funzione Render page

	return {
		init: setup
	}

	// FUNCTION: setup
	//  Init function for controller. Setup UI and default values.
	// PARAMS:
	//  params.pageID : page ID
	// RETURN:
	//  none
	function setup(params) {

		_initPars   = params;
		_pageID     = (params == undefined) ? _pageID : params.pageID;
		_templateID = (params == undefined) ? _templateID : params.templateID;

		// Step 1: Inizializzazione della UI (setup)
		presenter.Init({
			pageID    : _pageID,
			templateID: _templateID
		});

		
	//	presenter.RenderPage({ 
	//		RawData: params.RawData,
	//	})


		// ** Differenziazione per pagine
		switch (_pageID) {
			case 'repLeanus':

				// Verifica disponibilità Leanus e attivazione
				cReport.ReadLeanus({
					reptID: 'readLeanus',
					onSuccess: function(params) {
						console.log(params)
					}
				})
				.then(function(p){ 
					presenter.ShowResult(p);
				});

				break;

			case 'repTestiWord':
				break;

			case 'repProspWord':
				break;
		}

		// ** Lancia il render della pagina
		presenter.RenderPage({_renderPars});



	}


});
