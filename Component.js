sap.ui.define([
	"sap/ui/core/UIComponent",
	"com/eramet/maintenanceF5D/controller/BaseController",
	"sap/ui/Device",
	"com/eramet/maintenanceF5D/model/models"
], function (UIComponent, BaseController, Device, models) {
	"use strict";

	return UIComponent.extend("com.eramet.maintenanceF5D.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		
		applyTheme: function(sTheme) {
			sap.ui.getCore().applyTheme(sTheme);
		}
	});
});