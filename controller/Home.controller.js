sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.Home", {
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
			this.menuTitleModel();
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Home") {
				this.registerNavFrom(this);
				var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("homeTitle");
				util.sTitleText = sTitle;
				
			}
		},
		
		onPressNavToAvis: function () {
			this.navTo("Detail");
		},
		
		onPressNavToFollowup: function () {
			this.navTo("Followup");
		},
		
		onPressNavToInfoEquipment: function () {
			this.navTo("InfoEquipment");
		},
		
		onPressNavToInfoStock: function () {
			util.bNavFromArticle = false;
			this.navTo("InfoStock");
		}
	});
});