// input_float.js -> "input_float" snippet management file
// target:  <snp_input_float/>
// funct.:  
// output:  campo input testo generico
define(['./input_kernel.js', 'base_constants', 'base_presenter'], function (kernel, constants, pBase) {

    var _ITEMNAME = 'input_float';                         // Item's name
    var _ITEMTAG = 'snp_';                                  // Item's tag prefix

    return {
        itemName: _ITEMNAME,
        itemTag: _ITEMTAG,
        BuildHtml: buildHtml,
        Extend: extend
    };


    // FUNCTION: buildHtml
    //  builds the snippet's HTML code 
    // PARAMS:
    //  tagPars : tag's custom parameters (in JSON format)
    //  pbAttrs : the "public" attributes to be applied to the most external element of the snippet
    //              pbAttrs[0] : extension of "class" attribute,
    //              pbAttrs[1] : all others attributes 
    // RETURN:
    //  myHtnml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
    function buildHtml(tagPars, pbAttrs) {
        var sClass = tagPars.sClass;
        var value = tagPars.value ? tagPars.value : "";
        var key = tagPars.key ? tagPars.key : "";
        var currencyID = tagPars.currency;
        var symbolID = tagPars.symbol;
        var min = tagPars.min;
        var max = tagPars.max;
        var align = tagPars.align === 'left' ? tagPars.align : 'right';  //allinea a destra di default


        var customAttrs = pbAttrs[1] + ' checksFor="float" ';

        var kPars = {
            Input: 'text',
            Class: _ITEMNAME + pbAttrs[0],
            Attrs: customAttrs
        };

        params = {
            currency: currencyID,
            symbol: symbolID
        };

        var symbol = constants.GetSymbol(params);

        var htmlWrap, closeWrap;
        var myHtml = '<div class="input_float ' + pbAttrs[0] + '">';
        myHtml += '<input type="number" class="form-control input_number cleanInput _visible' + sClass + '" value="' + value;
        myHtml += '" min="' + min + '" max="' + max + '" key="' + key + '" ' + pbAttrs[1] + '/>';
        if (symbol) {
            myHtml += '<span class="symbol float-' + align + '">' + symbol + '</span>';
        }
        myHtml += '</div>';
        myHtml += '<input type="hidden" class="form-control input_hidden cleanInput" value="' + 0 + '" ov="' + 0 + '" id="' + sClass + '" key="' + sClass + '">';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });
    }

    function extend(params) {
        var $perc = $('.inputFloat input.form-control.input_number.cleanInput');
        var percID = $perc.prop("id");

        $perc.change(function () {
            var max = eval($(this).attr('max'));
            var min = eval($(this).attr('min'));

            var v = $(this).val();
            if (isNaN(v) || v == null || v == '') {
                v = 0;
                $visiblePercTFR.val(v);
            }
            if (v > max || v < min) {
                v = (v > max) ? max : min;
                $visiblePercTFR.val(v);
            }
        });
    }
});