//----------------------------------------------------------------------------------------
// File  : btnConsole.js
//
// Desc  : Costruzione della console dei pulsante gestione pagg. economics
// Path  : /Private/framboJse.ext/widgets
// target:  <widget_btnConsole />
// output:  label
//----------------------------------------------------------------------------------------
define([
	'dd_base',
	'economicsModel',	// ?????????????????????????? per il momento aggancia ancora questo
//	'testualiModel',
], function (base, model) {

	var _ITEMNAME = 'btnConsole_testuali';
	var _ITEMTAG  = 'widget_';

	return {
		itemName : _ITEMNAME,																			// Item's name
		itemTag  : _ITEMTAG,																			// Item's tag prefix
		BuildHtml: buildHtml,																			// Item's HTML
		Extend   : extend																				// Callback function management
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

		return model.Common_Get({																		// Invia richiesta a SAAS
			page: 'menu',
			token: __WACookie.Token,
			onSuccess: function () { }
		}).then(function (params) {


			var data = $($.parseXML(params.d));														// Parse dell'XML di ritorno
			var nome = decodeURIComponent(data.find('Nome').text());									// Nome del Business Plan
			var anni = eval(data.find('NumAnni').text()) / 1000;										// Riscala il nr. di anni
			var code = data.find('CodiceTipologia').text();												// Codice tipologia azienda
			var tipo = decodeURIComponent(data.find('Tipologia').text());								// Descrizione tipologia azienda
			var init = eval(data.find('AnnoInizio').text()) / 1000;										// Riscala il nr. di anni
			var BP = eval(data.find('StatusBP').text());												// Status Business Plan: 0 = vuoto, 1 = salvato, 2 = compilato, 3 = inviato, 4 = elaborato (ok Leanus), 99 = errore
			var QA = data.find('StatusQA').text();													// Status Analisi Qualitativa: 0 = vuoto, 1 = salvato, 2 = calcolato.


			tagPars.itemName = _ITEMNAME;

			var pageID = __SYS_config.current.pageID;

			var myHtml = '';
			var Class  = 'padding-h-30 btn btn-action-light';
			var Class1 = 'padding-h-30 btn btn-action-demilight1';
			var Class2 = 'padding-h-30 btn btn-action-demilight2';

			var bpStat = {
				0: 'Vuoto',										// NESSUNO
				1: 'Salvato (D.P.)',							// DP_SALVATO
				2: 'Confermato (D.P.)',							// DP_COMPILATO
				97: 'Non confermato (D.P.)',					// DP_ERRORE

				3: 'Salvato (A.P.)',							// AP_SALVATO
				4: 'Confermato (A.P.)',							// AP_COMPILATO_OK
				41: 'Compilato',								// AP_COMPILATO_OK
			//	5 :	'Confermato con avvisi (A.P.)',				// AP_COMPILATO_WRN
			//	6 :	'Confermato con errori (A.P.)',				// AP_COMPILATO_ERR
				98: 'Non confermato (A.P.)',					// AP_ERRORE

				7: 'Compilato (certificato)',					//BP_CERTIFICATO
				8: 'Compilato (forzato)',						//BP_FORZATO
				9: 'Compilato (non certificato)',				//BP_NONCERTIFICATO

				10: 'Inviato',									// BP_INVIATO
				11: 'Elaborato',								// BP_ELABORATO
				99: 'Compilato con errori',						// BP_ERRORE
			}

			var piano = ['iva', 'ricavi', 'costiEsterni', 'costiVariabili', 'costiInterni', 'risorseUmane',
				'fonti', 'investimenti', 'finanziamenti', 'materiali', 'immateriali', 'finanziarie', 'gestStraordinaria'];
			var prosps = ['contoEconomico', 'rendiconto', 'statoPatrimoniale', 'fontiFinanziarie'];
			var others = ['impostazioni', 'settings', 'qualitativa', 'leanus'];
			var anno_1 = ['annoPrecInsert'];
			var anno_2 = ['annoPrecProspetto'];
			var anno_3 = ['annoPrecConferma'];


			var btnSave    = false;
			var btnConfirm = false;
			var btnCompile = false;
			var btnProcedi = false;
			var btnMessage = false;
			var btnSave2   = false;

			var disableBtn = false;																		// Flag per la disabilitazione pulsante Salva e conferma/compila

			
			// Patch: trial_expired => salta la procedura di abilitazione dei pulsanti
			if (__WACookie.trial_expired != 'true') {

				switch (true) {
					case piano.includes(pageID):
						btnSave = true;
						if (__WACookie.annoPrec == 1) {														// Se è abilitato Anno Precedente visualizza "precompila"
							btnConfirm = true;
						} else {
							btnCompile = true;
							if (BP < 1) { disableBtn = true; }
						}
						btnMessage = true;
						break;

					case prosps.includes(pageID):
						btnMessage = true;
						break;

					case others.includes(pageID):
						btnSave = true;
						break;

					case anno_1.includes(pageID):
						btnSave = true;
						btnConfirm = true;
						btnMessage = true;
						if (BP < 2 || BP === 97) {															// Se non è almeno in stato Precompilato (Dati previsionali)
							disableBtn = true;
						}
						break;
					case anno_2.includes(pageID):
						if (BP !== 4)
							disableBtn = true;
						btnMessage = true;
						btnProcedi = true;
						break;
					case anno_3.includes(pageID):
						btnMessage = true;
						break;

				}

			} //fine trial_expired

			// Costruzione HTML
			myHtml += '<div class="margin-h-15 ' + _ITEMNAME + pbAttrs[0] + '" pageid="' + pageID + '">';
			myHtml += '<div id="statusInfo" class="floatLeft">';
			myHtml += '<p class="margin-a-0">';
			myHtml += '<span id="bpc" title="Code: ' + BP + '"><i class="fa fa-caret-right"></i></span> ';
			myHtml += 'Status del Business Plan: <span class="status" title="' + BP + '">' + bpStat[BP] + '</status>';		// Status del BP
			myHtml += '</p>';
			myHtml += '</div>';
			myHtml += '<div class="floatRight">';


			// Btn Salva
			if (btnSave) {
			//	myHtml += '<a class="' + Class + ' disabled" href="#s" id="btn-save"><i class="far fa-save margin-r-5"></i> Salva</a>';
				myHtml += '<a class="' + Class + '" href="#s" id="btn-save"><i class="far fa-save margin-r-5"></i> Salva</a>';
			}

			// Btn Compila
			if (btnCompile) {
			//	myHtml += '<a class="' + Class2 + ' disabled ' +  ((disableBtn) ? 'btnInactive' : '') + '" ';				// La classe 'btnInactive'indica lo stato offline "assoluto" (disabilitato e non abilitabile)
				myHtml += '<a class="' + Class2 + ' ' +  ((disableBtn) ? 'btnInactive' : '') + '" ';				// La classe 'btnInactive'indica lo stato offline "assoluto" (disabilitato e non abilitabile)
				myHtml += 'href="#c" id="btn-compile"><i class="fa fa-cubes margin-r-5"></i>Salva e Compila</a>';
			}

			// Btn Conferma (precompila)
			if (btnConfirm) {
			//	myHtml += '<a class="' + Class1 + ' disabled ' +  ((disableBtn) ? 'btnInactive' : '') + '" ';				// Forse è inutile la classe 'btnInactive'
				myHtml += '<a class="' + Class1 + ' ' +  ((disableBtn) ? 'btnInactive' : '') + '" ';				// Forse è inutile la classe 'btnInactive'
				myHtml += 'href="#c" id="btn-confirm"><i class="fa fa-cogs margin-r-5"></i> Salva e Conferma</a>';
			}

			// Btn Procedi
			if (btnProcedi) {
				myHtml += '<a class="' + Class2 + ((disableBtn) ? ' disabled' : '') + '" ';
				myHtml += 'href="#c" id="btn-compile"><i class="fa fa-cubes margin-r-5"></i>Consolida e Procedi</a>';
			}

			// Btn Messaggi
			if (btnMessage) {
				myHtml += '<a class="' + Class + '" href="/economics/messaggi" id="btn-ricevi" ';
				if (__WACookie.showErr) {
					myHtml += ' title="Notifiche abilitate"><i class="fa fa-eye margin-r-5"></i>';
				} else {
					myHtml += ' title="Notifiche disabilitate"><i class="fa fa-eye-slash margin-r-5"></i>';
				}
				myHtml += 'Messaggi';
				myHtml += '</a>';
			}
			myHtml += '</div>';
			myHtml += '<div class="clearRight"></div>';

			if (disableBtn && pageID == 'annoPrecInsert') {
				myHtml += '<div class="margin-t-10 textCenter">';
				myHtml += '<label class="msg"><b>Attenzione!</b> Per sbloccare il pulsante "Salva e Conferma" è necessario prima Salvare e Confermare i <b>Dati Previsionali</b></label>';
				myHtml += '</div>';
			}

			myHtml += '</div>';

			return myHtml;
		});
	}


	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function extend(params) {

		var myWatchStatus;																				// Traccia l'ID delle chiamate setTimeout
		var buttons = '#btn-save, #btn-compile, #btn-confirm';											// ID dei pulsanti interessati dalla gestione dello stato "pagina modificata"

		myWatchStatus = watchSaveBtnState();															// Avvia il watcher al caricamento della pagina

		// ** Reset del flag "changed" **
		$(buttons).click(function(){
		
			__SYS_status.hasChanged = false;															// Aggiornamento STATUS globale: disattiva il flag di valore modificato

			// Toglie le classi "hasChanged"
			$('.hasChanged').removeClass('hasChanged');
			$('.hasChangedWithErr').removeClass('hasChangedWithErr').addClass('hasErr');

			// Disabilita il warning e rilancia il watcher in attesa di una nuova modifica
			$('.infoMsgSave').hide();
			myWatchStatus = watchSaveBtnState();

		});

// PATCH (28/11/2019): disattivata la gestione "disabled" dei pulsanti -> "Salva" e "Salva e conferma" rimangono sempre attivi
		//  ** Funzione di Watcher per i pulsanti "Salva" **
		function watchSaveBtnState(){																	//  Gestisce il watcher del pulsante "Salva" per abilitarlo dopo una modifica dei dati

			if (__SYS_status.hasChanged) {
				$('.infoMsgSave').show();																// Visualizza il warnig di promemoria
			} else {
				myWatchStatus = setTimeout( function(){ watchSaveBtnState()}, 1500);					// Se non è cambiato lo status della pagina, rilancia il watcher (altrimenti è inutile: è già tracciato)
			}
		}


	}
})
