jQuery.sap.declare("com.eramet.maintenanceF5D.util.formatter");
com.eramet.maintenanceF5D.util.formatter = {
	/*eslint-disable */
	setEffect:  function (sStatus) {
		if (sStatus === "5") {
			return "Success";
		} else if (sStatus === "3") {
			return "Warning";
		} else if (sStatus === "2"){
			return "Error";
		} else {
			return "None";
		}
	},
	
	setPrioStatus: function (sStatus) {
		if (sStatus === "3") {
			return "Success";
		} else if (sStatus === "2") {
			return "Warning";
		} else if (sStatus === "1"){
			return "Error";
		} else {
			return "None";
		}	
	},
	
	setNumber: function (sValue) {
		if (parseInt(sValue) > 10) {
			return "Success";
		} else if (parseInt(sValue) >= 5 && parseInt(sValue) <= 10) {
			return "Warning";
		} else {
			return "Error";
		}
	},
	
	setVisibleModeC: function (sValue) {
		bVisible = true;
		if(sValue === "R") {
			bVisible = false;
		}
		if(sValue === "C") {
			bVisible = true;
		}
		if(sValue === "E") {
			bVisible = false;
		}
		return bVisible;
	},
	
	setVisibleModeE: function (sValue) {
		bVisible = true;
		if(sValue === "R") {
			bVisible = false;
		}
		if(sValue === "C") {
			bVisible = false;
		}
		if(sValue === "E") {
			bVisible = true;
		}
		return bVisible;
	},
	
	setVisibleModeR: function (sValue) {
		bVisible = true;
		if(sValue === "R") {
			bVisible = true;
		}
		if(sValue === "C") {
			bVisible = false;
		}
		if(sValue === "E") {
			bVisible = false;
		}
		return bVisible;
	},
	
	setVisibleModeRE: function (sValue) {
		bVisible = true;
		if(sValue === "R") {
			bVisible = true;
		}
		if(sValue === "C") {
			bVisible = false;
		}
		if(sValue === "E") {
			bVisible = true;
		}
		return bVisible;
	},
	
	setVisibleModeRC: function (sValue) {
		console.log("sValue", sValue);
		bVisible = true;
		if(sValue === "R") {
			bVisible = true;
		}
		if(sValue === "C") {
			bVisible = true;
		}
		if(sValue === "E") {
			bVisible = false;
		}
		return bVisible;
	},
	
	setVisibleModeCE: function (sValue) {
		console.log("sValue", sValue);
		bVisible = true;
		if(sValue === "R") {
			bVisible = false;
		}
		if(sValue === "C") {
			bVisible = true;
		}
		if(sValue === "E") {
			bVisible = true;
		}
		return bVisible;
	},
	
	setDisplayModeRC: function (sValue) {
		bEditable = true;
		if(sValue === "R") {
			bEditable = false;
		}
		if(sValue === "E") {
			bEditable = false;
		}
		if(sValue === "C") {
			bEditable = true;
		}
		return bEditable;
	},
	
	setDisplayModeRCE: function (sValue) {
		bEditable = true;
		if(sValue === "R") {
			bEditable = false;
		}
		if(sValue === "C") {
			bEditable = true;
		}
		if(sValue === "E") {
			bEditable = true;
		}
		return bEditable;
	},
	
	setEditButton: function (sValue) {
		bVisible = true;
		if(sValue === "R") {
			bVisible = true;
		}
		if(sValue === "C") {
			bVisible = false;
		}
		return bVisible;
	},
	
	setCreateButtons: function (sValue) {
		bVisible = true;
		if(sValue === "C") {
			bVisible = true;
		} else {
			bVisible = false;
		}
		return bVisible;
	},
	
	setTile1Visibility: function (sValue) {
		var bVisible = true;
		if(sValue === "R") {
			bVisible = false;
		} else {
			bVisible = true;
		}
		return bVisible;
	},
	
	setTile2Visibility: function (sValue) {
		var bVisible = true;
		if(sValue === "R" ) {
			bVisible = false;
		} else {
			bVisible = true;
		}
		return bVisible;
	},
	
	setTile3Visibility: function (sValue) {
		var bVisible = true;
		if(sValue === "T" || sValue === "D" || sValue === "") {
			bVisible = false;
		} else {
			bVisible = true;
		}
		return bVisible;
	},
	
	setAvisVisibility: function (bInputVisibility) {
		var bVisible = false;
		if(!bInputVisibility) {
			bVisible = true;
		} else {
			bVisible = false;
		}
		return bVisible; 
	},
	
	avisDate: function (sValue) {
		var dNew = new Date(sValue);
		return dNew.toLocaleDateString();
	},
	
	setPriorityVisibility: function (sValue) {
		var bVisible = false;
		if(sValue) {
			if(sValue.length > 0) {
				bVisible = true;
			}
		}
		return bVisible;
	},
	
	setRemoveButton: function (sValue) {
		var bEditable = true;
		if(sValue) {
			if(sValue.length > 0) {
				bEditable = false;
			}
		}
		return bEditable;
	},
	
	setOperationDetailButton: function (sValue) {
		var bVisible = false;
		if(sValue) {
			if(sValue.length > 0 && sValue === "ZMIN") {
				bVisible = true;
			}
		}
		return bVisible;
	}
	
	/*eslint-enable */
};