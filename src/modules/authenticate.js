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
