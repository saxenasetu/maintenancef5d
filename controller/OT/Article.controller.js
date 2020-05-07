sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.Article", {
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Article") {
				var sText = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailTitle");
			//	this.setTitle(this.getView().getModel("i18n").getResourceBundle().getText("articleTitle"));
						
				util.sTitleText = this.getView().getModel("i18n").getResourceBundle().getText("articleTitle");
				this.setTitle();
				
				this.getView().byId("finalText").setText(util.oSelectedOT);
				this.getView().byId("finalText").setTooltip(util.oSelectedOT);
				if(util.sOperationName && util.sOperationName.OperationNumber) {
					this.getView().byId("finalText2").setText(sText + " " +  util.sOperationName.OperationNumber);
					this.getView().byId("finalText2").setTooltip(sText + " " +  util.sOperationName.OperationNumber);
				}
				if(util.sCustomer === "R") {
					this.getView().byId("search").setEnabled(false);
				} else {
					this.getView().byId("search").setEnabled(true);
				}
				this._resetModel();
			}
		},
		
		backToHome: function () {
			this._resetModel();
			this.getRouter().navTo("Home");
		},
		
		backToFollowup: function () {
			this._resetModel();
			this.getRouter().navTo("Followup");
		},
		
		onPressOTDetail: function () {
			this._resetModel();
			this.getRouter().navTo("OTDetail");
		},
		
		backToOperations : function () {
			this._resetModel();
			this.getRouter().navTo("Operations");
		},
		
		onPressNavBack: function () {
			this._resetModel();
			this.getRouter().navTo("ToOpDetail");
		},
		
		onPressNavToInfoStock: function () {
			this._resetModel();
			util.bNavFromArticle = true;
			this.getRouter().navTo("InfoStock");
		},
		
		_resetModel: function () {
	//		var that = this;
	//		setTimeout(function() {	
				if(util.sOperationName && util.sOperationName.OperationComponent && util.sOperationName.OperationComponent.results) {
					util.aArticles = util.sOperationName.OperationComponent.results;
					this.articleModel(util.sOperationName.OperationComponent.results);
				}
	//		}, 100);
	/*		var aElements = [
				{
					"title": "Code article 1",
			    	"description": "Description 1",
			    	"number": 3
				},
				{
					"title": "Code article 2",
			    	"description": "Description 2",
			    	"number": 12
				},
				{
					"title": "Code article 3",
			    	"description": "Description 3",
			    	"number": 5
		    	
				},
				{
					"title": "Code article 4",
			    	"description": "Description 4",
			    	"number": 7
				}
			];
			util.aArticles = aElements;
			this.articleModel(aElements); */
		}

	});

});