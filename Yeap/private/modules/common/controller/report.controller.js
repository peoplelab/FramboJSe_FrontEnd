//----------------------------------------------------------------------------------------
// File: report.controller.js
//
// Desc: Controller del servizio "report" (common)
// Path: /Private/modules/common/controller
//----------------------------------------------------------------------------------------

define([
    'base_controller',
    'base_presenter',
//	'/private/modules/common/model/report.model.js',
//	'/private/modules/common/presenter/report.presenter.js',
	'reportModel',
	'reportPresenter',
], function (cBase, pBase, model, presenter) {



	return {
		GetReport : reptGetReport,
		SendLeanus: reptSendLeanus,
		ReadLeanus: reptReadLeanus,

        GetTestiWP: reptGetTestiWP,
	}
	

	// FUNCTION: reptGetReport
	//  Report Analisi Qualitativa
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function reptGetReport(params) {

		return model.GetReport({
			rept     : params.reptID,
			Format   : params.format,
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(){}
		}).then(function(params){
			presenter.OpenUrl({ 
				RawData: params.d,
			});
		});
	}


	// FUNCTION: reptSendLeanus
	//  Invia a Leanus i dati del Business plan
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function reptSendLeanus(params) {

	//	return model.GetReport({
		return model.GetReportLEANUS({
			rept     : 'sendLeanus',
	//		Format   : [],
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(){}
		}).then(function(params){
			presenter.SendLeanus({
				RawData: params.d,
			});
		});

	}


	// FUNCTION: reptReadLeanus
	//  Legge da Leanus il report elaborato
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function reptReadLeanus(params) {

		return model.GetReportLEANUS({
			rept     : 'readLeanus',
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(){}
		});

	}


	// FUNCTION: reptGetTestiWP
	//  Legge da Wordpress i dati testuali 
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function reptGetTestiWP(params) {

		//var xml = params.xmlTxt;

		return model.GetDatiTestuali({
			rept     : params.reptID,
			xmlTxt   : params.xmlTxt,
			Format   : params.format,
			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function(){}
		}).then(function(params){
			presenter.OpenUrl({ 
				RawData: params.d,
			});
		});

    }


});
