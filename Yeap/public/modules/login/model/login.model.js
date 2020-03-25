//----------------------------------------------------------------------------------------
// File: login.model.js
//
// Desc: Model for the login page
// Path: /public/modules/login/model
//----------------------------------------------------------------------------------------

// login.model.js -> model for login process.

define([
	'base_model'
], function (base_model) {
	var _Pattern='/api/public/ws/';

	var _ep_login  = _Pattern + "login.asmx/LoginPM";							// Login service path
	var _ep_logout = _Pattern + "login.asmx/LogoutPM";							// Logout service path

	// Public definitions
	return {

		Login : login,															// Login
		Logout: logout															// logout
	}


	// function: login -> calling Web service and firing response events.
	// param: endpoint -> webservice endpoint
	// param: body -> webservice body request
	// param: onSuccess -> callback function on success
	// param: onFailure -> callback function on failure
	// return value -> ajax remote call pointer.
	function login(parameters) {
		parameters.endpoint = _ep_login;
		parameters.body = getLogin_RequestBody(parameters);

		return base_model.ExecuteRequest(parameters);
	}


	// FUNCTION: getLogin_RequestBody
	//	Builds the request body for the login service.
	// PARAMS:
	//	username : user's name
	//	password : user password
	//	remember : flag to remember user's credentials (not used)
	// RETURN:
	//	XML string containing the request body
	function getLogin_RequestBody(options) {

		var usr = (options.username != undefined) ? encodeURIComponent(options.username) : '';
		var pwd = (options.password != undefined) ? encodeURIComponent(options.password) : '';
		var rem = (options.remember != undefined) ? options.remember : '';

		var result = "<?xml version='1.0' encoding='utf-8' ?>" +
			"<request ID='" + base_model.RequestID() + "'>" +
			"<general>" +
			"<username>" + usr + "</username>" +
			"<password>" + pwd + "</password>" +
			"<remember>" + rem + "</remember>" +
			"</general>" +
			"</request>";
		return result;

	}


	// function: logout -> calling Web service and firing response events.
	// param: endpoint -> webservice endpoint
	// param: body -> webservice body request
	// param: onSuccess -> callback function on success
	// param: onFailure -> callback function on failure
	// return value -> ajax remote call pointer.
	function logout(parameters) {

		parameters.endpoint = _ep_logout;
		parameters.body = getLogin_RequestBody(parameters);

		return base_model.ExecuteRequest(parameters);

	}
});
