// --------------------------------------------------
//  ** File: "script_gestori.js" - Gestori eventi **
// --------------------------------------------------


// FUNCTION: sumByCols
//	Aggiorna i totali di colonna di una dataset
// PARAMS:
//	names : nomi dei dataset
//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
function sumByCols(params) {

	//var datasetNames = splitNames(((params != null)? params.names : OWNER));	// Crea l'array dei dataset da processare
	var datasetNames = splitNames(((params != null)? params.names : OWNER));	// Crea l'array dei dataset da processare

	for (n = 0; n < datasetNames.length; n++) {

		// Imposta i parametri di riferimento del dataset da processare
		var name  = datasetNames[n];											// Nome del dataset	(matrice)
		var rows  = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
		var cols  = $('[data-name=' + name + ']').attr('data-cols');			// Numero di colonne

		// Processa il dataset per colonne
		for (c = 1; c <= cols; c++){

			var cTot = 0;														// Reset del totale di colonna
			$(range(name, '', c)).each(function(){								// Seleziona e processa il subset (notazione NRC)

				var v = $(this).val();
				cTot += ( isNaN(parseFloat(v)) )? 0 : parseFloat(v);			// Aggiornamento totale

			});
			$('#cTot_' + name + '_c' + c).val(formatNumber(cTot));				// Aggiorna il campo del totale di colonna

		}
	}
}

// FUNCTION: sumByRows
//	Aggiorna i totali di riga di una dataset
// PARAMS:
//	params.names : nomi dei dataset
//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
function sumByRows(params) {

	var datasetNames = splitNames(((params != null)? params.names : OWNER));	// Crea l'array dei dataset da processare

	for (n = 0; n < datasetNames.length; n++) {

		// Imposta i parametri di riferimento del dataset da processare
		var name  = datasetNames[n];											// Nome del dataset	(matrice)
		var rows  = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
		var cols  = $('[data-name=' + name + ']').attr('data-cols');			// Numero di colonne

		// Processa il dataset per righe
		for (r = 1; r <= rows; r++){

			var rTot = 0;														// Reset del totale di riga
			$(range(name, r, '')).each(function(){								// Seleziona e processa il subset (notazione NRC)

				var v = $(this).val();
				rTot += ( isNaN(parseFloat(v)) )? 0 : parseFloat(v);			// Aggiornamento totale

			});
			$('#rTot_' + name + '_r' + r).val(formatNumber(rTot));				// Aggiorna il campo del totale di riga

		}
	}
}

// FUNCTION: sumByGrid
//	Aggiorna i totale generale di una dataset
// PARAMS:
//	params.names : nomi dei dataset
//	OWNER : [pseudo par.] non fa parte di params ma è definito dalla funzione chiamante e contiene il nome del dataset dell'owner (default)
function sumByGrid(params) {

	var datasetNames = splitNames(((params != null)? params.names : OWNER));	// Crea l'array dei dataset da processare

	for (n = 0; n < datasetNames.length; n++) {

		// Imposta i parametri di riferimento del dataset da processare
		var name  = datasetNames[n];											// Nome del dataset	(matrice)
		var rows  = $('[data-name=' + name + ']').attr('data-rows');			// Numero di righe
		var cols  = $('[data-name=' + name + ']').attr('data-cols');			// Numero di colonne
		var gTot  = 0;															// Reset del totale di griglia

		// Processa tutto il dataset
		for (r = 1; r <= rows; r++){
			for (c = 1; c <= cols; c++){

				var v = $(range(name, r, c)).val();								// Valore della cella selezionata (notazione NRC)
				gTot += ( isNaN(parseFloat(v)) )? 0 : parseFloat(v);			// Aggiornamento totale
			}
		}
		$('#gTot_' + name).val(formatNumber(gTot));								// Aggiorna il campo del totale di colonna
	}
}



// FUNCTION: gridProduct
//	Aggiorna i valori di una griglia prodotto
// PARAMS:
//  params.target  : dataset di destinazione
//	params.sources : nomi dei dataset sorgenti
function gridProduct(params) {

	// Definizione variabili e parametri di riferimento dei dataset da processare (Nota: devono essere omogenei)
	var target   = params.target;												// Nome del dataset destinazione
	var dsTarget = $('[data-name=' + target + ']');								// Oggetto dataset destinazione

	if (dsTarget.length == 0) { return false; }

	var sources  = splitNames(dsTarget.attr('data-sources'));					// Crea l'array dei dataset da processare
	var cbChange = dsTarget.attr('data-onchange')								// Set delle callbacks da eseguire sull'onchange
	var rows     = dsTarget.attr('data-rows');									// Numero di righe
	var cols     = dsTarget.attr('data-cols');									// Numero di colonne


	// Scansione della griglia
	for (r = 1; r <= rows; r++){
		for (c = 1; c <= cols; c++){

			var cP = 1;															// Rest del prodotto di cella
			for (n = 0; n < sources.length; n++) {								// Scansiona tutti i dataset sorgenti

				var s = sources[n];												// Nome del dataset	(matrice)
				var v = $(range(s, r, c)).val();								// Valore della cella selezionata (notazione NRC)
				cP = cP * (( isNaN(parseFloat(v)) )? 1 : parseFloat(v));		// Aggiornamento prodotto

			}

			$(range(target, r, c)).val(formatNumber(cP));						// Riporta il risultato nella cella corrispondente del target
		}
	}

	// ** Esegue infine le callback associate all'evento **
	eval("xOWNER = '" + target + "'; "+ cbChange);

}


function formula(params) {


	// Definizione variabili e parametri di riferimento dei dataset da processare (Nota: devono essere omogenei)
	var targetNames = splitNames(params.target);								// Nome del dataset destinazione

	for (t = 0; t < targetNames.length; t++) {

		// Imposta i parametri di riferimento del dataset da processare
		var target    = targetNames[t];											// Nome del dataset	(matrice)
		var dsTarget  = $('[data-name=' + target + ']');						// Oggetto dataset destinazione

		if (dsTarget.length == 0) { return false; }

		var sources   = splitNames(dsTarget.attr('data-sources'));				// Crea l'array dei dataset da processare
		var cbChange  = dsTarget.attr('data-onchange')							// Set delle callbacks da eseguire sull'onchange
		var rows      = dsTarget.attr('data-rows');								// Numero di righe
		var cols      = dsTarget.attr('data-cols');								// Numero di colonne

		var formula   = dsTarget.attr('data-formula');							// Formla da risolvere
		var constants = eval('c=' + dsTarget.attr('data-constants'));			// Array delle costanti (da sviluppare meglio)


		// ** 1: Precompilazione della formula **
		keys = Object.keys(constants);
		for (var i = 0; i < keys.length; i++) {
			var re = new RegExp(keys[i], 'g');									// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
			formula = formula.replace(re, constants[keys[i]]);
		}

		// ** 2: Scansione della griglia **
		for (r = 1; r <= rows; r++){
			for (c = 1; c <= cols; c++){

				var noError  = true;
				var cFormula = formula;
				for (n = 0; n < sources.length && noError; n++) {				// Scansiona tutti i dataset sorgenti se non ci sono errori

					var s = sources[n];											// Nome del dataset	(matrice)
					var v = $(range(s, r, c)).val();							// Valore della cella selezionata (notazione NRC)

					err = checkValue(v);
					if (err.code != 0)  {

						// Errore! Marca la cella
						$(range(target, r, c)).attr('placeholder', err.text).val('');
						noError = false;

					} else {

						var re = new RegExp(s, 'g');							// Costruisce una RegExp col valore di "chiave" per sostituire tutte le occorrenze
						cFormula = cFormula.replace(re, parseFloat(v));

					}

				}
				if (noError) {													// Compilazione formula a buon fine: esegue il calcolo

					var f = eval(cFormula)
					err = checkValue(f);
					if (err.code != 0)  {

						// Errore! Marca la cella
						$(range(target, r, c)).attr('placeholder', err.text).val('');

					} else {

						// Riporta il risultato nella cella del target ed elimina il placeholder (messaggio d'errore)
						$(range(target, r, c)).attr('placeholder', '').val(formatNumber(f));

					}
				}

			}
		}


		// ** Esegue infine le callback associate all'evento **
		eval("xOWNER = '" + target + "'; "+ cbChange);

	}
}