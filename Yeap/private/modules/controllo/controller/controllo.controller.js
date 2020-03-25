//----------------------------------------------------------------------------------------
// File: controllo.controller.js
//
// Desc: Controller della sezione "Controllo di gestione"
// Path: /Private/modules/controllo/controller
//----------------------------------------------------------------------------------------

define([
    'base_controller',
    'base_presenter',
    'currentModel',
    'currentPresenter'
], function (cBase, pBase, model, presenter) {

	var _onInit     = true;																				// Monitoring first time executing code...
	var _pageID     = '';																				// Page ID (for presenter)
	var _templateID = '';																				// ID of the page template
	var _checkYeap	= '';																				// Flag per identificare se arrivo da Yeap o da navigazione interna
	var _initPars   = '';																				// Set dei parametri iniziali della Setup (usati per il re-setup dopo il save)

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
		return model.Common_Get({
	
			page     : _pageID,
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(params) {
				presenter.RenderPage({ 
					RawData: params.RawData,
					OnSave : saveData,
					OnLoad : loadExcel,
				});
			},
		});

	}

	// FUNCTION: saveData
	//  Saves elements (calling Saas and handle response)
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function saveData() {

		var rawdata = presenter.GetData4Saving();

		return model.Common_Set({																		// Builds XML data and sends them to the Saas...
			data     : rawdata,
			page     : _pageID,
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

		var modalPars = {
			redirect: '',
		};

		if (result.ResponseCode == 0) {

			model.Common_Get({											// Builds XML data and sends them to the Saas...
				page     : 'cdgRicalcola',
				token    : __WACookie.Token,
				onSuccess: function(c){
					presenter.Show_ok_modal(modalPars);
				},
				onFailure: '',
			});

		} else {

			presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);

		}
	}
	

	// FUNCTION: loadExcel
	//  Carica il foglio Excel del consuntivo
	// PARAMS:
	//  params.formdata : i contenuti da mandare in POST (file Exccel e XML di selezione mese)
	// RETURN:
	//  none
	function loadExcel(params) {

		var modalPars = {
			redirect: '',
		};

		return model.LoadExcel({
			formdata : params,
			onSuccess: function (result) {

				if (result.ResponseCode == 0) {
					presenter.Show_ok_modal(modalPars);
				} else {
					presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);
				}
			},
			onFailed: function (result) {
				pBase.RedirectToErrorPage(result.code, result.descr, _module);
				return 'KO';
			},
		});

	}

});
