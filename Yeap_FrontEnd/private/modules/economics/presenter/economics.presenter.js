//----------------------------------------------------------------------------------------
// File: ricavi.presenter.js
//
// Desc: Presenter della pagina "Economics - Ricavi"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter',
	'templatesHandler',
	'snippets',
	'modals',
	'currentDashboard',
	'currentModel',
	'menu',
	'datagrid',
	'/private/modules/common/model/resources.model.js',
], function (pBase, th, snippets, modals, dashboard, model, menu, dg, resources) {

	// ** Module management **
	var _module = {};																					// Mapping of the current module
	var _resources = {}																					// Mapping of the additional resources (.css and/or .js files)


	// ** Global variables **
	var _xml = '';																						// XML data (to show)
	var _pageID = '';																					// Sitemap/page ID
	var _templateID = '';																				// Template ID (for presenter)
	var _modalsContainer = '#modalsContainer';															// Target container (ID) for the modal windows
	var _menuContainer   = '#menuContainer';															// Target container (ID) for the filter template
	var _pageContainer   = '#pageContainer';															// Target container (ID) for the list template 

	var _IvaDefault;
	var _nrProdotti;
	var _nrMatPrime;

	var _BP = 0;

	var _flabelCount = 0;

	return {

		Init: init,																						// Initializes (setup) the page
		RenderPage: renderPage,																			// Render del contenuto pagina
		GetData4Saving: function () {																	// Gets data from page controls for saving
			return dg.BuildsXML({ name: _pageID });
		},
		Show_ok_modal: function (params) {																// "Ok" modal window's handler
			modals.ShowOK({
				target: _modalsContainer,
				URL   : params.redirect,
			});
		},
		Show_ko_modal: function (code, msg) {															// "Error" modal window's handler
			modals.ShowErr({
				target : _modalsContainer,
				errCode: code,
				errMsg : msg
			})
		},
		Show_ko: function (code, msg) {																	// "Error" handler
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

		_BP = eval($(_xml).find('Response>Data>StatusBP').text());
		th.Render({
			code: _templateID[0],
			XML: _xml,
			onSuccess: function (result) {

				var html = result;

				resources.XmlEconomics({
					onSuccess: function (result) {
						__Preloads.economics = result;

						render_template_page({
							templateHtml: html,
							xmlDocument: _xml,
						});
						render_snippet({
							domain: _pageContainer,														// Define the range for snippets' resolution. (Default: _templateContainer -> Applies to the template container. Should be also: "" -> Applies to the whole document)
							onSaveCallBack: params.OnSave,												// Callback per salvataggio dati.
							onCompile: params.Compile,													// Callback per salvataggio dati.
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

		// Inizializza le variabili globali lette da cookie (devono essere eseguite DOPO dashboard.Init, che costruisce l'oggetto __WACookie)
		_IvaDefault = __WACookie.ivaDefault;
		_nrProdotti = __WACookie.nProdotti;
		_nrMatPrime = __WACookie.nMatPrime;


		// ** 1: Risoluzione dei dataset **
		dg.Init({																						// Risoluzione dei dataset
			nColonne: __WACookie.nYears,																// Nr. di anni del b.p.
			xmlDocumnt: params.xmlDocument,																// Documento XML dei dati
		});

		// Gestione titolo alternativo (scroll page)
		$(window).on('scroll', function (e) {

			var y = window.scrollY;
			if (y > 80) {
				$('#scrollTitle').show('fast');
			} else {
				$('#scrollTitle').hide('fast');
			}

		});


		// Funzioni personalizzate per pagina 
		switch (_pageID) {

			case 'iva':																					// Riempie automaticamente i campi "null" col valore IVA di default 

				var formatted = (Math.round(_IvaDefault * 100) / 100).toFixed(2);
				var txtValue = dg.NumberToLocale(_IvaDefault, 2);

				$('.mirror').each(function () {

					var v = eval($(this).val());
					if (v > 0 && v < 10) {																// Campi con valore == "null"

						$(this).val(_IvaDefault * 1000);												// Campo "mirror": valore moltiplicato 1000 

						var m = $(this).attr('mirror');													// ID del campo di input visualizzato
						var l = $('[label=' + m + ']');													// Campo etichetta valore formattato

						$('#' + m).val(formatted);														// Valore formattato dell'IVA default
						$('#' + m).removeClass('isDefault').addClass('autofill');
						$('#' + m).prev().addClass('autofill');

						$(l).val(txtValue).removeClass('isDefault').addClass('autofill');
						__SYS_status.hasChanged = true;													// Aggiornamento STATUS globale: attiva il flag di valore modificato

					}

				});

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

				case 'drawerTitle':																		// Attribuzione delle classi 'error' ai cassetti

					var eTypes = ['hasErr', 'hasWarning'];												// Tipi errore tracciati
					var bTypes = ['.box_Lev_1', '.box_Lev_2'];											// Classi dei container tracciati

					for (var eCnt = 0; eCnt < eTypes.length; eCnt++) {
						$('.form-control.' + eTypes[eCnt]).each(function () {
							for (var bCnt = 0; bCnt < bTypes.length; bCnt++) {
								var targetId = $(this).closest(bTypes[bCnt]).attr('id');
								$('[ref=' + targetId + ']').addClass(eTypes[eCnt]);
							}
						});
					}
					// **********
					//  PATCH!!! 
					//	Trucco da pirata per far generare e calcolare l'oggetto "tagliaQui" quando ho tutti i dati, e poi spostarlo ad "incollaQui" dove al momento i dati ancora non esistevano
					// **********
					if ($('#incollaQui').length > 0 && $('#tagliaQui').length > 0) {
						var myTable = $('#tagliaQui');
						$('#tagliaQui').remove();
						$('#incollaQui').html(myTable);
					}

					// **********
					// Add-on (19/02/2019): Gestione pulsante "Fill to zero"
					// **********

					// Step 1: Gestione hide/show della consolle legata allo stato del drower
					$('a.drawerTitle').click(function () {
						var r = $(this).attr('ref');
						var a = $(this).attr('aria-expanded');
						if (a == 'true') {																// Ragiona "inverso" perché il valore di aria-expanded cambia al termine dell'animazione
							$('div[ref=' + r + ']').hide();
						} else {
							$('div[ref=' + r + ']').show();
						}
					});
					// Step 2: Funzione di "filler" del pulsante
					$('.btnFiller').click(function (e) {

						e.preventDefault();

						var tableID = '#' + $(this).parent().attr('ref') + ' [dstable][data-type=input]';
						$(tableID + ' input.mirror').each(function () {									// Campo "mirror" di gestione del valore 

							var v = eval($(this).val());
							if ((v > 0 && v < 10) || isNaN(v)) {
								var r = $(this).attr('mirror');											// ID del campo di input visualizzato
								var l = $('[label=' + r + ']');											// Campo etichetta valore formattato

								$(this).val(0);
								$('#' + r).removeClass('isDefault').addClass('autofill');
								$('#' + r).prev().addClass('autofill');

								$(l).val('0,00').removeClass('isDefault').addClass('autofill');			// Etichetta fissa: "0,00"
								__SYS_status.hasChanged = true;											// Aggiornamento STATUS globale: attiva il flag di valore modificato
							}
						})
					})
					$('.infoPopup.info').popover({html: true});


					// **********
					// Add-on (25/06/2019): Gestione drawer Materie prime (quando disabilitate)
					// **********
					if (_nrMatPrime == 0) {

						// Disabilita l'apertura dei drawers corrispondenti					
						$('.MPdrawer').addClass('btn disabled btn-disabled');

					}


					if (_pageID == 'statoPatrimoniale') {



						if ( $('[data-name=Delta_SP] input.hasErr').length > 0) {
							$('#deltaErrMsg').show();
						}
					}

					break;


				case 'btnConsole':
					$('#btn-save').click(function (e) {
						e.preventDefault();

						var nuovoTesto = 'Salvato (D.P.)';
						var nuovoStato = 1;

						if (_pageID === 'annoPrecInsert') {
							nuovoTesto = 'Salvato (A.P.)';
							nuovoStato = 3;
						}
						$('#statusInfo .status').text(nuovoTesto).attr('title', nuovoStato);			// Aggiorna lo status del BP
						$('#bpc').attr('title', 'Code: ' + nuovoStato);


						//$('#statusInfo .status').text('Salvato');										// Aggiorna lo status del BP
						$('#repPiano').addClass('disabled');

						saveCallBack()																	// Callback per salvataggio dati
							.then(function () {
								menu.Render({ active: _pageID });										// Riconfigura il menu
							})
					});


					$('#btn-confirm').click(function (e) {												// Pulsante "PREcompila"
						e.preventDefault();

						tipo = (_pageID == 'annoPrecInsert') ? 'Precomp_AP' : 'Precomp_DP';				// Determina il tipo chiamata al SaaS
						compileCBack({ type: tipo });													// Callback per compilazione.
						__WACookie.showErr = true;
						Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });
					});


					$('#btn-compile').click(function (e) {												// Pulsante "Compila"
						e.preventDefault();

						compileCBack({ type: 'Compile' });												// Callback per compilazione.
						__WACookie.showErr = true;
						Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });
					});


					$('#btn-JustConfirm').click(function (e) {												// Pulsante "Compila"
						e.preventDefault();

						compileCBack({ type: 'JustConfirm' });												// Callback per compilazione.
						__WACookie.showErr = true;
						Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });
					});

				//	$('#btn-Confirm').click(function (e) {												// Pulsante "Compila"
				//		e.preventDefault();
				//
				//		compileCBack({ type: 'Confirm' });												// Callback per compilazione.
				//		__WACookie.showErr = true;
				//		Cookies.set('YeapWAPars', JSON.stringify(__WACookie), { expires: 1 });
				//	});
					break;

				case 'XML_label_economics':
					var dataset = [];
					switch (_pageID) {																	// Funzioni personalizzate per pagina 


						case 'ricavi':

							dataset = [
								'Prodotto_QtaVenduta',
								'Prodotto_PrezzoUnitario',
								'Ricavi_RicavoNetto',
							];
							hideRows({ list: dataset, type: 'Prod' })
							break;

						case 'costiEsterni':
							dataset = [
								'Acquisti_PF_PercPrezzoUnitario',
								'Acquisti_PF_CostoUnitario',
								'Acquisti_PF_CostoNetto',
								'Magazzino_PF_Giorni',
								'Magazzino_PF_Quantita',
								'Magazzino_PF_CostoNetto',
								'Magazzino_CostoNetto',
							];
							hideRows({ list: dataset, type: 'Prod' })

							dataset = [
								'Acquisti_MP_PrezzoUnitario',
								'Acquisti_MP_Quantita',
								'Acquisti_MP_CostoNetto',
								'Magazzino_MP_Giorni',
								'Magazzino_MP_Quantita',
								'Magazzino_MP_CostoNetto',
							];
							hideRows({ list: dataset, type: 'MatPrime' })
							break;

						case 'contoEconomico':
							dataset = [
								'Ricavi_CE',
								'CostiEsterniPF_CE',
							];
							hideRows({ list: dataset, type: 'Prod' })
							dataset = [
								'CostiEsterniMP_CE',
							];
							hideRows({ list: dataset, type: 'MatPrime' })

							break;

						case 'gestStraordinaria':
							break;

						case 'annoPrecInsert':
							// Numerazione anni per campi crediti/debiti a medio
							var start = eval(__WACookie.init);
							var years = eval(__WACookie.nYears);

							for (i = 1; i < years; i++) {
								s = start + i;
							//	var t = "Ref.: " + s;
								var t = "CASH: " + s;
								$('.rowLabelNrYear[ref=' + i + ']').text(t);
							}
							break;

						case 'annoPrecConferma':
							// Determina il messaggio da visualizzare
							var status = eval($('[mirror=AP_PC_Ok_r1_c1]').val() / 1000);
							var sbilancio = dg.LocaleToNumber($('#AP_PC_SbilancioEffettivoPerc_Anno1_r1_c1').val());	//PATCH 16/12/2019: devo sapere se sbilancio è 0 o no

							var msg_ID = '';
							var btn_ok = true;

							switch (true) {

								case (_BP === 41):
									$('#compile41').show();
									switch (status) {

										case 1:
											msg_ID = (sbilancio == 0)? '#compileOk' : '#compileQuasiOk';
											$('#btn-JustConfirm').removeClass('disabled');
											break;

										case 2:
											msg_ID = '#compileWarning';
											break;

										case 99:
											msg_ID = '#compileError';
											break;

										case 80:
											msg_ID = '#quadraturaError';
											$('#compilaBtn').hide();
											$('#compilaTesto').removeClass('col-9').addClass('col-12');
											break;

										default:
											break;
									}
									$(msg_ID).show();														// Mostra il messaggio opportuno
									break;

								case (_BP >= 7 && _BP !== 41):
									$('#compileWarningConferma2, #compileWarningConferma2 .annoPrec').show();
									break;

								case (_BP <= 4):
									$('#compileWarningConferma, #compileWarningConferma .annoPrec').show();
									break;
							}
							break;
						default:
							break;
					}

					break;
				case 'switcher':
					$('#abilitaCompilaWrn, #abilitaCompilaErr, #abilitaCompilaOk').change(function (e) {
						var c = $(this).prop('checked');

						if (!c) {
							// $('#btn-compile').addClass('disabled');
							$('#btn-JustConfirm').addClass('disabled');
						} else {
							//$('#btn-compile').removeClass('disabled');
							$('#btn-JustConfirm').removeClass('disabled');
						}
					});
					break;


				case 'qualityBadge':
					switch (_BP) {
						case 7:
							$('#dataQuality').addClass('isOk');
							break;
						case 8:
							$('#dataQuality').addClass('isWarning');
							break;
						case 9:
							$('#dataQuality').addClass('isKo');
							break;
					}
					break;

				default:
					break;

			}
		}
	}



	// FUNCTION: hideRows
	//	Nasconde e valorizza a zero le righe dei prodotti in eccesso
	// PARAMS:
	//	params.list : elenco dei dataset da processare
	// RETURN:
	//	None
	function hideRows(params) {

		var list = params.list;
		var nMax;
		var nTot;

		switch (params.type) {
			case 'Prod':
				nTot = 5;
				nMax = _nrProdotti;
				break;

			case 'MatPrime':
				nTot = 10;
				nMax = _nrMatPrime;
				break;
		}

		for (var i = 0; i < list.length; i++) {

			var ds = list[i];
			for (j = nMax + 1; j <= nTot; j++) {															// Scansione delle righe dei prodotti in eccesso

				$row = $('label[ref=' + ds + '_' + j + ']').parent();
				$row.hide();
			}
		}
	}

});

