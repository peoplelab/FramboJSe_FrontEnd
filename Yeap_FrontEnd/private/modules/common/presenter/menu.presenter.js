//----------------------------------------------------------------------------------------
// File: menu.presenter.js
//
// Desc: Gestione del menu comune
// Path: /Private/modules/common/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
//	'/private/modules/economics/model/economics.model.js',
//	'/private/modules/common/controller/report.controller.js',
	'economicsModel',
	'reportController',
], function (pBase, th, snippets, modals, model, cReport) {

	// ** Module management **
	var _module = { id: 'menu.presenter.js' };									// Maps the current module
	var _resources = {};														// Mapping of the additional resources (.css and/or .js files)

	var _xml       = '';
	var _container = '';														// ID of the dashboard container
	var _navbarID  = '';														// ID of the dashboard template
	var _subjectID = '';
	var _modalsContainer = '#modalsContainer';									// Target container (ID) for the modal windows

	var _disableIdList      = ['qualitativaTitle', 'economicsTitle'];			// list of menu blocks to disable at first login in order to force setup
	var _existConfiguration = false;
	var _pageContainer      = '#menuContainer';									// Target container (ID) for the list template 

	var _reportBlankURL = '/private/templates/home/blankReport.html';			// Pagina di cortesia in attesa del report

	return {
		Init: init,																// Initializes (setup) the dashboard
		Render: renderMenu,														// Render del contenuto menu
	}


	// FUNCTION: init
	//  Initializes the navbar elements
	// PARAMS:
	//  params.container : ID of the navbar container
	//  params.navbar    : ID of the navbar template
	// RETURN:
	//  none
	function init(params) {

		_container = params.container;
		return;
	}


	// FUNCTION: render
	//  Renders the specified navbar
	// PARAMS:
	//  None
	// RETURN:
	//  None
	function renderMenu(params) {

		_module.fn = pBase.fnName(arguments);															// Traces the current function

		var pageId = params.active;


		th.Render({
			code: 502,
			onSuccess: function (result) {
				render_template_menu({
					templateHtml: result,
					activePage: pageId,
				});
				render_snippet({
					domain: _pageContainer,																// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
				});
				pBase.LoadResources(_resources);														// Loads additional resources (.css and/or .js)
			},
			onFailed: function (result) {
				pBase.RedirectToErrorPage(result.code, result.descr, _module);
			}
		});

	}

	// FUNCTION: render_template
	//  Renders and initializes the template elements in the page.
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function render_template_menu(params) {

		$(_container).html(params.templateHtml);														// Fills the HTML's case with the precompiled HTML template
		jQuery.noConflict();


		// ** Settings generali **

		// Step 1:
		var logoURL = __WACookie.Logo;
		if (logoURL != null && logoURL != '') {

			var myLogo = '<img src="' + logoURL + '">';
			$('#mainLogo a').html(myLogo);
		}

		var delta = 0;
		h1 = $('#dashboard').height() + 2;																// Ingombro barra dashboard (altezza, padding, bordi...)
		h2 = $('#esci').height() + 14 + 1;																// Ingombro pulsante "Esci"
		h3 = $('#mainLogo').height() + 20 + 2;															// Ingombro logo
		delta = h1 + h2 + h3;

		$('.menuPanel').css('height', window.innerHeight - delta);										// Adatta l'altezza del pannello contenitore del menu
		$(window).resize(function () {
			$('.menuPanel').css('height', window.innerHeight - delta);									// Adatta l'altezza del pannello contenitore del menu
		});

		// Step 2:
	//	var menuIdList = [																				// Definizione nomi (ID) dei gruppi dei menu e offset per la numerazione
	//		['economicsMenu', 0],
	//		['calcolatiMenu', 1],
	//		['reportMenu', 1]
	//	];

		var item = $('#' + params.activePage)															// Voce di menu attiva
		item.addClass('loadedActive');																	// Evidenziazione voce menu attiva

		// Patch per lev3 (sarà da ottimizzare per fare una gestione generale ricorsiva n-livelli)
		if ($(item).parent().hasClass('lev3')) {
			$($(item.closest('.lev2')[0]).find('a.btn')[0]).click();									// Apre il relativo submenu
		}
		// PATCH: aggiusta le classi dei menu "padre"
		var mp = $('.loadedActive').parents();
		for (mpx = 1; mpx < mp.length; mpx++){
			cl = $(mp[mpx]).attr('class');
			if (cl != null && cl.indexOf('lev') > -1) {
				$(mp[mpx]).find('>a').addClass('parentActive') ;
			};
		}

		$('#esci').click(function (e) {
			e.preventDefault();

			modals.ShowConf({
				target: _modalsContainer,
				choose: [{
					label: 'Sì',
					exec: function () {
						Cookies.remove('Yeap_FrontEndWAPars');													// Distrugge il cookie temporaneo
						window.close();
					}
				}, { label: 'No', exec: '' }
				],
				errMsg: 'Sei sicuro di voler uscire?'
			});

		});


		// Step 3: Lettura dati da Saas
		model.Common_Get({																				// Invia richiesta a SAAS
			page: 'errorCounter',
			token: __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
			onSuccess: function () { }
		}).then(function (params) {

			//	var _xmlMess = $( $.parseXML(params.d) ).find('Messaggio');
			var _xmlMess = $($.parseXML(params.d)).find('Modulo');
			var Errori = [
				['ricavi', 0, 0],																		// 0	dati prev.
				['costiEsterni', 0, 0],																	// 1	dati prev.
				['costiEsterni', 0, 0],																	// 2	dati prev.
				['iva', 0, 0],																			// 3	dati prev.
				['costiVariabili', 0, 0],																// 4	dati prev.
				['costiInterni', 0, 0],																	// 5	dati prev.
				['risorseUmane', 0, 0],																	// 6	dati prev.
				['fonti', 0, 0],																		// 7	dati prev.
				['investimenti', 0, 0],																	// 8	dati prev.
				['finanziamenti', 0, 0],																// 9	dati prev.
				['altro', 0, 0],																		// 10	dati prev.
				['annoPrecInsert', 0, 0],																// 11	dati prev.
				['contoEconomico', 0, 1],																// 12	prospetti
				['rendiconto', 0, 1],																	// 13	prospetti
				['statoPatrimoniale', 0, 1],															// 14	prospetti
				['workingCapital', 0, 1],																// 15	prospetti		// Non esiste, ma serve per la corretta indicizzazione
				['fontiFinanziarie', 0, 1],																// 16	prospetti
				['materiali', 0, 0],																	// 17	dati prev.
				['immateriali', 0, 0],																	// 18	dati prev.
				['finanziarie', 0, 0],																	// 19	dati prev.
				['gestStraordinaria', 0, 0],															// 20	dati prev.
				['annoPrecProspetto', 0, 0],															// 21	dati prev.

			]

			for (var i = 0; i < _xmlMess.length; i++) {

				mess    = _xmlMess[i];
				modulo  = eval($(mess).find('Codice').text());
				counter = eval($(mess).find('Count').text());
				nrErr   = eval($(mess).find('Errors').text());
				nrWrn   = eval($(mess).find('Warnings').text());

				if (nrErr > 0) {
					Errori[modulo - 1][1] = 1;															//	Se sono presenti errori la classe è "1" di default
				} else {
					if (nrWrn > 0) {
						Errori[modulo - 1][1] = 2;														//	Se sono presenti solo warning la classe è "2" (priorità inferiore)
					}
				}
			}

			// ** Lettura dllo status del BP e aggiornamentoi del menu e dei semafori di Wordpress **
			model.Common_Get({
				page: 'menu',																	// Definizione il tipo di dati da leggere
				token: __WACookie.Token,
				onFailure: pBase.OnGenericFailure,
				onSuccess: function (params) {


					var data = $($.parseXML(params.RawData));										// Parse dell'XML di ritorno
					var nome = decodeURIComponent(data.find('Nome').text());						// Nome del Business Plan
					var anni = eval(data.find('NumAnni').text()) / 1000;							// Riscala il nr. di anni
					var code = data.find('CodiceTipologia').text();									// Codice tipologia azienda
					var tipo = decodeURIComponent(data.find('Tipologia').text());					// Descrizione tipologia azienda
					var init = eval(data.find('AnnoInizio').text()) / 1000;							// Riscala il nr. di anni
					var BP   = eval(data.find('StatusBP').text());									// Status Business Plan
					var QA   = data.find('StatusQA').text();										// Status Analisi Qualitativa
					var aPre = eval(data.find('UtilizzoAnnoPrec').text());							// Flag utilizzo Anno precedente

					var CDG  = eval(data.find('TipoProdotto').text());							// Flag utilizzo Anno precedente

					// Definizione flags e valorizzazione di default:
					var mnuPosiz = true;
					var mnuPiano = true;
					var mnuProsp = true;
					var mnuReprt = {
						report   : false,
						repPosiz : true,
						repInput : true,
						repPiano : true,
						repTesti : true,
						repProsp : true,
						repProspWord : true,
						repLeanus: true,
					}
					var mnuCDG   = (CDG == 30)? true : false;
					var mnuAPrec = {
						insert: (aPre == 1) ? true : false,
						report: (aPre == 1) ? true : false,
					}

					// Check e valorizzazione flags secondo gli stati
					if (anni == null || anni < 1) {													// Check: nr anni del BP
						mnuPiano = false;
						mnuReprt.repPosiz = false;
					}
					if (code == null || code < 1) {													// Check: codice tipo azienda
						mnuPosiz = false;
						mnuReprt.repPosiz = false;
					}
					if (QA == null || QA < 2) {														// Check: status Analisi Qualitativa
						mnuReprt.repPosiz = false;
					} else {
						mnuReprt.report = true;
					}

					switch (BP) {																	// Check: status Business Plan

						case 0:																		// - Vuoto - Si abbina con "anni = 0"
							mnuProsp = false;
							mnuReprt.repInput = false;
							mnuReprt.repPiano = false;
							mnuReprt.repProsp = false;
							mnuReprt.repProspWord = false;
							mnuReprt.repLeanus = false;
							break;

						case 1:																		// - Salvato (Dati previsionali)
						case 2:																		// - Precompilato (Dati previsionali)
						case 97:																	// - Errore precompilazione (Dati previsionali)
						case 3:																		// - Salvato (Anno precedente)
							mnuProsp = false;
							mnuReprt.report = true;
							mnuReprt.repPiano = false;
							mnuReprt.repProsp = false;
							mnuReprt.repProspWord = false;
							mnuReprt.repLeanus = false;
							mnuAPrec.report = false;
							break;
						case 98:																	// - Errore precompilazione (Anno precedente)
							mnuProsp = false;
							mnuReprt.report = true;
							mnuReprt.repPiano = false;
							mnuReprt.repProsp = false;
							mnuReprt.repProspWord = false;
							mnuReprt.repLeanus = false;
							mnuAPrec.report = true;
							break;

						case 4:																		// - Precompilato Ok (Anno precedente)
						case 5:																		// - Precompilato con warning (Anno precedente)
						case 6:																		// - Precompilato con errore (Anno precedente)
							mnuProsp = false;
							mnuReprt.report = true;
							mnuReprt.repPiano = false;
							mnuReprt.repProsp = false;
							mnuReprt.repProspWord = false;
							mnuReprt.repLeanus = false;
							break;

						case 7:																		// - Compilato certificato (Business Plan)
						case 8:																		// - Compilato forzato (Business Plan)
						case 9:																		// - Compilato non certificato (Business Plan)
						case 99:																	// - Errore compilazione (Business Plan)
							mnuReprt.report = true;
							mnuReprt.repLeanus = false;
							break;

						case 10:																	// - Inviato a Leanus
						case 11:																	// - Elaborato da Leanus
							mnuReprt.report = true;

						default:
							break;
					}

					// Disabilitazione pulsanti contrassegnati
					if (!mnuPosiz) {
						$('a#qualitativa, #economics, a#impostazioni').addClass('disabled');		// Disabilita "Posiz. progetto" e "Piano Economico" ("Impostazioni" richiede "Tipologia Azienda" obbligatoria => senza Impostazioni non può sbloccare il resto => Disabilita tutto il menu)
					}
					if (!mnuPiano) {
						$('#economicsMenu a.inputPage').not('#impostazioni').addClass('disabled');
					}
					if (!mnuProsp) {
						$('#calcolati, #calcolatiMenu a.calcPage').addClass('disabled');
					}
					var k = Object.keys(mnuReprt);
					for (i = 0; i < k.length; i++) {
						if (!mnuReprt[k[i]]) {
							$('#' + k[i]).addClass('disabled');
						}
					}
					if (!mnuAPrec.insert) { $('#annoPrecInsert').addClass('disabled'); }			// (Patch: 20/05/2019) Abilitazione pulsanti Anno Precedente
					if (!mnuAPrec.report) { $('#annoPrecProspetto').addClass('disabled'); }
					if (!mnuAPrec.report) { $('#annoPrecConferma').addClass('disabled'); }

					if (!mnuCDG) { $('#controllo, #controlloMenu a').addClass('disabled'); }

					// Marca i menu con errori
					var errClass;
					for (var i = 0; i < Errori.length; i++) {

						switch (Errori[i][1]) {
							case 1:
								errClass = (__WACookie.showErr) ? 'hasErr' : 'hasHiddenErr';
								break;
							case 2:
								errClass = (__WACookie.showErr) ? 'hasWarning' : 'hasHiddenWarning';
								break;
							default:
								errClass = '';
								break;
						}

						if (errClass != '') {

							var mnLev1 = Errori[i][2];

							if (mnLev1 == 0) { $('#economics').addClass(errClass); }					// Marca il menu "Dati previsionali"
							if (mnLev1 == 1) {
								$('#calcolati').addClass(errClass);
							}					// Marca il menu "Prospetti"

							$('#' + Errori[i]).addClass(errClass);										// Marca la voce di menu
							switch (true) {																// Cerca e marca l'eventuale sottomenu
								case (i >= 17 && i <= 19):
									$('#immobilizzazioni').addClass(errClass);
									break;

								case (i == 11 || i == 21):
									$('#annoPrec').addClass(errClass);
									break;

								default:
									break;
							}
						};

					}


					// Aggiornamento degli stati di Wordpress
					var wpSettings = {																// Definizione dei parametri del servizio
						token: __WACookie.Token,
						bearer: __WACookie.TokenApiRest,
						qAnalysis: QA,
						economics: BP,
					}
					sendStatusToWordpress(wpSettings);												// Invoca la chiamata del servizio REST di WP

				}

			});

		});


		// Gestione menu: blocca i link disabilitati
		$('#leftMenu a').click(function (e) {

			if ($(this).hasClass('disabled')) {
				e.preventDefault();																	// Blocca i pulsanti disabilitati
				e.stopPropagation();
			}

		});



		// Gestione Report:
		$('#repPosiz').click(function (e) {
			e.preventDefault();

			if (!$(this).hasClass('disabled')) {
			//	repName = encodeURIComponent('Posizionamento progetto')
				cReport.GetReport({ reptID: 'qualitativa', format: 5 });
			}
		});

		$('#repPiano').click(function (e) {
			e.preventDefault();

			if (!$(this).hasClass('disabled')) {
			//	repName = encodeURIComponent('Piano economico')
				cReport.GetReport({ reptID: 'pianoEconom', format: 5 });
			}

		});

		$('#repTesti').click(function (e) {																// Lettura dei dati testuali (compilati in Wordpress)
			e.preventDefault();

			var token = __WACookie.Token;
			var bearer = __WACookie.TokenApiRest;

			repName = encodeURIComponent('Testi')

			jQuery.ajax({
				url: __WPressSiteURL + '/wp-json/wp/v2/business-plan/' + token,
				method: 'GET',
				contentType: 'application/json',
				processData: false,
				beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + bearer); },
				success: function (response) {

					var str = JSON.stringify(response);
					var obj = JSON.parse(str);
					var list = getListFromJson(obj.meta);
					var str_xml = getXmlFromList(list);

					cReport.GetTestiWP({
						reptID: 'datiTestuali',
						xmlTxt: str_xml,
						format: 5,
					});
				},
				error: function (responseError) { console.log('Errore nella lettura testi WP') },

			});
		});


		$('#repProsp').click(function (e) {																// Lettura dei dati testuali (compilati in Wordpress)
			e.preventDefault();

			if (!$(this).hasClass('disabled')) {
				var token = __WACookie.Token;
				var bearer = __WACookie.TokenApiRest;

			//	repName = encodeURIComponent('Sintesi progetto')

				jQuery.ajax({
					url: __WPressSiteURL + '/wp-json/wp/v2/business-plan/' + token,
					method: 'GET',
					contentType: 'application/json',
					processData: false,
					beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + bearer); },
					success: function (response) {

						var str     = JSON.stringify(response);
						var obj     = JSON.parse(str);
						var list    = getListFromJson(obj.meta);
						var str_xml = getXmlFromList(list);

						cReport.GetTestiWP({
							reptID: 'testualiProspetti',
							xmlTxt: str_xml,
							format: 5,
						});
					},
					error: function (responseError) { console.log('Errore nella lettura testi WP') },

				});
			}
		});

		$('#xxx').click(function (e) {						// §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§ PATCH
			e.preventDefault()
			$('.hidden-context, #xxx_1, #xxx_2').toggle();
		});



		// Test: Hassan Menu
		$('.menu ul a').next('ul').hide();
		$('.menu ul a').on("click", function (e) {
			
		//	if (!$(this).hasClass('disabled')) {

				var ele = document.getElementById("MenuBackgroundPage");
				if (!ele) {
					var div = document.createElement("div");
					div.setAttribute("id", "MenuBackgroundPage");
					div.className += "overlay";
					div.onclick = function () {
						$('.menu ul a').next('ul').hide();
						$('#MenuBackgroundPage').css('opacity', '0').hide();
						$('.menu ul a').removeClass("active");
					};
					document.body.appendChild(div);
					$('#MenuBackgroundPage').css('opacity', '0').hide();

				}
				if ($(this).hasClass("test1")) {
					$('.menu ul a').not(this).next('ul').hide('fast');

					if ($(this).hasClass("active")) {
						$('.menu ul a').removeClass("active");
					} else {
						$('.menu ul a').removeClass("active");
						$(this).addClass("active");
					}
					$(this).next('ul').toggle('fast');
					if ($(this).next('ul').is(':visible')) {
						$('#MenuBackgroundPage').show().animate({opacity: '0.5'}, 'fast');
					} else {
						$('#MenuBackgroundPage').css('opacity', '0').hide();
					}
				}
				else if (($(this).hasClass("test")) && ($(this).has("ul"))) {
					if ($(this).next('ul').is(':visible')) {
						$('.menu ul ul a').next('ul').hide();
						$(this).prev('ul').toggle();
					} else {
						$('.menu ul ul a').next('ul').hide();
						$(this).prev('ul').toggle('fast');
						$(this).next('ul').toggle('fast');
					}
					if ($(this).hasClass("active")) {
						$('.menu ul ul a').removeClass("active");
						$(this).removeClass("active");
					} else {
						$('.menu ul ul a').removeClass("active");
						$(this).addClass("active");
					}

					$('#MenuBackgroundPage').show().animate({opacity: '0.5'}, 'fast');
				}
				else if ($(this).hasClass("test")) {
					$('.menu ul a').not(this).next('ul').not(this).prev('ul').hide('fast');
					$(this).prev('ul').toggle('fast');
					$(this).next('ul').toggle('fast');
					$('#MenuBackgroundPage').toggle('fast');
				}
				else {
					$('.menu ul a').next('ul').hide('fast');
					$('#MenuBackgroundPage').css('opacity', '0').hide();
					$('.menu ul a').removeClass("active");

				}
				e.stopPropagation();

		//	}
		});

		//testHassan Menu


	}
	function getListFromJson(json_meta) {

		var step = 'step';
		var lista = new Array();
		var keys = Object.keys(json_meta);
		var element = new Object();

		keys.forEach(function (key) {
			if (key.indexOf(step) >= 0) {
				element = new Object();
				element.chiave = key;
				element.valore = getStringFromArray(json_meta[key]);
				lista.push(element)
			}
		});
		return lista;
	}
	function getStringFromArray(stringArray) {

		if (stringArray == null || stringArray.length == 0) {
			return "";
		} else {
			return stringArray[0];
		}
	}
	function getXmlFromList(list) {																			// Trasforma da list a XML
		var xml = '';

	//	xml  = '<Data>';
	//	xml += '<Formato>' + 1 + '</Formato>';
	//	xml += '<Nodo>';
	//
	//	list.forEach(function (element) {
	//		xml += "<Text Key='" + element.chiave + "'>" + encodeURIComponent(element.valore) + '</Text>';
	//	});
	//	xml += '</Nodo>';
	//	xml += '</Data>';

		// PATCH (27/01/2020): modificata la costuzione del "body":
		// - Il parametro "format" specifica il tipo output (5 = PDF, bisogna parametrizzare)
		// - I testi sono ora nodi "Text" figli del nodo "Texts"
		xml  = '<Data>';
		xml += '<Format>' + 5 + '</Format>';
		xml += '<Texts>';
	
		list.forEach(function (element) {
			xml += "<Text Key='" + element.chiave + "'>" + encodeURIComponent(element.valore) + '</Text>';
		});
		xml += '</Texts>';
		xml += '</Data>';


		return xml;
	}



	// FUNCTION: render_snippet
	//  Resolves snippet and assigns callback functions to the new DOM elements
	// PARAMS:
	//  params.domain           : name of the domain (container ID) the snippet belongs to
	//  params.onDeleteCallback : event handler (callback) for "Delete" button click.
	// RETURN:
	//  none
	function render_snippet(params) {

		var onDeleteCallback = params.onDeleteCallback;
		var myXml = params.xmlData;

		// Invokes the snippets resolution
		snippets.Render({
			domain: params.domain,
			callBack: snippetsCallBack,
			others: myXml,
		});


		// FUNCTION: snippetsCallBack
		//  Handles the callbacks for the new DOM elements (snippets replacement)
		// PARAMS:
		//  params.domain  : name of the domain (container ID) the snippet belongs to
		//  params.snippet : name of the snippet to be processed
		// RETURN:
		//  none
		function snippetsCallBack(params) {

			var domain = params.domain;																// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				default:
					break;

			}
		}
	}


	// FUNCTION: sendStatusToWordpress
	//  Invia a Yeap_FrontEnd/Wordpress gli stati aggiornati del Business Plan
	// PARAMS:
	//  params.token     : Token del business plan richiesto ([* si preferisce mandarlo come parametro anziché prenderlo dal cookie per poter usare la funzione anche su altri BP a richiesta *])
	//  params.bearer    : TokenApiRest del business plan corrente
	//	params.qAnalysis : Status dell'analisi qualitativa
	//	params.economics : Status del piano economico
	// RETURN:
	//  none
	function sendStatusToWordpress(params) {

		var token = params.token;
		var bearer = params.bearer;
		var QA = params.qAnalysis;
		var BP = params.economics;
		var valMeta = {};


		// ** 1: Gestione stato Analisi qualitativa
		if (QA != null) {
			var ndx = 0;																					// Default: stato sconosciuto
			var qaStatus = [
				{ code:  '', color: '#999999', descr: '(stato sconosciuto)' },
				{ code: '0', color: '#eeeeee', descr: 'Vuoto' },
				{ code: '1', color: '#fbf417', descr: 'Salvato' },
				{ code: '2', color: '#14e630', descr: 'Compilato' },
			];

			for (i = 0; i < qaStatus.length; i++) {
				if (QA == qaStatus[i].code) { ndx = i; }
			}
			valMeta.status_1_color = qaStatus[ndx].color;
			valMeta.status_1_descr = 'Posizionamento progetto ' + qaStatus[ndx].descr;
		}


		// ** 2: Gestione stato Business Plan
		if (BP != null) {
			var ndx = 0;																					// Default: stato sconosciuto
			var bpStatus = [
				{ code:   '', color: '#999999', descr: '(stato sconosciuto)' },
				{ code:  '0', color: '#eeeeee', descr: 'Vuoto' },
				{ code:  '1', color: '#037ac5', descr: 'Salvato' },
				{ code:  '2', color: '#fbb93e', descr: 'Confermato' },
				{ code:  '3', color: '#fbf417', descr: 'Salvato (A.P.)' },

				{ code:  '4', color: '#fbf417', descr: 'Confermato (A.P.)' },
				{ code: '41', color: '#cbf417', descr: 'Compilato' },
				{ code:  '7', color: '#cbf417', descr: 'Compilato (certificato)' },
				{ code:  '8', color: '#fbc417', descr: 'Compilato (forzato)' },
				{ code:  '9', color: '#fbb417', descr: 'Compilato (non certificato)' },
				{ code: '10', color: '#14e630', descr: 'Inviato' },

				{ code: '11', color: '#14e630', descr: 'Elaborato' },
				{ code: '99', color: '#cc0000', descr: 'Compilato con errori' },
			];

			for (i = 0; i < bpStatus.length; i++) {
				if (BP == bpStatus[i].code) { ndx = i; }
			}
			valMeta.status_2_color = bpStatus[ndx].color;
			valMeta.status_2_descr = 'Business Plan ' + bpStatus[ndx].descr;
		}


		// ** 3: Esecuzione chiamata REST **
		var objData = { meta: valMeta }
		jQuery.ajax({
			url: __WPressSiteURL + '/wp-json/wp/v2/business-plan/' + token,
			method: 'POST',
			data: JSON.stringify(objData),
			contentType: 'application/json',
			processData: false,
			beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + bearer); },
			success: function (response) { console.log('%c-> Menu handler: Aggiornato status WP', 'background:#cff;color:#009;padding: 3px 10px'); },
			failure: function (response) { console.log('%c-> Menu handler: Status WP non aggiornato', 'background:#c00;color:#fff;padding: 3px 10px'); },
		})
			.fail(
				function (e) {
					console.log('%c-> Menu handler: Status WP non aggiornato: (' + e.responseJSON.message + ')', 'background:#800;color:#fff;padding: 3px 10px');
				}
			);

	}
});