/**
 * @namespace WBP.components
 * @class clouddrive
 * @type {{upload: Function, openDialog: Function}}
 */
WBP.prototype.components.clouddrive = {

	/**
	 * Opens a CloudDrive dialog where the user can select a file and pass this to your app
	 *
	 * @param {Function(url)} callback
	 */
	openDialog: function(callback){
		scope.driveCallback = callback;
		window.open(scope.host + 'dialog/drive', 'Choose a file', 'height=400,width=600');
	}
};
