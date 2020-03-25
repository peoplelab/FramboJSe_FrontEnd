// dd_operators_equal.js -> snippet "equal operators drop down"
// target:  <snp_dd_operators_equal />
// output:  drop down
define(["./dd_base.js"], function (base) {

    var _ITEMNAME = 'dd_operators_equal';
    var _ITEMTAG = 'snp_';


    return {
        itemName: _ITEMNAME,                     // Item's name
        itemTag: _ITEMTAG,                       // Item's tag prefix
        BuildHtml: buildHtml                     // Item's HTML
    }


    // function: buildHtml -> main method for rendering object.
    // param: tagPars -> snippet params necessary for rendering
    //                  (value) selected value for drop down
    // param: pbAttrs -> additionaly paramaters for drop down (unused)
    // return value -> a string representing the html code for dropdown.
    function buildHtml(tagPars, pbAttrs) {

        tagPars.itemName = _ITEMNAME;

        var htmlRes = base.RenderJson(fillContent(), tagPars, pbAttrs);

        return new Promise((resolve, reject) => { resolve(htmlRes) });
    }


    // function: fillContent_Days -> get the elements for the dropdown.
    // param: none
    // return value -> a json data containing elements for dropdown.
    function fillContent() {
        var data = { items: [] };

        var values = ["<", ">", "<=", ">=", "==", "<>"];
        var texts = ["Minore di", "Maggiore di", "Minore (o uguale) di", "Maggiore (o uguale) di", "Uguale a", "Diverso da"];

        for (var i = 0; i < values.length; i++) {
            data.items.push({ Value: values[i], Text: texts[i] });
        }

        return data;
    }

});
