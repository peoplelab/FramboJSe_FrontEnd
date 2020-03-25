//----------------------------------------------------------------------------------------
// File: economics.controller.js
//
// Desc: Controller della pagina "Economics"
// Path: /Private/modules/economics/controller
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
	var _checkYeap_FrontEnd	= '';														// Flag per identificare se arrivo da Yeap_FrontEnd o da navigazione interna
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
		return model.Common_Get({

			page     : _pageID,
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(params) {
				presenter.RenderPage({ 
					RawData: params.RawData,
					OnSave : saveData,
					Compile: compile,

					Reset  : reset,
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

		return model.Common_Set({											// Builds XML data and sends them to the Saas...
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
			//presenter.Show_ok_modal();
			presenter.Show_ok_modal(modalPars);
			//setup(_initPars);												// Chiama nuovamente la setup
		} else {
			presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);
		}
	}
	

	// FUNCTION: compile
	//  Saves elements (calling Saas and handle response)
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function compile(params) {

		// 1: Rimuove le classi "error"
		$('.card-title-economics.error, .title2.error, .form-control.error').removeClass('error');

		var rawdata = presenter.GetData4Saving();
		var type    = params.type;											// Identifica il tipo chiamata al Saas (Compila, precompila DP, precompila AP)

		return model.Common_Set({											// Builds XML data and sends them to the Saas...
			data     : rawdata,
			page     : _pageID,
			token    : __WACookie.Token,
			onSuccess: function(){

				return model.Compile({
					data     : '',
					page     : _pageID,
					type     : type,
					token    : __WACookie.Token,
					onSuccess: afterCompile,
					onFailure: afterCompile,
				});

			},
			onFailure: afterCompile
		});

	}

	// FUNCTION: afterCompile
	//  Handles server data and send them to the UI (body part)
	// PARAMS:
	//  result.ResponseCode    : Response code from Saas
	//  result.ResponseMessage : Response message from Saas
	// RETURN:
	//  none
	function afterCompile(result) {

		var modalPars = {
			redirect: '',
		};
		
		switch (_pageID) {
			case 'annoPrecInsert':
				modalPars.redirect = '/economics/anno-precedente-prospetto';
				break;
			case 'annoPrecProspetto':
				modalPars.redirect = '/economics/anno-precedente-conferma';
				break;
			default:
				break;
		}

		if (result.ResponseCode == 0) {
			presenter.Show_ok_modal(modalPars);
			setup(_initPars);																			// Chiama nuovamente la setup
		} else {
			presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);
			setup(_initPars);																			// Chiama nuovamente la setup
		}
	}
	
	function reset(){
		setup(_initPars);																				// Chiama nuovamente la setup
	};

});
