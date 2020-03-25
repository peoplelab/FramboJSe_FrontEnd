// --------------------------------------------------
//  ** File: "script_tools.js" - Tools & utility **
// --------------------------------------------------


// FUNCTION: range
//	Definisce il range di un dataset sul quale operare
// PARAMS: (Nota: i parametri non sono in formato JSON, ma si usa la notazione NRC per ottimizzare l'uso della funzione negli script)
//	name : nome del dataset
//	row  : riga di riferimento
//	col  : colonna di riferimento
// RETURN:
//  subset : il range selezionato del dataset specificato
function range(name, row, col) {

	var set = '';

	if (name == undefined) {
		console.log('Error - RANGE: dataset non specificato');
		return;
	} else {

		set = '[nRef=' + name +']';												// 1: definisce il dataset (N)
		if (row != undefined && row != '' && !isNaN(row)) {
			set += '[rRef=' + parseInt(row) +']';								// 2: selezione della riga (R)
		}
		if (col != undefined && col != '' && !isNaN(col)) {
			set += '[cRef=' + parseInt(col) +']';								// 3: selezione della colonna (C)
		}

		return set;																// Resituisce il range selezionato
	}
}


// FUNCTION: splitNames
//	Normalizza la stringa dei nomi dei dataset e la trasforma in array
// PARAMS:
//	namestring : stringa dei nomi dei dataset
// RETURN:
//	myArray : stringa normalizzata trasformata in array
function splitNames(namestring) {
	
	try {
		var myArray = namestring.trim().replace(/\s\s+/g, ' ').split(' ');		// Elimina i blank superflui e splitta su " "		
		return myArray;
	}
	
	catch(err) {
		myArray = ['none'];
		return myArray;
	}
}


// FUNCTION: formatNumber
//	Restituisce il valore formattato con un nr. di decimali fisso
// PARAMS:
//	val  : valore numerico da formattare
//	nDec : numero di cifre decimali
// RETURN:
//	None
function formatNumber(val, nDec) {

	// Lettura parametri
	var nDec   = (isNaN(nDec))? 2 : nDec;										// Imposta il nr. di decimali (default: 2)
	var decPow = Math.pow(10, nDec);											// Moltiplicatore (10 ^ nDec)
	var frmVal = (Math.round(val * decPow) / decPow).toFixed(nDec);				// Formattazione del valore
	
	return frmVal;
	
}


function checkValue(val){
	
	var response = {code: 0, text: ''}
	//var obj = $(range);
	
	//if (obj.length == 0) {
	//	response.code  = 1;
	//	response.text = '#Null!';
	//	return response
	//}
	
	var v = parseFloat(eval(val));
	if (isNaN(v)) { v = 'forced to NaN'}
		
	
	switch (v) {
		case 'forced to NaN':
			response.code  = 2;
			response.text = '#NaN!';
			break;
		case Infinity:
			response.code  = 3;
			response.text = '#DIV/0!';
			break;			
		case undefined:
			response.code  = 4;
			response.text = '#Name!';
			break;
			
		default:
	
	}
	
	return response;
}