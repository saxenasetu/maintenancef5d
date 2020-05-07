jQuery.sap.declare("com.eramet.maintenanceF5D.util.util");

com.eramet.maintenanceF5D.util.util = {	
	
	sTitleText: "",				/** This is the current title of the page*/
	sSelectedTile: "",			/**	This is the selected tile */
	aElements: [],				/**	This is the listModel (in Detail.view)*/
	aOTElements: [],			/**	This is the followupListModel (in Followup.view)*/
	oSelectedOT: "",			/** Selected OT element (in Folloup.view) */
	aTreeElements: [],			/**	This is the treeModel (in Operations.view)*/
	aCreatedOT: "",				/** This is the converted avis element for the navigation (for Operation.view)*/
	sOperationName: "",			/** This is the selected opeation line (in ToOpDetail.view)*/
	aFilteredAvis: [],			/** This is the filtered Avis list (in Detail.view)*/
	aFilteredOT: [],			/** This is the filtered OT list (in Followup.view)*/	
	aDetailAvis: [],			/**	This is the selected list item from Detail.view (in AvisDetail.view)*/
	avisDetailOriginal: [],		/**	This is the original avis detail data from the backend (in AvisDetail.view)*/
	aEquipment: [],				/** This is the filtered equipment list (in InfoEquipment.view)*/
	sRattachesButtonText: "",	/**	This is the text of the navigation button (in Rattaches.view)*/
	sCustomer: "",				/**	This is the selected type of the customer (in Home.view)*/
	aDocument: [],				/**	This is the selected document element (in DocumentTech.view)*/
	oSelectedOTFull: [],		/** Selected OT element with all properties (in Folloup.view) */
	aArticles: [],				/** This is the articleModel (in Article.view) */
	otFilters: [],				/** This object contains the selected filters (in Filter.view and Followup.view)*/
	bNavFromArticle: false		/** This is the default value for the InfoStock's Réserver button*/
};