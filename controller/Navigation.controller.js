sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, util, formatter, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.eramet.maintenance.controller.Navigation", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Navigation") {
				// var oList = this.byId("list"),
				// 	oViewModel = this._createViewModel();
				// this._oListSelector = this.getOwnerComponent().oListSelector;
				// this._oList = oList;
				// this.setModel(oViewModel, "masterView");
	
				// this.getView().addEventDelegate({
				// 	onBeforeFirstShow: function () {
				// 		this._oListSelector.setBoundMasterList(oList);
				// 	}.bind(this)
				// });
			
				// this._oODataModel = this.getOwnerComponent().getModel();
				this._callServices();
			}
		},
		
		onAfterRendering: function () {
	
		},
		
		_callServices: function () {
			var that = this;
			
			var uri = com.eramet.maintenance.Component.getMetadata().getManifestEntry("sap.app").dataSources["northwind.svc"].uri,
			oModel = new sap.ui.model.odata.ODataModel(uri, true);
			oModel.read("Products/",
				null, null,
				true,
				function (oData) {
					alert("Products service called successfully");
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						alert(oData.results.length);
					} else {
						alert("Empty Products odata!");
					}
					
					console.log("oData1:", oData);
					that.testModel1(oData);
					var oView = that.getView(),
						oTable = oView.byId("table1"),
						testModel1 = new sap.ui.model.json.JSONModel();
					oView.setModel(testModel1, "testModel1");
					oTable.setModel(testModel1, "testModel1");
					oTable.getModel("testModel1").setData(oData.results);
					oTable.getModel("testModel1").updateBindings();
					oTable.getModel("testModel1").refresh(true);
				},
				function () {
					alert("Products service fail");
				}
			);
				
			var uri2 = com.eramet.maintenance.Component.getMetadata().getManifestEntry("sap.app").dataSources["EAM_NTF_CREATE"].uri,
			oModel2 = new sap.ui.model.odata.ODataModel(uri2, true);
			oModel2.read("NotificationHeaderSet/",
				null, null,
				true,
				function (oData) {
					alert("NotificationTypeSet service called successfully");
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						alert(oData.results.length);
					} else {
						alert("Empty NotificationTypeSet odata!");
					}
					
					console.log("oData2:", oData);
					that.testModel2(oData);
					var oView = that.getView(),
						oTable = oView.byId("table2"),
						testModel2 = new sap.ui.model.json.JSONModel();
					oView.setModel(testModel2, "testModel2");
					oTable.setModel(testModel2, "testModel2");
					oTable.getModel("testModel2").setData(oData.results);
					oTable.getModel("testModel2").updateBindings();
					oTable.getModel("testModel2").refresh(true);
				},
				function () {
					alert("NotificationTypeSet service fail");
				}
			);
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("InfoStock");
		},
		
		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: "title",
				noDataText: "no data",
				sortBy: "NotificationID",
				groupBy: "None"
			});
		},
		
		onRefreshButton1: function() {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.refreshStore1();
			}
		//	this._oList.getBinding("items").refresh();
			var oView = this.getView(),
				oTable = oView.byId("table1");
			alert("length of table1: " + oTable.getModel("testModel1").getData().length);
			oTable.getModel("testModel1").updateBindings();
			oTable.getModel("testModel1").refresh(true);
		},
		
		onRefreshButton2  : function() {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.refreshStore2();
			}
		//	this._oList.getBinding("items").refresh();
			var oView = this.getView(),
				oTable = oView.byId("table2");
			alert("length of table2: " + oTable.getModel("testModel2").getData().length);
			oTable.getModel("testModel2").updateBindings();
			oTable.getModel("testModel2").refresh(true);
		},
		
		onPressCreate: function () {
			var createDialog = sap.ui.xmlfragment("com.eramet.maintenance.view.fragment.createPopup", this);
			this.getView().addDependent(createDialog);
			createDialog.open();
		},
		
		onFlushButton1: function() {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.flushStore1();
			}
		},
		
		onFlushButton2: function() {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.flushStore2();
			}
		},
		
		onSave: function () {
			var uri = com.eramet.maintenance.Component.getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri,
			//	oModel = new sap.ui.model.odata.v2.ODataModel(uri, true),
				that = this;

			var testEntry = {
				EquipmentID : sap.ui.getCore().byId("EquipmentID_id").getSelectedKey(),
				Breakdown : sap.ui.getCore().byId("Breakdown_id").getState(),
				Degraded : sap.ui.getCore().byId("Degraded_id").getSelected(),
				BreakdownStartDate : new Date(),
				Symptom : sap.ui.getCore().byId("Symptom_id").getSelectedKey(),
				Comment : sap.ui.getCore().byId("Comment_id").getValue(),
				NotificationType: sap.ui.getCore().byId("NotificationType_id").getSelectedKey()
			};
			
	//		if (navigator.onLine) { 
			//flush if device is online
	//			sap.hybrid.flushStore();
		/*		oModel.create("/NotificationSet", testEntry, {
					success: function (oData) {
						if(oData && oData.NotificationID) {
							console.log("oData: ", oData);
							MessageBox.success("Successfully saved: " + oData.NotificationID,
								{
									styleClass: "sapUiSizeCompact"
								}
							);
						} 
						that.onRefreshButton();
					},
					error: function (oData) {
						MessageBox.error("Server error! " + JSON.parse(oData.responseText).error.message.value,
							{
								styleClass: "sapUiSizeCompact"
							}
						);
					}
				});*/
			// } else {
			// 	MessageBox.warning("We'll save it later...",
			// 		{
			// 			styleClass: "sapUiSizeCompact"
			// 		}
			// 	);
			// }
			
			this.onPressClose();
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("createDialog").close();
			core.byId("createDialog").destroy();
		},

		_checkIfBatchRequestSucceeded: function (oEvent) {
			var oParams = oEvent.getParameters();
			var aRequests = oEvent.getParameters().requests;
			var oRequest;
			if (oParams.success) {
				if (aRequests) {
					for (var i = 0; i < aRequests.length; i++) {
						oRequest = oEvent.getParameters().requests[i];
						if (!oRequest.success) {
							return false;
						}
					}
				}
				return true;
			} else {
				return false;
			}
		},
	
		_fnUpdateSuccess: function () {
			this.getModel("appView").setProperty("/busy", false);
			this.getView().unbindObject();
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Event handler (attached declaratively) for the view cancel button. Asks the user confirmation to discard the changes. 
		 * @function
		 * @public
		 */
		onCancel: function () {
			this.onPressClose();
		}


	});

});