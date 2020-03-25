
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


	// function: buildsTableWithSums
	$('[dstable]').each(function(){
		dsTable( $(this).data() );
	});



	// Init
	sumByCols({names: 'quantita prezzo extra'});
	sumByRows({names: 'quantita prezzo extra'});
	sumByGrid({names: 'quantita prezzo extra'});

	gridProduct({target: 'ricavo'});
	formula({target: 'prova'});
	formula({target: 'provabis'});



	// ** Bind predefiniti **
	$('.input_number').not('[readonly]').blur(function(){
		// Formatta il valore
		$(this).val( formatNumber($(this).val()) );
	});



});

function test(){
	console.log('test...');
	var d = $(window.top.document);
	var a = d.find('#pippo');

	a.click();
}

