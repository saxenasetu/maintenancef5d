sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, MessageBox) { 
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.Followup", {
		/*eslint-disable*/
		bIsDFirstVisit: true,
		bIsTFirstVisit: true,
		aGlobalFilters: [], 
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Followup") {
				this.registerNavFrom(this);
				this._resetModel();
				var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("followupTitle");
				util.sTitleText = sTitle;
				this.setTitle();
				this.getView().byId("type").setSelectedKey("");
				this.getView().byId("type").setEnabled(true);
				if(this.getView().getModel("followupListModel") && this.getView().getModel("followupListModel").getData() && 
				this.getView().getModel("followupListModel").getData().length > 0) {
					if(util.sCustomer === "R") {
						this._setFilters(false, false, true, 0, 4);
						this.getView().byId("type").setSelectedKey("ZM03");
						this.getView().byId("type").setEnabled(false);
						this.onSelectItem();
					} else if(util.sCustomer === "D") {
						if(this.bIsDFirstVisit) {
							this.bIsDFirstVisit = false;
							this._deleteFilters();
							this.getView().byId("type").setSelectedKey("ZM02");
							this.onSelectItem();
						} else {
							this.onSelectItem(); 
						}
					} else {
						if(this.bIsTFirstVisit) {
							this.bIsTFirstVisit = false;
							this._deleteFilters();
						}
					}
					if(util.otFilters && util.otFilters[0]) {
						this.getView().byId("filter").setType("Accept");
					} else {
						util.otFilters = [];
						this.getView().byId("filter").setType("Default");
					}
				}	
			}
		},
		
		_setFilters: function (prio1, prio2, prio3, range1, range2) {
			var oFilter = {
				"prio1": prio1,
				"prio2": prio2,
				"prio3": prio3,
				"range1": range1,
				"range2": range2
			};
			util.otFilters = [oFilter];
		},
		
		_deleteFilters: function () {
			util.otFilters = [];
		},
		
		_filterList: function (oFilter) {
			var aANDFilter = [];
			if(oFilter) {
				aANDFilter.push(oFilter);
				this.getView().byId("type").setSelectedKey(oFilter.oValue1);
				this.getView().byId("followupList").getBinding("items").filter(new sap.ui.model.Filter(aANDFilter, true));
			}
			var that = this;
			this.getView().byId("followupList").setBusy(true);
	
			if(util.otFilters && util.otFilters[0]) {
				var oElement = util.otFilters[0],
					aFilters = [],
					sPrio1 = oElement.prio1 ? "1": "",
					sPrio2 = oElement.prio2 ? "2": "",
					sPrio3 = oElement.prio3 ? "3": "",
					dToday = new Date(),
					sDate1 = null;
				
				if(((new Date().getMonth() - oElement.range1) + 1) <= 0) {
					sDate1 = new Date(
						(new Date().getFullYear() - 1) + "/" +
						((new Date().getMonth() - oElement.range1) + 13) + "/" + 
						"01").getTime();
				} else {
					sDate1 = new Date(
					(new Date().getFullYear()) + "/" +
					((new Date().getMonth() - oElement.range1) + 1) + "/" + 
					"01").getTime();
				}
				var sDate2 = null;
				if(((new Date().getMonth() - oElement.range2) + 1) <= 0) {
					sDate2 = new Date(
						(new Date().getFullYear() - 1) + "/" +
						((new Date().getMonth() - oElement.range2) + 13) + "/" + 
						"01").getTime();
				} else {
					sDate2 = new Date(
					(new Date().getFullYear()) + "/" +
					((new Date().getMonth() - oElement.range2) + 1) + "/" + 
					"01").getTime();
				}
				if(sDate1 > sDate2) {
					var sChange = sDate1;
					sDate1 = sDate2;
					sDate2 = sChange;
				}
				var aORFilter = [];
				if(sPrio1 === "1" || sPrio2 === "2" || sPrio3 === "3") {
					if(sPrio1 === "1") {
						aORFilter.push(new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.Contains, sPrio1));
					}
					if(sPrio2 === "2") {
						aORFilter.push(new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.Contains, sPrio2));
					}
					if(sPrio3 === "3") {
						aORFilter.push(new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.Contains, sPrio3));
					}
					aANDFilter.push(new sap.ui.model.Filter(aORFilter, false));
					if(util.otFilters[0].range1 && util.otFilters[0].range2) {
						aANDFilter.push(new sap.ui.model.Filter("StartDate", sap.ui.model.FilterOperator.BT, sDate1, sDate2));
						this.aGlobalFilters = aANDFilter;
					}
				} else {
					if(util.otFilters[0].range1 && util.otFilters[0].range2) {
						aANDFilter.push(new sap.ui.model.Filter("StartDate", sap.ui.model.FilterOperator.BT, sDate1, sDate2));
						this.aGlobalFilters = aANDFilter;
					}
					this.aGlobalFilters = aANDFilter;
				}
				this.getView().byId("followupList").getBinding("items").filter(new sap.ui.model.Filter(aANDFilter, true));
				if(oFilter) {
					this.getView().byId("type").setSelectedKey(oFilter.oValue1);
				}
			}	

			this.getView().byId("followupList").setBusy(false);
		},
		
		backToHome: function () {
			this._resetDatas();
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this._resetDatas();
			this.getRouter().navTo("WorkPage");
		},
		
		onPressNavToFilter: function () {
			this._resetDatas();
			this.getRouter().navTo("Filter");
		},
		
		onPressNavToOTDetail: function (oEvent) {
			this._resetDatas();
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var sId = oEvent.getSource().oBindingContexts.followupListModel.sPath.split("/")[1],
				followupListModel = this.getModel("followupListModel").getData();
			util.oSelectedOT = oItem.getTitle().split(" ")[2];
			util.oSelectedOTFull = followupListModel[sId];
			this.getRouter().navTo("Operations");
		},
		
		onPressRefresh: function () {
			this.getView().byId("followupList").setBusy(true);
			this._resetModel();
			this.getView().byId("followupList").setBusy(false);
		},
		
		_resetModel: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			this.getView().byId("followupList").setBusy(true);
			oModel.read("OrderHeaderSet?$expand=HeaderToOperations/OperationComponent,HeaderToOperations/MeausurementPoint",
				null, null,
				false,
				function (oData) {
					console.log("oData of OT:", oData);
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						util.aOTElements = oData.results;
						that.followupListModel(oData.results);
						that.getView().byId("followupList").setBusy(false);
						that._filterList();
					} else {
						alert("Empty OrderHeaderSet odata!");
						that.getView().byId("followupList").setBusy(false);
					}
				}.bind(this),
				function (oData) {
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				that.getView().byId("followupList").setBusy(false);
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}.bind(this)
			);
				
		/*	var aElements = [
				{
					"OrderId": "0000001",
			    	"ShortText": "Tube qui fuit",
			    	"StartDate": new Date("2019-11-12"),
			    	"convertedDate": "1571608800000",
			    	"equipement": "Trousse de réparation",
			    	"SystemStatus": "Status 1",
			    	"Priority":	"1",
			    	"FunctionalLocation": "code poste technique 1",
			    	"OrderType": "ZM02"
				},
				{
					"OrderId": "0000002",
					"ShortText": "Verre brisé",
					"StartDate": new Date("2019-10-18"),
					"convertedDate": "1571349600000",
					"equipement": "Verre coupé à la taille",
					"SystemStatus": "Status 2",
			    	"Priority":	"3",
			    	"FunctionalLocation": "code poste technique 2",
			    	"OrderType": "ZM03"
				},
				{
					"OrderId": "0000003",
					"ShortText": "Plateau cassé",
			    	"StartDate": new Date("2019-10-17"),
			    	"convertedDate": "1571263200000",
			    	"equipement": "Charpentier",
		    		"SystemStatus": "Status 3",
			    	"Priority":	"3",
			    	"FunctionalLocation": "code poste technique 3",
			    	"OrderType": "ZM02"
				},
				{
					"OrderId": "0000004",
					"ShortText": "Pas de chauffage",
			    	"StartDate": new Date("2019-10-21"),
			    	"convertedDate": "1571608800000",
			    	"equipement": "Mécanicien en chauffage",
			    	"SystemStatus": "Status 4",
			    	"Priority":	"2",
			    	"FunctionalLocation": "code poste technique 4",
			    	"OrderType": "ZM03"
				},
				{
					"OrderId": "0000005",
			    	"ShortText": "Casier cassé",
			    	"StartDate": new Date("2019-10-15"),
			    	"convertedDate": "1571090400000",
			    	"equipement": "Serrurier",
		    		"SystemStatus": "Status 5",
			    	"Priority":	"1",
			    	"FunctionalLocation": "code poste technique 5",
			    	"OrderType": "ZM02"
				},
				{
					"OrderId": "0000006",
			    	"ShortText": "Casier cassé",
			    	"StartDate": new Date("2019-10-15"),
			    	"convertedDate": "1571090400000",
			    	"equipement": "Serrurier",
		    		"SystemStatus": "Status 6",
			    	"Priority":	"2",
			    	"FunctionalLocation": "code poste technique 6",
			    	"OrderType": "ZM02"
				}
			];
			util.aOTElements = aElements;
			this.followupListModel(aElements);*/
		},

		onOpenOTSearchDialog: function (evt) {
			var type = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.searchOT", this);
			this.getView().addDependent(type);
			this._resetModel();
			type.open();
		},
		
		onPressAccept: function () {
			var core = sap.ui.getCore(),
				sKey = core.byId("searchField").getSuggestionItems()[0] ? core.byId("searchField").getSuggestionItems()[0].getText() : "",
				oElement = {};
			if(util.aFilteredOT.length > 0) {
				this.followupListModel(util.aFilteredOT);
			} else {
				for(var i = 0; i < this.getModel("followupListModel").getData().length; i++) {
					if(sKey === this.getModel("followupListModel").getData()[i].OrderId) {
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
						new sap.ui.model.Filter("OrderId", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
		/*				new sap.ui.model.Filter("StartDate", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),*/
						new sap.ui.model.Filter("OrderType", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("FunctionalLocation", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("Priority", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("SystemStatus", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("ShortText", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("NotificationNumber", function(sDes) {
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
			this.getView().byId("prio").setIcon("");
			this.getView().byId("statut").setIcon("");
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("StartDate", bStatus, false));
		},
		
		onSelectItem: function (oInputFilter) {
			var sItemType = this.getView().byId("type").getSelectedItem() ? this.getView().byId("type").getSelectedKey() : "",
				oFilter = new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.Contains, sItemType);
			if(sItemType === "00") {
				oFilter = new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.Contains, "");
			}
			this._filterList(oFilter);
		},
		
		onPressPrio: function () {
			var bStatus = "";
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
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("Priority", bStatus, false));
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
			this.getView().byId("prio").setIcon("");
			this.getView().byId("followupList").getBinding("items").sort(new sap.ui.model.Sorter("SystemStatus", bStatus, false));
		}
		/*eslint-enable*/
	});

});