// --------------------------------------------------------
// File: MAIN.JS 
// Main js function for initial Default.Master page
// 
// Scope: framework
// --------------------------------------------------------

// ** Builds the hashmap of the querystring parameters **
var urlParams = {};  												// Initialize hashmap
(window.onpopstate = function () {
	var match,
		search = /([^&=]+)=?([^&]*)/g,								// Regexp: searchs text between "=" and next "&" occourrence
		decode = function (s) {

			return decodeURIComponent(s.replace(/\+/g, " "));		// Regexp: replaces addition symbol with a space
		
		//	// PATCH (31/01/2020): provata modalità try/catch per prevenire errori di decoding delle stringhe [caratteri non ammessi]
		//	// Il test (parziale) ha funzionato, ma necesita di verifiche più approfondite prima di metterlo online
		//	// Vanno evitati assolutamente i caratteri "&" (se non encodati? Come prevenire?) nelle stringhe, perché viene usato per separare gli argomenti della Query String
		//	// TO DO: terminare i check e convalidare
		//	var x;
		//	try {
		//		x = decodeURIComponent(s.replace(/\+/g, " "));		// Regexp: replaces addition symbol with a space
		//	}
		//	catch {
		//		x = s.replace(/\+/g, " ");							// Regexp: replaces addition symbol with a space
		//	}
		//	finally {
		//		return x
		//	}

		},
		query = Cookies.get('Redirect_cookie').substring(1);        //va a leggere la querystring dal cookies 

	urlParams = {};
	while (match = search.exec(query)) { urlParams[decode(match[1])] = decode(match[2]) };
})();
