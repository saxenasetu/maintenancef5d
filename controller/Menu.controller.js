sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.Menu", {
		bExpanded: false,
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
			this.applyTheme("sap_fiori_3");
			this.createHeaderModel();
			this.menuTitleModel();
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") && oEvent.getParameter("name") === "Home") {
				this.setViewName(oEvent.getParameter("name"));
				var sValue = this.getView().byId("customer").getText();
				this._setDisplayModel(sValue);
				var oElement = {
					"visible": false
				};
			} else {
				oElement = {
					"visible": true
				};
			}
			this.createHeaderModel(oElement);
			var that = this;
			setTimeout(function() {
				that.setTitle();
			}, 100);
		},
		
		onAfterRendering: function () {
			this._setTiles("depanner");

		},
		
		_checkConnection: function () {
			this.getView().byId("connected").setVisible(false);
			this.getView().byId("deconnected").setVisible(false);
			var that = this;
			if (navigator.onLine) {
				console.log("online");
				this.getView().byId("connected").setVisible(true);
				this.getView().byId("deconnected").setVisible(false);
			} else {
    			console.log("offline");
    			this.getView().byId("connected").setVisible(false);
				this.getView().byId("deconnected").setVisible(true);
			} 
			window.addEventListener('load', function(e) {
				that.getView().byId("connected").setVisible(false);
				that.getView().byId("deconnected").setVisible(false);
				
				if (navigator.onLine) {
					console.log("online");
					that.getView().byId("connected").setVisible(true);
					that.getView().byId("deconnected").setVisible(false);
				} else {
	    			console.log("offline");
    				that.getView().byId("connected").setVisible(false);
	    			that.getView().byId("deconnected").setVisible(true);
				} 
			}, false);
			
			window.addEventListener('online', function(e) {
				console.log("now it is online");
				that.getView().byId("connected").setVisible(true);
				that.getView().byId("deconnected").setVisible(false);
			}, false);
			
			window.addEventListener('offline', function(e) {
				console.log("now it is offline");
				that.getView().byId("connected").setVisible(false);
				that.getView().byId("deconnected").setVisible(true);
			  // Use offine mode.
			}, false);
		},
		
		_setHomeIcon: function (bVisible) {
			this.getView().byId("homeButton").setVisible(bVisible);
		},
		
		onCollapseExpandPress: function () {
			var that = this;
			var oSideNavigation = this.getView().byId("sideNavigation");
			var bExpanded = oSideNavigation.getExpanded();
			this._checkConnection();
			if(bExpanded === false) {
				oSideNavigation.setVisible(true);
				setTimeout(function () {
					that.getView().byId("sideNavigation").setExpanded(true);
				}, 100);
			} else {
				oSideNavigation.setExpanded(false);
				setTimeout(function () {
					that.getView().byId("sideNavigation").setVisible(false);
				}, 1000);
			}
			//	oSideNavigation.setExpanded(!bExpanded);
		
			// if(!bExpanded) {
			//	oSideNavigation.addStyleClass("closeMenu");
			// } else {
			// 	oSideNavigation.removeStyleClass("closeMenu");
			// }
	
			// 	oSideNavigation.setVisible(!bExpanded);
			// }
		},
		
		onPressFlush: function () {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.flushStore1();
				sap.hybrid.flushStore2();
				sap.hybrid.flushStore3();
				sap.hybrid.flushStore4();
			}
		},
		
		onPressRefresh: function () {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.refreshStore1();
				sap.hybrid.refreshStore2();
				sap.hybrid.refreshStore3();
				sap.hybrid.refreshStore4();
			}
		}

	});

});