sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageToast"
], function (BaseController, util, formatter, MessageToast) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.InfoStock.InfoStock", {
		
		aOldValues: [10, 5, 9, 20, 3],         

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
	
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "InfoStock") {
				this._resetModel();
				this._initStepInputs();
				this._resetOTModel();
				var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("infoStockTitle");
			//	this.setTitle(sTitle);
				
				util.sTitleText = sTitle;
				this.setTitle();	
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"title": "Code article A0001",
			    	"description": "Description 1",
			    	"magasin": "Magasin 1",
			    	"emplacement": "Emplacement magasin 1",
			    	"quantity": 10,
			    	"date": "21/10/2019",
			    	"equipement": "Trousse de réparation",
			    	"status": "Faible"
				},
				{
					"title": "Code article A0002",
					"description": "Description 2",
					"magasin": "Magasin 2",
					"emplacement": "Emplacement magasin 2",
					"quantity": 5,
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne"
				},
				{
					"title": "Code article A0003",
					"description": "Description 3",
					"magasin": "Magasin 3",
					"emplacement": "Emplacement magasin 3",
					"quantity": 9,
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure"
				},
				{
					"title": "Code article A0004",
					"description": "Description 4",
					"magasin": "Magasin 4",
					"emplacement": "Emplacement magasin 4",
					"quantity": 20,
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible"
				},
				{
					"title": "Code article A0005",
			    	"description": "Description 5",
			    	"magasin": "Magasin 5",
			    	"emplacement": "Emplacement magasin 5",
			    	"quantity": 3,
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure"
				}
			];
			this.infoStockModel(aElements);
		},
		
		_resetOTModel: function () {
			var aElements = [
				{
					"article": "A00001",
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
					"article": "A00002",
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
					"article": "A00003",
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
					"article": "A00004",
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
					"article": "A00005",
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
			this.followupListModel(aElements);
		},
		
		onOpenStockDialog: function (evt) {
			var stockDialog = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.stockSelector", this);
			this.getView().addDependent(stockDialog);
			this._resetModel();
			if(!util.bNavFromArticle) {
				stockDialog.open();
			} else {
				if(util.oSelectedOTFull.title !== undefined) {
					this._showMessageToast();
				}
			}
		},
		
		onPressOT: function (oEvent) {
			var sText1 = oEvent.getSource().getText().split(" -")[0],
				sText2 = oEvent.getSource().getText().split("- ")[1],
				sOT = sText2.split("N° OT ")[1].split(" -")[0],
				sDescription = oEvent.getSource().getText().split(" - ")[2];
			this.onPressClose();
			MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("stockSelectorMT1") + " " + sText1 + " " + 
			this.getView().getModel("i18n").getResourceBundle().getText("stockSelectorMT2") + " " + sOT + " " + sDescription);
		},
		
		_showMessageToast: function () {
			var sText1 = util.oSelectedOTFull.title.split("N° OT 000")[1],
				sText2 = util.oSelectedOTFull.title.split("N° OT")[1],
				sDescription = "Description courte " + util.oSelectedOTFull.title.split("N° OT 000000")[1];
			this.onPressClose();
			MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("stockSelectorMT1") + " " + sText1 + " " + 
			this.getView().getModel("i18n").getResourceBundle().getText("stockSelectorMT2") + " " + sText2 + " " + sDescription);
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("stockDialog").close();
			core.byId("stockDialog").destroy();
		},
		
		onPressPostTech: function () {
			this._openValueHelpDialog();
		},
		
		_openValueHelpDialog: function (evt) {
			var valueHelpDialog = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.valueHelp", this);
			this.getView().addDependent(valueHelpDialog);
			this._resetModel();
			valueHelpDialog.open();
		},
		
		onPressCloseVH: function () {
			var core = sap.ui.getCore();
			core.byId("valueHelpDialog").close();
			core.byId("valueHelpDialog").destroy();
		},
		
		onPressAdd: function () {
			var oForm = sap.ui.getCore().byId("additionalBox"),
				oCustomList = sap.ui.getCore().byId("customList"),
				oLabel1 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("valueHelpText1")}),
				oDate1 = new sap.m.Select({
					forceSelection: false,
					items: [
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType1}",
							key: "1"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType2}",
							key: "2"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType3}",
							key: "3"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType4}",
							key: "4"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType5}",
							key: "5"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpType6}",
							key: "6"
						})
					]
				}),
				oLabel2 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("valueHelpText2")}),
				oDate2 = new sap.m.Select({
					forceSelection: false,
					items: [
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter1}",
							key: "1"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter2}",
							key: "2"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter3}",
							key: "3"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter4}",
							key: "4"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter5}",
							key: "5"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter6}",
							key: "6"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter7}",
							key: "7"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter8}",
							key: "8"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter9}",
							key: "9"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter10}",
							key: "10"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter11}",
							key: "11"
						}), 
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter12}",
							key: "12"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter13}",
							key: "13"
						}),
						new sap.ui.core.Item({
							text: "{i18n>valueHelpFilter14}",
							key: "14"
						})
					]
				}),
				oLabel3 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("valueHelpText3")}),
				oInput = new sap.m.Input({});
			oForm.addContent(oLabel1);	
			oForm.addContent(oDate1);
			oForm.addContent(oLabel2);
			oForm.addContent(oDate2);
			oForm.addContent(oLabel3);
			oForm.addContent(oInput);
			oCustomList.addContent(oForm);
		},
		
		_initStepInputs: function () {
			/* eslint-disable */
			var oList = this.getView().byId("detailList").getItems();
			for(var i = 0; i < oList.length; i++) {
				oList[i].getContent()[0].getItems()[4].getItems()[1].setValue("0");
				if(parseInt(oList[i].getContent()[0].getItems()[4].getItems()[1].getValue()) === 0) {
					oList[i].getContent()[0].getItems()[4].getItems()[0].setEnabled(false);
					oList[i].getContent()[0].getItems()[4].getItems()[1].removeStyleClass("customInputTextGreen");
				}
			} 
		},
		
		onPressDec: function (oEvent) {
			var core = sap.ui.getCore();
			core.byId(oEvent.getSource().sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).removeStyleClass("customInputTextGreen");
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue((parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) - 1));
			var sId = oEvent.getSource().sId.split("detailList-")[1]; 
			this.getView().getModel("infoStockModel").getData()[sId].quantity =  parseInt(this.getView().getModel("infoStockModel").getData()[sId].quantity) + 1; 
			this.getView().getModel("infoStockModel").refresh(true);
			if(parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) === 0) {
				core.byId(oEvent.getSource().sId).setEnabled(false);
			}
		},
		
		onPressInc: function (oEvent) {
			var core = sap.ui.getCore();
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).removeStyleClass("customInputTextGreen");
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(true);
			core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue((parseInt(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].getValue()) + 1));
			var sId = oEvent.getSource().sId.split("detailList-")[1]; 
			this.getView().getModel("infoStockModel").getData()[sId].quantity =  parseInt(this.getView().getModel("infoStockModel").getData()[sId].quantity) - 1; 
			this.getView().getModel("infoStockModel").refresh(true);
			if(parseInt(this.getView().getModel("infoStockModel").getData()[sId].quantity) === 0) {
				core.byId(oEvent.getSource().sId).setEnabled(false);
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).addStyleClass("customInputTextGreen");
			}
		},
		
		onCheckValue: function (oEvent) {
			var core = sap.ui.getCore(),
				sValue = parseInt(oEvent.getSource().getValue()),
				sId = oEvent.getSource().sId.split("detailList-")[1],
				iOldValue = parseInt(this.aOldValues[sId]);
			if(sValue <= iOldValue) {
				core.byId(oEvent.getSource().sId).removeStyleClass("customInputTextGreen");
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue(sValue);
				this.getView().getModel("infoStockModel").getData()[sId].quantity = iOldValue - sValue;
				this.getView().getModel("infoStockModel").refresh(true);
				if(iOldValue === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(false);
				}
				if(sValue === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(false);
				}
				if(this.getView().getModel("infoStockModel").getData()[sId].quantity === 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(false);
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[0].sId).setEnabled(true);
					core.byId(oEvent.getSource().sId).addStyleClass("customInputTextGreen");
				} 
				if(this.getView().getModel("infoStockModel").getData()[sId].quantity > 0) {
					core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[2].sId).setEnabled(true);
				} 
			} else {
				core.byId(oEvent.getSource().oParent.oParent.getItems()[4].getItems()[1].sId).setValue("");
				this.getView().getModel("infoStockModel").getData()[sId].quantity = this.aOldValues[sId];
				this.getView().getModel("infoStockModel").refresh(true);
			}
		}
		
	});

});