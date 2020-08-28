sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, mobileLibrary,MessageToast) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("webapp.Crud_Operation_for_User.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0
			});
			
			var oViewM = new sap.ui.model.json.JSONModel();
        	oViewModel.setData({
        		
        		
        		myVis: true
        		
        	});
        	this.getView().setModel(oViewModel, "sampleModel");

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},



		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("zuserinfoSet", {
					Userid :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.Userid,
				sObjectName = oObject.Firstname,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},
       onCreate:function()
       {
         var uId1 = this.getView().byId("input_01").getValue();
          var uId2 = this.getView().byId("input_02").getValue();
           var uId3 = this.getView().byId("input_03").getValue();
            var uId4 = this.getView().byId("input_04").getValue();
             var uId5 = this.getView().byId("input_05").getValue();
             var postData = {};
             postData.Userid = uId1;
             postData.Firstname = uId2;
             postData.Lastname =uId3;
             postData.Email = uId4;
             postData.Phone = uId5;
             this.getOwnerComponent().getModel().create("/zuserinfoSet", postData, null, function(response)
             {
             	MessageToast.show("User Id Created Successfully" + uId1);
             	var mylocation = location;
             	mylocation.reload();
             },
             function (Error){
             	MessageToast.show("User Id Creation Failed" + uId1);
             }
             );
      
       },
       onDelete:function()
       {
       	var usId = this.getView().byId("input_01").getValue();
       	this.getOwnerComponent().getModel().remove("/zuserinfoSet('"  + usId + "')",{
       		method: "DELETE",
       		success: function( data ){
       			MessageToast.show("Customer delete Successfully with number " + usId);
       			
       		},
       		error: function(e)  
       		{
       		MessageToast.show("User Deletaion Failed" + usId);
       		}
       	});
       	
       },
       onEdit:function()
       {
       	 var uId1 = this.getView().byId("input_01").getValue();
          var uId2 = this.getView().byId("input_02").getValue();
           var uId3 = this.getView().byId("input_03").getValue();
            var uId4 = this.getView().byId("input_04").getValue();
             var uId5 = this.getView().byId("input_05").getValue();
             var postData = {};
             postData.Userid = uId1;
             postData.Firstname = uId2;
             postData.Lastname =uId3;
             postData.Email = uId4;
             postData.Phone = uId5;
             this.getOwnerComponent().getModel().update("/zuserinfoSet('" + uId1 + "')", 
             postData, null, 
             function(response){
             	MessageToast.show("User Update Successfully with Number" +uId1);
             	var mylocation = location;
             	mylocation.reload();
             },
             function(Error)
             {
             	MessageToast.show("User Update Failed" + uId1);
             });
       },
             
		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},
	
		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
		}
	});

});