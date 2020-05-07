sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.olit.depanneur.HATDepanneurApp.controller.ErrorPage", {
		/*eslint-disable*/
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "ErrorPage") {
				
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		onPressNavToDetail: function (oEvent) {
			util.sSelectedTile = oEvent.getSource().sId;
			this.getRouter().navTo("Detail");
		}
		/*eslint-enable*/
	});

});