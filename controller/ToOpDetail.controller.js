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
	
	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.ToOpDetail", {

		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "ToOpDetail") {
				var sText = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailTitle");
				this.getView().byId("finalText").setText(util.oSelectedOT);
				this.getView().byId("finalText").setTooltip(util.oSelectedOT);
				this.treeModel(util.sOperationName);
				this.getView().byId("subOperations").setText(util.sOperationName.operation);
				this.getView().byId("toOpDetail").setTitle(sText + " " + util.sOperationName.operation.split(" ")[2]);
				this.getView().byId("finalText2").setText(sText + " " + util.sOperationName.operation.split(" ")[2]);
				this.getView().byId("finalText2").setTooltip(sText + " " + util.sOperationName.operation.split(" ")[2]);
				this._resetContent();
			}
		},
		
		backToHome: function () {
			this._resetContent();	
			this.getRouter().navTo("Home");
		},
		
		backToWorkPage: function () {
			this.getRouter().navTo("WorkPage");
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
			/*eslint-disable*/
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
			/* eslint-enable */ 
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
				sButtonSave = this.getView().getModel("i18n").getResourceBundle().getText("toOpDetailSave");
			MessageBox.confirm(sMessage, {
				title: sTitle,
				actions: [sButtonSave, sButtonCancel],
				onClose: function (oAction) {}
			});
		},
		
		onPressArticle: function () {
			this.getRouter().navTo("Article");
		},
		
		onPressCamera: function () {
			/*eslint-disable*/
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
		   	/*eslint-enable*/
		},
		
		onPressFileBrowser: function () {
			var fileUpload = sap.ui.xmlfragment("com.eramet.depanneur.HATDepanneurApp.view.fragment.fileUpload", this);
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
		
		/**
		 * Test function to create uploadedModel
		 * */
		onItemAdded: function (oEvent) {
			/*eslint-disable*/
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
			console.log("aItems: ", aItems);
			this.uploadedModel(aItems);
		}, 
		
		onUploadSelectedButton: function () {
			console.log("is it working?");
			var oUploadSet = sap.ui.getCore().byId("UploadSet");
			
			console.log("uploadedModel:", this.getView().getModel("uploadedModel").getData());
			
			
			console.log("oUploadSet:", oUploadSet);
			console.log("oUploadSet:", oUploadSet._mListItemIdToItemMap);
			
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