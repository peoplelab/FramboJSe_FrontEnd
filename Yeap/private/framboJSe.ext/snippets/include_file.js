//----------------------------------------------------------------------------------------
// File  : include_file.js
//
// Desc  : Include un file (statico) in un template HTML
// Path  : /Private/framboJse.ext/snippets
// target: <snp_include_file />
// output: testo (html) da includere
//----------------------------------------------------------------------------------------
define ([], function() {

	var _ITEMNAME = 'include_file';
	var _ITEMTAG  = 'snp_';

	return {
		itemName : _ITEMNAME,													// Item's name
		itemTag  : _ITEMTAG,													// Item's tag prefix
		BuildHtml: buildHtml,													// Item's HTML
		Extend   : extend														// Callback function management
	}


	// FUNCTION: buildHtml
	//  builds the snippet's HTML code 
	// PARAMS:
	//  tagPars : tag's custom parameters (in JSON format)
	//  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
	//              pbAttrs[0] : extension of "class" attribute,
	//              pbAttrs[1] : all others attributes 
	// RETURN:
	//  myHtml  : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
	function buildHtml(tagPars, pbAttrs) {
        
		tagPars.itemName = _ITEMNAME;																	// Traccia i

		// Definizione variabili e lettura parametri
		var myHtml   = '';																				// Contenuto del file da includere
		var myErr    = '';																				// Testo del messaggio d'errore
		var root     = '';																				// Path del folder (root) specificato nel rootContainer
		var filePath = '';																				// URL fisico del file, costruito secondo le modalità specificate
		var defID    = '@';																				// Placeholder che identifica la cartella di default dei file da includere
		var fileName = tagPars.file;
		var parent   = (tagPars.parent != undefined)? tagPars.parent : '';								// ID del container di riferimento per la mappatura automatica dei file


		// ** Determina la modalità di costruzione dell'URL del file
		switch (true) {

			case (fileName.charAt(0) == '/'):															// 1: Il path del file è un URL assoluto che fa riferimento alla root della webapp
				filePath = fileName + __SYS_version;													// Costruzione del path ed uscita (non deve controllare più niente)
				break;

			case (parent != ''):																		// 2: Il path del file è costruito leggendo il valore specificato nel parametro "path" di un parent Container 
				root = $('#' + parent).attr('path');													// Lettura del valore del parametro
				root = (root != undefined)? root : '';													// Normalizza il valore
				fileName = root + '/' + fileName;														// Aggiorna il file name

			default:																					// Il path del file è un URL relativo che fa riferimento alla cartella di default specificata in __testuali.includes
				filePath = fileName + __SYS_version;													// Costruzione del path

				if (filePath.charAt(0) == defID) {														// Determina se il path del file fa riferimento alla cartella di default specificata in __testuali.includes
					filePath = filePath.substr(1);														// Elimina il carattere di controllo "*" dal nome
					filePath = __testuali.includes + filePath;											// Aggiornamento del path
				}
		}


		return new Promise((resolve, reject) => {

			myHtml = $.ajax({
				type: "GET",
				url : filePath,
				dataType: "html",
			});
			resolve(myHtml);

		}).catch((err) => {

			myErr += '<div class="errorMsg">';															// Costruzione del messaggio d'errore
			myErr +=   '<h4><b>Errore!</b></h4>';
			myErr +=   'Impossibile includere il file richiesto:<br>'
			myErr +=   '<span class="fileName"> ' + fileName + '</span>';
			myErr += '</div>';
			
			return myErr;

		});
	
	}


	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function extend(params) {

    	var domain = (params.domain != undefined) ? params.domain : '';

	}

})
