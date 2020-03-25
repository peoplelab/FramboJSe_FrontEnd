//----------------------------------------------------------------------------------------
// File: config.pub.js
//
// Desc: Configuration file for SystemJS module - Public settings
// Path: /public/
//----------------------------------------------------------------------------------------

    // ** Loads cookie and converts data in JSON format **
    cookieRaw = Cookies.get('myCookiePub');
    var cookiePub = (cookieRaw == undefined || cookieRaw == '')? '' : $.parseJSON(cookieRaw);

    // ** Declare main paths **
    var _pubRoot  = '/public/';
	var _pubPaths = {
        framework: _pubRoot + 'framboJSe.ext/',
        modules  : _pubRoot + 'modules/',
        resources: _pubRoot + 'resources/',
        templates: _pubRoot + 'templates/',
        xml      : _pubRoot + 'xml/',
    }

	// ** Declare application paths **
    var _sample_module = {
        modules  : _pubPaths.modules   + 'myModule/mySection/',
        templates: _pubPaths.templates + 'myModule/mySection/'
    }

    // ** Builds system data configuration **
    __PUB_config = {
	    map: {
        
			// ** Framework extensions **
            // Snippets:
            snippetsList_pub  : _pubPaths.framework + 'snippets/snippetsList.pub.js',
            widgetsList_pub   : _pubPaths.framework + 'widgets/widgetsList.pub.js',
            // Templates:
            templatesList_pub : _pubPaths.templates + 'templates/templatesList.pub.js'
			// Sitemap:
			// ...
			
			// ** "Public" settings **
			// ...

        }
    };
