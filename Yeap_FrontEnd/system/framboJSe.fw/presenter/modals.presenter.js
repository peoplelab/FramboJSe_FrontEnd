//
// ** modal.js -> Popoup windows handler **
//

define([
    'templatesHandler',
    'md5'
], function (tc, md5) {

	var _target;																// ID del container delle finestre modali
	var _gotoURL;																// URL di destinazione in uscita
	var _errCode;																// Codice dell'errore
	var _message;																// Testo del messaggio di errore
	var _choises;																// Array delle opzioni per "choose"


	return {
		ShowOK    : showOK,														// Mostra la finestra di conferma esecuzione
		ShowErr   : showErr,													// Mostra la finestra di errore esecuzione
		ShowConf  : showConf,													// Mostra la finestra di conferma
		ShowChoose: showChoose,													// Mostra la finestra di scelta opzioni
		ShowInfo  : showInfo,													// Mostra la finestra di informazione generica

		Login_Show           : showModal_login,									// Show re-login modal
		Login_GetValues      : getLoginValues,									// Get values from (re)login modal
		Login_SetNextLocation: setNextLocation,									// Set "next location" from (re)login window (hide modal or redirect to login page)
		Login_Error          : setLoginError,									// Set login error message
		Login_Unauthorized   : setLoginUnauthorized,							// redirect to unauthorized page

		Hide: function(){														// Hides the opened modal window (if any)
			$('#modal').modal('hide');
		}
	}


	// FUNCTION: getParameterValues
	//	Aggiorna le variabili dei valori passati con "params". Ccomune a tutte le modali
	// PARAMS:
	//	params : tutti i parametri
	// RETURN:
	//	none
	function getParameterValues(params) {

		_target  = params.target;
		_gotoURL = params.URL;
		_errCode = (params.errCode != '')? params.errCode : '(n.d.)';
		_message = formatsErrMsg(params);
		_choises = params.choose;

	}

	// FUNCTION: formatsErrMsg
	//  Esegue una formattazione del messaggio d'errore (sost. pseudo tags)
	// PARAMS:
	//  errMsg  : testo "raw" come codificato in "App_data\errormessages.xml"
	// RETURN:
	//  msgHtml : Messaggio formattato
	function formatsErrMsg(params) {

		var msgHtml = (params.errMsg != null)? params.errMsg : '';

		var tagsList = [
			// Tag "semplici"
			['\\[br\\]', '<br>'],
			['\\[b\\]', '<b>'], ['\\[/b\\]', '</b>'],
			['\\[a\\]', '<a>'], ['\\[/a\\]', '</a>'],
			['\\[p\\]', '<p>'], ['\\[/p\\]', '</p>'],
			['\\[i\\]', '<i>'], ['\\[/i\\]', '</i>'],
			['\\[span\\]', '<span>'], ['\\[/span\\]', '</span>'],
			// Tag con attributi (aperture)
			['\\[b ', '<b '], 
			['\\[a ', '<a '], 
			['\\[p ', '<p '], 
			['\\[i ', '<i '], 
			['\\[span ', '<span >'],
			// Tag con attributi (chiusura)
			['\\*\\]', '>'],
		];

		// Ciclo di elaborazione
		for (var i = 0; i < tagsList.length; i++) {
		
			var tag = tagsList[i];
			var reg = new RegExp(tag[0], 'g');									// RegExp da cercare
			msgHtml = msgHtml.replace(reg, tag[1]);								// Sostituzione con tag HTML
		
		}

		return msgHtml;
	}

	// FUNCTION: showOk
	//  Mostra la finestra modale di esito positivo
	// PARAMS:
	//  _target : ID del contenitore delle modali
	//  _gotoURL : URL della pagina di destinazione
	// RETURN:
	//  Redirects to the target page (if specified)
	function showOK(params) {

		getParameterValues(params);												// Legge i valori passati nei parametri

		tc.Render({
			code: 1001,
			onSuccess: function (result) {

				$(_target).html(result);										// Sostituisce il codice HTML nel contenitore delle modali

				$('.modal-backdrop').hide();									// Nasconde l'eventuale layer di sfondo aperto in precedenza
				$('#modal').modal('show');										// Visualizza la finestra

				$('#modal .closeBox').click(function () {
					if (_gotoURL != null && _gotoURL != '') {
						location.href = _gotoURL;								// Reindirizza alla nuova pagina
					}
				});
			}
		});

	}


	// FUNCTION: showErr
	//  Mostra la finestra modale di esito negativo (errore) 
	// PARAMS:
	//  _target : ID del contenitore delle modali
	//  _gotoURL : URL della pagina di destinazione
	//  _errCode : codice dell'errore
	//  _message : messaggio dell'errore
	// RETURN:
	//  none
	function showErr(params) {

		getParameterValues(params);												// Legge i valori passati nei parametri

		tc.Render({
			code: 1002,
			onSuccess: function (result) {

				$(_target).html(result);										// Sostituisce il codice HTML nel contenitore delle modali
				$('#message').html(_message);								// Sostituisce il placeholder del messaggio di errore
				$('#error_code').html(_errCode);								// Sostituisce il placeholder del numero di errore

				$('.modal-backdrop').hide();									// Nasconde l'eventuale layer di sfondo aperto in precedenza
				$('#modal').modal('show');										// Visualizza la finestra
			}
		});

	}


	// FUNCTION: showChoose
	//  Mostra la finestra di selezione tra scelte multiple
	// PARAMS:
	//  _target : ID del contenitore delle modali
	//  _choises : hasmap di configurazione dei pulsanti d'opzione: "label" = testo, "exec" = callback associata
	// RETURN:
	//  none
	function showChoose(params) {

		getParameterValues(params);												// Legge i valori passati nei parametri

		tc.Render({
			code: 1005,
			onSuccess: function (result) {

				$(_target).html(result);										// Sostituisce il codice HTML nel contenitore delle modali
				$('#message').html(_message);								// Sostituisce il placeholder del messaggio di errore
				// Costruisce i pulsanti delle opzioni
				var myHtml = '';
				for (var i = 0; i < _choises.length; i++) {
					myHtml += '<button class="btn btn-warning option" ref="' + i + '"';
					myHtml += ' data-dismiss="modal">';
					myHtml += _choises[i].label;								// Testo del pulsante
					myHtml += '</button>';
				}
				$('#optionBtns').html(myHtml);

				$('.modal-backdrop').hide();									// Nasconde l'eventuale layer di sfondo aperto in precedenza
				$('#modal').modal('show');										// Visualizza la finestra

				$('#optionBtns .option').click(function(e) {
					var fn = _choises[$(this).attr('ref')].exec;				// Ricava la funzione associata
					if (fn != null && fn != '') {								// Verifica eseguibilità
						fn();													// Esegue la funzione associata
					}
				});

			}
		});

	}


	// FUNCTION: showConf
	//  Mostra la finestra modale di richiesta conferma
	// PARAMS:
	//  _target : ID del contenitore delle modali
	//  _choises : hasmap di configurazione dei pulsanti d'opzione: "label" = testo, "exec" = callback associata
	// RETURN:
	//  none
	function showConf(params) {

		getParameterValues(params);												// Legge i valori passati nei parametri

		tc.Render({
			code: 1003,
			onSuccess: function (result) {

				$(_target).html(result);										// Sostituisce il codice HTML nel contenitore delle modali
				$('#message').html(_message);								// Sostituisce il placeholder del messaggio di errore
				// Costruisce i pulsanti delle opzioni
				var myHtml = '';
				for (var i = 0; i < _choises.length; i++) {
					myHtml += '<button class="btn btn-warning option" ref="' + i + '"';
					myHtml += ' data-dismiss="modal">';
					myHtml += _choises[i].label;								// Testo del pulsante
					myHtml += '</button>';
				}
				$('.modal-footer').html(myHtml);
				
				$('.modal-backdrop').hide();									// Nasconde l'eventuale layer di sfondo aperto in precedenza
				$('#modal').modal('show');										// Visualizza la finestra

				$('.modal-footer .option').click(function(e) {
					var fn = _choises[$(this).attr('ref')].exec;				// Ricava la funzione associata
					if (fn != null && fn != '') {								// Verifica eseguibilità
						fn();													// Esegue la funzione associata
					}
				});

			}
		});

	}


	// FUNCTION: showInfo
	//  Mostra la finestra modale di informazione generica
	// PARAMS:
	//  _target : ID del contenitore delle modali
	//  _message : messaggio da visualizzare
	// RETURN:
	//  none
	function showInfo(params) {

		getParameterValues(params);												// Legge i valori passati nei parametri

		tc.Render({
			code: 1006,
			onSuccess: function (result) {

				$(_target).html(result);										// Sostituisce il codice HTML nel contenitore delle modali
				$('#message').html(_message);								// Sostituisce il placeholder del messaggio di errore

				$('.modal-backdrop').hide();									// Nasconde l'eventuale layer di sfondo aperto in precedenza
				$('#modal').modal('show');										// Visualizza la finestra

			}
		});

	}


	



	//---------------------------------------------------------------------------------------------

	// ** LOGIN MODAL SECTION  **


	// FUNCTION: showModal_login
	//  Show the (re)login popup window.
	// PARAMS:
	//  divModals    : modals windows container's ID 
	//  params.onLoginButtonClick : callback function on "login" button click
	// RETURN:
	//  show "Login" modal page
	function showModal_login(divModals, params) {

		var loginpage = "/client/aspxPages/home.aspx";

		tc.Render({
			code: 1004,
			onSuccess: function (result) {

				$(divModals).html(result);                  // Replaces the code into the modals windows container
                $('.modal-backdrop').hide();
                try {
                    $('#modal').modal('show');                  // Show the modal window
                } catch (err) {
                    console.log("-> ERROR modal_login.show()");
                    $('#modal').css('opacity', '1');
                    $('#modal').css('display', 'block');
                }

				// on Close (X) button we redirect to login page...
				$('#loginWindowCloseButton').click(function () {
					window.location.href = loginpage;
				});

				// on Confirm button we attach click event handler
				$('#confirmLoginButton').click(params.onLoginButtonClick)

			}
		});

	}
	// FUNCTION: getLoginValues
	//  Get values from (re)login modal window.
	// PARAMS:
	//  none   
	// RETURN:
	//  login data values in json format
	function getLoginValues() {
		var username = ($('#txtUsername').val() == null) ? '' : $('#txtUsername').val();
		var password = ($('#txtPassword').val() == null) ? '' : $('#txtPassword').val();
		var remember = 0; //($('#chkRemember').prop('checked') == '1') ? 1 : 0;

		// password must be crypted...
		//require([$set.jsPath + $set.archive[ndx] + ".js"], function (mySnippet) { });
		//password = md5.md5(password);

		return {
			Username: username,
			Password: password,
			Remember: remember
		}
	}
	// FUNCTION: setNextLocation
	//  Set "next location" from (re)login modal window (hide modal or redirect to login page)
	// PARAMS:
	//  window    : global window var 
	// RETURN:
	//  none, but an action will be taken
	function setNextLocation(window) {

		$('#loginErrorLabel').text('');

		var loginPageEndPoint = "login.html";
		if (window.location.href.indexOf(loginPageEndPoint) > -1) {
			window.location.replace('/client/aspxPages/home.aspx');
        } else {
            try {
                $('#modal').modal('hide');
            } catch (err) {
                console.log("-> ERROR modal_login.hide()");
                $('#modal').hide();
            }
			
		}
	}
	// FUNCTION: setLoginError
	//  Show error message in (re)login modal window.
	// PARAMS:
	//  none   
	// RETURN:
	//  none
	function setLoginError() {
		$('#loginErrorLabel').text('Username/Password errati.');
	}
	// FUNCTION: setLoginUnauthorized
	//  redirect to unauthorized page.
	// PARAMS:
	//  none   
	// RETURN:
	//  none
	function setLoginUnauthorized(canRedirect) {
		if (canRedirect == 1) {
			window.location.replace("/client/errors/unauthorized.aspx");
		}
	}

});

