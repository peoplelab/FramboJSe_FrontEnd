//----------------------------------------------------------------------------------------
// File: config.sys.js
//
// Desc: Configuration file for SystemJS module - Framework core settings
// Path: /System/
//----------------------------------------------------------------------------------------

	// ** System variables **
	var __SYS_consoleLog    = true;												// Enables the system console logs
	var __SYS_consoleClear  = true;												// Enables the console clearing when loading new pages
	var __SYS_redirect400   = false;											// Enables the redirect on 400's family errors
	var __SYS_showBreaks    = false;											// Show the label of the current Bootstrap viewport size
	var __SYS_checksChanges = true;												// Abilita il controllo dello stato "hasChanged"

	var __SYS_status = {														// Set degli status dell'intera applicazione
			hasChanged: false,
		}

	// ** Declare main paths **
	var _sysRoot      = '/System/';												// System folder root
	var _sys3rdParts  = _sysRoot + '3rd-parties/';								// Path: libraries/frameworks of 3rd parties
	var _sysFrameWork = _sysRoot + 'framboJSe.fw/';								// Path: our framework
	var _sysWrappers  = _sysRoot + 'wrappers/';									// Path: wrappers (drivers for 3rd parties libraries)
	var _sysTemplates = _sysRoot + 'templates/';								// System templates path

	var _loginRoot    = '/public/modules/login/';								// Login management folder root


	// ** Builds system data configuration **
	__SYS_config = {
		
		baseURL: "/",
		defaultExtensions: 'js',
		map: {

			// ** 3rd-parties **
			bootstrap         : _sys3rdParts + 'bootstrap/js/bootstrap.budle.min.js',
			colorBox          : _sys3rdParts + 'colorbox/jquery.colorbox-min.js',
			fontawesome       : _sys3rdParts + 'fontawesome/js/fontawesome-all.min.js',
			jCropMin          : _sys3rdParts + 'jcrop/js/jquery.Jcrop.min.js',
			jquery            : _sys3rdParts + 'jquery/jquery.min.js',
			jquery_ui         : _sys3rdParts + 'jquery-ui/jquery-ui.min.js',
			jsCookie          : _sys3rdParts + 'jscookie/js.cookie.js',
			md5               : _sys3rdParts + 'md5/md5.js',
			tSorterMin        : _sys3rdParts + 'tablesorter/jquery.tablesorter.min.js',
			tSorterWidgets    : _sys3rdParts + 'tablesorter/jquery.tablesorter.widgets.min.js',
			bs_datepicker     : _sys3rdParts + 'datepicker/bootstrap-datepicker.min.js',
			bs_datepicker_it  : _sys3rdParts + 'datepicker/bootstrap-datepicker.it.min.js',
				
			// ** Framework **
			// Base:
			base_controller   : _sysFrameWork + 'controller/base.controller.js' + __SYS_version,
            base_model        : _sysFrameWork + 'model/base.model.js'           + __SYS_version,
            base_constants    : _sysFrameWork + 'model/constants.model.js'      + __SYS_version,
			base_presenter    : _sysFrameWork + 'presenter/base.presenter.js'   + __SYS_version,
			// Libs:
			mainJs            : _sysFrameWork + 'libs/js/main.sys.js' + __SYS_version,
			// Modals:
			modals            : _sysFrameWork + 'presenter/modals.presenter.js' + __SYS_version,
			// Router:
			router            : _sysFrameWork + 'controller/router.controller.js' + __SYS_version,
			// Sitemap:
			sitemap           : _sysFrameWork + 'presenter/sitemap.presenter.js'   + __SYS_version,
			sitemap_ctrl      : _sysFrameWork + 'controller/sitemap.controller.js' + __SYS_version,
			// Snippets:
			snippets          : _sysFrameWork + 'presenter/snippetsHandler.presenter.js' + __SYS_version,
            dd_base           : _sysFrameWork + 'presenter/snippets/dd_base.js'          + __SYS_version,
            input_kernel      : _sysFrameWork + 'presenter/snippets/input_kernel.js'     + __SYS_version,
            input_text        : _sysFrameWork + 'presenter/snippets/input_text.js'       + __SYS_version,
            input_hidden      : _sysFrameWork + 'presenter/snippets/input_hidden.js'     + __SYS_version,
			snippetsList_sys  : _sysFrameWork + 'presenter/snippets/snippetsList.sys.js' + __SYS_version,
			widgetsList_sys   : _sysFrameWork + 'presenter/widgets/widgetsList.sys.js'   + __SYS_version,
			// default (empty file):
			default			  : _sysFrameWork + '/presenter/default.presenter.js' + __SYS_version,
			// Templates:
			templatesHandler  : _sysFrameWork + 'presenter/templatesHandler.presenter.js' + __SYS_version,
			templatesList_sys : _sysTemplates + 'templatesList.sys.js'                    + __SYS_version,


			// ** Wrappers **
			tableSorter       : _sysWrappers + 'wrapper.tablesorter.js' + __SYS_version,
			jCrop             : _sysWrappers + 'wrapper.jcrop.js'       + __SYS_version,
			googleMaps        : _sysWrappers + 'wrapper.google_maps.js' + __SYS_version,
			datepicker        : _sysWrappers + 'wrapper.datepicker.js'  + __SYS_version,


			// ** Login management **
			loginController   : _loginRoot + 'controller/login.controller.js' + __SYS_version,
			loginModel        : _loginRoot + 'model/login.model.js'           + __SYS_version,
			loginPresenter    : _loginRoot + 'presenter/login.presenter.js'   + __SYS_version,


			// ** Page management **
			currentController : '',
			currentModel      : '',
			currentPresenter  : '',
			currentDashboard  : '',
		}
	}

	// ** Merge System & Application configurations **
	if ( __PUB_config != undefined && __PUB_config != '' ) {
		$.extend(__SYS_config.map, __PUB_config.map);
	}
	if (__PageScope == 'private') {
		if ( __PVT_config != undefined && __PVT_config != '' ) {
			$.extend(__SYS_config.map, __PVT_config.map);
		}
	}

	// ** Initialize Configuration and resets the global var **
	SystemJS.config(__SYS_config);
	__SYS_config = {
		current: {
			module: '',
			page  : '',
			code  : ''
		}
	}


	if (__SYS_consoleLog) {
		if (__SYS_consoleClear) {console.clear()}
		console.log('%cFramboJSe.fw initialized...', 'background: #e0e0e0; color: #c00; font-weight: bold; padding: 3px 10px; display: block;');
	}
