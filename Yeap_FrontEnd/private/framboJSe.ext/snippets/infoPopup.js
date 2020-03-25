//----------------------------------------------------------------------------------------
// File  : infoPopup.js
//
// Desc  : Popup di visualizzazione messaggio di informazione
// Path  : /Private/framboJse.ext/snippets
// target:  <snp_infoPopup />
// output:  popup
//----------------------------------------------------------------------------------------
define ([], function() {

    var _ITEMNAME = 'infoPopup';                            // Item's name
    var _ITEMTAG  = 'snp_';                                  // Item's tag prefix

    return {
		itemName : _ITEMNAME,													// Item's name
		itemTag  : _ITEMTAG,													// Item's tag prefix
		BuildHtml: buildHtml,													// Item's HTML
        Extend   : extend														// Callback function management
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

		var myHtml = '';

	 // HTML definition
        myHtml += '<span class="' + _ITEMNAME + pbAttrs[0] + '" role="button" data-toggle="popover" data-trigger="hover" data-html="true"';
        myHtml += 'data-content="' + getInfoMsgText(tagPars.msg) + '" ';
        myHtml += 'data-placement="top" ' + pbAttrs[1] + '>';
        myHtml +=   '<i class="far fa-question-circle"></i>';
        myHtml += '</span>';

        // Return value
        return new Promise((resolve, reject) => { resolve(myHtml) });

    }


    // FUNCTION: getMsgText
    //  Centralized management of glyph_info messages
    // PARAMS:
    //  msg : message's ID
    // output: msgTxt -> Testo da visualizzare
    // Nota: la gestione centralizzata consente più controllo e uniformità dei testi
    function getInfoMsgText(msg) {

        var txt = '';

        switch(msg) {
            
			case 'anagrafica':
				txt  = "<p class='margin-b-5'>Specifica se il professionista è un:</p>";
				txt += "<p class='margin-b-5'>- <b>Partner</b>: sceglie direttamente il fornitore a cui assegnare la trattativa;</p>";
				txt += "<p class='margin-b-5'>- <b>Affiliato</b>: apre la segnalazione, ma non può né scegliere il fornitore né vedere l'elenco degli associati al Network.</p>";
                break;
			
        	case 'criteriSelezione':
        		txt  = "";
        		txt += "";
                break;

            case 'prioritaCompetenze':
                txt  = "Le Competenze che hanno una priorità vengono presentate nell'home page, ";
                txt += "seguendo l'ordine di priorità più elevata (dalla 4 alla 1).<br>"
                txt += "Se la Competenza è una delle ultime inserite, comparirà anche nella sezione delle Ultime competenze aggiunte, sempre in Home Page";
                break;

            default:
                // testo libero: se l'ID non è codificato, viene riportato come testo del messaggio
                txt = msg;
        }

        return txt
    }


    // FUNCTION: extend
    //  extends functionality of snippet/widget after object creation in the DOM.
    // PARAMS:
    //  domain : html object container.
    // RETURN:
    //  Object's callback functions
    function extend(params) {

		var domain  = (params.domain != undefined)? params.domain : '';

        $(domain + '.infoPopup').popover();

	}

});