sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createLocalModel: function(oView, oData, sName) {
			var oInitData = typeof oData === "undefined" ? {} : oData;
			oView.setModel(new JSONModel(oInitData), sName);
		},
		
		createHeaderModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "headerModel");
		},
		
		tilesModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "tilesModel");
		},
		
		menuTitleModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "menuTitleModel");
		},
		
		listModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "listModel");
		},
		
		treeModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "treeModel");
		},
		
		posteExecutantModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "posteExecutantModel");
		},
		
		equipmentVHModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "equipmentVHModel");
		},
		
		rondierModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "rondierModel");
		},
		
		filterLabelModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "filterLabelModel");
		},
		
		/** Data for the selected avis in AvisDetail.view */  
		avisDetail: function(oView, oData) {
			this.createLocalModel(oView, oData, "avisDetail");
		},
		
		followupListModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "followupListModel");
		},
		
		workCenterModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "workCenterModel");
		},
		
		infoEquipmentModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "infoEquipmentModel");
		},
		
		equipmentViewModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "equipmentViewModel");
		},
		
		avisRattachesModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "avisRattachesModel");
		},
		
		avisDetailModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "avisDetailModel");
		},
		
		infoStockModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "infoStockModel");
		},
		
		testModel1: function(oView, oData) {
			this.createLocalModel(oView, oData, "testModel1");
		},
		
		testModel2: function(oView, oData) {
			this.createLocalModel(oView, oData, "testModel2");
		},
		
		otViewModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "otViewModel");
		},
		
		otDetailModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "otDetailModel");
		},
		
		opViewModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "opViewModel");
		},
		
		opDetailModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "opDetailModel");
		},
		
		avisUploadedModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "avisUploadedModel");
		},
		
		uploadedModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "uploadedModel");
		},
		
		articleModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "articleModel");
		},
		
		documentModel: function(oView, oData) {
			this.createLocalModel(oView, oData, "documentModel");
		}

	};
});