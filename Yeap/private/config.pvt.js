//----------------------------------------------------------------------------------------
// File: config.pvt.js
//
// Desc: Configuration file for SystemJS module - Private settings
// Path: /private/
//----------------------------------------------------------------------------------------

	// ** Loads cookie and converts data in JSON format **
	cookieRaw = Cookies.get('YeapWAPars');
	var __WACookie = (cookieRaw == undefined || cookieRaw == '')? '' : $.parseJSON(cookieRaw);

	// ** Declare external site URL
	//		Sviluppo: https://wwws.dev-yeap.it		(hostname: "localhost")
	//		Test	: https://wwws.dev-yeap.it		(hostname: "wwws.dev-yeap.it")
	//		Prod:	: https://www.yeapitaly.it		(hostname: "www.yeapitaly.it")

	var __WPressSiteURL = '';
	var hostname = location.hostname;

	switch (location.hostname) {
		case "localhost":
		case "wwws.dev-yeap.it":
		case "test-yeap.people-manager.it":
			__WPressSiteURL = 'https://wwws.dev-yeap.it';
			break;
		case "www.yeapitaly.it":
		case "yeap.people-manager.it":
			__WPressSiteURL = 'https://www.yeapitaly.it';
			break;
	}


	// ** Declare main paths **
	
	// ** _pvtRoot: contiene l'URL dell'applicazione, necessario per il framework per puntare ai files dell'APP (es. snippets "locali")
	// ** Dovrebbe leggere il valore di host da href, per aggiornarsi automaticamente neggli ambienti sviluppo, test e prod.

	var _pvtRoot  = '/private/';												// Percorso "interno" generico <=> framework locale (deprecato)
//	var _pvtRoot  = 'https://localhost:8082/private/';							// Ambiente di sviluppo (locale)
//	var _pvtRoot  = 'https://localhost:8082/private/';							// Ambiente di test (preprod)
//	var _pvtRoot  = 'https://localhost:8082/private/';							// Ambiente di produzione (preprod)

	var _pvtPaths = {
		framework: _pvtRoot + 'framboJSe.ext/',
		modules  : _pvtRoot + 'modules/',
		resources: _pvtRoot + 'resources/',
		templates: _pvtRoot + 'templates/',
		xml      : _pvtRoot + 'xml/',
	}

	// ** Declare application paths **
	var __common = {
		modules  : _pvtPaths.modules + 'common/',
		templates: _pvtPaths.templates,
	}
	var __dashboard = {
		presenter: _pvtPaths.modules   + 'dashboards/presenter/',
		modules  : _pvtPaths.modules   + 'dashboards/',
		templates: _pvtPaths.templates + 'dashboards/'
	}
	var __homepage = {
		modules  : _pvtPaths.modules   + 'home/',
		templates: _pvtPaths.templates + 'home/'
	}
	var __menu = {
		modules  : _pvtPaths.modules   + 'common/',
		templates: _pvtPaths.templates + 'menu/'
	}
	var __qualitativa = {
		modules  : _pvtPaths.modules   + 'qualitativa/',
		templates: _pvtPaths.templates + 'qualitativa/'
	}
	var __economics = {
		modules  : _pvtPaths.modules   + 'economics/',
		templates: _pvtPaths.templates + 'economics/'
	}
	var __controllo = {
		modules  : _pvtPaths.modules   + 'controllo/',
		templates: _pvtPaths.templates + 'controllo/'
	}
	var __settings = {
		modules  : _pvtPaths.modules   + 'settings/',
		templates: _pvtPaths.templates + 'settings/'
	}
	var __testuali = {
		modules  : _pvtPaths.modules   + 'testuali/',
		templates: _pvtPaths.templates + 'testuali/',
		includes : _pvtPaths.templates + 'testuali/include/',
	}

	// ** Builds system data configuration **
	__PVT_config = {
		map: {

			// ** Framework extensions **
			// Snippets:
			snippetsList_pvt   : _pvtPaths.framework + 'snippets/snippetsList.pvt.js' + __SYS_version,
			widgetsList_pvt    : _pvtPaths.framework + 'widgets/widgetsList.pvt.js' + __SYS_version,
			// Templates:
			templatesList_pvt  : _pvtPaths.templates + 'templatesList.pvt.js' + __SYS_version,
			// Router:
			routerList_pvt     : _pvtPaths.framework + 'routerList.pvt.js' + __SYS_version,
			// Sitemap
			customizeSitemap   : _pvtPaths.framework + 'sitemapCustomization.pvt.js' + __SYS_version,

			// ** "Private" settings **
			// Menu
			menu               : _pvtPaths.modules + 'common/presenter/menu.presenter.js' + __SYS_version,
			datagrid           : _pvtPaths.modules + 'economics/presenter/datagrid.presenter.js' + __SYS_version,
		//	datagridCDG        : _pvtPaths.modules + 'economics/presenter/ex_datagrid_CDG.presenter.js' + __SYS_version,	// §§§§ Da segare appena rivisto il nuovo datagrid_CDG
			datagridCDG        : _pvtPaths.modules + 'controllo/presenter/datagrid_CDG.presenter.js' + __SYS_version,
			dependencies       : _pvtPaths.modules + 'economics/presenter/dependencies.presenter.js' + __SYS_version,

			economicsModel     : _pvtPaths.modules + 'economics/model/economics.model.js' + __SYS_version,
			reportController   : _pvtPaths.modules + 'common/controller/report.controller.js' + __SYS_version,
			reportModel        : _pvtPaths.modules + 'common/model/report.model.js' + __SYS_version,
			reportPresenter    : _pvtPaths.modules + 'common/presenter/report.presenter.js' + __SYS_version,
			testualiModel      : _pvtPaths.modules + 'testuali/model/testuali.model.js' + __SYS_version,
			
		}
	};

	var __Preloads = {};																				// Struttura per il precaricamento dei dati da chiamate SaaS

	// PATCH (13/12/2019): problema generato da Safari, che non permette "window.open()" nelle chiamate async => creo in precedenza un oggetto window vuoto, e modifico la location in risposta al servizio
	var __ReportWindows = '';																			// Variabile per gestire l'oggetto "window" per l'apertura dei report
