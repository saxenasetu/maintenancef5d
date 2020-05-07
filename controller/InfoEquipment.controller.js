sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.InfoEquipment", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
	
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "InfoEquipment") {
				this._resetModel();
				this._resetViewModel();
			}
		},
		
		backToHome: function () {
			this._resetViewModel();
			this.getRouter().navTo("Home");
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"title": "001",
			    	"text": "Tube qui fuit",
			    	"date": "21/10/2019",
			    	"equipement": "Trousse de réparation",
			    	"status": "Faible",
			    	"category": "Catégorie 1",
			    	"famille": "Type/famille 1",
			    	"location": "Localisation 1",
			    	"sector": "Secteur d'expl 1",
			    	"cordinator": "Poste de w (+ coordonnées) 1",
			    	"critical": "Criticité 1",
			    	"postTech": "Poste technique 1",
			    	"garantie": "Garantie 1",
			    	"mesure": "Point de mesure 1"
				},
				{
					"title": "002",
					"text": "Verre brisé",
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne",
					"category": "Catégorie 2",
			    	"famille": "Type/famille 2",
			    	"location": "Localisation 2",
			    	"sector": "Secteur d'expl 2",
			    	"cordinator": "Poste de w (+ coordonnées) 2",
			    	"critical": "Criticité 2",
			    	"postTech": "Poste technique 2",
			    	"garantie": "Garantie 2",
			    	"mesure": "Point de mesure 2"
				},
				{
					"title": "003",
					"text": "Plateau cassé",
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure",
	    			"category": "Catégorie 3",
			    	"famille": "Type/famille 3",
			    	"location": "Localisation 3",
			    	"sector": "Secteur d'expl 3",
			    	"cordinator": "Poste de w (+ coordonnées) 3",
			    	"critical": "Criticité 3",
			    	"postTech": "Poste technique 3",
			    	"garantie": "Garantie 3",
			    	"mesure": "Point de mesure 3"
				},
				{
					"title": "004",
					"text": "Pas de chauffage",
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible",
	    			"category": "Catégorie 4",
			    	"famille": "Type/famille 4",
			    	"location": "Localisation 4",
			    	"sector": "Secteur d'expl 4",
			    	"cordinator": "Poste de w (+ coordonnées) 4",
			    	"critical": "Criticité 4",
			    	"postTech": "Poste technique 4",
			    	"garantie": "Garantie 4",
			    	"mesure": "Point de mesure 4"
				},
				{
					"title": "005",
			    	"text": "Casier cassé",
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure",
    				"category": "Catégorie 5",
			    	"famille": "Type/famille 5",
			    	"location": "Localisation 5",
			    	"sector": "Secteur d'expl 5",
			    	"cordinator": "Poste de w (+ coordonnées) 5",
			    	"critical": "Criticité 5",
			    	"postTech": "Poste technique 5",
			    	"garantie": "Garantie 5",
			    	"mesure": "Point de mesure 5"
				}
			];
		//	util.aEquipment = aElements;
			this.infoEquipmentModel(aElements);
		},
		
		onSuggest: function (event) {
			this._resetModel();
			var value = event.getParameter("suggestValue"),
				filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("title", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("equipement", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}
			this.getView().byId("searchField").getBinding("suggestionItems").filter(filters);
			this.getView().byId("searchField").suggest();
		},
		
		onSearch: function (event) {
			util.aEquipment = [];
			var sValue = this.getView().byId("searchField").getValue();
			
			for(var i = 0; i < this.getView().getModel("infoEquipmentModel").getData().length; i++) {
				if(sValue === this.getView().getModel("infoEquipmentModel").getData()[i].equipement) {
					util.aEquipment = this.getView().getModel("infoEquipmentModel").getData()[i];
					break;
				}
			}
			this.equipmentViewModel(util.aEquipment);
			if(sValue.length > 0) {
				this.getView().byId("equipmentInputs").setVisible(true);
				this.getView().byId("nomenclature").setEnabled(true);
				if(util.sCustomer !== "R") {
					this.getView().byId("avisRattache").setEnabled(true);
				} else {
					this.getView().byId("avisRattache").setEnabled(false);
				}
				this.getView().byId("otRattache").setEnabled(true);
				
			} else {
				this.getView().byId("equipmentInputs").setVisible(false);
				this.getView().byId("nomenclature").setEnabled(false);
				this.getView().byId("avisRattache").setEnabled(false);
				this.getView().byId("otRattache").setEnabled(false);
			}
		},
		
		onPressBarcode: function () {
			cordova.plugins.barcodeScanner.scan(successCallback, errorCallback);
			
			function successCallback() {
				
			}
			
			function errorCallback() {
				
			}
		},
		
		onPressNavToRattaches: function (oEvent) {
			/* eslint-disable */
			util.sRattachesButtonText = oEvent.getSource().sId;
			this._resetViewModel();
			this.getRouter().navTo("Rattaches");
			/* eslint-enable */
		},
		
		onPressNavToInfoStock: function () {
			this._resetViewModel();
			this.getRouter().navTo("InfoStock");
		},
		
		onPressNavToDocumentTech: function () {
			this._resetViewModel();
			this.getRouter().navTo("DocumentTech");
		},
		
		_resetViewModel: function () {
		//	this.equipmentViewModel([]);
			this.getView().byId("searchField").clear();
		}

	});

});