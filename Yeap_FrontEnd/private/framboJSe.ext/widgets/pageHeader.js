//----------------------------------------------------------------------------------------
// File  : pageHeader.js
//
// Desc  : Costruzione dell'header delle pagine, con titolo, link ai tutorial, ecc.
// Path  : /Private/framboJse.ext/widgets
// target:  <widget_pageHeader />
// output:  label
//----------------------------------------------------------------------------------------
define([], function () {

	var _ITEMNAME = 'pageHeader';
	var _ITEMTAG  = 'widget_';
	return {
		itemName : _ITEMNAME,																			// Item's name
		itemTag  : _ITEMTAG,																			// Item's tag prefix
		BuildHtml: buildHtml,																			// Item's HTML
		Extend   : extend,																				// Callback function management
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

		// ** Inizializzazione variabili **
		var myHtml      = '';																			// Stringa per costruzione HTML
		var btnPrev     = '';																			// Stringa per costruzione HTML
		var btnNext     = '';																			// Stringa per costruzione HTML
		var pageID      = __SYS_config.current.pageID;													// Ricava l'ID di pagina
		var targetGuida = 'windowGuida';																// Nome della finestra container del manuale
		var targetVideo = 'windowVideo';																// Nome della finestra container dei video
		var pageList    = buildPageList();																// Array delle pagine
		var myPage      = (pageList[pageID] != undefined)? pageList[pageID] : '';						// Recupera i valori specifici della pagina

		var changedMsg = 'Attenzione! I dati sono stati modificati. Ricordarsi di salvare prima di uscire.';


		// ** Costruzione HTML **

		if (myPage != '' && myPage.pagePrev.url && myPage.pagePrev.url != '') {
			pTitle   = "«" + pageList[myPage.pagePrev.id].titolo + "»";
			btnPrev += '<a id="pagePrev" class="changePage" href="' + myPage.pagePrev.url + '">';	// message="Vai alla pagina ' + pTitle + '">';
			btnPrev +=   '<i class="fa fa-angle-double-left"></i>';
			btnPrev += '</a>';
		} else {
			pTitle  = '';
			btnPrev = '<span class="changePage"><i class="fa fa-angle-double-left"></i></span>';
		}

		if (myPage != '' && myPage.pageNext.url && myPage.pageNext.url != '') {
			nTitle   = "«" + pageList[myPage.pageNext.id].titolo + "»";
			btnNext += '<a id="pageNext" class="changePage" href="' + myPage.pageNext.url + '">';	// message="Vai alla pagina ' + nTitle + '">';
			btnNext +=   '<i class="fa fa-angle-double-right"></i>';
			btnNext += '</a>';
		} else {
			nTitle  = '';
			btnNext = '<span class="changePage"><i class="fa fa-angle-double-right"></i></span>';
		}


		myHtml += '<div class="' + _ITEMNAME + pbAttrs[0] + '" pageid="' + pageID + '">';				// Sezione titolo
		myHtml +=   '<div id="mainTitle" class="row">';
		myHtml +=     '<div class="col-12">';
		myHtml +=       '<h2 class="pageTitle textCenter">';
		myHtml +=         btnPrev;
		myHtml +=         '<span class="margin-h-10">' + myPage.titolo + '</span>';
		myHtml +=         btnNext;
		myHtml +=         '<div class="float-right">';													// Sezione pulsanti di help

		if (myPage.urlGuida && myPage.urlGuida != '') {
			myHtml +=       '<a class="infoLnk" id="infoGuida" target="guida" href="' + myPage.urlGuida + '">';
			myHtml +=         '<i class="fa fa-question-circle"></i>';
			myHtml +=       '</a>';
		}

		if (myPage.urlVideo && myPage.urlVideo != '') {
			myHtml +=       '<a class="infoLnk" id="infoVideo" target="video" href="' + myPage.urlVideo + '" >';
			myHtml +=         '<i class="fa fa-film"></i>';
			myHtml +=       '</a>';
		}

		myHtml +=         '</div>';
		myHtml +=       '</h2>';

		myHtml +=       '<div class="btn-group-arrow">';												// Sezione breadcrumbs
		if (myPage.menuPath) {
			for (var i = 0; i < myPage.menuPath.length; i++) {
				myHtml += '<button type="button" class="btn btn-arrow-right btn-no-over btn-default' + ((i === 0) ? ' first' : '') + '">';
				myHtml += myPage.menuPath[i];
				myHtml += '</button> ';
			}
		}
		if (myPage.menuPath) {
			myHtml +=     '<button type="button" class="btn btn-arrow-right btn-no-over btn-action-l">';
		} else {
			myHtml +=     '<button type="button" class="btn btn-arrow-right btn-no-over btn-action-l first">';
		}
		myHtml +=          myPage.titolo;
		myHtml +=        '</button> ';

		myHtml +=        '<div class="infoMsg-container">';												// Sezione messaggi finale

		myHtml +=          '<p id="infoSave-msg" class="infoMsgSave">' + changedMsg + '</p>';			// 1° messaggio
		myHtml +=          '<p id="infoGuida-msg" class="infoMsg">';									// 2° messaggio
		myHtml +=            'Visualizza <b>IL DOCUMENTO</b> contenente le istruzioni relative alla compilazione della pagina corrente.';
		myHtml +=          '</p>';
		myHtml +=          '<p id="infoVideo-msg" class="infoMsg">';									// 3° messaggio
		myHtml +=            'Visualizza <b>IL VIDEO TUTORIAL</b> con le indicazioni per la compilazione della pagina corrente.';
		myHtml +=          '</p>';
		myHtml +=          '<p id="pagePrev-msg" class="pageMsg">';										// 4° messaggio
		myHtml +=            'Vai alla pagina precedente: <b>' + pTitle + '</b>';
		myHtml +=          '</p>';
		myHtml +=          '<p id="pageNext-msg" class="pageMsg">';										// 4° messaggio
		myHtml +=            'Vai alla pagina successiva: <b>' + nTitle + '</b>';
		myHtml +=          '</p>';
		myHtml +=        '</div>';

		// Chiusure dei DIV
		myHtml +=     '</div>';
		myHtml +=   '</div>';
		myHtml += '</div>';

		// Sezione titolo di scroll
		myHtml += '<h2 id="scrollTitle">';
		if (myPage.menuPath) {
			for (i = 0; i < myPage.menuPath.length; i++) {
				myHtml += myPage.menuPath[i];
				myHtml += ' <i class="fas fa-angle-right"></i> ';
			}
		}
		myHtml += '<span>' + myPage.titolo + '</span>';
		myHtml += '<span class="infoMsgSave">' + changedMsg + '</span>';
		myHtml += '</h2>';


		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });

	}


	// FUNCTION: buildPageList
	//  Costruisce l'elenco delle pagine censite con nomi, URL, ecc.
	// PARAMS:
	//	none
	// RETURN:
	//	Elenco delle definizioni
	function buildPageList() {

		var pathGuida     = '/private/resources/pdf/manualeYeap.pdf';									// Path dei file del manuale (HTML)
		var pathVideo     = '/video/';																	// Path dei video tutorial
		var menuGroup_1   = 'Dati Previsionali';														// Scorciatoie: nomi dei gruppi dei menu
		var menuGroup_2   = 'Prospetti';
		var menuGroup_3   = 'Report';
		var menuGroup_4   = 'Controllo gestione';
		var menuGroup_5   = 'Dati Testuali';
		var menuGroup_1_1 = 'Immobilizzazioni';
		var menuGroup_1_2 = 'Esercizio precedente';

		// ** Elenco delle definizioni **
		var pList = {

			// 0 - Welcome
			welcome: {
				titolo  : 'WELCOME',
				urlGuida: pathGuida + '#page=0',
				urlVideo: '',
				pagePrev: '',
				pageNext: '',
			},

			// 1 - Anagrafica
			settings: {																					// Pagina: anagrafica
				titolo  : 'ANAGRAFICA',
				urlGuida: pathGuida + '#page=6',
				urlVideo: pathVideo + 'Anagrafica.mp4',
				pagePrev: '',
				pageNext: '',
			},


			// 2 - Posizionamento
			qualitativa: {																				// Pagina: qualitativa
				titolo  : 'POSIZIONAMENTO',
				urlGuida: pathGuida + '#page=6',
				urlVideo: pathVideo + 'Posizionamento.mp4',
				pagePrev: '',
				pageNext: '',
			},


			// 3 - Dati previsionali
			impostazioni: {																				// Pagina: impostazioni
				titolo  : 'IMPOSTAZIONI',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=9',
				urlVideo: pathVideo + 'Impostazioni.mp4',
				pagePrev: '',
				pageNext: {id: 'iva', url: '/economics/iva'},
			},
			iva: {																						// Pagina: IVA
				titolo: 'PERCENTUALI IVA',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=10',
				urlVideo: pathVideo + 'Iva.mp4',
				pagePrev: {id: 'impostazioni', url: '/economics/impostazioni'},
				pageNext: {id: 'ricavi', url: '/economics/ricavi'},
			},
			ricavi: { 																					// Pagina: ricavi
				titolo  : 'RICAVI',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=10',
				urlVideo: pathVideo + 'Ricavi.mp4',
				pagePrev: {id: 'iva', url: '/economics/iva'},
				pageNext: {id: 'costiEsterni', url: '/economics/costi-esterni'},
			},
			costiEsterni: {																				// Pagina: aquisti e magazzino
				titolo  : 'ACQUISTI E MAGAZZINO',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=11',
				urlVideo: pathVideo + 'AcquistiMagazzino.mp4',
				pagePrev: {id: 'ricavi', url: '/economics/ricavi'},
				pageNext: {id: 'costiVariabili', url: '/economics/costi-variabili'},
			},
			costiVariabili: {																			// Pagina: costi variabili
				titolo  : 'COSTI VARIABILI',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=11',
				urlVideo: pathVideo + 'CostiVariabili.mp4',
				pagePrev: {id: 'costiEsterni', url: '/economics/costi-esterni'},
				pageNext: {id: 'costiInterni', url: '/economics/costi-interni'},
			},
			costiInterni: {																				// Pagina: costi interni
				titolo  : 'COSTI INTERNI',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=11',
				urlVideo: pathVideo + 'CostiInterni.mp4',
				pagePrev: {id: 'costiVariabili', url: '/economics/costi-variabili'},
				pageNext: {id: 'risorseUmane', url: '/economics/risorse-umane'},
			},
			risorseUmane: {																				// Pagina: risorse umane
				titolo  : 'RISORSE UMANE',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=12',
				urlVideo: pathVideo + 'RisorseUmane.mp4',
				pagePrev: {id: 'costiInterni', url: '/economics/costi-interni'},
				pageNext: {id: 'gestStraordinaria', url: '/economics/gestione-straordinaria'},
			},
			gestStraordinaria: {																		// Pagina: gestione staordinaria
				titolo  : 'GESTIONE STRAORDINARIA',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=12',
				urlVideo: pathVideo + 'GestStraordinaria.mp4',
				pagePrev: {id: 'risorseUmane', url: '/economics/costi-interni'},
				pageNext: {id: 'materiali', url: '/economics/materiali'},
			},
			// ---- Submenu: Immobilizzazioni
					materiali: {																		// Pagina: materiali
						titolo  : 'MATERIALI',
						menuPath: [menuGroup_1, menuGroup_1_1],
						urlGuida: pathGuida + '#page=13',
						urlVideo: pathVideo + 'Immobilizzazioni.mp4',
						pagePrev: {id: 'gestStraordinaria', url: '/economics/gestione-straordinaria'},
						pageNext: {id: 'immateriali', url: '/economics/immateriali'},
					},
					immateriali: {																		// Pagina: immateriali
						titolo  : 'IMMATERIALI',
						menuPath: [menuGroup_1, menuGroup_1_1],
						urlGuida: pathGuida + '#page=13',
						urlVideo: pathVideo + 'Immobilizzazioni.mp4',
						pagePrev: {id: 'materiali', url: '/economics/materiali'},
						pageNext: {id: 'finanziarie', url: '/economics/finanziarie'},
					},
					finanziarie: {																		// Pagina: finanziaria
						titolo  : 'FINANZIARIE',
						menuPath: [menuGroup_1, menuGroup_1_1],
						urlGuida: pathGuida + '#page=13',
						urlVideo: pathVideo + 'Immobilizzazioni.mp4',
						pagePrev: {id: 'immateriali', url: '/economics/immateriali'},
						pageNext: {id: 'fonti', url: '/economics/fonti'},
					},
			fonti: {																					// Pagina: aumenti capitale
				titolo  : 'AUMENTI CAPITALE',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=14',
				urlVideo: pathVideo + 'AumentiCapitale.mp4',
				pagePrev: {id: 'finanziarie', url: '/economics/finanziarie'},
				pageNext: {id: 'finanziamenti', url: '/economics/finanziamenti'},
			},
			finanziamenti: {																			// Pagina: finanziamenti
				titolo  : 'FINANZIAMENTI',
				menuPath: [menuGroup_1],
				urlGuida: pathGuida + '#page=14',
				urlVideo: pathVideo + 'Finanziamenti.mp4',
				pagePrev: {id: 'fonti', url: '/economics/fonti'},
				pageNext: (__WACookie.annoPrec == 1 ? {id: 'annoPrecInsert', url: '/economics/anno-precedente-insert'} : ''),	// Se anno prec è abilitato assegna il link
			},
			// ---- Submenu: Anno Precedente
					annoPrecInsert: {																	// Pagina: inserimento dati anno precedente
						titolo  : 'INSERIMENTO DATI',
						menuPath: [menuGroup_1, menuGroup_1_2],
						urlGuida: pathGuida + '#page=14',
						urlVideo: pathVideo + 'AnnoPrec_TR.mp4',
						pagePrev: {id: 'finanziamenti', url: '/economics/finanziamenti'},
						pageNext: {id: 'annoPrecProspetto', url: '/economics/anno-precedente-prospetto'},
					},
					annoPrecProspetto: {																// Pagina: prospetto anno precedente
						titolo  : 'PROSPETTO COMPILATO',
						menuPath: [menuGroup_1, menuGroup_1_2],
						urlGuida: pathGuida + '#page=14',
						urlVideo: pathVideo + 'AnnoPrec_TR.mp4',
						pagePrev: {id: 'annoPrecInsert', url: '/economics/anno-precedente-insert'},
						pageNext: {id: 'annoPrecConferma', url: '/economics/anno-precedente-conferma'},
					},
					annoPrecConferma: {																	// Pagina: conferma anno precedente
						titolo  : 'ESITO E CONFERMA',
						menuPath: [menuGroup_1, menuGroup_1_2],
						urlGuida: pathGuida + '#page=14',
						urlVideo: pathVideo + 'AnnoPrec_TR.mp4',
						pagePrev: {id: 'annoPrecProspetto', url: '/economics/anno-precedente-prospetto'},
						pageNext: '',
					},


			// 4 - Prospetti
			contoEconomico: {																			// Pagina: conto economico
				titolo  : 'CONTO ECONOMICO',
				menuPath: [menuGroup_2],
				urlGuida: pathGuida + '#page=15',
				urlVideo: pathVideo + 'Prospetti.mp4',
				pagePrev: '',
				pageNext: {id: 'rendiconto', url: '/economics/rendiconto-finanziario'},
			},
			rendiconto: {																				// Pagina: rendiconto finanziario
				titolo  : 'RENDICONTO FINANZIARIO',
				menuPath: [menuGroup_2],
				urlGuida: pathGuida + '#page=15',
				urlVideo: pathVideo + 'Prospetti.mp4',
				pagePrev: {id: 'contoEconomico', url: '/economics/conto-economico'},
				pageNext: {id: 'statoPatrimoniale', url: '/economics/stato-patrimoniale'},
			},
			statoPatrimoniale: {																		// Pagina: stato patrimoniale
				titolo  : 'STATO PATRIMONIALE',
				menuPath: [menuGroup_2],
				urlGuida: pathGuida + '#page=15',
				urlVideo: pathVideo + 'Prospetti.mp4',
				pagePrev: {id: 'rendiconto', url: '/economics/rendiconto-finanziario'},
				pageNext: {id: 'fontiFinanziarie', url: '/economics/fonti-finanziarie'},
			},
			fontiFinanziarie: {																			// Pagina: fonti finanziarie
				titolo  : 'FONTI FINANZIARIE',
				menuPath: [menuGroup_2],
				urlGuida: pathGuida + '#page=15',
				urlVideo: pathVideo + 'Prospetti.mp4',
				pagePrev: {id: 'statoPatrimoniale', url: '/economics/stato-patrimoniale'},
				pageNext: '',
			},


			// 5 - Report
			repLeanus: {																					// Pagina: Report Leanus
				titolo  : 'ANALISI LEANUS',
				menuPath: [menuGroup_3],
				urlGuida: '',
				urlVideo: '',
				pagePrev: '',
				pageNext: '',
			},
			repTestiWord: {																					// Pagina: Report Leanus
				titolo  : 'Report Testi',
				menuPath: [menuGroup_3],
				urlGuida: '',
				urlVideo: '',
				pagePrev: '',
				pageNext: '',
			},
			repProspWord: {																					// Pagina: Report Leanus
				titolo  : 'Report Business Plan',
				menuPath: [menuGroup_3],
				urlGuida: '',
				urlVideo: '',
				pagePrev: '',
				pageNext: '',
			},


			// 6 - Valutazione e messaggi
			messaggi: {																					// Pagina: messaggi
				titolo  : 'VALUTAZIONE & MESSAGGI',
				urlGuida: pathGuida + '#page=16',
				urlVideo: pathVideo + 'Valutazione.mp4',
				pagePrev: '',
				pageNext: '',
			},


			// 7 - Controllo di gestione
			cdgCrea: {																					// Pagina: IVA
				titolo  : 'IMPORTA DATI PREVISIONALI',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: '',
				pageNext: {id: 'cdgDistribuzione', url: '/controllo/distribuzione-mensile'},
			},
			cdgDistribuzione: {																			// Pagina: IVA
				titolo  : 'DISTRIBUZIONE MENSILE',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'cdgCrea', url: '/controllo/crea'},
				pageNext: {id: 'cdgImporta', url: '/controllo/importa-consuntivo'},
			},
			cdgImporta: {																				// Pagina: IVA
				titolo  : 'IMPORTA CONSUNTIVO',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'cdgDistribuzione', url: '/controllo/distribuzione-mensile'},
				pageNext: {id: 'cdgAnalisi', url: '/controllo/analisi-indici'},
			},
			cdgAnalisi: {																				// Pagina: IVA
				titolo  : 'ANALISI INDICI',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=18',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'cdgImporta', url: '/controllo/importa-consuntivo'},
				pageNext: {id: 'cdgScostamenti', url: '/controllo/scostamenti'},
			},
			cdgScostamenti: {																			// Pagina: IVA
				titolo  : 'SCOSTAMENTI',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'cdgAnalisi', url: '/controllo/analisi-indici'},
				pageNext: {id: 'cdgForecast', url: '/controllo/forecast'}
			},
			cdgForecast: {																				// Pagina: IVA
				titolo  : 'FORECAST',
				menuPath: [menuGroup_4],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'cdgScostamenti', url: '/controllo/scostamenti'},
				pageNext: '',
			},

			// 6 - Dati testuali
			dtDescrizione: {																			// Pagina: Descrizione azienda
				titolo  : 'Descrizione azienda',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: '',
				pageNext: {id: 'dtProdotto', url: '/testuali/prodotto-processo'},
			},
			dtProdotto: {																				// Pagina: Descrizione azienda
				titolo  : 'Prodotto e processo',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'dtDescrizione', url: '/testuali/descrizione-azienda'},
				pageNext: {id: 'dtMercato', url: '/testuali/analisi-mercato'},
			},
			dtMercato: {																				// Pagina: Analisi mercato
				titolo  : 'Analisi mercato',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'dtProdotto', url: '/testuali/prodotto-processo'},
				pageNext: {id: 'dtPosizione', url: '/testuali/posizione-competitiva'},
			},
			dtPosizione: {																				// Pagina: Posizione competitiva
				titolo  : 'Posizione competitiva',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'dtMercato', url: '/testuali/analisi-mercato'},
				pageNext: {id: 'dtManagement', url: '/testuali/management'},
			},
			dtManagement: {																				// Pagina: Posizione competitiva
				titolo  : 'Management',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'dtPosizione', url: '/testuali/posizione-competitiva'},
				pageNext: {id: 'dtExecutive', url: '/testuali/executive-summary'},
			},
			dtExecutive: {																				// Pagina: Posizione competitiva
				titolo  : 'Executive summary',
				menuPath: [menuGroup_5],
				urlGuida: pathGuida + '#page=2',
				urlVideo: pathVideo + '',
				pagePrev: {id: 'dtManagement', url: '/testuali/management'},
				pageNext: '',
			},

		};

		return pList;
	}



	// FUNCTION: extend
	//  extends functionality of snippet/widget after object creation in the DOM.
	// PARAMS:
	//  domain : html object container.
	// RETURN:
	//  Object's callback functions
	function extend(params) {

		$('.infoLnk')
			.mouseover(function (e) {																	// Mostra descrizione dei pulsanti
				var id = $(this).attr('id');
				$('#' + id + '-msg').css('display', 'block');
			})
			.mouseout(function (e) {																	// Nasconde descrizione dei pulsanti
				$('.infoMsg').hide();
			})
			.click(function (e) {																		// Gestione azione dei pulsanti

				e.preventDefault();

				var id = $(this).attr('id');
				var href = $(this).attr('href');

				if (id === 'infoGuida') {
					PopupPdf(href);
				} else {
					PopupVideo(href);
				}
			});

		$('.changePage')
			.mouseover(function (e) {																	// Mostra descrizione dei pulsanti
				var id = $(this).attr('id');
				$('#' + id + '-msg').css('display', 'block');
			})
			.mouseout(function (e) {																	// Nasconde descrizione dei pulsanti
				$('.pageMsg').hide();
			})

	}


	// FUNCTION: PopupPdf
	//  extends Visualizza il popup della guida PDF
	// PARAMS:
	//  url : URL del documento, con hashtag del capitolo sul quale posizionarsi
	// RETURN:
	//  Object's callback functions
	function PopupPdf(url) {
		var urlLoading = "/private/resources/images/LoadGif.gif";
		var title = 'GuidaPdf';
		var widthPage = 700;
		var heightPage = 500;
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
		var systemZoom = width / window.screen.availWidth;
		var left = (width - widthPage) / 2 / systemZoom + dualScreenLeft;
		var top = (height - heightPage) / 2 / systemZoom + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, toolbar=no, location=no, directories=no, addressbar=no,tatus=no, menubar=no, resizable=no, copyhistory=no, width=' + widthPage / systemZoom + ', height=' + heightPage / systemZoom + ', top=' + top + ', left=' + left);

		newWindow.focus();
		if (navigator.userAgent.indexOf("Firefox") !== -1) { //nel caso di firefox il browser non accetta reload cosi aggiungo una loading gif e poi ricarico la pagina di nuovo
			newWindow.location.href = urlLoading;
			setTimeout(function () {
				newWindow.location.href = url;
			}, 100);
		} else {
			newWindow.location.reload();
		}

	}


	// FUNCTION: PopupVideo
	//  extends Visualizza il popup della guida PDF
	// PARAMS:
	//  url : URL del video
	// RETURN:
	//  Object's callback functions
	function PopupVideo(url) {

		var newWindow;
		var host = location.hostname;
		var myHtml = '';

		var urlLoading = "/private/resources/images/LoadGif.gif";
		var title = 'GuidaPdf';
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
		var width = 729;
		var height = 415;


		if (url !== null && url !== '/video/') {

			// Video container
			myHtml += '<video id="IdVideo" src="' + host + url + '" controls autoplay="autoplay" style="width:100%">';
			myHtml += 'Your browser does not support the <code>video</code> element.';
			myHtml += '</video>';

		} else {
			myHtml += '<div style="background-image: linear-gradient(to bottom right, #999, #fff); height:' + (height - 10) + 'px">';
			myHtml += '<h1 style="text-align:center; padding-top: 150px;">Il video al momento<br>non è disponibile</h1>';
			myHtml += '</div>';
		}
		newWindow = window.open( url, 'video', 'scrollbars=yes, toolbar=no, location=no, directories=no, addressbar=no,tatus=no, menubar=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height);
		//newWindow.document.body.innerHTML = myHtml;

		newWindow.focus();

	}


});