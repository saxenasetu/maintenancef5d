sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.InfoEquipment.Rattaches", {
		globalStartDate: null,
		globalEndDate: null, 
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Rattaches") {
				console.log("button text:", util.sRattachesButtonText);
			//	if(util.sRattachesButtonText.split("--")[1] === "avisRattache") {
				if(util.sRattachesButtonText === "avisRattache") {	
					var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("rattachesTitle1");
				//	this.getView().byId("rattaches").setText(sTitle + " " + util.aEquipment.equipement);
				
				//	this.setTitle(sTitle + " " + util.aEquipment.equipement);
					util.sTitleText = sTitle + " " + util.aEquipment.equipement;
					this.setTitle();
					
					this.getView().byId("breadcrumbs").setCurrentLocationText(sTitle);
					this.getView().byId("addButton").setVisible(true);
					this.getView().byId("type").setVisible(false);
					this.getView().byId("dateSelector").setText(this.getView().getModel("i18n").getResourceBundle().getText("rattachesDateButton1"));
					this._resetModel();
				} else {
					sTitle = this.getView().getModel("i18n").getResourceBundle().getText("rattachesTitle2");
				//	this.getView().byId("rattaches").setText(sTitle + " " + util.aEquipment.equipement);
				
				//	this.setTitle(sTitle + " " + util.aEquipment.equipement);
					util.sTitleText = sTitle + " " + util.aEquipment.equipement;
					this.setTitle();
						
					this.getView().byId("breadcrumbs").setCurrentLocationText(sTitle);
					this.getView().byId("addButton").setVisible(false);
					this.getView().byId("type").setVisible(true);
					this.getView().byId("dateSelector").setText(this.getView().getModel("i18n").getResourceBundle().getText("rattachesDateButton2"));
					this._resetModel();
				}
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("InfoEquipment");
		},
		
		onPressDateInterval: function () {
			this._openDateDialog(); 
		},
		
		_openDateDialog: function () {
			var dateDialog = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.dateDialog", this);
			this.getView().addDependent(dateDialog);
			dateDialog.open();
		},
		
		handleCalendarSelect: function () {
			var oCalendar = sap.ui.getCore().byId("calendar");
			this.globalStartDate = 
				new Date((oCalendar.getSelectedDates()[0].getStartDate().getFullYear()) + "/" +
				(oCalendar.getSelectedDates()[0].getStartDate().getMonth()+1) + "/" +
				(oCalendar.getSelectedDates()[0].getStartDate().getDate())).getTime();
		
			this.globalEndDate = oCalendar.getSelectedDates()[0].getEndDate() ?
				new Date((oCalendar.getSelectedDates()[0].getEndDate().getFullYear()) + "/" +
				(oCalendar.getSelectedDates()[0].getEndDate().getMonth()+1) + "/" +
				(oCalendar.getSelectedDates()[0].getEndDate().getDate())).getTime() : null;
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("dateDialog").close();
			core.byId("dateDialog").destroy();
			this.getView().byId("detailList").getBinding("items").filter(new sap.ui.model.Filter("convertedDate", sap.ui.model.FilterOperator.BT, this.globalStartDate, this.globalEndDate));
		},
		
		_resetModel: function () {
			var aElements = [
				{
			//		"title": util.sRattachesButtonText.split("--")[1] === "avisRattache" ? "N° avis 0001" : "N° OT 0000001",
					"title": util.sRattachesButtonText === "avisRattache" ? "N° avis 0001" : "N° OT 0000001",
			    	"text": "Description 1",
			    	"date": "21/10/2019",
			    	"convertedDate": "1571608800000",
			    	"equipement": "Trousse de réparation",
			    	"status": "Ouvert",
			   // 	"icon": util.sRattachesButtonText.split("--")[1] === "avisRattache" ? "" : "sap-icon://flag",
			  //  	"type": util.sRattachesButtonText.split("--")[1] === "avisRattache" ? "" : "Type d'activité 1"
			    	"icon": util.sRattachesButtonText === "avisRattache" ? "" : "sap-icon://flag",
			    	"type": util.sRattachesButtonText === "avisRattache" ? "" : "Type d'activité 1"
				},
				{
					"title": util.sRattachesButtonText === "avisRattache" ? "N° avis 0002" : "N° OT 0000002",
					"text": "Description 2",
					"date": "18/10/2019",
					"convertedDate": "1571349600000",
					"equipement": "Verre coupé à la taille",
					"status": "En cours",
					"icon": util.sRattachesButtonText === "avisRattache" ? "" : "sap-icon://flag",
					"type": util.sRattachesButtonText === "avisRattache" ? "" : "Type d'activité 2"
				},
				{
					"title": util.sRattachesButtonText === "avisRattache" ? "N° avis 0003" : "N° OT 0000003",
					"text": "Description 3",
			    	"date": "17/10/2019",
			    	"convertedDate": "1571263200000",
			    	"equipement": "Charpentier",
		    		"status": "Clôturé",
		    		"icon": util.sRattachesButtonText === "avisRattache" ? "" : "sap-icon://flag",
		    		"type": util.sRattachesButtonText === "avisRattache" ? "" : "Type d'activité 3"
				},
				{
					"title": util.sRattachesButtonText === "avisRattache" ? "N° avis 0004" : "N° OT 0000004",
					"text": "Description 4",
			    	"date": "21/10/2019",
			    	"convertedDate": "1571608800000",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Repoussé",
			    	"icon": "",
			    	"type": util.sRattachesButtonText === "avisRattache" ? "" : "Type d'activité 4"
				},
				{
					"title": util.sRattachesButtonText === "avisRattache" ? "N° avis 0005" : "N° OT 0000005",
			    	"text": "Description 5",
			    	"date": "15/10/2019",
			    	"convertedDate": "1571090400000",
			    	"equipement": "Serrurier",
		    		"status": "Clôturé",
		    		"icon": "",
		    		"type": util.sRattachesButtonText === "avisRattache" ? "" : "Type d'activité 5"
				}
			];
			this.avisRattachesModel(aElements);
			this.getView().byId("detailList").getBinding("items").sort(new sap.ui.model.Sorter("date", true, false));
		},
		
		onPressNavToAvisDetail: function (oEvent) {
			/* eslint-disable */
			var sPath = oEvent.getSource().oBindingContexts.avisRattachesModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
		//	if(util.sRattachesButtonText.split("--")[1] === "avisRattache"){	
			if(util.sRattachesButtonText === "avisRattache"){
				util.aDetailAvis = this.getView().byId("detailList").getModel("avisRattachesModel").getData()[sPath];
				util.sSelectedTile = "__xmlview2--errorFirst";
				this.getRouter().navTo("AvisDetail");
			} else {
				util.oSelectedOT = this.getView().byId("detailList").getModel("avisRattachesModel").getData()[sPath].title.split("N° ")[1];
				this.getRouter().navTo("Operations");
			}
			/* eslint-enable */
		},
		
		onChangeStatus: function () {
			var sValue = this.getView().byId("status").getSelectedItem().getText();
			this.getView().byId("detailList").getBinding("items").filter(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.Contains, sValue));
		},
		
		onChangeType: function () {
			var sValue = this.getView().byId("type").getSelectedItem().getText();
			this.getView().byId("detailList").getBinding("items").filter(new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.Contains, sValue));
		},
		
		onSelectItem: function () {
			var aFilters = [],
				sItemStatus = this.getView().byId("status").getSelectedItem() ? this.getView().byId("status").getSelectedItem().getText() : "",
				sItemType = this.getView().byId("type").getSelectedItem() ? this.getView().byId("type").getSelectedItem().getText() : "";
			
			aFilters = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.Contains, sItemStatus),
					new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.Contains, sItemType)
				],
				and: true
			});
			this.getView().byId("detailList").getBinding("items").filter(aFilters);
		},
		
		onPressClearFilter: function () {
			this._resetModel();
			this.getView().byId("status").setSelectedKey("");
			this.getView().byId("type").setSelectedKey("");
		}

	});

});