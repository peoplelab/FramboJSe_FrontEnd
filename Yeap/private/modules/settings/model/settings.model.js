//----------------------------------------------------------------------------------------
// File: settings.model.js
//
// Desc: Model for homepage
// Path: /Private/modules/settings/model
//----------------------------------------------------------------------------------------

define([
    'base_model'
], function (mBase) {
	var _Pattern='/api/public/ws/';

	// Web services endpoint constant definition
	var _ENDPOINT_GET    = _Pattern + 'Config.asmx/General_Get';
	var _ENDPOINT_SET    = _Pattern + 'General.asmx/Set';
	var _ENDPOINT_UPDATE = _Pattern + 'Config.asmx/General_Set';

	return {
		GetSettings   : wsGetSettings,
		SaveSettings  : wsSaveSettings,
		UpdateSettings: wsUpdateSettings,
	}


	// FUNCTION: wsGetSettings
	//	Chiamata web service per: Get Setting generali
	function wsGetSettings(params) {

		params.dataSource = '';
		params.endpoint   = _ENDPOINT_GET;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}

	// FUNCTION: wsSaveSettings
	//	Chiamata web service per: Save/create Setting generali
	function wsSaveSettings(params) {

		params.dataSource = '';
		params.endpoint   = _ENDPOINT_SET;
		params.fields     = ['Nome', 'Logo'];											// Campo specificato manualmente
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}

	// FUNCTION: wsUpdateSettings
	//	Chiamata web service per: Update Setting generali
	function wsUpdateSettings(params) {

		params.dataSource = 'data';
		params.endpoint   = _ENDPOINT_UPDATE;
		params.fields     = Object.keys(params.data);							// Campi letti da template tramite "pBase.BuildsJson4Save(...)"
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);
	}



});