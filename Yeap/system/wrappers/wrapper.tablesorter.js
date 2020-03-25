//----------------------------------------------------------------------------------------
// File: wrapper.tablesorter.js
//
// Desc: wrapper for module loading for Table Sorter plug-in
// Path: /System/wrappers
//----------------------------------------------------------------------------------------


define([
	'jquery',
	'tSorterMin',
	'tSorterWidgets'
], function ($) {

	return {

		Init: init,                         // setup (init).
		Tablesorter: render                 // render table with tablesorter in page

	}	



	// function: init -> setup (init) tablesorter object.
	// param:
	// return value -> none.
	function init() {

		$.tablesorter.themes.bootstrap = {
			table: 'table table-striped',
			caption: 'caption',
			// header class names
			header: 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
			sortNone: '',
            sortAsc: '',
            sortDesc: '',
			active: '', // applied when column is sorted
			hover: '', // custom css required - a defined bootstrap style may not override other classes
			// icon class names
			icons: '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
			iconSortNone: 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
            iconSortAsc: '', // class name added to icon when column has ascending sort
            iconSortDesc: '', // class name added to icon when column has descending sort
			filterRow: '', // filter row class
			footerRow: '',
			footerCells: '',
			even: '', // even row zebra striping
			odd: ''  // odd row zebra striping
		};

	}
	// function: render -> transform table in tablesorter.
	// param: obj -> the object to transform
	// param: sort -> indexes array for sorting columns (1: sortable col, 0: Not sortable col)
	// return value -> none (but obj will be "transformed".
	function render(params) {                    

		var obj = params.obj;       // destination object 
		var sort = params.sort;     // indexes of sortable columns (1: sortable col, 0: Not sortable col)

		$(obj).tablesorter({
				theme: "bootstrap",

                cssIconAsc: 'fa fa-arrow-alt-circle-down', // class name added to icon when column has ascending sort
                cssIconDesc: 'fa fa-arrow-alt-circle-up', // class name added to icon when column has descending sort

				widthFixed: true,

                headerTemplate: '<div style="float:left">{content}</div> <div style="float: right">{icon}</div>', // new in v2.7. Needed to add the bootstrap icon!

				// widget code contained in the jquery.tablesorter.widgets.min.js file
				// use the zebra stripe widget if you plan on hiding any rows (filter widget)
				widgets: ["uitheme", "zebra"],

				widgetOptions: {
					// using the default zebra striping class name, so it actually isn't included in the theme variable above
					// this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
					zebra: ["even", "odd"],

					// set the uitheme widget to use the bootstrap theme class names
					// this is no longer required, if theme is set
					// ,uitheme : "bootstrap"
				},

				// *** APPEARANCE ***
				// NB: sortable by default is true: we set sorter= false to all column that don't need to support it
				headers: {
					0: { sorter: (sort[0] == 1) ? true : false },
					1: { sorter: (sort[1] == 1) ? true : false },
					2: { sorter: (sort[2] == 1) ? true : false },
					3: { sorter: (sort[3] == 1) ? true : false },
					4: { sorter: (sort[4] == 1) ? true : false },
					5: { sorter: (sort[5] == 1) ? true : false },
					6: { sorter: (sort[6] == 1) ? true : false },
					7: { sorter: (sort[7] == 1) ? true : false },
					8: { sorter: (sort[8] == 1) ? true : false },
					9: { sorter: (sort[9] == 1) ? true : false }
				}
			});
	   
	}
})