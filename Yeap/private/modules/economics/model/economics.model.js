//----------------------------------------------------------------------------------------
// File: economics.model.js
//
// Desc: Model delle pagine della sez. "Economics"
// Path: /Private/modules/economics/model
//----------------------------------------------------------------------------------------

define([
    'base_model'
], function (mBase) {
	var _Pattern='/api/public/ws/';
	// Web services endpoint constant definition
	var _ENDPOINT_COMPILE       = _Pattern + 'Economics.asmx/Compile';
	var _ENDPOINT_PRECOMPILE_DP = _Pattern + 'Economics.asmx/PreCompile';
    var _ENDPOINT_PRECOMPILE_AP = _Pattern + 'Economics.asmx/PreCompileAnnoPrec';
    var _ENDPOINT_CONFIRM       = _Pattern + 'Economics.asmx/Confirm';
	var _READ_ENDPOINTS = {
		menu                    : _Pattern + 'Config.asmx/All_Get',										// Menu (lettura parametri generali)
		dashboard               : _Pattern + 'Config.asmx/All_Get',										// Dashboard (lettura parametri generali)
		impostazioni            : _Pattern + 'Config.asmx/Economics_Get',								// Settings
		iva                     : _Pattern + 'Iva.asmx/Get',											// Sezione "Piano economico"
		ricavi                  : _Pattern + 'Ricavi.asmx/Ricavo_Get',
		annoPrecInsert          : _Pattern + 'AnnoPrec.asmx/Get',
        annoPrecProspetto       : _Pattern + 'AnnoPrec.asmx/Get',
        annoPrecConferma        : _Pattern + 'AnnoPrec.asmx/Valutazione',
		costiEsterni            : _Pattern + 'Ricavi.asmx/CostiEsterniMagazzino_Get',
		costiVariabili          : _Pattern + 'CostiVariabili.asmx/Get',
		costiInterni            : _Pattern + 'CostiInterni.asmx/Get',
		risorseUmane            : _Pattern + 'Hr.asmx/Get',
		investimenti            : _Pattern + 'Capex.asmx/Investimenti_Get',

		materiali               : _Pattern + 'Capex.asmx/Imm_Materiali_Get',
		immateriali             : _Pattern + 'Capex.asmx/Imm_Immateriali_Get',
		finanziarie             : _Pattern + 'Capex.asmx/Imm_Finanziarie_Get',
		gestStraordinaria       : _Pattern + 'GestioneStraordinaria.asmx/Get',

		fonti                   : _Pattern + 'Capex.asmx/AumentiCapitale_Get',
		finanziamenti           : _Pattern + 'Capex.asmx/Finanziamenti_Get',
		altro                   : _Pattern + 'Capex.asmx/Altro_Get',
		contoEconomico          : _Pattern + 'Economics.asmx/ContoEconomico',			// Sezione "Prospetti"
		rendiconto              : _Pattern + 'Economics.asmx/RendicontoFinanziario',
		statoPatrimoniale       : _Pattern + 'Economics.asmx/StatoPatrimoniale',
		fontiFinanziarie        : _Pattern + 'Economics.asmx/FontiFinanziarie',
		messaggi                : _Pattern + 'Economics.asmx/messaggi',
		errorCounter            : _Pattern + 'Economics.asmx/messaggi_summary',
	}

	var _WRITE_ENDPOINTS = {
		impostazioni            : _Pattern + 'Config.asmx/Economics_Set',				// Settings
		iva                     : _Pattern + 'Iva.asmx/Set',					// Sezione "Piano economico"
		ricavi                  : _Pattern + 'Ricavi.asmx/Ricavo_Set',
		annoPrecInsert          : _Pattern + 'AnnoPrec.asmx/Set',
		annoPrecProspetto       : _Pattern + 'AnnoPrec.asmx/Set',
		costiEsterni            : _Pattern + 'Ricavi.asmx/CostiEsterniMagazzino_Set',
		costiVariabili          : _Pattern + 'CostiVariabili.asmx/Set',
		costiInterni            : _Pattern + 'CostiInterni.asmx/Set',
		risorseUmane            : _Pattern + 'Hr.asmx/Set',
		investimenti            : _Pattern + 'Capex.asmx/Investimenti_Set',
		gestStraordinaria       : _Pattern + 'GestioneStraordinaria.asmx/Set',

		materiali               : _Pattern + 'Capex.asmx/Imm_Materiali_Set',
		immateriali             : _Pattern + 'Capex.asmx/Imm_Immateriali_Set',
		finanziarie             : _Pattern + 'Capex.asmx/Imm_Finanziarie_Set',

		fonti                   : _Pattern + 'Capex.asmx/AumentiCapitale_Set',
		finanziamenti           : _Pattern + 'Capex.asmx/Finanziamenti_Set',
        altro                   : _Pattern + 'Capex.asmx/Altro_Set',
        annoPrecConferma        : _Pattern + 'Economics.asmx/Confirm',
	}
	
	return {
		Common_Get : wsCommonGET,
		Common_Set : wsCommonSET,
        Compile: wsCompile

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

		if (endpoint == null) {
			console.error('%cAttenzione: servizio SET per "' + pageID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');  // Andrà in pBase o meglio ancora in "eBase"
		}

		params.dataSource = 'data';
		params.endpoint   = endpoint;
		params.fields     = (pageID != 'impostazioni')? [] : Object.keys(params.data);
		params.body       = (pageID != 'impostazioni')? params.data : mBase.BuildsRequestBody(params);

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

});
