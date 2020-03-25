//----------------------------------------------------------------------------------------
// File: snippetsList.pub.js
//
// Desc: List of specific snippets of the current web application - Public area
// Path: /public/framboJSe.ext/snippets
//----------------------------------------------------------------------------------------

define (function () {

    return {

        List: buildList
    }


    // FUNCTION: buildList
    //  Builds the list of defined snippets
    // PARAMS: 
    //  none
    // RETURN:
    //  snippetsList : list of snippets  
    function buildList() {

        var snippetsList = [  
		
			// Type: dropdown lists
			'dd_tipologieAzienda',							// DropDown Tipologie azienda
			'dd_settoriAzienda',							// DropDown Settori azienda
			'dd_elenchiQA',									// DropDown generale per gli elenchi di Analisi qualitativa
			'XML_label',									// Label ottenuta da un attributo del nodo XML richiesto
			'XML_label_economics',							// Risoluzione label codificate per sezione economics
			'labelCode',									// Risoluzione label codificate per sezione economics

			'infoPopup',
			'qualityBadge',									// Bollini "qualità dati" compilati

			'include_file',									// Include il file statico specificato
			// Others
			''                          					// Dummy (last element)
		];

		return snippetsList;
    }
});
