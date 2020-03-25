//----------------------------------------------------------------------------------------
// File: testuali.controller.js
//
// Desc: Controller della pagina "Dati testuali"
// Path: /Private/modules/testuali/controller
//----------------------------------------------------------------------------------------

define([
    'base_controller',
    'base_presenter',
    'currentModel',
    'currentPresenter'
], function (cBase, pBase, model, presenter) {

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

	//	// Step 2: Interrogazione SAAS per il recupero dati

		presenter.RenderPage({});

	//	return model.Common_Get({
	//
	//		page     : _pageID,
	//		token    : __WACookie.Token,
	//		onFailure: pBase.OnGenericFailure,
	//		onSuccess: function(params) {
	//			presenter.RenderPage({ 
	//				RawData: params.RawData,
	//				OnSave : saveData,
	//				Compile: compile,
	//
	//				Reset  : reset,
	//			});
	//		},
	//	});

	}


});
