//----------------------------------------------------------------------------------------
// File: sitemap.presenter.js
//
// Desc: Renders the "breadcrumb" navigation of the page - Presenter
// Path: /system/framboJSe.fw/presenter
//----------------------------------------------------------------------------------------

define([
	'../controller/sitemap.controller.js',
	'customizeSitemap'
], function (controller, cSitemap) {

	var _container = "";    // dest container for sitemap

	return {
		Init: init,                     // module initialization
		Render: render,                 // render sitemap inside a container

		CurrentNode: getCurrent,
		ParentNode: getParent,          // get node parent
		ChildrenNode: getChildren,      // get children node

		GenericNode: getGeneric         // get generic node (outside of current...)
	}


	// function: init -> module initialization.
	// param: node_id -> node we are searching for... 
	// param: template_code -> special template code for sitemap (optional and other than 'public' or 'private')... 
	// param: container -> div container for rendering
	// return value -> none.
	function init(params) {

		_container = (params.container == null) ? _container : params.container;
		var nodeid = (params.node_id == null) ? "" : params.node_id;            

		controller.Init({ node_id: nodeid, template_code: params.template_code });

		return;
	}

	// function: render -> call controller function to get values.
	// param: params are all "variables" values, values that depend on the page: detail code for the page (i.e. "subject id" for subject), 
	// groupN text, labelX text.
	// param: onSuccess -> callback function for Success
	// return value -> none, but a server call is made.
	function render(params) {

		var ext_params = $.extend(params,
			{ onSuccess: renderHtml }
		);

		controller.Get(ext_params);

	}

	// function: renderHtml -> sitemap render inside a container.
	// param: array_maps -> sitemap elements mapping (array of {id, text, value})
	// return value -> none, but render is made.
	function renderHtml(array_maps) {
		var html = '';

		html += '<div class="container">';
		html += '<ol class="breadcrumb">';

		var list = '';
		$(array_maps).each(function () {

			var element = '';
			element += '<li>';
			element += '<a href="' + this.url + '"';
			element += (this.id != undefined)? ' id="' + this.id + '"' : '';
			element += '>' + this.text + '</a>';
			element += '</li>';

			list = element + list;
		});

		html += list;
		html += '</ol>';
		html += '</div>';

		$('#' + _container).html(html);

		// Sets the customizations
		cSitemap.Customize();

	}


	// function: getParent -> get parent node (of current).
	// param: none.
	// return value -> parent node
	function getParent() {
		return controller.Parent();
	}

	function getChildren() {
		return controller.Children();
	}

	function getCurrent() {
		return controller.Current();
	}

	function getGeneric(key) {
		return controller.GetGeneric({ node_id: key });
	}
});
