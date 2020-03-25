//----------------------------------------------------------------------------------------
// File: datagrid_CDG.presenter.js
//
// Desc: Gestione del datagrid delle pagine "Controllo di Gestione (CDG)"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_model',
	'base_presenter',
], function (mBase, pBase) {

	var _container = '';																				// ID del container del datagrid
	var _xml       = '';																				// File XML generico restiuito da Saas
	var _nDec      = 2;																					// Numero di decimali
	var _meseInit;
	var _meseStop;
	var _econXML;

	var _tableList;
//	var _umOver=null;																					// Gestione Unità misura alternativa


	var _enableLabel = !true;																			// Flag per abilitare funzione sperimentale: etichetta valore formatato in overlay per i campi input

	return {
		Init        : init,																				// Initializes (setup) the datagrid

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
		_meseInit  = params.meseInit;																	// Nr. primo mese nella tabella
		_meseStop  = params.meseStop;																	// Nr. ultimo mese nella tabella
		_xml       = params.xmlDocument;
		_xml2      = params.xml_bis;
		_tableList = params.tableList;

		_econXML   = __Preloads.economics;																// Lettura del file "economics.xml" (etichette) precaricato nel presenter
        context = (params.context != null) ? '#' + params.context + ' ' : '';
	
		$('#preloader').attr('style', 'display:block');													// Shows the "preloader" layer


		// ** Risoluzione degli oggetti complessi "scrollTable" e "rawtable" **
	//	$(context + '[scrolltable], ' + context + '[rawtable]').each(function (){
		$(_tableList).each(function() {
			buildScrollTable({ 
				obj: $(this),
				xml: _xml,
			});
		});


		// ** Gestione degli scroll sincronizzati delle tabelle (sono due container disgiunti)
		$('[ref*=_scroll]').on('scroll', function(){
			head = $(this);
			body = $('[ref=' + head.attr('ref').replace('scroll', 'sync') + ']');
			body.scrollLeft( head.scrollLeft() );
		});


		// ** Bindings (eventi dei campi) **
		bindings();																						// Gestione eventi 'onchange'

		$('#preloader').attr('style', 'display:none');													// Hides the "preloader" layer

		return;
	}



	//======| Sez. 1: Costruttori |================================================

	// FUNCTION: buildScrollTable
	//	Costruisce le tabelle "scroll" dei valori mensili
	// PARAMS:
	//	obj : Oggetto scroll/rawTable da risolvere
	// RETURN:
	//	None
	function buildScrollTable(params) {

		var dsObj   = params.obj;																		// Oggetto scroll/rawTable da risolvere
		var xml      = params.xml;																		// Dati tabellari

		// ** Definizione JSON di configurazione per la costruzione della tabella **
		// 1: Lettura parametri diretti
		var dsParams = {																				// Set dei parametri da passare alle funzioni invocate
			objID   : dsObj.attr('id'),																// ID dell'oggetto DOM da processare
			dsRows  : dsObj.find('[dsTablerow]'),														// Dataset delle righe da processare (come nel file XML) 
			type    : dsObj.attr('type'),																// Tipo dei campi
			umID    : dsObj.attr('umID'),																// Indice per la gestione dei simboli delle unità di misura
			colInit : eval(dsObj.attr('init')),														// Mese iniziale del periodo (prima colonna)
			colStop : eval(dsObj.attr('stop')),														// Mese finale del periodo (ultima colonna)
			nrMesi  : eval(dsObj.attr('groupSize')),													// Nr. di mesi del sottogruppo da misurare (normalmente trimestre)
			defValue: eval(dsObj.attr('default')),														// Valore impostato di default (nel caso di campi vuoti)
			qcFactor: eval(dsObj.attr('qcFactor')),													// Fattore di correzione trimestrale (quarterly correction factor) dovuto agli arrotondamenti nella divisione mensile (es. 100/12 = 8.33333... ma 8.33 *12 = 99.96 => ad ogni terzo mese sommo 0.01 => torno a 100)
		} 

		// 2: Adattamenti e definizione valori calcolati
		var colspan, showTotals, tableClass, qf, dv;															// Variabili temporanee
		switch (dsParams.type) {
			case 'raw':
 				colspan    = 1;
				showTotals = false;
				tableClass = 'tableWrapper raw';
				break;
			case 'double':
 				colspan    = 2;
				showTotals = false;
				tableClass = 'tableWrapper scroll double';
				break;
			case 'scenario':
 				colspan    = 1;
				showTotals = true;
				tableClass = 'tableWrapper scroll scenario';
				break;
			default:																					// Casi: input, empty, formula, ...
 				colspan    = 1;
			//	showTotals = true;
				showTotals = false;
				tableClass = 'tableWrapper scroll';
				break;
		}
		qf = (dsParams.qcFactor != null)? dsParams.qcFactor * 1000 : 0;									// Adattamento valori (scalati per 1000)
		df = (dsParams.defValue != null)? dsParams.defValue * 1000 : 0;

		$.extend(dsParams, {
			colspan   : colspan,																		// Nr. di colonne sottese dal'etichetta del mese/periodo
			showTotals: showTotals,																		// Indica se mostrare i totali di gruppo e di fine riga
			tableClass: tableClass,																		// Classe della tabella (per la stilizzazione)
			qcFactor  : qf,																				// Aggiorna col valore riscalato
			defValue  : df,																				// Aggiorna col valore riscalato
			nrRows    : dsParams.dsRows.length,															// Nr. di elementi (righe) del dataset
		});


		// ** Costruisce le intestazioni delle tabelle **
	//	buildsTableHeads(dsParams);
		new_buildsTableHeads(dsParams);

		// ** Costruisce i corpi delle tabelle **
		buildsTableBodies(dsParams, xml);

	}





	// FUNCTION: buildsTableHeads
	//	Costruisce l'intestazione delle tabelle tipo "scroll"
	// PARAMS:
	//	params : JSON dei valori che descrivono la tabella
	// RETURN:
	//	None
	function new_buildsTableHeads(params) {

		// ** Definizione variabili **
		let {tableClass, objID, type, showTotals, colInit, colStop, nrMesi, colspan, ...pars} = params;		// Split parametri

		var html     = '';
		var htmlRow2 = '';																				// Codice html dell'eventuale seconda riga (es. tabelle scostamenti)
		var gLabel   = 'Q';																				// Etichetta dei totali periodici
		var groupID  = parseInt(colInit / nrMesi) + 1;													// Identificatore di gruppo per la gestione dei subtotali
		var nomeMesi = [
			'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];		// Nomi dei mesi
		var periodi  = ['Primo', 'Secondo', 'Terzo', 'Quarto'];											// Etichette dei periodi (quarters)


		// ** Costruzione Tabella di intestazione **
		html += '<div class="' + tableClass + ' head" ref="' + objID + '_scroll">';						// Container della tabella scorrevole
		html += '<table id="' + objID + '_head" class="timesheet_table">';								// Tabella scorrevole (prende l'ID del suo placeholder)
		html += '<thead><tr>';																			// Definizione header tabella
		html +=   '<th class="">';																		// Prima colonna: etichette
		html +=     '<span class="rowLabelTitle voci">Voci</span>';
		html +=   '</th>';



		// Costruzione intestazioni secondo la tipologia della tabella
		switch (type) {

			case "raw":
				for (let col = colInit; col <= colStop; col++) {										// Costruzione delle colonne mensili coi raggruppamenti
					html += '<th class="">';
					html +=   '<span class="rowLabelTitle">' + nomeMesi[col - 1] + '</span>';
					html += '</th>';
				}
				break;

			case 'input':
			case 'formula':
			case 'empty':
				for (let col = colInit; col <= colStop; col++) {										// Costruzione delle colonne mensili coi raggruppamenti

					html += '<th class="" periodo="' + groupID + '" colspan="' + colspan + '">';
					html +=   '<span class="rowLabelTitle">' + nomeMesi[col - 1] + '</span>';
					html += '</th>';

					if (showTotals) {
						if ((col % nrMesi) == 0 || col == colStop) {									// Determina se inserire i totali di periodo
							html += '<th class="tot_1">'
							html +=   '<span class="rowLabelTitle">';									// Titolo del periodo
							html +=     gLabel + groupID;
							html +=   '</span>';
							html += '</th>'; 

							if (groupID > 1) {															// Solo se non è il primo periodo, inserisce le somme parziali
								html += '<th class="tot_2">';
								html +=   '<span class="rowLabelTitle">';								// Titolo parziale cumulato
								html +=     gLabel + '1..' + gLabel + groupID;
								html +=   '</span>';
								html += '</th>'; 
							}
							groupID++;																	// Incrementa l'identificatore di gruppo
						}
					}
				}
				html += '<th class="totale"><span class="rowLabelTitle fix">Totale </span></th>';
				break;



			case "double":
				for (let col = colInit; col <= colStop; col++) {										// Costruzione delle colonne mensili coi raggruppamenti

					html += '<th class="" periodo="' + groupID + '" colspan="' + colspan + '">';
					html +=   '<span class="rowLabelTitle">' + nomeMesi[col - 1] + '</span>';
					html += '</th>';

					if (showTotals) {
						if ((col % nrMesi) == 0 || col == colStop) {									// Determina se inserire i totali di periodo
							html += '<th class="tot_1">'
							html +=   '<span class="rowLabelTitle">';									// Titolo del periodo
							html +=     gLabel + groupID;
							html +=   '</span>';
							html += '</th>';

							if (groupID > 1) {															// Solo se non è il primo periodo, inserisce le somme parziali
								html += '<th class="tot_2">';
								html +=   '<span class="rowLabelTitle">';								// Titolo parziale cumulato
								html +=     gLabel + '1..' + gLabel + groupID;
								html +=   '</span>';
								html += '</th>';
							}
							groupID++;																	// Incrementa l'identificatore di gruppo
						}
					}
				}

				html +=  '<th class="totale" colspan="4"><span class="rowLabelTitle fix">Totale ' + periodi[groupID - 1] + ' trimestre</span></th>';
				html +=  '<th></th>';
				
				// Costruzione della seconda riga
				html += '</tr><tr>';
				html += '<th></th>';																	// La prima colonna (etichette) è sempre vuota 
				for (let i = 1; i <= nrMesi; i++){														// Ciclo per le intestazioni std. delle colonne centrali
					html += '<th><span class="rowLabelTitle">Budget</span></th>';
					html += '<th><span class="rowLabelTitle">Consunt.</span></th>';
				}
				html += '<th><span class="rowLabelTitle fix2">Budget</span></th>';						// Intestazione complessa dei totali di periodo
				html += '<th><span class="rowLabelTitle fix2">Consunt.</span></th>';
				html += '<th><span class="rowLabelTitle fix2">Diff.</span></th>';
				html += '<th><span class="rowLabelTitle fix2">Diff. %</span></th>';
				html += '<th></th>';																	// Intestazione ultima colonna (sempre vuota)
				break;


			case "scenario":
				// Prima deve costruire la riga dei quarter
			//	for (let i = 1; i <= nrMesi; i++){														// Ciclo per le intestazioni std. delle colonne centrali
				for (let i = 1; i <= 4; i++){															// Ciclo per le intestazioni std. delle colonne centrali
				//	cspan = (i < 2)? 4 : 5;
					cspan = 1;
					html += '<th class="row1" periodo="h' + i + '" colspan="' + cspan + '" ref="' + cspan + '">';
					html +=   '<span class="rowLabelTitle" periodo="' + i + '">' + gLabel + i + '</span>';
					html += '</th>';
				}
			//	html += '<th colspan="3"><span class="rowLabelTitle scenarioTit0">Totali</span></th>';
				html += '<th colspan="4"><span class="rowLabelTitle scenarioTit0">Totali</span></th>';
				html += '<th></th>';

				// Costruzione della seconda riga
				html += '</tr><tr>';
				html += '<th></th>';																	// La prima colonna (etichette) è sempre vuota 
				for (let col = colInit; col <= colStop; col++) {										// Costruzione delle colonne mensili coi raggruppamenti

					html += '<th class="mese hide" periodo="' + groupID + '" colspan="' + colspan + '">';
					html +=   '<span class="rowLabelTitle">' + nomeMesi[col - 1] + '</span>';
					html += '</th>';

					if (showTotals) {
						if ((col % nrMesi) == 0 || col == colStop) {									// Determina se inserire i totali di periodo
							html += '<th class="tot_1">'
							html +=   '<span class="rowLabelTitle">';									// Titolo del periodo
						//	html +=     gLabel + groupID;
							html +=     'Tot.';
							html +=   '</span>';
							html += '</th>'; 

							if (groupID > 1) {															// Solo se non è il primo periodo, inserisce le somme parziali
								html += '<th class="tot_2 hide">';
								html +=   '<span class="rowLabelTitle">';								// Titolo parziale cumulato
								html +=     gLabel + '1..' + gLabel + groupID;
								html +=   '</span>';
								html += '</th>'; 
							}
							groupID++;																	// Incrementa l'identificatore di gruppo
						}
					}
				}
				html += '<th class="scenarioTit0" style="top:39px;">';
				html +=	  '<span class="rowLabelTitle fix scenarioTit1">Totale</span> ';
				html +=	  '<span class="rowLabelTitle fix scenarioTit2">Budget</span> ';
				html +=	  '<span class="rowLabelTitle fix scenarioTit2">Diff.</span> ';
				html +=	  '<span class="rowLabelTitle fix scenarioTit3">%</span>';
				html += '</th>';
				html += '<th></th>';

				break;

			default:

		}

//		html += htmlRow2;																				// Aggiunge l'eventuale seconda riga di etichette
		html += '</tr></thead>';																		// Chiusura header tabella
		html += '</table>';																				// Chiusura tabella scorrevole
		html += '</div>';																				// Chiusura container della tabella scorrevole

		$('#' + objID + ' [ref=head]').html(html);														// Inserisce la tabella header nel DOM prima dell'elemento descrittore (altrimenti distrugge tutto)
	}


//===================================================================================================================
//	// FUNCTION: buildsTableHeads
//	//	Costruisce l'intestazione delle tabelle tipo "scroll"
//	// PARAMS:
//	//	params : JSON dei valori che descrivono la tabella
//	// RETURN:
//	//	None
//	function buildsTableHeads(params) {
//
//		// ** Definizione variabili **
//		let {tableClass, objID, type, showTotals, colInit, colStop, nrMesi, colspan, ...pars} = params;		// Split parametri
//
//		var html     = '';
//		var htmlRow2 = '';																				// Codice html dell'eventuale seconda riga (es. tabelle scostamenti)
//		var gLabel   = 'Q';																				// Etichetta dei totali periodici
//		var groupID  = parseInt(colInit / nrMesi) + 1;													// Identificatore di gruppo per la gestione dei subtotali
//		var nomeMesi = [
//			'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];		// Nomi dei mesi
////		var nomeMesiExt = [
////			'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
////			'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];						// Nomi dei mesi estesi
//		var periodi  = ['Primo', 'Secondo', 'Terzo', 'Quarto'];											// Etichette dei periodi (quarters)
//
//
//		// ** Costruzione Tabella di intestazione **
//		html += '<div class="' + tableClass + ' head" ref="' + objID + '_scroll">';						// Container della tabella scorrevole
//		html += '<table id="' + objID + '_head" class="timesheet_table">';								// Tabella scorrevole (prende l'ID del suo placeholder)
//		html += '<thead><tr>';																			// Definizione header tabella
//		html +=   '<th class="">';																		// Prima colonna: etichette
//		html +=     '<span class="rowLabelTitle voci">Voci</span>';
//		html +=   '</th>';
//
//
//
//
//
//
//		// Ciclo di intestazione delle colonne centrali
//
//// §§§§§ VA SPACCATO: 
//// §§§§§	Meglio mettere qui lo switch per fargli costruire riga 1/2 come deve fare
//// §§§§§	Troppa disomogeneità nei diversi casi
//
//		for (let col = colInit; col <= colStop; col++) {												// Costruzione delle colonne mensili coi raggruppamenti
//
//			html += '<th class="" periodo="' + groupID + '" colspan="' + colspan + '">';
//			html +=   '<span class="rowLabelTitle">' + nomeMesi[col - 1] + '</span>';
//			html += '</th>';
//
//			if (showTotals) {
//				if ((col % nrMesi) == 0 || col == colStop) {											// Determina se inserire i totali di periodo
//					html += '<th class="tot_1">'
//					html +=   '<span class="rowLabelTitle">';											// Titolo del periodo
//					html +=     gLabel + groupID;
//					html +=   '</span>';
//					html += '</th>'; 
//
//					if (groupID > 1) {																	// Solo se non è il primo periodo, inserisce le somme parziali
//						html += '<th class="tot_2">';
//						html +=   '<span class="rowLabelTitle">';										// Titolo parziale cumulato
//						html +=     gLabel + '1..' + gLabel + groupID;
//						html +=   '</span>';
//						html += '</th>'; 
//					}
//					groupID++;																			// Incrementa l'identificatore di gruppo
//				}
//			}
//		}
//
//		// Intestazione ultima colonna (totali di riga) secondo la tipologia della tabella
//		switch (type) {
//			case 'input':
//			case 'formula':
//			case 'empty':
//				html +=  '<th class="totale"><span class="rowLabelTitle">Totale</span></th>';
//				break;
//
//			case "double":
//				html +=  '<th class="totale" colspan="4"><span class="rowLabelTitle fix">Totale ' + periodi[groupID - 1] + ' trimestre</span></th>';
//				html +=  '<th></th>';
//				
//				// Costruzione della seconda riga
//				htmlRow2 += '</tr><tr>';
//				htmlRow2 += '<th></th>';																// La prima colonna (etichette) è sempre vuota 
//				for (let i = 1; i <= nrMesi; i++){														// Ciclo per le intestazioni std. delle colonne centrali
//					htmlRow2 += '<th><span class="rowLabelTitle">Budget</span></th>';
//					htmlRow2 += '<th><span class="rowLabelTitle">Consunt.</span></th>';
//				}
//				htmlRow2 += '<th><span class="rowLabelTitle fix">Budget</span></th>';					// Intestazione complessa dei totali di periodo
//				htmlRow2 += '<th><span class="rowLabelTitle fix">Consunt.</span></th>';
//				htmlRow2 += '<th><span class="rowLabelTitle fix">Diff.</span></th>';
//				htmlRow2 += '<th><span class="rowLabelTitle fix">Diff. %</span></th>';
//				htmlRow2 += '<th></th>';																// Intestazione ultima colonna (sempre vuota)
//				break;
//
//			case "scenario":
//				html += '<th class="scenario">';
//				html +=	  '<span class="rowLabelTitle fix scenarioTit1">Budget</span> ';
//				html +=	  '<span class="rowLabelTitle fix scenarioTit2">Diff.</span> ';
//				html +=	  '<span class="rowLabelTitle fix scenarioTit3">%</span>';
//				html += '</th>';
//				break;
//
//			default:
//				html += '<th></th>';
//			}
//
//		html += htmlRow2;																				// Aggiunge l'eventuale seconda riga di etichette
//		html += '</tr></thead>';																		// Chiusura header tabella
//		html += '</table>';																				// Chiusura tabella scorrevole
//		html += '</div>';																				// Chiusura container della tabella scorrevole
//
//		$('#' + objID + ' [ref=head]').html(html);														// Inserisce la tabella header nel DOM prima dell'elemento descrittore (altrimenti distrugge tutto)
//
//	}
//===================================================================================================================



	// FUNCTION: buildsTableBodies
	//	Costruisce il corpo delle tabelle tipo "scroll"
	// PARAMS:
	//	params : JSON dei valori che descrivono la tabella
	// RETURN:
	//	None
	function buildsTableBodies(params, xml) {

		// Split parametri
		let {tableClass, objID, type, showTotals, colInit, colStop, nrMesi, defValue, nrRows, dsRows, qcFactor, umID} = params;

		// Definizione variabili principali
		var html     = '';	
		var readonly = (type != 'input') ? true : false;												// Flag di sola lettura dei campi

		
		// ** Scansione dei dataset (righe) contenuti nella tabella **
		html += '<div class="' + tableClass + ' body" ref="' + objID + '_sync">';						// Container della tabella scorrevole
		html += '<table id="'  + objID + '_body" class="timesheet_table">';								// Tabella scorrevole (prende l'ID del suo placeholder)
		html += '<tbody>';																				// Definizione corpo tabella

		for (let r = 0; r < nrRows; r++){																// Ciclo di scansione delle righe
	
			// Definizione variabili 
			var ds       = dsRows[r];																	// Dataset (riga tabella) da analizzare
			var data     = $(ds).data();																// Lettura dei parametri del dataset (attributi "data-")
			var name     = data.name;																	// Nome del dataset
			var sufx     = (data.sufx     != null)? data.sufx  : '';									// Suffisso per l'ID (es.: usato in scenari)
			var mBreak   = (data.break    != null)? data.break : '';									// Valore di break per gli scenari
			var expected = (data.expected != null)? eval(data.expected) : 0;							// Valore atteso come totale di riga
			var amount   = data.amount;																	// Valore iniettato da controllo.presenter x distribuzione pesi
			var totParz  = 0;																			// Totale parziale di gruppo
			var totProg  = 0;																			// Totale progressivo (somma dei parziali)
			var groupID  = parseInt(colInit / nrMesi) + 1;												// Identificatore di gruppo per la gestione dei subtotali
			var rowId    = name + '_1';																	// Definisce l'iD di riga (usato anche per la lettura delle etichette da XML)
			var unMis    = pBase.GetXmlNodeAttr({															
				xmlRaw : _econXML.RawData,
				element: '[codiceUI=' + rowId + ']',
				attr   : 'um',
			});

			unMis = (umID != null)? umID : unMis;														// Sovrascrive l'unità di misura se specificata nella definizione tabella


			// ** Scansione valori della riga (costruzione celle del dataset) **
			for (var col = colInit; col <= colStop; col++)	{											// Scansione delle colonne mensili coi raggruppamenti

				// Definizione variabili 
				var Value;																				// Valore del campo da costruire
				var trueVal;																			// Valore "reale" letto da DB (usato nei campi formula che mostrano il valore "formattato")
				var emptyField;																			// Flag di identificazione di campo "vuoto"
				var hidden  = false;																	// Flag di gestione della visualizzazione della riga (non tutte sono sempre visibili)
				var initial = defValue + (((col % 3) == 0)? qcFactor: 0);								// Fattore di correzione trimestrale per compensare gli arrotondamenti della ripartizione mensile
				var Node    = $(xml).find('Mese[ID=' + col + ']');										// Nodo XML del raggruppamento mensile associato alla colonna/mese attuale 
				
				// Legge il valore
				if (type != 'empty') {																	// Per le tabelle non "vuote" (calcolate a parte) legge il valore del dataset attuale dal nodo XML
					Value = parseInt( $(Node).find(name).text() );
				}
				// Determina lo status riga
				if ($(Node).find(name).attr('Tipo') == 'H') {											// Verifica se il dataset ha l'attributo di riga "nascosta" (tabella pesi: valori calcolati, non imputabili e/o significativi)
					if (type != 'raw') {
						hidden = true;																	// Abilita il flag
					} else {
						Value = 'n.d.';																	// Per le tabelle "raw" la riga resta visibile ma il valore è "n.d."
					}
				}
				// Determina lo status campo (check valore)
				emptyField = ((Value - parseInt(Value / 10) * 10) != 0)? true : false;					// Imposta il flag di campo vuoto
				if ((emptyField && !readonly) || isNaN(Value)) {										// Se il campo è "vuoto" o non valido assegna il valore di default
					var trueVal = initial;
					if (!readonly) {
						__SYS_status.hasChanged = true;													// See il campo non è readonly ( => è di input) alza il flag globale di "modified"
					}
				} else {
					var trueVal = Value;			// §§												// Registra in trueVal lo stesso valore (§§§ VERIFICARNE L'USO §§§)
				}

				// Inizia la costruzione dell'HTML:
				// La definizione del tag "tr" è interna al ciclo (e non esterna come dovrebbe) perché
				// è subordinata alla lettura del parametro "Tipo" del nodo XML (vedi sopra):
				if (col == colInit) {																	// Se è la prima colonna, crea il tag "<tr>" e la cella dell'etichetta
				//	html += '<tr ref="' + name + ((hidden)? '" class="hide"' : '') + '" rownr="' + r + '">';
					html += '<tr ref="' + name + ((hidden)? '" class="hide"' : '') + '">';
					html += '<td class="voce">';
					html +=   '<snp_XML_label_economics data-pars="value:=\'' + rowId + '\'" class="" />';
					html +=   '<span class="floatRight">' + unMis + '</span>';
					html += '</td>';
				}


				// ** Costruisce il campo richiesto in funzione del tipo tabella **
				var fieldPars = ({																		// SET PARAMETRI per costruzione campi
					name : name,																		// Nome dataset
					value: trueVal,																		// Valore effettivo da visualizzare
					unMis: unMis,																		// Unità di misura
					rRef : r,																			// Riga di riferimento
					cRef : col,																			// Colonna di riferimento
					group: groupID,																		// Identificativo periodo (gruppo)
					sufx : sufx,																		// Suffisso per l'ID (es.: usato in scenari)
					Class: '',												// §§§§§§§ Da ridefinire!	// Classe (style?)
					break: (col <= mBreak)? ' consuntivo' : ' forecast',	// §§§§§§§ Da ridefinire!	// Break utilizzato in Forecast per separare consuntivo da previsioni
				});

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







			// 2: Costruzione dei campi della riga
//			for (var col = colInit; col <= colStop; col++)	{											// Costruzione delle colonne mensili coi raggruppamenti


				// -- §§ Spostare sopra man mano approvate §§§§§





			

				// PATCH (25/11/2019): i totali li deve calcolare lo stesso: showTotals = false sarà solo per NON vederli
				if (showTotals) {

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
//						html += '<span class="um calc_number2' + cxx + '">' + unMis + '</span>';
					//	html += '<input type="number" readonly tabindex="-1" ';
						html += '<input type="' + inputType + '" readonly tabindex="-1" ';				// PATCH!! §§
						html += ' class="form-control economics calc_number2 parziale' + cxx + '" ';
						html += ' id="' + name + '_Q' + groupID + sufx + '" ';
						html += ' periodo="' + groupID + '" ';
						if (isScenario) {																// PATCH!! §§
							html += ' value="' + numberToLocale((totParz / 1000), _nDec) + '" ';		// PATCH!! §§
						} else {
							html += ' value="' + formatNumber((totParz / 1000), _nDec) + '" ';			// La formula regolare
						}																				
						html += '>';
						html += '</td>';

						totProg += totParz															// Aggiorna il progressivo dei totali parziali
						totParz    = 0;																	// Resetta il totale parziale

						if (groupID > 1) {																// Solo se non è il primo periodo, inserisce le somme parziali
							html += '<td class="cumulato' + ((type == 'scenario')? ' hide' : '') + '">';
//							html += '<span class="um total' + cxx + '">' + unMis + '</span>';
							html += '<input type="' + inputType + '" readonly tabindex="-1" ';			// PATCH!! §§
							html += ' class="form-control economics calc_number progressivo' + cxx + '" ';
							html += ' id="' + name + '_QTot' + groupID + sufx + '" ';
							html += ' periodo="' + groupID + '" ';
							if (isScenario) {															// PATCH!! §§
								html += ' value="' + numberToLocale((totProg / 1000), _nDec) + '" ';	// PATCH!! §§
							} else {
								html += ' value="' + formatNumber((totProg / 1000), _nDec) + '" ';		// La formula regolare
							}																				
							html += '>';
							html += '</td>';
						}
						groupID++;																		// Incrementa l'identificatore di gruppo
					}
				}

				else {	// PATCH (25/11/2019): Aggiorna solo il totale progressivo
					totProg += totParz;																	// Aggiorna il progressivo dei totali parziali
					totParz    = 0;																		// Resetta il totale parziale
				}
			}

			switch (type) {
				case 'input':
				case 'formula':
				case 'empty':

					var cErr = '';
					if (type != 'scenario') {
						cErr  = ((expected * 1000) == totProg)? '' : ' hasErr';
					}

					// Aggiunge il totale di riga o il placeholder totale
					id    =  name + '_totale' + sufx;													// Costruzione ID (NR)
					html += '<td class="tTot">';
//					html += '<span class="um' + cErr + '">' + unMis + '</span>';						// Costruzione Unità misura
					html += '<input readonly tabindex="-1"';											// Definizione tag
					html += ' class="form-control economics finale' + cErr + '"';						// Classe
					html += ' rRef="' + r + '"';														// Attributi di riferimento
					html += ' nRef="' + name + '_totRow' + ((nrRows > 1)? '_' + r : '') + '" ';
					html += ' id="' + id + '"';															// ID e valore
					html += ' value="' + numberToLocale((totProg / 1000), _nDec) + '"';
					html += ' truevalue="' + formatNumber((totProg / 1000), _nDec) + '"';
					html += ' expected="' + expected + '" ';
					html += ' amount="' + amount + '" ';
					html += ' title="Valore atteso: ' + numberToLocale(expected, _nDec) + '"';
					html += '>';
					html += '</td>';
					break;

				case 'double':

					// crea i 4 campi vuoti:
					parz = '';
					parz += '<td class="cumulato" periodo="' + groupID + '">';
//					parz +=   '<span class="um total">' + unMis + '</span>';							// Costruzione Unità misura
					parz +=   '<input';																	// Costruzione campo
					parz +=   ' value=""';																// Valore null (viene valorizzato dopo)
				//	parz +=   ' class="form-control economics calc_number"';							// Classe
					parz +=   ' class="form-control economics "';							// Classe
					parz +=   ' type="text" ';															// Definizione tipo: calcolato = text
					parz +=   ' readonly tabindex="-1"';												// Definizione tag

					for (ii = 1; ii <= 4; ii++) {
						html += parz + ' id="' + name + '_Q' + groupID + '_totale' + ii + '"';			// ID
						html +=   ' periodo="' + groupID + '"';
						html +=   '>';
						html += '</td>';
					}

					html += '<td></td>';
					break;

				case 'scenario':
				//	var valoreBP    = eval($('#bp_' + name).html());
					var valoreBP    = formatNumber(eval($('#bp_' + name).html()), _nDec);
					var Scostamento = totProg - valoreBP;
					var ScostPct    = (Scostamento / valoreBP ) * 100;

					// PATCH (28/11/2019): fa schifo, ma devo metterla per evitare il prblema dei decimali che non vengono considerati correttamente
					if (Scostamento > -10 && Scostamento < 10) {Scostamento = 0}
					if (ScostPct > -10 && ScostPct < 10) {ScostPct = 0}
					html += '<td class="tTot scenarioTit0">';
//					html +=   '<span class="um">' + unMis + '</span>';									// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit1 dark"';						// Classe
					html +=   ' value="' + numberToLocale((totProg / 1000), _nDec) + '"';
					html +=   '>';
//					html +=   '<span class="um">' + unMis + '</span>';									// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit2"';						// Classe
					html +=   ' value="' + numberToLocale((valoreBP / 1000), _nDec) + '"';
					html +=   '>';
//					html +=   '<span class="um">' + unMis + '</span>';									// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit2"';						// Classe
					html +=   ' value="' + numberToLocale((Scostamento / 1000), _nDec) + '"';
					html +=   '>';
//					html +=   '<span class="um">%</span>';												// Costruzione Unità misura
					html +=   '<input readonly tabindex="-1"';											// Definizione tag
					html +=   ' class="form-control economics finale scenarioTit3"';						// Classe
					

					html +=   ' value="' + ( (isNaN(ScostPct))? '--' : numberToLocale((ScostPct), _nDec)) + '"';
					html +=   '>';
					html += '</td>';

					html += '<td></td>';
					break;


				default:
					html += '<td></td>';
			}





			html += '</tr>';																				// Chiusura riga

		}
		html += '</tbody>';

		
		
		html += '</table>';																				// Chiusura tabella scorrevole
		html += '</div>';																				// Chiusura container della tabella scorrevole

	//	$('#' + objID).replaceWith(html);
	//	$('#' + objID + ' [ref=body]').replaceWith(html);
		$('#' + objID + ' [ref=body]').html(html);

	}














	


	// FUNCTION: fieldType_std
	//	Genera HTML di un campo input standard
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_std(params) {
	
		let {value, unMis, name, cRef, group} = params.fieldPars;										// Split dei parametri
	
		let html  = '';																					// Inizializza la stringa di testo HTML
		let dcVal = formatNumber(value / 1000, _nDec);													// Valore formattato da visualizzare
		let id    = name + '_c' + cRef
					
		html += '<td class="mese" periodo="' + group + '">';
//		html +=   '<span class="um">' + unMis + '</span>';												// Costruzione Unità misura
		html +=   '<input type="number" step=".001" ';													// Definizione tipo: input = number
		html +=   ' id="' + id + '"';																	// ID
		html +=   ' class="form-control economics input_number"';										// Classe
		html +=   ' value="'   + dcVal + '"';															// Valore
		html +=   ' nRef="'    + name  + '"';															// Attributi di rif.: nome
		html +=   ' periodo="' + group + '"';
		html +=   '>';	
		html +=   '<input type="hidden"';																// ** 2 - Costruzione campo "Mirror"
		html +=   ' class="mirror"';
		html +=   ' mirror="' + id    + '"';															// "mirror" = ID del campo di input associato
		html +=   ' key="'    + name  + '" ';															// Nome del dataset (serve per il salvataggio dati)
		html +=   ' mese="'   + cRef  + '" ';															// Mese di appartenenza (serve per il salvataggio dati)
		html +=   ' value="'  + value + '" ';
		html +=   '>';
		html += '</td>';

		return html;
	}
	

	// FUNCTION: fieldType_readonly
	//	Genera HTML di un campo in sola lettura
	// PARAMS:
	//	params.fieldPars : elenco dei valori descrittori del campo (valore, nome, gruppo, ecc.)
	// RETURN:
	//	Stringa HTML
	function fieldType_readonly(params) {

		let {value, unMis, name, cRef, group, style, tipo} = params.fieldPars;							// Split dei parametri

		let html  = '';																					// Inizializza la stringa di testo HTML
	//	let dcVal = formatNumber(value / 1000, _nDec);													// Valore formattato da visualizzare
		let dcVal = numberToLocale(value / 1000, _nDec);												// Valore formattato da visualizzare
		
		if (style == null) {style = ' calc_number2';}		// §§§§		SERVONO?!?!?
		if (tipo  == null) {tipo  = 'mese';}				// §§§§

		html += '<td class="' + tipo + '" periodo="' + group + '">';
//		html +=   '<span class="um ' + style + '">' + unMis + '</span>';								// Costruzione Unità misura
		html +=   '<input';																				// Costruzione campo
		html +=   ' value="' + dcVal + '"';																// Valore				
		html +=   ' class="form-control economics ' + style + '"';										// Classe
		html +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		html +=   ' readonly tabindex="-1"';															// Definizione tag
		html +=   '>';
		html += '</td>';

		return html;
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
//		hTags +=   '<span class="um ' + style + '">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' truevalue="' + Value + '"';														// Valore esteso
		hTags +=   ' value="' + dcVal + '"';															// Valore				
		hTags +=   ' class="form-control economics ' + style + '"';										// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
		//	hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '"';								// ID
			hTags +=   ' id="' + name + '_c' + cRef + '"';												// ID
			hTags +=   ' nRef="' + name + '"';															// Attributi di rif.: nome
			hTags +=   ' rRef="' + rRef + '"';															// Attributi di rif.: riga
			hTags +=   ' cRef="' + cRef + '"';															// Attributi di rif.: colonna
			hTags +=   ' periodo="' + group + '"';
		}
		hTags +=   '>';
		hTags += '</td>';

		// ** Secondo campo **
		hTags += '<td class="' + tipo + ' bis" periodo="' + group + '">';
//		hTags +=   '<span class="um ' + style + '2">' + unMis + '</span>';								// Costruzione Unità misura
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' value=""';																			// Valore null (viene valorizzato dopo)
		hTags +=   ' class="form-control economics ' + style + '2"';										// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
		//	hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + '_bis"';							// ID
			hTags +=   ' id="' + name + '_c' + cRef + '_bis"';											// ID
			hTags +=   ' nRef="' + name + '_bis"';														// Attributi di rif.: nome
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


	//	hTags += '<td class="' + tipo + '" periodo="' + group + '">';
		hTags += '<td class="' + tipo + ' hide" periodo="' + group + '">';
		hTags +=   '<input';																			// Costruzione campo
		hTags +=   ' value="' + dcVal + '"';															// Valore				
		hTags +=   ' class="form-control economics ' + style + cBreak +'"';								// Classe
		hTags +=   ' type="text" ';																		// Definizione tipo: calcolato = text
		hTags +=   ' readonly tabindex="-1"';															// Definizione tag
		if (!noID) {
		//	hTags +=   ' id="' + name + '_r' + rRef + '_c' + cRef + sufx + '"';							// ID
			hTags +=   ' id="' + name + '_c' + cRef + sufx + '"';										// ID
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

			var value   = $(this).val();																	// Valore del campo modificato
			var field   = $(this).attr('id');															// ID del campo
			var name    = $(this).attr('nref');															// Nome del dataset di appartenenza
			var groupID = $(this).attr('periodo');														// Nome del dataset di appartenenza
			
			$(this).addClass('hasWarning bold').val(formatNumber(value, _nDec));						// Formattazione del valore
			$($(this).prev()).addClass('hasWarning bold');
			$('[mirror=' + field +']').val(parseInt(value * 1000));										// Aggiorna il campo di mirror

		//	if (showTotals) {
			if ($(myTable + 'tr[ref=' + name + '] input.progressivo').length > 0) {

				// Aggiorna il totale del gruppo:
				var parz = 0;
				var qID  = myTable + '#' + name + '_Q' + groupID;

				$(myTable + 'tr[ref=' + name + '] td[periodo=' + groupID + '] .mirror').each(function(e){
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
			}
			else {

				// §§§§§§§ Patch
				var progr = 0;																					// Valore cumulato dei campi
				$(myTable + '[key=' + name + ']').each(function(){		// PATCH: forma supersintetica per puntare ai campi mirror della riga
					progr += (eval($(this).val()) / 1000);
				});
			}

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
						xhtml += $(cells[0]).find('label').text();
						xhtml += '</label>';
						xhtml += '<span class="floatRight">€</span>';
						xhtml += '</td>';
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
			
				//	$('#' + nodeName + '_r1_c' + col + '_bis')
				$('#' + nodeName + '_c' + col + '_bis')
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

				//	totBudget     += eval($('[id=' + nodeName + '_r1_c' + col + ']').attr('truevalue'));
				//	totConsuntivo += eval($('[id=' + nodeName + '_r1_c' + col + '_bis]').attr('truevalue'));
					totBudget     += eval($('[id=' + nodeName + '_c' + col + ']').attr('truevalue'));
					totConsuntivo += eval($('[id=' + nodeName + '_c' + col + '_bis]').attr('truevalue'));
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