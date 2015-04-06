WBP.prototype.components.navigation = {
	show: function() {
		wbpSource.postMessage('navigation.show', '*');
	},

	hide: function() {
		wbpSource.postMessage('navigation.hide', '*');
	}
};
