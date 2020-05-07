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

	return BaseController.extend("com.eramet.maintenanceF5D.controller.Avis.AvisDetail", {
		aDetailAvis: [],
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "AvisDetail") {
				if(util.aDetailAvis && util.aDetailAvis.NotificationNumber) {
					this.aDetailAvis = util.aDetailAvis;
					this._setDisplayModel("R");
					this._setAvisDModel();
					this.getView().byId("breadcrumbs").setCurrentLocationText(this.aDetailAvis.NotificationNumber);
				//	this.getView().byId("avisDetail").setText(util.aDetailAvis.title);
					this.getView().byId("edit").setIcon("sap-icon://edit");
					util.sTitleText = this.aDetailAvis.NotificationNumber;
					this.getView().byId("commentNew").setValue("");
					this.setTitle();
				} else {
					this._setDisplayModel("C");
					var sTile = this.getView().getModel("i18n").getResourceBundle().getText("avisDetailTitle");
					this.getView().byId("breadcrumbs").setCurrentLocationText(sTile);
				//	this.getView().byId("avisDetail").setText(sTile);
					this.avisDetail([]);
					this.getView().byId("commentNew").setValue("");
					util.sTitleText = sTile;
					this._fillEquipmentCombo();
				}
			}
		},

		onAfterRendering: function () {
		//	this.getView().byId("equipmentSelect").getAggregation("_endIcon")[0].setSrc("sap-icon://bar-code");
			var that = this;
			if(this.getView().getModel("avisDetailModel") && this.getView().getModel("avisDetailModel").getData()) {
				var avisDetailModel = this.getView().getModel("avisDetailModel").getData().mode;
				console.log("avisDetailModel:", avisDetailModel);
				
			}
			
			window.addEventListener("online", function(e) {
				if(that.getView().byId("repousser").getVisible() === true && that.getView().byId("demarrer").getVisible() === true) {
					that.getView().byId("repousser").setEnabled(true);
					that.getView().byId("demarrer").setEnabled(true);
				}
			}, false);
			
			
			window.addEventListener("offline", function(e) {
				if(that.getView().byId("repousser").getVisible() === true && that.getView().byId("demarrer").getVisible() === true) {
					var mb = MessageBox;
					that.getView().byId("repousser").setEnabled(false);
					that.getView().byId("demarrer").setEnabled(false);
					mb.error("Refuser l'avis and Démarrer l'OT functions are not available in offline mode!", {});	
				}
			}, false);
		},
		
		_setDisplayModel: function (sValue) {
			var oElement = {},
			aObject = [];
			oElement.mode = sValue;
			aObject.push(oElement);
			this.avisDetailModel(oElement);
		},
		
		onPressEdit: function () {
			if(this.getView().byId("edit").getIcon() === "sap-icon://edit") {
				this._setDisplayModel("E");
				this.getView().byId("edit").setIcon("sap-icon://save");
				this._fillExecutantCombo();
			} else {
				this.getView().byId("edit").setIcon("sap-icon://edit");
				this._setDisplayModel("R");
				this._updateAvis();
			}
		},
		
		onHandleSuggest: function (oEvent) {
			var sInput = this.getView().byId("equipmentSelect").getValue();
			var that = this;
			this.getView().byId("equipmentSelect").setFilterFunction(function (sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});
			var sQueryString, sEntitySet, sUrl, oItemTemplate;
	
			var sEntity = "TechnicalObjectLabel";
			sQueryString = "$filter=substringof('" + sInput.toUpperCase() + "'," + sEntity + ")";
			sEntitySet = "C_TechnicalObjectLabelVH/";
			sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["EAM_OBJPG_MAINTNOTIFICATION_SRV"].uri;
			oItemTemplate = new sap.ui.core.ListItem({
				text: "{path: 'equipmentVHModel>TechnicalObjectLabel'}",
				key: "{path: 'equipmentVHModel>TechnicalObjectLabel'}"
			});
				
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oModel.read(sEntitySet,
				null, 
				[sQueryString],
				true,
				function (oData) {
					that.getView().getModel("equipmentVHModel").setData(oData.results);
					that.getView().byId("equipmentSelect").bindAggregation("suggestionItems", {
						path: "equipmentVHModel>/",
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
				aData = oView.getModel("equipmentVHModel").getData();
			if (aData.length > 0) {
				for (var i = 0; i < aData.length; i++) {
					if (oEvent.getParameters().selectedItem.mProperties.key == aData[i].TechnicalObjectLabel) {
						oView.byId("equipmentSelect").setSelectedKey(aData[i].TechnicalObjectLabel);
						oView.byId("equipmentSelect").setValue(aData[i].TechnicalObjectLabel);
					}
				}
			}
		},
		
		onPressBarcode: function () {
			jQuery.sap.require("sap.ndc.BarcodeScanner");
			var that = this;
			sap.ndc.BarcodeScanner.scan(
				function (mResult) {
					if(mResult.text) {
						that.getView().byId("equipmentSelect").setValue(mResult.text);
					}
				},
				function (Error) {
					alert("Scanning failed: " + Error);
				}
			);
		},
		
		_fillExecutantCombo: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["EAM_OBJPG_MAINTNOTIFICATION_SRV"].uri,
			oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
			that = this;
			oModel.read("I_WrkCtrBySemanticKeyStdVH?$filter=Plant eq 'ZP11'",
				null, null,
				true,
				function (oData) {
					if(oData) {
						console.log("posteExecutantModel:", oData.results);
						var oEmptyElement = {
							"key": "",
							"text": ""
						};
						oData.results.unshift(oEmptyElement);
						that.posteExecutantModel(oData.results);
						that.getView().byId("posteExecutantSelect").setSelectedKey("");
						console.log("combo:", that.getView().getModel("posteExecutantModel").getData());
					} else {
						alert("Empty I_WrkCtrBySemanticKeyStdVH!");
					}
				},
				function () {
					alert("I_WrkCtrBySemanticKeyStdVH service fail");
				}
			)
		},
		
		_fillEquipmentCombo: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["EAM_OBJPG_MAINTNOTIFICATION_SRV"].uri,
			oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
			that = this;
			oModel.read("C_TechnicalObjectLabelVH",
				null, null,
				true,
				function (oData) {
					if(oData) {
						var oEmptyElement = {
							"key": "",
							"text": ""
						};
						oData.results.unshift(oEmptyElement);
						that.equipmentVHModel(oData.results);
				//		that.getView().byId("equipmentSelect").setSelectedKey("");
					} else {
						alert("Empty C_TechnicalObjectLabelVH!");
					}
				},
				function () {
					alert("C_TechnicalObjectLabelVH service fail");
				}
			)
		},
		
		_updateAvis: function () {
			var aOriginal = util.avisDetailOriginal;
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl),
				that = this,
				oUpdatedNofification = {
					"NotificationNumber":			util.avisDetailOriginal.NotificationNumber,
					"LocationWorkCenter": 			this.getView().byId("edit").getIcon() === "sap-icon://save" ? this.aDetailAvis.LocationWorkCenter : this.getView().byId("posteExecutantSelect").getSelectedKey(),
					"TextNew":						this.getView().byId("commentNew").getValue()		
				};
			oModel.update("/NotificationHeaderSet('" + this.aDetailAvis.NotificationNumber + "')", oUpdatedNofification, {
				method: "PUT",
				success: (function(oData) {
    				MessageBox.success("Successfully updated the notification",
						{
							styleClass: "sapUiSizeCompact"
						}
					);
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
			this._setAvisDModel();
			this.backToAvis();
		},
		
		backToHome: function () {
			this.getRouter().navTo("Home");
		},
		
		backToAvis: function () {
		//	this.getRouter().navTo("Avis");
			this.getRouter().navTo("Detail");
		},
		
		onPressCreate: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
				oEntry = {
					// "NotificationNumber": "",
					// "RequiredEndDate": null,
					// "Planplant": "",
					 "TechObjNumber": this.getView().byId("equipmentSelect").getValue(),
					 "ShortText": this.getView().byId("description").getValue(),
					// "EamsTecObjTxt": "",
					// "Priority": "",
					 "Breakdown": this.getView().byId("equipmentCheckbox").getSelected()
					// "LocationWorkCenter": "",
					// "PriorityText": "",
					// "NotificationDate": null,
					// "ReportedBy": "",
					// "ReportedByText": "",
					// "MaintPlant": "",
					// "Effect": ""
				};
			oModel.create("/NotificationHeaderSet", oEntry,
				{
					success: function (oData) {
						MessageBox.success("Successfully saved",
							{
								styleClass: "sapUiSizeCompact"
							}
						);
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
			this.backToHome();
		},
		
		onPressDelete: function () {
			var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_NOTIF_SRV"].uri,
				oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
				sComment = sap.ui.getCore().byId("deleteComment").getValue(),
				that = this,
				oUpdatedNofification = {
					"NotificationNumber":			util.avisDetailOriginal.NotificationNumber,
					"TextNew":						sComment,
					"UserStatusNew":				"E0001"	
				};
			oModel.update("/NotificationHeaderSet('" + this.aDetailAvis.NotificationNumber + "')", oUpdatedNofification,
				{
					success: function (oData) {
						var self = that;
						MessageBox.success("Successfully removed",
							{
								styleClass: "sapUiSizeCompact",	
								actions: ["OK"],
								onClose: function (oAction) {
									if(oAction === "OK") {
										self.onPressClose();
										self.backToAvis();
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
										self.onPressClose();
										self.backToAvis();
									}
								}
							}
						);	
					}
				}
			);
		},
		
		onPressNavBack: function () {
			this.getRouter().navTo("Detail");
		},
		
		onPressRepousser: function () {
			var refusal = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.refusal", this);
			this.getView().addDependent(refusal);
			refusal.open();
		},
		
		onPressDemarrer: function () {
			if(this.aDetailAvis && this.aDetailAvis.OrderNumber && this.aDetailAvis.OrderNumber.length > 0) {
				util.aCreatedOT = this.aDetailAvis.OrderNumber;
				var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
					oModel = new sap.ui.model.odata.ODataModel(sUrl, true),
					that = this;
				oModel.read("OrderHeaderSet?$expand=HeaderToOperations/OperationComponent,HeaderToOperations/MeausurementPoint",
					null, null,
					true,
					function (oData) {
						console.log("oData of OT:", oData);
						if(oData && oData.results && oData.results.length && oData.results.length > 0) {
							util.aOTElements = oData.results;
							that.getRouter().navTo("Operations");
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
				
			//	var sId = this.getView().byId("avisDetail").getText().split("avis ")[1],
	/*			var sId = util.aDetailAvis.title.split("avis ")[1],
					followupListModel = this.getModel("followupListModel").getData();
				util.oSelectedOT = followupListModel[sId-1] && followupListModel[sId-1].title ? followupListModel[sId-1].title.split("N° ")[1] : "OT 0000001";
				util.oSelectedOTFull = followupListModel[sId-1];
				console.log("oSelectedOT: ", util.oSelectedOT);			*/
				
			} else {
			//	this._resetModel();
				var sUrl = com.eramet.maintenanceF5D.Component.getMetadata().getManifestEntry("sap.app").dataSources["ZUI5_GW_PM_ORDER_SRV"].uri,
					oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
					oEntry = {
						"NotificationNumber": this.aDetailAvis.NotificationNumber
					};
				oModel.create("/OrderHeaderSet", oEntry,
					{
						success: function (oData) {
							console.log("oData success:", oData);
							MessageBox.success("Successfully saved",
								{
									styleClass: "sapUiSizeCompact"
								}
							);
						},
						error: function (oData) {
							console.log("oData fail:", oData);
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
			}
		},
		
		onPressClose: function () {
			var core = sap.ui.getCore();
			core.byId("refusalDialog").close();
			core.byId("refusalDialog").destroy();
		},
		
		_setAvisDModel: function () {
			this.avisDetail(this.aDetailAvis);
			console.log("new model:", this.getView().getModel("avisDetail").getData());
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"title": "N° OT 0000001",
			    	"text": "Tube qui fuit",
			    	"date": "21/10/2019",
			    	"equipement": "Trousse de réparation",
			    	"status": "Faible",
			    	"prio":	"Prio 1",
			    	"codePoste": "code poste technique 1",
			    	"description": "Description courte 1",
			    	"type": "Correctif"
				},
				{
					"title": "N° OT 0000002",
					"text": "Verre brisé",
					"date": "18/10/2019",
					"equipement": "Verre coupé à la taille",
					"status": "Moyenne",
			    	"prio":	"Prio 3",
			    	"codePoste": "code poste technique 2",
			    	"description": "Description courte 2",
			    	"type": "Préventif"
				},
				{
					"title": "N° OT 0000003",
					"text": "Plateau cassé",
			    	"date": "17/10/2019",
			    	"equipement": "Charpentier",
		    		"status": "Majeure",
			    	"prio":	"Prio 3",
			    	"codePoste": "code poste technique 3",
			    	"description": "Description courte 3",
			    	"type": "Correctif"
				},
				{
					"title": "N° OT 0000004",
					"text": "Pas de chauffage",
			    	"date": "21/10/2019",
			    	"equipement": "Mécanicien en chauffage",
			    	"status": "Faible",
			    	"prio":	"Prio 2",
			    	"codePoste": "code poste technique 4",
			    	"description": "Description courte 4",
			    	"type": "Préventif"
				},
				{
					"title": "N° OT 0000005",
			    	"text": "Casier cassé",
			    	"date": "15/10/2019",
			    	"equipement": "Serrurier",
		    		"status": "Majeure",
			    	"prio":	"Prio 1",
			    	"codePoste": "code poste technique 5",
			    	"description": "Description courte 5",
			    	"type": "Correctif"
				}
			];
			util.aOTElements = aElements;
			this.followupListModel(aElements);
		},
		
		onPressFileBrowser: function () {
			var avisUpload = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.avisUpload", this);
			this.getView().addDependent(avisUpload);
			avisUpload.open();  
			var sPath = sap.ui.require.toUrl("com/eramet/maintenanceF5D/model") + "/items.json",
				oUploadSet = sap.ui.getCore().byId("avisUploadSet");
			this.getView().setModel(new JSONModel(sPath));
			oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
		},
		
		/**
		 * Test function to create avisUploadedModel
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
			for(var i = 0; i < core.byId("avisUploadSet").mBindingInfos.items.binding.oList.length; i++) {
				aItems.push(core.byId("avisUploadSet").mBindingInfos.items.binding.oList[i]);
			}
			console.log("aItems: ", aItems);
			this.avisUploadedModel(aItems);
		}, 
		
		onPressUpload: function () {
			var fileUpload = sap.ui.xmlfragment("com.eramet.maintenanceF5D.view.fragment.avisUpload", this);
			this.getView().addDependent(fileUpload);
			fileUpload.open();  
			var sPath = sap.ui.require.toUrl("com/eramet/maintenanceF5D/model") + "/items.json",
				oUploadSet = sap.ui.getCore().byId("avisUploadSet");
			this.getView().setModel(new JSONModel(sPath));
			oUploadSet.getList().setMode(MobileLibrary.ListMode.MultiSelect);

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
		},
		
		onUploadComplete: function () {
			var oUploadCollection = sap.ui.getCore().byId("avisUploadSet");
			var oData = oUploadCollection.getModel().getData();

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
			this.getView().getModel("avisUploadedModel").refresh();

			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},
		
		onUploadSelectedButton: function () {
			console.log("is it working?");
			var oUploadSet = sap.ui.getCore().byId("avisUploadSet");
			oUploadSet.upload(oUploadSet._oList.getItems());
		},
		
		onDownloadSelectedButton: function () {
			var oUploadSet = sap.ui.getCore().byId("avisUploadSet");

			oUploadSet.getItems().forEach(function (oItem) {
				if (oItem.getListItem().getSelected()) {
					oItem.download(true);
				}
			});
		},
		
		onPressCloseAvisUploader: function () {
			var core = sap.ui.getCore();
			core.byId("avisUploadDialog").close();
			core.byId("avisUploadDialog").destroy();
		}
		
	});

});