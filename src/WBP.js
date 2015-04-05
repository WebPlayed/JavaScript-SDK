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
