sap.ui.define([
	"com/eramet/maintenanceF5D/controller/BaseController",
	"com/eramet/maintenanceF5D/util/util",
	"com/eramet/maintenanceF5D/util/formatter"
], function (BaseController, util, formatter) {
	"use strict";

	return BaseController.extend("com.eramet.maintenanceF5D.controller.OT.Filter", {
		$this : this.$(),
		
		onInit: function () {
			this.getRouter().attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Filter") {
				if (util.otFilters && util.otFilters[0]) {
					this._setFilters();
					this._overWriteLabels();
					var sTitle = this.getView().getModel("i18n").getResourceBundle().getText("filterTitle");
				//	this.setTitle(sTitle);
					
					util.sTitleText = sTitle;
					this.setTitle();	
				}
			}
		},
		
		onAfterRendering: function () {
			var aSliderLabels = document.getElementsByClassName("sapMSliderLabel");
			var sNewLabels = ["En course", "1", "3", "6", "6+" ];
			for (var i = 0; i < aSliderLabels.length; i++){
				aSliderLabels[i].textContent = sNewLabels[i];
			}
		},

		_overWriteLabels: function () {
			var aElements = [{
				"label": "En Cours"
			}, {
				"label": "1"
			}, {
				"label": "3"
			}, {
				"label": "6"
			}, {
				"label": "6+"
			}];
			this.filterLabelModel(aElements);
		},

		_setFilters: function () {
			this.getView().byId("prio1").setType("Default");
			this.getView().byId("prio2").setType("Default");
			this.getView().byId("prio3").setType("Default");
			if (util.otFilters[0].prio1) {
				this.getView().byId("prio1").setType("Accept");
			}
			if (util.otFilters[0].prio2) {
				this.getView().byId("prio2").setType("Accept");
			}
			if (util.otFilters[0].prio3) {
				this.getView().byId("prio3").setType("Accept");
			}
			this.getView().byId("rangeSlider").setRange([util.otFilters[0].range1, util.otFilters[0].range2]);
		},

		onPressNavBack: function () {
			var oFilter = {
				"prio1": this.getView().byId("prio1").getType() === "Accept" ? true : false,
				"prio2": this.getView().byId("prio2").getType() === "Accept" ? true : false,
				"prio3": this.getView().byId("prio3").getType() === "Accept" ? true : false,
				"range1": this.getView().byId("rangeSlider").getRange()[0] < this.getView().byId("rangeSlider").getRange()[1] ?
					this.getView().byId("rangeSlider").getRange()[0] : this.getView().byId("rangeSlider").getRange()[1],
				"range2": this.getView().byId("rangeSlider").getRange()[1] > this.getView().byId("rangeSlider").getRange()[0] ?
					this.getView().byId("rangeSlider").getRange()[1] : this.getView().byId("rangeSlider").getRange()[0]
			};
			util.otFilters = [oFilter];
			this.getRouter().navTo("Followup");
		},

		onPressPrio: function (oEvent) {
			if (this.getView().byId(oEvent.getSource().sId).getType() === "Default") {
				this.getView().byId(oEvent.getSource().sId).setType("Accept");
			} else {
				this.getView().byId(oEvent.getSource().sId).setType("Default");
			}
		},

		onPressCancel: function () {
			util.otFilters = [];
			this.getView().byId("prio1").setType("Default");
			this.getView().byId("prio2").setType("Default");
			this.getView().byId("prio3").setType("Default");
			this.getView().byId("rangeSlider").setRange([0, 4]);
			this.getRouter().navTo("Followup");
		}

	});

});