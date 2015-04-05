WBP.prototype.components.clouddrive = {
	upload: function(path, method, files, callback) {
		var formData = new FormData();
		var xmlhttp = new XMLHttpRequest();
		var counter;

		for (counter = 0; counter < files.length; counter++) {
			formData.append('files[]', files[counter]);
		}

		var access_token = WBP.functions.cookie.get('access_token_' + WBP.appNamespace);

		xmlhttp.onload = function() {
			callback(xmlhttp.responseText);
		};

		xmlhttp.open(method, this.host + "api" + path + "?access_token=" +
			access_token);
		xmlhttp.send(formData);
	}
};
