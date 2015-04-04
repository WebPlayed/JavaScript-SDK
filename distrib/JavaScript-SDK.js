/*! JavaScript-SDK v1.0.0 - 2015-04-04 
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

//Scope
WBP.prototype.helpers = {};
WBP.prototype.modules = {};

//Initialize WBP
WBP.prototype.init = function(options) {
	this.asyncRequests = options.async;

};


//The namespace we are working in.
WBP.prototype.modules.authenticate = {};

    window.WBP = new WBP();
    }(window));
