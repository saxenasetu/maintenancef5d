sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.AvisDetail", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "AvisDetail") {
				var sInput = util.sSelectedTile.split("--")[1],
					sPath = "";
				switch(sInput) {
					case "errorFirst":
						sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisFirstTile");
				    	break;
			    	case "errorSecond":
				    	sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisSecondTile");
				    	break;
			    	case "errorThird":
    		    		sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisThirdTile");
				    	break;	
					case "errorFourth":
				    	sPath = this.getView().getModel("i18n").getResourceBundle().getText("avisFourthTile");
				}
				
				this.getView().byId("finalText").setText(sPath);
				this.getView().byId("finalText2").setText(util.aDetailAvis.title);
				this.getView().byId("avisDetail").setTitle(util.aDetailAvis.title);
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		backToAvis: function () {
		//	this.getRouter().navTo("Avis");
			this.getRouter().navTo("Detail");
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("Detail");
		},
		
		onPressRepousser: function () {
			var refusal = sap.ui.xmlfragment("com.eramet.depanneur.HATDepanneurApp.view.fragment.refusal", this);
			this.getView().addDependent(refusal);
			refusal.open();
		},
		
		onPressDemarrer: function () {
			this._resetModel();
			var sId = this.getView().byId("avisDetail").getTitle().split("avis ")[1],
				followupListModel = this.getModel("followupListModel").getData();
			util.oSelectedOT = followupListModel[sId-1].title.split("N° ")[1];
			console.log("oSelectedOT: ", util.oSelectedOT);
			this.getRouter().navTo("OTDetail");
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("refusalDialog").close();
			core.byId("refusalDialog").destroy();
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
			    	"description": "description courte 1"
				},
				{
					"title": "N° OT 0000002",
					"text": "Verre brisé",
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne",
			    	"prio":	"Prio 2",
			    	"codePoste": "code poste technique 2",
			    	"description": "description courte 1"
				},
				{
					"title": "N° OT 0000003",
					"text": "Plateau cassé",
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure",
			    	"prio":	"Prio 3",
			    	"codePoste": "code poste technique 1",
			    	"description": "description courte 2"
				},
				{
					"title": "N° OT 0000004",
					"text": "Pas de chauffage",
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible",
			    	"prio":	"Prio 2",
			    	"codePoste": "code poste technique 3",
			    	"description": "description courte 3"
				},
				{
					"title": "N° OT 0000005",
			    	"text": "Casier cassé",
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure",
			    	"prio":	"Prio 1",
			    	"codePoste": "code poste technique 4",
			    	"description": "description courte 4"
				}
			];
			util.aOTElements = aElements;
			this.followupListModel(aElements);
		}
	});

});