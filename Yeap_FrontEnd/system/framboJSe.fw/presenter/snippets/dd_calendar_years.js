// dd_calendar_years.js -> snippet "calendar years drop down"
// target:  <snp_dd_calendar_years />
// output:  drop down
define(["./dd_base.js"], function (base) {


    var _ITEMNAME = 'dd_calendar_years';
    var _ITEMTAG = 'snp_';


    return {
        itemName: _ITEMNAME,      // Item's name
        itemTag : _ITEMTAG,       // Item's tag prefix
        BuildHtml: buildHtml      // Item's HTML
    }


    // function: buildHtml -> main method for rendering object.
    // param: tagPars -> snippet params necessary for rendering
    //                  (value) selected value for drop down
    // param: pbAttrs -> additionaly paramaters for drop down (unused)
    // return value -> a string representing the html code for dropdown.
    function buildHtml(tagPars, pbAttrs) {

        tagPars.itemName = _ITEMNAME;

        var htmlRes = base.RenderJson(fillContent_Years(tagPars.year_before, tagPars.year_after), tagPars, pbAttrs);

        return new Promise((resolve, reject) => { resolve(htmlRes) });
    }


    // function: fillContent_Days -> get the elements for the dropdown.
    // param: year_before -> years in the past (must be negative!)
    // param: year_after -> years in the future
    // return value -> a json data containing elements for dropdown.
    function fillContent_Years(year_before, year_after) {
        var data = { items: [] };
        year_before = (year_before == null) ? 10 : parseInt(year_before);
        year_after = (year_after == null) ? 10 : parseInt(year_after);

        var date = new Date();
        var yearVal = date.getFullYear();
            
        for (var j = yearVal + year_before; j <= (yearVal + year_after); j++) {
            data.items.push({ Value: j, Text: j });
        }

        return data;
    }

});
