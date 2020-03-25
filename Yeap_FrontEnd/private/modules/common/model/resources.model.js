//----------------------------------------------------------------------------------------
// File: resources.model.js
//
// Desc: Model for rest service Resources.ashx
// 
//----------------------------------------------------------------------------------------

define([
	'base_model'
], function (mBase) {
	var _Pattern	= '/api/public/ws/';
	// Web services endpoint constant definition
	var _ENDPOINT_XMLGENERAL   = _Pattern + 'Resources.ashx/xml-general';
	var _ENDPOINT_XMLQA		   = _Pattern + 'Resources.ashx/xml-qa';
	var _ENDPOINT_XMLECONOMICS = _Pattern + 'Resources.ashx/xml-economics/' + __WACookie.Token;
	var _ENDPOINT_LOADEXCEL	   = _Pattern + 'CDG.asmx/Import/' + __WACookie.Token;


	return {
		XmlGeneral: getXmlGeneral,
		XmlQA: getXmlQA,
		XmlEconomics: getXmlEconomics,
	}


	// FUNCTION: getXmlGeneral
	//	Chiamata al servizio per la lettura dei dati "General"
	function getXmlGeneral(params) {

		params.endpoint = _ENDPOINT_XMLGENERAL;
		return restGet(params);
	}


	// FUNCTION: getXmlQA
	//	Chiamata al servizio per la lettura dati sezione "Analisi qualitativa"
	function getXmlQA(params) {

		params.endpoint = _ENDPOINT_XMLQA;
		return restGet(params);
	}


	// FUNCTION: getXmlEconomics
	//	Chiamata al servizio per la lettura dei dati "General"
	function getXmlEconomics(params) {

		params.endpoint = _ENDPOINT_XMLECONOMICS;
		return restGet(params);
	}


	// FUNCTION: restGet
	//	common call for a rest service (get method)
	function restGet(params) {

		params.dataSource = '';
		params.fields = [];
		params.body = '';

		return mBase.ExecuteRestRequest(params);
	}

});