// ---------------------------------------------------
//  ** File: "script_costruttori.js" - Costruttori **
// ---------------------------------------------------


// FUNCTION: dsTable
//	Costruisce una matrice (tabella) n * m con totali di colonna (e di riga?)
// PARAMS:
//	name     : Nome del dataset
//	type     : Tipo dei campi: input, calcolato, ecc.
//	rows     : Numero di righe
//	cols     : Numero di colonne
//	totals   : Tipologie dei totali da costruire
//	onchange : Funzioni di callback da eseguire sull'onchange


function dsTable(params) {

	// Definizione variabili
	var html = "";																// Html per la costruzione della griglia
	var id   = '';																// Usato nella composizione ID degli elementi della griglia
	var val  = 0;																// Valore da assegnare al campo (generalmente da XML)
	var name = params.name;														// Nome del dataset
	var type = params.type;														// Tipo dei campi
	var rows = params.rows;														// Numero di righe
	var cols = params.cols;														// Numero di colonne
	var tots = params.total.toLowerCase();										// Tipologie di totali

	var cbChange  = params.onchange;											// Set delle callbacks da eseguire sull'onchange
	var cbClick   = params.onclick;												// Set delle callbacks da eseguire sull'onchange

	var initValue = 0;															// Valore di default per campi non assegnati
	var totByRows = (tots.indexOf('rows') > -1)? true : false;					// Flag di costruzione totali di riga
	var totByCols = (tots.indexOf('cols') > -1)? true : false;					// Flag di costruzione totali di colonna
	var totByGrid = (tots.indexOf('ttot') > -1)? true : false;					// Flag di costruzione totale di griglia
	var readonly  = (type != 'input')? true : false;							// Flag di sola lettura dei campi

	// ** 1: COSTRUZIONE GRIGLIA **
	html += '<div class="col datagrid-' + (cols + ((totByCols)? 1 : 0)) + '">';	// Wrapper della griglia


	for (r = 1; r <= rows; r++) {

		html += '<div class="clear">';											// Inizia una nuova riga

		for (c = 1; c <= cols; c++) {
			id    = name + '_r' + r + '_c' + c;									// Costruzione ID (NRC)
			val   = formatNumber(initValue);									// valore di default
			
			html += '<input type="number"';										// Costruzione ID (NR)
			html += (readonly)? ' readonly tabindex="-1" ' : '';				// Definizione tag
			html += ' class="form-control input_number ' + (readonly? '' : 'cleanInput') + '"';	// Classe
			html += ' nRef="' + name + '" rRef="' + r + '" cRef="' + c + '"';	// Attributi di riferimento
			html += ' id="' + id + '" value="' + val + '">';					// ID e valore
		}
		// Se specificato, aggiunge il totale di riga
		if (totByRows) {
			id    = 'rTot_' + name + '_r' + r;									// Costruzione ID (NR)
			html += '<input type="number" readonly tabindex="-1"';				// Definizione tag
			html += ' class="form-control calc_number"';						// Classe
			html += ' rRef="' + r + '" ';										// Attributi di riferimento
			html += ' id="' + id + '" value="">';								// ID e valore
		}
		html += '</div>';
	}


	// Se specificati, aggiunge i totali di colonna e totale di griglia
	if (totByCols) {

		html += '<div class="clear">';

		// Totale di colonna
		for (c = 1; c <= cols; c++) {
			id    = 'cTot_' + name + '_c' + c;									// Costruzione ID (NR)

			html += '<input type="number" readonly tabindex="-1"';				// Definizione tag
			html += ' class="form-control calc_number"';						// Classe
			html += ' nRef="' + name + '_totale" rRef="1" cRef="' + c + '" ';	// Attributi di riferimento
			html += ' id="' + id + '" value="">';								// ID e valore
		}
		// Totale di griglia
		if (totByGrid) {
			id    = 'gTot_' + name;												// Costruzione ID (NR)
			html += '<input readonly tabindex="-1" type="number"';				// Definizione tag
			html += ' class="form-control calc_number" ';						// Classe
			// html += ' id="' + id + '" value="' + val + '">';					// ID e valore
			html += ' id="' + id + '" value="">';								// ID e valore
		}

		html += '</div>';
	}

	// Inserimento finale della griglia nel DOM
	html += '</div>';															// Chiusura wrapper della griglia
	$('[data-name=' + name + ']').html(html);									// Inserisce la griglia nel DOM


	// ** 2: BINDING EVENTI **
	$('[data-name=' + name + ']').not('[readonly]').change(function(e){
		eval("OWNER = '" + name + "'; "+ cbChange);								// OWNER trasmette il dataset di default quando non è definito nelle callback
	});

	$('[data-name=' + name + '] [readonly]').click(function(e){
		eval("OWNER = '" + name + "'; "+ cbClick);								// OWNER trasmette il dataset di default quando non è definito nelle callback
	});

}

