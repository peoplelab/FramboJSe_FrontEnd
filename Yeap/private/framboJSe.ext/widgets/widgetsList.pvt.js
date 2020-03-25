//----------------------------------------------------------------------------------------
// File: widgetsList.pub.js
//
// Desc: List of specific widgets of the current web application - Public area
// Path: /public/framboJSe.ext/widgets
//----------------------------------------------------------------------------------------

define (function () {

	return {

		List: buildList
	}

	
	// FUNCTION: buildList
	//  Builds the list of defined widgets
	// PARAMS: 
	//  none
	// RETURN:
	//  widgetsList : list of widgets  
	function buildList() {

		var widgetsList = [  

			'input_scaled',									// Campo input con valore scalato
			'drawerTitle',									// Titolo del sottocassetto con icone
			'btnConsole',									// Pulsantiera di comando delle operazioni nelle pagine
			'btnConsole_CDG',								// Pulsantiera di comando delle operazioni nelle pagine del Controllo di gestione
			'btnConsole_testuali',							// Pulsantiera di comando delle operazioni nelle pagine dei Dati Testuali
			'pageHeader',									// Costruzione dell'header delle pagine, con titolo, link ai tutorial, ecc.

			// Others
			''												// Dummy (last element)
		];

		return widgetsList;
	}
});

