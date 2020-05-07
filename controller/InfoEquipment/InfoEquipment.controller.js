sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/Popover",
	"sap/m/VBox",
	"sap/m/Button",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, Popover, VBox, Button, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.InfoEquipment.InfoEquipment", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
	
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "InfoEquipment") {
				this._resetModel();
				this._resetViewModel();
				var sTile = this.getView().getModel("i18n").getResourceBundle().getText("infoEquipmentTitle");
				util.sTitleText = sTile;
				this.setTitle();
				this.getView().byId("searchField").setEnableSuggestions(false);
			}
		},
		
		backToHome: function () {
			this._resetViewModel();
			this.getRouter().navTo("Home");
		},
		
		_resetModel: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["EAM_OBJPG_TECHNICALOBJECT_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, false),
				that = this;
			this.getView().byId("searchField").setBusy(true);
			oModel.read("C_ObjPgTechnicalObject?sap-language='FR'",
				null, null,
				false,
				function (oData) {
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						util.aEquipment = oData.results;
						that.infoEquipmentModel(oData.results);
						that.getView().byId("searchField").setBusy(false);
					} else {
						alert("Empty C_ObjPgTechnicalObject odata!");
					}
				},
				function () {
					alert("C_ObjPgTechnicalObject service fail");
				}
			);
			
			/*var aElements = [
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
			this.infoEquipmentModel(aElements);*/
		},
		
		onChange: function (oEvent) {
			if(this.getView().byId("searchField").getValue().length >= 3) {
				this.getView().byId("searchField").setEnableSuggestions(true);
			}
		},
		
		onSuggest: function (oEvent) {
			this._resetModel();
			var value = oEvent.getParameter("suggestValue"),
				filters = [];
			if (value && value.length >= 3) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("TechnicalObjectLabel", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("TechnicalObjectDescription", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
				this.getView().byId("searchField").getBinding("suggestionItems").filter(filters);
				this.getView().byId("searchField").suggest();
			}
		},
		
		onSearch: function (oEvent) {
			util.aEquipment = [];
			var core = sap.ui.getCore(),
				sValue = this.getView().byId("searchField").getValue();
			if(sValue && sValue.length >= 3) {
				for(var i = 0; i < this.getView().getModel("infoEquipmentModel").getData().length; i++) {
					if(sValue === this.getView().getModel("infoEquipmentModel").getData()[i].TechnicalObjectLabel) {
						util.aEquipment = this.getView().getModel("infoEquipmentModel").getData()[i];
						break;
					}
				}
				this.equipmentViewModel(util.aEquipment);
				if(sValue) {
					this._createPopover(oEvent);
					this.getView().byId("equipmentInputs").setVisible(true);
					this.getView().byId("actions").setEnabled(true);
					core.byId("nomenclature").setEnabled(true);
					if(util.sCustomer !== "R") {
						core.byId("avisRattache").setEnabled(true);
					} else {
						core.byId("avisRattache").setEnabled(false);
					}
					core.byId("otRattache").setEnabled(true);
				} else {
					this.getView().byId("equipmentInputs").setVisible(false);
					this.getView().byId("actions").setEnabled(false);
					if(core.byId("nomenclature") && core.byId("avisRattache") && core.byId("otRattache")) {
						core.byId("nomenclature").setEnabled(false);
						core.byId("avisRattache").setEnabled(false);
						core.byId("otRattache").setEnabled(false);
					}
				}
			}	
		},
		
		onPressBarcode: function () {
			jQuery.sap.require("sap.ndc.BarcodeScanner");
			var that = this;
			sap.ndc.BarcodeScanner.scan(
				function (mResult) {
					if(mResult.text) {
						that.getView().byId("searchField").setValue(mResult.text);
					}
				},
				function (Error) {
					alert("Scanning failed: " + Error);
				}
			);
		},
		
		onPressNavToRattaches: function (oEvent) {
			/* eslint-disable */
		//	this._resetViewModel();
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
		},
		
		_createPopover: function (oEvent) {
			var that = this,
				core = sap.ui.getCore(),
				oView = this.getView(),
				sTitleButton1 = oView.getModel("i18n").getResourceBundle().getText("infoEquipmentButton1"),
				sTitleButton2 = oView.getModel("i18n").getResourceBundle().getText("infoEquipmentButton2"),
				sTitleButton3 = oView.getModel("i18n").getResourceBundle().getText("infoEquipmentButton3");

			if (!core.byId("createPopup")) {
				new Popover("createPopup", {
					contentWidth: "100%",
					horizontalScrolling: true,
					modal: false,
					offsetX: 0,
					offsetY: 0,
					placement: "Top",
					showHeader: false,
					title: "Actions",
					verticalScrolling: true,
					visible: true,
					content: [
						new VBox({
							items:[
								new Button("avisRattache", {
									width: "100%",
									text: sTitleButton1,
									press: function (oEvent) {
										util.sRattachesButtonText = oEvent.getSource().sId;
										that.onPressNavToRattaches();
									}
								}).addStyleClass("customPopoverBtn"),
								new Button("otRattache", {
									width: "100%",
									text: sTitleButton2,
									press: function (oEvent) {
										util.sRattachesButtonText = oEvent.getSource().sId;
										that.onPressNavToRattaches();
									}
								}).addStyleClass("customPopoverBtn"),
								new Button("nomenclature", {
									width: "100%",
									text: sTitleButton3,
									press: function (oEvent) {
										that.onPressNavToInfoStock();
									}
								}).addStyleClass("customPopoverBtn")
							]
						})	
					]
				});
			}
		},
		
		onPressActions: function (oEvent) {
			this._createPopover(oEvent);
			var core = sap.ui.getCore();
			core.byId("createPopup").openBy(oEvent.getSource());
		}

	});

});