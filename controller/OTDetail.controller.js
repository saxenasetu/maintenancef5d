sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"	
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.OTDetail", {
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "OTDetail") {
				this.getView().byId("finalText").setText(util.oSelectedOT);
				this.getView().byId("finalText").setTooltip(util.oSelectedOT);
				this.getView().byId("detailOT").setTitle(util.oSelectedOT);
				this._resetModel();
			}
		},
		
		_resetModel: function () {
			var oElement = {
				"editable": false,
				"icon": "sap-icon://edit"
			};
			this.otViewModel(oElement);
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		backToWorkPage: function () {
			this.getRouter().navTo("WorkPage");
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("Followup");
		},
		
		onPressNavToOperations: function () {
			this.getRouter().navTo("Operations");
		},
		
		onPressEdit: function () {
			var bStatus = this.getView().getModel("otViewModel").getData().editable,
				sIcon = bStatus === true ? "sap-icon://edit" : "sap-icon://save",
				oElement = {
					"editable": !bStatus,
					"icon": sIcon
				};
			this.otViewModel(oElement);
		}

	});

});