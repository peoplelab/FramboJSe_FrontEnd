//----------------------------------------------------------------------------------------
// File: templatesList.pvt.js
//
// Desc: List of PRIVATE templates
// Path: /Private/templates
//----------------------------------------------------------------------------------------

define (function () {

	return {

		List: buildList
	}


	// FUNCTION: buildList
	//  Builds the list of defined templates' path
	// PARAMS: 
	//  none
	// RETURN:
	//  templatesList : list of templates
	function buildList() {

		var templatesPath = _pvtPaths.templates;                                // Main path of the templates is defined in "config.pvt"
		var templatesList = {  


			// Section "Home page" (group id: 500)
			501: __homepage.templates + 'home.html',
			502: __menu.templates + 'menu.html',
		//	502: __menu.templates + 'newMenu.html',
			503: __homepage.templates + 'welcome.html',
			504: __settings.templates + 'settings.html',


			// Section "Qualitativa" (group id: 600)
			601: __qualitativa.templates + 'moduloDati.html',
			602: __qualitativa.templates + 'moduloDati.html',


			// Section "Economics" (group id: 700)
			705: __economics.templates + 'calc/contoEconomico.html',
			706: __economics.templates + 'calc/rendicontoFinanziario.html',
			707: __economics.templates + 'calc/statoPatrimoniale.html',
			708: __economics.templates + 'calc/fontiFinanziarie.html',
			709: __economics.templates + 'calc/workingCapital.html',

			751: __economics.templates + 'impostazioni.html',
			752: __economics.templates + 'input/ricavi.html',
			753: __economics.templates + 'input/costiEsterni.html',
			754: __economics.templates + 'input/costiVariabil.html',
			755: __economics.templates + 'input/costiInterni.html',
			756: __economics.templates + 'input/risorseUmane.html',
			757: __economics.templates + 'input/fonti.html',
			759: __economics.templates + 'input/finanziamenti.html',
			760: __economics.templates + 'input/altro.html',
			761: __economics.templates + 'input/iva.html',

			762: __economics.templates + 'input/materiali.html',	
			763: __economics.templates + 'input/immateriali.html',	
			764: __economics.templates + 'input/finanziarie.html',	
            765: __economics.templates + 'input/gestioneStraordinaria.html',
            766: __economics.templates + 'input/annoPrecInsert.html',
            767: __economics.templates + 'input/annoPrecProspetto.html',
            768: __economics.templates + 'input/annoPrecConferma.html',

			780: __economics.templates + 'messaggi.html',
            781: __economics.templates + 'analisiLeanus.html',
            782: __economics.templates + 'reportWord.html',


			// Sezione "Controllo di gestione" (group id: 800):
			801: __controllo.templates + 'crea.html',
			802: __controllo.templates + 'distribuzione.html',
			803: __controllo.templates + 'importa.html',
			804: __controllo.templates + 'analisi.html',
			805: __controllo.templates + 'scostamenti.html',
			806: __controllo.templates + 'forecast.html',


			// Sezione "Dati testuali" (group id: 900):
			901: __testuali.templates + 'descrizioneAzienda.html',
			902: __testuali.templates + 'prodottoProcesso.html',
			903: __testuali.templates + 'analisiMercato.html',
			904: __testuali.templates + 'posizioneCompetitiva.html',
			905: __testuali.templates + 'management.html',
			906: __testuali.templates + 'executiveSummary.html',



			// Sezione "Dashboards" (group id: 1500):
			1510: __dashboard.templates + 'configuration.dboard.html',
			1521: __dashboard.templates + 'hr_elenchi.dboard.html',
			

			// Sezione "Navbar" (group id: 1600):
			1601: __common.templates + 'navbar/navbarMaster.html',
			1602: __common.templates + 'navbar/navbarPoweruser.html',
			1603: __common.templates + 'navbar/navbarStandard.html',

			// Section: Extra (group id: 2000):
			2001: '/private/xml/sitemap.pvt.xml',

			// Servizi REST:
			3001: '/api/public/ws/resources.ashx/xml-general',
			3002: '/api/public/ws/resources.ashx/xml-qa',


		};

		return templatesList;
	}

});