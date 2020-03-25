//----------------------------------------------------------------------------------------
// File: report.presenter.js
//
// Desc: Presenter del servizio "report" (common)
// Path: /Private/modules/common/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'modals',
], function (pBase, modals) {

	var _modalsContainer = '#modalsContainer';																// Target container (ID) for the modal windows

	return {
		OpenUrl   : openUrl,																				// Funzione di apertura report
		SendLeanus: sendLeanus,																				// Invio BP a Leanus
		ReadLeanus: readLeanus,																				// Lettura report di Leanus
	}


	// FUNCTION: openUrl
	//	Apre il report (pdf) dell'URL inviato come risposta
	// PARAMS:
	//	RawData : risposta del servizo Saas
	// RETURN:
	//	none
	function openUrl(params) {

		var xmlDoc = $.parseXML(params.RawData);
		var url    = decodeURIComponent( $(xmlDoc).find("Response>Data>Url").text() );

		if (url.length > 0) {

			window.open(url, 'report');
		//	__ReportWindows.location = url

		} else {

			modals.ShowErr({
				target : _modalsContainer, 
				errCode: '"No URL"',
				errMsg : "[b]Si è verificato un errore.[/b][br][br]Impossibile aprire il report richiesto"
			})

		}
        
	}


	// FUNCTION: sendLeanus
	//	Apre il report (pdf) dell'URL inviato come risposta
	// PARAMS:
	//	RawData : risposta del servizo Saas
	// RETURN:
	//	none
	function sendLeanus(params) {

		console.log(params);

		var xmlDoc = $.parseXML(params.RawData);
		var code   = $(xmlDoc).find('Result>Codice').text();
		var desc   = $(xmlDoc).find('Result>Descrizione').text();

		if (code == 0) {
			modals.ShowOK({
				target: _modalsContainer
			})
		} else {
			modals.ShowErr({
				target : _modalsContainer, 
				errCode: code,
				errMsg : desc
			})
		}

	}

	// FUNCTION: readLeanus
	//	Apre il report (pdf) dell'URL inviato come risposta
	// PARAMS:
	//	RawData : risposta del servizo Saas
	// RETURN:
	//	none
	function readLeanus(params) {

	}




});
