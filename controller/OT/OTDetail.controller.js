sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.OTDetail", {
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "OTDetail") {
				this.getView().byId("breadcrumbs").setCurrentLocationText(util.oSelectedOT);
				var sDetailText = this.getView().getModel("i18n").getResourceBundle().getText("otDetailTextOfDetail");
				util.sTitleText = sDetailText + " " + util.oSelectedOT;
				this._resetModel();
				this.otDetailModel(util.oSelectedOTFull);
				this.setTitle();	
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
			if(sIcon === "sap-icon://edit") {
				this._updateOT();
			}	
			this.otViewModel(oElement);
		},
		
		_updateOT: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl),
				oUpdatedOT = {
					"OrderId":				util.oSelectedOTFull.OrderId,
					"FunctionalLocation":	this.getView().byId("functionalLocation").getValue(),
					"FinishDate":			new Date(this.getView().byId("finishDate").getDateValue())
				},
				that = this;
			oModel.update("/OrderHeaderSet('" + util.oSelectedOTFull.OrderId + "')", oUpdatedOT, {
				method: "PUT",
				success: (function(oData) {
					var self = that;
    				MessageBox.success("Successfully updated the OT",
						{
							styleClass: "sapUiSizeCompact",
							actions: ["OK"],
							onClose: function (oAction) {
								if(oAction === "OK") {
									self.backToHome();
								}
							}
						}
					);
       			}).bind(this), 
	       		error: (function(oData) {  
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				var self = that;
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact",
							actions: ["OK"],
							onClose: function (oAction) {
								if(oAction === "OK") {
									self.backToHome();
								}
							}
						}
					);	
				})
			});
		}

	});

});