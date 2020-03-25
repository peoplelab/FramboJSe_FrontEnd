// input_float.js -> "input_float" snippet management file
// target:  <snp_input_float/>
// funct.:  
// output:  campo input testo generico
define(['./input_kernel.js', 'base_constants', 'base_presenter'], function (kernel, constants, pBase) {

	var _ITEMNAME = 'input_generic';                         // Item's name
	var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

	return {
		itemName: _ITEMNAME,
		itemTag: _ITEMTAG,
		BuildHtml: buildHtml,
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

		var value = tagPars.value;
        var symbolID = tagPars.symbol ? tagPars.symbol : tagPars.currency;
        var symbolAlign = tagPars.symbolAlign ? tagPars.symbolAlign : 'right';        //left o right
        var mirror = tagPars.mirror;
        var labelId = tagPars.labelId;
        var labelText = tagPars.labelText;
		var min = tagPars.min;
		var max = tagPars.max;


		var customAttrs = pbAttrs[1] + ' checksFor="float" ';

		var kPars = {
			Input: 'text',
			Class: _ITEMNAME + pbAttrs[0],
			Attrs: customAttrs
		};

        var params = { symbol: symbolID };

        var symbol = constants.GetSymbol(params);

		var htmlWrap, closeWrap;
        var myHtml = ' <label class="d-flex df-label margin-v-20" id="' + labelId + '">';
        myHtml += '<label class="rowLabel df-XML_label_economics" ref="' + labelId + '">' + labelText + '</label>';
        myHtml += '<div class="input_float ' + pbAttrs[0] + _ITEMNAME + '" > ';
        if (symbol && symbolAlign === 'left') {
            myHtml += '<span class="um symbol">' + symbol;
        } else {
            myHtml += '<span class="um">';
            myHtml += '&nbsp;';
        }
        myHtml += '</span>';
        myHtml += '<input type="number" class="form-control input_number cleanInput w-100" value="' + value;
		myHtml += '" min="' + min + '" max="' + max + '" key="' + tagPars.key + '" ' + pbAttrs[1] + '/>';
        if (symbol && symbolAlign === 'right') {
			myHtml += '<span class="symbol">' + symbol + '</span>';
		}
        myHtml += '</div>';
        myHtml += '<input type="hidden" class="form-control input_hidden cleanInput"';
        myHtml += 'value = "' + mirror + '" ov = "' + mirror + '" id = "' + 'something' + '" key = "' + 'something' + '" >';
        myHtml += '</label>';

        var coso = '<div class="row" dstable="" data-method="2" data-name="' + name + '">';
        coso +=         '<div class="col datagrid-2">';
        coso +=             '<div class="clear clearfix">';
        coso +=                 '<label class="rowLabel df-XML_label_economics" ref="' + name + '_1">Liquidità iniziale anno -1</label>';
        coso +=                 '<span class="um" >€</span> ';
        coso += '<input type="text" readonly = "" tabindex="-1" class="form-control economics calc_number2 " errid = "0" nref="' + name + '" rref = "1"';
        coso += 'cref="1" id = "' + name + '_r1_c1" value="0,00">';
        coso +=             '</div >';
        coso +=         '</div >';
        coso +=     '</div > ';

		// Return value
		return new Promise((resolve, reject) => { resolve(myHtml) });
    }
});