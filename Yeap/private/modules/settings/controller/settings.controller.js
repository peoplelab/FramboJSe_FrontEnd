//----------------------------------------------------------------------------------------
// File: home.controller.js
//
// Desc: Controller for homepage
// Path: /Private/modules/home/controller
//----------------------------------------------------------------------------------------

define([
	'base_controller',
	'base_presenter',
	'currentModel',
	'currentPresenter'
], function (cBase, pBase, model, presenter) {

	var _onInit     = true;														// Monitoring first time executing code...
	var _pageID     = '';														// Page ID (for presenter)
	var _templateID = '';														// ID of the page template
	var _checkYeap	= '';														// Flag per identificare se arrivo da Yeap o da navigazione interna
	var _initPars   = '';														// Set dei parametri iniziali della Setup (usati per il re-setup dopo il save)

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

		// Step 2: Interrogazione SAAS per il recupero dati
		return model.GetSettings({

			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(params) {
				presenter.RenderPage({ 
					RawData: params.RawData,
					OnSave : saveData,
				});
			},
		});
	
	}


	// FUNCTION: saveElement
	//  Saves elements (calling Saas and handle response)
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function saveData() {

		var rawdata = presenter.GetData4Saving();

		return model.UpdateSettings({											// Builds XML data and sends them to the Saas...
			data     : rawdata,
			token    : __WACookie.Token,
			onSuccess: onSaveElement,
			onFailure: onSaveElement
		});
	}

	// FUNCTION: onSaveElement
	//  Handles server data and send them to the UI (body part)
	// PARAMS:
	//  result.ResponseCode    : Response code from Saas
	//  result.ResponseMessage : Response message from Saas
	// RETURN:
	//  none
	function onSaveElement(result) {

		if (result.ResponseCode == 0) {
			presenter.Show_ok_modal();
			setup(_initPars);													// Chiama nuovamente la setup
		} else {
			presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);
		}
	}

});
