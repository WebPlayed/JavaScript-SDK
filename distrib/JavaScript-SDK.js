/*! JavaScript-SDK v1.0.0 - 2015-04-05 
 *  License: GNU v2 */
;
(function(window, undefined) {
		'use strict';

function WBP() {} // This is needed so we can extend the object

//Properties
WBP.prototype.namespace = '';
WBP.prototype.apiKey = '';
WBP.prototype.host = 'https://webplayed.com/';
WBP.prototype.asyncRequests = true;
WBP.prototype.onReady = null;

//Scope
WBP.prototype.helpers = {};
WBP.prototype.modules = {};
WBP.prototype.components = {};

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

WBP.prototype.components.navigation = {
	show: function() {

	},

	hide: function() {

	}
};

WBP.prototype.helpers.cookie = {
    get: function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    },

    set: function(name, value, milliseconds) {
        var expires = "";

        if (milliseconds) {
            expires = "; max-age=" + (milliseconds / 1000);
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }
};

WBP.prototype.helpers.http = {
    //@todo Create a generic Ajax function
    ajax: function(){

    }
};

WBP.prototype.helpers.url = {
	getHashValue: function(key) {
		return location.hash.match(new RegExp(key + '=([^&]*)'))[1];
	},

	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};

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

//Initialize WBP
WBP.prototype.init = function(options) {
    this.asyncRequests = options.async;
    this.namespace = options.namespace;

    if (typeof options.ready !== 'undefined') {
        this.onReady = options.ready;
    }
};

//The namespace we are working in.



WBP.prototype.modules.authenticate = {
	isAuthenticated: function() {
		var access_token = WBP.helpers.cookie.get('wbp_access_token_' + this.namespace);

		if (window.location.hash !== '') {
			WBP.helpers.cookie.set('wbp_access_token_' + WBP.namespace, WBP.helpers.url.getHashValue(
				'access_token'), WBP.helpers.url.getHashValue('expires_in'));
			return true;
		}

		if (access_token === null || typeof access_token === 'undefined') {
			return false;
		}

		return true;

	},
	authenticate: function(popup, uri) {
		var oauthUrl = WBP.host + "oauth2/authorize?response_type=token&client_id=" + WBP.namespace + "&state=xys";

		//If a redirect URI is defined add it to the URL.
		if (uri) {
			oauthUrl += "&redirect_uri=" + options.redirectUri;
		}

		oauthUrl += "&access_token=" + WBP.helpers.url.getParameterByName('server_token');

		//Want a popup or just a redirect?
		if (popup) {

			var response = new WBP.modules.authenticate.authenticateResponse();

			window.hashUpdate = function() {
				if (window.loginWindow.closed) {
					window.clearInterval(intervalId);
					WBP.helpers.cookie.set('wbp_access_token_' + WBP.namespace, response.access_token, response.expires_in);
					WBP.appQuery = WBP.functions.objToQuery({
						access_token: response.access_token
					});

					if (WBP.onReady !== null) {
						WBP.onReady();
					}

				} else {
					var url = window.loginWindow.document.URL;
					var tabUrl = url.split('#');
					var paramString = tabUrl[1];

					if (typeof paramString !== 'undefined') {
						var allParam = paramString.split("&");
						for (var i = 0; i < allParam.length; i++) {
							var oneParamKeyValue = allParam[i].split("=");
							response[oneParamKeyValue[0]] = oneParamKeyValue[1];
						}


						setTimeout(function() {
							window.loginWindow.close();
						}, 1500);
					}
				}
			};

			window.loginWindow = window.open(oauthUrl, 'Authenticate Permissions', false);
			intervalId = window.setInterval(window.hashUpdate, 500);

		} else {
			window.location.href = oauthUrl;
		}
	},

	authenticateResponse: function(){
		this.access_token = null;
		this.expires_in = null;
	}
};

    window.WBP = new WBP();
    }(window));
