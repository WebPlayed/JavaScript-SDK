WBP.prototype.api = function(path, method, params, callback) {
	var xmlhttp;
	var finalQuery = this.appQuery;
	var url = this.host + "api" + path;

	//Prepare the XMLHttpRequest Object for all browsers.
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	//The state of the object changed
	if (this.async === true) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					//Everything is OK. Return the text.
					callback(xmlhttp);
				} else if (xmlhttp.status === 400) {
					callback(false);
				} else {
					callback(false);
				}
			}
		};
	}


	//Converts the object to a friendly URL query
	params = this.functions.objToQuery(params);

	if (params) {
		finalQuery = finalQuery + '&' + params;
	}

	//Convert the parameters to a GET request
	if (method === 'GET' || method === 'DELETE') {
		url = url + '?' + finalQuery;
	}

	xmlhttp.open(method, url, this.async);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	//Send the request
	xmlhttp.send(finalQuery);

	if (this.async === false) {
		return xmlhttp.responseText;
	}
};
