sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.Avis.Detail", {
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
				this._resetModel();
			//	this.getView().byId("finalText").setText(sPath);
			//	this.getView().byId("detail").setText(sTile);
			
			//	this.setTitle(sTile);
				util.sTitleText = sTile;
				this.setTitle();
			} 
		},
		
		onAfterRendering: function () {
			this._setColors();	
		},
		
		onPressRefresh: function () {
			this.getView().byId("detailList").setBusy(true);
			this._resetModel();
			this.getView().byId("detailList").setBusy(false);
		},
		
		_resetModel: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			this.getView().byId("detailList").setBusy(true);
			oModel.read("NotificationHeaderSet?$expand=Items",
				null, null,
				false,
				function (oData) {
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						util.aElements = oData.results;
						that.listModel(oData.results);
						console.log("oData:", oData);
						that._setColors();
						that.getView().byId("detailList").setBusy(false);
				//		that.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("NotificationNumber", false, false));

					} else {
						alert("Empty NotificationHeaderSet odata!");
						that.getView().byId("detailList").setBusy(false);
					}
				},
				function (oData) {
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				that.getView().byId("detailList").setBusy(false);
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}
			);
			
		/*	var aElements = [
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
			this.listModel(aElements);*/
		},
		
		_setColors: function () {
			var that = this,
				aUpdateables = [];
			if(that.getView().getModel("listModel") && that.getView().getModel("listModel").getData()) {
				var aDetailList = this.getView().byId("detailList").getItems();
				for(var i = 0; i < aDetailList.length; i++){
						aDetailList[i].getContent()[0].getItems()[0].removeStyleClass("darkrRedCell");
						aDetailList[i].getContent()[0].getItems()[0].removeStyleClass("redCell");
						aDetailList[i].getContent()[0].getItems()[0].removeStyleClass("orangeCell");
						aDetailList[i].getContent()[0].getItems()[0].removeStyleClass("yellowCell");
				}
				for(var i = 0; i < aDetailList.length; i++) {
					// if(aDetailList[i].MaintPlant !== "") {
					// 	aUpdateables.push(aDetailList[i].getTitle().split("N° avis ")[1]);
					// }
					if(aDetailList[i].getContent()[0].getItems()[0].getItems()[0].getText() === "+") {
						aDetailList[i].getContent()[0].getItems()[0].addStyleClass("darkrRedCell");
					} else if(aDetailList[i].getContent()[0].getItems()[0].getItems()[0].getText() === "A") {
						aDetailList[i].getContent()[0].getItems()[0].addStyleClass("redCell");
					} else if(aDetailList[i].getContent()[0].getItems()[0].getItems()[0].getText() === "B") {
						aDetailList[i].getContent()[0].getItems()[0].addStyleClass("orangeCell");
					} else if(aDetailList[i].getContent()[0].getItems()[0].getItems()[0].getText() === "C") {
						aDetailList[i].getContent()[0].getItems()[0].addStyleClass("yellowCell");
					} else {
						
					}
				}
			}
		},
		
		backToHome: function () {
			this._resetDatas();
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this._resetDatas();
			this.getRouter().navTo("Home");
		},
		
		onPressNavToAvisDetail: function (oEvent) {
			var sPath = oEvent.getSource().oBindingContexts.listModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			util.aDetailAvis = this.getView().byId("detailList").getModel("listModel").getData()[sPath];
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			oModel.read("NotificationHeaderSet('" + this.getView().byId("detailList").getModel("listModel").getData()[sPath].NotificationNumber + "')",
				null, 
				null,
				false,
				function (oData) {
					console.log("oData:", oData);
					that.getRouter().navTo("AvisDetail");
				},
				function (oData) {
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}
			);
		//	util.aDetailAvis = this.getView().byId("detailList").getModel("listModel").getData()[sPath];
		//	console.log("util.aDetailAvis:", util.aDetailAvis);
		},
		
/*		onPressNavToAvisDetail: function (oEvent) {
			var sPath = oEvent.getSource().oBindingContexts.listModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			util.aDetailAvis = this.getView().byId("detailList").getModel("listModel").getData()[sPath];
			console.log("util.aDetailAvis:", util.aDetailAvis);
			this.getRouter().navTo("AvisDetail");
		},  */
		
		onPressAdd: function () {
			util.aDetailAvis = [];
			this.getRouter().navTo("AvisDetail");
		},
		
		_resetDatas: function () {
			util.sSelectedTile = "";
			this._resetIcons();
		},
		
		onOpenSearchDialog: function (evt) {
			var type = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.search", this);
			this.getView().addDependent(type);
			this._resetModel();
			type.open();
		},
		
		onPressAccept: function () {
			var core = sap.ui.getCore(),
				sKey = core.byId("searchField").getSuggestionItems()[0].getText(),
				oElement = {};
			if(util.aFilteredAvis.length > 0) {
			//	this._resetModel();
				this.listModel(util.aFilteredAvis);
			} else {
				for(var i = 0; i < this.getModel("listModel").getData().length; i++) {
					if(sKey === this.getModel("listModel").getData()[i].NotificationNumber) {
						oElement = this.getModel("listModel").getData()[i];
						break;
					}
				}	
				this.listModel([oElement]);
			}
			this.onPressClose();
			this._setColors();	
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
				// var aDateElements = that.getView().byId("table").getColumns()[7].getFilterValue().split("/"),
				// 	sDay = aDateElements[0],
				// 	sMonth = aDateElements[1],
				// 	sYear = aDateElements[2];
				// var dSelected = new Date(sMonth + "/" + sDay + "/" + sYear);

				// dSelected.setHours(dSelected.getHours() + 2);
				// dSelected = dSelected.getTime();
				// new sap.ui.model.Filter("DueDate", "EQ", dSelected));
				
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("NotificationNumber", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("ShortText", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
					//	new sap.ui.model.Filter("NotificationDate", "EQ", value),
						new sap.ui.model.Filter("TechnicalObjectNumber", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("Effect", function(sDes) {
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
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("ABCIndicator", bStatus, false));
			this._setColors();
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
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("NotificationDate", bStatus, false));
			this._setColors();
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
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("Effect", bStatus, false));
			this._setColors();
		},
		
		_resetIcons: function () {
			this.getView().byId("date").setIcon("");
			this.getView().byId("critical").setIcon("");
			this.getView().byId("repercussion").setIcon("");
		}

		/*eslint-enable*/
	});

});