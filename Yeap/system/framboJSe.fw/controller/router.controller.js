//----------------------------------------------------------------------------------------
// File: router.controller.js
//
// Desc: Controller for page routing - System engine
// Path: /system/framboJSe.fw/controller
//----------------------------------------------------------------------------------------

define([
], function () {

	// Module constants
	var _PAGE_404_ERROR   = _sysRoot + 'pages/404.html';												// 404 error page (constant)
	var _ERRORCOOKIE_NAME = 'pm-error';																	// error cookie name
	var _ERRORCOOKIE_KEY  = 'Error-msg';																// error cookie key
	var _PVT_RESOURCES    = _pvtRoot + 'resources/';

	// Module variables
	var _routerList = '';																				// List of routes definitions


	return {
		init: setup																						// Init function
	}


	// FUNCTION: setup
	//  Init function for controller: loads the required routing list
	// PARAMS:
	//  code : element (id)
	// RETURN:
	//  none
	function setup(params) {


		// ** Imports the routes definitions list **
		switch (__PageScope) {
			case 'public':
				SystemJS.import('routerList_pub').then(function (data) {
					_routerList = data.List();
					getsPageData(params);
				});
				break;

			case 'private':
				SystemJS.import('routerList_pvt').then(function (data) {
					_routerList = data.List();
					getsPageData(params);
				});
				break;

			default:
				if (__SYS_consoleLog) {
					console.log('-> Router controller: __PageScope unknown ("' + __PageScope + '")');
				}
				break;
		}

	}


	// FUNCTION: getsPageData
	//  Checks for URL and gets the page's data
	// PARAMS:
	//	params.Sector : Specifies the sector who the page belongs
	// RETURN:
	//  pageDataSet : page data set (pageID, ...)
	function getsPageData(params) {

		//  ** variables assignement **
		//  Params variables
		var sector = (params.Sector != '') ? params.Sector : '';										// Name of the module sector (from the "master" .aspx)
		//  Main variables for Route list management
		var URL_detail = [];																			// Array of the decomposed elements of the URL
		var moduleName = '';																			// Name of the module
		var modulePath = '';																			// Physical path of the module files
		var pageName = '';																				// Name of the page (virtual URL)
		var detailCode = '';																			// ID of the detail (if any)
		var level2Code = '';																			// ID of the 2nd level detail (if any)
		//  Page data
		var pageParams = {};																			// Page parameters to be passed
		var controller = 'controller/';																	// Name of the "controller" for the file mapping
		var model      = 'model/';																		// Name of the "model" for the file mapping
		var presenter  = 'presenter/';																	// Name of the "presenter" for the file mapping
		var dashboard  = SystemJS.map.default;															// Name of the "dashboard" for the file mapping (default: empty)
		var pageID     = '';																			// Page ID
		var templateID = '';																			// Template ID (for template handler)
		var itemCode   = '';																			// Item code (for edit pages)
		var others     = '';																			// Others params to be passed
		//  Support variables:
		var rFoundPage = false;																			// Flag for found page (default: false)
		var rModule    = '';																			// Current module of the route list
		var rSector    = '';																			// Current sector
		var rPageSet   = '';																			// Current page set
		var rPageData  = '';																			// Current page data

		var aliases    = [];

		// ** Detectes the current route **
		// Step 1: filters and decodes URL into components
		URL_detail =
			location.href																				// Gets current URL
				.replace(location.origin + '/', '')														// Removes origin (protocol & hostname)
				.replace(location.hash  , '')															// Removes hashes
				.replace(location.search, '')															// Removes query string
				.split('/');
		moduleName = URL_detail[0];												// Sets the module name

		//pageName   = URL_detail[1] + ((URL_detail.length > 2)? '/:cod' : '');	// Sets the page name (distinguishing between "list" and "edit")
		pageName = URL_detail[1];
		for (i = 3; i <= URL_detail.length; i++) {
			pageName += '/:cod';
		}

		detailCode = (URL_detail.length > 2) ? URL_detail[2] : detailCode;								// Sets the item (detail) code (for edit pages)
		level2Code = (URL_detail.length > 3) ? URL_detail[3] : level2Code;								// Sets the item (detail) code (for edit pages)


		// Step 2: scans the route list
		for (var i = 0; i < _routerList.length; i++) {													// Level 1: scans the modules
			rModule = _routerList[i];																	// Set the current module
			if (rModule.module == moduleName) {															// Compare module name:

				// Module found: now scans for sectors
				rSector = rModule.sectors;

				for (var j = 0; j < rSector.length; j++) {												// Level 2: scans the sector
					if (rSector[j].sectorName == sector) {

						// Sector found: now sets sector values
						modulePath = rSector[j].modulePath;												// Module path
						controller = modulePath + controller;											// Adds the module path to the "controller" file mapping
						model      = modulePath + model;												// Adds the module path to the "model" file mapping
						presenter  = modulePath + presenter;											// Adds the module path to the "presenter" file mapping
						// If specified, gets the common dashboard
						if (rSector[j].dashboard > '') {
							dashboard = __dashboard.presenter + rSector[j].dashboard;
						}

						// Scans for pages
						rPageSet = rSector[j].sectorPages;
						for (var k = 0; k < rPageSet.length; k++) {										// Level 3: scans the pages

							aliases = rPageSet[k].alias
							for (var a = 1; a <= aliases.length; a++) {									// Level 4: scans the aliases

								if (aliases[a - 1] == pageName) {

									// Page found: now gets the page data
									rFoundPage = true;
									rPageData  = rPageSet[k].data;
									pageID     = rPageData.pageID.replace('[[index]]', a);				// Replaces the index placeholder with his value

									// Reads the page attributes and sets the "current"
									controller += rPageData.controller + __SYS_version;					// Adds the file name to the "controller" file mapping
									model      += rPageData.model      + __SYS_version;					// Adds the file name to the "model" file mapping
									presenter  += rPageData.presenter  + __SYS_version;					// Adds the file name to the "presenter" file mapping

									if (rPageData.dashboard != undefined) {		// If defined, gets the local dashboard
										if (rPageData.dashboard > '') {
											dashboard = __dashboard.presenter + rPageData.dashboard;
										} else {
											dashboard = SystemJS.map.default;
										}
									}

									// Sets the params to be passed to the target page (controller)
									pageParams = {
										pageID    : pageID,												// Page ID
										templateID: rPageData.templateID,								// Template ID (for template handler)
										itemCode  : detailCode,											// Item code (for edit pages)
									}
									if (aliases.length > 1) {
										$.extend(pageParams, { index: a });								// Adds the index as a new basic param
									}
									// §§ - start
									if (level2Code != '') {
										$.extend(pageParams, { entry: level2Code });					// PATCH: gestione 2° livello - da uniformare
									}
									// §§ - end
									if (rPageData.others != undefined) {								// Others params to be passed
										$.extend(pageParams, rPageData.others);
									}


									// Updates the system configurations with the new file mapping
									SystemJS.config({
										map: {
											currentController: controller,
											currentModel: model,
											currentPresenter: presenter,
											currentDashboard: dashboard
										}
									});
									__SYS_config.current = {
										module: URL_detail[0],
										page: URL_detail[1],
										code: URL_detail[2],
										pageID: pageID													// PATCH (30/10/2018): aggiunto il pageID -> deve diventare importante come "firma" in tutte le situazioni (menu, dashboard, ecc.)
									};

									// Imports the controller and starts the page execution
									SystemJS.import(controller).then(function (ctrl) {
										ctrl.init(pageParams);
									});
									break;

								}
							}

						}
					}
				}
			}
		}

		// ** Exceptions management **
		if (!rFoundPage) {

			var _cookieValues;

			// Creates a cookie to log the error message
			_cookieValues = '{';
			_cookieValues += '"' + _ERRORCOOKIE_KEY + '": "' + URL_detail + '"';
			_cookieValues += '}';
			Cookies.set(_ERRORCOOKIE_NAME, _cookieValues, { expires: 1 });

			// Manages error (redirect or console log)
			if (__SYS_redirect400) {																	// Defined in config.sys.js
				location = _PAGE_404_ERROR;
			} else {
				if (__SYS_consoleLog) {
					console.log('_PAGE_404_ERROR:', URL_detail[0] + '/' + URL_detail[1])
				}
			}

		}
	}

});
