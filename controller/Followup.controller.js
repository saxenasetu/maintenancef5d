sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"	
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.Followup", {
		/*eslint-disable*/
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Followup") {
				this._resetModel();
				this.getView().byId("prio").setSelectedKey("");
				this.getView().byId("type").setSelectedKey("");
				this.getView().byId("type").setEnabled(true);
				if(util.sCustomer === "R") {
					this.getView().byId("prio").setSelectedKey("3");
					this.getView().byId("type").setSelectedKey("2");
					this.getView().byId("type").setEnabled(false);
					this.onSelectItem();
				} else if(util.sCustomer === "D") {
					this.getView().byId("type").setSelectedKey("1");
					this.onSelectItem();
				}
			}
		},
		
		backToHome: function () {
			this._resetDatas();
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this._resetDatas();
			this.getRouter().navTo("WorkPage");
		},
		
		onPressNavToOTDetail: function (oEvent) {
			this._resetDatas();
			var sId = oEvent.getSource().oBindingContexts.followupListModel.sPath.split("/")[1],
				followupListModel = this.getModel("followupListModel").getData();
			util.oSelectedOT = followupListModel[sId].title.split("N° ")[1];
			util.oSelectedOTFull = followupListModel[sId];
		//	this.getRouter().navTo("OTDetail");
			this.getRouter().navTo("Operations");
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"title": "N° OT 0000001",
			    	"text": "Tube qui fuit",
			    	"date": "21/10/2019",
			    	"equipement": "Trousse de réparation",
			    	"status": "Faible",
			    	"prio":	"Prio 1",
			    	"codePoste": "code poste technique 1",
			    	"description": "Description courte 1",
			    	"type": "Correctif"
				},
				{
					"title": "N° OT 0000002",
					"text": "Verre brisé",
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne",
			    	"prio":	"Prio 3",
			    	"codePoste": "code poste technique 2",
			    	"description": "Description courte 2",
			    	"type": "Préventif"
				},
				{
					"title": "N° OT 0000003",
					"text": "Plateau cassé",
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure",
			    	"prio":	"Prio 3",
			    	"codePoste": "code poste technique 3",
			    	"description": "Description courte 3",
			    	"type": "Correctif"
				},
				{
					"title": "N° OT 0000004",
					"text": "Pas de chauffage",
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible",
			    	"prio":	"Prio 2",
			    	"codePoste": "code poste technique 4",
			    	"description": "Description courte 4",
			    	"type": "Préventif"
				},
				{
					"title": "N° OT 0000005",
			    	"text": "Casier cassé",
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure",
			    	"prio":	"Prio 1",
			    	"codePoste": "code poste technique 5",
			    	"description": "Description courte 5",
			    	"type": "Correctif"
				}
			];
			util.aOTElements = aElements;
			this.followupListModel(aElements);
		},

		onOpenOTSearchDialog: function (evt) {
			var type = sap.ui.xmlfragment("com.eramet.depanneur.HATDepanneurApp.view.fragment.searchOT", this);
			this.getView().addDependent(type);
			this._resetModel();
			type.open();
		},
		
		onPressAccept: function () {
			var core = sap.ui.getCore(),
				sKey = core.byId("searchField").getSuggestionItems()[0].getText(),
				oElement = {};
			if(util.aFilteredOT.length > 0) {
				this._resetModel();
				this.followupListModel(util.aFilteredOT);
			} else {
				for(var i = 0; i < this.getModel("followupListModel").getData().length; i++) {
					if(sKey === this.getModel("followupListModel").getData()[i].title) {
						oElement = this.getModel("followupListModel").getData()[i];
						break;
					}
				}	
				this.followupListModel([oElement]);
			}
			this.onPressClose();
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("searchOTDialog").close();
			core.byId("searchOTDialog").destroy();
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
						new sap.ui.model.Filter("date", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("status", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("prio", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("text", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("codePoste", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("description", function(sDes) {
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
			util.aFilteredOT = [];
			var oItem = event.getParameter("suggestionItem");
			if(oItem === undefined) {
				if(core.byId("searchField").mBindingInfos && core.byId("searchField").mBindingInfos.suggestionItems && 
				core.byId("searchField").mBindingInfos.suggestionItems.binding && core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices &&
				core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length > 0) {
					var aElements = [],
						followupListModel = this.getModel("followupListModel").getData();
					for(var i = 0; 	i < core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices.length; i++) {
						aElements.push(followupListModel[core.byId("searchField").mBindingInfos.suggestionItems.binding.aIndices[i]]);
					}
					util.aFilteredOT = aElements;
				}
			}
		},
		
		_resetDatas: function () {
			this._resetIcons();
		},
		
		_resetIcons: function () {
			this.getView().byId("date").setIcon("");
			this.getView().byId("prio").setIcon("");
			this.getView().byId("statut").setIcon("");
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
		//	this.getView().byId("prio").setIcon("");
			this.getView().byId("statut").setIcon("");
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("date", bStatus, false));
		},
		
		onSelectItem: function () {
/*			var bStatus = "";
			if(this.getView().byId("prio").getIcon !== "") {
				if(this.getView().byId("prio").getIcon() === "sap-icon://up") {
					this.getView().byId("prio").setIcon("sap-icon://down");
					bStatus = true;
				} else {
					this.getView().byId("prio").setIcon("sap-icon://up");
					bStatus = false;
				}
			} else {
				this.getView().byId("prio").setIcon("sap-icon://up");
				bStatus = false;
			}
			this.getView().byId("date").setIcon("");
			this.getView().byId("statut").setIcon("");
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("prio", bStatus, false));*/
			
			var aFilters = [],
				sItemPrio = this.getView().byId("prio").getSelectedItem() ? this.getView().byId("prio").getSelectedItem().getText() : "",
				sItemType = this.getView().byId("type").getSelectedItem() ? this.getView().byId("type").getSelectedItem().getText() : "";
				
			if(sItemType === this.getView().getModel("i18n").getResourceBundle().getText("followupType3")) {
				sItemType = "";
			}
			
			console.log("sItemPrio: ", sItemPrio, "sItemType: ", sItemType);
			aFilters = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("prio", sap.ui.model.FilterOperator.Contains, sItemPrio),
					new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.Contains, sItemType)
				],
				and: true
			});
			console.log("aFilters: ", aFilters);
			this.getView().byId("followupList").getBinding("items").filter(aFilters);
		},
		
		onPressStaut: function () {
			var bStatus = "";
			if(this.getView().byId("statut").getIcon !== "") {
				if(this.getView().byId("statut").getIcon() === "sap-icon://up") {
					this.getView().byId("statut").setIcon("sap-icon://down");
					bStatus = true;
				} else {
					this.getView().byId("statut").setIcon("sap-icon://up");
					bStatus = false;
				}
			} else {
				this.getView().byId("statut").setIcon("sap-icon://up");
				bStatus = false;
			}
			this.getView().byId("date").setIcon("");
		//	this.getView().byId("prio").setIcon("");
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("status", bStatus, false));
		}
		/*eslint-enable*/
	});

});