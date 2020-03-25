// dd_calendar_months.js -> snippet "calendar months drop down"
// target:  <snp_dd_calendar_months />
// output:  drop down
define(["./dd_base.js"], function (base) {

    var _ITEMNAME = 'dd_calendar_months';
    var _ITEMTAG = 'snp_';

    return {
        itemName: _ITEMNAME,      // Item's name
        itemTag: _ITEMTAG,        // Item's tag prefix
        BuildHtml: buildHtml      // Item's HTML
    }


    // FUNCTION: buildHtml
    //  builds the snippet's HTML code 
    // PARAMS:
    //  tagPars : tag's custom parameters (in JSON format)
    //  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
    //              pbAttrs[0] : extension of "class" attribute,
    //              pbAttrs[1] : all others attributes 
    // RETURN:
    //  htmlRes : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
    function buildHtml(tagPars, pbAttrs) {

        tagPars.itemName = _ITEMNAME;

        var htmlRes = base.RenderJson(fillContent_Months(), tagPars, pbAttrs);

        return new Promise((resolve, reject) => { resolve(htmlRes) });
    }


    // function: fillContent_Days -> get the elements for the dropdown.
    // param: none
    // return value -> a json data containing elements for dropdown.
    function fillContent_Months() {
        var data = { items: [] };
        var months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio",
            "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

        for (var i = 0; i < 12; i++) {
            data.items.push({ Value: i+1, Text: months[i] });
        }

        return data;
    }
        
});
