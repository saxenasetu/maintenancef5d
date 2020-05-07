sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.Article", {
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Article") {
				var sText = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailTitle");
				this.getView().byId("finalText").setText(util.oSelectedOT);
				this.getView().byId("finalText").setTooltip(util.oSelectedOT);
				this.getView().byId("finalText2").setText(sText + " " + util.sOperationName.operation.split(" ")[2]);
				this.getView().byId("finalText2").setTooltip(sText + " " + util.sOperationName.operation.split(" ")[2]);
				if(util.sCustomer === "R") {
					this.getView().byId("search").setEnabled(false);
				} else {
					this.getView().byId("search").setEnabled(true);
				}
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		backToWorkPage: function () {
			this.getRouter().navTo("WorkPage");
		},
		
		backToFollowup: function () {
			this.getRouter().navTo("Followup");
		},
		
		onPressOTDetail: function () {
			this.getRouter().navTo("OTDetail");
		},
		
		backToOperations : function () {
			this.getRouter().navTo("Operations");
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("ToOpDetail");
		},
		
		onPressNavToInfoStock: function () {
			this.getRouter().navTo("InfoStock");
		}

	});

});