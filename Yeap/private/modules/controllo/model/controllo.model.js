//----------------------------------------------------------------------------------------
// File: controllo.model.js
//
// Desc: Model della sezione "Controllo di gestione"
// Path: /Private/modules/controllo/model
//----------------------------------------------------------------------------------------

define([
	'base_model'
], function (mBase) {
	var _Pattern = '/api/public/ws/';
	// Web services endpoint constant definition
	var _ENDPOINT_COMPILE       = _Pattern + 'Economics.asmx/Compile';
	var _ENDPOINT_PRECOMPILE_DP = _Pattern + 'Economics.asmx/PreCompile';
	var _ENDPOINT_PRECOMPILE_AP = _Pattern + 'Economics.asmx/PreCompileAnnoPrec';
	var _ENDPOINT_CONFIRM       = _Pattern + 'Economics.asmx/Confirm';
    var _ENDPOINT_LOADEXCEL     = _Pattern + 'CDG.asmx/Import';

	var _READ_ENDPOINTS = {

		cdgGet			: _Pattern + 'CDG.asmx/Get',
		cdgCrea			: _Pattern + 'CDG.asmx/Get',
		cdgDistribuzione: _Pattern + 'CDG.asmx/Weights_Get',
		cdgBPData       : _Pattern + 'CDG.asmx/BPData',
						   
		cdgScostamenti  : _Pattern + 'CDG.asmx/Forecast_Get',
		cdgConsuntivo   : _Pattern + 'CDG.asmx/Data',
						   
		cdgImporta      : _Pattern + 'CDG.asmx/Get',
		cdgAnalisi      : _Pattern + 'CDG.asmx/Get',
		cdgForecast     : _Pattern + 'CDG.asmx/Get',
		cdgScenario1    : _Pattern + 'CDG.asmx/Scenario1',												// Scenario: 
		cdgScenario2    : _Pattern + 'CDG.asmx/Scenario2',												// Scenario: 
		cdgScenario3    : _Pattern + 'CDG.asmx/Scenario3',												// Scenario: 
		cdgRicalcola    : _Pattern + 'CDG.asmx/Forecast_Set',
	}

	var _WRITE_ENDPOINTS = {
		cdgCrea			: _Pattern + 'CDG.asmx/Create',
		cdgModifica     : _Pattern + 'CDG.asmx/Config',
		cdgDistribuzione: _Pattern + 'CDG.asmx/Weights_Set',
	}
	
	return {
		Common_Get : wsCommonGET,
		Common_Set : wsCommonSET,
		Compile    : wsCompile,
		LoadExcel  : loadExcel,
	}


	// FUNCTION: wsCommonGET
	//	Chiamata web service per le funzioni GET (Read)
	// PARAMS:
	//  params.page : id della pagina (come definito in routerList)
	// RETURN:
	//  none
	function wsCommonGET(params) {

		var pageID   = params.page
		var endpoint = _READ_ENDPOINTS[pageID];

		if (endpoint == null) {
			console.error('%cAttenzione: servizio GET per "' + pageID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');  // Andrà in pBase o meglio ancora in "eBase"
		}

		params.dataSource = '';
		params.endpoint   = endpoint;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);

	}


	// FUNCTION: wsCommonSET
	//	Chiamata web service per le funzioni SET (Write)
	// PARAMS:
	//  params.page : id della pagina (come definito in routerList)
	// RETURN:
	//  none
	function wsCommonSET(params) {

		var pageID   = params.page
		var endpoint = _WRITE_ENDPOINTS[params.page];
		var pageType = (pageID === 'cdgCrea' || pageID === 'cdgModifica')? 1: 0;

		if (endpoint == null) {
			console.error('%cAttenzione: servizio SET per "' + pageID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');  // Andrà in pBase o meglio ancora in "eBase"
		}

		params.dataSource = 'data';
		params.endpoint   = endpoint;
	//	params.fields     = (pageID != 'cdgCrea')? [] : Object.keys(params.data);
	//	params.body       = (pageID != 'cdgCrea')? params.data : mBase.BuildsRequestBody(params);
		params.fields     = (pageType !== 1)? [] : Object.keys(params.data);
		params.body       = (pageType !== 1)? params.data : mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);

	}


	// FUNCTION: wsCompile
	//	Chiamata web service per: Compilazione fogli Economics
	function wsCompile(params) {

		var type     = params.type;												// Identifica la chiamata al Saas
		var endpoint = '';

		switch (params.type) {												// Identifica la chiamata al Saas

			case 'Precomp_AP':
				endpoint = _ENDPOINT_PRECOMPILE_AP;
				break;

			case 'Precomp_DP':
				endpoint = _ENDPOINT_PRECOMPILE_DP;
				break;

			case 'Compile':
				endpoint = _ENDPOINT_COMPILE;
				break;
			case 'JustConfirm':
				endpoint = _ENDPOINT_CONFIRM;
				break;
		}

		params.dataSource = '';
	//	params.endpoint   = _ENDPOINT_COMPILE;
		params.endpoint   = endpoint;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}


    // FUNCTION: loadExcel
    //	Chiamata al servizio per il caricamento del file excel
    function loadExcel(params) {

        params.endpoint = _ENDPOINT_LOADEXCEL;

		return mBase.ExecuteHttpRequest(params);
    }


});
