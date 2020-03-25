//----------------------------------------------------------------------------------------
// File: widgetsList.sys.js
//
// Desc: List of system widgets (default) - System
// Path: /system/framboJSe.fw/presenter/widgets
//----------------------------------------------------------------------------------------

define (function () {

    return {

        List: buildList
    }

    // FUNCTION: buildList
    //  Builds the list of defined widgets
    // PARAMS: 
    //  none
    // RETURN:
    //  widgetsList : list of widgets  
    function buildList() {

        var widgetsList = [  

            'switcher',										// Gestione checkbox come switcher "on/off"
            'timePicker',									// Introduzione ore/minuti giornaliere (range: 00:00 - 23:59)
            'setsHours',									// Introduzione di ore/minuti senza limite sul nr. di ore
            'setsNumber',									// Introduzione di un numero diviso in int/dec
            'datePicker',									// Introduzione data (gg/mm/aa) con datePicker
            'slider',										// Costruzione slider di jQuery-ui
    
            ''												// Dummy (last element)
        ];

        return widgetsList;
    }
});


