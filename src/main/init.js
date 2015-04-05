//Initialize WBP
WBP.prototype.init = function(options) {
    this.asyncRequests = options.async;
    this.namespace = options.namespace;

    if (typeof options.ready !== 'undefined') {
        this.onReady = options.ready;
    }
};
