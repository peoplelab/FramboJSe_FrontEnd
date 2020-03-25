//----------------------------------------------------------------------------------------
// File: login.controller.js
//
// Desc: Controller for the login page
// Path: /public/modules/login/controller
//----------------------------------------------------------------------------------------

define([
	'loginModel',
	'loginPresenter',
	'base_controller'
], function (model, presenter, cBase) {


	return {
		init: setup																// Init/setup function for controller...
	}


	// FUNCTION: setup
	//  Init function for controller. Setup UI and default values.
	// PARAMS:
	//  page_id : identifier for login page
	// RETURN:
	//  none
	function setup(parameters) {

		var page_id = parameters.page_id;   // unused beacuse there is no template for login page...

		presenter.Render({
			onLogon: logon														// Callback for login
		});

	}


	// FUNCTION: logon
	//  Calls "model" method to do login...
	// PARAMS:
	// none
	// RETURN:
	//  none
	function logon() {

		var params = presenter.GetData();

		return model.Login({													// Builds the request to the SAAS
			username : params.username,
			password : params.password,
			remember : params.remember,
			onSuccess: onLoginOK,
			onFailure: onLoginKO
		});
	}


    // FUNCTIONS: onLoginOK, onLoginKO
	//  Handles the login service response
    // PARAMS:
    //  params.ResponseCode    : response code from Saas
    //  params.ResponseMessage : response message from Saas
    // RETURN:
	//  None
	function onLoginOK(params) {

		if (params.ResponseCode == 0) {
			presenter.Login_OK( {rawData: params.RawData} );
		} else {
			presenter.Login_KO(params.ResponseCode, params.ResponseMessage);
		}
	}
	function onLoginKO(params) {
		cBase.OnGenericFailure(params);     
	}

});
