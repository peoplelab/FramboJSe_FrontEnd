// base.controller.js : base for controller modules

define([
    'base_presenter'
],
    function (presenter) {


        return {

            OnGenericFailure: onGenericFailure          // handler for generic communication failure with Saas
        };



        function onGenericFailure(result) {
            var response_code = result.ResponseCode;            // response code -> -1 on failure
            var response_message = result.ResponseMessage;      // response message -> '' on failure
            var failure_code = result.FailureCode;              // failure code -> server status code
            var rawdata = result.RawData;                       // raw data -> jqXHR object

            presenter.OnGenericFailure(result);
        }

    });

