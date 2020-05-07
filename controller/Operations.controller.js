sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"	
], function (BaseController, util, formatter) {

	return BaseController.extend("com.eramet.depanneur.HATDepanneurApp.controller.Operations", {
		aChangedButtons: [],
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Operations") {
			//	this.getView().byId("finalText").setText(util.oSelectedOT);
				var sTile = this.getView().getModel("i18n").getResourceBundle().getText("operationsTitle");
				this.getView().byId("otNumber").setText(util.oSelectedOT);
				this.getView().byId("desc").setText(util.oSelectedOTFull.description);
				this.getView().byId("date").setText(util.oSelectedOTFull.date);
				this.getView().byId("operations").setTitle(sTile);
				this._resetModel();
			}
		},
		
		_resetModel: function () {
			var aElements = [
				{
					"operation": "N° operation 0001",
			    	"description": "Description 1",
			    	"visibleSub": false,
			    	"counter": "15/20",
			    	"src": "sap-icon://synchronize",
			    	"nodes": [
			    		{
			    			"operationSub": "Sous-opération 1",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 2",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
			    			"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 3",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
			    			"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 4",
			    			"description": "",
			    			"visibleSub": true,
			    			"visibleCount": false,
			    			"subSrc": "sap-icon://synchronize"
			    		}
			    	]
				},
				{
					"operation": "N° operation 0002",
					"description": "Description 2",
					"visibleSub": false,
					"counter": "8/17",
					"src": "sap-icon://synchronize",
					"nodes": [
			    		{
			    			"operationSub": "Sous-opération 1",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 2",
			    			"description": "",
			    			"visibleSub": true,
			    			"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		}
			    	]
				},
				{
					"operation": "N° operation 0003",
					"description": "Description 3",
					"visibleSub": false,
					"counter": "3/10",
					"src": "sap-icon://accept",
					"nodes": [
			    		{
			    			"operationSub": "Sous-opération 1",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		}
			    	]
				},
				{
					"operation": "N° operation 0004",
					"description": "Description 4",
					"visibleSub": false,
					"counter": "2/14",
					"src": "sap-icon://accept",
					"nodes": [
			    		{
			    			"operationSub": "Sous-opération 1",
			    			"description": "",
			    			"visibleSub": true,
			    			"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		}
			    	]
				},
				{
					"operation": "N° operation 0005",
			    	"description": "Description 5",
		    		"visibleSub": false,
	    			"counter": "6/20",
	    			"src": "sap-icon://synchronize",
			    	"nodes": [
			    		{
			    			"operationSub": "Sous-opération 1",
			    			"description": "",
			    			"visibleSub": true,
			    			"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 2",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 3",
			    			"description": "",
			    			"visibleSub": true,
			    			"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		},
	    				{
			    			"operationSub": "Sous-opération 4",
			    			"description": "",
		    				"visibleSub": true,
		    				"visibleCount": false,
		    				"subSrc": "sap-icon://synchronize"
			    		}
			    	]
				}
			];
			util.aTreeElements = aElements;
			this.treeModel(aElements);
			this._resetIcons();
		},
		
		backToHome: function () {
			this._resetModel();
			this.getRouter().navTo("Home");
		},
		
		backToWorkPage: function () {
			this._resetModel();
			this.getRouter().navTo("WorkPage");
		},
		
		backToFollowup: function () {
			this._resetModel();
			this.getRouter().navTo("Followup");
		},
		
		onPressNavToOTDetail: function () {
			this._resetModel();
			this.getRouter().navTo("OTDetail");
		},
		
		onPressNavToOpDetail: function (oEvent) {
			/* eslint-disable */
			var sPath = oEvent.getSource().oBindingContexts.treeModel.sPath;
			sPath = sPath.split("/")[1];
			if(sPath.indexOf("/") > -1) {
				sPath = sPath.split("/")[0];
			}
			util.sOperationName = this.getView().byId("Tree").getModel("treeModel").getData()[sPath];
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
				}
			}
			this.aChangedButtons = [];
		}

	});

});