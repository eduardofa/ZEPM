/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tra03_04/epm_04/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
