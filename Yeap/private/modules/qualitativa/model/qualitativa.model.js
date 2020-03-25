//----------------------------------------------------------------------------------------
// File: qualitativa.model.js
//
// Desc: Model della pagina "Analisi qualitativa"
// Path: /Private/modules/qualitativa/model
//----------------------------------------------------------------------------------------

define([
    'base_model'
], function (mBase) {
	var _Pattern='/api/public/ws/';

	// Web services endpoint constant definition
	var _ENDPOINT_GET     = _Pattern + 'QAnalysis.asmx/Get';
	var _ENDPOINT_SET     = _Pattern + 'QAnalysis.asmx/Save';
	var _ENDPOINT_ANALYZE = _Pattern + 'QAnalysis.asmx/Analyze';
	var _ENDPOINT_REPORT  = _Pattern + 'Reports.asmx/QAnalysis';

	return {
		GetAnalisi : wsGetAnalisi,
		SaveAnalisi: wsSaveSettings,
		EvalAnalisi: wsEvalAnalisi,
		Report     : wsReport,
	}


	// FUNCTION: wsGetAnalisi
	//	Chiamata web service per: Get Analisi qualitativa
	function wsGetAnalisi(params) {

		params.dataSource = '';
		params.endpoint   = _ENDPOINT_GET;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}

	// FUNCTION: wsSaveSettings
	//	Chiamata web service per: Save/create Analisi qualitativa
	function wsSaveSettings(params) {

		params.dataSource = 'data';
		params.endpoint   = _ENDPOINT_SET;
		params.fields     = Object.keys(params.data);							// Campi letti da template tramite "pBase.BuildsJson4Save(...)"
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}

	// FUNCTION: wsEvalAnalisi
	//	Chiamata web service per: Valutazione Analisi qualitativa
	function wsEvalAnalisi(params) {

		params.dataSource = 'data';
		params.endpoint   = _ENDPOINT_ANALYZE;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}


	// FUNCTION: wsReport
	function wsReport(params) {

		params.dataSource = '';
		params.endpoint   = _ENDPOINT_REPORT;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

	}

});