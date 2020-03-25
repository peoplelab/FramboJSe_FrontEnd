
// Script samples: test per preparare gli snippet di Yeap_FrontEnd


	//// Detect: iframe o no?
	//var tHref = window.top.location.href;
	//var lHref = window.location.href;
	//if (tHref != lHref) {
	//	alert("Sei in un iframe!");
	//} else {
	//	alert("Sei  alxxxxx top!");
	//}


$(document).ready(function(){

	// -----------------------------------------------
	// PATCH!!   Metto tutto allo stesso nr. colonne (simulazione valore da webapp)
	var nColonne = $('#nColonne').val();
	$('[data-cols]').each(function(){
		$(this).attr('data-cols', nColonne);
	});
	// -----------------------------------------------


	// *** Detect: iframe o no? ***
	var tHref = window.top.location.href;
	var lHref = window.location.href;
	if(tHref!=lHref) {
		//alert("Sei in un iframe!");
	} else {
		//alert("Sei al top!");
	}


	$('.btnPage').click(function(e){

		e.preventDefault();

		var ref = 'https://localhost:8082' + $(this).attr('ref');
		var src = $('#mainIframe').prop('src');
		
		if(ref != src) {
			$('#mainIframe').prop('src', ref);
		}
		$('#iframeCover').hide();
		$('#pageCover').show();

	});

	// Layer su page e su iframe
	var xx = window.innerWidth;
	var yy = window.innerHeight;
	$('#pageCover').css('width', xx).css('height', yy);	
	
	var xx = $('#mainIframe').css('width');
	var yy = $('#mainIframe').css('height');
	$('#iframeCover').css('width', xx).css('height', yy);
	
	
	
	$('#pippo').click(function(e){
		
	});
});

function test(e){
	
	//e.preventDefault();
	
	console.log('test...');
	var d = $(window.top.document);
	//var a = d.find('#pippo');
	var a = d.find('#reset');
	
	a.click();
}


function clickPippo(e) {
	//e.preventDefault();
	
	$('#iframeCover').show();
	$('#pageCover').hide();
	//alert('pippo')	
	
}
	