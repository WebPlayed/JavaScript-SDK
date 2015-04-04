function WBP() {} // This is needed so we can extend the object

//Properties
WBP.prototype.namespace = '';
WBP.prototype.apiKey = '';
WBP.prototype.host = 'https://webplayed.com/';
WBP.prototype.asyncRequests = true;

//Scope
WBP.prototype.helpers = {};
WBP.prototype.modules = {};

//Initialize WBP
WBP.prototype.init = function(options) {
	this.asyncRequests = options.async;

};
