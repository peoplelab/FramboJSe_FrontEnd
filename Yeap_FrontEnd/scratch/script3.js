$(document).ready(function(){


	$('.init').click(function(e){

		e.preventDefault();

		var bpname = $(this).attr('bpname');
		bpname = (bpname == null)? $('#bpName').val() : bpname;

		// PATCH: gestione del logo ODC => si suppone che il flag sia mandato da WP (dati di Giorgio) come argomento in post
		var isODC= $(this).attr('isodc');
		isODC = (isODC == null)? 0 : isODC;
		var ruolo= $(this).attr('ruolo');
		ruolo = (ruolo == null)? 0 : ruolo;
		var trial= $(this).attr('trial_expired');
		trial = (trial == null)? 'false' : trial;

		var ref = location.protocol + '//' + location.host + $(this).attr('ref');

		ref += '&Title=' + bpname;																	// Aggiunge il nome
		ref += '&isODC=' + isODC;																	// Aggiunge il flag ODC
		ref += '&ruolo=' + ruolo;																	// Aggiunge il flag ODC
		ref += '&trial_expired=' + trial;															// Aggiunge il flag ODC


		//la  chiamata post da fare al portale 
        // creo il form in modo istantanio e poi faccio il window.open()
        //e alla fine faccio il submit

        var token = ref.split("\?");
        var mapForm = document.createElement("form");
        mapForm.target = "Yeap_FrontEnd";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = token[0];
        var mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = token[1];
        mapForm.appendChild(mapInput);

        document.body.appendChild(mapForm);

        map = window.open("", "Yeap_FrontEnd");

        if (map) {
            mapForm.submit();
        } else {
            alert('You must allow popups for this map to work.');
        }




        
		//var src = $('#mainIframe').prop('src');
		//if(ref != src) {
          //  $('#mainIframe').prop('src', ref);//apertura del iframe
		//}
		//setFrame();
	});

	//$(window).resize(function(e){
		
	//	setFrame();
	//});
	
});

function reset() {

	$('#pageCover, #mainIframe').hide();

}

function setFrame(){

	// Layer su page e su iframe
	var x = window.innerWidth;
	var y = window.innerHeight;
	var w = parseInt(x * .95);
	var h = parseInt(y * .95);
	var l = (x - w) / 2;
	var t = (y - h) / 2;

	$('#pageCover')
		.css('width', x).css('height', y)
		.show();
	$('#mainIframe')
		.css('width', w).css('height', h).css('top', t).css('left',l)
		.show();
}