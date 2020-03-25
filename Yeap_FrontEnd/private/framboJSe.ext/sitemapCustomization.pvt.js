//----------------------------------------------------------------------------------------
// File: sitemapCustomization.pvt.js
//
// Desc: Custom settings for the sitemap - Private area
// Path: /private/framboJSe.ext
//----------------------------------------------------------------------------------------

define (function(){

	var _routeList = [];														// Routes list

	return {
		Customize: customize
	}


	// FUNCTION: customize
	//  Applies the required custom settings
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function customize(params) {

		var homeURL = '';

		switch (__PMCookie.NomeProfilo) {										// Sets the homepage URL
			case 'MASTER':
				homeURL = '/home/master';
				break;

			case 'POWERUSER':
				homeURL = '/home/puser';
				break;

			case 'STANDARD':
			default:
				homeURL = '/home/user';
				$('#ts_elenco_soggetti').parent().remove();						// Remove unauthorized page from breadcrumbs
				break;
		}

		$('#home').attr('href', homeURL);
	}

});