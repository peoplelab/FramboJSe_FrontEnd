// wrapper.jcrop.js -> wrapper for jCrop "as a module"
// http://jcrop.org/

define(['jquery',
        '/scripts/libs/jquery.Jcrop.min.js'],
	function ($) {

	    return {

	        Init: init,         // setup (init).
	        Jcrop: render       // render object with jcrop in page

	    }	



	    // function: init -> setup (init) jcrop object.
	    // param: none.
	    // return value -> none.
	    function init() {	       

	    }
	    // function: render -> transform object in "jcrop" object.
	    // param: obj -> the object to transform
	    // param: sort -> indexes array for sorting columns (1: sortable col, 0: Not sortable col)
	    // return value -> none (but obj will be "transformed".
	    function render(params) {

	        var obj = params.obj;       // destination object 

	        var options = {
	            boxWidth: params.boxWidth,      // Maximum width you want for your bigger images
	            boxHeight: params.boxWidth,     // Maximum Height for your bigger
	            onChange: params.onChange,
	            onSelect: params.onSelect,
	            aspectRatio: params.aspectRatio
	        };

	        $(obj).Jcrop(options, params.onSuccess);
	        
	    }
	})