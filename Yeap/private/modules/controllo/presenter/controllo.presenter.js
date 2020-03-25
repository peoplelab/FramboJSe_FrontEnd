//----------------------------------------------------------------------------------------
// File: ricavi.presenter.js
//
// Desc: Model della sezione "Controllo di gestione"
// Path: /Private/modules/controllo/presenter
//----------------------------------------------------------------------------------------

define([
	'base_model',
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
	'datagrid',
	'datagridCDG',
	'/private/modules/common/model/resources.model.js',
], function (mBase, pBase, th, snippets, modals, dashboard, model, menu, dg, dgCDG, resources) {

	// ** Module management **
	var _module = {};															// Mapping of the current module
	var _resources = {}															// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _xml  = '';																// XML data (to show)
	var _xml1 = '';
	var _xml2 = '';
	var _xml3 = '';
	var _getXml1 = false;
	var _getXml2 = false;
	var _getXml3 = false;
	var _xmls    = [];
	var _getXmls = [false, false, false, false];

	var _tipoConsuntivo;
	var _lastMonth = 0;															// Ultimo mese consuntivato
	var _importTypeIsExcel;														// Identifica se il file consuntivo da importare è tipo .XLS(X) o .CSV
	var _activeFileName = '';

	var _okMese = false;
	var _okFile = false;

	var _pageID = '';															// Sitemap/page ID
	var _templateID = '';														// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';									// Target container (ID) for the modal windows
	var _menuContainer   = '#menuContainer';									// Target container (ID) for the filter template
	var _pageContainer   = '#pageContainer';									// Target container (ID) for the list template 

	return {

		Init: init,																// Initializes (setup) the page
		RenderPage: renderPage,													// Render del contenuto pagina
		GetData4Saving: function () {											// Gets data from page controls for saving
			return dgCDG.BuildsXML({ name: _pageID });
		},
		Show_ok_modal: function (params) {										// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer,
				URL   : params.redirect,
			});
		},
		Show_ko_modal: function (code, msg) {									// "Error" modal window's handler
			modals.ShowErr({
				target : _modalsContainer,
				errCode: code,
				errMsg : msg
			})
		},
		Show_ko: function (code, msg) {											// "Error" handler
			pBase.RedirectToErrorPage(code, msg);
		}

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
		dashboard.Init({ container: "dashboard" })

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

		_module.fn = pBase.fnName(arguments);															// Traces the current function
		_xml = $.parseXML(params.RawData);																// Transforms raw XML data into an XML document

		th.Render({
			code: _templateID[0],
			XML: _xml,
			onSuccess: function (result) {

				var html = result;

				resources.XmlEconomics({
					onSuccess: function (result) {
						__Preloads.economics = result;

						render_template_page({
							templateHtml  : html,
							xmlDocument   : _xml,
							onLoadCallBack: params.OnLoad,												// Callback per il caricamento file Excel.
						});
						render_snippet({
							domain: _pageContainer,														// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
							onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
						});
						pBase.LoadResources(_resources);												// Loads additional resources (.css and/or .js)

					}
				});
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

		$(_pageContainer).html(params.templateHtml);													// Fills the HTML's case with the precompiled HTML template
		$('.preventDefault').click(function (e) {
			e.preventDefault();
		});

		var loadCallBack = params.onLoadCallBack;

		// ** FUNZIONI COMUNI **
		$(window).on('scroll', function (e) {															// Gestione titolo alternativo (scroll page)

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

		});


		// ** FUNZIONI DIFFERENZIATE PER PAGINA **
		switch (_pageID) {

			// ** DISTRIBUZIONE MENSILE **
			case 'cdgDistribuzione':
				
				var tableList = '#TabellaPesiInput, #TabellaPesiFissi, #TabellaPesiRaw, #TabellaPesiFissiCalcolati, #TabellaPesiInputCalcolati';

				// ** 1: precompila le tabelle coi dataset
				$(tableList).each(function(){

				//	precompileTables({								//§§§§ SOSPESO: vanno rivisti i parametri
				//		tableID: $(this),
				//		xmlDoc : params.xmlDocument
				//	});

					var $table = $(this).find('[ref=body]');
					var allDs  = $(params.xmlDocument).find('Data>Mesi>Mese[ID=1]').children();
					var xhtml  = '';
				
					for (var j = 0; j < allDs.length; j ++) {
				
						var nodeName = allDs[j].localName;													// Nome del nodo
				
						xhtml += '<div class="" dsTablerow ';
						xhtml +=   'data-name="' + nodeName + '"';
						xhtml +=   'data-type="' + $table.attr('type') + '"';		// §§ Questo attributo potrebbe sparire (prende "type" in altro modo)
						xhtml +=   'data-init="' + $table.attr('init') + '"';
						xhtml +=   'data-stop="' + $table.attr('stop') + '"';
						xhtml +=   'data-expected="100"';
						xhtml +=   'data-rows="1"></div>';
					}
					$table.html(xhtml);																		// Container da popolare
				});

				// ** 2: lettura dei valori dei Dati Previsionali e costruzione dei campi nascosti **
				var $table = $('#TabellaPesiInput');
				model.Common_Get({
					page     : 'cdgBPData',																// Servizio di lettura dati previsionali
					token    : __WACookie.Token,
					onSuccess: function () { }
				}).then(function (params) {

					var xml_2 = $.parseXML(params.d);												// Transforms raw XML data into an XML document
					var allDs = $(xml_2).find('Data').children();
					var hVals = '<tr><th>Voci</th><th>Valori</th></tr>';							// PATCH! Popola la tabella nascosta

					for (var j = 0; j < allDs.length; j ++) {

						var nodeName = allDs[j].localName;											// Nome del nodo
						var nodeVal  = allDs[j].textContent;

						// PATCH! Popola la tabella nascosta
						$('tr[ref=' + nodeName + '] td.tTot input').attr('amount', nodeVal);
						hVals += '<tr>'
						hVals +=   '<td>' + $('#TabellaPesiInput tr[ref=' + nodeName + '] td:first-child').html() + '</td>';
						hVals +=   '<td>' + dgCDG.NumberToLocale(eval(nodeVal)/1000, 2) + '</td>';
						hVals += '</tr>'

					}

					$('#datiPrev').html(hVals);															// PATCH! Popola la tabella nascosta

					setTimeout("$('.ricalcola').click();", 2000)										// Forza il ricalcolo delle tabelle

				});


				// ** 3: Risoluzione dei dataset **
				dgCDG.Init({																			// Risoluzione dei dataset
					tableList  : tableList,																// Elenco delle tabelle da elaborare
					xmlDocument: params.xmlDocument,													// Documento XML dei dati
					nColonne   : 12,																	// Nr. di colonne gestite (12 mesi di default)
					meseInit   : eval($table.attr('init')),
					meseStop   : eval($table.attr('stop')),
				});

				$('.ricalcola').click(function(e){														// Abilita pulsante "ricalcola"
					e.preventDefault();
					dgCDG.RicalcolaVP({
						source: $(this).attr('ref'),
					});
				});

				break;




			// ** IMPORTA CONSUNTIVO **
			case 'cdgImporta':

				_tipoConsuntivo = $(params.xmlDocument).find('TipoImport').text();

				// Gestione selezione mese
				var titleTxt;
				var labelTxt;
				var tipoCons;
				if (_tipoConsuntivo == '1') {															// Prepara le etichette personalizzate delle pagine
					titleTxt = "Selezione mese di competenza";
					tipoCons = 'Tipologia dati importati: consuntivi per singolo mese';
					labelTxt = "text:='Seleziona il mese cui competono i dati importati'";
				} else {
					titleTxt = "Selezione periodo di competenza";
					tipoCons = 'Tipologia dati importati: consuntivi a periodo';
					labelTxt = "text:='Seleziona l\'ultimo mese del periodo consuntivato<br>&nbsp; &nbsp; (da gennaio al mese selezionato)'";
				}
				$('#titoloPeriodo').html(titleTxt);
				$('#tipoCons').html(tipoCons);
				$('snp_label[for=Mese]').attr('data-pars', labelTxt);

				$('body').on('change', '#UltimoMese', function(){										// la select viene creata da uno snippet: non esiste nel DOM > gestione .on()
					var v = $(this).val();
					_okMese = (v > 0 && v <= 12);
					checkBtnImporta();
				});

				// Gestione selezione file
			//	_importTypeIsExcel = false;						// §§§§§ Da definire in funzione del tipo di gestionale da importare (vedi "crea")


				$('#btn-browse').click(function(e){

					e.preventDefault();

					
					_importTypeIsExcel = $('#infoTipoGestionale').text();									// Legge dalla console (btnConsole) il tipo di gestionale (info nascosta perché proviene da altro XML)
					switch (_importTypeIsExcel) {
						case '1':
						case 1:
							_activeFileName= 'fileName_XLS'
						//	$('#fileName_XLS').click();
							break;

						case '2':
						case 2:
							_activeFileName= 'fileName_CSV'
						//	$('#fileName_CSV').click();
							break;

					}
					$('#' + _activeFileName).click();
				});

				$('[id^=fileName]').change(function(){
					id = $(this).attr('id');
					var fname = document.getElementById(id).files[0].name;
					$('#showFileName').val( fname );
					_okFile = true;
					checkBtnImporta();
				});


				function checkBtnImporta(){
					if (_okMese && _okFile) {
						$('#btn-import')
						.removeClass('disabled btn-action')
						.addClass('btn-action-light');
					} else {
						$('#btn-import')
						.addClass('disabled btn-action')
						.removeClass('btn-action-light');
					}
				}


				// Gestione import file
				$('#btn-import').click(function(e){

					e.preventDefault();

					var xml      = '';
					var formdata = new FormData();
					var reader   = new FileReader();

					// 1: Costruzione dell'XML per la trasmissione del valore "mese"
					xml+= "<?xml version='1.0' encoding='utf-8' ?>";									// Costruzione XML base
					xml+= "<Request ID='" + mBase.RequestID() + "'>";
					xml+= '<General>';
					xml+= '<Token>' + __WACookie.Token + '</Token>';
					xml+= '</General>';
					xml+= '<Data>';
					xml+= '<UltimoMese>' + $('#UltimoMese').val() + '</UltimoMese>';
					xml+= '</Data>';
					xml+= '</Request>';

					// 2: Lettura del file e costruzione del FormData per il POST dei dati
				//	reader.readAsDataURL( document.getElementById("fileName").files[0] );
					reader.readAsDataURL( document.getElementById(_activeFileName).files[0] );
					reader.onload = function () {

						var file = reader.result.split(';base64,');
						formdata.append('file', file[1]);												// Contenuto file codificato senza "header"
						formdata.append('xml', xml);													// Stringa XML per la trasmissione del mese
					//	formdata.append('type', document.getElementById("fileName").files[0].type);		// Stringa XML per la trasmissione del mese
						formdata.append('type', document.getElementById(_activeFileName).files[0].type);		// Stringa XML per la trasmissione del mese


						loadCallBack(formdata).then(													// Esegue la callback di importazione file
							function(r, e){
								if (e == 'success') {
									__SYS_status.hasChanged = false;
								}
							}
						);
					}

				});

				break;



			// ** SCOSTAMENTI **
			case 'cdgScostamenti':

				var preload   = '#TabellaQ1, #TabellaQ2, #TabellaQ3, #TabellaQ4, #TabellaConsuntivi';
				var tableList = '#TabellaQ1, #TabellaQ2, #TabellaQ3, #TabellaQ4';

				// ** 1: precompila le tabelle coi dataset
				$(preload).each(function(){

				//	precompileTables({								//§§§§ SOSPESO: vanno rivisti i parametri
				//		tableID: $(this),
				//		xmlDoc : params.xmlDocument
				//	});

					var $table = $(this).find('[ref=body]');
					var allDs  = $(params.xmlDocument).find('Data>Mesi>Mese[ID=1]').children();
					var xhtml  = '';
				
					for (var j = 0; j < allDs.length; j ++) {
				
						var nodeName = allDs[j].localName;												// Nome del nodo
				
						xhtml += '<div class="" dsTablerow ';
						xhtml +=   'data-name="' + nodeName + '"';
						xhtml +=   'data-type="' + $table.attr('type') + '"';
						xhtml +=   'data-init="' + $table.attr('init') + '"';
						xhtml +=   'data-stop="' + $table.attr('stop') + '"';
						xhtml +=   'data-rows="1"></div>';
					}
					$table.html(xhtml);																	// Container da popolare

				});

				// ** Step 2: Risoluzione dei dataset parziale **
				dgCDG.Init({																			// Risoluzione dei dataset
					tableList  : tableList,																// Elenco delle tabelle da elaborare
					xmlDocument: params.xmlDocument,													// Documento XML dei dati
				});


				// ** Step 3: lettura dei valori dei consuntivi e popolamento dei campi nascosti **
				model.Common_Get({
					page     : 'cdgConsuntivo',															// Servizio di lettura dati a consuntivo
					token    : __WACookie.Token,
					onSuccess: function () { }
				}).then(function (params) {
			
					// 1: Crea la tabella nascosta (in origine è creata coi dati del budget, ma servono i valori consuntivati)
					_xml2 = $.parseXML(params.d);
					dgCDG.Init({																		// Risoluzione dei dataset
						tableList  : '#TabellaConsuntivi',
						nColonne   : 12,																// Nr. di colonne gestite (12 mesi di default)
						meseInit   : 1,
						meseStop   : 12,
						xmlDocument: _xml2,																// Documento XML dei dati
					});
				
					// 2: Aggiorna le tabelle degli scostamenti
					dgCDG.DatiScostamento({
						xmlDocument: _xml2,
					});
				});

				break;



				// ** FORECAST (scenari) **
				case 'cdgForecast':

					mese = eval($(params.xmlDocument).find('UltimoMeseImportato').text());
					_lastMonth = (mese != null)? mese : 0;

					model.Common_Get({
						page     : 'cdgScenario1',														// Servizio di lettura dati previsionali
						token    : __WACookie.Token,
						onSuccess: function () { }
					}).then(function (params) {

						_xmls[0]    = $.parseXML(params.d);
						_getXmls[0] = true;

						creaScenari();
					});

					model.Common_Get({
						page     : 'cdgScenario2',														// Servizio di lettura dati previsionali
						token    : __WACookie.Token,
						onSuccess: function () { }
					}).then(function (params) {

						_xmls[1]    = $.parseXML(params.d);
						_getXmls[1] = true;

						creaScenari();
					});


					model.Common_Get({
						page     : 'cdgScenario3',														// Servizio di lettura dati previsionali
						token    : __WACookie.Token,
						onSuccess: function () { }
					}).then(function (params) {

						_xmls[2]    = $.parseXML(params.d);
						_getXmls[2] = true;

						creaScenari();
					});
					

				// PATCH: lettura dei dati del BP x il confronto
					model.Common_Get({
						page     : 'cdgBPData',																// Servizio di lettura dati previsionali
						token    : __WACookie.Token,
						onSuccess: function () { }
					}).then(function (params) {

						_xmls[3]    = $.parseXML(params.d);
						_getXmls[3] = true;

						creaScenari();

					});

				break;


			default:
				break;
		
		}

	}


	// FUNCTION: precompileTables
	//  Precompila le tabelle caricando le definizioni dei dataset
	// PARAMS:
	//  params.table: ID della tabella da precompilare
	// RETURN:
	//  none
	function precompileTables(params) {

		let {tableID, xmlDoc} = params;

		var $table = $(tableID).find('[ref=body]');
		var allDs  = $(xmlDoc).find('Data>Mesi>Mese[ID=1]').children();
		var xhtml  = '';
		let nodeName;

		for (let j = 0; j < allDs.length; j ++) {

			nodeName = allDs[j].localName;													// Nome del nodo

			xhtml += '<div class="" dsTablerow';
			xhtml +=   ' data-name="' + nodeName + '"';
			xhtml +=   ' data-type="' + $table.attr('type') + '"';		// §§ Questo attributo potrebbe sparire (prende "type" in altro modo)
			xhtml +=   ' data-init="' + $table.attr('init') + '"';
			xhtml +=   ' data-stop="' + $table.attr('stop') + '"';
			xhtml +=   ' data-expected="100"';
			xhtml +=   ' data-rows="1"></div>';

	// Da "Distribuzione":
	//		xhtml += '<div class="" dsTablerow ';
	//		xhtml +=   'data-name="' + nodeName + '"';
	//		xhtml +=   'data-type="' + $table.attr('type') + '"';		// §§ Questo attributo potrebbe sparire (prende "type" in altro modo)
	//		xhtml +=   'data-init="' + $table.attr('init') + '"';
	//		xhtml +=   'data-stop="' + $table.attr('stop') + '"';
	//		xhtml +=   'data-expected="100"';
	//		xhtml +=   'data-rows="1"></div>';

	// Da "Scostamenti":
	//		xhtml += '<div class="" dsTablerow ';
	//		xhtml +=   'data-name="' + nodeName + '"';
	//		xhtml +=   'data-type="' + $table.attr('type') + '"';
	//		xhtml +=   'data-init="' + $table.attr('init') + '"';
	//		xhtml +=   'data-stop="' + $table.attr('stop') + '"';
	//		xhtml +=   'data-rows="1"></div>';

	// Da "Scenari":
	//		xhtml += '<div class="" dsTablerow ';
	//		xhtml +=   ' data-name="' + nodeName + '"';
	//		xhtml +=   ' data-type="' + $table.attr('type') + '"';
	//		xhtml +=   ' data-init="' + $table.attr('init') + '"';
	//		xhtml +=   ' data-stop="' + $table.attr('stop') + '"';
	//		xhtml +=   ' data-sufx="' + $table.attr('idextend') + '"';
	//		xhtml +=   ' data-break="' + _lastMonth + '"';
	//		xhtml +=   ' data-rows="1"></div>';
		}
		$table.html(xhtml);																		// Container da popolare

	}


	function creaScenari() {

		var isOk = true;

	//	for (i = 0; i < 3; i++) {
		for (i = 0; i < 4; i++) {																		// Check di tutti i flag
			isOk = isOk && _getXmls[i];
		}

		if (isOk) {

			// ** 1: Costruisce prima la tabella nascosta BP (poi usata nella costruzione degli scenari) **
			var xml_2 = _xmls[3];
			var allDs = $(xml_2).find('Data').children();
			var hVals = '<tr><th>Voci</th><th>Valore</th><th>Trueval</tr>';							// PATCH! Popola la tabella nascosta
	
			for (var j = 0; j < allDs.length; j ++) {
	
				var nodeName = allDs[j].localName;											// Nome del nodo
				var nodeVal  = allDs[j].textContent;
	
				// PATCH! Popola la tabella nascosta
				hVals += '<tr>'
				hVals +=   '<td>' + nodeName + '</td>';
				hVals +=   '<td>' + dgCDG.NumberToLocale(eval(nodeVal)/1000, 2) + '</td>';
				hVals +=   '<td id="bp_' + nodeName + '">' + nodeVal  + '</td>';
				hVals += '</tr>'
	
			}	
			$('#datiPrev').html(hVals);														// PATCH! Popola la tabella nascosta
	

			// ** 2: Processa i tre XML degli scenari **
			for (tab = 1; tab <= 3; tab++) {

	
			//	precompileTables({								//§§§§ SOSPESO: vanno rivisti i parametri
			//		tableID: '#ForecastT' + tab,
			//		xmlDoc : _xmls[tab - 1]
			//	});

				var thisXml = _xmls[tab - 1];
				var $table  = $('#ForecastT' + tab).find('[ref=body]');
				var allDs   = $(thisXml).find('Data>Mesi>Mese[ID=1]').children();
				var xhtml  = '';
			
				for (var j = 0; j < allDs.length; j ++) {
			
					var nodeName = allDs[j].localName;													// Nome del nodo
			
					xhtml += '<div class="" dsTablerow ';
					xhtml +=   ' data-name="' + nodeName + '"';
					xhtml +=   ' data-type="' + $table.attr('type') + '"';
					xhtml +=   ' data-init="' + $table.attr('init') + '"';
					xhtml +=   ' data-stop="' + $table.attr('stop') + '"';
					xhtml +=   ' data-sufx="' + $table.attr('idextend') + '"';
					xhtml +=   ' data-break="' + _lastMonth + '"';
					xhtml +=   ' data-rows="1"></div>';
				}
				$table.html(xhtml);																		// Container da popolare

				dgCDG.Init({																			// Risoluzione dei dataset
					tableList : '#ForecastT' + tab,
					nColonne  : 12,																		// Nr. di colonne gestite (12 mesi di default)
					meseInit  : 1,
					meseStop  : 12,
					xmlDocument: _xmls[tab - 1],														// Documento XML dei dati
				//	context   : 'Forecast' + tab,
				});

			} 
			render_snippet({
				domain: _pageContainer,																	// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
			});

			
			// Gestione della visualizzazione colonne dei mesi
			$('.scenario .row1 .rowLabelTitle').click(function(){

				periodo = $(this).attr('periodo');
				table_H = $($(this).parents()[3]).attr('id');
				table_B = table_H.replace('_head', '_body');

				$('#' + table_H + ' .mese').filter('[periodo=' + periodo + ']').toggle();				// Mostra le celle della tabella "head"
				$('#' + table_B + ' .mese').filter('[periodo=' + periodo + ']').toggle();				// Mostra le celle della tabella "body"

				// Regola il "colspan" della cella della prima riga
				thObj   = $(this).parent() 
				colspan = $(thObj).attr('colspan');
			//	expand  = (periodo == '1')? 4 : 5;
				if (colspan == '1') {
				//	$(thObj).attr('colspan', expand);
					$(thObj).attr('colspan', 4);
				} else {
					$(thObj).attr('colspan', 1);
				}

			});

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
		var compileCBack = params.onCompile     														// Pulsante "Compila"

		var myXml = params.xmlData;

		// Risoluzione degli snippets (subordinata al termine esecuzione delle operazioni di preload)
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

			var domain = params.domain;																	// Default: _templateContainer or "" (empty)
			var snippet = params.snippet;

			switch (snippet) {

				case 'btnConsole_CDG':
					$('#btn-save').click(function (e) {
						e.preventDefault();

						// Controllo validazione dati
						isValid = true;
						
						if (isValid) {
							saveCallBack()																// Callback per salvataggio dati
							.then(function () {
								menu.Render({ active: _pageID });										// Riconfigura il menu
								dashboard.Render({})													// Reimposta la dashboard e i cookie
							});
						}

					});

				default:
					break;

			}
		}
	}

});
