/**
 * Created by franklinwaller on 06/04/15.
 */
WBP.prototype.components.purchase = {
    makePurchase: function(itemId){
        window.location.href = scope.host + 'purchase/' + scope.namespace + '/' + itemId;
    }
};