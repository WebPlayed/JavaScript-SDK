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