WBP.prototype.upload = function(path, method, files, callback){
    var formData = new FormData();
    var xmlhttp = new XMLHttpRequest();
    var counter;

    for (counter = 0; counter < files.length; counter++) {
        formData.append('files[]', files[counter]);
    }

    var access_token = scope.helpers.cookie.get('access_token_' + scope.namespace);

    xmlhttp.onload = function() {
        callback(xmlhttp.responseText);
    };

    xmlhttp.open(method, this.host + "api" + path + "?access_token=" +
    access_token);
    xmlhttp.send(formData);
};