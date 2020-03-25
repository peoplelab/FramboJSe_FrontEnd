//----------------------------------------------------------------------------------------
// File: qualitativa.presenter.js
//
// Desc: Presenter della pagina "Analisi qualitativa"
// Path: /Private/modules/qualitativa/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
	'reportController',
], function (pBase, th, snippets, modals, dashboard, model, menu, cReport) {

	// ** Module management **
	var _module = {};														// Mapping of the current module
	var _resources = {};														// Mapping of the additional resources (.css and/or .js files)

	// ** Global variables **
	var _onInit = true;															// Flag for "I'm initializing objects"
	var _xml = '';															// XML data (to show)
	var _pageID = '';															// Sitemap/page ID
	var _templateID = '';														// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';									// Target container (ID) for the modal windows
	var _menuContainer = '#menuContainer';									// Target container (ID) for the filter template
	var _pageContainer = '#pageContainer';									// Target container (ID) for the list template 


	return {

		Init: init,														// Initializes (setup) the page
		RenderPage: renderPage, 												// Render del contenuto pagina
		Show_report: showReport,
		GetData4Saving: function () {											// Gets data from page controls for saving
			return pBase.BuildsJson4Save('')
		},
		Show_ok_modal: function () {											// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer
			})
		},
		Show_ko_modal: function (code, msg) {									// "Error" modal window's handler
			modals.ShowErr({
				target: _modalsContainer,
				errCode: code,
				errMsg: msg
			})
		},
		Show_ko: function (code, msg) {											// "Error" handler
			pBase.RedirectToErrorPage(code, msg);
		},
		Show_info_modal: function (code, msg) {
			modals.ShowInfo({
				target: _modalsContainer,
				errCode: code,
				errMsg: msg
			})
		},
	}


	// FUNCTION: init
	//  Initializes the HTML page objects for UI render
	// PARAMS:
	//  params.page_id : page ID
	// RETURN:
	//  none
	function init(params) {

		_module.id = SystemJS.map.currentPresenter.replace(location.origin, '');
		_pageID = params.pageID;
		_templateID = params.templateID;

		// Initializes Pagedashboard
		dashboard.Init({ container: "dashboard" });

		// Initializes Menu
		menu.Init({ container: _menuContainer });
	}


	// FUNCTION: renderPage
	//  Starts process of getting the HTML template, fills it with XML values and initializes its custom elements
	// PARAMS:
	//  params.rawData             : XML raw data.
	//  params.onDeleteButtonClick : event handler (callback) for "Delete" button click.
	// RETURN:
	//  none
	function renderPage(params) {

		_module.fn = pBase.fnName(arguments);									// Traces the current function
		_xml = $.parseXML(params.RawData);										// Transforms raw XML data into an XML document

		th.Render({
			code: _templateID[0],
			XML: _xml,
			onSuccess: function (result) {
				render_template_page({
					templateHtml: result,
				});
				render_template_values({										// Costruisce il risultato della valutazione
					//onSave: params.OnSave,										// Callback per salvataggio dati.
				});
				render_snippet({
					domain: _pageContainer,										// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
					onSaveCallBack: params.OnSave,										// Callback per salvataggio dati.
				});
				pBase.LoadResources(_resources);								// Loads additional resources (.css and/or .js)
			},
			onFailed: function (result) {
				pBase.RedirectToErrorPage(result.code, result.descr, _module);
			}
		});

		// Renders the Dashboard
		dashboard.Render({});

		// Renders the menu
		menu.Render({ active: _pageID });

	}

	// FUNCTION: render_template_page
	//  Initializes the custom elements in the page.
	// PARAMS:
	//  params.templateHtml : the precompiled HTML template
	// RETURN:
	//  none
	function render_template_page(params) {

		$(_pageContainer).html(params.templateHtml);							// Fills the HTML's case with the precompiled HTML template
		$('.preventDefault').click(function (e) {
			e.preventDefault();
		});

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function(e){

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

		});


		// Ablitazione pulsante Genera Report:
		$('#btn-report').click(function(){
			if (!$(this).hasClass('disabled')){
			//	cReport.GetReport( {reptID: 'qualitativa'} );
				cReport.GetReport({ reptID: 'qualitativa', format: 5 });
			}
		});



	}

	// FUNCTION: render_template_values
	//  Initializes the custom elements in the page.
	// PARAMS:
	//  params.onSave : event handler (callback) for "Save" button click.
	// RETURN:
	//  none
	function render_template_values(params) {

		//var saveCallBack = params.onSave;

		// Gestione tab menu
		$('#tabMenu a').click(function (e) {
			e.preventDefault();

			var href    = $(this).attr('href');									// Determina l'oggetto "container" da attivare
			var status  = $('#tabMenu').attr('status');
			var checkOk = true;

			if ($(this).hasClass('btn-action-light')) {							// Evita l'azione se il pulsante/tab è già attivo
				checkOk = false;
			}

			if (href == "#tab-valutazione") {									// Esegue i controlli validità se deve visualizzare la valutazione
				switch (status) {
					case 'changed':												// Dati cambiati: avvisa la prima volta
						modals.ShowInfo({
							target: _modalsContainer,
							errCode: 0,
							errMsg: "Sono presenti dati non salvati, per aggiornare la valutazione salvare e continuare."
						});
						$('#tabMenu').attr('status','changed-notified');
						break;
				
					default:
				}
			} 

			if (checkOk) {														// Ha il permesso di cambiare il tab
				$('#tabMenu a').removeClass('btn-action-light');				// Toglie la classe 
				$(this).addClass('btn-action-light');
				$('.tabContent').hide('slow');
				$(href).show('slow');
			}

		});




		// ** Gestione elenchi Best e Worst in funzione dello stato **
		var XMLstatus = $(_xml).find('Status').text();													// Stato dell'Analisi > 0: blank; 1: dati salvati; 2: valutata
		switch (XMLstatus) {

			case '0':																					// Nasconde i risultati della valutazione
				$('#reportNew').show();
				$('#report').hide();
				break;

			case '1':																					// Mostra i risultati
			case '2':

				// ** Compila gli elenchi **
				//var s = $(_xml).find('SortR>int');
				var s = $(_xml).find('SortA>int');
				var l = s.length;

				// Compila sezione "Best"
				var myHtml = '';
				for (i = 0; i < 3 && i < l; i++) {

					var valR = eval($(_xml).find('VR' + s[i].textContent).text()) / 10;					// Divide per 10 perché da Saas mi restituisce ad esempio "1000" quando dovrebbe essere 100 (cioè il 100% del voto ottenibile)
					var valA = eval($(_xml).find('VA' + s[i].textContent).text());

					myHtml += '<li><div class="row margin-b-10">';
					myHtml += '<div class="col-6 padding-t-5"><snp_XML_label data-pars="value:=\'' + s[i].textContent + '\'" /></div>';
					//myHtml += '<div class="progress col-4"><div class="progress-bar bg-success" role="progressbar" style="width: ' + valR + '%" aria-valuenow="' + valR + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
					myHtml += '<div class="progress col-4"><div class="progress-bar bg-success" role="progressbar" style="width: ' + valA + '%" aria-valuenow="' + valA + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
					myHtml += '</div></li>';
				}
				$('ul.best').html(myHtml);

				// Compila sezione "Worst"
				var myHtml = '';																		// Ciclo dei "worst"
				var isSPA = (__WACookie.tc == '4') ? true : false;										// PATCH: deve escludere i dati di "Trazione" quando Tipologia è Spa/Srl
				var nrItem = 0;
				for (i = l - 1; i > i >= 0 && nrItem < 3; i--) {
					var v = s[i].textContent;
				//	if (!(isSPA && v == 5)) {															// V = 5 identifica "Trazione"
					if (!(isSPA && (v == 5 || v== 1))) {												// V = 5 identifica "Trazione"
						nrItem++;
						var valR = eval($(_xml).find('VR' + s[i].textContent).text()) / 10;				// Divide per 10 perché da Saas mi restituisce ad esempio "1000" quando dovrebbe essere 100 (cioè il 100% del voto ottenibile)
						var valA = eval($(_xml).find('VA' + s[i].textContent).text());

						myHtml += '<li>';
						myHtml +=   '<div class="row margin-b-10">';
						myHtml +=     '<div class="col-6 padding-t-5"><snp_XML_label data-pars="value:=\'' + s[i].textContent + '\'" /></div>';
						myHtml +=     '<div class="progress col-4"><div class="progress-bar bg-danger" role="progressbar" style="width: ' + (100 - valA) + '%" aria-valuenow="' + (100 - valA) + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
						myHtml +=   '</div>';
						myHtml += '</li>';
					}
				}
				$('ul.worst').html(myHtml);

				// Compila sezione "Punteggio finale"
				var myHtml = '';																		// Punteggio totale
				var totR = eval($(_xml).find('VRTot').text()) / 100;									// Divide per 10 perché da Saas mi restituisce ad esempio "1000" quando dovrebbe essere 100 (cioè il 100% del voto ottenibile)
				var totA = eval($(_xml).find('VATot').text());
	
				myHtml += '<div class="row">';
				myHtml +=   '<div class="col-12 bold">Valutazione complessiva</div>';
				myHtml +=   '<div class="col-12 text-right gauge-value finalscore">';
				//myHtml +=     '<span class="font-pct-150">' + totR / 10.0 + '/<sub>10</sub></span>';
				myHtml +=     '<span class="font-pct-150">' + totA / 100.0 + '/<sub>10</sub></span>';
				myHtml +=   '</div>';
				myHtml += '</div>';
				myHtml += '<div class="row">';
				myHtml +=   '<div class="col-12">';
				myHtml +=     '<p class="text-center">Ultima valutazione effettuata in data: ';
				myHtml +=      '<span class="">' + $(_xml).find('Timestamp').text() + '</span>';
				myHtml +=     '</p>';
				myHtml +=   '</div>';
				myHtml += '</div>';

				$('#ptTot').html(myHtml);
				break;


			default:
				break;
		}

	}


	// FUNCTION: render_snippet
	//  Resolves snippet and assigns callback functions to the new DOM elements
	// PARAMS:
	//  params.domain           : name of the domain (container ID) the snippet belongs to
	//  params.onDeleteCallback : event handler (callback) for "Delete" button click.
	// RETURN:
	//  none
	function render_snippet(params) {

		var saveCallBack = params.onSaveCallBack														// Pulsante "Salva"
		var myXml = params.xmlData;

		// Invokes the snippets resolution
		snippets.Render({
			domain  : params.domain,
			callBack: snippetsCallBack,
			others  : myXml,
		});


		// FUNCTION: snippetsCallBack
		//  Handles the callbacks for the new DOM elements (snippets replacement)
		// PARAMS:
		//  params.domain  : name of the domain (container ID) the snippet belongs to
		//  params.snippet : name of the snippet to be processed
		// RETURN:
		//  none
		function snippetsCallBack(params) {

			var domain = params.domain;																	// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'XML_label':
					if (__WACookie.tc == '4') {															// Disabilita "Trazione" e "Stage" per tipologia SPA/SRL
						$('#Q5, #Q1')
						.html('<option value="0" class="isOk">Non disponibile</option>')
						.css({'background': '#eee', 'color': '#888'});
					}
					// Controllo status report
					var emptyCnt = $('.dd_elenchiQA  option:selected[value="0"]').not('.isOk').length;
					if (emptyCnt > 0) {

						showReport({result: 'ko'});
					}

					break;

				case 'dd_elenchiQA':
					// Marca il valore iniziale
					$('.dd_elenchiQA option[selected]').addClass('initialChecked');

					// Gestione eventi
					$('select').change(function(){

						__SYS_status.hasChanged = true;													// Aggiornamento STATUS globale: attiva il flag di valore modificato

						if ($(this).val() != $(this).attr('ov')) {
							
							$(this)
							.removeClass('error')														// Toglie l'eventuale marker di errore
							.addClass('changed');														// Evidenzia il campo
							$('#tabMenu').attr('status', 'changed');									// Modifica lo status del form
							$('#reportCompiled .card-body').addClass('changed');

						} else {
							
							$(this).removeClass('changed');												// Ripristina valore precedente: toglie la formattazione
							if ($('select.changed').length == 0) {
								$('#reportCompiled .card-body').removeClass('changed');
							}
						}
						
					});

					// Gestione speciale: figure chiave
					// Q13Sub1_Driver
					// Q13Sub1_Code
					// Q13Sub2_Driver
					// Q13Sub2_Code

					// Inizializza lo stato
					switchOptionElements({id: 1});
					switchOptionElements({id: 2});

					$('[refid]').change(function(){			// L'attributo "refid" è presente sulle due select principali di figura 1 e 2
						var refid = $(this).attr('refid');
						switchOptionElements({ id: refid})
					});

					// PATCH (28/01/2020): Gestione condizione "trial expired"
					if (__WACookie.trial_expired == 'true') {
						$('.dd_elenchiQA').attr('disabled', 'disabled');
					}

					break;

				case 'btnConsole':
					$('#btn-save').click(function(e) {
						e.preventDefault();
						$('.dd_elenchiQA').removeClass('error changed')						// Rimuove prima i marker dei campi
						.find('option:selected[value="0"]').not('.isOk').parent().addClass("error");		// Marca gli eventuali incompleti
						saveCallBack();														// Callback per salvataggio dati
						$('#tabMenu').attr('status','saved');
						$('#reportCompiled .card-body').removeClass('changed');
					});
					break;

				default:
			}
		}
	}


	function showReport(params) {
		if (params.result == "ok") {
			$("#reportCompiled").show();
			$("#reportError").hide();
		}
		else if (params.result == "ko") {
			$("#reportCompiled").hide();
			$("#reportError").show();
		}
		else {
			console.log("Valore inaspettato passato da 'presenter.Show_report'");
		}
	}


	function switchOptionElements(params){

		var ref = '[ref=Q13Sub' + params.id + '_Driver]';
		var sub = '[ref=Q13Sub' + params.id + '_Code]';
		var NOF = ($(ref).val() == 11)? true : false;															// Valore dell'opzione Nessuna Figura

		// Step 1: aggiorna stato select dipendenti (code)
		if (NOF) {
			$(sub).attr('disabled', true);
			$(sub + ' option[value=7]').show().prop('selected', true);
		} else {
			$(sub).removeAttr('disabled');
			$(sub + ' option[value=7]').hide();;
			if($(sub).val() == 7) {
				$(sub + ' option[value=0]').prop('selected', true);
			}
		}

		// Step 2: Aggiorna stato Figura 2 (dipendente da FIgura 1)
		if (params.id == 1) {

			var sub2 = '[ref=Q13Sub2_Driver]';
			if (NOF) {
				$(sub2).attr('disabled', true);
				$(sub2 + ' option[value=11]').prop('selected', true);
				switchOptionElements({id: 2});
			} else {
				$('[ref=Q13Sub2_Driver]').removeAttr('disabled');
			}
		}

	}
});
