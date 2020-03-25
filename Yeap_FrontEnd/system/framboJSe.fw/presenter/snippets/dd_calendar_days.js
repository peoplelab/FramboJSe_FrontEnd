// dd_calendar_days.js -> snippet "calendar days drop down"
// target:  <snp_dd_calendar_days />
// funct.:  Inserimento del dropdown di selezione del giorno del mese
// output:  drop down
define(["./dd_base.js"], function (base) {

	var _ITEMNAME = 'dd_calendar_days';											// Item's name
	var _ITEMTAG  = 'snp_';														// Item's tag prefix

	return {
		itemName : _ITEMNAME,               
		itemTag  : _ITEMTAG,
		BuildHtml: buildHtml
	}


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

		tagPars.itemName = _ITEMNAME;

		var htmlRes = base.RenderJson(fillContent_Days(tagPars), tagPars, pbAttrs);

		return new Promise((resolve, reject) => { resolve(htmlRes) });
	}


	// FUNCTION: fillContent_Days
	//  Adds the elements to the dropdown.
	// PARAMS:
	//  params.month : nr. of the month (optional)
	//  params.year  : nr. of the year (optional)
	// RETURN: 
	//  JSON object containing the dropdown elements
	function fillContent_Days(params) {

		var elements = { items: []};
		var nrOfDays = 31;														// Default: till to 31 days per month

		// Sets the nuber of the day in the specified month/year
		if (params.month != undefined || params.year != undefined) {
			try {
				nrOfDays = new Date(params.year, params.month, 0).getDate();
			}
			catch(e) {
				nrOfDays = 31;
			}
		}

		for (var i = 1; i <= nrOfDays; i++) {
			elements.items.push({ Value: i, Text: i });
		}
		return elements;
	}



});
