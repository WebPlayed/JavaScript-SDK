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

