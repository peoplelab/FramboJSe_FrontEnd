//----------------------------------------------------------------------------------------
// File: templatesList.sys.js
//
// Desc: List of SYSTEM templates
// it should contains only modals, errors, and all "system" templates.
// Path: /System/framboJSe.fw/presenter/templates
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

        var templatesPath = _sysTemplates;			// Main path of the templates is defined in "config.sys.js"
        var templatesList = {  
            
             // Sezione "Modal windows" (id group: 1000):
             1001: _sysTemplates + 'modal_ok.html',
             1002: _sysTemplates + 'modal_error.html',
             1003: _sysTemplates + 'modal_confirm.html',
             1004: _sysTemplates + 'modal_login.html',
             1005: _sysTemplates + 'modal_choose.html',
             1006: _sysTemplates + 'modal_info.html',

        };

        return templatesList;
    }

});