/**
 * @namespace WBP.components
 * @class clouddrive
 * @type {{upload: Function, openDialog: Function}}
 */
WBP.prototype.components.clouddrive = {

	/**
	 * Uploads a file to the users CloudDrive
	 *
	 * @param {string} path
	 * @param {string} method
	 * @param {Array} files
	 * @param {Function(XMLHttpResponse)} callback
	 */
	upload: function(path, method, files, callback) {
		var formData = new FormData();
		var xmlhttp = new XMLHttpRequest();
		var counter;

		for (counter = 0; counter < files.length; counter++) {
			formData.append('files[]', files[counter]);
		}

		var access_token = scope.helpers.cookie.get('access_token_' + scope.namespace);

		xmlhttp.onload = function() {
			callback(xmlhttp.responseText);
		};

		xmlhttp.open(method, this.host + "api" + path + "?access_token=" +
			access_token);
		xmlhttp.send(formData);
	},

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
