sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter",
	"sap/m/MessageBox",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/ui/core/Item",
	"sap/m/library",
	"sap/ui/model/json/JSONModel"
], function (BaseController, util, formatter, MessageBox, Uploader, StandardListItem, Item, MobileLibrary, JSONModel) {
	"use strict";
	
	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.ToOpDetail", {
		/*eslint-disable*/
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "ToOpDetail") {
				var sText = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailTitle");
				this.getView().byId("finalText").setText(util.oSelectedOT);
				this.getView().byId("finalText").setTooltip(util.oSelectedOT);
				this.treeModel(util.sOperationName);
				if(util.sOperationName && util.sOperationName.OperationNumber) {
					this._fillWorkCenterModel();
					this.getView().byId("subOperations").setText(util.sOperationName.OperationNumber);
					if(util.sOperationName.OperationNumber === this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailNewOperation")) {
						//	Create mode
						util.sTitleText = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailNewOperation");
						this.setTitle();
						this._setDisplayModel("C");
						this.getView().byId("breadcrumbs").setCurrentLocationText(this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailNewOperation"));
					} else {
						//	Read/edit mode
						util.sTitleText = sText + " " + util.sOperationName.OperationNumber;
						this.setTitle();
						this._setDisplayModel("R");
						this.getView().byId("breadcrumbs").setCurrentLocationText(sText + " " + util.sOperationName.OperationNumber);
					}
				}
				this._resetContent();
			}
		},
		
		_resetModel: function (sValue) {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			oModel.read("NotificationHeaderSet('" + sValue + "')?$expand=Items",
				null, null,
				false,
				function (oData) {
					if(oData && oData.Items && oData.Items.results.length && oData.Items.results.length > 0) {
						that.opDetailModel(oData.Items.results[0]);
					} 
				},
				function (oData) {
	   				var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
						sErrorText = sErrorText.split(":")[1].split("},")[0];
					var sFinalText = sErrorText.substring(2,sErrorText.length-2);
					MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}
			);
		},
		
		_fillWorkCenterModel: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_WORK_CENTERS"].uri,
				oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
				that = this;
			oModel.read("A_WorkCenters",
				null, null,
				false,
				function (oData) {
					if(oData && oData.results && oData.results.length && oData.results.length > 0) {
						console.log("oData:", oData);
						var oEmptyElement = {
							"key": "",
							"text": ""
						};
						oData.results.unshift(oEmptyElement);
						that.workCenterModel(oData.results);
					} 
				},
				function (oData) {
	   				var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
						sErrorText = sErrorText.split(":")[1].split("},")[0];
					var sFinalText = sErrorText.substring(2,sErrorText.length-2);
					MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				}
			);
		},
		
		onHandleSuggest: function (oEvent) {
			var sInput = this.getView().byId("workCenter").getValue();
			var that = this;
			this.getView().byId("workCenter").setFilterFunction(function (sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});
			var sQueryString, sEntitySet, sUrl, oItemTemplate;
	
			var sEntity = "WorkCenter";
			sQueryString = "$filter=substringof('" + sInput.toUpperCase() + "'," + sEntity + ")";
			sEntitySet = "A_WorkCenters/";
			sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["API_WORK_CENTERS"].uri;
			oItemTemplate = new sap.ui.core.ListItem({
				text: "{path: 'workCenterModel>WorkCenter'}",
				key: "{path: 'workCenterModel>WorkCenter'}"
			});
				
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oModel.read(sEntitySet,
				null, 
				[sQueryString],
				true,
				function (oData) {
					that.getView().getModel("workCenterModel").setData(oData.results);
					that.getView().byId("workCenter").bindAggregation("suggestionItems", {
						path: "workCenterModel>/",
						width: "200px",
						template: oItemTemplate
					});
				}
			);
		},
		
		onDeleteKey: function (oEvent) {
			var oView = this.getView();
			if (oEvent.mParameters.id) {
				oView.byId("clientIdKey").setValue("");
			} 
		},
		
		onSuggSelected: function (oEvent) {
			var oView = this.getView(),
				aData = oView.getModel("workCenterModel").getData();
			if (aData.length > 0) {
				for (var i = 0; i < aData.length; i++) {
					if (oEvent.getParameters().selectedItem.mProperties.key == aData[i].WorkCenter) {
						oView.byId("workCenter").setSelectedKey(aData[i].WorkCenter);
						oView.byId("workCenter").setValue(aData[i].WorkCenter);
					}
				}
			}
		},
		
		_setDisplayModel: function (sValue) {
			var oElement = {},
			aObject = [];
			oElement.mode = sValue;
			if(sValue === "R") {
				oElement.icon = "sap-icon://edit";
				oElement.editable = false;
				oElement.editable2 = false;
				oElement.StartDate = util.sOperationName.StartDate;
				oElement.EndDate = util.sOperationName.EndDate;
				this.getView().byId("workCenter").setValue(util.sOperationName.WorkCenter);
				this._resetModel(util.oSelectedOTFull.NotificationNumber);
			} else if(sValue === "R" && this.getView().byId("workCenter").getenabled() === true) {
				oElement.icon = "sap-icon://save";
				oElement.editable = true;
				oElement.editable2 = false;
				oElement.StartDate = util.sOperationName.StartDate;
				oElement.EndDate = util.sOperationName.EndDate;
				this.getView().byId("workCenter").setValue(util.sOperationName.WorkCenter);
				this._resetModel(util.oSelectedOTFull.NotificationNumber);
			} else {
				oElement.icon = "sap-icon://save";
				oElement.editable = true;
				oElement.editable2 = true;
				oElement.StartDate = null;
				oElement.EndDate = null;
				this.getView().byId("workCenter").setValue("");
				this.opDetailModel([]);
				this._fillWorkCenterModel();
			}
			aObject.push(oElement);
			this.opViewModel(oElement);
		},
		
		onPressEdit: function () {
			var bStatus = this.getView().getModel("opViewModel").getData().editable,
				sIcon = bStatus === true ? "sap-icon://edit" : "sap-icon://save",
				oElement = {
					"editable": !bStatus,
					"editable2": false,
					"icon": sIcon,
					"StartDate": this.getView().byId("startDate").getDateValue(),
					"EndDate": this.getView().byId("endDate").getDateValue()
				};
			if(sIcon === "sap-icon://edit") {
				if(util.sOperationName.OperationNumber === this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailNewOperation")) {
					console.log("should be create!");
					this._createOperation();
				} else {
					this.onPressSave();
				}
			}	
			this.opViewModel(oElement);
		},
		
		backToHome: function () {
			this._resetContent();	
			this.getRouter().navTo("Home");
		},
		
		backToFollowup: function () {
			this._resetContent();
			this.getRouter().navTo("Followup");
		},
		
		onPressOTDetail: function () {
			this._resetContent();
			this.getRouter().navTo("OTDetail");
		},
		
		backToOperations : function () {
			this._resetContent();
			this.getRouter().navTo("Operations");
		},
		
		onPressNavBack: function () {
			this._resetContent();	
			this.getRouter().navTo("Operations");
		},
		
		onPressNavToOTDetail: function () {
			this.getRouter().navTo("OTDetail");
		},
		
		onPressAdd: function (oEvent) {
			sap.ui.getCore().byId(oEvent.getSource().sId).setVisible(false);
			var that = this,
				oList = this.getView().byId("list"),
				oForm = new sap.ui.layout.form.SimpleForm({
						columnsL: 1,
						columnsM: 1,
						editable: true,
						emptySpanL: 4,
						emptySpanM: 4,
						labelSpanL: 3,
						labelSpanM: 3,
						layout: "ResponsiveGridLayout",
						maxContainerCols: 2}),
				oCustomList = new sap.m.CustomListItem({}),//this.getView().byId("customList"),
				oLabel1 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailDate1")}),
				oDate1 = new sap.m.DateTimePicker({}),
				oLabel2 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailDate2")}),
				oDate2 = new sap.m.DateTimePicker({}),
				oLabel3 = new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailIntervenant")}),
				oInput = new sap.m.Input({});
			oForm.addContent(oLabel1);	
			oForm.addContent(oDate1);
			oForm.addContent(oLabel2);
			oForm.addContent(oDate2);
			oForm.addContent(oLabel3);
			oForm.addContent(oInput);
			oCustomList.addContent(oForm);
			var oBar = new sap.m.Bar({
				contentRight: [
					new sap.m.Button({
						icon:"sap-icon://sys-minus", 
						press: function (oEvent) {
							that.onPressRemove(oEvent);
						}
					}),
					new sap.m.Button({
						icon:"sap-icon://sys-add", 
						press: function (oEvent) {
							that.onPressAdd(oEvent);
						}
					})
				]
			});
			oCustomList.addContent(oBar);
			oList.addItem(oCustomList);
		},
		
		onPressRemove: function (oEvent) {
			var oList = this.getView().byId("list");
			if(oList.getItems().length !== 1) {
				if(oEvent.getSource().oParent.oParent.sId === oList.getItems()[oList.getItems().length-1].sId) {
					sap.ui.getCore().byId(oList.getItems()[oList.getItems().length-2].getContent()[1].getContentRight()[1].sId).setVisible(true);
				}
				oList.removeItem(oEvent.getSource().oParent.oParent.sId);
			}
		},
		
		_resetContent: function () {
			var iLength = this.getView().byId("additionalBox").getContent().length;
			if(iLength > 6) {
				for(var i = iLength - 1; i > 6; i--) {
					this.getView().byId("additionalBox").removeContent(i);
				}
			}
		},
		
		onPressSave: function () {
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailConfirmText"),
				sTitle = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailTitleText"),
				sButtonCancel = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailFermer"),
				sButtonSave = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailSave"),
				that = this;
			MessageBox.confirm(sMessage, {
				title: sTitle,
				actions: [sButtonSave, sButtonCancel],
				onClose: function (oAction) {
					if(oAction === sButtonSave) {
						console.log("util.sOperationName!!!!", util.sOperationName);
						that._updateOT();
					}
				}
			});
		},
		
		_updateOT: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl),
				that = this,
				oSelectedOT = {
					"OrderNumber":			util.sOperationName.OrderNumber,
					"SubOperation": 		util.sOperationName.SubOperation,
					"OperationNumber":		util.sOperationName.OperationNumber,
					"WorkCenter":			this.getView().byId("workCenter").getValue()
				},
				oUpdatedPart = {
					"WorkCenter":			this.getView().byId("workCenter").getValue()
				};
			oModel.update("/OrderOperationSet(OrderNumber='" + oSelectedOT.OrderNumber + "',SubOperation='',OperationNumber='" + util.sOperationName.OperationNumber + "')",
				oUpdatedPart, {
				method: "PUT",
				success: (function(oData) {
					var self = that;
    				MessageBox.success("Successfully updated the OT", {
						styleClass: "sapUiSizeCompact",
						actions: ["OK"],
						onClose: function (oAction) {
							if(oAction === "OK") {
								self.backToFollowup();
							}
						}
					});
			
       			}).bind(this),
	       		error: (function(oData) {
	       			console.log(oData);
   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
    					sErrorText = sErrorText.split(":")[1].split("},")[0];
    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
    				MessageBox.error(sFinalText,
						{
							styleClass: "sapUiSizeCompact"
						}
					);	
				})
			});
		},
		
		_createOperation: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
				oEntry = {
				
					 "OrderNumber": this.getView().byId("finalText").getText(),
				//	 "SubOperation": "",
				//	 "OperationNumber": "",
					 "WorkCenter": this.getView().byId("workCenter").getValue()
				};
			oModel.create("/OrderOperationSet", oEntry,
				{
					success: function (oData) {
						var self = that;
						MessageBox.success("Successfully created the operation", {
							styleClass: "sapUiSizeCompact",
							actions: ["OK"],
							onClose: function (oAction) {
								if(oAction === "OK") {
									self.backToFollowup();
								}
							}
						});
			
					},
					error: function (oData) {
						console.log(oData);
	   					var sErrorText = "" + JSON.stringify(oData.responseText.split("\"message\"")[1].split("\"value\"")[1].split("\"innererror\"")[0]);
	    					sErrorText = sErrorText.split(":")[1].split("},")[0];
	    				var sFinalText = sErrorText.substring(2,sErrorText.length-2);
	    				MessageBox.error(sFinalText,
							{
								styleClass: "sapUiSizeCompact"
							}
						);	
					}
				}
			);
		},
		
		onPressArticle: function () {
			this.getRouter().navTo("Article");
		},
		
		onPressCamera: function () {
			function onSuccess(imageData) { 
	    		alert("success");
			}
			function onFail(message) { 
	    		alert("fail" + message); 
			}
			navigator.camera.getPicture(onSuccess, onFail, {  
	    		quality: 50, 
	    		destinationType: Camera.DestinationType.DATA_URL 
			}); 
		},
		
		onPressFileBrowser: function () {
			var fileUpload = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.fileUpload", this);
			this.getView().addDependent(fileUpload);
			fileUpload.open();  
			var sPath = sap.ui.require.toUrl("com/eramet/maintenanceF5D/model") + "/items.json",
				oUploadSet = sap.ui.getCore().byId("UploadSet");
			this.getView().setModel(new JSONModel(sPath));
			oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
		},
		
		onItemAdded: function (oEvent) {
			var aItems = [],
				core = sap.ui.getCore(),
				oElement = {
					"fileName":	oEvent.getParameters().item.mProperties.fileName,
					"mediaType": oEvent.getParameters().item.mProperties.mediaType,
					"uploadState": oEvent.getParameters().item.mProperties.uploadState
				};
			aItems.push(oElement);
			for(var i = 0; i < core.byId("UploadSet").mBindingInfos.items.binding.oList.length; i++) {
				aItems.push(core.byId("UploadSet").mBindingInfos.items.binding.oList[i]);
			}
			this.uploadedModel(aItems);
		}, 
		
		onUploadComplete: function(oEvent) {
			var oUploadCollection = sap.ui.getCore().byId("UploadSet"),
				oData = oUploadCollection.getModel().getData();

			oData.items.unshift({
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": oEvent.getParameter("files")[0].fileName,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",
				"attributes": [
					{
						"title": "Uploaded By",
						"text": "You",
						"active": false
					},
					{
						"title": "Uploaded On",
						"text": new Date(jQuery.now()).toLocaleDateString(),
						"active": false
					},
					{
						"title": "File Size",
						"text": "505000",
						"active": false
					}
				],
				"statuses": [
					{
						"title": "",
						"text": "",
						"state": "None"
					}
				],
				"markers": [
					{
					}
				],
				"selected": false
			});
			this.getView().getModel("uploadedModel").refresh();

			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},
		
		onUploadSelectedButton: function () {
			var oUploadSet = sap.ui.getCore().byId("UploadSet");
			oUploadSet.upload(oUploadSet._oList.getItems());
/*			for(var i = 0; i < this.getView().getModel("uploadedModel").getData().length; i++) {
				console.log(i, ". file: ", this.getView().getModel("uploadedModel").getData()[i]);
				
				if (oUploadSet._oList.getItems()[i].getSelected()) {
					console.log("selected!");
					console.log("state: ", this.getView().getModel("uploadedModel").getData()[i].getUploadState());
					oUploadSet.uploadItem(this.getView().getModel("uploadedModel").getData()[i]);
					console.log("uploaded!");
				}
				
			}*/

/*			oUploadSet.getItems().forEach(function (oItem) {		//	original code //
				if (oItem.getListItem().getSelected()) {			//	original code //
					oUploadSet.uploadItem(oItem);					//	original code //
				}													//	original code //
			});														//	original code //	*/
		},
		
		onDownloadSelectedButton: function () {
			var oUploadSet = sap.ui.getCore().byId("UploadSet");

			oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("uploadDialog").close();
			core.byId("uploadDialog").destroy();
		}
		/*eslint-enable*/
	});

});