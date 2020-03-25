//----------------------------------------------------------------------------------------
// File: report.model.js
//
// Desc: Model del servizio "report" (common)
// Path: /Private/modules/common/model
//----------------------------------------------------------------------------------------

define([
    'base_model'
], function (mBase) {

	var _Pattern='/api/public/ws/';

	// Web services endpoint constant definition
	var _ENDPOINTS = {
		qualitativa		 : _Pattern + 'Reports.asmx/QAnalysis',
		pianoEconom		 : _Pattern + 'Reports.asmx/Economics',
		sendLeanus		 : _Pattern + 'LeanusGateway.asmx/Send',
		readLeanus		 : _Pattern + 'LeanusGateway.asmx/ResultData',
        datiTestuali	 : _Pattern + 'Reports.asmx/TextData',
        testualiProspetti: _Pattern +'Reports.asmx/EcoText',
	}

	return {
		GetReport		: wsGetReport,
		GetReportLEANUS : wsGetReportLEANUS,
        GetDatiTestuali : wsGetDatiTestuali,
        GetProspetti	: wsGetProspetti
	}


	// FUNCTION: wsGetReport
	//	Chiamata web service per la funzione GET del report
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function wsGetReport(params) {

        var reptID = params.rept;
		var endpoint = _ENDPOINTS[reptID];

		if (endpoint == null) {
			console.error('%cAttenzione: servizio GET per "' + reptID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');
		}

		params.dataSource = '';
		params.endpoint   = endpoint;
		params.fields     = ['Format'];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);

	}
	function wsGetReportLEANUS(params) {

        var reptID = params.rept;
		var endpoint = _ENDPOINTS[reptID];

		if (endpoint == null) {
			console.error('%cAttenzione: servizio GET per "' + reptID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');
		}

		params.dataSource = '';
		params.endpoint   = endpoint;
		params.fields     = [];
		params.body       = mBase.BuildsRequestBody(params);

		return mBase.ExecuteRequest(params);

	}


	// FUNCTION: wsGetDatiTestuali
	//	Chiamata web service per la funzione GET del report
	// PARAMS:
	//  params.reptID : ID del report
	// RETURN:
	//  none
	function wsGetDatiTestuali(params) {

		var reptID   = params.rept;
		var xmlTxt   = params.xmlTxt;
	//	var xmlTxt   = encodeURIComponent(params.xmlTxt);
		var endpoint = _ENDPOINTS[reptID];

		if (endpoint == null) {
			console.error('%cAttenzione: servizio GET per "' + reptID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');
		}

		params.dataSource = xmlTxt;
		params.endpoint   = endpoint;
		params.fields     = params.Format;
		params.body       = mBase.BuildsRequestBody(params).replace('<Data></Data>', xmlTxt);

		return mBase.ExecuteRequest(params);

    }



    // FUNCTION: wsGetProspetti
    //	Chiamata web service per la funzione GET dei prospetti
    // PARAMS:
    //  params.reptID : ID del report
    // RETURN:
    //  none
    function wsGetProspetti(params) {

        var reptID = params.rept;
        var xmlTxt = params.xmlTxt;
        //	var xmlTxt   = encodeURIComponent(params.xmlTxt);
        var endpoint = _ENDPOINTS[reptID];

        if (endpoint == null) {
            console.error('%cAttenzione: servizio GET per "' + reptID + '" non definito in "model"', 'padding: 3px 10px; color:#900; font-weight:bold;');
        }

        params.dataSource = xmlTxt;
        params.endpoint = endpoint;
        params.fields = [];
        params.body = mBase.BuildsRequestBody(params).replace('<Data></Data>', xmlTxt);

        return mBase.ExecuteRequest(params);

    }

});
