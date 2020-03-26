//----------------------------------------------------------------------------------------
// File: home.controller.js
//
// Desc: Controller for homepage
// Path: /Private/modules/home/controller
//----------------------------------------------------------------------------------------

define([
    'base_controller',
    'base_presenter',
    'currentModel',
    'currentPresenter'
], function (cBase, pBase, model, presenter) {

	var _onInit     = true;														// Monitoring first time executing code...
	var _pageID     = '';														// Page ID (for presenter)
	var _templateID = '';														// ID of the page template
	var _checkYeap	= '';														// Flag per identificare se arrivo da Yeap o da navigazione interna
	var _initPars   = '';														// Set dei parametri iniziali della Setup (usati per il re-setup dopo il save)

	return {
		init: function(initPars) {

			var re = new RegExp('\\+', 'g');

			_initPars = initPars;

			if (checkForYeapAccess()) {											// Verifica modalità di ingresso
				model.SaveSettings({											// Invia richiesta a SAAS
                    token    : __WACookie.Token,
                    tc       : 0,
                    nYears   : 0,
					initYear : 0,
					Nome     : (__WACookie.Title == null)? '' : __WACookie.Title.replace(re, ' '),
					Logo     : (__WACookie.Logo  == null)? '' : encodeURIComponent(__WACookie.Logo),
					onFailure: pBase.OnGenericFailure,
					onSuccess:  function(params) {
						setup(initPars);										// Chiama la setup dopo il salvataggio dayi
					}
				});
			} else {
				setup(initPars);												// Chiama direttamente la setup
			}

		}
	}


	// FUNCTION: checkForYeapAccess
	//  Verifica se l'accesso alla pagina ariva da Yeap o internamente
	// PARAMS:
	//  params.pageID : page ID
	// RETURN:
	//  none
	function checkForYeapAccess(params) {
        var qs = Cookies.get('Redirect_cookie');                                 //va a leggere la querystring dal cookies 
        //if (location.search != '')
        if (qs != null) {

			//var qs = decodeURIComponent(location.search.substr(1));	    	// Decodifica ed elimina il "?" iniziale

            //qs = Cookies.get('Redirect_cookie');


			// 1: Prepara l'oggetto dei parametri
			// ** NOTA:
			//	I parametri come 
			var qsPars = {														// Oggetto JSON dei parametri
				showErr: true,
			};
			$.each(qs.split('&'), function(e, par) {							// Scansione delle coppie chiave/valore
				var v = par.split('=');											// Separazione chiave/valore del parametro
				qsPars[v[0].toString()] = v[1].toString();						// Aggiunge l'hash all'oggetto Parametri
			});

			// 2: Creazione dei cookies per la gestione interna
			qsPars.BPName   = (qsPars.BPName == null)? '' : qsPars.BPName;
			qsPars.Logo     = (qsPars.Logo   == null)? '' : qsPars.Logo;
			qsPars.prodNr   = qsPars.Token.substring(1, 9),						// Estrae il numero prodotto dal Token
			qsPars.userCode = qsPars.Token.substring(10, 16),					// Estrae il codice utente dal Token

			//qsPars.isODC    = true;

            Cookies.set('YeapWAPars', JSON.stringify(qsPars), { expires: 1 });;
			__WACookie = qsPars;												// Aggiorna il cookie globale di sistema
			_checkYeap = true;

		} else {

			_checkYeap = false;

		}

		return _checkYeap;
	}


	// FUNCTION: setup
	//  Init function for controller. Setup UI and default values.
	// PARAMS:
	//  params.pageID : page ID
	// RETURN:
	//  none
	function setup(params) {

		_pageID     = (params == undefined) ? _pageID : params.pageID;
		_templateID = (params == undefined) ? _templateID : params.templateID;

		// Step 1: Inizializzazione della UI (setup)
		presenter.Init({
			pageID    : _pageID,
			templateID: _templateID
		});

		// Step 2: Interrogazione SAAS per il recupero dati
		return model.GetSettings({

			token    : __WACookie.Token,
			onFailure: pBase.OnGenericFailure,
            onSuccess: function (params) {
				presenter.RenderPage({ 
					RawData: params.RawData,
					OnSave : saveData,
				});
			},
		});
	
	}


	// FUNCTION: saveElement
	//  Saves elements (calling Saas and handle response)
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function saveData() {

		var rawdata = presenter.GetData4Saving();

		return model.UpdateSettings({											// Builds XML data and sends them to the Saas...
			data     : rawdata,
			token    : __WACookie.Token,
			onSuccess: onSaveElement,
			onFailure: onSaveElement
		});
	}

	// FUNCTION: onSaveElement
	//  Handles server data and send them to the UI (body part)
	// PARAMS:
	//  result.ResponseCode    : Response code from Saas
	//  result.ResponseMessage : Response message from Saas
	// RETURN:
	//  none
	function onSaveElement(result) {

		if (result.ResponseCode == 0) {
			presenter.Show_ok_modal();
			setup(_initPars);													// Chiama nuovamente la setup
		} else {
			presenter.Show_ko_modal(result.ResponseCode, result.ResponseMessage);
		}
	}

});
