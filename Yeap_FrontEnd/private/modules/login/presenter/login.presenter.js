//----------------------------------------------------------------------------------------
// File: login.presenter.js
//
// Desc: Presenter for the login page
// Path: /public/modules/login/presenter
//----------------------------------------------------------------------------------------

define([
	'modals',
	'base_presenter'
], function (modals, base_presenter) {

    var _MSTCODE = 1;
    var _STDCODE = 2;
    var _POWCODE = 2;
    var _HPMST = '/home/master';
    var _HPSTD = '/home/user';
    var _HPPOW = '/home/puser';


	return {

		Render: render,															// renders objects in page
		GetData: function () {													// Gets input data for controller...
			return base_presenter.BuildsJson4Save()
		},
		Login_KO: login_KO,														// login error
		Login_OK: login_OK														// login ok        
	}


	// FUNCTION: render
	//  renders UI.
	// PARAMS:
	//  onLogon : handler for login method
	// RETURN:
	//  none
	function render(params) {

		$(":input").keypress(function (e) {
			if (e.keyCode == 13)
				params.onLogon();
		});

		$('#btnLoginPM').on("click",
			function () {														// "Login" callback
				params.onLogon();
			}
		);
	}


	// FUNCTION: login_KO
	//  login error handler
	// PARAMS:
	//  code : error code
	//  msg : error message
	// RETURN:
	//  none
	function login_KO(code, msg) {
		$('#lblError').text(msg + ' (Codice Errore ' + code + ')');
	}


	// FUNCTION: login_OK
	//  Handles successful login - Builds main Cookie
	// PARAMS:
	//  params.rawData : service response
	// RETURN:
	//  none
	function login_OK(params) {

		var _xml = $.parseXML(params.rawData);
		var _usr = $.parseXML(decodeURIComponent($(_xml).find('loggeduser')[0].innerHTML));

		var logPars = [
			['IDUtente', ''],
			['Username', ''],
			['CodiceCliente', ''],
			['NomeCliente', ''],
			['NomeAzienda', ''],
			['CodiceAzienda', ''],
			['IDSoggetto', ''],
			['Nome', ''],
			['IDProfilo', ''],
			['NomeProfilo', ''],
			['Sottoposti', ''],
			['IDResponsabile', '']
		]

		var _cookieValues = '{';
		var l = logPars.length;

		for (i = 0; i < l; i++) {
			logPars[i][1] = $(_usr).find(logPars[i][0]).text();
			_cookieValues += '"' + logPars[i][0] + '": "' + logPars[i][1] +'"'; 
			_cookieValues += ((i == (l - 1))? '': ', ');
		}
		_cookieValues += '}';

		// Creates cookie and redirects to the home page
		Cookies.set('PMCloud', _cookieValues, {expires: 1} );



        // 
        var jsnCookie = $.parseJSON(_cookieValues);
        var pCode = parseInt(jsnCookie.IDProfilo);
        var dest_url = _HPSTD;
        switch (pCode) {
            case _POWCODE:
                dest_url = _HPPOW;
                break;
            case _MSTCODE:
                dest_url = _HPMST;
                break;
            default:
                dest_url = _HPSTD;
                break;
        }

        window.location.replace(dest_url);

        return;

		// da rivedere....
		//$('#lblError').text('');
		//var loginPageEndPoint = "Login.aspx";
		//if (window.location.href.indexOf(loginPageEndPoint) > -1) {
		//	//window.location.replace('/default.aspx');
		//} else {
		//	$('#LoginModal').modal('hide');
		//}
	}
  
});
