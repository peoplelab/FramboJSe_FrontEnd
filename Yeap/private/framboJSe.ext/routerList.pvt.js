//----------------------------------------------------------------------------------------
// File: routerList.pvt.js
//
// Desc: List of routing definitions for the current web application- Private area
// Path: /private/framboJSe.ext/router
//----------------------------------------------------------------------------------------

define(function () {

	var _routeList = [];														// Routes list

	return {
		List: buildsRouteList
	}


	// FUNCTION: buildsRouteList
	//  Builds the list of defined routes
	// PARAMS:
	//  none
	// RETURN:
	//  routeList : list of the routes
	function buildsRouteList() {

		var newModule;															// Used for new module settings
		var pageDefinitions;													// Used for page definitions


		// ---
		// Step 1: Declaration of modules with their main data
		// ---
		// Note:
		// Each new module will be first defined and added to the route list,
		// then it will be possible adding the specific routes
		// ---

		// 0: Module "Home"
		newModule = {
			module: 'home',																				// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'homePage',																	// Module logical subset (external param from the "master" .aspx)
				modulePath: __homepage.modules,															// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data


		// 2: Module "Settings"
		newModule = {
			module: 'settings',																			// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'settings',																	// Module logical subset (external param from the "master" .aspx)
				modulePath: __settings.modules,															// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data


		// 3: Module "Qualitativa"
		newModule = {
			module: 'qa',																				// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'qualitativa',																// Module logical subset (external param from the "master" .aspx)
				modulePath: __qualitativa.modules,														// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data


		// 4: Module "Economics"
		newModule = {
			module: 'economics',																		// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'economics',																// Module logical subset (external param from the "master" .aspx)
				modulePath: __economics.modules,														// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data


		// 5: Module "Controllo"
		newModule = {
			module: 'controllo',																		// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'controllo',																// Module logical subset (external param from the "master" .aspx)
				modulePath: __controllo.modules,														// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data

		// 6: Module "Dati Testuali"
		newModule = {
			module: 'testuali',																			// Module name (the same as in the virual URL)
			sectors: [{
				sectorName: 'testuali',																	// Module logical subset (external param from the "master" .aspx)
				modulePath: __testuali.modules,															// Path of the module files
				dashboard: 'configuration.dboard.presenter.js' + __SYS_version,							// Common dashbord of the module
				sectorPages: []																			// Pages' definitions (initially empty array)

			}]
		};
		_routeList.push(newModule);																		// Appends the new module's main data




		// ---
		// Step 2: routes setup (adds pages definitions to the modules)
		// ---
		// Note: 
		// Useful for logical grouping of pages: it's possible add several pageDefinitions 
		// to the same module/sector, by defining a logical group or functionality 
		// (e.g. Configuration > timesheet)
		// ---

		// 0: Home page
		pageDefinitions = {
			title: 'homepage',													// Not used (reference only)
			owner: { module: 'home', sector: 'homePage' },
			pages: [
				{
					alias: ['welcome'],
					data: {
						pageID:     'welcome',
						controller: 'home.controller.js',
						model:      'home.model.js',
						presenter:  'home.presenter.js',
						templateID: [503]
					}
				}
			]
		}
		addRoutes(pageDefinitions);

		// 1.1 Settings
		pageDefinitions = {
			title: 'Settings',													// Not used (reference only)
			owner: { module: 'settings', sector: 'settings' },
			pages: [
				{
					alias: ['settings'],
					data: {
						pageID:     'settings',
						controller: 'settings.controller.js',
						model:      'settings.model.js',
						presenter:  'settings.presenter.js',
						templateID: [504]
					}
				}
			]
		}
		addRoutes(pageDefinitions);

		// 1: Analisi qualitativa
		pageDefinitions = {
			title: 'Qualitativa',												// Not used (reference only)
			owner: { module: 'qa', sector: 'qualitativa' },
			pages: [
				{
					alias: ['qualitativa'],										// timesheet malattie edit
					data: {
						pageID:     'qualitativa',
						controller: 'qualitativa.controller.js',
						model:      'qualitativa.model.js',
						presenter:  'qualitativa.presenter.js',
						templateID: [601]
					}
				}
			]
		}
		addRoutes(pageDefinitions);


		// 2: Economic
		pageDefinitions = {
			title: 'Economics',													// Not used (reference only)
			owner: { module: 'economics', sector: 'economics' },
			pages: [
				{
					alias: ['impostazioni'],									// Ricavi
					data: {
						pageID:     'impostazioni',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'impostazioniOk.presenter.js',
						templateID: [751]
					}
				}, {
					alias: ['ricavi'],											// Ricavi
					data: {
						pageID:     'ricavi',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [752]
					}
				}, {
					alias: ['costi-esterni'],									// Costi interni
					data: {
						pageID:     'costiEsterni',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [753]
					}
				}, {
					alias: ['costi-variabili'],									// Costi interni
					data: {
						pageID:     'costiVariabili',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [754]
					}
				}, {
					alias: ['costi-interni'],									// Costi interni
					data: {
						pageID:     'costiInterni',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [755]
					}
				}, {
					alias: ['risorse-umane'],									// Risorse umane
					data: {
						pageID:     'risorseUmane',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [756]
					}
				}, {
					alias: ['fonti'],											// Capex
					data: {
						pageID:     'fonti',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [757]
					}
				}, {
					alias: ['materiali'],										// Pag. 1 - ex Investimenti
					data: {
						pageID:     'materiali',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [762]
					}
				}, {
					alias: ['immateriali'],										// Pag. 2 - ex Investimenti
					data: {
						pageID:     'immateriali',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [763]
					}
				}, {
					alias: ['finanziarie'],										// Pag. 3 - ex Investimenti
					data: {
						pageID:     'finanziarie',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [764]
					}

				}, {
					alias: ['finanziamenti'],									// Capex
					data: {
						pageID:     'finanziamenti',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [759]
					}
				}, {
					alias: ['iva'],												// Capex
					data: {
						pageID:     'iva',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [761]
					}

				}, {
					alias: ['conto-economico'],									// Conto economico
					data: {
						pageID:     'contoEconomico',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [705]
					}
				}, {
					alias: ['rendiconto-finanziario'],							// Rendiconto finanziario
					data: {
						pageID:     'rendiconto',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [706]
					}
				}, {
					alias: ['stato-patrimoniale'],								// Stato patrimoniale
					data: {
						pageID:     'statoPatrimoniale',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [707]
					}
				}, {
					alias: ['fonti-finanziarie'],								// Stato patrimoniale
					data: {
						pageID:     'fontiFinanziarie',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [708]
					}
				}, {
					alias: ['messaggi'],
					data: {
						pageID:     'messaggi',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'messaggi.presenter.js',
						templateID: [780]
					}
				}, {
					alias: ['analisi-leanus'],
					data: {
						pageID:     'repLeanus',
						controller: 'leanus.controller.js',
						model:      'economics.model.js',
						presenter:  'leanus.presenter.js',
						templateID: [781]
					}
				}, {
					alias: ['report-testi'],
					data: {
						pageID:     'repTestiWord',
						controller: 'leanus.controller.js',
						model:      'economics.model.js',
						presenter:  'leanus.presenter.js',
						templateID: [782]
					}
				}, {
					alias: ['report-prospetti'],
					data: {
						pageID:     'repProspWord',
						controller: 'leanus.controller.js',
						model:      'economics.model.js',
						presenter:  'leanus.presenter.js',
						templateID: [782]
					}
				}, {
					alias: ['gestione-straordinaria'],											// Gestione straordinaria
					data: {
						pageID:     'gestStraordinaria',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [765]
					}
				}, {
					alias: ['anno-precedente-insert'],											// Gestione Anno -1
					data: {
						pageID:     'annoPrecInsert',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [766]
					}
				}, {
					alias: ['anno-precedente-prospetto'],										// Gestione Anno -1
					data: {
						pageID:     'annoPrecProspetto',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [767]
					}
				}, {
					alias: ['anno-precedente-conferma'],										// Gestione Anno -1
					data: {
						pageID:     'annoPrecConferma',
						controller: 'economics.controller.js',
						model:      'economics.model.js',
						presenter:  'economics.presenter.js',
						templateID: [768]
					}
				}
			]
		}
		addRoutes(pageDefinitions);


		// 3: Controllo gestione
		pageDefinitions = {
			title: 'Controllo',																	// Not used (reference only)
			owner: { module: 'controllo', sector: 'controllo' },
			pages: [
				{
					alias: ['crea'],															// Crea controllo di gestione
					data: {
						pageID:     'cdgCrea',
						controller: 'crea.controller.js',
						model:      'controllo.model.js',
						presenter:  'crea.presenter.js',
						templateID: [801]
					}
				}, {
					alias: ['distribuzione-mensile'],											// Ricavi
					data: {
						pageID:     'cdgDistribuzione',
						controller: 'controllo.controller.js',
						model:      'controllo.model.js',
						presenter:  'controllo.presenter.js',
						templateID: [802]
					}
				}, {
					alias: ['importa-consuntivo'],												// Ricavi
					data: {
						pageID:     'cdgImporta',
						controller: 'controllo.controller.js',
						model:      'controllo.model.js',
						presenter:  'controllo.presenter.js',
						templateID: [803]
					}
				}, {
					alias: ['analisi-indici'],													// Ricavi
					data: {
						pageID:     'cdgAnalisi',
						controller: 'controllo.controller.js',
						model:      'controllo.model.js',
						presenter:  'controllo.presenter.js',
						templateID: [804]
					}
				}, {
					alias: ['scostamenti'],														// Ricavi
					data: {
						pageID:     'cdgScostamenti',
						controller: 'controllo.controller.js',
						model:      'controllo.model.js',
						presenter:  'controllo.presenter.js',
						templateID: [805]
					}
				}, {
					alias: ['forecast'],														// Ricavi
					data: {
						pageID:     'cdgForecast',
						controller: 'controllo.controller.js',
						model:      'controllo.model.js',
						presenter:  'controllo.presenter.js',
						templateID: [806]
					}
				}
			]
		}
		addRoutes(pageDefinitions);


		// 4: Dati testuali
		pageDefinitions = {
			title: 'Dati testuali',																// Not used (reference only)
			owner: { module: 'testuali', sector: 'testuali' },
			pages: [
				{
					alias: ['descrizione-azienda'],												// Descrizione azienda
					data: {
						pageID:     'dtDescrizione',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [901]
					}
				}, {
					alias: ['prodotto-processo'],												// Prodotto e processo
					data: {
						pageID:     'dtProdotto',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [902]
					}
				}, {
					alias: ['analisi-mercato'],													// Prodotto e processo
					data: {
						pageID:     'dtMercato',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [903]
					}
				}, {
					alias: ['posizione-competitiva'],											// Prodotto e processo
					data: {
						pageID:     'dtPosizione',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [904]
					}
				}, {
					alias: ['management'],											// Prodotto e processo
					data: {
						pageID:     'dtManagement',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [905]
					}
				}, {
					alias: ['executive-summary'],											// Prodotto e processo
					data: {
						pageID:     'dtExecutive',
						controller: 'testuali.controller.js',
						model:      'testuali.model.js',
						presenter:  'testuali.presenter.js',
						templateID: [906]
					}
				}
			]
		}
		addRoutes(pageDefinitions);

		// ** Returns the updated list **
		return _routeList;

	}


	// FUNCTION: addRoutes
	//	Adds the new page definitions (routes) to the router list, 
	// PARAMS:
	//	params.owner : defines the module and the sector to which the pageDefinitions are to be added
	//	params.pages : pages definitions
	// OUTPUT:
	//	none
	function addRoutes(params) {

		var module = params.owner.module;										// Module name
		var sector = params.owner.sector;										// Sector name
		var pages = params.pages;												// Pages definitions

		var tmpModule;
		var tmpSector;

		// Searches for the corresponding module/sector
		for (var i = 0; i < _routeList.length; i++) {							// Level 1: scans the modules
			tmpModule = _routeList[i];											// Temporary var: current module
			if (tmpModule.module == module) {									// Compare module name:

				// Module found: now scans for sectors
				tmpSector = tmpModule.sectors;									// Temporary var: current sector
				for (var j = 0; j < tmpSector.length; j++) {					// Level 2: scans the sector
					if (tmpSector[j].sectorName == sector) {

						// Module/sector found: adds new pages definitions
						_routeList[i].sectors[j].sectorPages = _routeList[i].sectors[j].sectorPages.concat(pages);

					}
				}

			}
		}

	}


});
