// base.module.js : base module for the ws client comunicating with the Saas

define(['modals'], function (modals) {

	var _savedAjaxOptions;														// ajax call parameters
	var _loginShown = 0;														// modal login counter (disabling multiple modal login shows)
	var _Pattern	= '/api/public/ws/';
	return {
		BuildsRequestBody  : buildsRequestBody,									//Costruzione dinamica della Request Body
		RequestID          : getRequestIDAttribute,								// get a request ID for a generic request
		Request_GeneralNode: getRequestGeneral,									// create a "general" node part of a generic body request
		ExecuteRequest     : executeRequest,									// calling a generic Web service and firing its response events
        ExecuteHttpRequest : executeHttpRequest,								// calling a generic Web service with http form method, and firing its response events
        ExecuteRestRequest : executeRestRequest
	};


  	// FUNCTION: buildsRequestBody
	//	Costruzione dinamica della Request Body
	// PARAMS:
	//	params.[nome] : valore del campo "nome"
	//	params.fields : array dei nomi dei campi 
	// RETURN:
	//	testo compilato della body request
	function buildsRequestBody(params) {

		var rb = "<?xml version='1.0' encoding='utf-8' ?>";
		rb += "<Request ID='" + getRequestIDAttribute() + "'>";					// Ottiene l'ID della richiesta
		rb += getRequestGeneral({												// Definizione intestazione comune
			token: params.token													// Token per la verifica validità richiesta
			});
		rb += "<Data>";

		for (var i = 0; i < params.fields.length; i++) {						// Accodamento campi

			rb += "<" + params.fields[i] + ">";									// Apertura tag XML
			switch (params.dataSource) {										// Riconoscimento della sorgente dati
				case 'data':													// Nodo: "data"
					rb += encodeURIComponent(params.data[params.fields[i]]);	// Accoda il valore
					break;
				case '':														// Nodo: nessuno /default
				default:
					rb += params[params.fields[i]];								// Accoda il valore
			}
			rb += "</" + params.fields[i] + ">";								// Chiusura tag XML
			
		}
		rb += "</Data>";
		rb += "</Request>";
		
		return rb;
	}



	// FUNCTION: getRequestIDAttribute -> get a request ID.
	// param: none
	// return value -> a string representing the request ID of a body request.
	function getRequestIDAttribute() {
		var today = new Date();
		var month = (today.getMonth() + 1).toString();
		if (month.length < 2)
			month = "0" + month;
		var day = today.getDate().toString();
		if (day.length < 2)
			day = "0" + day;
		var hour = today.getHours().toString();
		if (hour.length < 2)
			hour = "0" + hour;
		var minutes = today.getMinutes().toString();
		if (minutes.length < 2)
			minutes = "0" + minutes;
		var secs = today.getSeconds().toString();
		if (secs.length < 2)
			secs = "0" + secs;
		var millisecs = today.getMilliseconds().toString();

		return today.getFullYear().toString() + month + day + hour + minutes + secs + millisecs;
	}

	// FUNCTION: getRequestGeneral -> create a "general" node part of a generic body request.
	// param: none
	// return value -> a string representing the "general" node part of a body request.
	function getRequestGeneral(params) {	

		var txt = '';
		txt += "<General>";
		txt += "<Token>" + params.token + "</Token>";
		txt += "</General>";

		return txt;
	}

	// FUNCTION: executeRequest -> calling a generic Web service and firing its response events.
	// param: endpoint -> webservice endpoint
	// param: body -> webservice body request
	// param: onSuccess -> callback function on success
	// param: onFailure -> callback function on failure
	// return value -> ajax remote call pointer.
	function executeRequest(params) {

		if (__SYS_consoleLog) {
			console.log('%c-> Calling SaaS: ' + params.endpoint, 'font-weight: bold; color: #39c;');
		}

		$('#preloader').attr('style', 'display:block');						// Shows the "preloader" layer

		_savedAjaxOptions = {
			type: "POST",
			url: params.endpoint,
			data: '{data : "' + params.body + '"}',
			processData: params.processData,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				onAjaxSuccess(params, response);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				onAjaxFailure(params, jqXHR, textStatus, errorThrown);
			},
			canRedirect: 1,


			//---
	//		// Research (18/12/2019): provo a impostare gli headers e a leggere i response della chiamata:
	//		headers: {
	//			'Authorization': 'Token ' + btoa(__WACookie.Token),
	//			'From': 'executeRequest',
	//		},
	//		complete: function(resp) {
	//			console.log('url', params.endpoint, 'response', resp.getAllResponseHeaders());
	//			console.log('status', resp.getResponseHeader('status') );
	//		},
	//		//---



		};

		var request = $.ajax(_savedAjaxOptions);

		return request;
	}

	// FUNCTION: executeHttpRequest -> calling a generic Web service with http form method, and firing its response events.
	// param: endpoint -> webservice endpoint
	// param: formdata -> webservice (http) form data
	// param: onSuccess -> callback function on success
	// param: onFailure -> callback function on failure
	// return value -> ajax remote call pointer.
	function executeHttpRequest(params) {

		if (__SYS_consoleLog) {
			console.log('%c-> Calling SaaS (http): ' + params.endpoint, 'font-weight: bold; color: #69f;');
		}

		$('#preloader').attr('style', 'display:block');						// Shows the "preloader" layer

		_savedAjaxOptions = {
			type: "POST",
			url: params.endpoint,
			data: params.formdata,
			processData: false,
			contentType: false,
			dataType: "html",
			success: function (response) {									// html decode response and uniforme it as classical xml response...
				htmlDoc  = $.parseHTML(response, document, false);			// Parse della response (in quanto è dataType HTML)
				htmlTxt  = $(htmlDoc).text().trim();						// Selezione del contenuto (recupera il nodo XML originale wrappato dal formato HTML)
				response = { d: htmlTxt };									// Costruisce il JSON da passare come argomento alla funzione di gestione risposta
				onAjaxSuccess(params, response);
			},
			failure: function (response) {
				onAjaxFailure(params, response);
			},
			canRedirect: 1,

	//		//---
	//		// Research (18/12/2019): provo a impostare gli headers della chiamata:
	//		headers: {
	//			'Authorization': 'Token2 ' + __WACookie.Token,
	//			'From': 'executeHttpRequest'
	//		},
	//		//---


		};

		var request = $.ajax(_savedAjaxOptions);

		return request;
    }



    // FUNCTION: executeHttpRequest -> calling a generic Web service with http form method, and firing its response events.
    // param: endpoint -> webservice endpoint
    // param: formdata -> webservice (http) form data
    // param: onSuccess -> callback function on success
    // param: onFailure -> callback function on failure
    // return value -> ajax remote call pointer.
    function executeRestRequest(params) {

        if (__SYS_consoleLog) {
			console.log('%c-> Calling SaaS (Rest): ' + params.endpoint, 'font-weight: bold; color: #9cf;');
        }

        $('#preloader').attr('style', 'display:block');						// Shows the "preloader" layer

        _savedAjaxOptions = {
            type: "GET",
            url: params.endpoint,
            data: '',
            processData: false,
            contentType: false,
            dataType: "html",
            success: function (response) {									// html decode response and uniforme it as classical xml response...
                response = response.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                response = { d: response };
                onAjaxSuccess(params, response);
            },
            failure: function (response) {
                onAjaxFailure(params, response);
            },
            canRedirect: 1,


	//		//---
	//		// Research (18/12/2019): provo a impostare gli headers della chiamata:
	//		headers: {
	//			'Authorization': 'Token ' + __WACookie.Token,
	//			'From': 'executeRestRequest'
	//		},
	//		//---


        };

        var request = $.ajax(_savedAjaxOptions);

        return request;
    }


	// FUNCTION: onAjaxSuccess
	//	Executes when ajax call is succesful
	function onAjaxSuccess(params, response) {

		$('#preloader').attr('style', 'display:none');						// Hides the "preloader" layer
                        
		var xmlDoc = $.parseXML(response.d);
		var data = $(xmlDoc);
		var responseCode = parseInt($(data).find("Response>Result>Codice").text());
		var responseMessage = decodeURIComponent($(data).find("Response>Result>Descrizione").text());

		switch (responseCode) {

			case 1007:														// Error type: Session timeout
				if (__SYS_consoleLog) {
					console.log('-> User not logged or Login Session Timeout');
				}
				if (_loginShown == 0) {										// Shows modal login only if the first time show
					modals.Login_Show('#modalsContainer', { onLoginButtonClick: onClickConfirmLoginButton })
					_loginShown++;
				}                    
				break;

			case 1008:														// Error type: Unauthorized
				if (__SYS_consoleLog) {
					console.log('%c-> Unauthorized Access', 'background:#c00; color: #fff;');
				}
				alert('wsClientBase: unauthorized.aspx');
				break;

			default:        // ok
				return params.onSuccess({ 
						ResponseCode   : responseCode, 
						ResponseMessage: responseMessage, 
						RawData        : response.d 
					});
		}

		return 0;           
	}
	// FUNCTION: onAjaxFailure
	//	Executes when ajax call is unsuccesful
	function onAjaxFailure(params, jqXHR, textStatus, errorThrown) {

		$('#preloader').attr('style', 'display:none');						// Hides the "preloader" layer
		params.onFailure({ ResponseCode: -1, ResponseMessage: '', FailureCode: jqXHR.Status, RawData: jqXHR });
        
	}

      




	// ==========================
	// ** (re)login section **
	// ==========================
	function getLoginRequestParam() {

		var text = buildLoginRequest();

		return {
			type: "POST",
			url: _Pattern + "login.asmx/LoginPM",
			data: '{data : "' + text + '"}',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
		};
	}
	function buildLoginRequest() {

		var options = modals.Login_GetValues();
            
		var result = "<?xml version='1.0' encoding='utf-8' ?>" +
			"<request ID='" + getRequestIDAttribute() + "'>" +
				"<general>" +
					"<username>" + encodeURIComponent(options.Username) + "</username>" +
					"<password>" + encodeURIComponent(options.Password) + "</password>" +
					"<remember>" + options.Remember + "</remember>" +
				"</general>" +
			"</request>";

		return result;
	}
	function onClickConfirmLoginButton() {
		var loginRequest = getLoginRequestParam();
		// pass the retry operation as a callback triggered by the success (done) event
		$.extend(loginRequest, {
			success: function (response) {
				retryOperation(response);
			},
			failure: loginFailure
			});
		$.ajax(loginRequest);
	}
	function retryOperation(response) {
		//alert('retryOperation');
		var xmlDoc = $.parseXML(response.d);
		var data = $(xmlDoc);
		var responseCode = parseInt($(data).find("response>result>codice").text());
		var responseMessage = decodeURIComponent($(data).find("response>result>descrizione").text());           
            
		switch (responseCode) {

			case 0:
				// decrement modal login show counter
				if (_loginShown > 0)
					_loginShown--;
				modals.Login_SetNextLocation(window);
				//login ok, redo the call
				$.ajax(_savedAjaxOptions);
				break;

			case 1001: // unauthorized
				modals.Login_Error();                    
				break;
		}
	}
        
	function loginFailure() {

	}

});