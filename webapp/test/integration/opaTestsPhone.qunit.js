/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"webapp/Crud_Operation_for_User/test/integration/PhoneJourneys"
	], function () {
		QUnit.start();
	});
});
