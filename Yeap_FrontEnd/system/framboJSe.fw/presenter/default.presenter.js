//----------------------------------------------------------------------------------------
// File: default.presenter.js
//
// Desc: default empty presenter 
// Path: /Private/modules/dashboards/presenter
//----------------------------------------------------------------------------------------
define([], function(){
	
	return {

		Init  : emptyFunction,													// Empty Init
		Render: emptyFunction,													// Empty Render
		
		//<Method>: emptyFunction,												// Add any other method name you needs..
	}

	// FUNCTION: emptyFunction
	//	Common empty function
	// PARAMS:
	// 	None
	// RETURN:
	// 	None
	function emptyFunction(){
		
		return false;
		
	}
});