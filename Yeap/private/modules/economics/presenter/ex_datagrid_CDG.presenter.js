//----------------------------------------------------------------------------------------
// File: datagrid_CDG.presenter.js
//
// Desc: Gestione del datagrid delle pagine "Controllo di Gestione (CDG)"
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
//	var _defaultTotal = 'ncrow';												// Tipo totale di default
//	var _nColonne; 
	var _meseInit;
	var _meseStop;
	var _econXML;
	var _umOver=null;																// Gestione Unità misura alternativa


	var _enableLabel = !true;													// Flag per abilitare funzione sperimentale: etichetta valore formatato in overlay per i campi input

	return {
		Init        : init,														// Initializes (setup) the datagrid

		FormatNumber   : formatNumber,
		NumberToLocale : numberToLocale,
		BuildsXML      : buildsXML,
		RicalcolaVP    : ricalcolaValoriPesati,
		DatiScostamento: inserisciDatiScostamento,
	}


	// FUNCTION: init
	//  Inizializza gli elementi del datagrid
	// PARAMS:
	//  ...
	// RETURN:
	//  none
	function init(params) {

		_container = params.container;
		_meseInit  = params.meseInit;											// Nr. primo mese nella tabella
		_meseStop  = params.meseStop;											// Nr. ultimo mese nella tabella
		_xml       = params.xmlDocument;
		_xml2      = params.xml_bis;
		_econXML   = __Preloads.economics;										// Lettura del file "economics.xml" precaricato nel presenter
        context = (params.context != null) ? '#' + params.context + ' ' : '';
	
		$('#preloader').attr('style', 'display:block');							// Shows the "preloader" layer

		// Definizione delle dipendenze
		deps.Init();

				
		// ** Risoluzione dell'oggetto complesso "scrollTable" **
	//	$(context + '[scrolltable]').each(function (){
		$(context + '[scrolltable], ' + context + '[rawtable]').each(function (){
			buildScrollTable({ 
				obj: $(this),
				xml: _xml,
			});
		});




		// 3 - Bindings (eventi dei campi):
		bindings();

		$('#preloader').attr('style', 'display:none');							// Hides the "preloader" layer

		return;
	}



	//======| Sez. 1: Costruttori |================================================

	// FUNCTION: buildScrollTable
	//	Costruisce l'intestazione della tabella dei valori mensili
	// PARAMS:
	//	obj : Dimensione del raggruppamento dei mesi per i totali parziali
	// RETURN:
	//	None
	function buildScrollTable(params) {

		var html     = '';
		var mesi     = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
		var trimestri =['Primo trimestre', 'Secondo trimestre', 'Terzo trimestre', 'Quarto trimestre'];
		var $dsObj   = params.obj;
		var xml      = params.xml;

		var objID    = $dsObj.attr('id');																// L'intero oggetto DOM da processare
		var nrMesi   = $dsObj.attr('groupSize');														// Nr. di mesi del sottogruppo da misurare (normalmente trimestre)
		var dValue   = $dsObj.attr('default');															// Valore di default (nel caso di campi vuoti)
		var qcFactor = $dsObj.attr('qcFactor');															// Fattore di correzione trimestrale (quarterly correction factor)
		var dsRows   = $dsObj.find('[dsTablerow]');														// Dataset delle righe (dataset da XML) da processare
		var colInit  = $dsObj.attr('init');
		var colStop  = $dsObj.attr('stop');
		var type     = $dsObj.attr('type');
		var nrRows   = dsRows.length;																	// Nr. di elementi (righe) del dataset
		var gLabel   = 'Q';																				// Etichetta dei totali periodici
		var gruppo   = parseInt(colInit / nrMesi) + 1;													// Identificatore di gruppo per la gestione dei subtotali
	
		var colspan;
		var mostraTotali;
		var tableType = ' scroll';		
        var umOver = (($dsObj.attr('umOver') != null) && ($dsObj.attr('umOver').length > 0)) ? $dsObj.attr('umover') : _umOver;

		switch (type) {
			case "double":
				colspan = 2;
				mostraTotali = false;
				tableType += ' double';
				break;
			case 'raw':
				colspan = 1; //***************** da gestire col data-type	=> forse conviene separare del tutto tabekka header e tabella dati, con un altro widget
				mostraTotali = false;
				tableType = ' raw';
				break;
			case 'scenario':
				//colspan = 1; //***************** da gestire col data-type	=> forse conviene separare del tutto tabekka header e tabella dati, con un altro widget
				//mostraTotali = true;
				tableType = ' scroll scenario';
				//break;
			default:
				colspan = 1; //***************** da gestire col data-type	=> forse conviene separare del tutto tabekka header e tabella dati, con un altro widget
				mostraTotali = true;
				break;
		}

		// ** Step 1: costruzione dell'intestazione tabella **
		html += '<div class="tableWrapper' + tableType + '">';											// Container della tabella scorrevole
		html += '<table id="' + objID +'"class="timesheet_table">';										// Tabella scorrevole (prende l'ID del suo placeholder)
		html += '<thead><tr>';																			// Definizione header tabella
		html +=   '<th class="voci">Voci</th>';

		// PATCH: gestione mesi da rappresentare
		for (var col = colInit; col <= colStop; col++) {												// Costruzione delle colonne mensili coi raggruppamenti

			html += '<th class="" periodo="' + gruppo + '" colspan="' + colspan + '">';
			html +=   '<span class="rowLabelTitle">' + mesi[col - 1] + '</span>';
			html += '</th>';

			if (mostraTotali) {
				if ((col % nrMesi) == 0 || col == colStop) {												// Determina se inserire i totali di periodo
					html += '<th class="tot_1">'
					html +=   '<span class="rowLabelTitle">';												// Titolo periodo
					html +=     gLabel + gruppo;
					html +=   '</span>';
					html += '</th>'; 

					if (gruppo > 1) {																		// Solo se non è il primo periodo, inserisce le somme parziali
						html += '<th class="tot_2">';
						html +=   '<span class="rowLabelTitle">';											// Titolo parziale cumulato
						html +=     gLabel + '1..' + gLabel + gruppo;
						html +=   '</span>';
						html += '</th>'; 
					}
					gruppo++;																				// Incrementa l'identificatore di gruppo
				}
			}
		}

		// PATCH!!!!!  per "double" deve mettere una riga in più: per ora tutta a mano
		var secondariga = '';

		switch (type) {
			case 'input':
			case 'formula':
				html +=  '<th class="totale"><span class="rowLabelTitle">Totale</span></th>';
				break;

			case "double":
				html +=  '<th class="totale" colspan="4"><span class="rowLabelTitle">Totale ' + trimestri[gruppo - 1] + '</span></th>';
				html +=  '<th></th>';
				secondariga += '</tr><tr>';
				secondariga += '<th></th>';
				for (ii = 1; ii <= 3; ii++){
					secondariga += '<th><span class="rowLabelTitle">Budget</span></th>';
					secondariga += '<th><span class="rowLabelTitle">Consunt.</span></th>';
				}
				secondariga += '<th><span class="rowLabelTitle">Budget</span></th>';
				secondariga += '<th><span class="rowLabelTitle">Consunt.</span></th>';
				secondariga += '<th><span class="rowLabelTitle">Differenza</span></th>';
				secondariga += '<th><span class="rowLabelTitle">Differenza %</span></th>';

				secondariga += '<th></th>';
				break;

			case "scenario":
				html += '<th class="scenario">';
				html +=	  '<span class="rowLabelTitle fix scenarioTit1">Budget</span> ';
				html +=	  '<span class="rowLabelTitle fix scenarioTit2">Differenza</span> ';
				html +=	  '<span class="rowLabelTitle fix scenarioTit3">Diff. %</span>';
				html += '</th>';
				break;


			default:
				html += '<th></th>';
			}



		html += secondariga;
		html += '</tr></thead>';																		// Chiusura header tabella





	//	// ** Sperimentale ** => Funziona quasi, ma va wrappato diversamente => 
	//		=>	UN container per HEAD e UNO per TBODY => 
	//		=>	Va spaccato lo script in due function indipendenti

	//	html += '</table>';
	//	html += '</div>';																				// Chiusura container della tabella scorrevole
	//	html += '<div class="tableWrapper scroll">';													// Container della tabella scorrevole
	//	html += '<table id="' + objID +'"class="timesheet_table">';										// Tabella scorrevole (prende l'ID del suo placeholder)

		// ** Step 2: costruzione del corpo tabella **
		html += '<tbody>';
		for (var row = 0; row < nrRows; row++){
			html += buildTableRow({
				dataset : dsRows[row],
				nrMesi  : nrMesi,
				dValue  : dValue,
				qcFactor: qcFactor,
				xml     : xml,
                rowNr: row,
                umover: umOver, 
			});
		}
		html += '</tbody>';


		// ** Step 3: chiusura tabella **

		html += '</table>';																				// Chiusura tabella scorrevole
		html += '</div>';																				// Chiusura container della tabella scorrevole

		$('#' + objID).replaceWith(html);

	}



	// FUNCTION: buildTableRow
	//	Costruisce la riga (dataset) della tabella dei valori mensili
	// PARAMS:
	//	obj : Dimensione del raggruppamento dei mesi per i totali parziali
	// RETURN:
	//	None
	function buildTableRow(params) {

		// Definizione variabili
		var html      = '';
//		var id        = '';																				// Usato nella composizione ID degli elementi della griglia
		var ds        = params.dataset;
		var nrMesi    = params.nrMesi;
		var dValue    = eval(params.dValue);															// Valore di default per i campi vuoti
		var qcFactor  = (params.qcFactor != null)? eval(params.qcFactor) * 1000 : 0;					// Fattore di correzione trimestrale dovuto agli arrotondamenti nella divisione mensile (es. 100/12 = 8.33333... ma 8.33 *12 = 99.96 => ad ogni terzo mese sommo 0.01 => torno a 100)
		var xml       = params.xml;
		var rowNr     = params.rowNr;

		var data      = $(ds).data();																	// Lettura dei parametri del dataset (attributi "data-")
		var name      = data.name;																		// Nome del dataset
		var type      = data.type;																		// Tipo dei campi
//		var prefill   = data.prefill;																	// Eventuale valore di "prefill" dei campi (es.: per tabelle ex-input nascoste, che devono essere forzate a un valore ma non sono editabili)
		var rows      = data.rows;																		// Numero di righe
		var colInit   = data.init;																		// Numero di righe
		var colStop   = data.stop;																		// Numero di righe
		var sufx      = (data.sufx != null)? data.sufx : '';											// Suffisso per l'ID
		var mBreak    = (data.break != null)? data.break : '';											// Suffisso per l'ID
		var expected  = (data.expected != null)? eval(data.expected) : 0;								// Valore atteso come totale di riga
		var amount    = data.amount;
		
//mBreak=4;

		var initValue = (dValue != null)? dValue * 1000 : 0;											// Valore di default per campi non assegnati
		var readonly  = (type != 'input') ? true : false;												// Flag di sola lettura dei campi

		var mostraTotali;
        var scostamenti;

        var umover = params.umover;

		// parametri che dipendono dal tipo (o da pageID?) // va riorganizzato tutto
		switch (type) {
			case 'input':
			case 'formula':
			case 'scenario':
			case 'empty':
				mostraTotali = true;
				scostamenti  = false;
				break;

			case 'raw':
			case 'double':
				mostraTotali = false;
				scostamenti  = true;
				break;


			default:

		}


		for (r = 1; r <= rows; r++) {

		//	var gruppo  = 1;																			// Identificatore di gruppo per la gestione dei subtotali
			var gruppo  = parseInt(colInit / nrMesi) + 1;													// Identificatore di gruppo per la gestione dei subtotali
			var totParz = 0;																			// Totale parziale di gruppo
			var totPeriodi = 0;


			// 1: Costruzione dell'ID di riga e lettura dei parametri specifci (da "economics.xml")
			var rowId = name + '_' + r;
			var xmlNode = pBase.GetXmlNode({
				xmlRaw : _econXML.RawData,
				element: '[codiceUI=' + rowId + ']',
			});
            var unMis = ($(xmlNode).attr('um') == null) ? '&nbsp;' : ((umover == null) ? $(xmlNode).attr('um') : umover);


			// 2: Costruzione dei campi della riga
			for (var col = colInit; col <= colStop; col++)	{											// Costruzione delle colonne mensili coi raggruppamenti

				// Trova il nodo richiesto nel documento XML
				var Node;
				var Value;
				var errID;
				var $_InitValue = initValue + (((col % 3) == 0)? qcFactor: 0);							// Fattore di correzione trimestrale per compensare gli arrotondamenti della ripartizione mensile


				// **
				// ** Lettura dati da XML **
				// **
				Node    = $(xml).find('Mese[ID=' + col + ']');
				if (type != 'empty') {
					Value = parseInt($(Node).find(name).text());										// Legge il valore da XML
				}


				// ** da ridefinire: 'H' è hidden come classe, ma per il tipo "raw" la riga resta visibile
				// e il valore diventa 'n.d.' (sono i pesi "calcolati": non hanno senso, ma devo avere la riga disponibile)
				var isHide;
				var handled = $(Node).find(name).attr('Tipo');										// Stato visualizzazione del campo
				if (handled == 'R') { readonly = true}					//§§§§§§§§§§§§§
				if (handled == 'H') { 
					if (type != 'raw') {
						isHide = 'hide';
					} else {
						isHide = '';
						Value = 'n.d.';
					}
				}

				if (col == colInit) {																	// Se è la primna colonna, crea il tag "<tr>"
					// Crea riga e calle "etichette"
				//	html += '<tr ref="' + name + '" class="' + isHide + '" rownr="' + rowNr + '">';
					html += '<tr ref="' + name + '" class="' + isHide + '">';
					html += '<td class="voce">';
					html +=   '<snp_XML_label_economics data-pars="value:=\'' + rowId + '\'" class="" />';
					html += '</td>';
				}



				var Empty  = ((Value - parseInt(Value / 10) * 10) != 0)? true : false;					// Flag di campo vuoto
				var Class  = 'form-control economics ';
				var hasErr = '';
				if (errID == 1 || errID == 2) {															// 1 : campo vuoto, 2 : campo errato
					hasErr = (__WACookie.showErr)? ' hasErr ' : ' hasHiddenErr '; 
				}			
				if (errID == 3) {																		// 3: warning
					hasErr = (__WACookie.showErr)? ' hasWarning ' : ' hasHiddenWarning ';
				}

				
				if ((Empty && !readonly) || isNaN(Value)) {
					var trueVal = $_InitValue;
					if (!readonly) {
						__SYS_status.hasChanged = true;													// Solo se il campo non è readonly
					}
				} else {
					var trueVal = Value;
				}
				var fieldPars = ({
					value: trueVal,
					unMis: unMis,
					name : name,
					Class: hasErr,
					rRef : r,
					cRef : col,
					group: gruppo,
					errID: errID,
					sufx : sufx,
					break: (col <= mBreak)? ' consuntivo' : ' forecast',
				});

				// ** Disegna il campo richiesto
				switch (true) {

					case (type == 'input'):
						html += fieldType_std({ fieldPars });
						break;

					case (type == 'double'):
						html += fieldType_double({ fieldPars });
						break;

					case (type == 'scenario'):
						html += fieldType_scenario({ fieldPars });
						break;

					case (type == 'raw'):
						html += '<td>';
						html += (isNaN(Value))? '--' : numberToLocale(Value / 1000, _nDec);
						html += '</td>';
						break;

					case (readonly):
					case (type == 'formula'):
						html += fieldType_readonly({ fieldPars });
						break;
				}

				totParz += trueVal;																		// Aggiorna il totale parziale

				if (mostraTotali) {

					// PATCH: anche i totali vanno fatti come sopra (funzione a parte)
					// Per ora gestisco la classe extra, poi vanno subordinati meglio alle tipologie

					var cxx = '';
					var inputType  = 'number';	// PATCH!! §§ Coi scenari Non funziona la formattazione come nelle altre pagine => capire perché: ora non c'è tempo
					var isScenario = false;		// PATCH!! §§
					if (type == 'scenario') {
						cxx = (col <= mBreak)? ' consuntivo' : ' forecast';
						inputType  = 'text';	// PATCH!! §§
						isScenario = true;		// PATCH!! §§
					}

					if ((col % nrMesi) == 0 || col == colStop) {										// Determina se inserire i totali di periodo
						html += '<td class="quarter">';
						html += '<span class="um calc_number2' + cxx + '">' + unMis + '</span>';
					//	html += '<input type="number" readonly tabindex="-1" ';
						html += '<input type="' + inputType + '" readonly tabindex="-1" ';				// PATCH!! §§
						html += ' class="form-control economics calc_number2 parziale' + cxx + '" ';
						html += ' id="' + name + '_Q' + gruppo + sufx + '" ';
						html += ' periodo="' + gruppo + '" ';
						if (isScenario) {																// PATCH!! §§
							html += ' value="' + numberToLocale((totParz / 1000), _nDec) + '" ';		// PATCH!! §§
						} else {
							html += ' value="' + formatNumber((totParz / 1000), _nDec) + '" ';			// La formula regolare
						}																				
						html += '>';
						html += '</td>';

						totPeriodi += totParz															// Aggiorna il progressivo dei totali parziali
						totParz    = 0;																	// Resetta il totale parziale

						if (gruppo > 1) {																// Solo se non è il primo periodo, inserisce le somme parziali
							html += '<td class="cumulato">';
							html += '<span class="um total' + cxx + '">' + unMis + '</span>';
						//	html += '<input type="number" readonly tabindex="-1" ';
							html += '<input type="' + inputType + '" readonly tabindex="-1" ';			// PATCH!! §§
							html += ' class="form-control economics calc_number progressivo' + cxx + '" ';
							html += ' id="' + name + '_QTot' + gruppo + sufx + '" ';
							html += ' periodo="' + gruppo + '" ';
						//	html += ' value="' + formatNumber((totPeriodi / 1000), _nDec) + '" ';
							if (isScenario) {															// PATCH!! §§
								html += ' value="' + numberToLocale((totPeriodi / 1000), _nDec) + '" ';	// PATCH!! §§
							} else {
								html += ' value="' + formatNumber((totPeriodi / 1000), _nDec) + '" ';		// La formula regolare
							}																				
							html += '>';
							html += '</td>';
						}
						gruppo++;																		// Incrementa l'identificatore di gruppo
					}
				}
			}
		
			switch (type) {
				case 'input':
				case 'formula':
			//	case 'scenario':
				case 'empty':

					var cErr = '';
					if (type != 'scenario') {
						cErr  = ((expected * 1000) == totPeriodi)? '' : ' hasErr';
					}

					// Aggiunge il totale di riga o il placeholder totale
					id    =  name + '_totale' + sufx;													// Costruzione ID (NR)
					html += '<td class="tTot">';
					html += '<span class="um' + cErr + '">' + unMis + '</span>';						// Costruzione Unità misura
					html += '<input readonly tabindex="-1"';											// Definizione tag
					html += ' class="form-control economics finale' + cErr + '"';						// Classe
					html += ' rRef="' + r + '"';														// Attributi di riferimento
					html += ' nRef="' + name + '_totRow' + ((rows > 1)? '_' + r : '') + '" ';
					html += ' id="' + id + '"';															// ID e valore
					html += ' value="' + numberToLocale((totPeriodi / 1000), _nDec) + '"';
					html += ' truevalue="' + formatNumber((totPeriodi / 1000), _nDec) + '"';
					html += ' expected="' + expected + '" ';
					html += ' amount="' + amount + '" ';
					html += ' title="Valore atteso: ' + numberToLocale(expected, _nDec) + '"';
					html += '>';
					html += '</td>';
					break;

				case 'double':

					// crea i 4 campi vuoti:
					parz = '';
					parz += '<td class="cumulato" periodo="' + gruppo + '">';
					parz +=   '<span class="um total">' + unMis + '</span>';							// Costruzione Unità misura
					parz +=   '<input';																	// Costruzione campo
					parz +=   ' value=""';																// Valore null (viene valorizzato dopo)
					parz +=   ' class="form-control economics calc_number"';							// Classe
					parz +=   ' type="text" ';															// Definizione tipo: calcolato = text
					parz +=   ' readonly tabindex="-1"';												// Definizione tag

					for (ii = 1; ii <= 4; ii++) {
						html += parz + ' id="' + name + '_Q' + gruppo + '_totale' + ii + '"';			// ID
						html +=   ' periodo="' + gruppo + '"';
						html +=   '>';
						html += '</td>';
					}

					html += '<td></td>';
					break;

				case 'scenario':
					var valoreBP    = eval($('#bp_' + name).html());
					var Scostamento = totPeriodi - valoreBP;
				//	var ScostPct    = ((totPeriodi / valoreBP ) - 1) * 100;
					var ScostPct    = (Scostamento / valoreBP ) * 100;


					html += '<td class="tTot">';
					html +=   '<span class="um">' + unMis + '</span>';									// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit1"';						// Classe
					html +=   ' value="' + numberToLocale((valoreBP / 1000), _nDec) + '"';
					html +=   '>';
					html +=   '<span class="um">' + unMis + '</span>';									// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit2"';						// Classe
					html +=   ' value="' + numberToLocale((Scostamento / 1000), _nDec) + '"';
					html +=   '>';
					html +=   '<span class="um">%</span>';												// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit3"';						// Classe
					html +=   ' value="' + numberToLocale((ScostPct), _nDec) + '"';
					html +=   '>';
					html += '</td>';
					break;


				default:
					html += '<td></td>';
			}
			html += '</tr>';																				// Chiusura riga

		}

		return html;

	}


	// FUNCTION: fieldType_std
	//	Genera HTML di un campo input standard
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_std(params) {

		var fp    = params.fieldPars																	// JSON dei descrittori dei campi
		var Value = fp.value;																			// Valore del campo
		var unMis = fp.unMis;																			// Unità di misura
		var name  = fp.name;																			// Nome del dataset
		var Class = fp.Class;																			// Classi aggiuntive (es. evidenziazione del campo errato)
		var rRef  = fp.rRef;																			// Nr. di riga 
		var cRef  = fp.cRef;																			// Nr. di colonna
		var group = fp.group;																			// Gruppo di appartenenza
		var errID = fp.errID;																			// Codice di errore
	
		var dcVal = formatNumber(Value / 1000, _nDec);													// Valore formattato da visualizzare
		var hTags = '';																					// Inizializza la stringa di testo HTML
					
		hTags += '<td class="mese" periodo="' + group + '">';
		hTags +=   '<span class="um' + Class + '">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// ** 1 - Costruzione campo di input
		hTags +=   ' type="number" step=".001" ';														// Definizione tipo: input = number
		hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '"';									// ID
		hTags +=   ' class="form-control economics input_number' + Class + '"';							// Classe
		hTags +=   ' value="' + dcVal + '"';															// Valore
		hTags +=   ' errID="' + errID + '" ';															// Codice di errore associato
		hTags +=   ' nRef="' + name + '"';																// Attributi di rif.: nome
		hTags +=   ' rRef="' + rRef + '"';																// Attributi di rif.: riga
		hTags +=   ' cRef="' + cRef + '"';																// Attributi di rif.: colonna
		hTags +=   ' periodo="' + group + '"';
		hTags +=   '>';	
		hTags +=   '<input type="hidden"';																// ** 2 - Costruzione campo "Mirror"
		hTags +=   ' class="mirror"';
		hTags +=   ' mirror="' + name + '_r' + rRef + '_c' + cRef + '"';								// "mirror" = ID del campo di input associato
		hTags +=   ' key="' + name + '" ';																// Nome del dataset (serve per il salvataggio dati)
		hTags +=   ' mese="' + cRef + '" ';																// Mese di appartenenza (serve per il salvataggio dati)
		hTags +=   ' value="' + Value + '" ';
		hTags +=   '>';
		hTags += '</td>';

		return hTags;
	}
	

	// FUNCTION: fieldType_readonly
	//	Genera HTML di un campo in sola lettura
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_readonly(params) {

		var fp    = params.fieldPars																	// JSON dei descrittori dei campi
		var Value = fp.value;																			// Valore del campo
		var unMis = fp.unMis;																			// Unità di misura
		var name  = fp.name;																			// Nome del dataset
		var Class = fp.Class;																			// Classi aggiuntive (es. evidenziazione del campo errato)
		var rRef  = fp.rRef;																			// Nr. di riga 
		var cRef  = fp.cRef;																			// Nr. di colonna
		var group = fp.group;																			// Gruppo di appartenenza
		var style = fp.style;
		var tipo  = fp.tipo;
		var dcVal = numberToLocale(Value / 1000, _nDec);												// Valore formattato da visualizzare

		var noID  = fp.noID; 
	
		var hTags = '';																					// Inizializza la stringa di testo HTML
		
		if (style == null) {style = ' calc_number2';}
		if (tipo  == null) {tipo  = 'mese';}

		hTags += '<td class="' + tipo + '" periodo="' + group + '">';
		hTags +=   '<span class="um ' + style + '">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' value="' + dcVal + '"';															// Valore				
		hTags +=   ' class="form-control economics ' + style + '"';										// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
			hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '"';								// ID
			hTags +=   ' nRef="' + name + '"';															// Attributi di rif.: nome
			hTags +=   ' rRef="' + rRef + '"';															// Attributi di rif.: riga
			hTags +=   ' cRef="' + cRef + '"';															// Attributi di rif.: colonna
			hTags +=   ' periodo="' + group + '"';
		}
		hTags +=   '>';
		hTags += '</td>';

		return hTags;
	}


	// FUNCTION: fieldType_double
	//	Genera HTML di un campo in sola lettura
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_double(params) {

		var fp    = params.fieldPars																	// JSON dei descrittori dei campi
		var Value = fp.value;																			// Valore del campo
		var unMis = fp.unMis;																			// Unità di misura
		var name  = fp.name;																			// Nome del dataset
		var Class = fp.Class;																			// Classi aggiuntive (es. evidenziazione del campo errato)
		var rRef  = fp.rRef;																			// Nr. di riga 
		var cRef  = fp.cRef;																			// Nr. di colonna
		var group = fp.group;																			// Gruppo di appartenenza

//Value = 1000000*group+1000*cRef;		// §§§§§§§§§§§§§§§§§§§§§§§§§§

		var style = fp.style;
		var tipo  = fp.tipo;
		var dcVal = numberToLocale(Value / 1000, _nDec);												// Valore formattato da visualizzare

		var noID  = fp.noID; 
	
		var hTags = '';																					// Inizializza la stringa di testo HTML
		
		if (style == null) {style = ' calc_number';}
		if (tipo  == null) {tipo  = 'mese';}


		// ** Primo campo **
		hTags += '<td class="' + tipo + '" periodo="' + group + '">';
		hTags +=   '<span class="um ' + style + '">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' truevalue="' + Value + '"';														// Valore esteso
		hTags +=   ' value="' + dcVal + '"';															// Valore				
		hTags +=   ' class="form-control economics ' + style + '"';										// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
			hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '"';								// ID
			hTags +=   ' nRef="' + name + '"';															// Attributi di rif.: nome
			hTags +=   ' rRef="' + rRef + '"';															// Attributi di rif.: riga
			hTags +=   ' cRef="' + cRef + '"';															// Attributi di rif.: colonna
			hTags +=   ' periodo="' + group + '"';
		}
		hTags +=   '>';
		hTags += '</td>';

		// ** Secondo campo **
		hTags += '<td class="' + tipo + ' bis" periodo="' + group + '">';
		hTags +=   '<span class="um ' + style + '2">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' value=""';																			// Valore null (viene valorizzato dopo)
		hTags +=   ' class="form-control economics ' + style + '2"';										// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
			hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '_bis"';							// ID
			hTags +=   ' nRef="' + name + '_bis"';															// Attributi di rif.: nome
			hTags +=   ' periodo="' + group + '"';
		}
		hTags +=   '>';
		hTags += '</td>';


		return hTags;
	}

	

	// FUNCTION: fieldType_scenario
	//	Genera HTML di un campo in sola lettura
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_scenario(params) {

		var fp    = params.fieldPars																	// JSON dei descrittori dei campi
		var Value = fp.value;																			// Valore del campo
		var unMis = fp.unMis;																			// Unità di misura
		var name  = fp.name;																			// Nome del dataset
		var Class = fp.Class;																			// Classi aggiuntive (es. evidenziazione del campo errato)
		var rRef  = fp.rRef;																			// Nr. di riga 
		var cRef  = fp.cRef;																			// Nr. di colonna
		var group = fp.group;																			// Gruppo di appartenenza
		var style = fp.style;
		var tipo  = fp.tipo;
		var sufx  = fp.sufx;
		var cBreak = fp.break;
		var dcVal = numberToLocale(Value / 1000, _nDec);												// Valore formattato da visualizzare

		var noID  = fp.noID; 
	
		var hTags = '';																					// Inizializza la stringa di testo HTML
		
		if (style == null) {style = ' calc_number2';}
		if (tipo  == null) {tipo  = 'mese';}


		hTags += '<td class="' + tipo + '" periodo="' + group + '">';
		hTags +=   '<span class="um ' + style + cBreak + '">' + unMis + '</span>';						// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' value="' + dcVal + '"';															// Valore				
		hTags +=   ' class="form-control economics ' + style + cBreak +'"';								// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
			hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + sufx + '"';							// ID
			hTags +=   ' nRef="' + name + '"';															// Attributi di rif.: nome
			hTags +=   ' rRef="' + rRef + '"';															// Attributi di rif.: riga
			hTags +=   ' cRef="' + cRef + '"';															// Attributi di rif.: colonna
			hTags +=   ' periodo="' + group + '"';
		}
		hTags +=   '>';
		hTags += '</td>';

		return hTags;
	}






	// FUNCTION: bindings
	//	Crea i binds degli elementi (campi) agli eventi
	// PARAMS:
	//	None
	// RETURN:
	//	None
	function bindings(params) {

		$('.input_number').change(function () {

			// PATCH: deve risalire alla tabella di appartenenza, perché si possono trovare duplicati nella selezione dei campi dei totali (stesso dataname)
			var myTable = '#' + $($(this).parents()[3]).attr('id') + ' ';
			
			__SYS_status.hasChanged = true;																// Aggiornamento STATUS globale: attiva il flag di valore modificato

			var value  = $(this).val();																	// Valore del campo modificato
			var field  = $(this).attr('id');															// ID del campo
			var name   = $(this).attr('nref');															// Nome del dataset di appartenenza
			var gruppo = $(this).attr('periodo');														// Nome del dataset di appartenenza
			
			$(this).addClass('hasWarning bold').val(formatNumber(value, _nDec));						// Formattazione del valore
			$($(this).prev()).addClass('hasWarning bold');
			$('[mirror=' + field +']').val(parseInt(value * 1000));										// Aggiorna il campo di mirror

			// Aggiorna il totale del gruppo:
			var parz = 0;
			var qID  = myTable + '#' + name + '_Q' + gruppo;

			$(myTable + 'tr[ref=' + name + '] td[periodo=' + gruppo + '] .mirror').each(function(e){
				parz += eval($(this).val());
			});
			$(qID).val(formatNumber((parz / 1000), _nDec));												// Aggiorna il totale di periodo corrispondente

			
			// Aggiorna i totali progressivi
			var progr;																					// Valore cumulato dei totali di gruppo
			$(myTable + 'tr[ref=' + name + '] input.progressivo').each(function(e){

				progr = 0;																				// Reinizializza il progressivo
				var periodo = $(this).attr('periodo');													// Indice del periodo di riferimento
				for (var i = 1; i <= periodo; i++) {													// Scansione dei totali di gruppo antecedenti
					progr += eval($(myTable + '#' + name + '_Q' + i).val());										// Aggiorna il progressivo
				}
				$(this).val(formatNumber(progr, _nDec));												// Aggiorna il cumulato
			});

			// Aggiorna il totale generale di riga
			var totale = $(myTable + 'tr[ref=' + name + '] input.finale');

			totale.val(formatNumber(progr, _nDec));
			if (progr != eval(totale.attr('expected'))) {
				totale.addClass('hasErr');
				totale.prev().addClass('hasErr')
			} else {
				totale.removeClass('hasErr');
				totale.prev().removeClass('hasErr');
			}
		});
	}






	function ricalcolaValoriPesati(params) {

		var xhtml= '';
		var colori = {'mese': 'calc_number2', 'quarter': 'calc_number3', 'cumulato': 'calc_number4', 'tTot': ''};
		var source = '#' + params.source;
		var target = source + 'Calcolati';
	
		// Scansione della tabella dei pesi:
		$(source + ' tbody tr').each(function(){														// Tutte le righe
	
			var name    = $(this).attr('ref');															// Nome Dataset
		//	var bpTot   = $('#BP_' + name).val();														// Valore totale da BP

			var bpTot   = eval($(source + ' tr[ref=' + name + '] td.tTot input').attr('amount'));		// Valore totale da BP
			var trClass = $(this).attr('class');

			xhtml += '<tr ref="' + name + '" class="' + trClass + '">';
	
			var cells = $(this).find('td');
			for (var j = 0; j < cells.length; j++){														// Tutte le celle
				
				var col = 0;
				switch (true){
					
					case (j == 0): 
						xhtml += '<td class="voce">';
						xhtml += '<label class="rowLabel" ref="' + name + '">';
						xhtml += cells[0].textContent;
						xhtml += '</label></td>';
					break;

					case (j > 0 && j < (cells.length - 1)):

						var tipo   = $(cells[j]).attr('class');
					//	var unMis  = $(cells[j]).find('.um').html();
                        var unMis = "€";
						var pctVal;
						if ( $(cells[j]).find('[type=number]').length > 0) {
							pctVal = $(cells[j]).find('[type=number]').val();
						} else {
							txt = $(cells[j]).find('[type=text]').val();
							pctVal = localeToNumber(txt);
						}

						var Value  = bpTot * pctVal / 100;

						var fieldPars = ({
							value: Value,
							unMis: unMis,
							name : name,
							tipo : tipo,
							Class: '',
							style: colori[tipo],
							rRef : 1,
							cRef : 0,
							group: 0,
							errID: '',
							noID : true,
						});
						xhtml += fieldType_readonly({ fieldPars });
						break;

					case (j == (cells.length - 1)):
					//  var unMis  = $(cells[j]).find('.um').html();
                        var unMis = "€";
						var pctVal = $(cells[j]).find('input').attr('truevalue');
					//	var Value  = bpTot * pctVal / 1000;
						var Value  = bpTot * pctVal / 100;

						var fieldPars = ({
							value: Value,
							unMis: unMis,
							name : name,
							tipo : 'tTot',
							Class: '',
							style: colori['tTot'],
							rRef : 1,
							cRef : 0,
							group: 0,
							errID: '',
							noID : true,
						});
						xhtml += fieldType_readonly({ fieldPars });
						break;


				
					default:

				}

			}
			xhtml += '</tr>';
			
		});
	
		$(target + ' tbody').html(xhtml);

	}


	function inserisciDatiScostamento(params) {

		var xml   = params.xmlDocument;
		var allDs = $(xml).find('Data>Mesi>Mese[ID=1]').children();

		for (var j = 0; j < allDs.length; j ++) {

			var nodeName = allDs[j].localName;															// Nome del nodo
			for (var col = 1; col <= 12; col++) {

				Node    = $(xml).find('Mese[ID=' + col + ']');
				Value   = parseInt($(Node).find(nodeName).text());										// Legge il valore da XML
//Value = j * 10000000 + col * 10000;		// §§§§§§§§§§§§§§§§§§§§§§§§§§
				$('#' + nodeName + '_r1_c' + col + '_bis')
				.attr('truevalue', Value)
				.val(numberToLocale(Value / 1000, _nDec));

				// PATCH: va a sostituire i valori della tabella nascosta (in origine è creata coi dati del budget, ma servono i valori consuntivati)

			}
		}

		// Fase 2: calcola i totali per Trimestre
		for (var j = 0; j < allDs.length; j ++) {														// Vai per riga
			var nodeName = allDs[j].localName;															// Nome del nodo
			for (p = 1; p <= 4; p++) {																	// Vai per gruppo (sub-tabella)
				var mese = ((p - 1) * 3) + 1;
				var totBudget     = 0;
				var totConsuntivo = 0;

				for (col = mese; col < mese + 3; col++) {

					totBudget     += eval($('[id=' + nodeName + '_r1_c' + col + ']').attr('truevalue'));
					totConsuntivo += eval($('[id=' + nodeName + '_r1_c' + col + '_bis]').attr('truevalue'));
				}

				// Aggiorna tot.
				var totDiff     = totConsuntivo - totBudget;
				var totDiffPerc = totDiff / totBudget * 100 * 1000;

				$('[id=' + nodeName + '_Q' + p + '_totale1]').val(numberToLocale(totBudget / 1000, _nDec));
				$('[id=' + nodeName + '_Q' + p + '_totale2]').val(numberToLocale(totConsuntivo / 1000, _nDec));
				$('[id=' + nodeName + '_Q' + p + '_totale3]').val(numberToLocale(totDiff / 1000, _nDec));
				$('[id=' + nodeName + '_Q' + p + '_totale4]').val(numberToLocale(totDiffPerc / 1000, _nDec));
			}
		}


	}



	//======| Sez. 2: Handlers |===================================================

	// FUNCTION: formatNumber
	//	Restituisce il valore formattato con un nr. di decimali fisso
	// PARAMS:
	//	val  : valore numerico da formattare
	//	nDec : numero di cifre decimali
	// RETURN:
	//	None
	function formatNumber(val, nDec) {

		// Lettura parametri
		var nDec   = (isNaN(nDec)) ? _nDec : nDec;														// Imposta il nr. di decimali (default: 2)
		var decPow = Math.pow(10, nDec);																// Moltiplicatore (10 ^ nDec)
		var frmVal = (Math.round(val * decPow) / decPow).toFixed(nDec);									// Formattazione del valore

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
	
		var myNDec = (isNaN(nDec)) ? _nDec : nDec;														// Imposta il nr. di decimali (default: 2)
		var raw;																						// Valore "grezzo" della conversione

		raw = val.toLocaleString(undefined, {maximumFractionDigits: myNDec, minimumFractionDigits: myNDec});

		return raw;
	}

	// FUNCTION: localeToNumber
	//	Converte la stringa formattata in valore numerico
	// PARAMS:
	//	val  : stringa numerica da riconvertire
	// RETURN:
	//	Valore numerico
	function localeToNumber(val) {

		if (val.indexOf(',') > -1) {
			val = val.replace(/\./g, "");
			val = val.replace(',', ".");
		}

		//return (isNaN(parseFloat(val))) ? 0 : parseFloat(val).toFixed(2);								// Restituisce il valore numerico
		return (isNaN(parseFloat(val))) ? 0 : parseFloat(val);											// Restituisce il valore numerico
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

		switch (name) {
			case 'cdgDistribuzione':

				txt+= "<?xml version='1.0' encoding='utf-8' ?>";										// Costruzione XML base
				txt+= "<Request ID='" + mBase.RequestID() + "'>";
				txt+= '<General>';
				txt+= '<Token>' + __WACookie.Token + '</Token>';
				txt+= '</General>';
				txt+= '<Data>';
				txt+= '<Mesi>';

			//	for (var a = 1; a <= _nColonne; a++) {													// Costruzione dei nodi "Anno"
				// **
				// **
				// ** DA CAPIRE COME FARE PER SEGARE "_MESEINIT" => RENDERLO PARAMETRICO?
				// **
				// **
				for (var col = _meseInit; col <= _meseStop; col++) {;									// Costruzione dei nodi "Anno"
					txt += "<Mese ID='" + col + "'></Mese>";
				}
				
				txt+= '</Mesi>';
				txt+= '</Data>';
				txt+= '</Request>';
				XML = $.parseXML(txt);

				$('.mirror').each(function(){															// Processa tutti i campi 'mirror'

					var key    = $(this).attr('key');
					var val    = $(this).val();
					var mese   = $(this).attr('mese');
					var node   = '<' + key + '>' + val + '</' + key + '>';								// Costruzione del nodo da aggiungere
					var parent = 'Mese[ID=' + mese + ']';												// Costruzione del nome nodo padre (Fatto da schifo...)

					$(XML).find(parent).append(node);													// Aggiunge il nodo

				});
				break;

			default:
				break;
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