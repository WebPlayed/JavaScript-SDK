WBP.prototype.helpers.url = {
	getHashValue: function(key) {
		return location.hash.match(new RegExp(key + '=([^&]*)'))[1];
	},

	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};
