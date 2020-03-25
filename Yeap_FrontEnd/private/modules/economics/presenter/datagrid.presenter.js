//----------------------------------------------------------------------------------------
// File: datagrid.presenter.js
//
// Desc: Gestione del datagrid delle pagine "Economics"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_model',
	'base_presenter',
	'dependencies',
], function (mBase, pBase, deps) {

	var _container    = '';														// ID del container del datagrid
	var _xml          = '';
	var _nDec         = 2;														// Numero di decimali
	var _defaultTotal = 'ncrow';												// Tipo totale di default
	var _nColonne; 
	var _econXML;

	var _enableLabel = !true;													// Flag per abilitare funzione sperimentale: etichetta valore formatato in overlay per i campi input


	return {
		Init        : init,														// Initializes (setup) the datagrid

		SumByCols     : sumByCols,												// Callbacks
		SumByRows     : sumByRows,
		SumByGrid     : sumByGrid,
		FormatNumber  : formatNumber,
		NumberToLocale: numberToLocale,
		LocaleToNumber: localeToNumber,
		BuildsXML     : buildsXML,
	}


	// FUNCTION: init
	//  Inizializza gli elementi del datagrid
	// PARAMS:
	//  ...
	// RETURN:
	//  none
	function init(params) {

		_container = params.container;
		_nColonne  = params.nColonne;
		_xml       = params.xmlDocumnt;
		_econXML   = __Preloads.economics;										// Lettura del file "economics.xml" precaricato nel presenter
	
		$('#preloader').attr('style', 'display:block');							// Shows the "preloader" layer

		// Definizione delle dipendenze
		deps.Init();

		// 1 - Risoluzione degli header dei dataset: dsheader
		$('[dsheader]').each(function (){
			
			$(this).html( dsHeader({totals: $(this).attr('totals')}) );
		});

		// 2 - Risoluzione dei dataset del datagrid: dstable
		$('[dstable]').each(function (){
			dsTable( $.extend($(this).data(), {xml: _xml}) );
		});

		// 3 - Bindings (eventi dei campi):
		bindings();

		$('#preloader').attr('style', 'display:none');							// Hides the "preloader" layer

		return;
	}



	//======| Sez. 1: Costruttori |================================================

	// FUNCTION: dsHeader
	//	Stampa l'intestazione delle colonne (nr. anni)
	// PARAMS:
	//	None
	// RETURN:
	//	None
	function dsHeader(params) {
	
		var html   = '';
		var year_1 = eval( __WACookie.init );
		var totals = !(params.totals == "false" || params.totals == false);
	
		html += '<div class="row">';											// Inizia una nuova riga
		html +=   '<div class="col datagrid-6">';
		html +=     '<div class="clear clearfix">';
		html +=       '<label class="rowLabelTitle"></label>';					// Prima colonna vuota
		for (c = 0; c < _nColonne; c++) {										// Aggiunge etichetta anno
			html += '<label class="rowLabelTitle">';
			html += (year_1 + c);
			html += '</label>';
		}
		if (totals) {
			html +=       '<label class="rowLabelTitle">Totali</label>';		// Colonna totali
		}
		html +=     '</div>';
		html +=   '</div>';
		html += '</div>';														// Fine riga head
		
		return html
	}


	// FUNCTION: dsTable
	//	Costruisce una matrice (tabella) n * m con totali di colonna (e di riga?)
	// PARAMS:
	//	name     : Nome del dataset
	//	type     : Tipo dei campi: input, calcolato, ecc.
	//	rows     : Numero di righe
	//	cols     : Numero di colonne
	//	totals   : Tipologie dei totali da costruire
	//	onchange : Funzioni di callback da eseguire sull'onchange
	function dsTable(params) {

		// Definizione variabili
		var html      = "";														// Html per la costruzione della griglia
		var id        = '';														// Usato nella composizione ID degli elementi della griglia
		var val       = 0;														// Valore da assegnare al campo (generalmente da XML)
		var cols      = _nColonne;												// Numero di colonne
		var name      = params.name;											// Nome del dataset
		var type      = params.type;											// Tipo dei campi
		var rows      = params.rows;											// Numero di righe
		var tots      = params.total;											// Tipologie di totali
		var xml       = params.xml;												// Documento XML dei dati
		var method    = params.method;											// Metodo per l'identificazione del nodo XML da leggere
		var years     = params.years;
		var prefill   = params.prefill;											// Eventuale valore di "prefill" dei campi (es.: per tabelle ex-input nascoste, che devono essere forzate a un valore ma non sono editabili)
		var parent    = params.parent;											// Nome del nodo 'parent' (Metodo 3)
		var child     = params.child;											// Nome del nodo 'child' (Metodo 3)
		var cbChange  = params.change;											// Set delle callbacks da eseguire sull'onchange

		var codiceRPT = params.label;											// TEST: Utilizzo del codice RPT al posto del codice UI

		var fillEmpty = params.fill;											// Riempie le colonne escluse della tabella con falsi campi N.D.

		var initValue = 0;														// Valore di default per campi non assegnati
		var xmlValue;
		var cssClass;
		var exCols = 0;

		// Patch per tabelle monocolonna
		if (years != undefined && years > 0 && years <= 5) {
			exCols = cols;
			cols = years;
		}

		rows = (rows == null)? 1 : rows;
		tots = (tots == null)? _defaultTotal : tots.toLowerCase();
		var totByRows = (tots.indexOf('rows')  > -1) ? true : false;								// Flag di costruzione totali di riga
		var totByCols = (tots.indexOf('cols')  > -1) ? true : false;								// Flag di costruzione totali di colonna
		var totByGrid = (tots.indexOf('ttot')  > -1) ? true : false;								// Flag di costruzione totale di griglia
		var falseRTot = (tots.indexOf('ncrow') > -1) ? true : false;								// Flag di inserimento placeholde totale di riga
		var readonly  = (type != 'input') ? true : false;											// Flag di sola lettura dei campi


		// PATCH: trial-expired: => se "true"  trasforma tutto in read-only
		if (__WACookie.trial_expired == 'true') { readonly = true }


		var totByXXX  = (tots.indexOf('xxx')  > -1) ? true : false;									// Flag di costruzione totale di griglia
		var rowDivide = (tots.indexOf('division')  > -1) ? true : false;							// Flag di costruzione totale di griglia


		// ** 1: COSTRUZIONE GRIGLIA **
		html += '<div class="col datagrid-' + (cols + ((totByCols) ? 1 : 0)) + ((method == 8 || method == 15 || method == 71 || method == 32)? ' iva-row': '');
		html += '">';	// Wrapper della griglia

		for (r = 1; r <= rows; r++) {

			// 1: Costruzione dell'ID di riga e lettura dei parametri specifci (da "economics.xml")
			var rowId = name + '_' + r;
			var xmlNode = pBase.GetXmlNode({
				xmlRaw : _econXML.RawData,
				element: '[codiceUI=' + rowId + ']',
			});
			var unMis = ($(xmlNode).attr('um') == null)? '&nbsp;' : $(xmlNode).attr('um');

			html += '<div class="clear clearfix">';								// Inizia una nuova riga

			// 2: Etichetta della riga
			if (codiceRPT != null && codiceRPT != '') {												// §§§§§§§§§§§§§§§§§§
				html += '<snp_XML_label_economics data-pars="value:=\'' + codiceRPT + '\' || attr:=\'codiceRPT\'"';
			} else {
				html += '<snp_XML_label_economics data-pars="value:=\'' + rowId + '\'"';
			}
			html += (method == 6 || method == 7 || method == 33)? ' class="bold" ' : '';
			html += ' />';

			// 3: Costruzione campi di input (ciclo)
			for (c = 1; c <= cols; c++) {
				id = name + '_r' + r + '_c' + c;								// Costruzione ID (NRC)

				// Trova il nodo richiesto nel documento XML
				var Node;
				var Value;
				var errID;
				var decimalValue;
				var source;


				switch (method) {												// Selezione in funzione del "metodo" richiesto dallo specifico dataset

					case 1:
						source = 'P';
						if (name.indexOf('_MP') > -1 || name.indexOf('MP_') > -1) {
							source = 'MP';
							if (r < 10) {
								source += '0';
							}
						}

						Node  = $(xml).find('Anno[ID=' + c + ']>' + source + r);
						Value = parseInt($(Node).find(name).text());			// Legge il valore da XML
						errID = $(Node).find(name).attr('Status');
						break;

					case 2:
					case 21:
					case 7:
					case 71:
						Node  = $(xml).find('Anno[ID=' + c + ']');
						Value = parseInt($(Node).find(name).text());			// Legge il valore da XML
						errID = $(Node).find(name).attr('Status');
						if ($($(Node).find(name)).attr('Tipo') == 'R') {
							readonly = true;
						}
						break;

					case 3:
					case 32:
					case 33:
						Node  = $(xml).find(parent + '>' + child)[c - 1];
						Value = parseInt($(Node).text());						// Legge il valore da XML
						errID = $(Node).attr('Status');
						break;

					case 31:
						Node  = $(xml).find(parent + '>' + child + '[ID=' + c + ']');
						Value = parseInt($(Node).find(name).text());			// Legge il valore da XML
						errID = $(Node).find(name).attr('Status');
						break;

					case 4:
						source = 'P';
						if (name.indexOf('_MP') > -1 || name.indexOf('MP_') > -1) {
							source = 'MP';
							if (r < 10) {
								source += '0';
							}
						}

						Node  = $(xml).find('Anno[ID=' + c + ']>' + name + '>' + source + r);
						Value = parseInt($(Node).text());						// Legge il valore da XML
						errID = $(Node).attr('Status');
						readonly = true;
						break;
					case 5:
					case 15:
					case 6:
						Node  = $(xml).find(parent + '>' + child)[c - 1];
						Value = parseInt($(Node).text());						// Legge il valore da XML
						readonly = true;
						errID = $(Node).attr('Status');
						break;

					default:
						if (type != 'formula' && type != 'formulaComplex') {
							console.log(type, 'Node = ??');
						}
				}

				// *** PATCH (21/11/2018)!! Se esiste un valore di prefill, si sovrappone al valore letto da XML ***
				if (prefill != null && !isNaN(prefill)) {
					Value = prefill * 1000;
				}

				var Empty  = ((Value - parseInt(Value / 10) * 10) != 0)? true : false;	// Flag di campo vuoto
				var Class  = 'form-control economics ';
				var hasErr = '';
				if (errID == 1 || errID == 2) {									// 1 : campo vuoto, 2 : campo errato
					hasErr = (__WACookie.showErr)? ' hasErr ' : ' hasHiddenErr '; 
				}			
				if (errID == 3) {												// 3: warning
					hasErr = (__WACookie.showErr)? ' hasWarning ' : ' hasHiddenWarning ';
				}

				if (Empty && !readonly) {
					Class += 'isDefault ';
				}

				var Mirror = '';												// Campo "mirror" di input nascosto
				var FLabel = '';												// Campo "label" di input formattato

				html += '<span class="um' + hasErr;								// Costruzione Unità misura
				if (method == 6 || method == 7 || method == 33) {
					html += ' total';
				}
				if (readonly && !(method == 6 || method == 7 || method == 33) ) {
					html += ' calc_number2'
				}
				html += '">' + unMis + '</span>';

				html += '<input ';												// Costruzione ID (NR)
				if (readonly) {

					decimalValue = numberToLocale(Value / 1000, _nDec);
					// patch
					if (errID == '10') decimalValue = 'n.d.';

					if (method == 6 || method == 7 || method == 33) {
						Class += 'calc_number ';
					} else {
						Class += 'calc_number2 ';
					}

					html += ' type="text" ';									// Definizione tipo: calcolato = text
					html += ' readonly tabindex="-1" ';							// Definizione tag

				} else {

// §§§§---------
				//	decimalValue = formatNumber(								// Valore formattato (2 decimali)
				//		isNaN(Value) ? initValue : Value / 1000,
				//		_nDec
				//	);
					decimalValue = isNaN(Value) ? initValue : Value / 1000;

					Class  += 'input_number cleanInput ';					
				//	html   += ' type="number" step=".001" ';					// Definizione tipo: input = number
					html   += ' type="text" ';									// Definizione tipo: input = number
// §§§§---------

					Mirror += '<input type="hidden" '							// Definizione del campo "mirror" nascoto 
					Mirror += ' class="mirror" ';


					switch (method) {											// Aggiunge parametri specifici in funzione del tipo XML usato
						case 1:

							source = 'P';
							if (name.indexOf('_MP') > -1 || name.indexOf('MP_') > -1) {
								source = 'MP';
								if (r < 10) {
									source += '0';
								}
							}

					 		Mirror += ' prod="' + source + r + '" ';
					 		Mirror += ' key="' + name + '" ';
							break;
						case 2:
					 		Mirror += ' key="' + name + '" ';
							break;
						case 21:
						 	Mirror += ' parent="' + parent + '" ';
					 		Mirror += ' key="' + name + '" ';
							break;
						case 3:
						case 31:
						 	Mirror += ' parent="' + parent + '" ';
						 	Mirror += ' key="' + child + '" ';
							break;
						default:
					}


					Mirror += ' anno="' + c + '" ';
					Mirror += ' mirror="' + id + '" ';
					Mirror += ' value="' + Value + '" ';
					Mirror += '>';

				}
				
				html += ' class="' + Class + hasErr +'" ';												// Classe
				html += ' errID="' + errID + '" ';
				html += ' nRef="' + name + '" ';														// Attributi di rif.: nome
				html += ' rRef="' + r + '"';															// Attributi di rif.: riga
				html += ' cRef="' + c + '"';															// Attributi di rif.: colonna
				html += ' id="' + id + '" value="' + numberToLocale(decimalValue, _nDec) + '">';								// ID e valore
				
				html += Mirror;																			// Accoda l'eventuale campo mirror

			}

			// Mette falsi campi §§
			if (fillEmpty != undefined) {
				for (var ii = years; ii < exCols; ii++){
					html += '<span class="form-control economics falseTotal">n.d.</span>';				// Classe
				}
			}


			// Se specificato, aggiunge il totale di riga o il placeholder totale
			if (totByRows || totByXXX || rowDivide) {
				id = 'rTot_' + name + '_r' + r;															// Costruzione ID (NR)
				html += '<span class="um total">' + unMis + '</span>';									// Costruzione Unità misura
				html += '<input readonly tabindex="-1"';												// Definizione tag
				html += ' class="form-control calc_number economics"';									// Classe
				html += ' rRef="' + r + '" ';															// Attributi di riferimento
				html += ' nRef="' + name + '_totRow' + ((rows > 1)? '_' + r : '') + '" ';
				html += ' id="' + id + '" value="">';													// ID e valore
			}
			if (falseRTot) {
				html += '<span class="form-control economics falseTotal">n.d.</span>';					// Classe
			}
			html += '</div>';
		}


		// Se richiesti, aggiunge i totali di colonna e totale di griglia
		if (totByCols) {


			//html += '<div class="clear">';
			html += '<div class="clear' + ((tots.indexOf('hidecols') > -1)? ' hide' : '') + '">';
			html += '<snp_XML_label_economics class="bold" data-pars="value:=\'' + name + '_t\'" />';	// Costruzione della label di riga:

			// Totale di colonna
			for (c = 1; c <= cols; c++) {
				id    = 'cTot_' + name + '_c' + c;														// Costruzione ID (NR)
				html += '<span class="um total">' + unMis + '</span>';									// Costruzione Unità misura
				html += '<input readonly tabindex="-1"';												// Definizione tag
				html += ' class="form-control calc_number economics"';									// Classe
				html += ' nRef="' + name + '_totCol" rRef="1" cRef="' + c + '" ';						// Attributi di riferimento
				html += ' id="' + id + '" value="">';													// ID e valore
			}
			// Totale di griglia
			if (totByGrid) {
				id = 'gTot_' + name;																	// Costruzione ID (NR)
				html += '<span class="um total">' + unMis + '</span>';									// Costruzione Unità misura
				html += '<input readonly tabindex="-1" ';												// Definizione tag
				html += ' class="form-control calc_number economics" ';									// Classe
				html += ' id="' + id + '" value="">';													// ID e valore
			}

			html += '</div>';
		}

		// Inserimento finale della griglia nel DOM
		html += '</div>';																				// Chiusura wrapper della griglia
		$('[data-name=' + name + ']').html(html);														// Inserisce la griglia nel DOM


		// Ricalcolo contestuale dei dataset tipo formula
		if (type == 'formula' && $('[data-name=' + name + ']').attr('data-formula') != undefined) {
			solveFormula({target: name})
			x = 1;
		}
		// Ricalcolo contestuale dei dataset tipo formula
		if (type == 'formulaComplex' && $('[data-name=' + name + ']').attr('data-formula') != undefined) {
			solveFormulaComplex({target: name})
			x = 1;
		}

		// Aggiornamento immediato dei totali dichiarati
		if (totByCols) {sumByCols({names: name})}
		if (totByRows) {sumByRows({names: name})}
		if (totByGrid) {sumByGrid({names: name})}

		if (totByXXX)  {sumByXXX({names: name})}

		if (rowDivide) {division( {names: name})}
	}




	// FUNCTION: bindings
	//	Crea i binds degli elementi (campi) agli eventi
	// PARAMS:
	//	None
	// RETURN:
	//	None
	function bindings(params) {

		$('.input_number').keypress(function (e) {														// Funzione di filtro per accettare le sole cifre

			var isDigit = pBase.ValidatesChar(e, '0123456789.,-+', 1, 2);								// Attenzione: i valori 1 e 2 sono fittizi - Rivedere la funzione ValidatesChar per capire se servono e perché
			if (!isDigit) {
				e.preventDefault();
			}
		});
		
		$('.input_number').change(function () {
			
			__SYS_status.hasChanged = true;																// Aggiornamento STATUS globale: attiva il flag di valore modificato

			var value  = localeToNumber($(this).val());													// Valore del campo modificato
			var field  = $(this).attr('id');															// ID del campo
			var name   = $(this).attr('nref');															// Nome del dataset di appartenenza
			var totals = $('[data-name=' + name + ']').attr('data-total');								// Definizioni totali del dataset
			totals = (totals == null)? _defaultTotal : totals.toLowerCase();

			// Gestione classe "default"
			if (value <.1 && value > 0) {

				$(this).removeClass('hasChanged').addClass('isDefault');
				$($(this).prev()).removeClass('hasChanged').addClass('isDefault');
				$('[label=' + field +']').addClass('isDefault');

			} else {

				$(this).removeClass('isDefault');
				$('[label=' + field +']').removeClass('isDefault');

				// ** Patch: gestione modifiche
				if ($(this).hasClass('hasErr')) {

					$(this).removeClass('hasErr').addClass('hasChangedWithErr');
					$($(this).prev()).removeClass('hasErr').addClass('hasChangedWithErr');

				} else {

					$(this).addClass('hasChanged');
					$($(this).prev()).addClass('hasChanged');
				}
			}

			$(this).val(numberToLocale(value, _nDec));													// Formattazione del valore
			$('[mirror=' + field +']').val(parseInt(value * 1000));										// Aggiorna il campo di mirror

			// Ricalcola prima i totali (se definiti)
			if (totals.indexOf('cols') > -1) {sumByCols({names: name})}
			if (totals.indexOf('rows') > -1) {sumByRows({names: name})}
			if (totals.indexOf('ttot') > -1) {sumByGrid({names: name})}

			resolveDependencies({dsName: name});														// Risolve le dipendenze (formule collegate)
		});
	}


	//======| Sez. 2: Handlers |===================================================

	// FUNCTION: resolveDependencies
	//	Risolve le dipendenze di un dataset aggiornato
	// PARAMS:
	//	names : nome del dataset sorgente
	//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
	function resolveDependencies(params) {

		var dsName = params.dsName;																		// Nome del dataset modificato
		var dpList = deps.GetDependencies({dataset: dsName});

		for (t = 0; t < dpList.length; t++) {

			// Imposta i parametri di riferimento del dataset da processare
			var target   = dpList[t];																	// Nome del dataset	(matrice)
			var dsTarget = $('[data-name=' + target + ']');												// Oggetto dataset destinazione
			var fType    = dsTarget.attr('data-type');													// Tipo formula
			var totals   = dsTarget.attr('data-total');													// Tipo totali

			switch (fType) {

				case 'formula':

					solveFormula({target: target, source: dsName})
					break;

				case 'formulaComplex':
					solveFormulaComplex({target: target, source: dsName})
					break;
			}
		}
	}


	// FUNCTION: solveFormula
	//	Risoluzione formula semplice
	// PARAMS:
	//	names : nome del dataset da aggiornare
	// RETURN:
	//	none
	function solveFormula(params) {
		
		var cols     = _nColonne;												// Numero di colonne
		var target   = params.target;											// Nome del dataset da ricalcolare
		var dsTarget = $('[data-name=' + target + ']');							// Oggetto dataset destinazione
		var rows     = dsTarget.attr('data-rows');								// Numero di righe
		var years    = dsTarget.attr('data-years');								// Numero di colonne
		var formula  = dsTarget.attr('data-formula');							// Formla da risolvere
		var totals   = dsTarget.attr('data-total');								// Definizioni totali del dataset
		var sources  = [];														// Array dei dataset da processare

		rows   = (rows == null)? 1 : rows;
		totals = (totals == null)? _defaultTotal : totals.toLowerCase();


		// Patch per tabelle monocolonna
		if (years != undefined && years > 0 && years <= 5) {
			cols = years;
		}

		while (formula.indexOf('[') > -1) {										// Costruzione di sources

			var pos1 = formula.indexOf('[');									// Posiz. della prima occorrenza del marker '['
			var pos2 = formula.indexOf(']');									// Posizione chiusura marker
			var name = formula.substr(pos1 + 1, pos2 - pos1 - 1);				// Estrazione nome
			formula = formula.replace('[', '');									// Rimozione markers
			formula = formula.replace(']', '');
			sources.push(name);													// Aggiunge nome all'array dei dataset
		}

		// ** 2: Scansione della griglia **
		for (r = 1; r <= rows; r++) {
			for (c = 1; c <= cols; c++) {

				var noError = true;
				var cFormula = formula;
				for (n = 0; n < sources.length && noError; n++) {			// Scansiona tutti i dataset sorgenti se non ci sono errori

					var s = sources[n];										// Nome del dataset	(matrice)
					var v = localeToNumber($(range(s, r, c)).val())			// Aggiornamento totale calcolato
					err = checkValue(v);

					if (err.code != 0) {									// Errore! Marca la cella
						$(range(target, r, c)).attr('placeholder', err.text).val('');
						noError = false;
					} else {
						var re = new RegExp(s, 'g');						// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
						cFormula = cFormula.replace(re, v);
					}

				}
				if (noError) {												// Compilazione formula a buon fine: esegue il calcolo

					var f = eval(cFormula)
					err = checkValue(f);
					if (err.code != 0) {									// Errore! Marca la cella
						$(range(target, r, c)).attr('placeholder', err.text).val('');
					} else {												// Riporta il risultato nella cella del target ed elimina il placeholder (messaggio d'errore)
						$(range(target, r, c)).attr('placeholder', '').val(numberToLocale(f, _nDec));					// Aggiorna la cella del totale
					}
				}

			}
		}

		// Ricalcolo totale di colonna
		if (totals.indexOf('cols') > -1) {
			sumByCols({names: target})
		}
		if (totals.indexOf('rows') > -1) {
			sumByRows({names: target})
		}
		if (totals.indexOf('ttot') > -1) {
			sumByGrid({names: target})
		}
	}



	// FUNCTION: solveFormulaComplex
	//	Risoluzione formula complessa
	// PARAMS:
	//	names : nome del dataset da aggiornare
	// RETURN:
	//	none
	function solveFormulaComplex(params) {

		var cols     = _nColonne;												// Numero di colonne
		var target   = params.target;											// Nome del dataset da ricalcolare
		var dsTarget = $('[data-name=' + target + ']');							// Oggetto dataset destinazione
		var rows     = dsTarget.attr('data-rows');								// Numero di righe
		var formula  = dsTarget.attr('data-formula');							// Formla da risolvere
		var totals   = dsTarget.attr('data-total');								// Definizioni totali del dataset
			totals   = (totals == null)? _defaultTotal : totals.toLowerCase();
		var sources  = [];														// Array dei dataset da processare

		rows = (rows == null)? 1 : rows;

		while (formula.indexOf('[') > -1) {										// Costruzione di sources

			var pos1 = formula.indexOf('[');									// Posiz. della prima occorrenza del marker '['
			var pos2 = formula.indexOf(']');									// Posizione chiusura marker
			var name = formula.substr(pos1 + 1, pos2 - pos1 - 1);				// Estrazione nome
			formula  = formula.replace('[', '');								// Rimozione markers
			formula  = formula.replace(']', '');
			sources.push(name);													// Aggiunge nome all'array dei dataset
		}

		// ** 1: Seleziona la formula complessa da risolvere **
		var formulaId = formula.substr(0, formula.indexOf('('));
		var cxFormula = deps.GetFormulaComplex({name: formulaId});				// seleziona la formula complessa

		// ** 2: Scansione della griglia **
		for (r = 1; r <= rows; r++) {
			for (c = 1; c <= cols; c++) {

				// ** Sostituzione dei riferimenti nella formula complessa **
				var noError = true;
				var cFormula = cxFormula[c - 1];								// Elemento della formula complessa

				// Step 1: risolve il nr. di riga
				var re = new RegExp('rX', 'g');
				cFormula = cFormula.replace(re, 'r' + r);

				// Step 2: risolve i nomi dei dataset
				for (n = 1; n <= sources.length && noError; n++) {				// Scansione dei dataset sorgenti

					// Step 2.a: risolve i nomi del dataset nella formula
					var s  = sources[n - 1];									// Nome del dataset	(matrice)
					var re = new RegExp('DS' + n, 'g');							// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
					cFormula = cFormula.replace(re, s);

					// Step 2.b: risolve i riferimenti NRC col valore corrispondente
					for (c_bis = 1; c_bis <= cols; c_bis++) {					// Ancora deve ciclare su tutte le colonne
					
						var v = localeToNumber($(range(s, r, c_bis)).val());	// Valore della cella
						err = checkValue(v);

						if (err.code != 0) {									// Errore! Marca la cella
							$(range(target, r, c)).attr('placeholder', err.text).val('');
							noError = false;
						} else {
							var re = new RegExp(s + '_r' + r + '_c' + c_bis, 'g');	// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
							cFormula = cFormula.replace(re, v);
						}
					}
				}
				if (noError) {													// Compilazione formula a buon fine: esegue il calcolo
					var f = eval(cFormula);
					err = checkValue(f);
					if (err.code != 0) {										// Errore! Marca la cella
		
						$(range(target, r, c)).attr('placeholder', err.text).val('');

					} else {													// Riporta il risultato nella cella del target ed elimina il placeholder (messaggio d'errore)

						$(range(target, r, c)).attr('placeholder', '').val(numberToLocale(f, _nDec));

					}
				}

			}
		}

	}

	// ***
	// *** ---| FORMULE PER CAMPI CALCOLATI DI RIGA, COLONNA, ECC. |----------------------------------------------------------------------------------
	// ***

	// FUNCTION: division
	//	Calcola il rapporto tra due valori
	// PARAMS:
	//	names : nomi dei dataset
	function division(params) {

		var target   = params.names;
		var dsTarget = $('[data-name=' + target + ']');							// Oggetto dataset destinazione
		var formula  = dsTarget.attr('data-calc');							// Formla da risolvere

		var sources  = [];														// Array dei dataset da processare

		//rows = (rows == null)? 1 : rows;

		while (formula.indexOf('[') > -1) {										// Costruzione di sources

			var pos1 = formula.indexOf('[');									// Posiz. della prima occorrenza del marker '['
			var pos2 = formula.indexOf(']');									// Posizione chiusura marker
			var name = formula.substr(pos1 + 1, pos2 - pos1 - 1);				// Estrazione nome
			formula  = formula.replace('[', '');								// Rimozione markers
			formula  = formula.replace(']', '');
			sources.push(name);													// Aggiunge nome all'array dei dataset
		}

		r=1; c=1;

				var noError = true;
				var cFormula = formula;
				for (n = 0; n < sources.length && noError; n++) {			// Scansiona tutti i dataset sorgenti se non ci sono errori

					var s = sources[n];										// Nome del dataset	(matrice)
					//var v = localeToNumber($(range(s, r, c)).val())			// Aggiornamento totale calcolato
					var v = localeToNumber($('[nref=' + s + ']').val())			// Aggiornamento totale calcolato
					err = checkValue(v);

					if (err.code != 0) {									// Errore! Marca la cella
						$(range(target, r, c)).attr('placeholder', err.text).val('');
						noError = false;
					} else {
						var re = new RegExp(s, 'g');						// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
						cFormula = cFormula.replace(re, v);
					}

				}
				if (noError) {													// Compilazione formula a buon fine: esegue il calcolo
					var f = eval(cFormula);
					err = checkValue(f);
					if (err.code != 0) {										// Errore! Marca la cella
		
					//	$(range(target, r, c)).attr('placeholder', err.text).val('');
						$('#rTot_' + target + '_r' + r).attr('placeholder', err.text).val('');	// Aggiorna la cella del totale

					} else {													// Riporta il risultato nella cella del target ed elimina il placeholder (messaggio d'errore)

					//	$(range(target, r, c)).attr('placeholder', '').val(numberToLocale(f, _nDec));
						$('#rTot_' + target + '_r' + r).val(numberToLocale(f, _nDec));	// Aggiorna la cella del totale

					}
				}

	}







	// FUNCTION: sumByCols
	//	Aggiorna i totali di colonna di una dataset
	// PARAMS:
	//	names : nomi dei dataset
	//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
	function sumByCols(params) {

		var datasetNames = splitNames(((params != null) ? params.names : OWNER));	// Crea l'array dei dataset da processare

		for (n = 0; n < datasetNames.length; n++) {

			// Imposta i parametri di riferimento del dataset da processare
			var name = datasetNames[n];											// Nome del dataset	(matrice)
			var rows = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
			var cols = _nColonne;												// Numero di colonne

			// Processa il dataset per colonne
			for (c = 1; c <= cols; c++) {

				var cTot = 0;													// Reset del totale di colonna
				$(range(name, '', c)).each(function () {						// Seleziona e processa il subset (notazione NRC)
					cTot += localeToNumber($(this).val());						// Aggiornamento totale calcolato
				});
				$('#cTot_' + name + '_c' + c).val(numberToLocale(cTot, _nDec));	// Aggiorna la cella del totale

			}
		}
	}


	// FUNCTION: sumByRows
	//	Aggiorna i totali di riga di una dataset
	// PARAMS:
	//	params.names : nomi dei dataset
	//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
	function sumByRows(params) {

		var datasetNames = splitNames(((params != null) ? params.names : OWNER));	// Crea l'array dei dataset da processare

		for (n = 0; n < datasetNames.length; n++) {

			// Imposta i parametri di riferimento del dataset da processare
			var name = datasetNames[n];											// Nome del dataset	(matrice)
			var rows = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
			var cols = _nColonne;												// Numero di colonne

			rows = (rows == undefined)? 1 : rows;								// Normalizza il nr. di righe (default: 1)

			// Processa il dataset per righe
			for (r = 1; r <= rows; r++) {

				var rTot = 0;													// Reset del totale di riga
				$(range(name, r, '')).each(function () {						// Seleziona e processa il subset (notazione NRC)
					rTot += localeToNumber($(this).val());						// Aggiornamento totale calcolato
				});
				$('#rTot_' + name + '_r' + r).val(numberToLocale(rTot, _nDec));	// Aggiorna la cella del totale

			}
		}
	}

	// FUNCTION: sumByGrid
	//	Aggiorna i totale generale di una dataset
	// PARAMS:
	//	params.names : nomi dei dataset
	//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
	function sumByGrid(params) {

		var datasetNames = splitNames(((params != null) ? params.names : OWNER));	// Crea l'array dei dataset da processare

		for (n = 0; n < datasetNames.length; n++) {

			// Imposta i parametri di riferimento del dataset da processare
			var name = datasetNames[n];											// Nome del dataset	(matrice)
			var rows = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
			var cols = _nColonne;												// Numero di colonne
			var gTot = 0;														// Reset del totale di griglia

			// Processa tutto il dataset
			for (r = 1; r <= rows; r++) {
				for (c = 1; c <= cols; c++) {
					gTot += localeToNumber($(range(name, r, c)).val());			// Aggiornamento totale calcolato
				}
			}
			$('#gTot_' + name).val(numberToLocale(gTot, _nDec));				// Aggiorna la cella del totale

		}
	}


	// FUNCTION: sumByGrid
	//	Aggiorna i totale generale di una dataset
	// PARAMS:
	//	params.names : nomi dei dataset
	//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
	function sumByXXX(params) {

		var datasetNames = splitNames(((params != null) ? params.names : OWNER));	// Crea l'array dei dataset da processare

		for (n = 0; n < datasetNames.length; n++) {
	
			// Imposta i parametri di riferimento del dataset da processare
			var name = datasetNames[n];											// Nome del dataset	(matrice)
			var r = 1;

	//		var rows = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
	//		var cols = _nColonne;												// Numero di colonne
	//		var gTot = 0;														// Reset del totale di griglia
	//
	//		// Processa tutto il dataset
	//		for (r = 1; r <= rows; r++) {
	//			for (c = 1; c <= cols; c++) {
	//				gTot += localeToNumber($(range(name, r, c)).val());			// Aggiornamento totale calcolato
	//			}
	//		}
	//		$('#gTot_' + name).val(numberToLocale(gTot, _nDec));				// Aggiorna la cella del totale
	//
			$('#rTot_' + name + '_r' + r).val('xxx');				// Aggiorna la cella del totale
		}

	}


	//======| Sez. 3: Tools |======================================================

	// FUNCTION: range
	//	Definisce il range di un dataset sul quale operare
	// PARAMS: (Nota: i parametri non sono in formato JSON, ma si usa la notazione NRC per ottimizzare l'uso della funzione negli script)
	//	name : nome del dataset
	//	row  : riga di riferimento
	//	col  : colonna di riferimento
	// RETURN:
	//  subset : il range selezionato del dataset specificato
	function range(name, row, col) {

		var set = '';

		if (name == undefined) {
			console.log('Error - RANGE: dataset non specificato');
			return;
		} else {

			set = '[nRef=' + name + ']';										// 1: definisce il dataset (N)
			if (row != undefined && row != '' && !isNaN(row)) {
				set += '[rRef=' + parseInt(row) + ']';							// 2: selezione della riga (R)
			}
			if (col != undefined && col != '' && !isNaN(col)) {
				set += '[cRef=' + parseInt(col) + ']';							// 3: selezione della colonna (C)
			}

			return set;															// Resituisce il range selezionato
		}
	}


	// FUNCTION: splitNames
	//	Normalizza la stringa dei nomi dei dataset e la trasforma in array
	// PARAMS:
	//	namestring : stringa dei nomi dei dataset
	// RETURN:
	//	myArray : stringa normalizzata trasformata in array
	function splitNames(namestring) {

		try {
			var myArray = namestring.trim().replace(/\s\s+/g, ' ').split(' ');		// Elimina i blank superflui e splitta su " "		
			return myArray;
		}

		catch (err) {
			myArray = ['none'];
			return myArray;
		}
	}


	// FUNCTION: formatNumber
	//	Restituisce il valore formattato con un nr. di decimali fisso
	// PARAMS:
	//	val  : valore numerico da formattare
	//	nDec : numero di cifre decimali
	// RETURN:
	//	None
	function formatNumber(val, nDec) {

		// Lettura parametri
		var nDec   = (isNaN(nDec)) ? _nDec : nDec;									// Imposta il nr. di decimali (default: 2)
		var decPow = Math.pow(10, nDec);										// Moltiplicatore (10 ^ nDec)
		var frmVal = (Math.round(val * decPow) / decPow).toFixed(nDec);			// Formattazione del valore

		return frmVal;

	}


	// FUNCTION: numberToLocale
	//	Restituisce il valore numerico come stringa formattata secondo Locale
	// PARAMS:
	//	val  : valore numerico da formattare
	//	nDec : numero di cifre decimali
	// RETURN:
	//	Stringa formattata
	function numberToLocale(val, nDec) {
	
		var nDec  = (isNaN(nDec)) ? _nDec : nDec;														// Imposta il nr. di decimali (default: 2)
		var raw;																						// Valore "grezzo" della conversione

		raw = val.toLocaleString(undefined, {maximumFractionDigits: nDec, minimumFractionDigits: nDec});

		return raw;
	}


	// FUNCTION: localeToNumber
	//	Converte la stringa formattata in valore numerico
	// PARAMS:
	//	val  : stringa numerica da riconvertire
	// RETURN:
	//	Valore numerico
	function localeToNumber(val) {

	//	if (val.indexOf(',') > -1) {
			val = val.replace(/\./g, "");
			val = val.replace(',', ".");
	//	}

		//return (isNaN(parseFloat(val))) ? 0 : parseFloat(val).toFixed(2);								// Restituisce il valore numerico
		return (isNaN(parseFloat(val))) ? 0 : parseFloat(val);											// Restituisce il valore numerico
	}


	// FUNCTION: checkValue
	//	Esegue il check di validità del valore specificato
	// PARAMS:
	//	val  : valore numerico da formattare
	// RETURN:
	//	Codice d'errore e relativo messaggio
	function checkValue(val) {

		var response = { code: 0, text: '' }
		var v = parseFloat(eval(val));
		if (isNaN(v)) { v = 'forced to NaN' }


		switch (v) {
			case 'forced to NaN':
				response.code = 2;
				//response.text = '#NaN!';
				response.text = 'n.d.';
				break;
			case Infinity:
				response.code = 3;
				response.text = '#DIV/0!';
				break;
			case undefined:
				response.code = 4;
				response.text = '#Name!';
				break;

			default:

		}

		return response;
	}


	//======| Sez. 4: Save data |==================================================

	// FUNCTION: buildsXML
	//	Costruzione l'XML specifico (secondo la tipologia di dataset) per il salvataggio dati
	// PARAMS:
	//	val  : valore numerico da formattare
	// RETURN:
	//	Codice d'errore e relativo messaggio
	function buildsXML(params) {

		var name = params.name;
		var txt  = '';
		var XML  = '';

		// ===
		// Deve separare in due parti perché AnnoPrec richiede un XML totalmente fuori standard
		// ==

		if (name == 'annoPrecInsert') {

			// ==== PROCEDURA AD HOC ======
			// Costruzione XML base
			txt+= "<?xml version='1.0' encoding='utf-8' ?>";
			txt+= "<Request ID='" + mBase.RequestID() + "'>";
			txt+= '<General>';
			txt+= '<Token>' + __WACookie.Token + '</Token>';
			txt+= '</General>';
			txt+= '<Data>';
			txt+= '<Anni>';
			for (var a = 1; a <= _nColonne; a++) {															// Costruzione dei nodi "Anno"
				txt += "<Anno ID='" + a + "'></Anno>";
			}
			txt+= '</Anni>';
			txt+= '</Data>';
			txt+= '</Request>';
			XML = $.parseXML(txt);

			// Aggiunta campi Singoli
			$('[data-method=3] .mirror').each(function(){

				var key   = $(this).attr('key');
				var val   = $(this).val();
				var padre = $(this).attr('parent');
				
				// Costruzione del nodo da aggiungere
				if ( $(XML).find(padre).length == 0) {
					$(XML).find('Data').append('<'+padre+'></'+padre+'>');			// Costruzione del nodo padre 
				}
				var node  = '<' + key + '>' + val + '</' + key + '>';

				// Aggiunge il nodo
				$(XML).find(padre).append(node);

			});

			// Aggiunta campi Immobilizzazioni & finanziamenti
			$('[data-method=31] .mirror').each(function(){

				var key   = $(this).attr('key');
				var val   = $(this).val();
				var padre = $(this).attr('parent');
				var anno  = $(this).attr('anno');
				var field = $(this).attr('mirror');
				field = field.substr(0, field.length - 6);

				// Costruzione del nodo da aggiungere
				if ( $(XML).find(padre).length == 0) {
					$(XML).find('Data').append('<'+padre+'></'+padre+'>');			// Costruzione del nodo padre 
				}

				var child = key + '[ID=' + anno + ']';
				var parent = padre + '>' + child;
				if ( $(XML).find(parent).length == 0) {
					$(XML).find(padre).append('<'+key +' ID="' + anno + '"></'+key+'>');			// Costruzione del nodo padre 
				}
				var node  = '<' + field + '>' + val + '</' + field + '>';

				// Aggiunge il nodo
				$(XML).find(parent).append(node);
			});

			// Aggiunta campi legati agli anni
			$('[data-method=21] .mirror').each(function(){

				var key   = $(this).attr('key');
				var val   = $(this).val();
				var prod  = $(this).attr('prod');
				var anno  = $(this).attr('anno');
				var padre = $(this).attr('parent');

				// Costruzione del nodo da aggiungere
				var node = '<' + key + '>' + val + '</' + key + '>';

				// Costruzione del nome nodo padre (Fatto da schifo...)
				var parent = 'Anno[ID=' + anno + ']';
				if (prod != undefined) {
					parent += '>' + prod;
				}
				if (padre != undefined) {
					if ( $(XML).find(parent+'>' + padre).length == 0) {
						$(XML).find(parent).append('<'+padre+'></'+padre+'>');
					}
					parent += '>' + padre;
				}

				// Aggiunge il nodo
				$(XML).find(parent).append(node);

			});


		} else {

			// ==== PROCEDURA STANDARD ====

			// Costruzione XML base
			txt+= "<?xml version='1.0' encoding='utf-8' ?>";
			txt+= "<Request ID='" + mBase.RequestID() + "'>";
			txt+= '<General>';
			txt+= '<Token>' + __WACookie.Token + '</Token>';
			txt+= '</General>';
			txt+= '<Data>';
			txt+= '<Anni>';
			for (var a = 1; a <= _nColonne; a++) {															// Costruzione dei nodi "Anno"
				txt += "<Anno ID='" + a + "'>";
				if (name == 'ricavi' || name == 'costiEsterni') {
					txt += '<P1></P1><P2></P2><P3></P3><P4></P4><P5></P5>';									// Nodi "prodotto"
				}
				if (name == 'costiEsterni') {
					txt += '<MP01></MP01><MP02></MP02><MP03></MP03><MP04></MP04><MP05></MP05>';
					txt += '<MP06></MP06><MP07></MP07><MP08></MP08><MP09></MP09><MP10></MP10>';
				}
				txt += '</Anno>';
			}
			txt+= '</Anni>';
			txt+= '</Data>';
			txt+= '</Request>';
			XML = $.parseXML(txt);

			// Scansione e accodamento dei campi
			$('.mirror').each(function(){

				var key   = $(this).attr('key');
				var val   = $(this).val();
				var prod  = $(this).attr('prod');
				var anno  = $(this).attr('anno');
				var padre = $(this).attr('parent');

				// Costruzione del nodo da aggiungere
				var node = '<' + key + '>' + val + '</' + key + '>';

				// Costruzione del nome nodo padre (Fatto da schifo...)
				var parent = 'Anno[ID=' + anno + ']';
				if (prod != undefined) {
					parent += '>' + prod;
				}
				if (padre != undefined) {
					if ( $(XML).find(parent+'>' + padre).length == 0) {
						$(XML).find(parent).append('<'+padre+'></'+padre+'>');
					}
					parent += '>' + padre;
				}

				// Aggiunge il nodo
				$(XML).find(parent).append(node);

			});


		}


		// ==== RITORNA INSIEME:

		// Riconverte il documento XML in stringa per il passaggio dati al SAAS
		//console.log(XML);
		var serializer = new XMLSerializer();
		var XML_string = serializer.serializeToString(XML)						// Conversione da XML a stringa

		var re = new RegExp(/\"/, 'g');
		XML_string = XML_string.replace(re, "'");								// Deve sostituire " con ', altrimenti genera errore al momento del Save perché non interpreta correttamente la stringa

		return XML_string;

	}

});