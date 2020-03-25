//----------------------------------------------------------------------------------------
// File  : dd_base.js
//
// Desc  : Kernel per gli snippet di tipo "drop down"
// Path  : /Private/framboJse.ext/snippets
// target:  * Richiamato da altri snippet *
// output:  drop down
//----------------------------------------------------------------------------------------

define([], function () {

	return {
		RenderXml    : renderFromXml,											// Costruzione Html da dati in formato: XML
        RenderJson   : renderFromJson,											// Costruzione Html da dati in formato: JSON
        RenderXmlNode: renderFromXmlNode,										// Costruzione Html da dati in formato: nodo XML
		GetXmlNode   : getXmlNode,												// Restituisce il contenuto del nodo XML specificato
	}

        
	// FUNCTION: renderFromXml
	//	Costruzione Html da dati in formato: XML
	// PARAMS:
	//	xml_raw : XML source data
	//	tPars   : "data-pars" attributes
	//	pbAttrs : (additionally) public attributes for rendering
	// RETURN:
	//	select : string representing the drop down rendered.
	function renderFromXml(xml_raw, tPars, pbAttrs) {

        var rowCode  = '';
        var rowDesc  = '';
        var selected = '';

		var xmlDoc   = $.parseXML(xml_raw);
		var $xml     = $(xmlDoc);
		var codice   = 0;
		var xmlText  = '';

		var options = initOptionsList({											// Inizializza l'elenco options
			tp : tPars, 
		});

		$($xml).each(function () {

			codice  = parseInt($(this).find("response>result>codice").text());
			xmlText = decodeURIComponent($(this).find("response>result>descrizione").text());
			if (codice > 0) {
				return;
			}

			var $rows = $(this).find("element");

			$($rows).each(function () {

				rowCode = $(this).find("codice").text();
				rowDesc = $(this).find("descrizione").text();
				selected = (rowCode == tPars.value) ? ' selected="selected" ' : '';

				options += '<option value="' + rowCode + '" ' + selected + '>';
				options +=   decodeURIComponent(rowDesc);
				options += '</option>';

			});
		});

		return buildsHtmlSelectTag({											// Costruisce e restituisce l'HTML specifico
			opt: options,
			tp : tPars, 
			pb : pbAttrs, 
		})
	}


	// FUNCTION: renderFromJson
	//	Render drop down html code from json data.
	// PARAMS: 
	//	json_raw : json data to render
	//	tPars    : "data-pars" attributes
	//	pbAttrs  : (additionally) public attributes for rendering
	// RETURN;
	//	select : string representing the drop down rendered.
	function renderFromJson(json_raw, tPars, pbAttrs) {

        var rowCode  = '';
        var rowDesc  = '';
        var selected = '';

		var options = initOptionsList({											// Inizializza l'elenco options
			tp : tPars, 
		});

		$(json_raw.items).each(function (index, item) {

			rowCode = item.Value;
			rowDesc = item.Text;
			selected = (rowCode == tPars.value) ? ' selected="selected" ' : '';
                                
			options += '<option value="' + rowCode + '" ' + selected + '>';
			options   += decodeURIComponent(rowDesc);
			options += '</option>';
		});

		return buildsHtmlSelectTag({											// Costruisce e restituisce l'HTML specifico
			opt: options,
			tp : tPars, 
			pb : pbAttrs, 
		})
	}



    // FUNCTION: renderFromXmlNode
    //	Builds drop down html code from xml "subtag" (typically a "part of" an entire xml get from a rest service).
    // PARAMS:
	//	xmlData  : Nodo XML contenente i dati
	//	xmlValue : Nome del campo contenente il valore
	//	xmlLabel : Nome del campo contenente l'etichetta
	//	tagPars  : Parametri specifici dello snippet
	//	pbAttrs  : Attributi HTML del tag costruito dallo snippet
    // RETURN:
    //	String text del codice HTML della select
    function renderFromXmlNode(params) {

        var rowCode  = '';
        var rowDesc  = '';
        var selected = '';
		
        var xmlValue = params.xmlValue;
        var xmlLabel = params.xmlLabel;
		var optsOnly = (params.optsOnly == null)? false : params.optsOnly;
		var options  = initOptionsList({										// Inizializza l'elenco options
			tp : params.tagPars, 
		});

        $(params.xmlData).each(function () {

            rowCode  = $(this).find(params.xmlValue).text();
            rowDesc  = $(this).find(params.xmlLabel).text();
            selected = (rowCode == params.tagPars.value) ? ' selected="selected" ' : '';

            options += '<option value="' + rowCode + '" ' + selected + '>';
            options +=   decodeURIComponent(rowDesc);
            options += '</option>';

        });

		if (optsOnly) {
			return options;
		} else {
			return buildsHtmlSelectTag({											// Costruisce e restituisce l'HTML specifico
				opt: options,
				tp : params.tagPars, 
				pb : params.pbAttrs, 
			});
		}
    }


    // FUNCTION: getXmlNodeElements
    //	Estrae dal nodo XML richiesto gli elementi
    // PARAMS:
	//	xmlRaw  : Testo dell'XML da analizzare
	//	element : nome/path degli elementi da estrarre
	//  filter  : Eventuale regola di filtro sugli elementi
    // RETURN:
    //	Insieme degli elementi estratti

    //function getXmlNodes(xmlSource) {
    function getXmlNode(params) {

        //var xml_node_element = 'settore';
		var xmlDoc;
		var retrived;
        var searchFor = '';

        searchFor += params.element;												// Aggiunge il nome degli elementi da estrarre
		searchFor += (params.filter != null)? params.filter : '';					// Aggiunge l'eventuale regola filtro

        xmlDoc   = $.parseXML(params.xmlRaw);
        retrived = $(xmlDoc).find(searchFor);

        return retrived;
    }




	// ===
	// ** COMMON FUNCTIONS **
	// ===

	// ** 1 **
	// FUNCTION: initOptionsList
	//	Inizializza l'elenco dei tag options con eventuale primo elemento custom
	// PARAMS:
	//	tp : parametri specifici dello snippet
	function initOptionsList(params) {

		var html = '';

		if (params.tp.emptyItem != 'none') {
		    html  = '<option';
		    html +=   ((params.tp.emptyValue != null) ? ' value="' + params.tp.emptyValue + '" ' : '') + '>';
		    html +=   ( params.tp.emptyLabel != null) ? params.tp.emptyLabel : '';
		    html += '</option>';
		}

        return html;
	}

	// ** 2 **
	// FUNCTION: buildsHtmlSelectTag
	//	Costruzione finale del tag "Select" restituito dal kernel
	// PARAMS:
	//	opt : elenco delle opzioni
	//	tp  : parametri specifici dello snippet
	//	pb  : attributi HTML specifici dello snippet
	function buildsHtmlSelectTag(params) {

		var html = '';

        html += '<select class="form-control ' + params.tp.itemName + params.pb[0] + ' " ';
        html += (params.tp.value != null) ? ' ov="' + params.tp.value + '" ' : '';
        if (params.tp.key != null) {
            html += ' id="'  + params.tp.key + '" ';							// Attributo "id" del tag
            html += ' key="' + params.tp.key + '" ';							// Attributo "key" del tag
        }
        html += params.pb[1] + '>';
        html += params.opt;														// Aggiunge le opzioni
        html += '</select>';

        return html;
	}

});
