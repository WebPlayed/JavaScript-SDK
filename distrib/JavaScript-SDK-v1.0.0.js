/*! JavaScript-SDK v1.0.0 - 2015-04-25 
 *  License: GNU v2 */
;
(function(window, undefined) {
		'use strict';

function WBP() {} // This is needed so we can extend the object

//Properties
WBP.prototype.namespace = '';
WBP.prototype.apiKey = '';
WBP.prototype.host = '{{DOMAIN}}';
WBP.prototype.appQuery = '';
WBP.prototype.asyncRequests = true;
WBP.prototype.driveCallback = null;
WBP.prototype.onReady = null;
WBP.prototype.isAlive = false;
WBP.prototype.onAliveCallback = null;


//Scope
WBP.prototype.helpers = {};
WBP.prototype.modules = {};
WBP.prototype.components = {};

var scope = new WBP();

/**
 * Created by franklinwaller on 06/04/15.
 */
WBP.prototype.components.autoSdk = {
    execute: function(){
        var localStorageItems = JSON.parse(scope.api('/DataSync', 'GET', {})).Result;

        for(var key in localStorageItems){
            if(localStorageItems.hasOwnProperty(key)){
                localStorage.setItem(localStorageItems[key].variable, localStorageItems[key].value);
            }
        }

        //localStorage.setItem reconstructed
        var localStorage_setItem = localStorage.setItem;

        localStorage.setItem = function(key, value) {
            localStorage_setItem.apply(this, arguments);

            scope.asyncRequests = true;

            if (scope.components.autoSdk.isJSON(value)) {

                scope.api('/JsonSync', 'POST', {
                    variable: key,
                    value: value
                }, function(xmlhttp) {

                });
            } else {
                scope.api('/DataSync', 'POST', {
                    variable: key,
                    value: value
                }, function(xmlhttp) {

                });
            }
        };

        //LocalStorage.removeItem reconstructed
        var localStorage_removeItem = localStorage.removeItem;

        localStorage.removeItem = function(key) {
            scope.asyncRequests = false;

            scope.api('/DataSync/' + key, 'DELETE', {});

            return localStorage_removeItem.apply(this, arguments);
        };

        //Making the application iOS web app compatible
        var head = document.getElementsByTagName('head')[0];

        var appleWebApp = document.createElement('meta');
        appleWebApp.name = "mobile-web-app-capable";
        appleWebApp.content = "yes";

        var appleWebAppPrefix = document.createElement('meta');
        appleWebAppPrefix.name = "apple-mobile-web-app-capable";
        appleWebAppPrefix.content = "yes";

        var appleWebAppStatusBar = document.createElement('meta');
        appleWebAppStatusBar.name = "apple-mobile-web-app-status-bar-style";
        appleWebAppStatusBar.content = "black";

        scope.asyncRequests = false;

        var res = JSON.parse(scope.api('/Store/' + scope.namespace, 'GET', {}));

        scope.asyncRequests = true;

        var appleWebAppTitle = document.createElement('meta');
        appleWebAppTitle.name = "apple-mobile-web-app-title";
        appleWebAppTitle.content = res.title;

        var appleWebAppIcon = document.createElement('link');
        appleWebAppIcon.href = res.icon;
        appleWebAppIcon.rel = "apple-touch-icon";

        head.appendChild(appleWebAppTitle);
        head.appendChild(appleWebAppIcon);
        head.appendChild(appleWebApp);
        head.appendChild(appleWebAppPrefix);
        head.appendChild(appleWebAppStatusBar);
    },

    isJSON: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
};
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

WBP.prototype.components.navigation = {
	show: function() {
		wbpSource.postMessage('navigation.show', '*');
	},

	hide: function() {
		wbpSource.postMessage('navigation.hide', '*');
	}
};

/**
 * Created by franklinwaller on 06/04/15.
 */
WBP.prototype.components.purchase = {
    makePurchase: function(itemId, success, cancel){

        var intervalId;
        var response = new scope.components.purchase.purchaseResponse();
        var callbacks = {
            success: success,
            cancel: cancel
        };


        window.purchaseUpdate = function(){
            if(window.purchaseWindow.closed){
                window.clearInterval(intervalId);

                if(typeof response !== 'undefined') {
                    if(response.approved !== null){
                        if(response.approved === 'true') {
                            callbacks.success();
                            return;
                        } else {
                            callbacks.cancel();
                            return;
                        }
                    }
                }

                callbacks.cancel();

            } else { //This will fail a couple of times during the process of purchasing since SSL.

                var url = window.purchaseWindow.document.URL;
                var tabUrl = url.split('?');
                var paramString = tabUrl[1];

                if(typeof paramString !== 'undefined') {
                    var allParam = paramString.split("&");
                    for (var i = 0; i < allParam.length; i++) {
                        var oneParamKeyValue = allParam[i].split("=");
                        response[oneParamKeyValue[0]] = oneParamKeyValue[1];
                    }
                }

                if(typeof response !== 'undefined') {
                    if (response.approved !== null) {
                        setTimeout(function () {
                            window.purchaseWindow.close();
                        }, 1500);
                    }
                }
            }
        };

        window.purchaseWindow = window.open(scope.host + 'purchase/' + scope.namespace + '/' + itemId, 'In App Purchase', 'height=800,width=1024');
        intervalId = window.setInterval(window.purchaseUpdate, 500);

    },


    purchaseResponse: function(){
        this.approved = null;
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

/**
 * Created by franklinwaller on 06/04/15.
 */

var wbpSource = null;

function receiveMessage(event)
{
    wbpSource = event.source;
    scope.isAlive = true;
    scope.onAliveCallback();
}
WBP.prototype.helpers.url = {
	getHashValue: function(key) {
		return location.hash.match(new RegExp(key + '=([^&]*)'))[1];
	},

	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	objToQuery: function(obj) {
		var parts = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
			}
		}
		return parts.join('&');
	}

};

WBP.prototype.api = function(path, method, params, callback) {
	var xmlhttp;
	var finalQuery = scope.appQuery;
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
	if (scope.asyncRequests === true) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				callback(xmlhttp);
			}
		};
	}


	//Converts the object to a friendly URL query
	params = scope.helpers.url.objToQuery(params);

	if (params) {
		finalQuery = finalQuery + '&' + params;
	}

	//Convert the parameters to a GET request
	if (method === 'GET' || method === 'DELETE') {
		url = url + '?' + finalQuery;
	}

	xmlhttp.open(method, url, scope.asyncRequests);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	//Send the request
	xmlhttp.send(finalQuery);

	if (scope.asyncRequests === false) {
		return xmlhttp.responseText;
	}
};

//Initialize WBP
WBP.prototype.init = function(options) {
    if(options.async) {
        scope.asyncRequests = options.async;
    }

    scope.namespace = options.namespace;

    if (typeof options.ready !== 'undefined') {
        scope.onReady = options.ready;
    }

    if(scope.modules.authenticate.isAuthenticated()){
        scope.appQuery = scope.helpers.url.objToQuery({
            access_token: scope.helpers.cookie.get('wbp_access_token_' + scope.namespace)
        });

        if (scope.onReady !== null) {
            scope.onReady();
        }
    } else {
        scope.modules.authenticate.startAuthenticate(options.popup, options.redirectUri);
    }

    if(options.auto === true) {
        scope.asyncRequests = false;
        scope.components.autoSdk.execute();
    }
};


WBP.prototype.onAlive = function(callback){
    scope.onAliveCallback = callback;
    window.addEventListener("message", receiveMessage, false);
};


//The namespace we are working in.
WBP.prototype.modules.authenticate = {
    isAuthenticated: function() {
        var access_token = scope.helpers.cookie.get('wbp_access_token_' +
            scope.namespace);

        if (window.location.hash !== '') {
            scope.helpers.cookie.set('wbp_access_token_' + scope.namespace,
                scope.helpers.url.getHashValue(
                    'access_token'), scope.helpers.url.getHashValue(
                    'expires_in'));
            return true;
        }

        if (access_token === null || typeof access_token ===
            'undefined') {
            return false;
        }

        return true;

    },
    startAuthenticate: function(popup, uri) {
        var oauthUrl = scope.host +
            "oauth2/authorize?response_type=token&client_id=" + scope.namespace +
            "&state=xys";

        //If a redirect URI is defined add it to the URL. Lets not do this for security reasons.
        //if (uri) {
        //	oauthUrl += "&redirect_uri=" + options.redirectUri;
        //}

        oauthUrl += "&access_token=" + scope.helpers.url.getParameterByName(
            'server_token');

        //Want a popup or just a redirect?
        if (popup) {

            var response = new scope.modules.authenticate.authenticateResponse();

            window.hashUpdate = function() {
                if (window.loginWindow.closed) {
                    window.clearInterval(intervalId);
                    scope.helpers.cookie.set('wbp_access_token_' +
                        scope.namespace, response.access_token,
                        response.expires_in);
                    scope.appQuery = scope.helpers.url.objToQuery({
                        access_token: response.access_token
                    });

                    if (scope.onReady !== null) {
                        scope.onReady();
                    }

                } else {
                    var url = window.loginWindow.document.URL;
                    var tabUrl = url.split('#');
                    var paramString = tabUrl[1];

                    if (typeof paramString !== 'undefined') {
                        var allParam = paramString.split("&");
                        for (var i = 0; i < allParam.length; i++) {
                            var oneParamKeyValue = allParam[i].split(
                                "=");
                            response[oneParamKeyValue[0]] =
                                oneParamKeyValue[1];
                        }


                        setTimeout(function() {
                            window.loginWindow.close();
                        }, 1500);
                    }
                }
            };

            window.loginWindow = window.open(oauthUrl,
                'Authenticate Permissions', false);
            intervalId = window.setInterval(window.hashUpdate, 500);

        } else {
            window.location.href = oauthUrl;
        }
    },

    authenticateResponse: function() {
        this.access_token = null;
        this.expires_in = null;
    }
};

    window.WBP = scope;
    }(window));
