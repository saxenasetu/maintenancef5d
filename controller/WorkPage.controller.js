sap.ui.define([
	"com/eramet/depanneur/Maintenance/controller/BaseController",
	"com/eramet/depanneur/Maintenance/util/util",
	"com/eramet/depanneur/Maintenance/util/formatter"	
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.depanneur.Maintenance.controller.WorkPage", {
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "WorkPage") {
				
			}
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		onPressNavToFollowup: function () {
			this.getRouter().navTo("Followup");
		},
		
		onPressNavToHistoryOT: function () {
			this.getRouter().navTo("HistoryOT");
		}

	});

});