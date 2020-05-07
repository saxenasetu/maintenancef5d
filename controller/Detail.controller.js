sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.Detail", {
		/*eslint-disable*/
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Detail") {
				var sInput = util.sSelectedTile.split("--")[1],
					sPath = "",
					sTile = "";
				sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisTitle");	
	/*			switch(sInput) {
					case "errorFirst":
						sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisFirstTile");
				    	sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisFirstTile");
				    	break;
			    	case "errorSecond":
				    	sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisSecondTile");
				    	sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisSecondTile");
				    	break;
			    	case "errorThird":
    		    		sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisThirdTile");
			    	 	sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisThirdTile");
				    	break;	
					case "errorFourth":
				    	sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisFourthTile");
			    		sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisFourthTile");
				}*/
				
				this._resetModel();
			//	this.getView().byId("finalText").setText(sPath);
				this.getView().byId("detail").setTitle(sTile);
			}
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"title": "N° avis 0001",
			    	"text": "Tube qui fuit",
			    	"date": "21/10/2019",
			    	"equipement": "Trousse de réparation",
			    	"status": "Faible"
				},
				{
					"title": "N° avis 0002",
					"text": "Verre brisé",
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne"
				},
				{
					"title": "N° avis 0003",
					"text": "Plateau cassé",
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure"
				},
				{
					"title": "N° avis 0004",
					"text": "Pas de chauffage",
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible"
				},
				{
					"title": "N° avis 0005",
			    	"text": "Casier cassé",
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure"
				}
			];
			util.aElements = aElements;
			this.listModel(aElements);
		},
		
		backToHome: function () {
			this._resetDatas();
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this._resetDatas();
		//	this.getRouter().navTo("Avis");
			this.getRouter().navTo("Home");
		},
		
		onPressNavToAvisDetail: function (oEvent) {
			var sPath = oEvent.getSource().oBindingContexts.listModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			util.aDetailAvis = this.getView().byId("detailList").getModel("listModel").getData()[sPath];
			this.getRouter().navTo("AvisDetail");
		},
		
		_resetDatas: function () {
			util.sSelectedTile = "";
			this._resetIcons();
		},
		
		onOpenSearchDialog: function (evt) {
			var type = sap.ui.xmlfragment("com.eramet.depanneur.HATDepanneurApp.view.fragment.search", this);
			this.getView().addDependent(type);
			this._resetModel();
			type.open();
		},
		
		onPressAccept: function () {
			var core = sap.ui.getCore(),
				sKey = core.byId("searchField").getSuggestionItems()[0].getText(),
				oElement = {};
			if(util.aFilteredAvis.length > 0) {
				this._resetModel();
				this.listModel(util.aFilteredAvis);
			} else {
				for(var i = 0; i < this.getModel("listModel").getData().length; i++) {
					if(sKey === this.getModel("listModel").getData()[i].title) {
						oElement = this.getModel("listModel").getData()[i];
						break;
					}
				}	
				this.listModel([oElement]);
			}
			this.onPressClose();
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("searchDialog").close();
			core.byId("searchDialog").destroy();
		},
		
		onSuggest: function (event) {
			var value = event.getParameter("suggestValue"),
				filters = [],
				core = sap.ui.getCore();
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("title", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("text", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("date", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("equipement", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("status", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}
			core.byId("searchField").getBinding("suggestionItems").filter(filters);
			core.byId("searchField").suggest();
		},
		
		onSearch: function (event) {
			var core = sap.ui.getCore();
			util.aFilteredAvis = [];
			var oItem = event.getParameter("suggestionItem");
			if(oItem === undefined) {
				if(core.byId("searchField").mBindingInfos && core.byId("searchField").mBindingInfos.suggestionItems && 
				core.byId("searchField").mBindingInfos.suggestionItems.binding && core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices &&
				core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length > 0) {
					var aElements = [],
						listModel = this.getModel("listModel").getData();
					for(var i = 0; 	i < core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length; i++) {
						aElements.push(listModel[core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices[i]]);
					}
					util.aFilteredAvis = aElements;
				}
			}
		},
		
		onPressCriticality: function () {
			var bStatus = "";
			if(this.getView().byId("critical").getIcon !== "") {
				if(this.getView().byId("critical").getIcon() === "sap-icon://up") {
					this.getView().byId("critical").setIcon("sap-icon://down");
					bStatus = true;
				} else {
					this.getView().byId("critical").setIcon("sap-icon://up");
					bStatus = false;
				}
			} else {
				this.getView().byId("critical").setIcon("sap-icon://up");
				bStatus = false;
			}
			this.getView().byId("date").setIcon("");
			this.getView().byId("repercussion").setIcon("");
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("status", bStatus, false));
		},
		
		onPressDate: function () {
			var bStatus = "";
			if(this.getView().byId("date").getIcon !== "") {
				if(this.getView().byId("date").getIcon() === "sap-icon://up") {
					this.getView().byId("date").setIcon("sap-icon://down");
					bStatus = true;
				} else {
					this.getView().byId("date").setIcon("sap-icon://up");
					bStatus = false;
				}
			} else {
				this.getView().byId("date").setIcon("sap-icon://up");
				bStatus = false;
			}
			this.getView().byId("critical").setIcon("");
			this.getView().byId("repercussion").setIcon("");
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("date", bStatus, false));
		},
		
		onPressRepercussion: function () {
			var bStatus = "";
			if(this.getView().byId("repercussion").getIcon !== "") {
				if(this.getView().byId("repercussion").getIcon() === "sap-icon://up") {
					this.getView().byId("repercussion").setIcon("sap-icon://down");
					bStatus = true;
				} else {
					this.getView().byId("repercussion").setIcon("sap-icon://up");
					bStatus = false;
				}
			} else {
				this.getView().byId("repercussion").setIcon("sap-icon://up");
				bStatus = false;
			}
			this.getView().byId("date").setIcon("");
			this.getView().byId("critical").setIcon("");
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("equipement", bStatus, false));
		},
		
		_resetIcons: function () {
			this.getView().byId("date").setIcon("");
			this.getView().byId("critical").setIcon("");
			this.getView().byId("repercussion").setIcon("");
		}

		/*eslint-enable*/
	});

});