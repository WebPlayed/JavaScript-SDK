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