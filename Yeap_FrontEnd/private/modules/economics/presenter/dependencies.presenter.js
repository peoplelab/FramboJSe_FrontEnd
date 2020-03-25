//----------------------------------------------------------------------------------------
// File: dependencies.js
//
// Desc: Definizione delle dipendenze "dataset - Formule calcolate"
// Path: /Private/modules/economics/presenter
//----------------------------------------------------------------------------------------

define([
	'base_presenter'
], function (pBase) {

	var _Dependencies;															// Elenco delle dipendenze
	var _FormulaComplex;														// Elenco delle formule complesse

	return {
		Init             : init,												// Inizializza le definizioni
		GetDependencies  : getDependencies,										// Recupera le dipendenze specifiche di un dataset
		GetFormulaComplex: getFormulaComplex,									// Recupera la definizione della formula complessa
	}


	// FUNCTION: init
	//  Inizializzazioni
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function init(params) {

		declareDependencies();
		declareFormulaComplex();

	}


	// FUNCTION: declareDependencies
	//  Inizializza la matrice delle dipendenze
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function declareDependencies(){

		_Dependencies = {};

		var thisPageDefs;														// Def. parziali

		// Pagina: Ricavi
		thisPageDefs = {
			Prodotto_QtaVenduta: [
				'Ricavi_RicavoNetto',
				'Ricavi_RicavoNetto_Tot',
				'Ricavi_Iva',
				'Ricavi_RicavoTotale',
				'Prodotto_PrezzoMedio',
			],
			Prodotto_PrezzoUnitario: [
				'Ricavi_RicavoNetto',
				'Ricavi_RicavoNetto_Tot',
				'Ricavi_Iva',
				'Ricavi_RicavoTotale',
				'Prodotto_PrezzoMedio',
			]
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Costi esterni (acquisti & magazzino)
		thisPageDefs = {
			Acquisti_PF_PercPrezzoUnitario: [
				'Acquisti_PF_CostoUnitario',
				'Acquisti_PF_CostoNetto',
				'Acquisti_PF_CostoNetto_Tot',
				'Acquisti_PF_CostoMedio',
				'Acquisti_PF_Iva',
				'Acquisti_PF_CostoTotale',
				'Magazzino_PF_CostoNetto',
			//	'Magazzino_PF_CostoNetto_Tot',

				'Acquisti_CostoNettoTotale',
				'Acquisti_IvaTotale',
				'Acquisti_CostoLordoTotale',
			],
			Magazzino_PF_Giorni: [
				'Magazzino_PF_Quantita',
				'Magazzino_PF_CostoNetto',
			//	'Magazzino_PF_CostoNetto_Tot',
				'RiportoTot_PF',
				'ValoreNettoMagazzino',
			//	'Magazzino_IvaTotale',
			//	'Magazzino_CostoLordoTotale',
			],

			Acquisti_MP_PrezzoUnitario: [
				'Acquisti_MP_CostoNetto',
				'Acquisti_MP_CostoNetto_Tot',
				'Acquisti_MP_Iva',
				'Acquisti_MP_CostoTotale',
				'Acquisti_CostoNettoTotale',
				'Acquisti_IvaTotale',
				'Acquisti_CostoLordoTotale',

				'Magazzino_MP_Quantita',
				'Magazzino_MP_CostoNetto',
			//	'Magazzino_MP_CostoNetto_Tot',
				'RiportoTot_MP',
				'ValoreNettoMagazzino',
			//	'Magazzino_IvaTotale',
			//	'Magazzino_CostoLordoTotale',
			],
			Acquisti_MP_Quantita: [
				'Acquisti_MP_CostoNetto',
				'Acquisti_MP_CostoNetto_Tot',
				'Acquisti_MP_Iva',
				'Acquisti_MP_CostoTotale',
				'Acquisti_CostoNettoTotale',
				'Acquisti_IvaTotale',
				'Acquisti_CostoLordoTotale',

				'Magazzino_MP_Quantita',
				'Magazzino_MP_CostoNetto',
			//	'Magazzino_MP_CostoNetto_Tot',
				'RiportoTot_MP',
				'ValoreNettoMagazzino',

			//	'Magazzino_IvaTotale',
			//	'Magazzino_CostoLordoTotale',
			],
			Magazzino_MP_Giorni: [
				'Magazzino_MP_Quantita',
				'Magazzino_MP_CostoNetto',
			//	'Magazzino_MP_CostoNetto_Tot',
				'RiportoTot_MP',
				'ValoreNettoMagazzino',

			//	'Magazzino_IvaTotale',
			//	'Magazzino_CostoLordoTotale',
			],
			
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Costi variabili
		thisPageDefs = {
			CostiVarComm_CostoNetto: [
				'CostiVarComm_Iva',
				'CostiVarComm_TotaleMensile',
				'CostiVarComm_TotaleAnnuale'
			],
			CostiVarComm_PercIva: [
				'CostiVarComm_Iva',
				'CostiVarComm_TotaleMensile',
				'CostiVarComm_TotaleAnnuale'
			],
			CostiVarProd_CostoNetto: [
				'CostiVarProd_Iva',
				'CostiVarProd_TotaleMensile',
				'CostiVarProd_TotaleAnnuale'
			],
			CostiVarProd_PercIva: [
				'CostiVarProd_Iva',
				'CostiVarProd_TotaleMensile',
				'CostiVarProd_TotaleAnnuale'
			]
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Costi interni
		thisPageDefs = {
			CostiMarketing_CostoNetto: [
				'CostiMarketing_Iva',
				'CostiMarketing_TotaleMensile',
				'CostiMarketing_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiMarketing_PercIva: [
				'CostiMarketing_Iva',
				'CostiMarketing_TotaleMensile',
				'CostiMarketing_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiInfrastrutture_CostoNetto: [
				'CostiInfrastrutture_Iva',
				'CostiInfrastrutture_TotaleMensile',
				'CostiInfrastrutture_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiInfrastrutture_PercIva: [
				'CostiInfrastrutture_Iva',
				'CostiInfrastrutture_TotaleMensile',
				'CostiInfrastrutture_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiComunicazione_CostoNetto: [
				'CostiComunicazione_Iva',
				'CostiComunicazione_TotaleMensile',
				'CostiComunicazione_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiComunicazione_PercIva: [
				'CostiComunicazione_Iva',
				'CostiComunicazione_TotaleMensile',
				'CostiComunicazione_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiStruttura_CostoNetto: [
				'CostiStruttura_Iva',
				'CostiStruttura_TotaleMensile',
				'CostiStruttura_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiStruttura_PercIva: [
				'CostiStruttura_Iva',
				'CostiStruttura_TotaleMensile',
				'CostiStruttura_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiAmministrativi_CostoNetto: [
				'CostiAmministrativi_Iva',
				'CostiAmministrativi_TotaleMensile',
				'CostiAmministrativi_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiAmministrativi_PercIva: [
				'CostiAmministrativi_Iva',
				'CostiAmministrativi_TotaleMensile',
				'CostiAmministrativi_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiAltri_CostoNetto: [
				'CostiAltri_Iva',
				'CostiAltri_TotaleMensile',
				'CostiAltri_TotaleAnnuale',
				'TotaleNetti',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			],
			CostiAltri_PercIva: [
				'CostiAltri_Iva',
				'CostiAltri_TotaleMensile',
				'CostiAltri_TotaleAnnuale',
				'CostiLordi_Iva',
				'CostiLordi_Totale',
			]
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Risorse umane
		thisPageDefs = {
			CLevel_Costo: [
				'CostoTotaleAnnuale'
			],
			CLevel_Risorse: [
				'TotManagement',
				'TotRisorse',
				'CostoTotaleAnnuale'
			],
			Manager_Costo: [
				'CostoTotaleAnnuale'
			],
			Manager_Risorse: [
				'TotManagement',
				'TotRisorse',
				'CostoTotaleAnnuale'
			],
			Marketing_Costo: [
				'CostoTotaleAnnuale'
			],
			Marketing_Risorse: [
				'TotStruttura',
				'TotRisorse',
				'CostoTotaleAnnuale'
			],
			PM_IT_Costo: [
				'CostoTotaleAnnuale'
			],
			PM_IT_Risorse: [
				'TotStruttura',
				'TotRisorse',
				'CostoTotaleAnnuale'
			],
			Adm_Costo: [
				'CostoTotaleAnnuale'
			],
			Adm_Risorse: [
				'TotStruttura',
				'TotRisorse',
				'CostoTotaleAnnuale'
			]
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Immobilizzazioni materiali
		thisPageDefs = {
			IM1_CapexNette: [
				'IM1_IvaCredito',
				'IM1_InvestimentiTotali',
				'IM1_QuotaAmmortamentoAnnuale',
				'IM1_AmmortamentoNuovoCumulato',
				'IM1_AmmortamentoTotaleCumulato',
				'IM1_ResiduoCapexNuove',
				'IM1_Totali',
			],
			IM1_IvaCreditoPerc : [
				'IM1_IvaCredito',
				'IM1_InvestimentiTotali',
			],
			IM1_AnniAmmortamento: [
				'IM1_QuotaAmmortamentoAnnuale',
				'IM1_AmmortamentoNuovoCumulato',
				'IM1_AmmortamentoTotaleCumulato',
				'IM1_ResiduoCapexNuove',
				'IM1_Totali',
			],
			IM1_IperammortamentoPercAggiunta: [
				'IM1_IperammortamentoTotale',
				'IM1_IperammortamentoIper',
				'IM1_IperammortamentoAggiuntivo',
				'IM1_IperammortamentoCumulato',
			],

			IM2_CapexNette: [
				'IM2_IvaCredito',
				'IM2_InvestimentiTotali',
				'IM2_QuotaAmmortamentoAnnuale',
				'IM2_AmmortamentoNuovoCumulato',
				'IM2_AmmortamentoTotaleCumulato',
				'IM2_ResiduoCapexNuove',
				'IM2_Totali',
			],
			IM2_IvaCreditoPerc : [
				'IM2_IvaCredito',
				'IM2_InvestimentiTotali',
			],
			IM2_AnniAmmortamento: [
				'IM2_QuotaAmmortamentoAnnuale',
				'IM2_AmmortamentoNuovoCumulato',
				'IM2_AmmortamentoTotaleCumulato',
				'IM2_ResiduoCapexNuove',
				'IM2_Totali',
			],
			IM2_IperammortamentoPercAggiunta: [
				'IM2_IperammortamentoTotale',
				'IM2_IperammortamentoIper',
				'IM2_IperammortamentoAggiuntivo',
				'IM2_IperammortamentoCumulato',
			],

			IM3_CapexNette: [
				'IM3_IvaCredito',
				'IM3_InvestimentiTotali',
				'IM3_QuotaAmmortamentoAnnuale',
				'IM3_AmmortamentoNuovoCumulato',
				'IM3_AmmortamentoTotaleCumulato',
				'IM3_ResiduoCapexNuove',
				'IM3_Totali',
			],
			IM3_IvaCreditoPerc : [
				'IM3_IvaCredito',
				'IM3_InvestimentiTotali',
			],
			IM3_AnniAmmortamento: [
				'IM3_QuotaAmmortamentoAnnuale',
				'IM3_AmmortamentoNuovoCumulato',
				'IM3_AmmortamentoTotaleCumulato',
				'IM3_ResiduoCapexNuove',
				'IM3_Totali',
			],
			IM3_IperammortamentoPercAggiunta: [
				'IM3_IperammortamentoTotale',
				'IM3_IperammortamentoIper',
				'IM3_IperammortamentoAggiuntivo',
				'IM3_IperammortamentoCumulato',
			],

			IM4_CapexNette: [
				'IM4_IvaCredito',
				'IM4_InvestimentiTotali',
				'IM4_QuotaAmmortamentoAnnuale',
				'IM4_AmmortamentoNuovoCumulato',
				'IM4_AmmortamentoTotaleCumulato',
				'IM4_ResiduoCapexNuove',
				'IM4_Totali',
			],
			IM4_IvaCreditoPerc : [
				'IM4_IvaCredito',
				'IM4_InvestimentiTotali',
			],
			IM4_AnniAmmortamento: [
				'IM4_QuotaAmmortamentoAnnuale',
				'IM4_AmmortamentoNuovoCumulato',
				'IM4_AmmortamentoTotaleCumulato',
				'IM4_ResiduoCapexNuove',
				'IM4_Totali',
			],
			IM4_IperammortamentoPercAggiunta: [
				'IM4_IperammortamentoTotale',
				'IM4_IperammortamentoIper',
				'IM4_IperammortamentoAggiuntivo',
				'IM4_IperammortamentoCumulato',
			],
 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Immobilizzazioni materiali
		thisPageDefs = {
			II1_CapexNette: [
				'II1_IvaCredito',
				'II1_InvestimentiTotali',
				'II1_QuotaAmmortamentoAnnuale',
				'II1_AmmortamentoNuovoCumulato',
				'II1_AmmortamentoTotaleCumulato',
				'II1_ResiduoCapexNuove',
				'II1_Totali'
			],
			II1_IvaCreditoPerc: [
				'II1_IvaCredito',
				'II1_InvestimentiTotali'
			],
			II1_AnniAmmortamento: [
				'II1_QuotaAmmortamentoAnnuale',
				'II1_AmmortamentoNuovoCumulato',
				'II1_AmmortamentoTotaleCumulato',
				'II1_ResiduoCapexNuove',
				'II1_Totali'
			],

			II2_CapexNette: [
				'II2_IvaCredito',
				'II2_InvestimentiTotali',
				'II2_QuotaAmmortamentoAnnuale',
				'II2_AmmortamentoNuovoCumulato',
				'II2_AmmortamentoTotaleCumulato',
				'II2_ResiduoCapexNuove',
				'II2_Totali',
			],
			II2_IvaCreditoPerc: [
				'II2_IvaCredito',
				'II2_InvestimentiTotali',
			],
			II2_AnniAmmortamento: [
				'II2_QuotaAmmortamentoAnnuale',
				'II2_AmmortamentoNuovoCumulato',
				'II2_AmmortamentoTotaleCumulato',
				'II2_ResiduoCapexNuove',
				'II2_Totali',
			],

			II3_CapexNette: [
				'II3_IvaCredito',
				'II3_InvestimentiTotali',
				'II3_QuotaAmmortamentoAnnuale',
				'II3_AmmortamentoNuovoCumulato',
				'II3_AmmortamentoTotaleCumulato',
				'II3_ResiduoCapexNuove',
				'II3_Totali',
			],
			II3_IvaCreditoPerc: [
				'II3_IvaCredito',
				'II3_InvestimentiTotali',
			],
			II3_AnniAmmortamento: [
				'II3_QuotaAmmortamentoAnnuale',
				'II3_AmmortamentoNuovoCumulato',
				'II3_AmmortamentoTotaleCumulato',
				'II3_ResiduoCapexNuove',
				'II3_Totali',
			],

			II4_CapexNette: [
				'II4_IvaCredito',
				'II4_InvestimentiTotali',
				'II4_QuotaAmmortamentoAnnuale',
				'II4_AmmortamentoNuovoCumulato',
				'II4_AmmortamentoTotaleCumulato',
				'II4_ResiduoCapexNuove',
				'II4_Totali',
			],
			II4_IvaCreditoPerc: [
				'II4_IvaCredito',
				'II4_InvestimentiTotali',
			],
			II4_AnniAmmortamento: [
				'II4_QuotaAmmortamentoAnnuale',
				'II4_AmmortamentoNuovoCumulato',
				'II4_AmmortamentoTotaleCumulato',
				'II4_ResiduoCapexNuove',
				'II4_Totali',
			],

 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Immobilizzazioni finanziarie
		thisPageDefs = {
			IF1_Partecipazioni: [
				'IF1_PCommissioni',
				'IF1_CapexNette',
				'IF1_Immobilizzazioni',
			],
			IF1_PCommissioniPerc: [
				'IF1_PCommissioni',
				'IF1_CapexNette'
			],
			IF1_PSvalutazioni: [
				'IF1_Immobilizzazioni',
			],
			IF1_PDividendi: [
				'IF1_PTasse'
			],
			IF1_PTassePerc: [
				'IF1_PTasse'
			],
			IF1_TitoliNuovi: [
				'IF1_TNCommissioni',
				'IF1_TNInteressi',
				'IF1_TNTasse',
				'IF1_TNInteressiTotali',
				'IF1_Immobilizzazioni',
				'IF1_CapexNette'
			],
			IF1_TNCommissioniPerc: [
				'IF1_TNCommissioni',
				'IF1_CapexNette'
			],
			IF1_TNSvalutazioni: [
				'IF1_Immobilizzazioni',
			],
			IF1_TNInteressiPerc: [
				'IF1_TNInteressi'
			],
			IF1_TNTassePerc: [
				'IF1_TNTasse'
			],
			IF1_QuotePartecip: [
				'IF1_Immobilizzazioni',
			],

			IF2_Partecipazioni: [
				'IF2_PCommissioni',
				'IF2_CapexNette',
				'IF2_Immobilizzazioni',
			],
			IF2_PCommissioniPerc: [
				'IF2_PCommissioni',
				'IF2_CapexNette',
			],
			IF2_PSvalutazioni: [
				'IF2_Immobilizzazioni',
			],
			IF2_PDividendi: [
				'IF2_PTasse',
			],
			IF2_PTassePerc: [
				'IF2_PTasse',
			],
			IF2_TitoliNuovi: [
				'IF2_TNCommissioni',
				'IF2_TNInteressi',
				'IF2_TNTasse',
				'IF2_TNInteressiTotali',
				'IF2_Immobilizzazioni',
				'IF2_CapexNette',
			],
			IF2_TNCommissioniPerc: [
				'IF2_TNCommissioni',
				'IF2_CapexNette',
			],
			IF2_TNSvalutazioni: [
				'IF2_Immobilizzazioni',
			],
			IF2_TNInteressiPerc: [
				'IF2_TNInteressi',
			],
			IF2_TNTassePerc: [
				'IF2_TNTasse',
			],
			IF2_QuotePartecip: [
				'IF2_Immobilizzazioni',
			],

 		}
		$.extend( _Dependencies, thisPageDefs);


		// Pagina: Aumenti capitale
		thisPageDefs = {
			CapitaleSociale: [
				'TotaleCapitale'
			],
			Riserve: [
				'TotaleCapitale'
			]
 		}
		$.extend( _Dependencies, thisPageDefs);

		// Pagina: Finanziamenti
		thisPageDefs = {
			FinanziamentiBancari1: [
				'QCA_DebitoNuovoBreve1',
				'QCA_Totale1',
				'ResiduoDebitoNuovoMedio1',
				'InteressiAnnoDebitoNuovo1',
				'ResiduoTotaleMedio1',
			//	'InteressiTotaliAnno1',
			],
			TassoFinanziamenti1: [
				'InteressiAnnoDebitoNuovo1',
			//	'InteressiTotaliAnno1',
			],
			DurataFinanziamenti1: [
				'QCA_DebitoNuovoBreve1',
				'QCA_Totale1',
				'ResiduoDebitoNuovoMedio1',
				'InteressiAnnoDebitoNuovo1',
				'ResiduoTotaleMedio1',
			//	'InteressiTotaliAnno1',
			],

			FinanziamentiBancari2: [
				'QCA_DebitoNuovoBreve2',
				'QCA_Totale2',
				'ResiduoDebitoNuovoMedio2',
				'InteressiAnnoDebitoNuovo2',
				'ResiduoTotaleMedio2',
			//	'InteressiTotaliAnno2',
			],
			TassoFinanziamenti2: [
				'InteressiAnnoDebitoNuovo2',
			//	'InteressiTotaliAnno2',
			],
			DurataFinanziamenti2: [
				'QCA_DebitoNuovoBreve2',
				'QCA_Totale2',
				'ResiduoDebitoNuovoMedio2',
				'InteressiAnnoDebitoNuovo2',
				'ResiduoTotaleMedio2',
			//	'InteressiTotaliAnno2',
			],

			FinanziamentiBancari3: [
				'QCA_DebitoNuovoBreve3',
				'QCA_Totale3',
				'ResiduoDebitoNuovoMedio3',
				'InteressiAnnoDebitoNuovo3',
				'ResiduoTotaleMedio3',
			//	'InteressiTotaliAnno3',
			],
			TassoFinanziamenti3: [
				'InteressiAnnoDebitoNuovo3',
			//	'InteressiTotaliAnno3',
			],
			DurataFinanziamenti3: [
				'QCA_DebitoNuovoBreve3',
				'QCA_Totale3',
				'ResiduoDebitoNuovoMedio3',
				'InteressiAnnoDebitoNuovo3',
				'ResiduoTotaleMedio3',
			//	'InteressiTotaliAnno3',
			],

			FinanziamentiBancari4: [
				'QCA_DebitoNuovoBreve4',
				'QCA_Totale4',
				'ResiduoDebitoNuovoMedio4',
				'InteressiAnnoDebitoNuovo4',
				'ResiduoTotaleMedio4',
			//	'InteressiTotaliAnno4',
			],
			TassoFinanziamenti4: [
				'InteressiAnnoDebitoNuovo4',
			//	'InteressiTotaliAnno4',
			],
			DurataFinanziamenti4: [
				'QCA_DebitoNuovoBreve4',
				'QCA_Totale4',
				'ResiduoDebitoNuovoMedio4',
				'InteressiAnnoDebitoNuovo4',
				'ResiduoTotaleMedio4',
			//	'InteressiTotaliAnno4',
			]

 		}
		$.extend( _Dependencies, thisPageDefs);

		// Pagina: Gestione straordinaria
		thisPageDefs = {
			GS1_ProventiValore: [
				'GS1_IvaProventi',
				'GS1_ProventiTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS1_ProventiPercIva: [
				'GS1_IvaProventi',
				'GS1_ProventiTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS2_ProventiValore: [
				'GS2_IvaProventi',
				'GS2_ProventiTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS2_ProventiPercIva: [
				'GS2_IvaProventi',
				'GS2_ProventiTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS1_OneriValore: [
				'GS1_IvaOneri',
				'GS1_OneriTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS1_OneriPercIva: [
				'GS1_IvaOneri',
				'GS1_OneriTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS2_OneriValore: [
				'GS2_IvaOneri',
				'GS2_OneriTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
			GS2_OneriPercIva: [
				'GS2_IvaOneri',
				'GS2_OneriTotale',
				'GS_IvaTotale',
				'GS_TotaleNetto',
				'GS_TotaleLordo',
			],
		}
		$.extend( _Dependencies, thisPageDefs);

		// Pagina: Altro
		thisPageDefs = {
			AC_CreditiSoci : ['TotaleCrediti'],
			AC_CreditiAltri: ['TotaleCrediti'],
			AC_DebitiAltri : ['TotaleCrediti']
 		}
		$.extend( _Dependencies, thisPageDefs);


	}


	// FUNCTION: declareFormulaComplex
	//  Inizializza la matrice delle formule complesse
	// PARAMS:
	//  none
	// RETURN:
	//  none
	function declareFormulaComplex(){
	
		// ** Array delle formule complex in archivio **
		_FormulaComplex = {
			AmmortamentoAnnuale: [
				'((DS1_rX_c1>=1)? DS2_rX_c1 : 0)',
				'((DS1_rX_c1>=2)? DS2_rX_c1 : 0) + ((DS1_rX_c2>=1)? DS2_rX_c2 : 0)',
				'((DS1_rX_c1>=3)? DS2_rX_c1 : 0) + ((DS1_rX_c2>=2)? DS2_rX_c2 : 0) + ((DS1_rX_c3>=1)? DS2_rX_c3 : 0)',
				'((DS1_rX_c1>=4)? DS2_rX_c1 : 0) + ((DS1_rX_c2>=3)? DS2_rX_c2 : 0) + ((DS1_rX_c3>=2)? DS2_rX_c3 : 0) + ((DS1_rX_c4>=1)? DS2_rX_c4 : 0)',
				'((DS1_rX_c1>=5)? DS2_rX_c1 : 0) + ((DS1_rX_c2>=4)? DS2_rX_c2 : 0) + ((DS1_rX_c3>=3)? DS2_rX_c3 : 0) + ((DS1_rX_c4>=2)? DS2_rX_c4 : 0) + ((DS1_rX_c5>=1)? DS2_rX_c5 : 0)',
			],
			AmmortamentoCumulato: [
				'DS1_rX_c1',
				'DS1_rX_c1 + DS1_rX_c2',
				'DS1_rX_c1 + DS1_rX_c2 + DS1_rX_c3',
				'DS1_rX_c1 + DS1_rX_c2 + DS1_rX_c3 + DS1_rX_c4',
				'DS1_rX_c1 + DS1_rX_c2 + DS1_rX_c3 + DS1_rX_c4 + DS1_rX_c5',
			],
			QuotaCapitaleTotAnno: [
				'((DS1_rX_c1>1)? DS2_rX_c1 : 0)',
				'((DS1_rX_c1>2)? DS2_rX_c1 : 0) + ((DS1_rX_c2>1)? DS2_rX_c2 : 0)',
				'((DS1_rX_c1>3)? DS2_rX_c1 : 0) + ((DS1_rX_c2>2)? DS2_rX_c2 : 0) + ((DS1_rX_c3>1)? DS2_rX_c3 : 0)',
				'((DS1_rX_c1>4)? DS2_rX_c1 : 0) + ((DS1_rX_c2>3)? DS2_rX_c2 : 0) + ((DS1_rX_c3>2)? DS2_rX_c3 : 0) + ((DS1_rX_c4>1)? DS2_rX_c4 : 0)',
				'((DS1_rX_c1>5)? DS2_rX_c1 : 0) + ((DS1_rX_c2>4)? DS2_rX_c2 : 0) + ((DS1_rX_c3>3)? DS2_rX_c3 : 0) + ((DS1_rX_c4>2)? DS2_rX_c4 : 0) + ((DS1_rX_c5>1)? DS2_rX_c5 : 0)',
			],
			QuotaCapitaleBreve: [
				'((DS1_rX_c1>0)? DS2_rX_c1 : 0)',
				'((DS1_rX_c1>1)? DS2_rX_c1 : 0) + ((DS1_rX_c2>0)? DS2_rX_c2 : 0)',
				'((DS1_rX_c1>2)? DS2_rX_c1 : 0) + ((DS1_rX_c2>1)? DS2_rX_c2 : 0) + ((DS1_rX_c3>0)? DS2_rX_c3 : 0)',
				'((DS1_rX_c1>3)? DS2_rX_c1 : 0) + ((DS1_rX_c2>2)? DS2_rX_c2 : 0) + ((DS1_rX_c3>1)? DS2_rX_c3 : 0) + ((DS1_rX_c4>0)? DS2_rX_c4 : 0)',
				'((DS1_rX_c1>4)? DS2_rX_c1 : 0) + ((DS1_rX_c2>3)? DS2_rX_c2 : 0) + ((DS1_rX_c3>2)? DS2_rX_c3 : 0) + ((DS1_rX_c4>1)? DS2_rX_c4 : 0) + ((DS1_rX_c5>0)? DS2_rX_c5 : 0)',
			],
			ResiduoCapexNuove: [
						'0 + DS1_rX_c1 - DS2_rX_c1',
				'DS3_rX_c1 + DS1_rX_c2 - DS2_rX_c2',
				'DS3_rX_c2 + DS1_rX_c3 - DS2_rX_c3',
				'DS3_rX_c3 + DS1_rX_c4 - DS2_rX_c4',
				'DS3_rX_c4 + DS1_rX_c5 - DS2_rX_c5',
			],
			CumulativoInteressiAnnuali: [
			//	        '0 + DS1_rX_c1 + DS2_rX_c1',
			//	'DS3_rX_c1 + DS1_rX_c2 + DS2_rX_c2',
			//	'DS3_rX_c2 + DS1_rX_c3 + DS2_rX_c3',
			//	'DS3_rX_c3 + DS1_rX_c4 + DS2_rX_c4',
			//	'DS3_rX_c4 + DS1_rX_c5 + DS2_rX_c5',
						'0 + DS2_rX_c1',
				'DS2_rX_c1 + DS2_rX_c2',
				'DS2_rX_c2 + DS2_rX_c3',
				'DS2_rX_c3 + DS2_rX_c4',
				'DS2_rX_c4 + DS2_rX_c5',
			],
			ResiduoDebitoNuovo: [
				'((DS1_rX_c1>1)? DS2_rX_c1 - 2 * DS3_rX_c1 : 0)',
				'((DS1_rX_c1>2)? DS2_rX_c1 - 3 * DS3_rX_c1 : 0) + ((DS1_rX_c2>1)? DS2_rX_c2 - 2 * DS3_rX_c2 : 0)',
				'((DS1_rX_c1>3)? DS2_rX_c1 - 4 * DS3_rX_c1 : 0) + ((DS1_rX_c2>2)? DS2_rX_c2 - 3 * DS3_rX_c2 : 0) + ((DS1_rX_c3>1)? DS2_rX_c3 - 2 * DS3_rX_c3 : 0)',
				'((DS1_rX_c1>4)? DS2_rX_c1 - 5 * DS3_rX_c1 : 0) + ((DS1_rX_c2>3)? DS2_rX_c2 - 4 * DS3_rX_c2 : 0) + ((DS1_rX_c3>2)? DS2_rX_c3 - 3 * DS3_rX_c3 : 0) + ((DS1_rX_c4>1)? DS2_rX_c4 - 2 * DS3_rX_c4 : 0)',
				'((DS1_rX_c1>5)? DS2_rX_c1 - 6 * DS3_rX_c1 : 0) + ((DS1_rX_c2>4)? DS2_rX_c2 - 5 * DS3_rX_c2 : 0) + ((DS1_rX_c3>3)? DS2_rX_c3 - 4 * DS3_rX_c3 : 0) + ((DS1_rX_c4>2)? DS2_rX_c4 - 3 * DS3_rX_c4 : 0) + ((DS1_rX_c4>1)? DS2_rX_c5 - 2 * DS3_rX_c5 : 0)',
			],
		//	InteressiAnno: [
		//		'(DS1_rX_c1 - (DS2_rX_c1 * 1/2)) * DS3_rX_c1 / 100',
		//		'(DS1_rX_c1 - (DS2_rX_c1 * 3/2)) * DS3_rX_c2 / 100 + (DS1_rX_c2 - (DS2_rX_c2 * 1/2)) * DS3_rX_c2 / 100',
		//		'(DS1_rX_c1 - (DS2_rX_c1 * 5/2)) * DS3_rX_c3 / 100 + (DS1_rX_c2 - (DS2_rX_c2 * 3/2)) * DS3_rX_c3 / 100 + (DS1_rX_c3 - (DS2_rX_c3 * 1/2)) * DS3_rX_c3 / 100',
		//		'(DS1_rX_c1 - (DS2_rX_c1 * 7/2)) * DS3_rX_c4 / 100 + (DS1_rX_c2 - (DS2_rX_c2 * 5/2)) * DS3_rX_c4 / 100 + (DS1_rX_c3 - (DS2_rX_c3 * 3/2)) * DS3_rX_c4 / 100 + (DS1_rX_c4 - (DS2_rX_c4 * 1/2)) * DS3_rX_c4 / 100',
		//		'(DS1_rX_c1 - (DS2_rX_c1 * 9/2)) * DS3_rX_c5 / 100 + (DS1_rX_c2 - (DS2_rX_c2 * 7/2)) * DS3_rX_c5 / 100 + (DS1_rX_c3 - (DS2_rX_c3 * 5/2)) * DS3_rX_c5 / 100 + (DS1_rX_c4 - (DS2_rX_c4 * 3/2)) * DS3_rX_c5 / 100 + (DS1_rX_c5 - (DS2_rX_c5 * 1/2)) * DS3_rX_c5 / 100',
		//	],
			InteressiAnno: [
				'((DS4_rX_c1 >= 1)? (DS1_rX_c1 - (DS2_rX_c1 * 1/2)) * DS3_rX_c1 / 100 : 0)',
				'((DS4_rX_c1 >= 2)? (DS1_rX_c1 - (DS2_rX_c1 * 3/2)) * DS3_rX_c1 / 100 : 0) + ((DS4_rX_c2 >= 1)? (DS1_rX_c2 - (DS2_rX_c2 * 1/2)) * DS3_rX_c2 / 100 : 0)',
				'((DS4_rX_c1 >= 3)? (DS1_rX_c1 - (DS2_rX_c1 * 5/2)) * DS3_rX_c1 / 100 : 0) + ((DS4_rX_c2 >= 2)? (DS1_rX_c2 - (DS2_rX_c2 * 3/2)) * DS3_rX_c2 / 100 : 0) + ((DS4_rX_c3 >= 1)? (DS1_rX_c3 - (DS2_rX_c3 * 1/2)) * DS3_rX_c3 / 100 : 0)',
				'((DS4_rX_c1 >= 4)? (DS1_rX_c1 - (DS2_rX_c1 * 7/2)) * DS3_rX_c1 / 100 : 0) + ((DS4_rX_c2 >= 3)? (DS1_rX_c2 - (DS2_rX_c2 * 5/2)) * DS3_rX_c2 / 100 : 0) + ((DS4_rX_c3 >= 2)? (DS1_rX_c3 - (DS2_rX_c3 * 3/2)) * DS3_rX_c3 / 100 : 0) + ((DS4_rX_c4 >= 1)? (DS1_rX_c4 - (DS2_rX_c4 * 1/2)) * DS3_rX_c4 / 100 : 0)',
				'((DS4_rX_c1 >= 5)? (DS1_rX_c1 - (DS2_rX_c1 * 9/2)) * DS3_rX_c1 / 100 : 0) + ((DS4_rX_c2 >= 4)? (DS1_rX_c2 - (DS2_rX_c2 * 7/2)) * DS3_rX_c2 / 100 : 0) + ((DS4_rX_c3 >= 3)? (DS1_rX_c3 - (DS2_rX_c3 * 5/2)) * DS3_rX_c3 / 100 : 0) + ((DS4_rX_c4 >= 2)? (DS1_rX_c4 - (DS2_rX_c4 * 3/2)) * DS3_rX_c4 / 100 : 0) + ((DS4_rX_c5 >= 1)? (DS1_rX_c5 - (DS2_rX_c5/2)) * DS3_rX_c5 / 100 : 0)',
			],
			Immobilizzazioni: [
						'0 + DS2_rX_c1 + DS3_rX_c1 + DS4_rX_c1 + DS5_rX_c1 - DS6_rX_c1 - DS7_rX_c1 - DS8_rX_c1',
				'DS1_rX_c1 + DS2_rX_c2 + DS3_rX_c2 + DS4_rX_c2 + DS5_rX_c2 - DS6_rX_c2 - DS7_rX_c2 - DS8_rX_c2',
				'DS1_rX_c2 + DS2_rX_c3 + DS3_rX_c3 + DS4_rX_c3 + DS5_rX_c3 - DS6_rX_c3 - DS7_rX_c3 - DS8_rX_c3',
				'DS1_rX_c3 + DS2_rX_c4 + DS3_rX_c4 + DS4_rX_c4 + DS5_rX_c4 - DS6_rX_c4 - DS7_rX_c4 - DS8_rX_c4',
				'DS1_rX_c4 + DS2_rX_c5 + DS3_rX_c5 + DS4_rX_c5 + DS5_rX_c5 - DS6_rX_c5 - DS7_rX_c5 - DS8_rX_c5',
			],
		}

	}


	// FUNCTION: getDependencies
	//  Restituisce l'elenco dei dataset (formula) dipendenti dal dataset specificato
	// PARAMS:
	//	name : Nome del dataset
	// RETURN:
	//  dsList : Elenco dataset (stringa)
	function getDependencies(params) {

		var dataset = params.dataset;
		var dList   = _Dependencies[dataset];

		return (dList == null)? '' : dList;										// Se il risultato è indefinito, restituisce stringa vuota
	}


	// FUNCTION: getFormulaComplex
	//  Restituisce la struttura della formula complessa specificata
	// PARAMS:
	//	name : Nome della formula
	// RETURN:
	//  arrayFormule : array delle formule generiche da calcolare per ogni anno
	function getFormulaComplex(params) {

		var name    = params.name;
		var formula = _FormulaComplex[name];

		return (formula == null)? '' : formula;									// Se il risultato è indefinito, restituisce stringa vuota
	}

});

