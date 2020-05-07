sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, MessageBox) {

	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.Operations", {
		aChangedButtons: [],
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Operations") {
				var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("operationsTitle");
				if(util.aCreatedOT.length > 0) {
					for(var i = 0; i < util.aOTElements.length; i++) {
						if(util.aCreatedOT === util.aOTElements[i].OrderId) {
							util.oSelectedOT = util.aCreatedOT;
							util.oSelectedOTFull = util.aOTElements[i];
							util.aCreatedOT = "";
							break;
						}
					}
				} 
				if(util.oSelectedOT && util.oSelectedOTFull) {
					this.getView().byId("otNumber").setText(util.oSelectedOT);
					this.getView().byId("finalText").setText(util.oSelectedOT);
					this.getView().byId("finalText").setTooltip(util.oSelectedOT);
					this.getView().byId("desc").setText(util.oSelectedOTFull.ShortText);
					this.getView().byId("date").setText(com.eramet.maintenanceF5D.util.formatter.avisDate(util.oSelectedOTFull.StartDate));
	
					util.sTitleText = sTitle;
					this.setTitle();
		
					this._resetModel();
					this._resetIcons();
					if(util.oSelectedOTFull.Priority === "3" && util.oSelectedOTFull.OrderType === "ZM03") {
						this.getView().byId("add").setVisible(false);
						this.getView().byId("tree").setVisible(false);
						this.getView().byId("list").setVisible(true);
						this.getView().byId("list2").setVisible(true);
						this.getView().byId("rondierStartDate").setDateValue(util.oSelectedOTFull.StartDate);
						this.getView().byId("rondierEndDate").setDateValue(util.oSelectedOTFull.FinishDate);
					} else {
						this.getView().byId("add").setVisible(true);
						this.getView().byId("tree").setVisible(true);
						this.getView().byId("list").setVisible(false);
						this.getView().byId("list2").setVisible(false);
					}
				}
			}
		},
		
		_resetModel: function (bRondier) {
	/*		var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			this.getView().byId("tree").setBusy(true);
			var oFilter = {
				"OrderNumber": util.oSelectedOT
			};
		//	oModel.read("OrderOperationSet?$filter=OrderNumber eq '" + util.oSelectedOT + "'",
			oModel.read("OrderHeaderSet('" + util.oSelectedOT + "')/HeaderToOperations",
				null, null,
				true,
				function (oData) {
					console.log("oData of operations:", oData);
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						util.aTreeElements = oData.results;
					
						util.aTreeElements = oData.results;
						that.treeModel(oData.results);
						that._resetIcons();
						var bRondier = false;
						if(util.oSelectedOTFull.Priority === "3" && util.oSelectedOTFull.OrderType === "ZM03") {
							bRondier = true;
							that._resetRondierModel();
						}
						that._resetConformButtons(bRondier);
						that.getView().byId("tree").setBusy(false);
					} else {
						alert("Empty HeaderToOperations odata!");
						that.getView().byId("tree").setBusy(false);
					}
				},
				function () {
					alert("HeaderToOperations service fail");
					that.getView().byId("tree").setBusy(false);
				}
			);*/
		//	var that = this;
			if(util.oSelectedOTFull.HeaderToOperations.results && util.oSelectedOTFull.HeaderToOperations.results.length > 0) {
				if(util.oSelectedOTFull.Priority === "3" && util.oSelectedOTFull.OrderType === "ZM03") {
					bRondier = true;
					this._resetRondierModel();
				//	this._resetConformButtons(bRondier);
				} else {
					this.getView().byId("tree").setBusy(true);
					this.treeModel(util.oSelectedOTFull.HeaderToOperations.results);
					this._resetIcons();
					var bRondier = false;
					this.getView().byId("tree").setBusy(false);
				}
				
				if(bRondier) {
					this.getView().byId("save").setVisible(true);
					this.getView().byId("add").setVisible(false);
				} else {
					this.getView().byId("save").setVisible(false);
					this.getView().byId("add").setVisible(true);
				}
			}

			
		/*	var aElements = [
				{
					"OperationNumber": "N° operation 0001",
			    	"Description": "Description 1"
				},
				{
					"OperationNumber": "N° operation 0002",
					"Description": "Description 2"
				},
				{
					"OperationNumber": "N° operation 0003",
					"Description": "Description 3"
				},
				{
					"OperationNumber": "N° operation 0004",
					"Description": "Description 4"
				},
				{
					"OperationNumber": "N° operation 0005",
			    	"Description": "Description 5"
				}
			];
			util.aTreeElements = aElements;
			this.treeModel(aElements);
			this._resetIcons();
			var bRondier = false;
			if(util.oSelectedOTFull.Priority === "3" && util.oSelectedOTFull.OrderType === "ZM03") {
				bRondier = true;
				this._resetRondierModel();
			}
			this._resetConformButtons(bRondier);*/
		},
		
		_resetRondierModel: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			oModel.read("/OrderHeaderSet?$expand=HeaderToOperations/MeausurementPoint",
				null, null,
				false,
				function (oData) {
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						var aData = oData.results,
							aFinal = [];
						for(var i = 0; i < aData.length; i++) {
							if(util.oSelectedOTFull.OrderId === aData[i].OrderId) {
								var aOp = aData[i].HeaderToOperations.results;
								if(aOp.length > 0) {
									for(var j = 0; j < aOp.length; j++) {
										var aMeasurement = aOp[j].MeausurementPoint.results;
										for(var k = 0; k < aMeasurement.length; k++) {
											aMeasurement[k].OperationDesc = aOp[j].Description;
											aFinal.push(aMeasurement[k]);
										}
									}
								}
							} 
						}
						that.rondierModel(aFinal);
					} else {
						alert("Empty OrderHeaderSet odata!");
					}
				
				}.bind(this),
				function (oData) {
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}.bind(this)
			);
			
	/*		var aElements = [
				{
					"buttons": true,
					"input": false
				},
				{
					"buttons": false,
					"input": true
				},
				{
					"buttons": true,
					"input": false	
				},
				{
					"buttons": true,
					"input": false	
				},
				{
					"buttons": false,
					"input": true	
				}
			];
			this.rondierModel(aElements);	*/
		},
		
		backToHome: function () {
		//	this._resetModel();
			this.getRouter().navTo("Home");
		},
		
		backToFollowup: function () {
		//	this._resetModel();
			this.getRouter().navTo("Followup");
		},
		
		onPressSaveMeasurement: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
				oEntry = {
					 "OrderNumber": "400000146",
					 "MeasuringPointNumber": "54",
					 "OperationNumber": "0010",
					 "MeasuredValue": "12.0"
				},
				that = this;
			oModel.create("/MeasurementDocumentSet", oEntry,
				{
					success: function (oData) {
						var self = that;
						MessageBox.success("Successfully saved",
							{
								styleClass: "sapUiSizeCompact",
								actions: ["OK"],
								onClose: function (oAction) {
									if(oAction === "OK") {
										self.backToFollowup();
									}
								}
							}
						);
					},
					error: function (oData) {
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
										self.backToFollowup();
									}
								}
							}
						);	
					}
				}
			);
		},
		
		onPressNavToOTDetail: function () {
		//	this._resetModel();
			this.getRouter().navTo("OTDetail");
		},
		
		onPressNavToOpDetail: function (oEvent) {
			/* eslint-disable */
		 	var sPath = oEvent.getSource().sId;
			sPath = sPath.split("tree-")[1];
		 	util.sOperationName = this.getView().byId("tree").getModel("treeModel").getData()[sPath];
			this.getRouter().navTo("ToOpDetail");
		},
		
		onPressChangeIcon: function (oEvent) {
			var sIcon = sap.ui.getCore().byId(oEvent.getSource().sId).getIcon();
			if(sIcon === "sap-icon://synchronize") {
				sap.ui.getCore().byId(oEvent.getSource().sId).setIcon("sap-icon://accept");
				sap.ui.getCore().byId(oEvent.getSource().sId).setType("Accept");
				this.aChangedButtons.push(oEvent.getSource().sId);
			} else {
				sap.ui.getCore().byId(oEvent.getSource().sId).setIcon("sap-icon://synchronize");
				sap.ui.getCore().byId(oEvent.getSource().sId).setType("Default");
				var array = this.aChangedButtons;
				var search_term = oEvent.getSource().sId;
				
				for (var i = array.length-1; i >= 0; i--) {
				    if (array[i] === search_term) {
				        array.splice(i, 1);
				        break;
				    }
				}
			}
			/* eslint-enable */
		},
		
		_resetIcons: function () {
			for(var i = 0; i < this.aChangedButtons.length; i++) {
				if(sap.ui.getCore().byId(this.aChangedButtons[i])) {
					sap.ui.getCore().byId(this.aChangedButtons[i]).setType("Default");
					sap.ui.getCore().byId(this.aChangedButtons[i]).setIcon("sap-icon://synchronize");
				}
			}
			this.aChangedButtons = [];
		},
		
		onPressConform: function (oEvent) {
			var bSelected = false,
				core = sap.ui.getCore();
			if(core.byId(oEvent.getSource().sId).getType() === "Accept") { 
				bSelected = true;
			}
			if(bSelected) {
				core.byId(oEvent.getSource().sId).setType("Default");
			} else {
				core.byId(oEvent.getSource().sId).setType("Accept");
				core.byId(oEvent.getSource().oParent.getItems()[1].sId).setType("Default");
			}
		},
		
		onPressNonConform: function (oEvent) {
			var bSelected = false,
				core = sap.ui.getCore();
			if(core.byId(oEvent.getSource().sId).getType() === "Reject") { 
				bSelected = true;
			}
			if(bSelected) {
				core.byId(oEvent.getSource().sId).setType("Default");
			} else {
				core.byId(oEvent.getSource().sId).setType("Reject");
				core.byId(oEvent.getSource().oParent.getItems()[0].sId).setType("Default");
			}
		},
		
		_resetConformButtons: function (bRondier) {
			var core = sap.ui.getCore(),
				aItems = this.getView().byId("list2").getItems();
			for(var i = 0; i < aItems.length; i++) {
				for(var j = 0; j < aItems[i].getContent()[0].getItems()[2].getItems().length; j++) {
					core.byId(aItems[i].getContent()[0].getItems()[2].getItems()[j].sId).setType("Default");
				}
			}
			if(bRondier) {
				this.getView().byId("save").setVisible(true);
				this.getView().byId("add").setVisible(false);
			} else {
				this.getView().byId("save").setVisible(false);
				this.getView().byId("add").setVisible(true);
			}
		},
		
		onPressAdd: function () {
			util.sOperationName = {
				"OperationNumber": this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailNewOperation"),
				"Description": ""
			};
			this.getRouter().navTo("ToOpDetail");
		}

	});

});