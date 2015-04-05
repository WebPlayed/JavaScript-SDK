WBP.prototype.helpers.cookie = {
    get: function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    },

    set: function(name, value, milliseconds) {
        var expires = "";

        if (milliseconds) {
            expires = "; max-age=" + (milliseconds / 1000);
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }
};
