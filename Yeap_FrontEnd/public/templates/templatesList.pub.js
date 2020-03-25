//----------------------------------------------------------------------------------------
// File: templatesList.pub.js
//
// Desc: List of PUBLIC templates
// Path: /Public/templates
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

        var templatesPath = _pubTemplates;			// Main path of the templates is defined in "config.pub"
        var templatesList = {  

        };

        return templatesList;
    }

});